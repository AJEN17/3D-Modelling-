/**
 * 3D Asset: EciBg30
 * -------------------
 * This component renders a specific piece of equipment (Server, Switch, Patch Panel, etc.)
 * in 3D space. It is typically instantiated inside a DetailedRack.
 */
import { getBoxGeometry, getCylinderGeometry, getPlaneGeometry } from '../utils/geometryCache';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';
export default function EciBg30({ sizeU = 1, label = 'ECI BG30\nMUMB_SLDSL_T01_C_W_2001' }) {
  const height = sizeU * U_HEIGHT;
  const ledRefs = useRef([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ledRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const signal =
        Math.sin(t * (15 + i * 2.3) + i * 0.7) *
        Math.sin(t * (8.1 + i * 1.2)) *
        Math.sin(t * (25 + i * 3.1));
      
      ref.emissiveIntensity = signal > 0.3 ? 1.5 : 0;
      
      if (signal > 0.8) {
        ref.color.setHex(0xffaa00);
        ref.emissive.setHex(0xffaa00);
      } else {
        ref.color.setHex(0x00ff00);
        ref.emissive.setHex(0x00ff00);
      }
    });
  });
  return (
    <group position={[0, 0, 0.002]}>
      {/* Main Cyan Faceplate */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.004]} radius={0.001} smoothness={4}>
        <meshPhysicalMaterial color="#00aacc" roughness={0.4} metalness={0.6} clearcoat={0.3} />
      </RoundedBox>
      {/* Ear Brackets */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.001]}>
          <mesh dispose={null} geometry={getBoxGeometry(0.012, height * 0.85, 0.005)}>
            <meshPhysicalMaterial color="#222" roughness={0.4} metalness={0.8} />
          </mesh>
          {[-1, 1].map(vert => (
            <mesh key={vert} position={[0, vert * height * 0.3, 0.003]}>
              <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Label Text (Multi-line) */}
      <group position={[-INNER_WIDTH * 0.25, 0, 0.003]}>
        <Center position={[0, 0, 0]}>
          <Text3D
            font="./fonts/helvetiker_regular.typeface.json"
            size={0.015}
            height={0.002}
          >
            {label}
            <meshStandardMaterial color="#000" />
          </Text3D>
        </Center>
      </group>
      {/* SFP Fiber Ports */}
      <group position={[INNER_WIDTH * 0.2, 0, 0.003]}>
        {/* 2 rows of 8 ports */}
        {[-1, 1].map((row, rIdx) => (
          <group key={`sfp-row-${rIdx}`} position={[0, row * 0.008, 0]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <group key={`sfp-${i}`} position={[-0.1 + i * 0.025, 0, 0]}>
                {/* SFP cage/housing */}
                <mesh position={[0, 0, 0]} dispose={null} geometry={getBoxGeometry(0.014, 0.01, 0.004)}>
                  <meshStandardMaterial color="#888" metalness={0.9} roughness={0.3} />
                </mesh>
                {/* Dust cap (Black or blue) */}
                <mesh position={[0, 0, 0.002]} dispose={null} geometry={getBoxGeometry(0.01, 0.006, 0.003)}>
                  <meshStandardMaterial color="#111" />
                </mesh>
                {/* Fiber activity LED */}
                <group position={[-0.009, 0, 0.001]}>
                  <mesh>
                    <sphereGeometry args={[0.0015, 8, 8]} />
                    <meshStandardMaterial
                      ref={el => ledRefs.current[rIdx * 8 + i] = el}
                      color="#00ff00"
                      emissive="#00ff00"
                      emissiveIntensity={0}
                      toneMapped={false}
                    />
                  </mesh>
                </group>
              </group>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
