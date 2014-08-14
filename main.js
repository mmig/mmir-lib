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

define(['core', 'env', 'envInit', 'jquery', 'constants', 'commonUtils', 'configurationManager', 'languageManager'
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
   * @exports main as mmir.main
   */
  function(mmir, env, envInit, $, constants, commonUtils, configurationManager, languageManager
	 , controllerManager, modelManager
     , presentationManager, inputManager, dialogManager, module
     , semanticInterpreter, mediaManager, notificationManager
){
	//export framework functions/objects
	mmir.Constants = constants;
	mmir.CommonUtils = commonUtils;
	mmir.ConfigurationManager = configurationManager;
	mmir.NotificationManager = notificationManager.init();
	
	var mainInit = function(){

		console.log('dom ready');
    	
		//initialize the common-utils:
		commonUtils.init()//<- load directory structure
			
			//load plugins (if in CORDOVA environment)
			.then(function() {

				mmir.LanguageManager = languageManager.init();
				
				var defer = $.Deferred();
		        
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

	        	return defer.promise();
			})
			// start the ControllerManager
			.then(function() {
				
				mmir.ControllerManager = controllerManager;
				
				//NOTE: this also gathers information on which 
				//      views, layouts etc. are available
				//      -> the presentationManager depends on this information
				return controllerManager.init();
			})
			
			//TEST parallelized loading of independent modules:
			.then(function(){
				
				var isMediaManagerLoaded 	= false;
				var isModelsLoaded 			= false;
				var isVisualsLoaded 		= false;
				var isInputManagerLoaded 	= false;
				var isDialogManagerLoaded 	= false;
				var isSemanticsLoaded        = false;
				
				var checkInitCompleted = function(){
					
					if(			isMediaManagerLoaded
							&&	isModelsLoaded
							&& 	isVisualsLoaded 
							&&	isInputManagerLoaded
							&&	isDialogManagerLoaded
							&&	isSemanticsLoaded
					){
						
						//"give signal" that the framework is now initialized / ready
						mmir.setInitialized();
					}
				};
				
				
				commonUtils.loadCompiledGrammars(constants.getGeneratedGrammarsPath()).then(function() {
					isSemanticsLoaded = true;
					
					mmir.SemanticInterpreter = semanticInterpreter;
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
				modelManager.init().then(function(){
					isModelsLoaded = true;
					mmir.ModelManager = modelManager;
					checkInitCompleted();
				});
				
				presentationManager.init().then(function(){
					isVisualsLoaded = true;
					
					//FIXME impl. mechanism where this is done for each view/layout rendering 
					//   (i.e. in presentationManager's rendering function and not here)
					//
					//initialize with layout contents of the default-controller (i.e. "Application"):
					var headerContents = $( presentationManager.getLayout("Application").getHeaderContents() );
					//NOTE: need to handle scripts separately, since some browsers may refuse to "simply append" script TAGs...
					var scriptList = [];
					var stylesheetList = headerContents.filter(function(index){
						var tis = $(this);
						if( tis.is('script') ){
							scriptList.push(tis.attr('src'));
							return false;
						}
						return true;
					});
					$("head").append( stylesheetList );
					commonUtils.loadImpl(scriptList, true);//load serially, since scripts may depend on each other; TODO should processing wait, until these scripts have been finished! (i.e. add callbacks etc.?)
					
					mmir.PresentationManager = presentationManager;
					checkInitCompleted();
				});
				
				dialogManager.init().then(function(_dlgMng, _dialogEngine){
					isDialogManagerLoaded = true;
					mmir.DialogManager = dialogManager;
					mmir.DialogEngine = _dialogEngine;
					checkInitCompleted();
				});
				
				inputManager.init().then(function(_inputMng, _inputEngine){
					isInputManagerLoaded = true;
					mmir.InputManager = inputManager;
					mmir.InputEngine  = _inputEngine; 
					checkInitCompleted();
				});
				
				
				
			});
			

	};//END: mainInit(){...
	
	//TEST for reference/testing: strictly serial initialization of the modules/managers:
//	var mainSerialInit = function(){
//
//		console.log('dom ready');
//    	
//		//load plugins
//		commonUtils.init()//<- load directory structure
//			
//			//load compiled grammars (if present)
//			.then(function() {
//
//				mmir.SemanticInterpreter = semanticInterpreter;
//				return commonUtils.loadCompiledGrammars(constants.getGeneratedGrammarsPath());//TODO remove dependency on constants-obj here (move into commonUtils? and/or make param optional?)
//			})
//			
//			//load plugins (if in CORDOVA environment)
//			.then(function() {
//
//				mmir.LanguageManager = languageManager.init();
//				
//				var defer = $.Deferred();
//		        
//				//if in Cordova env:
//				// * load cordova library
//				// * then load the (Cordova) plugins
//				// -> after this: continue (i.e. resolve promise)
//				var isCordova = env.isCordovaEnv;
//				if(isCordova){
//					require(['cordova'], function(){
//						commonUtils.loadAllCordovaPlugins()
//							.then(defer.resolve());
//					});
//		        }
//		        else {
//		        	// otherwise (e.g. BROWSER env):
//		        	// just continue by resolving the promise immediately
//		        	defer.resolve();
//		        }
//
//	        	return defer.promise();
//			})
//			// start the MediaManager
//			.then(function() {
//				
//				mmir.MediaManager = mediaManager;
//				return mediaManager.init();
//			})
//			// start the ControllerManager
//			.then(function() {
//
//				notificationManager.initBeep();//initialize BEEP notification (after MediaManager was initialized)
//				
//				mmir.ControllerManager = controllerManager;
//				return controllerManager.init();
//			})
//	
//			// start the ModelManager
//			.then(function() {
//				
//				//TODO models may access views etc. during their initialization
//				//	   --> there should be a way to configure startup, so that models may only be loaded, after everything else was loaded
//				return modelManager.init();
//			})
//	
//			// start the PresentationManager
//			.then(function() {
//				
//				return presentationManager.init();
//			})
//	
//			// start the InputManager
//			.then(function() {
//				
//				//FIXME this should be done on rendering (and (possibly) removing obsolete the CSS header contents)
//				$("head").append(presentationManager.getLayout("Application").getHeaderContents());
//				
//				mmir.InputManager = inputManager;
//				return mmir.InputManager.init();
//			})
//	
//			// start the DialogManager
//			.then(function() {
//				mmir.DialogManager = dialogManager;
//				return mmir.DialogManager.init();
//			})
//	
//			// start the app
//			.then(function(_engine) {
//				
//				//"give signal" that the framework is now initialized / ready
//				mmir.setInitialized();
//	
//			});
//			
//
//	};//END: mainSerialInit(){...
//	
//	mainInit = mainSerialInit;
	
	if(env.isCordovaEnv){
		
		document.addEventListener("deviceready", mainInit, false);
	}
	else {
		
		$(mainInit);
	}
	//END: $(function() {...

	
});//END: define(...
