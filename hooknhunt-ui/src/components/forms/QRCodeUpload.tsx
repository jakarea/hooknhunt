import { ImageSelector } from '@/components/ImageSelector';

interface QRCodeUploadProps {
  label: string;
  currentUrl?: string | null;
  onFileChange: (file: File | null, mediaId?: number | null) => void;
  onRemoveImage: () => void;
  disabled?: boolean;
}

export function QRCodeUpload({
  label,
  currentUrl,
  onFileChange,
  onRemoveImage,
  disabled = false
}: QRCodeUploadProps) {

  const handleImageChange = (file: File | null, url: string | null, mediaId?: number | null) => {
    // Pass both file and media ID to parent component
    onFileChange(file, mediaId);
  };

  return (
    <ImageSelector
      label={label}
      currentUrl={currentUrl}
      onImageChange={handleImageChange}
      onRemoveImage={onRemoveImage}
      disabled={disabled}
      allowUpload={false}
      maxSizeKB={100}
      infoText="Select QR code from your media library. Recommended: High contrast, clear scannable images with square format."
    />
  );
}