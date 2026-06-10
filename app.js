let wordGuesses = ["", "", "", "", "", ""];

const wordOfTheDaySource = "https://words.dev-apis.com/word-of-the-day";
let wordOfTheDayString;

async function validateWord(word) {
  const VALIDATE_URL = "https://words.dev-apis.com/validate-word";

  const wordGuess = {
    word: word.toLowerCase(),
  };

  try {
    const response = await fetch(VALIDATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wordGuess),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    return responseData.validWord;
  } catch (error) {
    alert(`Error: `, error);
  }
}

async function submitWord(word, currentBoxes) {
  const isValid = await validateWord(word);

  if (isValid) {
    checkRow(word, wordOfTheDayString);
    currentRow++;
  } else {
    alert("Not a valid word!");
  }
}

async function getWord() {
  const promise = await fetch(wordOfTheDaySource);
  const processedResponse = await promise.json();
  wordOfTheDayString = processedResponse.word.toUpperCase();
}

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
      let isRowFull = true;
      for (let i = 0; i < rowLength; i++) {
        if (currentBoxes[i].textContent === "") {
          isRowFull = false;
        }
      }

      if (isRowFull) {
        const guessIndex = currentRow - 1;

        wordGuesses[guessIndex] = "";

        for (i = 0; i < currentBoxes.length; i++) {
          wordGuesses[guessIndex] += currentBoxes[i].textContent;
        }

        submitWord(wordGuesses[guessIndex], currentBoxes);
      } else {
        alert("Please enter a five letter word");
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
  });
}

function checkRow(writtenWord, wordOfTheDay) {
  if (writtenWord === wordOfTheDay) {
    alert("You win!");
  } else {
    alert("Keep trying...");
  }
}

async function init() {
  await getWord();
  fillBoxes();
}

init();
