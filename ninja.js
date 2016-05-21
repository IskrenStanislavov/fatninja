require.config({
    baseUrl: './',
    paths: {
        PIXI: "../node_modules/pixi.js/bin/pixi"
    }
});
var SKINS = [
    {
        color:"normal",
        tint: 0xFFFFFF
    },
    {
        color:"red",
        tint: 0xFF0000
    },
    {
        color:"green",
        tint: 0x00FF00
    },
    {
        color:"blue",
        tint: 0x2222FF
    },
    {
        color:"pink",
        tint: 0x7722FF
    },
    {
        color:"black",
        tint: 0x334433
    }
    ];
define(function(require){
    require("libs/functions");
    require("PIXI");
    // require("libs/extendPIXI");

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

    var resources = {
        "MAIN_DECOR"    : "images/decor.png",
        "CLOUD_RIGHT"   : "images/cloud01.png",
        "CLOUD_SMALL"   : "images/cloud02.png",
        "CLOUD_LEFT"    : "images/cloud03.png",
        "NINJA_SPRITE"  : "images/ninja.json",
        "GROUND_3"      : "images/ground03.png",
        "GROUND_8"      : "images/ground08.png",
        "GROUND_30"     : "images/ground30.png",
    };

    new CustomLoader({resources:Object.values(resources), onComplete: function(){
            var stage = new Stage({
                sizes: {
                    width: 1280,
                    height: 860
                },
                contextMenu: false,
                stageColor: 0xBEDAFF,
                canvasId: "game"
            });
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
            var a = {
                "0":new PIXI.Point(200, 140),
                "1":new PIXI.Point(408, 245),
                "2":new PIXI.Point( 40, 433),
                "3":new PIXI.Point(810, 530),
                "4":new PIXI.Point(1000, 326),
                "5":new PIXI.Point(350, 735),
                // "6":new PIXI.Point(1150, 735),
            };
            window.characters = Object.keys(a).map(function(skin, index){
                skin = SKINS[index];
                var ninja = stage.addChild(new Character({
                    skin:skin,
                }));
                ninja.position.copy(a[index]);
                ninja.logPositions();
                return ninja;
            });
            window.characters[0].testScenario("walk_left");
            window.characters[4].testScenario("walk_right");
        }
    });
});
