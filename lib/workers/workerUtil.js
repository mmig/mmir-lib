
if(typeof console === 'undefined'){

	//-> if WebWorker implementation does not provide a console

	var consoleStubFunc = function(_msg){};

	var consoleFunc;
	if(typeof postError !== 'undefined'){
		consoleFunc = function(msg){
			postError(msg);
		};
	} else {
		consoleFunc = consoleStubFunc;
	}

	self.console = {
		log: consoleStubFunc,
		debug: consoleStubFunc,
		info: consoleStubFunc,
		//only transfer WARN and ERROR messages:
		warn: consoleFunc,
		error: consoleFunc
	};
}

/**
 * HELPER for resolving script paths that will be loaded via importScripts()
 *
 * This helper resolves URL for scripts that are NOT located in the same directory/path as the worker itself
 * (do not use this helper for script URLs that are located in the same path as the worker!)
 *
 * @param scriptUrl
 * @returns the resolved script path
 */
self.getPath = function(scriptUrl){

	//if starts with protocol "*://" -> absolute path
	//OR if isMainThread === false -> (probably) node's experimental worker_threads (instead of "real" WebWorker)
	//OR if there is thread object present with a nextTick() function -> (probably) node WebWorker implementation (instead of "real" WebWorker)
	if(/^[^/]+:\/\//.test(scriptUrl) || self.isMainThread === false || (self.thread && typeof self.thread.nextTick === 'function')){
		return scriptUrl;
	}

	//if it is a relative path, we must "navigate back" from the worker's path
	return '../../'+scriptUrl;
}
