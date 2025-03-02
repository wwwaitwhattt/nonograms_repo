const solution = [
  [1, 0, 1, 0, 1],
  [0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1],
];

document.addEventListener("DOMContentLoaded", () => {
  const size = 5; 
  
  const gameContainer = document.createElement("div");
  gameContainer.className = "game-container";
  
  const gridAndRowContainer = document.createElement("div");
  gridAndRowContainer.className = "grid-and-row-container";

  const rowClues = createRowClues(size, solution);
  const columnClues = createColumnClues(size, solution);
  const grid = createGrid(size);

  gameContainer.appendChild(columnClues);
  gridAndRowContainer.appendChild(rowClues);
  gridAndRowContainer.appendChild(grid);
  gameContainer.appendChild(gridAndRowContainer);
  document.body.appendChild(gameContainer);
  
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      cell.classList.toggle("filled");
      const currentGridState = getCurrentGridState(size);
      if (checkWin(solution, currentGridState)) {
        alert("Great! You have solved the nonogram!");
      }
    });
  });
});

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

function createColumnClues(size) {
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