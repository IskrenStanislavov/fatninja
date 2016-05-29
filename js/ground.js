define(function(require) {
	var PIXI        = require("PIXI");

	var Ground = function(config){
		PIXI.Sprite.call(this, PIXI.Texture.fromFrame(config.frame));
		this.position.copy(config.position);
		this.TOLERANCE = config.tolerance;
	};
	Ground.prototype = Object.create(PIXI.Sprite.prototype);

	Ground.prototype.getBodyEdgePoints = function(){
		var bbox = this.getBounds(PIXI.Matrix.IDENTITY.translate(this.x, this.y));

		this.edgePoints = { // global
            left_x:     this.x + this.pivot.x + bbox.width  * this.anchor.x +               this.TOLERANCE.left,
            right_x:    this.x + this.pivot.x + bbox.width  * this.anchor.x + bbox.width -  this.TOLERANCE.right,
            top_y:      this.y + this.pivot.y + bbox.height * this.anchor.y +               this.TOLERANCE.top,
            bottom_y:   this.y + this.pivot.y + bbox.height * this.anchor.y + bbox.height - this.TOLERANCE.bottom,
            width : bbox.width,
			height: bbox.height,
		};
		return this.edgePoints;
	};


	//DBG stuff
	Ground.prototype.logPositions = function(){
        this.getBodyEdgePoints();

		var hitZone = this.addChild(new PIXI.Graphics()).clear().beginFill(0xFFFAAA, 0.7)

		.moveTo(this.edgePoints.left_x, this.edgePoints.bottom_y)
		.lineTo(this.edgePoints.right_x, this.edgePoints.bottom_y)
		.lineTo(this.edgePoints.right_x, this.edgePoints.top_y)
		.lineTo(this.edgePoints.left_x, this.edgePoints.top_y)
		.lineTo(this.edgePoints.left_x, this.edgePoints.bottom_y)

		.endFill();
        hitZone.position.set(-this.x,-this.y);
	};

	return Ground;
});
