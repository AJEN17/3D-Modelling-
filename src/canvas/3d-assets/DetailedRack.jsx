import React, { useRef, useState, useMemo } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useAppStore from '../../store/useAppStore';

import { U_HEIGHT, RACK_WIDTH, INNER_WIDTH, RACK_DEPTH } from './constants';
import HPServer from './HPServer';
import Storage4U from './Storage4U';
import Nokia7750 from './Nokia7750';
import CiscoNCS55A2 from './CiscoNCS55A2';
import TelecomFMS from './TelecomFMS';
import PSM1U from './PSM1U';
import DCDB from './DCDB';
import EciBg30 from './EciBg30';
import Krone from './Krone';
import CoreRouter from './CoreRouter';
import FanModule from './FanModule';

function RackUnit({ unit, totalU }) {
  const { startU, sizeU, type, name } = unit;
  const [hovered, setHovered] = useState(false);
  const setActiveRackUnit = useAppStore(state => state.setActiveRackUnit);
  const height = sizeU * U_HEIGHT;
  const uLabel = sizeU === 1 ? `${startU}U` : `${startU}U-${startU + sizeU - 1}U`;
  
  // Calculate center Y relative to bottom of the rack
  const rackTotalHeight = totalU * U_HEIGHT;
  const yPos = (startU - 1) * U_HEIGHT + height / 2 - rackTotalHeight / 2;

  // Determine appearance based on type
  let baseColor = unit.color || '#333333';
  let isRecessed = false;

  switch (type) {
    case 'compute':
      if (!unit.color) baseColor = '#aaaaaa';
      break;
    case 'switch':
      if (!unit.color) baseColor = '#4A627B'; // Leaf switch bluish grey
      break;
    case 'cable_management':
      if (!unit.color) baseColor = '#111111';
      isRecessed = true;
      break;
    case 'blank':
      if (!unit.color) baseColor = '#1a1a1a';
      isRecessed = false;
      break;
    case 'empty':
      if (!unit.color) baseColor = '#1a1a1a';
      isRecessed = true;
      break;
    case 'grounding_bar':
      if (!unit.color) baseColor = '#a0d4a0'; // green bar
      break;
    case 'storage':
      if (!unit.color) baseColor = '#dddddd';
      break;
    case 'dcdb':
      if (!unit.color) baseColor = '#cccccc';
      break;
    default:
      if (!unit.color) baseColor = '#555555';
  }

  // Create a slightly brighter shade for the hover effect using Three.js Color object
  const color = hovered 
    ? new THREE.Color(baseColor).lerp(new THREE.Color('#ffffff'), 0.3).getStyle() 
    : baseColor;

  const isLightColor = ['#FFFF00', '#FFB500', '#FFC000', '#92D050', '#92d050', '#8CC63F', '#8cc63f', '#E0E0E0', '#e0e0e0', '#CCCCCC', '#cccccc', '#EEEEEE', '#eeeeee', '#FFFFFF', '#ffffff'].includes(unit.color);

  // Blinking LEDs for active components
  const ledRef = useRef();
  const trafficRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ledRef.current && (type === 'compute' || type === 'switch')) {
      const isBlinking = Math.sin(t * 10 + startU) > 0;
      ledRef.current.emissiveIntensity = isBlinking ? 1 : 0.2;
    }
    if (trafficRefs.current.length > 0) {
      const isCisco = name && name.toLowerCase().includes('cisco');
      trafficRefs.current.forEach((ref, i) => {
        if (ref) {
          const signal = Math.sin(t * (12 + i * 1.7) + i * 0.5) * Math.sin(t * (7.3 + i * 0.9) + startU) * Math.sin(t * (23 + i * 2.1));
          ref.emissiveIntensity = signal > 0.2 ? 1.5 : (isCisco ? 0 : 0.2);
          
          if (isCisco) {
            if (signal > 0.7) {
              ref.color.setHex(0xffaa00); // Amber burst
              ref.emissive.setHex(0xffaa00);
            } else {
              ref.color.setHex(0x00ff00); // Green normal link
              ref.emissive.setHex(0x00ff00);
            }
          }
        }
      });
    }
  });

  // Highly performant, premium-looking front fascias that scale to thousands of racks
  const renderPremiumFascia = () => {

    switch(type) {
      case 'server':
      case 'compute':
        if (name && name.toLowerCase().includes('storage')) {
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45]}>
              <Storage4U sizeU={sizeU} label={name} />
            </group>
          );
        } else if (name && name.toLowerCase().includes('hp')) {
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45]}>
              <HPServer sizeU={sizeU} label={name} color={unit.color} />
            </group>
          );
        } else if (sizeU > 4) {
          // EXCEL CHASSIS
          const numBlades = 14;
          const bladeWidth = INNER_WIDTH * 0.8 / numBlades;
          const bladeHeight = height * 0.45;
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45 + 0.001]}>
              <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.98, 0.005]} radius={0.002} smoothness={4}>
                <meshPhysicalMaterial color={unit.color || "#1a1a1a"} roughness={0.6} metalness={0.1} clearcoat={0.1} />
              </RoundedBox>
              {[-1, 1].map(side => (
                <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.001]}>
                  <mesh>
                    <boxGeometry args={[0.012, height * 0.95, 0.004]} />
                    <meshPhysicalMaterial color="#222" roughness={0.4} metalness={0.8} />
                  </mesh>
                  {Array.from({ length: sizeU * 2 }).map((_, i) => (
                    <mesh key={`screw-${i}`} position={[0, (height / 2) - 0.02 - i * (U_HEIGHT / 2), 0.003]}>
                      <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
                      <meshStandardMaterial color="#050505" />
                    </mesh>
                  ))}
                </group>
              ))}
              <group position={[0, height * 0.4, 0.003]}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <group key={`fan-${i}`} position={[-0.15 + i * 0.06, 0, 0]}>
                    <mesh>
                      <circleGeometry args={[0.025, 32]} />
                      <meshBasicMaterial color="#050505" />
                    </mesh>
                    <mesh position={[0, 0, 0.001]}>
                      <ringGeometry args={[0.022, 0.025, 32]} />
                      <meshStandardMaterial color="#555" metalness={0.8} />
                    </mesh>
                    {[-1, 1, 0].map((v, j) => (
                      <mesh key={`grill-${j}`} rotation={[0, 0, v * Math.PI / 3]}>
                        <boxGeometry args={[0.05, 0.002, 0.002]} />
                        <meshStandardMaterial color="#555" metalness={0.8} />
                      </mesh>
                    ))}
                  </group>
                ))}
              </group>
              <group position={[0, -height * 0.15, 0.003]}>
                <mesh position={[0, 0, -0.001]}>
                  <boxGeometry args={[INNER_WIDTH * 0.85, bladeHeight + 0.01, 0.002]} />
                  <meshBasicMaterial color="#000" />
                </mesh>
                {Array.from({ length: numBlades }).map((_, i) => (
                  <group key={`blade-${i}`} position={[-INNER_WIDTH * 0.4 + i * bladeWidth + bladeWidth/2, 0, 0]}>
                    <mesh>
                      <boxGeometry args={[bladeWidth * 0.9, bladeHeight, 0.004]} />
                      <meshPhysicalMaterial color="#222" roughness={0.5} metalness={0.7} />
                    </mesh>
                    <mesh position={[0, bladeHeight * 0.4, 0.003]}>
                      <boxGeometry args={[bladeWidth * 0.6, 0.01, 0.003]} />
                      <meshStandardMaterial color="#444" metalness={0.9} />
                    </mesh>
                    <mesh position={[0, bladeHeight * 0.3, 0.003]}>
                      <sphereGeometry args={[0.002, 8, 8]} />
                      <meshStandardMaterial
                        ref={el => trafficRefs.current[i] = el}
                        color="#00ffcc"
                        emissive="#00ffcc"
                        emissiveIntensity={0.5}
                        toneMapped={false}
                      />
                    </mesh>
                  </group>
                ))}
              </group>
            </group>
          );
        } else {
          // DELL MLDB
          const numBays = 2;
          const bayWidth = 0.022;
          const bayHeight = Math.min(height * 0.7, U_HEIGHT * 0.7);
          const baySpacing = 0.03;
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45 + 0.001]}>
              <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.004]} radius={0.001} smoothness={4}>
                <meshPhysicalMaterial color={unit.color || "#92d050"} roughness={0.6} metalness={0.1} clearcoat={0.1} />
              </RoundedBox>
              {[-1, 1].map(side => (
                <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.001]}>
                  <mesh>
                    <boxGeometry args={[0.012, height * 0.85, 0.005]} />
                    <meshPhysicalMaterial color="#222" roughness={0.4} metalness={0.8} />
                  </mesh>
                  {[-1, 1].map(vert => (
                    <mesh key={vert} position={[0, vert * height * 0.3, 0.003]}>
                      <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
                      <meshStandardMaterial color="#050505" />
                    </mesh>
                  ))}
                </group>
              ))}
              <group position={[INNER_WIDTH * 0.2, 0, 0.001]}>
                {Array.from({ length: numBays }).map((_, i) => (
                  <group key={`bay-${i}`} position={[i * baySpacing, -0.002, 0]}>
                    <mesh position={[0, 0, 0]}>
                      <boxGeometry args={[bayWidth * 0.9, bayHeight, 0.004]} />
                      <meshStandardMaterial color="#050505" roughness={0.9} />
                    </mesh>
                    <mesh position={[0, 0, 0.002]}>
                      <boxGeometry args={[bayWidth * 0.85, bayHeight * 0.95, 0.002]} />
                      <meshPhysicalMaterial color="#1a1a1a" roughness={0.6} metalness={0.7} />
                    </mesh>
                    <mesh position={[0, bayHeight * 0.42, 0.003]}>
                      <boxGeometry args={[bayWidth * 0.6, 0.003, 0.002]} />
                      <meshStandardMaterial color="#333" metalness={0.9} roughness={0.3} />
                    </mesh>
                    <mesh position={[-bayWidth * 0.35, bayHeight * 0.42, 0.004]}>
                      <boxGeometry args={[0.002, 0.002, 0.001]} />
                      <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} toneMapped={false} />
                    </mesh>
                  </group>
                ))}
              </group>
              <group position={[-INNER_WIDTH * 0.38, 0, 0.003]}>
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[0.008, 0.004, 0.003]} />
                  <meshStandardMaterial color="#222" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.001]}>
                  <boxGeometry args={[0.006, 0.002, 0.002]} />
                  <meshBasicMaterial color="#eee" />
                </mesh>
                <mesh position={[0.015, -0.002, 0]}>
                  <boxGeometry args={[0.01, 0.005, 0.003]} />
                  <meshStandardMaterial color="#0044aa" roughness={0.6} metalness={0.4} />
                </mesh>
              </group>
              <group position={[-INNER_WIDTH * 0.43, 0, 0.003]}>
                <mesh>
                  <circleGeometry args={[0.004, 16]} />
                  <meshStandardMaterial color="#222" metalness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.001]}>
                  <sphereGeometry args={[0.002, 8, 8]} />
                  <meshStandardMaterial ref={ledRef} color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1} toneMapped={false} />
                </mesh>
              </group>
              <group position={[INNER_WIDTH * 0.35, 0, 0.003]}>
                <mesh>
                  <boxGeometry args={[0.04, 0.012, 0.002]} />
                  <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.5} />
                </mesh>
                <mesh position={[0, 0, 0.0015]}>
                  <planeGeometry args={[0.035, 0.009]} />
                  <meshBasicMaterial color="#001833" />
                </mesh>
                <mesh position={[0, 0, 0.002]}>
                  <planeGeometry args={[0.03, 0.005]} />
                  <meshBasicMaterial color="#1a8aff" opacity={0.3} transparent />
                </mesh>
              </group>
            </group>
          );
        }
      case 'switch':
        const lowerName = (name || '').toLowerCase();
        if (lowerName.includes('eci')) {
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45]}>
              <EciBg30 sizeU={sizeU} label={name} />
            </group>
          );
        }
        if (lowerName === 'psm') {
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45]}>
              <PSM1U sizeU={sizeU} label={name} />
            </group>
          );
        }
        if (lowerName.includes('ncs')) {
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45]}>
              <CiscoNCS55A2 sizeU={sizeU} label={name} />
            </group>
          );
        }
        if (lowerName.includes('nokia') || type === 'nokia') {
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45]}>
              <Nokia7750 sizeU={sizeU} label={name} />
            </group>
          );
        }
        const isAmtex = lowerName.includes('amtex');
        const isTelect = lowerName.includes('telect');
        return (
          <group position={[0, 0, RACK_DEPTH * 0.45 + 0.001]}>
            <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.004]} radius={0.001} smoothness={4}>
              <meshPhysicalMaterial
                color={unit.color || "#ffd700"}
                roughness={0.6}
                metalness={0.1}
                clearcoat={0.1}
              />
            </RoundedBox>
            {[-1, 1].map(side => (
              <group key={`ear-${side}`} position={[side * (INNER_WIDTH * 0.47), 0, 0.001]}>
                <mesh>
                  <boxGeometry args={[0.012, height * 0.85, 0.005]} />
                  <meshPhysicalMaterial color="#222" roughness={0.4} metalness={0.8} />
                </mesh>
                {[-1, 1].map(vert => (
                  <mesh key={vert} position={[0, vert * height * 0.3, 0.003]}>
                    <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} rotation={[Math.PI/2, 0, 0]} />
                    <meshStandardMaterial color="#050505" />
                  </mesh>
                ))}
              </group>
            ))}

            {isAmtex ? (
              // 16 Recessed Drive Bays for AMTEX
              <group position={[0, 0, 0.002]}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <group key={`bay-${i}`} position={[-INNER_WIDTH * 0.25 + i * ((INNER_WIDTH * 0.55) / 16), -0.005, 0]}>
                    <mesh position={[0, 0, -0.002]}>
                      <boxGeometry args={[0.022 * 0.9, height * 0.7, 0.004]} />
                      <meshStandardMaterial color="#050505" roughness={0.9} />
                    </mesh>
                    <mesh>
                      <boxGeometry args={[0.022 * 0.85, height * 0.7 * 0.95, 0.002]} />
                      <meshPhysicalMaterial color="#1a1a1a" roughness={0.6} metalness={0.7} />
                    </mesh>
                    <mesh position={[0, (height * 0.7) * 0.42, 0.002]}>
                      <boxGeometry args={[0.022 * 0.6, 0.003, 0.002]} />
                      <meshStandardMaterial color="#333" metalness={0.9} roughness={0.3} />
                    </mesh>
                    <mesh position={[-0.022 * 0.35, (height * 0.7) * 0.42, 0.003]}>
                      <boxGeometry args={[0.002, 0.002, 0.001]} />
                      <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} toneMapped={false} />
                    </mesh>
                  </group>
                ))}
                {/* LCD Info Panel */}
                <group position={[INNER_WIDTH * 0.35, height * 0.15, 0.004]}>
                  <mesh>
                    <boxGeometry args={[0.06, 0.02, 0.002]} />
                    <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.5} />
                  </mesh>
                  <mesh position={[0, 0, 0.0015]}>
                    <planeGeometry args={[0.05, 0.015]} />
                    <meshBasicMaterial color="#001833" />
                  </mesh>
                  <mesh position={[0, 0, 0.002]}>
                    <planeGeometry args={[0.04, 0.01]} />
                    <meshBasicMaterial color="#1a8aff" opacity={0.3} transparent />
                  </mesh>
                </group>
                {/* Main Power Button and LED */}
                <group position={[-INNER_WIDTH * 0.35, 0, 0.004]}>
                  <mesh>
                    <cylinderGeometry args={[0.004, 0.004, 0.002, 16]} rotation={[Math.PI/2, 0, 0]} />
                    <meshStandardMaterial color="#222" metalness={0.8} />
                  </mesh>
                  <mesh position={[0, 0, 0.001]}>
                    <sphereGeometry args={[0.002, 8, 8]} />
                    <meshStandardMaterial ref={ledRef} color="#00ffcc" emissive="#00ffcc" emissiveIntensity={1.5} toneMapped={false} />
                  </mesh>
                </group>
                {/* Front I/O */}
                <group position={[-INNER_WIDTH * 0.35, -height * 0.25, 0.003]}>
                  <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.008, 0.004, 0.003]} />
                    <meshStandardMaterial color="#222" roughness={0.8} />
                  </mesh>
                  <mesh position={[0, 0, 0.001]}>
                    <boxGeometry args={[0.006, 0.002, 0.002]} />
                    <meshBasicMaterial color="#eee" />
                  </mesh>
                  <mesh position={[0.015, 0, 0]}>
                    <boxGeometry args={[0.01, 0.005, 0.003]} />
                    <meshStandardMaterial color="#0044aa" roughness={0.6} metalness={0.4} />
                  </mesh>
                </group>
              </group>
            ) : isTelect ? (
              // Telect Alarm LEDs
              <group position={[-INNER_WIDTH * 0.44, 0, 0.004]}>
                {['#00ff00', '#ffaa00', '#ff0000'].map((col, i) => (
                  <group key={i} position={[i * 0.015, 0, 0]}>
                    <mesh>
                      <sphereGeometry args={[0.002, 8, 8]} />
                      <meshStandardMaterial color={col} emissive={col} emissiveIntensity={i === 0 ? 1 : 0} toneMapped={false} />
                    </mesh>
                  </group>
                ))}
              </group>
            ) : (
              // 24 RJ45 Ports for Default Switch (Anatel/Cisco)
              <group position={[0, 0, 0.001]}>
                {[1, -1].map((row, rIdx) => (
                  <group key={`row-${row}`} position={[0, row * 0.006, 0]}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <group key={`port-${rIdx}-${i}`} position={[0.02 + i * 0.014, 0, 0]}>
                        <mesh position={[0, 0, 0.001]}>
                          <boxGeometry args={[0.011, 0.009, 0.004]} />
                          <meshStandardMaterial color="#111" roughness={0.8} metalness={0.3} />
                        </mesh>
                        <mesh position={[0, -0.001, 0.003]}>
                          <boxGeometry args={[0.008, 0.006, 0.002]} />
                          <meshBasicMaterial color="#000" />
                        </mesh>
                        <mesh position={[0, 0.002, 0.004]}>
                          <boxGeometry args={[0.005, 0.001, 0.001]} />
                          <meshStandardMaterial color="#DAA520" metalness={1} roughness={0.2} />
                        </mesh>
                        <group position={[-0.004, 0.004, 0.003]}>
                          <mesh>
                            <boxGeometry args={[0.002, 0.002, 0.001]} />
                            <meshStandardMaterial
                              ref={el => trafficRefs.current[rIdx * 12 + i] = el}
                              color="#00ffcc"
                              emissive="#00ffcc"
                              emissiveIntensity={1}
                            />
                          </mesh>
                        </group>
                      </group>
                    ))}
                  </group>
                ))}
              </group>
            )}
          </group>
        );
      case 'patch_panel':
        if (name && name.toLowerCase().includes('krone')) {
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45]}>
              <Krone sizeU={sizeU} label={name} />
            </group>
          );
        }
        if (name && name.toLowerCase().includes('dcdb')) {
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45]}>
              <DCDB sizeU={sizeU} label={name} />
            </group>
          );
        }
        if (name && name.toLowerCase().includes('fms')) {
          return (
            <group position={[0, 0, RACK_DEPTH * 0.45]}>
              <TelecomFMS sizeU={sizeU} label={name} />
            </group>
          );
        }
        return (
          <group position={[0, 0, RACK_DEPTH * 0.45 + 0.001]}>
            <RoundedBox args={[INNER_WIDTH * 0.98, height * 0.95, 0.004]} radius={0.001} smoothness={4}>
              <meshPhysicalMaterial color={unit.color || "#444"} metalness={0.8} />
            </RoundedBox>
          </group>
        );
      case 'storage':
        return (
          <group position={[0, 0, RACK_DEPTH * 0.45 + 0.001]}>
            {/* Brushed metal look for storage */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[INNER_WIDTH * 0.95, height * 0.9]} />
              <meshPhysicalMaterial color={unit.color || "#555"} roughness={0.7} metalness={0.6} />
            </mesh>
            {/* Horizontal dark groove representing drive bays */}
            <mesh position={[0, 0, 0.001]}>
              <planeGeometry args={[INNER_WIDTH * 0.85, height * 0.1]} />
              <meshBasicMaterial color="#111" />
            </mesh>
          </group>
        );
      case 'cable_management':
        return (
          <group position={[0, 0, RACK_DEPTH * 0.45 - 0.039]}>
            {/* Deep recessed black void for cables */}
            <mesh position={[0, 0, 0]}>
               <boxGeometry args={[INNER_WIDTH * 0.85, height * 0.6, 0.002]} />
               <meshBasicMaterial color="#000000" />
            </mesh>
          </group>
        );
      case 'dcdb':
        return (
          <group position={[0, 0, RACK_DEPTH * 0.45]}>
            <DCDB sizeU={sizeU} label={name} />
          </group>
        );
      case 'nokia':
      case 'epdu':
        return (
          <group position={[0, 0, RACK_DEPTH * 0.45]}>
            <Nokia7750 sizeU={sizeU} label={name} />
          </group>
        );
      case 'router':
        return (
          <group position={[0, 0, RACK_DEPTH * 0.45]}>
            <CoreRouter sizeU={sizeU} label={name} color={color} />
          </group>
        );
      case 'fan_module':
        return (
          <group position={[0, 0, RACK_DEPTH * 0.45]}>
            <FanModule sizeU={sizeU} label={name} color={color} />
          </group>
        );
      default:
        return null;
    }
  };

  return (
    <group 
      position={[0, yPos, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { 
        e.stopPropagation(); 
        if (type !== 'blank' && type !== 'empty') {
          setActiveRackUnit(unit);
        }
      }}
    >
      {/* Main Block */}
      {type === 'blank' ? (
        // Render individual 1U blanking plates so they are countable
        <group position={[0, 0, isRecessed ? -0.05 : 0]}>
          {Array.from({ length: sizeU }).map((_, i) => (
            <mesh key={i} position={[0, -height / 2 + U_HEIGHT / 2 + i * U_HEIGHT, 0]}>
              <boxGeometry args={[INNER_WIDTH, U_HEIGHT - 0.005, isRecessed ? RACK_DEPTH * 0.8 : RACK_DEPTH * 0.9]} />
              <meshStandardMaterial color={color} roughness={0.6} metalness={0.4} />
            </mesh>
          ))}
        </group>
      ) : (
        <group>
          <mesh position={[0, 0, isRecessed ? -0.05 : 0]}>
            <boxGeometry args={[INNER_WIDTH, height - 0.005, isRecessed ? RACK_DEPTH * 0.8 : RACK_DEPTH * 0.9]} />
            <meshStandardMaterial color={type === 'blank' || type === 'empty' || type === 'dcdb' ? color : '#1a1a1a'} roughness={unit.color === '#FFFF00' ? 0.9 : 0.6} metalness={unit.color === '#FFFF00' ? 0.1 : 0.4} />
          </mesh>
          {/* Wireframe Highlight Box on Hover */}
          {hovered && (
            <mesh position={[0, 0, isRecessed ? -0.05 : 0]}>
              <boxGeometry args={[INNER_WIDTH + 0.005, height, RACK_DEPTH * 0.9 + 0.005]} />
              <meshBasicMaterial color="#ffffff" wireframe />
            </mesh>
          )}
        </group>
      )}

      {/* Render Premium, Scalable Details Based on Type */}
      {renderPremiumFascia()}
{/* Front Label */}
      {type === 'blank' ? (
        <group position={[0, 0, RACK_DEPTH * 0.45 + (isRecessed ? -0.04 : 0.01)]}>
          {Array.from({ length: sizeU }).map((_, i) => (
            <group key={`text-${i}`} position={[0, -height / 2 + U_HEIGHT / 2 + i * U_HEIGHT, 0]}>
              <Text
                position={[INNER_WIDTH / 2 - 0.02, 0, 0]}
                fontSize={0.018}
                color="#666666"
                anchorX="right"
                anchorY="middle"
              >
                {startU + i}U
              </Text>
              <Text
                position={[0, 0, 0]}
                fontSize={0.028}
                color="#aaaaaa"
                anchorX="center"
                anchorY="middle"
                maxWidth={INNER_WIDTH * 0.7}
                textAlign="center"
              >
                {name}
              </Text>
            </group>
          ))}
        </group>
      ) : (
        <group position={[0, 0, RACK_DEPTH * 0.45 + (isRecessed ? -0.04 : 0.015)]}>
          <Text
            position={[INNER_WIDTH / 2 - 0.02, sizeU > 4 ? -height * 0.44 : (type === 'compute' ? -height * 0.32 : 0), 0]}
            fontSize={hovered ? (type === 'empty' ? 0.021 : 0.024) : (type === 'empty' ? 0.018 : 0.02)}
            color={type === 'empty' ? '#666666' : (isLightColor ? '#000000' : '#bbbbbb')}
            anchorX="right"
            anchorY="middle"
          >
            {uLabel}
          </Text>
          {!(type === 'router' || type === 'nokia' || type === 'epdu' || type === 'fan_module' || (name && (name.toLowerCase() === 'psm' || name.toLowerCase().includes('storage') || name.toLowerCase().includes('nokia') || name.toLowerCase().includes('fms') || name.toLowerCase().includes('ncs') || name.toLowerCase().includes('dcdb') || name.toLowerCase().includes('eci') || name.toLowerCase().includes('krone')))) && (
            <Text
              position={
                type === 'switch' 
                ? (
                    (name || '').toLowerCase().includes('amtex') ? [0, height * 0.25, 0.006]
                    : (name || '').toLowerCase().includes('telect') ? [0, 0, 0.006]
                    : [-INNER_WIDTH * 0.47, 0, 0.006]
                  )
                : (type === 'compute' ? (sizeU > 4 ? [0, height * 0.22, 0.006] : [-INNER_WIDTH * 0.15, 0, 0.006]) : [0, height * 0.15, 0.006])
            }
            fontSize={
              hovered 
                ? (type === 'empty' ? 0.033 : (type === 'switch' ? Math.min(Math.max(0.016, height * 0.25), 0.028) : (sizeU > 4 ? 0.025 : Math.min(Math.max(0.025, height * 0.3), 0.045))))
                : (type === 'empty' ? 0.028 : (type === 'switch' ? Math.min(Math.max(0.014, height * 0.18), 0.022) : (sizeU > 4 ? 0.020 : Math.min(Math.max(0.020, height * 0.2), 0.035))))
            }
            color={type === 'empty' ? '#aaaaaa' : (isLightColor ? '#000000' : (type === 'cable_management' ? '#888888' : '#ffffff'))}
            anchorX={
              type === 'switch' 
                ? ((name || '').toLowerCase().includes('amtex') || (name || '').toLowerCase().includes('telect') ? "center" : "left") 
                : "center"
            }
            anchorY="middle"
            maxWidth={type === 'switch' ? INNER_WIDTH * 0.9 : INNER_WIDTH * 0.7}
            lineHeight={1.1}
            textAlign="center"
            fontWeight="bold"
            outlineWidth={unit.color === '#FFFF00' ? 0 : (hovered ? 0.002 : (type === 'empty' ? 0 : 0.001))}
            outlineColor="#000000"
          >
              {(name || '').toLowerCase().includes('cisco') ? 'CISCO C2960' : (name || '')}
            </Text>
          )}
        </group>
      )}
    </group>
  );
}

