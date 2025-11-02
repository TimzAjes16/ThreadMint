'use client';

import { useMemo } from 'react';
import { Vector3 } from 'three';
import { Line } from '@react-three/drei';

interface SynapseEdgeProps {
  edge: {
    source: string | number;
    target: string | number;
    weight?: number;
    sourcePos?: [number, number, number];
    targetPos?: [number, number, number];
  };
}

export function SynapseEdge({ edge }: SynapseEdgeProps) {
  const points = useMemo(() => {
    const source = edge.sourcePos || [0, 0, 0];
    const target = edge.targetPos || [1, 1, 1];
    return [new Vector3(...source), new Vector3(...target)];
  }, [edge]);

  const opacity = edge.weight ? Math.min(edge.weight * 0.5 + 0.1, 1) : 0.3;

  return (
    <Line
      points={points}
      color="#4f78ff"
      opacity={opacity}
      transparent
      lineWidth={1}
    />
  );
}
