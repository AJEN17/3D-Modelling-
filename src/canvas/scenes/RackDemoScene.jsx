import React, { useEffect, useState } from 'react';
import { OrbitControls, Environment } from '@react-three/drei';
import DetailedRack from '../3d-assets/DetailedRack';

export default function RackDemoScene() {
  const [rackData, setRackData] = useState(null);

  useEffect(() => {
    // Fetch the demo rack data
    fetch('/data/racks/demo_rack.json')
      .then((res) => res.json())
      .then((data) => setRackData(data))
      .catch((err) => console.error("Failed to load demo rack:", err));
  }, []);

  if (!rackData) return null;

  return (
    <group>
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={10}
        target={[0, 0, 0]}
      />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      
      {/* Studio lighting environment */}
      <Environment preset="city" background={false} />

      <DetailedRack rackData={rackData} />

      {/* Floor plane for context */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -1.05, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#444444" roughness={0.8} />
      </mesh>
    </group>
  );
}
