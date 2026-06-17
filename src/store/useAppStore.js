import { create } from 'zustand';

const useAppStore = create((set) => ({
  activeBuildingId: null,
  activeFloorId: null,
  
  setActiveBuilding: (buildingId) => set({ activeBuildingId: buildingId }),
  setActiveFloor: (floorId) => set({ activeFloorId: floorId }),
  
  resetSelection: () => set({ activeBuildingId: null, activeFloorId: null })
}));

export default useAppStore;
