let model;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Fondo negro inicial
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Parámetros del trazo
ctx.lineWidth = 20;
ctx.lineCap = "round";
ctx.strokeStyle = "white";

let dibujando = false;

canvas.addEventListener("mousedown", e => {
  dibujando = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", e => {
  if (!dibujando) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
  dibujando = false;
});

// Botón Limpiar
document.getElementById("limpiar").onclick = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.getElementById("resultado").innerText = "";
};

// Botón Predecir
document.getElementById("predecir").onclick = async () => {
  if (!model) {
    alert("⚠️ El modelo aún no está cargado.");
    return;
  }

  // Convertir el dibujo a tensor 28x28
  const img = tf.browser.fromPixels(canvas, 1)
    .resizeNearestNeighbor([28, 28])
    .mean(2)
    .toFloat()
    .expandDims(0)
    .expandDims(-1)
    .div(255.0);

  const pred = model.predict(img);
  const clase = pred.argMax(1).dataSync()[0];

  document.getElementById("resultado").innerText = `🔢 Predicción: ${clase}`;
};

// Cargar modelo al inicio
async function cargarModelo() {
  try {
    console.log("Cargando modelo...");
    model = await tf.loadLayersModel("model/model.json");
    console.log("✅ Modelo cargado correctamente.");
  } catch (err) {
    console.error("❌ Error al cargar modelo:", err);
  }
}

cargarModelo();
