'use client';

import { Card } from '@/components/ui/Card';
import { Header } from '@/components/layout/Header';
import { LeftRail } from '@/components/layout/LeftRail';

export default function HelpPage() {
  return (
    <div className="ml-64 mr-80 min-h-screen">
      <Header />
      
      <div className="px-6 pb-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-text mb-6">Help & Support</h1>
          
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text mb-4">Getting Started</h2>
              <div className="space-y-3 text-muted">
                <p>
                  ThreadMint is an NFT-native social network where thoughts become collectible neurons.
                  Connect your wallet to start minting and collecting neural thoughts.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text mb-2">How do I mint a post?</h3>
                  <p className="text-muted">
                    Create a post, then click "Mint as Neuron" to convert it into an NFT on Base blockchain.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-2">What are edition types?</h3>
                  <p className="text-muted">
                    1/1 = Unique, Limited = Fixed supply (5, 10, 50, 100), Open = Unlimited during time window,
                    Allowlist = Restricted to allowed addresses.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-2">How does absorption work?</h3>
                  <p className="text-muted">
                    When you collect a neuron, its meaning and emotion are absorbed into your 3D brain visualization.
                    Rarer neurons have stronger absorption weights.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text mb-4">Contact Support</h2>
              <div className="space-y-2 text-muted">
                <p>Email: support@threadmint.com</p>
                <p>Discord: discord.gg/threadmint</p>
                <p>Twitter: @threadmint</p>
              </div>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

