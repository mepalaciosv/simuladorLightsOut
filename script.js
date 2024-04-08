class App {
  constructor(elemento, dimension) {
    this.arreglo = this.inicializarArreglo(dimension);
    this.dimension = dimension;
    this.elemento = elemento;
    this.alternar = this.alternar.bind(this);
    this.elemento.addEventListener('click', this.alternar);

    for (let fila = 0; fila < dimension; fila++) {
      for (let col = 0; col < dimension; col++) {
        let div = document.createElement('div');
        div.style.width = (250 / dimension) + 'px';
        div.style.height = (250 / dimension) + 'px';
        div.dataset.location = JSON.stringify({fila, col});
        elemento.appendChild(div);
      }
    }
  }

  renderizar(fila, col, retardo) {
    let div = this.elemento.children[fila * this.dimension + col];
    div.className = this.arreglo[fila][col] ? ('flip' + (retardo ? ' flip-delay':'')): '';
  }

  inicializarArreglo(size) {
    const rejilla = Array(size);
    for (let i = 0; i < rejilla.length; i++) {
      rejilla[i] = Array(size).fill(false); // [false, false, false, false, false];
    }
    return rejilla;
  }

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
  }
}

let usuario = prompt("¿De qué tamaño quieres el tablero?");
let size = parseInt(usuario);
new App(document.querySelector('#container'), size);
