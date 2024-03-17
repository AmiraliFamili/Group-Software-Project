const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set initial parameters
const tileWidth = 64; //The width of a single tile
const tileHeight = tileWidth / 2; // AThe height of a single tile
const diamondSize = 16; // Number of tiles on each side of the diamond

// Calculate the number of rows and columns
const cols = diamondSize * 2 ; // Twice the size of the diamond plus one for the center
const rows = diamondSize * 2 ;

// Calculate the canvas size based on the number of rows and columns
canvas.width = rows * tileWidth;
canvas.height = cols * tileHeight;

// Calculate the initial offset to center the grid within the canvas
const offsetX = (canvas.width - (rows * tileWidth)) / 2;
const offsetY = (canvas.height - (cols * tileHeight)) / 2;

// Function to create a new object
function createObject(imageSrc, initialX, initialY, width, height) {
    return {
        image: createImage(imageSrc),
        x: initialX,
        y: initialY,
        width: width,
        height: height,
        isMoving: false // Added this property to track if the object is moving
    };
}

function createImage(src) {
    const image = new Image();
    image.onload = function() {
        drawScene(); // Redraw the scene once the image is loaded
    };
    image.src = src;
    return image;
}


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
            const x = (col + row ) * tileWidth / 2;
            const y = (row - col + 32) * tileHeight / 2;
            drawIsometricTile(x, y, tileWidth, tileHeight);
        }
    }

    // Draw each object
    objects.forEach(object => {
        ctx.drawImage(object.image, object.x, object.y, object.width, object.height);
    });

    // Draw the red dot if an object is movable
    objects.forEach(object => {
        if (object.isMoving) {
            const centerX = object.x + object.width / 2;
            const centerY = object.y + object.height;
            const dotSize = 5;
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(centerX, centerY, dotSize, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
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

// Array to hold objects
const objects = [];

// Add objects
objects.push(createObject('images/hut.png', canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100));
objects.push(createObject('images/villagehalltrp.png', canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100));


// Mouse event listener for the objects
canvas.addEventListener('mousedown', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Scale mouse coordinates to match canvas resolution
    const canvasMouseX = mouseX * (canvas.width / rect.width);
    const canvasMouseY = mouseY * (canvas.height / rect.height);
    objects.forEach(object => {
        if (canvasMouseX >= object.x && canvasMouseX <= object.x + object.width && canvasMouseY >= object.y && canvasMouseY <= object.y + object.height) {
            // Reset all other objects' moving state
            objects.forEach(otherObject => {
                otherObject.isMoving = false;
            });
            // Set the clicked object's moving state to true
            object.isMoving = true;
            // Draw the scene after setting the moving state
            drawScene();
        }
    });
});



// Handle arrow key presses to move the objects
document.addEventListener('keydown', function (e) {
    objects.forEach(object => {
        if (object.isMoving) {
            switch (e.key) {
                case 'ArrowLeft':
                    object.x -= tileWidth;
                    break;
                case 'ArrowRight':
                    object.x += tileWidth;
                    break;
                case 'ArrowUp':
                    object.y -= tileHeight;
                    break;
                case 'ArrowDown':
                    object.y += tileHeight;
                    break;
            }
        }
    });
    drawScene();
});

// Initial draw
drawScene();