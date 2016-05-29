
define(function(require) {
	var Signal = require('libs/signals.min');

	var Handlers = function() {
		this.currentKeys = [];
		this.action = new Signal();
		this.config = {'moves':{
			// keyCode | action
			37: "Left",
			38: "jump",
			39: "Right",
			// 40: "down",
		}, "history":{
		// 	90: "undo",//ctrl+Z
		// 	89: "redo",//ctrl+Y
		// 	82: "revertAll"//ctrl+R
		}}
		document.onkeydown = this.keyDown.bind(this);
		document.onkeyup = this.keyUp.bind(this);
	};


	Handlers.prototype.getEvent = function(evt) {
		return (evt) ? evt : ((window.event) ? window.event : null);
	};

	Handlers.prototype.keyDown = function(evt) {
		evt = this.getEvent(evt);
		if (this.currentKeys.indexOf(evt.keyCode) >= 0){
			return;
		}
		if (evt) {
			var stopBubble;
			if ( evt.ctrlKey && 0) {
				stopBubble = this.handleCtrlCombination(evt.keyCode);
			} else {
				stopBubble = this.handleSingleKey(evt.keyCode);
			}
			if (stopBubble) {
				this.stopBubbleEvent(evt);
			}
		}
	};

	Handlers.prototype.handleCtrlCombination = function( keyId ) {
		//XXX: think of ctrl+left.. as а go to the most left.. posible
		var change = this.config.history[keyId];
		if ( change ){
			this.action.dispatch({type:"key", action:change, direction:null});
		}
		return !!change;
	};

	Handlers.prototype.handleSingleKey = function(keyId) {
		var move = this.config.moves[keyId];
		if (move){
			this.currentKeys.push(keyId);
			this.dispatchActions();
			// this.action.dispatch({type:"key", action:"move", direction:move});
		}
		return !!move;
	};

	Handlers.prototype.keyUp = function(evt) {
		evt = this.getEvent(evt);
		if ( this.currentKeys.indexOf(evt.keyCode) >= 0 ) {
			this.currentKeys.remove(evt.keyCode);
			this.dispatchActions();
			// var move = this.config.moves[evt.keyCode];
			// this.action.dispatch({type:"key", action:"move", direction:move});

		}
	};

	Handlers.prototype.stopBubbleEvent = function(e) {
		//e.cancelBubble is supported by IE - this will kill the bubbling process.
		if (document.all) {
			e.keyCode = 0;
			e.cancelBubble = true;
			e.returnValue = false;
			e.retainFocus = true;
		}

		//e.stopPropagation works in Firefox.
		if (e.stopPropagation) {
			e.stopPropagation();
			e.preventDefault();
		}
		return false;
	};

	Handlers.prototype.dispatchActions = function(){
		var directions = [];//this.currentKeys.map(function(key){return this.config.moves[key]}.bind(this));
		var dispatchState = {
			// type:"key",
			// action:"move", 
			directions: directions
		};
		Object.keys(this.config.moves).forEach(function(key){
			var move = this.config.moves[key];
			var isFired = this.currentKeys.indexOf(parseInt(key))>=0;
			dispatchState[this.config.moves[key]] = isFired?move:false;
			if (isFired){
				directions.push(move);
			}
		}.bind(this));
		this.action.dispatch(dispatchState);

	};
	return Handlers;
});

