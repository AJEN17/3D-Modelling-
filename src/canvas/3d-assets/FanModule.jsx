import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Center, Text3D, RoundedBox } from '@react-three/drei';

const U_HEIGHT = 0.04445;
const INNER_WIDTH = 0.4826; // 19 inches

export default function FanModule({ sizeU = 3, label = 'FAN MODULE', color = '#3b5998' }) {
  const height = sizeU * U_HEIGHT;
  const fanRefs = useRef([]);
  const ledRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Spin the fans rapidly!
    fanRefs.current.forEach((ref, idx) => {
      if (ref) {
        // High speed rotation, alternating directions
        ref.rotation.z = t * (15 + idx * 2) * (idx % 2 === 0 ? 1 : -1);
      }
    });

    // Pulse the status LEDs
    ledRefs.current.forEach((ref, idx) => {
      if (ref) {
        ref.emissiveIntensity = 0.5 + Math.sin(t * 4 + idx) * 0.5;
      }
    });
  });

  const numFans = 4;
  const fanSpacing = (INNER_WIDTH * 0.8) / numFans;

  return (
    <group position={[0, 0, 0]}>
      {/* Heavy Duty Chassis */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.015]} radius={0.002} smoothness={4} position={[0, 0, 0.007]}>
        <meshPhysicalMaterial color={color} roughness={0.6} metalness={0.7} clearcoat={0.2} />
      </RoundedBox>

      {/* Rack mounting ears */}
      {[-1, 1].map(side => (
        <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.012]}>
          <mesh>
            <boxGeometry args={[0.012, height * 0.85, 0.005]} />
            <meshPhysicalMaterial color="#222" roughness={0.4} metalness={0.8} />
          </mesh>
          {[-1, 0, 1].map(vert => (
            <mesh key={vert} position={[0, vert * height * 0.35, 0.003]}>
              <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
              <meshStandardMaterial color="#050505" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Main Front Plate with Cutouts for Fans */}
      <mesh position={[0, 0, 0.015]}>
        <boxGeometry args={[INNER_WIDTH * 0.85, height * 0.85, 0.002]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.8} />
      </mesh>

      {/* High-Performance Fans */}
      <group position={[0, 0, 0.016]}>
        {Array.from({ length: numFans }).map((_, i) => {
          const xPos = -INNER_WIDTH * 0.4 + fanSpacing / 2 + i * fanSpacing + 0.01;
          return (
            <group key={`fan-${i}`} position={[xPos, 0, 0]}>
              {/* Fan Cavity */}
              <mesh position={[0, 0, -0.002]} rotation={[Math.PI/2, 0, 0]}>
                <cylinderGeometry args={[height * 0.35, height * 0.35, 0.01, 32]} />
                <meshStandardMaterial color="#050505" />
              </mesh>
              
              {/* Spinning Fan Blades */}
              <group ref={el => fanRefs.current[i] = el} position={[0, 0, 0]}>
                <mesh rotation={[Math.PI/2, 0, 0]}>
                  <cylinderGeometry args={[0.008, 0.008, 0.004, 16]} />
                  <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
                </mesh>
                {Array.from({ length: 7 }).map((_, bIdx) => (
                  <group key={`blade-${bIdx}`} rotation={[0, 0, (bIdx * Math.PI * 2) / 7]}>
                    <mesh position={[height * 0.15, 0, 0]}>
                      <boxGeometry args={[height * 0.3, 0.01, 0.001]} />
                      <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
                    </mesh>
                  </group>
                ))}
              </group>

              {/* Protective Hex/Wire Grill over the fan */}
              <group position={[0, 0, 0.003]}>
                {Array.from({ length: 8 }).map((_, lineIdx) => (
                  <mesh key={`grill-h-${lineIdx}`} position={[0, -height * 0.3 + lineIdx * (height * 0.085), 0]}>
                    <cylinderGeometry args={[0.0008, 0.0008, height * 0.68, 8]} rotation={[0, 0, Math.PI/2]} />
                    <meshStandardMaterial color="#777" metalness={0.9} />
                  </mesh>
                ))}
                {Array.from({ length: 8 }).map((_, lineIdx) => (
                  <mesh key={`grill-v-${lineIdx}`} position={[-height * 0.3 + lineIdx * (height * 0.085), 0, 0]}>
                    <cylinderGeometry args={[0.0008, 0.0008, height * 0.68, 8]} rotation={[0, 0, 0]} />
                    <meshStandardMaterial color="#777" metalness={0.9} />
                  </mesh>
                ))}
              </group>
            </group>
          );
        })}
      </group>

      {/* Label and Status LEDs */}
      <group position={[0, -height * 0.45, 0.017]}>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[INNER_WIDTH * 0.4, 0.02, 0.002]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* Status LEDs */}
        {[-0.03, -0.01, 0.01, 0.03].map((x, i) => (
          <mesh key={`led-${i}`} position={[x, 0.01, 0.002]}>
            <circleGeometry args={[0.002, 16]} />
            <meshStandardMaterial 
              ref={el => ledRefs.current[i] = el}
              color={i === 0 ? "#00ff00" : (i === 1 ? "#00aaff" : "#ffaa00")} 
              emissive={i === 0 ? "#00ff00" : (i === 1 ? "#00aaff" : "#ffaa00")} 
              toneMapped={false} 
            />
          </mesh>
        ))}

        <Center position={[0, 0.035, 0]}>
          <Text3D
            font="https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json"
            size={0.012}
            height={0.002}
            bevelEnabled
            bevelSize={0.0005}
            bevelThickness={0.0005}
          >
            {label}
            <meshStandardMaterial color="#fff" metalness={0.8} roughness={0.2} />
          </Text3D>
        </Center>
      </group>
    </group>
  );
}
