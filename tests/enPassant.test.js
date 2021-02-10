const { Chess } = require('../Chess')

const testEnPassant = () => {
	console.log("testing en passant")

	const game = new Chess()

	let board = [
		'_', '_', '_', '_', '_', '_', '_', '_', 
		'_', 'K', 'P', '_', 'P', 'P', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', 'p', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', 'k', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_'
	]

	// capture c pawn en passant
	game.load(board, "white", 'a7b7')
	game.play('c7c5')

	if (!game.legal('d5c6')) {
		return false
	}

	game.play('d5c6')
	// game.printBoard()

	// capture e pawn en passant
	game.load(board, "white", 'a7b7')
	game.play('e7e5')

	if (!game.legal('d5e6')) {
		return false
	}

	game.play('d5e6')
	// game.printBoard()

	// cannot capture f pawn
	game.load(board, "white", 'a7b7')
	game.play('f7f5')

	if (game.legal('d5f6')) {
		return false
	}

	// king in check after capture?
	board = [
		'_', '_', '_', '_', '_', '_', '_', '_', 
		'_', 'K', '_', '_', 'P', 'P', '_', '_',
		'_', 'Q', '_', '_', '_', '_', '_', '_',
		'_', '_', 'P', 'p', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', 'k', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_'
	]

	game.load(board, "white", 'c7c5')

	if (game.legal('d5c6')) return false

	game.printBoard()

	return true
}

module.exports = {
	testEnPassant
}