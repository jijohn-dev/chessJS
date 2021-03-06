const { legalMove } = require('./move')
const { coordsToNotation } = require('./utils')
const { kingInCheck, kingCanMove } = require('./attacking')

// is king checkmated?
const checkmate = (pieces, king, lastMove) => {    
    // console.log('checkmate?')
    if (kingInCheck(pieces, king.boardX, king.boardY)) {
		// console.log('king in check after ' + lastMove)
        if (kingCanMove(pieces, king.boardX, king.boardY)) {			
			return false
		}

		// console.log('king cannot move')
        
		// is there a legal move for this color?
        const color = king.color
		const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
		const ranks = ['1', '2', '3', '4', '5', '6', '7', '8']

		let legal = false

		pieces.forEach(p => {
			if (p.color === color) {
				let start = coordsToNotation(p.boardX, p.boardY)				
				files.forEach(f => {
					ranks.forEach(r => {
						let move = start + f + r						
						if(legalMove(pieces, move, lastMove)) {
							// console.log('legal move: ' + move)
							legal = true
						}
					})
				})
			}
		})

		if (!legal) {
			return true
		}   
	}
    return false
}

const stalemate = (pieces, king, lastMove) => {
    if (!kingInCheck, king.boardX, king.boardY) {
        // does the king have a legal move?
        if (kingCanMove(pieces, king.boardX, king.boardY)) {
            return false
        }
        // is there a legal move for this color?
        const color = king.color
		const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
		const ranks = ['1', '2', '3', '4', '5', '6', '7', '8']

		let legal = false

		pieces.forEach(p => {
			if (p.color === color) {
				let start = coordsToNotation(p.boardX, p.boardY)				
				files.forEach(f => {
					ranks.forEach(r => {
						let move = start + f + r						
						if(legalMove(pieces, move, lastMove)) {
							// console.log('legal move:' + move)
							legal = true
						}
					})
				})
			}
		})

		if (!legal) {
			return true
		}
    }
    return false
}

module.exports = {
	checkmate,
	stalemate
}