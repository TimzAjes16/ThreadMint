'use client';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface MarketplaceFiltersProps {
  status: string;
  priceMin: string;
  priceMax: string;
  sortBy: string;
  onStatusChange: (status: string) => void;
  onPriceChange: (min: string, max: string) => void;
  onSortChange: (sort: string) => void;
}

export function MarketplaceFilters({
  status,
  priceMin,
  priceMax,
  sortBy,
  onStatusChange,
  onPriceChange,
  onSortChange,
}: MarketplaceFiltersProps) {
  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted font-medium">Status:</span>
          <div className="flex gap-2">
            <Button
              variant={status === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onStatusChange('all')}
            >
              All
            </Button>
            <Button
              variant={status === 'listed' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onStatusChange('listed')}
            >
              Listed
            </Button>
          </div>
        </div>

        {/* Price Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted font-medium">Price:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => onPriceChange(e.target.value, priceMax)}
              className="w-24 bg-panel2 border border-line rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            <span className="text-muted">to</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => onPriceChange(priceMin, e.target.value)}
              className="w-24 bg-panel2 border border-line rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-panel2 border border-line rounded-lg px-4 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most-collected">Most Collected</option>
          </select>
        </div>
      </div>
    </Card>
  );
}

