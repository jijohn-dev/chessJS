const { checkmate, stalemate } = require("./attacking")
const { legalMove, makeMove } = require("./move")
const { initializePieces } = require("./utils")

class Chess {
	constructor() {		
		this.pieces = []
		this.moves = []
		this.toMove = "white"
		this.stalemate = false
		this.checkmate = false

		initializePieces(this.pieces)
	}

	legal(move) {
		return legalMove(this.pieces, move)
	}

	play(move) {
		this.pieces = makeMove(this.pieces, move)		

		// checkmate or stalemate?
		if (checkmate(this.pieces, king)) {
			this.checkmate = true
		}
		else if (stalemate(this.pieces, king)) {
			this.stalemate = true
		}
		else {
			// update to move
			this.toMove = this.toMove === "white" ? "black" : "white"
		}
	}
}

module.exports = {
	Chess,
	makeMove
}