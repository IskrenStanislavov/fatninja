import Level from './Base/Level';
import Player from '../prefabs/Player';
export default class Level1 extends Level {
	constructor() {
		super();
		//object level properties
		this.config = { mapNameTileMap: "level1", numberOfCollectables: 41, numberOfEnemies: 25 };
	}

	protected hitDoor(playerRef: Player, doorRef: Phaser.Sprite) {
		this.game.state.clearCurrentState();
		this.game.state.start("Level2");
	}

}
