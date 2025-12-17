// GAMEBOARD COMPNENT
const gameBoard = (function () {
    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = '';
        };
    };

    function buildBoard() {

    const currentBoard = board;

    const mainDiv = document.querySelector('main');
    const container = document.createElement('div');
    container.setAttribute('class', 'container');
    
    mainDiv.prepend(container);

        for (let r = 0; r < currentBoard.length; r++) {
            for (let c = 0; c < currentBoard[r].length; c++) {

                const cells = document.createElement('div');
                    cells.setAttribute('class','game-cell');
                    cells.setAttribute('data-row',[r]);
                    cells.setAttribute('data-col',[c]);
                    cells.textContent = currentBoard[r][c];
                    container.append(cells);
            };
        };
    };

    function placeSymbol(row, col, symbol) {
        // Check if space is empty
        if (board[row][col] === '' &&
            board[row][col] != 'X' &&
            board[row][col] != 'O') {
                board[row][col] = symbol;
                testBoard.roundCounter++;
                return true;
        } else {
            console.log("You can't go here!");
            return false;
        }
    };

    buildBoard(); // Initialize buildBoard instance.

    return { board, placeSymbol, buildBoard };

})();

// GAMECONTROLLER
function gameController() {

    let players = [
        {
            name: "Player One",
            symbol: 'X'
        },
        {
            name: "Player Two",
            symbol: 'O'
        }
    ];

    currentPlayer = players[0];

    let isGameOver = false;

    let roundCounter = 0;

    // creates instance of gameBoard();
    const boardInstance = gameBoard.board;

    // reference topInfo and use a function to expose the updated message.
    let topInfo = '';
    function getTopInfo() { return topInfo };

    function switchPlayer() {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    function checkWinner(symbol) {

        const size = boardInstance.length;

        // Loop over each array
        for (let i = 0; i < size; i++) {

            // Rows
            if ( 
                boardInstance[i][0] == symbol &&
                boardInstance[i][1] == symbol &&
                boardInstance[i][2] == symbol) {
                    topInfo = `${currentPlayer.name} is the winner!`;
                    testBoard.isGameOver = true;
                    return;
                };
        };
            // Loop over array...
            for (let j = 0; j < size; j++) {
                 console.log("Row " + j + ":", boardInstance[j]);

                // Cols
                if (
                    boardInstance[0][j] == symbol &&
                    boardInstance[1][j] == symbol &&
                    boardInstance[2][j] == symbol) {
                        topInfo = `${currentPlayer.name} is the winner!`;
                        testBoard.isGameOver = true;
                        return;
                    };
        };
        
        // Diags
        if (
            (boardInstance[0][0] == symbol &&
            boardInstance[1][1] == symbol &&
            boardInstance[2][2] == symbol) ||
            (boardInstance[0][2] == symbol &&
            boardInstance[1][1] == symbol &&
            boardInstance[2][0] == symbol)) {
                topInfo = `${currentPlayer.name} is the winner!`;
                testBoard.isGameOver = true;
                return;
        };
    };

    function checkTie() {
        if (testBoard.roundCounter === 9 && isGameOver === false) {
            testBoard.isGameOver =  true;
            topInfo = "It's a tie!";
            return;
        } else {
            return;
        };
    };

    function resetBoard() {
        boardInstance.forEach(innerArray => {
            innerArray.forEach(clear);
        });

        function clear(element, index, array) {
           array[index] = '';
        };
    };

    function restartGame() {

        resetBoard();

        topInfo = `It is ${currentPlayer.name}'s turn.`;
        gameTest.infoTop.textContent = topInfo;

        testBoard.roundCounter = 0;

        testBoard.isGameOver = false;

        currentPlayer = players[0];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameTest.renderBoard([i],[j], '');
            };
        };
    };

    function playTurn(row, col, symbol) {

        if (testBoard.isGameOver === true) {
            topInfo = "The game is over";
        } else {

            // Check if placeSymbol returns true, prevents checkTie and switchPlayer running on invalid move.
            const symbolCheck = gameBoard.placeSymbol(row, col, symbol);

                if (symbolCheck) {

                    // Update and render move on board.
                    gameTest.renderBoard(row, col, symbol);

                    if (symbolCheck === false) {
                        return;
                    } else {

                        checkWinner(currentPlayer.symbol);
                        if (testBoard.isGameOver === true) {
                            return;
                        }
                            checkTie();
                            if (testBoard.isGameOver === true) {
                                return;
                            } else {
                                switchPlayer();
                                topInfo = `It is ${currentPlayer.name}'s turn.`
                            };
                        };

                } else return;

            };
        };  

    return { boardInstance, 
             players, 
             currentPlayer, 
             isGameOver, 
             roundCounter,
             topInfo,
             getTopInfo,
             switchPlayer, 
             checkWinner, 
             checkTie,
             resetBoard, 
             restartGame,
             playTurn };
};

const testBoard = gameController();

    // testBoard.playTurn(0,0,currentPlayer.symbol);

const gameObject = (function () {

    // Use a selector string to dynamically update target cell with args from renderBoard. Board is rendered during playTurn.
    function renderBoard(row, col, symbol) {
        const targetCell = "[data-row='" + row + "'][data-col='" + col + "']";
        const cell = document.querySelector(targetCell);
        cell.textContent = symbol;
    };

    // Update Players Names
    const playerOne = document.querySelector('.player-one');
    const playerOneName = document.getElementById('playerOneUpdate');
    const playerTwo = document.querySelector('.player-two');
    const playerTwoName = document.getElementById('playerTwoUpdate');

        playerOneName.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault;
                testBoard.players.forEach(item => {
                    if (item.name === 'Player One' ||
                        item.name === playerOne.textContent) {
                            item.name = playerOneName.value;
                            playerOne.textContent = item.name;
                        };
                });
            };
        });

        playerTwoName.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault;
                    testBoard.players.forEach(item => { 
                        if (item.name === 'Player Two' ||
                            item.name === playerTwo.textContent) {
                                item.name = playerTwoName.value;
                                playerTwo.textContent = item.name;
                            };
                    });
            };
        });

    // Attach listeners for game play
    const cells = document.querySelectorAll('.game-cell');

    // Game state messages
    const infoTop = document.querySelector('.info-top');
    const infoBottom = document.querySelector('.info-bottom');
        
        cells.forEach(cell => {
            cell.onclick = function() {
                const row = this.dataset.row;
                const col = this.dataset.col;
                testBoard.playTurn(row,col,currentPlayer.symbol)
                
                // Update game state info in infoTop
                const newTopInfo = testBoard.getTopInfo();
                infoTop.textContent = newTopInfo;
            };
        });

    // Restart game button
    function restartGame() {
        const restartButton = document.querySelector('restartButton');

        if (testBoard.isGameOver == false) {
            restartButton.style.display = 'block';
        } else {
            restartButton.style.display = 'none';
        };
    };
            restartButton.addEventListener('click', function() {
            testBoard.restartGame();
        });

    return { renderBoard, infoTop, infoBottom, restartGame }

})();

const gameTest = gameObject;

gameTest.renderBoard();