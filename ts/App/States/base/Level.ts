import NumberBox from '../../prefabs/NumberBox';
import LevelConfig from '../interfaces/LevelConfig';
import Player from '../../prefabs/Player';
import Mouse from '../../prefabs/Mouse';
export default class Level extends Phaser.State {
	public static score:number = 0;
	map: Phaser.Tilemap;
	bg: Phaser.TilemapLayer;
	layer: Phaser.TilemapLayer;
	coins: Phaser.Group;
	doors: Phaser.Group;

	player: Player;
	enemies: Phaser.Group;

	UIGroup: Phaser.Group;
	scoreField: NumberBox;

	sfx: Phaser.AudioSprite;

	config: LevelConfig;
	constructor() {
		//object level properties
		super();
	}

	public create() {
		if ("debug"){
			this.game.add.plugin(new Phaser.Plugin.Debug(this.game, this.game.plugins));
		}

		//physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 800;

		//map start
		this.map = this.add.tilemap(this.config.mapNameTileMap);

		//parallax background
		this.map.addTilesetImage('gamebg');
		this.bg = this.map.createLayer('bg');
		this.bg.scrollFactorX = .6;
		this.bg.scrollFactorY = .6;

		//walkable tiles
		this.map.addTilesetImage('Tiles');
		this.layer = this.map.createLayer('Level');

		//collision
		this.layer.resizeWorld();
		this.map.setCollisionBetween(6, 20, true, this.layer);

		//coin layer
		this.coins = this.add.group();
		this.coins.physicsBodyType = Phaser.Physics.ARCADE;
		this.coins.enableBody = true;
		this.map.createFromObjects("Collectables", this.config.numberOfCollectables, 'coin', null, true, false, this.coins);
		this.coins.setAll("body.gravity", 0);

		//place doors
		this.doors = this.add.group();
		this.doors.physicsBodyType = Phaser.Physics.ARCADE;
		this.doors.enableBody = true;
		this.map.createFromObjects("Doors", 242, 'sign', null, true, false, this.doors);
		this.doors.setAll("body.gravity", 0);

		//player
		this.map.createFromObjects("Player", 243, null, null, true, false, this.world, Player);
		this.player = this.world.getTop();

		//place enemies
		this.enemies = this.add.group();
		this.map.createFromObjects("Enemies", this.config.numberOfEnemies, null, null, true, false, this.enemies, Mouse);
		this.enemies.setAll("player", this.player);

		//UI
		this.UIGroup = this.add.group();
		this.scoreField = new NumberBox(this.game, "scoreholder", 17, this.UIGroup);
		this.scoreField.fixedToCamera = true;

		//sound
		this.sfx = this.add.audioSprite('sfx');

		this.camera.follow(this.player);
	}

	public update() {
		this.physics.arcade.collide(this.player, this.layer);
		this.physics.arcade.collide(this.enemies, this.layer);
		this.physics.arcade.overlap(this.player, this.doors, this.hitDoor, null, this);
		this.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
		this.physics.arcade.collide(this.player, this.enemies, this.hitEnemy, null, this);

		this.addDebug();
	}

	protected addDebug() {
		this.game.debug.body(this.player, "rgba(0,0,255,0.4)", );
		this.enemies.forEach(function (child: Phaser.Sprite, color: string) {
			this.game.debug.body(child, color);
		}, this, true, "rgba(255,0,0,0.4)");
		this.doors.forEach(function (child: Phaser.Sprite, color: string) {
			this.game.debug.body(child, color);
		}, this, true, "rgba(255,100,50,0.4)");
		// this.layer.forEach(function(child:Phaser.Sprite, color:string){
		// 	this.game.debug.body(child, color);
		// }, this, true,"rgba(255,0,0,0.4)");
		// this.game.debug.body.call(this.game.debug.body,this.enemies.children.map((), "red");
		// this.game.debug.body(this.layer, "green");
	}

	protected collectCoin(playerRef: Player, coinRef: Phaser.Sprite) {
		coinRef.kill();
		Level.score++;
		this.scoreField.setValue(Level.score);
		this.sfx.play("coin");
	}

	protected hitDoor(playerRef: Player, doorRef: Phaser.Sprite) {
	}

	protected hitEnemy(playerRef: Player, enemyRef: Phaser.Sprite) {
		if (!playerRef.flashEffect.isRunning) {
			playerRef.flash();
			this.sfx.play("hit");
			if (Level.score > 0) {
				Level.score--;
				this.scoreField.setValue(Level.score);
			}
		}
	}

}
