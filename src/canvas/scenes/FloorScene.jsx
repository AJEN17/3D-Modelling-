import React, { useEffect } from 'react';
import { OrbitControls, Environment, Text, Billboard } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import FloorGrid from '../3d-assets/FloorGrid';
import Equipment from '../3d-assets/Equipment';
import useAppStore from '../../store/useAppStore';

export default function FloorScene() {
  const { camera } = useThree();
  const location = useLocation();
  const fetchFloorData = useAppStore(state => state.fetchFloorData);
  const preloadedData = useAppStore(state => state.preloadedData);
  
  const match = location.pathname.match(/\/floor\/(.+)\/(.+)/);
  const buildingId = match ? match[1] : null;
  const currentFloorId = match ? match[2] : null;

  const key = buildingId && currentFloorId ? `${buildingId}-${currentFloorId}` : null;
  const floorplanData = key ? preloadedData[key] : null;

  useEffect(() => {
    if (buildingId && currentFloorId && !floorplanData) {
       fetchFloorData(buildingId, currentFloorId);
    }
  }, [buildingId, currentFloorId, floorplanData, fetchFloorData]);

  React.useEffect(() => {
    // Restore angled isometric view for the floor
    camera.position.set(20, 25, 20);
  }, [camera]);

  if (!floorplanData) {
    return null; // Don't render the 3D scene until data is loaded
  }

  return (
    <group>
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={2}
        maxDistance={100}
        target={[
          floorplanData.room.width ? floorplanData.room.width / 2 : 4.2, 
          0, 
          floorplanData.room.depth ? floorplanData.room.depth / 2 : 6.0
        ]}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <Environment preset="city" />

      <FloorGrid roomData={floorplanData.room} walls={floorplanData.walls} />
      
      {floorplanData.components.map((component) => (
        <Equipment key={component.id} data={component} />
      ))}

      {/* Floating Room Title */}
      <Billboard position={[floorplanData.room.width / 2, 6.0, floorplanData.room.depth / 2]}>
        <Text fontSize={0.4} color="#111111" fontWeight="bold" outlineWidth={0.02} outlineColor="#ffffff">
          {floorplanData.room.name}
        </Text>
      </Billboard>
    </group>
  );
}
