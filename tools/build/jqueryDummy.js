
define(function(){
	
	//jQuery handling:
//	* create replacements for needed jQuery-functions
//	* create stubs for jQuery functions that are not needed (but are invoked -> avoid null-errors)
	
	var $ = function dummyJQuery (){ return $;};
	
	$.each = function(array, callback){//callback: function(index, obj)
		for(var i=0, size = array.length; i < size; ++i){
			callback.call(array[i], i, array[i]);
		}
	};
	
	return $;
});
