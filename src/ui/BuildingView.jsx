/**
 * Building & Floor Selection Sidebar
 * ----------------------------------
 * This component renders the left-hand sidebar containing the navigation menu.
 * It reads the static 'buildings.json' data to display available floors,
 * and updates the URL (via React Router) which then triggers the 3D scene to reload.
 */
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import buildings from '../data/buildings.json';

function RoomBlock({ room, buildingId }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleFloorClick = (roomId, disabled) => {
    if (disabled) return;
    navigate(`/floor/${buildingId}/${roomId}`);
  };

  return (
    <div 
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      onClick={() => handleFloorClick(room.id, room.disabled)}
      style={{ 
        width: room.width || '100%', 
        height: '55px', 
        backgroundColor: room.disabled ? 'rgba(255,255,255,0.05)' : (hovered ? 'rgba(0, 174, 239, 0.2)' : 'rgba(0, 174, 239, 0.05)'),
        border: `1px solid ${room.disabled ? '#333' : (hovered ? '#00AEEF' : 'rgba(0, 174, 239, 0.3)')}`,
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: room.disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        boxShadow: hovered && !room.disabled ? '0 0 15px rgba(0, 174, 239, 0.4)' : 'none'
      }}
    >
      <span style={{ 
        color: room.disabled ? '#666' : (hovered ? '#fff' : '#00AEEF'), 
        fontWeight: '600', 
        fontSize: '14px',
        letterSpacing: '0.5px',
        textShadow: hovered && !room.disabled ? '0 0 8px rgba(255,255,255,0.5)' : 'none'
      }}>
        {room.name}
      </span>
      {room.disabled && (
        <div style={{ position: 'absolute', top: '5px', right: '5px', color: '#ED1C24', fontSize: '10px', border: '1px solid #ED1C24', padding: '2px 4px', borderRadius: '3px' }}>OFFLINE</div>
      )}
    </div>
  );
}

export default function BuildingView() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Need to parse the ID from the pathname manually since UIOverlay doesn't use Routes
  const match = location.pathname.match(/\/building\/(.+)/);
  const currentId = match ? match[1] : null;
  
  const building = buildings.find(b => b.id === currentId);
  
  if (!building || !building.diagram || !building.diagram.floors) {
    return (
      <div style={{ position: 'absolute', top: 20, left: 20, backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '20px', borderRadius: '8px', zIndex: 10 }}>
        <button onClick={() => navigate('/')} style={{ cursor: 'pointer', marginBottom: '10px', background: '#333', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>← Back to Map</button>
        <h2>{building ? building.name : "Building Details"}</h2>
        <p style={{ color: '#aaa' }}>No architectural diagram available.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      backgroundColor: 'rgba(10, 15, 25, 0.85)', 
      backdropFilter: 'blur(8px)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <button 
            onClick={() => navigate('/')} 
            style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', marginBottom: '16px', fontSize: '14px', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ← Back to Global Map
          </button>
          <h1 style={{ color: 'white', margin: 0, fontSize: '28px', fontWeight: '300', letterSpacing: '1px' }}>
            <span style={{ color: '#00AEEF', fontWeight: 'bold' }}>{building.name.toUpperCase()}</span> // OPERATIONAL CROSS-SECTION
          </h1>
        </div>
      </div>

      {/* Cross Section Diagram */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ 
          width: '600px', 
          backgroundColor: 'rgba(0, 5, 15, 0.5)',
          border: '2px solid rgba(0, 174, 239, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column', // Array is L2, L1. Column renders L2 top, L1 bottom.
          gap: '8px',
          boxShadow: '0 0 40px rgba(0, 174, 239, 0.1)'
        }}>
          {/* Roof */}
          <div style={{ height: '20px', borderTop: '4px solid #00AEEF', borderLeft: '4px solid #00AEEF', borderRight: '4px solid #00AEEF', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', opacity: 0.5 }}></div>

          {building.diagram.floors.map((floor, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ color: '#00AEEF', width: '40px', fontWeight: 'bold', fontSize: '18px', opacity: 0.8 }}>{floor.level}</div>
              <div style={{ flex: 1, display: 'flex', gap: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                {floor.rooms.map((room, j) => (
                  <RoomBlock key={j} room={room} buildingId={building.id} />
                ))}
              </div>
            </div>
          ))}

          {/* Basement/Foundation */}
          <div style={{ height: '30px', borderBottom: '4px solid #00AEEF', borderLeft: '4px solid #00AEEF', borderRight: '4px solid #00AEEF', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', opacity: 0.5, marginTop: '8px' }}></div>
        </div>
      </div>
    </div>
  );
}
