# 3D Data Center Viewer

A React 3D Web Application built with Vite and Three.js (`@react-three/fiber`) that renders a data center floor plan. It uses a "hybrid" aesthetic: a flat 2D architectural blueprint on the ground, with extruded 3D server racks and equipment sitting on top of it.

## Features
- **Data-Driven:** The entire layout is driven by a single JSON file (`src/data/floorplan.json`), making it extremely easy to add or move equipment.
- **Architectural Grid:** Precise 600x600mm floor grid mapping based on actual room dimensions.
- **Dynamic 3D Equipment:** Racks and PACs are procedurally generated in 3D with glowing blades and Billboard labels.
- **Performance Optimized:** Uses React Three Fiber for fast WebGL rendering.

## How to Run Locally (Development)
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173` in your browser.

## How to Build the Offline Windows Executable (.exe)
Because this application is intended to be distributed offline to Windows machines, we use **Electron** and **electron-builder**.
1. `npm install`
2. `npm run electron:build:win`
3. The resulting portable `.exe` and setup installer will be generated in the `dist_electron/` directory.

### Important Note on Offline Data Paths
If you need to add more JSON files or images, make sure you use **relative paths** (`./data/...` and `./images/...`). Absolute paths (`/data/...`) will fail inside the packaged `.exe` because they resolve to the root of the user's `C:\` drive instead of the application directory.

## Customizing the Floor Plan
To move a server or change the layout, simply edit the `[X, Y, Z]` position array in the relevant JSON blueprint file in `public/data/`.

## Performance Architecture
To maintain 60 FPS while rendering thousands of 3D objects, the codebase uses:
- **`InstancedEquipmentGroup.jsx`**: Groups identical racks into a single React Three Fiber `<Instances>` draw call.
- **`geometryCache.js`**: A singleton cache that ensures we only ever load a specific box/cylinder geometry into GPU memory once, regardless of how many times it is instantiated.
