function Gameboard() {
    const row = 3;
    const col = 3;
    const board = [];
    let gameOver = false;

    getGameOver = () => gameOver;

    // 2d nested arrays, push cell()

    for (let i = 0; i < row; i++) {
    board[i] = [];
        for (let j = 0; j < col; j++) {
            board[i].push(Cell());
        }
    };
    
    const getBoard = () => board;

    const placeSymbol = (row, col, player) => {
        if (board[row][col].getValue() === 0) {
            board[row][col].setValue(player);
            console.log(`Placed ${player} at row ${row}, column ${col}`);
        } else {
            console.log("You can't go here");
        }
    };

    const getBoardValues = () => board.map((row) => row.map((cell) => cell.getValue()));

    const printBoard = () => console.log(getBoardValues());

    const checkConditions = () => {

        const currentBoard = getBoardValues();

        for (let i = 0; i < board.length; i++) {
            if (currentBoard[i][0] != 0 && 
                currentBoard[i][0] === currentBoard[i][1] && 
                currentBoard[i][1] === currentBoard[i][2]) {
                    console.log(`Player ${currentBoard[i][0]} is the winner - rows`);
                    gameOver = true;
                    return currentBoard[i][0];
                // return `test-rows`;
            }
        }
        // Check cols
        for (let i = 0; i < board[0].length; i++) {
            if (currentBoard[0][i] != 0 && 
                currentBoard[0][i] === currentBoard[1][i] && 
                currentBoard[1][i] === currentBoard[2][i]) {
                    console.log(`Player ${currentBoard[i][0]} is the winner - cols`);
                    gameOver = true;
                    return currentBoard[0][i];
                //  return `test-cols`;
            }
        }
        // Check diagonals
        if (currentBoard[0][0] != 0 && 
            currentBoard[0][0] === currentBoard[1][1] && 
            currentBoard[1][1] === currentBoard[2][2]) {
                console.log(`Player ${currentBoard[i][0]} is the winner - diags1`);
                gameOver = true;
                return currentBoard[0][0];
        }
         if (currentBoard[0][2] != 0 && 
            currentBoard[0][2] === currentBoard[1][1] && 
            currentBoard[1][1] === currentBoard[2][0]) {
                console.log(`Player ${currentBoard[i][0]} is the winner - diags2`);
                gameOver = true;
                return currentBoard[0][0];
        }

        return null;
    };

    return { board, getGameOver, getBoard, placeSymbol, printBoard, checkConditions };

};

// Closure Factory - creates cell object with data inside ie cell value;
function Cell() {
    let value = 0;

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
            symbol: 1
        },
        {
            name: "Player Two",
            symbol: 2
        }
    ];

    const board = Gameboard();

    let roundCounter = 0;

    let currentPlayer = players[0];

    const switchActivePlayer = () => {

        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];

    };

    const printNewRound = () => {
        board.printBoard();
        console.log(`It's ${currentPlayer.name}'s turn to move.`);
    };

    const playRound = (row, col, player) => {
        console.log(`${currentPlayer.name} went in row ${row}, column ${col}.`);

        board.placeSymbol(row, col, player);

        board.checkConditions();

        board.printBoard();

        // Check if a win condition has been met
        if (board.getGameOver()) return;

        // Increment counter for tie condition
        roundCounter++;
            // Check tie condition
            if (roundCounter >= 9) {
                console.log(`It's a tie`);
                return;
            }

        // console.log(roundCounter);

        switchActivePlayer();
        printNewRound();

    };

    printNewRound();

    // Getter function to access private variables such as currentPlayer, not required for publish
    // const peekCurrentPlayer = () => currentPlayer;

    return { switchActivePlayer, printNewRound, playRound };
};

const test = Gameboard();

const controlTest = Gamecontroller();

controlTest.playRound(0, 0, 1);
controlTest.playRound(1, 0, 1);
controlTest.playRound(2, 0, 2);

controlTest.playRound(0, 1, 2);
controlTest.playRound(1, 1, 2);
controlTest.playRound(2, 1, 1);

controlTest.playRound(0, 2, 1);
controlTest.playRound(1, 2, 1);
controlTest.playRound(2, 2, 1);