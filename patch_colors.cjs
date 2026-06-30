const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/data/lakha/vasroom.json', 'utf8'));

data.components.forEach(comp => {
  const name = (comp.name || '').toUpperCase();
  
  // Don't overwrite if it already has a custom color (like the beams)
  if (comp.color && comp.name.includes("Beam")) return;

  if (name.includes('DC PDU')) {
    comp.color = '#0070C0'; // Dark Blue
  } else if (name.includes('UPS PDU')) {
    comp.color = '#ED7D31'; // Orange
  } else if (name.includes('PAC-')) {
    comp.color = '#00B050'; // Green
  } else if (name.includes('CISCO') || name.includes('SGSN') || name.includes('GGSN') || 
             name.includes('DNS') || name.includes('MPBN') || name.includes('EPDU') || 
             name.includes('FACEBOOK') || name.includes('SWITCH - BD')) {
    comp.color = '#FFFF00'; // Yellow (CORE)
  } else if (name.includes('SDH') || name.includes('TX RACK') || name.includes('TX MU')) {
    comp.color = '#00B0F0'; // Light Blue (TRANSMISSION)
  } else if (name.includes('ON MOBILE') || name === 'ONE-97' || name.includes('EXTRIM') || 
             name.includes('SDP') || name.includes('CCN')) {
    comp.color = '#E6B8B7'; // Pink (IN / VAS)
  } else if (name.includes('IT RACK')) {
    comp.color = '#76923C'; // Olive Green (IT)
  } else if (name.includes('600X') || name.includes('800X')) {
    comp.color = '#92D050'; // Light Green
  } else if (name.includes('FM 200') || name === 'ONE 97 RACK') {
    comp.color = '#FF0000'; // Red
  }
});

fs.writeFileSync('public/data/lakha/vasroom.json', JSON.stringify(data, null, 4));
console.log("Colors patched!");
