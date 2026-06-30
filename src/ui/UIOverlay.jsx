import { useEffect, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO } from '@react-three/postprocessing';
import BuildingView from './BuildingView';
import DetailedRack from '../canvas/3d-assets/DetailedRack';
import buildings from '../data/buildings.json';
import useAppStore from '../store/useAppStore';

export default function UIOverlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const fetchFloorData = useAppStore(state => state.fetchFloorData);
  const preloadedData = useAppStore(state => state.preloadedData);
  const fetchError = useAppStore(state => state.fetchError);
  const clearFetchError = useAppStore(state => state.clearFetchError);
  const activeImageModal = useAppStore(state => state.activeImageModal);
  const setActiveImageModal = useAppStore(state => state.setActiveImageModal);
  const activeRackModal = useAppStore(state => state.activeRackModal);
  const setActiveRackModal = useAppStore(state => state.setActiveRackModal);
  const activeRackUnit = useAppStore(state => state.activeRackUnit);
  const setActiveRackUnit = useAppStore(state => state.setActiveRackUnit);
  const showAllLabels = useAppStore(state => state.showAllLabels);
  const setShowAllLabels = useAppStore(state => state.setShowAllLabels);

  const isFloorView = location.pathname.startsWith('/floor/');
  const isBuildingView = location.pathname.startsWith('/building/');

  const match = location.pathname.match(/\/floor\/(.+)\/(.+)/);
  const buildingId = match ? match[1] : null;
  const currentFloorId = match ? match[2] : null;

  const key = buildingId && currentFloorId ? `${buildingId}-${currentFloorId}` : null;
  const floorplanData = key ? preloadedData[key] : null;

  useEffect(() => {
    if (isFloorView && buildingId && currentFloorId && !floorplanData && !fetchError) {
       fetchFloorData(buildingId, currentFloorId);
    }
  }, [isFloorView, buildingId, currentFloorId, floorplanData, fetchError, fetchFloorData]);
  
  useEffect(() => {
    return () => clearFetchError();
  }, [buildingId, currentFloorId, clearFetchError]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeImageModal) setActiveImageModal(null);
        if (activeRackModal) {
          setActiveRackModal(null);
          setActiveRackUnit(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageModal, activeRackModal, setActiveImageModal, setActiveRackModal, setActiveRackUnit]);

  if (isBuildingView) {
    return <BuildingView />;
  }

  const handleBack = () => {
    if (buildingId) {
      navigate(`/building/${buildingId}`);
    } else {
      navigate('/');
    }
  };
  
  if (!isFloorView) {
    return (
      <div style={{ 
        position: 'absolute', 
        top: 30, 
        left: 30, 
        color: '#1a1a1a', 
        fontFamily: 'Inter, -apple-system, sans-serif', 
        backgroundColor: 'rgba(255, 255, 255, 0.45)', 
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        padding: '24px 28px', 
        borderRadius: '16px', 
        zIndex: 10,
        minWidth: '280px'
      }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          fontSize: '20px', 
          fontWeight: '700', 
          letterSpacing: '-0.5px' 
        }}>
          Mumbai Datacenters
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#555', 
          fontSize: '14px', 
          fontWeight: '400',
          lineHeight: '1.4'
        }}>
          Select a facility from the map to view the metrics.
        </p>
      </div>
    );
  }

  if (!floorplanData && !fetchError) {
    return null; // Loading state
  }

  const parentBuilding = buildings.find(b => b.id === buildingId);

  return (
    <>
      {/* Top Navigation Bar */}
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontFamily: 'sans-serif', backgroundColor: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '8px', zIndex: 10 }}>
        <div style={{ marginBottom: '0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={handleBack} 
            style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: '1px solid #555', borderRadius: '4px' }}
          >
            ← Back
          </button>
          <div style={{ fontSize: '14px', color: '#ccc' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Mumbai Map</span>
            {parentBuilding && (
              <>
                <span style={{ margin: '0 8px' }}>&gt;</span>
                <span style={{ cursor: 'pointer' }} onClick={handleBack}>{parentBuilding.name}</span>
              </>
            )}
            <span style={{ margin: '0 8px' }}>&gt;</span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{floorplanData?.room?.name}</span>
          </div>
        </div>
      </div>
      
      {/* Top Right Controls */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            padding: '10px 16px', 
            cursor: 'pointer', 
            backgroundColor: 'rgba(0,0,0,0.6)', 
            color: 'white', 
            border: '1px solid rgba(255,255,255,0.2)', 
            borderRadius: '6px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(0,0,0,0.8)';
            e.target.style.borderColor = 'rgba(255,255,255,0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'rgba(0,0,0,0.6)';
            e.target.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
        >
          <span style={{ fontSize: '16px' }}>↻</span> Reload
        </button>

        <button 
          onClick={() => setShowAllLabels(!showAllLabels)} 
          style={{ 
            padding: '10px 16px', 
            cursor: 'pointer', 
            backgroundColor: showAllLabels ? 'rgba(0,174,239,0.8)' : 'rgba(255,255,255,0.85)', 
            color: showAllLabels ? 'white' : 'black', 
            border: '1px solid', 
            borderColor: showAllLabels ? 'rgba(0,174,239,1)' : 'rgba(0,0,0,0.2)', 
            borderRadius: '6px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            if (!showAllLabels) {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,1)';
            }
          }}
          onMouseOut={(e) => {
            if (!showAllLabels) {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.85)';
            }
          }}
        >
          {showAllLabels ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
          {showAllLabels ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Floor Scene Legend */}
      {(!floorplanData || !floorplanData.hideLegend) && (
        <div style={{ position: 'absolute', bottom: 40, left: 40, color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', padding: '20px', borderRadius: '8px', pointerEvents: 'auto', backdropFilter: 'blur(4px)', zIndex: 10 }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', letterSpacing: '1px', color: '#888' }}>INFRASTRUCTURE LEGEND</h3>
          
          {/* Dynamic Legend from JSON */}
          {floorplanData && floorplanData.legend ? (
            floorplanData.legend.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '14px', height: '14px', backgroundColor: item.color, marginRight: '12px', borderRadius: '3px' }}></div> 
                <span style={{ fontSize: '13px' }}>{item.label}</span>
              </div>
            ))
          ) : (
            /* Fallback Legend if none provided */
            floorplanData && floorplanData.colors && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: floorplanData.colors.infra, marginRight: '12px', borderRadius: '3px' }}></div> <span style={{ fontSize: '13px' }}>Infrastructure</span></div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: floorplanData.colors.core, marginRight: '12px', borderRadius: '3px' }}></div> <span style={{ fontSize: '13px' }}>Core Servers</span></div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: floorplanData.colors.tx, marginRight: '12px', borderRadius: '3px' }}></div> <span style={{ fontSize: '13px' }}>Transmission</span></div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: floorplanData.colors.rack, marginRight: '12px', borderRadius: '3px' }}></div> <span style={{ fontSize: '13px' }}>Standard Racks</span></div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: floorplanData.colors.pillar, marginRight: '12px', borderRadius: '3px' }}></div> <span style={{ fontSize: '13px' }}>Structural Pillar</span></div>
              </>
            )
          )}
        </div>
      )}
      
      {/* Fetch Error Overlay */}
      {fetchError && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(15, 5, 5, 0.95)', padding: '40px 50px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(237, 28, 36, 0.5)', pointerEvents: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 20 }}>
          <div style={{ color: '#ED1C24', fontSize: '42px', marginBottom: '15px' }}>⚠️</div>
          <h2 style={{ color: '#ED1C24', margin: '0 0 10px 0', fontSize: '24px' }}>404: Blueprint Not Found</h2>
          <p style={{ color: '#ccc', marginBottom: '25px', fontSize: '14px', maxWidth: '300px', lineHeight: '1.5' }}>{fetchError}</p>
          <button 
            onClick={() => { clearFetchError(); navigate(`/building/${buildingId}`); }} 
            style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px' }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            Return to Building View
          </button>
        </div>
      )}

      {/* Interactive Image Modal Overlay */}
      {activeImageModal && (
        <div 
          onClick={() => setActiveImageModal(null)}
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.75)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 100,
            pointerEvents: 'auto',
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              position: 'relative', 
              backgroundColor: '#111', 
              padding: '10px', 
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              maxWidth: '80%',
              maxHeight: '80%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'auto'
            }}
          >
            <button 
              onClick={() => setActiveImageModal(null)}
              style={{
                position: 'absolute', top: -40, right: 0, 
                background: 'transparent', border: 'none', color: 'white', 
                fontSize: '16px', cursor: 'pointer', padding: '10px'
              }}
            >
              Close ✕
            </button>
            <img 
              src={activeImageModal} 
              alt="Component View" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: 'calc(80vh - 40px)', 
                objectFit: 'contain', 
                borderRadius: '8px' 
              }} 
            />
          </div>
        </div>
      )}
      {/* Interactive Rack Modal Overlay */}
      {activeRackModal && (
        <div 
          onClick={() => setActiveRackModal(null)}
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.75)', 
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 100,
            pointerEvents: 'auto',
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              position: 'relative', 
              backgroundColor: '#111', 
              padding: '20px', 
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              width: '95%',
              height: '95%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'auto'
            }}
          >
            <h2 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '18px' }}>
              {activeRackModal.name}
            </h2>
            <button 
              onClick={() => { setActiveRackModal(null); setActiveRackUnit(null); }}
              style={{
                position: 'absolute', top: 10, right: 10, 
                background: 'transparent', border: 'none', color: 'white', 
                fontSize: '16px', cursor: 'pointer', padding: '10px', zIndex: 20
              }}
            >
              Close ✕
            </button>
            <div style={{ flex: 1, position: 'relative', borderRadius: '8px', overflow: 'hidden', background: 'radial-gradient(circle at center, #2a2a2a 0%, #0a0a0a 100%)' }}>
              {activeRackModal.owner && (
                <div style={{
                  position: 'absolute', top: '20px', left: '20px', zIndex: 10,
                  backgroundColor: 'rgba(20, 20, 20, 0.85)', padding: '12px 16px', borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', backdropFilter: 'blur(4px)'
                }}>
                  <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Node Owner</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '4px', textTransform: 'capitalize' }}>{activeRackModal.owner}</div>
                </div>
              )}
              <Canvas shadows camera={{ position: [0, 0, 2.6], fov: 50 }} onPointerMissed={() => setActiveRackUnit(null)}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
                  <Environment preset="warehouse" opacity={0.6} />
                  
                  {/* 3D Rack */}
                  <DetailedRack rackData={activeRackModal} />
                  
                  {/* Ground plane for shadows and grounding */}
                  <mesh position={[0, -0.95, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                    <planeGeometry args={[10, 10]} />
                    <meshStandardMaterial color="#111111" roughness={0.8} metalness={0.2} />
                  </mesh>

                  <ContactShadows resolution={1024} scale={5} blur={2} opacity={0.6} far={2} color="#000000" position={[0, -0.94, 0]} />

                  {/* Post-processing: SSAO for crevices, Bloom for LEDs */}
                  <EffectComposer>
                    <SSAO
                      radius={0.05}
                      intensity={15}
                      luminanceInfluence={0.6}
                      color="black"
                    />
                    <Bloom
                      luminanceThreshold={1.0}
                      mipmapBlur
                      intensity={0.4}
                      radius={0.4}
                    />
                  </EffectComposer>
                  
                  <OrbitControls 
                    enablePan={true} 
                    minPolarAngle={Math.PI / 4} 
                    maxPolarAngle={Math.PI / 2} 
                    minDistance={0.5} 
                    maxDistance={4} 
                  />
                </Suspense>
              </Canvas>
              {/* Infrastructure Legend Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                pointerEvents: 'none'
              }}>
                <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px', letterSpacing: '1px' }}>
                  INFRASTRUCTURE LEGEND
                </div>
                {[
                  { label: 'SWITCH', color: '#FFFF00' },
                  { label: 'SERVERS', color: '#92D050' },
                  { label: 'DCDB', color: '#FFFFFF' },
                  { label: 'PSM/PSU/ALARMS SYS', color: '#FFC000' },
                  { label: 'ROUTER', color: '#A5A5A5' },
                  { label: 'FMS', color: '#8EA9DB' },
                  { label: "INTERNAL ROUTER'", color: '#ED7D31' },
                  { label: 'Under Offloading', color: '#FF0000' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '20px', height: '20px', backgroundColor: item.color, border: '2px solid black' }}></div>
                    <div style={{ color: '#eee', fontSize: '12px', fontWeight: '500' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Active Unit Side Panel Overlay */}
              {activeRackUnit && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '300px',
                  backgroundColor: 'rgba(20, 20, 20, 0.95)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                  zIndex: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Component Details</h3>
                    <button 
                      onClick={() => setActiveRackUnit(null)} 
                      style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
                    >✕</button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Name</div>
                      <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '4px' }}>{activeRackUnit.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</div>
                      <div style={{ fontSize: '14px', marginTop: '4px', display: 'inline-block', padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                        {activeRackUnit.type.toUpperCase() === 'COMPUTE' ? 'SERVER' : activeRackUnit.type.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', marginTop: '8px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Position</div>
                        <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '4px' }}>
                          {activeRackUnit.sizeU > 1 
                            ? `${activeRackUnit.startU}U-${activeRackUnit.startU + activeRackUnit.sizeU - 1}U` 
                            : `${activeRackUnit.startU}U`}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Size</div>
                        <div style={{ fontSize: '16px', fontWeight: '500', marginTop: '4px' }}>{activeRackUnit.sizeU}U</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
