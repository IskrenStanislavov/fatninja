import Level from './base/Level';
import Player from '../prefabs/Player';
export default class Level2 extends Level {
	constructor() {
		super();
		//object level properties
		this.config = { mapNameTileMap: "level2", numberOfCollectables: 241, numberOfEnemies: 225 };
	}

	protected hitDoor(playerRef: Player, doorRef: Phaser.Sprite) {
		this.game.state.start("GameOver");
	}

}
