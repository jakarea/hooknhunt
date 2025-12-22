import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiClient from '@/lib/apiClient';
import {
  Search,
  Image as ImageIcon,
  Video,
  FileText,
  FolderOpen,
  Grid3X3,
  List,
  Filter,
  X,
  Check,
  Loader2,
  Upload
} from 'lucide-react';
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
  folder?: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface MediaFolder {
  id: number;
  name: string;
  slug: string;
  media_files_count: number;
}

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (files: MediaFile[]) => void;
  multiple?: boolean;
  acceptedTypes?: string[];
  maxSelections?: number;
}

export function MediaLibrary({
  open,
  onOpenChange,
  onSelect,
  multiple = false,
  acceptedTypes = ['image/*'],
  maxSelections = 10,
}: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pagination, setPagination] = useState({
    page: 1,
    lastPage: 1,
    total: 0,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);

  // Fetch media files
  const fetchFiles = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '24',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (selectedFolder !== 'all') params.append('folder_id', selectedFolder);
      if (selectedType !== 'all') params.append('mime_type', selectedType);

      const response = await apiClient.get(`/admin/media?${params}`);
      setFiles(response.data.data || response.data);
      setPagination({
        page: response.data.current_page || 1,
        lastPage: response.data.last_page || 1,
        total: response.data.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch media files:', error);
      toast({
        title: "Error",
        description: "Failed to load media files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch folders
  const fetchFolders = async () => {
    try {
      const response = await apiClient.get('/admin/media/folders');
      setFolders(response.data.flat || []);
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchFiles();
      fetchFolders();
    }
  }, [open, searchTerm, selectedFolder, selectedType]);

  // Handle file selection
  const toggleFileSelection = (file: MediaFile) => {
    if (!multiple) {
      setSelectedFiles([file]);
      return;
    }

    const isSelected = selectedFiles.some(f => f.id === file.id);

    if (isSelected) {
      setSelectedFiles(prev => prev.filter(f => f.id !== file.id));
    } else if (selectedFiles.length < maxSelections) {
      setSelectedFiles(prev => [...prev, file]);
    } else {
      toast({
        title: "Maximum selections reached",
        description: `You can only select up to ${maxSelections} files`,
        variant: "destructive",
      });
    }
  };

  
  // Filter files by accepted types
  const filteredFiles = files.filter(file => {
    if (acceptedTypes.length === 0) return true;

    return acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.mime_type.startsWith(type.slice(0, -1));
      }
      return file.mime_type === type;
    });
  });

  // Get file icon based on MIME type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (mimeType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
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

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    const filesArray = Array.from(files);

    try {
      for (const file of filesArray) {
        const formData = new FormData();
        formData.append('file', file);

        // Add optional metadata
        if (selectedFolder !== 'all') {
          formData.append('folder_id', selectedFolder);
        }

        const response = await apiClient.post('/admin/media', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Add new file to the list
        setFiles(prev => [response.data.media_file, ...prev]);
      }

      // Refresh files list
      fetchFiles();
    } catch (error) {
      console.error('Upload failed:', error);
      // You could add toast notification here
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[88vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <DialogHeader>
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="text-xl font-semibold text-foreground">
                <DialogTitle>Media Library</DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    id="media-upload"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files);
                      }
                    }}
                  />
                  <Button
                    variant="default"
                    size="sm"
                    disabled={isUploading}
                    className="h-9 px-3 cursor-pointer"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>

                {/* View Mode Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="h-9 px-3"
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4 mr-2" /> : <Grid3X3 className="h-4 w-4 mr-2" />}
                  {viewMode === 'grid' ? 'List' : 'Grid'}
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Filters and Search */}
          <div className="px-6 pb-4 space-y-3">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-background"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-56 h-10">
                  <FolderOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Folders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.id} value={folder.id.toString()}>
                      {folder.name} ({folder.media_files_count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 h-10">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="application">Documents</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1" />

              <Badge variant="secondary" className="text-xs py-1.5 px-3">
                {filteredFiles.length} of {pagination.total} files
              </Badge>
            </div>
          </div>
        </div>

  
        {/* Media Grid/List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div
              className="p-6"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Loading media files...</span>
                  </div>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No media files found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    {searchTerm || selectedFolder !== 'all' || selectedType !== 'all'
                      ? 'Try adjusting your filters or search terms'
                      : 'Upload your first media file to get started'}
                  </p>
                  {!searchTerm && selectedFolder === 'all' && selectedType === 'all' && (
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">You can:</p>
                      <ul className="text-left space-y-1">
                        <li>• Click the "Upload" button above</li>
                        <li>• Drag and drop files here</li>
                        <li>• Select multiple files at once</li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3'
                    : 'space-y-2'
                }>
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => toggleFileSelection(file)}
                      className={`relative group cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                        selectedFiles.some(f => f.id === file.id)
                          ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                          : 'border-transparent hover:border-primary/30 hover:shadow-md hover:scale-[1.01]'
                      } ${
                        viewMode === 'grid' ? 'aspect-square overflow-hidden bg-background' : 'flex items-center gap-4 p-3'
                      }`}
                    >
                      {/* Selection indicator */}
                      {selectedFiles.some(f => f.id === file.id) && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      )}

                      {/* File preview */}
                      {file.mime_type.startsWith('image/') ? (
                        <img
                          src={file.thumbnail_url || file.url}
                          alt={file.original_filename}
                          className={
                            viewMode === 'grid'
                              ? 'w-full h-full object-cover'
                              : 'w-12 h-12 rounded object-cover'
                          }
                          loading="lazy"
                        />
                      ) : (
                        <div className={
                          viewMode === 'grid'
                            ? 'w-full h-full flex items-center justify-center bg-muted/50'
                            : 'flex items-center justify-center w-12 h-12 bg-muted rounded'
                        }>
                          {getFileIcon(file.mime_type)}
                        </div>
                      )}

                      {/* File info overlay for grid view */}
                      {viewMode === 'grid' && (
                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-medium truncate drop-shadow">
                            {file.original_filename}
                          </p>
                          <p className="text-white/90 text-xs drop-shadow">
                            {formatFileSize(file.size_bytes)}
                            {file.width && file.height && (
                              <span> • {file.width}×{file.height}</span>
                            )}
                          </p>
                        </div>
                      )}

                      {/* File info for list view */}
                      {viewMode === 'list' && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">{file.original_filename}</p>
                            {file.width && file.height && (
                              <span className="text-xs text-muted-foreground ml-2">
                                {file.width}×{file.height}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatFileSize(file.size_bytes)}</span>
                            <span>•</span>
                            <span>{file.mime_type}</span>
                            {file.folder && (
                              <>
                                <span>•</span>
                                <span>{file.folder.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer with actions */}
        <div className="shrink-0 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {selectedFiles.length > 0 && (
                <div className="flex items-center gap-4">
                  {/* Selected file previews */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {selectedFiles.slice(0, 3).map(file => (
                        <div key={file.id} className="relative group">
                          {file.mime_type.startsWith('image/') ? (
                            <img
                              src={file.thumbnail_url || file.url}
                              alt={file.original_filename}
                              className="h-8 w-8 rounded object-cover border border-background shadow-sm"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded bg-muted flex items-center justify-center border border-background shadow-sm">
                              {getFileIcon(file.mime_type)}
                            </div>
                          )}
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                            <div className="font-medium truncate max-w-32">
                              {file.original_filename}
                            </div>
                            <div className="text-gray-300 text-xs">
                              {formatFileSize(file.size_bytes)}
                              {file.width && file.height && (
                                <span> • {file.width}×{file.height}</span>
                              )}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 -mt-1"></div>
                          </div>
                        </div>
                      ))}
                      {selectedFiles.length > 3 && (
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-medium border border-background shadow-sm">
                          +{selectedFiles.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Selection info */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">
                        {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Total: {formatFileSize(selectedFiles.reduce((sum, file) => sum + file.size_bytes, 0))}
                      </span>
                    </div>
                  </div>

                  {/* Clear selection button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFiles([])}
                    className="h-7 px-2 text-xs"
                  >
                    Clear selection
                  </Button>
                </div>
              )}
              {selectedFiles.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Select files to use in your content
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFiles([]);
                  onOpenChange(false);
                }}
                className="h-10 px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedFiles.length > 0 && onSelect) {
                    onSelect(selectedFiles);
                    setSelectedFiles([]);
                  }
                }}
                disabled={selectedFiles.length === 0}
                className="h-10 px-6"
              >
                {multiple
                  ? `Select ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`
                  : 'Select File'
                }
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}