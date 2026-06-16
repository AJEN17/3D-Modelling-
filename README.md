# 3D Data Center Viewer

A React 3D Web Application built with Vite and Three.js (`@react-three/fiber`) that renders a data center floor plan. It uses a "hybrid" aesthetic: a flat 2D architectural blueprint on the ground, with extruded 3D server racks and equipment sitting on top of it.

## Features
- **Data-Driven:** The entire layout is driven by a single JSON file (`src/data/floorplan.json`), making it extremely easy to add or move equipment.
- **Architectural Grid:** Precise 600x600mm floor grid mapping based on actual room dimensions.
- **Dynamic 3D Equipment:** Racks and PACs are procedurally generated in 3D with glowing blades and Billboard labels.
- **Performance Optimized:** Uses React Three Fiber for fast WebGL rendering.

## How to Run Locally
1. `npm install`
2. `npm run dev`
3. Open `localhost:5173` in your browser.

## Customizing the Floor Plan
To move a server or change the layout, simply edit the `[X, Y, Z]` position array in `src/data/floorplan.json`. The 3D scene will automatically update via Hot Module Replacement.
