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
  alt = 'ThreadMint Neural Network - Where\'s the Neuron?'
}: CollectionBannerProps) {
  const [neurons, setNeurons] = useState<any[]>([]);
  const [pathways, setPathways] = useState<any[]>([]);

  // Generate neurons only on client side to avoid hydration mismatch
  useEffect(() => {
    const random = seededRandom(12345); // Fixed seed for consistency
    
    const generateNeurons = (count: number) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: random() * 100,
        y: random() * 100,
        size: random() * 8 + 4, // 4-12px
        opacity: random() * 0.6 + 0.4, // 0.4-1.0
        pulse: random() * 2 + 1, // Animation delay
        color: ['brand', 'curiosity', 'joy', 'calm', 'awe'][Math.floor(random() * 5)],
      }));
    };

    const generatePathways = (count: number) => {
      return Array.from({ length: count }, () => {
        const x1 = random() * 100;
        const y1 = random() * 100;
        return {
          x1,
          y1,
          x2: x1 + (random() - 0.5) * 30,
          y2: y1 + (random() - 0.5) * 30,
        };
      });
    };

    setNeurons(generateNeurons(150));
    setPathways(generatePathways(80));
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

  return (
    <div className="relative w-full h-80 overflow-hidden">
      {/* Custom "Where's the Neuron" Banner */}
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
              fill="rgba(32, 129, 226, 0.1)"
              stroke="rgba(166, 128, 255, 0.2)"
              strokeWidth="2"
            />
            
            {/* Neural pathways - lots of connections */}
            {pathways.map((path, i) => (
              <line
                key={`path-${i}`}
                x1={`${path.x1}%`}
                y1={`${path.y1}%`}
                x2={`${path.x2}%`}
                y2={`${path.y2}%`}
                stroke="rgba(166, 128, 255, 0.15)"
                strokeWidth="1"
              />
            ))}
            
            {/* Scattered neurons everywhere - "Where's Wally" style */}
            {neurons.length > 0 && neurons.map((neuron) => {
              const colorMap = {
                brand: 'rgba(32, 129, 226, 0.8)',
                curiosity: 'rgba(166, 128, 255, 0.8)',
                joy: 'rgba(251, 191, 36, 0.8)',
                calm: 'rgba(52, 211, 153, 0.8)',
                awe: 'rgba(236, 72, 153, 0.8)',
              };
              
              return (
                <g key={neuron.id}>
                  {/* Neuron glow */}
                  <circle
                    cx={`${neuron.x}%`}
                    cy={`${neuron.y}%`}
                    r={neuron.size * 1.5}
                    fill={colorMap[neuron.color as keyof typeof colorMap]}
                    opacity={neuron.opacity * 0.3}
                  >
                    <animate
                      attributeName="opacity"
                      values={`${neuron.opacity * 0.3};${neuron.opacity * 0.6};${neuron.opacity * 0.3}`}
                      dur={`${neuron.pulse}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Neuron core */}
                  <circle
                    cx={`${neuron.x}%`}
                    cy={`${neuron.y}%`}
                    r={neuron.size}
                    fill={colorMap[neuron.color as keyof typeof colorMap]}
                    opacity={neuron.opacity}
                  >
                    <animate
                      attributeName="r"
                      values={`${neuron.size};${neuron.size * 1.2};${neuron.size}`}
                      dur={`${neuron.pulse * 0.8}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  {/* Neuron firing effect */}
                  <circle
                    cx={`${neuron.x}%`}
                    cy={`${neuron.y}%`}
                    r={neuron.size * 0.5}
                    fill="white"
                    opacity={neuron.opacity * 0.9}
                  >
                    <animate
                      attributeName="opacity"
                      values={`0;1;0`}
                      dur={`${neuron.pulse * 0.5}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
            
            {/* Special "Waldo" neuron - different, standing out */}
            <g className="animate-pulse">
              <circle
                cx="75%"
                cy="35%"
                r="12"
                fill="rgba(251, 191, 36, 0.9)"
                stroke="white"
                strokeWidth="3"
              />
              <circle
                cx="75%"
                cy="35%"
                r="6"
                fill="white"
              />
              {/* Special firing effect for the special neuron */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = 75 + Math.cos(angle) * 20;
                const y = 35 + Math.sin(angle) * 20;
                return (
                  <circle
                    key={`spark-${i}`}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="2"
                    fill="rgba(251, 191, 36, 1)"
                    opacity="0"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;1;0"
                      dur="2s"
                      begin={`${i * 0.25}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                );
              })}
            </g>
          </svg>
          
          {/* Overlay text hint */}
          <div className="absolute bottom-4 right-4 text-xs text-muted/60 font-medium bg-bg/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
            🧠 Find the special neuron!
          </div>
          
          {/* Decorative brain elements */}
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

