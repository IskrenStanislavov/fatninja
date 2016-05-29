define(function(require) {
	var PIXI        = require("PIXI");

	var Clouds = function(config){
		PIXI.Container.call(this);
		var that = this;
		Object.keys(config).forEach(function(key){
			if (key=='frame'){
					that.img = that.addChild(PIXI.Sprite.fromFrame(config.frame));
			} else {
				that.img[key].copy(config[key]);
			}
		});
	};

	Clouds.prototype = Object.create(PIXI.Container.prototype);
	return Clouds;
});
