/**
 * Zustand Global State Store
 * --------------------------
 * This file manages the entire application's state. It is used across both the React UI
 * (for menus, breadcrumbs, search) and the WebGL Canvas (for 3D rendering data).
 * 
 * Key responsibilities:
 * - Tracking the currently active building and floor.
 * - Caching fetched floorplan JSON data so we don't re-fetch on navigation.
 * - Managing UI modals (active rack data, active image).
 */
import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  activeBuildingId: null,
  activeFloorId: null,
  activeImageModal: null,
  activeRackModal: null,
  activeRackUnit: null,
  preloadedData: {},
  fetchError: null,
  showAllLabels: false,
  
  setActiveBuilding: (buildingId) => set({ activeBuildingId: buildingId }),
  setActiveFloor: (floorId) => set({ activeFloorId: floorId }),
  setActiveImageModal: (imageUrl) => set({ activeImageModal: imageUrl }),
  setActiveRackModal: (data) => set({ activeRackModal: data }),
  setActiveRackUnit: (data) => set({ activeRackUnit: data }),
  setShowAllLabels: (val) => set({ showAllLabels: val }),
  clearFetchError: () => set({ fetchError: null }),
  

  fetchFloorData: async (buildingId, floorId) => {
    const key = `${buildingId}-${floorId}`;
    const { preloadedData } = get();
    if (preloadedData[key]) return preloadedData[key];

    set({ fetchError: null });

    try {
      let url = '';
      if (buildingId === 'suncity') {
         if (floorId === 'suncity-gf') url = './data/suncity/ground.json';
         if (floorId === 'suncity-ff') url = './data/suncity/first.json';
         if (floorId === 'suncity-sf') url = './data/suncity/secondswitch.json';
         if (floorId === 'suncity-trc') url = './data/suncity/secondtrc.json';
      } else if (buildingId === 'sundale') {
         if (floorId === 'sundale-gf') url = './data/sundale/ground.json';
         if (floorId === 'sundale-ff') url = './data/sundale/first.json';
         if (floorId === 'sundale-sf') url = './data/sundale/second.json';
      } else if (buildingId === 'lakha') {
         if (floorId === 'lakha-gf') url = './data/lakha/groundfloor.json';
         if (floorId === 'lakha-power') url = './data/lakha/powerroom.json';
         if (floorId === 'lakha-power-bms') url = './data/lakha/power-bms-room.json';
         if (floorId === 'lakha-basement') url = './data/lakha/basementbattery.json';
         if (floorId === 'lakha-switch') url = './data/lakha/switchroom.json';
         if (floorId === 'lakha-data') url = './data/lakha/dataroom.json';
         if (floorId === 'lakha-vas') url = './data/lakha/vasroom.json';
      }
      
      if (!url) throw new Error(`URL mapping not found for ${key}`);
      
      // Add a timestamp query parameter to prevent the browser from caching the JSON file
      const response = await fetch(`${url}?t=${Date.now()}`);
      if (!response.ok) throw new Error('Data not found');
      const data = await response.json();
      
      // JSON Schema Validation
      if (!data || !data.room || !data.walls || !data.components) {
        throw new Error('Invalid Blueprint: Missing root properties (room, walls, components)');
      }
      if (!data.room.name || data.room.width === undefined || data.room.depth === undefined) {
        throw new Error('Invalid Blueprint: Missing room name or dimensions');
      }
      if (!data.colors || !data.colors.infra) {
        throw new Error('Invalid Blueprint: Missing color tokens');
      }
      
      set((state) => ({
        preloadedData: { ...state.preloadedData, [key]: data }
      }));
      
      return data;
    } catch (error) {
      console.error("Failed to load floor data:", error);
      set({ fetchError: error.message || "Failed to load blueprint data" });
      return null;
    }
  },
  
  resetSelection: () => set({ activeBuildingId: null, activeFloorId: null })
}));

export default useAppStore;
