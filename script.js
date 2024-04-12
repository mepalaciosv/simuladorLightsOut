class App {
  constructor(elemento, dimension) {
    this.arreglo = this.inicializarArreglo(dimension);
    this.dimension = dimension;
    this.elemento = elemento;
    this.alternar = this.alternar.bind(this);
    this.elemento.addEventListener('click', this.alternar);
    this.reiniciarTablero = this.reiniciarTablero.bind(this);
    this.nuevoJuego = this.nuevoJuego.bind(this);
    this.guardarEstado = this.guardarEstado.bind(this);

    // Initialize the state stack
    this.stateStack = [];

    // Creamos dinámicamente los elementos div para el arreglo
    for (let fila = 0; fila < dimension; fila++) {
      for (let col = 0; col < dimension; col++) {
        let div = document.createElement('div');
        div.style.width = (250 / dimension) + 'px';
        div.style.height = (250 / dimension) + 'px';
        div.dataset.location = JSON.stringify({fila, col});
        elemento.appendChild(div);
      }
    }

    // Agregamos los event listeners para los botones
    document.getElementById('new-game-btn').addEventListener('click', this.nuevoJuego);
    document.getElementById('save-state-btn').addEventListener('click', this.guardarEstado);
    document.getElementById('reset-game-btn').addEventListener('click', this.reiniciarTablero);
  }

  // Método para renderizar el arreglo
  renderizar(fila, col, retardo) {
    let div = this.elemento.children[fila * this.dimension + col];
    div.className = this.arreglo[fila][col] ? ('flip' + (retardo ? ' flip-delay':'')): '';
  }

  // Método para inicializar el arreglo
  inicializarArreglo(size) {
    const rejilla = Array(size);
    for (let i = 0; i < rejilla.length; i++) {
      rejilla[i] = Array(size).fill(false);
    }
    return rejilla;
  }

  // Método para alternar las luces y actualizar el arreglo
  alternar(evento) {
    const jsonPosicion = evento.target.dataset.location;
    if(!jsonPosicion) {
      return;
    }

    const posicion = JSON.parse(jsonPosicion);
    const i = posicion.fila;
    const j = posicion.col;
    this.arreglo[i][j] = !this.arreglo[i][j];
    this.renderizar(i, j, false);
    const direcciones = [[1,0], [-1,0], [0,1], [0,-1]];
    for (const dir of direcciones) {
      let ni = i + dir[0];
      let nj = j + dir[1];
      if (ni >= 0 && ni < this.dimension && nj >= 0 && nj < this.dimension) {
        this.arreglo[ni][nj] = !this.arreglo[ni][nj];
        this.renderizar(ni, nj, true);
      }
    }

    // Verificamos que todas las luces del arreglo estén apagadas
    if (this.arreglo.every((fila) => fila.every((casilla) => casilla === false))) {
      alert("¡Felicidades! ¡Has ganado!");
      this.reiniciarTablero();
    }
  }

  // Método para reiniciar el juego
  reiniciarTablero() {
    // Restore the board to the saved state
    this.arreglo = this.stateStack.length > 0 ? this.stateStack.pop() : this.inicializarArreglo(this.dimension);
    for (let fila = 0; fila < this.dimension; fila++) {
      for (let col = 0; col < this.dimension; col++) {
        this.renderizar(fila, col, false);
      }
    }
  }

  // Método para guardar el estado actual del tablero
  guardarEstado() {
    // Deep copy the current state of the board and push it onto the state stack
    const currentState = JSON.parse(JSON.stringify(this.arreglo));
    this.stateStack.push(currentState);
  }

  nuevoJuego() {
    this.reiniciarTablero();
    // Simulamos un nuevo juego eligiendo casillas aleatorias para presionar
    const numPresses = Math.floor(Math.random() * (this.dimension * this.dimension));
    for (let i = 0; i < numPresses; i++) {
      const randomRow = Math.floor(Math.random() * this.dimension);
      const randomCol = Math.floor(Math.random() * this.dimension);
      this.arreglo[randomRow][randomCol] = !this.arreglo[randomRow][randomCol];
      this.renderizar(randomRow, randomCol, false);
      const direcciones = [[1,0], [-1,0], [0,1], [0,-1]];
      for (const dir of direcciones) {
        let ni = randomRow + dir[0];
        let nj = randomCol + dir[1];
        if (ni >= 0 && ni < this.dimension && nj >= 0 && nj < this.dimension) {
          this.arreglo[ni][nj] = !this.arreglo[ni][nj];
          this.renderizar(ni, nj, true);
        }
      }
    }
  }

}

// Mandamos una alerta al usuario solicitándole un tamaño del
// arreglo y creamos una nueva instancia de la aplicación
let usuario = prompt("¿De qué tamaño quieres el tablero?");
let size = parseInt(usuario);
new App(document.querySelector('#container'), size);
