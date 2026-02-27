class Level2 extends Phaser.Scene {
    constructor() {
        super('Level2');
    }

    preload() {
        // Assets are re-loaded or pulled from cache
        this.load.image('duck', 'https://upload.wikimedia.org/wikipedia/commons/4/48/Rubber_Duckies.png');
        this.load.image('jeep', 'https://purepng.com/public/uploads/large/purepng.com-jeep-wrangler-white-carcarvehicletransportationjeep-961524660333t3xsm.png');
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('lava', 'https://labs.phaser.io/assets/sprites/shmup-baddie.png');
    }

    create() {
        // 1. Scene Setup
        this.cameras.main.setBackgroundColor('#1a0033'); // Dark Spider-Verse Purple
        const worldWidth = 2000;
        const worldHeight = 1500;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);

        // 2. Groups
        this.platforms = this.physics.add.staticGroup();
        this.movingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
        this.hazards = this.physics.add.staticGroup();

        // 3. Building the Level (Obstacles)
        // Static Start
        this.platforms.create(200, worldHeight - 100, 'ground').setDisplaySize(400, 40).refreshBody();

        // Moving Platforms (The Hard Part)
        for (let i = 1; i <= 6; i++) {
            let mp = this.movingPlatforms.create(400 * i, worldHeight - (200 * i), 'ground').setDisplaySize(250, 40);
            mp.setTint(0x00ffff);
            
            // Vertical movement tween
            this.tweens.add({
                targets: mp,
                y: mp.y - 150,
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }

        // The "Floor is Lava" Obstacle
        for(let x = 0; x < worldWidth; x += 120) {
            this.hazards.create(x, worldHeight - 20, 'lava').setDisplaySize(150, 80).setTint(0xff0000).refreshBody();
        }

        // 4. The Character
        this.player = this.physics.add.sprite(150, worldHeight - 250, 'duck').setScale(0.18);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(this.player.width * 0.7, this.player.height * 0.7);

        // 5. The Goal (Jeep)
        this.jeep = this.physics.add.sprite(worldWidth - 200, 200, 'jeep').setScale(0.4);

        // 6. Physics & Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.movingPlatforms);
        this.physics.add.collider(this.jeep, this.platforms);
        
        // Death Logic: If hits lava/spikes, restart Level 2
        this.physics.add.overlap(this.player, this.hazards, () => this.scene.restart(), null, this);
        
        // Win Logic: Move to Level 3 (or back to 1 for now)
        this.physics.add.overlap(this.player, this.jeep, () => alert("Level 2 Clear!"), null, this);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 400;
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.flipX = false;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.flipX = true;
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-900);
        }
    }
}
