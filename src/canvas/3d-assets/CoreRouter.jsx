/**
 * 3D Asset: CoreRouter
 * -------------------
 * This component renders a specific piece of equipment (Server, Switch, Patch Panel, etc.)
 * in 3D space. It is typically instantiated inside a DetailedRack.
 */
import { getBoxGeometry, getCylinderGeometry, getPlaneGeometry } from '../utils/geometryCache';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';

export default function CoreRouter({ sizeU = 4, label = 'CORE ROUTER', color = '#2c303a' }) {
  const height = sizeU * U_HEIGHT;
  const ledRefs = useRef([]);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ledRefs.current.forEach((ref, i) => {
      if (!ref) return;
      // Complex flickering for network traffic
      const traffic = Math.sin(t * (20 + i * 5)) * Math.sin(t * (13 + i * 2.3)) * Math.random();
      ref.emissiveIntensity = traffic > 0.4 ? 2 : 0.2;
      
      // Status LEDs might be solid green or blue
      if (i < 4) { // Supervisor LEDs
        ref.color.setHex(0x00ffaa);
        ref.emissive.setHex(0x00ffaa);
        ref.emissiveIntensity = 1 + Math.sin(t * 3) * 0.5; // Breathing
      } else {
        // Port LEDs
        ref.color.setHex(0x00aaff);
        ref.emissive.setHex(0x00aaff);
      }
    });
  });

  return (
    <group position={[0, 0, 0.002]}>
      {/* Heavy Duty Chassis Main Body */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.015]} radius={0.002} smoothness={4}>
        <meshPhysicalMaterial color={color} roughness={0.7} metalness={0.6} />
      </RoundedBox>

      {/* Ear Brackets */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.005]}>
          <mesh dispose={null} geometry={getBoxGeometry(0.012, height * 0.85, 0.005)}>
            <meshPhysicalMaterial color="#111" roughness={0.4} metalness={0.8} />
          </mesh>
          {[-1, 0, 1].map(vert => (
            <mesh key={vert} position={[0, vert * height * 0.35, 0.003]}>
              <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Supervisor Engine / Control Panel (Left Side) */}
      <group position={[-INNER_WIDTH * 0.35, height * 0.2, 0.008]}>
        <mesh dispose={null} geometry={getBoxGeometry(0.08, 0.04, 0.004)}>
          <meshStandardMaterial color="#1a1c23" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Status LEDs */}
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={`sup-led-${i}`} position={[-0.03 + i * 0.01, 0, 0.002]}>
            <circleGeometry args={[0.002, 16]} />
            <meshStandardMaterial ref={el => ledRefs.current[i] = el} color="#00ffaa" emissive="#00ffaa" toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Main Top Bezel Label */}
      <group position={[0, height * 0.22, 0.009]}>
        <Center position={[0, 0, 0]}>
          <group position={[0, (label.split('\n').length > 1 ? label.split('\n').length * (sizeU > 8 ? 0.025 : 0.01) : 0), 0]}>
            {label.split('\n').map((line, index) => (
              <Center key={index} position={[0, -index * (sizeU > 8 ? 0.05 : 0.025), 0]}>
                <Text3D
                  font="./fonts/helvetiker_regular.typeface.json"
                  size={sizeU > 8 ? 0.028 : 0.015}
                  height={sizeU > 8 ? 0.004 : 0.002}
                >
                  {line}
                  <meshStandardMaterial color="#000000" />
                </Text3D>
              </Center>
            ))}
          </group>
        </Center>
      </group>

      {/* Massive Fan Trays (Bottom Left) */}
      <group position={[-INNER_WIDTH * 0.35, -height * 0.25, 0.008]}>
        <mesh dispose={null} geometry={getBoxGeometry(0.08, height * 0.45, 0.002)}>
          <meshStandardMaterial color="#151515" />
        </mesh>
        {/* Fan grills dynamically scaled */}
        {Array.from({ length: Math.max(3, Math.floor(sizeU * 0.6)) }).map((_, idx, arr) => (
          <group key={`fan-${idx}`} position={[0, (idx - arr.length / 2 + 0.5) * 0.025, 0.001]}>
            <mesh>
              <cylinderGeometry args={[0.01, 0.01, 0.001, 16]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#000" />
            </mesh>
            {/* Grill bars */}
            {[-0.005, 0, 0.005].map((bar, i) => (
              <mesh key={`bar-${i}`} position={[bar, 0, 0.001]} dispose={null} geometry={getBoxGeometry(0.001, 0.02, 0.001)}>
                <meshStandardMaterial color="#444" metalness={0.9} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Line Cards / Blades (Right Side) dynamically scaled */}
      <group position={[INNER_WIDTH * 0.1, -height * 0.15, 0.008]}>
        {Array.from({ length: Math.max(6, Math.floor(sizeU * 1.2)) }).map((_, rIdx, arr) => (
          <group key={`blade-${rIdx}`} position={[0, (rIdx - arr.length / 2 + 0.5) * 0.016, 0]}>
            {/* Blade faceplate */}
            <mesh dispose={null} geometry={getBoxGeometry(INNER_WIDTH * 0.7, 0.01, 0.002)}>
              <meshStandardMaterial color="#303540" metalness={0.7} roughness={0.5} />
            </mesh>
            {/* Blade handle */}
            <mesh position={[-INNER_WIDTH * 0.33, 0, 0.002]} dispose={null} geometry={getBoxGeometry(0.004, 0.008, 0.006)}>
              <meshStandardMaterial color="#555" />
            </mesh>
            {/* High density QSFP/SFP Ports on each blade */}
            {Array.from({ length: 12 }).map((_, pIdx) => (
              <group key={`port-${pIdx}`} position={[-INNER_WIDTH * 0.28 + pIdx * 0.025, 0, 0.001]}>
                {/* Port housing */}
                <mesh dispose={null} geometry={getBoxGeometry(0.018, 0.008, 0.003)}>
                  <meshStandardMaterial color="#111" metalness={0.8} />
                </mesh>
                {/* Yellow/Orange fiber cable plugging in */}
                {pIdx % 3 !== 0 && (
                  <mesh position={[0, 0, 0.004]}>
                    <cylinderGeometry args={[0.002, 0.002, 0.006, 8]} rotation={[Math.PI/2, 0, 0]} />
                    <meshStandardMaterial color={pIdx % 2 === 0 ? "#ffcc00" : "#00ffff"} roughness={0.3} />
                  </mesh>
                )}
                {/* Port Activity LED */}
                <mesh position={[-0.008, 0.003, 0.002]}>
                  <circleGeometry args={[0.001, 8]} />
                  <meshStandardMaterial 
                    ref={el => ledRefs.current[4 + rIdx * 12 + pIdx] = el}
                    color="#00aaff" 
                    emissive="#00aaff" 
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
