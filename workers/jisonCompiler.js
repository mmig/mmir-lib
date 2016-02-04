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
 * @module workers/jison-compiler
 */

importScripts('../vendor/libs/jison.js');

//get global var that holds jison:
var jison = Jison;

var defaultOptions = {
	type: 'lalr'//'lr0' | 'slr' | 'lr' | 'll' | default: lalr
};

var _makeArray = function(obj) {
	var list = [];
	for(var i in obj){
		list.push(obj[i]);
	}
	return list;
};

// setup jison compiler:

jison.print = function(){
	
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
		
    	var cfg = bnf.parse(grammarDefinition);
    	var parser = jison.Generator(cfg, options);
    	var grammarParser = parser.generate();
    	
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
    	
    	if(typeof error.lineNumber !== 'undefined'){
    		msg += ' at line '+error.lineNumber;
    	}

    	if(typeof error.column !== 'undefined'){
    		msg += ':'+error.column;
    	}
    	
    	if(typeof error.index !== 'undefined'){
    		msg += ' (offset '+error.index+')';
    	}
    	
//    	if(jison.printError){
//    		jison.printError(msg);
//    	}
//    	else {
//    		console.error(msg);
//    	}
    	self.postMessage({error: msg, id: id});
    	
    	msg = '[INVALID GRAMMAR] ' + msg;
    	grammarParser = 'var parser = { parse: function(){ var msg = '+JSON.stringify(msg)+'; console.error(msg); throw msg;} }';
    }
	
	self.postMessage({def: grammarParser, isError: hasError, id: id, done: true});
}

