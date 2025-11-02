'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useQuery } from '@tanstack/react-query';

export default function PacksPage() {
  const { data: packs, isLoading } = useQuery({
    queryKey: ['packs'],
    queryFn: async () => {
      // TODO: Implement packs API
      return [];
    },
  });

  return (
    <div className="ml-64 mr-80 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Packs</h1>
            <p className="text-sm text-subtle">
              Curated collections of neurons
            </p>
          </div>
          <Button variant="primary">Create Pack</Button>
        </div>

        {isLoading ? (
          <div className="text-center text-subtle py-12">Loading...</div>
        ) : packs && packs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packs.map((pack: any) => (
              <Card key={pack.id} className="p-4">
                <h3 className="font-semibold text-text mb-2">{pack.title}</h3>
                <p className="text-sm text-subtle mb-4">{pack.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-text font-semibold">
                    {pack.price_wei ? `${Number(pack.price_wei) / 1e18} ETH` : 'Free'}
                  </span>
                  <Button variant="secondary" size="sm">
                    Buy Pack
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center text-subtle">
            No packs available yet
          </Card>
        )}
      </div>
    </div>
  );
}

