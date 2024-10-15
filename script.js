// Factory function for creating players
function createPlayer(name, symbol) {
  const playerName = () => name;
  const getSymbol = () => symbol;
  return { playerName, getSymbol };
}

// Gameboard module
const Gameboard = (() => {
  let board = new Array(9).fill("");

  const getBoard = () => board;

  const updateBoard = (index, symbol) => {
    if (board[index] === "") {
      board[index] = symbol;
      return true;
    } else {
      alert("Spot already taken. Try again.");
      return false;
    }
  };

  const resetBoard = () => {
    board = new Array(9).fill("");
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.textContent = "";
    });
  };

  return { getBoard, updateBoard, resetBoard };
})();

// Game controller module
const GameController = (() => {
  let player1 = createPlayer("Player 1", "X");
  let player2 = createPlayer("Player 2", "O");
  let currentPlayer = player1;
  let round = 0;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    document.getElementById(
      "message"
    ).textContent = `${currentPlayer.playerName()}'s turn`;
  };

  const getCurrentPlayerName = () => currentPlayer.playerName();

  const playRound = (index) => {
    if (Gameboard.updateBoard(index, currentPlayer.getSymbol())) {
      document.querySelector(`[data-index='${index}']`).textContent =
        currentPlayer.getSymbol();
      round++;
      if (checkWinner()) {
        document.getElementById(
          "message"
        ).textContent = `${currentPlayer.playerName()} wins!`;
        return true;
      } else if (round === 9) {
        document.getElementById("message").textContent = "It's a tie!";
        return true;
      }
      switchTurn();
    }
    return false;
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions.some((combination) => {
      return combination.every(
        (index) => board[index] === currentPlayer.getSymbol()
      );
    });
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    round = 0;
    document.getElementById(
      "message"
    ).textContent = `${currentPlayer.playerName()}'s turn`;
  };

  return { playRound, resetGame, getCurrentPlayerName };
})();

// Add event listeners for game interaction
document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      GameController.playRound(parseInt(index));
    });
  });

  document
    .getElementById("reset")
    .addEventListener("click", GameController.resetGame);
});
