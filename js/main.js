
var PRELOAD_IMAGES = [
		{src : "images/bin-sprite.png", id : "bin"},
		{src : "images/stickyNote.png", id : "note"},
		{src : "images/board.jpg", id : "board"}
	];

require.config({
    baseUrl: 'js',
});






define(function(require) {
	// var $ 			= require('libs/zepto.min'),
		// createjs	= require('libs/easeljs-NEXT.combined')
	var preloader	= require('preloader');
	preloader(window.game);

});
