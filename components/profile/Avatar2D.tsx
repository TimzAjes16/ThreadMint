'use client';

interface Avatar2DProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Generate consistent emoji avatar based on name
const getEmojiAvatar = (name: string): string => {
  // Use first letter of name to determine emoji
  const emojis = [
    '👤', '👨', '👩', '🧑', '👨‍💻', '👩‍💻', '🧑‍💻',
    '👨‍🎨', '👩‍🎨', '🧑‍🎨', '👨‍🔬', '👩‍🔬', '🧑‍🔬',
    '👨‍🚀', '👩‍🚀', '🧑‍🚀', '👨‍⚖️', '👩‍⚖️', '🧑‍⚖️',
    '🦸', '🦹', '🧙', '🧙‍♀️', '🧙‍♂️', '🧚', '🧚‍♀️',
    '🧚‍♂️', '🧜', '🧜‍♀️', '🧜‍♂️', '🧝', '🧝‍♀️', '🧝‍♂️',
  ];
  
  const index = name.charCodeAt(0) % emojis.length;
  return emojis[index];
};

export function Avatar2D({ name, size = 'md', className = '' }: Avatar2DProps) {
  const emoji = getEmojiAvatar(name);
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-base',
    md: 'h-10 w-10 text-lg',
    lg: 'h-12 w-12 text-xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-brand-500/20 to-curiosity/20 border-2 border-line flex items-center justify-center shrink-0 ${className}`}
    >
      <span>{emoji}</span>
    </div>
  );
}

