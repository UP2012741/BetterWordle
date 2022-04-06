//setup
const noOfGuesses = 6;
const lengthOfWord = 5;

//Event fires as soon as html page is loaded
document.addEventListener("DOMContentLoaded", () => {
    createTable();

    function createTable() {
        const table = document.getElementById("table");
        //creating the rows of the table
        for (let i = 0; i < noOfGuesses; i++) {
            let row = document.createElement("div");
            row.className = "table-row"

            for (let j = 0; j < lengthOfWord; j++) {
                let square = document.createElement("div");
                square.className = "square"
                row.appendChild(square)
            }

            table.appendChild(row)
        }
    }

})