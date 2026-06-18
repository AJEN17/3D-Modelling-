const fs = require('fs');

const inputPath = '/Users/ajendra/3d/datacenter-viewer/First Floor/floorplan_formatted.json';
const outputPath = '/Users/ajendra/3d/datacenter-viewer/src/data/firstFloorPlan.json';

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const newPlan = {
  room: {
    width: 14.4,
    depth: 10.8,
    height: 3.0,
    tileSize: 0.6,
    name: "SUNDALE FIRST FLOOR LAB",
    floorType: "first"
  },
  colors: {
    "infra": "#00AEEF",
    "core": "#8CC63F",
    "coldAisle": "#009245",
    "hotAisle": "#F1A19D",
    "pillar": "#ED1C24",
    "structural": "#ED1C24",
    "facebook": "#ED1C24",
    "nld": "#662D91",
    "tx": "#FFFF00",
    "vas": "#F7931E",
    "fap": "#FF5722"
  },
  walls: data.walls,
  components: []
};

for (const comp of data.equipment || data.components) {
  let type = 'rack';
  const name = comp.name.toLowerCase();
  
  if (name.includes('pac') || name.includes('pdu') || name.includes('ats')) {
    type = 'infra';
  } else if (name.includes('pillar') || name.includes('red circle') || name.includes('yellow box')) {
    type = 'structural';
  } else if (name.includes('facebook')) {
    type = 'facebook';
  } else if (name.includes('recc 1 cmd') || name.includes('nsn app')) {
    type = 'core';
  } else if (name.includes('recc 2') || name.includes('recc 11')) {
    type = 'vas';
  } else if (name.includes('mobilium') || name.includes('c-dot') || name.includes('hungama') || name.includes('one 97') || name.includes('mcorbon') || name.includes('tx rack') || name.includes('ciena') || name.includes('nebr')) {
    type = 'tx';
  } else if (name.includes('emc hewlett') || name.includes('rack 4 cl 3')) {
    type = 'nld';
  } else if (name.includes('network') || name.includes('sbc') || name.includes('ss7') || name.includes('ims')) {
    type = 'coldAisle';
  }

  newPlan.components.push({
    id: comp.id,
    name: comp.name,
    type: type,
    width: comp.width,
    depth: comp.depth,
    height: comp.height || 2.0,
    position: comp.position
  });
}

fs.writeFileSync(outputPath, JSON.stringify(newPlan, null, 2));
console.log('Done!');
