// --- Game Elements ---
const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const phoneDisplay = document.getElementById('phone-display');
const messageArea = document.getElementById('message-area');
const restartButton = document.getElementById('restart-button');


// --- Game Settings ---
const gravity = 0.5;
const jumpStrength = -8;
const obstacleSpeed = 2;
// const blockHeight = 45; // Must match CSS
const blockWidth = 50; // Must match CSS
const gameAreaHeight = gameArea.clientHeight;
const gameAreaWidth = gameArea.clientWidth;
const initialPlayerY = 200;
const maxDigits = 14; // Define the target number of digits

// --- Game State ---
let playerY;
let playerVelocityY;
let enteredPhoneNumber;
let obstacles; // Array to hold obstacle elements (containers)
let frameCount;
let isGameOver;
let gameLoopId = null; // To store the requestAnimationFrame ID
// NEW CODE
let generatedObstacleCount; // Counter for total generated obstacles
let lastGenerationFrame; // <<< ADD: Frame count when the last obstacle was generated
// Calculate blockHeight dynamically
const numberOfBlocks = 10; // 0 through 9
const blockHeight = gameAreaHeight / numberOfBlocks; // Calculate height per block

// --- Initialize Game State ---
function initializeGame() {
    playerY = initialPlayerY;
    playerVelocityY = 0;
    enteredPhoneNumber = "";
    obstacles = [];
    frameCount = 0;
    isGameOver = false;
    // NEW CODE
    generatedObstacleCount = 0; // Initialize obstacle count
    // Initialize so the first obstacle generates after the default interval
    lastGenerationFrame = -150; // <<< INITIALIZE (or 0, depends on exact timing desired)

    // Clear previous elements and state
    player.style.top = `${playerY}px`;
    phoneDisplay.textContent = "Entered: ";
    messageArea.style.display = "none";
    // restartButton.style.display = 'none'; // Hide restart button (comment out if you want it visible initially)

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

    createPauseMessage("Let's get started!", isfirstTime = true);

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
    obstacleContainer.style.width = `${blockWidth}px`; // Set width too
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
    // Basic AABB collision detection
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

        // Use setTimeout to allow the element to be added to DOM before transition starts
        setTimeout(() => {
            particle.style.transform = `translate(${finalX - x}px, ${finalY - y}px)`;
            particle.style.opacity = '0';
        }, 10); // Small delay

        // Remove particle after animation finishes
        particle.addEventListener('transitionend', () => {
            particle.remove();
        }, { once: true }); // Use 'once' for automatic listener removal
    }
}


// --- Function to Create Scrolling Pause Message ---
function createPauseMessage(text, isfirstTime = false) {

    const messageElement = document.createElement('div');
    messageElement.classList.add('pause-message'); // Add class for styling and identification
    messageElement.textContent = text;

    // --- Styling (Apply directly or via CSS class) ---
    messageElement.style.position = 'absolute';
    messageElement.style.color = '#CFB87C'; // Example style
    messageElement.style.fontSize = '24px'; // Example style
    messageElement.style.fontWeight = 'bold';
    messageElement.style.whiteSpace = 'pre';
    // messageElement.style.whiteSpace = 'nowrap'; // Prevent text wrapping
    messageElement.style.top = `${gameAreaHeight / 2 - 15}px`; // Center vertically (adjust as needed)
    messageElement.style.textAlign = 'center'; 

    // Estimate width based on text or set a fixed width if preferred
    // This is tricky without rendering first, let's start it just off-screen right
    messageElement.style.right = `-150px`; // Start off-screen right (adjust width estimate)

    if (isfirstTime) {
        // If this is the first time, we can set a different style or position
        messageElement.style.right = '100px'; // Position at the top for first message
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
        // Optional: Implement game over on hitting ground if desired
        // isGameOver = true;
        // messageArea.textContent = "Crashed!";
        // restartButton.style.display = 'block';
    }
    player.style.top = `${playerY}px`;

    // 3. Generate Obstacles

    // NEW CODE
    if (generatedObstacleCount < 10) { // Only generate if we haven't reached the max (10)
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
            // Optional: Limit concurrent obstacles on screen if desired
            // if (obstacles.length < 3) {
                createObstacleSet();
                generatedObstacleCount++; // Increment the total count
                lastGenerationFrame = frameCount; // Record the frame count for this generation
            // }

        }
    } // End of obstacle generation check

    // Generate more frequently initially, then maybe slow down?
    // if (frameCount % 150 === 0) {
    //     if (obstacles.length < 3) { // Limit concurrent obstacles
    //         createObstacleSet();
    //     }
    // }


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
                        enteredPhoneNumber = '('; // Reset on first obstacle
                    }    
                    enteredPhoneNumber += numberValue;
                    if (enteredPhoneNumber.length === 4) {
                        enteredPhoneNumber += ') '; // Add closing parenthesis after 3rd digit
                        createPauseMessage("Congratulations!\nYou entered the area code!"); // Or your desired text
                    }    
                    if (enteredPhoneNumber.length === 9) {
                        enteredPhoneNumber += '-'; // Add dash after 6th digit
                        createPauseMessage("Come on you entered the prefix!\nYou can do it!"); // Or your desired text
                    }    
                    phoneDisplay.textContent = `Entered: ${enteredPhoneNumber}`;
                    obstacleSet.dataset.scored = 'true'; // Mark set as scored    
                    
                    

                    // Flash effect
                    block.style.opacity = '0'; // Fade out quickly
                    block.style.pointerEvents = 'none'; // Prevent re-collision

                    // block.style.backgroundColor = 'transparent'; // Reset color
                    // block.textContent = "";
                    // block.style.border = '0px solid transparent'; // Remove border
                    // setTimeout(() => { block.style.backgroundColor = 'green'; }, 200);

                    // Check if game should end
                    if (enteredPhoneNumber.length >= maxDigits) {
                        isGameOver = true;
                        messageArea.style.display = 'block'; // Show message area
                        messageArea.textContent = "Phone number complete! (Maybe?)";
                        // restartButton.style.display = 'block'; // Show restart button (comment out if you want it hidden initially)
                        // No need to break here, let the loop finish naturally
                    }
                }
            }
        });

        // 5. Remove Off-Screen Obstacles
        // Use gameArea.offsetWidth as the boundary check
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
