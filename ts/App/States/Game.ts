import Level from './base/Level';
export default class Game extends Phaser.State {
	public create() {
		if ("debug"){
			this.game.add.plugin(new Phaser.Plugin.Debug(this.game, this.game.plugins));
		}
		Level.score = 0;
		this.game.state.start("Level1");
	}

}
