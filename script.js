document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const status = document.getElementById("status");
  const resetBtn = document.getElementById("reset");

  const size = 8;
  const winLength = 5;
  let currentPlayer = "X";
  let gameOver = false;

  const clickSound = new Audio("draw.mp3");
  const winSound = new Audio("game-over.mp3");
  const drawSound = new Audio("loose.mp3");
  const startSound = new Audio("win.mp3");
  // startSound.currentTime = 0;
  // startSound.play();

  document.documentElement.style.setProperty("--boxSize", size);
  document.getElementById("gametittle").innerText="Tic Tac Toe "+size+"X"+size;

  // Initialize board
  const cells = [];
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    board.appendChild(cell);
    cells.push(cell);
  }

  // Handle cell click
  board.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell") || gameOver) return;

    const cell = e.target;
    if (cell.textContent !== "") return;

    clickSound.currentTime = 0;
    clickSound.play();

    cell.textContent = currentPlayer;

    if (checkWinner()) {
      status.textContent = `Player ${currentPlayer} wins!`;
      gameOver = true;
      winSound.currentTime = 0; // restart if already playing
      winSound.play();
      return;
    }

    if (cells.every(c => c.textContent !== "")) {
      status.textContent = "It's a draw!";
      gameOver = true;
      drawSound.currentTime = 0; // restart if already playing
      drawSound.play();
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Player ${currentPlayer}'s turn`;
  });

  // Reset game
  resetBtn.addEventListener("click", () => {
    cells.forEach(c => {
      c.textContent = "";
      c.classList.remove("winner");
      c.classList.remove("disabled");
    });
    currentPlayer = "X";
    gameOver = false;
    startSound.currentTime = 0;
    startSound.play();
    status.textContent = "Player X's turn";
  });

  // Check winner function
  function checkWinner() {
    const grid = Array.from({ length: size }, (_, r) =>
      cells.slice(r * size, r * size + size).map(c => c.textContent)
    );

    const directions = [
      [0, 1],  // →
      [1, 0],  // ↓
      [1, 1],  // ↘
      [1, -1], // ↙
    ];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c]) continue;

        for (let [dr, dc] of directions) {
          let cellsInLine = [{ r, c }];
          let count = 1;

          for (let k = 1; k < winLength; k++) {
            let nr = r + dr * k;
            let nc = c + dc * k;
            if (
              nr >= 0 &&
              nr < size &&
              nc >= 0 &&
              nc < size &&
              grid[nr][nc] === grid[r][c]
            ) {
              count++;
              cellsInLine.push({ r: nr, c: nc });
            } else break;
          }

          if (count === winLength) {
            // Highlight winning cells
            cellsInLine.forEach(({ r, c }) =>
              cells[r * size + c].classList.add("winner")
            );
            return true;
          }
        }
      }
    }
    return false;
  }
});
