const imageFolderPath = "../PhotoSection/Marriage/Pics/"; // Path to the folder containing images
const images = ["puzzle5.jpg","puzzle4.jpg","puzzle3.jpg","puzzle4.jpg","puzzle5.jpg"]; // Manually update this array with your image filenames

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initPuzzle() {
    startGame();
}

function startGame() {
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImageSrc = images[randomIndex];

    const container = document.getElementById('puzzle-container');
    container.innerHTML = ''; // Clear existing pieces
    container.classList.remove('solved');
    document.getElementById('message').innerText = '';
    document.getElementById('play-again').style.display = 'none';

    const positions = [];
    for (let i = 0; i < 25; i++) {
        positions.push({ x: i % 5, y: Math.floor(i / 5) });
    }

    shuffle(positions);

    positions.forEach((pos, i) => {
        const puzzlePiece = document.createElement('div');
        puzzlePiece.classList.add('puzzle-piece');
        puzzlePiece.style.backgroundImage = `url('${imageFolderPath}${randomImageSrc}')`;
        puzzlePiece.style.backgroundPosition = `-${pos.x * 100}px -${pos.y * 100}px`;
        puzzlePiece.setAttribute('data-position', `${pos.x}-${pos.y}`);
        container.appendChild(puzzlePiece);
    });

    let draggedElement = null;

    container.addEventListener('dragstart', function (e) {
        if (e.target.className.includes('puzzle-piece')) {
            draggedElement = e.target;
            setTimeout(() => {
                e.target.style.visibility = 'hidden';
            }, 0);
        }
    });

    container.addEventListener('dragend', function (e) {
        if (draggedElement) {
            setTimeout(() => {
                draggedElement.style.visibility = 'visible';
                draggedElement = null;
                checkSolution();
            }, 0);
        }
    });

    container.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    container.addEventListener('drop', function (e) {
        e.preventDefault();
        if (e.target.className.includes('puzzle-piece')) {
            const draggedPos = draggedElement.style.backgroundPosition;
            const targetPos = e.target.style.backgroundPosition;
            draggedElement.style.backgroundPosition = targetPos;
            e.target.style.backgroundPosition = draggedPos;
            [draggedElement.dataset.position, e.target.dataset.position] = [e.target.dataset.position, draggedElement.dataset.position];
        }
    });

    document.querySelectorAll('.puzzle-piece').forEach(piece => {
        piece.setAttribute('draggable', true);
    });
}

function checkSolution() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    let isSolved = true;

    pieces.forEach((piece, i) => {
        const correctPosition = `${i % 5}-${Math.floor(i / 5)}`;
        if (piece.dataset.position !== correctPosition) {
            isSolved = false;
        }
    });

    if (isSolved) {
        document.getElementById('puzzle-container').classList.add('solved');
        document.getElementById('message').innerText = 'Happy Anniversary!';
        document.getElementById('play-again').style.display = 'block';
        document.getElementById('play-again').style.display = 'inline-block';
		document.getElementById('puzzle-container').style.gap='0px';
    }
}

document.getElementById('play-again').addEventListener('click', startGame);

document.addEventListener('DOMContentLoaded', initPuzzle);
