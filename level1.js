class Level1 extends Phaser.Scene {
    constructor() {
        super('Level1');
    }

    preload() {
        this.load.image('duck', 'https://upload.wikimedia.org/wikipedia/commons/4/48/Rubber_Duckies.png');
        this.load.image('jeep', 'https://purepng.com/public/uploads/large/purepng.com-jeep-wrangler-white-carcarvehicletransportationjeep-961524660333t3xsm.png');
        this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
        this.load.image('lava', 'https://labs.phaser.io/assets/sprites/shmup-baddie.png');
    }

    create() {
        this.add.text(40, 40, 'LEVEL 1: THE CLIMB', { fontSize: '48px', fill: '#FFFF00', fontFamily: 'Arial Black' });
        
        this.platforms = this.physics.add.staticGroup();
        this.hazards = this.physics.add.staticGroup();

        // Obstacles: High Platforms
        this.platforms.create(200, 700, 'ground').setDisplaySize(400, 40).refreshBody();
        this.platforms.create(600, 500, 'ground').setDisplaySize(300, 40).refreshBody();
        this.platforms.create(300, 300, 'ground').setDisplaySize(300, 40).refreshBody();

        // Floor Lava
        for(let x = 0; x < 1000; x += 120) {
            this.hazards.create(x, 780, 'lava').setDisplaySize(150, 60).setTint(0xff0000).refreshBody();
        }

        // Character
        this.player = this.physics.add.sprite(100, 600, 'duck').setScale(0.15);
        this.player.setCollideWorldBounds(true);

        // Goal
        this.jeep = this.physics.add.sprite(300, 200, 'jeep').setScale(0.3);

        // Physics
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.overlap(this.player, this.hazards, () => this.scene.start('Level1'));
        this.physics.add.overlap(this.player, this.jeep, () => this.scene.start('Level2'));

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) this.player.setVelocityX(-1000);
        else if (this.cursors.right.isDown) this.player.setVelocityX(300);
        else this.player.setVelocityX(0);

        if (this.cursors.up.isDown && this.player.body.touching.down) this.player.setVelocityY(-800);
    }
}
