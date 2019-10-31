/**
 * asnyc grammar compiler for JSCC engine
 *
 * @module workers/jscc-compiler
 *
 * @requires workers/async-compiler-utils
 * @requires workers/node-utils
 * @requires workers/require-utils
 *
 * @see mmir.env.grammar.AsyncCompiler
 * @see mmir.env.grammar.JsccAsyncGenerator
 */

if(typeof self === 'undefined' && typeof process !== 'undefined'){
	require('./nodeWorkerThreadsInit');
}

typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
				require('./asyncCompileUtil.js') :
					importScripts('asyncCompileUtil.js');

if(typeof WEBPACK_BUILD === 'undefined' || !WEBPACK_BUILD){
	importScripts('requirejsStubUtil.js');
}

/////////////// JS/CC compiler setup //////////////////////////////

var jscc;
self._init = function(url, mmirBaseUrl){

	if(typeof WEBPACK_BUILD === 'undefined' || !WEBPACK_BUILD){
		var libUrl = self.getPath(url, mmirBaseUrl) + '.js';
		self._modules._customid = libUrl;//'mmirf/jscc';
		try {
			importScripts(libUrl);
			//set global var that holds JS/CC:
			jscc = self.require(libUrl);
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
		var args = self._makeArray(arguments);
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

	//setup print-functions (error, warning, info) for this compile-job:
	_preparePrintImpl(id);

	//set up the JS/CC compiler:
	var dfa_table = '';
	jscc.reset_all( jscc.EXEC_WEB );
	jscc.set_debug(/*show errors: */true, /*show warnings: */true, /*hide trace: */false);

	var hasError = false;
	var grammarParser;
	try {
		jscc.parse_grammar(grammarDefinition, 'grammar ' + options.id);
	} catch (err){
		var msg = 'Error while compiling grammar: ' + (err.stack?err.stack:err);
		hasError = msg;

		msg = '[INVALID GRAMMAR] ' + msg
					+ '\n-----------------------------\n  Grammar Definition:\n-----------------------------\n'
					+ grammarDefinition;

		grammarParser = 'var msg = '+JSON.stringify(msg)+'; console.error(msg); return {error: msg, phrase: nl_input_text, engine: "jscc"};';
	}

	var errorCount = jscc.getErrors();
	var warnCount = jscc.getWarnings();
	if (errorCount == 0) {
		jscc.undef();
		jscc.unreachable();
		errorCount = jscc.getErrors();

		if (errorCount == 0) {
			jscc.first();
			jscc.print_symbols();
			dfa_table = jscc.create_subset(jscc.get_nfa_states());
			dfa_table = jscc.minimize_dfa(dfa_table);

			jscc.set_dfa_table(dfa_table);//FIXME: check, if this is really necessary

			jscc.lalr1_parse_table(false);
		}
	}

	if (errorCount > 0 || warnCount > 0){
		jscc.get_printError()(//logger.error(
//        		'JSCC', 'compile',
							'there occured'
							+ (warnCount  > 0? warnCount  + ' warning(s)' : '')
							+ (errorCount > 0? errorCount + ' error(s)'   : '')
							+ ' during compilation.'
		);
		hasError = errorCount > 0;
	}

	if( ! hasError){

		grammarParser = _getGenerated(options.targetType, dfa_table);

	} else {

		var msg = 'Error'+(errorCount === 1? '': 's')+' parsing grammar ('+errorCount+'):\n  ' + jscc.getErrorMessages().join('\n  ');
		if(warnCount > 0){
			msg += '\nWarning'+(warnCount === 1? '': 's')+' parsing grammar('+warnCount+'):\n  ' + jscc.getWarningMessages().join('\n  ');
		}
		hasError = msg;

		msg = '[INVALID GRAMMAR] ' + msg
					+ '\n-----------------------------\n  Grammar Definition:\n-----------------------------\n'
					+ grammarDefinition;

		grammarParser = 'var msg = '+JSON.stringify(msg)+'; console.error(msg); return {error: msg, phrase: nl_input_text, engine: "jscc"};';
	}
	jscc.resetErrors();
	jscc.resetWarnings();

	self.postMessage({def: grammarParser, isError: hasError, id: id, done: true});
}
