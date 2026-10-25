// una caminata aleatoria, movimiento borniano discreto
class RandomWalk {
  constructor(dimension, steps) {
    if (!Number.isInteger(dimension) || dimension < 1) {
      throw new Error("La dimensión debe ser un entero >= 1");
    }
    if (!Number.isInteger(steps) || steps < 1) {
      throw new Error("El número de pasos debe ser un entero >= 1");
    }
    this.dimension = dimension;
    this.steps = steps;
  }

  // ejecuta caminata y regresa distancia euclidiana máxima
  run() {
    const position = new Array(this.dimension).fill(0);
    let sumSquares = 0; 
    let maxSumSquares = 0;

    for (let i = 0; i < this.steps; i++) {
      const axis = Math.floor(Math.random() * this.dimension);
      const delta = Math.random() < 0.5 ? -1 : 1;

      sumSquares += 2 * position[axis] * delta + 1; 
      position[axis] += delta;

      if (sumSquares > maxSumSquares) {
        maxSumSquares = sumSquares;
      }
    }
    return Math.sqrt(maxSumSquares);
  }
}