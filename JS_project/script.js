// --- Game Elements ---
const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const phoneDisplay = document.getElementById('phone-display');
const restartButton = document.getElementById('restart-button');


// --- Game Settings ---
const gravity = 0.5;
const jumpStrength = -8;
const obstacleSpeed = 2;
const blockWidth = 50; // to match CSS
const gameAreaHeight = gameArea.clientHeight;
const gameAreaWidth = gameArea.clientWidth;
const initialPlayerY = 200;
const maxDigits = 14; // number of digits of a phone number including formatting

// --- Game State ---
let playerY;
let playerVelocityY;
let enteredPhoneNumber;
let obstacles; // Array to hold obstacle elements (containers)
let frameCount;
let isGameOver;
let gameLoopId = null; // To store the requestAnimationFrame ID
let generatedObstacleCount; 
let lastGenerationFrame;
// Calculate blockHeight dynamically
const numberOfBlocks = 10;
const blockHeight = gameAreaHeight / numberOfBlocks;

// --- List of area codes ---
const areaCodes = [
    "201", "202", "203", "205", "206", "207", "208", "209", "210", "212", "213",
    "214", "215", "216", "217", "218", "219", "220", "223", "224", "225", "227",
    "228", "229", "231", "234", "235", "239", "240", "248", "251", "252", "253",
    "254", "256", "260", "262", "267", "269", "270", "272", "274", "276", "279",
    "281", "283", "301", "302", "303", "304", "305", "307", "308", "309", "310",
    "312", "313", "314", "315", "316", "317", "318", "319", "320", "321", "323",
    "325", "326", "327", "330", "331", "332", "334", "336", "337", "339", "340", "341",
    "346", "347", "351", "352", "360", "361", "363", "364", "369", "380", "385",
    "386", "401", "402", "404", "405", "406", "407", "408", "409", "410", "412",
    "413", "414", "415", "417", "419", "423", "424", "425", "430", "432", "434",
    "435", "437", "440", "442", "443", "445", "447", "448", "458", "463", "464",
    "469", "470", "475", "478", "479", "480", "484", "500", "501", "502", "503", "504",
    "505", "507", "508", "509", "510", "512", "513", "515", "516", "517", "518",
    "520", "521", "522", "530", "531", "533", "534", "539", "540", "541", "544", "551", "559", "561",
    "562", "563", "564", "566", "567", "570", "571", "573", "574", "575", "577", "580", "585",
    "586", "588", "600", "601", "602", "603", "605", "606", "607", "608", "609", "610", "612",
    "614", "615", "616", "617", "618", "619", "620", "622", "623", "626", "628", "629",
    "630", "631", "636", "640", "641", "646", "650", "651", "657", "660", "661",
    "662", "667", "669", "670", "671", "678", "680", "681", "682", "684", "689", "701", "702", "703",
    "704", "706", "707", "708", "712", "713", "714", "715", "716", "717", "718",
    "719", "720", "724", "725", "727", "730", "731", "732", "734", "737", "740",
    "743", "747", "754", "757", "760", "762", "763", "764", "765", "769", "770",
    "772", "773", "774", "775", "779", "781", "785", "786", "787", "801", "802",
    "803", "804", "805", "806", "808", "810", "812", "813", "814", "815", "816",
    "817", "818", "820", "828", "830", "831", "832", "838", "840", "843", "845",
    "847", "848", "850", "854", "856", "857", "858", "859", "860", "861", "862",
    "863", "864", "865", "870", "872", "878", "901", "903", "904", "906", "907",
    "908", "909", "910", "912", "913", "914", "915", "916", "917", "918", "919",
    "920", "925", "928", "929", "930", "931", "934", "935", "937", "938", "939", "940",
    "941", "943", "947", "948", "949", "951", "952", "954", "956", "957", "959",
    "970", "971", "972", "973", "975", "978", "979", "980", "984", "985", "986",
    "989",
];

// --- Initialize Game State ---
function initializeGame() {
    playerY = initialPlayerY;
    playerVelocityY = 0;
    enteredPhoneNumber = "";
    obstacles = [];
    frameCount = 0;
    isGameOver = false;
    generatedObstacleCount = 0; // Initialize obstacle count
    // Initialize so the first obstacle generates after the default interval
    lastGenerationFrame = -150;

    // Clear previous elements and state
    player.style.top = `${playerY}px`;
    phoneDisplay.textContent = "Entered: ";
    // restartButton.style.display = 'none'; // comment out to make it visible initially

    // Remove all existing obstacle elements from DOM
    const existingObstacles = gameArea.querySelectorAll('.obstacle-container');
    existingObstacles.forEach(obs => obs.remove());
    // Remove all currently existing pause messages
    const existingMessages = document.querySelectorAll('.pause-message');
    existingMessages.forEach(msg => msg.remove());

    // Cancel previous game loop if running
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }
    // First message at the beginning of the game
    createPauseMessage("Let's get started!", specialCase = 'first');
    // Start the game loop
    gameLoopId = requestAnimationFrame(gameLoop);
}


