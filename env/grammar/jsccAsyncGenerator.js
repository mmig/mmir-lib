

define(['constants', 'jsccGen', 'asyncGen', 'jquery'],
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
 * 
 * @requires JsccGenerator
 * @requires jQuery.extend
 * @requires jQuery.deferred
 */		
function(constants, jsccGen, asyncGen, $){

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
var asyncCompiler = asyncGen.createWorker(jsccGen.engineId);

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

//////////////////// init async compiler/thread /////////////////////////

asyncCompiler._onerror = printError;

//setup async init-signaling:
var initDef = $.Deferred();
var initMsg = asyncCompiler.prepareOnInit(jsccGen, initDef, require);
asyncCompiler.postMessage(initMsg);


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
		//overwrite with own async "init signal"
		if(callback){
			initDef.always(callback);
		}
		return initDef;
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
        	var grammarParserData = evtData.def;
        	
        	var grammarParser = jsccGen._applyGenerated(grammarParserData, jsccGen.template);
        
        	compileParserModuleFunc(grammarParser, hasError);
        });
		
        return taskId;
	}
};

//extend/overload sync-compiler with async-compiler:
return $.extend({}, jsccGen, jsccAsyncGen);

});
