define(function(require) {
	var PIXI        = require("PIXI");
    require("js/hardCodeConfig");
    var Ground          = require("js/ground");
    var Clouds          = require("js/clouds"); //TODO: animate

    var Dekor = function(){
        PIXI.Container.call(this);
        this.bg = this.addChild(PIXI.Sprite.fromFrame(resources.MAIN_DECOR));
        this.bg.visible = false;
        //TODO: make cloud animation
        this.clouds = [
            // this.addChild(PIXI.Sprite.fromFrame(resources.CLOUD_RIGHT)),
            this.addChild(new Clouds({frame:resources.CLOUD_LEFT,  position:{x:  0, y:0}, /*scale:{x:1,y:1}, pivot:{x:0,y:0}*/ })),
            this.addChild(new Clouds({frame:resources.CLOUD_SMALL, position:{x:437, y:0}, /*scale:{x:1,y:1}, pivot:{x:0,y:0}*/ })),
            this.addChild(new Clouds({frame:resources.CLOUD_RIGHT, position:{x:706, y:0}, /*scale:{x:1,y:1}, pivot:{x:0,y:0}*/ })),
        ];

        //TODO: make ground solid
        this.ground = [ // sorted by x
            //small size
            this.addChild(new Ground({frame: resources.GROUND_3,  position: {x:  0, y:519}})), // most left
            this.addChild(new Ground({frame: resources.GROUND_3,  position: {x:163, y:225}})),
            this.addChild(new Ground({frame: resources.GROUND_3,  position: {x:778, y:616}})),
            //medium size
            this.addChild(new Ground({frame: resources.GROUND_8,  position: {x:376, y:330}})), // in the middle
            this.addChild(new Ground({frame: resources.GROUND_8,  position: {x:968, y:412}})), // to the right
            //main ground
            this.addChild(new Ground({frame: resources.GROUND_30, position: {x:  0, y:822}})), // bottom
        ];

    };
    Dekor.prototype = Object.create(PIXI.Container.prototype);
	return Dekor;
});

