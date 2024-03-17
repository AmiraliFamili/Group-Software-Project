const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set initial parameters
const tileWidth = 64; //The width of a single tile
const tileHeight = tileWidth / 2; // AThe height of a single tile
const diamondSize = 16; // Number of tiles on each side of the diamond

// Calculate the number of rows and columns
const cols = diamondSize * 2; // Twice the size of the diamond plus one for the center
const rows = diamondSize * 2;

// Calculate the canvas size based on the number of rows and columns
canvas.width = rows * tileWidth;
canvas.height = cols * tileHeight;

// Calculate the initial offset to center the grid within the canvas
const offsetX = (canvas.width - (rows * tileWidth)) / 2;
const offsetY = (canvas.height - (cols * tileHeight)) / 2;

// Function to create a new object
// row and col from 0-31
function createObject(imageSrc, row, col, scale, tiles) {
    return {
        image: createImage(imageSrc),
        row: row,
        col: row,
        x: ((col + row) * tileWidth / 2) + 14,
        y: ((row - col + 29) * tileHeight / 2) -2,
        width: scale * 100,
        height: scale * 100,
        tiles: tiles,
        isMoving: false // Added this property to track if the object is moving
    };
}

function createImage(src) {
    const image = new Image();
    image.onload = function () {
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
            const x = (col + row) * tileWidth / 2;
            const y = (row - col + 32) * tileHeight / 2;
            drawIsometricTile(x, y, tileWidth, tileHeight);
        }
    }

    // Ordering objects so they're drawn correctly
    objects = orderObjects(objects);
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
            // If object is already selected
            if (object.isMoving) {
                object.isMoving = false;
                drawScene();
                return;
            }
            // Object isn't already selected

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
            let newRow;
            let newCol;
            switch (e.key) {
                case 'ArrowLeft':
                    newRow = object.row -1;
                    newCol = object.col;
                    if (isWithinGrid(newRow, newCol, object.tiles) && !isColliding(object, newRow, newCol)) {
                        object.x -= tileWidth / 2;
                        object.y -= tileHeight / 2;
                        object.row -= 1;
                    }
                    break;

                case 'ArrowRight':
                    newRow = object.row +1;
                    newCol = object.col;
                    if (isWithinGrid(newRow, newCol, object.tiles) && !isColliding(object, newRow, newCol)) {
                        object.x += tileWidth / 2;
                        object.y += tileHeight / 2;
                        object.row += 1;
                    }
                    break;

                case 'ArrowUp':
                    newRow = object.row;
                    newCol = object.col +1;
                    if (isWithinGrid(newRow, newCol, object.tiles) && !isColliding(object, newRow, newCol)) {
                        object.x += tileWidth / 2;
                        object.y -= tileHeight / 2;
                        object.col += 1;
                    }
                    break;

                case 'ArrowDown':
                    newRow = object.row;
                    newCol = object.col -1;
                    if (isWithinGrid(newRow, newCol, object.tiles) && !isColliding(object, newRow, newCol)) {
                        object.x -= tileWidth / 2;
                        object.y += tileHeight / 2;
                        object.col -= 1;
                    }
                    break;
            }
        }
    });
    drawScene();
});

// Function to check if the given coordinates are within the diamond-shaped grid
function isWithinGrid(row, col, tiles) {
    return row >= tiles-2 && row < 31 && col >= 0 && col <= 32-tiles;
}

// Function to find the row and column of a given point
function findRowsColumns(x, y) {
    // Solve for col and row
    let row = Math.floor(x / tileWidth + y / tileHeight - 16) + 3;
    let col = Math.floor(x / tileWidth - y / tileHeight + 16);
    return { row, col };
}

// Function to check if object is colliding with another object
function isColliding(movingObject, newRow, newCol) {
    let movingTopCorner = [newRow - movingObject.tiles + 1, newCol + movingObject.tiles - 1];
    let movingBottomCorner = [newRow, newCol];
    let movingLeftCorner = [newRow - movingObject.tiles + 1, newCol];
    let movingRightCorner = [newRow, newCol + movingObject.tiles];

    for (const obj of objects) {
        if (obj !== movingObject) {
            let leftCorner = [obj.row - obj.tiles + 1, obj.col];
            let rightCorner = [obj.row, obj.col + obj.tiles];

            if ((movingLeftCorner[0] <= rightCorner[0] && movingLeftCorner[0] >= leftCorner[0] && movingLeftCorner[1] >= leftCorner[1] && movingLeftCorner[1] <= rightCorner[1]) ||
            (movingTopCorner[0] <= rightCorner[0] && movingTopCorner[0] >= leftCorner[0] && movingTopCorner[1] >= leftCorner[1] && movingTopCorner[1] <= rightCorner[1]) ||
            (movingBottomCorner[0] <= rightCorner[0] && movingBottomCorner[0] >= leftCorner[0] && movingBottomCorner[1] >= leftCorner[1] && movingBottomCorner[1] <= rightCorner[1]) ||
            (movingRightCorner[0] <= rightCorner[0] && movingRightCorner[0] >= leftCorner[0] && movingRightCorner[1] >= leftCorner[1] && movingRightCorner[1] <= rightCorner[1]))
             {
                return true;
            }
        }
    }
    return false;
}

// Function to order objects based on row and col
function orderObjects(objects) {
    return objects.sort((a, b) => {
        if (a.row === b.row) {
            return a.col - b.col; // Sort by col if rows are equal
        } else {
            return a.row - b.row; // Sort by row otherwise
        }
    });
}

// Array to hold objects
let objects = [];

// Add objects
// Cant put objects with too big a size for the edge/corner of grid
objects.push(createObject('images/hut.png', row=10, col=10, scale=1, tiles=5));
objects.push(createObject('images/palmtreetrp.png', row=5, col=4, scale=1, tiles=3));

// Initial draw
drawScene();
