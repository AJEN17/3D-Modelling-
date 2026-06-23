import { useRef, useState } from 'react';
import { Text, Billboard } from '@react-three/drei';

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
  if (data.type === 'tx') { color = '#FFFF00'; isRack = true; }
  if (data.type === 'nld') { color = '#662D91'; isRack = true; }
  if (data.type === 'vas') { color = '#F7931E'; isRack = true; }
  if (data.type === 'structural') color = '#ED1C24';
  if (data.type === 'cylinder') color = '#FF0000'; // Fixed to Red
  if (data.type === 'workstation') color = '#F7931E'; // Fixed to Orange
  if (data.type === 'facebook') color = '#ED1C24'; // Added facebook/IT Rack

  const isPAC = data.name && data.name.includes("PAC");

  // Handle single float rotation from JSON (Y-axis) or fallback to array
  const rot = typeof data.rotation === 'number' ? [0, data.rotation, 0] : (data.rotation || [0, 0, 0]);

  // Pre-calculate server blade glow state so it doesn't flicker on every render (React purity rule)
  const [serverBlades] = useState(() => Array.from({ length: 10 }).map(() => Math.random() > 0.7));

  return (
    <group 
      position={[data.position[0], data.height / 2, data.position[2]]}
      rotation={rot}
    >
      {/* Main Block */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        castShadow
        receiveShadow
      >
        {data.type === 'cylinder' ? (
          <cylinderGeometry args={[Math.max(data.width, data.depth) / 2, Math.max(data.width, data.depth) / 2, data.height, 32]} />
        ) : (
          <boxGeometry args={[data.width, data.height, data.depth]} />
        )}
        <meshStandardMaterial 
          color={hovered ? '#ffffaa' : color} 
          transparent={!isPAC && !isRack && data.type !== 'cylinder'} 
          opacity={0.9}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Frame / Wireframe */}
      {data.type !== 'cylinder' && (
        <mesh>
          <boxGeometry args={[data.width + 0.01, data.height + 0.01, data.depth + 0.01]} />
          <meshBasicMaterial color={hovered ? 'white' : '#222222'} wireframe />
        </mesh>
      )}

      {/* Visual Server Blades inside Core Racks */}
      {isRack && (
        <group>
           {/* Dark glass front panel */}
           <mesh position={[0, 0, data.depth / 2 + 0.01]}>
             <planeGeometry args={[data.width * 0.9, data.height * 0.9]} />
             <meshPhysicalMaterial color="#111" transparent opacity={0.8} roughness={0.1} metalness={0.8} />
           </mesh>
           {/* Horizontal Lines (Blades) */}
           {serverBlades.map((isGlowing, i) => (
             <mesh key={i} position={[0, -data.height/2 + 0.2 + (i * 0.18), data.depth / 2 + 0.005]}>
               <boxGeometry args={[data.width * 0.8, 0.02, 0.05]} />
               <meshStandardMaterial color="#444" emissive={isGlowing ? "#00ff00" : "#000000"} emissiveIntensity={0.5} />
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
          fontSize={0.18}
          color={hovered ? "#00AEEF" : "black"}
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
