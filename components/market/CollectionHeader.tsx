'use client';

import { Card } from '../ui/Card';

interface CollectionHeaderProps {
  name: string;
  description?: string;
  creator?: string;
  floorPrice?: string;
  volume24h?: string;
  totalVolume?: string;
  listed?: number;
  totalSupply?: number;
  owners?: number;
  image?: string;
}

export function CollectionHeader({
  name,
  description,
  creator,
  floorPrice,
  volume24h,
  totalVolume,
  listed,
  totalSupply,
  owners,
  image,
}: CollectionHeaderProps) {
  const listedPercent = listed && totalSupply ? ((listed / totalSupply) * 100).toFixed(1) : '0';
  const uniqueOwners = owners || 0;
  const uniquePercent = totalSupply ? ((uniqueOwners / totalSupply) * 100).toFixed(1) : '0';

  return (
    <div className="relative">
      {/* Banner/Image */}
      <div className="h-64 w-full bg-gradient-to-br from-brand-500/20 via-curiosity/20 to-brand-500/20 relative overflow-hidden rounded-t-2xl">
        {image && (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
      </div>

      <div className="relative -mt-12 md:-mt-20 px-4 md:px-6">
        <Card className="p-4 md:p-6 max-w-5xl mx-auto">
          {/* Collection Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6 text-center sm:text-left">
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-brand-500 to-curiosity border-4 border-bg shadow-lg shrink-0 flex items-center justify-center text-3xl md:text-5xl">
              🧠
            </div>
            <div className="flex-1 pt-0 md:pt-4 max-w-3xl">
              <h1 className="text-2xl md:text-4xl font-bold text-text mb-2">{name}</h1>
              {creator && (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted mb-2 md:mb-3 text-sm md:text-base">
                  <span>By</span>
                  <span className="text-brand-400 font-medium">{creator}</span>
                </div>
              )}
              {description && (
                <p className="text-muted text-xs md:text-sm leading-relaxed max-w-2xl mx-auto sm:mx-0">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 pt-4 md:pt-6 border-t border-line max-w-5xl mx-auto">
            <div>
              <div className="text-xs text-muted font-medium mb-0.5 sm:mb-1">Floor price</div>
              <div className="text-base sm:text-lg font-bold text-text truncate">
                {floorPrice && floorPrice !== 'Infinity' ? floorPrice : '0'} ETH
              </div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-0.5 sm:mb-1">24h volume</div>
              <div className="text-base sm:text-lg font-bold text-text truncate">
                {volume24h || '0'} ETH
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="text-xs text-muted font-medium mb-0.5 sm:mb-1">Total volume</div>
              <div className="text-base sm:text-lg font-bold text-text truncate">
                {totalVolume || '0'} ETH
              </div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-0.5 sm:mb-1">Listed</div>
              <div className="text-base sm:text-lg font-bold text-text">
                {listedPercent}%
              </div>
              <div className="text-xs text-muted hidden sm:block">{listed} items</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-xs text-muted font-medium mb-0.5 sm:mb-1">Total supply</div>
              <div className="text-base sm:text-lg font-bold text-text">
                {totalSupply?.toLocaleString() || '0'}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-xs text-muted font-medium mb-0.5 sm:mb-1">Owners</div>
              <div className="text-base sm:text-lg font-bold text-text">
                {uniqueOwners.toLocaleString()}
              </div>
              <div className="text-xs text-muted hidden lg:block">{uniquePercent}% unique</div>
            </div>
            <div className="hidden xl:block">
              <div className="text-xs text-muted font-medium mb-0.5 sm:mb-1">Category</div>
              <div className="text-base sm:text-lg font-bold text-text">Neural</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

