const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the map image
const mapImage = new Image();
mapImage.src = 'clash.webp'; // Replace 'clash.webp' with the path to your map image

// Object images
const objectImages = [
    'Hut.png',
    'Tree.png'
];

// Map properties
const tileSize = 64;
let mapWidth = 13;
let mapHeight = 11;

// Camera position
let cameraX = 0;
let cameraY = 0;
let scale = 1;

// Grid properties
let gridSize = 10; // Size of grid squares
let numGridSquares = 48; // Number of grid squares (length/width)
let gridX = 0; // Grid x position
let gridY = 0; // Grid y position
let gridRotation = Math.PI / 4; // Grid rotation angle in radians

// Object properties
let objects = [
    { x: 50, y: 50, imageIndex: 0 },
    { x: 200, y: 200, imageIndex: 1 }
];

// Flag to track if object dragging is in progress
let isDragging = false;
let draggedObjectIndex = -1;
let offsetX, offsetY;

// Preload object images
const loadedImages = [];
let imagesLoaded = 0;
objectImages.forEach((src, index) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === objectImages.length) {
            draw();
        }
    };
    loadedImages[index] = image;
});

// Function to resize canvas to match window size
function resizeCanvas() {
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
}

// Function to draw the map
function drawMap() {
    const mapX = canvas.width / 2 - (mapWidth * tileSize * scale) / 2; // Calculate map X position
    const mapY = canvas.height / 2 - (mapHeight * tileSize * scale) / 2; // Calculate map Y position

    ctx.drawImage(mapImage, mapX, mapY, mapWidth * tileSize * scale, mapHeight * tileSize * scale);
}

// Function to handle panning
// Not working - plus need to differentiate between draging an object vs dragging the background
function handlePan(event) {
    if (isDragging) {
        objects[draggedObjectIndex].x = (event.clientX / scale) - offsetX;
        objects[draggedObjectIndex].y = (event.clientY / scale) - offsetY;
        draw();
    } else {
        const movementX = event.movementX;
        const movementY = event.movementY;
        cameraX += movementX / scale;
        cameraY += movementY / scale;
        draw();
    }
}

// Function to handle zooming
function handleZoom(event) {
    const delta = event.deltaY;
    if (delta > 0) {
        if (scale > 1) { // Only zoom out if the current scale is greater than 1
            scale *= 0.9; // Zoom out
            resizeCanvas();
            draw();
        }
    } else {
        scale *= 1.1; // Zoom in
        resizeCanvas();
        draw();
    }
}

// Function to draw the grid
function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    
    // Calculate the center of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Calculate the starting position of the grid
    const startX = centerX + gridX * scale;
    const startY = centerY + gridY * scale;

    // Apply grid rotation
    ctx.translate(startX, startY);
    ctx.rotate(gridRotation);

    // Draw the grid
    for (let x = -numGridSquares / 2 * gridSize * scale; x <= numGridSquares / 2 * gridSize * scale; x += gridSize * scale) {
        ctx.moveTo(x, -numGridSquares / 2 * gridSize * scale);
        ctx.lineTo(x, numGridSquares / 2 * gridSize * scale);
    }
    for (let y = -numGridSquares / 2 * gridSize * scale; y <= numGridSquares / 2 * gridSize * scale; y += gridSize * scale) {
        ctx.moveTo(-numGridSquares / 2 * gridSize * scale, y);
        ctx.lineTo(numGridSquares / 2 * gridSize * scale, y);
    }

    // Reset transformation
    ctx.rotate(-gridRotation);
    ctx.translate(-startX, -startY);
    
    ctx.stroke();
}

// Function to draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawGrid();
    objects.forEach((object) => {
        const image = loadedImages[object.imageIndex];
        ctx.drawImage(image, object.x * scale, object.y * scale, tileSize * scale, tileSize * scale);
    });
}

// Event listeners
canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.clientX / scale;
    const mouseY = event.clientY / scale;

    for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        if (mouseX >= object.x && mouseX <= object.x + tileSize && mouseY >= object.y && mouseY <= object.y + tileSize) {
            isDragging = true;
            draggedObjectIndex = i;
            offsetX = mouseX - object.x;
            offsetY = mouseY - object.y;
            break;
        }
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mousemove', handlePan);
canvas.addEventListener('wheel', handleZoom);

// Load map image, resize canvas, and draw everything
mapImage.onload = () => {
    resizeCanvas();
    draw();
};

// Listen to window resize event
window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
});
