'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';

export default function LeaderboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      // TODO: Implement leaderboard API
      return {
        creators: [],
        collectors: [],
      };
    },
  });

  return (
    <div className="ml-64 mr-80 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-6">Leaderboard</h1>

        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text mb-4">Top Creators</h2>
            {isLoading ? (
              <div className="text-subtle">Loading...</div>
            ) : (
              <div className="space-y-3">
                {data && data.creators && data.creators.length > 0 ? (
                  data.creators.map((creator: any, i: number) => (
                    <div
                      key={creator.id}
                      className="flex items-center gap-3 p-3 rounded-md bg-panel2"
                    >
                      <span className="text-brand-400 font-bold">#{i + 1}</span>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-curiosity" />
                      <div className="flex-1">
                        <div className="font-semibold text-text">
                          @{creator.handle}
                        </div>
                        <div className="text-xs text-subtle">
                          {creator.revenue} ETH
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-subtle">No data yet</div>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-text mb-4">
              Top Collectors
            </h2>
            {isLoading ? (
              <div className="text-subtle">Loading...</div>
            ) : (
              <div className="space-y-3">
                {data && data.collectors && data.collectors.length > 0 ? (
                  data.collectors.map((collector: any, i: number) => (
                    <div
                      key={collector.id}
                      className="flex items-center gap-3 p-3 rounded-md bg-panel2"
                    >
                      <span className="text-brand-400 font-bold">#{i + 1}</span>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-curiosity" />
                      <div className="flex-1">
                        <div className="font-semibold text-text">
                          @{collector.handle}
                        </div>
                        <div className="text-xs text-subtle">
                          {collector.collected} neurons
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-subtle">No data yet</div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

