define(function(require) {
	var PIXI        = require("PIXI");
	var Animation   = require("libs/animation");

	var Character = function(settings){
		PIXI.Container.call(this);
		this.idle = this.addChild(PIXI.Sprite.fromFrame("idle/idle (1).png"));
		this.idle.anchor.set(0.5,0.5);
		this.idle.tint = settings.skin.tint;

		// this.animation = this.addChild(new CharacterAnimation());
	};

	Character.prototype = Object.create(PIXI.Container.prototype);
	return Character;
});
