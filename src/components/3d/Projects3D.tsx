import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Float, Html } from '@react-three/drei';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';

interface Project3DProps {
  project: {
    id: string;
    title: string;
    description: string;
    image?: string;
    technologies: string[];
    github?: string;
    demo?: string;
  };
  position: [number, number, number];
  onClick: () => void;
  isSelected: boolean;
}

const Project3D = ({ project, position, onClick, isSelected }: Project3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      
      const scale = hovered || isSelected ? 1.1 : 1;
      meshRef.current.scale.lerp(new Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={position}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[2, 2.5, 0.1]} />
          <meshStandardMaterial
            color={hovered || isSelected ? "#8b5cf6" : "#1f2937"}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
        
        {(hovered || isSelected) && (
          <Html
            position={[0, 0, 0.1]}
            transform
            occlude
            style={{
              width: '180px',
              height: '220px',
              padding: '10px',
              background: 'rgba(0,0,0,0.9)',
              borderRadius: '8px',
              border: '1px solid #8b5cf6',
              color: 'white',
              fontSize: '12px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: '#8b5cf6', fontSize: '14px' }}>
                {project.title}
              </h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '10px', lineHeight: '1.3' }}>
                {project.description.substring(0, 80)}...
              </p>
              <div style={{ marginBottom: '8px' }}>
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '8px',
                      margin: '1px',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#06b6d4',
                      textDecoration: 'none',
                      fontSize: '10px',
                    }}
                  >
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontSize: '10px',
                    }}
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </Html>
        )}
        
        <Text
          position={[0, 1.5, 0.1]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter.woff"
        >
          {project.title}
        </Text>
      </Float>
    </group>
  );
};

interface Projects3DProps {
  projects: Array<{
    id: string;
    title: string;
    description: string;
    image?: string;
    technologies: string[];
    github?: string;
    demo?: string;
  }>;
}

const Projects3D = ({ projects }: Projects3DProps) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  const getPositions = (count: number) => {
    const positions: [number, number, number][] = [];
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      const x = (col - (cols - 1) / 2) * 3;
      const y = (row - (rows - 1) / 2) * -3;
      const z = 0;
      
      positions.push([x, y, z]);
    }
    
    return positions;
  };

  const positions = getPositions(projects.length);

  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#8b5cf6" />
        <pointLight position={[-10, -10, -10]} color="#06b6d4" intensity={0.5} />
        
        {projects.map((project, index) => (
          <Project3D
            key={project.id}
            project={project}
            position={positions[index]}
            onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
            isSelected={selectedProject === project.id}
          />
        ))}
        
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default Projects3D;
