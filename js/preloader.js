define(function(require) {
	var createjs	= require('libs/easeljs-0.7.1.min');

	return function (canvas) {
		var stage 		= new createjs.Stage(canvas),
			circle 		= new createjs.Shape();
		circle.graphics.beginFill("red").drawCircle(0, 0, 50);
		circle.x = 100;
		circle.y = 100;
		stage.addChild(circle);
		stage.update();
	};
});

