'use client';

import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Avatar2D } from '@/components/profile/Avatar2D';
import { CollectionBanner } from '@/components/market/CollectionBanner';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="ml-64 mr-80 min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4 opacity-50">👤</div>
          <div className="text-xl font-semibold text-text mb-2">
            Connect your wallet
          </div>
          <div className="text-muted">
            Connect your wallet to view your profile
          </div>
        </Card>
      </div>
    );
  }

  const displayName = `${address?.slice(0, 6)}...${address?.slice(-4)}`;

  return (
    <div className="ml-64 mr-80 min-h-screen">
      <Header />
      
      <div className="pt-16">
        <CollectionBanner />
      </div>

      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="relative -mt-20 px-6 mb-6">
            <Card className="p-6">
              <div className="flex items-start gap-6">
                <Avatar2D name={displayName} size="lg" className="w-32 h-32 border-4 border-bg shadow-lg" />
                <div className="flex-1 pt-4">
                  <h1 className="text-3xl font-bold text-text mb-2">
                    {displayName}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-muted mb-4">
                    <span>Wallet: {address}</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-panel2 hover:bg-panel border border-line rounded-lg text-sm text-text font-medium transition-colors">
                      Edit Profile
                    </button>
                    <button className="px-4 py-2 bg-panel2 hover:bg-panel border border-line rounded-lg text-sm text-text font-medium transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-text mb-1">0</div>
              <div className="text-sm text-muted">Collections</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-text mb-1">0</div>
              <div className="text-sm text-muted">Neurons Minted</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-text mb-1">0</div>
              <div className="text-sm text-muted">Following</div>
            </Card>
          </div>

          {/* Content Tabs */}
          <Card className="p-6">
            <div className="border-b border-line mb-6">
              <nav className="flex gap-6">
                {['Neurons', 'Collections', 'Activity'].map((tab) => (
                  <button
                    key={tab}
                    className="pb-3 px-1 text-sm font-medium text-muted hover:text-text border-b-2 border-transparent hover:border-brand-500/50 transition-colors"
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="text-center text-muted py-12">
              <div className="text-lg font-medium mb-2">No content yet</div>
              <div className="text-sm">Start minting neurons to see them here</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

