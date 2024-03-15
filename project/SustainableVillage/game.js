const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the map image
const mapImage = new Image();
mapImage.src = 'clash.webp'; // Replace 'map.jpg' with the path to your map image

// Map properties
const tileSize = 64;
let mapWidth = 37; // Adjust according to your map size
let mapHeight = 25;

// Load the hut image
const hutImage = new Image();
hutImage.src = 'Hut.png'; // Replace 'hut.png' with the path to your hut image



// Camera position
let cameraX = 0;
let cameraY = 0;

// Function to resize canvas to match map size
function resizeCanvas() {
    canvas.width = mapWidth * tileSize;
    canvas.height = mapHeight * tileSize;
}

// Function to draw the map
function drawMap() {
    const mapX = +cameraX; // Adjust the position based on cameraX
    const mapY = +cameraY; // Adjust the position based on cameraY

    ctx.drawImage(mapImage, mapX, mapY, canvas.width, canvas.height);
    

}


// Function to draw the isometric grid
function drawGrid() {
    ctx.strokeStyle = '#aaa';
    
    // Calculate the center position of the map
    const centerX = (mapWidth - 1) * tileSize / 2;
    const centerY = (mapHeight - 1) * tileSize / 2;
    
    for (let x = 0; x < mapWidth; x++) {
        for (let y = 0; y < mapHeight; y++) {
            // Calculate the map coordinates of the current tile
            const mapX = x * tileSize;
            const mapY = y * tileSize;
            
            // Calculate the screen coordinates relative to the center of the map
            const screenX = (mapX - mapY) + canvas.width / 2 - centerX - cameraX;
            const screenY = (mapX + mapY) / 2 - cameraY;
            
            // Draw the grid squares
            ctx.beginPath();
            ctx.moveTo(screenX, screenY + tileSize / 2);
            ctx.lineTo(screenX + tileSize / 2, screenY);
            ctx.lineTo(screenX + tileSize, screenY + tileSize / 2);
            ctx.lineTo(screenX + tileSize / 2, screenY + tileSize);
            ctx.closePath();
            ctx.stroke();
        }
    }
}




// Function to handle panning
function handlePan(event) {
    const movementX = event.movementX;
    const movementY = event.movementY;
    cameraX += movementX;
    cameraY += movementY;
    draw();
}

// Function to draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    ctx.drawImage(hutImage, 50, 50, tileSize, tileSize);
    drawGrid();
}

// Event listener for panning
canvas.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {
        handlePan(event);
    }
});

// Load map image, resize canvas, and draw everything
mapImage.onload = () => {
    resizeCanvas();
    draw();
};
