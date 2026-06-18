import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import groundFloorPlan from '../data/groundFloor.json';
import firstFloorPlan from '../data/firstFloorPlan.json';

export default function UIOverlay() {
  const location = useLocation();
  const navigate = useNavigate();

  const isFloorView = location.pathname.includes('/building/');
  const isFirstFloor = location.pathname.includes('sundale-ff');
  const floorplanData = isFirstFloor ? firstFloorPlan : groundFloorPlan;


  if (!isFloorView) {
    return (
      <div style={{ position: 'absolute', top: 20, left: 20, color: '#333', fontFamily: 'sans-serif', backgroundColor: 'rgba(255,255,255,0.8)', padding: '20px', borderRadius: '8px', zIndex: 10 }}>
        <h2>Mumbai Datacenters</h2>
        <p>Select a facility from the map to view.</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'sans-serif', backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '8px', zIndex: 10 }}>
      <button 
        onClick={() => navigate('/')} 
        style={{ marginBottom: '15px', padding: '8px 12px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px' }}
      >
        ← Back to Map
      </button>
      <h2>{floorplanData.room.name}</h2>
      <p>3D Visualization Based on 600x600mm Tile Grid</p>
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: floorplanData.colors.infra, marginRight: '8px' }}></div> Infra Equipment</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: floorplanData.colors.core, marginRight: '8px' }}></div> Core Servers</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: floorplanData.colors.pillar, marginRight: '8px' }}></div> Structural Pillar</div>
      </div>
    </div>
  );
}
