'use client';

import { useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Howl } from 'howler';

interface NeuronNodeProps {
  node: {
    id: string;
    kind: 'native' | 'absorbed';
    pos: [number, number, number];
    color: [number, number, number];
    size?: number;
    audio_url?: string;
    label?: string;
    emotion?: string;
    serial?: number;
  };
}

export function NeuronNode({ node }: NeuronNodeProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y =
        node.pos[1] + Math.sin(state.clock.elapsedTime + node.pos[0]) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  const handleClick = () => {
    if (node.audio_url && !playing) {
      setPlaying(true);
      const sound = new Howl({
        src: [node.audio_url],
        onend: () => setPlaying(false),
      });
      sound.play();
    }
  };

  const [r, g, b] = node.color || [0.3, 0.5, 1.0];
  const size = node.size || 0.15;

  return (
    <mesh
      ref={meshRef}
      position={new Vector3(...node.pos)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
      scale={hovered ? size * 1.3 : size}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={`rgb(${r * 255}, ${g * 255}, ${b * 255})`}
        emissive={`rgb(${r * 100}, ${g * 100}, ${b * 100})`}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />

      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-panel border border-line rounded-md p-2 text-xs text-text whitespace-nowrap">
            <div className="font-semibold">{node.label || 'Neuron'}</div>
            {node.emotion && (
              <div className="text-subtle">Emotion: {node.emotion}</div>
            )}
            {node.serial && (
              <div className="text-subtle">#{node.serial}</div>
            )}
          </div>
        </Html>
      )}

      {playing && (
        <Html>
          <div className="text-brand-400 text-2xl animate-pulse">🔊</div>
        </Html>
      )}
    </mesh>
  );
}

