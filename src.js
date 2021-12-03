'use strict';
// Initializations 
// GameBoard state tracking array.
let gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

// Player Factory
function Player(name, symbol) {
    const getSymbol = () => symbol;
    const getName = () => name;

    return {getSymbol, getName};
}


// DisplayController Module. Controls what's displayed on the board.
const DisplayController = (() => {
    let announcement = document.querySelector('.announcements');
    let squares = document.querySelectorAll('.square');
    let pressedSquare = "";
    squares.forEach((square) => {
        square.addEventListener('click', () => {
            Game.playerClicked(square);
        });
    });

    // const getSquare = () => pressedSquare;
    // const setSquare = (square, symbol) => {
    //     square.innerHTML = symbol;
    // }
    
    // Updates Display based on gameboard state.
    const updateDisplay = () => {
        let k = 0;
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                squares[k].innerHTML = gameBoard[i][j];
                k++;
            }
        }
    }

    const announce = (msg) => {
        announcement.innerHTML = msg;
    }
    return {updateDisplay, announce};

})();


// Main logic controller of the game. Includes current turn and players.
const Game = (() => {

    // Game start initializations
    let player1 = Player("Jim", "X");
    let player2 = Player("Steven", "O");
    let currentPlayerTurn = 1;
    let currentPlayer = player1;
    let gameOver = false;

    // This function activates when a player clicks a square.
    // Sets clicked square
    const playerClicked = (square) => {
        if (!gameOver) {
            let setSquareStatus = setSquare(square, currentPlayer.getSymbol());
            let gameStatus = checkStatus();
            DisplayController.updateDisplay();
            if (setSquareStatus == "success" && gameStatus == "none") {
                nextPlayer();
            }
            else if (gameStatus == "draw") {
                DisplayController.announce("Draw!");
                gameOver = true;
            }
            else if (gameStatus == player1.getSymbol()) {
                DisplayController.announce("Congratulations! " + player1.getName() + " has won!");
                gameOver = true;
            }
            else if (gameStatus == player2.getSymbol()) {
                DisplayController.announce("Congratulations! " + player2.getName() + " has won!");
                gameOver = true;
            }
        }
    } 

    const setSquare = (square, symbol) => {
        let id = square.dataset.id;
        let i = parseInt(id[0]);
        let j = parseInt(id[1]);
        if (gameBoard[i][j] == "") {
            gameBoard[i][j] = symbol;
            return "success";
        }
        else {
            return "failed";
        }
    }

    const nextPlayer = () => {
        if (currentPlayer == player1) {
            currentPlayer = player2;
        }
        else {
            currentPlayer = player1;
        }
    }

    // Checks the game Status. 
    // First: check to see if it's a tie from a full board then check for victory conditions.
    // Returns "none", symbol of victorious player, or "draw".
    const checkStatus = () => {
        let filled = true;
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                if (gameBoard[i][j] == "") {
                    filled = false;
                    break;
                }
            }
        }

        return (gameBoard[0][0] == gameBoard[0][1] && gameBoard[0][1] == gameBoard[0][2] && gameBoard[0][0] != "") ? gameBoard[0][0]
           :(gameBoard[1][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[1][2] && gameBoard[1][0] != "") ? gameBoard[1][0]
           :(gameBoard[2][0] == gameBoard[2][1] && gameBoard[2][1] == gameBoard[2][2] && gameBoard[1][0] != "") ? gameBoard[2][0]
           :(gameBoard[0][0] == gameBoard[1][0] && gameBoard[1][0] == gameBoard[2][0] && gameBoard[0][0] != "") ? gameBoard[0][0]
           :(gameBoard[0][1] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][1] && gameBoard[0][1] != "") ? gameBoard[0][1]
           :(gameBoard[0][2] == gameBoard[1][2] && gameBoard[1][2] == gameBoard[2][2] && gameBoard[0][2] != "") ? gameBoard[0][2]
           :(gameBoard[0][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][2] && gameBoard[0][0] != "") ? gameBoard[0][0]
           :(gameBoard[2][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[0][2] && gameBoard[2][0] != "") ? gameBoard[2][0]
           :filled ? "draw"
           :"none"
        ;
    }

    // First: reset gameBoard state to all empty.
    // Second: Update DOM display.
    const resetGame = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = "";
            }
        }
        DisplayController.updateDisplay();
    }



    return {playerClicked};
})();