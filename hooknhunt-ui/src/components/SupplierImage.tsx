import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { QrCode } from 'lucide-react';

interface SupplierImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SupplierImage: React.FC<SupplierImageProps> = ({
  src,
  alt,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const fallbackSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg'
  };

  // Convert relative storage path to full URL
  const getImageUrl = (imageSrc: string | null | undefined): string | undefined => {
    if (!imageSrc) {
      return undefined;
    }

    // If it's already a full URL (starts with http), return as is
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }

    // If it's a storage path (starts with /storage/), convert to full URL
    if (imageSrc.startsWith('/storage/')) {
      return `http://localhost:8000${imageSrc}`;
    }

    // If it's a relative path without leading slash, add it
    if (!imageSrc.startsWith('/')) {
      return `http://localhost:8000/storage/${imageSrc}`;
    }

    // Otherwise, treat as a full relative path
    return `http://localhost:8000${imageSrc}`;
  };

  const imageUrl = getImageUrl(src);

  const handleImageError = () => {
    console.error('SupplierImage: Failed to load image:', imageUrl);
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
        <QrCode className="h-1/2 w-1/2" />
      </AvatarFallback>
    </Avatar>
  );
};