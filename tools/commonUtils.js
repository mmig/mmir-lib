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

/**
 * @module mmir.tools
 * 
 */


define(['constants', 'stringExtension', 'jquery', 'paramsParseFunc', 'logger', 'module'],
	/**
	 * A Utility class to support various functions.<br>
	 * 
	 * @example <code>mmir.CommonUtils.isArray(list)</code>
	 * @category core
	 * 
	 * 
	 * @class mmir.CommonUtils
	 * @name mmir.CommonUtils
	 * @static
	 * 
	 * @public
	 * 
	 * @depends StringExtensions
	 * @depends Constants (optionally: jQuery)
	 * @depends mmir.SemanticInterpreter (in {@link mmir.CommonUtils#loadCompiledGrammars})
	 * 
     * @depends jQuery.isArray	 in #isArrayHelper
     * @depends jQuery.Deferred	 in #loadImpl, #loadDirectoryStructure, #setToCompatibilityMode
     * @depends jQuery.ajax		 in #loadDirectoryStructure
     * 
     * 
     * @depends jQuery	 in #resizeFitToSourroundingBox
	 */
	function(
		constants, stringExt, $, paramsParseFunc, Logger, module
) {
	/** @scope mmir.CommonUtils.prototype */
	/**
	 * #@+
	 * @memberOf mmir.CommonUtils.prototype
	 */
	
	var instance = null;
	
	var logger = Logger.create(module);

    /**
     * JSON-Object containing the directory Structure of the application. Only
     * directories defined by the Property
     * {@link CommonUtils-constructor-directoriesToParse} are contained
     * within the JSON-Object.
     * 
     * @property directoryStructure
     * @type JSON
     * @private
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
     * @function isArrayHelper
     * @private
     * @returns {Function} a function that takes one parameter (Object) and
     *          returns true if this parameter is an Array (false otherwise)
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
     * @memberOf mmir.CommonUtils.prototype
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
		 * @property partialsPrefix
		 * @type String
		 * @private
		 */
		var partialsPrefix = '~';
	
		/**
		 * Array of Directories (Strings) to parse at the starting process<br>
		 * those directories are then accessable by the functions
		 * {@link mmir.CommonUtils#getDirectoryContents} and
		 * {@link mmir.CommonUtils#getDirectoryContentsWithFilter}
		 * 
		 * TODO read from properties (implement mechanism such that
		 * \build.settings and this refer to the same resource)
		 * 
		 * @property directoriesToParse
		 * @type Array
		 * @private
		 */
		var directoriesToParse = [
			 "www/controllers", 
			 "www/views", 
			 "www/models", 
			 "www/config", 
			 "www/mmirf/plugins", 
			 "www/helpers"
		 ];
	
		/** @lends mmir.CommonUtils.prototype */
		return {
		    
			/**
	    	 * #@+
	    	 * @memberOf mmir.CommonUtils.prototype
	    	 */
			
		    /**
		     * This function is used by
		     * {@link mmir.CommonUtils#getDirectoryContents} and
		     * {@link mmir.CommonUtils#getDirectoryContentsWithFilter} to strip the
		     * pathname parameter
		     * 
		     * @function stripPathName
		     * @private
		     * @param {string}
		     *            pathname The path that should be stripped of "file://" and a
		     *            beginning or trailing "/"
		     * @returns {String} The stripped pathname - devoid of beginning "file://"
		     *          or "/" and trailing "/"
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
		     * @function getPartialsPrefix
		     * @public
		     * @returns {String} The Prefix for the file names of partial-files
		     */
		    getPartialsPrefix : function() {
		    	return partialsPrefix;
		    },
	
		    /**
		     * @function getDirectoryStructure
		     * @public
		     * @returns {Object} Directory structure as json object
		     */
		    getDirectoryStructure : function() {
		    	return this.directoryStructure;
		    },
		    /**
		     * extracts all the strings from a String-Array into a single string
		     * 
		     * @function concatArray
		     * @public
		     * @returns {string} text
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
		     * @example <code> <!-- some comment --></code>
		     * @property regexHTMLComment
		     * @type String|RegExp
		     * @public
		     */
		    regexHTMLComment : /<!--([\r\n]|.)*?-->/igm,
	
		    /**
		     * Similar to the jQuery.getScript() function - appending a url of a
		     * javascript-source to the header of the main document.<br>
		     * This function also calls a callback if the script was loaded.
		     * 
		     * @function loadScript
		     * @param {String}
		     *            url source of javascript-file
		     * @param {Function}
		     *            callback callback function
		     * @public
		     * @async
		     * @deprecated instead use  #getLocalScript()
		     */
		    loadScript : function(url, callback) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = url;
	
				if (typeof callback === 'function') {
					/** @ignore */
					script.onload = function() {
					callback();
					};
				}
				document.getElementsByTagName("head")[0].appendChild(script);
		    },
	
		    /**
		     * Load all plugins (i.e. JavaScript interfaces for
		     * Cordova/Java-Impl. plugins).
		     * 
		     * @function loadAllCordovaPlugins
		     * @param {String} [pluginsPath] OPTIONAL 
		     *            Path of the plugins which should be
		     *            loaded, e.g.
		     *            <b>mmirf/plugins/</b>
		     *            
		     *            If omitted: the default plugin-path is used
		     *            (see {@link mmir.Constant#getPluginsPath}
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
			 * Load all compiled grammars (executable JavaScript grammars).
			 * 
			 * @function loadCompiledGrammars
			 * @param {String} generatedGrammarsPath Path of the grammars which should be loaded, e.g. <b>gen/grammar/</b> 
			 * @param {Function} cbFunction The function that should be executed after the plugins are loaded. 
			 * 					 If the execution of following functions is dependent on the presence of the grammars, 
			 * 					 they should be triggered from inside the callback-function.
			 * 
		     * @returns {Promise} a Deferred.promise (see loadImpl())
		     * 
		     * @requires mmir.SemanticInterpreter (must be loaded as dependency "semanticInterpreter" at least once before this function is loaded)
		     * 
			 * @async
			 * @public
			 */
		    loadCompiledGrammars : function(generatedGrammarsPath, cbFunction) {
	
				return instance.loadImpl(
					generatedGrammarsPath,
					false,
					cbFunction,
					function isGrammarAlreadyLoaded(grammarFileName) {
						var i = grammarFileName.indexOf('_');
						if (i !== -1) {
							return require('semanticInterpreter').hasGrammar(
									grammarFileName.substring(0, i)
							);
						} else {
							return false;
						}
					},
					function loadCompiledGrammarsStatus(status, fileName, msg) {
						if (status === 'info') {
							if(logger.isInfo()) logger.info('CommonUtils', 'loadCompiledGrammars', 'loaded "'+ fileName + '": ' + msg);
						}
						else if (status === 'warning') {
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
			 * @function loadImpl
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
			 */
		    loadImpl: function (librariesPath, isSerial, completedCallback, checkIsAlreadyLoadedFunc, statusCallback){
	
		    	var _defer = $.Deferred();
				
				if(completedCallback){
					_defer.always(completedCallback);
				}
				
				var isPath = true;//TODO use this for creating absolute paths (-> in case librariesPath is an Array)!
				var theFileList;
				if(typeof librariesPath === 'string'){
					theFileList = instance.getDirectoryContentsWithFilter(librariesPath, "*.js");
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
					
						/// ATTENTION: $.getScript --> mobileDS.CommonUtils.getInstance().getLocalScript
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
		     * @function isRunningOnAndroid
		     * @public
		     * @returns {Boolean} <b>True</b> if application is running on
		     *          Android, <b>False</b> otherwise
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
		     * @function isRunningOnSmartphone
		     * @public
		     * @returns {Boolean} <b>True</b> if application is running on
		     *          smartphone, <b>False</b> otherwise
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
		     * @function getLocalScript
		     * @param {String}
		     *            scriptUrl source of javascript-file
		     * @param {Function}
		     *            success success callback function
		     * @param {Function}
		     *            fail fail callback function
		     * @async
		     * @public
		     */
		    getLocalScript : function(scriptUrl, success, fail) {
				var head = document.getElementsByTagName('head')[0];
				script = document.createElement('script');
				script.type = 'text/javascript';
				script.src = scriptUrl;
				script.onload = function() {
					if(success){
						success.apply(this, arguments);
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
		     * This function returns an array of strings with the contents of a
		     * directory.
		     * 
		     * @function getDirectoryContents
		     * @param {String}
		     *            pathname Path of the directory which contents should
		     *            be returned
		     * @public
		     * @returns {Array} Array of Strings which contains the contents of
		     *          the directory
		     */
		    getDirectoryContents : function(pathname) {
				var retValue;
	
				pathname = this.stripPathName(pathname);
	
				try {
					retValue = this.directoryStructure[pathname];
				} catch (e) {
					logger.error(e);
					retValue = null;
				}
				return retValue;
		    },
	
		    /**
		     * This function returns an array of strings with the contents of a
		     * directory, giving only those files which match the filter.
		     * 
		     * @function getDirectoryContentsWithFilter
		     * @param {String}
		     *            pathname Path of the directory which contents should
		     *            be returned
		     * @param {String}
		     *            filter Filter of file-names: <b>*.js</b>, <b>*</b>
		     *            or <b>*.ehtml</b>
		     * @public
		     * @returns {Array} Array of Strings which contains the contents of
		     *          the directory
		     */
		    getDirectoryContentsWithFilter : function(pathname, filter) {
				var retValue = new Array();
	
				var tmpfilter = '^' + filter.replace('.', '\\.').replace('*', '.*').replace('\$', '\\$') + '$'; // e.g.,// '^.*\.js$'
	
				var filterRegExp = new RegExp(tmpfilter, 'gi');
	
				pathname = this.stripPathName(pathname);
	
				try {
					var tmp = this.directoryStructure[pathname];
					if (tmp == undefined) {
						if(logger.isWarn()) logger.warn('CommonUtils', 'getDirectoryContentsWithFilter', '[' + pathname + ' / ' + filter + ']  not found.');
						retValue = null;
					} 
					else {
						for (var i = 0; i < tmp.length; i++) {
							if (tmp[i].match(filterRegExp)) {
								retValue.push(tmp[i]);
							}
						}
					}
				} catch (e) {
					logger.error('CommonUtils', 'getDirectoryContentsWithFilter', '[' + pathname + ' / ' + filter + '] ', e);
					retValue = null;
				}
				return retValue;
		    },
	
		    /**
		     * Checks if an object is an <code>Array</code>.
		     * 
		     * <p>
		     * This function can be savely run in arbirtray contexts, e.g.
		     * 
		     * <pre>
		     *  var checkArray = mmir.CommonUtils.getInstance().isArray;
		     * if( checkArray(someObject) ){
		     *   ...
		     * </pre>
		     * 
		     * @function isArray
		     * @param {Object}
		     *            object the Object for checking if it is an Array
		     * @public
		     * @returns {Boolean} <code>true</code> if <code>object</code>
		     *          is an <code>Array</code>, otherwise
		     *          <code>false</code>.
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
		     * @function resizeFitToSourroundingBox
		     * @param {String}
		     *            class_name Name of the class which inner text should
		     *            be fitted to the size of the element
		     * 
		     * @requires jQuery
		     * @public
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
		     * Converts the object to a valid JSON String value.
		     * 
		     * Ensures that the returned value does not contain (un-escaped)
		     * double-quotes, so that the returned value can be used as a JSON
		     * value, e.g. </br>
		     * 
		     * @example <code>var jsonValue = toJSONStringValue(someValue);
		     *  var data = JSON.parse('"theValue":"' + jsonValue + '"');</code>
		     * @function toJSONStringValue
		     * @param {Object}
		     *            theObjectValue the object to convert to a JSON String
		     *            value. If NULL or UNDEFINED, an EMPTY String will be
		     *            returned
		     * @returns {String} the String value
		     * @public
		     */
		    toJSONStringValue : function(theObjectValue) {
				if (typeof theObjectValue !== 'undefined' && theObjectValue !== null) {
					if (typeof theObjectValue !== 'string') {
						theObjectValue = theObjectValue.toString();
					}
					theObjectValue = theObjectValue.escapeDoubleQuotes();
				}
				else {
					theObjectValue = '';
				}
				return theObjectValue;
		    },
	
		    /**
		     * Converts the object to a valid JSON String value.
		     * 
		     * Ensures that the returned value does not contain (un-escaped)
		     * double-quotes, so that the returned value can be used as a JSON
		     * value, also does replace all newlines with the HTML-equivalent
		     * '&lt;br/&gt;', e.g.
		     * 
		     * @example <code> var jsonValue = toJSONStringValue(someValue);
		     *  var data = JSON.parse('"theValue":"' + jsonValue + '"');
		     *  ...</code>
		     * @function convertJSONStringValueToHTML
		     * @param {Object}
		     *            theObjectValue the object to convert to a JSON String
		     *            value. If NULL or UNDEFINED, an EMPTY String will be
		     *            returned
		     * @returns {String} the String value
		     * @public
		     */
		    convertJSONStringValueToHTML : function(str) {
				if (typeof str !== 'undefined' && str !== null) {
				
					if (typeof str !== 'string') {
						str = str.toString();
					}
					// escape double-quotes, if necessary
					// replace (all variants of) newlines with HTML-newlines
					str = str.escapeDoubleQuotes().replaceAll('\r\n', '<br/>')
							.replaceAll('\n', '<br/>')
							.replaceAll('\r', '<br/>');
				} else {
					str = '';
				}
				return str;
	
		    },
	
		    /**
		     * Converts the object's direct properties to a valid JSON String
		     * (i.e. no recursion for Object properties).
		     * 
		     * @function convertJSONStringToHTML
		     * @param {Object}
		     *            _o the object to convert to a JSON String.
		     * @returns {String} the String value
		     * @public
		     */
		    convertJSONStringToHTML : function(_o) {
				// var parse = function(_o){
				var a = new Array(), t;
				for ( var p in _o) {
					if (_o.hasOwnProperty(p)) {
						t = _o[p];
						if (t != null) {
							if (t && typeof t == "object") {
								a[a.length] = p + ":{ " + arguments.callee(t).join(", ") + "}";
							}
							else {
								if (typeof t == "string") {
									a[a.length] = [ p + ": \"" + t.toString() + "\"" ];
								} 
								else {
									a[a.length] = [ p + ": " + t.toString() ];
								}
							}
						}
					}
				}
				// return a;
				// };
				// return "{" + parse(o).join(", ") + "}";
	
				return "{" + a.join(", ") + "}";
		    },
	
		    /**
		     * 
		     * IMPORTED FROM paramsParseFunc
		     * 
		     * 
		     * Convert parameter-part of an URL to a "dictionary", containing
		     * the parameter keys and values
		     * 
		     * @example <code>?id=5&name=heinz&name=kunz</code> &rarr;
		     *          <code>dict['id']=5, dict['name'] = ['heinz', 'kunz']</code>
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
		     * @function parseParamsToDictionary
		     * @param {String}
		     *            the parameter-part of the URL, i.e. <code>&...</code>
		     * @return {Object} an "dictionary" for the parameters
		     * @public
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
		     * @depends Cordova: org.apache.cordova.network-information
		     * 
		     * @function checkNetworkConnection
		     * @public
		     * @returns {Boolean} <code>true</code> if a network connection is enabled
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
			 * Parses the directory structure - paths given by property {@link mmir.CommonUtils-constructor-directoriesToParse} - and storing the result in the class-property {@link mmir.CommonUtils-directoryStructure}
			 * 
			 * @function loadDirectoryStructure
			 * @param {Function} [success] The function that should be executed after the diretories are parsed - it's best to include all following functions inside the callback-function.
			 * @param {Function} [errorFunc] callback function that is invoked if an error occured during initialization. 
			 * @async
			 * @public
			 */
		    loadDirectoryStructure: function (success, errorFunc) {
				var _defer = $.Deferred();
				var self = this;
				
				if(success){
					_defer.done(success);
				}
				if(errorFunc){
					_defer.fail(errorFunc);
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
						
						_defer.fail(msg);
					}
				});
				
				return _defer.promise();
		    },
		    
			init: function(success, errorFunc){
				
				return this.loadDirectoryStructure.apply(this, arguments);
				
//				var _defer = $.Deferred();
//				var self = this;
//				
//				if(success){
//					_defer.done(success);
//				}
//				if(errorFunc){
//					_defer.fail(errorFunc);
//				}
//				
//				window.plugins.directoryListing.getDirectoryStructure(
//					directoriesToParse,
//					function(dirStruct){
//						
//						self.directoryStructure = dirStruct;
//						
//						if (!success){
//							logger.info("[getDirectoryStructure] finished: " + JSON.stringify(dirStruct));//debug
//						}
//						_defer.resolve(instance);
//					}, 
//					function(e){
//						if (!errorFunc){
//							logger.error("ERROR [getDirectoryStructure]: " + e);
//						}
//						_defer.fail(e);
//					}
//				);
//				
//				return _defer.promise();
			}
		    
		    /** #@- */
		    
		    /**
		     * Set to "backwards compatibility mode" (for pre version 2.0).
		     * 
		     * This function re-adds deprecated and removed functions and
		     * properties to the CommonUtils instance.
		     * 
		     * NOTE that once set to compatibility mode, it cannot be reset to
		     * non-compatibility mode.
		     * 
		     * @async
		     * @depends jQuery.Deferred
		     * @depends mmir.CommonUtils.setToCompatibilityModeExtension
		     * 
		     * @param {Function} [success]
		     * 				a callback function that is invoked, after compatibility mode
		     * 				was set (alternatively the returned promise can be used).
		     * @returns {jQuery.Promise}
		     * 				a Deffered.promise that is resolved, after compatibility mode
		     * 				was set
		     * 
		     * @see mmir.CommonUtils.setToCompatibilityModeExtension
		     * 
		     */
		    , setToCompatibilityMode : function(success) {
		    	
		    	var defer = $.Deferred();
		    	if(success){
		    		defer.always(success);
		    	}
		    	
		    	require(['commonUtilsCompatibility'],function(setCompatibility){
		    		
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
