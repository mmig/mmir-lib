/*
 * 	Copyright (C) 2012-2016 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 *
 * 	Permission is hereby granted, free of charge, to any person obtaining a
 * 	copy of this software and associated documentation files (the
 * 	"Software"), to deal in the Software without restriction, including
 * 	without limitation the rights to use, copy, modify, merge, publish,
 * 	distribute, sublicense, and/or sell copies of the Software, and to
 * 	permit persons to whom the Software is furnished to do so, subject to
 * 	the following conditions:
 *
 * 	The above copyright notice and this permission notice shall be included
 * 	in all copies or substantial portions of the Software.
 *
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

//load basic utilities for web-worker:
typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
				import('./workerUtil.js') :
				importScripts('workerUtil.js');

self._makeArray = function(obj) {
	var list = [];
	for(var i in obj){
		list.push(obj[i]);
	}
	return list;
};

var defaultOptions = {};
var _getOptions = function(opt){
	return opt? opt : defaultOptions;
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

	  _init(config.engineUrl);
	  self.postMessage({init: true});

  } else {

	  self.postMessage({
		  init: false,
		  error: 'Could not load library for parser-compiler: missing property engineUrl in configuration: '+JSON.stringify(config)
	  });
  }
}
