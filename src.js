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
    let form = document.getElementById("player-form");
    let announcement = document.querySelector('.announcements');
    let squares = document.querySelectorAll('.square');
    let resetButton = document.getElementById("reset-button");

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let p1name = document.getElementById("p1name").value;
        let p2name = document.getElementById("p2name").value;
        let p1symbol = document.getElementById("p1symbol").value;
        let p2symbol = document.getElementById("p2symbol").value;

        if (p1symbol.toLowerCase() == p2symbol.toLowerCase()) {
            announce("The two players' symbols can't be the same.");
        }
        else {
            Game.start(squares, p1name, p2name, p1symbol, p2symbol);
        }
    });

    resetButton.addEventListener('click', () => {
        Game.resetBoard();
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

    const resetForm = () => {
        document.getElementById("player-form").reset();
    }

    return {updateDisplay, resetForm, announce};

})();


// Main logic controller of the game. Includes current turn and players.
const Game = (() => {

    // Game start initializations

    const start = (squares, p1name, p2name, p1symbol, p2symbol) => {
        resetBoard();
        let player1 = Player(p1name, p1symbol);
        let player2 = Player(p2name, p2symbol);
        let currentPlayer = player1;
        let bgameOver = false;

        squares.forEach((square) => {
            square.addEventListener('click', () => {
                [bgameOver, currentPlayer] = playerClicked(square, player1, player2, currentPlayer, bgameOver);
            });
        });
    };

    // This function activates when a player clicks a square.
    // Sets clicked square
    const playerClicked = (square, player1, player2, currentPlayer, bgameOver) => {
        if (!bgameOver) {
            let setSquareStatus = setSquare(square, currentPlayer.getSymbol());
            let gameStatus = checkStatus();
            DisplayController.updateDisplay();
            if (setSquareStatus == "success" && gameStatus == "none") {
                currentPlayer = nextPlayer(currentPlayer, player1, player2);
            }
            else if (gameStatus == "draw") {
                DisplayController.announce("Draw!");
                bgameOver = true;
            }
            else if (gameStatus == player1.getSymbol()) {
                DisplayController.announce("Congratulations! " + player1.getName() + " has won!");
                bgameOver = true;
            }
            else if (gameStatus == player2.getSymbol()) {
                DisplayController.announce("Congratulations! " + player2.getName() + " has won!");
                bgameOver = true;
            }

            return [bgameOver, currentPlayer];
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

    const nextPlayer = (currentPlayer, player1, player2) => {
        if (currentPlayer == player1) {
            currentPlayer = player2;
        }
        else {
            currentPlayer = player1;
        }
        return currentPlayer;
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
           :(gameBoard[2][0] == gameBoard[2][1] && gameBoard[2][1] == gameBoard[2][2] && gameBoard[2][0] != "") ? gameBoard[2][0]
           :(gameBoard[0][0] == gameBoard[1][0] && gameBoard[1][0] == gameBoard[2][0] && gameBoard[0][0] != "") ? gameBoard[0][0]
           :(gameBoard[0][1] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][1] && gameBoard[0][1] != "") ? gameBoard[0][1]
           :(gameBoard[0][2] == gameBoard[1][2] && gameBoard[1][2] == gameBoard[2][2] && gameBoard[0][2] != "") ? gameBoard[0][2]
           :(gameBoard[0][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[2][2] && gameBoard[0][0] != "") ? gameBoard[0][0]
           :(gameBoard[2][0] == gameBoard[1][1] && gameBoard[1][1] == gameBoard[0][2] && gameBoard[2][0] != "") ? gameBoard[2][0]
           :filled ? "draw": "none";
    }

    // First: reset gameBoard state to all empty.
    // Second: Update DOM display.
    const resetBoard = () => {
        for (let i = 0; i < gameBoard.length; i++) {
            for (let j = 0; j < gameBoard[i].length; j++) {
                gameBoard[i][j] = "";
            }
        }
        DisplayController.updateDisplay();
        DisplayController.announce("Board has been reset!");
    }

    return {playerClicked, resetBoard, start};
})();