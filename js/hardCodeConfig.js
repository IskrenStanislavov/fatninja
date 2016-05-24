define(function(require) {
    require("GSAP");
    var PIXI = require("PIXI");

    window.GAME_SIZE = {
        W:1280,
        H:860
    };
    window.STAGE_INIT_DATA = {//goes to new State(..)
        sizes: {
            width: GAME_SIZE.W,
            height: GAME_SIZE.H
        },
        contextMenu: false,
        stageColor: 0xBEDAFF,
        canvasId: "game"
    };
    window.FRAMES = {
        width: 134*2,
        height: 172,
        BOUNDS:{
            left:  32,
            right: 32,
            top:  -5,
            bottom:77,
        },
    };
    window.STAGE_BOUNDS = {
        left : FRAMES.BOUNDS.left,
        right: GAME_SIZE.W - FRAMES.BOUNDS.right,
    };
    window.GLOBAL_SPEED = 0.4;//decimal (0,1]
    window.JUMP = {
        HEIGHT: 100,//px
        TWEEN_TIME: 0.3,//sec
        EASING: Power2.EaseOut
    };
    window.WALK = {
        TWEEN_TIME: 0.1,//sec
        SPEED: 21,//px
    };

    window.DIRECTIONS = {//TODO: can hold the speeds as well
        Left: 1,
        Idle: 0,
        Right:-1
    };

    window.SKINS = [
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
    window.resources = {
        "MAIN_DECOR"    : "images/decor.png",
        "CLOUD_RIGHT"   : "images/cloud01.png",
        "CLOUD_SMALL"   : "images/cloud02.png",
        "CLOUD_LEFT"    : "images/cloud03.png",
        "NINJA_SPRITE"  : "images/ninja.json",
        "GROUND_3"      : "images/ground03.png",
        "GROUND_8"      : "images/ground08.png",
        "GROUND_30"     : "images/ground30.png",
    };
    window.NINJA_START_POINTS = [
        new PIXI.Point(200, 149),
        new PIXI.Point(408, 254),
        new PIXI.Point( 40, 442),
        new PIXI.Point(810, 539),
        new PIXI.Point(1000,335),
        new PIXI.Point(350, 744),
        // new PIXI.Point(1150, 735+9),
    ];
    window.GROUND_DATA = [ // sorted by x
        //small size
        {frame: resources.GROUND_3,  position: {x:  0, y:519}, tolerance:{left:2, right:6,top:2,bottom:1} }, // most left
        {frame: resources.GROUND_3,  position: {x:163, y:225}, tolerance:{left:2, right:6,top:2,bottom:1} },
        {frame: resources.GROUND_3,  position: {x:778, y:616}, tolerance:{left:2, right:6,top:2,bottom:1} },
        //medium size
        {frame: resources.GROUND_8,  position: {x:376, y:330}, tolerance:{left:6, right:4,top:2,bottom:2} }, // in the middle
        {frame: resources.GROUND_8,  position: {x:968, y:412}, tolerance:{left:6, right:4,top:2,bottom:2} }, // to the right
        //main ground
        {frame: resources.GROUND_30, position: {x:  0, y:822}, tolerance:{left:0, right:0,top:2,bottom:0} }, // bottom
    ];

	return;
});
