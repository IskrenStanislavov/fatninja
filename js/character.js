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
DIRECTIONS = {
	Left:1,
	Right:-1
};
	var Character = function(settings){
		PIXI.Container.call(this);
		this.settings = settings;
		this._state = null;
		this._direction = null;
		this.STATES = {};
		this.initStateAnimations();
		this.setState("idle");
		this.setDirection( (Math.random()>0.5 ? DIRECTIONS.Left : DIRECTIONS.Right) );
	};

	Character.prototype = Object.create(PIXI.Container.prototype);

	Character.prototype.initStateAnimations = function(){
		//die
		this.die = this.STATES.die = this.addChild(MV(1,27, "die/die (%s).png", this.settings.skin.tint));

		//idle
		this.idle = this.STATES.idle = this.addChild(MV(1,1, "idle/idle (%s).png", this.settings.skin.tint));

		//jump down
		this.jump_down = this.STATES.jump_down = this.addChild(MV(1,1, "jump_down/ninja_jump_down (%s).png", this.settings.skin.tint));

		//land
		this.jump_land = this.STATES.jump_land = this.addChild(MV(1,4, "jump_land/land (%s).png", this.settings.skin.tint));

		//jump over
		this.jump_over = this.STATES.jump_over = this.addChild(MV(1,3, "jump_over/jump_over (%s).png", this.settings.skin.tint));

		//jump up
		this.jump_up = this.STATES.jump_up = this.addChild(MV(1,1, "jump_up/jump_up(%s).png", this.settings.skin.tint));

		//stun
		this.stun = this.STATES.stun = this.addChild(MV(1,18, "stun/stun (%s).png", this.settings.skin.tint));

		//walk
		this.walk = this.STATES.walk = this.addChild(MV(1,6, "walk/walk (%s).png", this.settings.skin.tint));



		//FSM
		this.states = Object.keys(this.STATES);
		this.FSM = {
			null:["idle"],
			"idle": ["jump_up", "walk"]
		};
	};

	Character.prototype.getState = function(){
		return this.STATES[this._state];
	};

	Character.prototype.setDirection = function(newDirection){
		this._direction = this.getState().scale.x = newDirection;
	};

	Character.prototype.checkStateTransition = function(newState){
		var oldState = this._state;

		if (this.FSM[oldState].indexOf(newState)>-1){
			return true;
		// } else if (oldState == newState){
		// 	return true;
		}
		return false;
	};

	Character.prototype.setState = function(newState){
		if (this.checkStateTransition(newState)){
			this._state = newState;
			var m = this.STATES[this._state];
			m.visible = true;
			m.play && m.play();
		} else {
			var msg = "Inappropriate state transition" + this._state + "->" + newState;
			console.log(msg);
			throw msg;
		}
	};

	Character.prototype.logPositions = function(){
		// console.warn(this.idle.getLocalBounds());
		// console.warn(this.idle.getBounds());

		// console.warn(this.getLocalBounds());
		// console.warn(this.getBounds());
		var bbox = this.getLocalBounds();
		this.addChild(new PIXI.Graphics).clear().beginFill(this.settings.skin.tint, 0.3).drawRect(bbox.x, bbox.y, bbox.width, bbox.height).endFill();
	};
	return Character;
});
