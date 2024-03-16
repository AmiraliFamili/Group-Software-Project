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
canvas.width = rows * tileWidth;
canvas.height = cols * tileHeight;

// Calculate the initial offset to center the grid within the canvas
const offsetX = (canvas.width - (rows * tileWidth)) / 2;
const offsetY = (canvas.height - (cols * tileHeight)) / 2;

// Function to draw the scene
function drawScene() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background
    ctx.fillStyle = '#cfe8cf'; // Pastel green color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the isometric tiles
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const x = offsetX + (col + row - diamondSize) * tileWidth / 2;
            const y = offsetY + (row - col + diamondSize) * tileHeight / 2;
            drawIsometricTile(x, y, tileWidth, tileHeight);
        }
    }

    // Draw the image
    ctx.drawImage(image, imageX, imageY, imageWidth, imageHeight);

    // Draw the red dot if the image is movable
    if (isMoving) {
        const centerX = imageX + imageWidth / 2;
        const centerY = imageY + imageHeight;
        const dotSize = 5;
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(centerX, centerY, dotSize, 0, 2 * Math.PI);
        ctx.fill();
    }
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

// Image properties
const imageWidth = 100;
const imageHeight = 100;
let imageX = canvas.width / 2 - imageWidth / 2; // Initial position of the image
let imageY = canvas.height / 2 - imageHeight / 2;

// Red dot properties (relative to the original image position)
const dotOffsetX = imageWidth / 2;
const dotOffsetY = imageHeight;

// Image
const image = new Image();
image.src = 'images/hut.png'; // Replace 'image.jpg' with the path to your image

// Flag to determine if image movement is enabled
let isMoving = false;

// Mouse event listeners for the image
canvas.addEventListener('mousedown', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    if (mouseX >= imageX && mouseX <= imageX + imageWidth && mouseY >= imageY && mouseY <= imageY + imageHeight) {
        isMoving = true;
    }
});



// Handle arrow key presses to move the image when it's clicked
document.addEventListener('keydown', function (e) {
    if (!isMoving && e.key === 'Enter') {
        isMoving = true;
    } else if (isMoving && e.key === 'Enter') {
        isMoving = false;
    }
});

// Handle arrow key presses to move the image
document.addEventListener('keydown', function (e) {
    if (!isMoving) return;
    switch (e.key) {
        case 'ArrowLeft':
            imageX -= tileWidth / 2;
            break;
        case 'ArrowRight':
            imageX += tileWidth / 2;
            break;
        case 'ArrowUp':
            imageY -= tileHeight / 2;
            break;
        case 'ArrowDown':
            imageY += tileHeight / 2;
            break;
    }
    drawScene();
});

// Initial draw
image.onload = function () {
    drawScene();
};

