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

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // reset button
    reset = document.getElementById('resetButton');
    reset.addEventListener('click', resetGame);

    // undo button
    undo = document.getElementById('undoButton');
    undo.addEventListener('click', undoMove);

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

    canvas.addEventListener('mousemove', handleMouseMove);    
}