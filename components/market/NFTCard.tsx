'use client';

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface NFTCardProps {
  image?: string;
  title: string;
  emotion?: string;
  price: string;
  creator: string;
  scarcity: '1of1' | 'limited' | 'open' | 'allowlist';
  left?: number;
  onCollect: () => void;
}

export function NFTCard({
  image,
  title,
  emotion = 'curiosity',
  price,
  creator,
  scarcity,
  left,
  onCollect,
}: NFTCardProps) {
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden bg-panel2" hover>
        <div className="aspect-square bg-elev relative overflow-hidden rounded-t-lg group">
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
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between gap-2 min-h-[3rem]">
            <h3 className="text-text font-semibold text-sm leading-snug line-clamp-2 flex-1">
              {title}
            </h3>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-line">
            <div className="flex flex-col">
              <span className="text-xs text-muted mb-0.5">Price</span>
              <span className="text-sm font-bold text-text">{price} ETH</span>
            </div>
            <Button
              className="shrink-0"
              variant="primary"
              onClick={onCollect}
              size="sm"
            >
              Buy now
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

