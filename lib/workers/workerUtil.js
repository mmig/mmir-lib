
/**
 * common helper scripts for mmir Web Workers
 *
 * @module workers/worker-utils
 */

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
 * @param {String} scriptUrl the grammar engine's script URL
 * @param {String} mmirBaseUrl the base URL of the mmir library
 * @returns the resolved script path
 */
self.getPath = function(scriptUrl, mmirBaseUrl){

	//if starts with protocol "*://" -> absolute path
	//OR if isMainThread === false -> (probably) node's experimental worker_threads (instead of "real" WebWorker)
	//OR if there is thread object present with a nextTick() function -> (probably) node WebWorker implementation (instead of "real" WebWorker)
	if(/^[^/]+:\/\//.test(scriptUrl) || self.isMainThread === false || (self.thread && typeof self.thread.nextTick === 'function')){
		return scriptUrl;
	}

	//if it is a relative path, we must "navigate back" from the worker's path,
	// i.e. from <mmir base URL>/workers/:
	//
	// -> go back count(<mmir base URL>-path-segements) + 1
	var relPathPrefix = mmirBaseUrl.split(/\\|\//).map(function(seg){
		//ignore empty path segments (i.e. leading/trailing slash or backslash)
		return seg? '../' : '';
	}).join('');

	return '../' + relPathPrefix + scriptUrl;
}
