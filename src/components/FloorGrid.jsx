import React, { useMemo } from 'react';
import * as THREE from 'three';

function WallSegment({ p1, p2, thickness = 0.10, color = "#000000" }) {
  const distance = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
  const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
  const midX = (p1[0] + p2[0]) / 2;
  const midZ = (p1[1] + p2[1]) / 2;

  return (
    <mesh position={[midX, 0.02, midZ]} rotation={[0, -angle, 0]}>
      <boxGeometry args={[distance, 0.05, thickness]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// Door symbols removed as requested

export default function FloorGrid({ roomData }) {
  const { width, depth, tileSize } = roomData;
  const gridDivisionsX = Math.floor(width / tileSize);
  const gridDivisionsZ = Math.floor(depth / tileSize);

  const wallLines = useMemo(() => {
    if (roomData.floorType === 'first') {
      return [
        [[0.0, 10.8], [0.0, 2.4]],
        [[0.0, 2.4], [4.2, 2.4]],
        [[4.2, 2.4], [4.2, 1.2]],
        [[4.2, 1.2], [14.4, 1.2]],
        [[14.4, 1.2], [13.2, 10.2]],
        [[13.2, 10.2], [0.0, 10.8]]
      ];
    }
    return [
      // Outer Walls
      [[1.5 * 0.6, 1.5 * 0.6], [13.0 * 0.6, 1.0 * 0.6]],   // Top (slants up)
      [[1.5 * 0.6, 1.5 * 0.6], [2.40 * 0.6, 17.0 * 0.705]],  // Left (slants right)
      [[13.0 * 0.6, 1.0 * 0.6], [11.5 * 0.6, 17.0 * 0.705]],// Right (slants left)

      // Bottom Walls
      [[2.0 * 0.7, 17.0 * 0.7], [4.0 * 0.7, 17.0 * 0.7]], // Bottom Left
      [[8.0 * 0.6, 17.0 * 0.7], [11.5 * 0.6, 17.0 * 0.70]],// Bottom Right


      // Inner "L" Shape exactly as drawn in the figure
      [[5.0 * 0.6, 9.0 * 0.6], [5.60 * 1.0 * 0.6, 17.6 * 0.6]],  // Inner Vertical down to Y=15
      [[5.0 * 0.64, 15.0 * 0.7], [11.7 * 0.6, 15.0 * 0.7]] // Inner Bottom Horizontal across to Right Wall
    ];
  }, [roomData.floorType]);

  return (
    <group position={[0, 0, 0]}>
      {/* Base Floor Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, -0.01, depth / 2]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Manual 14x20 Grid Lines */}
      {Array.from({ length: gridDivisionsX + 1 }).map((_, i) => (
        <mesh key={`gx-${i}`} position={[i * tileSize, 0, depth / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.02, depth]} />
          <meshBasicMaterial color="#cccccc" />
        </mesh>
      ))}

      {Array.from({ length: gridDivisionsZ + 1 }).map((_, i) => (
        <mesh key={`gz-${i}`} position={[width / 2, 0, i * tileSize]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.02, width]} />
          <meshBasicMaterial color="#cccccc" />
        </mesh>
      ))}

      {/* Building Borders - Blueprint Lines */}
      {wallLines.map((line, index) => (
        <WallSegment key={`wall-${index}`} p1={line[0]} p2={line[1]} thickness={0.15} color="#111111" />
      ))}
    </group>
  );
}
