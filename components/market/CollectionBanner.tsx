'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface CollectionBannerProps {
  imageUrl?: string;
  alt?: string;
}

// Seeded random number generator for consistent SSR/client results
function seededRandom(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function CollectionBanner({ 
  imageUrl,
  alt = 'Where\'s Wally - Neural Workers inside a Brain'
}: CollectionBannerProps) {
  const [workers, setWorkers] = useState<any[]>([]);
  const [pathways, setPathways] = useState<any[]>([]);

  // Generate workers only on client side to avoid hydration mismatch
  useEffect(() => {
    const random = seededRandom(12345); // Fixed seed for consistency
    
    const generateWorkers = (count: number) => {
      const workerTypes = ['typewriter', 'desk', 'lab', 'data', 'network'];
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: random() * 85 + 7.5, // Keep within brain bounds
        y: random() * 75 + 12.5,
        type: workerTypes[Math.floor(random() * workerTypes.length)],
        size: random() * 6 + 8, // 8-14px
        rotation: random() * 360,
        color: ['brand', 'curiosity', 'joy', 'calm', 'awe'][Math.floor(random() * 5)],
      }));
    };

    const generatePathways = (count: number) => {
      return Array.from({ length: count }, () => {
        const x1 = random() * 85 + 7.5;
        const y1 = random() * 75 + 12.5;
        return {
          x1,
          y1,
          x2: x1 + (random() - 0.5) * 25,
          y2: y1 + (random() - 0.5) * 25,
        };
      });
    };

    setWorkers(generateWorkers(40)); // Fewer workers, more detailed
    setPathways(generatePathways(60));
  }, []);
  const brainOutline = [
    { x: 30, y: 10 },
    { x: 20, y: 25 },
    { x: 15, y: 45 },
    { x: 18, y: 65 },
    { x: 25, y: 80 },
    { x: 40, y: 88 },
    { x: 50, y: 85 },
    { x: 60, y: 88 },
    { x: 75, y: 80 },
    { x: 82, y: 65 },
    { x: 85, y: 45 },
    { x: 80, y: 25 },
    { x: 70, y: 10 },
    { x: 50, y: 8 },
    { x: 30, y: 10 },
  ];

  const colorMap = {
    brand: 'rgba(32, 129, 226, 0.9)',
    curiosity: 'rgba(166, 128, 255, 0.9)',
    joy: 'rgba(251, 191, 36, 0.9)',
    calm: 'rgba(52, 211, 153, 0.9)',
    awe: 'rgba(236, 72, 153, 0.9)',
  };

  const renderWorker = (worker: any) => {
    const { x, y, type, size, rotation, color } = worker;
    const baseColor = colorMap[color as keyof typeof colorMap];

    return (
      <g
        key={worker.id}
        transform={`translate(${x}%, ${y}%) rotate(${rotation})`}
      >
        {type === 'typewriter' && (
          <>
            {/* Typewriter body */}
            <rect x="-8" y="-4" width="16" height="8" rx="2" fill={baseColor} opacity="0.8" />
            {/* Keyboard keys */}
            <rect x="-6" y="2" width="3" height="2" rx="0.5" fill={baseColor} opacity="0.9" />
            <rect x="-2" y="2" width="3" height="2" rx="0.5" fill={baseColor} opacity="0.9" />
            <rect x="2" y="2" width="3" height="2" rx="0.5" fill={baseColor} opacity="0.9" />
            {/* Paper scroll */}
            <rect x="-7" y="-6" width="14" height="2" rx="1" fill="white" opacity="0.9" />
            {/* Neural data lines */}
            <path
              d="M -6 -6 Q 0 -10 6 -6"
              stroke="white"
              strokeWidth="0.5"
              fill="none"
              opacity="0.6"
            />
          </>
        )}
        {type === 'desk' && (
          <>
            {/* Desk */}
            <rect x="-10" y="0" width="20" height="4" rx="1" fill={baseColor} opacity="0.7" />
            {/* Worker figure (simplified) */}
            <circle cx="0" cy="-6" r="4" fill={baseColor} opacity="0.8" />
            <rect x="-2" y="-2" width="4" height="6" rx="1" fill={baseColor} opacity="0.8" />
            {/* Neural signals */}
            <circle cx="-8" cy="2" r="2" fill="white" opacity="0.7">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="8" cy="2" r="2" fill="white" opacity="0.7">
              <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
        {type === 'lab' && (
          <>
            {/* Lab equipment */}
            <circle cx="0" cy="0" r="6" fill="none" stroke={baseColor} strokeWidth="2" opacity="0.8" />
            <circle cx="0" cy="0" r="3" fill={baseColor} opacity="0.6">
              <animate attributeName="r" values="3;4;3" dur="3s" repeatCount="indefinite" />
            </circle>
            {/* Neural connections */}
            <line x1="-6" y1="-6" x2="6" y2="6" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="6" y1="-6" x2="-6" y2="6" stroke="white" strokeWidth="1" opacity="0.5" />
          </>
        )}
        {type === 'data' && (
          <>
            {/* Data processing unit */}
            <rect x="-6" y="-6" width="12" height="12" rx="2" fill={baseColor} opacity="0.7" />
            {/* Data lines */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={-6 + i * 4}
                y1="-6"
                x2={-6 + i * 4}
                y2="6"
                stroke="white"
                strokeWidth="1"
                opacity="0.6"
              />
            ))}
            {/* Processing indicator */}
            <circle cx="0" cy="0" r="2" fill="white" opacity="0.9">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
        {type === 'network' && (
          <>
            {/* Network node */}
            <circle cx="0" cy="0" r="5" fill={baseColor} opacity="0.8">
              <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Connections */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = (i / 5) * Math.PI * 2;
              const x2 = Math.cos(angle) * 8;
              const y2 = Math.sin(angle) * 8;
              return (
                <line
                  key={i}
                  x1="0"
                  y1="0"
                  x2={x2}
                  y2={y2}
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.5"
                />
              );
            })}
          </>
        )}
      </g>
    );
  };

  return (
    <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
      {/* Custom "Where's Wally" Neural Workers Banner */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-brand-900/40 via-curiosity-900/30 to-brand-900/40 relative">
          {/* Brain Outline as Background */}
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0"
            preserveAspectRatio="none"
          >
            {/* Brain silhouette */}
            <path
              d={`M ${brainOutline.map(p => `${p.x}% ${p.y}%`).join(' L ')} Z`}
              fill="rgba(32, 129, 226, 0.15)"
              stroke="rgba(166, 128, 255, 0.3)"
              strokeWidth="3"
            />
            
            {/* Neural pathways connecting workers */}
            {pathways.map((path, i) => (
              <line
                key={`path-${i}`}
                x1={`${path.x1}%`}
                y1={`${path.y1}%`}
                x2={`${path.x2}%`}
                y2={`${path.y2}%`}
                stroke="rgba(166, 128, 255, 0.2)"
                strokeWidth="1.5"
              >
                <animate
                  attributeName="opacity"
                  values="0.1;0.3;0.1"
                  dur={`${3 + (i % 3)}s`}
                  repeatCount="indefinite"
                />
              </line>
            ))}
            
            {/* Workers doing neuron work - "Where's Wally" style */}
            {workers.length > 0 && workers.map(renderWorker)}
            
            {/* Special "Waldo" worker - at typewriter, different color, more prominent */}
            <g className="animate-pulse" transform="translate(72%, 32%)">
              {/* Waldo's typewriter */}
              <rect x="-10" y="-5" width="20" height="10" rx="3" fill="rgba(251, 191, 36, 0.9)" stroke="white" strokeWidth="2" />
              {/* Typewriter keys */}
              <rect x="-8" y="3" width="3" height="2.5" rx="0.5" fill="rgba(251, 191, 36, 1)" />
              <rect x="-3" y="3" width="3" height="2.5" rx="0.5" fill="rgba(251, 191, 36, 1)" />
              <rect x="2" y="3" width="3" height="2.5" rx="0.5" fill="rgba(251, 191, 36, 1)" />
              {/* Paper with neural data */}
              <rect x="-9" y="-8" width="18" height="3" rx="1" fill="white" opacity="0.95" />
              <path
                d="M -8 -7 Q 0 -12 8 -7"
                stroke="rgba(166, 128, 255, 0.9)"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Waldo figure (simplified) */}
              <circle cx="0" cy="-12" r="5" fill="rgba(251, 191, 36, 0.9)" stroke="white" strokeWidth="2" />
              <rect x="-3" y="-7" width="6" height="8" rx="2" fill="rgba(251, 191, 36, 0.9)" />
              {/* Neural signals pulsing */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const x = Math.cos(angle) * 15;
                const y = Math.sin(angle) * 15;
                return (
                  <circle
                    key={`waldo-spark-${i}`}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="rgba(251, 191, 36, 1)"
                    opacity="0"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;1;0"
                      dur="2s"
                      begin={`${i * 0.33}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                );
              })}
            </g>
          </svg>
          
          {/* Overlay text hint */}
          <div className="absolute bottom-4 right-4 text-xs text-muted/60 font-medium bg-bg/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
            🎯 Find Waldo working on the neural network!
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-8 left-8 text-6xl opacity-10 rotate-12">🧠</div>
          <div className="absolute bottom-12 left-16 text-5xl opacity-10 -rotate-12">⚡</div>
          <div className="absolute top-16 right-12 text-5xl opacity-10 rotate-12">💭</div>
        </div>
      )}
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
    </div>
  );
}

