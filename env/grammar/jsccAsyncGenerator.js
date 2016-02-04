

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
 */		
function(constants, jsccGen, asyncGen, $){

/**
 * Name for async WebWorker (file).
 * 
 * @constant
 * @private
 * @memberOf JsccAsyncGenerator#
 */
var WORKER_NAME = 'jsccCompiler.js';

//TODO doc: task ID for communication with web-worker
var _taskId = 1;

//web-worker instance:
var asyncCompiler = asyncGen.createWorker(WORKER_NAME);

var printError = jsccGen.printError;

var _applyGenerated = jsccGen._applyGenerated;

/**
 * Exported (public) functions for the PEG.js grammar-engine.
 * @public
 * @type GrammarGenerator
 * @memberOf JsccAsyncGenerator#
 */
var jsccAsyncGen = {
	/** @scope JsccAsyncGenerator.prototype */
	
	/** @returns {Boolean} if this engine compilation works asynchronously. The current implementation works synchronously (returns FALSE) */
	isAsyncCompilation: function(){ return true; },
	_compileParser: function(grammarDefinition, options, onAfterCompileParserResult){
		
        //start compilation in web-worker:
        asyncCompiler.postMessage({
    		cmd: 'parse',
    		id: onAfterCompileParserResult,
    		config: options,
    		text: grammarDefinition
    	});
        
	},
	_preparePrintError: function(){},//<- overwrite with NOOP
	/**
	 * Optional hook for pre-processing the generated parser, after the parser is generated.
	 * 
	 * By default, this function returns VOID, in which case the parser-module is created by default.
	 * 
	 * If a function is returned instead, then it must invoke <code>compileParserModuleFunc</code>:
	 * <code>compileParserModuleFunc(compiledParser : STRING, hasErrors : BOOLEAN)</code>
	 * 
	 * 
	 * @param {Function} compileParserModuleFunc
	 * 				the function that generates the parser-module:
	 * 				<code>compileParserModuleFunc(compiledParser : STRING, hasErrors : BOOLEAN)</code>
	 * 
	 * @returns {Function|VOID}
	 * 				VOID for the default behavior, or a function that should
	 * 				be executed after the parser was generated (NOTE this function must invoke compileParserModuleFunc) 
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
