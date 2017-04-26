define(function(){
	return function(arr, callback){
		return Array.prototype.forEach.call(arr, callback);
	};
});
