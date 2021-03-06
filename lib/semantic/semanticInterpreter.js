
define(['mmirf/resources', 'mmirf/grammarConverter', 'mmirf/logger', 'module', 'require'
		],
	/**
	 * @name SemanticInterpreter
	 * @memberOf mmir
	 * @static
	 * @class
	 * @hideconstructor
	 *
	 * @requires require
	 */
	function (
		res, GrammarConverter, Logger, module, require
){

	/**
	 * The instance for the singleton SemanticInterpreter
	 *
	 * @type SemanticInterpreter
	 * @private
	 *
	 * @memberOf mmir.SemanticInterpreter#
	 */
	var instance = null;

	/**
	 * @private
	 * @type mmir.tools.Logger
	 * @memberOf mmir.SemanticInterpreter#
	 */
	var logger = Logger.create(module);

	/**
	 * The version number for the format of generated (JavaScript) grammars.
	 *
	 * This number is "written into" the generated grammars and then
	 * used as argument, when the grammar adds itself via
	 * <code>addGrammar(id, func, versionNumber)</code>.
	 *
	 * See generator function build_grammar() within createAndAddGrammar().
	 *
	 * NOTE: This version number must be increased, when the way changes, how
	 *       grammars are generated.
	 *       Or more precisely: when previously generated grammars cannot
	 *       be used anymore, after the generation mechanism has been changed.
	 *
	 * @constant
	 * @private
	 *
	 * @memberOf mmir.SemanticInterpreter#
	 */
	var GRAMMAR_FILE_FORMAT_VERSION = 7;


	/**
	 * @constructs SemanticInterpreter
	 * @memberOf mmir.SemanticInterpreter#
	 * @private
	 * @ignore
	 */
	function constructor(){

		/**
		 * "map" for grammar implementations (e.g. for different languages)
		 *
		 * @private
		 *
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var grammarImplMap = {};
		/**
		 * list of IDs for grammar implementations (e.g. for different languages).
		 *
		 * This list contains the "keys" of all current entries in <tt>grammarImplMap</tt>.
		 *
		 * @private
		 * @type Array<String>
		 *
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var grammarImplList = [];

		/**
		 * id (i.e. the <em>key</em> for map <tt>grammarImplMap</tt>) for currently used
		 * grammar.
		 *
		 * If for invocations of interpret(..) etc. function the ID/languageCode
		 * argument is missing/omitted, then this id will be used.
		 *
		 * NOTE: if not <tt>NULL</tt>, the grammar must be available, either
		 * 		 as compiled JS file (which must be already loaded, i.e. already present in <tt>grammarImplMap</tt>), or
		 * 		 as JSON grammar file (which must be available at <tt>/config/languages/[ID]/grammar.json</tt>
		 *
		 * @type String
		 * @private
		 *
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var currentGrammarId = null;

		/**
		 * @type String
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var currentGrammarEningeId = null;

		/**
		 * If true, the async versions of the grammar engines are loaded,
		 * i.e. compilation of grammar parsers will be asynchronously done in a WebWorker
		 *
		 * @type Boolean
		 * @private
		 * @default false
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var _isAsyncCompileMode = false;

		/**
		 * If true, strict JavaScript mode will be disabled when generating grammars
		 *
		 * @type Boolean
		 * @private
		 * @default false
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var _disableStrictMode = false;

		/**
		 * If true, pre-processing input-phrase (before running interpretion) will
		 * include meta-data for changed positions (due to pre-processing) in input-string
		 *
		 * E.g. can be used to map semantic-results (matched tokens/utterances where
		 * e.g. stopwords would be removed) on the raw input-string.
		 *
		 * @type Boolean
		 * @private
		 * @default true
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var _isCalcProcPos = true;

		/**
		 * @type String
		 * @constant
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var DEFAULT_GRAMMAR_ENGINE = 'jscc';
		/**
		 * @type String
		 * @constant
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var GRAMMAR_MODULE_ID_PREFIX = 'mmirf/';
		/**
		 * @type String
		 * @constant
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var GRAMMAR_MODULE_ID_POSTFIX = 'Gen';
		/**
		 * @type String
		 * @constant
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var GRAMMAR_ASYNC_MODULE_MODIFIER = 'Async';

		/**
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var doSetGrammarEngine = function(id, asyncCompileMode, disableStrictMode){

			currentGrammarEningeId = id;

			if(typeof asyncCompileMode !== 'undefined'){
				_isAsyncCompileMode = !!asyncCompileMode;
			}

			if(typeof disableStrictMode === 'boolean'){
				_disableStrictMode = disableStrictMode;
			}
		};
		/**
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var doGetGrammarEngine = function(){
			if(currentGrammarEningeId){
				return currentGrammarEningeId;
			}
			return DEFAULT_GRAMMAR_ENGINE;
		};

		/**
		 * Flag for enabling/disabling processing of SemanticInterpreter.
		 *
		 * If disabled, interpret(), applyPreProcessing() will return <tt>null</tt> values.
		 *
		 * NOTE: if no grammar for any language is available, the SemanticInterpreter should be disabled.
		 *
		 *  Setting a language, automatically enables the the SemanticInterpreter.
		 *
		 * @type Boolean
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var _isEnabled = false;


		/**
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var doSetEnabled = function(isEnabled){
			_isEnabled = isEnabled;
		};

		/**
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var doCheckIsEnabled = function(){
			return _isEnabled;
		};

		/**
		 * Add/register grammar for use with {@link #interpret}
		 *
		 * NOTE: if no other grammar is available yet, <tt>currentGrammarId</tt> will be set to <tt>id</tt>.
		 *
		 * NOTE: if currently disabled, calling this function automatically enables ( setEnabled(TRUE) ),
		 * 		 the semantic interpreter.
		 *
		 * @function
		 * @param id {String} ID for the grammar (e.g. an ISO-639 language code)
		 * @param grammarImpl {mmir.grammar.GrammarConverter|Function} the executable JavaScript grammar implementation
		 * 					IF {mmir.grammar.GrammarConverter}: the impl. with valid member {Function} {@link mmir.grammar.GrammarConverter.executeGrammar()}
		 * 					IF {Function}: the {Function} {@link mmir.grammar.GrammarConverter#executeGrammar()} -
		 * 									In this case, if no GrammarConverter instance fo <tt>id</tt> is present, a new one will be created;
		 * 									The stopwords must already be set, be part of the options-argument
		 * 									  (see doc for <code>fileFormatNo</code>), or must additionally be set for the GrammarConverter
		 * 									  instance (e.g. using {@link mmir.SemanticInterpreter.setStopwords})
		 * @param {Number|PlainObject} [fileFormatNo] OPTIONAL
		 * 					If Number and the number given does not match {@link #GRAMMAR_FILE_FORMAT_VERSION}
		 * 					the file format is assumed to be out-dated and an Error will be thrown.
		 *
		 * 					If PlainObject, i.e. an options object, the following properties are evaluated
		 * 					(all properties are optional):
		 * 					<pre>fileFormat: NUMBER, default: undefined</pre>
		 * 						(desc. see above)
		 * 					<pre>execMode: 'sync' | 'async', default: 'sync'</pre>
		 * 						if 'async' then the grammar is executed asynchronously, i.e. interpret()
		 * 						must be invoked with a callback function in order to retrieve the result
		 * 					<pre>stopwords: Array<string>, default: null</pre>
		 * 						if given, the grammar (GrammarConverter) will be set with this stopword list, i.e. <code>grammar.setStopwords(stopwords)</code>
		 *
		 * @throws Error if <code>fileFormatNo</code> is given, but does not match GRAMMAR_FILE_FORMAT_VERSION.
		 *
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var doAddGrammar = function(id, grammarImpl, fileFormatNo){

			var execMode = 'sync';
			var stopwords = null;
			if(fileFormatNo && typeof fileFormatNo === 'object'){

				execMode = fileFormatNo.execMode;
				stopwords = fileFormatNo.stopwords;

				//lastly: overwrite fileFormatNo with the corresponding property:
				fileFormatNo = fileFormatNo.fileFormat;

			}

			//check if the added grammar has correct format
			if(fileFormatNo && fileFormatNo != GRAMMAR_FILE_FORMAT_VERSION){

				//grammar has old / out-dated format:
				throw new Error('Grammar file has wrong format: need grammar file with format version '
						+GRAMMAR_FILE_FORMAT_VERSION+', but got: '+fileFormatNo
						+ '. Please update generated grammar (delete '
						+ res.getGeneratedGrammarsPath() +' and re-build grammars).'
				);
			}

			//the grammar function must be "wrapped" in a GrammarConverter instance
			// ... if not, do so now:
			if( ! (grammarImpl instanceof GrammarConverter)){
				var gc = doGetGrammar(id, true);

				//if for this ID (= language code) no grammar-converter
				// exists yet, create a now one
				// (otherwise, re-use the existing one)
				if(!gc){
					gc = new GrammarConverter();
				}
				gc.setGrammarFunction(grammarImpl, execMode === 'async');
				grammarImpl = gc;
			}

			var isAlreadyPresent = checkHasGrammar(id);
			grammarImplMap[id] = grammarImpl;

			if( ! isAlreadyPresent){

				//DISABLED: this may produce side effects (now: current grammar must be explicitly set using setCurrentGrammar(lang))
//	        	if(grammarImplList.length === 0){
//	        		currentGrammarId = id;
//	        	}
				grammarImplList.push(id);
			}

			if(stopwords){
				grammarImpl.setStopWords(stopwords);
			}

			doSetEnabled(true);
		};

		/**
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var doSetStopwords = function(id, stopwordArray){
			doGetGrammar(id).setStopWords(stopwordArray);
		};
		/**
		 * HELPER retrieve the executable grammar:
		 * if already loaded, return the grammar instance, otherwise load & compile.
		 *
		 * @param {String} id
		 * 		the ID (e.g. language code) for the grammar
		 * @param {Boolean} [doNotResolve] OPTIONAL
		 * 		if <code>false</code> AND the request grammar is not loaded yet,
		 * 		then the grammar will NOT be loaded (if omitted or <code>true</code>
		 * 		missing grammars will automatically be loaded and compiled)
		 * @param {Function} [callback] OPTIONAL
		 * 		if grammar has to be loaded (and compiled), the provided callback
		 * 		will be called, after completion with the corresponding GrammarConverter instance:
		 * 		<code>callback(newGrammarConverter)</code>.
		 *
		 * @return {GrammarExecFunction}
		 * 			the exectuable grammar (i.e. execution function), if the grammar is
		 * 			already loaded (if grammar has to loaded and compiled, you need to
		 * 			wait for the callback-call and then re-invoke doGetGrammar()).
		 *
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var doGetGrammar = function(id, doNotResolve, callback){//NOTE: this should stay private

			if(!id){
				if(!currentGrammarId){
					throw new Error('Could not retrieve grammar: required grammar ID is missing');
				}
				else {
					id = currentGrammarId;
				}
			}

			//shift arguments, if necessary:
			if(!callback && typeof doNotResolve === 'function'){
				callback = doNotResolve;
				doNotResolve = false;
			}

			var isDefaultCallback = false;
			if(!callback && logger.isInfo()){
				//create a "debug-info callback"
				isDefaultCallback = true;
				callback = function(){
					if(logger.isInfo()) logger.info('created executable grammar for "'+id+'" from source '+instance.get_json_grammar_url(id));
				};
			}

			if(!doNotResolve && ! checkHasGrammar(id) ){

						//DISABLED: check for executable grammar (that was not loaded yet), before trying to compile json-grammar
						//          -> this would pull in too many dependencies(?) ...
						//
						// if(instance.exists_gen_grammar(id)){
						//
						// 	require('mmirf/commonUtils').loadCompiledGrammars(res.getGeneratedGrammarsPath(), function(){
						//
						// 		if(!isDefaultCallback) callback();
						// 		else if(logger.isInfo()) logger.info('initialized executable grammar for "'+id+'".');
						//
						// 	}, require('mmirf/languageManager').getLanguages().filter(function(lang){ return lang !== id}))
						//
						// } else {
						//
						// 	var jsonGrammarUrl = instance.get_json_grammar_url(id);
						// 	createAndAddGrammar(jsonGrammarUrl, id, callback);
						// }

						var jsonGrammarUrl = instance.get_json_grammar_url(id);

						createAndAddGrammar(jsonGrammarUrl, id, callback);

			}
			else if(callback && !isDefaultCallback){
				callback(grammarImplMap[id]);
			}

			return grammarImplMap[id];
		};
		/**
		 * Check if grammar is register
		 *
		 * @param  {string} id the grammar ID
		 * @return {Boolean} true, if grammar with ID is registered
		 *
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var checkHasGrammar = function(id){
			return typeof grammarImplMap[id] !== 'undefined';
		};
		/**
		 * Remove a registered grammar
		 *
		 * @param  {string} id the grammar ID to remove
		 *
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var doRemoveGrammar = function(id){

			if( checkHasGrammar(id) ){

				//remove from impl.-map:
				delete grammarImplMap[id];

				//remove from ID-list
				for(var i=0, size = grammarImplList.length; i < size; ++i){
					if(grammarImplList[i]==id){
						grammarImplList.splice(i, 1);
						break;
					}
				}
			}
		};


		//TODO move create/build into GrammarConverter
		/**
		 * @param {String|JSONObject} doRecompile
		 * 					IF {String}: the String's contents will be used as a String-representation of the JSON grammar
		 * 					IF {Object}: the Object will be used as JSON representation for the grammar
		 *
		 * @param {String} [generatedParserLanguageCode] OPTIONAL
		 * 					if param doRecompile is used, this String specifies the
		 * 					   language for the generated grammatic-parser. If omitted, the default "de" (German) will be used.
		 * 					NOTE: this must be a valid ISO language code!
		 *
		 * @param {Function} [callback] OPTIONAL
		 * 							a callback that is invoked after the grammar was created and added to the SemanticInterpreter.
		 * 							The callback-function will be invoked with corrsponding GrammarConverter instance, i.e. <code>callback(newGrammarConverter);</code>
		 * @function
		 *
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		function createAndAddGrammar(doRecompile, generatedParserLanguageCode, callback){

			var gc = new GrammarConverter();

			//callback that will be used after the JSON file for the grammar was loaded:
			function build_grammar(theConverterInstance){//<- argument is the GrammarConverter instance

				var genId   = doGetGrammarEngine();//one of ['jscc' | 'pegjs' | 'jison'];
				var genName = GRAMMAR_MODULE_ID_PREFIX + genId + (_isAsyncCompileMode? GRAMMAR_ASYNC_MODULE_MODIFIER : '') + GRAMMAR_MODULE_ID_POSTFIX;
				var compileOptions = {
					fileVersion: GRAMMAR_FILE_FORMAT_VERSION,
					strict: !_disableStrictMode
				};

				var onModuleLoaded = function onLoad(gen){

					//initialize the generator (initialization may be async -> need callback/Promise)
					// (-> if already initialized, the then-callback will be invoked immediately)
					gen.init().then(function onInit(){

						//actually start compilation of the grammar definition:
						// usually this involves 2 steps:
						//    (1) converting the JSON grammar into a specific ParserParser syntax (e.g. JS/CC syntax)
						//    (2) compiling this syntax using the corresponding Parser-Generator
						// -> the resulting parser-function will then be registered on the SemanticInterpreter instance
						//    (using its addGrammar() function) along with the stopword definition (using the setStopwords() function)
						gen.compileGrammar(theConverterInstance, generatedParserLanguageCode, compileOptions, function onCompiled(convertedInstance){

							//add the grammar-parser-text and grammar-definition-text to the newly registered Grammar-instance
							// (-> registering is done within the compileGrammar() function!)
							var registeredGrammarInstance = doGetGrammar(generatedParserLanguageCode, true);
							if(registeredGrammarInstance){
								registeredGrammarInstance.setGrammarSource(convertedInstance.getGrammarSource());
								registeredGrammarInstance.setGrammarDef(convertedInstance.getGrammarDef());
							}
							else {
								logger.error('A problem occured during generation of grammar for "'+generatedParserLanguageCode+'"');
							}

							//invoke callback if present:
							if(callback){
								callback(registeredGrammarInstance);
							}
						});
					});

				};//END: onModuleLoaded([jsccGen])

				//FIXME webpack emits a warning, if normal require() is used -> TODO find other way than using mmir.require() for getting rid of the warning (i.e. avoid adding dependency for mmirf/core!)
				var req = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? require('mmirf/core').require : require;
				req([genName], onModuleLoaded, function(_err){

					//if async-module could not be loaded, try sync-module
					if(_isAsyncCompileMode){

						logger.warn('Cannot use asynchronous compilation for '+genId+
								': no async module available, using sync compilation instead...'
						);
						genName = GRAMMAR_MODULE_ID_PREFIX + genId + GRAMMAR_MODULE_ID_POSTFIX;

						req([genName], onModuleLoaded);
					}
				});

			}//END function build_grammar

			if(typeof doRecompile === 'string'){// arg. is URL for JSON grammar definition

				//interpret STRING as URL for the JSON grammar:
				gc.loadGrammar(build_grammar, function(err){

					var errMsg = err;
					if(err){
						if(err.stack){
							errMsg = err.stack;
						} else {
							try{
								errMsg = JSON.stringify(err);
							} catch(e){}
						}
					}

					throw new Error('Could not find JSON grammar file at "'+doRecompile+'": '+errMsg);
				}, doRecompile, true
				);
			} else if(typeof doRecompile === 'object'){// arg. is JSONObject (ie. JSON grammar definition)

				//ASSERT if doRecompile === null => throws error!

				gc.json_grammar_definition = doRecompile;
				build_grammar(gc);

			} else {
				logger.error('__createAndAddGrammar(): could not build grammar due to missing argumens');
			}
		}

		/**
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var process_asr_semantic = function(phrase, langCode, callback){

			if(!doCheckIsEnabled()){
				logger.warn('interpret(): currently disabled!');
				return null;
			}

			if(langCode && (typeof langCode === 'function' || typeof langCode === 'object')){
				callback = langCode;
				langCode = void(0);
			}

			var options;
			if(callback && typeof callback === 'object'){
				options = callback;
				callback = options.callback;
			} else {
				options = {};
			}

			if(typeof options.debug === 'undefined'){
				options.debug = logger.isDebug();
			}

			if(typeof options.trace === 'undefined'){
				options.trace = logger.isVerbose();
			}

			var execGrammar = function(grammarConverter, phrase, langCode, parseOptions, callback){

				//pre-process pharse (e.g. mask umlauts, remove stopwords)
				var positions = _isCalcProcPos? {} : void(0);//<- for storing modification information during pre-processing
				var strPreparedPhrase = grammarConverter.preproc( phrase.toLowerCase(), positions );

				if(logger.isDebug()) logger.debug('process_asr_semantic('+langCode+'): removed stopwords, now parsing phrase "'+strPreparedPhrase+'"');//debug

				if(callback){

					grammarConverter.executeGrammar( strPreparedPhrase, parseOptions, function(result){

						//post-process result (e.g. unmask umlauts etc)
						result = grammarConverter.postproc(result, positions);
						result.preproc = positions;

						callback(result);//TODO return copy instead of original instance?

					});

				} else {

					var result = grammarConverter.executeGrammar( strPreparedPhrase, parseOptions );

					//post-process result (e.g. unmask umlauts etc)
					result = grammarConverter.postproc(result, positions);
					result.preproc = positions;

					return result;//TODO return copy instead of original instance?
				}
			};//END OF: var execGrammar = function...

			var grammarReadyCallback;
			if(callback){

				grammarReadyCallback = function(){

					var grammarConverter = doGetGrammar(langCode);

					if(grammarConverter.isAsyncExec()){
						execGrammar(grammarConverter, phrase, langCode, options, callback);
					} else {
						callback(execGrammar(grammarConverter, phrase, langCode, options));
					}
				};
			}

			var grammarConverter = doGetGrammar(langCode, grammarReadyCallback);

			if(!grammarConverter && ! grammarReadyCallback){
				throw new Error('no grammar available for '+(langCode || currentGrammarId)+' (and no callback provided for asnyc invocation)');
			}

			if(!grammarReadyCallback){
				return execGrammar(grammarConverter, phrase, langCode, options);
			}
		};

		/**
		 * @private
		 * @memberOf mmir.SemanticInterpreter#
		 */
		var doApplyPreproc = function(thePhrase, lang, processingSteps){
			if(!doCheckIsEnabled()){
				logger.warn('doProcessStopwords(): currently disabled!');
				return null;
			}

			var grammarConverter = doGetGrammar(lang);

			if(!grammarConverter){
				throw new Error('No grammar for ID '+lang);
			}

			return grammarConverter.preproc(thePhrase, null, processingSteps);
		};

		/** @lends mmir.SemanticInterpreter.prototype */
		var _tmpInstance = { // public members

			/**
			 * @param {String} phrase
			 * 					the phrase that will be parsed
			 * @param {String} langCode
			 * 					the language code (identifier) for the parser/grammar
			 * @param {Function|ParseOptions} [callback] OPTIONAL
			 * 					parsing-options or a callback:
			 * 					  options.callback: FUNCTION the callback function (see below)
			 * 					  options.debug: BOOLEAN enabling debug output
			 * 					  								(by default the logger's log-level <= 'debug' is used)
			 * 					  options.trace: BOOLEAN enabling verbose/tracing output;
			 * 					  							 may not be supported by all grammar engines
			 * 					  							 (by default the logger's log-level <= 'verbose' is used)
			 * 					  NOTE: some grammar engines may support additional parsing options
			 * 					If a callback function: receives the return value
			 * 					(instead of receiving the result as return value from
			 * 					 this function directly).
			 * 					The signature for the callback is: <code>callback(result: Object)</code>
			 * 					  (i.e. the result that would be returned by this function itself is
			 * 					   passed as argument into the callback function; see also documentation
			 * 					   for <em>returns</em>).
			 * 					NOTE: in case, the grammar for the requested <code>langCode</code>
			 * 						  is not compiled yet (i.e. not present as executable JavaScript),
			 * 						  the corresponding JSON definition of the grammar needs to be
			 * 					      compiled first, before processing the ASR's semantics is possible.
			 * 						  In this case, a <code>callback</code> function <strong>MUST</strong>
			 * 						  be supplied in order to receive a result (since compilation of the
			 * 					      grammar may be <em>asynchronous</em>).
			 *
			 * @returns {Object}
			 * 				the parsing result (as processed by the parser / grammar;
			 * 				usually a JSON-like object).
			 * 				WARNING: if a <code>callback</code> function was provided, then
			 * 						 there is no return object.
			 *
			 * @public
			 * @memberOf mmir.SemanticInterpreter.prototype
			 */
			interpret: function(phrase, langCode, callback){

				return process_asr_semantic(phrase, langCode, callback);

			},
			/**
			 * Removes stopwords using the stopword-list from the parser/grammar
			 * for <code>lang</code>.
			 *
			 *
			 * @deprecated use {@link #applyPreProcessing} instead
			 *
			 * @param {String} thePhrase
			 * 					the Phrase for which stopwords should be removed
			 * @param {String} lang
			 * 					the language code (identifier) for the parser/grammar
			 *
			 * @public
			 * @see #applyPreProcessing
			 */
			removeStopwords: function(thePhrase, lang, processingSteps){
				logger.warn('using deprecated function removeStopwords(): should use applyPreProcessing() instead.');
				return this.applyPreProcessing(thePhrase, lang, processingSteps);
			},
			/**
			 * Applies pre-processing for the corresponding parser/grammar
			 * of <code>lang</code> (e.g. removes stopwords using the stopword-list etc).
			 *
			 * NOTE: <code>{@link #interpret}</code> automatically applies pre-processing
			 * 		  i.e. there is no need to manually do this when using <code>{@link #interpret}</code>).
			 *
			 * IMPORTANT: this helper function actually invokes {@link mmir.grammar.GrammarConverter#preproc}
			 *            which by default removes stopwords; if the corresponding GrammarConverter instance
			 *            has been set with a non-default pre-processing chain, results may be differ
			 *            (i.e. may not remove stopwords).
			 *
			 * @param {String} thePhrase
			 * 					the Phrase for which stopwords should be removed
			 * @param {String} [lang]
			 * 					the language code (identifier) for the parser/grammar
			 * 					(if omitted the currently set grammar is used)
			 * @param {Array<ProcessingStep>} [processingSteps] OPTIONAL
			 * 				if given, use <code>processingSteps</code> instead of the
			 * 				GrammarConverter's configured pre-processing chain.
			 * 				NOTE positional argument (i.e. must specify <code>pos</code> too)
			 *
			 * @public
			 * @see mmir.grammar.GrammarConverter#preproc
			 */
			applyPreProcessing: function(thePhrase, lang, processingSteps){
				return doApplyPreproc(thePhrase, lang, processingSteps);
			},
			/** NOTE: the grammar must be compiled/registered first
			 * @param {String} id
			 * 					the ID (identifier) / language code for grammar
			 * @public
			 * @see mmir.grammar.GrammarConverter#getGrammarDef
			 */
			getGrammarDefinitionText: function(id){
				return doGetGrammar(id).getGrammarDef();
			},
			/** NOTE: the grammar must be compiled/registered first
			 * @param {String} id
			 * 					the ID (identifier) / language code for grammar
			 * @public
			 * @see mmir.grammar.GrammarConverter#getGrammarSource
			 */
			getGrammarParserText: function(id){
				return doGetGrammar(id).getGrammarSource();
			},
			/**
			 * Get the grammar converter instance (of registered grammar)
			 * @public
 			 * @param {String} [id]
 			 * 					the ID (identifier) / language code for grammar
 			 * 					if omitted: the currently active grammar
			 * @returns {mmir.grammar.GrammarConverter} the grammar converter
			 *
			 * @see #addGrammar
			 * @see #setCurrentGrammar
			 */
			getGrammarConverter: function(id){
				return doGetGrammar(id, true);//<- if no grammar is loaded for this ID, do NOT try to load it!
			},
			/**
			 * @copydoc #createAndAddGrammar
			 * @public
			 * @param {String|JSONObject} rawGrammarSrc
			 * @param {String} id
			 * @param {Function} [callback]
			 * @returns {SemanticInterpreter.prototype}
			 */
			createGrammar: function(rawGrammarSrc, id, callback){

				if(!id){
					throw new Error('missing ID for generated grammar');//TODO
				}

				createAndAddGrammar(rawGrammarSrc, id, callback);

				return this;
			},
			/**
			 * @copydoc #doAddGrammar
			 * @public
			 * @function
			 */
			addGrammar: doAddGrammar,
			/**
			 * @copydoc #doAddGrammar
			 * @public
			 * @function
			 */
			setStopwords: doSetStopwords,
//	        getGrammar: doGetGrammar, <- set to private
			/**
			 * @copydoc #checkHasGrammar
			 * @public
			 * @function
			 */
			hasGrammar: checkHasGrammar,
			/**
			 * @copydoc #doRemoveGrammar
			 * @public
			 * @function
			 */
			removeGrammar: doRemoveGrammar,

			/**
			 * Shortcut for {@link mmir.GrammarConverter#addProc}:
			 * add pre-/post-processing step for running before/after {@link #interpret}
			 *
			 * @param  {String} langCode the language code, for which to add the (pre- and/or post-) processing step
			 * @param  {ProcessingStep} proc the processing step:
			 * 						<pre>
			 * 						{
			 * 							//the name of the processing step
			 * 							name: string,
			 * 							//OPTIONAL pre-processing function: pre(input: string | Positions, isCalcPos: boolean)
			 * 							pre: Function,
			 * 							//OPTIONAL post-processing function: post(result: any, pos: Positions)
			 * 							post: Function
			 * 						}
			 * 						</pre>
			 * @param  {Boolean|Number} [isPrepend] OPTIONAL
			 * 						if omitted (or FALSY): appended <code>proc</code> to processing steps
			 * 						if number: insert <code>proc</code> at this index into the processing steps-list
			 * 						if TRUE: prepend <code>proc</code> to processing steps
			 * @param  {Function} [callback] OPTIONAL
			 * 						callback, in case of asnychronous initalization, i.e. if
			 * 						grammar is not loaded/compiled yet, and grammar.json is available.
			 * 						If omitted, an error is thrown, if the grammar has not been loaded/compiled yet.
			 *
			 * @see mmir.GrammarConverter#addProc
			 * @example
			 * //poitionUtils:
			 * var posUtil = mmir.require('mmirf/positionUtils');
			 * //stemming function
			 * var stemFunc = ...;
			 * //add stemming function for pre-processing for "de" as first step
			 * mmir.semantic.addProcessing('de', {
			 *  name: 'stem',
			 *  pre: posUtil.createWordPosPreProc(stem, this)
			 * }, true);
			 */
			addProcessing: function(langCode, processingStep, indexOrIsPrepend, callback){
				var cb = callback;
				var asyncCb = function(gc){
					gc.addProc(processingStep, indexOrIsPrepend);
					cb && cb(gc);
				};
				var gc = doGetGrammar(langCode, !cb, cb? asyncCb : void(0));//<- if no grammar is loaded for this ID, only try to load it, if a callback is provided
				if(!cb){
					asyncCb(gc);
				}
			},

			/**
			 * Sets the current grammar.
			 *
			 * If in invocations of {@link #interpret} the grammar ID (e.g. language code) is missing,
			 * then this grammar that is set here is used.
			 *
			 * The id must reference either a grammar that was compiled (i.e. generated JavaScript file)
			 * for this id, or there must exists JSON-grammar file for which the language-dir matches the id parameter,
			 * e.g. <code>config/languages/[id]/grammar.json</code>.
			 *
			 * @param {String} id the ID for the grammar, e.g. an ISO language code
			 *
			 * @function
			 * @public
			 */
			setCurrentGrammar: function(id){
				currentGrammarId = id;

				//set semantic-interpreter to enabled
				//  (this ensures, that JSON-grammars are automatically loaded,
				//   if no corresponding compiled JS-grammar is available yet)
				doSetEnabled(true);
			},
			/**
			 * @copydoc #currentGrammarId
			 * @public
			 */
			getCurrentGrammar: function(){
				return currentGrammarId;
			},

			/**
			 * @see #isEnabled
			 * @public
			 */
			setEnabled: function(isEnabled){
				doSetEnabled(isEnabled);
			},
			/**
			 * @copydoc #_isEnabled
			 * @public
			 */
			isEnabled: function(){
				return doCheckIsEnabled();
			},

			/**
			 * Get the ID of the current grammar engine / compiler.
			 *
			 * @default "jcss"
			 * @returns {String}
			 * 			the ID of the current grammar engine
			 * @public
			 */
			getGrammarEngine: function(){
				return doGetGrammarEngine();
			},
			/**
			 * Set the grammar engine, i.e. the
			 * compiler engine for the JSON grammar
			 *
			 * NOTE: implementations of the grammar engines are located at env/grammar/
			 *       The file-name for an implementation should follow the convention: ID+"Generator.js"
			 *       and should be registered with requirejs with the module-ID: ID+"Gen"
			 *
			 * @param {String} egnineId
			 * 			the ID for the engine.
			 * 			Possible values: "jscc", "jison", "pegjs"
			 *
			 * @param {Boolean} [asyncCompileMode] OPITIONAL
			 * 			sets the compile mode (sychronous or asynchronous) when generating new parsers
			 * 			with the grammar-engine.
			 * 			DEFAULT: VOID (i.e. leave current set compile-mode setting unchanged)
			 *
			 * @param  {Boolean} [disableStrictMode] OPTIONAL
			 * 			disable JavaScript strict mode when generating grammar code
			 * 			<br>NOTE: this argument is positional, i.e. <code>asyncCompileMode</code> must also be given when using this argument
			 *
			 * @public
			 */
			setGrammarEngine: function(engineId, asyncCompileMode, disableStrictMode){
				doSetGrammarEngine(engineId, asyncCompileMode, disableStrictMode);
			},

			/**
			 * Set compile-mode (sychronous or asynchronous) for the grammar engine, i.e. if the
			 * compiler engine for the JSON grammar should run synchronously or asynchronously.
			 *
			 * NOTE: if there is no asynchronous implementation available for the grammar engine,
			 * 		 the sync-impl. is used by default.
			 *
			 * NOTE: asynchronous compile mode requires WebWorkers
			 *
			 * @param {Boolean} asyncCompileMode
			 * 			sets the compile mode (sychronous or asynchronous) when generating new parsers
			 * 			with the grammar-engine.
			 *
			 * @param  {Boolean} [disableStrictMode] OPTIONAL
			 * 			disable JavaScript strict mode when generating grammar code
			 *
			 * @public
			 * @default false (i.e. synchronous compile mode)
			 * @require WebWorker (if async mode)
			 */
			setEngineCompileMode: function(asyncCompileMode, disableStrictMode){
				_isAsyncCompileMode = !!asyncCompileMode;

				if(typeof disableStrictMode === 'boolean'){
					_disableStrictMode = disableStrictMode;
				}
			},
			/**
			 * Get compile-mode (sychronous or asynchronous) for the grammar engine, i.e. if the
			 * compiler engine for the JSON grammar should run synchronously or asynchronously.
			 *
			 * @return  {Boolean} the compile mode (sychronous or asynchronous) when generating new parsers
			 * 			with the grammar-engine.
			 * @public
			 */
			getEngineCompileMode: function(){
				return _isAsyncCompileMode;
			},
			/**
			 * Get JavaScript strict mode compile-setting for the grammar engine, i.e. if the
			 * compiler engine should generate code with strict-mode setting.
			 *
			 * @return  {Boolean} the strict mode setting
			 * @public
			 */
			getEngineCompileStrictMode: function(){
				return !_disableStrictMode;
			},
			/**
			 * @copydoc #GRAMMAR_FILE_FORMAT_VERSION
			 * @returns {Number} the current version number that this SemanticInterpreter
			 * 				instance supports, for the file format of compiled grammars.
			 */
			getFileVersion: function(){
				return GRAMMAR_FILE_FORMAT_VERSION;
			},

			/**
			 * Enable / disable calculation of modified positions during pre-processing
			 *
			 * @param  {Boolean} isEnabled if calculation of modified positions during pre-processing should be enabled
			 *
			 * @public
			 * @see #isPreProcessPositionsEnabled
			 * @see #_isCalcProcPos
			 */
			setPreProcessPositionsEnabled: function(isEnabled){
				_isCalcProcPos = isEnabled;
			},
			/**
			 * If true, pre-processing input-phrase (before running interpretion) will
			 * include meta-data for changed positions (due to pre-processing) in input-string
			 *
			 * E.g. can be used to map semantic-results (matched tokens/utterances where
			 * e.g. stopwords would be removed) on the raw input-string.
			 *
			 * The meta-information will be included in field <code>preproc</code> of the
			 * interpretation result.
			 *
			 * @return {Boolean} if calculation of modified positions during pre-processing is enabled
			 *
			 * @public
			 * @see #setPreProcessPositionsEnabled
			 * @see #_isCalcProcPos
			 */
			isPreProcessPositionsEnabled: function(){
				return _isCalcProcPos;
			},

			//FIXME rename/move functions
			get_json_grammar_url: function(id){
				return res.getGrammarFileUrl(id);
			}//,
			// exists_gen_grammar: function(id){
			// 	var lang = require('mmirf/languageManager');
			// 	return lang.existsGrammar(id, 'bin');
			// }
		};//END: var _tmpInstance = {...

		return _tmpInstance;
	}

	instance = new constructor();

	return instance;

});//END: define(..., function(){
