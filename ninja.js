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

    var OnLoad          = require("js/customLoader");
    var Stage           = require("libs/stage");
    var Dekor           = require("js/dekor");
    var Character       = require("js/character");

    var Arena = {};
    window.Arena = Arena;

    var Arena = function(){
        Stage.call(this, STAGE_INIT_DATA);
        this.addChild(new Dekor());
        this.initArena();
    };
    Arena.prototype = Object.create(Stage.prototype);
    Arena.prototype.initArena = function(){
        var arena = this.addChild(new PIXI.Container());

        //TODO: place Characters automaticaly on the top of some ground.
        this.ninji = Object.keys(NINJA_START_POINTS).map(function(skin, index){
            skin = SKINS[index];
            var ninja = arena.addChild(new Character({
                skin:skin,
            }));
            ninja.position.copy(NINJA_START_POINTS[index]);
            ninja.logPositions();
            return ninja;
        });

    };

    OnLoad(function(){
        var arena = new Arena();
        // window.ninji[0].testScenario("jump");
        arena.ninji[0].testScenario("jump:idle");
        arena.ninji[0].listeners();
        arena.ninji[1].testScenario("jump:right");
        arena.ninji[2].testScenario("jump:left");
        arena.ninji[3].testScenario("walk:left");
        arena.ninji[4].testScenario("walk:right");
        arena.ninji[5].testScenario("walk:right");
    });
});
