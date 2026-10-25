
 // ejecuta un experimento por cada combinación 
class BatchRunner {
  constructor(
    dimensions = [1, 2],
    stepsList = [100, 1000, 10000],
    repsList = [100, 1000, 10000]
  ) {
    this.dimensions = dimensions;
    this.stepsList = stepsList;
    this.repsList = repsList;
    this.experiments = [];
  }

  get totalCombinations() {
    return this.dimensions.length * this.stepsList.length * this.repsList.length;
  }

  async run(onProgress) {
    this.experiments = [];
    let done = 0;

    for (const d of this.dimensions) {
      for (const s of this.stepsList) {
        for (const r of this.repsList) {
          this.experiments.push(new Experiment(d, s, r).run());
          done++;
          if (onProgress) onProgress(done, this.totalCombinations);
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }
    }
    return this.experiments;
  }

// tabla resumen
  toSummaryCSV() {
    const rows = ["dimension,pasos,repeticiones,promedio_distancia_maxima,promedio_entre_raiz_pasos,tiempo_ms"];
    for (const e of this.experiments) {
      rows.push([
        e.dimension,
        e.steps,
        e.repetitions,
        e.average.toFixed(4),
        (e.average / Math.sqrt(e.steps)).toFixed(4),
        e.elapsedMs.toFixed(2)
      ].join(","));
    }
    return rows.join("\n");
  }

  
  toDetailCSV() {
    const rows = ["dimension,pasos,repeticiones,caminata,distancia_maxima"];
    for (const e of this.experiments) {
      e.maxDistances.forEach((dist, i) => {
        rows.push([e.dimension, e.steps, e.repetitions, i + 1, dist.toFixed(4)].join(","));
      });
    }
    return rows.join("\n");
  }
}