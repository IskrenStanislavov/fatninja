define(function(require) {
	var log = console.log;

	var preloader	 = require('preloader'),
		game		 = require('game'),
		config		 = require('config'),
		log			 = require('libs/log'),


		manager = function(canvas){
			this.init(canvas);
		},
		end;


	manager.prototype.init = function(canvas){
		var man = this;
		this.preloader = new preloader(canvas);
		this.preloader.start(function(){
			man.preloader.done();
			log("Preload READY");
		}.bind(this));
	};

	return manager;

});

