'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Card } from '../ui/Card';
import { UserMenu } from './UserMenu';
import { Avatar2D } from '../profile/Avatar2D';
import { LoginModal } from '../auth/LoginModal';
import { SignupModal } from '../auth/SignupModal';
import { useState } from 'react';
import { useSidebar } from '@/lib/sidebar-context';
import clsx from 'clsx';

export function Header() {
  const { address, isConnected } = useAccount();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { isHovered } = useSidebar();

  return (
    <header className={clsx(
      'fixed top-0 right-0 lg:right-80 z-50 bg-bg/95 backdrop-blur-sm border-b border-line transition-all duration-300 ease-in-out',
      'left-0 md:left-16',
      isHovered && 'md:left-64'
    )}>
      <div className="flex items-center px-3 sm:px-4 md:px-6 h-14 md:h-16 w-full gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden">
        {/* Mobile: Menu button (hidden as LeftRail has its own mobile menu) */}
        <div className="md:hidden shrink-0" />
        
        {/* Search - responsive sizing */}
        <div className="flex-1 md:flex-shrink-0 md:max-w-md md:mr-6 min-w-0 shrink">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-panel2 border border-line rounded-lg px-3 sm:px-4 py-2 pl-8 sm:pl-10 text-xs sm:text-sm text-text placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            <svg
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-subtle"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Right side: Profile & Wallet Connection - responsive */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
          {/* Profile Picture / User Menu */}
          <div className="shrink-0">
            <UserMenu onLoginClick={() => setShowLogin(true)} />
          </div>

          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          type="button"
                          className="bg-brand-500 hover:bg-brand-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">Connect Wallet</span>
                          <span className="sm:hidden">Connect</span>
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="bg-anger/20 text-anger px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm border border-anger/50 whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">Wrong network</span>
                          <span className="sm:hidden">Network</span>
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="hidden sm:flex items-center gap-1.5 md:gap-2 bg-panel2 hover:bg-panel border border-line rounded-lg px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm text-text transition-colors"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 14,
                                height: 14,
                                borderRadius: 999,
                                overflow: 'hidden',
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 14, height: 14 }}
                                />
                              )}
                            </div>
                          )}
                          <span className="hidden md:inline">{chain.name}</span>
                          <span className="md:hidden">{chain.name.split(' ')[0]}</span>
                        </button>

                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="flex items-center"
                        >
                          {account.ensAvatar ? (
                            <img
                              src={account.ensAvatar}
                              alt="Avatar"
                              className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full border-2 border-brand-500/50"
                            />
                          ) : (
                            <Avatar2D name={account.displayName || account.address || 'User'} size="sm" className="md:hidden" />
                          )}
                          {!account.ensAvatar && (
                            <div className="hidden md:block">
                              <Avatar2D name={account.displayName || account.address || 'User'} size="md" />
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>

        {/* Auth Modals */}
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
        <SignupModal
          isOpen={showSignup}
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      </div>
    </header>
  );
}

