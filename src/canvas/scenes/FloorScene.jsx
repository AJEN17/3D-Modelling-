import React from 'react';
import { OrbitControls, Environment, Text, Billboard } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import FloorGrid from '../3d-assets/FloorGrid';
import Equipment from '../3d-assets/Equipment';
import groundFloorPlan from '../../data/sundale/ground.json';
import firstFloorPlan from '../../data/sundale/first.json';
import secondFloorPlan from '../../data/sundale/second.json';
import suncityFirstFloorPlan from '../../data/suncity/first.json';
import suncitySecondSwitchPlan from '../../data/suncity/secondswitch.json';
import { useLocation } from 'react-router-dom';

export default function FloorScene() {
  const { camera } = useThree();
  const location = useLocation();
  const isFirstFloor = location.pathname.includes('sundale-ff');
  const isSecondFloor = location.pathname.includes('sundale-sf');
  const isSuncityFirst = location.pathname.includes('suncity') && !location.pathname.includes('suncity-sf');
  const isSuncitySecond = location.pathname.includes('suncity-sf');
  
  let floorplanData = groundFloorPlan;
  if (isFirstFloor) floorplanData = firstFloorPlan;
  if (isSecondFloor) floorplanData = secondFloorPlan;
  if (isSuncityFirst) floorplanData = suncityFirstFloorPlan;
  if (isSuncitySecond) floorplanData = suncitySecondSwitchPlan;

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

      <FloorGrid roomData={floorplanData.room} walls={floorplanData.walls} />
      
      {floorplanData.components.map((component) => (
        <Equipment key={component.id} data={component} />
      ))}

      <Billboard position={[3.0, 1.0, 9.9]}>
        <Text fontSize={0.6} color="#111111" fontWeight="bold" outlineWidth={0.03} outlineColor="#ffffff">
          {floorplanData.room.name.split(' ')[0]} LAB
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
