const { Chess } = require('../Chess')

const testStalemate = () => {
	console.log("testing stalemate")

	const game = new Chess()

	let board = [
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','Q','_','_',
		'_','_','_','_','_','K','_','k'
	]

	game.load(board, 'white', 'e2f2')

	if (!game.stalemate) return false

	// not stalemate
	board = [
		'_','_','_','_','_','_','_','_',
		'_','_','p','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','Q','_','_',
		'_','_','_','_','_','K','_','k'
	]

	game.load(board, 'white', 'e2f2')

	if (game.stalemate) return false

	// avoid stalemate with en passant
	board = [
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','P','_','_','_','_','_',
		'_','P','p','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','_','_','_',
		'_','_','_','_','_','Q','_','_',
		'_','_','_','_','_','K','_','k'
	]

	game.load(board, 'white', 'b7b5')

	if (game.stalemate) return false

	return true
}

module.exports = {
	testStalemate
}