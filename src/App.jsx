import { Suspense } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
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
  return (
    <ErrorBoundary>
      <Router>
        <div style={{ width: '100vw', height: '100vh', backgroundColor: '#CECECE', position: 'relative' }}>
          {/* UI Layer */}
          <UIOverlay />
          
          {/* Persistent 3D Layer */}
          <Canvas shadows camera={{ position: [20, 25, 20], fov: 35 }}>
            <Suspense fallback={null}>
              <SceneManager />
            </Suspense>
          </Canvas>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
