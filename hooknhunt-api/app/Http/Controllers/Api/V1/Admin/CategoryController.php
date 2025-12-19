<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Category::with('parent')->paginate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories',
            'slug' => 'required|string|max:255|unique:categories',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|file|image|max:15360', // 15KB max - for direct upload
            'media_file_id' => 'nullable|exists:media_files,id', // for media library selection
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['image', 'media_file_id']);

        // Handle image upload or media library selection
        if ($request->hasFile('image')) {
            // Direct file upload - add to media library first
            $image = $request->file('image');
            $originalFilename = $image->getClientOriginalName();
            $filename = MediaFile::generateUniqueFilename($originalFilename);
            $mimeType = $image->getMimeType();
            $extension = $image->getClientOriginalExtension();
            $sizeBytes = $image->getSize();

            // Generate hash for deduplication
            $hash = hash_file('sha256', $image->getPathname());

            // Check for duplicate files
            $existingMedia = MediaFile::where('hash', $hash)->first();
            if ($existingMedia) {
                $data['image_url'] = $existingMedia->path;
                // Record usage in media file
                $existingMedia->recordUsage('category', 0); // Will be updated with actual category ID after creation
                $mediaFile = $existingMedia;
            } else {
                // Store the file
                $storedPath = $image->store('media/images/categories', 'public');
                $data['image_url'] = $storedPath;

                // Create media file record
                $mediaFile = MediaFile::create([
                    'filename' => $filename,
                    'original_filename' => $originalFilename,
                    'mime_type' => $mimeType,
                    'extension' => $extension,
                    'size_bytes' => $sizeBytes,
                    'disk' => 'public',
                    'path' => $storedPath,
                    'url' => Storage::disk('public')->url($storedPath),
                    'hash' => $hash,
                    'uploaded_by_user_id' => auth()->id(),
                ]);

                // Record usage in media file
                $mediaFile->recordUsage('category', 0); // Will be updated with actual category ID after creation
            }
        } elseif ($request->has('media_file_id')) {
            // Media library selection
            $mediaFile = MediaFile::find($request->media_file_id);
            if ($mediaFile) {
                $data['image_url'] = $mediaFile->path;
                // Record usage in media file
                $mediaFile->recordUsage('category', 0); // Will be updated with actual category ID after creation
            }
        }

        $category = Category::create($data);

        // Update media file usage with actual category ID
        if (isset($mediaFile) && $category) {
            $mediaFile->recordUsage('category', $category->id);
        }

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return $category;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('categories')->ignore($category->id)],
            'slug' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('categories')->ignore($category->id)],
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|file|image|max:15360', // 15KB max - for direct upload
            'media_file_id' => 'nullable|exists:media_files,id', // for media library selection
            'remove_image' => 'nullable|boolean', // for removing current image
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['image', 'media_file_id', 'remove_image']);

        // Handle image removal
        if ($request->boolean('remove_image')) {
            if ($category->image_url) {
                // Remove old usage tracking
                $this->removeOldMediaUsage($category->id);
                Storage::delete($category->image_url);
            }
            $data['image_url'] = null;
        } else {
            // Handle image upload or media library selection
            if ($request->hasFile('image')) {
                // Direct file upload - add to media library first
                if ($category->image_url) {
                    $this->removeOldMediaUsage($category->id);
                }

                $image = $request->file('image');
                $originalFilename = $image->getClientOriginalName();
                $filename = MediaFile::generateUniqueFilename($originalFilename);
                $mimeType = $image->getMimeType();
                $extension = $image->getClientOriginalExtension();
                $sizeBytes = $image->getSize();

                // Generate hash for deduplication
                $hash = hash_file('sha256', $image->getPathname());

                // Check for duplicate files
                $existingMedia = MediaFile::where('hash', $hash)->first();
                if ($existingMedia) {
                    $data['image_url'] = $existingMedia->path;
                    $existingMedia->recordUsage('category', $category->id);
                } else {
                    // Store the file
                    $storedPath = $image->store('media/images/categories', 'public');
                    $data['image_url'] = $storedPath;

                    // Create media file record
                    $mediaFile = MediaFile::create([
                        'filename' => $filename,
                        'original_filename' => $originalFilename,
                        'mime_type' => $mimeType,
                        'extension' => $extension,
                        'size_bytes' => $sizeBytes,
                        'disk' => 'public',
                        'path' => $storedPath,
                        'url' => Storage::disk('public')->url($storedPath),
                        'hash' => $hash,
                        'uploaded_by_user_id' => auth()->id(),
                    ]);

                    $mediaFile->recordUsage('category', $category->id);
                }
            } elseif ($request->has('media_file_id')) {
                // Media library selection
                $mediaFile = MediaFile::find($request->media_file_id);
                if ($mediaFile) {
                    $this->removeOldMediaUsage($category->id);
                    $data['image_url'] = $mediaFile->path;
                    $mediaFile->recordUsage('category', $category->id);
                }
            }
        }

        $category->update($data);

        return response()->json($category);
    }

    /**
     * Remove old media usage for a category
     */
    private function removeOldMediaUsage($categoryId)
    {
        // Find any media files used by this category and remove usage
        $oldMediaFiles = MediaFile::whereJsonContains('usage_models', "category:{$categoryId}")->get();
        foreach ($oldMediaFiles as $mediaFile) {
            $mediaFile->removeUsage('category', $categoryId);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(null, 204);
    }
}