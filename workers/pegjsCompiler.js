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

/**
 * @module workers/pegjs-compiler
 */

if(typeof self === 'undefined' && typeof process !== 'undefined'){
	require('./nodeWorkerThreadsInit');
}

typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
			 require('./asyncCompileUtil.js') :
		 importScripts('asyncCompileUtil.js');

if(typeof WEBPACK_BUILD === 'undefined'){
	importScripts('requirejsStubUtil.js');
}

/////////////// PEGjs compiler setup //////////////////////////////

var pegjs;
self._init = function(url){

	if(typeof WEBPACK_BUILD === 'undefined'){

		var libUrl = self.getPath(url) +'.js';
		self._modules._customid = libUrl;//'mmirf/pegjs';
		try {
			importScripts(libUrl);
			//set global var that holds jison
			pegjs = require(libUrl);
		} catch(err){
			var msg = 'pegjs ansync compiler (web worker) _init ERROR: failed importScripts("'+libUrl+'") ';
			console.log(msg, err.stack);
			self.postMessage({error: msg + err.stack});
		}
	} else {

		//set global var that holds jison
		pegjs = require('mmirf/pegjs');
	}

}

self.defaultOptions = {
	cache:    false,
//	allowedStartRules: void(0), FIXME DISABLED: pegjs actually evaluates this value, if it present (even if it is undefined/FALSY)
	optimize: "speed",
	output:   "source"
};

// setup PEG.js compiler:

function _preparePrintImpl(_id){

	if(pegjs.print && pegjs.print.name === 'mmirPrint'){
		return;
	}

	pegjs.print = function mmirPrint(){

	//	var args = $.makeArray(arguments);
	//	//prepend "location-information" to logger-call:
	//	args.unshift('jison', 'compile');
	//
	//	//output log-message:
	//	logger.error.apply(logger, args);

		var args = self._makeArray(arguments);
		self.postMessage({error: args});
	};
}

self.onmessage = function(e){

  switch(e.data.cmd){
    case 'init':
      self.init(e.data);
      break;
    case 'parse':
      parse(e.data.text, e.data.config, e.data.id);
      break;
  }

};

function parse(grammarDefinition, config, id){

	if(!self.verifyInit(pegjs, 'pegjs', id)){
		return;
	}

	_preparePrintImpl(id);

	var options = self._getOptions(config);

	var hasError = false;
    var grammarParser;
    try{
    	grammarParser = pegjs.generate(grammarDefinition, options);
    } catch(error) {
//    	"{
//    	  "message": "Expected \"=\" or string but \"_\" found.",
//    	  "expected": [
//    	    {
//    	      "type": "literal",
//    	      "value": "=",
//    	      "description": "\"=\""
//    	    },
//    	    {
//    	      "type": "other",
//    	      "description": "string"
//    	    }
//    	  ],
//    	  "found": "_",
//    	  "location": {
//    	  	"start": {
//    	  		"offset": 1233,
//    	  		"line": 26,
//    	  		"column": 5
//    	  	},
//    	  	"end": {
//    	  		"offset": 1234,
//    	  		"line": 26,
//    	  		"column": 6
//    	  	}
//    	  },
//    	  "name": "SyntaxError"
//    	}"
    	hasError = true;
    	var msg = ' while compiling grammar "' + config.id + '": ';
    	if(error.name === 'SyntaxError'){
    		msg= 'SyntaxError' + msg + error.message;
    	} else {
    		msg = 'Error' + msg + (error && error.stack? error.stack : error);
    	}

    	var loc = (error.location && (error.location.start || error.location.end)) || error;
    	if(typeof loc.line !== 'undefined'){
    		msg += ' at line '+loc.line;
    	}

    	if(typeof loc.column !== 'undefined'){
    		msg += ':'+loc.column;
    	}

    	if(typeof loc.offset !== 'undefined'){
    		msg += ' (offset '+loc.offset+')';
    	}

			msg += '\n-----------------------------\n  Grammar Definition:\n-----------------------------\n' + grammarDefinition;

//    	if(pegjs.printError){
//    		pegjs.printError(msg);
//    	}
//    	else {
//    		console.error(msg);
//    	}

    	self.postMessage({error: msg, id: id});

    	msg = '[INVALID GRAMMAR] ' + msg + (error && error.name === 'SyntaxError' && error.stack? error.stack : '');
    	grammarParser = '{ parse: function(){ var msg = '+JSON.stringify(msg)+'; console.error(msg); throw msg;} }';
    }

	self.postMessage({def: grammarParser, isError: hasError, id: id, done: true});
}
