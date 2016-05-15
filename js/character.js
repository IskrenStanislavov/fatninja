define(function(require) {
	var PIXI        = require("PIXI");
	var Animation   = require("libs/animation");
    var Config 		= require("js/config");

	var Character = function(settings){
		PIXI.Container.call(this);
		this.idle = this.addChild(PIXI.Sprite.fromFrame("idle/idle (1).png"));
		this.idle.anchor.set(0.5, 0.5);
		this.idle.tint = settings.skin.tint;
		this.settings = settings;
	};

	Character.prototype = Object.create(PIXI.Container.prototype);
	Character.prototype.logPositions = function(){
		console.warn(this.idle.getLocalBounds());
		console.warn(this.idle.getBounds());

		console.warn(this.getLocalBounds());
		console.warn(this.getBounds());
		var bbox = this.getBounds();
		this.addChild(new PIXI.Graphics).clear().beginFill(this.settings.skin.tint, 0.7).drawRect(bbox.x, bbox.y, bbox.width, bbox.height).endFill();
	};
	return Character;
});
