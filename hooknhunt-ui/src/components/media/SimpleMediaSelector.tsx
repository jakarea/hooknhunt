import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Image as ImageIcon, Video, FileText, Check, Loader2 } from 'lucide-react';
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

interface SimpleMediaSelectorProps {
  onSelect: (file: MediaFile) => void;
  selectedFileId?: number | null;
  accept?: string;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function SimpleMediaSelector({
  onSelect,
  selectedFileId = null,
  accept = 'image/*',
  buttonText = 'Select from Media Library',
  buttonVariant = 'outline',
  buttonSize = 'default',
  className = '',
}: SimpleMediaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch files when dialog opens
  const fetchFiles = async (search = '') => {
    setLoading(true);
    try {
      console.log('🖼️ SimpleMediaSelector: Fetching files...');

      const params = new URLSearchParams({ page: '1', per_page: '50' });
      if (search) params.append('search', search);
      if (accept && accept !== 'image/*') params.append('mime_type', accept);

      const response = await api.get(`/admin/media?${params}`);
      console.log('📡 SimpleMediaSelector: API Response:', response);
      console.log('📋 SimpleMediaSelector: Response data:', response.data);

      const mediaFiles = response.data.data || response.data;
      console.log('🗂️ SimpleMediaSelector: Media files:', mediaFiles);

      setFiles(Array.isArray(mediaFiles) ? mediaFiles : []);
    } catch (error: any) {
      console.error('❌ SimpleMediaSelector: Failed to fetch media files:', error);

      // Show more detailed error information
      let errorMessage = 'Failed to load media files';
      if (error.response?.status === 401) {
        errorMessage = 'You are not logged in. Please log in again to access media files.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to access media files.';
      } else if (error.response?.data?.message) {
        errorMessage = `Failed to load media files: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `Network error: ${error.message}`;
      }

      toast({
        title: "Media Library Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchFiles();
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

  // Handle file selection
  const handleFileSelect = (file: MediaFile) => {
    console.log('SimpleMediaSelector: Selected file', file);
    setSelectedFile(file);
  };

  // Handle confirm selection
  const handleConfirm = () => {
    if (selectedFile) {
      console.log('✅ SimpleMediaSelector: Confirming selection', selectedFile);
      console.log('🔄 SimpleMediaSelector: Calling onSelect callback with:', selectedFile);
      onSelect(selectedFile);
      setOpen(false);
      setSelectedFile(null);
    } else {
      console.log('⚠️ SimpleMediaSelector: No file selected for confirmation');
    }
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

  console.log('SimpleMediaSelector render:', {
    open,
    filesCount: filteredFiles.length,
    selectedFileId: selectedFile?.id,
    loading
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={`${className} min-w-[200px]`}
          style={{ visibility: 'visible', display: 'block' }}
          data-media-selector-trigger="true"
        >
          🖼️ {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Select Media File</DialogTitle>
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

            <div className="flex items-center space-x-3">
              {selectedFile && (
                <>
                  <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4 mr-2" />
                    Select This Image
                  </Button>
                  <div className="text-sm text-gray-600">
                    Selected: {selectedFile.original_filename}
                  </div>
                </>
              )}
              {!selectedFile && (
                <div className="text-sm text-gray-500 italic">
                  Click on an image below to select it
                </div>
              )}
            </div>
          </div>

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
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Try adjusting your search' : 'No media files available'}
                </p>
                {!localStorage.getItem('token') && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                    <p>🔒 You need to be logged in to access media files.</p>
                    <p>Please log in and try again.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                      <p className="text-xs font-medium truncate">{file.original_filename}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size_bytes)}</p>

                      {/* Selection indicator */}
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

          {/* Debug info */}
          <div className="p-2 border-t text-xs text-gray-500">
            Debug: {filteredFiles.length} files loaded | Selected: {selectedFile?.original_filename || 'None'}<br/>
            Auth Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}<br/>
            API URL: /admin/media | Server: {api.defaults.baseURL}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}