'use client';

export function HUDPanel() {
  return (
    <div className="absolute top-4 left-4 space-y-2">
      <div className="bg-panel/90 backdrop-blur-sm border border-line rounded-md p-3 text-xs">
        <div className="font-semibold text-text mb-2">Top Thoughts</div>
        <div className="space-y-1 text-subtle">
          <div>• Thought #1</div>
          <div>• Thought #2</div>
        </div>
      </div>

      <div className="bg-panel/90 backdrop-blur-sm border border-line rounded-md p-3 text-xs">
        <div className="font-semibold text-text mb-2">Emotion Spectrum</div>
        <div className="flex gap-1">
          {['joy', 'calm', 'curiosity'].map((emotion) => (
            <div
              key={emotion}
              className="w-4 h-4 rounded-full bg-brand-500/50"
              title={emotion}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

