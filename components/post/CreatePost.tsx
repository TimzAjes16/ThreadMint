'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '@/lib/auth-context';
import { useQueryClient } from '@tanstack/react-query';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [body, setBody] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [kind, setKind] = useState<'text' | 'image' | 'audio' | 'video'>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <Card className="p-4 text-center bg-panel2 border-dashed border-2 border-line">
        <p className="text-muted mb-3">Sign in to create a post</p>
        <Button variant="secondary" onClick={() => {
          // This will be handled by header login button
          const event = new CustomEvent('openLogin');
          window.dispatchEvent(event);
        }}>
          Sign In
        </Button>
      </Card>
    );
  }

  const handleSubmit = async () => {
    if (!body.trim()) {
      setError('Post cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: user.id,
          kind,
          body,
          mediaUrl: mediaUrl || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.post) {
        setBody('');
        setMediaUrl('');
        setKind('text');
        setError('');
        
        // Invalidate queries to refresh feed
        queryClient.invalidateQueries({ queryKey: ['marketplace'] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        
        onPostCreated?.();
      } else {
        setError(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500/20 to-curiosity/20 border-2 border-line flex items-center justify-center shrink-0">
          🧠
        </div>
        <div className="flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-panel2 border border-line rounded-md px-4 py-3 text-text resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/60"
            rows={4}
            disabled={isSubmitting}
          />
          
          {error && (
            <div className="mt-2 bg-anger/20 text-anger px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {mediaUrl && (
            <div className="mt-3">
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="Media URL (image, video, audio)"
                className="w-full bg-panel2 border border-line rounded-md px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/60"
                disabled={isSubmitting}
              />
              {mediaUrl && (
                <button
                  onClick={() => setMediaUrl('')}
                  className="mt-2 text-xs text-anger hover:text-anger/80"
                >
                  Remove media
                </button>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setKind('image')}
                className={`p-2 rounded-lg transition-colors ${
                  kind === 'image'
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-muted hover:text-text hover:bg-panel2'
                }`}
                title="Add image"
                disabled={isSubmitting}
              >
                📷
              </button>
              <button
                onClick={() => setKind('audio')}
                className={`p-2 rounded-lg transition-colors ${
                  kind === 'audio'
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-muted hover:text-text hover:bg-panel2'
                }`}
                title="Add audio"
                disabled={isSubmitting}
              >
                🎵
              </button>
              <button
                onClick={() => setKind('video')}
                className={`p-2 rounded-lg transition-colors ${
                  kind === 'video'
                    ? 'bg-brand-500/20 text-brand-400'
                    : 'text-muted hover:text-text hover:bg-panel2'
                }`}
                title="Add video"
                disabled={isSubmitting}
              >
                🎬
              </button>
              {kind !== 'text' && (
                <button
                  onClick={() => setKind('text')}
                  className="px-3 py-2 text-xs text-muted hover:text-text transition-colors"
                  disabled={isSubmitting}
                >
                  Text only
                </button>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!body.trim() || isSubmitting}
              variant="primary"
            >
              {isSubmitting ? 'Posting...' : 'Echo'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
