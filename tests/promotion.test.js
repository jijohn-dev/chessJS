const { Chess } = require('../Chess')
const { legalMove } = require('../move')

const testPromotion = () => {
	console.log("testing promotion")

	const game = new Chess()

	const promotionBoard = [
		'_', '_', '_', '_', '_', '_', '_', '_', 
		'_', 'K', '_', 'p', 'p', 'p', 'p', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', '_', '_', '_', '_',
		'_', '_', '_', '_', 'k', '_', '_', '_',
		'_', '_', '_', 'P', 'P', 'P', 'P', '_',
		'_', '_', '_', '_', '_', '_', '_', '_'
	]
	
	game.load(promotionBoard, "white")

	const moves = [
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

	if (!legal) {
		return false
	}

	// game.printBoard()
	return true
}

module.exports = {
	testPromotion
}