const gameBoard = (function () {
    const rows = 3;
    const cols = 3;
    const board = [];

    // Calls nested for loop to initialize the board array - used during restartGame()
    function intialiseBoard() {

        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < cols; j++) {
                board[i][j] = '';
            };
        };

    };

    // Check if cell is valid for players symbol to be placed.
    function placeSymbol(row, col, symbol) {

        if (board[row][col] === '' &&
            board[row][col] != 'X' &&
            board[row][col] != 'O') {
                board[row][col] = symbol;
                return true;
            } else {
                return false;
            };
    };

    // Initialises first instance of board array.
    intialiseBoard();

    return { board, intialiseBoard, placeSymbol }

})();

// Calls gameBoard function.
const boardTest = gameBoard;

// Create gameController function to handle game state.
function gameController() {
    let players = [
        {name: 'Player One',
            symbol: 'X'
        },
        {name: 'Player Two',
            symbol: 'O'
        }
    ];

    const boardInstance = gameBoard.board;

    currentPlayer = players[0];

    let isGameOver = false;

    let roundCounter = 0;

    let info = '';

    // Ternary operator to switch player.
    function switchPlayer() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    // Check's win conditions for rows, columns and diagonals.
    function checkWinner(symbol) {
        const size = boardInstance.length;
        // Rows
        for (let i = 0; i < size; i++) {
            if (boardInstance[i][0] == symbol &&
                boardInstance[i][1] == symbol &&
                boardInstance[i][2] == symbol) {
                    controlTest.isGameOver = true;
                    return true;
                }
        }
        // Columns
        for (let j = 0; j < size; j++) {
            if (boardInstance[0][j] == symbol &&
                boardInstance[1][j] == symbol &&
                boardInstance[2][j] == symbol) {
                    controlTest.isGameOver = true;
                    return true;
                }
        }
        // Diagonals
        if (
            (boardInstance[0][0] == symbol &&
            boardInstance[1][1] == symbol &&
            boardInstance[2][2] == symbol) ||
            (boardInstance[0][2] == symbol &&
            boardInstance[1][1] == symbol &&
            boardInstance[2][0] == symbol)
        ) {
            controlTest.isGameOver = true;
            return true;
        } else {
            return false;
        }
    };

    // Checks tie by counting total rounds played and if isGameOver has not been updated due to successful win condition.
    function checkTie() {
        if (isGameOver == false && controlTest.roundCounter == 9) {
            controlTest.isGameOver = true;
            return true;
        } else {
            return false;
        }
    };

    // Checks isGameOver and if move is valid, returns message to inform player, valid moves are updated on board array - placeSymbol.
    // roundCounter is incremented if move is successful.
    // Win and then Tie conditions checked, message updated.
    // Player switched if no end game conditions are met.
    function playTurn(row, col, symbol) {
        if (controlTest.isGameOver) {
            return { message: 'The game is over, click restart game.'};

        } else {

            const checkValid = boardTest.placeSymbol(row, col, symbol);

                if (!checkValid) {
                    return { message: "You can't go there!" };
                };
            
                    controlTest.roundCounter++

                    if (checkWinner(symbol)) {
                        return { message: `${currentPlayer.name} is the winner!` };
                    };

                    if (checkTie()) {
                        return { message: "It's a tie!" };
                    };
            

                    if (!isGameOver) {
                        switchPlayer();
                        return { message: `It's ${currentPlayer.name}'s turn.` }
                    };
            };
    };

    return {players,
            isGameOver,
            currentPlayer,
            roundCounter,
            info,
            switchPlayer,
            checkWinner,
            checkTie,
            playTurn
        }
};

// Exposes gameController.
const controlTest = gameController();

// gameObject function used to update UI and manage game flow.
function gameObject() {
    
    // Builds board on the DOM.
    function buildBoard() {
        const currentBoard = boardTest.board;

        const mainDiv = document.querySelector('main');
        const container = document.createElement('div');
        container.setAttribute('class', 'container');

        // Create container to hold game-cells
        mainDiv.prepend(container);

        // Nested for loop to create 9 cells with specific data attributes and same class.
        for (let r = 0; r < currentBoard.length; r++) {
            for (let c = 0; c < currentBoard[r].length; c++) {

                const cells = document.createElement('div');
                cells.setAttribute('class', 'game-cell');
                cells.setAttribute('data-rows', [r]);
                cells.setAttribute('data-cols', [c]);
                cells.textContent = currentBoard[r][c];
                container.append(cells);
            };
        };
    };

    // Update specific cell on DOM with player symbol.
    function renderBoard(row, col, symbol) {
        // Selector string targeting data attributes rows and cols.
        const cells = document.querySelectorAll(`.game-cell[data-rows='${row}'][data-cols='${col}']`); 

            // Condition if to check the move is valid.
            if (!controlTest.isGameOver &&
                boardTest.board[row][col] != 'X' &&
                boardTest.board[row][col] != 'O'
                ) {

                    // Loops over each cell to update symbol on DOM element.
                    cells.forEach(cell => {
                        cell.textContent = symbol;
                    });
                };
    };

    // Attaches onclick function to each game-cell.
    function updateCell() {
        const cells = document.querySelectorAll('.game-cell');

        cells.forEach(cell => {
            cell.onclick = function() {
                
                // Targets specific cell using dataset attribute.
                const row = cell.dataset.rows;
                const col = cell.dataset.cols;
                        
                    // Sends data to render in the DOM.
                    renderBoard(row, col, currentPlayer.symbol); 
                    // Triggers playTurn in gameController.
                    turnReturn = controlTest.playTurn(row, col, currentPlayer.symbol);
                    // Sends returned message to gameInfo() to update player.
                    gameInfo(turnReturn.message);
            };
        });
    };
    
    // Resets variables, reinitialise board, update player with gameInfo, render new board with nested for loop.
    function restartGame() {
        currentPlayer = controlTest.players[0];
        controlTest.roundCounter = 0;
        controlTest.isGameOver = false;
        gameBoard.intialiseBoard();
        gameInfo(`It's ${currentPlayer.name}'s turn to start.`);

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                renderBoard([i],[j], '');
            };
        };
    };

    // Attach restartGame to restartButton in DOM.
    function restartButton() {
        const restartButton =  document.querySelector('#restartButton');
        restartButton.addEventListener('click', restartGame);
    };

    // Variables for player name updates.
    const pOneName = document.querySelector('.player-one');
    const pOneUpdate = document.getElementById('playerOneUpdate');
    const pTwoName = document.querySelector('.player-two');
    const pTwoUpdate = document.getElementById('playerTwoUpdate');

    function updatePlayerNames() {

        // Attach enter key as event to player name input field.
        // Target respective player[0]/[1] with item variable.
        // Update player name in player array, update player name in DOM with textContent.
        pOneUpdate.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                    let item = controlTest.players[0];
                        item.name = pOneUpdate.value;
                            pOneName.textContent = item.name;
                };
        });
        pTwoUpdate.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                    let item = controlTest.players[1];
                        item.name = pTwoUpdate.value;
                            pTwoName.textContent = item.name;
                };
        });
    };

    // Game info display.
    const infoTop = document.querySelector('.info-top');
    // Take message are arg, update textContent with arg. Message sent from playTurn() return statement.
    function gameInfo(message) {
        infoTop.textContent = message;
    };

    buildBoard();
    updateCell();
    restartButton();
    updatePlayerNames();

    return { buildBoard, renderBoard, updateCell, restartGame, restartButton, updatePlayerNames, gameInfo }

};

const objectTest = gameObject();