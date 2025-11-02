'use client';

import { NFTCard } from '@/components/market/NFTCard';
import { CollectionHeader } from '@/components/market/CollectionHeader';
import { MarketplaceFilters } from '@/components/market/MarketplaceFilters';
import { MarketplaceTabs } from '@/components/market/MarketplaceTabs';
import { LeftRail } from '@/components/layout/LeftRail';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('items');
  const [filters, setFilters] = useState({
    status: 'all',
    emotion: '',
    sortBy: 'price-low',
    minPrice: '',
    maxPrice: '',
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['marketplace', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.emotion) params.set('emotion', filters.emotion);
      params.set('listed', filters.status !== 'all' ? 'true' : 'all');
      if (filters.sortBy) params.set('sort', filters.sortBy);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      params.set('limit', '24'); // Limit initial load

      const res = await fetch(`/api/market?${params}`, {
        next: { revalidate: 300 },
      });
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Calculate collection stats
  const allPrices = items?.items
    ?.filter((item: any) => item.price_wei && item.minted)
    ?.map((item: any) => Number(item.price_wei) / 1e18) || [];
  const floorPrice =
    allPrices.length > 0 ? Math.min(...allPrices) : 0;

  const totalSupply = items?.items?.length || 0;
  const listed = items?.items?.filter((item: any) => item.minted && item.price_wei)?.length || 0;
  const owners = new Set(items?.items?.map((item: any) => item.users?.handle).filter(Boolean)).size || 0;

  return (
    <>
      <LeftRail />
      <div className="ml-16 group-hover:ml-64 mr-80 min-h-screen transition-all duration-300 ease-in-out">
        {/* Collection Header */}
        <CollectionHeader
        name="Neural Thoughts"
        description="A collection of minted thoughts, quotes, images, and videos from creators across the neural network. Each piece is a unique neuron waiting to be collected and absorbed into your mind."
        creator="ThreadMint"
        floorPrice={floorPrice > 0 ? floorPrice.toFixed(4) : '0'}
        volume24h="12.45"
        totalVolume="1,234.56"
        listed={listed}
        totalSupply={totalSupply}
        owners={owners}
      />

      <div className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <MarketplaceTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Filters */}
          {activeTab === 'items' && (
            <MarketplaceFilters
              status={filters.status}
              priceMin={filters.minPrice}
              priceMax={filters.maxPrice}
              sortBy={filters.sortBy}
              onStatusChange={(status) => setFilters({ ...filters, status })}
              onPriceChange={(min, max) =>
                setFilters({ ...filters, minPrice: min, maxPrice: max })
              }
              onSortChange={(sort) => setFilters({ ...filters, sortBy: sort })}
            />
          )}

          {/* Content based on active tab */}
          {activeTab === 'items' && (
            <>
              {isLoading ? (
                <div className="text-center text-muted py-16">
                  <div className="text-lg font-medium mb-2">Loading items...</div>
                  <div className="text-sm">Discovering neurons across the network</div>
                </div>
              ) : items?.items?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {items.items.map((item: any) => (
                    <NFTCard
                      key={item.id}
                      id={item.id}
                      image={item.media_url}
                      title={
                        item.body
                          ? item.body.substring(0, 50) + (item.body.length > 50 ? '...' : '')
                          : 'Neural Thought'
                      }
                      body={item.body}
                      emotion={item.post_features?.emotion?.tone}
                      price={
                        item.price_wei
                          ? (Number(item.price_wei) / 1e18).toFixed(4)
                          : '0'
                      }
                      creator={item.users?.display_name || item.users?.handle || 'unknown'}
                      creatorHandle={item.users?.handle}
                      creatorAvatar={item.users?.avatar_url}
                      creatorVerified={item.users?.verified || false}
                      createdAt={item.created_at}
                      comments={item.comments_count || Math.floor(Math.random() * 100)}
                      retweets={item.retweets_count || Math.floor(Math.random() * 50)}
                      likes={item.likes_count || Math.floor(Math.random() * 500) + 100}
                      views={item.views_count || Math.floor(Math.random() * 1000) + 500}
                      scarcity={item.edition_type || '1of1'}
                      left={
                        item.editions ? item.editions - (item.sold || 0) : undefined
                      }
                      onCollect={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-16 text-center">
                  <div className="text-5xl mb-4 opacity-50">🧠</div>
                  <div className="text-xl font-semibold text-text mb-2">
                    No items found
                  </div>
                  <div className="text-muted">
                    Try adjusting your filters or check back later
                  </div>
                </Card>
              )}
            </>
          )}

          {activeTab === 'tokens' && (
            <Card className="p-12 text-center text-muted">
              Tokens view coming soon
            </Card>
          )}

          {activeTab === 'offers' && (
            <Card className="p-12 text-center text-muted">
              Offers view coming soon
            </Card>
          )}

          {activeTab === 'holders' && (
            <Card className="p-12 text-center text-muted">
              Holders view coming soon
            </Card>
          )}

          {activeTab === 'activity' && (
            <Card className="p-12 text-center text-muted">
              Activity feed coming soon
            </Card>
          )}

          {activeTab === 'about' && (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-text mb-4">About Neural Thoughts</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Neural Thoughts is the premier collection of minted neurons on ThreadMint.
                  Each item represents a unique thought, quote, image, or video that has been
                  transformed into a collectible NFT on the Base blockchain.
                </p>
                <p>
                  When you collect a neuron, you're not just acquiring a digital asset—you're
                  absorbing its meaning and emotion into your own 3D brain visualization.
                  The more neurons you collect, the richer and more diverse your mind becomes.
                </p>
                <p>
                  Creators can mint their content as 1/1 unique pieces or as limited editions,
                  allowing for various levels of scarcity and value. Each neuron carries with
                  it the emotional resonance and influence of its creator.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
