let gameActive = false;
const scoreDisplay = document.getElementById('score');

document.addEventListener('DOMContentLoaded', () => {
    // Haal een verwijzing naar het startscherm op
    const startScreen = document.getElementById('start-screen');
    const startButton = document.getElementById('start-button');
    const finalScoreDisplay = document.getElementById('final-score');
    const replayButton = document.getElementById('replay-button');
    const replayScreen = document.getElementById('replay-screen');
    const movableImage = document.getElementById('movable-image');
    let currentPositionX = 0;
    let currentPositionY = 0;
    let flipped = false;
            
    // Haal een verwijzing naar het beweegbare beeld op
        const moveAmount = 1;
        const speed = 10;
        let keyPressTimer = null;

    // Definieer de score buiten de startGame-functie
    let score = 0;
    
    // Voeg een klikgebeurtenis toe aan de "Start" -knop om het startscherm te verbergen en het spel te starten
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        startGame();
    });

    function removeRandomObjects() {
        const randomObjects = document.querySelectorAll('.coin, .genieOilLamp, .boulder');
        randomObjects.forEach((obj) => {
            obj.remove();
        });
    }
    
    // Event listener voor de replay-knop
    replayButton.addEventListener('click', () => {
        replayScreen.style.display = 'none';

        // Verwijder de willekeurige objecten
        removeRandomObjects();

        // Reset het spel
        score = 0;
        scoreDisplay.textContent = 'Score: ' + score;
        startGame();
    });

    // Functie om het replay-scherm te tonen en eindscore in te stellen
    function showReplayScreen() {
        replayScreen.style.display = 'block';
        finalScoreDisplay.textContent = score;
    }

    function startGame() {
        gameActive = true;

        // Functie om de positie van het beeld bij te werken en te begrenzen
        function updatePosition() {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const imageWidth = movableImage.clientWidth;
            const imageHeight = movableImage.clientHeight;

            // Beperk de X-positie binnen het scherm
            if (currentPositionX < 0) {
                currentPositionX = 0;
            } else if (currentPositionX + imageWidth > screenWidth) {
                currentPositionX = screenWidth - imageWidth;
            }

            // Beperk de Y-positie binnen het scherm
            if (currentPositionY < 0) {
                currentPositionY = 0;
            } else if (currentPositionY + imageHeight > screenHeight) {
                currentPositionY = screenHeight - imageHeight;
            }

            // Pas de positie van de afbeelding aan
            movableImage.style.left = currentPositionX + 'px';
            movableImage.style.top = currentPositionY + 'px';
        }

        // Event listener om de toetsaanslagen te volgen
        document.addEventListener('keydown', (event) => {
            if (!keyPressTimer) {
                keyPressTimer = setInterval(() => {
                    switch (event.key) {
                        case 'ArrowLeft':
                            currentPositionX -= moveAmount * speed;
                            if (!flipped) {
                                movableImage.style.transform = 'scaleX(-1)';
                                flipped = true;
                            }
                            break;
                        case 'ArrowRight':
                            currentPositionX += moveAmount * speed;
                            if (flipped) {
                                movableImage.style.transform = 'scaleX(1)';
                                flipped = false;
                            }
                            break;
                        case 'ArrowUp':
                            currentPositionY -= moveAmount * speed;
                            break;
                        case 'ArrowDown':
                            currentPositionY += moveAmount * speed;
                            break;
                    }

                    // Roep de functie aan om de positie bij te werken en te begrenzen
                    updatePosition();
                }, 1000 / 60);
            }
        });

        // Event listener om te stoppen met bewegen wanneer de toets wordt losgelaten
        document.addEventListener('keyup', () => {
            clearInterval(keyPressTimer);
            keyPressTimer = null;
        });

       // Functie om willekeurige munten, genieOilLamps of rotsen te maken en te laten vallen
       function createRandomObjects() {
        if (!gameActive) {
            return;
        }

        // Kansverhouding om de objecten te genereren
        const coinChance = 0.5;
        const genieOilLampChance = 0.2;

        // Willekeurig aantal objecten
        const numObjects = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < numObjects; i++) {
            const random = Math.random();
            const object = document.createElement('img');

            if (random < coinChance) {
                object.className = 'coin';
                object.src = 'images/coin.png';
                object.scoreValue = 1;
            } else if (random < coinChance + genieOilLampChance) {
                object.className = 'genieOilLamp';
                object.src = 'images/genieOilLamp.png';
                object.scoreValue = 5;
            } else {
                object.className = 'boulder';
                object.src = 'images/boulder.png';
                object.scoreValue = 0;
            }

            object.style.left = Math.random() * (window.innerWidth - 30) + 'px';
            object.style.top = '0';
            document.body.appendChild(object);

            // Willekeurige snelheid voor het laten vallen van objecten
            const fallSpeed = Math.random() * 4 + 1;

            // Animatie om het object te laten vallen
            function fallObject() {
                const objectTop = parseInt(object.style.top);

                if (objectTop >= window.innerHeight - 30) {
                    object.remove();
                } 

                else {
                    object.style.top = objectTop + fallSpeed + 'px';
                    requestAnimationFrame(fallObject);
                }
            }

            requestAnimationFrame(fallObject);

            // Controleer of het object wordt opgepikt door Aladdin
            function checkCollision() {
                const objectRect = object.getBoundingClientRect();
                const movableRect = movableImage.getBoundingClientRect();

                if (
                    objectRect.left < movableRect.right &&
                    objectRect.right > movableRect.left &&
                    objectRect.top < movableRect.bottom &&
                    objectRect.bottom > movableRect.top
                ) {
                    object.remove();
                    // Hier wordt de globale score bijgewerkt
                    score += object.scoreValue;
                    scoreDisplay.textContent = 'Score: ' + score;


                // als de speler een muntje of lampje raakt, wordt een score geluid afgespeeld.
                if (object.className === 'coin' || object.className === 'genieOilLamp') {
                        playScoreSound();
                    }

                    // Als de speler een rots raakt, toon het replay-scherm
                if (object.className === 'boulder') {
                    gameOverSound()
                    const randomObjects = document.querySelectorAll('.coin, .genieOilLamp, .boulder');
                    randomObjects.forEach((obj) => {
                        obj.remove();
                    });
                        showReplayScreen();
                        stopGame();
                    }
                } else {
                    requestAnimationFrame(checkCollision);
                }
            }
            
            requestAnimationFrame(checkCollision);
        }
    }
    // Start het maken van willekeurige objecten met een kortere interval
    objectTimer = setInterval(createRandomObjects, Math.random() * 2000 + 1000);
}
});

