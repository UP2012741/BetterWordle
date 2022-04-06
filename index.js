// This creates the grid with squares on the board.
function initGrid() {
    let grid = document.getElementById("board");
    for (let i = 0; i < numberOfGuesses; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        board.appendChild(row)
    }
}