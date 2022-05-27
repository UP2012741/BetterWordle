//setup
const NO_OF_GUESSES = 6; // THE NUMBER OF GUESSES ALLOWED
const WORD_LENGTH = 5; // THE LENGTH OF WORDS
const FLIP_ANIMATION_DURATION = 500; //Animation duration


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

//When a letter is pressed on the keyboard or clicked
function pressKey(key) {
    const row = document.querySelector("[data-solved = 'not-sovled']"); //gets the first row which has not been used
    const activeSquares = getActiveSquare(row);
    if (activeSquares.length >= WORD_LENGTH) return; //Returns nothing if there is already 5 letters in the row
    const nextSquare = row.querySelector(":not([data-letter])");
    nextSquare.dataset.letter = key.toLowerCase();
    nextSquare.textContent = key; //Puts the letter in that square
    nextSquare.dataset.status = "active"; //changes the status of the square to active (contains letter)
}

//Gets the list of squares that currently have a letter in that row
function getActiveSquare(row) {
    return row.querySelectorAll("[data-status = 'active']");
}
//Deletes the letter in the row
function deleteKey() {
    const row = document.querySelector("[data-solved = 'not-sovled']"); //Gets the first row which has not been used
    const activeSquares = getActiveSquare(row);
    const lastSquare = activeSquares[activeSquares.length - 1]; //gets the last square
    if (lastSquare == null) return //if it is empty do nothing
    lastSquare.textContent = ""; //Otherwise change the text content to empty
    delete lastSquare.dataset.letter; //delete the letter data set
    lastSquare.dataset.status = ""; //set status to empty again
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
    let check = await validWord(guess); //calls valid word and returns if the word exists or is not found
    if (check === "Not Found") {
        showAlert("Word does not exist"); //returns error message
        shakeSquares(activeSquares); //shakes the squares
    } else {
        result = await compareWord(guess); //calls the compare fetch api and returns an array of the results
        stopInput();//Stops interaction
        let i = 0 // Sets index
        let temp = [] //A set of letters (Stops DUPLICATING LETTERS FROM BEING HIGHLIGHTED TWICE IF ABSENT (YELLOW))
        activeSquares.forEach(square => { //Loops through the row and for each square in that row
            assignResult(square, result, i, temp); //Assigns its value and flips the square depending on that value
            i++;
        })
        row.dataset.solved = "solved" //Update that row to solved
    }
}
//Show alert function. Takes in a message it wants to show and gives it a druation of 750ms
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

//CHECKS IF THE WORD IS REAL using api
async function validWord(guess) {
    const url = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/' + guess;
    const response = await fetch(url);
    data = response.text();
    return data; //Returns either "Not Found" or "OK"
}


//Calls api in the backend and gets an array saying if the guessed word is correct, absent or present
async function compareWord(guess) {
    const response = await fetch(`compare/${guess.toUpperCase()}`)
    data = response.json();
    return data;
}
//Calls api to get The word of the day (ONLY USED AT THE END OF THE GAME TO SHOW WORD OF THE DAY TO USER)
async function getWordOfTheDay() {
    const response = await fetch(`wordOfTheDay`)
    data = response.json();
    return data
}
//Starts interaction again
function startInput() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
}
//Removes all possible interaction ONLY CALLED DURING FLIP SEQUENCE OR END OF THE GAME
function stopInput() {
    document.removeEventListener("click", handleMouseClick)
    document.removeEventListener("keydown", handleKeyPress)
}


