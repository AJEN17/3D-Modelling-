const fs = require('fs');

const planPath = '/Users/ajendra/3d/datacenter-viewer/src/data/firstFloorPlan.json';
const data = JSON.parse(fs.readFileSync(planPath, 'utf8'));

// Define the exact positioning logic based on blueprint
const layout = [
  {
    z: 3.6, startX: 2.7, vertical: false,
    items: [
      { id: "recc-1-cmd", gap: 0.6, name: "RECC 1 CMD" },
      { id: "recc-1-rack-4-cl-3", gap: 0.6, name: "RECC 1 RACK 4" },
      { id: "proposed-facebook-rack-1", gap: 0.0, name: "Facebook Rack 1" },
      { id: "proposed-facebook-rack-2", gap: 0.8, name: "Facebook Rack 2" },
      { id: "mobilium-rack", gap: 0.0, name: "Mobilium" },
      { id: "emc-hewlett-packard", gap: 0.0, name: "EMC HP" },
      { id: "c-dot-rack", gap: 0.0, name: "C-DOT" }
    ]
  },
  {
    z: 5.6, startX: 2.7, vertical: false,
    items: [
      { id: "recc-2-cmd", gap: 0, name: "RECC 2 CMD" },
      { id: "recc-2-rack-4", gap: 0, name: "RECC 2 RACK 4" },
      { id: "recc-2-rack-3", gap: 0, name: "RECC 2 RACK 3" },
      { id: "recc-2-rack-2", gap: 0, name: "RECC 2 RACK 2" },
      { id: "recc-2-rack-1", gap: 0, name: "RECC 2 RACK 1" },
      { id: "recc-11-nab-rack", gap: 1.0, name: "RECC 11 NAB" },
      { id: "hungama", gap: 0, name: "HUNGAMA" },
      { id: "one-97-rack-2", gap: 0, name: "ONE 97" },
      { id: "mcorbon-rack-2", gap: 0, name: "Mcarbon" }
    ]
  },
  {
    z: 7.6, startX: 2.7, vertical: false,
    items: [
      { id: "network-rack", gap: 0, name: "NETWORK RACK" },
      { id: "sbc", gap: 0, name: "SBC" },
      { id: "c-nebr-rack", gap: 0, name: "C NEBR" },
      { id: "ss7-signaling", gap: 0, name: "SS7 Signaling" },
      { id: "nsn-app-gw-2", gap: 0.8, name: "NSN APP GW 2" },
      { id: "ims-3", gap: 0, name: "IMS 3" },
      { id: "ims-2", gap: 0, name: "IMS 2" },
      { id: "ims--1", gap: 0, name: "IMS 1" },
      { id: "ciena-1", gap: 0, name: "Ciena 1" },
      { id: "ciena-2", gap: 0, name: "Ciena 2" }
    ]
  },
  {
    z: 1.5, startX: 4.5, vertical: false,
    items: [
      { id: "ups-pdu-2b", gap: 0, name: "UPS PDU 2B" },
      { id: "ups-pdu-1a", gap: 0.7, name: "UPS PDU 1A" },
      { id: "inv-pdu-1", gap: 0, name: "INV PDU 1" },
      { id: "inv-pdu-2", gap: 0.2, name: "INV PDU 2" },
      { id: "m-dc-pdu-1", gap: 0, name: "M DC PDU" },
      { id: "s-dc-pdu-1", gap: 0.75, name: "S DC PDU" },
      { id: "ups-pdu-1a-right", gap: 0, name: "UPS PDU 1A" },
      { id: "ups-pdu-2b-right", gap: 0.75, name: "UPS PDU 2B" },
      { id: "ats-top-right", gap: 0.2, name: "ATS" },
      { id: "pillar-top-right", gap: 0, name: "PILLAR" }
    ]
  },
  {
    x: 0.8, startZ: 4.8, vertical: true,
    items: [
      { id: "95-tr-pac-6", gap: 0.2, name: "9.5 TR PAC 6" },
      { id: "95-tr-pac-5", gap: 0.2, name: "9.5 TR PAC 5" },
      { id: "95-tr-pac-4", gap: 0, name: "9.5 TR PAC 4" }
    ]
  },
  {
    x: 13.5, startZ: 4.2, vertical: true,
    items: [
      { id: "95-tr-pac-1", gap: 0.2, name: "9.5 TR PAC 1" },
      { id: "95-tr-pac-2", gap: 0.2, name: "9.5 TR PAC 2" },
      { id: "95-tr-pac-3", gap: 0.2, name: "9.5 TR PAC 3" },
      { id: "tx-rack", gap: 0, name: "TX RACK" },
      { id: "tx-rack-1", gap: 0, name: "TX RACK-1" }
    ]
  },
  {
    z: 9.3, startX: 1.5, vertical: false,
    items: [
      { id: "ats-1-bottom", gap: 0.1, name: "ATS 1" },
      { id: "ats-2-bottom", gap: 0.4, name: "ATS 2" },
      { id: "red-circle-1", gap: 0.1, name: "Fire Sup 1" },
      { id: "red-circle-2", gap: 0.1, name: "Fire Sup 2" },
      { id: "red-circle-3", gap: 0.1, name: "Fire Sup 3" },
      { id: "red-circle-4", gap: 0.3, name: "Fire Sup 4" },
      { id: "pillar-bottom-middle", gap: 3.0, name: "PILLAR" },
      { id: "pillar-bottom-right", gap: 0, name: "PILLAR" }
    ]
  }
];

