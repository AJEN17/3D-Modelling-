const fs = require('fs');

// Read interim_pdf_components.json
const pdfComps = JSON.parse(fs.readFileSync('/Users/ajendra/Documents/Floor plans/Sundale/Second Floor-a/interim_pdf_components.json', 'utf8'));

// Read pdf_walls.json
const pdfWalls = JSON.parse(fs.readFileSync('/Users/ajendra/Documents/Floor plans/Sundale/Second Floor-a/pdf_walls.json', 'utf8'));

// Filter out noise
const validComps = pdfComps.filter(c => {
    const name = c.name.trim();
    return !(name.length <= 2 && !/^[A-Za-z]+$/.test(name));
});

let minX = Infinity;
let minZ = Infinity;
validComps.forEach(c => {
    if (c.pdf_cx < minX) minX = c.pdf_cx;
    if (c.pdf_cy < minZ) minZ = c.pdf_cy;
});

const pac1 = validComps.find(c => c.name.includes('PAC 1'));
const pac2 = validComps.find(c => c.name.includes('PAC 2'));

let pdfScaleFactor = 1.0;
if (pac1 && pac2) {
    const distPdf = Math.abs(pac1.pdf_cy - pac2.pdf_cy);
    if (distPdf > 0) {
        pdfScaleFactor = 2.4 / distPdf;
    }
}

console.log(`minX: ${minX}, minZ: ${minZ}, pdfScaleFactor: ${pdfScaleFactor}`);

const scaledWalls = pdfWalls.map(wall => {
    return [
        [
            (wall[0][0] - minX) * pdfScaleFactor,
            (wall[0][1] - minZ) * pdfScaleFactor
        ],
        [
            (wall[1][0] - minX) * pdfScaleFactor,
            (wall[1][1] - minZ) * pdfScaleFactor
        ]
    ];
});

// Update second.json
const secondPath = '/Users/ajendra/3d/datacenter-viewer/src/data/sundale/second.json';
const secondData = JSON.parse(fs.readFileSync(secondPath, 'utf8'));

secondData.walls = scaledWalls;

fs.writeFileSync(secondPath, JSON.stringify(secondData, null, 2), 'utf8');
console.log(`Successfully mapped ${scaledWalls.length} accurate walls to second.json`);
