let wordGuesses = ["", "", "", "", "", ""];
const wordOfTheDaySource = "https://words.dev-apis.com/word-of-the-day";
let wordOfTheDayString;
const awaitingResponseIcon = "😵‍💫";
const awaitingResponseSelector = document.querySelector(".awaiting-response");

const rowLength = 5;
let currentRow = 1;

const rowClasses = ["", "first", "second", "third", "forth", "fifth", "sixth"];

let currentInputMethod = null;

function setupInputBasedOnScreenSize() {
  if (window.innerWidth < 768) {
    // Mobile: use button clicks
    if (currentInputMethod !== "buttons") {
      currentInputMethod = "buttons";
      fillBoxesWithButtons();
    }
  } else {
    // Desktop: use keyboard
    if (currentInputMethod !== "keyboard") {
      currentInputMethod = "keyboard";
      fillBoxes();
    }
  }
}

function getCurrentBoxes() {
  const rowClass = `.${rowClasses[currentRow]}-row .box`;
  return document.querySelectorAll(rowClass);
}

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
  awaitingResponseSelector.style.display = "flex";
  const isValid = await validateWord(word);

  if (isValid) {
    checkRow(word, wordOfTheDayString, currentBoxes);
    currentRow++;
  } else {
    alert("Not a valid word!");
    for (let i = 0; i < currentBoxes.length; i++) {
      currentBoxes[i].textContent = "";
    }
  }
  awaitingResponseSelector.style.display = "none";
}

async function getWord() {
  const promise = await fetch(wordOfTheDaySource);
  const processedResponse = await promise.json();
  wordOfTheDayString = processedResponse.word.toUpperCase();
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function fillBoxesWithButtons() {
  document.addEventListener("click", (event) => {
    if (currentRow > 6) return;

    const button = event.target;
    if (!button.classList.contains("btn")) return;

    const currentBoxes = getCurrentBoxes();
    const letter = button.innerText;

    // ✅ Handle regular letter buttons
    if (letter !== "ENTER" && letter !== "BACK") {
      for (let i = 0; i < rowLength; i++) {
        if (currentBoxes[i].textContent === "") {
          currentBoxes[i].textContent = letter;
          return;
        }
      }
    }

    if (letter === "ENTER") {
      let isRowFull = true;
      for (let i = 0; i < rowLength; i++) {
        if (currentBoxes[i].textContent === "") {
          isRowFull = false;
          break;
        }
      }

      if (isRowFull) {
        const guessIndex = currentRow - 1;
        let guess = "";

        for (let i = 0; i < currentBoxes.length; i++) {
          guess += currentBoxes[i].textContent;
        }

        submitWord(guess, currentBoxes);
      } else {
        alert("Please enter a five letter word");
      }
    }

    if (letter === "BACK") {
      for (let i = rowLength - 1; i >= 0; i--) {
        if (currentBoxes[i].textContent !== "") {
          currentBoxes[i].textContent = "";
          return;
        }
      }
    }
  });
}

function fillBoxes() {
  document.addEventListener("keydown", (event) => {
    if (currentRow > 6) return;

    const currentBoxes = getCurrentBoxes();
    let pressedLetter = event.key;

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
          break;
        }
      }

      if (isRowFull) {
        const guessIndex = currentRow - 1;
        let guess = "";

        for (let i = 0; i < currentBoxes.length; i++) {
          guess += currentBoxes[i].textContent;
        }

        submitWord(guess, currentBoxes);
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

function checkRow(writtenWord, wordOfTheDay, currentBoxes) {
  for (let i = 0; i < rowLength; i++) {
    if (writtenWord[i] === wordOfTheDay[i]) {
      currentBoxes[i].classList.add("correct");
    } else if (
      writtenWord[i] !== wordOfTheDay[i] &&
      wordOfTheDay.includes(writtenWord[i])
    ) {
      currentBoxes[i].classList.add("present");
    } else {
      currentBoxes[i].classList.add("absent");
    }
  }

  if (writtenWord === wordOfTheDay) {
    alert("You win!");
  } else if (writtenWord !== wordOfTheDay && currentRow === 6) {
    alert(`You lost... The word was ${wordOfTheDay}`);
  } else {
    alert("Keep trying...");
  }
}

async function init() {
  await getWord();
  setupInputBasedOnScreenSize();
  window.addEventListener("resize", setupInputBasedOnScreenSize);
}

init();
