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

if(typeof console === 'undefined'){
	
	//-> if WebWorker implementation does not provide a console
	
	var consoleStubFunc = function(msg){};
	
	var consoleFunc;
	if(typeof postError !== 'undefined'){
		consoleFunc = function(msg){
			postError(msg);
		};	
	} else {
		consoleFunc = consoleStubFunc;
	}
	
	console = {
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
function getPath(scriptUrl){
	
	//if starts with protocol "*://" -> absolute path
	if(/^[^/]+:\/\//.test(scriptUrl)){
		return scriptUrl;
	}
	
	//if it is a relative path, we must "navigate back" from the worker's path
	return '../../'+scriptUrl;
}

