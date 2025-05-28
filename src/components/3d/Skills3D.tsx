
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { CleanMesh, CleanGroup } from './ThreeJSWrapper';

interface Skill3DProps {
  skill: {
    name: string;
    level: number;
    category: string;
  };
  position: [number, number, number];
  onClick: () => void;
  isSelected: boolean;
}

const Skill3D = ({ skill, position, onClick, isSelected }: Skill3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      const scale = hovered || isSelected ? 1.2 : 1;
      meshRef.current.scale.lerp(new Vector3(scale, scale, scale), 0.1);
    }
  });

  const getColorByCategory = (category: string) => {
    const colors: { [key: string]: string } = {
      'Programming Languages': '#8b5cf6',
      'Web Development': '#06b6d4',
      'Databases': '#10b981',
      'Tools & Platforms': '#f59e0b',
      'AI & ML': '#ec4899',
      'Soft Skills': '#6366f1',
      'Technical Skills': '#ef4444'
    };
    return colors[category] || '#8b5cf6';
  };

  return (
    <CleanGroup position={position}>
      <CleanGroup>
        <CleanMesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.8, 32, 32]} />
          <MeshDistortMaterial
            color={getColorByCategory(skill.category)}
            distort={hovered || isSelected ? 0.8 : 0.4}
            speed={3}
            roughness={0.1}
            metalness={0.7}
            transparent
            opacity={hovered || isSelected ? 0.9 : 0.7}
          />
        </CleanMesh>
        
        <Text
          position={[0, 0, 0.9]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          {skill.name}
        </Text>
        
        <Text
          position={[0, -0.3, 0.9]}
          fontSize={0.1}
          color="#e5e7eb"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          {skill.level}%
        </Text>
      </CleanGroup>
    </CleanGroup>
  );
};

interface Skills3DProps {
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
}

const Skills3D = ({ skills }: Skills3DProps) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  
  const getPositions = (count: number) => {
    const positions: [number, number, number][] = [];
    const radius = 6;
    
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      positions.push([x, y, z]);
    }
    
    return positions;
  };

  const positions = getPositions(skills.length);

  return (
    <div className="w-full h-[600px]">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 75 }}
        onCreated={({ gl, scene, camera }) => {
          // Clean up Lovable attributes
          const canvas = gl.domElement;
          const attributesToRemove = [];
          for (let i = 0; i < canvas.attributes.length; i++) {
            const attr = canvas.attributes[i];
            if (attr.name.startsWith('data-lov') || attr.name.includes('lov')) {
              attributesToRemove.push(attr.name);
            }
          }
          attributesToRemove.forEach(attr => canvas.removeAttribute(attr));
          
          // Clean scene
          scene.traverse((child) => {
            if (child.userData) {
              Object.keys(child.userData).forEach(key => {
                if (key.startsWith('lov') || key.includes('lovable')) {
                  delete child.userData[key];
                }
              });
            }
          });
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} color="#06b6d4" intensity={0.5} />
        
        {skills.map((skill, index) => (
          <Skill3D
            key={skill.name}
            skill={skill}
            position={positions[index]}
            onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
            isSelected={selectedSkill === skill.name}
          />
        ))}
        
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default Skills3D;
