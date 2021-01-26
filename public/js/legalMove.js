function legalMove(piece, targetX, targetY) {
    let diffX = Math.abs(targetX - piece.boardX);
    let diffY = Math.abs(targetY - piece.boardY);

    // check if path is clear
    if (piece.name !== "knight") {
        if (!pathClear(piece.boardX, piece.boardY, targetX, targetY)) {
            return false;
        }
    }
    
    if (piece.name === "pawn") {
        if (piece.color === "white") {
            if (targetY === piece.boardY - 1 && targetX === piece.boardX) {
                return true;
            }
            if (targetY === piece.boardY - 2 && targetX === piece.boardX && !piece.hasMoved) {
                return true;
            }
            if (targetY === piece.boardY - 1 && diffX === 1) {
                return true;
            }
        }
        if (piece.color === "black") {
            if (targetY === piece.boardY + 1 && targetX === piece.boardX) {
                return true;
            }
            if (targetY === piece.boardY + 2 && targetX === piece.boardX && !piece.hasMoved) {
                return true;
            }
            if (targetY === piece.boardY + 1 && diffX === 1) {
                return true;
            }
        }
    }    

    // king
    if (piece.name === "king") {
        // normal move
        if (diffX <= 1 && diffY <= 1) {
            return true;
        }
        // castling
        if (!piece.hasMoved) {  
            let rookY = color === "white" ? 7 : 0;

            if (piece.color === color && targetY === rookY) {
                // short
                if (targetX === 6) {
                    console.log("castle");
                    // move rook
                    pieces.forEach(x => {
                        if (x.name === "rook" && x.color === color && x.boardX === 7) {
                            if (x.hasMoved) {
                                return false;
                            }
                            x.boardX = 5;
                        }
                    })
                    return true;
                }
                // long
                if (targetX === 2) {
                    // move rook
                    pieces.forEach(x => {
                        if (x.name === "rook" && x.color === color && x.boardX === 0) {
                            if (x.hasMoved) {                                
                                return false;
                            }
                            x.boardX = 3;                            
                        }
                    })
                    return true;
                }
            }
        }
    }

    if (piece.name === "queen") {       
        return diffX === 0 || diffY === 0 || diffX === diffY;
    }

    if (piece.name === "rook") {
        return diffX === 0 || diffY === 0;
    }

    if (piece.name === "bishop") {       
        return diffX === diffY;
    }

    if (piece.name === "knight") {
        return (diffX === 1 && diffY === 2) || (diffX === 2 && diffY === 1);
    }

    return false;
}

function isOccupied(x, y) {
    let occupied = false;
    pieces.forEach(p => {        
        if (p.boardX === x && p.boardY === y) {            
            occupied = true;
        }
    })    
    return occupied;
}

function pathClear(x, y, targetX, targetY) {
    let test = x === 0 && y === 2

    let stepX = 0;
    let stepY = 0;
    let steps = 0;

    let diffX = Math.abs(targetX - x);
    let diffY = Math.abs(targetY - y);

    if (diffX != 0) {
        stepX = (targetX - x) / diffX;
        steps = diffX;
    }

    if (diffY != 0) {
        stepY = (targetY - y) / diffY;
        steps = diffY;
    }
    
    for (let i = 1; i < steps; i++) {        
        x += stepX;
        y += stepY;     
        if (test) {
            console.log(`checking ${x} ${y}`)
        }   
        if (isOccupied(x, y)) {
            if (test) {
                console.log(`occupied`)
            }
            return false;
        }        
    }

    return true;
}

function kingInCheck(x, y) {
    let check = false
    pieces.forEach(p => {
        if (p.color !== color && isAttacking(p, x, y)) {
            check = true
        }
    })
    return check
}

function isAttacking(p, x, y) {   
    let diffX = Math.abs(x - p.boardX)
    let diffY = Math.abs(y - p.boardY)

    if (p.name === "knight") {
        if ((diffX === 1 && diffY === 2) || (diffX === 2 && diffY === 1)) {
            return true
        }
    }
    else if (p.name === "pawn") {
        if (p.color === "white") {
            if (y - p.boardY === -1 && diffX === 1) {
                return true
            }
        }
        else {
            if (y - p.boardY === 1 && diffX === 1) {
                return true
            }
        }
    }
    else if (p.name === "bishop" || p.name === "queen") {   
        console.log(`is ${p.name} at ${p.boardX} ${p.boardY} attacking ${x} ${y}?`)
        console.log(`dx: ${diffX} dy: ${diffY}`)     
        if (diffX === diffY && pathClear(p.boardX, p.boardY, x, y)) {
            return true
        }
    }
    else if (p.name === "rook" || p.name === "queen") {
        if ((diffX === 0 || diffY === 0) && pathClear(p.boardX, p.boardY, x , y)) {
            return true
        }
    }
}