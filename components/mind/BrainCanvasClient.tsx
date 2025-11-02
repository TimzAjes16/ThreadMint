'use client';

import { useEffect, useState } from 'react';

// This wrapper ensures React Three Fiber only loads on the client
export function BrainCanvasClient({ nodes = [], edges = [] }: { nodes?: any[]; edges?: any[] }) {
  const [ClientCanvas, setClientCanvas] = useState<any>(null);

  useEffect(() => {
    // Dynamically import only on client side
    import('@/components/mind/BrainCanvas').then((mod) => {
      setClientCanvas(() => mod.BrainCanvas);
    });
  }, []);

  if (!ClientCanvas) {
    return (
      <div className="relative w-full h-[600px] rounded-lg border border-line bg-elev overflow-hidden flex items-center justify-center">
        <div className="text-center text-subtle">
          <div className="text-lg font-medium mb-2">Loading 3D brain...</div>
          <div className="text-sm">Initializing neural network visualization</div>
        </div>
      </div>
    );
  }

  return <ClientCanvas nodes={nodes} edges={edges} />;
}

