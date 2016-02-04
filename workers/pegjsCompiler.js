/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
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

importScripts('../vendor/libs/peg-0.8.0.js');

//get global var that holds PEG.js:
var pegjs = PEG;

var defaultOptions = {
	cache:    false,
	optimize: "speed",
	output:   "source",
	allowedStartRules: void(0)
};

var _makeArray = function(obj) {
	var list = [];
	for(var i in obj){
		list.push(obj[i]);
	}
	return list;
};

// setup PEG.js compiler:

pegjs.print = function(){
	
//	var args = $.makeArray(arguments);
//	//prepend "location-information" to logger-call:
//	args.unshift('jison', 'compile');
//	
//	//output log-message:
//	logger.error.apply(logger, args);
	
	var args = _makeArray(arguments);
	self.postMessage({error: args});
};

var _getOptions = function(opt){
	return opt? opt : defaultOptions;
};


self.onmessage = function(e){
	
  switch(e.data.cmd){
//    case 'init':
//      init(e.data.config);
//      break;
    case 'parse':
      parse(e.data.text, e.data.config, e.data.id);
      break;
  }
  
};

///**
// * sets the config and echos back
// * @param config
// * @private
// */
//function init(config){
//  if (config.type)	type = config.type;
//  self.postMessage({config: 'success'});
//}

function parse(grammarDefinition, config, id){
	
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

