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
  createRules();

  // выбор картинки
  const buttonContainer = createButtonContainer(); 
  pageContainer.append(buttonContainer);

  // кнопка очистить
  const clearButton = createButtonClear();
  pageContainer.append(clearButton);

  // контейнер с игрой
  const gameContainer = createGameContainer();
  pageContainer.append(gameContainer);

  document.body.append(pageContainer);

  // запускаем игру с первой картинкой
  updateGame(solutions[0]);
});

// контейнер с правилами
function createRules(){
  const descriptionContainer = document.createElement("section");
  descriptionContainer.className = "description-container container";

  const titleRules = document.createElement("h1");
  titleRules.className = "rules-title title";
  titleRules.textContent = "Rules";

  const textRules = document.createElement("ul");
  textRules.className = "rules-text text"

  const rules = [
    "You have a grid of squares, which must be filled in black.",
    "Beside each row of the grid are listed the lengths of black squares on that row.",
    "Between each length, there must be at least one empty square.",
    "Your aim is to find all black squares."
  ];

  rules.forEach(ruleText => {
    const rule = document.createElement("li");
    rule.textContent = ruleText;
    textRules.append(rule)
  })

  descriptionContainer.append(titleRules);
  descriptionContainer.append(textRules);
  document.body.append(descriptionContainer);
}

function createButtonClear(){
  const clearButton = document.createElement("button");
  clearButton.className = "button button-clear";
  clearButton.textContent = "Clear";
  clearButton.addEventListener("click", clearAll);
  return clearButton
}

function createButtonContainer() {
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "solutions-container container";

  solutions.forEach((solution, index) => {
    const button = document.createElement("button");
    button.className = "button button-solution";
    button.textContent = `picture ${index + 1}`;
    button.addEventListener("click", () => updateGame(solution))
    buttonContainer.appendChild(button);
  });

  return buttonContainer
}

function createGameContainer(){
  const gameContainer = document.createElement("div");
  gameContainer.className = "game-container container";
  
  const gridAndRowContainer = document.createElement("div");
  gridAndRowContainer.className = "grid-and-row-container";

  const rowClues = createClues('row', size, solutions[0]);
  const columnClues = createClues('column', size, solutions[0]);
  const grid = createGrid(size);

  gameContainer.append(columnClues);
  gridAndRowContainer.append(rowClues);
  gridAndRowContainer.append(grid);
  gameContainer.append(gridAndRowContainer);

  return gameContainer
}

function updateGame(solution) {
  // очищаем поле
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("crossed");
    cell.classList.remove("filled");
  })

  // обновляем подсказки для строк и столбцов
  document.querySelector(".row-clues").remove();
  document.querySelector(".column-clues").remove();

  const rowClues = createClues('row', size, solution);
  const columnClues = createClues('column', size, solution);

  const gameContainer = document.querySelector('.game-container');
  const gridAndRowContainer = document.querySelector('.grid-and-row-container');

  gameContainer.prepend(columnClues);
  gridAndRowContainer.prepend(rowClues); 

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
        setTimeout(() => alert("Great! You have solved the nonogram!"), 0);
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
    cell.classList.remove("crossed");
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
  const cells = document.querySelectorAll(".cell");
  
  const currentState = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) =>
      cells[row * size + col].classList.contains("filled") ? 1 : 0
    )
  );
  return currentState
}

function createClues(type, size, solution) {
  const cluesElement = document.createElement("div");
  cluesElement.className = `clues ${type}-clues`;
  let clues = [];

  if (type === 'row') {
    cluesElement.style.gridTemplateRows = `repeat(${size}, 30px)`;
    clues = findRowClues(solution);
  }

  if (type === 'column') {
    cluesElement.style.gridTemplateColumns = `repeat(${size}, 30px)`;
    clues = findColumnClues(solution);
  }

  clues.forEach((clue) => {
    const clueContainer = document.createElement("div");
    clueContainer.className = `clue-container clue-container_${type}`;

    clue.forEach((number) => {
      const clueCell = document.createElement("div");
      clueCell.className = "cell-clue";
      clueCell.textContent = number;
      clueContainer.appendChild(clueCell);
    });

    cluesElement.appendChild(clueContainer);
  });

  return cluesElement;
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