// message elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $messages = document.querySelector('#messages');

// assign color
let color;

// socket 
const socket = io();

const query = Qs.parse(location.search, { ignoreQueryPrefix: true });

// join game
if (query.gameId) {    
    const { username, gameId } = query;
    socket.emit('join', { username, gameId }, (error) => {
        if (error) {
            alert(error);
            location.href = '/';
        }
    })
}
else {
    // create game
    color = query.color;
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
    color = gameInfo.color;
    console.log(color);

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

// chess game and graphics
let canvas;
let ctx;

const lightColor = 'beige';
const darkColor = 'darkolivegreen';

const size = 100;

// pieces array
let pieces = [];
initializePieces();

// game state
let history = [];
saveState();
let toMove = "white";

// click and drag logic    
let selected = false;
let pieceIdx;

let lastX = 0;
let lastY = 0;

function startGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // draw
    drawBoard();    

    // load spritesheet
    sprites = new Image();
    sprites.src = 'assets/spritesheet.png';
    sprites.onload = () => {
        drawPieces();
    }     

    // mouse down
    canvas.addEventListener('mousedown', handleMouseDown);

    // right click
    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
    })

    // mouse up
    canvas.addEventListener('mouseup', handleMouseUp);
    
    // mouse move
    canvas.addEventListener('mousemove', handleMouseMove);
}

// listen for moves from the server
socket.on('move', update => {
    console.log(`${update.notation} received from server`);
    // update pieces array
    pieces = update.pieces;
    toMove = update.toMove;
    saveState();    
    drawBoard();
    drawPieces();
    // detect checkmate
    const king = pieces.find(p => p.name === "king" && p.color === color)
    if (checkmate(pieces, king)) {
        alert("checkmate")
    }
})

// handle illegal move message from server
socket.on('illegalMove', update => {
    alert(`Illegal move: ${update.notation}`)
})