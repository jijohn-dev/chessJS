import { state } from './gameState'
import { socket } from './connection'
import { legalMove } from './legalMove'
import { 
    drawBoard, 
    drawPieces, 
    idxToSquare, 
    saveState,
    changeToMove 
} from './util'

function handleMouseDown(e) {   
    // get state vars
    let pieces = state.pieces

    // get mouse coords
    let mouseX = e.offsetX
    let mouseY = e.offsetY       

    // get square
    let squareX = Math.floor(mouseX / 100)
    let squareY = Math.floor(mouseY / 100)        

    // reflect square for black
    if (state.color === "black") {
        squareX = 7 - squareX
        squareY = 7 - squareY
    }

    // check if square has a piece and is user's color       
    pieces.forEach((p, index) => {
        if (p.boardX === squareX && p.boardY === squareY && p.color === state.color) {                
            state.selected = true
            state.pieceIdx = index
        }
    })        
}

function handleMouseUp(e) {
    let pieces = state.pieces

    // get mouse coords
    let mouseX = e.offsetX
    let mouseY = e.offsetY        

    // drop piece
    if (state.selected) {           
        let piece = pieces[state.pieceIdx]
        let startX = piece.boardX
        let startY = piece.boardY

        // cancel if right click
        if (e.button === 2) {
            piece.offsetX = 0
            piece.offsetY = 0
            drawBoard()
            drawPieces()
            state.selected = false   
            return
        }

        // get square
        let squareX = Math.floor(mouseX / 100)
        let squareY = Math.floor(mouseY / 100)

        // reflect for black
        if (state.color === "black") {
            squareX = 7 - squareX
            squareY = 7 - squareY
        }

        let occupied = false
        let moveMade = false
        let capture = false
        let legal = false

        let notation = ""

        // check color
        if (piece.color !== state.toMove) {
            squareX = piece.boardX
            squareY = piece.boardY
        }
        else {                
            moveMade = true                                
            notation += idxToSquare(startX, startY)            

            // check if move is legal
            legal = legalMove(pieces, piece, squareX, squareY)
            if (!legal) {
                console.log("illegal move")
                moveMade = false
            }
            else {
                // check for capture or occupied                
                pieces.forEach(p => {
                    if (p.boardX === squareX && p.boardY === squareY) {
                        if (piece.color !== p.color) {                            
                            capture = true
                            p.delete = true
                        }
                        else {
                            occupied = true
                            moveMade = false
                        }                    
                    }
                })     
                
                if (capture) {
                    notation += "x"
                }
                notation += idxToSquare(squareX, squareY)
            }            
        }
        
        // reset piece if move is invalid
        if (occupied || !legal) {
            if (occupied) {
                console.log("occupied")
            }
            squareX = piece.boardX
            squareY = piece.boardY
        }           

        // update piece        
        piece.boardX = squareX
        piece.boardY = squareY
        piece.hasMoved = moveMade
        piece.offsetX = 0
        piece.offsetY = 0

        state.selected = false        

        // update and redraw
        pieces = pieces.filter(p => p.delete === false)            
        drawBoard()
        drawPieces()
        if (moveMade) {
            saveState()
            changeToMove()                                
            console.log(notation)
            // send move to server
            let toMove = state.toMove
            socket.emit("move", {pieces, toMove, notation})
        }            
    }
}

function handleMouseMove(e) {
    // get mouse coords
    let mouseX = e.offsetX
    let mouseY = e.offsetY       

    // calculate mouse movement
    let dx = mouseX - state.lastX
    let dy = mouseY - state.lastY

    state.lastX = mouseX
    state.lastY = mouseY

    // move piece
    if (state.selected) {
        state.pieces[state.pieceIdx].offsetX += dx
        state.pieces[state.pieceIdx].offsetY += dy

        // redraw
        drawBoard()
        drawPieces()
    }
}

export { handleMouseDown, handleMouseUp, handleMouseMove }