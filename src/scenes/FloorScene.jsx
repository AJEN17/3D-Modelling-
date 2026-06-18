import React from 'react';
import { OrbitControls, Environment, Text, Billboard } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import FloorGrid from '../components/FloorGrid';
import Equipment from '../components/Equipment';
import groundFloorPlan from '../data/groundFloor.json';
import firstFloorPlan from '../data/firstFloorPlan.json';
import { useLocation } from 'react-router-dom';

export default function FloorScene() {
  const { camera } = useThree();
  const location = useLocation();
  const isFirstFloor = location.pathname.includes('sundale-ff');
  const floorplanData = isFirstFloor ? firstFloorPlan : groundFloorPlan;

  React.useEffect(() => {
    // Restore angled isometric view for the floor
    camera.position.set(20, 25, 20);
  }, [camera]);

  return (
    <group>
      <OrbitControls 
        target={[4.2, 0, 6.0]} 
        minDistance={5} 
        maxDistance={50} 
        maxPolarAngle={Math.PI / 2.1} 
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />

      <FloorGrid roomData={floorplanData.room} />
      
      {floorplanData.components.map((component) => (
        <Equipment key={component.id} data={component} />
      ))}

      <Billboard position={[3.0, 1.0, 9.9]}>
        <Text fontSize={0.6} color="#111111" fontWeight="bold" outlineWidth={0.03} outlineColor="#ffffff">
          SUNDALE LAB
        </Text>
      </Billboard>
      
      <Billboard position={[3.0, 1.0, 10.8]}>
        <Text fontSize={0.4} color="#333333" outlineWidth={0.03} outlineColor="#ffffff">
          ENTRANCE
        </Text>
      </Billboard>

      <Billboard position={[3.0, 1.0, 11.7]}>
        <Text fontSize={0.5} color="#111111" fontWeight="bold" outlineWidth={0.03} outlineColor="#ffffff">
          {floorplanData.room.name}
        </Text>
      </Billboard>
    </group>
  );
}
