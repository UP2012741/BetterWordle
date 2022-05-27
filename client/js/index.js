//setup
const NO_OF_GUESSES = 6; // THE NUMBER OF GUESSES ALLOWED
const WORD_LENGTH = 5; // THE LENGTH OF WORDS
const FLIP_ANIMATION_DURATION = 500;
//local storage
let winPercentage = 0;


//COMMENTED OUT BECAUSE I FOLLOWED THE MESSAGEBOARD EXAMPLE INSTEAD BECAUSE I DID NOT KNOW IF THIS IS GOOD PRACITSE
//Event fires as soon as html page is loaded
// document.addEventListener("DOMContentLoaded", () => {
//     initTable();
//     keyboardInput();
// })

function pageLoaded() {
    initTable(); //creates game table
    keyboardInput(); // listens for inputs
    loadLocalStorage();//loads up the game state from local storage
}


//loads as soon as webpage is opened 
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
    if (e.target.matches("[data-key]")) { // if it clicks on the visual keyboard
        pressKey(e.target.dataset.key);
        return
    }
    if (e.target.matches("[data-enter]")) { //if it clicks on the enter box on the visual keyboard
        submitGuess();
        return
    }
    if (e.target.matches("[data-delete]")) {//if it clicks on the data delete on the visual keyboard
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
    if (e.key.match(/^[a-z]$/)) { //regular expression of just keys from a - z
        pressKey(e.key)
        return
    }
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
//Sumbit guess LOGIC
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
        stopInput();
        let i = 0
        let temp = []
        activeSquares.forEach(square => {
            assignResult(square, result, i, temp);
            i++;
        })
        row.dataset.solved = "solved"
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

//function shakes the squares in the grid that it is passed too
function shakeSquares(squares) {
    // adds a classList of shake and then animates the shake animation then removes it from the class list
    squares.forEach(square => {
        square.classList.add("shake")
        square.addEventListener(
            "animationend",
            () => {
                square.classList.remove("shake")
            },
            { once: true } //only once
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

async function getWordOfTheDay() {
    const response = await fetch(`wordOfTheDay`)
    data = response.json();
    return data
}

function startInput() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
}

function stopInput() {
    document.removeEventListener("click", handleMouseClick)
    document.removeEventListener("keydown", handleKeyPress)
}

function assignResult(square, result, i, temp) {
    const keyboard = document.querySelector("[data-keyboard]");
    let letter = square.dataset.letter;
    let key = keyboard.querySelector(`[data-key="${letter}"i]`);
    setTimeout(() => {
        square.classList.add("flip");
    }, (i * FLIP_ANIMATION_DURATION) / 2)

    square.addEventListener(
        "transitionend",
        () => {
            square.classList.remove("flip")
            square.dataset.status = result[i];
            key.classList.add(result[i]);
            if (temp.includes(letter) && result[i] !== "correct") {
                square.dataset.status = "absent";
            }
            temp.push(letter);
            if (i === result.length - 1) {
                square.addEventListener(
                    "transitionend",
                    () => {
                        peserveWordleState(); //save guess to the local storage
                        startInput(); //restarts interactionn
                        checkGameState(result);//checks if the game is won or lost
                    },
                    { once: true }
                )
            }

        },
        { once: true }
    )
}

async function checkGameState(result) {
    const resultSet = new Set(result); //Puts the array into a set
    if (resultSet.has("correct") && resultSet.size === 1) {
        updateTotalGames() //checks if that state includes correct and only correct
        updateTotalWins()
        addWinStreak();
        showAlert("You win!", 5000) //outputs you win if true
        stopInput() //stops all intearctions
        updateStats()
        showStats()
        return
    }
    const rows = document.querySelectorAll("[data-solved = 'not-sovled']");
    if (rows.length === 0) {
        updateTotalGames()
        restartWinStreak()
        updateStats()
        showStats()
        word = await getWordOfTheDay()
        showAlert(word["word"], 10000)
        stopInput()
    }
}

function peserveWordleState() {
    const keyboardState = document.querySelector("[data-keyboard]");
    window.localStorage.setItem('keyboardState', keyboardState.innerHTML)

    const tableState = document.querySelector("[data-table]");
    window.localStorage.setItem('tableState', tableState.innerHTML)
}

function loadLocalStorage() {
    //loads stored keyboard state
    const storedKeyboardState = window.localStorage.getItem("keyboardState")
    if (storedKeyboardState) { //checks if localstorage isnt empty
        document.querySelector("[data-keyboard]").innerHTML = storedKeyboardState
    }
    //loads stored table state
    const storedTableState = window.localStorage.getItem("tableState")
    if (storedKeyboardState) { //checks if localstorage isnt empty
        document.querySelector("[data-table]").innerHTML = storedTableState;
    }

}

function showStats() {
    const statisticBox = document.querySelector("[data-statistic-conatiner]")
    statisticBox.hidden = false;
}

function updateStats() {
    const winStreak = window.localStorage.getItem("winStreak");
    const noOfWins = window.localStorage.getItem("noOfWins");
    const noOfGames = window.localStorage.getItem("totalGames");

    document.querySelector("[data-total-played]").textContent = noOfGames;
    document.querySelector("[data-total-wins]").textContent = noOfWins;
    document.querySelector("[data-win-streak]").textContent = winStreak;

    const percentage = Math.round((noOfWins / noOfGames) * 100) || 0;
    document.querySelector("[data-win-percentage]").textContent = percentage + "%";
}

function updateTotalWins() {
    const wins = window.localStorage.getItem("noOfWins") || 0 //If it doesnt exist then we assign it to 0 
    window.localStorage.setItem('noOfWins', Number(wins) + 1) //increments the total wins by 1
}

function addWinStreak() {
    const streak = window.localStorage.getItem("winStreak") || 0 //if it does not exist we assign it to 0 
    window.localStorage.setItem("winStreak", Number(streak) + 1);
}

function restartWinStreak() {
    window.localStorage.setItem("winStreak", 0)
}

function updateTotalGames() {
    const games = window.localStorage.getItem("totalGames") || 0 //if it does not exist we set total games to 0
    window.localStorage.setItem("totalGames", Number(games) + 1);
}