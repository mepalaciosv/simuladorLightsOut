// Graphic variables for the canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Global state variables
let gridSize = 5; // Default grid size
let lightsBoard = []; // Current state of the board
let savedBoardState = []; // Saved state of the board
let exploreGrid = false; // Mode for exploring the game's rules

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

function initLights() {
  lightsBoard = Array.from({ length: gridSize }, () => 
      Array.from({ length: gridSize }, () => Math.random() > 0.5));
}

function newGame() {
  exploreGrid = false;
  initLights();
  drawBoard();
  saveState();
}

function checkWin() {
  const allOff = lightsBoard.every(row => row.every(light => !light));
  if (allOff && !exploreGrid) {
    if(confirm("Congratulations! You've won!")) {
      newGame();
    }
  }
}

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

function saveState() {
    savedBoardState = lightsBoard.map(row => [...row]);
}


function restoreState() {
    if (savedBoardState.length > 0) {
        lightsBoard = savedBoardState.map(row => [...row]);
        drawBoard();
    }
}

function clearGrid () {
    lightsBoard = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => false));
    exploreGrid = true;
    drawBoard();

}
window.addEventListener('resize', drawBoard);

document.getElementById('changeSizeBtn').addEventListener('click', function() {
  const newSize = parseInt(document.getElementById('gridSizeInput').value);
  if (newSize && newSize >= 2 && newSize <= 12) {
      newGame(newSize);
      gridSize = newSize;
  } else {
      alert('Please enter a valid size (between 2 and 12).');
  }
});

newGame(gridSize);



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
