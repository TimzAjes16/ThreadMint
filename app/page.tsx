'use client';

import { NFTCard } from '@/components/market/NFTCard';
import { CollectionHeader } from '@/components/market/CollectionHeader';
import { MarketplaceFilters } from '@/components/market/MarketplaceFilters';
import { MarketplaceTabs } from '@/components/market/MarketplaceTabs';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('items');
  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'price-low',
    minPrice: '',
    maxPrice: '',
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['marketplace', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.set('listed', 'true');
      if (filters.sortBy) params.set('sort', filters.sortBy);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);

      try {
        const res = await fetch(`/api/market?${params}`);
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      } catch (error) {
        console.error('Error fetching items:', error);
        return { items: [] };
      }
    },
  });

  // Get minted neurons from items
  const mintedItems = items?.items?.filter((item: any) => item.minted) || [];
  
  // Calculate collection stats from minted neurons
  const allPrices = mintedItems
    .filter((item: any) => item.price_wei)
    .map((item: any) => Number(item.price_wei) / 1e18);
  const floorPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;

  // Calculate total supply from editions
  const calculateTotalSupply = (items: any[]) => {
    return items.reduce((total, item) => {
      if (item.edition_type === '1of1') return total + 1;
      if (item.edition_type === 'open') return total + (item.editions || 1000);
      if (item.edition_type === 'limited') return total + (item.editions || 1);
      return total + 1;
    }, 0);
  };

  // Use stats from API if available, otherwise calculate
  const totalSupply = items?.stats?.totalSupply || calculateTotalSupply(mintedItems);
  const listed = items?.stats?.listed || mintedItems.filter((item: any) => item.price_wei).length;
  const owners = items?.stats?.owners || new Set(
    mintedItems.map((item: any) => item.users?.handle).filter(Boolean)
  ).size;

  // Calculate volumes
  const totalVolume = allPrices.reduce((sum: number, price: number) => sum + price, 0).toFixed(2);
  
  // 24h volume (items created in last 24h with prices)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const volume24hValue = mintedItems
    .filter((item: any) => new Date(item.created_at).getTime() > oneDayAgo)
    .filter((item: any) => item.price_wei)
    .reduce((sum: number, item: any) => sum + Number(item.price_wei) / 1e18, 0)
    .toFixed(2);

  return (
    <div className="ml-64 mr-80 min-h-screen">
      {/* Collection Header */}
      <CollectionHeader
        name="ThreadMint Neural Posts"
        description="Discover minted thoughts, quotes, images, and videos from creators across the network. Each post is minted as an NFT on Base, ready to be collected and absorbed into your mind."
        creator="ThreadMint"
        floorPrice={floorPrice > 0 ? floorPrice.toFixed(4) : '0'}
        volume24h={volume24hValue}
        totalVolume={totalVolume}
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
                  <div className="text-lg font-medium mb-2">Loading posts...</div>
                  <div className="text-sm">Discovering minted neurons</div>
                </div>
              ) : mintedItems && mintedItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {mintedItems.map((item: any) => (
                    <NFTCard
                      key={item.id}
                      image={item.media_url}
                      title={
                        item.body
                          ? item.body.substring(0, 50) + (item.body.length > 50 ? '...' : '')
                          : 'Neural Thought'
                      }
                      emotion={item.post_features?.emotion?.tone}
                      price={
                        item.price_wei
                          ? (Number(item.price_wei) / 1e18).toFixed(4)
                          : '0'
                      }
                      creator={item.users?.handle || 'unknown'}
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
                    No minted posts yet
                  </div>
                  <div className="text-muted">
                    Be the first to mint your thought as an NFT
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
              <h2 className="text-2xl font-bold text-text mb-4">About ThreadMint Neural Posts</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  ThreadMint Neural Posts is the collection of all thoughts, quotes, images, and videos
                  that have been minted as NFTs on Base blockchain. Each post represents a unique
                  neural thought captured from the network.
                </p>
                <p>
                  When you collect a post, you're absorbing its meaning and emotion into your 3D brain
                  visualization. The more posts you collect, the richer and more diverse your mind becomes.
                </p>
                <p>
                  Creators can mint their content as 1/1 unique pieces or as limited editions,
                  allowing for various levels of scarcity and value.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
