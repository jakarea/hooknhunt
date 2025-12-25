import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X, FolderOpen, Image as ImageIcon, Upload } from 'lucide-react';
import { MediaLibrary } from '@/components/media/MediaLibrary';

interface ImageSelectorProps {
  label: string;
  currentUrl?: string | null;
  onImageChange: (file: File | null, url: string | null, mediaId?: number | null) => void;
  onRemoveImage: () => void;
  disabled?: boolean;
  allowUpload?: boolean;
  accept?: string;
  maxSizeKB?: number;
  infoText?: string;
  className?: string;
}

export function ImageSelector({
  label,
  currentUrl,
  onImageChange,
  onRemoveImage,
  disabled = false,
  allowUpload = true,
  accept = 'image/*',
  maxSizeKB = 500,
  infoText,
  className = ''
}: ImageSelectorProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize preview from currentUrl
  useEffect(() => {
    if (currentUrl && !preview) {
      setPreview(currentUrl);
    }
  }, [currentUrl, preview]);

  // Load media files when dialog opens
  const handleOpenMediaDialog = () => {
    setShowMediaDialog(true);
  };

  // Handle selection from media library
  const handleMediaSelect = (files: any[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];

    // Set preview immediately for visual feedback
    setPreview(selectedFile.url);
    setError(null);

    // Create a placeholder File object for compatibility (no actual fetch needed)
    // The parent component can work with the URL directly
    const file = new File([''], selectedFile.original_filename || selectedFile.filename, {
      type: selectedFile.mime_type
    });

    // Pass the file, URL, and media ID to parent component
    onImageChange(file, selectedFile.url, selectedFile.id);

    // Close modal immediately
    setShowMediaDialog(false);
  };

  // Cancel selection
  const cancelSelection = () => {
    setShowMediaDialog(false);
  };

  // Validate image file
  const validateImageFile = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return false;
    }

    const maxSizeBytes = maxSizeKB * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Image size must be less than ${maxSizeKB}KB. Current size: ${(file.size / 1024).toFixed(2)}KB`);
      return false;
    }

    setError(null);
    return true;
  };

  // Handle file upload
  const handleFileChange = (file: File | null) => {
    if (file) {
      if (validateImageFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setPreview(result);
          onImageChange(file, result, null); // Pass null for media ID since this is uploaded file
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onRemoveImage();
    onImageChange(null, null);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

      {/* Info Section */}
      {infoText && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">{infoText}</p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-1">Error:</h4>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Existing Image Display */}
      {currentUrl && !preview && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Current Image</h4>
          <div className="flex items-center gap-4">
            <img
              src={currentUrl}
              alt={`${label} - current`}
              className="h-20 w-20 object-cover rounded-lg border-2 border-gray-200"
            />
            <div className="text-sm text-gray-600">
              <p className="font-medium">Existing image</p>
              <p className="text-xs text-gray-500 mt-1">Upload a new one to replace</p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="mt-2"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Upload/Selection Area */}
      <div
        className={`border-2 border-dashed rounded-lg transition-colors ${
          error
            ? 'border-red-300 bg-red-50 hover:bg-red-100'
            : preview
            ? 'border-green-300 bg-green-50'
            : dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {preview ? (
          <div className="relative group p-6">
            <div className="text-center">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-32 w-32 object-contain rounded-lg border-2 border-green-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2 p-6">
                {allowUpload && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
                    className="bg-white hover:bg-gray-100 text-gray-900"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    Change
                  </Button>
                )}
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleOpenMediaDialog}
                  disabled={disabled}
                  className="bg-white hover:bg-gray-100 text-gray-900"
                >
                  <FolderOpen className="h-4 w-4 mr-1" />
                  Select from Media
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleRemove}
                  disabled={disabled}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-green-800">Image Selected</p>
                <p className="text-xs text-gray-500 mt-1">
                  {allowUpload
                    ? 'Click "Change" to upload a new one or "Select from Media" to choose from library'
                    : 'Click "Select from Media" to choose a different image'
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`p-8 text-center ${
              allowUpload ? '' : 'cursor-default'
            }`}
            onDrop={allowUpload ? handleDrop : undefined}
            onDragOver={allowUpload ? handleDrag : undefined}
            onDragEnter={allowUpload ? handleDrag : undefined}
            onDragLeave={allowUpload ? handleDrag : undefined}
            onClick={() => {
              if (!disabled) {
                if (allowUpload) {
                  fileInputRef.current?.click();
                } else {
                  handleOpenMediaDialog();
                }
              }
            }}
          >
            <div className="flex flex-col items-center">
              <ImageIcon className={`h-10 w-10 mb-3 ${
                dragActive
                  ? 'text-blue-500 animate-bounce'
                  : error
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`} />
              <p className={`mb-2 text-sm ${
                dragActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
              }`}>
                {allowUpload ? (
                  dragActive ? (
                    <>Drop image here</>
                  ) : (
                    <>
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </>
                  )
                ) : (
                  <>Click to select image from media library</>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {allowUpload ? `Up to ${maxSizeKB}KB` : 'Browse your media library'}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 p-4 border-t border-gray-200">
          {allowUpload && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenMediaDialog}
            disabled={disabled}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Select from Media
          </Button>
        </div>

        {/* Hidden File Input */}
        {allowUpload && (
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleFileChange(file);
            }}
            disabled={disabled}
          />
        )}
      </div>

      {/* Media Selection Dialog */}
      <MediaLibrary
        open={showMediaDialog}
        onOpenChange={cancelSelection}
        onSelect={handleMediaSelect}
        multiple={false}
        maxSelections={1}
        acceptedTypes={['image/*']}
      />
    </div>
  );
}