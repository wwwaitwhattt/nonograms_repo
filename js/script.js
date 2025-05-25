const size = 5 + Math.round(Math.random()*3);

// заполненность от 20 до 70 процентов
function generateSolution(size){
  let solution = [];
  const min = 0.2;
  const max = 0.7;
  const fill = min + Math.random() * (max - min);
  for (row = 0; row < size; row++){
      const row = []
      for (col = 0; col < size; col++){
          row.push(Math.random() < fill ? 1 : 0);
      }
      solution.push(row);
  }
  return solution
};

class ObjectElement {
  constructor({tag, classList = [], text, onClick}) {
    this.tag = tag;
    this.classList = classList;
    this.text = text;
    this.onClick = onClick;

    this.init();
  }

  init() {
    this.el = document.createElement(this.tag);
    this.el.classList.add(...this.classList); 

    if (this.text instanceof Node) { // без этой проверки элементы не добавляются в document fragment (см. функцию createClues)
      this.el.append(this.text)
    } else {
      this.el.textContent = this.text;
    };

    if (typeof this.onClick === 'function') {
      this.el.addEventListener('click', this.onClick);
    };
  }

  addChild(child) {
    if (child instanceof Node){
      this.el.append(child);
    } else {
      this.el.append(child.el);
    }
  }
}

class GridElement extends ObjectElement {
  constructor(tag, classList = [], text, onClick, gridSize) {
    super(tag, classList, text, onClick)
    this.gridSize = gridSize;
  }

  set Row(gridSize){
    this.el.style.gridTemplateRows = `repeat(${gridSize}, 30px)`;
  }

  set Col(gridSize){
    this.el.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
  }
}


class DescriptionBlockElement extends ObjectElement{
  constructor(tag, classList, titleText, rulesText) {
    super(tag, classList);
    this.titleText = titleText;
    this.rulesText = rulesText;
  };

  init() {
    super.init()
  }

  getElement() {
    return this.section;
  }
}

document.addEventListener("DOMContentLoaded", () => { 
  const pageContainer = new ObjectElement({
    tag: 'section',
    classList: ['game-page'],
  });

  // контейнер с правилами
  createRules();
  
  // очистить
  pageContainer.addChild(createButtonClear());

  // контейнер с игрой
  const gameContainer = createGameContainer(generateSolution(size));
  pageContainer.addChild(gameContainer);

  document.body.append(pageContainer.el);

  updateGame(generateSolution(size)); 
});

// контейнер с правилами
function createRules(){
  const sectionObject = new DescriptionBlockElement ({
    tag: 'section',
    classList: ['description-container', 'container'],
  });

  const titleObject = new DescriptionBlockElement({
    tag: 'h2',
    classList: ['rules-title', 'title'],
    text: 'Rules',
  });

  const rules = [
    "You have a grid of squares, which must be filled in black.",
    "Beside each row of the grid are listed the lengths of black squares on that row.",
    "Between each length, there must be at least one empty square.",
    "Your aim is to find all black squares.",
  ];

  const fragment = document.createDocumentFragment();

  rules.forEach(ruleText => {
    const rule = document.createElement("li");
    rule.textContent = ruleText;
    fragment.append(rule);
  })

  const descriptionContainer = new DescriptionBlockElement({
    titleText: 'Rules',
    rulesText: fragment,
  })

  const textObject = new DescriptionBlockElement({
    tag: 'ul',
    classList: ['rules-text', 'text'],
    text: fragment,
  })

  sectionObject.addChild(titleObject);
  sectionObject.addChild(textObject);

  document.body.append(sectionObject.el);  
}

function createButtonClear(){
  const clearButton = new ObjectElement({
    tag: 'button',
    classList: ['button', 'button-clear'],
    text: 'Clear',
    onClick() {
        clearAll()
    },
  });
  return clearButton
}

function createGameContainer(solution){
  const gameContainer = new ObjectElement({
    tag: 'div',
    classList: ['game-container', 'container'],
  })
  
  const gridAndRowContainer = new ObjectElement({
    tag: 'div',
    classList: ['grid-and-row-container'],
  })

  const rowClues = createClues('row', size, solution);
  const columnClues = createClues('column', size, solution);
  const grid = createGrid(size);

  gameContainer.addChild(columnClues);
  gridAndRowContainer.addChild(rowClues);
  gridAndRowContainer.addChild(grid);
  gameContainer.addChild(gridAndRowContainer);

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

  gameContainer.prepend(columnClues.el);
  gridAndRowContainer.prepend(rowClues.el);

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
  const grid = new GridElement({
    tag: 'div',
    classList: ['grid'],
  })

  grid.Row = size;
  grid.Col = size;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < size * size; i++) {
    const cell = new ObjectElement({
      tag: 'div',
      classList: ['cell'],
    })
    
    fragment.append(cell.el);
  }
  grid.addChild(fragment);
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
  const cluesElement = new GridElement({
    tag: 'div',
    classList: ['clues', `${type}-clues`],
  })

  let clues = [];

  if (type === 'row') {
    cluesElement.Row = size;
    clues = findRowClues(solution);
  }

  if (type === 'column') {
    cluesElement.Col = size;
    clues = findColumnClues(solution);
  }

  clues.forEach((clue) => {
    const clueContainer = new ObjectElement({
      tag: 'div',
      classList: ['clue-container', `clue-container_${type}`]
    })

    const fragment = document.createDocumentFragment();

    clue.forEach((number) => {
      const clueCell = new ObjectElement({
        tag: 'div',
        classList: ['cell-clue'],
        text: number, 
      })
      fragment.append(clueCell.el);
    });
    clueContainer.addChild(fragment);
    cluesElement.addChild(clueContainer);
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