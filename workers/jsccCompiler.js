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
 * @module workers/jscc-compiler
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

/////////////// JS/CC compiler setup //////////////////////////////

var jscc;
self._init = function(url){

	if(typeof WEBPACK_BUILD === 'undefined'){
		var libUrl = self.getPath(url) + '.js';
		self._modules._customid = 'mmirf/jscc';
		try {
			importScripts(libUrl);
			//set global var that holds JS/CC:
			jscc = self.require('mmirf/jscc');
		} catch(err){
			var msg = 'jscc ansync compiler (web worker) _init ERROR: failed importScripts("'+libUrl+'") ';
			console.log(msg, err);
			self.postMessage({error: msg + err.stack});
		}
	} else {
		//set global var that holds JS/CC:
		jscc = require('mmirf/jscc');
	}

}


self.defaultOptions = {
		//current there are no specific options for JS/CC
};

// setup JSCC compiler:

//setup logger for compile-messages
/**
 * HELPER for creating default logging / error-print functions
 *
 * @function
 * @private
 * @memberOf JsccGenerator#
 *
 * @see mmir.Logging
 */
function _createCompileLogFunc(log /*Logger*/, level /*String: log-function-name*/, taskId){
	return function(){
		var args = _makeArray(arguments);
		log.postMessage({message: args, level: level, id: taskId});
	};
}

function _preparePrintImpl(id){

	/**
	 * The default logging function for printing compilation errors.
	 * @private
	 * @name set_printError
	 * @function
	 * @memberOf JsccGenerator.jscc#
	 */
	jscc.set_printError(	_createCompileLogFunc(self, 'error', id));

	/**
	 * The default logging function for printing compilation warnings.
	 * @private
	 * @name set_printWarning
	 * @function
	 * @memberOf JsccGenerator.jscc#
	 */
	jscc.set_printWarning(	_createCompileLogFunc(self, 'warn', id));

	/**
	 * The default logging function for printing compilation information.
	 * @private
	 * @name set_printInfo
	 * @function
	 * @memberOf JsccGenerator.jscc#
	 */
	jscc.set_printInfo(		_createCompileLogFunc(self, 'info', id));

	return true;
}

var _getGenerated = function(genMode, dfaTable){
	return {
		head: jscc.get_code_head(),
		tables: jscc.print_parse_tables(genMode),//jscc.MODE_GEN_JS
		dfa: jscc.print_dfa_table(dfaTable),//dfa_table
		terminals: jscc.print_term_actions(),
		labels: jscc.print_symbol_labels(),
		actions: jscc.print_actions(),
		error: jscc.get_error_symbol_id(),
		eof: jscc.get_eof_symbol_id(),
		whitespace: jscc.get_whitespace_symbol_id()
	};
};


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

	if(!self.verifyInit(jscc, 'jscc', id)){
		return;
	}

	var options = self._getOptions(config);

	var template = config.template;
	var inputFieldName = config.inputFieldName;

	//setup print-functions (error, warning, info) for this compile-job:
	_preparePrintImpl(id);

	//set up the JS/CC compiler:
    var dfa_table = '';
    jscc.reset_all( jscc.EXEC_WEB );

    var hasError = false;
    var grammarParser;
    try {
    	jscc.parse_grammar(grammarDefinition);
    } catch (err){
    	var msg = 'Error while compiling grammar: ' + (err.stack?err.stack:err);
    	hasError = msg;

    	msg = '[INVALID GRAMMAR] ' + msg + (error && error.stack? error.stack : '');
    	grammarParser = 'var msg = '+JSON.stringify(msg)+'; console.error(msg); throw msg;';
    }

    if (jscc.getErrors() == 0) {
    	jscc.undef();
    	jscc.unreachable();

        if (jscc.getErrors() == 0) {
        	jscc.first();
        	jscc.print_symbols();
        	dfa_table = jscc.create_subset(jscc.get_nfa_states());
        	dfa_table = jscc.minimize_dfa(dfa_table);

        	jscc.set_dfa_table(dfa_table);//FIXME: check, if this is really necessary

        	jscc.lalr1_parse_table(false);
        	jscc.resetErrors();
        }
    }

    if (jscc.getErrors() > 0 || jscc.getWarnings() > 0){
        jscc.get_printError()(//logger.error(
//        		'JSCC', 'compile',
        		'there occured'
        		+ (jscc.getWarnings() > 0? jscc.getWarnings() + ' warning(s)' : '')
        		+ (jscc.getErrors() > 0? jscc.getErrors() + ' error(s)' : '')
        		+ ' during compilation.'
        );
    }
    jscc.resetErrors();
    jscc.resetWarnings();

    if( ! hasError){
        grammarParser = _getGenerated(options.targetType, dfa_table);
    }

	self.postMessage({def: grammarParser, isError: hasError, id: id, done: true});
}