/* Takes in the square (tile), the result array, index and the temp set.
The temp set is passed so if there are any letters that are repeated which are 
*/
function assignResult(square, result, i, temp) {
    const keyboard = document.querySelector("[data-keyboard]");
    let letter = square.dataset.letter; //gets the letter in the square 
    let key = keyboard.querySelector(`[data-key="${letter}"i]`);
    setTimeout(() => { //Flip animation
        square.classList.add("flip"); //adds flip class
    }, (i * FLIP_ANIMATION_DURATION) / 2)

    square.addEventListener(
        "transitionend",
        () => {
            square.classList.remove("flip") //Removes flip class so it wont flip 
            square.dataset.status = result[i]; //Sets the status of the square to either absent, correct, present
            key.classList.add(result[i]); //Adds result to the key on the keyboard
            if (temp.includes(letter) && result[i] !== "correct") {
                square.dataset.status = "absent";
            }
            temp.push(letter);
            if (i === result.length - 1) { //if last square that has been flipped in the row
                square.addEventListener(
                    "transitionend",
                    () => {
                        peserveWordleState(); //save guess to the local storage
                        startInput(); //restarts interactionn
                        checkGameState(result);//checks if the game is won or lost
                    },
                    { once: true } //ONLY ONCE
                )
            }

        },
        { once: true }//ONLY ONCE
    )
}

async function checkGameState(result) {
    const resultSet = new Set(result); //Puts the array into a set
    //IF ANSWER IS CORRECT 
    if (resultSet.has("correct") && resultSet.size === 1) {  //puts in set so if Only "correct" is in resultSet then
        updateTotalGames() //checks if that state includes correct and only correct
        updateTotalWins() //updates the win counter by 1
        addWinStreak(); //Adds 1 to the win streak
        showAlert("You win!", 5000) //outputs you win if true
        stopInput() //stops all intearctions
        updateStats() //updates the stats for the statistic page
        showStats() //Displays the stats div which was hidden
        return
    }
    const rows = document.querySelectorAll("[data-solved = 'not-sovled']");
    if (rows.length === 0) { //No more attemps So loss condtion
        updateTotalGames()
        restartWinStreak() //restarts the win streak. Puts it back to 0 
        updateStats()
        showStats()
        word = await getWordOfTheDay() //fetch api to get the word from the back end
        showAlert(word["word"], 10000) //Shows the word as an alert
        stopInput()//Stops all interaction
    }
}
//LOCAL STORAGE FUNCTIONS

//Saves the state of the board
function peserveWordleState() {
    const keyboardState = document.querySelector("[data-keyboard]");
    window.localStorage.setItem('keyboardState', keyboardState.innerHTML) //Saves the state of the keyboard

    const tableState = document.querySelector("[data-table]");
    window.localStorage.setItem('tableState', tableState.innerHTML) //Saves the state of the table
}

//Loads the saved state from local storage
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
//Shows the hidden statisitc div. 
function showStats() {
    const statisticBox = document.querySelector("[data-statistic-conatiner]")
    statisticBox.hidden = false;
}

//UPDATES ALL STATISICS 
function updateStats() {
    const winStreak = window.localStorage.getItem("winStreak");
    const noOfWins = window.localStorage.getItem("noOfWins");
    const noOfGames = window.localStorage.getItem("totalGames");

    document.querySelector("[data-total-played]").textContent = noOfGames;
    document.querySelector("[data-total-wins]").textContent = noOfWins;
    document.querySelector("[data-win-streak]").textContent = winStreak;
    //caluclates the win percentage by dividing the number of wins with number of games played
    const percentage = Math.round((noOfWins / noOfGames) * 100) || 0;
    document.querySelector("[data-win-percentage]").textContent = percentage + "%";
}
//adds 1 to total wins stat
function updateTotalWins() {
    const wins = window.localStorage.getItem("noOfWins") || 0 //If it doesnt exist then we assign it to 0 
    window.localStorage.setItem('noOfWins', Number(wins) + 1) //increments the total wins by 1
}
//adds 1 to the winstreak
function addWinStreak() {
    const streak = window.localStorage.getItem("winStreak") || 0 //if it does not exist we assign it to 0 
    window.localStorage.setItem("winStreak", Number(streak) + 1);
}

//resets win streak
function restartWinStreak() {
    window.localStorage.setItem("winStreak", 0)
}
//adds 1 to the total number of games
function updateTotalGames() {
    const games = window.localStorage.getItem("totalGames") || 0 //if it does not exist we set total games to 0
    window.localStorage.setItem("totalGames", Number(games) + 1);
}