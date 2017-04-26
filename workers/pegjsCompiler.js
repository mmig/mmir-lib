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

importScripts('asyncCompileUtil.js');

var pegjs;
function _init(url){
	
	var libUrl = getPath(url) +'.js';
	importScripts(libUrl);//'../vendor/libs/peg-x.x.x.js');

	//set global var that holds jison
	pegjs = PEG;
}

var defaultOptions = {
	cache:    false,
//	allowedStartRules: void(0), FIXME DISABLED: pegjs actually evaluates this value, if it present (even if it is undefined/FALSY)
	optimize: "speed",
	output:   "source"
};

// setup PEG.js compiler:

function _preparePrintImpl(id){
	
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
		
		var args = _makeArray(arguments);
		self.postMessage({error: args});
	};
}

self.onmessage = function(e){
	
  switch(e.data.cmd){
    case 'init':
      init(e.data);
      break;
    case 'parse':
      parse(e.data.text, e.data.config, e.data.id);
      break;
  }
  
};

function parse(grammarDefinition, config, id){
	
	if(!verifyInit(pegjs, 'pegjs', id)){
		return;
	}
	
	_preparePrintImpl(id);
	
	var options = _getOptions(config);
    
	var hasError = false;
    var grammarParser;
    try{
    	grammarParser = pegjs.buildParser(grammarDefinition, options);
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
//    	  "offset": 4104,
//    	  "line": 40,
//    	  "column": 6,
//    	  "name": "SyntaxError"
//    	}"
    	hasError = true;
    	var msg = ' while compiling grammar "' + config.id + '": ';
    	if(error.name === 'SyntaxError'){
    		msg= 'SyntaxError' + msg + error.message;
    	}
    	else {
    		msg = 'Error' + msg + (error && error.stack? error.stack : error);
    	}
    	
    	if(typeof error.line !== 'undefined'){
    		msg += ' at line '+error.line;
    	}

    	if(typeof error.column !== 'undefined'){
    		msg += ':'+error.column;
    	}
    	
    	if(typeof error.offset !== 'undefined'){
    		msg += ' (offset '+error.offset+')';
    	}
    	
//    	if(pegjs.printError){
//    		pegjs.printError(msg);
//    	}
//    	else {
//    		console.error(msg);
//    	}

    	self.postMessage({error: msg, id: id});
    	
    	msg = '[INVALID GRAMMAR] ' + msg;
    	grammarParser = '{ parse: function(){ var msg = '+JSON.stringify(msg)+'; console.error(msg); throw msg;} }';
    }
	
	self.postMessage({def: grammarParser, isError: hasError, id: id, done: true});
}

