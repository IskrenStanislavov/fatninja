define(function(require) {
	var imageStore	= require('image-store'),
		createjs	= require('libs/easeljs-0.7.1.min');
		
	var preloader = function(canvas){
		this.init(canvas);
		return this; 
	};

	preloader.prototype.init = function(canvas) {
		this.stage = new createjs.Stage(canvas),

		this.circle = new createjs.Shape();
		this.circle.x = 100;
		this.circle.y = 100;
		this.stage.addChild(this.circle);
		return this;
	};

	preloader.prototype.start = function(callback) {
		this.circle.graphics.beginFill("red").drawCircle(0, 0, 50);
		this.stage.update();
		new imageStore().loadImages(function(){
			callback && callback();
		});
		return this;
	};

	preloader.prototype.done = function() {
		this.circle.graphics.beginFill("green").drawCircle(0, 0, 50);
		this.stage.update();
		return this;
	};

	return preloader; 
});

