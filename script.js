// Seleciona elementos do jogo
const playerPaddle = document.getElementById('playerPaddle');
const opponentPaddle = document.getElementById('opponentPaddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const gameArea = document.getElementById('gameArea');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

// Variáveis de controle do jogador
let paddleSpeed = 6;
let playerPaddleY = parseInt(window.getComputedStyle(playerPaddle).getPropertyValue("top"));
let opponentPaddleY = parseInt(window.getComputedStyle(opponentPaddle).getPropertyValue("top"));
let playerScore = 0;
let movingUp = false;
let movingDown = false;

// Variáveis de controle da bola
let ballX = 290;
let ballY = 190;
let ballSpeedX = 4;
let ballSpeedY = 4;

// Variável de dificuldade da IA
let aiSpeed = 4;

// Flag para pausar o jogo
let gamePaused = true;

// Função para iniciar o jogo
startButton.addEventListener('click', function() {
  startScreen.style.display = 'none';  // Esconde a tela de início
  gameArea.style.display = 'block';    // Mostra o campo de jogo
  gamePaused = false;                  // Despausa o jogo
  moveBall();                          // Inicia a bola
  movePlayer();                        // Inicia o movimento do jogador
});

// Função para mover a raquete do jogador de forma fluida
document.addEventListener('keydown', function(e) {
  if (gamePaused) return;  // Não faz nada se o jogo estiver pausado

  if (e.key === "ArrowUp") {
    movingUp = true;
  } else if (e.key === "ArrowDown") {
    movingDown = true;
  }
});

document.addEventListener('keyup', function(e) {
  if (e.key === "ArrowUp") {
    movingUp = false;
  } else if (e.key === "ArrowDown") {
    movingDown = false;
  }
});

function movePlayer() {
  if (movingUp) {
    playerPaddleY -= paddleSpeed;
    if (playerPaddleY < 0) playerPaddleY = 0;  // Limite superior
  } else if (movingDown) {
    playerPaddleY += paddleSpeed;
    if (playerPaddleY > gameArea.clientHeight - playerPaddle.clientHeight) {
      playerPaddleY = gameArea.clientHeight - playerPaddle.clientHeight;  // Limite inferior
    }
  }

  playerPaddle.style.top = playerPaddleY + 'px';

  // Continuar chamando a função de movimento
  requestAnimationFrame(movePlayer);
}

// Função para mover a raquete do oponente (IA)
function moveOpponentPaddle() {
  let paddleCenter = opponentPaddleY + opponentPaddle.clientHeight / 2;

  if (paddleCenter < ballY) {
    opponentPaddleY += aiSpeed;
  } else if (paddleCenter > ballY) {
    opponentPaddleY -= aiSpeed;
  }

  // Limita o movimento da raquete da IA ao campo de jogo
  if (opponentPaddleY < 0) {
    opponentPaddleY = 0;
  } else if (opponentPaddleY > gameArea.clientHeight - opponentPaddle.clientHeight) {
    opponentPaddleY = gameArea.clientHeight - opponentPaddle.clientHeight;
  }

  opponentPaddle.style.top = opponentPaddleY + 'px';
}

// Função para movimentar a bola
function moveBall() {
  if (gamePaused) return;  // Não move a bola se o jogo estiver pausado

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Verifica colisão com as bordas superior e inferior
  if (ballY <= 0 || ballY >= gameArea.clientHeight - ball.clientHeight) {
    ballSpeedY *= -1;  // Inverte a direção da bola
  }

  // Verifica colisão com as bordas laterais (fim de jogo)
  if (ballX <= 0 || ballX >= gameArea.clientWidth - ball.clientWidth) {
    ballSpeedX *= -1;  // Inverte a direção da bola
  }

  // Detecta colisão com a raquete do Player 1
  if (ballX <= playerPaddle.clientWidth && ballY + ball.clientHeight >= playerPaddleY && ballY <= playerPaddleY + playerPaddle.clientHeight) {
    ballSpeedX *= -1;  // Inverte a direção horizontal da bola
    playerScore++;  // Aumenta a pontuação
    scoreDisplay.innerHTML = `Score: ${playerScore}`;  // Atualiza o placar
  }

  // Detecta colisão com a raquete do Player 2 (IA)
  if (ballX >= gameArea.clientWidth - opponentPaddle.clientWidth - ball.clientWidth &&
      ballY + ball.clientHeight >= opponentPaddleY && ballY <= opponentPaddleY + opponentPaddle.clientHeight) {
    ballSpeedX *= -1;  // Inverte a direção horizontal da bola
  }

  ball.style.left = ballX + 'px';
  ball.style.top = ballY + 'px';

  // Movimenta a IA
  moveOpponentPaddle();

  requestAnimationFrame(moveBall);  // Faz a animação da bola
}
