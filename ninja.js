require.config({
    baseUrl: './',
    paths: {
        PIXI: "../node_modules/pixi.js/bin/pixi"
    }
});
define(function(require){
    require("libs/functions");

    var CustomLoader    = require("libs/loader");
    // var Main            = require("js/background");
    var Character       = require("js/character");
    var Stage           = require("libs/stage");

    var resources = {
        "MAIN_DECOR"    : "images/decor.png",
        "CLOUD_RIGHT"   : "images/cloud01.png",
        "NINJA_SPRITE"  : "images/ninja.json",
    };

    new CustomLoader({resources:Object.values(resources), onComplete: function(){
            var stage = new Stage({
                // debugBG: true,
                contextMenu: false,
                stageColor: "black",
                canvasId: "game"
            });
            // stage.addChild(new PIXI.Graphics()).beginFill()
            stage.addChild(PIXI.Sprite.fromFrame(resources.MAIN_DECOR));
            stage.addChild(PIXI.Sprite.fromFrame(resources.CLOUD_RIGHT));
            // window.decor = stage.addChild(new Main());
            window.character = stage.addChild(new Character());
            window.stage = stage;
        }
    });
});
