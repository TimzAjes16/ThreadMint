'use client';

import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '../ui/Card';
import { Avatar2D } from '../profile/Avatar2D';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface UserMenuProps {
  avatarUrl?: string;
  onLoginClick?: () => void;
}

export function UserMenu({ avatarUrl, onLoginClick }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { address, isConnected } = useAccount();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayName = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : 'Guest';

  const handleClick = () => {
    if (!user && !isConnected) {
      // If not authenticated or connected, open login modal directly
      setIsOpen(false);
      onLoginClick?.();
    } else {
      // If authenticated or connected, toggle dropdown menu
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleClick}
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50 rounded-lg"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-10 w-10 rounded-full border-2 border-brand-500/50 object-cover"
          />
        ) : (
          <Avatar2D name={displayName} size="md" />
        )}
      </button>

      {isOpen && (user || isConnected) && (
        <Card className="absolute right-0 top-12 w-64 p-2 bg-panel border-2 border-line shadow-lg z-50">
          <div className="space-y-1">
            <div className="px-4 py-3 border-b border-line">
              <div className="font-semibold text-text">{displayName}</div>
              <div className="text-xs text-muted truncate">{address}</div>
            </div>

            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-text hover:bg-panel2 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              👤 Profile
            </Link>
            <Link
              href="/mind"
              className="block px-4 py-2 text-sm text-text hover:bg-panel2 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              🧠 My Mind
            </Link>
            <Link
              href="/collections"
              className="block px-4 py-2 text-sm text-text hover:bg-panel2 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              📦 My Collections
            </Link>
            <div className="border-t border-line my-1" />
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-text hover:bg-panel2 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              ⚙️ Settings
            </Link>
            <Link
              href="/help"
              className="block px-4 py-2 text-sm text-text hover:bg-panel2 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              ❓ Help & Support
            </Link>
            <div className="border-t border-line my-1" />
            <button
              className="w-full text-left px-4 py-2 text-sm text-anger hover:bg-panel2 rounded-lg transition-colors"
              onClick={async () => {
                await signOut();
                setIsOpen(false);
              }}
            >
              Sign Out
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

