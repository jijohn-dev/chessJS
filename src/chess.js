import { state } from './gameState'
import { socket } from './connection'
import { handleMouseDown, handleMouseUp, handleMouseMove } from './userInput'
import { 
    initializePieces, 
    saveState, 
    drawBoard,
    drawPieces
} from './util'
import { checkmate } from './legalMove'

var qs = require('qs')

// message elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $messages = document.querySelector('#messages')

const query = qs.parse(location.search, { ignoreQueryPrefix: true })

// join game
if (query.gameId) {    
    const { username, gameId } = query
    socket.emit('join', { username, gameId }, (error) => {
        if (error) {
            alert(error)
            location.href = '/'
        }
    })
}
else {
    // create game
    state.color = query.color;
    let color = state.color
    const username = query.username;
    socket.emit('create', { username, color}, error => {
        if (error) {
            alert(error);
            location.href = '/';
        }
    })
}

// get game ID from server
socket.on('created', gameId => {
    const html = `<p>Game ID: ${gameId}</p>`;
    $messages.insertAdjacentHTML('beforeend', html);

    // initialize game
    startGame();
})

socket.on('joined', gameInfo => {
    const html = `<p>Game ID: ${gameInfo.id}</p>`;
    $messages.insertAdjacentHTML('beforeend', html);
    state.color = gameInfo.color;
    console.log(state.color);

    // initialize game
    startGame();
})

// display message in chat 
socket.on('message', message => {
    console.log(message);
    const html = `<p>${message}</p>`;
    $messages.insertAdjacentHTML('beforeend', html);
})

// message event handler
$messageForm.addEventListener('submit', e => {
    e.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, error => {
        $messageFormButton.removeAttribute('disabled');
		$messageFormInput.value = '';
		$messageFormInput.focus();

		if (error) {
			return console.log(error);
		}

    })
})

// initialize game
initializePieces();
saveState();

function startGame() {
    state.canvas = document.getElementById('gameCanvas');
    state.ctx = state.canvas.getContext('2d');

    // draw
    drawBoard();    

    // load spritesheet
    state.sprites = new Image();
    state.sprites.src = 'assets/spritesheet.png';
    state.sprites.onload = () => {
        drawPieces();
    }     

    // mouse down
    state.canvas.addEventListener('mousedown', handleMouseDown);

    // right click
    state.canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
    })

    // mouse up
    state.canvas.addEventListener('mouseup', handleMouseUp);
    
    // mouse move
    state.canvas.addEventListener('mousemove', handleMouseMove);
}

// listen for moves from the server
socket.on('move', update => {
    console.log(`${update.notation} received from server`)
    // update pieces array
    state.pieces = update.pieces
    state.toMove = update.toMove    
    saveState()    
    drawBoard()
    drawPieces()
    // detect checkmate
    const king = state.pieces.find(p => p.name === "king" && p.color === state.color)
    if (checkmate(state.pieces, king)) {
        alert("checkmate")        
    }
})

// handle illegal move message from server
socket.on('illegalMove', update => {
    alert(`Illegal move: ${update.notation}`)
})