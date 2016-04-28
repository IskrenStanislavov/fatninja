String.prototype.ljust = String.prototype.ljust || function( width, padding ) {
	padding = padding || " ";
	padding = padding.substr( 0, 1 );
	if( this.length < width )
		return this + padding.repeat( width - this.length );
	else
		return this;
};

String.prototype.rjust = String.prototype.rjust || function( width, padding ) {
	padding = padding || " ";
	padding = padding.substr( 0, 1 );
	if( this.length < width )
		return padding.repeat( width - this.length ) + this;
	else
		return this;
};

String.prototype.center = String.prototype.center || function( width, padding ) {
	padding = padding || " ";
	padding = padding.substr( 0, 1 );
	if( this.length < width ) {
		var len		= width - this.length;
		var remain	= ( len % 2 == 0 ) ? "" : padding;
		var pads	= padding.repeat( parseInt( len / 2 ) );
		return pads + this + pads + remain;
	}
	else
		return this;
};

String.prototype.capitalize = String.prototype.capitalize || function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

Storage.prototype.setObject = Storage.prototype.setObject || function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = Storage.prototype.getObject || function(key, defaultValue) {
    return JSON.parse(this.getItem(key), defaultValue);
};

Array.prototype.range = function(start,end){
	return Array.apply(null, Array(end-start+1)).map(function (_, i){
	    // http://stackoverflow.com/a/10050831/3345926
	    return start+i;
	});
};

Array.prototype.shuffle = function(){
	var result = [];
	while(this.length > 0 ){
		result.push( this.splice(Math.floor(Math.random() * this.length), 1)[0] );
	}
	return result;
};

Object.values = Object.values || function(instance){
	return Object.keys(instance).map(function(key){
		return instance[key];
	});
};

define(function(require){
	return;
});