'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar2D } from '@/components/profile/Avatar2D';
import { CommentThread } from '@/components/post/CommentThread';
import { LeftRail } from '@/components/layout/LeftRail';
import { NFTCard } from '@/components/market/NFTCard';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.id as string;
  const [activeTab, setActiveTab] = useState('details');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', itemId],
    queryFn: async () => {
      try {
        // Try market API first (only returns minted items)
        const marketRes = await fetch('/api/market');
        const marketData = await marketRes.json();
        const found = marketData.items?.find((i: any) => {
          // Match by ID or by slug
          const itemSlug = i.id || i.body?.replace(/\s+/g, '-').toLowerCase().substring(0, 50);
          return i.id === itemId || itemSlug === itemId;
        });
        if (found) return found;
        
        // Fallback: try posts API
        const res = await fetch(`/api/posts?limit=100`);
        const data = await res.json();
        return data.posts?.find((p: any) => {
          const postSlug = p.id || p.body?.replace(/\s+/g, '-').toLowerCase().substring(0, 50);
          return (p.id === itemId || postSlug === itemId) && p.minted;
        }) || null;
      } catch (error) {
        console.error('Error fetching item:', error);
        return null;
      }
    },
    enabled: !!itemId,
  });

  // Fetch more items from the same creator
  const { data: relatedItems } = useQuery({
    queryKey: ['related-items', item?.users?.handle, itemId],
    queryFn: async () => {
      if (!item?.users?.handle) return [];
      try {
        // Fetch all minted items
        const marketRes = await fetch('/api/market?limit=100');
        const marketData = await marketRes.json();
        // Filter by same creator, exclude current item
        const related = marketData.items?.filter((i: any) => {
          const itemSlug = i.id || i.body?.replace(/\s+/g, '-').toLowerCase().substring(0, 50);
          return (
            i.minted &&
            i.users?.handle === item.users?.handle &&
            i.id !== item.id &&
            itemSlug !== itemId
          );
        }) || [];
        // Limit to 6 items
        return related.slice(0, 6);
      } catch (error) {
        console.error('Error fetching related items:', error);
        return [];
      }
    },
    enabled: !!item?.users?.handle && !!itemId,
  });

  if (isLoading) {
    return (
      <>
        <LeftRail />
        <div className="ml-0 md:ml-16 md:group-hover:ml-64 mr-0 lg:mr-80 min-h-screen flex items-center justify-center transition-all duration-300 ease-in-out">
          <div className="text-muted">Loading neuron...</div>
        </div>
      </>
    );
  }

  if (!item || !item.minted) {
    return (
      <>
        <LeftRail />
        <div className="ml-0 md:ml-16 md:group-hover:ml-64 mr-0 lg:mr-80 min-h-screen flex items-center justify-center transition-all duration-300 ease-in-out px-4">
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4 opacity-50">🧠</div>
          <div className="text-xl font-semibold text-text mb-2">
            Neuron not found
          </div>
          <div className="text-muted">
            This thought hasn't been minted yet
          </div>
        </Card>
      </div>
      </>
    );
  }

  const price = item.price_wei ? Number(item.price_wei) / 1e18 : 0;
  const editionInfo =
    item.edition_type === '1of1'
      ? { label: 'Unique', value: '1/1' }
      : item.edition_type === 'limited'
        ? {
            label: 'Limited Edition',
            value: `${item.sold || 0}/${item.editions} minted`,
          }
        : item.edition_type === 'open'
          ? { label: 'Open Edition', value: `${item.sold || 0} minted` }
          : { label: 'Allowlist', value: `${item.editions || 'N/A'}` };

  return (
    <>
      <LeftRail />
      <div className="ml-0 md:ml-16 md:group-hover:ml-64 mr-0 lg:mr-80 min-h-screen transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Left: Item Media */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-elev relative">
                {item.media_url ? (
                  <img
                    src={item.media_url}
                    alt={item.body || 'Neural Thought'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand-500/10 via-curiosity/10 to-brand-500/10">
                    <span className="text-9xl opacity-40">🧠</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right: Item Details */}
          <div className="space-y-6">
            {/* Collection & Creator */}
            <div>
              <div className="text-xs sm:text-sm text-muted mb-1.5 sm:mb-2">ThreadMint Neural Posts</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text mb-3 sm:mb-4 break-words">
                {item.body || 'Neural Thought'}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3">
                {item.users?.avatar_url ? (
                  <img
                    src={item.users.avatar_url}
                    alt={item.users.handle}
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <Avatar2D name={item.users?.display_name || item.users?.handle || 'unknown'} size="sm" className="sm:hidden" />
                )}
                {!item.users?.avatar_url && (
                  <div className="hidden sm:block">
                    <Avatar2D name={item.users?.display_name || item.users?.handle || 'unknown'} size="md" />
                  </div>
                )}
                <div>
                  <div className="text-xs sm:text-sm text-muted">Created by</div>
                  <div className="font-semibold text-text text-sm sm:text-base">
                    @{item.users?.handle || 'unknown'}
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Buy Section */}
            <Card className="p-4 sm:p-6 border-2 border-brand-500/30 bg-brand-500/5">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="text-xs sm:text-sm text-muted mb-1">Current price</div>
                  <div className="text-2xl sm:text-3xl font-bold text-text">
                    {price > 0 ? `${price.toFixed(4)} ETH` : 'Not listed'}
                  </div>
                </div>

                {price > 0 ? (
                      <>
                        <Button 
                          className="w-full text-sm sm:text-base" 
                          variant="primary" 
                          size="lg"
                          onClick={() => {
                            // TODO: Implement buy functionality
                            alert('Buy functionality coming soon!');
                          }}
                        >
                          Buy now
                        </Button>
                        <Button 
                          className="w-full text-sm sm:text-base" 
                          variant="secondary"
                          onClick={() => {
                            // TODO: Implement offer functionality
                            alert('Make offer coming soon!');
                          }}
                        >
                          Make offer
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full text-sm sm:text-base" 
                        variant="secondary" 
                        size="lg"
                        onClick={() => {
                          // TODO: Implement secondary marketplace link
                          alert('Secondary marketplace coming soon!');
                        }}
                      >
                        View on secondary
                      </Button>
                    )}

                <div className="pt-4 border-t border-line">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <div className="text-muted mb-0.5 sm:mb-1">Top offer</div>
                      <div className="font-semibold text-text">-- ETH</div>
                    </div>
                    <div>
                      <div className="text-muted mb-0.5 sm:mb-1">Collection floor</div>
                      <div className="font-semibold text-text">0.1000 ETH</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Item Info */}
            <Card className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <div className="text-muted mb-1">Token ID</div>
                    <div className="font-semibold text-text">
                      #{item.token_id || item.id}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted mb-1">Chain</div>
                    <div className="font-semibold text-text">Base</div>
                  </div>
                  <div>
                    <div className="text-muted mb-1">Contract</div>
                    <div className="font-semibold text-text font-mono text-xs truncate">
                      {item.contract || '0x...'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted mb-1">Token standard</div>
                    <div className="font-semibold text-text">
                      {item.edition_type === '1of1' ? 'ERC-721' : 'ERC-1155'}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted mb-1">Edition type</div>
                    <div className="font-semibold text-text">
                      {editionInfo.label}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted mb-1">Supply</div>
                    <div className="font-semibold text-text">
                      {editionInfo.value}
                    </div>
                  </div>
                </div>

                {item.post_features?.emotion && (
                  <div className="pt-4 border-t border-line">
                    <div className="text-muted mb-2">Emotion</div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-md text-sm font-medium bg-${
                          item.post_features.emotion.tone
                        }/20 text-${item.post_features.emotion.tone}`}
                      >
                        {item.post_features.emotion.tone}
                      </span>
                      <span className="text-xs text-muted">
                        Influence: {item.post_features.influence_score?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-6 md:mt-12">
          <div className="flex items-center gap-1 border-b border-line mb-4 md:mb-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'details', label: 'Details' },
              { id: 'orders', label: 'Orders' },
              { id: 'activity', label: 'Activity' },
              { id: 'traits', label: 'Traits' },
              { id: 'price-history', label: 'Price history' },
              { id: 'about', label: 'About' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors relative shrink-0
                  ${
                    activeTab === tab.id
                      ? 'text-text'
                      : 'text-muted hover:text-text'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
                )}
              </button>
            ))}
          </div>

            {/* Tab Content */}
            <Card className="p-4 sm:p-6 md:p-8">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Twitter-like Post Display (Main Minted Post) */}
                  <Card className="p-4 md:p-6 bg-panel2">
                  <div className="flex gap-4">
                    {item.users?.avatar_url ? (
                      <img
                        src={item.users.avatar_url}
                        alt={item.users.handle}
                        className="h-12 w-12 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <Avatar2D name={item.users?.display_name || item.users?.handle || 'unknown'} size="lg" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-text">
                          {item.users?.display_name || item.users?.handle || 'unknown'}
                        </span>
                        {item.users?.verified && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // TODO: Navigate to verification info or user profile
                              alert(`@${item.users?.handle || 'unknown'} is a verified creator`);
                            }}
                            className="group/verify"
                            title="Verified creator"
                            aria-label="Verified creator"
                          >
                            <svg
                              className="w-4 h-4 text-brand-400 shrink-0 transition-colors group-hover/verify:text-brand-300 cursor-pointer"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                        <span className="text-sm text-subtle">
                          @{item.users?.handle || 'unknown'}
                        </span>
                      </div>
                      <time className="text-sm text-subtle block mt-0.5">
                        {formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                        })}
                      </time>
                      <div className="text-text leading-relaxed whitespace-pre-wrap break-words mb-4 text-base mt-2">
                        {item.body}
                      </div>
                      {item.media_url && (
                        <div className="rounded-lg overflow-hidden border border-line mb-4">
                          <img
                            src={item.media_url}
                            alt=""
                            className="w-full h-auto max-h-96 object-contain"
                          />
                        </div>
                      )}
                      
                      {/* Engagement Actions (Twitter-style) - Horizontal Scroll */}
                      <div className="pt-4 border-t border-line">
                        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide pb-2 -mb-2">
                          {/* Comments */}
                          <button className="flex items-center gap-2 text-muted hover:text-text transition-colors group shrink-0">
                            <div className="p-2 rounded-full group-hover:bg-brand-500/10 transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm whitespace-nowrap">
                              {item.comments_count || 0}
                            </span>
                          </button>

                          {/* Retweets/Shares */}
                          <button className="flex items-center gap-2 text-muted hover:text-text transition-colors group shrink-0">
                            <div className="p-2 rounded-full group-hover:bg-brand-500/10 transition-colors">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                              </svg>
                            </div>
                            <span className="text-sm whitespace-nowrap">
                              {item.retweets_count || 0}
                            </span>
                          </button>

                          {/* Likes */}
                          <button
                            onClick={() => setIsLiked(!isLiked)}
                            className="flex items-center gap-2 text-muted hover:text-text transition-colors group shrink-0"
                          >
                            <div className={`p-2 rounded-full transition-colors ${isLiked ? 'bg-anger/10' : 'group-hover:bg-anger/10'}`}>
                              <svg
                                className={`w-5 h-5 ${isLiked ? 'fill-anger text-anger' : ''}`}
                                fill={isLiked ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <span className="text-sm whitespace-nowrap">
                              {(item.likes_count || 0) + (isLiked ? 1 : 0)}
                            </span>
                          </button>

                          {/* Views */}
                          <div className="flex items-center gap-2 text-muted shrink-0">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm whitespace-nowrap">
                              {item.views_count || 0}
                            </span>
                          </div>

                          {/* Bookmark */}
                          <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className="flex items-center gap-2 text-muted hover:text-text transition-colors group shrink-0"
                          >
                            <div className={`p-2 rounded-full transition-colors ${isBookmarked ? 'bg-brand-500/10' : 'group-hover:bg-brand-500/10'}`}>
                              <svg
                                className={`w-5 h-5 ${isBookmarked ? 'fill-brand-400 text-brand-400' : ''}`}
                                fill={isBookmarked ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                              </svg>
                            </div>
                          </button>

                          {/* Share */}
                          <button className="flex items-center gap-2 text-muted hover:text-text transition-colors group shrink-0">
                            <div className="p-2 rounded-full group-hover:bg-brand-500/10 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                              </svg>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </Card>

              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center text-muted py-12">
                <div className="text-lg font-medium mb-2">No active orders</div>
                <div className="text-sm">Check back later for listings</div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-text mb-4">
                  Activity History
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-panel2 border border-line">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-curiosity" />
                    <div className="flex-1">
                      <div className="text-text font-medium">Minted</div>
                      <div className="text-xs text-muted">
                        {formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-text font-medium">
                        by @{item.users?.handle || 'unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'traits' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-text mb-4">Traits</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {item.post_features?.emotion && (
                    <Card className="p-4">
                      <div className="text-xs text-muted mb-1">Emotion</div>
                      <div className="font-semibold text-text capitalize">
                        {item.post_features.emotion.tone}
                      </div>
                    </Card>
                  )}
                  <Card className="p-4">
                    <div className="text-xs text-muted mb-1">Edition Type</div>
                    <div className="font-semibold text-text">
                      {item.edition_type}
                    </div>
                  </Card>
                  {item.post_features?.influence_score && (
                    <Card className="p-4">
                      <div className="text-xs text-muted mb-1">Influence</div>
                      <div className="font-semibold text-text">
                        {item.post_features.influence_score.toFixed(1)}
                      </div>
                    </Card>
                  )}
                  <Card className="p-4">
                    <div className="text-xs text-muted mb-1">Media Type</div>
                    <div className="font-semibold text-text capitalize">
                      {item.kind || 'text'}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'price-history' && (
              <div className="text-center text-muted py-12">
                <div className="text-lg font-medium mb-2">No price history</div>
                <div className="text-sm">
                  This item hasn't been sold yet
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-text mb-4">About</h3>
                <div className="text-muted leading-relaxed">
                  <p>
                    This neural thought was minted as an NFT on Base blockchain.
                    Collecting it will absorb its meaning and emotion into your
                    3D brain visualization.
                  </p>
                  {item.users?.handle && (
                    <p className="mt-4">
                      Created by{' '}
                      <span className="text-brand-400 font-medium">
                        @{item.users.handle}
                      </span>
                      , a creator in the ThreadMint network.
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Comments Thread - Always visible */}
        <div className="mt-6 md:mt-12">
          <Card className="p-4 sm:p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-semibold text-text mb-4 md:mb-6">Comments</h3>
            <CommentThread 
              postId={item.id} 
              commentsCount={item.comments_count || 0}
            />
          </Card>
        </div>

        {/* More from Collection */}
        {relatedItems && relatedItems.length > 0 && (
          <div className="mt-6 md:mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-text mb-4 md:mb-6">
              More from @{item.users?.handle || 'this creator'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {relatedItems.map((relatedItem: any) => {
                const itemSlug = relatedItem.id || relatedItem.body?.replace(/\s+/g, '-').toLowerCase().substring(0, 50);
                return (
                  <NFTCard
                    key={relatedItem.id}
                    id={relatedItem.id}
                    image={relatedItem.media_url}
                    title={
                      relatedItem.body
                        ? relatedItem.body.substring(0, 50) + (relatedItem.body.length > 50 ? '...' : '')
                        : 'Neural Thought'
                    }
                    body={relatedItem.body}
                    emotion={relatedItem.post_features?.emotion?.tone}
                    price={
                      relatedItem.price_wei
                        ? (Number(relatedItem.price_wei) / 1e18).toFixed(4)
                        : '0'
                    }
                    creator={relatedItem.users?.display_name || relatedItem.users?.handle || 'unknown'}
                    creatorHandle={relatedItem.users?.handle}
                    creatorAvatar={relatedItem.users?.avatar_url}
                    creatorVerified={relatedItem.users?.verified || false}
                    createdAt={relatedItem.created_at}
                    comments={relatedItem.comments_count || 0}
                    retweets={relatedItem.retweets_count || 0}
                    likes={relatedItem.likes_count || 0}
                    views={relatedItem.views_count || 0}
                    scarcity={relatedItem.edition_type || '1of1'}
                    left={
                      relatedItem.editions ? relatedItem.editions - (relatedItem.sold || 0) : undefined
                    }
                    onCollect={() => {}}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

