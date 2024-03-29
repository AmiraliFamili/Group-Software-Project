/* village_placements.js
George Sharpe - Z-Index for objects, Overhauled objects and related support functions, Collisions with grid and other objects, improve object movement, JS code, improved styling of map
Jean Mady - Created the Grid system, Initial styling of map, support functions for objects, event listeners, Added on screen keys for mobile support
Sebastian Root - Saving and placing objects from previous sessions
*/

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Set initial parameters
const tileWidth = 64; //The width of a single tile
const tileHeight = tileWidth / 2; // The height of a single tile
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
function createObject(imageSrc, row, col, scale, tiles, id) {
    return {
        image: createImage(imageSrc),
        row: row,
        col: col,
        x: ((col + row) * tileWidth / 2) + 14,
        y: ((row - col + 29) * tileHeight / 2) -2,
        width: scale * 100,
        height: scale * 100,
        tiles: tiles,
        isMoving: false,
        id: id
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
    ctx.fillStyle = '#118A9D'; // Sea colour
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
    ctx.strokeStyle = "rgba(130,40,0,0.2)";
    ctx.stroke();

    let {row, col} = findRowsColumns(x, y)
    if (row <=4 || row >=33 || col <=1 || col >=30){
        ctx.fillStyle = '#EEC190'; // Beach Colour
    }
    else
    {
        ctx.fillStyle = '#87C159'; // Grass Colour
    }
    ctx.fill();
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
                hideArrowKeys();
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
            // Show arrow keys
            showArrowKeys();
        }
    });
});

// Function to show arrow keys
function showArrowKeys() {
    const arrowKeys = document.getElementsByClassName('arrow-keys')[0];
    arrowKeys.style.display = 'block';
}

// Function to hide arrow keys
function hideArrowKeys() {
    const arrowKeys = document.getElementsByClassName('arrow-keys')[0];
    arrowKeys.style.display = 'none';
}

// Handle arrow key presses to move the objects
document.addEventListener('keydown', function (e) {
    objects.forEach(object => {
        if (object.isMoving) {
            let newRow;
            let newCol;
            switch (e.key) {
                case 'ArrowLeft':
                    // Get new potential coordinates
                    newRow = object.row -1;
                    newCol = object.col;

                    // Check if collides with grid or other objects
                    if (isWithinGrid(newRow, newCol, object.tiles) && !isColliding(object, newRow, newCol)) {
                        object.x -= tileWidth / 2;
                        object.y -= tileHeight / 2;
                        object.row -= 1;
                    }
                    break;

                case 'ArrowRight':
                    // Get new potential coordinates
                    newRow = object.row +1;
                    newCol = object.col;

                    // Check if collides with grid or other objects
                    if (isWithinGrid(newRow, newCol, object.tiles) && !isColliding(object, newRow, newCol)) {
                        object.x += tileWidth / 2;
                        object.y += tileHeight / 2;
                        object.row += 1;
                    }
                    break;

                case 'ArrowUp':
                    // Get new potential coordinates
                    newRow = object.row;
                    newCol = object.col +1;

                    // Check if collides with grid or other objects
                    if (isWithinGrid(newRow, newCol, object.tiles) && !isColliding(object, newRow, newCol)) {
                        object.x += tileWidth / 2;
                        object.y -= tileHeight / 2;
                        object.col += 1;
                    }
                    break;

                case 'ArrowDown':
                    // Get new potential coordinates
                    newRow = object.row;
                    newCol = object.col -1;

                    // Check if collides with grid or other objects
                    if (isWithinGrid(newRow, newCol, object.tiles) && !isColliding(object, newRow, newCol)) {
                        object.x -= tileWidth / 2;
                        object.y += tileHeight / 2;
                        object.col -= 1;
                    }
                    break;
            }
            // Creates a post request to the website to save the current arrangement of objects
            fetch('/village/updateitem/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    id: object.id,
                    row: object.row,
                    col: object.col
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            }).then(json => {
                console.log(json);
            }).catch(e => {
                console.log('There was a problem with the AJAX request.', e);
            });
        }
    });
    drawScene();
});

// Handle arrow key button clicks
document.getElementById('arrowUp').addEventListener('click', function() {
    moveObject('ArrowUp');
});

document.getElementById('arrowDown').addEventListener('click', function() {
    moveObject('ArrowDown');
});

