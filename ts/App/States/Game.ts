// namespace Phaser {
// 	export interface Game{
// 		score:number;
// 	}
// }
export default class Game extends Phaser.State {

	public create() {
		// this.game.score = 0;
		this.game.state.start("Level1");
	}

}
