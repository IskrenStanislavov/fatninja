
var PRELOAD_IMAGES = [
		{src : "images/bin-sprite.png", id : "bin"},
		{src : "images/stickyNote.png", id : "note"},
		{src : "images/board.jpg", id : "board"}
	];

require.config({
    baseUrl: 'js',
});

define(function(require) {
	require('manager')(window.game);
});
