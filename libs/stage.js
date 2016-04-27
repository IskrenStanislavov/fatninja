define(function(require) {
    var PIXI        = require("libs/pixi");
    require('../node_modules/zepto/zepto.min');

    var Stage = function( settings ){
        this.renderer = PIXI.autoDetectRenderer(100, 100, {
            "view":document.getElementById((settings && settings.canvasId) || "game"),
            "clearBeforeRender":false,
            "transparent": false,
            "resolution":1,
            "roundPixels": false,
            "antialias": false
        });
        this.canvas = this.renderer.view;
        document.body.appendChild(this.canvas);

        this.color = (settings && settings.stageColor) || "black";
        PIXI.Stage.call(this, this.color);


        // if ( settings && settings.debugBG ) {
        //     this.addChild(new PIXI.Graphics().beginFill("red",1.0).drawRect(0,0,100,200).endFill());
        // }

        this.fittable = null;
        this.autoFitListeners();
        this.update();
    };


    Stage.prototype = Object.create( PIXI.Stage.prototype );

    Stage.prototype._getChildAt = Stage.prototype.getChildAt;

    Stage.prototype.getChildAt = function(index){
        if (index < 0){
            index += this.children.length;
        }
        return this._getChildAt(index);
    };

    Stage.prototype.update = function(){
        this.resize();
        this.renderer.render(this);
        requestAnimFrame(this.update.bind(this));
    };

    Stage.prototype.setAutoFit = function() {
        if (this.children.length===0) {
            return;
        }
        this.fittable = {
            W: this.getChildAt(0).width,
            H: this.getChildAt(0).height,
        };
        if ( !this.fittable.W || !this.fittable.H ){
            return;
        }
        this.renderer.resize(this.fittable.W, this.fittable.H)

    };

    //XXX: http://html5hub.com/screen-size-management-in-mobile-html5-games/

    Stage.prototype.disableContextMenu = function() {
        this.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
    };
    Stage.prototype.autoFitListeners = function() {
        var viewport = function() {
            window.scrollTo(0,1);
            this.resize();
        }.bind(this)
        document.onmousemove = document.ontouchmove = function(e) {
            e.preventDefault();
        };
        document.addEventListener("orientationchange", viewport);
        window.addEventListener('resize', viewport, true);
    };

    Stage.prototype.resize = function() {
        this.setAutoFit();
        if ( !this.fittable || !this.fittable.H ||!this.fittable.W ){
            return;
        }

        //we neeed the current; XXX: may store it n update it on orientation changes
        //XXX: can store the scale factors for both orientations
        //XXX: and change the chosen one on each orientation change
        var screenW = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var screenH = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        var scaleH = screenH / this.fittable.H;

        //choose proper scale factor
        var scale = (screenW >= scaleH * this.fittable.W) ?
            scaleH : 
            (screenW / this.fittable.W);

        scale = Math.min(scale, 1);

        $(this.canvas).css("width", Math.floor(this.fittable.W * scale));
        $(this.canvas).css("height", Math.floor(this.fittable.H * scale));
    };

    return Stage; 
});
