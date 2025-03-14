const solutions = [
  [
    [1, 0, 1, 0, 1],
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  [
    [1, 1, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
];

const size = 5; 

document.addEventListener("DOMContentLoaded", () => { 
  const pageContainer = document.createElement("section");
  pageContainer.className = "game-page";

  // контейнер с правилами
  const descriptionContainer = document.createElement("div");
  descriptionContainer.className = "description-container container";

  const titleRules = document.createElement("div");
  titleRules.className = "rules-title title";
  titleRules.textContent = "RULES";

  const textRules = document.createElement("div");
  textRules.className = "rules-text text"
  textRules.textContent = `• You have a grid of squares, which must be filled in black.
  • Beside each row of the grid are listed the lengths of black squares on that row.
  • Between each length, there must be at least one empty square.
  • Your aim is to find all black squares.`;

  // кнопка очистить
  const clearButton = document.createElement("button");
  clearButton.className = "button button-clear";
  clearButton.textContent = "CLEAR";
  clearButton.id = "buttonClear";
  clearButton.addEventListener("click", clearAll);

  // выбор картинки
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "solutions-container container";

  solutions.forEach((solution, index) => {
    const button = document.createElement("button");
    button.className = "button button-solution";
    button.textContent = `picture ${index + 1}`;
    button.addEventListener("click", () => updateGame(solution));
    buttonContainer.appendChild(button);
  });


  descriptionContainer.appendChild(titleRules);
  descriptionContainer.appendChild(textRules);

  document.body.appendChild(descriptionContainer);
  document.body.appendChild(buttonContainer);
  document.body.appendChild(clearButton);

  pageContainer.appendChild(descriptionContainer);
  pageContainer.appendChild(buttonContainer);
  pageContainer.appendChild(clearButton);

  document.body.appendChild(pageContainer);
  
  // контейнер с игрой
  const gameContainer = document.createElement("div");
  gameContainer.className = "game-container container";
  
  const gridAndRowContainer = document.createElement("div");
  gridAndRowContainer.className = "grid-and-row-container";

  const rowClues = createRowClues(size, solutions[0]);
  const columnClues = createColumnClues(size, solutions[0]);
  const grid = createGrid(size);

  gameContainer.appendChild(columnClues);
  gridAndRowContainer.appendChild(rowClues);
  gridAndRowContainer.appendChild(grid);
  gameContainer.appendChild(gridAndRowContainer);
  document.body.appendChild(gameContainer);

  pageContainer.appendChild(gameContainer);

  // запускаем игру с первой картинкой
  updateGame(solutions[0]);
});

function updateGame(solution) {
  // очищаем текущую сетку
  const grid = document.querySelector(".grid");
  grid.innerHTML = "";

  // создаем новую сетку
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }

  // обновляем подсказки для строк и столбцов
  const rowClues = document.querySelector(".row-clues");
  const columnClues = document.querySelector(".column-clues");

  rowClues.innerHTML = "";
  columnClues.innerHTML = "";

  const newRowClues = createRowClues(size, solution);
  const newColumnClues = createColumnClues(size, solution);

  rowClues.appendChild(newRowClues);
  columnClues.appendChild(newColumnClues);

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (cell.classList.contains("crossed")) {
        cell.classList.remove("crossed");
        cell.classList.add("filled");
      } else {
        cell.classList.toggle("filled");
      }
      const currentGridState = getCurrentGridState(size);
      if (checkWin(solution, currentGridState)) {
        alert("Great! You have solved the nonogram!");
      }
    });
    // крестик, при нажатии правой кнопки мыши
    cell.addEventListener("contextmenu", (event) => {
      event.preventDefault();

      if (cell.classList.contains("filled")) {
        cell.classList.remove("filled");
        cell.classList.add("crossed");
      } else {
        cell.classList.toggle("crossed");
      }
    });
  });
}

function clearAll(){
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("filled");
  });
}

function createGrid(size) {
  const grid = document.createElement("div");
  grid.className = "grid";
  grid.style.gridTemplateColumns = `repeat(${size}, 30px)`;
  grid.style.gridTemplateRows = `repeat(${size}, 30px)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    grid.appendChild(cell);
  }

  return grid;
}

function findClue(line) {
  const clue = [];
  let count = 0;

  for (i = 0; i < line.length; i++) {
    if (line[i] === 1) {
      count++
    } else if (count > 0) {
      clue.push(count);
      count = 0; 
    }
  }

  if (count > 0) {
    clue.push(count);
  }
  console.log(clue);
  return clue;
}

function findRowClues(solution) {
  return solution.map(row => findClue(row));
}

function findColumnClues(solution) {
  const columnClues = [];
  for (let i = 0; i < solution[0].length; i++) {
    const column = solution.map(row => row[i]);
    columnClues.push(findClue(column));
  }

  return columnClues;
}

function getCurrentGridState(size) {
  const gridState = [];
  const cells = document.querySelectorAll(".cell");

  for (let i = 0; i < size; i++) {
    gridState[i] = [];
    for (let j = 0; j < size; j++) {
      const cell = cells[i * size + j];
      gridState[i][j] = cell.classList.contains("filled") ? 1 : 0;  
    }
  }

  return gridState;
}

function createRowClues(size, solution) {
  const rowClues = document.createElement("div");
  rowClues.className = "clues row-clues";
  rowClues.style.gridTemplateRows = `repeat(${size}, 30px)`;

  const clues = findRowClues(solution);

  clues.forEach((clue) => {
    const clueContainer = document.createElement("div");
    clueContainer.className = "clue-container clue-container_row";

    clue.forEach((number) => {
      const clueCell = document.createElement("div");
      clueCell.className = "cell-clue";
      clueCell.textContent = number;
      clueContainer.appendChild(clueCell);
    });

    rowClues.appendChild(clueContainer);
  });

  return rowClues;
}

function createColumnClues(size, solution) {
  const columnClues = document.createElement("div");
  columnClues.className = "clues column-clues";
  columnClues.style.gridTemplateColumns = `repeat(${size}, 30px)`;

  const clues = findColumnClues(solution);

  clues.forEach((clue) => {
    const clueContainer = document.createElement("div");
    clueContainer.className = "clue-container clue-container_column";

    clue.forEach((number) => {
      const clueCell = document.createElement("div");
      clueCell.className = "cell-clue";
      clueCell.textContent = number;
      clueContainer.appendChild(clueCell);
    });

    columnClues.appendChild(clueContainer);
  });

  return columnClues;
}

function checkWin(solution, currentGridState) {
  for (let i = 0; i < solution.length; i++) {
    for (let j = 0; j < solution.length; j++) {
      if (solution[i][j] !== currentGridState[i][j]) {
        return false;
      }
    }
  }

  return true;
}