'use client';

import { NFTCard } from '@/components/market/NFTCard';
import { PostCard } from '@/components/post/PostCard';
import { Header } from '@/components/layout/Header';
import { LeftRail } from '@/components/layout/LeftRail';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';

export default function DiscoverPage() {
  const [view, setView] = useState<'grid' | 'feed'>('grid');

  const { data: items, isLoading } = useQuery({
    queryKey: ['discover'],
    queryFn: async () => {
      const res = await fetch('/api/market?sort=trending&limit=50');
      return res.json();
    },
  });

  return (
    <>
      <LeftRail />
      <div className="ml-0 md:ml-16 md:group-hover:ml-64 mr-0 lg:mr-80 min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        <div className="pt-14 md:pt-16 px-4 md:px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">Discover</h1>
                <p className="text-xs md:text-sm text-subtle">
                  Find neurons that resonate with you
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('grid')}
                  className={`px-3 md:px-4 py-2 rounded-md border text-xs md:text-sm ${
                    view === 'grid'
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                      : 'bg-panel2 border-line text-muted'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setView('feed')}
                  className={`px-3 md:px-4 py-2 rounded-md border text-xs md:text-sm ${
                    view === 'feed'
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                      : 'bg-panel2 border-line text-muted'
                  }`}
                >
                  Feed
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center text-subtle py-12">Loading...</div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items?.items?.map((item: any) => (
              <NFTCard
                key={item.id}
                id={item.id}
                image={item.media_url}
                title={item.body?.substring(0, 30) || 'Neuron'}
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
                left={item.editions ? item.editions - item.sold : undefined}
                onCollect={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {items?.items?.map((item: any) => (
              <PostCard
                key={item.id}
                avatar={item.users?.avatar_url || '/default-avatar.png'}
                handle={item.users?.handle || 'user'}
                time={item.created_at}
                body={item.body || ''}
                mediaUrl={item.media_url}
                minted={item.minted}
                price={
                  item.price_wei
                    ? (Number(item.price_wei) / 1e18).toFixed(4)
                    : undefined
                }
                scarcity={item.edition_type}
                remaining={
                  item.editions ? item.editions - item.sold : undefined
                }
                onMint={() => {}}
                onCollect={() => {}}
              />
            ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

