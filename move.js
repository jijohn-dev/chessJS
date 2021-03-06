const { parseMove, initializePieces, charToName } = require('./utils')
const { pathClear, kingInCheck, safeSquare } = require('./attacking')

const makeMove = (pieces, move) => {
    // parse move notation
    const { pieceX, pieceY, targetX, targetY } = parseMove(move)    

    // castling
    // check if actually castling    
    const king = pieces.find(p => p.name === 'king' && p.boardX === pieceX && p.boardY === pieceY)
    if (king) {        
        if (!king.hasMoved) {
            if (move === "e1g1" || move === "e8g8") {
                const rook = pieces.find(p => p.boardX === 7 && p.boardY === pieceY && p.name === "rook")                
                rook.boardX = 5        
            }
            if (move === "e1c1" || move === "e8c8") {
                const rook = pieces.find(p => p.boardX === 0 && p.boardY === pieceY && p.name === "rook")
                rook.boardX = 3
            }
        }        
    }    

    // get piece
    const piece = pieces.find(p => p.boardX === pieceX && p.boardY === pieceY)

    // promotion (f7f8=q)
    const backRank = piece.color === "white" ? 0 : 7
    if (piece.name === "pawn" && targetY === backRank) {
        piece.name = charToName(move[5])
    }

    // delete captured piece if capture is made
    const captured = pieces.find(p => p.boardX === targetX && p.boardY === targetY)
    if (captured) {
        // console.log("capture")
        captured.delete = true        
    }
    pieces = pieces.filter(p => p.delete === false)    

    // update piece position
    piece.boardX = targetX
    piece.boardY = targetY
    piece.hasMoved = true

    return pieces
}

const legalMove = (pieces, move, lastMove) => {
    // parse move notation
    const { pieceX, pieceY, targetX, targetY } = parseMove(move)

    // same square
    if (pieceX === targetX && pieceY === targetY) {
        return false
    }

    // get piece
    const piece = pieces.find(p => p.boardX === pieceX && p.boardY === pieceY)

    if (!piece) {
        console.log(`no piece on ${pieceX} ${pieceY}`)
        return false
    }

    // check if target is occupied
    let occupied = false
    pieces.forEach(p => {
        if (p.boardX === targetX && p.boardY === targetY) {    
            if (p.color === piece.color) {
                occupied = true
            }        
            // pawns are blocked from moving forward by enemy pieces
            if (piece.name === 'pawn' && pieceX - targetX === 0) {
                occupied = true
            }
        }
    })

    if (occupied) {
        // console.log("occupied")
        return false
    }

    let valid = canMove(pieces, piece, targetX, targetY, lastMove)
    if (!valid) {
        return false
    }
    // save piece position
    let lastX = piece.boardX
    let lastY = piece.boardY

    // check if capture occurs
    const capturedPiece = pieces.find(p => p.boardX === targetX && p.boardY === targetY)

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

    // hide captured piece if capture occurs
    if (capturedPiece) {
        capturedPiece.delete = true
    }
    let check = kingInCheck(pieces, kingX, kingY)

    // reset pieces
    piece.boardX = lastX
    piece.boardY = lastY
    if (capturedPiece) {
        capturedPiece.delete = false
        // reset en passant simulated capture
        if (capturedPiece.enPassant) {
            const step = piece.color === 'white' ? 1 : -1
            capturedPiece.boardY += step
            capturedPiece.enPassant = false
        }
    }
    
    if (check) {
        // console.log("cannot move into check")        
        return false
    }
    
    return true
}

function canMove(pieces, piece, targetX, targetY, lastMove) {
    let diffX = Math.abs(targetX - piece.boardX)
    let diffY = Math.abs(targetY - piece.boardY)

    // check if path is clear
    if (piece.name !== "knight") {
        if (!pathClear(pieces, piece.boardX, piece.boardY, targetX, targetY)) {
            return false
        }
    }
    
    if (piece.name === "pawn") {
        const step = piece.color === "white" ? -1 : 1 
        const pawnStart = piece.color === "white" ? 6 : 1
        // normal move      
        if (targetY === piece.boardY + step && targetX === piece.boardX) {            
            return true
        }
        // 2 squares on first move
        if (targetY === piece.boardY + 2*step && targetX === piece.boardX && piece.boardY === pawnStart) {
            return true
        }
        // capture
        if (targetY === piece.boardY + step && diffX === 1) {
            let capture = false
            pieces.forEach(p => {
                if (p.color !== piece.color && p.boardX === targetX && p.boardY === targetY) {
                    capture = true
                }
            })
            // en passant
            // attacker must be on 5th rank (3) for white, 4th (4) for black
            const attackerY = piece.color === "white" ? 3 : 4            
            if (piece.boardY === attackerY) {
                // is there an enemy pawn 1 square behind target?
                const targetPawn = pieces.find(
                    p => p.color !== piece.color &&
                    p.name === "pawn" &&
                    p.boardX === targetX &&
                    p.boardY === targetY - step
                )        
                
                if (targetPawn) {
                    // was target pawn moved 2 squares on previous move?                    
                    const { pieceX: startX, pieceY: startY, targetX: endX, targetY: endY } = parseMove(lastMove)    
                    if (startX === targetX && 
                        startY === targetPawn.boardY + 2*step && 
                        endX === targetPawn.boardX &&
                        endY === targetPawn.boardY    
                    ) {
                        // move enemy pawn back 1 square to simulate normal capture
                        targetPawn.boardY += step
                        targetPawn.enPassant = true
                        capture = true                        
                    }          
                    else {
                        console.log("enemy pawn did not move 2 squares on previous move:" + lastMove)
                    }          
                }    
                else {
                    // console.log("no enemy pawn on en passant square")
                }                        
            }
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
            const rookX = targetX === 6 ? 7 : 0
            const rookY = piece.color === "white" ? 7 : 0

            if (diffX === 2 && diffY === 0 && targetY === rookY) {
                // cannot castle out of check                
                if (kingInCheck(pieces, piece.boardX, piece.boardY)) {
                    console.log("cannot castle out of check")
                    return false
                }           
                
                // check for rook
                const rook = pieces.find(p => 
                    p.name === "rook" && 
                    p.color === piece.color &&
                    p.boardX === rookX &&
                    p.boardY === rookY &&
                    !p.hasMoved    
                )
                
                if (!rook) {
                    return false
                }

                // short
                if (targetX === 6) {
                    if (!safeSquare(pieces, piece.color, 5, rookY)) {
                        console.log("cannot castle through check")
                        return false
                    }
                    return true
                }
                // long
                if (targetX === 2) {
                    if (!safeSquare(pieces, piece.color, 3, rookY)) {
                        console.log("cannot castle through check")
                        return false
                    }                    
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
    initializePieces,
    parseMove
}