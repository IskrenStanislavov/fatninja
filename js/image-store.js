define(function(require){
	var config 		= require('config'),
		createjs	= require('libs/easeljs-0.7.1.min'),
		createjs	= require('libs/preloadjs-0.4.1.min'),
		instance;
	ImageLoader = function(noteBoard, stage) {
		if (instance){
			return instance;
		}
		this.noteBoard = noteBoard;
		this.stage = stage;
		instance = this;
	};
	ImageLoader.prototype = new createjs.LoadQueue(false);
	ImageLoader.prototype.loadImages = function(callback) {
		this.addEventListener("complete", function (e) {
			callback && callback();
		});
		this.init();

		this.setMaxConnections(5);
		this.loadManifest(config.imagesManifest, true);
	};

	return ImageLoader;
})
