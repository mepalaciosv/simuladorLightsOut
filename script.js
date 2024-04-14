// ---------------------------------------------------------------
// Variables
// ---------------------------------------------------------------

// Graphic variables for the canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Global state variables
let gridSize = 5; // Default grid size
let lightsBoard = []; // Current state of the board
let savedBoardState = []; // Saved state of the board
let exploreGrid = false; // Mode for exploring the game's rules

// ---------------------------------------------------------------
// Functions
// ---------------------------------------------------------------

// Extract information from the CSS
function getCssVariable(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// Set canvas size
function setCanvasSize() {
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.75;
  canvas.width = size;
  canvas.height = size;
}

// Save the current board state in case we need to restart the match
function saveState() {
  savedBoardState = lightsBoard.map(row => [...row]);
}

// Restore the current state to the initial game configuration
function restoreState() {
  if (savedBoardState.length > 0) {
      lightsBoard = savedBoardState.map(row => [...row]);
      drawBoard();
  }
}

// Turn all the lights off to help a new user get used to the game
function clearGrid() {
  lightsBoard = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => false));
  exploreGrid = true;
  drawBoard();
}

// Draw the game board onto the canvas
function drawBoard() {
  setCanvasSize();
  const lightSize = canvas.width / gridSize;
  const lightOnColor = getCssVariable('--light-on-color');
  const lightOffColor = getCssVariable('--light-off-color');
  const lightBorderColor = getCssVariable('--light-border-color');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.fillStyle = lightsBoard[i][j] ? lightOnColor : lightOffColor;
            ctx.fillRect(j * lightSize, i * lightSize, lightSize, lightSize);
            ctx.strokeStyle = lightBorderColor;
            ctx.strokeRect(j * lightSize, i * lightSize, lightSize, lightSize);
        }
    }
}

// Check if all the lights in the board are off
function boardIsClear(board) {
  return board.every((row) => row.every(light => !light));
}

// Determine the configuration of a new winnable board state
function initLights() {
  let gameBoard = Array.from({ length: gridSize }, () => 
      Array.from({ length: gridSize }, () => false));

  while (boardIsClear(gameBoard)) {
    const numPresses = Math.floor(Math.random() * (gridSize * gridSize));
    while (numPresses == 0) {
      numPresses = Math.floor(Math.random() * (gridSize * gridSize));
    }
    for (let i = 0; i < numPresses; i++) {
      const randomRow = Math.floor(Math.random() * gridSize);
      const randomCol = Math.floor(Math.random() * gridSize);
      const directions = [[1,0], [-1,0], [0,1], [0,-1]];
      gameBoard[randomRow][randomCol] = !gameBoard[randomRow][randomCol];
      for (const dir of directions) {
        let ni = randomRow + dir[0];
        let nj = randomCol + dir[1];
        if (ni >= 0 && ni < gridSize && nj >= 0 && nj < gridSize) {
          gameBoard[ni][nj] = !gameBoard[ni][nj];
        }
      }
    }
  }
  lightsBoard = gameBoard;
}

// Set up a new game environment
function newGame() {
  exploreGrid = false;
  initLights();
  drawBoard();
  saveState();
}

// Verify if the game is won
function checkWin() {
  const allOff = boardIsClear(lightsBoard);
  if (allOff && !exploreGrid) {
    if(confirm("¡Felicitaciones! ¡Ganaste!")) {
      newGame();
    }
  }
}

function toggleLight(i, j) {
  if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
      lightsBoard[i][j] = !lightsBoard[i][j];
      animateLightToggle(i, j);
  }
}

function animateLightToggle(i, j) {
  const frames = 10;
  const interval = 10;
  const lightSize = canvas.width / gridSize;
  let count = 0;

  const toggleInterval = setInterval(() => {
      count++;
      let progress = count / frames;
      ctx.fillStyle = lightsBoard[i][j] ? `rgba(255, 255, 0, ${progress})` : `rgba(0, 0, 0, ${1 - progress})`;
      ctx.fillRect(j * lightSize, i * lightSize, lightSize, lightSize);
      ctx.strokeStyle = getCssVariable('--light-border-color');
      ctx.strokeRect(j * lightSize, i * lightSize, lightSize, lightSize);

      if (count >= frames) {
          clearInterval(toggleInterval);
          drawBoard();
      }
  }, interval);
}

// ---------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const lightSize = canvas.width / gridSize; // Use dynamically calculated light size
  const j = Math.floor(x / lightSize);
  const i = Math.floor(y / lightSize);
  toggleLight(i, j);
  toggleLight(i + 1, j);
  toggleLight(i - 1, j);
  toggleLight(i, j + 1);
  toggleLight(i, j - 1);
  drawBoard();
  checkWin();
});

window.addEventListener('resize', drawBoard);

document.getElementById('changeSizeBtn').addEventListener('click', function() {
  const newSize = parseInt(document.getElementById('gridSizeInput').value);
  if (newSize && newSize >= 2 && newSize <= 12) {
    if (newSize != gridSize) {
      gridSize = newSize;
      newGame();
    }
  } else {
      alert('Please enter a valid size (between 2 and 12).');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const themeToggleButton = document.getElementById('themeToggleBtn');
  const body = document.body;

  themeToggleButton.addEventListener('click', () => {
      const currentTheme = body.getAttribute('data-theme');
      if (currentTheme === 'dark') {
          body.setAttribute('data-theme', 'light');
      } else {
          body.setAttribute('data-theme', 'dark');
      }
  });
});

// ---------------------------------------------------------------
// Actual game logic
// ---------------------------------------------------------------

newGame();

