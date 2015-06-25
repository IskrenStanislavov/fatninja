define(function(require){
    var PIXI        = require("libs/pixi");
    var tileConfig  = require('sokoban/config/tiles');

    var GridPoint = function(column, row){
    	this._row = 0;
    	this._column = 0;

        PIXI.Point.apply(this);
		this.tileSizes = new PIXI.Point(tileConfig.width, tileConfig.height);
    	this.column = column;
    	this.row = row;
    };

    GridPoint.prototype = Object.create(PIXI.Point.prototype);
    Object.defineProperties(GridPoint.prototype, {
    	"row": {
    		get: function() {
    			return this._row;
    		},
    		set: function(newRow) {
    			this._row = newRow;
    			this.y = this.tileSizes.y * newRow;
    		},
    	},
    	"column": {
    		get: function() {
    			return this._column;
    		},
    		set: function(column) {
    			this._column = column;
    			this.x = this.tileSizes.x * column;
    		},
    	},
    });

    return GridPoint;
});
