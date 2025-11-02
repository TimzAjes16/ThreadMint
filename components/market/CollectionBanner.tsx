'use client';

interface CollectionBannerProps {
  imageUrl?: string;
  alt?: string;
}

export function CollectionBanner({ 
  imageUrl,
  alt = 'Collection Banner'
}: CollectionBannerProps) {
  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500" />
      )}
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
    </div>
  );
}

