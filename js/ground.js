define(function(require) {
	var PIXI        = require("PIXI");

	var Ground = function(config){
		PIXI.Container.call(this);

		this.img = this.addChild(PIXI.Sprite.fromFrame(config.frame));
		this.img.position.copy(config.position);
	};

	Ground.prototype = Object.create(PIXI.Container.prototype);
	return Ground;
});
