import { Card } from '../ui/Card';

interface MindMiniProps {
  coherence?: number;
  diversity?: number;
}

export function MindMini({ coherence = 0.72, diversity = 0.64 }: MindMiniProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-text text-base">Your Mind</h4>
        <span className="text-xs text-muted font-medium bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded-full">
          live
        </span>
      </div>
      <div className="mb-4 h-28 rounded-lg bg-gradient-to-br from-brand-500/10 via-curiosity/10 to-brand-500/10 border border-line/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(32,129,226,0.3),transparent_70%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl opacity-40">🧠</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-panel2 p-3 border border-line">
          <div className="text-muted text-xs font-medium mb-1.5">Coherence</div>
          <div className="font-bold text-text text-lg">
            {(coherence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="rounded-lg bg-panel2 p-3 border border-line">
          <div className="text-muted text-xs font-medium mb-1.5">Diversity</div>
          <div className="font-bold text-text text-lg">
            {(diversity * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </Card>
  );
}

