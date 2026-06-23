import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  activeBuildingId: null,
  activeFloorId: null,
  preloadedData: {},
  
  setActiveBuilding: (buildingId) => set({ activeBuildingId: buildingId }),
  setActiveFloor: (floorId) => set({ activeFloorId: floorId }),
  
  preloadBuildingData: async (buildingId) => {
    const { preloadedData } = get();
    if (preloadedData[buildingId]) return; // Already loaded

    try {
      let data;
      // In a real app, this would be an API fetch().
      // For Vite bundled JSON, we use dynamic import to prefetch the chunk silently.
      if (buildingId === 'sundale') {
        data = (await import('../data/sundale/ground.json')).default;
      } else if (buildingId === 'sundale-ff') {
        data = (await import('../data/sundale/first.json')).default;
      } else if (buildingId === 'sundale-sf') {
        data = (await import('../data/sundale/second.json')).default;
      } else if (buildingId === 'suncity') {
        data = (await import('../data/suncity/first.json')).default;
      }
      
      if (data) {
        set((state) => ({
          preloadedData: { ...state.preloadedData, [buildingId]: data }
        }));
      }
    } catch (e) {
      console.error(`Failed to preload data for ${buildingId}:`, e);
    }
  },
  
  resetSelection: () => set({ activeBuildingId: null, activeFloorId: null })
}));

export default useAppStore;
