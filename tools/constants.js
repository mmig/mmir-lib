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
	var _modConf = module.config(module);
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

		///////////////////////////////////////////// Paths of library resources (sub-paths within library) ////////////////////////////////////////////////

	/**
	 * the base path of the (i.e. this) library
	 * @private
	 * @memberOf Constants#
	 */
	var frameworkBasePath = typeof _modConf.mmirBasePath === 'string'? _modConf.mmirBasePath : "mmirf/";

	/**
	 * the path for WebWorkers (within {link #frameworkBasePath})
	 * @private
	 * @memberOf Constants#
	 */
	var workerPath = "workers/";

	/**
	 * the path for Extensions (i.e. extending JavaScript base classes; within {link #frameworkBasePath})
	 * @private
	 * @memberOf Constants#
	 */
	var extensionsPath = "tools/extensions/";
	/**
	 * the path to the audio file containing the default beep sound (within {link #frameworkBasePath}).
	 * @private
	 * @memberOf Constants#
	 */
	var beepURL = "vendor/sounds/beep-notification.mp3";

	/**
	 * the path to media plugins / modules (within {link #frameworkBasePath})
	 * @private
	 * @memberOf Constants#
	 */
	var mediaPluginPath = "env/media/";
	/**
	 * the path to grammar engine implementations / modules (within {link #frameworkBasePath})
	 * @private
	 * @memberOf Constants#
	 */
	var grammarPluginPath = "env/grammar/";

	///////////////////////////////////////////////////// Paths of app resources /////////////////////////////////////////////////////

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
	var configurationFileUrl = _modConf["configuration.json"]? _modConf["configuration.json"] : "config/configuration.json";
	/**
	 * the name of the app's directory-/file-information file
	 * @private
	 * @memberOf Constants#
	 */
	var directoriesFileUrl = _modConf["directories.json"]? _modConf["directories.json"] : "config/directories.json";


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

		var frameworkBasePathIndex;
		//for adjusting framework path, if it is a sub-path of basePath
		if(typeof basePath === 'string' && frameworkBasePath && frameworkBasePath.indexOf(basePath) === 0){
			frameworkBasePathIndex = basePath.length;
		}

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
		else if (isBrowserEnvParam && isBrowserEnvParam.isNodeEnv){

			//TODO should this be the absolute path for node-env?
			basePath = "";//"file:";
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

		//adjust framework path if basePath & framework path had been set before AND framework path had been a sub-path of basePath
		if(isFinite(frameworkBasePathIndex) && (frameworkBasePathIndex > 0 || basePath.length > 0)){
			frameworkBasePath = basePath + frameworkBasePath.substring(frameworkBasePathIndex);
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

		/** @lends mmir.Constants.prototype */
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
			getMmirBasePath: function(){
				return frameworkBasePath;
			},
			/**
			 * Returns a string with the path to the layouts.
			 * @function
			 * @public
			 * @returns {String} layout path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getLayoutPath: function(){
				return basePath+layoutPath;
			},
			/**
			 * @memberOf mmir.Constants.prototype
			 */
			getCompiledLayoutPath: function(){
				return basePath+genLayoutPath;
			},
			/**
			 * Returns a string with the path to the models.
			 * @function
			 * @public
			 * @returns {String} model path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getModelPath: function(){
				return basePath+modelPath;
			},
			/**
			 * Returns a string with the path to the views.
			 * @function
			 * @public
			 * @returns {String} view path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getViewPath: function(){
				return basePath+viewPath;
			},
			/**
			 * @memberOf mmir.Constants.prototype
			 */
			getCompiledViewPath: function(){
				return basePath + genViewPath;
			},
			/**
			 * Returns a string with the path to the languages.
			 * @function
			 * @public
			 * @returns {String} language path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getLanguagePath: function(){
				return basePath+languagePath;
			},
			/**
			 * Returns a string with the path to the controllers.
			 * @function
			 * @public
			 * @returns {String} controller path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getControllerPath: function(){
				return basePath+controllerPath;
			},
			/**
			 * Returns a string with the path to the workers.
			 * @function
			 * @public
			 * @returns {String} worker path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getWorkerPath: function(){
				return frameworkBasePath + workerPath;
			},
			/**
			 * Returns a string with the path to the helpers.
			 * @function
			 * @public
			 * @returns {String} helper path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getHelperPath: function(){
				return basePath+helperPath;
			},
			/**
			 * Returns a string with the path to the extensions.
			 * @function
			 * @public
			 * @returns {String} extensions path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getExtensionsPath: function(){
				return frameworkBasePath + extensionsPath;
			},
			/**
			 * Returns a string with the path to the Media-Plugins.
			 * @function
			 * @public
			 * @returns {String} MediaPlugin path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getMediaPluginPath: function(){
				return frameworkBasePath + mediaPluginPath;
			},
			/**
			 * Returns a string with the path to the Grammar-Plugins
			 * (ie. engines for grammar generation).
			 *
			 * @function
			 * @public
			 * @returns {String} Grammar Plugin path
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getGrammarPluginPath: function(){
				return frameworkBasePath + grammarPluginPath;
			},
			/**
			 * Returns a string with the path to the directory that contains the generated/executable grammars.
			 * @function
			 * @public
			 * @returns {String} path for generated grammars (JavaScript files)
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getGeneratedGrammarsPath: function(){
				return basePath + genGrammarsPath;
			},
			/**
			 * Returns a string with the path to the configuration file.
			 * @function
			 * @public
			 * @returns {String} path to configuration file
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getConfigurationFileUrl: function(){
				return basePath+configurationFileUrl;
			},
			/**
			 * Returns a string with the path to the directories file (directory-strucure / file-list).
			 * @function
			 * @public
			 * @returns {String} path to directories file
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getDirectoriesFileUrl: function(){
				return basePath+directoriesFileUrl;
			},
			/**
			 * Returns a string with the path to the beep audio-file.
			 * @function
			 * @public
			 * @returns {String} path to beep wav file
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getBeepUrl: function(){
				return typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
								require('../vendor/sounds/beep-notification.mp3') :
								frameworkBasePath + beepURL;
			},
			/**
			 * Returns the name of the dictionary filename as string
			 * @function
			 * @public
			 * @returns {String} dictionary filename
			 *
			 * @memberOf mmir.Constants.prototype
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
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getSpeechConfigFileName: function(){
				return speechConfigFileName;
			},
			/**
			 * Returns the name of the grammar filename as string
			 * @function
			 * @public
			 * @returns {String} grammar filename
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getGrammarFileName: function(){
				return grammarFileName;
			},
			/**
			 * Returns the prefix for partial filenames as string
			 * @function
			 * @public
			 * @returns {String} prefix for partial filenames
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getPartialsPrefix: function(){
				return partialsPrefix;
			},
			/**
			 * Returns the suffix for helper filenames as string. A helpers filename looks like: "ControllerName"+"Helper"+".js"
			 * @function
			 * @public
			 * @returns {String} suffix for helper filenames
			 *
			 * @memberOf mmir.Constants.prototype
			 */
			getHelperSuffix: function(){
				return helperSuffix;
			},
			/**
			 * Returns default language as string.
			 * @function
			 * @public
			 * @returns {String} default language
			 *
			 * @memberOf mmir.Constants.prototype
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
			 *
			 * @memberOf mmir.Constants.prototype
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
			 *
			 * @memberOf mmir.Constants.prototype
	         */
			isBrowserEnv: function(){//FIXME replace with real environment-setting/-mechanism
				return isBrowserEnv;
			},

			/**
	         * @function
	         * @returns {Boolean}
	         * @public
			 *
			 * @memberOf mmir.Constants.prototype
	         */
			isCordovaEnv: function(){
				return env.isCordovaEnv;
			},


			/**
	         * @function
	         * @returns {String}
	         * @values "browser" | "cordova" | (or: VALUE set in document's query-parameter "?env=VALUE"
	         * @public
			 *
			 * @memberOf mmir.Constants.prototype
	         */
			getEnv: function(){
				return envInfo.envSetting? envInfo.envSetting : 'browser';
			},

			/**
	         * @function
	         * @returns {String}
	         * @values "android" | "ios" | "browser" | "default"
	         * @public
			 *
			 * @memberOf mmir.Constants.prototype
	         */
			getEnvPlatform: function(){
				return envInfo.platform;
			}
		};//END: return{}

	}//END: constructor()

	instance = new constructor(env);

	return instance;

});
