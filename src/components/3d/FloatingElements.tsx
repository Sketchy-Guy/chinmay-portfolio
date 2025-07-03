import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';

const FloatingElement = ({ position, color, shape, speed }: {
  position: [number, number, number];
  color: string;
  shape: 'sphere' | 'box' | 'torus';
  speed: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed;
      meshRef.current.rotation.y += speed * 0.8;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  const material = (
    <meshStandardMaterial
      color={color}
      transparent
      opacity={0.6}
      emissive={color}
      emissiveIntensity={0.2}
    />
  );

  return (
    <mesh ref={meshRef} position={position}>
      {shape === 'sphere' && <Sphere args={[0.5, 16, 16]}>{material}</Sphere>}
      {shape === 'box' && <Box args={[0.8, 0.8, 0.8]}>{material}</Box>}
      {shape === 'torus' && <Torus args={[0.6, 0.2, 8, 16]}>{material}</Torus>}
    </mesh>
  );
};

const FloatingElements = () => {
  const elements = useMemo(() => [
    { position: [-4, 2, -2] as [number, number, number], color: '#3b82f6', shape: 'sphere' as const, speed: 0.01 },
    { position: [4, -2, -3] as [number, number, number], color: '#6366f1', shape: 'box' as const, speed: 0.015 },
    { position: [2, 3, -1] as [number, number, number], color: '#8b5cf6', shape: 'torus' as const, speed: 0.008 },
    { position: [-3, -1, -4] as [number, number, number], color: '#06b6d4', shape: 'sphere' as const, speed: 0.012 },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        {elements.map((element, index) => (
          <FloatingElement
            key={index}
            position={element.position}
            color={element.color}
            shape={element.shape}
            speed={element.speed}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default FloatingElements;