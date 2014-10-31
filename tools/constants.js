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
define(['env'], 
/**
 * A Utility class that provides various <i>constants</i>.<br>
 * 
 * <p>
 * Note that the actual values depend on the execution environment (e.g. ANDROID
 * vs. BROWSER). As a consequence the constants object has 2 modes, that can be
 * switchted via the getInstance()-method, e.g. <code>getInstance(false)</code>
 * 
 * @example <code>mmir.Constants</code>
 * @category core
 * 
 * @name Constants
 * @exports Constants as mmir.Constants
 * @static
 * @class
 */
function(
		env
){
	 /**
     * Object containing the instance of the class constants 
     * 
     * @property instance
     * @type mmir.Constants#constructor
     * @private
     */
    var instance = null;
	
	var isBrowserEnv = false;

	// needed basepath
    var basePath = "";
	
	// Paths
	var frameworkBasePath = "mmirf/";
	
	var workerPath = frameworkBasePath + "workers/";
	var pluginsPath = frameworkBasePath + "plugins/";
	var extensionsPath = frameworkBasePath + "tools/extensions/";
	var beepURL = frameworkBasePath + "vendor/sounds/beep-notification.mp3";
	var controllerPath = "controllers/";
	var helperPath = "helpers/";
	var languagePath = "config/languages/";
	var modelPath = "models/";
	var layoutPath = "views/layouts/";//before changing this: see also use of 'layouts' sub-dir-name in build/lib/mmir-build/ant/StandaloneTemplateParserExec.js
	var viewPath = "views/";
	var genViewPath = "gen/views/";
	var genLayoutPath = "gen/views/layouts/";//before changing this: see also use of 'layouts' sub-dir-name in build/lib/mmir-build/ant/StandaloneTemplateParserExec.js
	var genGrammarsPath = "gen/grammar/";
	
	var speechConfigFileName = "speech.json";
	var grammarFileName = "grammar.json";
	var dictionaryFileName = "dictionary.json";
	var mediaPluginPath = frameworkBasePath + "env/media/";
	var grammarPluginPath = frameworkBasePath + "env/grammar/";
	
	var configurationFileUrl = "config/configuration.json";
	var directoriesFileUrl = "config/directories.json";
	
	var language = "en";
	
	// Prefixes
	var partialsPrefix = '~';
	var helperSuffix = "Helper";
	
	function setBasePath(isBrowserEnvParam){
		// if not on browser: basepath must be different
		if(typeof isBrowserEnvParam === 'string'){
			basePath = isBrowserEnvParam;
		}
		else if (isBrowserEnvParam && isBrowserEnvParam.env){

			switch(isBrowserEnvParam.env){
				case 'cordova':
				case 'android':
					basePath = "file:///android_asset/www/";
					break;
				case 'ios':
				case 'default':
					basePath = "";
			}
			
		}
		else if (isBrowserEnvParam){
			basePath = "";
		}
		else {
			//TODO this is only for ANDROID -- need to set appropriate path path according to ENV setting...
			basePath = "file:///android_asset/www/";
		}
	}
	
	/**
	 * Constructor-Method of Class {@link Constants}<br>
	 * @constructs Constants
	 * @memberOf Constants.prototype
	 * @private
	 */
    function constructor(forBrowserParameter){
		isBrowserEnv = forBrowserParameter? forBrowserParameter : isBrowserEnv;
		setBasePath(forBrowserParameter);
		
		/** @lends Constants.prototype */
		return {
			/**
			 * Returns a string with the base path.
			 * @function getBasePath
			 * @public
			 * @returns {String} base path
			 */
			getBasePath: function(){
				return basePath;
			},
			/**
			 * Returns a string with the path to the plugins.
			 * @function getPluginsPath
			 * @public
			 * @returns {String} plugin path
			 */
			getPluginsPath: function(){
				return basePath+pluginsPath;
			},
			/**
			 * Returns a string with the path to the layouts.
			 * @function getLayoutPath
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
			 * @function getModelPath
			 * @public
			 * @returns {String} model path
			 */
			getModelPath: function(){
				return basePath+modelPath;
			},
			/**
			 * Returns a string with the path to the views.
			 * @function getViewPath
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
			 * @function getLanguagePath
			 * @public
			 * @returns {String} language path
			 */
			getLanguagePath: function(){
				return basePath+languagePath;
			},
			/**
			 * Returns a string with the path to the controllers.
			 * @function getControllerPath
			 * @public
			 * @returns {String} controller path
			 */
			getControllerPath: function(){
				return basePath+controllerPath;
			},
			/**
			 * Returns a string with the path to the workers.
			 * @function getWorerPath
			 * @public
			 * @returns {String} worker path
			 */
			getWorkerPath: function(){
				return workerPath;
			},
			/**
			 * Returns a string with the path to the helpers.
			 * @function getHelperPath
			 * @public
			 * @returns {String} helper path
			 */
			getHelperPath: function(){
				return basePath+helperPath;
			},
			/**
			 * Returns a string with the path to the extensions.
			 * @function getExtensionsPath
			 * @public
			 * @returns {String} extensions path
			 */
			getExtensionsPath: function(){
				return basePath + extensionsPath;
			},
			/**
			 * Returns a string with the path to the Media-Plugins.
			 * @function getMediaPluginPath
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
			 * @function getGrammarPluginPath
			 * @public
			 * @returns {String} Grammar Plugin path (
			 */
			getGrammarPluginPath: function(){
				return basePath + grammarPluginPath;
			},
			/**
			 * Returns a string with the path to the directory that contains the generated/executable grammars.
			 * @function getGeneratedGrammarsPath
			 * @public
			 * @returns {String} path for generated grammars (JavaScript files)
			 */
			getGeneratedGrammarsPath: function(){
				return basePath + genGrammarsPath;
			},
			/**
			 * Returns a string with the path to the configuration file.
			 * @function getConfigurationFileUrl
			 * @public
			 * @returns {String} path to configuration file
			 */
			getConfigurationFileUrl: function(){
				return basePath+configurationFileUrl;
			},
			/**
			 * Returns a string with the path to the directories file (directory-strucure / file-list).
			 * @function getDirectoriesFileUrl
			 * @public
			 * @returns {String} path to directories file
			 */
			getDirectoriesFileUrl: function(){
				return basePath+directoriesFileUrl;
			},
			/**
			 * Returns a string with the path to the beep audio-file.
			 * @function getBeepUrl
			 * @public
			 * @returns {String} path to beep wav file
			 */
			getBeepUrl: function(){
				return basePath+beepURL;
			},
			/**
			 * Returns the name of the dictionary filename as string 
			 * @function getDictionaryFileName
			 * @public
			 * @returns {String} dictionary filename
			 */
			getDictionaryFileName: function(){
				return dictionaryFileName;
			},
			/**
			 * Returns the name of the filename for
			 * the speech configuration as string 
			 * @function getSpeechFileName
			 * @public
			 * @returns {String} dictionary filename
			 */
			getSpeechConfigFileName: function(){
				return speechConfigFileName;
			},
			/**
			 * Returns the name of the grammar filename as string 
			 * @function grammarFileName
			 * @public
			 * @returns {String} grammar filename
			 */
			getGrammarFileName: function(){
				return grammarFileName;
			},
			/**
			 * Returns the prefix for partial filenames as string 
			 * @function getPartialsPrefix
			 * @public
			 * @returns {String} prefix for partial filenames
			 */
			getPartialsPrefix: function(){
				return partialsPrefix;
			},
			/**
			 * Returns the suffix for helper filenames as string. A helpers filename looks like: "ControllerName"+"Helper"+".js"
			 * @function getHelperSuffix
			 * @public
			 * @returns {String} suffix for helper filenames
			 */
			getHelperSuffix: function(){
				return helperSuffix;
			},
			/**
			 * Returns default language as string.
			 * @function getLanguage
			 * @public
			 * @returns {String} default language
			 */
			getLanguage: function(){
				return language;
			},
			
			/**
	         * Initialize the Constants singleton.
	         * 
	         * @function init
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
			
			isBrowserEnv: function(){//FIXME replace with real environment-setting/-mechanism
				return isBrowserEnv;
			},
			
			/**
			 * @deprecated instead, use Constants-object directly: mmir.Constants
			 */
			getInstance: function(forBrowserParameter){
				return this.init(forBrowserParameter);
			}
		};//END: return{}
		
	}//END: constructor()
	
    
//    //TODO implement mechanism for setting env-variable (e.g. read from params...)
	var isBrowserEnvironment = env.isBrowserEnv;// module.config().forBrowser;
	
	instance = new constructor(isBrowserEnvironment);
	
	//TODO find better way for initializing env-dependent settings (see also comment above)
	setBasePath({env: env.envSetting});
	
	return instance;

});
