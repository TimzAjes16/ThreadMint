'use client';

import { LeftRail } from './LeftRail';
import { RightRail } from './RightRail';
import { PostCard } from '../post/PostCard';
import { CreatePost } from '../post/CreatePost';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function FeedLayout() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      return data.posts || [];
    },
  });

  const handlePostCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  return (
    <div className="flex min-h-screen">
      <LeftRail />
      <main className="flex-1 ml-64 mr-80">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text mb-2">Feed</h2>
            <p className="text-sm text-subtle">Explore the neural network</p>
          </div>

          <div className="space-y-4">
            <CreatePost onPostCreated={handlePostCreated} />

            {isLoading ? (
              <div className="text-center text-subtle py-12">Loading...</div>
            ) : data && data.length > 0 ? (
              data.map((post: any) => (
                <PostCard
                  key={post.id}
                  avatar={post.users?.avatar_url || '/default-avatar.png'}
                  handle={post.users?.handle || 'user'}
                  time={post.created_at || new Date()}
                  body={post.body || ''}
                  mediaUrl={post.media_url}
                  minted={post.minted || false}
                  price={
                    post.price_wei
                      ? `${Number(post.price_wei) / 1e18}`
                      : undefined
                  }
                  scarcity={post.edition_type as any}
                  remaining={
                    post.editions ? post.editions - (post.sold || 0) : undefined
                  }
                  onMint={() => {}}
                  onCollect={() => {}}
                />
              ))
            ) : (
              <div className="text-center text-subtle py-12">
                No posts yet. Create your first Echo!
              </div>
            )}
          </div>
        </div>
      </main>
      <aside className="fixed right-0 top-0 h-screen w-80 border-l border-line bg-panel overflow-y-auto p-6">
        <RightRail />
      </aside>
    </div>
  );
}

