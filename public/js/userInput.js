function handleMouseDown(e) {
    // get mouse coords
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;       

    // get square
    let squareX = Math.floor(mouseX / 100);
    let squareY = Math.floor(mouseY / 100);        

    // reflect square for black
    if (color === "black") {
        squareX = 7 - squareX;
        squareY = 7 - squareY;
    }

    // check if square has a piece and is user's color       
    pieces.forEach((p, index) => {
        if (p.boardX === squareX && p.boardY === squareY && p.color === color) {                
            selected = true;
            pieceIdx = index;
        }
    })        
}

function handleMouseUp(e) {
    // get mouse coords
    let mouseX = e.offsetX;
    let mouseY = e.offsetY;        

    // drop piece
    if (selected) {           
        let piece = pieces[pieceIdx];
        let startX = piece.boardX;
        let startY = piece.boardY;

        // cancel if right click
        if (e.button === 2) {
            piece.offsetX = 0;
            piece.offsetY = 0;
            drawBoard();
            drawPieces();
            selected = false;   
            return;
        }

        // get square
        let squareX = Math.floor(mouseX / 100);
        let squareY = Math.floor(mouseY / 100);

        // reflect for black
        if (color === "black") {
            squareX = 7 - squareX;
            squareY = 7 - squareY;
        }

        let occupied = false;
        let moveMade = false;
        let capture = false;

        let notation = "";

        // check color
        if (piece.color !== toMove) {
            squareX = piece.boardX;
            squareY = piece.boardY;
        }
        else {                
            moveMade = true;                                
            notation += idxToSquare(startX, startY);
            if (capture) {
                notation += "x";
            }
            notation += idxToSquare(squareX, squareY);

            // check if move is legal
            if (!legalMove(piece, squareX, squareY)) {
                console.log("illegal move");
            }

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
            console.log(notation);
            // send move to server
            socket.emit("move", {pieces, toMove});
        }            
    }
}

function handleMouseMove(e) {
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
        pieces[pieceIdx].offsetX += dx;
        pieces[pieceIdx].offsetY += dy;

        // redraw
        drawBoard();
        drawPieces();
    }
}