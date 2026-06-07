const rowLength = 5;
let currentRow = 1;

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function fillBoxes() {
  document.addEventListener("keydown", (event) => {
    let pressedLetter = event.key;
    if (currentRow > 6) return;

    const rowClasses = [
      "",
      "first",
      "second",
      "third",
      "forth",
      "fifth",
      "sixth",
    ];

    let isRowFull;
    const currentRowClass = `.${rowClasses[currentRow]}-row .box`;
    const currentBoxes = document.querySelectorAll(currentRowClass);

    if (isLetter(pressedLetter)) {
      pressedLetter = pressedLetter.toUpperCase();

      for (let i = 0; i < rowLength; i++) {
        if (currentBoxes[i].textContent === "") {
          currentBoxes[i].textContent = pressedLetter;
          return;
        }
      }
    }

    if (event.key === "Enter") {
      isRowFull = true;
      for (let i = 0; i < rowLength; i++) {
        if (currentBoxes[i].textContent === "") {
          isRowFull = false;
        }
      }
    }

    if (event.key === "Backspace") {
      for (let i = rowLength - 1; i >= 0; i--) {
        if (currentBoxes[i].textContent !== "") {
          currentBoxes[i].textContent = "";
          return;
        }
      }
    }

    if (isRowFull) {
      currentRow++;
    }
  });
}

function init() {
  fillBoxes();
}

init();
