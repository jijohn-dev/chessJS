const { Chess } = require('../Chess')

const testCheckmate = () => {
	console.log("testing checkmate")

	const game = new Chess()
	
	// queen h5 mate
	const moves = [
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

	return true
}

module.exports = {
	testCheckmate
}