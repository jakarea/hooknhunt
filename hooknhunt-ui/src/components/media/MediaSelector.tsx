import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Image as ImageIcon,
  Video,
  FileText,
  FolderOpen,
  Grid3X3,
  List,
  Upload,
  Check,
  Loader2
} from 'lucide-react';
import { useMediaStore } from '@/stores/mediaStore';
import { MediaUpload } from './MediaUpload';

interface MediaFile {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  url: string;
  thumbnail_url?: string;
  folder?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface MediaSelectorProps {
  onSelect: (file: MediaFile) => void;
  selectedFileId?: number | null;
  accept?: string; // MIME type filter, e.g., 'image/*'
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function MediaSelector({
  onSelect,
  selectedFileId = null,
  accept = 'image/*',
  buttonText = 'Select from Media Library',
  buttonVariant = 'outline',
  buttonSize = 'default',
  className = '',
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    files,
    folders,
    loading,
    fetchFiles,
    fetchFolders,
    setSelectedType,
    setViewMode,
  } = useMediaStore();

  // Fetch files and folders when dialog opens
  useEffect(() => {
    if (open) {
      fetchFiles({ search: '' });
      fetchFolders();
      // Set the default MIME type filter only if specific type is requested
      if (accept !== 'image/*') {
        setSelectedType(accept.replace('*', ''));
      }
    }
  }, [open, fetchFiles, fetchFolders, setSelectedType, accept]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (open) {
        fetchFiles({ search: searchQuery });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, open, fetchFiles]);

  // Handle file selection
  const handleFileSelect = (file: MediaFile) => {
    console.log('File selected:', file);
    setSelectedFile(file);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedFile) {
      onSelect(selectedFile);
      setOpen(false);
      setSelectedFile(null);
    }
  };

  // Handle upload complete
  const handleUploadComplete = (uploadedFiles: { url: string; file: File }[]) => {
    setShowUpload(false);
    fetchFiles({ page: 1 });
  };

  // Filter files based on accept prop
  const filteredFiles = files.filter(file => {
    // For image/*, show all images
    if (accept === 'image/*') {
      return file.mime_type.startsWith('image/');
    }
    // For video/*, show all videos
    if (accept === 'video/*') {
      return file.mime_type.startsWith('video/');
    }
    // For specific MIME types with wildcard like 'application/pdf'
    if (accept.includes('*')) {
      const baseType = accept.replace('*', '');
      return file.mime_type.startsWith(baseType);
    }
    // For exact MIME type match
    return file.mime_type === accept;
  });

  // Debug: log filtering results
  console.log('MediaSelector Debug:', {
    accept,
    totalFiles: files.length,
    filteredFiles: filteredFiles.length,
    files: files.slice(0, 3).map(f => ({ id: f.id, filename: f.filename, mime_type: f.mime_type }))
  });

  // Get file icon based on MIME type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
    if (mimeType.startsWith('video/')) return <Video className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize} className={className}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[70vh]">
          {/* Toolbar */}
          <div className="flex items-center gap-3 p-4 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Dialog open={showUpload} onOpenChange={setShowUpload}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Upload Media Files</DialogTitle>
                </DialogHeader>
                <MediaUpload
                  onUploadComplete={handleUploadComplete}
                  accept={accept}
                  multiple={true}
                  maxFiles={20}
                  maxSize={10}
                />
              </DialogContent>
            </Dialog>

            {selectedFile && (
              <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Select This Image
              </Button>
            )}
          </div>

          {/* Media Grid */}
          <ScrollArea className="flex-1 p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No media files found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? 'Try adjusting your search' : 'Upload your first media file to get started'}
                </p>
                <Button onClick={() => setShowUpload(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredFiles.map((file) => (
                  <Card
                    key={file.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedFile?.id === file.id
                        ? 'ring-2 ring-primary border-primary'
                        : 'border-border'
                    } ${
                      file.id === selectedFileId ? 'ring-2 ring-blue-500 border-blue-500' : ''
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-square mb-2">
                        {file.mime_type.startsWith('image/') ? (
                          <img
                            src={file.thumbnail_url || file.url}
                            alt={file.original_filename}
                            className="w-full h-full object-cover rounded"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted rounded">
                            {getFileIcon(file.mime_type)}
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium truncate">{file.original_filename}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size_bytes)}</p>
                      {selectedFile?.id === file.id && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}