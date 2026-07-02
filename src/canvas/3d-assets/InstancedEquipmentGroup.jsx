/**
 * Instanced Equipment Group (PERFORMANCE CRITICAL)
 * ----------------------------------------------
 * This is the most important file for 3D performance.
 * Instead of creating a separate 3D Mesh and Material for every single server rack
 * (which would crash the browser with 1000+ racks), this uses React Three Fiber's `<Instances>`.
 * 
 * It groups identical items (e.g. all generic racks) into a single WebGL draw call.
 * This allows us to render huge data centers at 60 FPS.
 * 
 * It also handles 3D raycasting (hovering, clicking) by detecting which instance ID
 * was interacted with.
 */
import React, { useRef, useState, useEffect } from 'react';
import { Instances, Instance, Text, Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useAppStore from '../../store/useAppStore';
import { getBoxGeometry, getCylinderGeometry, getPlaneGeometry } from '../utils/geometryCache';

function getEquipmentColor(data) {
  let color = '#ffffff';
  if (data.type === 'infra') color = '#00AEEF';
  if (data.type === 'core') color = '#8CC63F'; 
  if (data.type === 'coldAisle') color = '#009245';
  if (data.type === 'hotAisle') color = '#F1A19D';
  if (data.type === 'pillar') color = '#ED1C24';
  if (data.type === 'fap') color = '#FF5722';
  if (data.type === 'tx') color = '#FFFF00'; 
  if (data.type === 'nld') color = '#662D91'; 
  if (data.type === 'vas') color = '#F7931E'; 
  if (data.type === 'structural') color = '#ED1C24';
  if (data.type === 'cylinder') color = '#FF0000';
  if (data.type === 'workstation') color = '#F7931E';
  if (data.type === 'rack') color = '#EEEEEE'; 
  if (data.type === 'black_pillar') color = '#222222';
  if (data.type === 'dark_blue') color = '#1D3B8E';
  if (data.type === 'facebook') color = '#ED1C24';
  if (data.color) color = data.color;
  const isPAC = data.name && data.name.includes("PAC");
  if (isPAC) color = '#009245';
  return color;
}

function EquipmentLabel({ data, hovered }) {
  const textRef = useRef();
  const groupRef = useRef();
  const showAllLabels = useAppStore(state => state.showAllLabels);
  const rot = typeof data.rotation === 'number' ? [0, data.rotation, 0] : (data.rotation || [0, 0, 0]);

  useFrame((state) => {
    if (!textRef.current || !groupRef.current) return;
    const dist = state.camera.position.distanceTo(groupRef.current.position);
    const maxDist = 20;
    const minDist = 12;
    let targetOpacity = 0;
    if (hovered || showAllLabels) targetOpacity = 1;
    else if (dist < minDist) targetOpacity = 1;
    else if (dist < maxDist) targetOpacity = 1 - ((dist - minDist) / (maxDist - minDist));
    
    const currentOpacity = textRef.current.fillOpacity ?? 1;
    const newOpacity = currentOpacity + (targetOpacity - currentOpacity) * 0.1;
    textRef.current.fillOpacity = newOpacity;
    textRef.current.outlineOpacity = newOpacity;

    const targetScale = hovered ? 1.3 : 1.0;
    const currentScale = textRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.15;
    textRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <group ref={groupRef} position={[data.position[0], data.height / 2, data.position[2]]} rotation={rot}>
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

function EquipmentInstance({ data }) {
  const [hovered, setHover] = useState(false);
  const setActiveImageModal = useAppStore(state => state.setActiveImageModal);
  const setActiveRackModal = useAppStore(state => state.setActiveRackModal);

  const isClickable = !!data.imageUrl || !!data.rackDataUrl;
  const color = getEquipmentColor(data);
  const rot = typeof data.rotation === 'number' ? [0, data.rotation, 0] : (data.rotation || [0, 0, 0]);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (isClickable) {
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
    } else if (data.imageUrl) {
      setActiveImageModal(data.imageUrl);
    }
  };

  useEffect(() => {
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <>
      <Instance
        position={[data.position[0], data.height / 2, data.position[2]]}
        rotation={rot}
        color={hovered ? '#ffffff' : color}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
      <EquipmentLabel data={data} hovered={hovered} />
    </>
  );
}

export default function InstancedEquipmentGroup({ items }) {
  if (!items || items.length === 0) return null;

  const sample = items[0];
  const isCylinder = sample.type === 'cylinder';
  
  const geometry = isCylinder
    ? getCylinderGeometry(Math.max(sample.width, sample.depth) / 2, Math.max(sample.width, sample.depth) / 2, sample.height, 32)
    : getBoxGeometry(sample.width, sample.height, sample.depth);

  const isPAC = sample.name && sample.name.includes("PAC");
  const isRack = !!sample.rackDataUrl;
  const isTransparent = !isPAC && !isRack && !isCylinder;

  return (
    <group>
      <Instances range={items.length} geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial 
          transparent={isTransparent}
          opacity={0.9}
          roughness={0.4}
          metalness={0.2}
        />
        {items.map(item => (
          <EquipmentInstance key={item.id} data={item} />
        ))}
      </Instances>
      
      {items.map(item => {
        const rot = typeof item.rotation === 'number' ? [0, item.rotation, 0] : (item.rotation || [0, 0, 0]);
        const itemIsRack = !!item.rackDataUrl;
        const itemIsPAC = item.name && item.name.includes("PAC");
        
        return (
          <group key={`details-${item.id}`} position={[item.position[0], item.height / 2, item.position[2]]} rotation={rot}>
             {item.type !== 'cylinder' && (
                <mesh dispose={null} geometry={getBoxGeometry(item.width + 0.01, item.height + 0.01, item.depth + 0.01)}>
                  <meshBasicMaterial color={'#222222'} wireframe />
                </mesh>
             )}
             
             {itemIsRack && (() => {
               // Generate a deterministic but pseudo-random looking sequence of glowing blades based on the rack ID or just use index
               const seed = item.id ? item.id.charCodeAt(0) : 0;
               const serverBlades = Array.from({ length: 10 }).map((_, idx) => ((seed + idx) % 4 === 0));
               return (
                 <group>
                   {/* Dark glass front panel */}
                   <mesh dispose={null} position={[0, 0, item.depth / 2 + 0.01]} geometry={getPlaneGeometry(item.width * 0.9, item.height * 0.9)}>
                     <meshPhysicalMaterial color="#111" transparent opacity={0.8} roughness={0.1} metalness={0.8} />
                   </mesh>
                   {/* Horizontal Lines (Blades) */}
                   {serverBlades.map((isGlowing, i) => (
                     <mesh key={`blade-${i}`} dispose={null} position={[0, -item.height/2 + 0.2 + (i * 0.18), item.depth / 2 + 0.005]} geometry={getBoxGeometry(item.width * 0.8, 0.02, 0.05)}>
                       <meshStandardMaterial color="#444" emissive={isGlowing ? "#00ff00" : "#000000"} emissiveIntensity={0.5} />
                     </mesh>
                   ))}
                 </group>
               );
             })()}
             
             {itemIsPAC && (
               <mesh dispose={null} position={[0, item.height / 2 + 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} geometry={getPlaneGeometry(item.width * 0.8, item.depth * 0.8)}>
                 <meshBasicMaterial color="#333" />
               </mesh>
             )}
          </group>
        );
      })}
    </group>
  );
}
