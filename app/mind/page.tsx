'use client';

import { BrainCanvas } from '@/components/mind/BrainCanvas';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
    <div className="ml-64 mr-80 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Your Mind</h1>
            <p className="text-sm text-subtle">
              Explore your neural network of collected thoughts
            </p>
          </div>
          <Button onClick={handleMintSnapshot} variant="primary">
            Mint Mind Snapshot
          </Button>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center text-subtle">Loading brain...</Card>
        ) : graph ? (
          <BrainCanvas nodes={graph.nodes || []} edges={graph.edges || []} />
        ) : (
          <Card className="p-12 text-center text-subtle">
            {address
              ? 'No mind data yet. Start collecting neurons!'
              : 'Connect your wallet to view your mind'}
          </Card>
        )}
      </div>
    </div>
  );
}

