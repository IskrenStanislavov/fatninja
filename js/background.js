define(function(require) {
	var PIXI        = require("libs/pixi");
	var Background = function(){
		PIXI.Sprite.call(this, PIXI.Texture.fromFrame("images/decor.png"));
	};

	Background.prototype = Object.create(PIXI.Sprite.prototype);
	return Background;
});
