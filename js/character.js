define(function(require) {
	var PIXI        = require("PIXI");
	var Animation   = require("libs/animation");
    // var Config 		= require("js/config");
var collect = function(s, e, url){
	return [].range(s,e).map(function(i){return url.replace("%s",""+i)})
};
var FRAMES = {
    width: 134*2,
    height: 172
};
var GLOBAL_SPEED = 0.4;

var MV = function(startFrame, endFrame, url, tint){
	var move;
	if (startFrame == endFrame){
		move = PIXI.Sprite.fromFrame(collect(startFrame, endFrame, url)[0]);
	} else {
		move = PIXI.extras.MovieClip.fromFrames(collect(startFrame, endFrame, url));
		move.loop = false;
	}
	move.pivot.set(FRAMES.width*0.5, FRAMES.height*0.5);
	move.visible = false;
	if (typeof tint !== "undefined"){
		move.tint = tint;
	}
	if (!!move.play) {
		move.animationSpeed = GLOBAL_SPEED;
		// move.play();
	}
	return move;
};
	var Character = function(settings){
		PIXI.Container.call(this);
		this.settings = settings;

		//die
		this.die = this.addChild(MV(1,27, "die/die (%s).png", settings.skin.tint));

		//idle
		this.idle = this.addChild(MV(1,1, "idle/idle (%s).png", settings.skin.tint));

		//jump down
		this.jump_down = this.addChild(MV(1,1, "jump_down/ninja_jump_down (%s).png", settings.skin.tint));

		//land
		this.jump_land = this.addChild(MV(1,4, "jump_land/land (%s).png", settings.skin.tint));

		//jump over
		this.jump_over = this.addChild(MV(1,3, "jump_over/jump_over (%s).png", settings.skin.tint));

		//jump up
		this.jump_up = this.addChild(MV(1,1, "jump_up/jump_up(%s).png", settings.skin.tint));

		//stun
		this.stun = this.addChild(MV(1,18, "stun/stun (%s).png", settings.skin.tint));

		//walk
		this.walk = this.addChild(MV(1,6, "walk/walk (%s).png", settings.skin.tint));
		this.walk.visible = true;

	};

	Character.prototype = Object.create(PIXI.Container.prototype);
	Character.prototype.logPositions = function(){
		console.warn(this.idle.getLocalBounds());
		console.warn(this.idle.getBounds());

		console.warn(this.getLocalBounds());
		console.warn(this.getBounds());
		var bbox = this.getBounds();
		this.addChild(new PIXI.Graphics).clear().beginFill(this.settings.skin.tint, 0.3).drawRect(bbox.x, bbox.y, bbox.width, bbox.height).endFill();
		this.walk.loop = true;
		this.walk.play();
	};
	return Character;
});
