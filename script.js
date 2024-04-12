class App {
  constructor(element, size) {
    this.grid = this.initGrid(size);
    this.size = size;
    this.element = element;
    this.toggle = this.toggle.bind(this);
    this.element.addEventListener('click', this.toggle);
    this.resetGame = this.resetGame.bind(this);
    this.newGame = this.newGame.bind(this);
    this.saveState = this.saveState.bind(this);

    // Initialize the state stack
    this.stateStack = [];

    // We dynamically create div elements for the grid
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        let div = document.createElement('div');
        div.style.width = (250 / size) + 'px';
        div.style.height = (250 / size) + 'px';
        div.dataset.location = JSON.stringify({row, col});
        element.appendChild(div);
      }
    }

    // We add the event listeners for the buttons
    document.getElementById('new-game-btn').addEventListener('click', this.newGame);
    document.getElementById('save-state-btn').addEventListener('click', this.saveState);
    document.getElementById('reset-game-btn').addEventListener('click', this.resetGame);
  }

  // Method to render the array
  render(row, col, delay) {
    let div = this.element.children[row * this.size + col];
    div.className = this.grid[row][col] ? ('flip' + (delay ? ' flip-delay': '')): '';
  }

  // Method to initialize the array
  initGrid(size) {
    const grid = Array(size);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Array(size).fill(false);
    }
    return grid;
  }

  // Method to toggle the lights and update the array
  toggle(event) {
    const locationJSON = event.target.dataset.location;
    if(!locationJSON) {
      return;
    }

    const location = JSON.parse(locationJSON);
    const i = location.fila;
    const j = location.col;
    this.grid[i][j] = !this.grid[i][j];
    this.render(i, j, false);
    const directions = [[1,0], [-1,0], [0,1], [0,-1]];
    for (const dir of directions) {
      let ni = i + dir[0];
      let nj = j + dir[1];
      if (ni >= 0 && ni < this.size && nj >= 0 && nj < this.size) {
        this.grid[ni][nj] = !this.grid[ni][nj];
        this.render(ni, nj, true);
      }
    }

    // We verify all the lights in the grid to be empty
    if (this.grid.every((row) => row.every((cell) => cell === false))) {
      alert("¡Felicidades! ¡Has ganado!");
      this.resetGame();
    }
  }

  // Method to reset the game
  resetGame() {
    // Restore the board to the saved state
    this.grid = this.stateStack.length > 0 ? this.stateStack.pop() : this.initGrid(this.size);
    for (let fila = 0; fila < this.size; fila++) {
      for (let col = 0; col < this.size; col++) {
        this.render(fila, col, false);
      }
    }
  }

  // Method to save the current state of the board
  saveState() {
    // Deep copy the current state of the board and push it onto the state stack
    const currentState = JSON.parse(JSON.stringify(this.grid));
    this.stateStack.push(currentState);
  }

  newGame() {
    this.resetGame();
    // We set up a new game choosing cells at random to click before beggining
    const numPresses = Math.floor(Math.random() * (this.size * this.size));
    for (let i = 0; i < numPresses; i++) {
      const randomRow = Math.floor(Math.random() * this.size);
      const randomCol = Math.floor(Math.random() * this.size);
      this.grid[randomRow][randomCol] = !this.grid[randomRow][randomCol];
      this.render(randomRow, randomCol, false);
      const directions = [[1,0], [-1,0], [0,1], [0,-1]];
      for (const dir of directions) {
        let ni = randomRow + dir[0];
        let nj = randomCol + dir[1];
        if (ni >= 0 && ni < this.size && nj >= 0 && nj < this.size) {
          this.grid[ni][nj] = !this.grid[ni][nj];
          this.render(ni, nj, true);
        }
      }
    }
  }

}

// We alert the user to request a size for the board. After that, we create a
// new instance of the application
let user = prompt("¿De qué tamaño quieres el tablero?");
let size = parseInt(user);
new App(document.querySelector('#container'), size);
