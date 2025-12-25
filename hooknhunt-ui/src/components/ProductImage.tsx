import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Package } from 'lucide-react';
import { API_URL } from '@/lib/config';

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
    xl: 'h-32 w-32'
  };

  const fallbackSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Convert relative storage path to full URL
  const getImageUrl = (imageSrc: string | null | undefined): string | undefined => {
    if (!imageSrc) {
      return undefined;
    }

    // Check if it's a temporary file path (invalid)
    if (imageSrc.includes('/TemporaryItems/') || imageSrc.includes('/var/folders/')) {
      return undefined;
    }

    // If it's already a full URL (starts with http), return as is
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }

    // If it's a storage path (starts with /storage/), convert to full URL
    if (imageSrc.startsWith('/storage/')) {
      return `${API_URL}${imageSrc}`;
    }

    // If it's a relative path without leading slash, add it
    if (!imageSrc.startsWith('/')) {
      return `${API_URL}/storage/${imageSrc}`;
    }

    // Otherwise, treat as a full relative path
    return `${API_URL}${imageSrc}`;
  };

  const imageUrl = getImageUrl(src);

  const handleImageError = () => {
    // Silently handle image loading errors
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className} rounded-lg border-2 border-gray-200`}>
      <AvatarImage
        src={imageUrl}
        alt={alt}
        className="object-cover"
        onError={handleImageError}
      />
      <AvatarFallback className={`${fallbackSizes[size]} bg-gray-100 text-gray-600 rounded-lg`}>
        <Package className="h-1/2 w-1/2" />
      </AvatarFallback>
    </Avatar>
  );
};