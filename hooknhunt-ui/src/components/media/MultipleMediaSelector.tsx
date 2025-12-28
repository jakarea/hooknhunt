import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Image as ImageIcon, Video, FileText, Check, Loader2, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

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
  created_at: string;
}

interface MultipleMediaSelectorProps {
  onSelect: (files: MediaFile[]) => void;
  selectedUrls?: string[];
  accept?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function MultipleMediaSelector({
  onSelect,
  selectedUrls = [],
  accept = 'image/*',
  buttonText = 'Select Gallery Images',
  buttonVariant = 'outline',
  buttonSize = 'default',
  className = '',
}: MultipleMediaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch files when dialog opens
  const fetchFiles = async (search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: '1', per_page: '50' });
      if (search) params.append('search', search);
      if (accept && accept !== 'image/*') params.append('mime_type', accept);

      const response = await api.get(`/admin/media?${params}`);
      const mediaFiles = response.data.data || response.data;
      setFiles(Array.isArray(mediaFiles) ? mediaFiles : []);
    } catch (error: any) {
      console.error('Failed to fetch media files:', error);
      toast({
        title: "Media Library Error",
        description: "Failed to load media files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchFiles();
      // Pre-select files based on selectedUrls
      // This will be updated once files are loaded
    }
  }, [open]);

  // Handle search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (open) {
        fetchFiles(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, open]);

  // Handle file selection (toggle)
  const handleFileToggle = (file: MediaFile) => {
    setSelectedFiles(prev => {
      const exists = prev.find(f => f.id === file.id);
      if (exists) {
        return prev.filter(f => f.id !== file.id);
      } else {
        return [...prev, file];
      }
    });
  };

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedFiles.length > 0) {
      onSelect(selectedFiles);
      setOpen(false);
      setSelectedFiles([]);
    }
  };

  // Remove selected file
  const handleRemoveFile = (fileId: number) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Filter files based on accept prop
  const filteredFiles = files.filter(file => {
    if (accept === 'image/*') {
      return file.mime_type.startsWith('image/');
    }
    if (accept === 'video/*') {
      return file.mime_type.startsWith('video/');
    }
    return file.mime_type === accept;
  });

  // Get file icon
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
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={className}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          {buttonText}
          {selectedFiles.length > 0 && ` (${selectedFiles.length})`}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Select Gallery Images</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[75vh]">
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

            <div className="flex items-center gap-3">
              {selectedFiles.length > 0 && (
                <>
                  <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Add Selected ({selectedFiles.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFiles([])}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </>
              )}
              {selectedFiles.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Click images to select multiple
                </div>
              )}
            </div>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="p-3 border-b bg-muted/30">
              <div className="text-sm font-medium mb-2">Selected Images ({selectedFiles.length}):</div>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map(file => (
                  <div
                    key={file.id}
                    className="relative group inline-block"
                  >
                    <img
                      src={file.thumbnail_url || file.url}
                      alt={file.original_filename}
                      className="h-16 w-16 object-cover rounded border-2 border-primary"
                    />
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Grid */}
          <ScrollArea className="flex-1 p-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="ml-2 text-muted-foreground">Loading media files...</p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No media files found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search' : 'No media files available'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFiles.some(f => f.id === file.id);
                  return (
                    <Card
                      key={file.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected
                          ? 'ring-2 ring-primary border-primary'
                          : 'border-border'
                      }`}
                      onClick={() => handleFileToggle(file)}
                    >
                      <CardContent className="p-2 relative">
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
                        <p className="text-xs font-medium truncate" title={file.original_filename}>
                          {file.original_filename}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size_bytes)}</p>

                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
