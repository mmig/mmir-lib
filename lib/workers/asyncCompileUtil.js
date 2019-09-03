
//load basic utilities for web-worker:
typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
				require('./workerUtil.js') :
					importScripts('workerUtil.js');

self._makeArray = function(obj) {
	var list = [];
	for(var i in obj){
		list.push(obj[i]);
	}
	return list;
};

self._getOptions = function(opt){
	return opt? opt : self.defaultOptions || {};
};

self.verifyInit = function(engine, engineId, taskId){

	if(!engine && typeof WEBPACK_BUILD === 'undefined'){
		self.postMessage({error: 'ReferenceError: parser-compiler "'+engineId+'" is not initialized yet!', level: 'error', id: taskId});
		return false;
	}

	return true;
}

/**
 * initialized the compiler and sends init-complete message when finished
 *
 * @param {PlainObject} config
 * 			configuration with property <code>config.engineUrl</code> (String)
 * @private
 */
self.init = function(config){

	if (config.engineUrl || (typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD)){

		self._init(config.engineUrl);
		self.postMessage({init: true});

	} else {

		self.postMessage({
			init: false,
			error: 'Could not load library for parser-compiler: missing property engineUrl in configuration: '+JSON.stringify(config)
		});
	}
}
