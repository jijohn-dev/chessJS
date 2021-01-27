const legalMove = (pieces, piece, targetX, targetY) => {
    let valid = canMove(pieces, piece, targetX, targetY)
    if (!valid) {
        return false
    }
    // save piece position
    let lastX = piece.boardX
    let lastY = piece.boardY

    // move piece
    piece.boardX = targetX
    piece.boardY = targetY

    // get position of king    
    let kingX
    let kingY
    pieces.forEach(p => {
        if (p.color === piece.color && p.name === "king") {
            kingX = p.boardX
            kingY = p.boardY
        }
    })

    let check = kingInCheck(pieces, kingX, kingY)

    // reset piece
    piece.boardX = lastX
    piece.boardY = lastY
    
    if (check) {
        console.log("cannot move into check")        
        return false
    }
    
    return true
}

function canMove(pieces, piece, targetX, targetY) {
    let diffX = Math.abs(targetX - piece.boardX)
    let diffY = Math.abs(targetY - piece.boardY)

    // check if path is clear
    if (piece.name !== "knight") {
        if (!pathClear(pieces, piece.boardX, piece.boardY, targetX, targetY)) {
            return false
        }
    }
    
    if (piece.name === "pawn") {
        let step = piece.color === "white" ? -1 : 1       
        if (targetY === piece.boardY + 1*step && targetX === piece.boardX) {
            return true
        }
        if (targetY === piece.boardY + 2*step && targetX === piece.boardX && !piece.hasMoved) {
            return true
        }
        // capture
        if (targetY === piece.boardY + 1*step && diffX === 1) {
            let capture = false
            pieces.forEach(p => {
                if (p.color !== piece.color && p.boardX === targetX && p.boardY === targetY) {
                    capture = true
                }
            })
            return capture
        }               
    }    

    // king
    if (piece.name === "king") {
        // normal move
        if (diffX <= 1 && diffY <= 1) {
            return true
        }
        // castling
        if (!piece.hasMoved) {  
            let rookY = piece.color === "white" ? 7 : 0

            if (piece.color === piece.color && targetY === rookY) {
                // short
                if (targetX === 6) {
                    console.log("castle")
                    // move rook
                    pieces.forEach(x => {
                        if (x.name === "rook" && x.color === piece.color && x.boardX === 7) {
                            if (x.hasMoved) {
                                return false
                            }
                            x.boardX = 5
                        }
                    })
                    return true
                }
                // long
                if (targetX === 2) {
                    // move rook
                    pieces.forEach(x => {
                        if (x.name === "rook" && x.color === piece.color && x.boardX === 0) {
                            if (x.hasMoved) {                                
                                return false
                            }
                            x.boardX = 3                            
                        }
                    })
                    return true
                }
            }
        }
    }

    if (piece.name === "queen") {       
        return diffX === 0 || diffY === 0 || diffX === diffY
    }

    if (piece.name === "rook") {
        return diffX === 0 || diffY === 0
    }

    if (piece.name === "bishop") {       
        return diffX === diffY
    }

    if (piece.name === "knight") {
        return (diffX === 1 && diffY === 2) || (diffX === 2 && diffY === 1)
    }

    return false
}

function isOccupied(pieces, x, y) {
    let occupied = false
    pieces.forEach(p => {        
        if (p.boardX === x && p.boardY === y) {            
            occupied = true
        }
    })    
    return occupied
}

function pathClear(pieces, x, y, targetX, targetY) {
    console.log(`from ${x} ${y} to ${targetX} ${targetY}`)
    let test = false
    if (x === 0 && y === 2) {
        test = true
    }

    let stepX = 0
    let stepY = 0
    let steps = 0

    let diffX = Math.abs(targetX - x)
    let diffY = Math.abs(targetY - y)

    if (diffX != 0) {
        stepX = (targetX - x) / diffX
        steps = diffX
    }

    if (diffY != 0) {
        stepY = (targetY - y) / diffY
        steps = diffY
    }
    
    for (let i = 1; i < steps; i++) {        
        x += stepX
        y += stepY   
        if (test) {
            // console.log(`checking ${x} ${y}`)
        }
        if (isOccupied(pieces, x, y)) {            
            return false
        }        
    }

    return true
}

const kingInCheck = (pieces, x, y) => {
	// console.log(`is king at ${x} ${y} in check?`)   
	let color
	pieces.forEach(p => {
		if (p.boardX === x && p.boardY === y) {
			color = p.color
		}
	}) 
    let check = false
    pieces.forEach(p => {        
        if (p.color !== color && isAttacking(pieces, p, x, y)) {
            check = true
        }
    })
    return check
}

const isAttacking = (pieces, p, x, y) => {   

    let diffX = Math.abs(x - p.boardX)
    let diffY = Math.abs(y - p.boardY)

    if (p.name === "queen") {
        console.log(`is ${p.name} at ${p.boardX} ${p.boardY} attacking ${x} ${y}?`)  
        console.log(`dx: ${diffX} dy: ${diffY}`)    
    }

    if (p.name === "knight") {
        if ((diffX === 1 && diffY === 2) || (diffX === 2 && diffY === 1)) {
            return true
        }
    }
    else if (p.name === "pawn") {
        let step = p.color === "white" ? -1 : 1        
        if (y - p.boardY === step && diffX === 1) {
            return true
        }        
    }
    
    if (p.name === "bishop" || p.name === "queen") {        
        if (diffX === diffY && pathClear(pieces, p.boardX, p.boardY, x, y)) {
            return true
        }
    }
    if (p.name === "rook" || p.name === "queen") {
        if ((diffX === 0 || diffY === 0) && pathClear(pieces, p.boardX, p.boardY, x , y)) {
            return true
        }
    }
}

const checkmate = (pieces, king) => {    
    if (kingInCheck(pieces, king.boardX, king.boardY)) {
        // double check?
        let count = 0
        pieces.forEach(p => {
            if (isAttacking(pieces, p, king.boardX, king.boardY)) {
                count++
            }
        })

        let canMove = kingCanMove(pieces, king.boardX, king.boardY)
        if (canMove) {
            console.log("king can move out of check")
        }

        if (count > 1) {
            // king must move if double check
            if (!canMove) {
                return true
            }
        }
        else {
            let canBlock = false
            if (!canMove && !canBlock) {
                return true
            }
        }
    }
    return false
}

// does the king located at x, y have a legal move?
const kingCanMove = (pieces, x, y) => {
	// need color of king for safeSquare()
	let color
	pieces.forEach(p => {
		if (p.boardX === x && p.boardY === y) {
			color = p.color
		}
	})
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (validSquare(x + i, y + j)) {
				// check if square is occupied by same color
				// TODO: escape check via capture
                if (!isOccupied(pieces, x + i, y + j)) {
                    if (!safeSquare(pieces, color, x + i, y + j)) {
                        console.log(`escape to ${x+i} ${y+j}`)
                        return true
                    }
                }                
            }
        }
    }
}

// is the square at x, y under attack from opposite color?
const safeSquare = (pieces, color, x, y) => {
	pieces.forEach(p => {
		if (p.color !== color && isAttacking(pieces, p, x, y)) {
			return false
		}
	})
	return true
}

const validSquare = (x, y) => {
    return x >= 0 && x <= 7 && y >= 0 && y <= 7
}

module.exports = {
	legalMove,
	checkmate
}