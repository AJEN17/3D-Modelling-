import { useRef, useState, useEffect } from 'react';
import { Text, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useAppStore from '../../store/useAppStore';

export default function Equipment({ data }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  const setActiveImageModal = useAppStore(state => state.setActiveImageModal);
  const setActiveRackModal = useAppStore(state => state.setActiveRackModal);
  
  useEffect(() => {
    const group = groupRef.current;
    return () => {
      if (group) {
        group.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
              else child.material.dispose();
            }
          }
        });
      }
    };
  }, []);

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
  if (data.type === 'rack') { color = '#EEEEEE'; isRack = true; }
  if (data.type === 'black_pillar') color = '#222222';
  if (data.type === 'dark_blue') color = '#1D3B8E';
  if (data.type === 'facebook') color = '#ED1C24';
  
  if (data.color) color = data.color;

  const isPAC = data.name && data.name.includes("PAC");
  const isClickable = !!data.imageUrl;
  const showAllLabels = useAppStore(state => state.showAllLabels);

  if (isPAC) {
    color = '#009245'; // Force all PACs to be the original dark green color
    isRack = false;    // PACs should not render as racks
  }

  // Handle single float rotation from JSON (Y-axis) or fallback to array
  const rot = typeof data.rotation === 'number' ? [0, data.rotation, 0] : (data.rotation || [0, 0, 0]);

  // Pre-calculate server blade glow state so it doesn't flicker on every render (React purity rule)
  const [serverBlades] = useState(() => Array.from({ length: 10 }).map(() => Math.random() > 0.7));

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (isClickable || data.rackDataUrl) {
      setHover(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e) => {
    setHover(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (data.rackDataUrl) {
      fetch(data.rackDataUrl)
        .then(res => res.json())
        .then(rackData => setActiveRackModal(rackData))
        .catch(err => console.error("Failed to fetch rack data:", err));
    } else if (isClickable) {
      setActiveImageModal(data.imageUrl);
    }
  };

  useEffect(() => {
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, isClickable]);

  const textRef = useRef();

  useFrame((state) => {
    if (!textRef.current || !groupRef.current) return;
    
    // Calculate distance from camera to this component's world position
    const dist = state.camera.position.distanceTo(groupRef.current.position);
    
    // Adjust these values to control when the text fades in
    const maxDist = 20; // Starts fading in when closer than 20 units
    const minDist = 12; // Fully visible when 12 units or closer
    
    let targetOpacity = 0;
    if (hovered || showAllLabels) {
      targetOpacity = 1; // Always show clearly if user is actively hovering or "Show All" is toggled
    } else if (dist < minDist) {
      targetOpacity = 1;
    } else if (dist < maxDist) {
      targetOpacity = 1 - ((dist - minDist) / (maxDist - minDist));
    }
    
    // Smooth interpolation for the fade effect
    const currentOpacity = textRef.current.fillOpacity ?? 1;
    const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.1;
    
    // Mutate Troika text properties directly (avoids expensive React re-renders)
    textRef.current.fillOpacity = newOpacity;
    textRef.current.outlineOpacity = newOpacity;

    // Scale animation for pop effect on hover
    const targetScale = hovered ? 1.3 : 1.0;
    const currentScale = textRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.15;
    textRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <group 
      ref={groupRef}
      position={[data.position[0], data.height / 2, data.position[2]]}
      rotation={rot}
    >
      {/* Main Block */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        {data.type === 'cylinder' ? (
          <cylinderGeometry args={[Math.max(data.width, data.depth) / 2, Math.max(data.width, data.depth) / 2, data.height, 32]} />
        ) : (
          <boxGeometry args={[data.width, data.height, data.depth]} />
        )}
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : color} 
          emissive={hovered ? '#444444' : '#000000'}
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
      <Billboard position={[0, data.height / 2 + (hovered ? 0.9 : 0.4), 0]}>
        <Text
          ref={textRef}
          fontSize={hovered ? 0.35 : 0.18}
          color={hovered ? "#ffffff" : "#111111"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={hovered ? 0.05 : 0.02}
          outlineColor={hovered ? "#000000" : "#ffffff"}
        >
          {data.name}
        </Text>
      </Billboard>
    </group>
  );
}
