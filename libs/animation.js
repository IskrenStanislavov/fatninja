define(function(require) {
	var PIXI        = require("PIXI");
	var Animation = function(settings){
		PIXI.extras.MovieClip.call(this);
		// PIXI.extras.MovieClip.fromFrames([].range());
		this.idle = this.addChild(PIXI.Sprite.fromFrame("idle/idle (1).png"));
		this.idle.anchor.set(0.5,0.5);
		this.animation = this.addChild(new CharacterAnimation());
	};

	Animation.prototype = Object.create(PIXI.extras.MovieClip.prototype);
	return Animation;
});
