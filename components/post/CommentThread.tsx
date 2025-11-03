'use client';

import { Card } from '../ui/Card';
import { Avatar2D } from '../profile/Avatar2D';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '../auth/LoginModal';

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
  commentsCount?: number;
  onAddComment?: (text: string) => void;
}

export function CommentThread({ postId, comments = [], commentsCount, onAddComment }: CommentThreadProps) {
  const { user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  
  // Generate initial comments based on count or provided comments
  const generateDummyComments = (count: number): Comment[] => {
    const names = [
      { author: 'Neural Explorer', handle: 'neural_explorer', verified: true },
      { author: 'Crypto Philosopher', handle: 'philosopher_crypto', verified: true },
      { author: 'Base Builder', handle: 'base_builder', verified: false },
      { author: 'Mind Mapper', handle: 'mind_mapper', verified: true },
      { author: 'Thought Collector', handle: 'thought_collector', verified: false },
      { author: 'Neuron Network', handle: 'neuron_network', verified: true },
      { author: 'Blockchain Thinker', handle: 'blockchain_thinker', verified: false },
      { author: 'AI Enthusiast', handle: 'ai_enthusiast', verified: true },
      { author: 'Web3 Creator', handle: 'web3_creator', verified: true },
      { author: 'NFT Collector', handle: 'nft_collector', verified: false },
    ];
    
    const commentTexts: string[] = [
      'This thought really resonates with me. The concept of minting ideas as neurons is revolutionary!',
      'Agreed! Each neuron we collect expands our understanding. Great work!',
      'Building on this concept. Would love to see more of your thoughts!',
      'The neural reciprocity network is fascinating. Can\'t wait to see where this leads.',
      'This is exactly the kind of innovation the web3 space needs. Bravo!',
      'The idea of absorbing thoughts into your mind visualization is mind-blowing.',
      'Collecting this neuron immediately. The emotion and meaning are powerful.',
      'ThreadMint is changing how we think about social networks and NFTs.',
      'The psychology behind neural reciprocity is deep. Well explained!',
      'Love the visual representation. Makes the abstract tangible.',
    ];

    return Array.from({ length: count }, (_, i) => {
      const nameData = names[i % names.length];
      const commentText = commentTexts[i % commentTexts.length];
      const hoursAgo = (i * 2) + 1; // Stagger timestamps
      
      return {
        id: `comment-${i + 1}`,
        author: nameData.author,
        authorHandle: nameData.handle,
        body: commentText,
        createdAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000),
        likes: Math.floor(Math.random() * 100) + 5,
        authorVerified: nameData.verified,
      };
    });
  };

  // Initialize comments: use provided, or generate based on count, or fallback to 3
  const initialComments = comments.length > 0 
    ? comments 
    : generateDummyComments(commentsCount && commentsCount > 0 ? commentsCount : 3);
  
  const [localComments, setLocalComments] = useState<Comment[]>(initialComments);

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
    if (!user) {
      setShowLogin(true);
      return;
    }
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

  const handleReply = (commentId: string) => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setReplyingTo(replyingTo === commentId ? null : commentId);
    if (replyingTo !== commentId) {
      setReplyText('');
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (!isConnected) {
      setShowLogin(true);
      return;
    }
    if (!replyText.trim()) return;
    
    const reply: Comment = {
      id: `reply-${Date.now()}`,
      author: 'You',
      authorHandle: 'you',
      body: replyText,
      createdAt: new Date(),
      likes: 0,
      authorVerified: false,
    };
    
    // Add reply after the parent comment
    const parentIndex = localComments.findIndex(c => c.id === commentId);
    if (parentIndex !== -1) {
      const newComments = [...localComments];
      newComments.splice(parentIndex + 1, 0, reply);
      setLocalComments(newComments);
    } else {
      setLocalComments([...localComments, reply]);
    }
    
    setReplyText('');
    setReplyingTo(null);
  };

  // Use localComments (which includes user-added comments and replies)
  const displayComments = localComments;

  return (
    <div className="space-y-4">
      {/* Add Comment */}
      <Card className="p-4 bg-panel2">
        {!user ? (
          <div className="text-center py-4">
            <div className="text-2xl mb-2">🧙‍♂️</div>
            <p className="text-text font-medium mb-2">Sign in to comment</p>
            <p className="text-sm text-muted mb-4">Connect your wallet or sign in to join the conversation</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </Button>
          </div>
        ) : (
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
        )}
      </Card>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
        }}
      />

      {/* Comments List with Threading Lines */}
      <div className="space-y-0">
        {displayComments.map((comment, index) => {
          const isLiked = likedComments.has(comment.id);
          const isLast = index === displayComments.length - 1;
          const timeStr = formatDistanceToNow(
            typeof comment.createdAt === 'string'
              ? new Date(comment.createdAt)
              : comment.createdAt,
            { addSuffix: true }
          );

          return (
            <div key={comment.id} className="relative flex items-start pb-4">
              {/* Vertical Threading Line Container */}
              <div className="relative flex-shrink-0 mr-3 pt-2 h-full">
                {/* Avatar */}
                <div className="relative z-10">
                  {comment.authorAvatar ? (
                    <img
                      src={comment.authorAvatar}
                      alt={comment.author}
                      className="h-10 w-10 rounded-full object-cover border-2 border-bg"
                    />
                  ) : (
                    <Avatar2D name={comment.author} size="sm" />
                  )}
                </div>
                
                {/* Vertical line connecting to next comment - spans full height */}
                {!isLast && (
                  <div className="absolute left-1/2 top-10 bottom-0 w-0.5 bg-line/60 -translate-x-1/2 z-0" />
                )}
                
                {/* Horizontal connector line from avatar to content */}
                <div className="absolute left-full top-5 w-3 h-0.5 bg-line/60 z-0" />
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <Card className="hover:bg-panel2/50 transition-colors">
                  <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text text-sm">
                      {comment.author}
                    </span>
                    {comment.authorVerified && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // TODO: Navigate to verification info or user profile
                          alert(`@${comment.authorHandle || comment.author} is a verified creator`);
                        }}
                        className="group/verify"
                        title="Verified creator"
                        aria-label="Verified creator"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-brand-400 shrink-0 transition-colors group-hover/verify:text-brand-300 cursor-pointer"
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
                    <span className="text-xs text-muted">
                      @{comment.authorHandle}
                    </span>
                  </div>
                  <time className="text-xs text-muted block mt-0.5">{timeStr}</time>
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
                    <button 
                      onClick={() => handleReply(comment.id)}
                      className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
                    >
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
              </Card>
              
              {/* Reply Input - shown when replying to this comment */}
              {replyingTo === comment.id && (
                <div className="mt-3 ml-14">
                  <Card className="p-3 bg-panel2">
                    {!isConnected ? (
                      <div className="text-center py-2">
                        <p className="text-sm text-muted mb-2">Sign in to reply</p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setShowLogin(true)}
                        >
                          Sign In
                        </Button>
                      </div>
                    ) : (
                      <>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`Reply to @${comment.authorHandle}...`}
                          className="w-full bg-panel border border-line rounded-lg px-3 py-2 text-text text-sm placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={!replyText.trim()}
                          >
                            Reply
                          </Button>
                        </div>
                      </>
                    )}
                  </Card>
                </div>
              )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

