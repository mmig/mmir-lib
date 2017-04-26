/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

define(['core', 'env', 'envInit', 'util/deferred', 'constants', 'commonUtils', 'configurationManager', 'languageManager'
     , 'controllerManager', 'modelManager'
     , 'presentationManager', 'inputManager', 'dialogManager', 'module'
     , 'semanticInterpreter', 'mediaManager', 'notificationManager'
  ],
  /**
   * Initializes the MMIR framework:
   * triggers {@link mmir.ready} when initialization has finished.
   * 
   * If run with env-setting <code>cordova</code> the initialization starts
   * when the <code>deviceready</code> event is fired.
   * Otherwise initialization starts when the <code>domready</code> event was fired
   * (using jQuery's ready function). 
   * 
   * @class
   * @name main
   * @memberof mmir
   * @private
   * 
   * @requires require.config
   * @requires util/deferred
   *  
   * @requires jQuery#selector	(for initial CSS/script injections; TODO change mechanism)
   * @requires jQuery.is			(for initial script injections; TODO change mechanism)
   * @requires jQuery.append		(for initial CSS injections; TODO change mechanism)
   * 
   */
  function(mmir, env, envInit, deferred, constants, commonUtils, configurationManager, languageManager
	 , controllerManager, modelManager
     , presentationManager, inputManager, dialogManager, module
     , semanticInterpreter, mediaManager, notificationManager
){
	/**
	 * @private 
	 * @memberOf mmir */
	var isInit = false;
	
	//export framework functions/objects:
	
	/** @memberOf mmir */
	mmir.Constants = constants;
	/** @memberOf mmir */
	mmir.CommonUtils = commonUtils;
	/** @memberOf mmir */
	mmir.ConfigurationManager = configurationManager;
	/** @memberOf mmir */
	mmir.NotificationManager = notificationManager.init();
	
	/**
	 * HELPER create a "namespace" from a package-definition (dot-separated string) from configuration
	 *        or return the global namespace, if there is not config-value
	 * @param {String|Array<String>} configuration name
	 * 
	 * @private
	 * @memberOf main
	 */
	var getContextFor = function(ctxConfigName){
		var ctxName = configurationManager.get(ctxConfigName, true);
		if(ctxName){
			var namespaces = ctxName.split('.');
			var ctx = window, name;
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
	 * Main Initialization:
	 * initializes mmir and exports its functions/modules to (gobal) mmir namespace
	 * 
	 * @memberOf main
	 */
	var mainInit = function(){

//		console.log('dom ready');
    	
		//initialize the common-utils:
		commonUtils.init()//<- load directory structure
			
			//load plugins (if in CORDOVA environment)
			.then(function() {

				languageManager.init().then(function(langMng){
					mmir.LanguageManager = langMng;
				});
				
				/** 
				 * @type Deferred
				 * @memberOf main
				 */
				var defer = deferred();
		        
				//if in Cordova env:
				// * load cordova library
				// * then load the (Cordova) plugins
				// -> after this: continue (i.e. resolve promise)
				var isCordova = env.isCordovaEnv;
				if(isCordova){
//					require(['cordova'], function(){
						commonUtils.loadAllCordovaPlugins()
							.then(defer.resolve());
//					});
		        }
		        else {
		        	// otherwise (e.g. BROWSER env):
		        	// just continue by resolving the promise immediately
		        	defer.resolve();
		        }

	        	return defer;
			})
			// start the ControllerManager
			.then(function() {
				
				mmir.ControllerManager = controllerManager;				
				//NOTE: this also gathers information on which 
				//      views, layouts etc. are available
				//      -> the presentationManager depends on this information
				return controllerManager.init(ctrlImplCtx);
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
				var isSemanticsLoaded        = false;

				/** @memberOf main */
				var checkInitCompleted = function(){
					
					if(			isMediaManagerLoaded
							&&	isModelsLoaded
							&& 	isVisualsLoaded 
							&&	isInputManagerLoaded
							&&	isDialogManagerLoaded
							&&	isSemanticsLoaded
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
						var requireConfig = configurationManager.get('config');
						if(requireConfig){
							require.config(requireConfig);
						}
						
						//"give signal" that the framework is now initialized / ready
						mmir.setInitialized();
					}
				};
				
				mmir.SemanticInterpreter = semanticInterpreter;
				/** ID for the grammar engine/compiler to be used, if/when JSON grammar are (re-) compiled
				 * @see mmir.SemanticInterpreter#setGrammarEngine
				 * @type String 
				 * @memberOf main */
				var grammarEngine = configurationManager.get('grammarCompiler', true);
				if(grammarEngine){
					semanticInterpreter.setGrammarEngine(grammarEngine);
				}
				/** set synchronous/asynchronous compile-mode for grammar compilation
				 * @see mmir.SemanticInterpreter#setEngineCompileMode
				 * @type Boolean
				 * @memberOf main */
				var grammarCompileMode = configurationManager.get('grammarAsyncCompileMode', true);
				if(typeof grammarCompileMode !== 'undefined'){
					semanticInterpreter.setEngineCompileMode(grammarCompileMode);
				}
				
				//TODO impl. automated sync/async loading&execution for compiled grammars
//				var grammarExecMode = configurationManager.get('grammarExecMode', true);
//				if(typeof grammarExecMode !== 'undefined'){
//					semanticInterpreter.setGrammarExecMode(grammarExecMode);//TODO add async-loaded grammars to ignoreGrammarFiles-list (to prevent loading them in "sync-exec mode")
//				}
				
				/** list of grammar IDs which should not be loaded, even if there is a compiled grammar available:
				 * @type String
				 * @memberOf main
				 */
				var ignoreGrammarIds = configurationManager.get('ignoreGrammarFiles', true, void(0));

				commonUtils.loadCompiledGrammars(constants.getGeneratedGrammarsPath(), void(0), ignoreGrammarIds).then(function() {
					
					isSemanticsLoaded = true;
					checkInitCompleted();
				});

				// start the MediaManager
				mediaManager.init().then(function() {
					isMediaManagerLoaded = true;
					
					//initialize BEEP notification (after MediaManager was initialized)
					notificationManager.initBeep();
					
					mmir.MediaManager = mediaManager;
					checkInitCompleted();
				});
				
				//TODO models may access views etc. during their initialization
				//	   --> there should be a way to configure startup, so that models may only be loaded, after everything else was loaded
				modelManager.init(modelImplCtx).then(function(){
					isModelsLoaded = true;
					mmir.ModelManager = modelManager;
					checkInitCompleted();
				});
				
				presentationManager.init().then(function(){

					isVisualsLoaded = true;//<- set to "LOADED" after all scripts have been loaded / TODO impl. better mechanism for including application-scripts...
		
					mmir.PresentationManager = presentationManager;
					checkInitCompleted();
				}, function error(err){ console.error('Failed initializing PresentationManager: '+err); });
				//TODO handle reject/fail of the presentationManager's init-Promise!
				
				dialogManager.init().then(function(res){//_dlgMng, _dialogEngine){
					isDialogManagerLoaded = true;
					mmir.DialogManager = res.manager;//dialogManager;
					mmir.DialogEngine = res.engine;//_dialogEngine;
					checkInitCompleted();
				});
				
				inputManager.init().then(function(res){//_inputMng, _inputEngine){
					isInputManagerLoaded = true;
					mmir.InputManager = res.manager;//inputManager;
					mmir.InputEngine  = res.engine;//_inputEngine; 
					checkInitCompleted();
				});
				
				
				
			});
			

	};//END: mainInit(){...
	
	mainInit();

	return mmir;
	
});//END: define(...
