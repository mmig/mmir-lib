define(['jquery'], function(jQuery){
	return function(arr, callback){
		jQuery.each(arr, function(index, value){
			return callback.call(arr, value, index, arr);
		});
	};
});
