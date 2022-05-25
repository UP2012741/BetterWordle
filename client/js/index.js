//setup
const NO_OF_GUESSES = 6; // THE NUMBER OF GUESSES ALLOWED
const WORD_LENGTH = 5; // THE LENGTH OF WORDS
const FLIP_ANIMATION_DURATION = 500;

//COMMENTED OUT BECAUSE I FOLLOWED THE MESSAGEBOARD EXAMPLE INSTEAD BECAUSE I DID NOT KNOW IF THIS IS GOOD PRACITSE
//Event fires as soon as html page is loaded
// document.addEventListener("DOMContentLoaded", () => {
//     initTable();
//     keyboardInput();
// })

function pageLoaded() {
    initTable();
    keyboardInput();
}



window.addEventListener('load', pageLoaded);

//Creates the Grid for the words. 
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



//listens for keyboard and mouse inputs 
function keyboardInput() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
}

//Handles mouse click inputs
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
//Handles key presses
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

function deleteKey() {
    const row = document.querySelector("[data-solved = 'not-sovled']");
    const activeSquares = getActiveSquare(row);
    const lastSquare = activeSquares[activeSquares.length - 1];
    if (lastSquare == null) return
    lastSquare.textContent = "";
    delete lastSquare.dataset.letter;
    lastSquare.dataset.status = "";
}

async function submitGuess() {
    const row = document.querySelector("[data-solved = 'not-sovled']");
    const activeSquares = [...getActiveSquare(row)];
    //checks if the length submitted is correct length 
    if (activeSquares.length !== WORD_LENGTH) {
        showAlert("Not enough letters"); //returns error message
        shakeSquares(activeSquares); //shakes the squares
        return
    }
    //takes the word and puts it in the guess variable 
    const guess = activeSquares.reduce((word, square) => {
        return word + square.dataset.letter
    }, "");

    let check = await validWord(guess);
    if (check === "Not Found") {
        showAlert("Word does not exist"); //returns error message
        shakeSquares(activeSquares); //shakes the squares
    } else {
        result = await compareWord(guess);
        console.log(result)
        stopInteraction();
        let i = 0
        activeSquares.forEach(square => {
            assignResult(square, result, i);
            i++;
        })
        startInteraction();

    }

}

function showAlert(message, duration = 750) {
    const alert = document.createElement("div");
    const alertContainer = document.querySelector("[data-alert-container]");
    alert.textContent = message;
    alert.classList.add("alert");
    alertContainer.prepend(alert);
    if (duration == null) return

    setTimeout(() => {
        alert.classList.add("hide");
        alert.addEventListener("transitioned", () => {
            alert.remove();
        })
    }, duration)

}

function shakeSquares(squares) {
    squares.forEach(square => {
        square.classList.add("shake")
        square.addEventListener(
            "animationend",
            () => {
                square.classList.remove("shake")
            },
            { once: true }
        )
    })
}

//CHECKS IF THE WORD IS REAL
async function validWord(guess) {
    const url = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/' + guess;
    const response = await fetch(url);
    data = response.text();
    return data;
}



async function compareWord(guess) {
    const response = await fetch(`compare/${guess.toUpperCase()}`)
    data = response.json();
    return data;
}

function startInteraction() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
    document.removeEventListener("click", handleMouseClick)
    document.removeEventListener("keydown", handleKeyPress)
}

function assignResult(square, result, i) {
    const keyboard = document.querySelector("[data-keyboard]");
    const letter = square.dataset.letter;
    const key = keyboard.querySelector(`[data-key="${letter.toUpperCase()}"i]`);

    console.log(result[i])
    setTimeout(() => {
        square.classList.add("flip");
    }, (i * FLIP_ANIMATION_DURATION) / 2)

    square.addEventListener(
        "transitionend",
        () => {
            square.classList.remove("flip")
            square.dataset.status = result[i];
            key.classList.add(result[i]);
        }
    )

}
