// N-Queens Game JavaScript
let currentLevel = parseInt(localStorage.getItem('nQueensLevel')) || 1;
let queens = [];
const MAX_LEVEL = 5;

function initializeGame() {
    showMessage('');
    updateLevelSelector();
    document.getElementById('level').textContent = `Level ${currentLevel}`;
    createBoard(getNForLevel(currentLevel));
    queens = [];
}

function getNForLevel(level) {
    return level + 3;
}

function createBoard(n) {
    const board = document.getElementById('board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => placeQueen(i, j, cell));
            board.appendChild(cell);
        }
    }
}

function placeQueen(row, col, cell) {
    if (cell.textContent || cell.classList.contains('blocked')) return;

    cell.textContent = '♛';
    cell.classList.add('queen');
    cell.style.background = '#111';
    cell.style.color = '#fff';
    queens.push({ row, col });

    blockUnsafeCells();
    if (queens.length === getNForLevel(currentLevel)) {
        levelPassed();
    } else if (!hasValidMoves()) {
        showMessage('No valid moves left! Game Over!', 'game-over');
        setTimeout(initializeGame, 2000);
    }
}

function blockUnsafeCells() {
    const n = getNForLevel(currentLevel);
    const board = document.getElementById('board');

    // Clear all previous blocks
    document.querySelectorAll('.cell').forEach(cell => {
        if (!cell.textContent) {
            cell.classList.remove('blocked');
        }
    });

    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const cell = board.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            if (cell && !cell.textContent && !isSafe(row, col)) {
                cell.classList.add('blocked');
            }
        }
    }
}

function isSafe(row, col) {
    return !queens.some(q =>
        q.row === row ||
        q.col === col ||
        Math.abs(q.row - row) === Math.abs(q.col - col)
    );
}

function hasValidMoves() {
    const n = getNForLevel(currentLevel);
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            if (!cell.textContent && !cell.classList.contains('blocked')) {
                return true;
            }
        }
    }
    return false;
}

function undoMove() {
    if (queens.length === 0) return;

    const { row, col } = queens.pop();
    createBoard(getNForLevel(currentLevel));
    const tempQueens = [...queens];
    queens = [];
    tempQueens.forEach(q => {
        const c = document.querySelector(`.cell[data-row="${q.row}"][data-col="${q.col}"]`);
        placeQueen(q.row, q.col, c);
    });
}

function levelPassed() {
    if (currentLevel < MAX_LEVEL) {
        currentLevel++;
        localStorage.setItem('nQueensLevel', currentLevel);
        showMessage('Level Complete!', 'success');
        setTimeout(initializeGame, 1500);
    } else {
        showMessage('All Levels Completed! 🎉', 'success');
    }
}

function updateLevelSelector() {
    const levelList = document.getElementById('levelList');
    levelList.innerHTML = '';

    for (let i = 1; i <= MAX_LEVEL; i++) {
        const levelItem = document.createElement('div');
        levelItem.className = `level-item ${i < currentLevel ? 'completed' : ''} ${i === currentLevel ? 'current' : ''}`;
        levelItem.textContent = `Level ${i}`;
        levelList.appendChild(levelItem);
    }
}

function showMessage(text, className) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = className || '';
}

initializeGame();