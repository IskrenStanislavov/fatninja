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
    window.DEV = 1;
    var OnLoad          = require("js/customLoader");
    var Stage           = require("libs/stage");
    var Dekor           = require("js/dekor");
    var Character       = require("js/character");
    var Ground          = require("js/ground");
    var Maths          = require("js/maths");

    var Arena = {};

    var Arena = function(){
        var arena = this;
        Stage.call(this, STAGE_INIT_DATA, function(){//on render
            if (!!this.initialized){
                if(!this.renderedOnce){
                    this.renderedOnce|=true;
                    arena.ninji[0].testScenario("jump:idle");
                    arena.ninji[0].listeners();
                    arena.ninji[1].testScenario("jump:right");
                    arena.ninji[2].testScenario("jump:left");
                    arena.ninji[3].testScenario("walk:left");
                    arena.ninji[4].testScenario("walk:right");
                    arena.ninji[5].testScenario("walk:right");
                    if (DEV){
                        arena.staticObjects.forEach(function(ground){
                            ground.logPositions();
                        });
                    }
                }
                this.applyChecks();
            }
        }.bind(this));
        this.addChild(new Dekor());
        this.initArena();
        this.initialized=true;
    };
    Arena.prototype = Object.create(Stage.prototype);
    Arena.prototype.initArena = function(){
        var arena = this.addChild(new PIXI.Container());
        this.arena = arena;
        // this.getRenderMoment();
        //TODO: make ground solid
        this.staticEdgePoints = [];
        this.staticObjects = GROUND_DATA.map(function(data){
            var ground = this.addChild(new Ground(data));
            this.staticEdgePoints.push(ground.getBodyEdgePoints());
            return ground;
        }.bind(this));

        //TODO: place Characters automaticaly on the top of some ground.
        this.ninji = NINJA_START_POINTS.map(function(position, index){
            var skin = SKINS[index];
            var ninja = arena.addChild(new Character({
                skin:skin,
            }));
            ninja.position.copy(position);
            if (DEV){
                ninja.logPositions();
            }
            return ninja;
        });
        this.me = this.ninji[0];
    };
    Arena.prototype.applyChecks = function(){
        this.ninji.forEach(function(ninja){
            if ( ninja._state.indexOf("jump") != -1 || ninja._state == "walk" ){
                var platformData = Maths.closestToLand(ninja.getBodyEdgePoints(),this.staticEdgePoints);
                ninja.abovePlatform(platformData);
           }
        }.bind(this));
    };

    OnLoad(function(){
        window.arena = new Arena();
    });
});
