const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the map image
const mapImage = new Image();
mapImage.src = 'clash.webp'; // Replace 'clash.webp' with the path to your map image

// Load the hut image
const hutImage = new Image();
hutImage.src = 'Hut.png'; // Replace 'Hut.png' with the path to your hut image

// Map properties
const tileSize = 64;
let mapWidth = 18;
let mapHeight = 13;

// Camera position
let cameraX = 0;
let cameraY = 0;
let scale = 1; // Initial scale

// Grid properties
let gridTileSize = 11;
let numGridSquares = 44; // Number of grid squares
let gridX = 20; // Grid x position
let gridY = -325; // Grid y position
let topAngle = 106;
let leftAngle = 74;

// Function to resize canvas to match map size
function resizeCanvas() {
    canvas.width = mapWidth * tileSize * scale;
    canvas.height = mapHeight * tileSize * scale;
}

// Function to draw the map
function drawMap() {
    const mapX = -cameraX * scale; // Adjust the position based on cameraX and scale
    const mapY = -cameraY * scale; // Adjust the position based on cameraY and scale

    ctx.drawImage(mapImage, mapX, mapY, mapWidth * tileSize * scale, mapHeight * tileSize * scale);
}

// Function to handle panning
function handlePan(event) {
    const movementX = event.movementX;
    const movementY = event.movementY;
    cameraX += movementX / scale;
    cameraY += movementY / scale;
    draw();
}

// Function to handle zooming
function handleZoom(event) {
    const delta = event.deltaY;
    if (delta > 0) {
        scale *= 0.9; // Zoom out
    } else {
        scale *= 1.1; // Zoom in
    }
    resizeCanvas();
    draw();
}

// Function to draw the grid
function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    
    // Calculate the center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calculate the starting position of the grid
    let startX = centerX + gridX * scale;
    let startY = centerY + gridY * scale;

    const angle = Math.PI * (37 / 180);

    let endX = startX - (44 * gridTileSize * Math.cos(angle));
    let endY = startY + (44 * gridTileSize * Math.sin(angle));

    // Draw from top left to bottom right
    const deltaX = Math.cos(angle) * gridTileSize * scale;
    const deltaY = Math.sin(angle) * gridTileSize * scale;

    ctx.beginPath();
    for (let i = 0; i < numGridSquares; i++) {
        ctx.moveTo(startX, startY);
        startX += deltaX;
        startY += deltaY;
        ctx.lineTo(endX, endY)
        endX += deltaX;
        endY += deltaY;
    }
    ctx.stroke();


    /* Draw the grid
    for (let x = -numGridSquares / 2 * gridSize * scale; x <= numGridSquares / 2 * gridSize * scale; x += gridSize * scale) {
        ctx.moveTo(x, -numGridSquares / 2 * gridSize * scale);
        ctx.lineTo(x, numGridSquares / 2 * gridSize * scale);
    }
    for (let y = -numGridSquares / 2 * gridSize * scale; y <= numGridSquares / 2 * gridSize * scale; y += gridSize * scale) {
        ctx.moveTo(-numGridSquares / 2 * gridSize * scale, y);
        ctx.lineTo(numGridSquares / 2 * gridSize * scale, y);
    }*/

    // Reset transformation
    
    ctx.stroke();
}

// Function to draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawGrid();
    ctx.drawImage(hutImage, 50 * scale, 50 * scale, tileSize * scale, tileSize * scale);
}

// Event listeners
canvas.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {
        handlePan(event);
    }
});

canvas.addEventListener('wheel', handleZoom);

// Load map image, resize canvas, and draw everything
mapImage.onload = () => {
    resizeCanvas();
    draw();
};
