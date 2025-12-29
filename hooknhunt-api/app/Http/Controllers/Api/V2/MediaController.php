<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MediaFile;
use App\Models\MediaFolder;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Media\UploadFileRequest; // Import Request
use Illuminate\Support\Str;

class MediaController extends Controller
{
    use ApiResponse;

    /**
     * 1. Get Folders
     */
    public function getFolders()
    {
        $folders = MediaFolder::withCount('files')->get();
        return $this->sendSuccess($folders);
    }

    /**
     * 2. Create New Folder
     */
    public function createFolder(Request $request)
    {
        $request->validate(['name' => 'required|string|max:50']);

        $folder = MediaFolder::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . time(),
            'parent_id' => $request->parent_id ?? null
        ]);

        return $this->sendSuccess($folder, 'Folder created successfully');
    }

    /**
     * 3. Get Files (With Filter & Pagination)
     */
    public function getFiles(Request $request)
    {
        $query = MediaFile::latest();

        // Filter by Folder
        if ($request->folder_id) {
            $query->where('folder_id', $request->folder_id);
        }

        // Filter by Type (image, pdf)
        if ($request->type) {
            $query->where('mime_type', 'like', '%' . $request->type . '%');
        }

        $files = $query->paginate(20);
        return $this->sendSuccess($files);
    }

    /**
     * 4. Upload File (The Main Logic)
     */

    public function upload(UploadFileRequest $request)
    {
        $uploadedFiles = [];
        $files = $request->file('files'); // Get Array of files

        // যদি কেউ ভুল করে Single 'file' পাঠায়, সেটাকেও অ্যারে বানিয়ে নেব
        if ($request->hasFile('file')) {
            $files = [$request->file('file')];
        }

        try {
            foreach ($files as $file) {
                // 1. Generate Unique Name
                $originalName = $file->getClientOriginalName();
                $filename = time() . '_' . uniqid() . '_' . preg_replace('/\s+/', '-', $originalName);
                
                // 2. Store File
                $path = $file->storeAs('uploads', $filename, 'public');
                
                // 3. Get Image Dimensions (Optional, only if it's an image)
                $width = null; 
                $height = null;
                if (str_starts_with($file->getClientMimeType(), 'image/')) {
                    $dimensions = @getimagesize($file->getRealPath());
                    $width = $dimensions[0] ?? null;
                    $height = $dimensions[1] ?? null;
                }

                // 4. Create DB Record
                $media = MediaFile::create([
                    'folder_id' => $request->folder_id,
                    'filename' => $filename,
                    'original_filename' => $originalName,
                    'path' => $path,
                    'url' => asset('storage/' . $path),
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'disk' => 'public',
                    'uploaded_by_user_id' => auth()->id() ?? null,
                    'width' => $width,
                    'height' => $height,
                ]);

                $uploadedFiles[] = $media;
            }

            return $this->sendSuccess($uploadedFiles, count($uploadedFiles) . ' files uploaded successfully', 201);

        } catch (\Exception $e) {
            return $this->sendError('Upload failed', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * 5. Bulk Delete
     */
    public function bulkDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array']);

        $files = MediaFile::whereIn('id', $request->ids)->get();

        foreach ($files as $file) {
            // Delete from storage
            if (Storage::disk('public')->exists($file->path)) {
                Storage::disk('public')->delete($file->path);
            }
            // Delete from DB
            $file->delete();
        }

        return $this->sendSuccess(null, 'Selected files deleted successfully');
    }
}