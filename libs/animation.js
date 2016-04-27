define(function(require) {
	var PIXI        = require("libs/pixi");
	var Animation = function(settings){
		PIXI.MovieClip.call(this);
		PIXI.MovieClip.fromFrames([].range());
		this.idle = this.addChild(PIXI.Sprite.fromFrame("idle/idle (1).png"));
		this.idle.anchor.set(0.5,0.5);
		this.animation = this.addChild(new CharacterAnimation());
	};

	// Animation.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
	return Animation;
});
