/**
 * 3D Asset: ChassisSwitch
 * -------------------
 * This component renders a specific piece of equipment (Server, Switch, Patch Panel, etc.)
 * in 3D space. It is typically instantiated inside a DetailedRack.
 */
import { getBoxGeometry, getCylinderGeometry, getPlaneGeometry } from '../utils/geometryCache';
import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { U_HEIGHT, INNER_WIDTH } from './constants';

export default function ChassisSwitch({ sizeU = 18, color = '#FFFF00' }) {
  const height = sizeU * U_HEIGHT;

  // Simplify: fewer line cards, no complex fans, no bottom PSUs, no blinking animations.
  // Just a clean chassis frame with modular slots for payload and a central blank slot for the label.
  const numLineCards = Math.max(2, sizeU - 4);
  const slotHeight = (height * 0.9) / numLineCards;
  const portsPerCard = 24; // Halved the density to reduce visual noise

  return (
    <group position={[0, 0, 0.002]}>
      {/* Main Chassis Frame (Clean) */}
      <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.98, 0.02]} radius={0.004} smoothness={4} position={[0, 0, 0.01]}>
        <meshPhysicalMaterial color={color} roughness={0.5} metalness={0.4} />
      </RoundedBox>

      {/* Side Vents (Simplified, no complex fan blades) */}
      {[-1, 1].map(side => (
        <group key={`vent-${side}`} position={[side * (INNER_WIDTH * 0.44), 0, 0.02]}>
          <mesh dispose={null} geometry={getBoxGeometry(0.015, height * 0.9, 0.005)}>
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      ))}

      {/* Line Card Slots (Middle & Top) */}
      <group position={[0, 0, 0.02]}>
        {Array.from({ length: numLineCards }).map((_, cIdx) => {
          // Identify central slots for supervisor engines / text label area
          const isSupervisor = Math.abs(cIdx - (numLineCards / 2)) <= 1.5;
          
          return (
            <group key={`card-${cIdx}`} position={[0, (numLineCards / 2 - cIdx - 0.5) * slotHeight, 0]}>
              {/* Line Card Base */}
              <mesh dispose={null} geometry={getBoxGeometry(INNER_WIDTH * 0.8, slotHeight * 0.9, 0.004)}>
                <meshStandardMaterial color={isSupervisor ? "#1a1a1a" : "#2a2a2a"} metalness={0.5} />
              </mesh>

              {isSupervisor ? (
                /* Supervisor Engine Layout (Clean center bezel for external text) */
                <group position={[0, 0, 0.002]}>
                  {/* Clean flat plate where the external text label will sit */}
                  <mesh dispose={null} geometry={getBoxGeometry(INNER_WIDTH * 0.65, slotHeight * 0.8, 0.004)}>
                    <meshStandardMaterial color="#111" />
                  </mesh>
                </group>
              ) : (
                /* Payload Line Card Layout (Simplified Ports) */
                <group position={[0, 0, 0.003]}>
                  {Array.from({ length: 2 }).map((_, rIdx) => (
                    <group key={`row-${rIdx}`} position={[0, (rIdx === 0 ? 1 : -1) * (slotHeight * 0.25), 0]}>
                      {Array.from({ length: portsPerCard / 2 }).map((_, pIdx) => (
                        <group key={`port-${pIdx}`} position={[-INNER_WIDTH * 0.35 + pIdx * ((INNER_WIDTH * 0.7) / (portsPerCard/2 - 1 || 1)), 0, 0]}>
                          {/* SFP Port Cavity */}
                          <mesh dispose={null} geometry={getBoxGeometry(0.02, 0.012, 0.004)}>
                            <meshStandardMaterial color="#000" />
                          </mesh>
                          {/* Static Activity LED (No blinking animation to keep it simple) */}
                          <mesh position={[0, -0.008, 0.002]} dispose={null} geometry={getPlaneGeometry(0.006, 0.002)}>
                            <meshStandardMaterial color="#00aa44" emissive="#00aa44" emissiveIntensity={0.5} toneMapped={false} />
                          </mesh>
                        </group>
                      ))}
                    </group>
                  ))}
                </group>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}
