'use client';

import { MindMini } from '../mind/MindMini';
import { Card } from '../ui/Card';

export function RightRail() {
  return (
    <div className="w-80 space-y-4">
      <MindMini coherence={0.72} diversity={0.64} />

      <Card className="p-4">
        <h3 className="font-semibold text-text mb-3">Trending Neurons</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-brand-400 font-bold">#{i}</span>
              <div className="flex-1 min-w-0">
                <div className="text-text truncate">Thought #{i * 10}</div>
                <div className="text-xs text-subtle">12 collects</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-text mb-3">Top Collectors</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-curiosity" />
              <div className="flex-1 min-w-0">
                <div className="text-text truncate font-medium">@collector{i}</div>
                <div className="text-xs text-subtle">{i * 23} neurons</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-text mb-3">Influence Map</h3>
        <div className="h-32 rounded-md bg-gradient-to-br from-brand-500/10 to-curiosity/10 border border-line/60 flex items-center justify-center text-xs text-subtle">
          Network visualization
        </div>
      </Card>
    </div>
  );
}

