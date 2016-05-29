define(function(require) {
	var PIXI        = require("PIXI");
    require("js/hardCodeConfig");
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
    };
    Dekor.prototype = Object.create(PIXI.Container.prototype);
	return Dekor;
});

