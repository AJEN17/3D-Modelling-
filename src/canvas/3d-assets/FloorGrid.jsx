import { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';

function WallSegment({ p1, p2, thickness = 0.15, color = "#111111" }) {
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

export default function FloorGrid({ roomData, walls }) {
  const groupRef = useRef();
  const { width, depth, tileSize } = roomData;
  const gridDivisionsX = Math.floor(width / tileSize);
  const gridDivisionsZ = Math.floor(depth / tileSize);

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

  const wallLines = useMemo(() => {
    if (walls && walls.length > 0) {
      return walls;
    }
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
  }, [roomData.floorType, walls]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
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
      {(() => {
        const segments = [];
        wallLines.forEach((wall, index) => {
          if (Array.isArray(wall)) {
            segments.push(<WallSegment key={`wall-${index}`} p1={wall[0]} p2={wall[1]} thickness={0.15} color="#111111" />);
          } else if (wall && wall.type === 'line' && wall.start && wall.end) {
            segments.push(<WallSegment key={`wall-${index}`} p1={wall.start} p2={wall.end} thickness={0.15} color="#111111" />);
          } else if (wall && wall.type === 'bezier' && wall.controlPoints) {
            const curve = new THREE.CubicBezierCurve3(
              new THREE.Vector3(wall.controlPoints[0][0], 0, wall.controlPoints[0][1]),
              new THREE.Vector3(wall.controlPoints[1][0], 0, wall.controlPoints[1][1]),
              new THREE.Vector3(wall.controlPoints[2][0], 0, wall.controlPoints[2][1]),
              new THREE.Vector3(wall.controlPoints[3][0], 0, wall.controlPoints[3][1])
            );
            const points = curve.getPoints(10);
            for (let i = 0; i < points.length - 1; i++) {
              segments.push(<WallSegment key={`wall-${index}-${i}`} p1={[points[i].x, points[i].z]} p2={[points[i+1].x, points[i+1].z]} thickness={0.15} color="#111111" />);
            }
          }
        });
        return segments;
      })()}
    </group>
  );
}