document.getElementById('arrowLeft').addEventListener('click', function() {
    moveObject('ArrowLeft');
});

document.getElementById('arrowRight').addEventListener('click', function() {
    moveObject('ArrowRight');
});

// Function to move the selected object based on arrow key
function moveObject(key) {
    objects.forEach(object => {
        if (object.isMoving) {
            let newRow;
            let newCol;
            switch (key) {
                case 'ArrowLeft':
                    newRow = object.row - 1;
                    newCol = object.col;
                    break;

                case 'ArrowRight':
                    newRow = object.row + 1;
                    newCol = object.col;
                    break;

                case 'ArrowUp':
                    newRow = object.row;
                    newCol = object.col + 1;
                    break;

                case 'ArrowDown':
                    newRow = object.row;
                    newCol = object.col - 1;
                    break;

                default:
                    return;
            }

            // Checking if object would collide with grid boundaries or other objects
            if (isWithinGrid(newRow, newCol, object.tiles) && !isColliding(object, newRow, newCol)) {
                // Setting new x,y coordinates and row, col
                object.x = (newCol + newRow) * tileWidth / 2 + 14;
                object.y = (newRow - newCol + 29) * tileHeight / 2 - 2;
                object.row = newRow;
                object.col = newCol;
                //Update screen
                drawScene();

                // Creates a post request to the website to save the current arrangement of objects
                fetch('/village/updateitem/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        id: object.id,
                        row: object.row,
                        col: object.col
                    })
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                }).then(json => {
                    console.log(json);
                }).catch(e => {
                    console.log('There was a problem with the AJAX request.', e);
                });
            }
        }
    });
}

// Django's XSS-Injection prevention system requires cookie headers to be tracked. This code is just boilerplate.
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

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
    let movingRightCorner = [newRow, newCol + movingObject.tiles - 1];

    // Checking for collision with each existing object
    for (const obj of objects) {
        if (obj !== movingObject) {
            let leftCorner = [obj.row - obj.tiles + 1, obj.col];
            let rightCorner = [obj.row, obj.col + obj.tiles - 1];

            // Checking left corner of the moving object is inside current object
            if ((movingLeftCorner[0] <= rightCorner[0] && movingLeftCorner[0] >= leftCorner[0] && movingLeftCorner[1] >= leftCorner[1] && movingLeftCorner[1] <= rightCorner[1]) ||

            // Checking top corner of the moving object is inside current object
            (movingTopCorner[0] <= rightCorner[0] && movingTopCorner[0] >= leftCorner[0] && movingTopCorner[1] >= leftCorner[1] && movingTopCorner[1] <= rightCorner[1]) ||

            // Checking bottom corner of the moving object is inside current object
            (movingBottomCorner[0] <= rightCorner[0] && movingBottomCorner[0] >= leftCorner[0] && movingBottomCorner[1] >= leftCorner[1] && movingBottomCorner[1] <= rightCorner[1]) ||

            // Checking right corner of the moving object is inside current object
            (movingRightCorner[0] <= rightCorner[0] && movingRightCorner[0] >= leftCorner[0] && movingRightCorner[1] >= leftCorner[1] && movingRightCorner[1] <= rightCorner[1]))
             {
                return true;
            }
        }
    }
    return false;
}

// Function to order objects based on col and row
function orderObjects(objects) {
    return objects.sort((a, b) => {
        if (a.col === b.col) {
            return a.row - b.row; // Sort by row if cols are equal
        } else {
            return b.col - a.col; // Sort by col otherwise
        }
    });
}

// Gives user object, places it next available position
function giveNewObject(imgSrc, scale, tiles, id) {
    let newObj = createObject(imgSrc, 0, 0, scale, tiles, id)
    for (let newRow=0; newRow < 31; newRow++) {
        for (let newCol=0; newCol < 31; newCol++) {
            if (isWithinGrid(newRow, newCol, tiles) && !isColliding(newObj, newRow, newCol)) {
                console.log(newRow, newCol)
                let neObj = createObject(imgSrc, row=newRow, col=newCol, scale=scale, tiles=tiles, id)
                objects.push(neObj);
    return;
}
}
    }
    console.debug("No room for new object");
}

// Array to hold objects
let objects = [];

//Example of directly adding an object
//objects.push(createObject('../media/images/hut.png', row=15, col=13, scale=1, tiles=2));

// Initial draw
drawScene();
