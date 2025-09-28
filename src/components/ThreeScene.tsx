import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Environment, Html, useProgress } from '@react-three/drei';
import { Mesh, Group } from 'three';
import { motion } from 'framer-motion';

// Loading component for 3D models
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <div className="text-primary mt-4 font-mono">
          กำลังโหลดโมเดล.... {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
}

interface BikeModelProps {
  modelPath: string;
  rotation: number;
  scale?: number;
  position?: [number, number, number];
  isDetailView?: boolean;
  bikeData?: any;
}

// GLTF Model Component (with fallback to placeholder)
function GLTFBikeModel({ modelPath, rotation, scale = 1, position = [0, 0, 0], isDetailView, bikeData }: BikeModelProps) {
  const meshRef = useRef<Group>(null);
  
  // Try to load GLTF model, fallback to placeholder if not found
  let gltf;
  try {
    gltf = useGLTF(modelPath);
  } catch (error) {
    console.log(`GLTF model not found: ${modelPath}, using placeholder`);
  }

  useFrame((state) => {
    if (meshRef.current) {
      if (!isDetailView) {
        meshRef.current.rotation.y = rotation;
      }
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Brand-specific colors
  const getBrandColor = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'yamaha': return '#0066cc';
      case 'honda': return '#cc0000';
      case 'kawasaki': return '#00cc66';
      case 'ducati': return '#cc3300';
      case 'bmw': return '#0099cc';
      default: return '#ff6b35';
    }
  };

  const brandColor = getBrandColor(bikeData?.brand);

  return (
    <group ref={meshRef} position={position} scale={scale}>
      {gltf && gltf.scene ? (
        // Use actual GLTF model if available
        <primitive object={gltf.scene.clone()} />
      ) : (
        // Fallback to enhanced placeholder
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
          {/* Enhanced Bike Body */}
          <group>
            {/* Main Frame */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.2, 0.25, 0.6]} />
              <meshStandardMaterial 
                color={brandColor} 
                metalness={0.9} 
                roughness={0.1}
                emissive={brandColor}
                emissiveIntensity={0.1}
              />
            </mesh>
            
            {/* Fuel Tank */}
            <mesh position={[0.4, 0.35, 0]}>
              <capsuleGeometry args={[0.35, 1.0]} />
              <meshStandardMaterial 
                color="#1a1a1a" 
                metalness={0.95} 
                roughness={0.05}
              />
            </mesh>
            
            {/* Front Wheel */}
            <mesh position={[1.3, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.25]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Rear Wheel */}
            <mesh position={[-1.1, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.3]} />
              <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Front Fork */}
            <mesh position={[1.4, 0.2, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.8]} />
              <meshStandardMaterial color="#333" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Handlebars */}
            <mesh position={[1.5, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.7]} />
              <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Exhaust System */}
            <mesh position={[-0.8, -0.2, 0.35]} rotation={[0, Math.PI / 6, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 1.0]} />
              <meshStandardMaterial 
                color="#666" 
                metalness={0.9} 
                roughness={0.1}
                emissive="#ff4400"
                emissiveIntensity={0.1}
              />
            </mesh>
            
            {/* Seat */}
            <mesh position={[-0.3, 0.4, 0]}>
              <boxGeometry args={[0.8, 0.1, 0.4]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.8} />
            </mesh>
            
            {/* Headlight */}
            <mesh position={[1.6, 0.3, 0]}>
              <sphereGeometry args={[0.08]} />
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#ffffff" 
                emissiveIntensity={0.8}
                transparent
                opacity={0.9}
              />
            </mesh>
            
            {/* Taillight */}
            <mesh position={[-1.3, 0.2, 0]}>
              <sphereGeometry args={[0.04]} />
              <meshStandardMaterial 
                color="#ff0000" 
                emissive="#ff0000" 
                emissiveIntensity={0.6}
              />
            </mesh>
            
            {/* Brand-colored accent strips */}
            <mesh position={[0.5, 0.15, 0.32]}>
              <boxGeometry args={[1.5, 0.05, 0.02]} />
              <meshStandardMaterial 
                color={brandColor} 
                emissive={brandColor} 
                emissiveIntensity={0.3}
              />
            </mesh>
            <mesh position={[0.5, 0.15, -0.32]}>
              <boxGeometry args={[1.5, 0.05, 0.02]} />
              <meshStandardMaterial 
                color={brandColor} 
                emissive={brandColor} 
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        </Float>
      )}
    </group>
  );
}

interface ThreeSceneProps {
  currentBike?: any;
  scrollProgress: number;
  isDetailView?: boolean;
}

export default function ThreeScene({ currentBike, scrollProgress, isDetailView = false }: ThreeSceneProps) {
  const rotation = scrollProgress * Math.PI * 2;
  
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ 
          position: isDetailView ? [4, 2, 4] : [5, 2, 5], 
          fov: isDetailView ? 50 : 45 
        }}
        className="w-full h-full"
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
        shadows
      >
        <Suspense fallback={<Loader />}>
          <Environment preset="night" />
          
          {/* Enhanced Cyberpunk Lighting */}
          <ambientLight intensity={0.4} color="#0066cc" />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            color="#00ffff"
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#ff0080" />
          <spotLight
            position={[0, 15, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1.2}
            color="#00ff80"
            castShadow
          />
          
          {/* Rim Light for dramatic effect */}
          <pointLight position={[0, 2, -8]} intensity={0.8} color="#ffffff" />
          
          {/* 3D Bike Model with lazy loading */}
          <GLTFBikeModel 
            modelPath={currentBike?.model || "/models/default.glb"}
            rotation={rotation}
            scale={isDetailView ? 1.2 : 2}
            position={[0, isDetailView ? -0.5 : 0, 0]}
            isDetailView={isDetailView}
            bikeData={currentBike}
          />
          
          {/* Enhanced Cyberpunk Grid Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial 
              color="#001122" 
              transparent 
              opacity={0.4}
              wireframe
            />
          </mesh>
          
          {/* Interactive Controls for Detail View */}
          {isDetailView && (
            <OrbitControls 
              enableZoom={true} 
              enablePan={true}
              enableRotate={true}
              zoomSpeed={0.6}
              panSpeed={0.8}
              rotateSpeed={0.4}
              minDistance={2}
              maxDistance={10}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 1.8}
              autoRotate={false}
              autoRotateSpeed={0.5}
            />
          )}
          
          {/* Particle effects for cyberpunk atmosphere */}
          {currentBike && (
            <group>
              {Array.from({ length: 50 }).map((_, i) => (
                <mesh
                  key={i}
                  position={[
                    (Math.random() - 0.5) * 20,
                    Math.random() * 10,
                    (Math.random() - 0.5) * 20
                  ]}
                >
                  <sphereGeometry args={[0.02]} />
                  <meshStandardMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={Math.random() * 0.5}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              ))}
            </group>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}