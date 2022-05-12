//setup
const NO_OF_GUESSES = 6;
const WORD_LENGTH = 5;
const dictionaryAPI = "https://dictionary-dot-sse-2020.nw.r.appspot.com/";
//Event fires as soon as html page is loaded
document.addEventListener("DOMContentLoaded", () => {
    initTable();
    keyboardInput();
})


function initTable() {
    //creating the rows of the table
    const table = document.querySelector(".table");

    for (let i = 0; i < NO_OF_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "table-row"
        row.dataset.solved = "not-sovled"
        for (let j = 0; j < WORD_LENGTH; j++) {
            let square = document.createElement("div");
            square.className = "square";
            square.dataset.status = "";
            row.appendChild(square)
        }
        table.appendChild(row)
    }
}




function keyboardInput() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
        pressKey(e.target.dataset.key);
        return
    }
    if (e.target.matches("[data-enter]")) {
        submitGuess();
        return
    }
    if (e.target.matches("[data-delete]")) {
        deleteKey();
        return
    }
}

function handleKeyPress(e) {
    if (e.key === "Enter") {
        submitGuess();
        return
    }
    if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey();
        return
    }
    if (e.key.match(/^[a-z]$/)) {
        pressKey(e.key)
        return
    }
}

function stopInput(e) {
    document.removeEventListner("click", handleMouseClick);
    document.removeEventListener("keydown", handleKeyPress);
}

function pressKey(key) {
    const row = document.querySelector("[data-solved = 'not-sovled']");
    const activeSquares = getActiveSquare(row);
    if (activeSquares.length >= WORD_LENGTH) return;
    const nextSquare = row.querySelector(":not([data-letter])");
    nextSquare.dataset.letter = key.toLowerCase();
    nextSquare.textContent = key;
    nextSquare.dataset.status = "active";
}

function getActiveSquare(row) {
    return row.querySelectorAll("[data-status = 'active']");
}

function deleteKey(key) {
    const row = document.querySelector("[data-solved = 'not-sovled']");
    const activeSquares = getActiveSquare(row);
    const lastSquare = activeSquares[activeSquares.length - 1];
    if (lastSquare == null) return
    lastSquare.textContent = "";
    delete lastSquare.dataset.letter;
    lastSquare.dataset.status = "";
}