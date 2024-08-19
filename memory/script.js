const imageFolderPath = "../PhotoSection/Marriage/Pics/";
const images = ["puzzle3.jpg", "puzzle6.jpg", "puzzle7.jpg", "puzzle8.jpg","puzzle9.jpg","puzzle10.jpg", "puzzle11.jpg", "puzzle12.jpg", "puzzle4.jpg","puzzle5.jpg"]; // Update with actual image filenames

let memoryGameArray = [...images, ...images]; // Duplicate images for pairs
let memoryGameContainer = document.getElementById('memory-game');
let memoryMessage = document.getElementById('memory-message');
let playMemoryAgainButton = document.getElementById('play-memory-again');
let timerDisplay = document.getElementById('memory-timer');
let firstCard, secondCard;
let lockBoard = false;
let startTime, timerInterval;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        timerDisplay.innerText = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function initMemoryGame() {
    shuffle(memoryGameArray);
    memoryGameContainer.innerHTML = '';
    memoryGameArray.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.image = image;

        const cardFront = document.createElement('img');
        cardFront.src = `${imageFolderPath}${image}`;
        cardFront.classList.add('front-face');
        card.appendChild(cardFront);

        const cardBack = document.createElement('div');
        cardBack.classList.add('back-face');
        card.appendChild(cardBack);

        card.addEventListener('click', flipCard);
        memoryGameContainer.appendChild(card);
    });

    memoryMessage.innerText = '';
    playMemoryAgainButton.style.display = 'none';
    timerDisplay.innerText = 'Time: 0:00';

    resetBoard();
    startTimer();
}

function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();

    if (document.querySelectorAll('.memory-card:not(.flip)').length === 0) {
        memoryMessage.innerText = 'hmm ok!';
        playMemoryAgainButton.style.display = 'inline-block';
        memoryMessage.style.display = 'block';
        stopTimer();
    }
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

document.getElementById('play-memory-again').addEventListener('click', initMemoryGame);

document.addEventListener('DOMContentLoaded', initMemoryGame);
