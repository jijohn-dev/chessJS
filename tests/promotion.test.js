const { Chess } = require('../Chess')

const testPromotion = () => {
	console.log("testing promotion")

	const game = new Chess()

	let promotionBoard = [
		'_', '_', '_', '_', '_', '_', '_', '_', 
		'_', 'K', '_', 'p', 'p', 'p', 'p', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', 'k', '_', '_', '_',
		'_', '_', '_', 'P', 'P', 'P', 'P', '_',
		'_', '_', '_', '_', '_', '_', '_', '_'
	]
	
	game.load(promotionBoard, "white", 'a8b7')

	let moves = [
		'd7d8=b', 'e7e8=n', 'f7f8=r', 'g7g8=q',
		'd2d1=b', 'e2e1=n', 'f2f1=r', 'g2g1=q'
	]

	let legal = true

	moves.forEach(move => {
		if (!game.legal(move)) {
			legal = false
			console.log(move, 'illegal')
		}
		else {
			game.play(move)
		}
	})

	// bug? no, king is in check
	let board = [
		'R', 'q', 'B', '_', 'K', 'B', '_', 'R', 
		'P', '_', '_', '_', 'P', 'P', 'P', '_',
		'N', '_', '_', '_', '_', 'n', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'p', 'p', 'p', 'p', '_', 'p', 'P', 'p',
		'r', '_', 'b', 'q', 'k', 'b', '_', '_'
	]

	game.load(board, "black", 'd5f6')

	if (game.legal('g2g1')) {
		console.log('g2g1')
		return false
	}

	if (!legal) {
		return false
	}

	// game.printBoard()
	return true
}

module.exports = {
	testPromotion
}