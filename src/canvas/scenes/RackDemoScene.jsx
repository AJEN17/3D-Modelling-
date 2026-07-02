/**
 * Individual Rack Scene
 * ---------------------
 * A detailed, up-close view of a single server rack. This scene parses a highly detailed
 * JSON array (e.g. `cisco-rack-1.json`) containing the exact RU (Rack Unit) positions 
 * of individual servers, switches, and patch panels, and renders them accurately.
 */
import React, { useEffect, useState } from 'react';
import { OrbitControls, Environment, BakeShadows } from '@react-three/drei';
import DetailedRack from '../3d-assets/DetailedRack';

export default function RackDemoScene() {
  const [rackData, setRackData] = useState(null);

  useEffect(() => {
    // Fetch the demo rack data
    fetch('./data/racks/demo_rack.json')
      .then((res) => res.json())
      .then((data) => setRackData(data));
  }, []);

  if (!rackData) return null;

  return (
    <group>
      <BakeShadows />
      <OrbitControls 
        makeDefault
        target={[0, 1, 0]}
        minDistance={2}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2 + 0.1}
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