function createObstacleSet() {
    // Prevent generation if game is over
    if (isGameOver) return;

    const obstacleContainer = document.createElement('div');
    obstacleContainer.classList.add('obstacle-container');
    obstacleContainer.style.position = 'absolute';
    obstacleContainer.style.right = `-${blockWidth}px`;
    obstacleContainer.style.top = '0px';
    // Set the container height explicitly to match game area height
    obstacleContainer.style.height = `${gameAreaHeight}px`;
    // Set the container width to match the block width
    obstacleContainer.style.width = `${blockWidth}px`;
    obstacleContainer.dataset.scored = 'false';

    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    numbers.forEach((num, index) => {
        const block = document.createElement('div');
        block.classList.add('obstacle-block');
        // Set block dimensions and position dynamically
        block.style.height = `${blockHeight}px`; // Use calculated height
        block.style.width = `${blockWidth}px`;  // Use defined width
        block.style.position = 'absolute'; // Position blocks absolutely within container
        block.style.top = `${index * blockHeight}px`; // Position based on calculated height
        block.style.left = '0px';
        block.textContent = num;
        block.dataset.value = num;
        obstacleContainer.appendChild(block);
    });

    gameArea.appendChild(obstacleContainer);
    obstacles.push(obstacleContainer);
}


// --- Collision Detection ---
function checkCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}


// --- Helper Function for Explosion ---
function createExplosion(x, y) {
    const particleCount = 8; // Number of particles per explosion
    const angleIncrement = (Math.PI * 2) / particleCount;
    const explosionRadius = 50; // How far particles travel

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Start particle at the center of the hit block
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        gameArea.appendChild(particle);

        // Calculate random outward direction and distance
        const angle = angleIncrement * i;
        // Add some randomness to distance and angle for a better effect
        const distance = Math.random() * explosionRadius + 20;
        const finalX = x + Math.cos(angle) * distance;
        const finalY = y + Math.sin(angle) * distance;

        // Allow the element to be added to DOM before transition starts
        setTimeout(() => {
            particle.style.transform = `translate(${finalX - x}px, ${finalY - y}px)`;
            particle.style.opacity = '0';
        }, 10); // Small delay

        // Remove particle after animation finishes
        particle.addEventListener('transitionend', () => {
            particle.remove();
        }, { once: true }); // automatic listener removal
    }
}


// --- Function to Create Scrolling Pause Message ---
function createPauseMessage(text, specialCase = "") {

    const messageElement = document.createElement('div');
    messageElement.classList.add('pause-message');
    messageElement.textContent = text;
    // Style directly here
    messageElement.style.position = 'absolute';
    messageElement.style.color = '#CFB87C';
    messageElement.style.fontSize = '24px';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.whiteSpace = 'pre';
    messageElement.style.top = `${gameAreaHeight / 2 - 15}px`; // Center vertically 
    messageElement.style.textAlign = 'center';

    if (specialCase === 'first') {
        // If this is the first message it has to be displayed to the left of the obstacle
        messageElement.style.right = '100px';
    } else if (specialCase === 'last') {
        // If this is the last message it's closer to the obstacle
        messageElement.style.right = '30px';
    } else {
        // For all other messages, position it off-screen to the right
        messageElement.style.right = `-150px`;
    }

    // We'll use a data attribute to mark it
    messageElement.dataset.isPauseMessage = 'true';

    gameArea.appendChild(messageElement);
    obstacles.push(messageElement); // Add to the obstacles array to be moved
}




