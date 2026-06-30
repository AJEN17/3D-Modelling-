import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';
export default function TelecomFMS({ sizeU = 2, label = 'INTERNAL FMS' }) {
  const height = sizeU * U_HEIGHT;
  const laserRefs = useRef([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Slow glowing pulse for the fiber optic connections in the FMS
    laserRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const pulse = Math.sin(t * 2 + idx * 0.1);
      ref.emissiveIntensity = 0.5 + pulse * 1.5;
    });
  });
  // Calculate fiber port spacing so it fits neatly inside the chassis
  const numPorts = 24;
  const portSpacing = (INNER_WIDTH * 0.8) / numPorts;
  const startX = -INNER_WIDTH * 0.4 + portSpacing / 2;
  return (
    <group position={[0, 0, 0.002]}>
      {/* Slate Blue-Grey Outer Chassis */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.96, 0.008]} radius={0.002} smoothness={4}>
        <meshPhysicalMaterial color="#5A6F82" roughness={0.5} metalness={0.6} clearcoat={0.2} />
      </RoundedBox>
      {/* Mounting Ears */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.002]}>
          <mesh>
            <boxGeometry args={[0.012, height * 0.85, 0.005]} />
            <meshPhysicalMaterial color="#222" roughness={0.7} metalness={0.9} />
          </mesh>
          {[-1, 1].map(vert => (
            <mesh key={vert} position={[0, vert * height * 0.35, 0.003]}>
              <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#111" metalness={1} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Sliding Drawer Seams */}
      <mesh position={[0, height * 0.4, 0.004]}>
        <boxGeometry args={[INNER_WIDTH * 0.9, 0.002, 0.002]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0, -height * 0.4, 0.004]}>
        <boxGeometry args={[INNER_WIDTH * 0.9, 0.002, 0.002]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Label on the drawer front */}
      <group position={[0, height * 0.15, 0.004]}>
        <Center position={[0, 0, 0]}>
          <Text3D
            font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
            size={0.01}
            height={0.001}
            lineHeight={1.2}
          >
            {label}
            <meshStandardMaterial color="#fff" />
          </Text3D>
        </Center>
      </group>
      {/* Fiber Routing Spools (Yellow/Orange) visible through cutouts */}
      {/* Moved UP to avoid overlapping the ports */}
      {[-1, 1].map(side => (
        <group key={`spool-${side}`} position={[side * INNER_WIDTH * 0.35, height * 0.15, 0.004]}>
          {/* Cutout / Recessed area */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, height * 0.4, 0.002]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Spool (Orange) */}
          <mesh position={[0, 0, 0.001]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.006, 16]} />
            <meshStandardMaterial color="#ffaa00" emissive="#cc6600" emissiveIntensity={0.5} roughness={0.4} />
          </mesh>
          {/* Spool Cap (Silver/Grey) */}
          <mesh position={[0, 0, 0.004]} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.002, 16]} />
            <meshStandardMaterial color="#888" metalness={0.6} />
          </mesh>
        </group>
      ))}
      {/* High-Density Duplex LC Fiber Ports Array */}
      {/* Recessed panel for ports (Moved slightly down for better spacing) */}
      <group position={[0, -height * 0.28, 0.004]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[INNER_WIDTH * 0.85, 0.02, 0.001]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {Array.from({ length: numPorts }).map((_, i) => (
          <group key={`port-${i}`} position={[startX + i * portSpacing, 0, 0]}>
            {/* Duplex Port Housing */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.012, 0.01, 0.002]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            {/* Left/Right Fiber cavities */}
            {[-1, 1].map((pSide, pIdx) => (
              <group key={`cavity-${pIdx}`} position={[pSide * 0.003, 0, 0.001]}>
                <mesh>
                  <boxGeometry args={[0.004, 0.004, 0.001]} />
                  <meshBasicMaterial color="#000" />
                </mesh>
                <mesh position={[0, 0, 0.001]}>
                  <boxGeometry args={[0.002, 0.002, 0.001]} />
                  <meshStandardMaterial 
                    ref={el => laserRefs.current[i * 2 + pIdx] = el}
                    color="#ff0000" 
                    emissive="#ff0000" 
                    emissiveIntensity={1} 
                    toneMapped={false}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}
