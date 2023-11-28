// Gameboard
const gameboard = (() => {
  // Fields
  const fields = ["", "", "", "", "", "", "", "", ""];

  // Get all fields
  const getAllFields = () => fields;

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

  return { getAllFields, getOneField, setOneField, reset };
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

  // Rounds
  let rounds = 9;
  let gameOver = false;

  // Get current player
  const getCurrentPlayer = () => (rounds % 2 === 1 ? playerOne : playerTwo);

  const playOneRound = (index) => {
    gameboard.setOneField(index, getCurrentPlayer().sign);
    if (checkWinner(index) || rounds === 0) {
      gameOver = true;
      return;
    }
    rounds -= 1;
  };

  // Check winner
  const checkWinner = (index, sign) => {
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
      .some((possibleAxe) =>
        possibleAxe.every((index) => gameboard.getOneField(index) === sign)
      );
  };

  const checkGameOver = () => rounds === 0;

  const reset = () => {
    rounds = 9;
  };

  return { getCurrentPlayer, playOneRound, checkWinner, checkGameOver, reset };
})();

const display = (() => {
  // Update subtitle
  const updateSubtitle = (index, player) => {
    const subtitleElement = document.querySelector(".subtitle");
    if (game.checkWinner(index, player.sign)) {
      subtitleElement.textContent = `${player.name} wins!`;
    } else if (game.checkGameOver()) {
      subtitleElement.textContent = "It's a draw!";
    } else {
      subtitleElement.textContent = `${player.name}'s turn ("${player.sign}")`;
    }
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
      if (e.target.textContent !== "") return;
      game.playOneRound(index);
      updateSubtitle(index, game.getCurrentPlayer());
      updateGameboard();
    })
  );

  // Event listener - Restart button
  const btnRestartElement = document.querySelector(".btn-restart");
  btnRestartElement.addEventListener("click", () => {
    gameboard.reset();
    game.reset();
    updateSubtitle(index, game.getCurrentPlayer());
    updateGameboard();
  });
})();
