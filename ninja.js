define(function(require){
    require("libs/functions");

    var CustomLoader    = require("libs/loader");
    var Main            = require("js/background");
    var Character       = require("js/character");
    var Stage           = require("libs/stage");

    new CustomLoader({resources:[
        "images/decor.png",
        "images/ninja.json",
        ], onComplete: function(){
            var stage = new Stage({
                debugBG: true,
                contextMenu: false,
                stageColor: "black",
                canvasId: "game"
            });
            window.decor = stage.addChild(new Main());
            window.character = stage.addChild(new Character());
            window.stage = stage;
        }
    });
});
