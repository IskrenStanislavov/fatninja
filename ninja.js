define(function(require){
    require("libs/functions");

    var CustomLoader    = require("libs/loader");
    var Main            = require("js/background");
    var Stage           = require("libs/stage");

    new CustomLoader({resources:[
        "images/decor.png",
        ], onComplete: function(){
            var stage = new Stage({
                debugBG: true,
                contextMenu: false,
                stageColor: "black",
                canvasId: "game"
            });
            stage.addChild(new Main());
            window.stage = stage;
        }
    });
});
