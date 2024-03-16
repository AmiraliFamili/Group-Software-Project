const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set initial parameters
const tileWidth = 64;
const tileHeight = tileWidth / 2; // Adjusted for 2:1 aspect ratio
const diamondSize = 16; // Number of tiles on each side of the diamond

// Calculate the number of rows and columns
const cols = diamondSize * 2 + 1; // Twice the size of the diamond plus one for the center
const rows = diamondSize * 2 + 1;

// Calculate the canvas size based on the number of rows and columns
canvas.width = cols * tileWidth;
canvas.height = rows * tileHeight;

// Calculate the initial scale factor to fit the entire grid within the canvas
const scaleX = canvas.width / (cols * tileWidth);
const scaleY = canvas.height / (rows * tileHeight);
const scale = Math.min(scaleX, scaleY);

// Calculate the initial offset to center the grid within the canvas
const offsetX = (canvas.width - (cols * tileWidth * scale)) / 2;
const offsetY = (canvas.height - (rows * tileHeight * scale)) / 2;

// Function to draw the scene
function drawScene() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background within the diamond grid area
    ctx.fillStyle = '#cfe8cf'; // Pastel green color
    ctx.fillRect(offsetX, offsetY, cols * tileWidth * scale, rows * tileHeight * scale);

    // Draw the isometric tiles
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const x = (col + row - diamondSize) * tileWidth / 2;
            const y = (row - col + diamondSize) * tileHeight / 2;
            drawIsometricTile(x, y, tileWidth, tileHeight);
        }
    }
    ctx.restore();
}

// Draw isometric tile
function drawIsometricTile(x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height / 2);
    ctx.lineTo(x + width / 2, y + height);
    ctx.lineTo(x, y + height / 2);
    ctx.closePath();
    ctx.strokeStyle = '#000'; // Black stroke color
    ctx.stroke();
}

// Initial draw
drawScene();
