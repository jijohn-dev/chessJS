const { Chess }  = require('./Chess')

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
	}
})

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
	}	
	else {
		game.play(move)
	}
})

console.log('checkmate: ' + game.checkmate)
console.log('winner: ' + game.winner)

game.printBoard()