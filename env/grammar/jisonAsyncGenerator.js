

define(['mmirf/constants','mmirf/jisonGen','mmirf/asyncGen','mmirf/util/deferred','mmirf/util/extend'],
/**
 * Asynchronous generator for executable language-grammars (i.e. converted JSON grammars).
 *
 * <p>
 * This generator uses Jison for compiling the JSON grammar.
 *
 * <p>
 * Usage of this compile is the same as for synchronously working JisonGenerator.
 *
 * @see JisonGenerator
 *
 * @class
 * @constant
 * @public
 * @name JisonAsyncGenerator
 * @memberOf mmir.env.grammar
 *
 * @requires JisonGenerator
 */
function(constants, jisonGen, asyncGen, deferred, extend){

/**
 * Counter for generating IDs for compile-jobs that
 * are sent to the WebWorker
 *
 * @private
 * @memberOf JisonAsyncGenerator#
 */
var _taskId = 1;

/**
 * WebWorker instance for compiling parser asynchronously
 *
 * @private
 * @memberOf JisonAsyncGenerator#
 */
var asyncCompiler = asyncGen.createWorker(jisonGen.engineId);

/**
 * printError function reference for compile-errors
 *
 * @private
 * @memberOf JisonAsyncGenerator#
 */
var printError = jisonGen.printError;


////////////////////init async compiler/thread /////////////////////////

asyncCompiler._onerror = printError;

//setup async init-signaling:
var initDef = deferred();
var initMsg = asyncCompiler.prepareOnInit(jisonGen, initDef);
asyncCompiler.postMessage(initMsg);

/**
 * Exported (public) functions for the jison grammar-engine.
 * @public
 * @type GrammarGenerator
 * @memberOf JisonAsyncGenerator#
 */
var jisonAsyncGen = {
	/** @scope JisonAsyncGenerator.prototype */

	/**
	 * @see JisonAsyncGenerator#init
	 * @memberOf JisonAsyncGenerator.prototype
	 */
	init: function(callback){
		//overwrite with own async "init signal"
		if(callback){
			initDef.then(callback, callback);
		}
		return initDef;
	},

	/**
	 * @returns {Boolean} if this engine compilation works asynchronously.
	 * 						The current implementation works asynchronously (returns TRUE)
	 *
	 * @memberOf JisonAsyncGenerator.prototype
	 */
	isAsyncCompilation: function(){ return true; },
	/**
	 * @see JisonGenerator#_compileParser
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
//	/**
//	 * @see JisonGenerator#_preparePrintError
//	 * @protected
//	 */
//	_preparePrintError: function(){},//<- overwrite with NOOP
	/**
	 * @see JisonGenerator#_afterCompileParser
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
return extend({}, jisonGen, jisonAsyncGen);

});
