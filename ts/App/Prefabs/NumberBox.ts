export default class NumberBox extends Phaser.Group {
	protected txtValue: Phaser.Text;
	constructor(game: Phaser.Game, bgasset: string, val: number, parent?: Phaser.Group) {
		super(game, parent);

		// initialize your prefab here
		this.create(0, 0, bgasset);

		var style = { font: "30px Arial", align: "center", fill: "#fff" };
		this.txtValue = new Phaser.Text(this.game, 55, 55, val.toString(), style);
		this.txtValue.anchor.setTo(.5, .5);
		this.add(this.txtValue);

	}

	setValue(val: number) {
		this.txtValue.text = val.toString();
	}
}
