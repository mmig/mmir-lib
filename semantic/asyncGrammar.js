
/**
 * loads the default grammar asynchronously using a WebWorker
 *
 * NOTE usage of the grammar is also async:
 *      calls on interpret(text, callback) are re-directed to the WebWorker
 *
 */
define(['mmirf/constants', 'mmirf/commonUtils', 'mmirf/semanticInterpreter', 'mmirf/util/deferred', 'require'], function(constants, utils, semanticInterpreter, deferred, require){

//
var _pendingCmds = {};
var _cmdIdCounter = 1;

var _loadedGrammars = {};

//webpack web worker wrapper:
var WpWorker = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? require('../workers/asyncGrammarWorker.js') : null;

//web-worker instance:
var _asyncGrammarLoader = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
			new WpWorker() :
			new Worker(constants.getWorkerPath()+'asyncGrammarWorker.js');

//process messages from worker thread:
_asyncGrammarLoader.onmessage = function(msg){

	var data = msg.data;
	var cmd = data.cmd;
	if(cmd){

		if(cmd === 'stopwords'){

			semanticInterpreter.setStopwords(data.id, data.stopwords);

			//check/trigger init-listener
			if(typeof _loadedGrammars[data.id] === 'object'){
				_loadedGrammars[data.id].isStopwords = true;
				_loadedGrammars[data.id].checkInit();
			}

		} else if(cmd === 'setgrammar'){

			//replace the default impl. of the grammar execution:
			//  re-direct invocations to the worker thread and
			//  return the results via the callback
			var execGrammar = function(text, callback){

				var cmdid = ''+ _cmdIdCounter++;

				this.executeGrammar._pendingCmds[cmdid] = callback;

				var langid = this.executeGrammar._langCode;

				_asyncGrammarLoader.postMessage({cmd: 'parse', id: langid, cmdId: cmdid, text: text});
			};

			execGrammar._pendingCmds = _pendingCmds;
			execGrammar._langCode = data.id;

			var options = data.options;
			if(options.execMode != 'async'){
				options.execMode = 'async';
			}
			semanticInterpreter.addGrammar(data.id,execGrammar,options);

			//check/trigger init-listener
			if(typeof _loadedGrammars[data.id] === 'object'){
				_loadedGrammars[data.id].isGrammar = true;
				_loadedGrammars[data.id].checkInit();
			}

		} else if(cmd === 'parseresult'){

			var cmdid = data.cmdId;

			if(!_pendingCmds[cmdid]){
				console.error('no callback registered for cmd-ID '+cmdid+', ignoring result '+JSON.stringify(cmd.result));
				return;////////////////// EARLY EXIT /////////////////////////////////
			}

			_pendingCmds[cmdid].call(semanticInterpreter, data.result);
			_pendingCmds[cmdid] = void(0);

		} else if(cmd === 'error'){

			console.error('encountered error: '+JSON.stringify(data));

		} else {

			console.error('unknown response from loader: '+JSON.stringify(msg.data));
		}

	} else {

		console.error('unknown response from loade: '+JSON.stringify(msg.data));
	}

};


return {

	/**
	 * Initialize a grammar to be loaded & executed asynchronously
	 *
	 * After
	 *
	 * @requires WebWorker
	 */
	init: function(langCode, listener, phrase){

		//use default language, if none is specified
		if(!langCode){
			langCode = semanticInterpreter.getCurrentGrammar();
		}

		if(!langCode){
			console.error('Inavlid grammar ID: "'+langCode+'"');
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

				var compiledGrammarPath = utils.getCompiledGrammarPath(constants.getGeneratedGrammarsPath(), langCode);
				if(!compiledGrammarPath){
					console.error('No compiled grammar available for ID: "'+langCode+'"');
					return;//////////////////// EARLY EXIT////////////////////////
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
					} else {//TODO use grammar's example_phrase for init instead?
						listener({});
					}

				};
				grammarInit.initDef.then(onComplete, onComplete);
				_loadedGrammars[langCode] = grammarInit;

				_asyncGrammarLoader.postMessage({cmd: 'load', id: langCode, url: compiledGrammarPath});
			},
			function onError(){

				//FIXME impl. real error handling
				console.error('cannot determine URL for compiled grammar with ID "'+langCode+'": commonUtils is not initialized.');
		});

		return true;
	}
};

});
