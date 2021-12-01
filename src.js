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
    let squares = document.querySelectorAll('.square');
    let pressedSquare = "";
    squares.forEach((square) => {
        square.addEventListener('click', () => {
            Game.playerClicked(square);
        });
    });

    const getSquare = () => pressedSquare;
    const setSquare = (square, symbol) => {
        square.innerHTML = symbol;
    }
    
    return {getSquare, setSquare};

})();

// let player1 = Player("Jim", "X");
// let currentSquare = DisplayController.getSquare();
// DisplayController.setSquare(currentSquare, player1.getSymbol);

// Main logic controller of the game. Includes current turn and players.
const Game = (() => {
    let player1 = Player("Jim", "X");
    let player2 = Player("Steven", "O");

    let currentPlayerTurn = 1;
    let currentPlayer = player1;

    // This function activates when a player clicks a square.
    // Sets clicked square
    const playerClicked = (square) => {
        if (currentPlayerTurn == 1) {
            currentPlayerTurn = 0;
            currentPlayer = player1;
        }
        else {
            currentPlayerTurn = 1;
            currentPlayer = player2;
        }
        DisplayController.setSquare(square, currentPlayer.getSymbol());
    } 

    return {playerClicked};
})();