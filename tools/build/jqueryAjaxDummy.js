
define(['jquery', 'loadLocalFile'], function($, loadLocalFile){
	
	//extends the dummy-jQuery object with an AJAX-replacement for loading local files
	
	$.ajax = function(options){
		var isSuccess = true;
		var theError = null;
		var content = null;
		try{
			
			content = loadLocalFile(options.url, options.dataType);
			
		} catch (exc) {
			
			//handle with error callback, if present:
			if(options.error){
				options.error(this, 'error', exc);
			}
			
			//output error-stack if possible:
			console.error('NodeJS.ajax - '+(exc.stack?exc.stack:exc));
			
			isSuccess = false;
			theError = exc;
		}
		
		//handle success callback:
		if(isSuccess && options.success){
			options.success(content);
		}
		
		//return impl. for chaining,
		//  e.g. $.ajax(..).success( function ...
		//
		//NOTE: this rely on the fact, that loading is done synchronously 
		//      (otherwise we would need to implement them differently!)
		this.success = function(cb){ if(isSuccess) cb(content); };
		this.fail = function(cb){ if(!isSuccess) cb(theError); };
		this.then = function(cb1,cb1){ if(isSuccess) cb1(content); else cb2(content); };
		
		this.done = this.success;
		this.error = this.fail;
		return this;
	};
	
	return $;
});
