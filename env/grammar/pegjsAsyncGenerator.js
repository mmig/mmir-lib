

define(['mmirf/constants','mmirf/pegjsGen','mmirf/asyncGen','mmirf/util/deferred','mmirf/util/extend', 'require'],
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
 * 
 * @requires PegJsGenerator
 */		
function(constants, pegjsGen, asyncGen, deferred, extend, require){

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
var asyncCompiler = asyncGen.createWorker(pegjsGen.engineId);

/**
 * printError function reference for compile-errors
 * 
 * @private
 * @memberOf PegJsAsyncGenerator#
 */
var printError = pegjsGen.printError;


////////////////////init async compiler/thread /////////////////////////

asyncCompiler._onerror = printError;

//setup async init-signaling:
var initDef = deferred();
var initMsg = asyncCompiler.prepareOnInit(pegjsGen, initDef, require);
asyncCompiler.postMessage(initMsg);


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
		//overwrite with own async "init signal"
		if(callback){
			initDef.then(callback, callback);
		}
		return initDef;
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
