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





define(['mmirf/dictionary', 'mmirf/controller', 'mmirf/constants', 'mmirf/commonUtils', 'mmirf/util/deferred', 'mmirf/logger', 'module' ],

	/**
	 * A class for managing the controllers of the application. <br>
	 * It's purpose is to load the controllers and their views / partials and provide functions to find controllers or
	 * perform actions or helper-actions.
	 *
	 * This "class" is structured as a singleton - so that only one instance is in use.<br>
	 *
	 *
	 * @class
	 * @name mmir.ControllerManager
	 * @static
	 *
	 */
	function(
		Dictionary, Controller, constants, commonUtils, deferred, Logger, module
){
	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope mmir.ControllerManager.prototype */


	/**
	 * The logger for the ControllerManager.
	 *
	 * @private
	 * @memberOf mmir.ControllerManager
	 */
	var logger = Logger.create(module);//initialize with requirejs-module information

	/**
	 * Initialize ControllerManager:
	 *
	 * Load all Controllers from /controller
	 * that are specified in /config/directories.json
	 *
	 * @function
	 * @param {Function} [callback] OPTIONAL
	 * 				an optional callback that will be triggered after the controllers where loaded
	 * @param {Object} [ctx] OPTIONAL
	 * 				the context for the controller & helper implementations (DEFAULT: the global context, i.e. window)
	 * @returns {Promise}
	 * 				a Deferred promise that will get fulfilled when controllers are loaded
	 * @private
	 *
	 * @memberOf mmir.ControllerManager#
	 */
	function _init(callback, ctx, _instance, ctrlList) {

		//shift arguments if necessary:
		if(!ctx && typeof callback !== 'function'){
			ctx = callback;
			callback = void(0);
		}

		//set ctx to global/window, if not already set:
		ctx = ctx || (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this);

		//create return value
		var defer = deferred();
		if(callback){
			defer.then(callback, callback);
		}


		/**
		 * HELPER FUNC: remove file extension from file-name
		 * @private
		 *
		 * @memberOf mmir.ControllerManager#
		 */
		function removeFileExt(fileName){
	    	return fileName.replace(/\.[^.]+$/g,'');
	    }
		/**
		 * HELPER FUNC: convert first letter to upper case
		 * @private
		 *
		 * @memberOf mmir.ControllerManager#
		 */
	    function firstToUpperCase(name){
	    	return name[0].toUpperCase()+name.substr(1);
	    }

	    /**
		 * HELPER FUNC: add file path for generated / compiled view-element
		 *              if it exists.
		 *
		 * @param {String} genDirPath
		 * 				path the the directory, where the file for the generated view-element
		 * 				is potentially located (generated file may not exists)
		 *
		 * @param {PlainObject} infoObj
		 * 				the info-object for the view-element. MUST HAVE property <code>name</code>!
		 *
		 * @param {String} [fileNamePrefix] OPTIONAL
		 * 				prefix for the file-name, e.g. in case of Partials, the file-name would be:
		 * 				<code>fileNamePrefix + infoObj.name</code> (+ file-extension)
		 *
		 * @returns {PlainObject}
		 * 				the info-object: if a path for the generated file exists,
		 * 				a property <code>genPath</code> (String) with the path as value is added.
		 * @private
		 *
		 * @memberOf mmir.ControllerManager#
		 */
		function addGenPath(genDirPath, infoObj, fileNamePrefix){

			if(infoObj.genPath){
				return infoObj;
			}

			var prefix = fileNamePrefix? fileNamePrefix : '';
			var filter = prefix + infoObj.name + '.js';
			var path = genDirPath + '/';
			if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
				path = '';
				filter = new RegExp('^mmirf/view/[^/]+/'+filter+'$', 'i');
			}
			var genPath = commonUtils.listDir(genDirPath, filter);
			if(genPath && genPath.length > 0){
				infoObj.genPath = path + genPath[0];
			}

			return infoObj;
		}

			/**
		 * HELPER FUNC: parse file list and extract info for view/partial/layout/helper.
		 *
		 * @param {String} dirPath
		 * 				path the the directory, where the (source) file is located,
		 * 				e.g. eHTML template or JS helper implementation
		 *
		 * @param {String} genDirPath
		 * 				path the the directory, where the file for the generated view-element
		 * 				is potentially located (generated file may not exists)
		 *
		 * @param {QueryFilter} queryFilter
		 * 				the filter for querying (i.e. filtering) <code>commonUtils.listDir()</code>:
		 * 					queryFilter.nameStart: {String} an regular expression that the file-name must match (or empty string, if all file-names should match)
		 * 					queryFilter.ext: {String} the file-extension that should match, with dot e.g. "js" or "ehtml"
		 *
		 * @param {String} [removeNamePrefix] OPTIONAL
		 * 				prefix of the file-name which should be removed when extracting the InfoObj.name, e.g. in case of Partials:
		 * 				<code>removeFileExt(fileName) === removeNamePrefix + infoObj.name</code> (+ file-extension)
		 *
		 * @param {RegExp} [regExpFileFilter] OPTIONAL
		 * 				regular expression for filtering the fileList, i.e. only files that match the expression will be
		 * 				included in the returned list of FileInfo objects
		 *
		 * @returns {Array<FileInfo>}
		 * 				list of file-info objects:
		 * 					FileInfo.name: {String} the name that will be used to identify the resource
		 * 					FileInfo.path: {String} the path to the source file, e.g. for loading the resource
		 * 					FileInfo.genPath: {String} the path to generated/executable resource
		 * @private
		 *
		 * @memberOf mmir.ControllerManager#
		 */
		 function processFileList(dirPath, genDirPath, queryFilter, removeNamePrefix, regExpFileFilter){

					if(removeNamePrefix && typeof removeNamePrefix === 'object'){
						regExpFileFilter = removeNamePrefix;
						removeNamePrefix = '';
					} else {
						removeNamePrefix = removeNamePrefix || '';
					}

					var isSourceList = true;
					var queryFileName = queryFilter.nameStart? '^' + queryFilter.nameStart + '.*' : '';
					var fileList = commonUtils.listDir(dirPath, new RegExp(queryFileName + '\\.' + queryFilter.ext + '$', 'i'));
					var wpBuild = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD;
					if(!fileList){
						// -> query gen-dir instead
						isSourceList = false;
						if(wpBuild){
							//NOTE in webpack build the entry is not a file-name, but a module ID, like "mmirf/view/application/login.js"
							queryFileName = queryFilter.nameStart? '^mmirf/view/[^/]+/' + queryFilter.nameStart + '[^/]*' : '';;
						}
						//NOTE file-extension in gen-dir is always .js
						fileList = commonUtils.listDir(genDirPath, new RegExp(queryFileName+ '\\.js$', 'i'));
					}

					var infoList = [], entry, name;
					if (fileList != null) {
					  for (var i = 0, size = fileList.length; i < size; ++i) {
					    entry = fileList[i];
						if(!regExpFileFilter || regExpFileFilter.test(entry)){
							name = removeFileExt(!removeNamePrefix? entry : entry.replace(removeNamePrefix, ''));
							infoList.push(addGenPath(genDirPath, {
							  name: wpBuild? name.replace(/^.*\//, '') : name,													//<- in webpack build: remove everything from ID (i.e. the name) except for the last segement
							  path: isSourceList? (wpBuild? entry : dirPath + '/' + entry) : null,
							  genPath: isSourceList? null : (wpBuild? entry : genDirPath + '/' + name)	//<- in webpack build the genPath is the module ID, otherwise it's the path to the generated file
							}, removeNamePrefix));
						}
					  }
					}
					return infoList;
			}

			/**
			 * HELPER get first entry from FileInfo list and transform its name (i.e. so that first letter is upper case)
			 *
			 * @param  {[type]} infoList the list of FileInfo objects
			 * @param  {String} type the type of resources listed in infoList, e.g. "layout" or "helper"
			 * @return {FileInfo} the first FileInfo object or NULL
			 */
			function getFirstInfo(infoList, type){
				var len = infoList.length;
				if(len > 1){
					logger.warn('Invalid number of '+type+': only 1 is allowed, using first of list ...');
				}
				if(len >= 1){
					var info = infoList[0];
					info.name = firstToUpperCase(info.name);
					return info;
				}
				return null;
			}

		/**
		 * This function gets the controller file names and builds a JSON object containing information about
		 * the location, file name etc. for the controller itself, its views, partials, layout, and helper.
		 *
		 * @function
		 * @param {String} controllerName
		 * 					the name of the Controller (must start with an upper case letter).
		 * @param {String} controllerPath
		 * 					the path (URL) where the file with the Controller's implementation
		 * 					is located (according to information in file <code>/config/directories.json</code>,
		 * 					i.e. {@link mmir.CommonUtils#getDirectoryStructure})
		 * @returns {JSON} JSON-Object containing information about the controller,
		 * 				its views, partials, and paths etc.
		 * @private
		 *
		 * @example
		 * //EXAMPLE for returned object:
		 * {
		 *   "fileName": "application",
		 *   "name": "Application",
		 *   "path": "controllers/application.js",
		 *   "views": [
		 *     {
		 *       "name": "login",
		 *       "path": "views/application/login.ehtml",
		 *       "genPath": "gen/views/application/login.js"
		 *     },
		 *     {
		 *       "name": "registration",
		 *       "path": "views/application/registration.ehtml",
		 *       "genPath": "gen/views/application/registration.js"
		 *     },
		 *     {
		 *       "name": "welcome",
		 *       "path": "views/application/welcome.ehtml",
		 *       "genPath": "gen/views/application/welcome.js"
		 *     }
		 *   ],
		 *   "partials": [
		 *     {
		 *       "name": "languageMenu",
		 *       "path": "views/application/~languageMenu.ehtml",
		 *       "genPath": "gen/views/application/~languageMenu.js"
		 *     }
		 *   ],
		 *   "helper": {
		 *     "name": "ApplicationHelper",
		 *     "path": "helpers/applicationHelper.js",
		 *     "genPath": "helpers/applicationHelper.js"
		 *   },
		 *   "layout": {
		 *     "name": "application",
		 *     "path": "views/layouts/application.ehtml",
		 *     "genPath": "gen/views/layouts/application.js"
		 *   }
		 * }
		 * //NOTE: layout and helper may be NULL
		 *
		 * @requires mmir.CommonUtils
		 * @requires mmir.Constants
		 *
		 * @memberOf mmir.ControllerManager#
		 */
	    function getControllerResources(controllerName, controllerPath){

				var partialsPrefix = commonUtils.getPartialsPrefix();
			 var controllerFilePath = controllerPath + controllerName;

			 var rawControllerName= removeFileExt(controllerName);
			 controllerName = rawControllerName;

			 var viewsPath = constants.getViewPath() + controllerName;
			 var genViewsPath = constants.getCompiledViewPath() + controllerName;

			 controllerName = firstToUpperCase(controllerName);

			 var viewsList = processFileList(viewsPath, genViewsPath, {nameStart: '(?!'+partialsPrefix+')', ext: 'ehtml'});

			 var partialsInfoList = processFileList(viewsPath, genViewsPath, {nameStart: partialsPrefix, ext: 'ehtml'}, partialsPrefix);

			 var helpersPath = constants.getHelperPath().replace(/\/$/, '');//<- remove trailing slash;
			 var helperSuffix = constants.getHelperSuffix();
			 var reStartPattern = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? '^mmirf/helper/' : '^';
			 var reHelpersFileName = new RegExp(reStartPattern+controllerName+helperSuffix+'\.js$', 'i');
			 var helpersList = processFileList(helpersPath, helpersPath, {nameStart: '', ext: 'js'}, reHelpersFileName);
			 var helperInfo = getFirstInfo(helpersList, 'helper');

			 var layoutsPath = constants.getLayoutPath().replace(/\/$/, '');//<- remove trailing slash
			 var layoutGenPath = constants.getCompiledLayoutPath().replace(/\/$/, '');//<- remove trailing slash
 			 var reStartsWithCtrl = new RegExp('^'+controllerName, 'i');
			 var layoutsList = processFileList(layoutsPath, layoutGenPath, {nameStart: '(?!'+partialsPrefix+')', ext: 'ehtml'}, reStartsWithCtrl);
			 var layoutInfo = getFirstInfo(layoutsList, 'layout');


			 var ctrlInfo = {
				 fileName: rawControllerName,
				 name:     controllerName,
				 path:     controllerFilePath,

				 views:    viewsList,
				 partials: partialsInfoList,
				 helper:   helperInfo,
				 layout:   layoutInfo
			 };

	    	// //TEST compare info with "reference" result from original impl.:
	    	// var test = {
				// 	application: '{"fileName":"application","name":"Application","path":"controllers/application","views":[{"name":"login","path":"views/application/login.ehtml"},{"name":"registration","path":"views/application/registration.ehtml"},{"name":"welcome","path":"views/application/welcome.ehtml"}],"partials":[{"name":"languageMenu","path":"views/application/~languageMenu.ehtml"}],"helper":null,"layout":null}',
				// 	calendar: '{"fileName":"calendar","name":"Calendar","path":"controllers/calendar","views":[{"name":"create_appointment","path":"views/calendar/create_appointment.ehtml"}],"partials":[],"helper":null,"layout":null}'
				// };
	    	// var isEqual = (JSON.stringify(ctrlInfo) === test[ctrlInfo.fileName]);
	    	// console[isEqual? 'info':'error']('compliance-test: isEual? '+  isEqual);
				// console.log(' ######## ctrlInfo -> ', JSON.stringify(ctrlInfo));

				return ctrlInfo;
		};

		/**
		 * HELPER create the controller instance after its implementation was loaded/is available in ctx or via argument res
		 *
		 * After the controller instance was initialized, it is added to ctrlList (with its name as key)
		 *
		 * @param  {[type]} fileName the name of the controller's file: application.js -> Controller<Appliction>
		 * @param  {any|Function} res the result of loading the controller implementation, i.e. its constructor function; if undefined, the constructor must be available in ctx in ctx[<controller name>]
		 *
		 * @memberOf mmir.ControllerManager#
		 */
		function createCtrlInstance(fileName, res){

			var ctrlInfo = getControllerResources(fileName, constants.getControllerPath());

			var constr = ctx[ctrlInfo.name];

			//FIXME HACK for handling exported constructor
			if(typeof res === 'function' && res.name === ctrlInfo.name){
				constr = res;
			}

			var controller = new Controller(ctrlInfo.name, ctrlInfo, constr);

			if(ctrlInfo.helper){
				var helperPath = ctrlInfo.helper.path;
				var helperName = ctrlInfo.helper.name;
				controller.loadHelper(helperName,helperPath, ctx);
			}

			ctrlList.put(controller.getName(), controller);

			logger.info('[loadController] "'+fileName+'" loaded.');
		};

		commonUtils.loadImpl(


				constants.getControllerPath(),

				false,

				function () {

					console.info( '[loadControllers] done' );

					defer.resolve(_instance);
				},

				function isAlreadyLoaded (name) {

					if(typeof ctx[name] === 'function' && ctx[name].name === firstToUpperCase(name)){
						//controller implementation was already loaded -> immediately create controller instance
						if(logger.isVerbose()) logger.v("already loaded implementation for "+name+", creating instance...");//debug
						createCtrlInstance(name, ctx[name]);
						return true;
					}
					return false;

				},

				function callbackStatus(status, fileName, msg, res) {
					if(status==='info'){

						createCtrlInstance(fileName, res);
					}
					else if(status==='warning'){
						logger.warn('[loadController] "'+fileName+'": '+msg);
					}
					else if(status==='error'){
						logger.error('[loadController] "'+fileName+'": '+msg);
					}
					else{
						logger.error('[loadController] '+status+' (UNKNOWN STATUS) -> "'+fileName+'": '+msg);
					}
				}

		);

		return defer;

	};

	/**
	 * Array of controller-instances
	 *
	 * @type Dictionary
	 * @private
	 *
	 * @memberOf mmir.ControllerManager#
	 */
	var _create = function(){

		// private members
		/**
		 * Array of controller-instances
		 *
		 * @type Dictionary
		 * @private
		 *
		 * @memberOf mmir.ControllerManager#
		 */
		var controllers = new Dictionary();

		/**
	     * Object containing the instance of the class {@link mmir.ControllerManager}
	     *
	     * @type Object
	     * @private
		 * @augments mmir.ControllerManager
		 * @ignore
	     */
		var _instance = {
			/** @scope mmir.ControllerManager.prototype *///for jsdoc2

			// public members

			/**
			 * This function gets the controller by name.
			 *
			 * @function
			 * @param {String} ctrlName Name of the controller which should be returned
			 * @returns {Object} controller if found, null else
			 * @public
			 * @memberOf mmir.ControllerManager.prototype
			 */
			get: function(ctrlName){
				var ctrl = controllers.get(ctrlName);
				if(!ctrl){
					return null;
				}
				return ctrl;
			},


			/**
			 * This function returns names of all loaded controllers.
			 *
			 * @function
			 * @returns {Array<String>} Names of all loaded controllers
			 * @public
			 * @memberOf mmir.ControllerManager.prototype
			 */
			getNames: function(){

				return controllers.getKeys();
			},


			/**
			 * This function performs an action of a controller.
			 *
			 * @function
			 * @param {String} ctrlName Name of the controller to which the action belongs
			 * @param {String} actionName Name of the action that should be performed
			 * @param {Object} data optional data that can be submitted to the action
			 * @returns {Object} the return object of the performed action
			 * @public
			 * @memberOf mmir.ControllerManager.prototype
			 */
			perform: function(ctrlName, actionName, data){
				var ctrl = this.get(ctrlName);
				if (ctrl != null) {
					return ctrl.perform(actionName, data);
				}
				else {
					console.error('ControllerManager.perform: the controller could not be found "'+ctrlName+'"');
				}
			},


			/**
			 * This function performs an action of a helper-class for a controller.
			 *
			 * @function
			 * @param {String} ctrlName Name of the controller to which the helper action belongs
			 * @param {String} actionName Name of the action that should be performed by the helper
			 * @param {Object} data optional data that can be submitted to the action
			 * @returns {Object} the return object of the performed action
			 * @public
			 * @memberOf mmir.ControllerManager.prototype
			 */
			performHelper: function(ctrlName, actionName, data) {

				var ctrl = this.get(ctrlName);
				if (ctrl != null) {
					if(arguments.length > 3){
						return ctrl.performHelper(actionName, data, arguments[3]);
					}
					else {
						return ctrl.performHelper(actionName, data);
					}
				}
				else {
					console.error('ControllerManager.performHelper: the controller could not be found "'+ctrlName+'"');
				}
			},
			/**
			 * This function must be called before using the {@link mmir.ControllerManager}. The Initialization process is asynchronous,
			 * because javascript-files must be loaded (the controllers).
			 * To ensure that the ControllerManager is initialized, a callback can be used, or the returned
			 * <em>Promise</em> (i.e. a "then-able" object) for code, that relies
			 * on the presence of the loaded controllers.<br>
			 *
			 *
			 * <div class="box important">
			 * <b>Note:</b>
			 * The callback function should be used for code, that requires the prior loading of the controllers.<br>
			 * The callback mechanism is necessary, because loading the controllers is asynchronous.<br><br>
			 * If provided, the callback function is invoked with 1 argument, the ControllerManager instance:<br>
			 * <code> callbackFunction(controllerManagerInstance) </code>
			 * </div>
			 *
			 * @function
			 *
			 * @param {Function} [callback] OPTIONAL
			 * 				an optional callback that will be triggered after the controllers where loaded
			 * @param {Object} [ctx] OPTIONAL
			 * 				the context for the controller & helper implementations (DEFAULT: the global context, i.e. window)
			 * @returns {Promise}
			 * 				a deferred promise that will get fulfilled when controllers are loaded
			 * @example
			 *  //recommended style:
			 *  mmir.require(['mmirf/controllerManager', ...], function(controllerManager, ...) {
			 *  	controllerManager.init().then(function(theInitializedControllerInstance){
			 *  		...
			 *  	});
			 *  })
			 *
			 *  //old style:
			 * 	function afterLoadingControllers(controllerManagerInstance){
			 * 		var appCtrl = controllerManagerInstance.get('Application');
			 * 		//do something...
			 * 	}
			 * 	mmir.ctrl.init(afterLoadingControllers);
			 * @public
			 * @memberOf mmir.ControllerManager.prototype
			 */
			init: function(callback, ctx){
				return _init(callback, ctx, _instance, controllers);
			},
			_create: _create

		};

		/**@ignore*/
		return _instance;
	};


	return _create();
});
