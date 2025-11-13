function Gameboard() {
    const row = 3;
    const col = 3;
    const board = [];

    const getBoard = () => board;

    let gameOver = false;
    getGameOver = () => gameOver;

    let roundCounter = 0;

    // 2d nested arrays, push cell()
    for (let i = 0; i < row; i++) {
    board[i] = [];
        for (let j = 0; j < col; j++) {
            board[i].push(Cell());
        }
    };

    const placeSymbol = (row, col, player) => {

        if (board[row][col].getValue() === '') {
            board[row][col].setValue(player);
            console.log(`Placed ${player} at row ${row}, column ${col}`);
                    // Check tie condition
                    roundCounter++;
                    if (roundCounter >= 9) {
                        console.log(`It's a tie`);
                        gameOver = true;
                        return;
                    };
            return true;
        } else {
            console.log("You can't go here");
            return false;
        };  
    };

    const getBoardValues = () => board.map((row) => row.map((cell) => cell.getValue()));

    const printBoard = () => console.log(getBoardValues());

    const checkConditions = () => {

        const currentBoard = getBoardValues();
        // Check rows
        for (let i = 0; i < board.length; i++) {
            if (currentBoard[i][0] != '' && 
                currentBoard[i][0] === currentBoard[i][1] && 
                currentBoard[i][1] === currentBoard[i][2]) {
                    console.log(`Player ${currentBoard[i][0]} is the winner - rows`);
                    gameOver = true;
                    return currentBoard[i][0];
            }
        }
        // Check cols
        for (let i = 0; i < board.length; i++) {
            if (currentBoard[0][i] != '' && 
                currentBoard[0][i] === currentBoard[1][i] && 
                currentBoard[1][i] === currentBoard[2][i]) {
                    console.log(`Player ${currentBoard[i][0]} is the winner - cols`);
                    gameOver = true;
                    return currentBoard[0][i];
            }
        }
        // Check diagonals
        if (currentBoard[0][0] != '' && 
            currentBoard[0][0] === currentBoard[1][1] && 
            currentBoard[1][1] === currentBoard[2][2]) {
                console.log(`Player ${currentBoard[1][1]} is the winner - diags1`);
                gameOver = true;
                return currentBoard[0][0];
        }
         if (currentBoard[0][2] != '' && 
            currentBoard[0][2] === currentBoard[1][1] && 
            currentBoard[1][1] === currentBoard[2][0]) {
                console.log(`Player ${currentBoard[1][1]} is the winner - diags2`);
                gameOver = true;
                return currentBoard[0][0];
        }
        return null;
    };

    return { board, getGameOver, getBoard, placeSymbol, getBoardValues, printBoard, checkConditions };

};

// Closure Factory - creates cell object with data inside ie cell value;
function Cell() {
    let value = '';

    const setValue = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { setValue, getValue }
};


function Gamecontroller() {
    players = [
        {
            name: "Player One",
            symbol: 'X'
        },
        {
            name: "Player Two",
            symbol: 'O'
        }
    ];

    const boardInstance = Gameboard();

    let currentPlayer = players[0];

    const switchActivePlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        console.log(`It's ${currentPlayer.name}'s turn to move.`);
    };

    // const printNewRound = () => {
    //     // boardInstance.printBoard();
    //     console.log(`It's ${currentPlayer.name}'s turn to move.`);
    // };

    const playRound = (row, col, player) => {

        if (!boardInstance.placeSymbol(row, col, player)) return;

        boardInstance.checkConditions();

        // boardInstance.printBoard();

        // Check if a win condition has been met
        if (boardInstance.getGameOver()) return;

            switchActivePlayer();

    };

    // printNewRound();

    // Getter function to access private variables such as currentPlayer, not required for publish
    const getCurrentPlayer = () => currentPlayer;

    return { boardInstance, switchActivePlayer, playRound, getCurrentPlayer };
};


function gameObject(gameInstance) {

    const cells = document.querySelectorAll('.game-cell');

    const populateBoard = () => {

        const currentBoard = gameInstance.boardInstance.getBoardValues();
            cells.forEach((cell) => {
                const r = cell.dataset.row;
                const c = cell.dataset.col;
                cell.textContent = currentBoard[r][c];
            });
    };

    const playerMove = () => {

        function handleClick(e) {
            if (gameInstance.boardInstance.getGameOver()) return;
                const cell = e.target;
                const activePlayer = gameInstance.getCurrentPlayer();
                const row = cell.dataset.row;
                const col = cell.dataset.col;

                gameInstance.playRound(row, col, activePlayer.symbol);
                populateBoard();

            if (gameInstance.boardInstance.getGameOver()) {
                runGameOver(activePlayer);
            };
        };

        cells.forEach(cell => {
            cell.addEventListener('click', handleClick);
        });

        function runGameOver(player) {
        
            cells.forEach(cell => {
                cell.removeEventListener('click', handleClick);
            });

            const infoContainer = document.getElementById('game-info');
            infoContainer.innerHTML = `<p>End Game - ${player.name} wins!</p>`;

            const startBtn = document.getElementById('start');
            startBtn.style.display = 'none';
            const resetBtn = document.getElementById('reset');
            resetBtn.style.display = 'block';

            resetBtn.addEventListener('click', () => { // Stuck here beginging to figure out reset process

                // reset board (cells), current player, etc.

                    cells.forEach(cell => {
                        cell.setValue('');
                    });

            });
        };
    };

    return { populateBoard, playerMove }
};

const controlTest = Gamecontroller();

const ui = gameObject(controlTest);

ui.populateBoard();

ui.playerMove();

// Task 1:

// Task 2:
// reset button;
// change player name functionality - see adding 2 args for Gamecontroler and updating the players object array.
// stylise html page for publish.