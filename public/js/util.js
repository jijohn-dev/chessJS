// perform move
function makeMove(move) {

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
    if (color === "white") {
        pieces.forEach((p) => {
            drawPiece(p.spriteX, p.spriteY, p.boardX, p.boardY, p.offsetX, p.offsetY);
        });
    }
    else {
        pieces.forEach((p) => {
            drawPiece(p.spriteX, p.spriteY, 7 - p.boardX, 7 - p.boardY, p.offsetX, p.offsetY);
        });
    }
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
        hasMoved: false,
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