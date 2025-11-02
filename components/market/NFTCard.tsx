'use client';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar2D } from '../profile/Avatar2D';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useState, memo, useMemo } from 'react';

interface NFTCardProps {
  id?: string;
  image?: string;
  title: string;
  body?: string;
  emotion?: string;
  price: string;
  creator: string;
  creatorHandle?: string; // Optional separate handle for @username
  creatorAvatar?: string;
  creatorVerified?: boolean;
  createdAt?: string | Date;
  comments?: number;
  retweets?: number;
  likes?: number;
  views?: number;
  bookmarked?: boolean;
  scarcity: '1of1' | 'limited' | 'open' | 'allowlist';
  left?: number;
  onCollect: () => void;
}

function NFTCardComponent({
  id,
  image,
  title,
  body,
  emotion = 'curiosity',
  price,
  creator,
  creatorHandle,
  creatorAvatar,
  creatorVerified = false,
  createdAt,
  comments = 0,
  retweets = 0,
  likes = 0,
  views = 0,
  bookmarked = false,
  scarcity,
  left,
  onCollect,
}: NFTCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [isLiked, setIsLiked] = useState(false);

  const timeStr = createdAt
    ? formatDistanceToNow(
        typeof createdAt === 'string' ? new Date(createdAt) : createdAt,
        { addSuffix: true }
      )
    : '';

  const displayBody = body || title;
  const chipCls = {
    joy: 'bg-joy/20 text-joy',
    calm: 'bg-calm/20 text-calm',
    curiosity: 'bg-curiosity/20 text-curiosity',
    anger: 'bg-anger/20 text-anger',
    sadness: 'bg-sadness/20 text-sadness',
    awe: 'bg-awe/30 text-[#3b1a5a]',
  }[emotion];

  const scarcityLabel =
    scarcity === '1of1'
      ? 'Unique • 1/1'
      : scarcity === 'limited'
        ? `${left} left`
        : scarcity === 'open'
          ? 'Open Edition'
          : 'Allowlist';

  const itemSlug = id || title.replace(/\s+/g, '-').toLowerCase().substring(0, 50);
  
  return (
    <Link href={`/item/${itemSlug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Card className="overflow-hidden bg-panel2" hover>
          {/* Creator Header */}
          <div className="p-3 pb-2 flex items-center gap-2">
            {creatorAvatar ? (
              <img
                src={creatorAvatar}
                alt={creator}
                className="h-8 w-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <Avatar2D name={creator} size="sm" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-text text-sm truncate">
                  {creator}
                </span>
                {creatorVerified && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // TODO: Navigate to verification info or user profile
                      alert(`@${creatorHandle || creator} is a verified creator`);
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
              </div>
              <div className="text-xs text-muted">
                <span>@{creatorHandle || creator.toLowerCase().replace(/\s+/g, '_')}</span>
              </div>
              {timeStr && (
                <div className="text-xs text-muted mt-0.5">
                  <span>{timeStr}</span>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          {displayBody && (
            <div className="px-3 pb-2">
              <p className="text-text text-sm leading-relaxed line-clamp-2">
                {displayBody}
              </p>
            </div>
          )}

          {/* Media */}
          <div className="aspect-square bg-elev relative overflow-hidden group">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand-500/10 via-curiosity/10 to-brand-500/10">
                <span className="text-5xl opacity-60">🧠</span>
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>

          {/* Engagement Metrics */}
          <div className="p-3 pt-2 space-y-2">
            {/* Engagement Stats - Horizontal Scroll */}
            <div className="overflow-x-auto scrollbar-hide pb-1 -mb-1">
              <div className="flex items-center gap-4 min-w-max">
                {comments > 0 && (
                  <button className="flex items-center gap-1 hover:text-text transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs whitespace-nowrap">{comments > 999 ? `${(comments / 1000).toFixed(1)}K` : comments}</span>
                  </button>
                )}
                {retweets > 0 && (
                  <button className="flex items-center gap-1 hover:text-text transition-colors shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    <span className="text-xs whitespace-nowrap">{retweets > 999 ? `${(retweets / 1000).toFixed(1)}K` : retweets}</span>
                  </button>
                )}
                {likes > 0 && (
                  <button
                    className="flex items-center gap-1 hover:text-text transition-colors shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsLiked(!isLiked);
                    }}
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
                    <span className="text-xs whitespace-nowrap">{likes > 999 ? `${(likes / 1000).toFixed(1)}K` : likes}</span>
                  </button>
                )}
                {views > 0 && (
                  <div className="flex items-center gap-1 shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs whitespace-nowrap">{views > 999 ? `${(views / 1000).toFixed(1)}K` : views}</span>
                  </div>
                )}
                {/* Bookmark */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsBookmarked(!isBookmarked);
                  }}
                  className="hover:text-text transition-colors shrink-0 ml-auto"
                >
                  <svg
                    className={`w-4 h-4 ${isBookmarked ? 'fill-brand-400 text-brand-400' : ''}`}
                    fill={isBookmarked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </button>
                {/* Share */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // TODO: Implement share
                  }}
                  className="hover:text-text transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Price & Collect */}
            <div className="flex items-center justify-between pt-2 border-t border-line">
              <div className="flex flex-col">
                <span className="text-xs text-muted mb-0.5">Price</span>
                <span className="text-sm font-bold text-text">{price} ETH</span>
              </div>
              <Button
                className="shrink-0"
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCollect();
                }}
                size="sm"
              >
                Buy now
              </Button>
            </div>
          </div>
        </Card>
    </motion.div>
    </Link>
  );
}

// Memoize component to prevent unnecessary re-renders
export const NFTCard = memo(NFTCardComponent, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.price === nextProps.price &&
    prevProps.likes === nextProps.likes &&
    prevProps.comments === nextProps.comments &&
    prevProps.image === nextProps.image
  );
});

