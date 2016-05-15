define(function(require){
    var Skins 		= require("js/skins");

    var Config = {};
    Config.ninjaPositions = {};
    Skins.map(function(skin){
    	Config.ninjaPositions[skin.color] = new PIXI.Point(100, 200);
    });
    return Config;
});