'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { NeuronNode } from './NeuronNode';
import { SynapseEdge } from './SynapseEdge';
import { EmotionAura } from './EmotionAura';
import { HUDPanel } from './HUDPanel';
import { Suspense, useEffect, useState } from 'react';

interface BrainCanvasProps {
  nodes: any[];
  edges: any[];
}

export function BrainCanvas({ nodes = [], edges = [] }: BrainCanvasProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Only render after component has mounted on client
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="relative w-full h-[600px] rounded-lg border border-line bg-elev overflow-hidden flex items-center justify-center">
        <div className="text-center text-subtle">
          <div className="text-lg font-medium mb-2">Loading 3D brain...</div>
          <div className="text-sm">Initializing neural network visualization</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg border border-line bg-elev overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <directionalLight position={[-10, -10, -5]} intensity={0.3} />

          <Environment preset="night" />

          {/* Brain shell/outline */}
          <mesh>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial
              color="#1a2340"
              opacity={0.3}
              transparent
              wireframe
            />
          </mesh>

          {/* Render nodes */}
          {nodes.map((node, i) => (
            <NeuronNode key={node.id || i} node={node} />
          ))}

          {/* Render edges */}
          {edges.map((edge, i) => (
            <SynapseEdge key={`${edge.source}-${edge.target}` || i} edge={edge} />
          ))}

          {/* Emotion aura effects */}
          <EmotionAura nodes={nodes} />

          <OrbitControls enableDamping dampingFactor={0.05} />
        </Suspense>
      </Canvas>

      <HUDPanel />
    </div>
  );
}

