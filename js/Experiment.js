// repite la camintata "repetitions" veces y guarda las máximas distancias.
class Experiment {
  constructor(dimension, steps, repetitions) {
    if (!Number.isInteger(repetitions) || repetitions < 1) {
      throw new Error("Las repeticiones deben ser un entero >= 1");
    }
    this.dimension = dimension;
    this.steps = steps;
    this.repetitions = repetitions;
    this.maxDistances = [];
    this.elapsedMs = 0;
  }

  run() {
    this.maxDistances = [];
    const walk = new RandomWalk(this.dimension, this.steps);

    const start = performance.now();
    for (let i = 0; i < this.repetitions; i++) {
      this.maxDistances.push(walk.run());
    }
    this.elapsedMs = performance.now() - start;

    return this;
  }

  get average() {
    const sum = this.maxDistances.reduce((acc, d) => acc + d, 0);
    return sum / this.maxDistances.length;
  }
}