let canvas;
let ctx;

const lightColor = 'beige';
const darkColor = 'darkolivegreen';

const size = 100;

// pieces array
let pieces = [];
initializePieces();

// game state
let history = [];
saveState();
let toMove = "white";

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // reset button
    reset = document.getElementById('resetButton');
    reset.addEventListener('click', resetGame);

    // undo button
    undo = document.getElementById('undoButton');
    undo.addEventListener('click', undoMove);

    // draw
    drawBoard();    

    // load spritesheet
    sprites = new Image();
    sprites.src = 'assets/spritesheet.png';
    sprites.onload = () => {
        drawPieces();
    }     

    // click and drag logic
    let down = false;
    let selected = false;
    let piece_idx;

    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', e => {
        // get mouse coords
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;

        down = true;

        // get square
        let squareX = Math.floor(mouseX / 100);
        let squareY = Math.floor(mouseY / 100);        

        // check if square has a piece
        let occupied = false;
        pieces.forEach((p, index) => {
            if (p.boardX === squareX && p.boardY === squareY) {
                occupied = true;
                selected = true;
                piece_idx = index;
            }
        })        
    })

    canvas.addEventListener('mouseup', e => {
        // get mouse coords
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;

        down = false;

        // drop piece
        if (selected) {
            let piece = pieces[piece_idx];

            // get square
            let squareX = Math.floor(mouseX / 100);
            let squareY = Math.floor(mouseY / 100);

            let occupied = false;
            let moveMade = false;
            let capture = false;

            // check color
            if (piece.color !== toMove) {
                squareX = piece.boardX;
                squareY = piece.boardY;
            }
            else {
                moveMade = true;
                // check for capture or occupied                
                pieces.forEach(p => {
                    if (p.boardX === squareX && p.boardY === squareY) {
                        if (piece.color !== p.color) {                            
                            capture = true;
                            p.delete = true;
                        }
                        else {
                            occupied = true;
                            moveMade = false;
                        }                    
                    }
                })
            }
            
            // reset piece if target square is occupied
            if (occupied) {
                squareX = piece.boardX;
                squareY = piece.boardY;
            }

            let startX = piece.boardX;
            let startY = piece.boardY;

            piece.boardX = squareX;
            piece.boardY = squareY;
            piece.offsetX = 0;
            piece.offsetY = 0;

            selected = false;

            // update and redraw
            pieces = pieces.filter(p => p.delete === false);            
            drawBoard();
            drawPieces();
            if (moveMade) {
                saveState();
                changeToMove();
                let notation = "";                
                notation += idxToSquare(startX, startY);
                if (capture) {
                    notation += "x";
                }
                notation += idxToSquare(squareX, squareY);                
                console.log(notation);
            }            
        }
    })

    canvas.addEventListener('mousemove', e => {
        // get mouse coords
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;       

        // calculate mouse movement
        let dx = mouseX - lastX;
        let dy = mouseY - lastY;

        lastX = mouseX;
        lastY = mouseY;

        // move piece
        if (selected) {
            pieces[piece_idx].offsetX += dx;
            pieces[piece_idx].offsetY += dy;

            // redraw
            drawBoard();
            drawPieces();
        }
    });
}

// draw the board
function drawBoard() {  
    ctx.fillStyle = darkColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw light squares
    ctx.fillStyle = lightColor;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i+j) % 2 == 0) {
                ctx.fillRect(100 * i, 100 * j, 100, 100);
            }
        }
    }
}

// sx, sy, dx, dy
function drawPiece(x, y, i, j, dx, dy) {
    ctx.drawImage(sprites, x * size, y * size, size, size, i * size + dx, j * size + dy, size, size);
}

function drawPieces() {
    pieces.forEach((p) => {
        drawPiece(p.spriteX, p.spriteY, p.boardX, p.boardY, p.offsetX, p.offsetY);
    })
}

function createPiece(color, name, spriteX, spriteY, boardX, boardY) {
    pieces.push({
        color,
        name,
        spriteX,
        spriteY,
        boardX,
        boardY,
        offsetX: 0,
        offsetY: 0,
        delete: false 
    })
}

function changeToMove() {
    if (toMove === "white") {
        toMove = "black";
    }
    else {
        toMove = "white";
    }
}

function idxToSquare(x, y) {
    let file = String.fromCharCode(x + 97);
    let rank = 8 - y;
    return file + rank;
}

function saveState() {
    let newState = [];
    pieces.forEach(p => {
        let copy = JSON.parse(JSON.stringify(p));
        newState.push(copy);
    })
    history.push(newState);
}

function loadState() {
    pieces = [];
    history[history.length - 1].forEach(p => {
        pieces.push(JSON.parse(JSON.stringify(p)));
    })
}

function resetGame() {
    pieces = [];
    initializePieces();
    history = [];     
    saveState();
    drawBoard();
    drawPieces();
    toMove = "white";
    console.log("reset");
}

function undoMove() {
    console.log("undo");
    if (history.length > 1) {
        history.pop();
        loadState();
        drawBoard();
        drawPieces();
        changeToMove();
    }
}

function initializePieces() {
    // pawns
    for (let i = 0; i < 8; i++) {
        createPiece("white", "pawn", 0, 0, i, 6);
        createPiece("black", "pawn", 0, 1, i, 1);
    }

    // bishops
    createPiece("white", "bishop", 1, 0, 2, 7);
    createPiece("white", "bishop", 1, 0, 5, 7);
    createPiece("black", "bishop", 1, 1, 2, 0);
    createPiece("black", "bishop", 1, 1, 5, 0);

    // knights
    createPiece("white", "knight", 2, 0, 1, 7);
    createPiece("white", "knight", 2, 0, 6, 7);
    createPiece("black", "knight", 2, 1, 1, 0);
    createPiece("black", "knight", 2, 1, 6, 0);

    // rooks
    createPiece("white", "rook", 3, 0, 0, 7);
    createPiece("white", "rook", 3, 0, 7, 7);
    createPiece("black", "rook", 3, 1, 0, 0);
    createPiece("black", "rook", 3, 1, 7, 0);

    // kings
    createPiece("white", "king", 0, 2, 4, 7);
    createPiece("black", "king", 1, 2, 4, 0);

    // queens
    createPiece("white", "queen", 2, 2, 3, 7);
    createPiece("black", "queen", 3, 2, 3, 0);
}