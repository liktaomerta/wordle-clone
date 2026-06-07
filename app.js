const rowLength = 5;
let currentRow = 1;

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function fillBoxes() {
  document.addEventListener("keydown", (event) => {
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

    const currentRowClass = `.${rowClasses[currentRow]}-row .box`;
    currentBoxes = document.querySelectorAll(currentRowClass);

    if (isLetter(event.key)) {
      const pressedLetter = event.key.toUpperCase();

      for (let i = 0; i < rowLength; i++) {
        if (currentBoxes[i].textContent === "") {
          currentBoxes[i].textContent = pressedLetter;
          return;
        }
      }
    }

    if (event.key === "Enter") {
      let isRowFull = true;
      for (let i = 0; i < rowLength; i++) {
        if (currentBoxes[i] === "") {
          isRowFull = false;
        }
      }
    }

    if (isRowFull) {
      currentRow++;
    }
  });
}

fillBoxes();
