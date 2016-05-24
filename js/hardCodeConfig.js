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
    window.NINJA_START_POINTS = {
        "0":new PIXI.Point(200, 140),
        "1":new PIXI.Point(408, 245),
        "2":new PIXI.Point( 40, 433),
        "3":new PIXI.Point(810, 530),
        "4":new PIXI.Point(1000, 326),
        "5":new PIXI.Point(350, 735),
        // "6":new PIXI.Point(1150, 735),
    };

	return;
});
