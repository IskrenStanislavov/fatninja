import Player from './Player';

export default class Mouse extends Phaser.Sprite {
	// speedToUse:number;
	speed: number = 200;
	// airSpeed:number = 300;
	jumpPower: number = 600;
	stepLimit: number = 90;
	facing: number;
	currentStep: number;
	player: Player;

	swingAnimation: Phaser.Animation;

	// //stateData
	// inAir:boolean;
	// doubleJump:boolean;
	// hitGround:boolean;

	constructor(game: Phaser.Game, x: number, y: number, player: Player) {
		super(game, x, y, 'mouse', 0);

		//game object level variables
		this.facing = 0;
		this.currentStep = Math.floor(Math.random() * this.stepLimit);
		this.player = player;

		//animations
		this.animations.add("stand", [ 0 ]);
		this.swingAnimation = this.animations.add("swing", [ 0, 1, 2, 3, 4, 5, 6, 7 ]);
		this.animations.add("run", [ 8, 9, 10, 11, 12, 13, 14 ]);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.body.collideWorldBounds = true;
		// this.body.drag = { x: 600, y: 0 };
		this.body.setSize(60, 120);
		this.anchor.setTo(.5, 1);

		this.animations.play("run", 9, true);
		this.anchor.setTo(0.44, this.anchor.y);
		this.body.setSize(60, 120);
		this.body.offset.setTo(39, 35);
	}

	update() {

		var dist = Phaser.Math.distance(this.x, this.y, this.player.x, this.player.y);

		if (Math.round(dist) < 210) {
			this.animations.play("swing", 9);

			if (this.x < this.player.x) {
				this.scale.x = 1;
			} else {
				this.scale.x = -1;
			}
		}

		if (!this.swingAnimation.isPlaying) {

			this.currentStep++;
			this.body.velocity.x = this.speed;

			this.animations.play("run", 9, true);

			this.scale.x = (this.speed > 0) ? 1 : -1;

			if (this.currentStep >= this.stepLimit) {
				this.speed *= -1;
				this.currentStep = 0;
			}
		}

	}
}
