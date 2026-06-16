import React, { useRef, useState } from 'react';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';

export default function Equipment({ data }) {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);

  // Parse color mapping
  let color = '#ffffff';
  let isRack = false;
  if (data.type === 'infra') color = '#00AEEF';
  if (data.type === 'core') { color = '#8CC63F'; isRack = true; }
  if (data.type === 'coldAisle') color = '#009245';
  if (data.type === 'hotAisle') color = '#F1A19D';
  if (data.type === 'pillar') color = '#ED1C24';
  if (data.type === 'fap') color = '#FF5722';

  const isPAC = data.name.includes("PAC");

  return (
    <group position={[data.position[0], data.height / 2, data.position[2]]}>
      {/* Main Block */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={(e) => setHover(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[data.width, data.height, data.depth]} />
        <meshStandardMaterial 
          color={hovered ? '#ffffaa' : color} 
          transparent={!isPAC && !isRack} 
          opacity={0.9}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Frame / Wireframe */}
      <mesh>
        <boxGeometry args={[data.width + 0.01, data.height + 0.01, data.depth + 0.01]} />
        <meshBasicMaterial color={hovered ? 'white' : '#222222'} wireframe />
      </mesh>

      {/* Visual Server Blades inside Core Racks */}
      {isRack && (
        <group>
           {/* Dark glass front panel */}
           <mesh position={[0, 0, data.depth / 2 + 0.01]}>
             <planeGeometry args={[data.width * 0.9, data.height * 0.9]} />
             <meshPhysicalMaterial color="#111" transparent opacity={0.8} roughness={0.1} metalness={0.8} />
           </mesh>
           {/* Horizontal Lines (Blades) */}
           {Array.from({ length: 10 }).map((_, i) => (
             <mesh key={i} position={[0, -data.height/2 + 0.2 + (i * 0.18), data.depth / 2 + 0.005]}>
               <boxGeometry args={[data.width * 0.8, 0.02, 0.05]} />
               <meshStandardMaterial color="#444" emissive={Math.random() > 0.7 ? "#00ff00" : "#000000"} emissiveIntensity={0.5} />
             </mesh>
           ))}
        </group>
      )}

      {/* PAC Vent Visuals */}
      {isPAC && (
        <mesh position={[0, data.height / 2 + 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[data.width * 0.8, data.depth * 0.8]} />
          <meshBasicMaterial color="#333" />
        </mesh>
      )}

      {/* Label Text - Lifted slightly and Billboarded to face camera always */}
      <Billboard position={[0, data.height / 2 + 0.4, 0]}>
        <Text
          fontSize={0.25}
          color={hovered ? "white" : "black"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="white"
        >
          {data.name}
        </Text>
      </Billboard>
    </group>
  );
}
