const socket = io('http://34.125.134.191:3000');

let playerType = null;
let gameCode = null;
let isGameStarted = false;
let isMeeting = false;
let admin = false;
let generatedCode = null;
let isMusicPlaying = false;
const backgroundMusic = document.getElementById('backgroundMusic');

document.getElementById('selectBride').addEventListener('click', () => {
    playerType = 'bride';
	console.log("player type: "+playerType);
    showCodeGeneration();
});

document.getElementById('selectGroom').addEventListener('click', () => {
    playerType = 'groom';
	console.log("player type: "+playerType);
    showCodeGeneration();
});

document.getElementById('generateCodeBtn').addEventListener('click', () => {
    admin = true;
	console.log("is admin: "+admin);
    showStartGame1();
	generatedCode = generateGameCode();
    document.getElementById('codeGenerated').innerHTML = `<p>Your generated code: ${generatedCode} </p>`;
	console.log("generatedCode is : "+generatedCode);
});

document.getElementById('enterCodeBtn').addEventListener('click', () => {
    console.log("is admin: "+admin);
    showStartGame2();
});

function generateGameCode() {
    // Generate a random 4-digit code
    return Math.floor(1000 + Math.random() * 9000).toString();
};

document.getElementById('startGame').addEventListener('click', () => {
	if(admin) { gameCode = generatedCode; }
	else { gameCode = document.getElementById('code').value;}
	
	console.log("gameCode: "+gameCode);
    if (gameCode.length === 4) {
        socket.emit('joinGame', { playerType, gameCode });
        startGame();
    } else {
        alert('Please enter a 4-digit code.');
    }  
});

socket.on('gameJoined', () => {
    startGame();
});

function showCodeGeneration() {
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('codeGeneration').style.display = 'block';
};

function showStartGame1() {
    document.getElementById('codeGeneration').style.display = 'none';
    document.getElementById('codeAccept1').style.display = 'block';
    document.getElementById('codeInput').style.display = 'block';
};

function showStartGame2() {
    document.getElementById('codeGeneration').style.display = 'none';
    document.getElementById('codeAccept2').style.display = 'block';
    document.getElementById('codeInput').style.display = 'block';
};

function startGame() {
    document.getElementById('selectionScreen').style.display = 'none';
    document.getElementById('codeAccept1').style.display = 'none';
    document.getElementById('codeAccept2').style.display = 'none';
    document.getElementById('codeInput').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';

    if (playerType === 'bride') {
		console.log("Game Started, player type: "+playerType);
        document.getElementById('groom').style.pointerEvents = 'none';
    } else if (playerType === 'groom') {
		console.log("Game Started, player type: "+playerType);
        document.getElementById('bride').style.pointerEvents = 'none';
    }
    backgroundMusic.play().catch(error => {
        console.log('Background music play failed:', error);
    });
    startTimer();
}

document.addEventListener('keydown', (event) => {
    if (!isGameStarted) {
        isGameStarted = true;
		musicControl.innerHTML = "Pause Music";
    }

    let direction;
    switch (event.key) {
        case 'a':
            if (playerType) {
				direction = 'left';
				console.log("clicked "+event.key);
			}
            break;
        case 'd':
            if (playerType){
				direction = 'right';
				console.log("clicked "+event.key);
			}
            break;
        case 'w':
            if (playerType){
				direction = 'up';
				console.log("clicked "+event.key);
			}
            break;
        case 's':
            if (playerType){
				direction = 'down';
				console.log("clicked "+event.key);
			}
            break;
    }

    if (direction) {
		console.log("direction is "+direction);
        socket.emit('move', { playerType, direction, gameCode });
		moveCharacter(document.getElementById(playerType), direction);
    }
});

function toggleMusic() {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicControl.innerHTML = "Play Music";
    } else {
        backgroundMusic.play().catch(error => {
            console.log('Background music play failed:', error);
        });
        musicControl.innerHTML = "Pause Music";
    }
    isMusicPlaying = !isMusicPlaying;
}

socket.on('move', (data) => {
    moveCharacter(document.getElementById(data.playerType), data.direction);
});

const bride = document.getElementById('bride');
const groom = document.getElementById('groom');
const gameArea = document.getElementById('gameArea');
const grassPatches = document.querySelectorAll('.grass');

const moveCharacter = (character, direction) => {
    const step = 10;
    const characterRect = character.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();

    let newLeft = character.offsetLeft;
    let newTop = character.offsetTop;

    switch (direction) {
        case 'left':
            if (characterRect.left > gameRect.left) newLeft -= step;
			console.log("moved "+character+" in "+direction+" direction");
            break;
        case 'right':
            if (characterRect.right < gameRect.right) newLeft += step;
			console.log("moved "+character+" in "+direction+" direction");
            break;
        case 'up':
            if (characterRect.top > gameRect.top) newTop -= step;
			console.log("moved "+character+" in "+direction+" direction");
            break;
        case 'down':
            if (characterRect.bottom < gameRect.bottom) newTop += step;
			console.log("moved "+character+" in "+direction+" direction");
            break;
    }

    // Check for collision with grass patches
    let collision = false;
    grassPatches.forEach(grass => {
        const grassRect = grass.getBoundingClientRect();
        if (newLeft < grassRect.right - gameRect.left &&
            newLeft + characterRect.width > grassRect.left - gameRect.left &&
            newTop < grassRect.bottom - gameRect.top &&
            newTop + characterRect.height > grassRect.top - gameRect.top) {
            collision = true;
        }
    });

    if (!collision) {
        character.style.left = `${newLeft}px`;
        character.style.top = `${newTop}px`;
    }

    // Check if bride and groom meet
    checkMeet();
};

const checkMeet = () => {
    const brideRect = bride.getBoundingClientRect();
    const groomRect = groom.getBoundingClientRect();

    if (brideRect.left < groomRect.right &&
        brideRect.right > groomRect.left &&
        brideRect.top < groomRect.bottom &&
        brideRect.bottom > groomRect.top) {

        // Change characters to heart symbol
        if (!isMeeting) {
            bride.innerHTML = '💓';
            groom.innerHTML = '';
            bride.style.backgroundImage = "none";  // Set background image to none for bride
            groom.style.backgroundImage = "none";  // Set background image to none for groom
            isMeeting = true;
            stopTimer();
        }
    } else {
        // Revert back to original characters
        if (isMeeting) {
            bride.innerHTML = '';
            groom.innerHTML = '';
            bride.style.backgroundImage = "url('bride.png')";
            groom.style.backgroundImage = "url('groom.png')";
            isMeeting = false;
        }
    }
};

let startTime;
let timerInterval;

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsedTime = Date.now() - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);

    document.getElementById('timer').textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
}

socket.on('gameJoined', () => {
    startGame();
});
