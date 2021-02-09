const { checkmate, stalemate } = require("./attacking")
const { legalMove, makeMove } = require("./move")
const { initializePieces } = require("./utils")

class Chess {
	constructor() {		
		this.pieces = []
		this.moves = []
		this.lastMove = "start"
		this.toMove = "white"
		this.stalemate = false
		this.checkmate = false

		initializePieces(this.pieces)
	}

	legal(move) {
		return legalMove(this.pieces, move, this.lastMove)
	}

	play(move) {
		this.moves.push(move)
		this.lastMove = move
		this.pieces = makeMove(this.pieces, move)		

		// checkmate or stalemate?
		const king = this.pieces.find(p => p.name === "king" && p.color !== this.toMove)
		
		if (checkmate(this.pieces, king)) {
			console.log('checkmate')
			this.checkmate = true
			this.winner = this.toMove
		}
		else if (stalemate(this.pieces, king)) {
			this.stalemate = true
		}
		else {
			// update to move
			this.toMove = this.toMove === "white" ? "black" : "white"
		}
	}

	// print the board to the console
	printBoard() {
		const board = []
		for (let i = 0; i < 8; i++) {
			const row = ['_', '_', '_', '_', '_', '_', '_', '_']
			board.push(row)
		}
		this.pieces.forEach(p => {
			board[p.boardY][p.boardX] = p.name[0]
			if (p.name === 'knight') {
				board[p.boardY][p.boardX] = 'n'
			}
		})
		for (let i = 0; i < 8; i++) {
			console.log(board[i].join(' '))
		}
	}
}

module.exports = {
	Chess,
	makeMove
}