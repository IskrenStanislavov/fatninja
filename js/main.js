require.config({
    baseUrl: 'js',
});

define(function(require) {
	new (require('manager'))(window.game);
});
