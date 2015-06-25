define(function(require){
    var PIXI        = require("libs/pixi");

    var CustomLoader = function(data){
        PIXI.AssetLoader.apply(this, [data.resources]);
        this.onComplete = data.onComplete;
        this.load();
    };

    CustomLoader.prototype = Object.create(PIXI.AssetLoader.prototype);
    return CustomLoader;
});
