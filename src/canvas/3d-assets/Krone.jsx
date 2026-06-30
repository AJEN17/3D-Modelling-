import React from 'react';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';
export default function Krone({ sizeU = 2, label = 'KRONE' }) {
  const height = sizeU * U_HEIGHT;
  
  return (
    <group position={[0, 0, 0.002]}>
      {/* Main Light Grey Base Panel (darkened to prevent glare) */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.004]} radius={0.001} smoothness={4}>
        <meshPhysicalMaterial color="#a0a0a0" roughness={0.9} metalness={0.1} />
      </RoundedBox>
      {/* Ear Brackets */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.001]}>
          <mesh>
            <boxGeometry args={[0.012, height * 0.85, 0.005]} />
            <meshPhysicalMaterial color="#bbb" roughness={0.6} metalness={0.4} />
          </mesh>
          {[-1, 1].map(vert => (
            <mesh key={vert} position={[0, vert * height * 0.3, 0.003]}>
              <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Label */}
      <group position={[0, height * 0.38, 0.003]}>
        <Center position={[0, 0, 0]}>
          <Text3D
            font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
            size={0.008}
            height={0.001}
          >
            {label}
            <meshBasicMaterial color="#000" />
          </Text3D>
        </Center>
      </group>
      {/* Krone Punch-Down Blocks (IDC blocks) */}
      <group position={[0, -0.005, 0.003]}>
        {/* 4 horizontal rows of Krone blocks */}
        {[-1.5, -0.5, 0.5, 1.5].map((row, rIdx) => (
          <group key={`krow-${rIdx}`} position={[0, row * 0.015, 0]}>
            {/* 6 block modules per row (fits in 19-inch rack) */}
            {Array.from({ length: 6 }).map((_, bIdx) => (
              <group key={`kblock-${bIdx}`} position={[-INNER_WIDTH * 0.35 + bIdx * 0.068, 0, 0]}>
                {/* White plastic block base */}
                <mesh position={[0, 0, 0.002]}>
                  <boxGeometry args={[0.06, 0.012, 0.008]} />
                  <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
                </mesh>
                {/* Silver IDC metal contacts (tiny slits) */}
                {Array.from({ length: 8 }).map((_, cIdx) => (
                  <mesh key={`contact-${cIdx}`} position={[-0.025 + cIdx * 0.007, 0, 0.006]}>
                    <boxGeometry args={[0.001, 0.01, 0.002]} />
                    {/* Adjusted metalness and roughness to not be very shiny */}
                    <meshStandardMaterial color="#888" metalness={0.4} roughness={0.7} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
      </group>
      {/* Cable Management Rings (D-Rings) on the sides */}
      {[-1, 1].map(side => (
        <group key={`ring-${side}`} position={[side * INNER_WIDTH * 0.42, 0, 0.003]}>
          {[-1, 1].map(vert => (
            <group key={`ring-${side}-${vert}`} position={[0, vert * height * 0.25, 0]}>
              <mesh position={[0, 0, 0.008]}>
                {/* Ring loop */}
                <torusGeometry args={[0.008, 0.002, 8, 24]} />
                <meshStandardMaterial color="#333" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
