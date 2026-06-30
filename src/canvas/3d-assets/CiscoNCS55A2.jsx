import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';

export default function CiscoNCS55A2({ sizeU = 2, label = 'NCS 55A2' }) {
  const height = sizeU * U_HEIGHT;
  
  // 36 QSFP28 ports (2 rows of 18)
  const numCols = 18;
  const numRows = 2;
  const portSpacingX = (INNER_WIDTH * 0.42) / numCols;
  const portSpacingY = height * 0.3;
  
  const ledRefs = useRef([]);

  // Randomize some ports to be active, others idle
  const portStates = useMemo(() => {
    return Array.from({ length: numCols * numRows }, () => Math.random() > 0.4);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ledRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      if (portStates[idx]) {
        // High-speed data flickering
        const flicker = Math.random() > 0.1 ? 1 : 0.2;
        ref.emissiveIntensity = 1 + Math.sin(t * 20 + idx) * 0.5 * flicker;
        ref.color.setHex(0x00ffaa); // Cyan/green activity
      } else {
        ref.emissiveIntensity = 0.1;
        ref.color.setHex(0x003311); // Dim green
      }
    });
  });

  const lines = label.split('\n');

  return (
    <group position={[0, 0, 0.002]}>
      {/* Premium Dark Metallic Chassis */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.96, 0.01]} radius={0.002} smoothness={4}>
        <meshPhysicalMaterial color="#2b2e33" roughness={0.6} metalness={0.7} clearcoat={0.3} />
      </RoundedBox>

      {/* Rack Mounting Ears */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.004]}>
          <mesh>
            <boxGeometry args={[0.012, height * 0.85, 0.004]} />
            <meshPhysicalMaterial color="#1a1a1a" roughness={0.8} metalness={0.9} />
          </mesh>
          {[-1, 0, 1].map(vert => (
            <mesh key={vert} position={[0, vert * height * 0.3, 0.002]}>
              <cylinderGeometry args={[0.002, 0.002, 0.002, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#555" metalness={1} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Heavy Duty Intake Grill (Left Side) */}
      <group position={[-INNER_WIDTH * 0.25, 0, 0.006]}>
        <mesh position={[0, 0, 0]}>
           <boxGeometry args={[INNER_WIDTH * 0.4, height * 0.75, 0.002]} />
           <meshStandardMaterial color="#050505" />
        </mesh>
        {/* Horizontal slatted grill lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={`grill-${i}`} position={[0, -height * 0.32 + i * (height * 0.64 / 11), 0.0015]}>
             <boxGeometry args={[INNER_WIDTH * 0.38, 0.003, 0.002]} />
             <meshStandardMaterial color="#444" metalness={0.8} />
          </mesh>
        ))}
        {/* Orange Accent Line indicating NCS series - Matches the user's diagram color */}
        <mesh position={[0, -height * 0.38, 0.0025]}>
          <boxGeometry args={[INNER_WIDTH * 0.4, 0.004, 0.002]} />
          <meshStandardMaterial color="#C55A11" />
        </mesh>
      </group>

      {/* LCD / Status Panel */}
      <group position={[0, height * 0.2, 0.006]}>
        <mesh>
          <boxGeometry args={[0.08, 0.02, 0.002]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[0.07, 0.015]} />
          <meshBasicMaterial color="#0a2233" />
        </mesh>
      </group>

      {/* Label Projection (Center/Left overlaying the grill) */}
      <group position={[-INNER_WIDTH * 0.25, 0, 0.008]}>
         <Center position={[0, 0.01, 0]}>
            <Text3D
              font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
              size={0.012}
              height={0.002}
            >
              {lines[0] || 'NCS 55A2'}
              <meshStandardMaterial color="#fff" metalness={0.4} />
            </Text3D>
         </Center>
         <Center position={[0, -0.015, 0]}>
            <Text3D
              font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
              size={0.009}
              height={0.001}
            >
              {lines[1] || ''}
              <meshStandardMaterial color="#aaa" />
            </Text3D>
         </Center>
      </group>

      {/* QSFP Port Array (Right Side) */}
      <group position={[INNER_WIDTH * 0.02, 0, 0.006]}>
        {/* Port housing block */}
        <mesh position={[INNER_WIDTH * 0.21, 0, 0.0005]}>
          <boxGeometry args={[INNER_WIDTH * 0.45, height * 0.75, 0.002]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {Array.from({ length: numRows }).map((_, rIdx) => (
          <group key={`row-${rIdx}`} position={[0, (numRows / 2 - rIdx - 0.5) * portSpacingY, 0]}>
            {Array.from({ length: numCols }).map((_, cIdx) => {
               const idx = rIdx * numCols + cIdx;
               return (
                 <group key={`port-${cIdx}`} position={[cIdx * portSpacingX, 0, 0]}>
                    {/* Metal QSFP Cage */}
                    <mesh position={[0, 0, 0.0015]}>
                      <boxGeometry args={[0.018, 0.012, 0.004]} />
                      <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.3} />
                    </mesh>
                    {/* Dark cavity */}
                    <mesh position={[0, 0, 0.003]}>
                      <boxGeometry args={[0.014, 0.008, 0.002]} />
                      <meshBasicMaterial color="#000" />
                    </mesh>
                    {/* Pull Tab / Connector */}
                    {portStates[idx] && (
                      <mesh position={[0, 0, 0.005]}>
                        <boxGeometry args={[0.012, 0.006, 0.008]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
                      </mesh>
                    )}
                    {/* Status LED */}
                    <mesh position={[0, -0.008, 0.0035]}>
                      <boxGeometry args={[0.004, 0.002, 0.001]} />
                      <meshStandardMaterial 
                        ref={el => ledRefs.current[idx] = el}
                        color="#00ffaa"
                        emissive="#00ffaa"
                        toneMapped={false}
                      />
                    </mesh>
                 </group>
               );
            })}
          </group>
        ))}
      </group>
    </group>
  );
}
