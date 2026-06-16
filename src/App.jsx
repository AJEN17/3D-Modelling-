import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Billboard } from '@react-three/drei';
import FloorGrid from './components/FloorGrid';
import Equipment from './components/Equipment';
import floorplanData from './data/floorplan.json';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f0f0f0' }}>
      <Canvas shadows camera={{ position: [20, 25, 20], fov: 35 }}>
        <OrbitControls 
          target={[4.2, 0, 6.0]} 
          minDistance={5} 
          maxDistance={50} 
          maxPolarAngle={Math.PI / 2.1} // Prevent going below ground
        />
        {/* Lighting and Shadows */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Environment preset="city" />

        {/* Controls */}

        {/* Scene Components */}
        <FloorGrid roomData={floorplanData.room} />
        
        {floorplanData.components.map((component) => (
          <Equipment key={component.id} data={component} />
        ))}

        {/* 3D Floor Text */}
        <Billboard position={[3.0, 1.0, 9.9]}>
          <Text
            fontSize={0.6}
            color="#111111"
            fontWeight="bold"
            letterSpacing={0.1}
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            SUNDALE LAB
          </Text>
        </Billboard>
        
        <Billboard position={[3.0, 1.0, 10.8]}>
          <Text
            fontSize={0.4}
            color="#333333"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            ENTRANCE
          </Text>
        </Billboard>

        <Billboard position={[3.0, 1.0, 11.7]}>
          <Text
            fontSize={0.5}
            color="#111111"
            fontWeight="bold"
            outlineWidth={0.03}
            outlineColor="#ffffff"
          >
            SUNDALE GROUND FLOOR LAB ROOM
          </Text>
        </Billboard>
      </Canvas>
      
      {/* UI Overlay */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'sans-serif', backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '8px' }}>
        <h2>{floorplanData.room.name}</h2>
        <p>3D Visualization Based on 600x600mm Tile Grid</p>
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: floorplanData.colors.infra, marginRight: '8px' }}></div> Infra Equipment</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: floorplanData.colors.core, marginRight: '8px' }}></div> Core Servers</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: floorplanData.colors.pillar, marginRight: '8px' }}></div> Structural Pillar</div>
        </div>
      </div>
    </div>
  );
}

export default App;