// --- Game Loop ---
function gameLoop() {
    if (isGameOver) {
        // If game over, stop processing and wait for restart
        // Keep requesting frames to allow potential future animations/effects
        gameLoopId = requestAnimationFrame(gameLoop);
        return;
    }

    // 1. Apply Gravity & Update Player Position
    playerVelocityY += gravity;
    playerY += playerVelocityY;

    // 2. Boundary Checks (Top/Bottom)
    if (playerY < 0) {
        playerY = 0;
        playerVelocityY = 0;
    }
    if (playerY + player.offsetHeight > gameAreaHeight) {
        playerY = gameAreaHeight - player.offsetHeight;
        playerVelocityY = 0;
        // isGameOver = true; // Comment out to make the game end on bottom hit
    }
    player.style.top = `${playerY}px`;

    // 3. Generate Obstacles
    if (generatedObstacleCount < 10) { // Only generate if we haven't reached the max
        const defaultInterval = 150; // Base spacing interval (frames)
        const pauseMultiplier = 2;   // How much longer the pause is (e.g., 3 * 150 = 450 frames)
        let requiredInterval = defaultInterval;

        // Determine the required interval for the *next* obstacle
        if (generatedObstacleCount === 3 || generatedObstacleCount === 6) {
            // After generating the 3rd or 6th wall, the next interval should be longer
            requiredInterval = defaultInterval * pauseMultiplier;
        }

        // Check if enough frames have passed since the last generation
        if (frameCount - lastGenerationFrame >= requiredInterval) {
            createObstacleSet();
            generatedObstacleCount++; // Increment the total count
            lastGenerationFrame = frameCount; // Record the frame count for this generation
        }

    }


    // 4. Move and Check Obstacles
    const playerRect = player.getBoundingClientRect();

    // Iterate backwards for safe removal while iterating
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacleSet = obstacles[i];
        let currentRight = parseInt(obstacleSet.style.right || `-${blockWidth}`);
        currentRight += obstacleSpeed;
        obstacleSet.style.right = `${currentRight}px`;

        const setRect = obstacleSet.getBoundingClientRect();

        // Check collision with individual blocks
        const blocks = obstacleSet.querySelectorAll('.obstacle-block');
        let collisionDetectedThisSet = false; // Flag for this specific set

        blocks.forEach(block => {
            // Only check collision if this set hasn't already been scored
            if (obstacleSet.dataset.scored === 'false') {
                const blockRect = block.getBoundingClientRect();
                if (checkCollision(playerRect, blockRect)) {
                    collisionDetectedThisSet = true; // Mark collision happened
                    const numberValue = block.dataset.value;

                    // --- Start Explosion ---
                    // Calculate center of the block relative to the gameArea
                    const gameAreaRect = gameArea.getBoundingClientRect();
                    const blockCenterX = blockRect.left - gameAreaRect.left + blockRect.width / 2;
                    const blockCenterY = blockRect.top - gameAreaRect.top + blockRect.height / 2;
                    createExplosion(blockCenterX, blockCenterY); // Trigger explosion
                    // --- End Explosion ---

                    if (generatedObstacleCount === 2) {
                        enteredPhoneNumber = '('; // Start area code with opening parenthesis
                    }
                    enteredPhoneNumber += numberValue;
                    if (enteredPhoneNumber.length === 4) {
                        enteredAreaCode = enteredPhoneNumber.slice(-3);
                        // check if the player has entered a valid area code
                        if (!areaCodes.includes(enteredAreaCode)) {
                            isGameOver = true;
                            createPauseMessage("Dude this is not even\na valid area code.\nLOCK IN!", specialCase = 'last');
                            // restartButton.style.display = 'block'; // Show restart button (comment out if you want it hidden initially)
                        } else {
                            enteredPhoneNumber += ') '; // Add closing parenthesis after 3rd digit
                            createPauseMessage("Congratulations!\nYou entered the area code!");
                        }
                    }
                    if (enteredPhoneNumber.length === 9) {
                        enteredPhoneNumber += '-'; // Add dash after 6th digit
                        createPauseMessage("Come on you entered the prefix!\nYou can do it!");
                    }
                    phoneDisplay.textContent = `Entered: ${enteredPhoneNumber}`;
                    obstacleSet.dataset.scored = 'true'; // Mark set as scored    

                    block.style.opacity = '0'; // Fade out
                    block.style.pointerEvents = 'none'; // Prevent re-collision

                    // Check if game should end
                    if (enteredPhoneNumber.length >= maxDigits) {
                        isGameOver = true;
                        createPauseMessage("Phone number\ncomplete!\n(Maybe?)", specialCase = 'last');
                        // restartButton.style.display = 'block'; // Show restart button (comment out if you want it hidden initially)
                    }

                }
            }
        });

        // 5. Remove Off-Screen Obstacles
        if (setRect.left > gameArea.offsetWidth) {
            console.log("Removing obstacle that went right?"); // Should be left < 0
        }
        if (setRect.right < 0) { // Check if the set is fully off-screen to the left
            obstacleSet.remove();
            obstacles.splice(i, 1);
        }
    }

    frameCount++;
    gameLoopId = requestAnimationFrame(gameLoop); // Continue the loop
}

// --- Player Control ---
function handleJump() {
    if (!isGameOver) { // Only allow jumping if game is not over
        playerVelocityY = jumpStrength;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        handleJump();
    }
});
document.addEventListener('mousedown', handleJump);
document.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent clicks triggering after touch
    handleJump();
});

// --- Restart Button ---
restartButton.addEventListener('click', initializeGame);

// --- Start Game ---
initializeGame(); // Initial setup and start
