import React from 'react';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';
export default function DCDB({ sizeU = 2, label = 'DCDB' }) {
  const height = sizeU * U_HEIGHT;
  
  return (
    <group position={[0, 0, 0.002]}>
      {/* Main Light Grey Faceplate (darkened to prevent glare) */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.004]} radius={0.001} smoothness={4}>
        <meshPhysicalMaterial color="#a0a0a0" roughness={0.8} metalness={0.2} />
      </RoundedBox>
      {/* Ear Brackets */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.001]}>
          <mesh>
            <boxGeometry args={[0.012, height * 0.85, 0.005]} />
            <meshPhysicalMaterial color="#bbb" roughness={0.4} metalness={0.8} />
          </mesh>
          {[-1, 0, 1].map(vert => (
            <mesh key={vert} position={[0, vert * height * 0.35, 0.003]}>
              <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Label Text */}
      <group position={[0, sizeU > 2 ? height * 0.25 : height * 0.35, 0.003]}>
        <Center position={[0, 0, 0]}>
          <Text3D
            font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
            size={Math.min(0.06, 0.01 + (sizeU * 0.005))}
            height={0.002}
          >
            {label}
            <meshBasicMaterial color="#000" />
          </Text3D>
        </Center>
      </group>
      {/* Digital Voltage Display (Blank) */}
      <group position={[-INNER_WIDTH * 0.3, 0, 0.003]}>
        {/* Display bezel */}
        <mesh>
          <boxGeometry args={[0.08, 0.04, 0.002]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* LED Screen (off/blank) */}
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[0.07, 0.03]} />
          <meshBasicMaterial color="#1a0000" />
        </mesh>
      </group>
      {/* Circuit Breakers Array */}
      <group position={[INNER_WIDTH * 0.1, 0, 0.003]}>
        {/* Recessed breaker panel */}
        <mesh position={[0, 0, -0.001]}>
          <boxGeometry args={[0.3, 0.05, 0.004]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* Individual Toggles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <group key={`breaker-${i}`} position={[-0.13 + i * 0.024, 0, 0.001]}>
            {/* Breaker housing */}
            <mesh>
              <boxGeometry args={[0.018, 0.04, 0.004]} />
              <meshStandardMaterial color="#444" />
            </mesh>
            {/* Switch Toggle (Up position for ON) */}
            <mesh position={[0, 0.008, 0.004]} rotation={[-0.3, 0, 0]}>
              <boxGeometry args={[0.008, 0.015, 0.006]} />
              <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>
            {/* Dark rating text placeholder */}
            <mesh position={[0, -0.012, 0.002]}>
              <planeGeometry args={[0.01, 0.005]} />
              <meshBasicMaterial color="#222" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
