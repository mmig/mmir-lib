
/**
 * loads the default grammar asynchronously using a WebWorker
 *
 * NOTE usage of the grammar is also async:
 *      calls on <code>interpret(text, callback)</code> are re-directed to the WebWorker
 *
 * @class
 * @name AsyncGrammar
 * @memberOf mmir.grammar
 *
 */
define(['mmirf/resources', 'mmirf/commonUtils', 'mmirf/semanticInterpreter', 'mmirf/logger', 'mmirf/asyncUtils', 'mmirf/util/deferred', 'require', 'module'], function(res, utils, semanticInterpreter, Logger, asyncUtils, deferred, require, module){

/** map for looking-up pending commands */
var _logger = Logger.create(module);

/** map for looking-up pending commands */
var _pendingCmds = new Map();
/** counter pending commands (~ command ID generator) */
var _cmdIdCounter = 1;

/** if "destroy" for WebWorker was request: if true, should terminate WebWeborker when there are no pending commands */
var _destroyRequested = false;

/** map for loaded async grammars */
var _loadedGrammars;

//webpack web worker wrapper:
var WpWorker = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? require('../workers/asyncGrammarWorker.js') : null;

/** HELPER get resource ID for grammar ID */
var _toResId = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
			function(langCode){ return 'mmirf/grammar/'+langCode; } :
			function(langCode){ return langCode; };

/** web-worker instance */
var _asyncGrammarLoader;

/** web-worker instance */
var _initAsyncGrammarLoader = function(){

	_loadedGrammars = {};

	_asyncGrammarLoader = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
				new WpWorker() :
				new Worker(res.getWorkerPath()+'asyncGrammarWorker.js');

	/** process messages from worker thread */
	var onmessage = function(msg){

		var data = msg.data;
		var cmd = data.cmd;
		if(cmd){

			var id = data.id

			if(cmd === 'stopwords'){

				semanticInterpreter.setStopwords(id, data.stopwords);

				//check/trigger init-listener
				if(typeof _loadedGrammars[id] === 'object'){
					_loadedGrammars[id].isStopwords = true;
					_loadedGrammars[id].checkInit();
				}

			} else if(cmd === 'setgrammar'){

				//replace the default impl. of the grammar execution:
				//  re-direct invocations to the worker thread and
				//  return the results via the callback
				var execGrammar = function(text, parseOptions, callback){

					if(!_asyncGrammarLoader){
						var errMsg = 'WebWorker for async grammar execution is (already) destroyed!';
						_logger.error(errMsg);
						callback({error: errMsg});
						return;
					}

					var cmdid = ''+ _cmdIdCounter++;

					this.executeGrammar._pendingCmds.set(cmdid, callback);

					var langid = this.executeGrammar._langCode;

					_asyncGrammarLoader.postMessage({cmd: 'parse', id: langid, cmdId: cmdid, text: text, options: parseOptions});
				};

				execGrammar._pendingCmds = _pendingCmds;
				execGrammar._langCode = id;

				var options = data.options;
				if(options.execMode != 'async'){
					options.execMode = 'async';
				}
				semanticInterpreter.addGrammar(id, execGrammar, options);

				//check/trigger init-listener
				if(typeof _loadedGrammars[id] === 'object'){
					_loadedGrammars[id].isGrammar = true;
					_loadedGrammars[id].checkInit();
				}

			} else if(cmd === 'parseresult'){

				var cmdid = data.cmdId;

				if(!_pendingCmds.has(cmdid)){

					_logger.error('no callback registered for cmd-ID '+cmdid+', ignoring result '+JSON.stringify(cmd.result));
				} else {

					_pendingCmds.get(cmdid).call(semanticInterpreter, data.result);
					_pendingCmds.delete(cmdid);
				}

			} else if(cmd === 'error'){

				_logger.error('encountered error: '+JSON.stringify(data));

			} else {

				_logger.error('unknown response from loader: '+JSON.stringify(msg.data));
			}

		} else {

			_logger.error('unknown response from loader: '+JSON.stringify(msg.data));
		}

		if(_destroyRequested && _pendingCmds.size === 0){
			_destroy(true)
		}

	};

	asyncUtils.onMessage(_asyncGrammarLoader, onmessage);
}

/**
 * destroy / terminate the WebWorker for async grammar execution
 *
 * NOTE: can be re-initialized using {@link mmir.grammar.AsyncGrammar#init}
 *
 * @private
 * @function
 * @param  {Boolean} [force] OPTIONAL if true, will force termination of WebWorker,
 * 													otherwise waits for pending commands to finish.
 *
 * @memberOf mmir.grammar.AsyncGrammar
 */
var _destroy = function(force){
	if(_asyncGrammarLoader){
		//if not forced, check if there are pending commands
		if(!force && _pendingCmds.size > 0){
			_destroyRequested = true;
			return;////////////// EARLY EXIT /////////////////
		}
		_asyncGrammarLoader.terminate();
		_asyncGrammarLoader = null;
		_destroyRequested = false;
	}
}


/** path to mmir-lib base directory */
var _mmirLibPath = res.getMmirBasePath();


return {

	/**
	 * Initialize a grammar to be loaded & executed asynchronously
	 *
	 * @public
	 * @function
	 * @param {String} langCode the grammar's ID
	 * @param {Function} listener the callback that is triggered when the grammar has been initialized:
	 * 													<pre>listener(initializationResult)</pre>
	 * @param {String} [phrase] a phrase that should be immediately interpreted, after grammar has been loaded
	 * 													(for large grammars, this may reduce delays for subsequent calls, by fully initializing the grammar)
	 * @param {String} [grammarCode] for injecting JavaScript grammar code into the WebWorker: instead of loading the compiled grammar
	 * 													(for large grammars, this may reduce delays for subsequent calls, by fully initializing the grammar)
	 * 													for <code>langCode</code>, will <code>eval()</code> the <code>grammarCode</code> within the WebWorker
	 * 													The <code>grammarCode</code> corrsponds to field {@link mmir.grammar.GrammarConverter.js_grammar_definition},
	 * 													after grammar was compiled.<br/>
	 * 													NOTE this argument is positional! If no <code>phrase</code> should be use, it needs to be specified as
	 * 													<code>undefined</code>, e.g. <pre>asyncGrammar.init('myGrammar', onInitCallback, void(0), compiledGrammarCode)</pre>
	 *
	 * @returns {Boolean} <code>true</code> if initialization has started,
	 * 										if <code>false</code> initialization could not be started, due
	 * 										to errors or missing/invalid arguments
	 *
	 * @requires WebWorker
	 *
	 * @memberOf mmir.grammar.AsyncGrammar#
	 */
	init: function(langCode, listener, phrase, grammarCode){

		if(!_asyncGrammarLoader){
			_initAsyncGrammarLoader();
		}

		//use default language, if none is specified
		if(!langCode){
			langCode = semanticInterpreter.getCurrentGrammar();
		}

		if(!langCode){
			_logger.error('Inavlid grammar ID: "'+langCode+'"');
			return false;//////////////////// EARLY EXIT////////////////////////
		}

		//if grammar is already loaded & available:
		if(_loadedGrammars[langCode] === true){
			semanticInterpreter.interpret(phrase, langCode, listener);
			return true;//////////////////// EARLY EXIT ////////////////////////
		}

		//if grammar is loading, but not available yet: register listener as complete-callback
		if(_loadedGrammars[langCode] && _loadedGrammars[langCode].initDef && _loadedGrammars[langCode].initDef.then){
			_loadedGrammars[langCode].initDef.then(listener, listener);
			return true;//////////////////// EARLY EXIT ////////////////////////
		}

		utils.init().then(function onSuccess(){

				var compiledGrammarPath;
				if(!grammarCode){
					compiledGrammarPath = utils.getCompiledGrammarPath(res.getGeneratedGrammarsPath(), _toResId(langCode));
					if(!compiledGrammarPath){
						_logger.error('No compiled grammar available for ID: "'+langCode+'"');
						return;//////////////////// EARLY EXIT////////////////////////
					}
				}

				var grammarInit = {
					id: langCode,
					initDef: deferred(),
					isGrammar: false,
					isStopwords: false,
					checkInit: function(){
						if(this.isStopwords && this.isGrammar){
							_loadedGrammars[this.id] = true;
							this.initDef.resolve();
							this.initDef = null;
						}
					}
				};

				//register invocation of init-phrase as soon as (async-loaded) grammar becomes available
				var onComplete = function(){

					if(typeof phrase !== 'undefined'){
						semanticInterpreter.interpret(phrase, langCode, listener);
					} else {
						listener({});
					}

				};
				grammarInit.initDef.then(onComplete, onComplete);
				_loadedGrammars[langCode] = grammarInit;

				if(grammarCode){
					_asyncGrammarLoader.postMessage({cmd: 'eval', libUrl: _mmirLibPath, id: langCode, code: grammarCode});
				} else {
					_asyncGrammarLoader.postMessage({cmd: 'load', libUrl: _mmirLibPath, id: langCode, url: compiledGrammarPath});
				}
			},
			function onError(){

				//FIXME impl. real error handling
				_logger.error('cannot determine URL for compiled grammar with ID "'+langCode+'": commonUtils is not initialized.');
		});

		return true;
	},
	/**
	 * check, if grammar has been (or currently is in the process of beeing)
	 * intialized for async execution
	 *
	 * @public
	 * @function
	 * @param {String} grammarId the grammar ID to check
	 * @returns {Boolean} true, if grammar has been initialized for async-execution
	 *
	 * @memberOf mmir.grammar.AsyncGrammar#
	 * @see #init
	 */
	isInit: function(grammarId){
		return !!_loadedGrammars[grammarId];
	},
	/**
	 * @public
	 * @function
	 * @copydoc mmir.grammar.AsyncGrammar._destroy
	 * @memberOf mmir.grammar.AsyncGrammar#
	 */
	destroy: _destroy,
	/**
	 * check, if async-grammar worker has been destroyed
	 *
	 * @public
	 * @function
	 * @returns {Boolean} true, if async-grammar worker has been destroyed, otherwise false
	 *
	 * @memberOf mmir.grammar.AsyncGrammar#
	 * @see #destroy
	 * @see #init
	 */
	isDestroyed: function(){
		return !_asyncGrammarLoader;
	}
};

});
