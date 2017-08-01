import Boot from './states/Boot';
import Preload from './states/Preload';
import Game from './states/Game';
import Level1 from './states/Level1';
import Level2 from './states/Level2';
import GameOver from './states/GameOver';
export default class App {
	public game: Phaser.Game;

	constructor() {
		this.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

		this.game.state.add('boot', new Boot());
		this.game.state.add('preload', new Preload());
		this.game.state.add('game', new Game());
		this.game.state.add('Level1', new Level1);
		this.game.state.add('Level2', new Level2);
		this.game.state.add('GameOver', new GameOver());

		this.game.state.start('boot');
	}
}
