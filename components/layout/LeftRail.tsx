'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAccount } from 'wagmi';
import { Avatar2D } from '../profile/Avatar2D';

// SVG Icon Components
const FeedIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const MarketplaceIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const DiscoverIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MindIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const LeaderboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const PacksIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BrainIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const navItems = [
  { href: '/', label: 'Feed', Icon: FeedIcon, description: 'Your neural feed' },
  { href: '/marketplace', label: 'Marketplace', Icon: MarketplaceIcon, description: 'Browse all neurons' },
  { href: '/discover', label: 'Discover', Icon: DiscoverIcon, description: 'Find new creators' },
  { href: '/mind', label: 'Mind', Icon: MindIcon, description: 'Your brain network' },
  { href: '/leaderboard', label: 'Leaderboard', Icon: LeaderboardIcon, description: 'Top creators' },
  { href: '/packs', label: 'Packs', Icon: PacksIcon, description: 'Neuron bundles' },
];

const secondaryNavItems = [
  { href: '/profile', label: 'Profile', Icon: ProfileIcon },
  { href: '/settings', label: 'Settings', Icon: SettingsIcon },
];

export function LeftRail() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  return (
    <div className="fixed left-0 top-0 h-screen w-16 hover:w-64 border-r border-line bg-panel flex flex-col z-40 transition-all duration-300 ease-in-out group overflow-hidden">
      {/* Logo Section - Collapsed shows icon only */}
      <div className="p-4 border-b border-line">
        <Link href="/" className="flex items-center gap-3 group/link">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-curiosity flex items-center justify-center text-white shadow-lg shrink-0">
            <BrainIcon className="w-5 h-5" />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
            <h1 className="text-lg font-bold text-text tracking-tight">
              ThreadMint
            </h1>
            <p className="text-xs text-muted mt-0.5">Neural Network</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/' && pathname === '/');
          const Icon = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group/item',
                isActive
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-muted hover:bg-panel2 hover:text-text'
              )}
              title={item.label}
            >
              <Icon className={clsx(
                'w-5 h-5 shrink-0 transition-transform',
                isActive && 'text-brand-400'
              )} />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden flex-1 min-w-0">
                <div className={clsx(
                  'font-medium text-sm',
                  isActive ? 'text-brand-400' : 'text-text'
                )}>
                  {item.label}
                </div>
                <div className="text-xs text-muted">
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-500 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-line mx-2" />

      {/* Secondary Navigation */}
      <nav className="p-2 space-y-1">
        {secondaryNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm group/item',
                isActive
                  ? 'bg-panel2 text-brand-400'
                  : 'text-muted hover:bg-panel2 hover:text-text'
              )}
              title={item.label}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      {isConnected && address && (
        <>
          <div className="border-t border-line mx-2" />
          <div className="p-2">
            <Link
              href="/profile"
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group/item',
                pathname === '/profile'
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-muted hover:bg-panel2 hover:text-text'
              )}
              title="My Profile"
            >
              <Avatar2D name={address} size="sm" />
              <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
                <div className="font-medium text-sm text-text truncate">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                <div className="text-xs text-muted">My Profile</div>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

