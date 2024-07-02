const bride = document.getElementById('bride');
const groom = document.getElementById('groom');
const gameArea = document.getElementById('gameArea');
const grassPatches = document.querySelectorAll('.grass');
const backgroundMusic = document.getElementById('backgroundMusic');

let isMeeting = false;
let isGameStarted = false;
let isMusicPlaying = false;

const moveCharacter = (character, direction) => {
    const step = 10;
    const characterRect = character.getBoundingClientRect();
    const gameRect = gameArea.getBoundingClientRect();

    let newLeft = character.offsetLeft;
    let newTop = character.offsetTop;

    switch(direction) {
        case 'left':
            if (characterRect.left > gameRect.left) newLeft -= step;
            break;
        case 'right':
            if (characterRect.right < gameRect.right) newLeft += step;
            break;
        case 'up':
            if (characterRect.top > gameRect.top) newTop -= step;
            break;
        case 'down':
            if (characterRect.bottom < gameRect.bottom) newTop += step;
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

document.addEventListener('keydown', (event) => {
	if (!isGameStarted) {
        startGame();
        isGameStarted = true;
		musicControl.innerHTML = "Pause Music";
    }
	
    switch(event.key) {
        case 'a':
            moveCharacter(bride, 'left');
            break;
        case 'd':
            moveCharacter(bride, 'right');
            break;
        case 'w':
            moveCharacter(bride, 'up');
            break;
        case 's':
            moveCharacter(bride, 'down');
            break;
        case 'ArrowLeft':
            moveCharacter(groom, 'left');
            break;
        case 'ArrowRight':
            moveCharacter(groom, 'right');
            break;
        case 'ArrowUp':
            moveCharacter(groom, 'up');
            break;
        case 'ArrowDown':
            moveCharacter(groom, 'down');
            break;
    }
});

function startGame() {
    backgroundMusic.play().catch(error => {
        console.log('Background music play failed:', error);
    });
}

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
