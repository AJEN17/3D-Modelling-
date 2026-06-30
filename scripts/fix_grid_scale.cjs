const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/sundale/second.json', 'utf8'));

// The true Z scale factor based on exact blueprint grid counting
// Gap between PAC 3 and PAC 2 is exactly 4 tiles (2.4m) in blueprint
// Current gap is 3.757m. Ratio = 2.4 / 3.757 = 0.638807
const scaleZ = 0.638807;
// X scale is already visually correct (gap is 3.93 tiles, very close to 4)
const scaleX = 1.0; 

// Scale components
data.components.forEach(c => {
    c.position[0] = Number((c.position[0] * scaleX).toFixed(3));
    c.position[2] = Number((c.position[2] * scaleZ).toFixed(3));
});

// Scale walls
if (data.walls) {
    data.walls = data.walls.map(wall => [
        [ Number((wall[0][0] * scaleX).toFixed(3)), Number((wall[0][1] * scaleZ).toFixed(3)) ],
        [ Number((wall[1][0] * scaleX).toFixed(3)), Number((wall[1][1] * scaleZ).toFixed(3)) ]
    ]);
}

// Recalculate room bounds tightly
let maxX = -Infinity, maxZ = -Infinity;
data.components.forEach(c => {
    if (c.position[0] + c.width > maxX) maxX = c.position[0] + c.width;
    if (c.position[2] + c.depth > maxZ) maxZ = c.position[2] + c.depth;
});
if (data.walls) {
    data.walls.forEach(w => {
        if (w[0][0] > maxX) maxX = w[0][0];
        if (w[1][0] > maxX) maxX = w[1][0];
        if (w[0][1] > maxZ) maxZ = w[0][1];
        if (w[1][1] > maxZ) maxZ = w[1][1];
    });
}

// Add a 1m buffer
data.room.width = Math.ceil(maxX + 1.0);
data.room.depth = Math.ceil(maxZ + 1.0);

console.log(`New room dimensions: ${data.room.width}m x ${data.room.depth}m`);

fs.writeFileSync('src/data/sundale/second.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully fixed grid scaling and squished layout to match physical grid count.');
