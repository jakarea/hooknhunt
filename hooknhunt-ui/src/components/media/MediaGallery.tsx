import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MediaLibrary } from './MediaLibrary';
import { MediaUpload } from './MediaUpload';
import {
  Image as ImageIcon,
  Upload,
  X,
  Grid3X3,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface GalleryImage {
  id?: number;
  url: string;
  alt_text?: string;
  file?: File;
}

interface MediaGalleryProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  maxImages?: number;
  title?: string;
  description?: string;
  className?: string;
}

export function MediaGallery({
  images,
  onChange,
  maxImages = 10,
  title = "Gallery Images",
  description = "Add images to your gallery. You can upload new images or select from the media library.",
  className = '',
}: MediaGalleryProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);

  // Add images from media library
  const handleLibrarySelect = (selectedFiles: any[]) => {
    const newImages: GalleryImage[] = selectedFiles.map(file => ({
      url: file.url,
      alt_text: file.original_filename,
    }));

    const updatedImages = [...images, ...newImages].slice(0, maxImages);
    onChange(updatedImages);

    if (newImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image from the library",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Images added",
        description: `${newImages.length} image${newImages.length !== 1 ? 's' : ''} added to gallery`,
      });
    }
  };

  // Handle upload complete
  const handleUploadComplete = (uploadedFiles: { url: string; file: File }[]) => {
    const newImages: GalleryImage[] = uploadedFiles.map(({ url, file }) => ({
      url,
      alt_text: file.name,
      file,
    }));

    const updatedImages = [...images, ...newImages].slice(0, maxImages);
    onChange(updatedImages);

    setShowUpload(false);
  };

  // Remove image from gallery
  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
  };

  // Reorder images (drag and drop would be nice, but for now we'll use move up/down)
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < images.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
      onChange(newImages);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {images.length} / {maxImages}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Dialog open={showLibrary} onOpenChange={setShowLibrary}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={images.length >= maxImages}>
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Media Library
                </Button>
              </DialogTrigger>
              <MediaLibrary
                open={showLibrary}
                onOpenChange={setShowLibrary}
                onSelect={handleLibrarySelect}
                multiple={true}
                acceptedTypes={['image/*']}
                maxSelections={maxImages - images.length}
              />
            </Dialog>

            <Dialog open={showUpload} onOpenChange={setShowUpload}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={images.length >= maxImages}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </DialogTrigger>
              <MediaUpload
                onUploadComplete={handleUploadComplete}
                accept="image/*"
                multiple={true}
                maxFiles={maxImages - images.length}
                maxSize={5}
              />
            </Dialog>

            {images.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No gallery images yet</p>
                <p className="text-xs mt-1">Add images using the buttons above</p>
              </div>
            )}
          </div>

          {/* Gallery Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg border overflow-hidden bg-gray-50">
                    <img
                      src={image.url}
                      alt={image.alt_text || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setPreviewImage(image)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>

                      {index > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => moveImage(index, 'up')}
                          className="h-8 w-8 p-0"
                        >
                          ↑
                        </Button>
                      )}

                      {index < images.length - 1 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => moveImage(index, 'down')}
                          className="h-8 w-8 p-0"
                        >
                          ↓
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Image order badge */}
                  <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}

              {/* Add more button */}
              {images.length < maxImages && (
                <Dialog open={showUpload} onOpenChange={setShowUpload}>
                  <DialogTrigger asChild>
                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors flex items-center justify-center cursor-pointer bg-gray-50">
                      <div className="text-center">
                        <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Add More</p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <MediaUpload
                    onUploadComplete={handleUploadComplete}
                    accept="image/*"
                    multiple={true}
                    maxFiles={maxImages - images.length}
                    maxSize={5}
                  />
                </Dialog>
              )}
            </div>
          )}

          {/* Helper text */}
          <div className="text-xs text-muted-foreground">
            <p>• Click "Media Library" to browse existing images</p>
            <p>• Click "Upload Images" to add new images</p>
            <p>• Drag images to reorder (move up/down buttons)</p>
            <p>• Maximum {maxImages} images allowed</p>
          </div>
        </div>
      </CardContent>

      {/* Image Preview Dialog */}
      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <div className="p-4">
            <img
              src={previewImage.url}
              alt={previewImage.alt_text || 'Preview'}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="mt-4 text-center">
              <p className="font-medium">{previewImage.alt_text || 'Gallery Image'}</p>
              <p className="text-sm text-muted-foreground">{previewImage.url}</p>
            </div>
          </div>
        </Dialog>
      )}
    </Card>
  );
}