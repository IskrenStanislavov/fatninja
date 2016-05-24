define(function(require) {
	var PIXI        = require("PIXI");

	var Ground = function(config){
		PIXI.Container.call(this);
		this.img = this.addChild(PIXI.Sprite.fromFrame(config.frame));
		this.img.position.copy(config.position);
		this.TOLERANCE = config.tolerance;
	};
	Ground.prototype = Object.create(PIXI.Container.prototype);


	//DBG stuff
	Ground.prototype.logPositions = function(){
		var bbox = this.getLocalBounds();
		var hitZone = this.addChild(new PIXI.Graphics()).clear().beginFill(0xFFFAAA, 0.7).drawRect(
			bbox.x + this.TOLERANCE.left,
			bbox.y + this.TOLERANCE.top,
			bbox.width - this.TOLERANCE.left - this.TOLERANCE.right,
			bbox.height - this.TOLERANCE.top - this.TOLERANCE.bottom
		).endFill();
	};

	return Ground;
});
