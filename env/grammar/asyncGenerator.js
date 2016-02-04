

define(['constants'],
/**
 * Module that provides a generator for parser-compiler WebWorker instances:
 * 
 * initializes the WebWorker instance and provides functions for communicating with
 * the WebWorker.
 * 
 * @class
 * @constant
 * @public
 * @name AsyncGenerator
 * @memberOf mmir.env.grammar
 * 
 * @requires WebWorker
 * 
 * @example
 * 
 * //initializes a WebWorker at MMIR's worker path, i.e. at constants.getWorkerPath() + "file.name":
 * var asyncCompiler = asyncGen.createWorker("jisonCompiler.js");
 * 
 * //create job ID (must be unique for each job):
 * var taskId = '1';
 * 
 * //register callback for the job ID:
 * asyncCompiler.addCallback(taskId, function(evtData){
 * 		
 * 		if(evtData.error){
 * 			//... do something
 * 		} else {
 * 			var hasError = evtData.hasError;
 * 			var grammarParser = evtData.def;
 * 
 * 			//... do something
 * 		}
 * 
 * });
 * 
 * //start a compile job on the worker:
 * asyncCompiler.postMessage({
 * 		cmd: 'parse',
 *  	id: taskId,
 *  	config: options,		//compile options (specific to compiler engine)
 *  	text: grammarDefinition	//parser definition (using the syntax of the specific compiler engine)
 * });
 * 
 */		
function(constants){

/**
 * Factory for creating WebWorkers that compile grammar-parser
 * 
 * @class AsyncCompiler
 */
return {
	/** @scope AsyncCompiler.prototype */
	
	/** 
	 * Create a WebWorker for compiling grammars.
	 * 
	 * The returned WebWorker provides 2 additional convenience functions
	 * for communicating with the WebWorker thread:
	 * 
	 * <code>addCallback(taskId : String, callback : Function)</code>
	 * where <em>taskId</em> is a unique String identifying a single compile-job
	 * and <em>callback</em> handles messages that come back from the WebWorker thread:
	 * 
	 * The <code>callback(eventData)</code> will invoke the callback with the message's data
	 * The property <code>eventData.done</code> has a special function:
	 * 		 if this property is present with a TRUTHY value, then callback will be removed, i.e. 
	 *       not listening anymore for the specified taskId.
	 *       
	 * After adding a <em>callback</em>, messages to the WebWorker thread can be send with
	 * the <code>postMessage({id: taskId, cmd: 'parse', ...})</code>
	 * 
	 * @param {String} webWorkerFile
	 * 			the name of the file that holds the WebWorker implementation.
	 * 			The file must be located in MMIR's {@link Constants#getWorkerPath}
	 * 			directory.
	 * 
	 * @returns {CompileWebWorker}
	 * 			a WebWorker that provides some convenience functions for
	 * 			communicating with the WebWorker/thread.
	 * 
	 * @memberOf AsyncCompiler#
	 */
	createWorker: function(webWorkerFile){
		

		/**  @memberOf CompileWebWorker# */
		var workerPath = constants.getWorkerPath() + webWorkerFile;

		/** 
		 * web-worker for compile jobs
		 * 
		 * @class CompileWebWorker
		 * @memberOf AsyncCompiler.createWorker
		 */
		var asyncCompiler = new Worker(workerPath);

		/**
		 * dictionary for currently active compilations
		 * 
		 * <pre>
		 * [id] -> callback-function()
		 * </pre>  
		 * 
		 * @memberOf CompileWebWorker#
		 */
		asyncCompiler._activeTaskIds = {};

		/**
		 * HELPER: register a callback (usage: see jisonGen.compileGrammar() below)
		 * 
		 * @memberOf CompileWebWorker#
		 */
		asyncCompiler.addCallback = function(id, cb){
			this._activeTaskIds[id] = cb;
		};

		/**
		 * handler for messages/event from web-worker:
		 * 
		 * @memberOf CompileWebWorker#
		 */
		asyncCompiler.onmessage = function(evt){
			
			var id = evt.data.id;
			if(id){
				
				if(this._activeTaskIds[id]){
					
					this._activeTaskIds[id](evt.data);
					
				} else {
					console.warn('no callback registered for ID "'+id+'" -> ' + JSON.stringify(evt.data));
				}
				
				//this was the final message for this ID -> remove callback-function from "active tasks" dictionary:
				if(evt.data.done){
					this._activeTaskIds[id] = void(0);
				}
			}
			else if(evt.data.error){
				
				console.error('Error in '+workerPath+': '+evt.data.error);
			}
//			else if(evt.data.config === 'success'){
//				console.info('successfully configured thread '+workerPath+'.');
//			}
			else {
				console.error('ERROR unknown message -> ' + JSON.stringify(evt.data));
			}
			
		};
		
		return asyncCompiler;
	}
};

});
