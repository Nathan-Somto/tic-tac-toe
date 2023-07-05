const gameSelectLogo = document.querySelector("#game-select-logo");
const btnMark = document.querySelectorAll(".btn-mark");
const btnSelect = document.querySelectorAll(".btn-select");
const gameSelect = document.querySelector("#game-select");
const gameScreen = document.querySelector("#game-screen");
const gameBoard = document.querySelector("#game-board");
const gameTurn = document.querySelector("#game-turn");
const gameRestart = document.querySelector("#game-restart");
const resultModal = document.querySelector("#result-modal");
const resultMessage = document.querySelector("#result-message");
const p1Score = document.querySelector("#p1-score");
const p2Score = document.querySelector("#p2-score");
const tiesScore = document.querySelector("#ties-score");
const p1Name = document.querySelector("#p1-name");
const p2Name = document.querySelector("#p2-name");
const btnResult = document.querySelectorAll(".btn-result");
// have an initial game state, load from local storage if it exists
const gameState = {
  playerTurn: "X",
  board: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  cpu: true,
  player2: false,
  tally: {
    p1: 0,
    cpu: 0,
    tie: 0,
    p2: 0,
  },
  mark: {
    p1: "X",
    p2: "O",
    cpu: "O",
  },
  gameEnded: false,
};
const resultStyles = {
  X: {
    class: "result-X",
    blueSvg:
      '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="80px" viewBox="0 0 64 64"><path d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z" fill="#1F3641" fill-rule="evenodd"/></svg>',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="80px" viewBox="0 0 64 64"><path d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z" fill="#31C3BD" fill-rule="evenodd"/></svg>',
  },
  O: {
    class: "result-O",
    blueSvg:'<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="80px" viewBox="0 0 64 64"><path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" fill="#1F3641"/></svg>',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="80px" viewBox="0 0 64 64"><path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" fill="#F2B137"/></svg>',
  },
};
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [2, 5, 8],
  [1, 4, 7],
  [0, 4, 8],
  [2, 4, 6],
];
// game select functions
function handleMarkSelect(index) {
  btnMark[(index + 1) % btnMark.length].className = "btn-mark";
  btnMark[index].className += " selected";
  gameState.mark.p1 = btnMark[index].dataset.selectedMark;
}
btnMark.forEach((btn, index) => {
  btn.addEventListener("click", () => handleMarkSelect(index));
});

function handleGameOptionChoice(index) {
  gameState.cpu = btnSelect[index].dataset.select === "cpu";
  gameState.player2 = btnSelect[index].dataset.select === "player2";
  if (gameState.mark.p1 === "O") {
    gameState.mark.p2 = "X";
    gameState.mark.cpu = "X";
  }
  gameSelectLogo.style.display = "none";
  gameSelect.style.display = "none";
  gameScreen.style.display = "flex";
  generateGameBoard();
}
btnSelect.forEach((btn, index) => {
  btn.addEventListener("click", () => handleGameOptionChoice(index));
});
// game screen functions
function generateGameBoard() {
  gameState.board.forEach(() => {
    const div = document.createElement("div");
    div.className += "game-cell";
    div.dataset.mark = "";
    // later  we will check if the board has been filled.
    gameBoard.appendChild(div);
    document.querySelectorAll(".game-cell").forEach((cell, index) => {
      cell.addEventListener("click", () => handleCellClick(index));
    });
  });
  /* if(gameState.player2 && gameState.mark.p2 === "O"){
    gameState.playerTurn = 'O';
  } */
  if (gameState.cpu && gameState.mark.cpu === "X") {
    handleBotClick();
  }
  updateTally();
}

