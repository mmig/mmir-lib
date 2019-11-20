
define(['mmirf/env', 'module'],//TODO remove module-dependency? -> would need different mechanism for querying env-configuration...
/**
 * A Utility class that provides various <i>resources</i> and <i>constants</i>.<br>
 *
 * <p>
 * Note that the actual values depend on the execution environment (e.g. ANDROID vs. BROWSER).
 * As a consequence the resources object has multiple modes, that can be
 * switched via the {@link #init} -method, e.g. <code>init(false)</code>.
 *
 *
 * @name Resources
 * @memberOf mmir
 * @static
 * @class
 * @hideconstructor
 *
 * @requires org.apache.cordova.device: cordova plugin add org.apache.cordova.device
 *
 * @example var appBase = mmir.res.getBasePath();
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
	 * @type mmir.Resources
	 * @private
	 * @memberOf Resources#
	 */
	var instance = null;

	/**
	 * @memberOf Resources#
	 */
	var isBrowserEnv = false;

	// needed basepath
	/**
	 * the base path for the "invoking" app (i.e. where the main HTML file is located)
	 * @private
	 * @memberOf Resources#
	 */
	var basePath = "";

		///////////////////////////////////////////// Paths of library resources (sub-paths within library) ////////////////////////////////////////////////

	/**
	 * the base path of the (i.e. this) library
	 * @private
	 * @memberOf Resources#
	 */
	var frameworkBasePath = typeof _modConf.mmirBasePath === 'string'? _modConf.mmirBasePath : "mmirf/";

	/**
	 * the path for WebWorkers (within {link #frameworkBasePath})
	 * @private
	 * @memberOf Resources#
	 */
	var workerPath = "workers/";

	/**
	 * the path for Extensions (i.e. extending JavaScript base classes; within {link #frameworkBasePath})
	 * @private
	 * @memberOf Resources#
	 */
	var extensionsPath = "tools/extensions/";
	/**
	 * the path to the audio file containing the default beep sound (within {link #frameworkBasePath}).
	 * @private
	 * @memberOf Resources#
	 */
	var beepURL = "vendor/sounds/beep-notification.mp3";

	/**
	 * the path to media plugins / modules (within {link #frameworkBasePath})
	 * @private
	 * @memberOf Resources#
	 */
	var mediaPluginPath = "env/media/";
	/**
	 * the path to grammar engine implementations / modules (within {link #frameworkBasePath})
	 * @private
	 * @memberOf Resources#
	 */
	var grammarPluginPath = "env/grammar/";

	///////////////////////////////////////////////////// Paths of app resources /////////////////////////////////////////////////////

	/**
	 * the path to the app's controllers
	 * @private
	 * @memberOf Resources#
	 */
	var controllerPath = "controllers/";
	/**
	 * the path to the app's controller helpers
	 * @private
	 * @memberOf Resources#
	 */
	var helperPath = "helpers/";
	/**
	 * the path to the language resources root directory
	 * @private
	 * @memberOf Resources#
	 */
	var languagePath = "config/languages/";
	/**
	 * the path to the app's models
	 * @private
	 * @memberOf Resources#
	 */
	var modelPath = "models/";
	/**
	 * the path to the app's layouts
	 * @private
	 * @memberOf Resources#
	 */
	var layoutPath = "views/layouts/";//before changing this: see also use of 'layouts' sub-dir-name in build/lib/mmir-build/ant/StandaloneTemplateParserExec.js
	/**
	 * the path to the app's view root directory
	 * @private
	 * @memberOf Resources#
	 */
	var viewPath = "views/";
	/**
	 * the path to the app's generated (compiled JS) views
	 * @private
	 * @memberOf Resources#
	 */
	var genViewPath = "gen/view/";
	/**
	 * the path to the app's generated (compiled JS) layouts
	 * @private
	 * @memberOf Resources#
	 */
	var genLayoutPath = "gen/view/layouts/";
	/**
	 * the path to the app's generated (compiled JS) grammars
	 * @private
	 * @memberOf Resources#
	 */
	var genGrammarsPath = "gen/grammar/";
	/**
	 * the path to the app's generated (compiled JS) state models
	 * @private
	 * @memberOf Resources#
	 */
	var genStateModelsPath = "gen/state/";

	///////////////////////////////////////////////////// Resource Names /////////////////////////////////////////////////////

	/**
	 * the name of speech (output) configuration files
	 * @private
	 * @memberOf Resources#
	 */
	var speechConfigFileName = "speech.json";
	/**
	 * the name of (JSON) grammar files, i.e. "grammar definitions"
	 * @private
	 * @memberOf Resources#
	 */
	var grammarFileName = "grammar.json";
	/**
	 * the name of language dictionary files
	 * @private
	 * @memberOf Resources#
	 */
	var dictionaryFileName = "dictionary.json";
	/**
	 * the name of the app's configuration file
	 * @private
	 * @memberOf Resources#
	 */
	var configurationFileUrl = _modConf["configuration.json"]? _modConf["configuration.json"] : "config/configuration.json";
	/**
	 * the name of the app's directory-/file-information file
	 * @private
	 * @memberOf Resources#
	 */
	var directoriesFileUrl = _modConf["directories.json"]? _modConf["directories.json"] : "gen/directories.json";


	////////////////////////////////////////////////// General Constant Values///////////////////////////////////////////////////

	/**
	 * the default language setting
	 * @private
	 * @memberOf Resources#
	 */
	var language = "en";

	// Prefixes

	/**
	 * the prefix for partial-view file-names
	 * @private
	 * @memberOf Resources#
	 */
	var partialsPrefix = '~';
	/**
	 * the postfix for controller-helper file-names
	 * @private
	 * @memberOf Resources#
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
	 * @memberOf Resources#
	 */
	var envInfo = void(0);

	/**
	 * @private
	 * @memberOf Resources#
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

			//if param specifies that base path is absolute or provides an isAbsolutePath function -> do not adjust frameworkBasePath in case of absolute path!
			if((isBrowserEnvParam && (isBrowserEnvParam.isAbsolutePath === false || (isBrowserEnvParam.isAbsolutePath && (!isBrowserEnvParam.isAbsolutePath(frameworkBasePath) || !isBrowserEnvParam.isAbsolutePath(basePath)))))){
				frameworkBasePath = basePath + frameworkBasePath.substring(frameworkBasePathIndex);
			}
		}

	}

	/**
	 * Constructor-Method of Class {@link Resources}<br>
	 *
	 * @constructs Resources#
	 * @memberOf mmir.Resources.prototype
	 * @private
	 */
	function constructor(env){
		envInfo = env;
		isBrowserEnv = envInfo.isBrowserEnv;
		setBasePath(env);

		/** @lends mmir.Resources.prototype */
		return {
			/**
			 * Returns a string with the base path.
			 * @function
			 * @public
			 * @returns {String} base path
			 *
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
			 */
			getLayoutPath: function(){
				return basePath+layoutPath;
			},
			/**
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
			 */
			getViewPath: function(){
				return basePath+viewPath;
			},
			/**
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
			 */
			getGeneratedGrammarsPath: function(){
				return basePath + genGrammarsPath;
			},
			/**
			 * Returns a string with the path to the directory that contains the generated/executable state models (compiled SCXML).
			 * @function
			 * @public
			 * @returns {String} path for generated state models (JavaScript files)
			 *
			 * @memberOf mmir.Resources.prototype
			 */
			getGeneratedStateModelsPath: function(){
				return basePath + genStateModelsPath;
			},
			/**
			 * Returns a string with the path to the configuration file.
			 * @function
			 * @public
			 * @returns {String} path to configuration file
			 *
			 * @memberOf mmir.Resources.prototype
			 */
			getConfigurationFileUrl: function(){
				return typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
												'mmirf/settings/configuration' :
												basePath+configurationFileUrl;
			},
			/**
			 * Returns a string with the path to the directories file (directory-strucure / file-list).
			 * @function
			 * @public
			 * @returns {String} path to directories file
			 *
			 * @memberOf mmir.Resources.prototype
			 */
			getDirectoriesFileUrl: function(){
				return typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
												'mmirf/settings/directories' :
												basePath+directoriesFileUrl;
			},
			/**
			 * Returns a string with the path to the beep audio-file.
			 * @function
			 * @public
			 * @returns {String} path to beep wav file
			 *
			 * @memberOf mmir.Resources.prototype
			 */
			getBeepUrl: function(){
				return typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
								basePath + require('../vendor/sounds/beep-notification.mp3') :
								frameworkBasePath + beepURL;
			},
			/**
			 * Returns the name of the dictionary filename as string
			 * @function
			 * @public
			 * @param {String} [langCode] OPTIONAL
			 * 									the language code (i.e. the ID) for the dictionary file
			 * @returns {String} dictionary filename,
			 * 										or, if langCode is provided, the path to the dictionary file
			 *
			 * @memberOf mmir.Resources.prototype
			 */
			getDictionaryFileUrl: function(langCode){
				if(langCode){
					return typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
												'mmirf/settings/dictionary/' + langCode :
												this.getLanguagePath() + langCode + '/' + dictionaryFileName;
				}
				return dictionaryFileName;
			},
			/**
			 * Returns the name of the filename for
			 * the speech configuration as string
			 * @function
			 * @public
			 * @returns {String} speech-configuration filename
			 * @param {String} [langCode] OPTIONAL
			 * 									the language code (i.e. the ID) for the speech-configuration file
			 * @returns {String} speech-configuration filename,
			 * 										or, if langCode is provided, the path to the speech-configuration file
			 *
			 * @memberOf mmir.Resources.prototype
			 */
			getSpeechConfigFileUrl: function(langCode){
				if(langCode){
					return typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
												'mmirf/settings/speech/' + langCode :
												this.getLanguagePath() + langCode + '/' + speechConfigFileName;
				}
				return speechConfigFileName;
			},
			/**
			 * Returns the name of the grammar filename as string
			 * @function
			 * @public
			 * @param {String} [langCode] OPTIONAL
			 * 									the language code (i.e. the ID) for the grammar file
			 * @returns {String} grammar filename,
			 * 										or, if langCode is provided, the path to the grammar file
			 *
			 * @memberOf mmir.Resources.prototype
			 */
			getGrammarFileUrl: function(langCode){
				if(langCode){
					return typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
												'mmirf/settings/grammar/' + langCode :
												this.getLanguagePath() + langCode + '/' + grammarFileName;
				}
				return grammarFileName;
			},
			/**
			 * Returns the prefix for partial filenames as string
			 * @function
			 * @public
			 * @returns {String} prefix for partial filenames
			 *
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
			 */
			getLanguage: function(){
				return language;
			},

			/**
			 * Initialize the Resources singleton.
			 *
			 * @function
			 * @param {Boolean|String|EnvInfo|{isAbsolutePath: true|function}} forBrowserParameter <tt>true</tt> for browser-environment, if <tt>false</tt> ANDROID environment
			 * @returns {Object} Object containing the instance of the class {@link mmir.Resources}
			 * @public
			 *
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
			 */
			isBrowserEnv: function(){//FIXME replace with real environment-setting/-mechanism
				return isBrowserEnv;
			},

			/**
			 * @function
			 * @returns {Boolean}
			 * @public
			 *
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
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
			 * @memberOf mmir.Resources.prototype
			 */
			getEnvPlatform: function(){
				return envInfo.platform;
			}
		};//END: return{}

	}//END: constructor()

	instance = new constructor(env);

	return instance;

});
