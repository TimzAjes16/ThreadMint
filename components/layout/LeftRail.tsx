'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const navItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/discover', label: 'Discover', icon: '🔍' },
  { href: '/mind', label: 'Mind', icon: '🧠' },
  { href: '/marketplace', label: 'Marketplace', icon: '🛒' },
  { href: '/leaderboard', label: 'Leaderboard', icon: '📊' },
  { href: '/packs', label: 'Packs', icon: '📦' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function LeftRail() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r border-line bg-panel/95 backdrop-blur-sm flex flex-col">
      <div className="p-6 border-b border-line">
        <h1 className="text-2xl font-bold text-text tracking-tight">ThreadMint</h1>
        <p className="text-xs text-muted mt-1.5 font-medium">Neural Reciprocity</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium',
                isActive
                  ? 'bg-brand-500/15 text-brand-400 border border-brand-500/30 shadow-sm'
                  : 'text-muted hover:bg-panel2 hover:text-text hover:border-line-hover border border-transparent'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-line">
        <ConnectButton />
      </div>
    </div>
  );
}

