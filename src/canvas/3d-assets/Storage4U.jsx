import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';
export default function Storage4U({ sizeU = 4, label = 'STORAGE' }) {
  const height = sizeU * U_HEIGHT;
  const driveLedsRef = useRef([]);
  const numRows = 4;
  const numCols = 6;
  
  // Matrix/Waterfall animation logic
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    driveLedsRef.current.forEach((ref, idx) => {
      if (!ref) return;
      
      const row = Math.floor(idx / numCols);
      const col = idx % numCols;
      
      // Complex waveform for matrix effect (cascading down and right)
      // Combines a slow scanning wave with high-frequency noise for "data activity"
      const wave = Math.sin(t * 3 - row * 1.5 - col * 0.5);
      const dataNoise = Math.sin(t * (25 + col * 2) + row * 13) * Math.cos(t * (17 + row));
      
      // When the main wave hits, activate the drive, modulated by data noise
      if (wave > 0.4 && dataNoise > 0.2) {
        ref.emissiveIntensity = 2.0 + dataNoise; // Bright flash
        ref.color.setHex(0x00ff00); // Green
      } else if (wave > 0.2 && dataNoise < -0.6) {
        ref.emissiveIntensity = 1.0; 
        ref.color.setHex(0x00aaff); // Occasional Blue flash for deep access
      } else {
        ref.emissiveIntensity = 0.05; // Idle glow
        ref.color.setHex(0x005500);
      }
    });
  });
  const bayWidth = 0.045; // 3.5" large drive
  const bayHeight = (height * 0.8) / numRows;
  const baySpacingX = (INNER_WIDTH * 0.7) / numCols;
  const baySpacingY = bayHeight * 1.05;
  return (
    <group position={[0, 0, 0.002]}>
      {/* Main Green Metallic Faceplate */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.98, 0.006]} radius={0.002} smoothness={4}>
        <meshPhysicalMaterial color="#00b85c" roughness={0.3} metalness={0.7} clearcoat={0.6} clearcoatRoughness={0.2} />
      </RoundedBox>
      {/* Ear Brackets (Heavy Duty for 4U) */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.001]}>
          <mesh>
            <boxGeometry args={[0.012, height * 0.9, 0.008]} />
            <meshPhysicalMaterial color="#111" roughness={0.5} metalness={0.9} />
          </mesh>
          {/* 6 screws per ear for 4U weight */}
          {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map(vert => (
            <mesh key={vert} position={[0, vert * (height / 6) * 0.8, 0.004]}>
              <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#333" metalness={1} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Control & LCD Panel (Far Left) */}
      <group position={[-INNER_WIDTH * 0.38, 0, 0.004]}>
        {/* Recessed Bezel */}
        <mesh>
          <boxGeometry args={[0.06, height * 0.85, 0.002]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
        
        {/* Glowing LCD Screen */}
        <mesh position={[0, height * 0.25, 0.001]}>
          <planeGeometry args={[0.05, 0.02]} />
          <meshBasicMaterial color="#001833" />
        </mesh>
        <mesh position={[0, height * 0.25, 0.0011]}>
          <planeGeometry args={[0.045, 0.015]} />
          <meshBasicMaterial color="#1a8aff" opacity={0.4} transparent toneMapped={false} />
        </mesh>
        {/* Large Visible Name Label (Rotated 90 degrees) */}
        <group position={[0, -height * 0.1, 0.001]} rotation={[0, 0, Math.PI / 2]}>
          <Center position={[0, 0, 0]}>
            <Text3D
              font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
              size={0.012}
              height={0.002}
              bevelEnabled
              bevelSize={0.0005}
              bevelThickness={0.0005}
            >
              {label.split('\n')[0]} {/* First line */}
              <meshStandardMaterial color="#fff" metalness={0.5} roughness={0.2} />
            </Text3D>
          </Center>
        </group>
      </group>
      {/* Massive Storage Array Grid (Center/Right) */}
      <group position={[INNER_WIDTH * 0.06, 0, 0.004]}>
        {Array.from({ length: numRows }).map((_, rIdx) => (
          <group key={`drive-row-${rIdx}`} position={[0, (numRows / 2 - rIdx - 0.5) * baySpacingY, 0]}>
            {Array.from({ length: numCols }).map((_, cIdx) => (
              <group key={`bay-${rIdx}-${cIdx}`} position={[-INNER_WIDTH * 0.3 + cIdx * baySpacingX, 0, 0]}>
                {/* 3.5" Recessed bay cavity */}
                <mesh position={[0, 0, -0.002]}>
                  <boxGeometry args={[bayWidth * 0.9, bayHeight * 0.9, 0.005]} />
                  <meshStandardMaterial color="#000" />
                </mesh>
                {/* Drive carrier/tray (Chunky metallic) */}
                <mesh>
                  <boxGeometry args={[bayWidth * 0.85, bayHeight * 0.85, 0.003]} />
                  <meshPhysicalMaterial color="#222" roughness={0.4} metalness={0.9} />
                </mesh>
                {/* Release Latch */}
                <mesh position={[bayWidth * 0.3, 0, 0.002]}>
                  <boxGeometry args={[0.005, bayHeight * 0.8, 0.002]} />
                  <meshStandardMaterial color="#cc0000" metalness={0.7} />
                </mesh>
                {/* Drive activity LED Strip (Matrix effect target) */}
                <mesh position={[-bayWidth * 0.3, -bayHeight * 0.3, 0.003]}>
                  <boxGeometry args={[0.008, 0.002, 0.001]} />
                  <meshStandardMaterial 
                    ref={el => driveLedsRef.current[rIdx * numCols + cIdx] = el}
                    color="#00ff00" 
                    emissive="#00ff00" 
                    emissiveIntensity={0} 
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
