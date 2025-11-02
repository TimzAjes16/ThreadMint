'use client';

import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { Avatar2D } from '@/components/profile/Avatar2D';
import { CollectionBanner } from '@/components/market/CollectionBanner';
import { LeftRail } from '@/components/layout/LeftRail';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <>
        <LeftRail />
        <div className="ml-0 md:ml-16 md:group-hover:ml-64 mr-0 lg:mr-80 min-h-screen flex items-center justify-center transition-all duration-300 ease-in-out px-4">
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
      </>
    );
  }

  const displayName = `${address?.slice(0, 6)}...${address?.slice(-4)}`;

  return (
    <>
      <LeftRail />
      <div className="ml-0 md:ml-16 md:group-hover:ml-64 mr-0 lg:mr-80 min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        
        <div className="pt-14 md:pt-16">
          <CollectionBanner />
        </div>

        <div className="px-4 md:px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="relative -mt-12 md:-mt-20 px-0 md:px-6 mb-6">
              <Card className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
                  <Avatar2D name={displayName} size="lg" className="w-20 h-20 md:w-32 md:h-32 border-4 border-bg shadow-lg" />
                  <div className="flex-1 pt-0 md:pt-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 px-0 md:px-6">
              <Card className="p-4 md:p-6 text-center">
                <div className="text-xl md:text-2xl font-bold text-text mb-1">0</div>
                <div className="text-xs md:text-sm text-muted">Collections</div>
              </Card>
              <Card className="p-4 md:p-6 text-center">
                <div className="text-xl md:text-2xl font-bold text-text mb-1">0</div>
                <div className="text-xs md:text-sm text-muted">Neurons Minted</div>
              </Card>
              <Card className="p-4 md:p-6 text-center">
                <div className="text-xl md:text-2xl font-bold text-text mb-1">0</div>
                <div className="text-xs md:text-sm text-muted">Following</div>
              </Card>
            </div>

            {/* Content Tabs */}
            <Card className="p-4 md:p-6">
              <div className="border-b border-line mb-4 md:mb-6 overflow-x-auto scrollbar-hide">
                <nav className="flex gap-4 md:gap-6 min-w-max">
                  {['Neurons', 'Collections', 'Activity'].map((tab) => (
                    <button
                      key={tab}
                      className="pb-2 md:pb-3 px-1 text-xs md:text-sm font-medium text-muted hover:text-text border-b-2 border-transparent hover:border-brand-500/50 transition-colors shrink-0"
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="text-center text-muted py-8 md:py-12">
                <div className="text-lg font-medium mb-2">No content yet</div>
                <div className="text-sm">Start minting neurons to see them here</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

