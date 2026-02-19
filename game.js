// food-collector - Phaser.js Game

let player, cursors, score = 0, scoreText, gameOver = false;
let foods, goblins;

function preload() {
    // Load pixel-art sprites
    this.load.image('player', 'assets/player.png');
    this.load.image('goblin', 'assets/goblin.png');
    this.load.image('banana', 'assets/banana.png');
    this.load.image('apple', 'assets/apple.png');
    this.load.image('pineapple', 'assets/pineapple.png');
}

function create() {
    // Background with SNES vibe
    this.cameras.main.setBackgroundColor('#2c2c6c');

    // Initialize groups first
    foods = this.physics.add.group();
    goblins = this.physics.add.group();

    // Create player
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);

    // Create food items
    for (let i = 0; i < 8; i++) {
        const x = Phaser.Math.Between(50, 750);
        const y = Phaser.Math.Between(50, 550);
        const foodType = Phaser.Math.RND.pick(['banana', 'apple', 'pineapple']);
        const food = foods.create(x, y, foodType);
        food.setScale(1.5);
    }

    // Create goblins with unpredictable movement
    for (let i = 0; i < 4; i++) {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);
        const goblin = goblins.create(x, y, 'goblin');
        goblin.setCollideWorldBounds(true);
        goblin.setBounce(1);
        goblin.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    }

    // WASD controls
    cursors = this.input.keyboard.addKeys('W,S,A,D');

    // Score display
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'monospace'
    });

    // Collisions
    this.physics.add.overlap(player, foods, collectFood, null, this);
    this.physics.add.overlap(player, goblins, hitGoblin, null, this);

    // Timer to randomize goblin directions
    this.time.addEvent({
        delay: 2000,
        callback: () => {
            goblins.children.entries.forEach(goblin => {
                goblin.setVelocity(Phaser.Math.Between(-120, 120), Phaser.Math.Between(-120, 120));
            });
        },
        loop: true
    });
}

function update() {
    if (gameOver) return;

    // WASD movement (top-down)
    let velocityX = 0;
    let velocityY = 0;

    if (cursors.A.isDown) velocityX = -200;
    else if (cursors.D.isDown) velocityX = 200;

    if (cursors.W.isDown) velocityY = -200;
    else if (cursors.S.isDown) velocityY = 200;

    player.setVelocity(velocityX, velocityY);
}

function collectFood(player, food) {
    food.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);

    if (foods.countActive() === 0) {
        this.add.text(400, 300, 'YOU WIN!', {
            fontSize: '48px',
            fill: '#00ff00',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        this.physics.pause();
        gameOver = true;
    }
}

function hitGoblin(player, goblin) {
    this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
    this.add.text(400, 300, 'GAME OVER', {
        fontSize: '48px',
        fill: '#ff0000',
        fontFamily: 'monospace'
    }).setOrigin(0.5);
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2c2c6c',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: { preload, create, update }
};

// Initialize game
const game = new Phaser.Game(config);