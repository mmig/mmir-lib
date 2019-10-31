
/**
 * asnyc grammar compiler for jison engine
 *
 * @module workers/jison-compiler
 *
 * @requires workers/async-compiler-utils
 * @requires workers/node-utils
 *
 * @see mmir.env.grammar.AsyncCompiler
 * @see mmir.env.grammar.JisonAsyncGenerator
 */

if(typeof self === 'undefined' && typeof process !== 'undefined'){
	require('./nodeWorkerThreadsInit');
}

typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
				require('./asyncCompileUtil.js') :
					importScripts('asyncCompileUtil.js');

var jison;
self._init = function(url, mmirBaseUrl){

	if(typeof WEBPACK_BUILD === 'undefined' || !WEBPACK_BUILD){
		var libUrl = self.getPath(url, mmirBaseUrl) +'.js';
		try {
			importScripts(libUrl);
		} catch(err){
			console.log('jison ansync compiler (web worker) _init ERROR: failed importScripts("'+libUrl+'") ', err.stack);
			self.postMessage({error: 'jison ansync compiler (web worker) _init ERROR: failed importScripts("'+libUrl+'") '+ err.stack});
		}
	} else {
		require('mmirf/jison');
	}

	//set global var that holds jison
	jison = Jison;
}

self.defaultOptions = {
	type: 'lalr'//'lr0' | 'slr' | 'lr' | 'll' | default: lalr
};

// setup jison compiler:

function _preparePrintImpl(_id){

	if(jison.print && jison.print.name === 'mmirPrint'){
		return;
	}

	jison.print = function mmirPrint(){

		// var args = $.makeArray(arguments);
		// //prepend "location-information" to logger-call:
		// args.unshift('jison', 'compile');
		//
		// //output log-message:
		// logger.error.apply(logger, args);

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

	if(!self.verifyInit(jison, 'jison', id)){
		return;
	}

	var options = self._getOptions(config);

	_preparePrintImpl(id);

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

		msg += '\n-----------------------------\n  Grammar Definition:\n-----------------------------\n' + grammarDefinition;

//    	if(jison.printError){
//    		jison.printError(msg);
//    	}
//    	else {
//    		console.error(msg);
//    	}
		self.postMessage({error: msg, id: id});

		msg = '[INVALID GRAMMAR] ' + msg + (error && error.name === 'SyntaxError' && error.stack? error.stack : '');
		grammarParser = 'var parser = { parse: function(){ var msg = '+JSON.stringify(msg)+'; console.error(msg); throw msg;}, lexer: {options: {}}}';
	}

	self.postMessage({def: grammarParser, isError: hasError, id: id, done: true});
}
