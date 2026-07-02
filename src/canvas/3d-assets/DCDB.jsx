/**
 * 3D Asset: DCDB
 * -------------------
 * This component renders a specific piece of equipment (Server, Switch, Patch Panel, etc.)
 * in 3D space. It is typically instantiated inside a DetailedRack.
 */
import { getBoxGeometry, getCylinderGeometry, getPlaneGeometry } from '../utils/geometryCache';
import React from 'react';
import { RoundedBox, Text3D, Center, Text } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';
export default function DCDB({ sizeU = 2, label = 'DCDB', color = '#a0a0a0' }) {
  const height = sizeU * U_HEIGHT;
  
  return (
    <group position={[0, 0, 0.002]}>
      {/* Main Faceplate */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.004]} radius={0.001} smoothness={4}>
        <meshPhysicalMaterial color={color || "#a0a0a0"} roughness={0.8} metalness={0.2} />
      </RoundedBox>
      {/* Ear Brackets */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.001]}>
          <mesh dispose={null} geometry={getBoxGeometry(0.012, height * 0.85, 0.005)}>
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
      <group position={[0, sizeU > 2 ? height * 0.25 : height * 0.35, 0.006]}>
        <Text
          position={[0, 0, 0]}
          fontSize={sizeU > 2 ? 0.035 : 0.025}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          maxWidth={INNER_WIDTH * 0.9}
          lineHeight={1.1}
          fontWeight="bold"
        >
          {label}
        </Text>
      </group>
      {/* Digital Voltage Display (Blank) */}
      <group position={[-INNER_WIDTH * 0.3, 0, 0.003]}>
        {/* Display bezel */}
        <mesh dispose={null} geometry={getBoxGeometry(0.08, 0.04, 0.002)}>
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* LED Screen (off/blank) */}
        <mesh position={[0, 0, 0.001]} dispose={null} geometry={getPlaneGeometry(0.07, 0.03)}>
          <meshBasicMaterial color="#1a0000" />
        </mesh>
      </group>
      {/* Circuit Breakers Array */}
      <group position={[INNER_WIDTH * 0.1, 0, 0.003]}>
        {/* Recessed breaker panel */}
        <mesh position={[0, 0, -0.001]} dispose={null} geometry={getBoxGeometry(0.3, 0.05, 0.004)}>
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* Individual Toggles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <group key={`breaker-${i}`} position={[-0.13 + i * 0.024, 0, 0.001]}>
            {/* Breaker housing */}
            <mesh dispose={null} geometry={getBoxGeometry(0.018, 0.04, 0.004)}>
              <meshStandardMaterial color="#444" />
            </mesh>
            {/* Switch Toggle (Up position for ON) */}
            <mesh position={[0, 0.008, 0.004]} rotation={[-0.3, 0, 0]} dispose={null} geometry={getBoxGeometry(0.008, 0.015, 0.006)}>
              <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>
            {/* Dark rating text placeholder */}
            <mesh position={[0, -0.012, 0.002]} dispose={null} geometry={getPlaneGeometry(0.01, 0.005)}>
              <meshBasicMaterial color="#222" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
