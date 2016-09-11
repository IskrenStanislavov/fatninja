require.config({
    baseUrl: './',
    paths: {
        PIXI: "../node_modules/pixi.js/bin/pixi",
        GSAP:"../node_modules/gsap/src/minified/TweenMax.min"
    }
});

window.DEV = true;
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
    var Ground          = require("js/ground");
    var Maths          = require("js/maths");

    var Arena = {};

    var Arena = function(){
        var arena = this;
        Stage.call(this, STAGE_INIT_DATA, function(){//on render
            if (!!this.initialized){
                if(!this.renderedOnce){
                    this.renderedOnce|=1;
                    if (DEV){
                    //     // arena.ninji[0].testScenario("jump:idle");
                    //     // arena.ninji[1].setState("jump_over");
                    //     // arena.ninji[2].setState("jump_land");
                    //     // arena.ninji[2].testScenario("jump:left");
                    //     // arena.ninji[3].testScenario("walk:left");
                    //     // arena.ninji[4].testScenario("walk:right");
                    //     // arena.ninji[5].testScenario("walk:right");
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
        this.ninji[0].listeners();
        this.initialized=true;
    };
    Arena.prototype = Object.create(Stage.prototype);
    Arena.prototype.initArena = function(){
        var groundContainer = this.addChild(new PIXI.Container());
        this.groundContainer = groundContainer;
        var arena = this.addChild(new PIXI.Container());
        this.arena = arena;
        // this.getRenderMoment();
        //TODO: make ground solid
        this.staticEdgePoints = [];
        this.staticObjects = GROUND_DATA.map(function(data){
            var ground = this.groundContainer.addChild(new Ground(data));
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
        var ninjiEdgePoints = [];
        this.ninji.forEach(function(ninja, index){
            var edges = ninja.getBodyEdgePoints();
            if ( ninja._state.indexOf("jump") != -1 || ninja._state == "walk" ){
                var platformData = Maths.closestToLand(edges, this.staticEdgePoints);
                ninja.abovePlatform(platformData);
           }
           ninjiEdgePoints.forEach(function(otherEdges, indexOtherNinja){
                var in_x_range = (Math.abs(otherEdges.position.x - edges.position.x) < edges.width);
                if (in_x_range){
                    var other = this.ninji[indexOtherNinja];
                    var y_delta = otherEdges.position.y - edges.position.y;
                    if ( y_delta > 0 ){ // ninja is higher other, still not above
                        ninja.tryHit(other, otherEdges);
                    } else {
                        other.tryHit(ninja, edges);
                    }
                }
           }.bind(this));
           //push after ninja-ninja checks
           ninjiEdgePoints.push(edges);

        }.bind(this));
    };

    OnLoad(function(){
        window.arena = new Arena();
    });
});
