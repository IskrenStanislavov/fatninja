define(function(require) {
	var PIXI        = require("PIXI");
	var Background = function(){
		PIXI.Container.call(this);
		this.img = PIXI.Sprite.fromFrame("images/decor.png");
	};

	Background.prototype = Object.create(PIXI.Container.prototype);
	return Background;
});
