const LIMITS = {
  dimension:   { min: 1, max: 10 },
  steps:       { min: 1, max: 100000 },
  repetitions: { min: 1, max: 100000 }
};
const MAX_TOTAL_STEPS = 500000000; 

const runBtn = document.getElementById("runBtn");
const errorEl = document.getElementById("error");
const resultCard = document.getElementById("resultCard");

// verificadores
function readInteger(id, label) {
  const value = Number(document.getElementById(id).value);
  const { min, max } = LIMITS[id];

  if (!Number.isInteger(value)) {
    throw new Error(`${label} debe ser un número entero.`);
  }
  if (value < min || value > max) {
    throw new Error(`${label} debe estar entre ${min.toLocaleString()} y ${max.toLocaleString()}.`);
  }
  return value;
}

runBtn.addEventListener("click", () => {
  errorEl.textContent = "";

  try {
    const dimension = readInteger("dimension", "La dimensión");
    const steps = readInteger("steps", "El número de pasos");
    const repetitions = readInteger("repetitions", "Las repeticiones");

    if (steps * repetitions > MAX_TOTAL_STEPS) {
      throw new Error("Pasos × repeticiones es demasiado grande; reduce alguno de los dos.");
    }

    const exp = new Experiment(dimension, steps, repetitions).run();

    document.getElementById("avgOut").textContent = exp.average.toFixed(4);
    document.getElementById("timeOut").textContent = exp.elapsedMs.toFixed(2) + " ms";
    document.getElementById("distancesOut").textContent =
      exp.maxDistances.map(d => d.toFixed(4)).join(", ");
    resultCard.hidden = false;
  } catch (e) {
    errorEl.textContent = e.message;
    resultCard.hidden = true;
  }
});

// tabla
const batchBtn = document.getElementById("batchBtn");
const progressEl = document.getElementById("progress");
const batchResults = document.getElementById("batchResults");
let batch = null;

batchBtn.addEventListener("click", async () => {
  batchBtn.disabled = true;
  batchResults.hidden = true;
  batch = new BatchRunner();

  await batch.run((done, total) => {
    progressEl.textContent = `Ejecutando combinación ${done} de ${total}...`;
  });

  // llenado tabla
  const tbody = document.querySelector("#resultsTable tbody");
  tbody.innerHTML = "";
  for (const e of batch.experiments) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.dimension}</td>
      <td>${e.steps.toLocaleString()}</td>
      <td>${e.repetitions.toLocaleString()}</td>
      <td>${e.average.toFixed(4)}</td>
      <td>${(e.average / Math.sqrt(e.steps)).toFixed(4)}</td>
      <td>${e.elapsedMs.toFixed(2)}</td>`;
    tbody.appendChild(row);
  }

  progressEl.textContent = "Listo !!";
  batchResults.hidden = false;
  batchBtn.disabled = false;
});

//descargar csv
function downloadCSV(filename, content) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById("downloadSummaryBtn").addEventListener("click", () => {
  downloadCSV("tabla_resultados.csv", batch.toSummaryCSV());
});
document.getElementById("downloadDetailBtn").addEventListener("click", () => {
  downloadCSV("distancias_maximas.csv", batch.toDetailCSV());
});