export default function DetailedRack({ rackData }) {
  const perforatedTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    
    // Background is white (opaque)
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 32, 32);
    
    // Draw black circle (transparent hole)
    context.fillStyle = '#000000';
    context.beginPath();
    context.arc(16, 16, 12, 0, Math.PI * 2);
    context.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // Repeat a lot so it looks like tiny holes (approx 60 holes per meter)
    texture.repeat.set(RACK_WIDTH * 100, (rackData?.totalU || 42) * U_HEIGHT * 100);
    return texture;
  }, [rackData?.totalU]);

  if (!rackData) return null;

  const { totalU: dataTotalU, units, name } = rackData;
  const totalU = dataTotalU || 42;
  const rackTotalHeight = totalU * U_HEIGHT;

  return (
    <group>
      {/* Rack Frame Outer Casings */}
      {/* Left Pillar */}
      <mesh position={[-RACK_WIDTH / 2 + 0.02, 0, 0]}>
        <boxGeometry args={[0.04, rackTotalHeight, RACK_DEPTH]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Right Pillar */}
      <mesh position={[RACK_WIDTH / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[0.04, rackTotalHeight, RACK_DEPTH]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top Cap */}
      <mesh position={[0, rackTotalHeight / 2 + 0.02, 0]}>
        <boxGeometry args={[RACK_WIDTH, 0.04, RACK_DEPTH]} />
        <meshStandardMaterial color="#222222" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Bottom Base */}
      <mesh position={[0, -rackTotalHeight / 2 - 0.05, 0]}>
        <boxGeometry args={[RACK_WIDTH, 0.1, RACK_DEPTH]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Back Perforated Door */}
      <mesh position={[0, 0, -RACK_DEPTH / 2 + 0.01]}>
        <planeGeometry args={[RACK_WIDTH - 0.08, rackTotalHeight]} />
        <meshStandardMaterial 
          color="#151515" 
          metalness={0.6}
          roughness={0.6}
          alphaMap={perforatedTexture}
          transparent={true}
          alphaTest={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Top Label */}
      <Text
        position={[0, rackTotalHeight / 2 + 0.15, RACK_DEPTH / 2]}
        fontSize={0.05}
        color="#ffffff"
        anchorX="center"
        anchorY="bottom"
      >
        {name}
      </Text>

      {/* Rack Units */}
      {units.map((unit, index) => (
        <RackUnit key={index} unit={unit} totalU={totalU} />
      ))}
    </group>
  );
}
