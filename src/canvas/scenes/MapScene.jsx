import React, { useState, useRef } from 'react';
import { Html, OrbitControls, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import buildings from '../../data/buildings.json';
import useAppStore from '../../store/useAppStore';

function MapPin({ data }) {
  const navigate = useNavigate();
  const setActiveBuilding = useAppStore(state => state.setActiveBuilding);
  const preloadBuildingData = useAppStore(state => state.preloadBuildingData);
  const [hovered, setHovered] = useState(false);
  const pinRef = useRef();

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setActiveBuilding(data.id);
    navigate(`/building/${data.id}`);
  };

  useFrame((state) => {
    if (pinRef.current) {
      pinRef.current.position.y = 1.0 + Math.sin(state.clock.elapsedTime * 3 + data.position[0]) * 0.1;
    }
  });

  // Sundale and Suncity are very close, so they get smaller hitboxes to prevent overlap.
  // The others get massive hitboxes so they are incredibly easy to click from the sky.
  const isClose = data.id.startsWith('suncity') || data.id.startsWith('sundale');

  return (
    <group position={data.position}>
      {/* Drop shadow on the ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[hovered ? 0.2 : 0.25, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.4} />
      </mesh>

      {/* 3D Location Marker (Matched to reference image) */}
      <group
        ref={pinRef}
        onPointerDown={handlePointerDown}
        onPointerOver={(e) => { 
          e.stopPropagation(); 
          setHovered(true); 
          document.body.style.cursor = 'pointer'; 
          preloadBuildingData(data.id);
        }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        {/* Invisible Hitbox: Swapped to a Sphere for flawless raycasting from top-down angles */}
        {!isClose && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2.0, 16, 16]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}

        {/* Red Sphere Top */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={hovered ? '#ff6b6b' : '#ff3333'}
            emissive={hovered ? '#ff6b6b' : '#ff3333'}
            emissiveIntensity={hovered ? 3.0 : 1.5}
            toneMapped={false}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* Silver Cylinder Shaft */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.8, 32]} />
          <meshStandardMaterial color={hovered ? '#e0e0e0' : '#b0b0b0'} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Silver Pointy Tip */}
        <mesh position={[0, -0.95, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.15, 32]} />
          <meshStandardMaterial color={hovered ? '#e0e0e0' : '#b0b0b0'} roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Premium Glassmorphism Tooltip (Hidden until hover) */}
        <Html position={[0, 0.8, 0]} center zIndexRange={[100, 0]}>
          <div style={{
            opacity: hovered ? 1 : 0,
            visibility: hovered ? 'visible' : 'hidden',
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            color: '#1a1a1a',
            padding: '10px 18px',
            borderRadius: '12px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            fontSize: '14px',
            letterSpacing: '-0.2px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: hovered ? 'translateY(-12px) scale(1)' : 'translateY(5px) scale(0.85)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }} />
            {data.name}
            {/* Subtle Pointer Triangle */}
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '12px',
              height: '12px',
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.9)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.9)',
            }} />
          </div>
        </Html>
      </group>
    </group>
  );
}

export default function MapScene() {
  // Loading the newly cropped file to bypass the browser's cache
  const mapTexture = useTexture('/newmumbaimap_cropped.png');
  const { camera } = useThree();

  React.useEffect(() => {
    // Fix the thin white border edge-bleeding issue
    if (mapTexture) {
      /* eslint-disable react-hooks/immutability */
      mapTexture.wrapS = THREE.ClampToEdgeWrapping;
      mapTexture.wrapT = THREE.ClampToEdgeWrapping;
      mapTexture.generateMipmaps = false;
      mapTexture.minFilter = THREE.LinearFilter;
      mapTexture.magFilter = THREE.LinearFilter;
      mapTexture.needsUpdate = true;
      /* eslint-enable react-hooks/immutability */
    }
  }, [mapTexture]);

  React.useEffect(() => {
    // Set camera to a slightly angled isometric view so pins are easier to click
    camera.position.set(0, 26, 16);
  }, [camera]);

  return (
    <group>
      {/* Set the precise background color of the 3D scene to perfectly match the image */}
      <color attach="background" args={['#d4d2d3']} />

      <OrbitControls
        target={[0, 0, 0]}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.2}
      />

      {/* Normal, natural lighting so the map isn't washed out */}
      <ambientLight intensity={1.0} />
      <directionalLight position={[10, 20, 10]} intensity={1.0} castShadow />

      {/* Professional Glow Effect ONLY on the pins */}
      {/* High-quality multisampling enabled to fix the jagged/dashed edge artifacts! */}
      <EffectComposer multisampling={8}>
        {/* luminanceThreshold > 1 ensures standard textures (like the map) never bloom, only our super-bright pins */}
        <Bloom luminanceThreshold={1.2} mipmapBlur intensity={1.5} />
      </EffectComposer>

      {/* Map Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[21.68, 19.84]} />
        <meshBasicMaterial map={mapTexture} />
      </mesh>

      {/* Pins */}
      {buildings.map((b) => (
        <MapPin key={b.id} data={b} />
      ))}
    </group>
  );
}
