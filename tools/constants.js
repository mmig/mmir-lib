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


//define(['module'], function(module){//TODO remove module-dependency? -> would need different mechanism for querying env-configuration...
define(['mmirf/env', 'module'], 
/**
 * A Utility class that provides various <i>constants</i>.<br>
 * 
 * <p>
 * Note that the actual values depend on the execution environment (e.g. ANDROID vs. BROWSER).
 * As a consequence the constants object has 2 modes, that can be
 * switched via the {@link #init} -method, e.g. <code>init(false)</code>.
 * 
 * 
 * @name Constants
 * @memberOf mmir
 * @static
 * @class
 * 
 * @requires org.apache.cordova.device: cordova plugin add org.apache.cordova.device
 * 
 * @example var appBase = mmir.const.getBasePath();
 */
function(
		env, module
){
	
	var _modConf = module.config();
	if(_modConf.basePath){
		env.basePath = _modConf.basePath;
	}
	
	/**
	 * Object containing the instance of the class constants 
	 * 
	 * @type mmir.Constants
	 * @private
	 * @memberOf Constants#
	 */
	var instance = null;
	
	/**
	 * @memberOf Constants#
	 */
	var isBrowserEnv = false;

	// needed basepath
	/**
	 * the base path for the "invoking" app (i.e. where the main HTML file is located)
	 * @private
	 * @memberOf Constants#
	 */
    var basePath = "";
	
    ///////////////////////////////////////////////////// Paths /////////////////////////////////////////////////////
    
    /**
	 * the base path of the (i.e. this) library
	 * @private
	 * @memberOf Constants#
	 */
	var frameworkBasePath = "mmirf/";
	
	/**
	 * the path for WebWorkers
	 * @private
	 * @memberOf Constants#
	 */
	var workerPath = frameworkBasePath + "workers/";
	
	/**
	 * the path for Extensions (i.e. extending JavaScript base classes)
	 * @private
	 * @memberOf Constants#
	 */
	var extensionsPath = frameworkBasePath + "tools/extensions/";
	/**
	 * the path to the audio file containing the default beep sound.
	 * @private
	 * @memberOf Constants#
	 */
	var beepURL = frameworkBasePath + "vendor/sounds/beep-notification.mp3";
	/**
	 * the path to the app's controllers
	 * @private
	 * @memberOf Constants#
	 */
	var controllerPath = "controllers/";
	/**
	 * the path to the app's controller helpers
	 * @private
	 * @memberOf Constants#
	 */
	var helperPath = "helpers/";
	/**
	 * the path to the language resources root directory
	 * @private
	 * @memberOf Constants#
	 */
	var languagePath = "config/languages/";
	/**
	 * the path to the app's models
	 * @private
	 * @memberOf Constants#
	 */
	var modelPath = "models/";
	/**
	 * the path to the app's layouts
	 * @private
	 * @memberOf Constants#
	 */
	var layoutPath = "views/layouts/";//before changing this: see also use of 'layouts' sub-dir-name in build/lib/mmir-build/ant/StandaloneTemplateParserExec.js
	/**
	 * the path to the app's view root directory
	 * @private
	 * @memberOf Constants#
	 */
	var viewPath = "views/";
	/**
	 * the path to the app's generated (compiled JS) views
	 * @private
	 * @memberOf Constants#
	 */
	var genViewPath = "gen/views/";
	/**
	 * the path to the app's generated (compiled JS) layouts
	 * @private
	 * @memberOf Constants#
	 */
	var genLayoutPath = "gen/views/layouts/";//before changing this: see also use of 'layouts' sub-dir-name in build/lib/mmir-build/ant/StandaloneTemplateParserExec.js
	/**
	 * the path to the app's generated (compiled JS) grammars
	 * @private
	 * @memberOf Constants#
	 */
	var genGrammarsPath = "gen/grammar/";

	/**
	 * the path to media plugins / modules
	 * @private
	 * @memberOf Constants#
	 */
	var mediaPluginPath = frameworkBasePath + "env/media/";
	/**
	 * the path to grammar engine implementations / modules
	 * @private
	 * @memberOf Constants#
	 */
	var grammarPluginPath = frameworkBasePath + "env/grammar/";
	
	///////////////////////////////////////////////////// Resource Names /////////////////////////////////////////////////////
    
	/**
	 * the name of speech (output) configuration files
	 * @private
	 * @memberOf Constants#
	 */
	var speechConfigFileName = "speech.json";
	/**
	 * the name of (JSON) grammar files, i.e. "grammar definitions"
	 * @private
	 * @memberOf Constants#
	 */
	var grammarFileName = "grammar.json";
	/**
	 * the name of language dictionary files
	 * @private
	 * @memberOf Constants#
	 */
	var dictionaryFileName = "dictionary.json";
	/**
	 * the name of the app's configuration file
	 * @private
	 * @memberOf Constants#
	 */
	var configurationFileUrl = "config/configuration.json";
	/**
	 * the name of the app's directory-/file-information file
	 * @private
	 * @memberOf Constants#
	 */
	var directoriesFileUrl = "config/directories.json";
	
	
	////////////////////////////////////////////////// General Constant Values///////////////////////////////////////////////////
    
	/**
	 * the default language setting
	 * @private
	 * @memberOf Constants#
	 */
	var language = "en";
	
	// Prefixes
	
	/**
	 * the prefix for partial-view file-names
	 * @private
	 * @memberOf Constants#
	 */
	var partialsPrefix = '~';
	/**
	 * the postfix for controller-helper file-names
	 * @private
	 * @memberOf Constants#
	 */
	var helperSuffix = "Helper";
	
	/**
	 * Object that holds information about the execution
	 * environment / platform.
	 * 
	 * (set on initialization)
	 * 
	 * @private
	 * @type env
	 * @memberOf Constants#
	 */
	var envInfo = void(0);
	
	/**
	 * @private
	 * @memberOf Constants#
	 */
	function setBasePath(isBrowserEnvParam){
		// if not on browser: basepath must be different
		if(typeof isBrowserEnvParam === 'string'){
			
			basePath = isBrowserEnvParam;
		}
		else if (isBrowserEnvParam && isBrowserEnvParam.basePath){
			
			basePath = isBrowserEnvParam.basePath;
			
		} else if (isBrowserEnvParam && isBrowserEnvParam.isCordovaEnv){

			//if cordova env, try to use the specific platform
			var env = isBrowserEnvParam.envSetting;
			if(env === 'cordova'){
				
				env = isBrowserEnvParam.platform;
				
				if(env === 'default'){
					console.warn('Unknown cordova platform "'+env+'", using default base path /');
				}
				
			}
			
			switch(env){
				case 'android':
					basePath = "file:///android_asset/www/";
					break;
//				case 'cordova':
				case 'ios':
				case 'default':
				default:
					basePath = "";
			}
			
		}
		else if (isBrowserEnvParam && isBrowserEnvParam.isBrowserEnv){
			
			basePath = "";
		}
		else if (isBrowserEnvParam === false || typeof isBrowserEnvParam === 'undefined'){
			//BACKWARD COMPATIBILITY: false and omitted argument are interpreted as Android env
			//TODO remove this?
			basePath = "file:///android_asset/www/";
		}
		else {
			//default:
			basePath = "";
		}
		
	}
	
	/**
	 * Constructor-Method of Class {@link Constants}<br>
	 * 
	 * @constructs Constants#
	 * @memberOf mmir.Constants.prototype
	 * @private
	 */
    function constructor(env){
    	envInfo = env;
		isBrowserEnv = envInfo.isBrowserEnv;
		setBasePath(env);
		
		/** @lends Constants.prototype */
		return {
			/**
			 * Returns a string with the base path.
			 * @function
			 * @public
			 * @returns {String} base path
			 * 
			 * @memberOf mmir.Constants.prototype
			 */
			getBasePath: function(){
				return basePath;
			},
			/**
			 * Returns a string with the path to the layouts.
			 * @function
			 * @public
			 * @returns {String} layout path
			 */
			getLayoutPath: function(){
				return basePath+layoutPath;
			},
			getCompiledLayoutPath: function(){
				return basePath+genLayoutPath;
			},
			/**
			 * Returns a string with the path to the models.
			 * @function
			 * @public
			 * @returns {String} model path
			 */
			getModelPath: function(){
				return basePath+modelPath;
			},
			/**
			 * Returns a string with the path to the views.
			 * @function
			 * @public
			 * @returns {String} view path
			 */
			getViewPath: function(){
				return basePath+viewPath;
			},
			
			getCompiledViewPath: function(){
				return basePath + genViewPath;
			},
			/**
			 * Returns a string with the path to the languages.
			 * @function
			 * @public
			 * @returns {String} language path
			 */
			getLanguagePath: function(){
				return basePath+languagePath;
			},
			/**
			 * Returns a string with the path to the controllers.
			 * @function
			 * @public
			 * @returns {String} controller path
			 */
			getControllerPath: function(){
				return basePath+controllerPath;
			},
			/**
			 * Returns a string with the path to the workers.
			 * @function
			 * @public
			 * @returns {String} worker path
			 */
			getWorkerPath: function(){
				return basePath+workerPath;
			},
			/**
			 * Returns a string with the path to the helpers.
			 * @function
			 * @public
			 * @returns {String} helper path
			 */
			getHelperPath: function(){
				return basePath+helperPath;
			},
			/**
			 * Returns a string with the path to the extensions.
			 * @function
			 * @public
			 * @returns {String} extensions path
			 */
			getExtensionsPath: function(){
				return basePath + extensionsPath;
			},
			/**
			 * Returns a string with the path to the Media-Plugins.
			 * @function
			 * @public
			 * @returns {String} MediaPlugin path
			 */
			getMediaPluginPath: function(){
				return basePath + mediaPluginPath;
			},
			/**
			 * Returns a string with the path to the Grammar-Plugins
			 * (ie. engines for grammar generation).
			 * 
			 * @function
			 * @public
			 * @returns {String} Grammar Plugin path (
			 */
			getGrammarPluginPath: function(){
				return basePath + grammarPluginPath;
			},
			/**
			 * Returns a string with the path to the directory that contains the generated/executable grammars.
			 * @function
			 * @public
			 * @returns {String} path for generated grammars (JavaScript files)
			 */
			getGeneratedGrammarsPath: function(){
				return basePath + genGrammarsPath;
			},
			/**
			 * Returns a string with the path to the configuration file.
			 * @function
			 * @public
			 * @returns {String} path to configuration file
			 */
			getConfigurationFileUrl: function(){
				return basePath+configurationFileUrl;
			},
			/**
			 * Returns a string with the path to the directories file (directory-strucure / file-list).
			 * @function
			 * @public
			 * @returns {String} path to directories file
			 */
			getDirectoriesFileUrl: function(){
				return basePath+directoriesFileUrl;
			},
			/**
			 * Returns a string with the path to the beep audio-file.
			 * @function
			 * @public
			 * @returns {String} path to beep wav file
			 */
			getBeepUrl: function(){
				return basePath+beepURL;
			},
			/**
			 * Returns the name of the dictionary filename as string 
			 * @function
			 * @public
			 * @returns {String} dictionary filename
			 */
			getDictionaryFileName: function(){
				return dictionaryFileName;
			},
			/**
			 * Returns the name of the filename for
			 * the speech configuration as string 
			 * @function
			 * @public
			 * @returns {String} dictionary filename
			 */
			getSpeechConfigFileName: function(){
				return speechConfigFileName;
			},
			/**
			 * Returns the name of the grammar filename as string 
			 * @function
			 * @public
			 * @returns {String} grammar filename
			 */
			getGrammarFileName: function(){
				return grammarFileName;
			},
			/**
			 * Returns the prefix for partial filenames as string 
			 * @function
			 * @public
			 * @returns {String} prefix for partial filenames
			 */
			getPartialsPrefix: function(){
				return partialsPrefix;
			},
			/**
			 * Returns the suffix for helper filenames as string. A helpers filename looks like: "ControllerName"+"Helper"+".js"
			 * @function
			 * @public
			 * @returns {String} suffix for helper filenames
			 */
			getHelperSuffix: function(){
				return helperSuffix;
			},
			/**
			 * Returns default language as string.
			 * @function
			 * @public
			 * @returns {String} default language
			 */
			getLanguage: function(){
				return language;
			},
			
			/**
	         * Initialize the Constants singleton.
	         * 
	         * @function
	         * @param {Boolean} forBrowserParameter <tt>true</tt> for browser-environment, if <tt>false</tt> ANDROID environment
	         * @returns {Object} Object containing the instance of the class {@link mmir.Constants}
	         * @public
	         */
			init: function(theForBrowserParameter){
				if (theForBrowserParameter && theForBrowserParameter != isBrowserEnv){
    				setBasePath(theForBrowserParameter);
    			}
				return this;
			},
			
			/**
	         * @function
	         * @returns {Boolean}
	         * @public
	         */
			isBrowserEnv: function(){//FIXME replace with real environment-setting/-mechanism
				return isBrowserEnv;
			},
			

			/**
	         * @function
	         * @returns {String}
	         * @values "browser" | "cordova" | (or: VALUE set in document's query-parameter "?env=VALUE"
	         * @public
	         */
			getEnv: function(){
				return envInfo.envSetting? envInfo.envSetting : 'browser';
			},
			
			/**
	         * @function
	         * @returns {String}
	         * @values "android" | "ios" | "browser" | "default"
	         * @public
	         */
			getEnvPlatform: function(){
				return envInfo.platform;
			}
		};//END: return{}
		
	}//END: constructor()
	
	instance = new constructor(env);
	
	return instance;

});
