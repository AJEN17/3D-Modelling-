/**
 * 3D Asset: Nokia7750
 * -------------------
 * This component renders a specific piece of equipment (Server, Switch, Patch Panel, etc.)
 * in 3D space. It is typically instantiated inside a DetailedRack.
 */
import { getBoxGeometry, getCylinderGeometry, getPlaneGeometry } from '../utils/geometryCache';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text3D, Center } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';
export default function Nokia7750({ sizeU = 14, label = 'NOKIA 7750 SR-12\nMBMUMLAKSAR02NSR12' }) {
  const height = sizeU * U_HEIGHT;
  const topGrillHeight = 3 * U_HEIGHT;
  const bottomGrillHeight = 3 * U_HEIGHT;
  const cardHeight = 8 * U_HEIGHT;
  
  const topGrillY = height / 2 - topGrillHeight / 2;
  const bottomGrillY = -height / 2 + bottomGrillHeight / 2;
  const numLineCards = 12;
  const portsPerCard = 24; 
  
  const laserRefs = useRef([]);
  // Pre-calculate static port colors so it looks populated but clean
  const portColors = useMemo(() => {
    const colors = [];
    for (let i = 0; i < numLineCards * portsPerCard; i++) {
      const rand = Math.random();
      if (rand > 0.9) colors.push(0x00ff00); // 10% Green
      else if (rand > 0.7) colors.push(0x0055ff); // 20% Blue
      else if (rand > 0.2) colors.push(0xff0033); // 50% Red
      else colors.push(0x220000); // 20% Off/Idle
    }
    return colors;
  }, []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Very subtle, slow breathing effect instead of chaotic flashing
    laserRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      // Only pulse the active ones
      if (portColors[idx] !== 0x220000) {
        ref.emissiveIntensity = 0.8 + Math.sin(t * 1.5 + idx * 0.1) * 0.4;
      }
    });
  });
  const cardWidth = (INNER_WIDTH * 0.8) / numLineCards;
  const lines = label.split('\n');
  return (
    <group position={[0, 0, 0.002]}>
      {/* Massive Industrial Grey Chassis */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.98, 0.012]} radius={0.002} smoothness={4}>
        <meshPhysicalMaterial color="#8a8d91" roughness={0.7} metalness={0.6} clearcoat={0.1} />
      </RoundedBox>
      {/* Massive Rack Mounting Ears (Full Height) - Moved forward to prevent Z-fighting */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.006]}>
          <mesh dispose={null} geometry={getBoxGeometry(0.012, height * 0.96, 0.004)}>
            <meshPhysicalMaterial color="#333" roughness={0.7} metalness={0.9} />
          </mesh>
          {/* Dense screw mounting for a heavy 14U chassis */}
          {Array.from({ length: 14 }).map((_, i) => (
            <mesh key={i} position={[0, -height * 0.45 + (i * height) / 13, 0.002]}>
              <cylinderGeometry args={[0.002, 0.002, 0.002, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#111" metalness={1} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Top Air Intake Grill (3U) */}
      <group position={[0, topGrillY, 0.006]}>
        {/* Recessed Fan bay */}
        <mesh dispose={null} geometry={getBoxGeometry(INNER_WIDTH * 0.85, topGrillHeight * 0.9, 0.004)}>
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        {/* Horizontal Vents */}
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={`vent-t-${i}`} position={[0, -topGrillHeight * 0.35 + i * (topGrillHeight * 0.14), 0.003]} dispose={null} geometry={getBoxGeometry(INNER_WIDTH * 0.85, 0.004, 0.002)}>
            <meshStandardMaterial color="#555" metalness={0.8} />
          </mesh>
        ))}
      </group>
      {/* Bottom Power & Cooling (3U) */}
      <group position={[0, bottomGrillY, 0.006]}>
        {/* Recessed Fan bay */}
        <mesh dispose={null} geometry={getBoxGeometry(INNER_WIDTH * 0.85, bottomGrillHeight * 0.9, 0.004)}>
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
        
        {/* Vents (Moved UP slightly to avoid label bezel) */}
        <group position={[0, 0.02, 0]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`vent-b-${i}`} position={[0, -bottomGrillHeight * 0.25 + i * (bottomGrillHeight * 0.14), 0.003]} dispose={null} geometry={getBoxGeometry(INNER_WIDTH * 0.85, 0.004, 0.002)}>
              <meshStandardMaterial color="#555" metalness={0.8} />
            </mesh>
          ))}
        </group>
        
        {/* Solid Bezel Plate for Label (Moved DOWN slightly) */}
        <mesh position={[0, -0.04, 0.005]} dispose={null} geometry={getBoxGeometry(INNER_WIDTH * 0.6, Math.max(0.04, lines.length * 0.02), 0.002)}>
          <meshStandardMaterial color="#333" metalness={0.7} />
        </mesh>
        {/* Dynamic multi-line Text Label */}
        <group position={[0, -0.04, 0.006]}>
          <group position={[0, (lines.length > 1 ? (lines.length - 1) * 0.008 : 0), 0]}>
            {lines.map((line, index) => (
              <Center key={index} position={[0, -index * 0.016, 0]}>
                <Text3D
                  font="./fonts/helvetiker_regular.typeface.json"
                  size={index === 0 ? 0.012 : 0.008}
                  height={0.002}
                  bevelEnabled
                  bevelSize={0.0005}
                  bevelThickness={0.0005}
                >
                  {line}
                  <meshStandardMaterial color="#fff" metalness={0.5} roughness={0.2} />
                </Text3D>
              </Center>
            ))}
          </group>
        </group>
      </group>
      {/* The 12 Vertical Line Cards (Center 8U) */}
      <group position={[0, 0, 0.006]}>
        {/* Recessed card cage background */}
        <mesh position={[0, 0, -0.002]} dispose={null} geometry={getBoxGeometry(INNER_WIDTH * 0.85, cardHeight, 0.002)}>
          <meshStandardMaterial color="#000" />
        </mesh>
        {Array.from({ length: numLineCards }).map((_, cIdx) => (
          <group key={`card-${cIdx}`} position={[-INNER_WIDTH * 0.4 + cardWidth / 2 + cIdx * cardWidth + 0.01, 0, 0]}>
            {/* Card Faceplate */}
            <mesh dispose={null} geometry={getBoxGeometry(cardWidth * 0.9, cardHeight * 0.98, 0.002)}>
              <meshStandardMaterial color="#7a7c80" roughness={0.4} metalness={0.9} />
            </mesh>
            
            {/* Card Release Levers (Top & Bottom) */}
            {[-1, 1].map(vert => (
              <mesh key={`lever-${vert}`} position={[0, vert * cardHeight * 0.45, 0.004]} dispose={null} geometry={getBoxGeometry(cardWidth * 0.6, 0.025, 0.006)}>
                <meshStandardMaterial color="#222" metalness={0.8} />
              </mesh>
            ))}
            {/* SFP Port Cages (Silver metallic housing) */}
            <mesh position={[0, 0, 0.002]} dispose={null} geometry={getBoxGeometry(cardWidth * 0.6, cardHeight * 0.85, 0.004)}>
              <meshStandardMaterial color="#ccc" metalness={1} roughness={0.2} />
            </mesh>
            {/* Fiber Optic Ports (Vertical Array) */}
            <group position={[0, 0, 0.004]}>
              {Array.from({ length: portsPerCard }).map((_, pIdx) => {
                const globalPortIdx = cIdx * portsPerCard + pIdx;
                const pColor = portColors[globalPortIdx];
                return (
                  <group key={`port-${pIdx}`} position={[0, cardHeight * 0.4 - pIdx * (cardHeight * 0.8 / portsPerCard), 0]}>
                    {/* SFP Port Cavity */}
                    <mesh position={[0, 0, 0]} dispose={null} geometry={getBoxGeometry(cardWidth * 0.4, cardWidth * 0.35, 0.002)}>
                      <meshStandardMaterial color="#000" />
                    </mesh>
                    {/* Laser Diode Bleed (Deep inside port) */}
                    <mesh position={[0, 0, 0.001]} dispose={null} geometry={getBoxGeometry(0.002, 0.002, 0.001)}>
                      <meshStandardMaterial 
                        ref={el => laserRefs.current[globalPortIdx] = el}
                        color={pColor} 
                        emissive={pColor}
                        emissiveIntensity={pColor === 0x220000 ? 0.2 : 0.8} 
                        toneMapped={false}
                      />
                    </mesh>
                  </group>
                );
              })}
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
