const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const { v4: uuidv4 } = require('uuid')

require('../public/js/legalMove')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

// Setup static dirctory to serve
app.use(express.static(publicDirectoryPath))

// store users
const users = []

// store game states
const games = []

io.on('connection', (socket) => {
	console.log('New Websocket connection')
	
	// create new game
	socket.on('create', options => {
		const { error, user } = createGame({ id: socket.id, ...options })

		if (error) {
			return callback(error)
		}

		socket.emit('created', user.room)
		socket.emit('message', `Playing as the ${options.color} pieces`)
		socket.emit('message', `Wating for opponent...`)
		
		socket.join(user.room)
	})

	// join existing game
	socket.on('join', (options, callback) => {
		const { error, user } = joinGame({ id: socket.id, ...options })
		
		if (error) {
			return callback(error)
		}

		// send user joined message
		io.to(user.room).emit('message', `${user.username} has joined`)

		// send game ID to client
		socket.emit('joined', { ...user })
		socket.emit('message', `Joined ${user.opponent}`)
		socket.emit('message', `Playing as the ${user.color} pieces`)

		socket.join(user.room)
	})

	// move
	socket.on('move', update => {
		console.log(`move received: ${update.notation}`)		

		// validate move
		// if (!legalMove(update.notation)) {
		// 	console.log('illegal move')
		// 	socket.emit('illegalMove', update)
		// }
		// else {
		// 	// send move to room
		// 	const user = getUser(socket.id)		
		// 	io.to(user.room).emit('move', update)
		// }	

		const user = getUser(socket.id)		
		io.to(user.room).emit('move', update)
	})

	// chat messages
	socket.on('sendMessage', (msg, callback) => {
		const user = getUser(socket.id)
		io.to(user.room).emit('message', `${user.username}: ` + msg)
		callback('Delivered')
	})
})

server.listen(port, () => {
	console.log('Server started on port ' + port)
})


const createGame = ({ id, username, color }) => {
	username = username.trim().toLowerCase()
	// generate game ID
	const gameId = uuidv4()

	const user = { id, username, room: gameId }
	users.push(user)

	// create server game state
	let game = {
		id: user.room,
		white: undefined,
		black: undefined,
		pieces: [],
		status: 'active'
	}
	if (color === 'white') {
		game.white = username
	}
	if (color === 'black') {
		game.black = username
	}
	games.push(game)

	return { user }
}

const joinGame = ({ id, username, gameId }) => {
	username = username.trim().toLowerCase()
	const room = gameId
	let color
	let opponent

	let gameFound = false

	games.forEach(game => {
		if (game.id === gameId) {
			gameFound = true
			if (game.white) {
				game.black = username
				color = "black"
				opponent = game.white
			}
			else {
				game.white = username
				color = "white"
				opponent = game.black
			}
			console.log(game);
		}
	})

	if (!gameFound) {
		const error = "Game not found"
		return { error };
	}

	const user = { id, username, room, color, opponent }	
	users.push(user)
	return { user }
}

const getUser = id => {
	return users.find(user => user.id === id)
}