const { Chess } = require('../Chess')

const testCheckmate = () => {
	console.log("testing checkmate")

	let game = new Chess()
	
	// queen h5 mate
	let moves = [
		'e2e4', 'g7g5',
		'd2d4', 'f7f5',		
		'd1h5'
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

	console.log('testing xQc vs. moistcr1tikal, 2020')
	game = new Chess()
	moves = [
		'e2e4', 'e7e5',
		'g1f3', 'b8c6',
		'd2d4', 'e5d4',
		'f3d4', 'f8c5',
		'c2c3', 'd8f6',
		'd4c6', 'f6f2'
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

	// why can king capture defended queen?
	//console.log(game.legal('f6f2'))

	if (!game.checkmate) {
		return false
	}

	return true
}

module.exports = {
	testCheckmate
}