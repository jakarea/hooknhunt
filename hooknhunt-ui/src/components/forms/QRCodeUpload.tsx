import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { SupplierImage } from '@/components/SupplierImage';

interface QRCodeUploadProps {
  label: string;
  currentUrl?: string | null;
  onFileChange: (file: File | null) => void;
  onRemoveImage: () => void;
  disabled?: boolean;
}

export function QRCodeUpload({
  label,
  currentUrl,
  onFileChange,
  onRemoveImage,
  disabled = false
}: QRCodeUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImageFile = (file: File): boolean => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, GIF)');
      return false;
    }

    // Validate file size (100KB = 100 * 1024 bytes)
    const maxSizeKB = 100;
    const maxSizeBytes = maxSizeKB * 1024;

    if (file.size > maxSizeBytes) {
      setError(`QR code size must be less than ${maxSizeKB}KB. Current size: ${(file.size / 1024).toFixed(2)}KB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      if (validateImageFile(file)) {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        onFileChange(file);
      }
    } else {
      setPreview(null);
      setError(null);
      onFileChange(null);
    }
  };

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
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemoveImage();
    onFileChange(null);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

      {/* QR Code Requirements Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">QR Code Requirements:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Maximum file size: <span className="font-semibold">100KB</span></li>
          <li>• Recommended dimensions: <span className="font-semibold">200x200px</span> (square)</li>
          <li>• Supported formats: <span className="font-semibold">PNG, JPG, JPEG, GIF</span></li>
          <li>• Optimal quality: <span className="font-semibold">High contrast, clear scannable</span></li>
        </ul>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-1">Upload Error:</h4>
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Existing Image Display */}
      {currentUrl && !preview && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Current QR Code</h4>
          <div className="flex items-center gap-4">
            <SupplierImage
              src={currentUrl}
              alt={`${label} - current`}
              size="lg"
              className="border-2 border-gray-200"
            />
            <div className="text-sm text-gray-600">
              <p className="font-medium">Existing QR code</p>
              <p className="text-xs text-gray-500 mt-1">
                Upload a new one to replace
              </p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="mt-2"
              >
                <X className="h-4 w-4 mr-1" />
                Remove QR Code
              </Button>
            </div>
          </div>
        </div>
      )}

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
          <div className="relative group">
            <div className="p-4">
              <img
                src={preview}
                alt="QR Code Preview"
                className="mx-auto h-32 w-32 object-contain rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
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
              <div className="text-center mt-2">
                <p className="text-sm font-medium text-green-800">New QR Code Ready</p>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="p-8 text-center"
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onClick={() => !disabled && fileInputRef.current?.click()}
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
                {dragActive ? (
                  <>Drop your QR code here</>
                ) : (
                  <>
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG, GIF up to 100KB</p>
            </div>
          </div>
        )}

        <Input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleFileChange(file);
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
}