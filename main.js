const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerIcon = '🚁'; // Update the player icon (helicopter emoji)
const enemyIcon = '🛰️'; // Update the enemy icon (satellite emoji)

// Define a variable for the player's score
let score = 0;

// Game state
let isGameOver = false;
let isGamePaused = false;
// Player spaceship
const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 5,
};

// Bullets
const bullets = [];

// Enemy spaceships
const enemies = [];

// Keyboard controls
const keys = {};


// Function to restart the game
function restartGame() {
  isGameOver = false;
  score = 0;
  enemies.length = 0; // Clear the enemies array
  // Add any other initialization logic here
}

// Function to handle game over
function gameOver() {
  if (isGameOver) return; // Prevents multiple game over triggers

  // Display a game over message
  ctx.fillStyle = 'white';
  ctx.font = '36px Arial';
  ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);

  // Set the game over flag to true and pause the game
  isGameOver = true;
  isGamePaused = true;

  // You can add more game over actions here, such as a "Restart" button
  // or any other game over behavior you want.

  // Listen for the 's' key to restart the game
  window.addEventListener('keydown', (e) => {
    if (e.key === 's' || e.key === 'S') {
      restartGame();
      isGamePaused = false; // Resume the game
    }
  });
}

// Game loop
function gameLoop() {
  requestAnimationFrame(gameLoop);

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Check if the game is paused (Game Over)
  if (isGamePaused) {
    // Display a pause message
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.fillText('Press "S" to play', canvas.width / 2 - 120, canvas.height / 2);
    return; // Exit the game loop
  }

  // Update player
  updatePlayer();

  // Update and draw bullets
  updateBullets();

  // Update and draw enemies
  updateEnemies();

  // Check for collisions
  checkCollisions();

  // Draw the player's score
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.color = 'white';
  ctx.fillText('Score: ' + score, 10, 30);
}

// Rest of the code remains the same


// Handle keyboard input
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Update player's position
function updatePlayer() {
  if (keys['ArrowLeft'] && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys['ArrowRight'] && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }

  // Draw player's spaceship
  ctx.fillStyle = 'blue';
  ctx.font = '36px Arial';
  ctx.fillText(playerIcon, player.x, player.y);
}

// Update and draw bullets
// Bullet properties
const bulletSpeed = 7;
const bulletWidth = 5;
const bulletHeight = 15;

// Update and draw bullets
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];

    // Update bullet position
    bullet.y -= bulletSpeed;

    // Remove bullets that go off-screen
    if (bullet.y < 0) {
      bullets.splice(i, 1);
      i--;
    } else {
      // Draw the bullet
      ctx.fillStyle = 'yellow';
      ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    }
  }
}

// Fire a bullet
function fireBullet() {
  const bullet = {
    x: player.x + player.width / 2 - bulletWidth / 2,
    y: player.y,
    width: bulletWidth,
    height: bulletHeight,
  };
  bullets.push(bullet);
}

// Handle spacebar keypress to fire bullets
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Spacebar') {
    fireBullet();
  }
});

// Update and draw enemies
// Enemy properties
const enemySpeed = 2;
const enemyWidth = 40;
const enemyHeight = 40;
const maxEnemies = 5; // Maximum number of enemies on the screen

// // Update and draw enemies
// function updateEnemies() {
//   // Create new enemies if there are fewer than the maximum allowed
//   if (enemies.length < maxEnemies) {
//     createEnemy();
//   }

//   for (let i = 0; i < enemies.length; i++) {
//     const enemy = enemies[i];

//     // Update enemy position (simple downward movement)
//     enemy.y += enemySpeed;

//     // Draw the enemy icon
//     ctx.font = '36px Arial';
//     ctx.fillStyle = 'red';
//     ctx.fillText(enemyIcon, enemy.x, enemy.y);
//   }
// }
// Update and draw enemies
function updateEnemies() {
  // Create new enemies if there are fewer than the maximum allowed
  if (enemies.length < maxEnemies) {
    createEnemy();
  }

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    // Update enemy position (simple downward movement)
    enemy.y += enemySpeed;

    // Draw the enemy icon
    ctx.font = '36px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(enemyIcon, enemy.x, enemy.y);

    // Check if the enemy reached the bottom of the canvas
    if (enemy.y > canvas.height) {
      // Remove the enemy
      enemies.splice(i, 1);
      i--;

      // Implement the game over logic here
      gameOver();
    }
  }
}

// // Function to handle game over
// function gameOver() {
//   if (isGameOver) return; // Prevents multiple game over triggers

//   // Display a game over message
//   ctx.fillStyle = 'white';
//   ctx.font = '36px Arial';
//   ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);

//   // Set the game over flag to true
//   isGameOver = true;

//   // You can add more game over actions here, such as a "Restart" button
//   // or any other game over behavior you want.

//   // Listen for the 's' key to restart the game
//   window.addEventListener('keydown', (e) => {
//     if (e.key === 's' || e.key === 'S') {
//       restartGame();
//     }
//   });
// }

// Rest of the code remains the same


// Create a new enemy
function createEnemy() {
  const enemy = {
    x: Math.random() * (canvas.width - enemyWidth),
    y: 0,
    width: enemyWidth,
    height: enemyHeight,
  };
  enemies.push(enemy);
}

// Check for collisions
// Check for collisions
function checkCollisions() {
  // Check for collisions between bullets and enemies
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];

    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];

      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Collision detected
        bullets.splice(i, 1);
        i--;
        enemies.splice(j, 1);
        j--;

        // Update the player's score (you can add your scoring logic here)
        // score += 10;
        // Inside the collision detection logic
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          // Collision detected
          bullets.splice(i, 1);
          i--;
          enemies.splice(j, 1);
          j--;

          // Increment the player's score
          score += 10; // You can adjust the score increase as needed

          // Update and display the score
          updateScore();
        }
      }
    }
  }
}



// // Function to restart the game
// function restartGame() {
//   isGameOver = false;
//   score = 0;
//   enemies.length = 0; // Clear the enemies array
//   // Add any other initialization logic here
// }

// Function to update and display the score
function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = score;
}


// Start the game loop
gameLoop();
