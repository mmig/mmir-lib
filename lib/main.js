
define(['mmirf/core', 'mmirf/util/isArray', 'mmirf/util/deferred', 'mmirf/resources', 'mmirf/commonUtils', 'mmirf/logger', 'mmirf/configurationManager', 'mmirf/languageManager'
				, 'mmirf/controllerManager', 'mmirf/modelManager', 'mmirf/presentationManager'
				, 'mmirf/semanticInterpreter', 'mmirf/mediaManager', 'mmirf/notificationManager'
				, 'module'
	],
	/**
	 * Initializes the MMIR framework:
	 * triggers {@link mmir.ready} when initialization has finished.
	 *
	 * @class
	 * @name main
	 * @memberof mmir
	 * @private
	 * @hideconstructor
	 *
	 * @requires require.config
	 * @requires util/deferred
	 *
	 */
	function(mmir, isArray, deferred, resources, utils, Logger, conf, lang
			, ctrlManager, modelManager, present
			, semantic, media, notif
			, module
){

	var logger = Logger.create(module.config(module));

	//export framework functions/objects:

	/**
	 * @memberOf mmir
	 * @type {mmir.Resources}
	 */
	mmir.res = resources;
	/**
	 * @memberOf mmir
	 * @type {mmir.CommonUtils}
	 */
	mmir.util = utils;
	/**
	 * @memberOf mmir
	 * @type {mmir.ConfigurationManager}
	 */
	mmir.conf = conf;
	/**
	 * @memberOf mmir
	 * @type {mmir.NotificationManager}
	 */
	mmir.notifier = notif.init();

	var rootCtx = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;
	/**
	 * HELPER create a "namespace" from a package-definition (dot-separated string) from configuration
	 *        or return the global namespace, if there is not config-value
	 * @param {String|Array<String>} configuration name
	 *
	 * @private
	 * @memberOf main
	 */
	var getContextFor = function(ctxConfigName){
		var ctx = rootCtx;
		var ctxName = conf.get(ctxConfigName);
		if(ctxName){
			var namespaces = ctxName.split('.');
			var name;
			for(var i=0, size= namespaces.length; i < size; ++i){
				name = namespaces[i];
				if(!ctx[name]){
					ctx[name] = {};
				}
				ctx = ctx[name];
			}
			return ctx;
		}
		return ctx;
	}

	//the context where the controller implementation can be found (default: global context, i.e. window)
	/** @memberOf main */
	var ctrlImplCtx = getContextFor('controllerContext');
	//the context where the model implementations can be found (default: global context, i.e. window)
	/** @memberOf main */
	var modelImplCtx = getContextFor('modelContext');
	/**
	 * HELPER detect compiled state-models (compiled SCXML files) and set mmirf/scion (i.e. state engine)
	 *        accordingly, either to runtime-only or leave default compiler&runtime
	 * @memberOf main
	 */
	var selectStateEngine = function(){

		//NOTE need to wrap all "non-webpack" code by the webpack-build guard, in order
		//     to avoid webpack warning about critical dependencies (i.e. un-limited require-usage)
		if(typeof WEBPACK_BUILD === 'undefined' || !WEBPACK_BUILD){

			if(!conf.getBoolean('detectCompiledStateModels', true)){
				return;
			}

			var genDir = resources.getGeneratedStateModelsPath();
			var models = utils.listDir(genDir);
			if(models){
				//do sort state-models, so that 'dialog.xml' and 'input.xml' are prioritized before others
				var re = /^(dialog|input)\.js$/i
				models.sort(function(m1, m2){
					if(m1 === m2) return 0;
					if(re.test(m1)) return -1;
					if(re.test(m2)) return 1;
					return m1? m1.localeCompare(m2) : 0;
				});
				var statesConfig = {
					paths: {'mmirf/scion': require.toUrl('mmirf/scionRuntime')},
					config: {}
				};
				var m, match, modId, re = /^(dialog|input)(DescriptionSCXML)?\.js$/i;
				for(var i=0, size = models.length; i < size; ++i){
					m = models[i];
					re.lastIndex = 0;
					match = re.exec(m);
					if(match){
						modId = 'mmirf/' + match[1].toLowerCase() + 'Manager';
					} else {
						//for custom state-machines (in non-WEBPACK build): the module ID is the file name (without extension)
						modId = m.replace(/\.js$/i, '');
					}
					// ['mmirf/dialogManager' | 'mmirf/inputManager']: {modelUri: 'gen/states/' + ['dialog' | 'input']}
					if(!statesConfig.config[modId]){
						statesConfig.config[modId] = {modelUri: genDir + m};
					} else {
						logger.error(
							'Duplicate state-manager module configuration: ignoring file "'+genDir+m+
								'", because module ID "'+modId+
								'" is already used for '+statesConfig.config[modId].modelUri)
					}
				}
				mmir.require = require.config(statesConfig);
			}
		}
	};


	//load/async-require inputManager & dialogManager:
	// if pre-compiled SCXML models, use scion-runtime instead of scion-compiler
	var inputManager, dialogManager;

	/**
	 * HELPER set state-model runtime/implementation & load inputManager & dialogManager
	 *
	 * Side Effects:
	 *  * sets var dialogManager
	 *  * sets var inputManager
	 *
	 * @param {Deferred} deferredStateMachines promise that will get resolved when input- and dialogManager have been loaded
	 * @memberOf main
	 */
	var initStateEngines = function(deferredStateMachines){
		selectStateEngine();
		//after selection the scion-lib (compiler or runtime), do load input- and dialogManager:
		require(['mmirf/inputManager', 'mmirf/dialogManager'], function(im, dm){
			inputManager = im;
			dialogManager = dm;
			deferredStateMachines.resolve();
		});
	};

	/**
	 * Main Initialization:
	 * initializes mmir and exports its functions/modules to (gobal) mmir namespace
	 *
	 * @memberOf main
	 */
	var mainInit = function(){

		//for initializing/loading inputManager & dialogManager:
		var defStateMachines = new deferred();

		//initialize the common-utils:
		utils.init()//<- load directory structure

			//initialize state-managers
			.then(function() {

				//need to wait until directories.json is available for checking compiled state-machines:
				initStateEngines(defStateMachines);

				return lang.init().then(function(langMng){
					/**
					 * @memberOf mmir
					 * @type {mmir.LanguageManager}
					 */
					mmir.lang = langMng;
				});

			})
			// start the ControllerManager
			.then(function() {
				/**
				 * @memberOf mmir
				 * @type {mmir.ControllerManager}
				 */
				mmir.ctrl = ctrlManager;
				//NOTE: this also gathers information on which
				//      views, layouts etc. are available
				//      -> the presentationManager depends on this information
				return ctrlManager.init(ctrlImplCtx).then(function(){return defStateMachines});
			})

			//TEST parallelized loading of independent modules:
			.then(function(){

				/** @memberOf main */
				var isMediaManagerLoaded 	= false;
				/** @memberOf main */
				var isModelsLoaded 			= false;
				/** @memberOf main */
				var isVisualsLoaded 		= false;
				/** @memberOf main */
				var isInputManagerLoaded 	= false;
				/** @memberOf main */
				var isDialogManagerLoaded 	= false;
				/** @memberOf main */
				var isSemanticsLoaded       = false;
				/** @memberOf main */
				var isSemanticsAsyncLoaded  = false;

				/** @memberOf main */
				var checkInitCompleted = function(){

					if(			isMediaManagerLoaded
							&&	isModelsLoaded
							&& 	isVisualsLoaded
							&&	isInputManagerLoaded
							&&	isDialogManagerLoaded
							&&	isSemanticsLoaded
							&&	isSemanticsAsyncLoaded
					){

						/**
						 * Additional configuration for requirejs
						 * from configuration.json:
						 *  -> if property "config" is set, apply it as requirejs-config
						 *     before signaling READY
						 *  EXAMPLE:
						 *  the following entry (in config/configuration.json) would add
						 *  the dependency information for www/appjs/test.js as module "testConf"
						 *
						 * 	, "config": {
						 *     	"paths": {
						 *     		"testConf": "../appjs/test"
						 *     	}
						 *     }
						 *
						 * @type PlainObject
						 * @memberOf main
						 */
						var requireConfig = conf.get('config');
						if(requireConfig){
							mmir.require = require.config(requireConfig);
						}

						//"give signal" that the framework is now initialized / ready
						mmir.setInitialized();
					}
				};

				/**
				 * @memberOf mmir
				 * @type {mmir.SemanticInterpreter}
				 */
				mmir.semantic = semantic;
				/** ID for the grammar engine/compiler to be used, if/when JSON grammar are (re-) compiled
				 * @see mmir.SemanticInterpreter#setGrammarEngine
				 * @type String
				 * @memberOf main */
				var grammarEngine = conf.get('grammarCompiler');
				if(grammarEngine){
					semantic.setGrammarEngine(grammarEngine);
				}
				/** set synchronous/asynchronous compile-mode for grammar compilation
				 * @see mmir.SemanticInterpreter#setEngineCompileMode
				 * @type Boolean
				 * @memberOf main */
				var grammarCompileMode = conf.get('grammarAsyncCompileMode');
				if(typeof grammarCompileMode !== 'undefined'){
					semantic.setEngineCompileMode(grammarCompileMode);
				}

				/** list of grammar IDs which should not be loaded, even if there is a compiled grammar available:
				 * @type String
				 * @memberOf main
				 */
				var ignoreGrammarIds = conf.get('ignoreGrammarFiles');

				//for keeping track of ignored grammars (in case async-exec grammar are specified, this needs to be updated -> see below)
				var ignoreGrammarsSet = isArray(ignoreGrammarIds)? new Set(ignoreGrammarIds) : null;

				//prepare async-execution for compiled grammars
				var grammarAsyncExecMode = conf.get('grammarAsyncExecMode');
				if(grammarAsyncExecMode){

					if(grammarAsyncExecMode && (typeof Worker === 'undefined' || WEBPACK_BUILD === 'undefined' || !WEBPACK_BUILD)){//<- NOTE if WEBPACK_BUILD
						logger.error('configured async-grammars, but could not detect WebWorker implementation: async grammars will probably not work!');
						//TODO automatically convert to sync-grammar execution? -> if grammarAsyncExecMode is config-list for async grammars -> check ignoreGrammarIds and remove, if they are contained in grammarAsyncExecMode
					}

					var asyncExecIds = grammarAsyncExecMode;
					if(grammarAsyncExecMode === true){

						asyncExecIds = utils.getCompiledResourcesIds(resources.getGeneratedGrammarsPath());

						if(ignoreGrammarsSet){//<- ignoreGrammarsSet is only set, if ignoreGrammarIds is an array!
							var id;
							for(var i=0,size=asyncExecIds.length; i < size; ++i){
								id = asyncExecIds[i];

								//add exec-async grammars to "normal-loading" ignore list:
								if(!ignoreGrammarsSet.has(id)){
									ignoreGrammarIds.push(id);
									ignoreGrammarsSet.add(id);
								}
							}
						}

						if(typeof ignoreGrammarIds === 'undefined'){
							ignoreGrammarIds = true;
						}
						//ASSERT: else if array, async-loaded grammars have been added to ignore-list

					} else if(typeof ignoreGrammarIds === 'undefined') {
						ignoreGrammarIds = [];
						ignoreGrammarsSet = new Set();
					} else if(ignoreGrammarsSet){

						// -> add grammars that will be initialized for async-mode to ignore-list (if not already contained)
						var aid;
						for(var i=0, size=asyncExecIds.length; i < size; ++i){
							aid = asyncExecIds[i];
							if(typeof aid !== 'string'){
								aid = aid.id;
							}
							if(!ignoreGrammarsSet.has(aid)){
								ignoreGrammarsSet.add(aid);
								ignoreGrammarIds.push(aid)
							}
						}
					}

					mmir.require(['mmirf/asyncGrammar'], function(asyncGrammar){
						var count = asyncExecIds.length;
						var cb = function(){
							if(--count <= 0){
								isSemanticsAsyncLoaded = true;
								checkInitCompleted();
							}
						};
						var res, curr, initPhrase;
						for(var i=0, size=count; i < size; ++i){
							curr = asyncExecIds[i];
							if(typeof curr !== 'string'){
								initPhrase = curr.phrase;
								curr = curr.id;
							} else {
								initPhrase = void(0);
							}
							res = asyncGrammar.init(
								curr, cb, initPhrase
							);
							if(!res){
								cb();
							}
						}
					});

				} else {
					isSemanticsAsyncLoaded = true;
					checkInitCompleted();
				}

				//completionhandler for when sync-grammars have been loaded/processed
				var onGrammarsCompleted = function() {

					if(!semantic.getCurrentGrammar()){
						lang._requestGrammar(lang.getLanguage(), true);
					}
					isSemanticsLoaded = true;
					checkInitCompleted();
				};

				if(ignoreGrammarIds === true || grammarAsyncExecMode === true){
					//-> ignore all compiled grammars

					onGrammarsCompleted();

				} else {

					// -> load compiled grammars
					utils.loadCompiledGrammars(resources.getGeneratedGrammarsPath(), void(0), ignoreGrammarIds).then(onGrammarsCompleted);
				}

				// start the MediaManager
				media.init().then(function() {
					isMediaManagerLoaded = true;

					//initialize BEEP notification (after MediaManager was initialized)
					notif.initBeep();

					/**
					 * @memberOf mmir
					 * @type {mmir.MediaManager}
					 */
					mmir.media = media;
					checkInitCompleted();
				});

				//TODO models may access views etc. during their initialization
				//	   --> there should be a way to configure startup, so that models may only be loaded, after everything else was loaded
				modelManager.init(modelImplCtx).then(function(){
					isModelsLoaded = true;
					/**
					 * @memberOf mmir
					 * @type {mmir.ModelManager}
					 */
					mmir.model = modelManager;
					checkInitCompleted();
				});

				present.init().then(function(){

					isVisualsLoaded = true;

					/**
					 * @memberOf mmir
					 * @type {mmir.PresentationManager}
					 */
					mmir.present = present;
					checkInitCompleted();

				}, function error(err){ console.error('Failed initializing PresentationManager: '+err); });
				//TODO handle reject/fail of the presentationManager's init-Promise!

				dialogManager.init().then(function(result){//_dlgMng, _dialogEngine){
					isDialogManagerLoaded = true;
					/**
					 * @memberOf mmir
					 * @type {mmir.DialogManager}
					 */
					mmir.dialog = result.manager;
					/**
					 * @memberOf mmir
					 * @type {mmir.DialogEngine}
					 */
					mmir.dialogEngine = result.engine;
					checkInitCompleted();
				});

				inputManager.init().then(function(result){//_inputMng, _inputEngine){
					isInputManagerLoaded = true;
					/**
					 * @memberOf mmir
					 * @type {mmir.InputManager}
					 */
					mmir.input = result.manager;
					/**
					 * @memberOf mmir
					 * @type {mmir.InputEngine}
					 */
					mmir.inputEngine  = result.engine;
					checkInitCompleted();
				});

			});


	};//END: mainInit(){...

	mainInit();

	return mmir;

});//END: define(...
