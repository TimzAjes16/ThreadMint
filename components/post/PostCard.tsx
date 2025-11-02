'use client';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';

interface PostCardProps {
  avatar: string;
  handle: string;
  time: string | Date;
  body: string;
  mediaUrl?: string;
  minted: boolean;
  price?: string;
  scarcity?: '1of1' | 'limited' | 'open' | 'allowlist';
  remaining?: number;
  countdown?: string;
  onMint?: () => void;
  onCollect?: () => void;
}

export function PostCard({
  avatar,
  handle,
  time,
  body,
  mediaUrl,
  minted,
  price,
  scarcity,
  remaining,
  countdown,
  onMint,
  onCollect,
}: PostCardProps) {
  const timeStr =
    typeof time === 'string' ? time : formatDistanceToNow(time, { addSuffix: true });

  return (
    <Card className="p-5 hover:bg-panel2/50 transition-all duration-200 border-line">
      <div className="flex gap-3">
        <img
          src={avatar}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-subtle">
            <span className="text-text font-semibold">@{handle}</span>
            <span>·</span>
            <time>{timeStr}</time>
          </div>
          <p className="mt-2 text-[15px] leading-6 text-text whitespace-pre-wrap break-words">
            {body}
          </p>
          {mediaUrl && (
            <div className="mt-3 rounded-md border border-line overflow-hidden">
              <img
                src={mediaUrl}
                alt=""
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {!minted ? (
              <Button onClick={onMint} variant="primary">
                Mint as Neuron
              </Button>
            ) : (
              <>
                <span className="text-xs px-2 py-1 rounded-xs border border-line text-muted">
                  {scarcity === '1of1' && 'Unique 1/1'}
                  {scarcity === 'limited' && `${remaining} left`}
                  {scarcity === 'open' && `Ends in ${countdown}`}
                  {scarcity === 'allowlist' && 'Allowlist'}
                </span>
                {price && (
                  <span className="text-sm text-muted border border-line rounded-xs px-2 py-1">
                    Price: {price} ETH
                  </span>
                )}
                <Button onClick={onCollect} variant="secondary">
                  Collect & Absorb
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

