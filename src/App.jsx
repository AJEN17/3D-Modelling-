/**
 * Main Application Component
 * --------------------------
 * This component sets up the routing (using HashRouter for Electron compatibility),
 * the 3D Canvas context, and the high-level scene management.
 * 
 * It also renders the UI Overlay on top of the WebGL canvas.
 */
import { Suspense, useState } from 'react';
import { HashRouter as Router, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor, BakeShadows } from '@react-three/drei';
import MapScene from './canvas/scenes/MapScene';
import FloorScene from './canvas/scenes/FloorScene';
import RackDemoScene from './canvas/scenes/RackDemoScene';
import UIOverlay from './ui/UIOverlay';
import ErrorBoundary from './ui/ErrorBoundary';

function SceneManager() {
  const location = useLocation();

  if (location.pathname === '/rack-demo') {
    return <RackDemoScene />;
  }

  if (location.pathname === '/' || location.pathname.startsWith('/building/')) {
    return <MapScene />;
  }
  
  if (location.pathname.startsWith('/floor/')) {
    return <FloorScene />;
  }

  return null;
}

function App() {
  const [dpr, setDpr] = useState(1.5);
  return (
    <ErrorBoundary>
      <Router>
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#CECECE', position: 'relative' }}>
          {/* UI Layer */}
          <UIOverlay />
          
          {/* Persistent 3D Layer */}
          <Canvas shadows camera={{ position: [20, 25, 20], fov: 35 }} frameloop="demand" dpr={dpr} performance={{ min: 0.5 }}>
            <PerformanceMonitor onIncline={() => setDpr(1.5)} onDecline={() => setDpr(1)}>
              <AdaptiveDpr pixelated />
              <Suspense fallback={null}>
                <SceneManager />
              </Suspense>
            </PerformanceMonitor>
          </Canvas>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
