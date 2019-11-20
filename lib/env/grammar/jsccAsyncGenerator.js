

define(['mmirf/jsccGen','mmirf/asyncGen','mmirf/util/deferred','mmirf/util/extend','mmirf/util/isArray'],
/**
 * Asynchronous generator for executable language-grammars (i.e. converted JSON grammars).
 *
 * <p>
 * This generator uses JS/CC for compiling the JSON grammar.
 *
 * <p>
 * Usage of this compile is the same as for synchronously working JsccGenerator.
 *
 * @see JsccGenerator
 *
 * @class
 * @constant
 * @public
 * @name JsccAsyncGenerator
 * @memberOf mmir.env.grammar
 * @hideconstructor
 *
 * @requires JsccGenerator
 */
function(jsccGen, asyncGen, deferred, extend, isArray){

/**
 * Counter for generating IDs for compile-jobs that
 * are sent to the WebWorker
 *
 * @private
 * @memberOf JsccAsyncGenerator#
 */
var _taskId = 1;

/**
 * WebWorker instance for compiling parser asynchronously
 *
 * @private
 * @memberOf JsccAsyncGenerator#
 */
var asyncCompiler;

/**
 * printError function reference for compile-errors
 *
 * @private
 * @memberOf JsccAsyncGenerator#
 */
var printError = jsccGen.printError;

/**
 * HELPER for applying the compile-results (i.e. parser-code) to the parser-template
 *
 * @see JsccGenerator#_getGenerated
 * @see JsccGenerator#_applyGenerated
 *
 * @private
 * @memberOf JsccAsyncGenerator#
 */
var _applyGenerated = jsccGen._applyGenerated;

/**
 * create & initialize the async compiler:
 *
 * creates the asyncCompiler and initDef,
 * and sends init-message to asyncCompiler.
 *
 * @private
 * @memberOf JsccAsyncGenerator#
 */
function initAsyncCompiler(){
	asyncCompiler = asyncGen.createWorker(jsccGen.engineId);
	initDef = deferred();
	var initMsg = asyncCompiler.prepareOnInit(jsccGen, initDef);
	asyncCompiler.postMessage(initMsg);
	asyncCompiler._onerror = printError;
}

//////////////////// init async compiler/thread /////////////////////////

// for async init-signaling:
var initDef;

//immedately start initialization for async compiler:
initAsyncCompiler();

/**
 * Exported (public) functions for the PEG.js grammar-engine.
 * @public
 * @type GrammarGenerator
 * @memberOf JsccAsyncGenerator#
 */
var jsccAsyncGen = {
	/** @scope JsccAsyncGenerator.prototype */

	/**
	 * @see JsccAsyncGenerator#init
	 * @memberOf JsccAsyncGenerator.prototype
	 */
	init: function(callback){
		if(!asyncCompiler){
			//in case the compiler was destroyed -> re-init:
			initAsyncCompiler();
		}
		//overwrite with own async "init signal"
		if(callback){
			initDef.then(callback, callback);
		}
		return initDef;
	},
	/**
	 * frees up the resources of the async compiler
	 * ({@link #init} will re-initialize the resources)
	 *
	 * @param {Boolean} [force] OPTIONAL
	 * 										if TRUE, immediately terminates the async worker, otherwise
	 * 										will wait until no pending queries are registered any more
	 *
	 * @see CompileWebWorker#hasPendingCallback
	 * @see CompileWebWorker#addCallback
	 *
	 * @memberOf JsccAsyncGenerator.prototype
	 */
	destroy: function(force){
		if(asyncCompiler && asyncCompiler.terminate){

			if(!force){
				if(asyncCompiler.hasPendingCallback()){
					var tis = this;
					asyncCompiler._onidle = function(){
						tis.destroy();
					}
					return;
				}
			}

			asyncCompiler.terminate();
			asyncCompiler = null;
		}
	},
	/** @returns {Boolean} if this engine compilation works asynchronously.
	 * 						The current implementation works asynchronously (returns TRUE)
	 *
	 * @memberOf JsccAsyncGenerator.prototype
	 */
	isAsyncCompilation: function(){ return true; },
	/**
	 * @see JsccAsyncGenerator#_compileParser
	 * @protected
	 */
	_compileParser: function(grammarDefinition, options, onAfterCompileParserResult){

		//start compilation in web-worker:
		asyncCompiler.postMessage({
			cmd: 'parse',
			id: onAfterCompileParserResult,
			config: options,
			text: grammarDefinition
		});

	},
	/**
	 * @see JsccAsyncGenerator#_preparePrintError
	 * @protected
	 */
	_preparePrintError: function(){},//<- overwrite with NOOP
	/**
	 * @see JsccAsyncGenerator#_afterCompileParser
	 * @protected
	 */
	_afterCompileParser: function(compileParserModuleFunc){

		//callback-ID:
		var taskId = '' + _taskId++;

		//register callback for messages from web-worker:
		asyncCompiler.addCallback(taskId, function(evtData){

			if(evtData.error || evtData.level === 'error'){

				//handle error message:
				var msg = evtData.error || (isArray(evtData.message)? evtData.message.join('\n') : evtData.message);
				if(printError){
					printError(msg);
				}
				else {
					console.error(msg);
				}

				//////////////////// EARLY EXIT /////////////////
				//NOTE this is not the final message from the compiler-thread...
				return;

			} else if(evtData.level && evtData.message){

				asyncCompiler._logger[evtData.level](isArray(evtData.message)? evtData.message.join('\n') : evtData.message);

				//////////////////// EARLY EXIT /////////////////
				//NOTE this is not the final message from the compiler-thread...
				return;
			}


			var hasError = evtData.isError;
			var grammarParserData = evtData.def;

			var grammarParser = hasError? grammarParserData : jsccGen._applyGenerated(grammarParserData, jsccGen.template);

			compileParserModuleFunc(grammarParser, hasError);
		});

		return taskId;
	}
};

//extend/overload sync-compiler with async-compiler:
return extend({}, jsccGen, jsccAsyncGen);

});
