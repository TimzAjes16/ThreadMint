'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Card } from '../ui/Card';
import { UserMenu } from './UserMenu';
import { Avatar2D } from '../profile/Avatar2D';
import { LoginModal } from '../auth/LoginModal';
import { SignupModal } from '../auth/SignupModal';
import { useState } from 'react';

export function Header() {
  const { address, isConnected } = useAccount();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <header className="fixed top-0 left-16 group-hover:left-64 right-80 z-50 bg-bg/95 backdrop-blur-sm border-b border-line transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between px-6 h-16 w-full">
        {/* Search - placeholder for now */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search neurons, creators, collections..."
              className="w-full bg-panel2 border border-line rounded-lg px-4 py-2 pl-10 text-sm text-text placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle"
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

        {/* Right side: Profile & Wallet Connection */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          {/* Profile Picture / User Menu */}
          <UserMenu onLoginClick={() => setShowLogin(true)} />

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
                          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          Connect Wallet
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="bg-anger/20 text-anger px-4 py-2 rounded-lg font-medium text-sm border border-anger/50"
                        >
                          Wrong network
                        </button>
                      );
                    }

                    return (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={openChainModal}
                          type="button"
                          className="flex items-center gap-2 bg-panel2 hover:bg-panel border border-line rounded-lg px-3 py-2 text-sm text-text transition-colors"
                        >
                          {chain.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 16,
                                height: 16,
                                borderRadius: 999,
                                overflow: 'hidden',
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 16, height: 16 }}
                                />
                              )}
                            </div>
                          )}
                          <span>{chain.name}</span>
                        </button>

                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="flex items-center gap-2"
                        >
                          {account.ensAvatar ? (
                            <img
                              src={account.ensAvatar}
                              alt="Avatar"
                              className="h-10 w-10 rounded-full border-2 border-brand-500/50"
                            />
                          ) : (
                            <Avatar2D name={account.displayName || account.address || 'User'} size="md" />
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

