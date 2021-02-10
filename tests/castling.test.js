const { Chess } = require('../Chess')

const testCastling = () => {
	console.log("testing castling")
	const game = new Chess()

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

	return true
}

module.exports = {
	testCastling
}