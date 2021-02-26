const { Chess }  = require('../Chess')
const { testEnPassant } = require('./enPassant.test')
const { testPromotion } = require('./promotion.test')
const { testCastling } = require('./castling.test')
const { testStalemate } = require('./stalemate.test')
const { testCheckmate } = require('./checkmate.test')

const promotionBoard = [
	'_', '_', '_', '_', '_', '_', '_', '_', 
	'_', 'K', '_', '_', '_', 'p', '_', '_',
	'_', '_', '_', '_', '_', '_', '_', '_',
	'_', '_', '_', '_', '_', '_', '_', '_',
	'_', '_', '_', '_', '_', '_', '_', '_',
	'_', '_', '_', '_', 'k', '_', '_', '_',
	'_', '_', '_', '_', '_', '_', '_', '_',
	'_', '_', '_', '_', '_', '_', '_', '_'
]

const testLoad = () => {
	console.log("testing loading board")

	const game = new Chess()	

	game.load(promotionBoard, "white")
	
	if(game.toMove !== "white") {
		return false
	}

	const blackKing = game.pieces.find(p => p.name === "king" && p.color === "black")
	if (!blackKing) {
		return false
	}

	if (blackKing.boardX !== 1 || blackKing.boardY !== 1) {
		return false
	}
	
	return true
}

const testFirstMoves = () => {
	console.log('testing first moves')
	const game = new Chess()

	// test all legal first moves
	const firstMoves = [
		// pawn 1 square
		'a2a3', 'b2b3',	'c2c3',	'd2d3',	'e2e3',	'f2f3',	'g2g3',	'h2h3',
		// pawn 2 squares
		'a2a4',	'b2b4',	'c2c4',	'd2d4',	'e2e4',	'f2f4',	'g2g4',	'h2h4',
		// knights
		'b1a3','b1c3', 'g1h3', 'g1f3'
	]

	firstMoves.forEach(move => {
		if (!game.legal(move)) {
			console.log(move + ' illegal')
			return false
		}
	})
	return true
}

const testFriedLiver = () => {
	console.log("testing fried liver game")
	const game = new Chess()
	// fried liver
	const moves = [
		'e2e4', 'e7e5',
		'g1f3', 'b8c6',
		'f1c4', 'g8f6',
		'f3g5', 'd7d5',
		'e4d5', 'f6d5',
		'g5f7', 'e8f7',
		'd1f3', 'f7g8',
		'c4d5', 'd8d5',
		'f3d5', 'c8e6',
		'd5e6'
	]

	moves.forEach(move => {	
		if (!game.legal(move)) {
			console.log(move + ' illegal')
			return false
		}	
		else {
			game.play(move)
		}
	})

	if (!game.checkmate) {
		return false
	}

	if (game.winner !== "white") {
		return false
	}

	return true
}

let passed
let count = 0

let tests = [
	testLoad,
	testFirstMoves,
	testEnPassant,
	testPromotion,
	testCastling,
	testStalemate,
	testCheckmate,
	testFriedLiver
]

for (let i = 0; i < tests.length; i++) {
	passed = tests[i]()
	if (!passed) {
		console.log('failed')		
	}
	else {
		console.log('passed')
		count++
	}
}

console.log(`passed ${count} out of ${tests.length} tests`)

