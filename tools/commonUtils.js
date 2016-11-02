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


define(['constants', 'stringExtension', 'jquery', 'paramsParseFunc', 'logger', 'module', 'require'],
	/**
	 * A Utility class to support various functions.<br>
	 * 
	 * 
	 * @class mmir.CommonUtils
	 * @name mmir.CommonUtils
	 * @static
	 * 
	 * @public
	 * 
	 * @requires StringExtensions
	 * @requires Constants (optionally: jQuery)
	 * @requires mmir.SemanticInterpreter (in {@link mmir.CommonUtils#loadCompiledGrammars})
	 * @requires require
	 * 
     * @requires jQuery.isArray	 in #isArrayHelper
     * @requires jQuery.Deferred	 in #loadImpl, #loadDirectoryStructure, #setToCompatibilityMode
     * @requires jQuery.ajax		 in #loadDirectoryStructure
     * 
     * 
     * @requires jQuery	 in #resizeFitToSourroundingBox
     * 
     * 
     * @example var isList = mmir.CommonUtils.isArray(list);
	 * 
	 */
	function(
		constants, stringExt, $, paramsParseFunc, Logger, module, require
) {
	/** @scope mmir.CommonUtils.prototype *///for jsdoc2
	
	/**
	 * @private
	 * @type CommonUtils
     * @memberOf mmir.CommonUtils#
	 */
	var instance = null;
	
	/**
	 * @private
	 * @type Logger
     * @memberOf mmir.CommonUtils#
	 */
	var logger = Logger.create(module);

    /**
     * JSON-Object containing the directory Structure of the application. Only
     * directories defined by the Property
     * {@link CommonUtils-constructor-directoriesToParse} are contained
     * within the JSON-Object.
     * 
     * @type JSON
     * @private
     * @memberOf mmir.CommonUtils#
     */
    this.directoryStructure;

    /**
     * This helper initializes a function for detecting if an Object is an
     * Array.
     * 
     * The helper tries to find functions of JavaScript libraries for this; if
     * none can be found, a custom implementation is used.
     * 
     * The returned function is used by {@link mmir.CommonUtils#isArray}
     * 
     * NOTE: The current implementation checks jQuery.isArray for presences
     * 
     * @function
     * @private
     * @returns {Function} a function that takes one parameter (Object) and
     *          returns true if this parameter is an Array (false otherwise)
     *          
     * @memberOf mmir.CommonUtils#
     */
    var isArrayHelper = function(obj) {

		// this is the initializer: the following will overwrite the
		// isArray-function
		// with the appropriate version (use jQuery method, if present,
		// otherwise use alternative)
	
		// if present, use jQuery method:
		if (typeof $ !== 'undefined' && typeof $.isArray === 'function') {
		    isArrayHelper = $.isArray;
		}
		else {
		    // use the toString method with well-defined return-value from
		    // Object:
		    var staticToString = Object.prototype.toString;
	
		    isArrayHelper = function(obj) {
		    	return staticToString.call(obj) === '[object Array]';
		    };
		}
    };
    // initialize the isArray-function
    isArrayHelper();

    /**
     * Constructor-Method of Class {@link mmir.CommonUtils}
     * 
     * @param {jQuery}
     *            [$] the jQuery instance/object (OPTIONAL); some few function
     *            need jQuery to work correctly (see requires annotations)
     * 
     * @constructs mmir.CommonUtils
     * @memberOf mmir.CommonUtils#
     * @function
     * @private
     */
    function constructor($, constants) {
		// private members.
    	
		/**
		 * The Prefix for the file names of partial-files.<br>
		 * Files named &lt;PARTIAL-PREFIX&gt;filename.ehtml inside a
		 * views-directory are recognized as partials.
		 * 
		 * @type String
		 * @private
		 */
		var partialsPrefix = '~';
	
		/**
		 * Array of Directories (Strings) to parse at the starting process<br>
		 * those directories are then accessable by the functions
		 * {@link mmir.CommonUtils#listDir}
		 * 
		 * TODO read from properties (implement mechanism such that
		 * \build.settings and this refer to the same resource)
		 * 
		 * @type Array
		 * @private
		 */
		var directoriesToParse = [
			 "controllers", 
			 "views", 
			 "models", 
			 "config", 
			 "mmirf/plugins", 
			 "helpers"
		 ];
	
		/** @lends mmir.CommonUtils.prototype */
		return {
			
		    /**
		     * Helper function for
		     * {@link mmir.CommonUtils#listDir}
		     * to clear-up/normalize the pathname parameter
		     * 
		     * @function
		     * @private
		     * @param {string}
		     *            pathname The path that should be stripped of "file://" and a
		     *            beginning or trailing "/"
		     * @returns {String} The stripped pathname - devoid of beginning "file://"
		     *          or "/" and trailing "/"
		     * 
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    stripPathName: function(pathname) {
	
				// FIXME this is a HACK; TODO handle this in a general way!
				var basePath = constants.getBasePath();
		
				if (pathname.startsWith(basePath)) {
				    pathname = pathname.substring(basePath.length);
				}
		
				if (pathname.indexOf("file://") != -1) {
				    pathname = pathname.replace("file://", "");
				}
				if (pathname[pathname.length - 1] == "/") {
				    pathname = pathname.substring(0, pathname.length - 1);
				}
				if (pathname[0] != "/") {
				    pathname = "/" + pathname;
				}
		
				return pathname;
		    },
		    
		    // public members.
		    /**
		     * @function
		     * @public
		     * @returns {String} The Prefix for the file names of partial-files
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    getPartialsPrefix : function() {
		    	return partialsPrefix;
		    },
	
		    /**
		     * @function
		     * @public
		     * @returns {Object} Directory structure as json object
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    getDirectoryStructure : function() {
		    	return this.directoryStructure;
		    },
		    /**
		     * extracts all the strings from a String-Array into a single string
		     * 
		     * @function
		     * @public
		     * @returns {string} text
	    	 * @memberOf mmir.CommonUtils#
		     */
		    concatArray : function(array) {
				return array.join(', ');
		    },
		    /**
		     * Regular Expression for matching HTML comments.<br>
		     * 
		     * This RegExp also matches multi-line comments.
		     * 
		     * Note upon using the RegExp that it does not consider if a HTML
		     * comment is specified within a String or data-definition (i.e. the
		     * comment is matched regardless were its defined).
		     * 
		     * @type String|RegExp
		     * @public
	    	 * @memberOf mmir.CommonUtils.prototype
	    	 * 
		     * @example <!-- some comment -->
		     */
		    regexHTMLComment : /<!--([\r\n]|.)*?-->/igm,
	
		    /**
		     * Same as <code>getLocalScript</code>
		     * 
		     * @see #getLocalScript
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    loadScript : function(url, successCallback, errorCallback) {
				return this.getLocalScript.apply(this, arguments);
		    },
	
		    /**
		     * Load all plugins (i.e. JavaScript interfaces for
		     * Cordova/Java-Impl. plugins).
		     * 
		     * @function
		     * @param {String} [pluginsPath] OPTIONAL 
		     *            Path of the plugins which should be
		     *            loaded, e.g.
		     *            <b>mmirf/plugins/</b>
		     *            
		     *            If omitted: the default plugin-path is used
		     *            (see {@link mmir.Constants#getPluginsPath})
		     *            
		     * @param {Function} [cbFunction] OPTIONAL 
		     *            The function that should be executed after
		     *            the plugins are loaded. If the execution of following
		     *            functions is dependent on the present of plugins, they
		     *            should be triggered from inside the callback-function
		     *            
		     * @returns {Promise} a Deferred.promise (see loadImpl())
		     * 
		     * @async
		     * @public
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    loadAllCordovaPlugins : function(pluginsPath, cbFunction) {

		    	if(typeof pluginsPath === 'function'){
		    		cbFunction = pluginsPath;
		    		pluginsPath = null;
		    	}
		    	
		    	if(typeof pluginsPath !== 'string'){
		    		pluginsPath = constants.getPluginsPath();
		    	}
		    	
		    	// reads all *.js files in /assets/www/mmirf/plugins
	        	// and loads them dynamically
	        	// IMPORTANT: /assets/www/config/directories.json must be up-to-date!
	        	//				(it contains the list of JS-files for the plugins)
	        	//				-> use ANT /build.xml for updating 
	        	// IMPORTANT: the Java-side implementations of the plugins must be enabled 
	        	//				by corresponding entries in /res/plugins.xml file!
	        	
		    	
		    	//FIXME: Cordova 2.x mechanism!!! (remove when switching to 3.x ?)
		    	window.plugins = window.plugins || {};
		    	
		    	
				return instance.loadImpl(
	            	  pluginsPath, 
	            	  false, 
	            	  cbFunction,
					  function isPluginAlreadyLoaded(pluginFileName) {
					      if (window.plugins[pluginFileName.replace(/\.[^.]+$/g, "")]) {//<- regexpr for removing file extension
					    	  return true;
					      }
						  else {
							  return false;
					      }
					  },
					  function(status, fileName, msg){
					      if (status === 'info') {
					    	  if(logger.isInfo()) logger.info('CommonUtils', 'loadAllCordovaPlugins', 'loaded "'+ fileName + '": ' + msg);
					      }
						  else if (status === 'warning') {
							  if(logger.isWarn()) logger.warn('CommonUtils', 'loadAllCordovaPlugins', 'loading "'+ fileName + '": ' + msg);
					      }
						  else if (status === 'error') {
							  logger.error('CommonUtils', 'loadAllCordovaPlugins', 'loading "'+ fileName + '": ' + msg);
					      }
						  else {
							  logger.error('CommonUtils', 'loadAllCordovaPlugins', status + ' (UNKNOWN STATUS) -> "'+ fileName + '": ' + msg);
					      }
					  }
				);
		    },
	
		    /**
			 * Get the file path/name for a compiled grammar (executable JavaScript grammars).
			 * 
			 * @function
			 * @param {String} generatedGrammarsPath Path of the grammars which should be loaded, e.g. <b>gen/grammar/</b> 
			 * @param {String} grammarId the ID (e.g. language code) for the grammar
			 * @param {Boolean} [isFileNameOnly] OPTIONAL
			 * 					if TRUE then only the file name will be returned, otherwise the full path is returned
			 * 
		     * @returns {String} file path / name for the compiled grammar
		     *                   (returns an empty string, if there is no compile grammar for the specified grammar ID)
		     * 
			 * @public
	    	 * @memberOf mmir.CommonUtils.prototype
			 */
		    getCompiledGrammarPath : function(generatedGrammarsPath, grammarId, isFileNameOnly) {
		    	var files = instance.listDir(librariesPath, /^.*\.js$/ig);//get *.js files
		    	if(!files){
		    		return '';
		    	}
		    	var f, index, id;
		    	for(var i=0,size=files.length; i < size; ++i){
		    		f = files[i];
		    		index = f.lastIndexOf('_');
					if (index !== -1) {
						id = f.substring(0, index);
						if(id === grammarId){
							return isFileNameOnly? files[i] : generatedGrammarsPath + files[i];
						}
					}
		    	}
		    	return '';
		    },
		    /**
			 * Load all compiled grammars (executable JavaScript grammars).
			 * 
			 * @function
			 * @param {String} generatedGrammarsPath Path of the grammars which should be loaded, e.g. <b>gen/grammar/</b> 
			 * @param {Function} cbFunction The function that should be executed after the plugins are loaded. 
			 * 					 If the execution of following functions is dependent on the presence of the grammars, 
			 * 					 they should be triggered from inside the callback-function.
			 * @param {Array<String>} [ignoreGrammarIds] OPTIONAL
			 * 					grammar IDs that should be ignored, i.e. not loaded, even if there is a file available
			 * 
		     * @returns {Promise} a Deferred.promise (see loadImpl())
		     * 
		     * @requires mmir.SemanticInterpreter (must be loaded as dependency "semanticInterpreter" at least once before this function is loaded)
		     * 
			 * @async
			 * @public
	    	 * @memberOf mmir.CommonUtils.prototype
			 */
		    loadCompiledGrammars : function(generatedGrammarsPath, cbFunction, ignoreGrammarIds) {
	
				return instance.loadImpl(
					generatedGrammarsPath,
					false,
					cbFunction,
					function isGrammarAlreadyLoaded(grammarFileName) {
						var i = grammarFileName.lastIndexOf('_');
						if (i !== -1) {
							var id = grammarFileName.substring(0, i);
							if(ignoreGrammarIds){
								for(var p in ignoreGrammarIds){
									if(ignoreGrammarIds.hasOwnProperty(p) && ignoreGrammarIds[p] == id){
										return true;
									}
								}
							}
							return require('semanticInterpreter').hasGrammar(id);
						} else {
							return false;
						}
					},
					function loadCompiledGrammarsStatus(status, fileName, msg) {
						if (status === 'info') {
							if(logger.isInfo()) logger.info('CommonUtils', 'loadCompiledGrammars', 'loaded "'+ fileName + '": ' + msg);
						}
						else if (status === 'warning') {
							
							//filter "already loaded" warnings for ignored files:
							if(ignoreGrammarIds && /already loaded/.test(msg)){
								for(var p in ignoreGrammarIds){
									if(ignoreGrammarIds.hasOwnProperty(p) && fileName.indexOf(ignoreGrammarIds[p]) === 0){
										return;/////////////////////// EARLY EXIT ////////////////
									}
								}
							}
							
							if(logger.isWarn()) logger.warn('CommonUtils', 'loadCompiledGrammars', 'loading "'+ fileName + '": ' + msg);
						}
						else if (status === 'error') {
							logger.error('CommonUtils', 'loadCompiledGrammars', 'loading "' + fileName + '": ' + msg);
						}
						else {
							logger.error('CommonUtils', 'loadCompiledGrammars', status + ' (UNKNOWN STATUS) -> "' + fileName + '": ' + msg);
						}
					}
				);
	
		    },
	
		    /**
			 * Load implementation files (i.e. JavaScript files) from a directory (if <tt>librariesPath</tt> is a String) or
			 * or a list of files-names (if <tt>librariesPath</tt> is an Array of Strings).
			 * 
			 * 
			 * 
			 * @function
			 * @param {String|Array<String>} librariesPath 
			 * 				Path (or list of  of the plugins which should be loaded, e.g. <b>mmirf/plugins/</b>
			 * 				NOTE: The (String) path must be an entry in directories.json! 
			 *                    (directories.json is used to generate/"query" the file-list for the path)
			 * 
			 * @param {Boolean} isSerial
			 * 				Set <code>true</code> if the libraries should be loaded serially, i.e. synchronously, that is "one after the other" (later ones may depend on earlier ones).
			 * 				set <code>false</code> if libraries should be loaded in parallel, i.e. "asychronously" (NOTE in this case, the libraries must not depend on each other).
			 * 				
			 * 				NOTE: The loading process as a hole is asynchronous (regardless of parameter <tt>isSerial</tt>),
			 * 				      i.e. loading is completed when <tt>completedCallback()</tt> is invoked,
			 * 				      NOT when this function returns!
			 * 
			 * @param {Function} [completedCallback] 
			 * 				The function that should be executed after the libraries are loaded. 
			 * 				If the execution of following functions is dependent on the presence of the libraries,
			 * 				they should be capsuled inside this callback-function.
			 * @param {Function} [checkIsAlreadyLoadedFunc] 
			 * 				If provided, this function checks (based on the file-name), if the library is already
			 * 				loaded.
			 * 				The signature for the callback is  <code>checkIsAlreadyLoadedFunc(String fileName) return [true|false]</code>,
			 * 				i.e. the function may check - based on the file-name - if the library is already loaded.
			 * 				If the function returns <tt>true</tt>, the library will not be loaded, and loading continues
			 * 				with the next library-file.
			 * 
			 * 				NOTE: if <tt>isSerial</tt> is <tt>flase</tt>, libraries with lower indices in the list may
			 * 				      still be loading, when later entries are checked with this callback. In consequence,
			 * 				      the "is already loaded"-check may not be accurate, in case parallel loading is
			 * 				      used and the library-list contains "duplicate" entries.
			 * @param {Function} [statusCallback] 
			 * 				If provided, this function is invoked, when a library was loaded loaded (INFO) or an
			 * 				error occurs.
			 * 				The signature for the callback is 
			 * 				<code>statusCallback(String statusLevel, String fileName, String message)</code>
			 * 				where <tt>statusLevel</tt> is one of <tt>info, warning, error</tt>,
			 * 				      <tt>fileName</tt> is the file-name for the library that this status message concerns, and
			 * 				      <tt>message</tt> is a message text with details concerning the status
			 * 
			 * @returns {Promise} a Deferred.promise that will be fullfilled when loadImpl() has finished.
			 * 
			 * @async
			 * @public
	    	 * @memberOf mmir.CommonUtils.prototype
			 */
		    loadImpl: function (librariesPath, isSerial, completedCallback, checkIsAlreadyLoadedFunc, statusCallback){
	
		    	var _defer = $.Deferred();
				
				if(completedCallback){
					_defer.then(completedCallback, completedCallback);
				}
				
				var isPath = true;//TODO use this for creating absolute paths (-> in case librariesPath is an Array)!
				var theFileList;
				if(typeof librariesPath === 'string'){
					theFileList = instance.listDir(librariesPath, /^.*\.js$/ig);//get *.js files
				}
				else {
					isPath = false;
					theFileList = librariesPath;
					librariesPath = '';
				}
				
				var size = theFileList.length;
				var progress = 0;
				
				var doLoadImplFile = function doLoadImplFile(fileList, index){
					
					if( ! index){
						index = 0;
					}
						
					var fileName = fileList[index];
					
					if ( checkIsAlreadyLoadedFunc && checkIsAlreadyLoadedFunc(fileName) ){
						
						if(statusCallback){
							statusCallback('warning', fileName, 'already loaded ' + librariesPath+fileName);
						}
						
						++progress;
						//synchronous load: load next recursively
						if(isSerial){
							doLoadImplFile(fileList, index+1);
						}
						
					} else {
						
						//handler that is invoked after file has been loaded:
						var handleScriptDone = function(){
							//"notify" that this file has been DONE:
							++progress;
							
							//check: are all entries of the list done?
							if (progress < size){
								
								if( isSerial ){
									//synchronous load: load next entry recursively, when previous, i.e. this, one has finished:
									doLoadImplFile(fileList, index+1);
								}
								//all entries already have been processed -> stop now.
								return;
							}
							
							//ASSERT: all entries of the file-list are DONE -> triggere completedCallback
							
	//						if (typeof completedCallback == 'function'){
	//							completedCallback();
	//						} else {
	//							if(statusCallback){
	//								statusCallback('warning', fileName, 'provided callback for COMPLETION is not a function: '+completedCallback);
	//							}
	//							else {
	//								logger.warn('[loadImpl] callback for COMPLETION is not a function: '+completedCallback);
	//							}
	//						}
							_defer.resolve();
						};
					
						/// ATTENTION: $.getScript --> mmir.CommonUtils.getLocalScript
						/// under Android 4.0 getScript is not wokring properly
						instance.getLocalScript(librariesPath+fileName, 
							function(){
								
								if(statusCallback){
									statusCallback('info', fileName, 'done loading ' + librariesPath+fileName);
								}
								
								handleScriptDone();
							},
							function(exception) {
								if(statusCallback){
									statusCallback('error', fileName, 'could not load "' + librariesPath+fileName + '": ' + exception);
								}
								else {
									// print out an error message
									logger.error('[loadImpl] Could not load "' + librariesPath+fileName + '": ', exception);
								}
								
								//NOTE: in case of an error, will still try to load the other files from the list:
	
								handleScriptDone();
							}
						);//END: getLocalScript(callbacks)
					}
				};//END: doLoadImplFile(name,index)
				
				if(logger.isVerbose()) logger.verbose('about to load all libraries from path "'+librariesPath+'"...');
				
				if(size < 1){
					//if there are no files to resolve: 
					// immediately resolve Promise / trigger callback
					_defer.resolve();
				}
				else if( ! isSerial){
					//asynchronous load: trigger loading for all at once:
					for(var counter=0; counter < size; ++counter){
						doLoadImplFile(theFileList, counter);
					}
				}
				else {
					//synchronous load: start with first (the next one will be loaded recursively, when the first one was loaded)
					doLoadImplFile(theFileList);
				}
	
				return _defer.promise();
			},
	
		    /**
		     * Detects via the user-agent-string if the application is running
		     * on Android.
		     * 
		     * @function
		     * @public
		     * @returns {Boolean} <b>True</b> if application is running on
		     *          Android, <b>False</b> otherwise
		     *          
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    isRunningOnAndroid : function() {
				// Testing if user-Agent-/ or appVersion-String contains 'android'
				if ((navigator.userAgent.toLowerCase().indexOf("android") > -1)
					|| (navigator.appVersion.toLowerCase().indexOf("android") > -1)) {
					
					return true;
				}
				else {
					return false;
				}
		    },
	
		    /**
		     * Should detect - via the user-agent-string - if the application is
		     * running on Android, Symbian or iOS; in other words: on a
		     * smartphone.
		     * 
		     * @function
		     * @public
		     * @returns {Boolean} <b>True</b> if application is running on
		     *          smartphone, <b>False</b> otherwise
		     *          
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    isRunningOnSmartphone : function() {
				// Testing if user-Agent-/ or appVersion-String contains
				// 'Android' or 'iOS'
				// at the moment only Android-, iOS and Symbian-strings are 'implemented'
				var testString = navigator.userAgent.toLowerCase()
									+ navigator.appVersion.toLowerCase();
				
				if ((testString.indexOf("android") > -1)
					|| (testString.indexOf("ios") > -1)
					|| (testString.indexOf("symbian") > -1)) {
					
					return true;
				}
				else {
					return false;
				}
		    },
	
		    /**
		     * <div class="box important"> <b>Note:</b> On Android 4.0
		     * jQuery.getScript() is not working properly - so use this function instead!
		     * </div>
		     * 
		     * Similar to the jQuery.getScript() function - appending a url of a
		     * javascript-source to the header of the main document.<br>
		     * This function also calls a success-callback if the script was
		     * successfully loaded or a fail-callback.<br>
		     * 
		     * 
		     * @function
		     * @param {String}
		     *            scriptUrl source of javascript-file
		     * @param {Function}
		     *            success success callback function
		     * @param {Function}
		     *            fail fail callback function
		     * @async
		     * @public
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    getLocalScript : function(scriptUrl, success, fail) {
				var head = document.getElementsByTagName('head')[0];
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = scriptUrl;
				script.onload = function() {
					if(success){
						success.apply(this, arguments);
					}
					else {
						logger.debug('CommonUtils', 'getLocalScript', 'Successfully loaded script from ' + this.src)
					}
				};
				script.onerror = function(e) {
					if(fail){
						fail.apply(this, arguments);
					}
					else {
						logger.error('CommonUtils', 'getLocalScript', 'Loading Script Failed from "' + scriptUrl + '"', e);
					}
				};
				head.appendChild(script);
		    },
	
		    /**
		     * @copydoc #listDir
		     * @deprecated use {@link #listDir} instead
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    getDirectoryContents : function(pathname) {
				return this.getDirectoryContentsWithFilter(pathname);
		    },
		    /**
		     * @copydoc #listDir
		     * @deprecated use {@link #listDir} with RegExp for filter instead (see example for converting pseudo-wildcard string to RegExp)
	    	 * @memberOf mmir.CommonUtils.prototype
	    	 * 
	    	 * @example 
	    	 * //convert pseudo-wildcard string to RegExp
	    	 * var filterStr = '^' + filter.replace('.', '\\.').replace('*', '.*').replace('\$', '\\$') + '$'; // e.g.,// '^.*\.js$'
		     * var regexpr = new RegExp(filterStr, 'gi');
	    	 * mmir.CommonUtils.listDir(pathname, regexpr); 
	    	 * 
		     */
		    getDirectoryContentsWithFilter : function(pathname, filter) {
		    	
		    	if(filter){
		    		var filterStr = '^' + filter.replace('.', '\\.').replace('*', '.*').replace('\$', '\\$') + '$'; // e.g.,// '^.*\.js$'
		    		filter = new RegExp(filterStr, 'gi');
		    	}
		    	
				return this.listDir(pathname, filter);
		    },
	
		    /**
		     * This function returns an array of strings (file names) with the contents of 
		     * the directory <code>pathname</code>.
		     * 
		     * The <code>pathname</code> must be one of the directories (or sub-directories)
		     * of the framework's parsed folders, see {@link #directoriesToParse}.
		     * 
		     * If a <code>filter</code> is use, only files which's names match
		     * the filter are included in the returned list.
		     * 
		     * @function
		     * @param {String} pathname
		     *            Path of the directory which's contents should be
		     *            returned
		     * @param {String|RegExp|Function} [filter]
		     *            Filter for file-names:
		     *              if <code>String</code> the file-name may contain the wildcard <code>*</code> 
		     *                (comparison is <b>not case-sensitive</b>), 
		     *                e.g.: <b>*.js</b>, <b>*</b> or <b>*.ehtml</b>
		     *              if <code>RegExp</code> the file-name must match the regular expression, 
		     *                e.g.: <b>/.*\.js/ig</b> or <b>/^.*\.ehtml$/ig</b>
		     *              if <code>Function</code> the file-name is included, if the function returns <code>true</code>,
		     *                where the function signature is <code>function(fileName: String) : Boolean</code>,
		     *                note that argument <code>fileName</code> will have been transformed to lower-case characters
		     *              
		     * @public
		     * @returns {Array} Array of Strings which contains the contents of
		     *          the directory.
		     *          Or <code>null</code>, if <code>pathname</code> is not one of the framework's
		     *          parsed folders.
		     *          
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    listDir : function(pathname, filter) {
		    	
		        pathname = this.stripPathName(pathname);

		        try {
		            var tmp = this.directoryStructure[pathname];
		            if (typeof tmp === 'undefined') {
		            	
		                logger.debug('CommonUtils', 'listDir', 'path "' + pathname + '" not found.');
		                
		                return null;////////////////// EARLY EXIT ///////////////////////////////
		            } 
		            else {

		                var i, size, retValue;
		                if(filter && typeof filter !== 'string'){//evaluate filter as RegExp or Function
		                	
		                	retValue = [];
		                	var isFunc = typeof filter === 'function';
		                	
		                	//reset search-position for RegExp
		                	isFunc || (filter.lastIndex = 0);
		            		
		            		for (i = 0, size = tmp.length; i < size; ++i) {
								if((isFunc && filter(tmp[i])) || (!isFunc && filter.test(tmp[i]))) {
									retValue.push(tmp[i]);
								}
								isFunc || (filter.lastIndex = 0);
							}
		            		return retValue;////////////////// EARLY EXIT ///////////////////////////////
		            	}
		            	
				        var pattern = typeof filter === 'string'? filter.split('*') : null;

		                if(!pattern || pattern.length === 0){
		                	//no filter or invalid/all-allowing wildcard filter -> return complete result
		                    return tmp;////////////////// EARLY EXIT ////////////////////////////////////
		                }

		            	//evaluate filter as wildcard-string

		                //ASSERT pattern.length >= 1

		                for (i = 0, size = pattern.length; i < size; ++i) {
		                    pattern[i] = pattern[i].toLowerCase();
		                }

		                var e, elen, j, index, part, doAdd, isStartWc;
		                var plen = pattern.length;
		                
	                	retValue = [];
		                for (i = 0, size = tmp.length; i < size; ++i) {

		                    e = tmp[i].toLowerCase();

		                    if(e){

		                        //ASSERT e.length >= 1
		                        
		                        elen = e.length;
		                        
		                        doAdd = true;
		                        index = 0;
		                        isStartWc = false;

		                        //match all entries of pattern-list (or exclude e from retValue)
		                        for(j=0; j < plen; ++j){
		                            
		                            part = pattern[j];
		                            
		                            if(!part){
		                                if(j===0){
		                                    //-> very first pattern-part is a wildcard
		                                    isStartWc = true;
		                                } else if(j=== plen-1) {
		                                    //-> very last pattern-part is a wildcard
		                                    break;
		                                } else {
		                                    //-> double wildcard, i.e. '**' ... just ignore, and continue with next part
		                                    continue;
		                                }
		                            }

		                            index = e.indexOf(part, index);
		                            if(index === -1){
		                                doAdd = false;
		                                break;
		                            } else {

		                                //special case j==0: matching for part must be at index 0, 
		                                // if pattern does not start with a wildcard
		                                if(j===0 && index!==0 && !isStartWc){
		                                    doAdd = false;
		                                    break;
		                                }

		                                //continue matching for next pattern-part at pos+1
		                                index += part.length;

		                                if(j === plen-1 && index < elen){

		                                    //if last pattern-part (and it is not a wildcard),
		                                    //then it must match the remaining string, otherwise
		                                    //exclude e from retValue
		                                    doAdd = false;
		                                }
		                            }
		                            
		                        }//END for(j in pattern)

		                        if(doAdd){
		                            retValue.push(tmp[i]);
		                        }
		                        
		                    }//END if(e)
		                    
		                }//END for(i in tmp)
		                
		                return retValue;////////////////// EARLY EXIT ///////////////////////////////
		                
		            }//END else tmp
		            
		        } catch (e) {
		            logger.error('CommonUtils', 'listDir', '[' + pathname + ' | ' + filter + '] ', e);
		        }
		        
		        return null;
		    },
	
		    /**
		     * Checks if an object is an <code>Array</code>.
		     * 
		     * <p>
		     * This function can be safely run in arbitrary contexts, e.g.
		     * 
		     * <pre>
		     *  var checkArray = mmir.CommonUtils.isArray;
		     *  if( checkArray(someObject) ){
		     *   ...
		     * </pre>
		     * 
		     * @function
		     * @param {Object}
		     *            object the Object for checking if it is an Array
		     * @public
		     * @returns {Boolean} <code>true</code> if <code>object</code>
		     *          is an <code>Array</code>, otherwise
		     *          <code>false</code>.
		     *          
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    isArray : function(object) {
				return isArrayHelper(object);
		    },
	
		    /**
		     * This function iterates over all elements of a specific class and
		     * changes the font-size of the contained text to the maximal
		     * possible size - while still being small enough to fit in the
		     * element.
		     * 
		     * @function
		     * @param {String}
		     *            class_name Name of the class which inner text should
		     *            be fitted to the size of the element
		     * 
		     * @requires jQuery
		     * @public
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    resizeFitToSourroundingBox : function(class_name) {
				// resize the font in box_fit-class, so that it won't overlap its div-box
				$(function() {
	
					var smallest_font = 1000;
					$(class_name).each(function(i, box) {
						var width = $( box ).width(),
        					html = '<span style="white-space:nowrap">',
        					line = $( box ).wrapInner( html ).children()[ 0 ],
        					n = parseInt($( box ).css("font-size"), 10);
        				
        				$( box ).css( 'font-size', n );

        				while ( $( line ).width() > width ) {
        					$( box ).css( 'font-size', --n );
        				}

        				$( box ).text( $( line ).text() );
        				
        				n = parseInt($( box ).css("font-size"), 10);
        				
						if (n < smallest_font) {
							smallest_font = n;
						}
					});
	
					$(class_name).each(function(i, box) {
						$(box).css('font-size', smallest_font);
					});
				});
		    },
	
		    /**
		     * 
		     * IMPORTED FROM paramsParseFunc.js
		     * <p>
		     * 
		     * Convert parameter-part of an URL to a "dictionary", containing
		     * the parameter keys and values
		     * <p>
		     * 
		     * 	<code>?id=5&name=heinz&name=kunz</code> &rarr;
		     * 	<pre>
		     * 	{
		     * 	  id: "5",
		     * 	  name: ["heinz", "kunz"],
		     *    
		     * 	  //utility functions
		     * 	  has: function(key) : Boolean,
		     * 	  isMultiple: function(key) : Boolean,// is entry an Array of values
		     * 	  getKeys: function() : String[],     // get list of all keys
		     * 	}
		     * 	</pre>
		     * <p>
		     * 
		     * The returnd "dictionary" has the following functions:
		     * <ul>
		     * <li>has(String key): returns <code>true</code> if the
		     * dictionary contains an entry for <code>key</code></li>
		     * <li>isMultiple(String key): returns <code>true</code> if the
		     * entry for <code>key</code> is an Array (i.e. the URL contained
		     * multiple values for this key)</li>
		     * <li>getKeys(): returns an Array with the keys (String) for all
		     * entries</li>
		     * </ul>
		     * 
		     * @function
		     * @param {String} urlParamsPartStrings
		     *            the parameter-part of the URL, i.e. <code>&...</code>
		     * @return {Object} a "dictionary" for the parameters
		     * @public
			 * @memberOf mmir.CommonUtils.prototype
		     */
		    parseParamsToDictionary : paramsParseFunc,
		    
		    /**
		     * This function is used check whether a network connection is
		     * enabled. </br> This version of checking the network connection is
		     * based on the cordova 2.3.0 API.
		     * 
		     * TODO implement with HTML5 functions (in addition to / instead of
		     * cordova)?
		     * 
		     * @requires Cordova: org.apache.cordova.network-information
		     * 
		     * @function
		     * @public
		     * @returns {Boolean} <code>true</code> if a network connection is enabled
		     * 
	    	 * @memberOf mmir.CommonUtils.prototype
		     */
		    checkNetworkConnection : function() {
		    	
	        	if(logger.isVerbose()) logger.verbose("Checking network status...");
				
				if(typeof navigator === 'undefined'){
					logger.error('Cannot check network status: navigator object is not available!');
					return 'UNKNOWN';
				}
				
				//ASSERT: navigator exists
				
				if(!navigator.connection){
					if(logger.isInfo()) logger.warn('Cannot check network status: object navigator.connection is not available');
					if(typeof navigator.onLine !== 'undefined'){
						return navigator.onLine;
					}
					else {
						return 'UNKNOWN';
					}
				}
				var networkState = navigator.connection.type;
	
				//TODO make states-obj a 'private' field of CommonUtils 
				var states = {};
				states[Connection.UNKNOWN]  = 'Unknown connection';
				states[Connection.ETHERNET] = 'Ethernet connection';
				states[Connection.WIFI]     = 'WiFi connection';
				states[Connection.CELL_2G]  = 'Cell 2G connection';
				states[Connection.CELL_3G]  = 'Cell 3G connection';
				states[Connection.CELL_4G]  = 'Cell 4G connection';
				states[Connection.CELL]     = 'Cell generic connection';
				states[Connection.NONE]     = 'No network connection';
	
				if (Connection.NONE === networkState){
					//alert('Connection type: ' + states[networkState]);
					return false;
				}
				return true;
		    },
		    
			/**
			 * Parses the directory structure and stores the result in the class-property {@link mmir.CommonUtils-directoryStructure}
			 * 
			 * @function
			 * @param {Function} [success] The function that should be executed after the diretories are parsed - it's best to include all following functions inside the callback-function.
			 * @param {Function} [errorFunc] callback function that is invoked if an error occured during initialization. 
			 * @async
			 * @public
	    	 * @memberOf mmir.CommonUtils.prototype
			 */
		    loadDirectoryStructure: function (success, errorFunc) {
				var _defer = $.Deferred();
				var self = this;
				
				if(success || errorFunc){
					_defer.then(success, errorFunc);
				}

				var directoryFileUrl = constants.getDirectoriesFileUrl();
				
				//load configuration file asynchronously: 
				$.ajax({
					async: true,
					dataType: "json",
					url: directoryFileUrl,
					success: function(data){
						if(logger.isVerbose()) logger.verbose("DirectoryListing.getDirectoryStructure: loaded file from "+directoryFileUrl);
						
						if(data){
							if(logger.isVerbose()) logger.verbose("DirectoryListing.getDirectoryStructure: Succeeded to load directory structure from '"+directoryFileUrl+"'! Data: "+ JSON.stringify(data));
							
							self.directoryStructure = data;
							
							if(logger.isVerbose()) logger.verbose("[getDirectoryStructure] finished.");//debug
							
							_defer.resolve(self);
						}
					},
					error: function(jqXHR, textStatus, errorThrown){
						if(logger.isVerbose()) logger.verbose("DirectoryListing.getDirectoryStructure: failed to load file from '"+directoryFileUrl+"'! Status "+textStatus+": "+ errorThrown+ ", "+JSON.stringify(jqXHR));
						
						var msg = "[ERROR] " + textStatus+": failed to load file from '"+directoryFileUrl+"' - "+ errorThrown;
						if( ! errorFunc){
							logger.error('CommonUtils', 'loadDirectoryStructure', msg);
						}
						
						_defer.reject(msg);
					}
				});
				
				return _defer.promise();
		    },
		    
			init: function(success, errorFunc){
				
				var initPromise;
				
				//use the Deferred from load-dir-struct, since this is the only async initialization atm:
				initPromise = this.loadDirectoryStructure.apply(this, arguments);
				
				//replace init so that we do not ivoke load-dir-struct multiple times
				this.__initDeferred = initPromise;
				this.init = function initCompleted(onsuccess, onerror){
					if(onsuccess || onerror){
						this.__initDeferred.then(success, onerror);
					}
					return this.__initDeferred;
				};
				
				return initPromise;
			}
		    
		    /**
		     * Set to "backwards compatibility mode" (for pre version 2.0).
		     * 
		     * This function re-adds deprecated and removed functions and
		     * properties to the CommonUtils instance.
		     * 
		     * NOTE that once set to compatibility mode, it cannot be reset to
		     * non-compatibility mode.
		     * 
		     * @deprecated use only for backward compatibility
		     * 
		     * @async
		     * @requires jQuery.Deferred
		     * @requires mmir.CommonUtils.setToCompatibilityModeExtension
		     * 
		     * @param {Function} [success]
		     * 				a callback function that is invoked, after compatibility mode
		     * 				was set (alternatively the returned promise can be used).
		     * @param {Function} [requireFunction]
		     * 				the require-function that is configured for loading the compatibility module/file.
		     * 				Normally, this would be the function <code>mmir.require</code>.
		     * 				If omitted, the default (local dependency) <code>require</code> function will be used.
		     * 				NOTE: this argument is positional, i.e. argument <code>success</code> must be present, if
		     * 				      you want to specify this argument
		     * @returns {jQuery.Promise}
		     * 				a Deffered.promise that is resolved, after compatibility mode
		     * 				was set
		     * 
	    	 * @memberOf mmir.CommonUtils.prototype
	    	 * 
		     * @see mmir.CommonUtils.setToCompatibilityModeExtension
		     * 
		     */
		    , setToCompatibilityMode : function(success, requireFunction) {
		    	
		    	var defer = $.Deferred();
		    	if(success){
		    		defer.then(success, success);
		    	}

		    	requireFunction = requireFunction || require;
		    	requireFunction(['commonUtilsCompatibility'],function(setCompatibility){
		    		
		    		setCompatibility(instance);
		    		
		    		defer.resolve();
		    	});
		    	
		    	return defer.promise();
		    }
			
		};// END: return {...
	
    }// END: constructor()

    
	instance = new constructor($, constants);
	
	return instance;
    
	

});
