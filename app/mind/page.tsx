'use client';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LeftRail } from '@/components/layout/LeftRail';
import { Header } from '@/components/layout/Header';
import { BrainCanvasClient } from '@/components/mind/BrainCanvasClient';

export default function MindPage() {
  const { address } = useAccount();

  const { data: graph, isLoading } = useQuery({
    queryKey: ['mind-graph', address],
    queryFn: async () => {
      if (!address) return null;
      // TODO: Get userId from address
      const res = await fetch(`/api/mind/graph?userId=${address}`);
      return res.json();
    },
    enabled: !!address,
  });

  const handleMintSnapshot = async () => {
    // TODO: Implement mind snapshot mint
    alert('Mint Mind Snapshot - Coming soon!');
  };

  return (
    <>
      <LeftRail />
      <div className="ml-0 md:ml-16 md:group-hover:ml-64 mr-0 lg:mr-80 min-h-screen transition-all duration-300 ease-in-out">
        <Header />
        <div className="pt-14 md:pt-16 px-4 md:px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text mb-2">Your Mind</h1>
                <p className="text-xs md:text-sm text-subtle">
                  Explore your neural network of collected thoughts
                </p>
              </div>
              <Button onClick={handleMintSnapshot} variant="primary" className="shrink-0">
                Mint Mind Snapshot
              </Button>
            </div>

            {isLoading ? (
              <Card className="p-12 text-center text-subtle">Loading brain...</Card>
            ) : graph ? (
              <BrainCanvasClient nodes={graph.nodes || []} edges={graph.edges || []} />
            ) : (
              <Card className="p-12 text-center text-subtle">
                {address
                  ? 'No mind data yet. Start collecting neurons!'
                  : 'Connect your wallet to view your mind'}
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

