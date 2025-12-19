import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  Video,
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '@/lib/api';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface MediaUploadProps {
  onUploadComplete?: (files: { url: string; file: File }[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

export function MediaUpload({
  onUploadComplete,
  accept = 'image/*,video/*,.pdf,.doc,.docx',
  multiple = true,
  maxFiles = 10,
  maxSize = 10,
  className = '',
}: MediaUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending' as const,
    }));

    // Check file count limit
    if (multiple && uploadFiles.length + newFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} files at once`,
        variant: "destructive",
      });
      return;
    }

    // Check file sizes
    const oversizedFiles = newFiles.filter(f => f.file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    if (multiple) {
      setUploadFiles(prev => [...prev, ...newFiles]);
    } else {
      setUploadFiles(newFiles);
    }
  }, [multiple, maxFiles, maxSize, uploadFiles.length]);

  // Upload files
  const uploadFilesToServer = async () => {
    if (uploadFiles.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = uploadFiles.map(async (uploadFile) => {
        const formData = new FormData();
        formData.append('file', uploadFile.file);

        try {
          const response = await api.post('/admin/media', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadFiles(prev =>
                  prev.map(f =>
                    f.id === uploadFile.id
                      ? { ...f, progress, status: 'uploading' }
                      : f
                  )
                );
              }
            },
          });

          setUploadFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, status: 'success', url: response.data.media_file.url }
                : f
            )
          );

          return { url: response.data.media_file.url, file: uploadFile.file };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Upload failed';
          setUploadFiles(prev =>
            prev.map(f =>
              f.id === uploadFile.id
                ? { ...f, status: 'error', error: errorMessage }
                : f
            )
          );
          throw error;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const successfulUploads = results
        .filter((result): result is PromiseFulfilledResult<{ url: string; file: File }> =>
          result.status === 'fulfilled'
        )
        .map(result => result.value);

      if (successfulUploads.length > 0) {
        toast({
          title: "Upload successful",
          description: `${successfulUploads.length} file${successfulUploads.length !== 1 ? 's' : ''} uploaded successfully`,
        });
        onUploadComplete?.(successfulUploads);
        // Clear the upload queue after successful uploads
        setUploadFiles([]);
      }

      const failedUploads = results.filter(result => result.status === 'rejected').length;
      if (failedUploads > 0) {
        toast({
          title: "Some uploads failed",
          description: `${failedUploads} file${failedUploads !== 1 ? 's' : ''} failed to upload`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove file from queue
  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  // Clear all files
  const clearFiles = () => {
    setUploadFiles([]);
  };

  // Get file icon
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
    if (file.type.startsWith('video/')) return <Video className="h-8 w-8" />;
    if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) {
      return <FileText className="h-8 w-8" />;
    }
    return <File className="h-8 w-8" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground">
              {multiple ? `Up to ${maxFiles} files` : 'Single file'} • Max {maxSize}MB each
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: {accept.replace(/,/g, ', ').replace(/\*/g, ' files')}
            </p>
          </div>
          <input
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="media-upload-input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('media-upload-input')?.click()}
          >
            Browse Files
          </Button>
        </CardContent>
      </Card>

      {/* File Queue */}
      {uploadFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">
                Upload Queue ({uploadFiles.length} file{uploadFiles.length !== 1 ? 's' : ''})
              </h3>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearFiles}
                  disabled={isUploading}
                >
                  Clear All
                </Button>
                <Button
                  type="button"
                  onClick={uploadFilesToServer}
                  disabled={isUploading || uploadFiles.every(f => f.status !== 'pending')}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Files'
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {uploadFiles.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(uploadFile.file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uploadFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadFile.file.size)} • {uploadFile.file.type}
                    </p>
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="mt-2 h-1" />
                    )}
                    {uploadFile.status === 'error' && (
                      <p className="text-sm text-destructive mt-1">
                        {uploadFile.error}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadFile.status === 'success' && (
                      <div className="text-green-600">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {uploadFile.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                    {uploadFile.status === 'uploading' && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {!isUploading && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(uploadFile.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}