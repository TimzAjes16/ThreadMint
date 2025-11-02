'use client';

import { NFTCard } from '@/components/market/NFTCard';
import { CollectionHeader } from '@/components/market/CollectionHeader';
import { MarketplaceFilters } from '@/components/market/MarketplaceFilters';
import { MarketplaceTabs } from '@/components/market/MarketplaceTabs';
import { Header } from '@/components/layout/Header';
import { LeftRail } from '@/components/layout/LeftRail';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const CollectionBanner = dynamic(() => import('@/components/market/CollectionBanner').then(m => ({ default: m.CollectionBanner })), {
  ssr: false,
  loading: () => <div className="h-48 md:h-64 lg:h-80 bg-gradient-to-br from-brand-900/40 via-curiosity-900/30 to-brand-900/40 animate-pulse" />
});

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
      params.set('listed', filters.status !== 'all' ? 'true' : 'all');
      if (filters.sortBy) params.set('sort', filters.sortBy);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      params.set('limit', '24'); // Limit initial load

      try {
        const res = await fetch(`/api/market?${params}`, {
          next: { revalidate: 300 }, // Revalidate every 5 minutes
        });
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      } catch (error) {
        console.error('Error fetching items:', error);
        return { items: [] };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Memoize calculations for better performance
  const mintedItems = useMemo(() => {
    return items?.items?.filter((item: any) => item.minted) || [];
  }, [items?.items]);

  // Calculate collection stats from minted neurons (memoized)
  const stats = useMemo(() => {
    const allPrices = mintedItems
      .filter((item: any) => item.price_wei)
      .map((item: any) => Number(item.price_wei) / 1e18);
    const floorPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;

    const calculateTotalSupply = (items: any[]) => {
      return items.reduce((total, item) => {
        if (item.edition_type === '1of1') return total + 1;
        if (item.edition_type === 'open') return total + (item.editions || 1000);
        if (item.edition_type === 'limited') return total + (item.editions || 1);
        return total + 1;
      }, 0);
    };

    const totalSupply = items?.stats?.totalSupply || calculateTotalSupply(mintedItems);
    const listed = items?.stats?.listed || mintedItems.filter((item: any) => item.price_wei).length;
    const owners = items?.stats?.owners || new Set(
      mintedItems.map((item: any) => item.users?.handle).filter(Boolean)
    ).size;

    const totalVolume = allPrices.reduce((sum: number, price: number) => sum + price, 0).toFixed(2);
    
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const volume24hValue = mintedItems
      .filter((item: any) => new Date(item.created_at).getTime() > oneDayAgo)
      .filter((item: any) => item.price_wei)
      .reduce((sum: number, item: any) => sum + Number(item.price_wei) / 1e18, 0)
      .toFixed(2);

    return {
      floorPrice: floorPrice.toFixed(4),
      totalSupply,
      listed,
      owners,
      totalVolume,
      volume24h: volume24hValue,
    };
  }, [mintedItems, items?.stats]);

  return (
    <>
      <LeftRail />
      <div className="ml-0 md:ml-16 md:group-hover:ml-64 mr-0 lg:mr-80 min-h-screen transition-all duration-300 ease-in-out">
        {/* Top Header with Wallet Connection */}
        <Header />
      
      {/* Collection Banner - Lazy loaded */}
      <div className="pt-14 md:pt-16">
        <CollectionBanner />
      </div>
      
      {/* Collection Header */}
      <CollectionHeader
        name="Your Neural Feed"
        description="Minted thoughts, quotes, images, and videos from creators you follow and subscribe to. Each post is minted as an NFT on Base, ready to be collected and absorbed into your mind."
        creator="ThreadMint"
        floorPrice={stats.floorPrice}
        volume24h={stats.volume24h}
        totalVolume={stats.totalVolume}
        listed={stats.listed}
        totalSupply={stats.totalSupply}
        owners={stats.owners}
      />

      <div className="px-4 md:px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Feed Indicator */}
          <div className="mb-4 flex items-center gap-2 text-xs md:text-sm text-muted">
            <span>📡</span>
            <span>Showing minted neurons from creators in your feed</span>
          </div>
          
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {mintedItems.map((item: any) => (
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
                      comments={item.comments_count || 0}
                      retweets={item.retweets_count || 0}
                      likes={item.likes_count || 0}
                      views={item.views_count || 0}
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
                    No minted posts in your feed
                  </div>
                  <div className="text-muted">
                    Follow creators to see their minted thoughts appear here, or explore the marketplace to discover new neurons.
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
              <h2 className="text-2xl font-bold text-text mb-4">About Your Neural Feed</h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  Your Neural Feed shows minted thoughts, quotes, images, and videos from creators
                  you follow and subscribe to. This is your personalized view of the ThreadMint network,
                  showing only the content from creators you're connected with.
                </p>
                <p>
                  When you collect a post from your feed, you're absorbing its meaning and emotion into your 3D brain
                  visualization. The more posts you collect, the richer and more diverse your mind becomes.
                </p>
                <p>
                  Explore the Marketplace tab to discover neurons from all creators across the network,
                  or visit individual creator profiles to see their complete collection.
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
