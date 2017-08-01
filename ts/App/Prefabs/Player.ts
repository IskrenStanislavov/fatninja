export default class Player extends Phaser.Sprite {
	speedToUse: number;
	speed: number = 400;
	airSpeed: number = 300;
	jumpPower: number = 600;

	//stateData
	inAir: boolean;
	doubleJump: boolean;
	hitGround: boolean;

	landAnimation: Phaser.Animation;
	cursors: Phaser.CursorKeys;
	jumpButton: Phaser.Key;
	flashEffect: Phaser.Tween;

	constructor(game: Phaser.Game, x: number, y: number) {
		super(game, x, y, 'player', 0);

		//game object level variables
		this.inAir = true;
		this.hitGround = false;

		//animations
		this.animations.add("idle", [ 0, 1, 2, 3, 4, 3, 2, 1 ]);
		this.animations.add("jump", [ 0, 5, 6, 7, 8, 9 ]);
		this.landAnimation = this.animations.add("land", [ 7, 6, 5 ]);
		this.animations.add("run", [ 11, 12, 13, 14, 15, 16, 17 ]);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.collideWorldBounds = true;
		this.anchor.setTo(0.6, this.anchor.y);
		this.body.setSize(77, 195);
		this.body.offset.setTo(89, 15);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.jumpButton.onDown.add(this.jump, this);

		this.animations.play("idle", 9, true);

		this.flashEffect = this.game.add.tween(this)
			.to({ alpha: 0 }, 50, Phaser.Easing.Bounce.Out)
			.to({ alpha: .8 }, 50, Phaser.Easing.Bounce.Out)
			.to({ alpha: 1 }, 150, Phaser.Easing.Circular.Out);
	}

	protected animationState() {

		if (this.hitGround) {
			this.animations.play("land", 15);
		} else if (!this.inAir && !this.landAnimation.isPlaying) {
			if (Math.abs(this.body.velocity.x) > 4) {
				this.animations.play("run", 9, true);
			} else if (this.body.onFloor()) {
				this.animations.play("idle", 9, true);
			}
		}

	}

	public update() {
		// console.log("position:(%1,%2)".replace("%1",this.x).replace("%2",this.y));
		this.hitGround = false;
		var wasAir = this.inAir;
		this.inAir = !this.body.onFloor();

		if (this.inAir != wasAir && this.body.velocity > 0) {
			this.hitGround = true;
		}

		this.animationState();

		this.speedToUse = this.inAir ? this.airSpeed : this.speed;
		this.speedToUse *= Math.abs(this.scale.x);

		if (!this.cursors.left.isUp && this.cursors.left.isDown && !this.cursors.right.isDown) {
			this.scale.x = -1;
			this.body.velocity.x = -this.speedToUse;
		}
		else if (this.cursors.right.isDown) {
			this.scale.x = 1;
			this.body.velocity.x = this.speedToUse;
		}
	}

	protected jump() {
		if (this.body.onFloor() == true) {
			this.body.velocity.y = -this.jumpPower;
			this.animations.play("jump", 30);
			this.doubleJump = true;
		} else if (this.doubleJump == true) {
			console.log(this.doubleJump);
			this.doubleJump = false;
			this.body.velocity.y = -this.jumpPower;
			this.animations.play("jump", 30);
		}
	}

	public flash() {
		if (!this.flashEffect.isRunning) {
			this.flashEffect.start();
		}
	}

}
