export default class Boot extends Phaser.State {
	public preload() {
		this.load.image('preloader', './assets/images/loading_bar.png');
	}

	public create() {
		console.log("boot state ready");

		this.game.input.maxPointers = 1;
		this.game.state.start('preload');
	}
}
