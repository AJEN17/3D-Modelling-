const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/sundale/second.json');
const rawData = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(rawData);

// Inject room
data.room = {
  width: 37,
  depth: 39,
  height: 3,
  tileSize: 0.6,
  name: "SUNDALE SECOND FLOOR",
  floorType: "second"
};

// Inject colors
data.colors = {
  infra: "#00AEEF",
  core: "#8CC63F",
  coldAisle: "#009245",
  hotAisle: "#F1A19D",
  pillar: "#ED1C24",
  structural: "#ED1C24",
  facebook: "#ED1C24",
  nld: "#662D91",
  tx: "#FFFF00",
  vas: "#F7931E",
  fap: "#FF5722",
  cylinder: "#00AEEF",
  workspace: "#888888"
};

// Normalize components
data.components.forEach(c => {
  // Map "rack" to "core" for green glowing aesthetics
  if (c.type === 'rack') {
    c.type = 'core';
  }
});

// Reorder properties so room and colors are at top
const finalData = {
  room: data.room,
  colors: data.colors,
  walls: data.walls,
  components: data.components
};

fs.writeFileSync(filePath, JSON.stringify(finalData, null, 2), 'utf8');
console.log('Successfully processed updated second.json');
