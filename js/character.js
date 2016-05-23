define(function(require) {
	var PIXI        = require("PIXI");
	var GSAP        = require("GSAP");
	var Animation   = require("libs/animation");
    // var Config 		= require("js/config");
var collect = function(s, e, url){
	return [].range(s,e).map(function(i){return url.replace("%s",""+i)})
};
var FRAMES = {
    width: 134*2,
    height: 172,
    BOUNDS:{
    	left:  40,
    	right: 40,
    	top:  200,
    	bottom:10,
    }
};
var GLOBAL_SPEED = 0.4;//decimal (0,1]
var GLOBAL_SIZE = {
	W:1280,
	H:860
};
var JUMP = {
	HEIGHT: 100,//px
	TWEEN_TIME: 0.3,//sec
	EASING: Power2.EaseOut
};
var WALK = {
	TWEEN_TIME: 0.1,//sec
	SPEED: 21,//px
};
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
DIRECTIONS = {//TODO: can hold the speeds as well
	Left: 1,
	Idle: 0,
	Right:-1
};
	var Character = function(settings){
		PIXI.Container.call(this);
		this.settings = settings;
		this._state = "null";
		this.facingDirection = (Math.random()>0.5 ? DIRECTIONS.Left : DIRECTIONS.Right);
		this.STATES = {};
		this.initStateAnimations();
		this.doAction("idle");
		// this.setState();
		// this.setDirection( (Math.random()>0.5 ? DIRECTIONS.Left : DIRECTIONS.Right) );

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
		this.USER_TRIGGER_ACTIONS = ["walk", "jump"];
		this.ACTIONS = {
			"idle": {
				animation: "idle",//ninja
				directions:{
					idle: DIRECTIONS.Idle
				}
			},
			"walk": {
				animation: "walk",//ninja
				// next : function(args){return "idle"},
				directions: {//cannot walk and stay idle
					left: DIRECTIONS.Left,
					right: DIRECTIONS.Right,
				}
			},
			"jump": {
				animation: "jump_up",//ninja
				next : function(args){return "jump_down"},
				directions: {
					idle: DIRECTIONS.Idle,
					left: DIRECTIONS.Left,
					right: DIRECTIONS.Right,
				}
			},
			"jump_down": {
				animation: "jump_down",//ninja
				next : function(args){
					if (args && !!args.under){
						args.under.hit();
						return "splash";
					}
					return "jump_land";
				},
				directions: {
					idle: DIRECTIONS.Idle,
					left: DIRECTIONS.Left,
					right: DIRECTIONS.Right,
				}
			},
			"jump_land": {
				animation: "jump_land",//ninja
				next : function(args){
					// if (args && !!args.under){
					// 	args.under.hit();
					// 	return "splash";
					// }
					return "idle";
				},
				directions: {
					idle: DIRECTIONS.Idle,
					left: DIRECTIONS.Left,
					right: DIRECTIONS.Right,
				}
			},
			"splash": {
				animation: "jump_over",//ninja
				next : function(args){return ["stun", "die"][0]},
				directions: {
					idle: DIRECTIONS.Idle,
				}
			},
			"hit": {
				state: "transit",//empty
				animation: undefined,//empty
				next : function(args){
					if (!!args.self.hasLives()){
						return "stun";
					}
					return "die";
				},
				directions: {
					idle: DIRECTIONS.Idle,
				}
			},
			"stun": {
				animation: "stun",
				next : function(args){
					if (!args.self.hasMove()){
						return "walk";
					}
					return "idle";
				},
				directions: {
					idle: DIRECTIONS.Idle,
				}
			},
			"die": {
				animation: "die",
				next : function(args){return "rebirth"},
				directions: {
					idle: DIRECTIONS.Idle,
				}
			},
			"rebirth": {
				animation: "null",
				next : function(args){return "idle"},
				directions: {
					idle: DIRECTIONS.Idle,
				}
			},
		};
		this.FSM = {
			null:["idle"],
			"die":["null"],
			"idle": ["jump_up", "walk", "stun", "die"],
			"jump_down": ["jump_over", "jump_land"],
			"jump_land": ["idle", "walk"],
			"jump_over": ["idle", "walk"],
			"jump_up": ["jump_down", ],
			"stun": ["stun", "idle", "walk", "jump_up"],
			"walk": [
				"die",
				"idle",
				"jump_down",
				"jump_land",
				"jump_over",
				"jump_up",
				"stun",
				"walk",
			],

		};
	};
	Character.prototype.doAction = function(type, direction){
		// "action should be declared as:";
		// "walk:left";
		var state = this.ACTIONS[type].animation;
		if (!this.checkStateTransition(state)) {
			return;
		}
		// console.log();
		if (direction){
			this.setDirection(this.ACTIONS[type].directions[direction]);
		}
		this.setState(state);
		return;
		switch(sc) {
			case "walk_left":

				this.setDirection(DIRECTIONS.Left);
				// this.setState("walk");
			break;
			case "walk_right":
				this.setDirection(DIRECTIONS.Right);
				// this.setState("walk");
			break;
			case "jump_right":
				this.setDirection(DIRECTIONS.Right);
				this.setState("jump");
			break;
			case "jump":
			case "jump_up":
				// this.setDirection(DIRECTIONS.Right);
				this.setState("jump_up");
				TweenMax.to(this.position, JUMP.TWEEN_TIME, {
					y:this.y-JUMP.HEIGHT,
					ease:JUMP.EASING,
					onComplete
				});
			break;
			default:
			return;
		}
	};

	Character.prototype.getStateAnimation = function(){
		return this.STATES[this._state];
	};

	Character.prototype.setDirection = function(newDirection){
		this.directionInterval && window.clearInterval(this.directionInterval);
		if (!newDirection){
			return;
		}
		this.facingDirection = newDirection;
		this.updateDirection();
		if (newDirection == DIRECTIONS.Left){
			this.directionInterval = setInterval(function() {
				TweenMax.to(this.position, WALK.TWEEN_TIME, {x:Math.max(this.x-WALK.SPEED, FRAMES.BOUNDS.left)});
			}.bind(this), WALK.TWEEN_TIME*100);
		} else if (newDirection == DIRECTIONS.Right){
			this.directionInterval = setInterval(function() {
				TweenMax.to(this.position, WALK.TWEEN_TIME, {x:Math.min(this.x+WALK.SPEED, GLOBAL_SIZE.W-FRAMES.BOUNDS.right)});
			}.bind(this), WALK.TWEEN_TIME*100);
		}
		return;

	};

	Character.prototype.updateDirection = function(){
		this.getStateAnimation().scale.x = this.facingDirection;
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
			if (this._state != newState && this._state != "null"){
				//hide stale state animation
				this.getStateAnimation().visible = false;
			}
			this._state = newState;
			this.updateDirection();
			var m = this.getStateAnimation();
			m.visible = true;
			switch(this._state) {

				case "jump":
				case "jump_up":
					var nextStateGetter = this.ACTIONS["jump"].next;
					TweenMax.to(this.position, JUMP.TWEEN_TIME, {
						y: this.y - JUMP.HEIGHT,
						ease: JUMP.EASING,
						onComplete: !!nextStateGetter && function() {
							this.setState(nextStateGetter(this));
						}.bind(this),
					});
				break;
				case "fall":
				case "jump_down":
					var nextStateGetter = this.ACTIONS["jump_down"].next;
					TweenMax.to(this.position, JUMP.TWEEN_TIME/8, {
						y: this.y + JUMP.HEIGHT/8,
						ease: JUMP.EASING,
						onComplete: !!nextStateGetter && function() {
							this.setState(nextStateGetter(this));
						}.bind(this),
					});
				break;
				case "jump_land":
				// debugger;
					var nextStateGetter = this.ACTIONS["jump_land"].next;
					TweenMax.to(this.position, JUMP.TWEEN_TIME*7 /8, {
						y: this.y + JUMP.HEIGHT*7 /8,
						ease: JUMP.LAND_EASING,
						onComplete: !!nextStateGetter && function() {
							this.setState(nextStateGetter(this));
						}.bind(this),
					});
				break;
			}
			m.play && m.play();
		} else {
			var msg = "Inappropriate state transition" + this._state + "->" + newState;
			console.log(msg);
			throw msg;
		}
	};


//DBG stuff
	Character.prototype.logPositions = function(){
		// console.warn(this.idle.getLocalBounds());
		// console.warn(this.idle.getBounds());

		// console.warn(this.getLocalBounds());
		// console.warn(this.getBounds());
		var bbox = this.getLocalBounds();
		this.addChild(new PIXI.Graphics()).clear().beginFill(this.settings.skin.tint, 0.3).drawRect(bbox.x, bbox.y, bbox.width, bbox.height).endFill();
	};
	Character.prototype.testScenario = function(sc){
		var tmp = sc.split(":");
		var type = tmp[0];
		var direction = tmp[1];
		return this.doAction(type, direction);
	};
	return Character;
});
