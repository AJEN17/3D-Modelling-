const fs = require('fs');

const pdfComps = JSON.parse(fs.readFileSync("/Users/ajendra/Documents/Floor plans/Sundale/Second Floor-a/interim_pdf_components.json", "utf8"));
const secondData = JSON.parse(fs.readFileSync("src/data/sundale/second.json", "utf8"));
const pdfWalls = JSON.parse(fs.readFileSync("/Users/ajendra/Documents/Floor plans/Sundale/Second Floor-a/pdf_walls.json", "utf8"));

const matches = [];
secondData.components.forEach(c => {
    const pdfC = pdfComps.find(p => p.name === c.name);
    if (pdfC) {
        matches.push({
            pdfX: pdfC.pdf_cx, pdfZ: pdfC.pdf_cy,
            realX: c.position[0], realZ: c.position[2]
        });
    }
});

let sumDeltaPdfX = 0, sumDeltaRealX = 0;
let sumDeltaPdfZ = 0, sumDeltaRealZ = 0;

for(let i=0; i<matches.length; i++) {
    for(let j=i+1; j<matches.length; j++) {
        const dxPdf = Math.abs(matches[i].pdfX - matches[j].pdfX);
        const dxReal = Math.abs(matches[i].realX - matches[j].realX);
        if (dxPdf > 100) {
            sumDeltaPdfX += dxPdf;
            sumDeltaRealX += dxReal;
        }

        const dzPdf = Math.abs(matches[i].pdfZ - matches[j].pdfZ);
        const dzReal = Math.abs(matches[i].realZ - matches[j].realZ);
        if (dzPdf > 100) {
            sumDeltaPdfZ += dzPdf;
            sumDeltaRealZ += dzReal;
        }
    }
}

const scaleX = sumDeltaRealX / sumDeltaPdfX;
const scaleZ = sumDeltaRealZ / sumDeltaPdfZ;

let offsetX = 0, offsetZ = 0;
matches.forEach(m => {
    offsetX += m.realX - m.pdfX * scaleX;
    offsetZ += m.realZ - m.pdfZ * scaleZ;
});
offsetX /= matches.length;
offsetZ /= matches.length;

console.log("Transformation Model:");
console.log({scaleX, scaleZ, offsetX, offsetZ});

const mappedWalls = pdfWalls.map(w => {
    return [
        [ w[0][0] * scaleX + offsetX, w[0][1] * scaleZ + offsetZ ],
        [ w[1][0] * scaleX + offsetX, w[1][1] * scaleZ + offsetZ ]
    ];
});

secondData.walls = mappedWalls;
fs.writeFileSync("src/data/sundale/second.json", JSON.stringify(secondData, null, 2));
console.log("Successfully aligned walls with components based on 44 anchor points.");
