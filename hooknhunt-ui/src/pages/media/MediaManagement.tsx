import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Image as ImageIcon,
  Video,
  FileText,
  FolderOpen,
  Grid3X3,
  List,
  Filter,
  Upload,
  Eye,
  Trash2,
  Edit,
  Download,
  Loader2,
  Plus
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { MediaUpload } from '@/components/media/MediaUpload';
import { useMediaStore } from '@/stores/mediaStore';
import { transformMediaUrl } from '@/lib/config';

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

interface MediaFolder {
  id: number;
  name: string;
  slug: string;
  media_files_count: number;
}

export function MediaManagement() {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState<number[]>([]);

  const {
    files,
    folders,
    loading,
    error,
    pagination,
    searchQuery,
    selectedFolder,
    selectedType,
    viewMode,
    fetchFiles,
    fetchFolders,
    deleteFile,
    updateFile,
    setSearchQuery,
    setSelectedFolder,
    setSelectedType,
    setViewMode,
  } = useMediaStore();

  // Fetch data on mount
  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFiles({ search: searchQuery });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle folder/type changes
  useEffect(() => {
    fetchFiles({ folder_id: selectedFolder, mime_type: selectedType });
  }, [selectedFolder, selectedType]);

  // Toggle file selection
  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // Handle file deletion
  const handleDelete = async (fileId: number) => {
    setDeletingFiles(prev => [...prev, fileId]);
    try {
      await deleteFile(fileId);
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    } finally {
      setDeletingFiles(prev => prev.filter(id => id !== fileId));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`);
    if (!confirmed) return;

    try {
      await Promise.all(selectedFiles.map(fileId => deleteFile(fileId)));
      setSelectedFiles([]);
      toast({
        title: "Success",
        description: `${selectedFiles.length} file(s) deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some files",
        variant: "destructive",
      });
    }
  };

  // Handle upload complete
  const handleUploadComplete = (uploadedFiles: { url: string; file: File }[]) => {
    setShowUpload(false);
    // Refresh the media files list to show newly uploaded items
    // Go to first page to see the newest files (since they're sorted by latest)
    fetchFiles({ page: 1 });
    toast({
      title: "Upload Complete",
      description: `${uploadedFiles.length} file(s) uploaded successfully`,
    });
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

  // Get file icon based on MIME type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
    if (mimeType.startsWith('video/')) return <Video className="h-8 w-8" />;
    return <FileText className="h-8 w-8" />;
  };

  // Filter files based on search and filters
  const filteredFiles = files.filter(file => {
    const matchesSearch = !searchQuery ||
      file.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.filename.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder = !selectedFolder || selectedFolder === 'all' || file.folder?.id.toString() === selectedFolder;
    const matchesType = !selectedType || selectedType === 'all' || file.mime_type.startsWith(selectedType);

    return matchesSearch && matchesFolder && matchesType;
  });

  return (
    <RoleGuard
      allowedRoles={['super_admin', 'admin', 'store_keeper', 'marketer']}
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-lg font-medium text-muted-foreground">Access Denied</h3>
            <p className="text-sm text-muted-foreground">You don't have permission to access the media library.</p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Media Library</h1>
              <Badge variant="secondary">{pagination.total} files</Badge>
            </div>

            <div className="flex items-center gap-3">
              {selectedFiles.length > 0 && (
                <>
                  <Badge variant="outline">
                    {selectedFiles.length} selected
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected
                  </Button>
                </>
              )}

              {/* Test button to debug */}
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => setShowUpload(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload
              </Button>

              <Dialog open={showUpload} onOpenChange={setShowUpload}>
                <DialogTrigger>
                  <Button className="bg-red-500 text-white hover:bg-red-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Upload Media Files</DialogTitle>
                  </DialogHeader>
                  <MediaUpload
                    onUploadComplete={handleUploadComplete}
                    accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    multiple={true}
                    maxFiles={20}
                    maxSize={10}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="border-b bg-white px-6 py-4">
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <Select value={selectedFolder || 'all'} onValueChange={setSelectedFolder}>
              <SelectTrigger className="w-48">
                <FolderOpen className="h-4 w-4 mr-2" />
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

            <Select value={selectedType || 'all'} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
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

            {/* View Mode Toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none border-r"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Media Grid/List */}
        <ScrollArea className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No media files found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedFolder !== 'all' || selectedType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Upload your first media file to get started'}
              </p>
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
                : 'space-y-2'
            }>
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`relative group border rounded-lg overflow-hidden bg-white hover:shadow-md transition-all ${
                    selectedFiles.includes(file.id)
                      ? 'ring-2 ring-primary border-primary'
                      : 'border-border'
                  } ${
                    viewMode === 'grid'
                      ? 'aspect-square'
                      : 'flex items-center gap-4 p-4'
                  }`}
                >
                  {/* Selection checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="absolute top-2 left-2 z-10 w-4 h-4 text-primary rounded border-primary"
                  />

                  {/* File preview */}
                  {file.mime_type.startsWith('image/') ? (
                    <img
                      src={transformMediaUrl(file.thumbnail_url || file.url)}
                      alt={file.original_filename}
                      className={
                        viewMode === 'grid'
                          ? 'w-full h-full object-cover'
                          : 'w-16 h-16 rounded object-cover'
                      }
                      loading="lazy"
                    />
                  ) : (
                    <div className={
                      viewMode === 'grid'
                        ? 'w-full h-full flex items-center justify-center bg-muted'
                        : 'flex items-center justify-center w-16 h-16 bg-muted rounded'
                    }>
                      {getFileIcon(file.mime_type)}
                    </div>
                  )}

                  {/* Overlay with actions */}
                  <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100 ${
                    viewMode === 'grid' ? '' : 'absolute right-4 top-1/2 transform -translate-y-1/2'
                  }`}>
                    <div className="flex gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPreviewFile(file)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(transformMediaUrl(file.url), '_blank')}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(file.id)}
                        disabled={deletingFiles.includes(file.id)}
                        className="h-8 w-8 p-0"
                      >
                        {deletingFiles.includes(file.id) ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* File info for list view */}
                  {viewMode === 'list' && (
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.original_filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size_bytes)} • {file.mime_type}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Preview Dialog */}
        {previewFile && (
          <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-medium text-lg">{previewFile.original_filename}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(previewFile.size_bytes)} • {previewFile.mime_type}
                  {previewFile.width && previewFile.height && (
                    <> • {previewFile.width} × {previewFile.height}px</>
                  )}
                </p>
              </div>

              {previewFile.mime_type.startsWith('image/') ? (
                <img
                  src={transformMediaUrl(previewFile.url)}
                  alt={previewFile.original_filename}
                  className="max-w-full max-h-[60vh] object-contain mx-auto"
                />
              ) : (
                <div className="text-center py-12">
                  {getFileIcon(previewFile.mime_type)}
                  <p className="mt-2 text-muted-foreground">
                    Preview not available for this file type
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.open(transformMediaUrl(previewFile.url), '_blank')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
          </Dialog>
        )}
      </div>
    </RoleGuard>
  );
}