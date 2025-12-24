import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Package, Image, Upload, X, FolderOpen, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { MediaLibrary } from '@/components/media/MediaLibrary';
import { API_URL } from '@/lib/config';

// MediaFile interface for MediaLibrary
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
}

interface ProductGalleryTabProps {
  product: {
    id: number;
    base_name: string;
    gallery_images?: string[] | null;
  };
  onGalleryUpdated: () => void;
}

export const ProductGalleryTab: React.FC<ProductGalleryTabProps> = ({ product, onGalleryUpdated }) => {
  const [existingImages, setExistingImages] = useState<Array<{ url: string; id?: number }>>([]);
  const [selectedImages, setSelectedImages] = useState<MediaFile[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize existing images
  useEffect(() => {
    if (product.gallery_images) {
      let parsedImages: string[] = [];

      if (typeof product.gallery_images === 'string') {
        try {
          parsedImages = JSON.parse(product.gallery_images);
        } catch (e) {
          console.error('Error parsing gallery_images:', e);
          parsedImages = [];
        }
      } else {
        parsedImages = product.gallery_images;
      }

      const processedImages = parsedImages.map((url: string) => ({
        url: url.startsWith('http') ? url : `${API_URL}/storage/${url}`,
      }));

      setExistingImages(processedImages);
    }
  }, [product.gallery_images]);

  // Handle media selection
  const handleMediaSelect = (files: MediaFile[]) => {
    console.log('🖼️ MediaLibrary selected files:', files);
    const newImages = files.filter(file =>
      !existingImages.some(existing => existing.url === file.url) &&
      !selectedImages.some(selected => selected.id === file.id)
    );

    setSelectedImages(prev => [...prev, ...newImages]);
    setShowMediaModal(false);

    if (newImages.length > 0) {
      toast({
        title: "Images Added",
        description: `${newImages.length} image${newImages.length > 1 ? 's' : ''} added to gallery`,
      });
    }
  };

  // Remove existing image
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove selected image
  const removeSelectedImage = (id: number) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  // Save gallery changes
  const handleSaveGallery = async () => {
    try {
      setIsSubmitting(true);

      // Combine existing and new images
      const allImages = [
        ...existingImages.map(img => img.url),
        ...selectedImages.map(img => img.url)
      ];

      // Convert to relative paths for storage
      const relativePaths = allImages.map(url => {
        if (url.startsWith(`${API_URL}/storage/`)) {
          return url.replace(`${API_URL}/storage/`, '');
        }
        return url;
      });

      const formData = new FormData();
      formData.append('gallery_images', JSON.stringify(relativePaths));

      const response = await api.post(`/admin/products/${product.id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('📡 Gallery update response:', response.data);

      toast({
        title: "Gallery Updated",
        description: "Product gallery has been updated successfully!",
      });

      // Update existing images
      setExistingImages(allImages.map(url => ({ url })));
      setSelectedImages([]);

      if (onGalleryUpdated) {
        onGalleryUpdated();
      }
    } catch (error: any) {
      console.error('❌ Error updating gallery:', error);
      toast({
        title: "Error",
        description: "Failed to update gallery. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalImages = existingImages.length + selectedImages.length;

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Product Gallery
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Manage images that showcase your product from different angles
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {totalImages} / 8 Images
              </Badge>
              <Button
                onClick={() => setShowMediaModal(true)}
                disabled={totalImages >= 8}
                size="sm"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Select Images
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Gallery Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Gallery ({totalImages} images)</CardTitle>
        </CardHeader>
        <CardContent>
          {totalImages > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Existing Images */}
              {existingImages.map((image, index) => (
                <div key={`existing-${index}`} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors">
                    <img
                      src={image.url}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
              ))}

              {/* New Selected Images */}
              {selectedImages.map((image) => (
                <div key={`selected-${image.id}`} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-green-300 hover:border-green-500 transition-colors">
                    <img
                      src={image.url}
                      alt={`New image: ${image.original_filename}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSelectedImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    NEW
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Gallery Images</h3>
              <p className="text-gray-500 mb-4">Add images to showcase your product from different angles</p>
              <Button
                onClick={() => setShowMediaModal(true)}
                variant="outline"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Add Gallery Images
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {totalImages > 0 ? (
            <span>Changes will be saved when you click "Save Gallery"</span>
          ) : (
            <span>Select images from media library to add them to your gallery</span>
          )}
        </div>
        <Button
          onClick={handleSaveGallery}
          disabled={totalImages === 0 || isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Package className="h-4 w-4 mr-2" />
              Save Gallery
            </>
          )}
        </Button>
      </div>

      {/* Media Selection Modal */}
      <MediaLibrary
        open={showMediaModal}
        onOpenChange={setShowMediaModal}
        onSelect={handleMediaSelect}
        multiple={true}
        maxSelections={8 - totalImages}
        acceptedTypes={['image/*']}
      />
    </div>
  );
};