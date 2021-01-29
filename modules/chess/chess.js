const { parseMove, initializePieces } = require('./utils')
const { pathClear, kingInCheck, checkmate } = require('./attacking')

const makeMove = (pieces, move) => {
    // parse move notation
    const { pieceX, pieceY, targetX, targetY } = parseMove(move)    

    // castling
    if (move === "e1g1" || move === "e8g8") {
        const rook = pieces.find(p => p.boardX === 7 && p.name === "rook")
        rook.boardX = 5        
    }
    if (move === "e1c1" || move === "e8c8") {
        const rook = pieces.find(p => p.boardX === 0 && p.name === "rook")
        rook.boardX = 3
    }

    // get piece
    const piece = pieces.find(p => p.boardX === pieceX && p.boardY === pieceY)

    // delete captured piece if capture is made
    const captured = pieces.find(p => p.boardX === targetX && p.boardY === targetY)
    if (captured) {
        console.log("capture")
        captured.delete = true        
    }
    pieces = pieces.filter(p => p.delete === false)    

    // update piece position
    piece.boardX = targetX
    piece.boardY = targetY
    piece.hasMoved = true

    return pieces
}

const legalMove = (pieces, piece, targetX, targetY) => {
    // check if target is occupied
    let occupied = false
    pieces.forEach(p => {
        if (p.color === piece.color && p.boardX === targetX && p.boardY === targetY) {            
            occupied = true
        }
    })

    if (occupied) {
        console.log("occupied")
        return false
    }

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

module.exports = {
    makeMove,
	legalMove,
    checkmate,    
    initializePieces,
    parseMove
}