import React from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';

export default function FiberODF({ sizeU = 1, label = 'ODF', color = '#808080' }) {
  const height = sizeU * U_HEIGHT;
  const trayWidth = INNER_WIDTH * 0.7; // Trays take up center 70%
  const cableManWidth = INNER_WIDTH * 0.12; // Cable management on sides
  
  return (
    <group position={[0, 0, 0.005]}>
      {/* Main Base Block (Backplane) */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[INNER_WIDTH, height, 0.01]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>

      {/* Vertical Cable Management (Left & Right) */}
      {[-1, 1].map(side => (
        <group key={`cable-man-${side}`} position={[side * (INNER_WIDTH * 0.42), 0, 0.005]}>
          {/* Outer Plastic Guide */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[cableManWidth, height, 0.03]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
          </mesh>
          
          {/* Vertical Fiber Cable Bundle (Bright Yellow) */}
          <mesh position={[0, 0, 0.018]}>
            <cylinderGeometry args={[0.015, 0.015, height * 0.98, 8]} />
            <meshStandardMaterial color="#ffcc00" roughness={0.4} />
          </mesh>

          {/* Cable Retainer Clips */}
          {Array.from({ length: Math.floor(sizeU / 2) }).map((_, i) => {
            const clipY = (height / 2) - (i * 2 * U_HEIGHT) - U_HEIGHT;
            return (
              <mesh key={`clip-${i}`} position={[0, clipY, 0.025]}>
                <boxGeometry args={[cableManWidth * 1.1, 0.005, 0.02]} />
                <meshStandardMaterial color="#111111" />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Horizontal Splice Trays */}
      <group position={[0, 0, 0]}>
        {Array.from({ length: sizeU }).map((_, i) => {
          const trayY = (height / 2) - (i * U_HEIGHT) - (U_HEIGHT / 2);
          return (
            <group key={`tray-${i}`} position={[0, trayY, 0.005]}>
              {/* Tray Base */}
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[trayWidth, U_HEIGHT * 0.9, 0.02]} />
                <meshStandardMaterial color={color} roughness={0.5} metalness={0.6} />
              </mesh>
              
              {/* Tray Handle / Pull Tab */}
              <mesh position={[0, -U_HEIGHT * 0.2, 0.012]}>
                <boxGeometry args={[0.08, 0.005, 0.01]} />
                <meshStandardMaterial color="#aaaaaa" metalness={0.8} />
              </mesh>

              {/* Warning/Info Label on each tray */}
              <mesh position={[-trayWidth * 0.35, 0, 0.011]}>
                <boxGeometry args={[0.02, 0.01, 0.001]} />
                <meshStandardMaterial color="#ffdd00" />
              </mesh>

              {/* Fiber Optic Patch Cords (Small blue lines routing to sides) */}
              <mesh position={[-trayWidth * 0.45, 0, 0.01]}>
                <boxGeometry args={[0.06, 0.002, 0.002]} />
                <meshStandardMaterial color="#0055ff" />
              </mesh>
              <mesh position={[trayWidth * 0.45, 0, 0.01]}>
                <boxGeometry args={[0.06, 0.002, 0.002]} />
                <meshStandardMaterial color="#0055ff" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Giant Translucent Acrylic Door Covering the Trays */}
      <mesh position={[0, 0, 0.025]}>
        <boxGeometry args={[trayWidth * 1.05, height * 0.99, 0.002]} />
        <meshPhysicalMaterial 
          color="#88aaff" 
          transmission={0.8} 
          opacity={0.3} 
          transparent={true} 
          roughness={0.1} 
          metalness={0.1} 
          clearcoat={1}
        />
      </mesh>

      {/* Front Panel Label (Placed on the acrylic door) */}
      <Text
        position={[0, 0, 0.03]}
        fontSize={Math.min(height * 0.05, 0.06)}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={INNER_WIDTH * 0.6}
        textAlign="center"
        fontWeight="bold"
        outlineWidth={0.002}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* Mounting Ears / Side brackets */}
      {[-1, 1].map(side => (
        <mesh key={`bracket-${side}`} position={[side * (INNER_WIDTH * 0.49), 0, 0.011]}>
          <boxGeometry args={[0.01, height, 0.002]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}
