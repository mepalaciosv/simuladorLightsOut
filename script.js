const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gridSize = 5; // Default grid size

let lights = [];
let savedLights = [];
let exploreGrid = false;

function getCssVariable(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function resizeCanvas() {
  const size = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  canvas.width = size;
  canvas.height = size;
}

function draw() {
  resizeCanvas();
  const lightSize = canvas.width / gridSize;
  const lightOnColor = getCssVariable('--light-on-color');
  const lightOffColor = getCssVariable('--light-off-color');
  const lightBorderColor = getCssVariable('--light-border-color');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.fillStyle = lights[i][j] ? lightOnColor : lightOffColor;
            ctx.fillRect(j * lightSize, i * lightSize, lightSize, lightSize);
            ctx.strokeStyle = lightBorderColor;
            ctx.strokeRect(j * lightSize, i * lightSize, lightSize, lightSize);
        }
    }
}

function initLights() {
  lights = Array.from({ length: gridSize }, () => 
      Array.from({ length: gridSize }, () => Math.random() > 0.5));
}

function newGame(size = 5) {
  gridSize = size;
  exploreGrid = false;
  initLights();
  draw();
  saveState();
}

function checkWin() {
  const allOff = lights.every(row => row.every(light => !light));
  if (allOff && !exploreGrid) {
    if(confirm("Congratulations! You've won!")) {
      newGame(gridSize);
    }
  }
}

canvas.addEventListener('click', function(event) {
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
    draw();
    checkWin();
});

function toggleLight(i, j) {
    if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
        lights[i][j] = !lights[i][j];
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
      ctx.fillStyle = lights[i][j] ? `rgba(255, 255, 0, ${progress})` : `rgba(0, 0, 0, ${1 - progress})`;
      ctx.fillRect(j * lightSize, i * lightSize, lightSize, lightSize);
      ctx.strokeStyle = getCssVariable('--light-border-color');
      ctx.strokeRect(j * lightSize, i * lightSize, lightSize, lightSize);

      if (count >= frames) {
          clearInterval(toggleInterval);
          draw();
      }
  }, interval);
}

function saveState() {
    savedLights = lights.map(row => [...row]);
}


function restoreState() {
    if (savedLights.length > 0) {
        lights = savedLights.map(row => [...row]);
        draw();
    }
}

function clearGrid () {
    lights = Array.from({ length: gridSize }, () => Array.from({ length: gridSize }, () => false));
    exploreGrid = true;
    draw();

}
window.addEventListener('resize', draw);

document.getElementById('changeSizeBtn').addEventListener('click', function() {
  const newSize = parseInt(document.getElementById('gridSizeInput').value);
  if (newSize && newSize >= 2 && newSize <= 12) {
      newGame(newSize);
  } else {
      alert('Please enter a valid size (between 2 and 12).');
  }
});

newGame();



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
