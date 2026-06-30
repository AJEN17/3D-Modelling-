import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';

export default function HPServer({ sizeU = 2, label = 'HP SERVER', color = '#cc0000' }) {
  const height = sizeU * U_HEIGHT;
  const pwrLedRef = useRef();
  const driveLedsRef = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Breathing power LED
    if (pwrLedRef.current) {
      pwrLedRef.current.emissiveIntensity = 0.5 + 0.5 * Math.sin(t * 2);
    }

    // Occasional drive activity blinks
    driveLedsRef.current.forEach((ref, i) => {
      if (!ref) return;
      // mostly off, random blinks
      const active = Math.sin(t * (10 + i * 2.5)) * Math.cos(t * (3.1 + i)) > 0.8;
      ref.emissiveIntensity = active ? 1.5 : 0;
    });
  });

  const numBays = 16;
  const bayWidth = 0.022;
  const bayHeight = height * 0.6;
  const baySpacing = (INNER_WIDTH * 0.55) / numBays;

  return (
    <group position={[0, 0, 0.002]}>
      {/* Main Faceplate */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.004]} radius={0.001} smoothness={4}>
        <meshPhysicalMaterial color={color} roughness={0.4} metalness={0.7} clearcoat={0.3} />
      </RoundedBox>

      {/* Ear Brackets */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.001]}>
          <mesh>
            <boxGeometry args={[0.012, height * 0.85, 0.005]} />
            <meshPhysicalMaterial color="#222" roughness={0.4} metalness={0.8} />
          </mesh>
          {[-1, 1].map(vert => (
            <mesh key={vert} position={[0, vert * height * 0.35, 0.003]}>
              <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Front I/O Panel (Left) */}
      <group position={[-INNER_WIDTH * 0.4, 0, 0.003]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.04, height * 0.7, 0.002]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* VGA port */}
        <mesh position={[0, height * 0.15, 0.001]}>
          <boxGeometry args={[0.012, 0.006, 0.003]} />
          <meshStandardMaterial color="#0044aa" roughness={0.6} metalness={0.4} />
        </mesh>

        {/* USB ports */}
        <mesh position={[0, -height * 0.1, 0.001]}>
          <boxGeometry args={[0.008, 0.004, 0.003]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0, -height * 0.15, 0.001]}>
          <boxGeometry args={[0.008, 0.004, 0.003]} />
          <meshStandardMaterial color="#222" />
        </mesh>

        {/* Power Button & LED */}
        <group position={[0, height * 0.25, 0.001]}>
          <mesh>
            <circleGeometry args={[0.004, 16]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <sphereGeometry args={[0.0015, 8, 8]} />
            <meshStandardMaterial 
              ref={pwrLedRef}
              color="#00ff00" 
              emissive="#00ff00" 
              emissiveIntensity={1} 
              toneMapped={false} 
            />
          </mesh>
        </group>

        {/* Label underneath */}
        <group position={[0, -height * 0.25, 0.001]}>
          <Center position={[0, 0, 0]}>
            <Text3D
              font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
              size={0.005}
              height={0.001}
            >
              {label}
              <meshBasicMaterial color="#fff" />
            </Text3D>
          </Center>
        </group>
      </group>

      {/* Recessed Drive Bays (Center/Right) */}
      <group position={[0, 0, 0.003]}>
        {Array.from({ length: numBays }).map((_, i) => (
          <group key={`bay-${i}`} position={[-INNER_WIDTH * 0.25 + i * baySpacing, 0, 0]}>
            {/* Recessed bay cavity */}
            <mesh position={[0, 0, -0.002]}>
              <boxGeometry args={[bayWidth * 0.9, bayHeight, 0.004]} />
              <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
            </mesh>
            {/* Drive carrier/tray */}
            <mesh>
              <boxGeometry args={[bayWidth * 0.85, bayHeight * 0.95, 0.002]} />
              <meshPhysicalMaterial color="#2a2a2a" roughness={0.6} metalness={0.7} />
            </mesh>
            {/* Handle/latch at top */}
            <mesh position={[0, bayHeight * 0.42, 0.002]}>
              <boxGeometry args={[bayWidth * 0.6, 0.003, 0.002]} />
              <meshStandardMaterial color="#cc0000" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Drive activity LED */}
            <mesh position={[-bayWidth * 0.35, bayHeight * 0.42, 0.003]}>
              <boxGeometry args={[0.002, 0.002, 0.001]} />
              <meshStandardMaterial 
                ref={el => driveLedsRef.current[i] = el}
                color="#0f0" 
                emissive="#0f0" 
                emissiveIntensity={0} 
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
