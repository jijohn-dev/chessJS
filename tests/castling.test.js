const { Chess } = require('../Chess')

const testCastling = () => {
	console.log("testing castling")
	let game = new Chess()

	let board = [
		'R', '_', '_', '_', 'K', '_', '_', 'R', 
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', 'n', '_', '_',
		'p', 'p', '_', '_', 'p', 'p', 'p', 'p',
		'r', '_', '_', '_', 'k', '_', '_', 'r'
	]

	game.load(board, "white", 'g1f3')

	if (!game.legal('e1g1')) {
		console.log('e1g1')
		return false 
	}
	if (!game.legal('e1c1')) { 
		console.log('e1c1')
		return false
	} 

	game.play('e1g1')
	game.play('e8c8')
	game.printBoard()

	// castling through check
	board = [
		'R', '_', '_', '_', 'K', '_', '_', 'R', 
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', 'B', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', 'n', '_', '_',
		'p', 'p', '_', '_', '_', 'p', 'p', 'p',
		'r', '_', '_', '_', 'k', '_', '_', 'r'
	]

	game.load(board, "white", 'b5c4')
	if (game.legal('e1g1')) return false

	board = [
		'R', '_', '_', '_', 'K', '_', '_', 'R', 
		'_', '_', '_', 'Q', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', 'n', '_', '_',
		'p', 'p', '_', '_', '_', 'p', 'p', 'p',
		'r', '_', '_', '_', 'k', '_', '_', 'r'
	]

	game.load(board, "white", 'd8d7')
	if (game.legal('e1c1')) return false

	// moves that look like castling

	board = [
		'R', '_', '_', '_', 'K', '_', '_', 'R', 
		'_', '_', '_', 'Q', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', 'N', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', 'n', '_', '_',
		'p', 'p', '_', '_', '_', 'p', 'p', 'p',
		'_', 'k', 'r', '_', 'q', '_', '_', 'r'
	]

	game.load(board, 'white', 'd8d7')

	if (!game.legal('e1g1')) return false
	game.play('e1g1')

	if (!game.legal('d7c8')) return false
	game.play('d7c8')

	game.play('b1a1')

	if (!game.legal('f6g8')) return false
	game.play('f6g8')

	// game.printBoard()

	// castling with no rook

	board = [
		'_', '_', '_', '_', 'K', '_', '_', '_', 
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', 'n', '_', '_',
		'p', 'p', '_', '_', '_', 'p', 'p', 'p',
		'_', '_', '_', '_', 'k', '_', '_', '_'
	]

	game.load(board, 'white', 'g1f3')

	let moves = ['e1g1', 'e1c1', 'e8g8', 'e8c8']
	let legal = false
	moves.forEach(move => {		
		if (game.legal(move)) {
			legal = true
			console.log(move)
		}
	})

	if (legal) return false

	// weird asymmetrical castling bug
	game = new Chess()
	moves = [
		'e2e4', 'e7e5',
		'g1f3', 'b8c6',
		'f1c4', 'g8f6',
		'e1g1'
	]

	moves.forEach(move => {
		game.play(move)
	})

	game.printBoard()


	return true
}

module.exports = {
	testCastling
}