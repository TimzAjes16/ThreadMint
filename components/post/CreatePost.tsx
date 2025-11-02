'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [body, setBody] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!body.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Get userId from auth
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: 'temp', // Replace with actual user ID
          kind: 'text',
          body,
          mediaUrl: mediaUrl || undefined,
        }),
      });

      if (res.ok) {
        setBody('');
        setMediaUrl('');
        onPostCreated?.();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full bg-panel2 border border-line rounded-md px-4 py-3 text-text resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/60"
        rows={4}
      />
      {mediaUrl && (
        <div className="mt-3">
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="Media URL (optional)"
            className="w-full bg-panel2 border border-line rounded-md px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-brand-500/60"
          />
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => {}}
            className="text-muted hover:text-text transition-colors"
            title="Add image"
          >
            📷
          </button>
          <button
            onClick={() => {}}
            className="text-muted hover:text-text transition-colors"
            title="Add audio"
          >
            🎵
          </button>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!body.trim() || isSubmitting}
          variant="primary"
        >
          {isSubmitting ? 'Posting...' : 'Echo'}
        </Button>
      </div>
    </Card>
  );
}

