/**
 * 3D Asset: PSM1U
 * -------------------
 * This component renders a specific piece of equipment (Server, Switch, Patch Panel, etc.)
 * in 3D space. It is typically instantiated inside a DetailedRack.
 */
import { getBoxGeometry, getCylinderGeometry, getPlaneGeometry } from '../utils/geometryCache';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';
export default function PSM1U({ sizeU = 1, label = 'PSM' }) {
  const height = sizeU * U_HEIGHT;
  const pwrMeterRef = useRef();
  const faultLedRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Simulate changing power draw on the meter (jittering glow intensity)
    if (pwrMeterRef.current) {
      const load = 0.5 + Math.sin(t * 0.5) * 0.3 + Math.sin(t * 12) * 0.1;
      pwrMeterRef.current.emissiveIntensity = 0.5 + load * 1.5;
      // Shift color slightly based on load (green to orange to red)
      if (load > 0.7) {
        pwrMeterRef.current.color.setHex(0xffaa00);
        pwrMeterRef.current.emissive.setHex(0xffaa00);
      } else {
        pwrMeterRef.current.color.setHex(0x00ffcc);
        pwrMeterRef.current.emissive.setHex(0x00ffcc);
      }
    }
    // Fault LED stays off unless random "spike" occurs
    if (faultLedRef.current) {
      const spike = Math.random() > 0.995;
      faultLedRef.current.emissiveIntensity = spike ? 2.0 : 0;
    }
  });
  return (
    <group position={[0, 0, 0.002]}>
      {/* Industrial Orange/Amber Faceplate */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.005]} radius={0.001} smoothness={4}>
        <meshPhysicalMaterial color="#ff8800" roughness={0.6} metalness={0.8} clearcoat={0.1} />
      </RoundedBox>
      {/* Ear Brackets (Black Heavy Duty) */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.002]}>
          <mesh dispose={null} geometry={getBoxGeometry(0.012, height * 0.85, 0.006)}>
            <meshPhysicalMaterial color="#111" roughness={0.7} metalness={0.9} />
          </mesh>
          {[-1, 1].map(vert => (
            <mesh key={vert} position={[0, vert * height * 0.3, 0.004]}>
              <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#000" metalness={1} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Deep Recessed Cooling Grill (Center) */}
      <group position={[0, 0, 0.001]}>
        <mesh position={[0, 0, 0]} dispose={null} geometry={getBoxGeometry(0.2, height * 0.7, 0.006)}>
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
        {/* Horizontal Grill Bars */}
        {[-3, -1, 1, 3].map(vert => (
          <mesh key={vert} position={[0, vert * height * 0.1, 0.003]} dispose={null} geometry={getBoxGeometry(0.19, 0.003, 0.003)}>
            <meshStandardMaterial color="#333" metalness={0.8} />
          </mesh>
        ))}
      </group>
      {/* Power Meter LCD (Left) */}
      <group position={[-INNER_WIDTH * 0.25, 0, 0.004]}>
        <mesh dispose={null} geometry={getBoxGeometry(0.05, 0.02, 0.002)}>
          <meshStandardMaterial color="#000" />
        </mesh>
        {/* The glowing digital readout */}
        <mesh position={[0, 0, 0.0015]} dispose={null} geometry={getPlaneGeometry(0.045, 0.015)}>
          <meshStandardMaterial 
            ref={pwrMeterRef}
            color="#00ffcc" 
            emissive="#00ffcc" 
            emissiveIntensity={1} 
            toneMapped={false} 
          />
        </mesh>
        {/* Label above meter */}
        <group position={[0, height * 0.25, 0.001]}>
          <Center position={[0, 0, 0]}>
            <Text3D
              font="./fonts/helvetiker_regular.typeface.json"
              size={0.003}
              height={0.001}
            >
              INPUT LOAD
              <meshBasicMaterial color="#000" />
            </Text3D>
          </Center>
        </group>
      </group>
      {/* Massive Power Handle (Right) */}
      <group position={[INNER_WIDTH * 0.3, 0, 0.005]}>
        {/* Handle bases */}
        {[-1, 1].map(vert => (
          <mesh key={vert} position={[0, vert * height * 0.25, 0]} dispose={null} geometry={getBoxGeometry(0.015, 0.005, 0.015)}>
            <meshStandardMaterial color="#222" metalness={0.9} />
          </mesh>
        ))}
        {/* Handle Bar */}
        <mesh position={[0, 0, 0.007]} dispose={null} geometry={getCylinderGeometry(0.003, 0.003, height * 0.55, 12)}>
          <meshStandardMaterial color="#888" roughness={0.3} metalness={1} />
        </mesh>
      </group>
      {/* Status LEDs (Far Right next to handle) */}
      <group position={[INNER_WIDTH * 0.4, 0, 0.004]}>
        {/* Power Good (Green) */}
        <mesh position={[0, height * 0.2, 0]}>
          <circleGeometry args={[0.002, 16]} />
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={1} toneMapped={false} />
        </mesh>
        {/* Fault (Red, starts off) */}
        <mesh position={[0, -height * 0.2, 0]}>
          <circleGeometry args={[0.002, 16]} />
          <meshStandardMaterial ref={faultLedRef} color="#ff0000" emissive="#ff0000" emissiveIntensity={0} toneMapped={false} />
        </mesh>
      </group>
      {/* Main Label */}
      <group position={[-INNER_WIDTH * 0.38, 0, 0.006]}>
        <Center position={[0, 0, 0]}>
          <Text3D
            font="./fonts/helvetiker_regular.typeface.json"
            size={0.012}
            height={0.002}
            bevelEnabled
            bevelSize={0.0005}
            bevelThickness={0.0005}
          >
            {label}
            <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
          </Text3D>
        </Center>
      </group>
    </group>
  );
}
