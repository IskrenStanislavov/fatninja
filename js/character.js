define(function(require) {
	var PIXI        = require("libs/pixi");
	var Animation   = require("libs/animation");
	var Ninja = function(settings){
		PIXI.DisplayObjectContainer.call(this);
		this.idle = this.addChild(PIXI.Sprite.fromFrame("idle/idle (1).png"));
		this.idle.anchor.set(0.5,0.5);
		this.animation = this.addChild(new CharacterAnimation());
	};

	Ninja.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
	return Ninja;
});
