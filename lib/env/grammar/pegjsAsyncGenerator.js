

define(['mmirf/pegjsGen','mmirf/asyncGen','mmirf/util/deferred','mmirf/util/extend'],
/**
 * Asynchronous generator for executable language-grammars (i.e. converted JSON grammars).
 *
 * <p>
 * This generator uses PEG.js for compiling the JSON grammar.
 *
 * <p>
 * Usage of this compile is the same as for synchronously working PegJsGenerator.
 *
 * @see PegJsGenerator
 *
 * @class
 * @constant
 * @public
 * @name PegJsAsyncGenerator
 * @memberOf mmir.env.grammar
 * @hideconstructor
 *
 * @requires PegJsGenerator
 */
function(pegjsGen, asyncGen, deferred, extend){

/**
 * Counter for generating IDs for compile-jobs that
 * are sent to the WebWorker
 *
 * @private
 * @memberOf PegJsAsyncGenerator#
 */
var _taskId = 1;

/**
 * WebWorker instance for compiling parser asynchronously
 *
 * @private
 * @memberOf PegJsAsyncGenerator#
 */
var asyncCompiler;

/**
 * printError function reference for compile-errors
 *
 * @private
 * @memberOf PegJsAsyncGenerator#
 */
var printError = pegjsGen.printError;

/**
 * create & initialize the async compiler:
 *
 * creates the asyncCompiler and initDef,
 * and sends init-message to asyncCompiler.
 *
 * @private
 * @memberOf PegJsAsyncGenerator#
 */
function initAsyncCompiler(){
	asyncCompiler = asyncGen.createWorker(pegjsGen.engineId);
	initDef = deferred();
	var initMsg = asyncCompiler.prepareOnInit(pegjsGen, initDef);
	asyncCompiler.postMessage(initMsg);
	asyncCompiler._onerror = printError;
}

////////////////////init async compiler/thread /////////////////////////

// for async init-signaling:
var initDef;

//immedately start initialization for async compiler:
initAsyncCompiler();

/**
 * Exported (public) functions for the PEG.js grammar-engine.
 * @public
 * @type GrammarGenerator
 * @memberOf PegJsAsyncGenerator#
 */
var pegjsAsyncGen = {
	/** @scope PegJsAsyncGenerator.prototype */

	/**
	 * @see PegJsAsyncGenerator#init
	 * @memberOf PegJsAsyncGenerator.prototype
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
	 * @memberOf PegJsAsyncGenerator.prototype
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
	 *  @memberOf PegJsAsyncGenerator.prototype
	 */
	isAsyncCompilation: function(){ return true; },
	/**
	 * @see PegJsAsyncGenerator#_compileParser
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
	 * @see PegJsAsyncGenerator#_preparePrintError
	 * @protected
	 */
	_preparePrintError: function(){},//<- overwrite with NOOP

	/**
	 * @see PegJsAsyncGenerator#_afterCompileParser
	 * @protected
	 */
	_afterCompileParser: function(compileParserModuleFunc){

		//callback-ID:
		var taskId = '' + _taskId++;

		//register callback for messages from web-worker:
		asyncCompiler.addCallback(taskId, function(evtData){

			if(evtData.error){

				//handle error message:

				if(printError){
					printError(evtData.error);
				}
				else {
					console.error(evtData.error);
				}

				//////////////////// EARLY EXIT /////////////////
				//NOTE this is not the final message from the compiler-thread...
				return;
			}

			var hasError = evtData.isError;
			var grammarParser = evtData.def;

			compileParserModuleFunc(grammarParser, hasError);
		});

		return taskId;
	}
};

//extend/overload sync-compiler with async-compiler:
return extend({}, pegjsGen, pegjsAsyncGen);

});