// handle cell click
function handleCellClick(index) {
  const gameCells = document.querySelectorAll(".game-cell");

  if (gameCells[index].dataset.mark !== "") {
    return;
  }
  // if it is a two player game allow clicks or playerturn equals p1 (for cpu)
  if (gameState.player2 || gameState.mark.p1 === gameState.playerTurn) {
    if (gameState.playerTurn === "X") {
      updateGame(index, "X");
    } else {
      updateGame(index, "O");
    }
  }
  if (gameState.cpu) {
    setTimeout(() => {
      handleBotClick();
    }, 1500);
  }
}
function updateGame(index, mark) {
  const gameCells = document.querySelectorAll(".game-cell");
  gameState.board[index] = mark;
  gameCells[index].dataset.mark = mark;
  if (mark === "X") {
    gameCells[index].innerHTML = resultStyles["X"].svg;
    gameState.playerTurn = "O";
  } else {
    gameCells[index].innerHTML = resultStyles["O"].svg;

    gameState.playerTurn = "X";
  }
  const winner = checkWinner();
  if (winner.length !== 0) {
    const winnerMark = gameState.board[winner[0]];
    if (gameState.cpu && gameState.mark.cpu === winnerMark) {
      gameState.tally.cpu += 1;
    } else if (gameState.player2 && gameState.mark.p2 === winnerMark) {
      gameState.tally.p2 += 1;
    } else {
      gameState.tally.p1 += 1;
    }
    resultMessage.innerHTML = `<p>
              <span>${resultStyles[winnerMark].svg}</span>
              <span class="${resultStyles[winnerMark].class}">takes the round</span>
            </p>
            `;
    gameState.gameEnded = true;
    setTimeout(() => {
      resultModal.style.display = "grid";
    }, 1500);
    updateTally();
    return;
  }
  if (checkTie()) {
    gameState.tally.tie += 1;
    //show  result modal.
    resultMessage.innerHTML = `
        <p id="result-draw" class="result-draw">
              tie game
            </p> 
            `;
    gameState.gameEnded = true;
    setTimeout(() => {
      resultModal.style.display = "grid";
    }, 1500);
    updateTally();
    return;
  }
  gameTurn.textContent = gameState.playerTurn;
}
function updateTally() {
  tiesScore.innerHTML = gameState.tally.tie;

  if (gameState.mark.p1 === "X") {
    p1Score.innerHTML = gameState.tally.p1;
    p1Name.innerHTML = gameState.cpu ? "X (YOU)" : "X (P1)";
    p2Score.innerHTML = gameState.tally.cpu
      ? gameState.tally.cpu
      : gameState.tally.p2;

    if (gameState.cpu) {
      p2Name.innerHTML = "O (CPU)";
    } else {
      p2Name.innerHTML = "O (P2)";
    }
    return;
  }

  p1Score.innerHTML = gameState.tally.cpu
    ? gameState.tally.cpu
    : gameState.tally.p2;
  if (gameState.cpu) {
    p1Name.innerHTML = "X (CPU)";
  } else {
    p1Name.innerHTML = "X (P2)";
  }
  p2Score.innerHTML = gameState.tally.p1;
  p2Name.innerHTML = gameState.cpu ? "O (YOU)" : "O (P1)";
}
function handleBotClick() {
  if(gameState.gameEnded) return;
  const emptySpace = findEmptySpace();
  updateGame(emptySpace, gameState.mark.cpu);
}
function findEmptySpace() {
  const space = gameState.board.filter((value) => typeof value === "number");
  return space[Math.floor(Math.random() * space.length)];
}
function checkWinner() {
  // returns either X or  O or ''
  const gameCells = document.querySelectorAll(".game-cell");
  let winner = [];
  const board = gameState.board;
  for (win of winningCombinations) {
    const [a, b, c] = win;
    if (board[a] === board[b] && board[b] === board[c]) {
      winner = [a, b, c];
    }
  }
  if (winner.length) {
    const winnerIndex = winner[0];
    const winnerMark = gameState.board[winnerIndex];
    /* #1F3641' */
    winner.forEach((item) => {
      gameCells[item].style.backgroundColor =
        gameState.board[winnerIndex] === "X" ? "#31C3BD" : "#F2B137";
      gameCells[item].innerHTML = resultStyles[winnerMark].blueSvg;
    });
  }
  return winner;
}
function checkTie() {
  return gameState.board.every((value) => typeof value !== "number");
}
function restartGame() {
  const gameCells = document.querySelectorAll(".game-cell");
  gameState.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  gameState.board.forEach((item) => {
    gameCells[item].innerHTML = "";
    gameCells[item].dataset.mark = "";
    gameCells[item].style.backgroundColor = "#1F3641";
  });
  if (gameState.cpu && gameState.mark.cpu === "X") {
    handleBotClick();
  }
}
gameRestart.addEventListener("click", restartGame);
function handleResultOption(index) {
  if (btnResult[index].dataset.result === "Quit") {
    clearGame();
    gameScreen.style.display = "none";
    resultModal.style.display = "none";
    gameSelect.style.display = "block";
    gameSelectLogo.style.display = "block";
    return;
  }
  gameState.gameEnded = false;
  if(gameState.playerTurn === 'O'){
     gameState.playerTurn = "X";
  }
  restartGame();
  resultModal.style.display = "none";
}
btnResult.forEach((btn, index) =>
  btn.addEventListener("click", () => handleResultOption(index))
);
function clearGame() {
  // set the game state to its initial state
}
