'use client';

import { Card } from '../ui/Card';
import { Avatar2D } from '../profile/Avatar2D';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Button } from '../ui/Button';

interface Comment {
  id: string;
  author: string;
  authorHandle: string;
  authorAvatar?: string;
  authorVerified?: boolean;
  body: string;
  createdAt: string | Date;
  likes: number;
  isLiked?: boolean;
}

interface CommentThreadProps {
  postId: string;
  comments?: Comment[];
  onAddComment?: (text: string) => void;
}

export function CommentThread({ postId, comments = [], onAddComment }: CommentThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handleLike = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'You',
      authorHandle: 'you',
      body: newComment,
      createdAt: new Date(),
      likes: 0,
      authorVerified: false,
    };
    
    setLocalComments([comment, ...localComments]);
    setNewComment('');
    onAddComment?.(newComment);
  };

  // Generate dummy comments if none provided
  const displayComments = localComments.length > 0 ? localComments : [
    {
      id: '1',
      author: 'Neural Explorer',
      authorHandle: 'neural_explorer',
      body: 'This thought really resonates with me. The concept of minting ideas as neurons is revolutionary!',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 23,
      authorVerified: true,
    },
    {
      id: '2',
      author: 'Crypto Philosopher',
      authorHandle: 'philosopher_crypto',
      body: 'Agreed! Each neuron we collect expands our understanding. Great work!',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 15,
      authorVerified: true,
    },
    {
      id: '3',
      author: 'Base Builder',
      authorHandle: 'base_builder',
      body: 'Building on this concept. Would love to see more of your thoughts!',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 8,
      authorVerified: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <Card className="p-4 bg-panel2">
        <div className="flex gap-3">
          <Avatar2D name="You" size="sm" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-panel border border-line rounded-lg px-4 py-2 text-text text-sm placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                disabled={!newComment.trim()}
              >
                Comment
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {displayComments.map((comment) => {
          const isLiked = likedComments.has(comment.id);
          const timeStr = formatDistanceToNow(
            typeof comment.createdAt === 'string'
              ? new Date(comment.createdAt)
              : comment.createdAt,
            { addSuffix: true }
          );

          return (
            <Card key={comment.id} className="p-4 hover:bg-panel2/50 transition-colors">
              <div className="flex gap-3">
                {comment.authorAvatar ? (
                  <img
                    src={comment.authorAvatar}
                    alt={comment.author}
                    className="h-10 w-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <Avatar2D name={comment.author} size="sm" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text text-sm">
                      {comment.author}
                    </span>
                    {comment.authorVerified && (
                      <svg
                        className="w-3.5 h-3.5 text-brand-400 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="text-xs text-muted">
                      @{comment.authorHandle}
                    </span>
                    <span className="text-xs text-muted">·</span>
                    <time className="text-xs text-muted">{timeStr}</time>
                  </div>
                  <p className="text-text text-sm leading-relaxed mb-2 whitespace-pre-wrap">
                    {comment.body}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
                    >
                      <svg
                        className={`w-4 h-4 ${isLiked ? 'fill-anger text-anger' : ''}`}
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
                      <span>{comment.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

