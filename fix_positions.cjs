const fs = require('fs');

const activePath = '/Users/ajendra/3d/datacenter-viewer/src/data/firstFloorPlan.json';
const activeData = JSON.parse(fs.readFileSync(activePath, 'utf8'));

// The user's intended layout from their backup
const backupPath = '/Users/ajendra/3d/datacenter-viewer/First Floor/floorplan_formatted copy.json';
const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

const userPositions = {};
for (const comp of backupData.components) {
  userPositions[comp.id] = comp.position;
}

// Function to clamp X, Z to stay inside walls
function clampPosition(id, pos, w, d) {
  let [x, y, z] = pos;
  
  // Left wall X=0.0
  if (x - w/2 < 0) x = w/2 + 0.05; // 0.05 padding
  
  // Right slanted wall X goes from 14.4 to 13.2
  // X_wall = 14.4 - ((z - 1.2) / 9.0) * 1.2
  let wallX = 14.4 - ((z - 1.2) / 9.0) * 1.2;
  if (x + w/2 > wallX) x = wallX - w/2 - 0.05;

  // Top wall Z=1.2 (for X > 4.2)
  if (x > 4.2 && z - d/2 < 1.2) z = 1.2 + d/2 + 0.05;

  // Cutout corner: X < 4.2 and Z < 2.4 is outside (except Pillar Top Left which goes in hallway)
  if (id !== "pillar-top-left" && x < 4.2 && z < 2.4) {
    if (z - d/2 < 2.4 && x - w/2 < 4.2) {
      // Push down to Z=2.4 or push right to X=4.2
      // For Yellow Box, it's pushed down
      if (id === "yellow-box") {
        z = 2.4 + d/2;
      }
    }
  }

  // Bottom slanted wall Z goes from 10.8 to 10.2
  // Z_wall = 10.8 - (x / 13.2) * 0.6
  let wallZ = 10.8 - (x / 13.2) * 0.6;
  if (z + d/2 > wallZ) z = wallZ - d/2 - 0.05;

  return [x, y, z];
}

for (const comp of activeData.components) {
  // Restore user's manual positions
  if (userPositions[comp.id]) {
    comp.position = [...userPositions[comp.id]];
  }

  // Clamp to walls so they don't clip!
  comp.position = clampPosition(comp.id, comp.position, comp.width, comp.depth);
  
  // Specific visual fixes for Hallway Pillar
  if (comp.id === "pillar-top-left") {
    comp.position = [2.1, 0, 1.2]; // nicely in the entrance hallway
  }
}

fs.writeFileSync(activePath, JSON.stringify(activeData, null, 2));
console.log("Restored user manual positions and mathematically clamped them to prevent wall clipping!");
