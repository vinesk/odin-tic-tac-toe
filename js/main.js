// Gameboard
const gameboard = (() => {
  // Fields
  const fields = ["", "", "", "", "", "", "", "", ""];

  // Get one field
  const getOneField = (index) => fields[index];

  // Set one field
  const setOneField = (index, sign) => {
    fields[index] = sign;
  };

  // Reset
  const reset = () => {
    for (let i = 0; i < fields.length; i++) {
      fields[i] = "";
    }
  };

  return { getOneField, setOneField, reset };
})();

// Game
const game = (() => {
  // Create one player
  const createOnePlayer = (name, sign) => {
    return { name, sign };
  };

  // Players
  const playerOne = createOnePlayer("Player 1", "X");
  const playerTwo = createOnePlayer("Player 2", "O");

  // Initial state
  let rounds = 9;
  let gameOver = false;

  // Get current player
  const getCurrentPlayer = () => (rounds % 2 === 1 ? playerOne : playerTwo);

  // Play one round
  const playOneRound = (index) => {
    const currentPlayer = getCurrentPlayer();
    gameboard.setOneField(index, currentPlayer.sign);
    if (checkWinner(index)) {
      gameOver = true;
      return `${currentPlayer.name} wins!`;
    } else {
      rounds -= 1;
      if (rounds === 0) {
        gameOver = true;
        return "It's a draw!";
      } else {
        const nextPlayer = getCurrentPlayer();
        return `${nextPlayer.name}'s turn ("${nextPlayer.sign}")`;
      }
    }
  };

  // Check winner
  const checkWinner = (index) => {
    const winningAxes = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winningAxes
      .filter((axe) => axe.includes(index))
      .some((axe) =>
        axe.every(
          (index) => gameboard.getOneField(index) === getCurrentPlayer().sign
        )
      );
  };

  // Check game over
  const checkGameOver = () => gameOver;

  // Reset
  const reset = () => {
    rounds = 9;
    gameOver = false;
  };

  return { getCurrentPlayer, playOneRound, checkWinner, checkGameOver, reset };
})();

const display = (() => {
  // Update subtitle
  const updateSubtitle = (message) => {
    const subtitleElement = document.querySelector(".subtitle");
    subtitleElement.textContent = message;
  };

  // Update gameboard
  const updateGameboard = () => {
    const btnFieldElements = document.querySelectorAll(".btn-field");
    btnFieldElements.forEach((fieldElement, index) => {
      fieldElement.textContent = gameboard.getOneField(index);
    });
  };

  // Event listener - Field buttons
  const btnFieldElements = document.querySelectorAll(".btn-field");
  btnFieldElements.forEach((field, index) =>
    field.addEventListener("click", (e) => {
      if (e.target.textContent !== "" || game.checkGameOver()) return;
      const message = game.playOneRound(index);
      updateSubtitle(message);
      updateGameboard();
    })
  );

  // Event listener - Restart button
  const btnRestartElement = document.querySelector(".btn-restart");
  btnRestartElement.addEventListener("click", () => {
    gameboard.reset();
    game.reset();
    const currentPlayer = game.getCurrentPlayer();
    updateSubtitle(`${currentPlayer.name}'s turn ("${currentPlayer.sign}")`);
    updateGameboard();
  });
})();
