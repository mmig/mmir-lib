

define(['mmirf/resources', 'mmirf/logger', 'mmirf/asyncUtils', 'require', 'module'],
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
 * //initializes a WebWorker at MMIR's worker path, i.e. at resources.getWorkerPath() + "file.name":
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
function(resources, Logger, asyncUtils, require, module){

var COMPILER_WORKER_POSTFIX = 'Compiler.js';

var MODULE_ID_PREFIX = 'mmirf/';

/**
 * Factory for creating WebWorkers that compile grammar-parser
 *
 * @class AsyncCompiler
 * @memberOf mmir.env.grammar
 */
return {

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
	 * @param {String} parserEngineId
	 * 			the name of the file that holds the WebWorker implementation.
	 * 			The file must be located in MMIR's {@link Resources#getWorkerPath}
	 * 			directory.
	 *
	 * @returns {mmir.env.grammar.CompileWebWorker}
	 * 			a WebWorker that provides some convenience functions for
	 * 			communicating with the WebWorker/thread.
	 *
	 * @memberOf mmir.env.grammar.AsyncCompiler#
	 */
	createWorker: function(parserEngineId){

		/**  @memberOf mmir.env.grammar.CompileWebWorker# */
		var workerPath = resources.getWorkerPath() + parserEngineId + COMPILER_WORKER_POSTFIX;

		/**  @memberOf mmir.env.grammar.CompileWebWorker# */
		var mmirLibPath = resources.getMmirBasePath();

		//webpack web worker wrapper:
		var WpWorker = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? require('../../workers/' + parserEngineId + COMPILER_WORKER_POSTFIX) : null;

		/**
		 * web-worker for compile jobs
		 *
		 * @class CompileWebWorker
		 * @memberOf mmir.env.grammar
		 */
		var asyncCompiler = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
					new WpWorker() :
					new Worker(workerPath);


		var _modConf = module.config(module);
		/**  @memberOf mmir.env.grammar.CompileWebWorker# */
		asyncCompiler._logger = Logger.create(parserEngineId+'AsyncWorker', _modConf? _modConf.logLevel : void(0));

		/**
		 * dictionary for currently active compilations
		 *
		 * <pre>
		 * [id] -> callback-function()
		 * </pre>
		 *
		 * @memberOf mmir.env.grammar.CompileWebWorker#
		 * @member _activeTaskIds
		 */
		asyncCompiler._activeTaskIds = {};

		/**
		 * listener for init-message
		 *
		 * DEFAULT: prints a message to the console
		 *
		 * Init Message:
		 *  * success:
		 *    <code>{init:true}</code>
		 *  * failed:
		 *    <code>{init:false,error:"message"}</code>
		 *
		 * @memberOf mmir.env.grammar.CompileWebWorker#
		 * @function _oninit
		 */
		asyncCompiler._oninit = function(evtData){
			if(evtData.init){
				if(this._logger.isDebug()) this._logger.debug('initialized: '+JSON.stringify(evtData));
			} else {
				this._logger.error('failed to initialize: '+JSON.stringify(evtData));
			}
		};

		/**
		 * HELPER generate & setup oninit signal for sync + async modules.
		 *
		 * Side Effects:
		 * generates and sets #_oninit
		 *
		 * @param {ParserGen} syncGen
		 * 				the sync parser generator
		 * @param {Deferred} asyncDef
		 * 				the deferred that should be resolved when async generator is initialized
		 *
		 * @returns {AsyncInitMesssage}
		 * 				the message object that should be sent to the async generator's WebWorker
		 *
		 * @memberOf mmir.env.grammar.CompileWebWorker#
		 * @function prepareOnInit
		 */
		asyncCompiler.prepareOnInit = function(syncGen, asyncDef){

			//setup async init-signaling:
			var isSyncGenInit = false;
			var isAsyncGenInit = false;

			//HELPER signal as "completely initialized" when sync & async modules are initialized:
			var checkInit = function(){
				if(isSyncGenInit && isAsyncGenInit){
					asyncDef.resolve();
				}
			};

			var initSyncGenDef = syncGen.init();//<- get init-signal for sync-generator
			var onComplete = function(){
				isSyncGenInit = true;
				checkInit();
			};
			initSyncGenDef.then(onComplete, onComplete);

			this._oninit = function(initEvt){
				if(initEvt.init === false){
					this._logger.error('Failed to initialize '+JSON.stringify(initEvt));
				} else {
					isAsyncGenInit = true;
				}
				checkInit();
			};
			var engineUrl = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? null : require.toUrl(MODULE_ID_PREFIX + syncGen.engineId)
			return {cmd:'init', engineUrl: engineUrl, libUrl: mmirLibPath};

		};

		/**
		 * Error handler for errors signaled by the webworker
		 *
		 * @memberOf mmir.env.grammar.CompileWebWorker#
		 * @function _onerror
		 */
		asyncCompiler._onerror = function(errorMsg, error){
			this._logger.error(errorMsg, error);
		};

		/**
		 * HELPER: register a callback (usage: see jisonGen.compileGrammar() below)
		 *
		 * @memberOf mmir.env.grammar.CompileWebWorker#
		 * @function addCallback
		 */
		asyncCompiler.addCallback = function(id, cb){
			this._activeTaskIds[id] = cb;
		};

		/**
		 * handler for messages/event from web-worker:
		 *
		 * @memberOf mmir.env.grammar.CompileWebWorker#
		 * @function onmessage
		 */
		var onmessage = function(evt){

			var id = evt.data.id;
			if(id){

				var handler = this._activeTaskIds[id];

				//this was the final message for this ID -> remove callback-function from "active tasks" dictionary:
				if(evt.data.done){
					delete this._activeTaskIds[id];
				}

				if(handler){

					handler.call(this, evt.data);

				} else {
					this._logger.warn('no callback registered for ID "'+id+'" -> ' + JSON.stringify(evt.data));
				}

			}
			else if(evt.data.error){

				this._onerror('Error in '+workerPath+': '+evt.data.error, evt.data);
			}
			else if(typeof evt.data.init === 'boolean'){

				asyncCompiler._oninit(evt.data);
			}
			else {

				this._onerror('ERROR unknown message -> ' + JSON.stringify(evt.data), evt.data);
			}

			if(this._onidle && !this.hasPendingCallback()){
				this._onidle();
			}

		};
		asyncUtils.onMessage(asyncCompiler, onmessage);

		/**
		 * check if the worker has "pending callbacks"
		 *
		 * @memberOf mmir.env.grammar.CompileWebWorker#
		 * @function hasPendingCallback
		 */
		asyncCompiler.hasPendingCallback = function(){
			for(var n in asyncCompiler._activeTaskIds){
				if(asyncCompiler._activeTaskIds[n]){
					return true;
				}
			}
		};

		return asyncCompiler;
	}
};

});
