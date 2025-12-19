<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use App\Models\MediaFolder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class MediaController extends Controller
{
    /**
     * Display a listing of media files.
     */
    public function index(Request $request): JsonResponse
    {
        $query = MediaFile::with(['folder', 'uploader'])
            ->latest();

        // Filter by folder
        if ($request->has('folder_id')) {
            $query->where('folder_id', $request->folder_id);
        }

        // Filter by search term
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('filename', 'LIKE', "%{$search}%")
                  ->orWhere('original_filename', 'LIKE', "%{$search}%")
                  ->orWhere('alt_text', 'LIKE', "%{$search}%");
            });
        }

        // Filter by mime type
        if ($request->has('mime_type')) {
            $query->where('mime_type', 'LIKE', $request->mime_type . '%');
        }

        $mediaFiles = $query->paginate(24);

        return response()->json($mediaFiles);
    }

    /**
     * Store a newly uploaded media file.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'folder_id' => 'nullable|exists:media_folders,id',
            'alt_text' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        try {
            $file = $validated['file'];
            $originalFilename = $file->getClientOriginalName();
            $filename = MediaFile::generateUniqueFilename($originalFilename);
            $mimeType = $file->getMimeType();
            $extension = $file->getClientOriginalExtension();
            $sizeBytes = $file->getSize();

            // Generate hash for deduplication
            $hash = hash_file('sha256', $file->getPathname());

            // Check for duplicate files
            $existingMedia = MediaFile::where('hash', $hash)->first();
            if ($existingMedia) {
                return response()->json([
                    'message' => 'File already exists',
                    'media_file' => $existingMedia->load(['folder', 'uploader']),
                    'duplicate' => true
                ], 200);
            }

            // Determine storage path based on date and mime type
            $storagePath = $this->generateStoragePath($mimeType);
            $fullPath = $storagePath . '/' . $filename;

            // Store the file
            $storedPath = $file->storeAs($storagePath, $filename, 'public');

            // Process image variants
            $variants = [];
            if (str_starts_with($mimeType, 'image/')) {
                $variants = $this->generateImageVariants($storedPath, $storagePath);
            }

            // Get image dimensions for images
            $width = null;
            $height = null;
            if (str_starts_with($mimeType, 'image/')) {
                try {
                    $imageInfo = getimagesize(storage_path('app/public/' . $storedPath));
                    if ($imageInfo) {
                        $width = $imageInfo[0];
                        $height = $imageInfo[1];
                    }
                } catch (\Exception $e) {
                    // Log error but continue without dimensions
                }
            }

            // Create media file record
            $mediaFile = MediaFile::create([
                'filename' => $filename,
                'original_filename' => $originalFilename,
                'mime_type' => $mimeType,
                'extension' => $extension,
                'size_bytes' => $sizeBytes,
                'width' => $width,
                'height' => $height,
                'alt_text' => $validated['alt_text'] ?? null,
                'title' => $validated['title'] ?? null,
                'description' => $validated['description'] ?? null,
                'disk' => 'public',
                'path' => $storedPath,
                'url' => Storage::disk('public')->url($storedPath),
                'variants' => $variants,
                'hash' => $hash,
                'folder_id' => $validated['folder_id'] ?? null,
                'uploaded_by_user_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'File uploaded successfully',
                'media_file' => $mediaFile->load(['folder', 'uploader'])
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified media file.
     */
    public function show(MediaFile $mediaFile): JsonResponse
    {
        $mediaFile->load(['folder', 'uploader']);
        return response()->json($mediaFile);
    }

    /**
     * Update the specified media file metadata.
     */
    public function update(Request $request, MediaFile $mediaFile): JsonResponse
    {
        $validated = $request->validate([
            'filename' => 'nullable|string|max:255',
            'alt_text' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'folder_id' => 'nullable|exists:media_folders,id',
        ]);

        $mediaFile->update($validated);

        return response()->json([
            'message' => 'Media file updated successfully',
            'media_file' => $mediaFile->load(['folder', 'uploader'])
        ]);
    }

    /**
     * Remove the specified media file.
     */
    public function destroy(MediaFile $mediaFile): JsonResponse
    {
        try {
            // Delete the actual file from storage
            Storage::disk($mediaFile->disk)->delete($mediaFile->path);

            // Delete variants
            if ($mediaFile->variants) {
                foreach ($mediaFile->variants as $variant) {
                    $variantPath = str_replace(Storage::disk($mediaFile->disk)->url(''), '', $variant);
                    Storage::disk($mediaFile->disk)->delete($variantPath);
                }
            }

            // Delete the database record
            $mediaFile->delete();

            return response()->json([
                'message' => 'Media file deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Delete failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get folders structure.
     */
    public function folders(): JsonResponse
    {
        $folders = MediaFolder::with('parent')
            ->withCount('mediaFiles')
            ->orderBy('name')
            ->get();

        // Build tree structure
        $tree = $this->buildFolderTree($folders->where('parent_id', null), $folders);

        return response()->json([
            'folders' => $tree,
            'flat' => $folders
        ]);
    }

    /**
     * Create a new folder.
     */
    public function storeFolder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'parent_id' => 'nullable|exists:media_folders,id',
            'is_public' => 'boolean',
            'allowed_roles' => 'nullable|array',
        ]);

        $folder = MediaFolder::create($validated);

        return response()->json([
            'message' => 'Folder created successfully',
            'folder' => $folder->load('parent')
        ], 201);
    }

    /**
     * Generate storage path based on mime type and date.
     */
    private function generateStoragePath(string $mimeType): string
    {
        $date = now()->format('Y/m');

        if (str_starts_with($mimeType, 'image/')) {
            return "media/images/{$date}";
        } elseif (str_starts_with($mimeType, 'video/')) {
            return "media/videos/{$date}";
        } elseif (str_starts_with($mimeType, 'audio/')) {
            return "media/audio/{$date}";
        } else {
            return "media/documents/{$date}";
        }
    }

    /**
     * Generate image variants (thumbnail, medium, large).
     */
    private function generateImageVariants(string $storedPath, string $storagePath): array
    {
        $variants = [];
        $fullPath = storage_path('app/public/' . $storedPath);

        // Initialize ImageManager with GD driver
        $manager = new ImageManager(new Driver());

        try {
            // Thumbnail (150x150)
            $thumbnail = $manager->read($fullPath)
                ->cover(150, 150)
                ->toJpeg(80);
            $thumbnailPath = $storagePath . '/thumb_' . pathinfo($storedPath, PATHINFO_FILENAME) . '.jpg';
            Storage::disk('public')->put($thumbnailPath, $thumbnail);
            $variants['thumbnail'] = Storage::disk('public')->url($thumbnailPath);

            // Medium (max width 800px)
            $medium = $manager->read($fullPath)
                ->scale(800, 800)
                ->toJpeg(85);
            $mediumPath = $storagePath . '/medium_' . pathinfo($storedPath, PATHINFO_FILENAME) . '.jpg';
            Storage::disk('public')->put($mediumPath, $medium);
            $variants['medium'] = Storage::disk('public')->url($mediumPath);

        } catch (\Exception $e) {
            // Log error but continue without variants
            \Log::error('Failed to generate image variants: ' . $e->getMessage());
        }

        return $variants;
    }

    /**
     * Build hierarchical folder tree.
     */
    private function buildFolderTree($roots, $allFolders): array
    {
        $tree = [];

        foreach ($roots as $folder) {
            $children = $allFolders->where('parent_id', $folder->id);
            $folderData = [
                'id' => $folder->id,
                'name' => $folder->name,
                'slug' => $folder->slug,
                'description' => $folder->description,
                'media_files_count' => $folder->media_files_count,
                'children' => $this->buildFolderTree($children, $allFolders)
            ];
            $tree[] = $folderData;
        }

        return $tree;
    }
}
