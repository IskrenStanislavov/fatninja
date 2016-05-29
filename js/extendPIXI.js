define(function(require){
	var PIXI        = require("PIXI");
    require("./hardCodeConfig");

	var collectFrames = function(s, e, url){
		return [].range(s,e).map(function(i){return url.replace("%s",""+i)})
	};

	PIXI.MakeMovie = function(startFrame, endFrame, url, tint){
		var move;
		if (startFrame == endFrame){
			move = PIXI.Sprite.fromFrame(collectFrames(startFrame, endFrame, url)[0]);
		} else {
			move = PIXI.extras.MovieClip.fromFrames(collectFrames(startFrame, endFrame, url));
		}
		move.pivot.set(FRAMES.width*0.5, FRAMES.height*0.5);
		move.visible = false;
		if (typeof tint !== "undefined"){
			move.tint = tint;
		}
		if (!!move.play) {
			move.animationSpeed = GLOBAL_SPEED;
			// move.play();
		}
		return move;
	};

	return;
});