import { handle } from "express/lib/application";

//setup
const noOfGuesses = 6;
const lengthOfWord = 5;
const keyboard = document.querySelector(".keys-conatiner")

//Event fires as soon as html page is loaded
document.addEventListener("DOMContentLoaded", () => {
    initTable();
})

function initTable() {
    //creating the rows of the table
    const table = document.querySelector(".table");

    for (let i = 0; i < noOfGuesses; i++) {
        let row = document.createElement("div");
        row.className = "table-row"
        for (let j = 0; j < lengthOfWord; j++) {
            let square = document.createElement("div");
            square.className = "square";
            square.dataset.status = "";
            row.appendChild(square)
        }
        table.appendChild(row)
    }
}

function keyboardInput() {
    document.addEventListener("click", mouseClick)
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
    if (e.key.match(/^[a - z]$/)) { // REGULAR EXPRESSION TO CHECK ANY CHARACTER FROM a - z
        pressKey(e.key);
        return
    }
}

function stopInput(e) {
    document.removeEventListner("click", handleMouseClick);
    document.removeEventListener("keydown", handleKeyPress);
}

function pressKey(key) {

}