function stopGame() {
    // Zet het spel op inactief
    gameActive = false;
    // Zorgt dat de interval stopt
    clearInterval(objectTimer);
    objectTimer = null;
}

// Functie om de achtergrondafbeelding van het spel te wijzigen
function changeBackgroundImage(imageURL) {
    document.body.style.backgroundImage = `url(${imageURL})`;

    // Toon de "Play" knop nadat een achtergrond is gekozen
    const startButton = document.getElementById('start-button');
    startButton.style.display = 'block';
}

// Voeg event listeners toe aan de knoppen om de achtergrond te wijzigen wanneer erop wordt geklikt
const background1Button = document.getElementById('background1');
const background2Button = document.getElementById('background2');
const background3Button = document.getElementById('background3');

background1Button.addEventListener('click', () => {
    changeBackgroundImage('images/caveOutside.jpg'); 
});

background2Button.addEventListener('click', () => {
    changeBackgroundImage('images/cavesOfWonders.jpg'); 
});

background3Button.addEventListener('click', () => {
    changeBackgroundImage('images/castle.jpg');
});

//Geluid afspelen bij scoren van punten
function playScoreSound() {
    const coinSound = document.getElementById('coinSound');
    coinSound.currentTime = 0; // Zet de afspeeltijd van het geluid op het begin
    coinSound.play();
}

function gameOverSound() {
    const gameOverSound = document.getElementById('gameOverSound');
    gameOverSound.currentTime = 0; // Zet de afspeeltijd van het geluid op het begin
    gameOverSound.play();
}