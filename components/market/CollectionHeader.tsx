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

      <div className="relative -mt-20 px-6">
        <Card className="p-6">
          {/* Collection Info */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-500 to-curiosity border-4 border-bg shadow-lg shrink-0 flex items-center justify-center text-5xl">
              🧠
            </div>
            <div className="flex-1 pt-4">
              <h1 className="text-4xl font-bold text-text mb-2">{name}</h1>
              {creator && (
                <div className="flex items-center gap-2 text-muted mb-3">
                  <span>By</span>
                  <span className="text-brand-400 font-medium">{creator}</span>
                </div>
              )}
              {description && (
                <p className="text-muted text-sm leading-relaxed max-w-2xl">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-6 border-t border-line">
            <div>
              <div className="text-xs text-muted font-medium mb-1">Floor price</div>
              <div className="text-lg font-bold text-text">
                {floorPrice && floorPrice !== 'Infinity' ? floorPrice : '0'} ETH
              </div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-1">24h volume</div>
              <div className="text-lg font-bold text-text">
                {volume24h || '0'} ETH
              </div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-1">Total volume</div>
              <div className="text-lg font-bold text-text">
                {totalVolume || '0'} ETH
              </div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-1">Listed</div>
              <div className="text-lg font-bold text-text">
                {listedPercent}%
              </div>
              <div className="text-xs text-muted">{listed} items</div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-1">Total supply</div>
              <div className="text-lg font-bold text-text">
                {totalSupply?.toLocaleString() || '0'}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-1">Owners</div>
              <div className="text-lg font-bold text-text">
                {uniqueOwners.toLocaleString()}
              </div>
              <div className="text-xs text-muted">{uniquePercent}% unique</div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium mb-1">Category</div>
              <div className="text-lg font-bold text-text">Neural</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