// Explicit type mapping based on Blueprint Colors
const typeMap = {
  "recc-1-rack-4-cl-3": "nld",
  "emc-hewlett-packard": "nld",
  "network-rack": "nld",
  "sbc": "nld",
  
  "mobilium-rack": "tx",
  "c-dot-rack": "tx",
  "recc-2-cmd": "tx",
  "recc-2-rack-4": "tx",
  "recc-2-rack-3": "tx",
  "recc-2-rack-2": "tx",
  "recc-2-rack-1": "tx",
  "recc-11-nab-rack": "tx",
  "hungama": "tx",
  "one-97-rack-2": "tx",
  "mcorbon-rack-2": "tx",
  "c-nebr-rack": "tx",
  "ciena-1": "tx",
  "ciena-2": "tx",
  "tx-rack": "tx",
  "tx-rack-1": "tx",

  "recc-1-cmd": "core",
  "ss7-signaling": "core",
  "nsn-app-gw-2": "core",

  "ims-3": "vas",
  "ims-2": "vas",
  "ims--1": "vas",

  "proposed-facebook-rack-1": "facebook",
  "proposed-facebook-rack-2": "facebook"
};

// Apply type, name, and position changes
const componentsById = {};
for (const comp of data.components) {
  componentsById[comp.id] = comp;
  
  // Set explicit types
  if (typeMap[comp.id]) {
    comp.type = typeMap[comp.id];
  } else if (comp.id.includes("pac") || comp.id.includes("pdu") || comp.id.includes("ats")) {
    comp.type = "infra";
  } else if (comp.id.includes("pillar") || comp.id.includes("circle") || comp.id.includes("yellow")) {
    comp.type = "structural";
  }
}

// Reposition
for (const row of layout) {
  let curr = row.vertical ? row.startZ : row.startX;
  for (const item of row.items) {
    const comp = componentsById[item.id];
    if (!comp) continue;
    
    // Update name
    comp.name = item.name;

    // Update position
    const measure = row.vertical ? comp.depth : comp.width;
    curr += measure / 2;
    
    if (row.vertical) {
      comp.position = [row.x, 0, curr];
    } else {
      comp.position = [curr, 0, row.z];
    }
    
    curr += measure / 2 + item.gap;
  }
}

// Individual static components
const staticComps = {
  "yellow-box": [0.5, 0, 2.7],
  "pillar-top-left": [0.5, 0, 0.6],
  "pillar-top-middle": [6.3, 0, 1.8]
};
for (const [id, pos] of Object.entries(staticComps)) {
  if (componentsById[id]) {
    componentsById[id].position = pos;
    componentsById[id].name = id === "yellow-box" ? "Yellow Box" : "PILLAR";
  }
}

fs.writeFileSync(planPath, JSON.stringify(data, null, 2));
console.log('Successfully updated positions and types without modifying dimensions!');
