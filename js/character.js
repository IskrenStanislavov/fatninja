define(function(require) {
	var PIXI        = require("PIXI");
	var GSAP        = require("GSAP");
	var Animation   = require("libs/animation");
	var KeyHandlers = require("./keyHandlers");

    require("./hardCodeConfig");

var KeyHandlersInit = false; //single handlers only
	var Character = function(settings){
		PIXI.Container.call(this);
		this.settings = settings;
		this._state = "null";
		this.facingDirection = (Math.random()>0.5 ? DIRECTIONS.Left : DIRECTIONS.Right);
		this.STATES = {};
		this.initStateAnimations();
		this.doAction("idle");
		this.doJump = false;
	};

	Character.prototype = Object.create(PIXI.Container.prototype);

	Character.prototype.initStateAnimations = function(){
		//die
		this.die = this.STATES.die = this.addChild(PIXI.MakeMovie(1,27, "die/die (%s).png", this.settings.skin.tint));

		//idle
		this.idle = this.STATES.idle = this.addChild(PIXI.MakeMovie(1,1, "idle/idle (%s).png", this.settings.skin.tint));

		//jump down
		this.jump_down = this.STATES.jump_down = this.addChild(PIXI.MakeMovie(1,1, "jump_down/ninja_jump_down (%s).png", this.settings.skin.tint));

		//land
		this.jump_land = this.STATES.jump_land = this.addChild(PIXI.MakeMovie(1,4, "jump_land/land (%s).png", this.settings.skin.tint));
		this.jump_land.loop = false;

		//jump over
		this.jump_over = this.STATES.jump_over = this.addChild(PIXI.MakeMovie(1,3, "jump_over/jump_over (%s).png", this.settings.skin.tint));

		//jump up
		this.jump = this.STATES.jump = this.addChild(PIXI.MakeMovie(1,1, "jump_up/jump_up(%s).png", this.settings.skin.tint));

		//stun
		this.stun = this.STATES.stun = this.addChild(PIXI.MakeMovie(1,18, "stun/stun (%s).png", this.settings.skin.tint));

		//walk
		this.walk = this.STATES.walk = this.addChild(PIXI.MakeMovie(1,6, "walk/walk (%s).png", this.settings.skin.tint));



		//FSM
		this.states = Object.keys(this.STATES);
		this.USER_TRIGGER_ACTIONS = ["walk", "jump"];
		this.ACTIONS = {
			"idle": {
				animation: "idle",//ninja
				toDirection: function(args){
					args.self.doAction(args.hasJump?"jump":"walk", DIRECTIONS[args.direction])
				},
				setIdle: function(args){
					return;
				},
				directions:{
					idle: DIRECTIONS.Idle
				}
			},
			"walk": {
				animation: "walk",//ninja
				toDirection: function(args){
					// console.log(args.hasJump);
					if (args.hasJump){
						args.self.doAction(args.hasJump?"jump":"walk", DIRECTIONS[args.direction])
					} else {
						args.self.setDirection(DIRECTIONS[args.direction]);
					}

				},
				setIdle: function(args){
					args.self.setDirection(DIRECTIONS.Idle);
					args.self.setState("idle");
				},
				// next : function(args){return "idle"},
				directions: {//cannot walk and stay idle
					left: DIRECTIONS.Left,
					right: DIRECTIONS.Right,
				}
			},
			"jump": {
				animation: "jump",//ninja
				toDirection: function(args){
					args.self.setDirection(DIRECTIONS[args.direction]);
				},
				setIdle: function(args){
					args.self.setDirection(DIRECTIONS.Idle);
				},
				next : function(args){return "jump_down"},
				directions: {
					idle: DIRECTIONS.Idle,
					left: DIRECTIONS.Left,
					right: DIRECTIONS.Right,
				}
			},
			"jump_down": {
				animation: "jump_down",//ninja
				toDirection: function(args){
					args.self.setDirection(DIRECTIONS[args.direction]);
				},
				setIdle: function(args){
					args.self.setDirection(DIRECTIONS.Idle);
				},
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
				toDirection: function(args){
					args.self.setDirection(DIRECTIONS[args.direction]);
				},
				setIdle: function(args){
					args.self.setDirection(DIRECTIONS.Idle);
				},
				next : function(args){
					if (args.self.doJump){
						return "jump";
					}
					if (!!args.self.directionInterval){
						return "walk";
					}
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
			"idle": ["jump", "walk", "stun", "die"],
			"jump_down": ["jump_over", "jump_land"],
			"jump_land": ["idle", "walk", "jump"],
			"jump_over": ["idle", "walk"],
			"jump": ["jump_down", ],
			"stun": ["stun", "idle", "walk", "jump"],
			"walk": [
				"die",
				"idle",
				"jump_down",
				"jump_land",
				"jump_over",
				"jump",
				"stun",
				"walk",
			],

		};
	};

	Character.prototype.listeners = function(){
		//listeners
		if (KeyHandlersInit){
			return;
		}
		KeyHandlersInit = true;
		this.keyHandlers = new KeyHandlers();
		this.keyHandlers.action.add(this.handleKeys, this);

	};

	Character.prototype.handleKeys = function(eData){
		this.doJump = eData.jump;
		// console.log(JSON.stringify(eData));
		// console.log(JSON.stringify(eData.directions));

		this.moveState = (eData.Left || eData.Right);
		if (!!eData.Left == !!eData.Right){
			if (eData.jump){
				this.ACTIONS[this._state].toDirection({self:this, direction:DIRECTIONS.Idle, hasJump: !!eData.jump});
			} else {
				this.ACTIONS[this._state].setIdle({self:this});
			}
		} else {
			this.ACTIONS[this._state].toDirection({self:this, direction:(eData.Left || eData.Right), hasJump: !!eData.jump});
		}
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
			if (typeof direction == "string"){
				direction = this.ACTIONS[type].directions[direction];
			}
			this.setDirection(direction);
		}
		this.setState(state);
	};

	Character.prototype.getStateAnimation = function(){
		return this.STATES[this._state];
	};

	Character.prototype.setDirection = function(newDirection){
		if (typeof newDirection == "string"){
			console.warn(newDirection);
			debugger;
			throw "should be -1,0,1"
		}
		this.directionInterval && window.clearInterval(this.directionInterval);
		this.directionInterval = 0; //reset the id
		if (!newDirection){
			return;
		}
		this.facingDirection = newDirection;
		this.updateDirection();
		if (newDirection == DIRECTIONS.Left){
			this.directionInterval = setInterval(function() {
				TweenMax.to(this.position, WALK.TWEEN_TIME, {x:Math.max(this.x-WALK.SPEED, STAGE_BOUNDS.left)});
			}.bind(this), WALK.TWEEN_TIME*100);
		} else if (newDirection == DIRECTIONS.Right){
			this.directionInterval = setInterval(function() {
				TweenMax.to(this.position, WALK.TWEEN_TIME, {x:Math.min(this.x+WALK.SPEED, STAGE_BOUNDS.right)});
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
					var nextStateGetter = this.ACTIONS["jump"].next;
					TweenMax.to(this.position, JUMP.TWEEN_TIME, {
						y: this.y - JUMP.HEIGHT,
						ease: JUMP.EASING,
						onComplete: !!nextStateGetter && function() {
							this.setState(nextStateGetter({self:this}));
						}.bind(this),
					});
				break;
				case "fall":
				case "jump_down":
					var nextStateGetter = this.ACTIONS["jump_down"].next;
					TweenMax.killTweensOf(this.position, {y:true});
					TweenMax.to(this.position, JUMP.TWEEN_TIME, {
						y: this.y + Math.min(JUMP.HEIGHT, this.toTheGround),
						ease: JUMP.EASING,
						onComplete: !!nextStateGetter && function() {
							var newState = nextStateGetter({self:this}); 
							if (newState!=this._state){
								this.setState(newState);
							}
						}.bind(this),
					});
				break;
				case "jump_land":
					this.jump_land.onComplete = function(){
						var nextStateGetter = this.ACTIONS["jump_land"].next;
						this.setState(nextStateGetter({self:this}));
					}.bind(this);
				break;
			}
			m.play && m.play();
		} else {
			var msg = "Inappropriate state transition" + this._state + "->" + newState;
			console.log(msg);
			throw msg;
		}
	};


	Character.prototype.updateJumpHeight = function(platform, toTheGround){
		this.fallsOn = platform;
		this.toTheGround = toTheGround;
	};


	Character.prototype.fallOn = function(){
		if (this._state == "walk"){
			this.setState("jump_down");
		}
	};


	Character.prototype.getBodyEdgePoints = function(){
		this.areaPoints = {
			top: {
				left: new PIXI.Point(-FRAMES.BOUNDS.left, -FRAMES.BOUNDS.top),
				right: new PIXI.Point(+FRAMES.BOUNDS.right, -FRAMES.BOUNDS.top),
			},
			bottom:{
				left: new PIXI.Point(-FRAMES.BOUNDS.left, +FRAMES.BOUNDS.bottom),
				right: new PIXI.Point(+FRAMES.BOUNDS.right, +FRAMES.BOUNDS.bottom),
			}
		};
        // this.updateTransform();

		var bbox = this.getBounds(PIXI.Matrix.IDENTITY.translate(this.x, this.y));

		this.edgePoints = { // global
            left_x:    this.x - FRAMES.BOUNDS.left,
            right_x:   this.x + FRAMES.BOUNDS.right,
            top_y:     this.y - FRAMES.BOUNDS.top,
            bottom_y:  this.y + FRAMES.BOUNDS.bottom,
            width : bbox.width,
			height: bbox.height,
		};
		return this.edgePoints;
	};


//DBG stuff
	Character.prototype.logPositions = function(){
		this.getBodyEdgePoints();
		var animationBBOX = this.addChild(new PIXI.Graphics()).clear().beginFill(this.settings.skin.tint, 0.1).drawRect(-FRAMES.width/2, -FRAMES.height/2, FRAMES.width, FRAMES.height).endFill();
		var hitZone = this.addChild(new PIXI.Graphics())
			.clear()
			.beginFill(this.settings.skin.tint, 0.7)
			.moveTo(this.edgePoints.left_x, this.edgePoints.bottom_y)
			.lineTo(this.edgePoints.right_x, this.edgePoints.bottom_y)
			.lineTo(this.edgePoints.right_x, this.edgePoints.top_y)
			.lineTo(this.edgePoints.left_x, this.edgePoints.top_y)
			.lineTo(this.edgePoints.left_x, this.edgePoints.bottom_y)
			.endFill();
        hitZone.position.set(-this.x,-this.y);
	};
	Character.prototype.testScenario = function(sc){
		var tmp = sc.split(":");
		var type = tmp[0];
		var direction = tmp[1];
		return this.doAction(type, direction);
	};
	return Character;
});
