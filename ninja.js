require.config({
    baseUrl: './',
    paths: {
        PIXI: "../node_modules/pixi.js/bin/pixi",
        GSAP:"../node_modules/gsap/src/minified/TweenMax.min"
    }
});

define(function(require){
    require("libs/functions");
    require("js/hardCodeConfig");
    require("PIXI");
    require("GSAP");
    require("js/extendPIXI");

    var CustomLoader    = require("libs/loader");
    var Stage           = require("libs/stage");
    var Character       = require("js/character");
    var Ground          = require("js/ground");
    var Clouds          = require("js/clouds"); //TODO: animate
    var Skins           = SKINS;//require("js/skins");
    // var Config          = require("js/config");

    var Game = {};
    var d = 0;
    if (window.debug || 1){
        window.Game = Game;
        // require("libs/pixi.draggable.min")
        // d = 10;
    }

    new CustomLoader({resources:Object.values(resources), onComplete: function(){
            var stage = new Stage(STAGE_INIT_DATA);
            Game.bg = stage.addChild(PIXI.Sprite.fromFrame(resources.MAIN_DECOR));
            Game.bg.visible = false;
            //TODO: make cloud animation
            Game.clouds = [
                // stage.addChild(PIXI.Sprite.fromFrame(resources.CLOUD_RIGHT)),
                stage.addChild(new Clouds({frame:resources.CLOUD_LEFT,  position:{x:  0, y:0}, /*scale:{x:1,y:1}, pivot:{x:0,y:0}*/ })),
                stage.addChild(new Clouds({frame:resources.CLOUD_SMALL, position:{x:437, y:0}, /*scale:{x:1,y:1}, pivot:{x:0,y:0}*/ })),
                stage.addChild(new Clouds({frame:resources.CLOUD_RIGHT, position:{x:706, y:0}, /*scale:{x:1,y:1}, pivot:{x:0,y:0}*/ })),
            ];

            //TODO: make ground solid
            Game.ground = [ // sorted by x
                //small size
                stage.addChild(new Ground({frame: resources.GROUND_3,  position: {x:  0, y:519}})), // most left
                stage.addChild(new Ground({frame: resources.GROUND_3,  position: {x:163, y:225}})),
                stage.addChild(new Ground({frame: resources.GROUND_3,  position: {x:778, y:616}})),
                //medium size
                stage.addChild(new Ground({frame: resources.GROUND_8,  position: {x:376, y:330}})), // in the middle
                stage.addChild(new Ground({frame: resources.GROUND_8,  position: {x:968, y:412}})), // to the right
                //main ground
                stage.addChild(new Ground({frame: resources.GROUND_30, position: {x:  0, y:822}})), // bottom
            ];
            //char1
            //TODO: place Characters automaticaly on the top of some ground.
            window.characters = Object.keys(NINJA_START_POINTS).map(function(skin, index){
                skin = SKINS[index];
                var ninja = stage.addChild(new Character({
                    skin:skin,
                }));
                ninja.position.copy(NINJA_START_POINTS[index]);
                ninja.logPositions();
                return ninja;
            });
            // window.characters[0].testScenario("jump");

            window.characters[0].testScenario("jump:idle");
            window.characters[0].listeners();
            window.characters[1].testScenario("jump:right");
            window.characters[2].testScenario("jump:left");
            window.characters[3].testScenario("walk:left");
            window.characters[4].testScenario("walk:right");
            window.characters[5].testScenario("walk:right");
        }
    });
});
