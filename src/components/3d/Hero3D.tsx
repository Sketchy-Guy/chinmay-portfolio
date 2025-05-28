
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Points, Vector3 } from 'three';

const FloatingGeometry = ({ position, color, scale = 1 }: { position: [number, number, number], color: string, scale?: number }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <MeshDistortMaterial
          color={color}
          distort={0.6}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

const ParticleField = () => {
  const points = useRef<Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.05;
      points.current.rotation.y = state.clock.elapsedTime * 0.075;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#8b5cf6" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
};

const Hero3DScene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} color="#06b6d4" intensity={0.5} />
      
      <ParticleField />
      
      <FloatingGeometry position={[-4, 2, -2]} color="#8b5cf6" scale={0.8} />
      <FloatingGeometry position={[4, -1, -1]} color="#06b6d4" scale={0.6} />
      <FloatingGeometry position={[2, 3, -3]} color="#ec4899" scale={0.4} />
      <FloatingGeometry position={[-3, -2, 1]} color="#10b981" scale={0.5} />
      
      <Sphere args={[1, 32, 32]} position={[0, 0, -5]} scale={2}>
        <MeshDistortMaterial
          color="#8b5cf6"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.1}
        />
      </Sphere>
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

const Hero3D = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Hero3DScene />
      </Canvas>
    </div>
  );
};

export default Hero3D;
