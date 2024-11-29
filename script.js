// Mengambil elemen canvas dan mendapatkan konteks 2D untuk menggambar
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ukuran canvas
canvas.width = 480;
canvas.height = 320;

// Mendefinisikan elemen-elemen game
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Bricks
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];

// Skor
let score = 0;
let gameOver = false;

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Mengatur kontrol untuk paddle
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// Fungsi untuk menggambar bola
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Fungsi untuk menggambar paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

// Fungsi untuk menggambar brick
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Fungsi untuk mendeteksi tabrakan bola dengan brick
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("Selamat! Anda menang!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Fungsi untuk menggambar skor
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Skor: " + score, 8, 20);
}

// Fungsi untuk menggambar seluruh elemen game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Menghapus gambar sebelumnya
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    // Gerakan bola
    x += dx;
    y += dy;

    // Tabrakan dengan dinding
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            gameOver = true;
            gameOverHandler();
        }
    }

    // Gerakan paddle
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    if (!gameOver) {
        requestAnimationFrame(draw); // Memanggil fungsi draw berulang kali
    }
}

// Fungsi ketika game over
function gameOverHandler() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "#FF0000";
    ctx.fillText("Game Over!", canvas.width / 2 - 90, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Skor: " + score, canvas.width / 2 - 50, canvas.height / 2 + 40);

    // Menampilkan tombol untuk main lagi
    const restartButton = document.getElementById("restartButton");
    restartButton.style.display = "block"; // Tampilkan tombol
    restartButton.addEventListener("click", restartGame); // Pastikan event listener ditambahkan
}

// Fungsi untuk restart game
function restartGame() {
    gameOver = false;
    score = 0;
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;
    resetBricks();
    document.getElementById("restartButton").style.display = "none"; // Sembunyikan tombol setelah klik
    draw(); // Mulai game kembali
}

// Fungsi untuk mereset kondisi brick
function resetBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1; // Mengatur ulang semua brick ke status aktif
        }
    }
}

draw(); // Memulai game




