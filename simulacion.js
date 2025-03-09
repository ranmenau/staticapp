let canvas, ctx;
let v0, angle, g, t;
let startX, startY;
let x, y;
let vx, vy;
let scaleFactor = 10;
let hit = false;
let failed = false;

// Variables para la animación de los triángulos
let pulseFactor = 0;
let pulseDirection = 1;

// Imagen de fondo
let backgroundImg = new Image();
backgroundImg.src = "fondo.jpg"; // Asegúrate de que el archivo está en la misma carpeta

let targetImg = new Image();
targetImg.src = "turtle.png";


function iniciarSimulacion() {
    v0 = parseFloat(document.getElementById("velocidad").value);
    angle = parseFloat(document.getElementById("angulo").value);
    
    if (isNaN(v0) || isNaN(angle) || angle < 0 || angle > 90 || v0 <= 0) {
        alert("Ingrese valores válidos: velocidad > 0 y ángulo entre 0° y 90°");
        return;
    }
    
    g = 9.81;
    vx = v0 * Math.cos(angle * Math.PI / 180) * scaleFactor;
    vy = -v0 * Math.sin(angle * Math.PI / 180) * scaleFactor;
    startX = 50;
    startY = canvas.height - 50;
    x = startX;
    y = startY;
    t = 0;
    hit = false;
    failed = false;
    requestAnimationFrame(draw);
}

function setupCanvas() {
    canvas = document.getElementById("canvas");
    canvas.width = 1519;
    canvas.height = 560;
    ctx = canvas.getContext("2d");

    backgroundImg.onload = () => {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    };
    nuevoJuego();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar imagen de fondo
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // Dibujar suelo
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    if (!hit && !failed) {
        x = startX + vx * t;
        y = startY + vy * t + 0.5 * g * t * t * scaleFactor;
    }

    // Dibujar proyectil
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Dibujar objetivos con animación de palpitación
    ctx.fillStyle = "green";
    targets.forEach(target => drawTarget(target.x, target.y, target.size));

    // Verificar colisiones
    targets.forEach(target => {
        if (!hit && checkTriangleCollision(x, y, target.x, target.y, target.size)) {
            hit = true;
        }
    });
    
    if (hit) {
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("¡Impacto en el objetivo!", canvas.width / 2 - 100, canvas.height / 2);
    }

    if (y >= canvas.height - 20 && !hit) {
        failed = true;
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText("Fallo", canvas.width / 2 - 20, canvas.height / 2);
    }

    if (!hit && !failed) {
        t += 1 / 60;
        requestAnimationFrame(draw);
    }

    mostrarDatos();
}

// **Función optimizada para hacer que los triángulos palpiten suavemente**
function drawTriangle(px, py, size) {
    let pulsatingSize = size + Math.sin(Date.now() * 0.005) * 5; // Hace que el triángulo palpite suavemente
    ctx.beginPath();
    ctx.moveTo(px, py - pulsatingSize);
    ctx.lineTo(px - pulsatingSize / 2, py);
    ctx.lineTo(px + pulsatingSize / 2, py);
    ctx.closePath();
    ctx.fill();
}

function drawTarget(px, py, size) {
    let pulsatingSize = size + Math.sin(Date.now() * 0.005) * 5; // Efecto de palpitación
    ctx.drawImage(targetImg, px - pulsatingSize / 2, py - pulsatingSize, pulsatingSize, pulsatingSize);
}

// **Corrección en la lógica de colisión**
function checkTriangleCollision(px, py, tx, ty, size) {
    let leftX = tx - size / 2;
    let rightX = tx + size / 2;
    let topY = ty - size;
    return px > leftX && px < rightX && py > topY && py < ty;
}

function checkTargetCollision(px, py, tx, ty, size) {
    return px > tx - size / 2 && px < tx + size / 2 && py > ty - size && py < ty;
}

// **Actualiza la información de posición y velocidad**
function mostrarDatos() {
    document.getElementById("info").innerHTML = `
        Tiempo: ${t.toFixed(2)} s <br>
        Posición X: ${(x - startX) / scaleFactor} m <br>
        Posición Y: ${(startY - y) / scaleFactor} m <br>
        Velocidad X: ${(vx / scaleFactor).toFixed(2)} m/s <br>
        Velocidad Y: ${(vy / scaleFactor + g * t).toFixed(2)} m/s <br>
    `;
}

function nuevoJuego() {
    // Mover los objetivos a nuevas posiciones aleatorias
    targets = [
        { x: Math.random() * (canvas.width - 200) + 100, y: Math.random() * (canvas.height / 2) + 100, size: 50 },
        { x: Math.random() * (canvas.width - 200) + 100, y: Math.random() * (canvas.height / 2) + 100, size: 50 }
    ];

    // Redibujar la pantalla con los nuevos objetivos
    draw();
}


window.onload = setupCanvas;
