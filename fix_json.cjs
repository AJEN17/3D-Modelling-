const fs = require('fs');
const file = './public/data/lakha/power-bms-room.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const fixed = {
  room: {
    width: 12.5,
    depth: 9.0,
    height: 3,
    tileSize: 0.6,
    name: "POWER ROOM-2 & BMS ROOM",
    floorType: "ground"
  },
  colors: {
    infra: "#00AEEF",
    core: "#8CC63F",
    coldAisle: "#009245",
    hotAisle: "#F1A19D",
    pillar: "#ED1C24",
    structural: "#ED1C24",
    nld: "#662D91",
    tx: "#FFFF00",
    vas: "#F7931E",
    fap: "#FF5722",
    rack: "#EEEEEE",
    black_pillar: "#222222",
    dark_blue: "#1D3B8E"
  },
  walls: data.walls.map(w => ({
    type: "line",
    start: w[0],
    end: w[1]
  })),
  components: data.components.map(c => {
    let type = c.type;
    if (c.id === 'main-lt-panel-2') type = 'vas';
    if (c.id === '300kvar-apfc') type = 'tx';
    if (c.id.includes('3-tr-src')) type = 'infra';
    if (c.id === 'fm-200') type = 'cylinder';
    if (c.id === 'inv-bb') type = 'dark_blue';
    if (c.id === 'black-bar' || c.id === 'fire-panel' || c.id.includes('camera')) type = 'black_pillar';
    if (c.id === 'bms-room') type = 'rack';
    
    return { ...c, type, rotation: c.rotation || 0 };
  })
};

fs.writeFileSync(file, JSON.stringify(fixed, null, 2));
console.log("Fixed JSON.");
