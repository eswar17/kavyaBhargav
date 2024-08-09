const imageFolderPath = "../PhotoSection/Marriage/Pics/"; // Path to the folder containing images
const images =["puzzle1.jpg", "puzzle2.jpg", "puzzle3.jpg", "puzzle4.jpg", "puzzle5.jpg","puzzle6.jpg","puzzle7.jpg","puzzle8.jpg","puzzle9.jpg","puzzle10.jpg","puzzle11.jpg", "puzzle12.jpg", "puzzle13.jpg", "puzzle14.jpg", "puzzle15.jpg","puzzle16.jpg","puzzle17.jpg","puzzle18.jpg"]; // Manually update this array with your image filenames

let timerInterval; // To store the timer interval ID
let timeElapsed = 0; // To track the elapsed time in seconds
let timerStarted = false; // To check if the timer has started
let draggedElement = null; // To store the currently dragged element

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
    document.getElementById('puzzle-container').style.gap = '4px';
    resetTimer();

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

    // Add event listeners for drag and drop
    addEventListenersForDragAndDrop(container);
}

function addEventListenersForDragAndDrop(container) {
    container.addEventListener('dragstart', function (e) {
        handleDragStart(e);
    });

    container.addEventListener('dragend', function (e) {
        handleDragEnd(e);
    });

    container.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    container.addEventListener('drop', function (e) {
        handleDrop(e);
    });

    // Add touch event listeners for mobile
    container.addEventListener('touchstart', function (e) {
        handleTouchStart(e);
    });

    container.addEventListener('touchmove', function (e) {
        handleTouchMove(e);
    });

    container.addEventListener('touchend', function (e) {
        handleTouchEnd(e);
    });

    document.querySelectorAll('.puzzle-piece').forEach(piece => {
        piece.setAttribute('draggable', true);
    });
}

function handleDragStart(e) {
    if (e.target.className.includes('puzzle-piece')) {
        if (!timerStarted) {
            startTimer();
        }
        draggedElement = e.target;
        setTimeout(() => {
            e.target.style.visibility = 'hidden';
        }, 0);
    }
}

function handleDragEnd(e) {
    if (draggedElement) {
        setTimeout(() => {
            draggedElement.style.visibility = 'visible';
            draggedElement = null;
            checkSolution();
        }, 0);
    }
}

function handleDrop(e) {
    e.preventDefault();
    if (e.target.className.includes('puzzle-piece')) {
        swapPieces(e.target);
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    if (!timerStarted) {
        startTimer();
    }
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.className.includes('puzzle-piece')) {
        draggedElement = target;
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (draggedElement && target && target !== draggedElement && target.className.includes('puzzle-piece')) {
        swapPieces(target);
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (draggedElement) {
        checkSolution();
        draggedElement = null;
    }
}

function swapPieces(target) {
    const draggedPos = draggedElement.style.backgroundPosition;
    const targetPos = target.style.backgroundPosition;
    draggedElement.style.backgroundPosition = targetPos;
    target.style.backgroundPosition = draggedPos;
    [draggedElement.dataset.position, target.dataset.position] = [target.dataset.position, draggedElement.dataset.position];
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
        stopTimer();
		var message="";
		if (timeElapsed <= 60) {
			message = "Maanchi speed undhi neelo";
		} else if (timeElapsed > 60 && timeElapsed <= 75) {
			message = "Inkonchem focus cheii";
		} else {
			message = "Speed penchali Bujji";
		}
        document.getElementById('puzzle-container').classList.add('solved');
        document.getElementById('message').innerText = `${message} - Time: ${timeElapsed} seconds`;
        document.getElementById('play-again').style.display = 'block';
        document.getElementById('play-again').style.display = 'inline-block';
        document.getElementById('puzzle-container').style.gap = '0px';
        document.getElementById('play-again').style.backgroundColor = '#28EB0B';
        document.getElementById('play-again').style.color = '#1C5099';
        document.getElementById('play-again').addEventListener('mouseover', function () {
            this.style.backgroundColor = '#0056b3';
			 this.style.color = '#28EB0B';
        });
        document.getElementById('play-again').addEventListener('mouseout', function () {
            this.style.backgroundColor = '#28EB0B';
			this.style.color = '#1C5099';
        });
    }
}

function startTimer() {
    timerStarted = true;
    timeElapsed = 0;
    timerInterval = setInterval(() => {
        timeElapsed++;
        document.getElementById('message').innerText = `Time: ${timeElapsed} seconds`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerStarted = false;
}

function resetTimer() {
    stopTimer();
    document.getElementById('message').innerText = '';
}

document.getElementById('play-again').addEventListener('click', startGame);

document.addEventListener('DOMContentLoaded', initPuzzle);
