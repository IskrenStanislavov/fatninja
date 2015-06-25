define(function(require) {
	var PIXI        = require("libs/pixi");
	var Ninja = function(settings){
		PIXI.DisplayObjectContainer.call(this);
		this.idle = this.addChild(PIXI.Sprite.fromFrame("idle/idle (1).png"));
	};

	Ninja.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
	return Ninja;
});
