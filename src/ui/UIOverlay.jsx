import { useLocation, useNavigate } from 'react-router-dom';
import groundFloorPlan from '../data/sundale/ground.json';
import firstFloorPlan from '../data/sundale/first.json';
import secondFloorPlan from '../data/sundale/second.json';
import suncityFirstFloorPlan from '../data/suncity/first.json';

export default function UIOverlay() {
  const location = useLocation();
  const navigate = useNavigate();

  const isFloorView = location.pathname.includes('/building/');
  const isFirstFloor = location.pathname.includes('sundale-ff');
  const isSecondFloor = location.pathname.includes('sundale-sf');
  const isSuncity = location.pathname.includes('suncity');
  
  let floorplanData = groundFloorPlan;
  if (isFirstFloor) floorplanData = firstFloorPlan;
  if (isSecondFloor) floorplanData = secondFloorPlan;
  if (isSuncity) floorplanData = suncityFirstFloorPlan;
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
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px' }}
        >
          ← Back
        </button>
        <div style={{ fontSize: '14px', color: '#ccc' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Mumbai Map</span>
          <span style={{ margin: '0 8px' }}>&gt;</span>
          <span style={{ color: 'white', fontWeight: 'bold' }}>{floorplanData.room.name}</span>
        </div>
      </div>
      <h2 style={{ marginTop: 0 }}>{floorplanData.room.name}</h2>
      <p>3D Visualization Based on 600x600mm Tile Grid</p>
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: floorplanData.colors.infra, marginRight: '8px' }}></div> Infra Equipment</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: floorplanData.colors.core, marginRight: '8px' }}></div> Core Servers</div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}><div style={{ width: '12px', height: '12px', backgroundColor: floorplanData.colors.pillar, marginRight: '8px' }}></div> Structural Pillar</div>
      </div>
    </div>
  );
}
