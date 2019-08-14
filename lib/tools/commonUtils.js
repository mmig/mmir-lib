
define(['mmirf/resources','mmirf/util/deferred','mmirf/util/loadFile','mmirf/util/isArray','mmirf/paramsParseFunc','mmirf/logger', 'module', 'require'],
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
	 * @requires Resources (optionally: jQuery)
	 * @requires mmir.SemanticInterpreter (in {@link mmir.CommonUtils#loadCompiledGrammars})
	 *
	 * @requires util/isArray
	 * @requires util/deferred	 in #loadImpl, #loadDirectoryStructure, #setToCompatibilityMode
	 * @requires util/loadFile	 in #loadDirectoryStructure
	 *
	 *
	 * @example var isList = mmir.CommonUtils.isArray(list);
	 *
	 */
	function(
		resources, deferred, loadFile, _isArray, paramsParseFunc, Logger, module, require
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
	 * @private
	 * @type Logger
	 * @memberOf mmir.CommonUtils#
	 */
	var _conf = module.config(module);

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
	 * Constructor-Method of Class {@link mmir.CommonUtils}
	 *
	 * @param {Resources} res
	 *            the resources-provider (e.g. URL for base directory etc)
	 *
	 * @constructs mmir.CommonUtils
	 * @memberOf mmir.CommonUtils#
	 * @function
	 * @private
	 */
	function constructor(res) {
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
		 * Protocol / prefix that is used URIs to indicate to load scripts via require()
		 * instead of loading via &lg;script&gt; tags:
		 *
		 * @type String
		 * @private
		 * @example
		 *
		 * mmir.util.loadScript('require://controllers/calendar', function(...
		 * ->
		 * mmir.require(['controllers/calendar'], function(...
		 */
		var reqProtocol = 'require://';

		/**
		 * RegExp for testing if URL starts with {@link #reqProtocol}
		 *
		 * @type RegExp
		 * @private
		 */
		var testReq = new RegExp('^'+reqProtocol.replace('/', '\\/'));

		// /**
		//  * Array of Directories (Strings) to parse at the starting process<br>
		//  * those directories are then accessable by the functions
		//  * {@link mmir.CommonUtils#listDir}
		//  *
		//  * TODO read from properties (implement mechanism such that
		//  * \build.settings and this refer to the same resource)
		//  *
		//  * @type Array
		//  * @private
		//  */
		// var directoriesToParse = [
		// 	"controllers",
		// 	"views",
		// 	"models",
		// 	"config",
		// 	"helpers"
		// ];

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
				var basePath = res.getBasePath();

				if(basePath){
					//helper: check if string starts with basePath (case-sensitive)
					var re = new RegExp('^'+basePath);
					if (re.test(pathname)) {
						pathname = pathname.substring(basePath.length);
					}
				}

				if (pathname.indexOf("file://") !== -1) {
					pathname = pathname.replace("file://", "");
				}
				if (pathname[pathname.length - 1] === "/") {
					pathname = pathname.substring(0, pathname.length - 1);
				}
				if (pathname[0] !== "/") {
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
			 * Protocol / prefix that is used URIs to indicate to load scripts via require()
			 * instead of loading via &lg;script&gt; tags:
			 *
			 * @type String
			 * @private
			 * @example
			 * mmir.util.loadScript('require://controllers/calendar', function(...
			 * ->
			 * mmir.require(['controllers/calendar'], function(...
			 */
			requireProtocol: reqProtocol,

			/**
			 * Checks <code>uri</code> for "require://" protocol:
			 *
			 * If require-protocol, does <code>require()</code> the resource
			 * <pre>
			 * "require://controller/application" -> require('controller/application')
			 * </pre>
			 *
			 * Otherwise loads as URL via {@link #getLocalScript}.
			 *
			 * @function
			 * @async
			 * @param {String} uri
			 *            the URI for the script: either require-recouse or file path/URL
			 * @param {Function}
			 *            success success callback function
			 * @param {Function}
			 *            fail fail callback function
			 *
			 * @see #getLocalScript
			 * @memberOf mmir.CommonUtils.prototype
			 */
			loadScript : function(uri, success, fail) {

				if(testReq.test(uri)){
					var reqUri = uri.substring(reqProtocol.length);
					if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
						try {
							var expModule = __webpack_require__(reqUri);
							if(success){
								setTimeout(function(){success.call(instance, expModule)}, 0);
							} else {
								logger.debug('CommonUtils', 'loadScript', 'Successfully required script from ' + uri);
							}
						} catch(e) {
							if(fail){
								setTimeout(function(){fail.call(instance, e)}, 0);
							} else {
								logger.error('CommonUtils', 'loadScript', 'Requiring script failed for "' + uri + '"', e);
							}
						}
						return;
					} else {
						require([reqUri],
							function(expModule){success? success.call(instance, expModule) : logger.debug('CommonUtils', 'loadScript', 'Successfully required script from ' + uri)},
							function(err){fail? fail.call(instance, err) : logger.error('CommonUtils', 'loadScript', 'Requiring script failed for "' + uri + '"', e)}
						);
						return;
					}
				}

				return this.getLocalScript(uri, success, fail);
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
				var files = instance.listDir(generatedGrammarsPath, /^.*\.js$/ig);//get *.js files
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
			 * @returns {Promise} a deferred promise (see loadImpl())
			 *
			 * @requires mmir.SemanticInterpreter (must be loaded as dependency "mmirf/semanticInterpreter" at least once before this function is loaded)
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
						// "file name" for webpack is "mmirf/grammar/<grammar ID>", otherwise the file-name is "<grammar ID>_grammar.js"
						var m = (typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? /\/([^/]+)$/ : /^([^_]+)/).exec(grammarFileName);
						if (m) {
							var id = m[1];
							if(ignoreGrammarIds){
								for(var p in ignoreGrammarIds){
									if(ignoreGrammarIds.hasOwnProperty(p) && ignoreGrammarIds[p] == id){
										return true;
									}
								}
							}
							return require('mmirf/semanticInterpreter').hasGrammar(id);
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
			 * 				NOTE: if <tt>isSerial</tt> is <tt>false</tt>, libraries with lower indices in the list may
			 * 				      still be loading, when later entries are checked with this callback. In consequence,
			 * 				      the "is already loaded"-check may not be accurate, in case parallel loading is
			 * 				      used and the library-list contains "duplicate" entries.
			 * @param {Function} [statusCallback]
			 * 				If provided, this function is invoked, when a library was loaded loaded (INFO) or an
			 * 				error occurs.
			 * 				The signature for the callback is
			 * 				<code>statusCallback(String statusLevel, String fileName, String message, [result])</code>
			 * 				where <tt>statusLevel</tt> is one of <tt>info, warning, error</tt>,
			 * 				      <tt>fileName</tt> is the file-name for the library that this status message concerns, and
			 * 				      <tt>message</tt> is a message text with details concerning the status, and OPTIONALLY
			 * 				      <tt>result</tt> is the result (may be undefined if no result is returned; the actual value may depend on the execution environment)
			 *
			 * @returns {Promise} a deferred promise that will be fulfilled when loadImpl() has finished.
			 *
			 * @async
			 * @public
			 * @memberOf mmir.CommonUtils.prototype
			 */
			loadImpl: function (librariesPath, isSerial, completedCallback, checkIsAlreadyLoadedFunc, statusCallback){

				var _defer = deferred();

				if(completedCallback){
					_defer.then(completedCallback, completedCallback);
				}

				var isIds = false;//<- interpret file-entries as IDs (or as file-names, i.e. "as-is")
				var theFileList;
				if(typeof librariesPath === 'string'){
					theFileList = instance.listDir(librariesPath, /\.js$/ig);//get *.js files
					if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
						isIds = true;
						librariesPath = reqProtocol;
						theFileList = theFileList.map(function(file){ return file.replace(/\.js$/ig, '')});
					} else {
						isIds = true;
						theFileList = theFileList.map(function(file){
							var m;
							if(m = /^mmirf\/(.+)\/([^/]+)$/.exec(file)){
								return reqProtocol + librariesPath + m[2].replace(/\.js$/ig, '');
							} else {
								return librariesPath + file;
							}
						});
						librariesPath = '';
					}
				}
				else {
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

					//handler that is invoked after file has been processed (loaded or omitted):
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

						//ASSERT: all entries of the file-list are DONE -> trigger completedCallback by resolving deferred
						_defer.resolve();
					};

					var displayFileName = fileName;
					if(isIds){
						displayFileName = fileName.replace(/^.+\//, '');
					}

					if ( checkIsAlreadyLoadedFunc && checkIsAlreadyLoadedFunc(displayFileName) ){

						if(statusCallback){
							statusCallback('warning', displayFileName, 'already loaded ' + librariesPath+displayFileName);
						}

						handleScriptDone();

					} else {

						instance.loadScript(librariesPath + fileName,
							function(result){

								if(statusCallback){
									statusCallback('info', displayFileName, 'done loading ' + librariesPath+displayFileName, result);
								}

								handleScriptDone();
							},
							function(exception) {

								if(statusCallback){
									statusCallback('error', displayFileName, 'could not load "' + librariesPath+displayFileName + '": ' + exception);
								}
								else {
									// print out an error message
									logger.error('[loadImpl] Could not load "' + librariesPath+displayFileName + '": ', exception);
								}

								//NOTE: in case of an error, will still try to load the other files from the list:

								handleScriptDone();
							}
						);//END: localScript(callbacks)
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

				return _defer;
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
			 *
			 * Similar to the jQuery.getScript() function - appending a &lt;script&gt;
			 * element for javascript-source to the header of the main document.
			 *
			 * The success-callback is invoked if the script was
			 * successfully loaded, otherwise the fail-callback.
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
				script.onload = function(evt) {
					if(success){
						success.call(instance, evt);
					} else {
						logger.debug('CommonUtils', 'getLocalScript', 'Successfully loaded script from ' + scriptUrl)
					}
				};
				script.onerror = function(e) {
					if(fail){
						fail.call(instance, e);
					} else {
						logger.error('CommonUtils', 'getLocalScript', 'Loading script failed for "' + scriptUrl + '"', e);
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
				return _isArray(object);
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
			 * The returned "dictionary" has the following functions:
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

				if(!navigator.connection || !navigator.connection.type || typeof Connection === 'undefined'){
					if(logger.isInfo()) logger.info('Cannot use Cordova plugin network-information for checking network status: object navigator.connection is not available');
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
				var _defer = deferred();
				var self = this;

				if(success || errorFunc){
					_defer.then(success, errorFunc);
				}

				if(_conf && _conf.directories){
					setTimeout(function(){
						if(logger.isVerbose()) logger.verbose("DirectoryListing.getDirectoryStructure: loaded from module.config().directories");
						self.directoryStructure = _conf.directories;
						if(logger.isVerbose()) logger.verbose("[getDirectoryStructure] finished.");
						_defer.resolve(self);
					}, 0);
					return _defer;/////////////////// EARLY EXIT //////////////////////
				}

				var directoryFileUrl = res.getDirectoriesFileUrl();

				//load configuration file asynchronously:
				loadFile({
					async: true,
					dataType: "json",
					url: directoryFileUrl,
					success: function(data){
						if(logger.isVerbose()) logger.verbose("DirectoryListing.getDirectoryStructure: loaded file from "+directoryFileUrl);

						if(data){
							if(logger.isVerbose()) logger.verbose("DirectoryListing.getDirectoryStructure: Succeeded to load directory structure from '"+directoryFileUrl+"'! Data: "+ JSON.stringify(data));

							self.directoryStructure = data;

							if(logger.isVerbose()) logger.verbose("[getDirectoryStructure] finished.");

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

				return _defer;
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

		};// END: return {...

	}// END: constructor()


	instance = new constructor(resources);

	return instance;



});
