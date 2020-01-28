(
/**
 * Main module / namespace for the MMIR framework.
 *
 * On initialization, a global module <code>window.mmir</code> is created.
 *
 * If called multiple times, the existing module instance is returned.
 *
 * If a function <code>require</code> exists, the module tries to registers itself
 * according to the <em>RequireJS</em> interface (using the default as its module name, i.e. "mmirf/core").
 *
 * @name mmir
 * @export initMmir as mmir
 * @class
 * @namespace
 *
 * @returns the module instance <code>mmir</code>
 *
 */
function initMmir(globalCtx) {

	var moduleConfigHelper = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? require('build-tool/module-config-helper') : null;

	/**
	 * the name of the global variable which will hold the core-module
	 * @memberOf mmir.internal
	 * @private
	 */
	var coreName = typeof MMIR_CORE_NAME === 'string'? MMIR_CORE_NAME : 'mmir';
	// temp variable for global mmir instance
	var mmirGlobal = globalCtx[coreName];

	if(mmirGlobal){

		//if globalCtx[coreName] is the core-module: register it and return
		//(note: if it is not the core-module, its properties will be merged/copied to the core-module -> see below)
		if(typeof mmirGlobal.startModule === 'string' && typeof define === 'function'){
			define(function(){ return mmirGlobal; });
			return mmirGlobal;
		}
	}

	/**
	 * the version of mmir-lib
	 *
	 * @memberOf mmir.internal
	 * @private
	 */
	var CORE_VERSION = "5.2.0";


	/**
	 * STATE: state variable for indicating "doc is already loaded" (this needs to be set/reset manually)
	 * @memberOf mmir.internal
	 * @private
	 */
	var _isReady = false;
	/**
	 * @memberOf mmir.internal
	 * @private
	 */
	var _funcList = [];
	/**
	 * @memberOf mmir.internal
	 * @private
	 */
	function dequeue () { return _funcList.shift(); };
	/**
	 * @memberOf mmir.internal
	 * @private
	 */
	function isEmpty () { return _funcList.length === 0; };
	/**
	 * @param {Function} [func] OPTIONAL
	 *			if func is present, func will be used instead of dequeueing a callback from the queue
	 * @memberOf mmir.internal
	 * @private
	 */
	function deqExec (func) {
		if(!func){
			func = dequeue();
		}

		//run function in context of the document (with library reference as argument)
		func.call(mmir);
	};


	/**
	 * HELPER apply requirejs configuration
	 *
	 * @param {PlainObject} [configuration]
	 *			the requirejs configuration value
	 * @param {requirejs} [reqInstance] OPTIONAL
	 * 			the requirejs instance, with attached <code>config</code> function
	 * @memberOf mmir.internal
	 * @private
	 */
	function _reqConfig (configuration, reqInstance) {
		var req = reqInstance? reqInstance : (mmir && mmir.require? mmir.require : null);
		if(configuration){
			if(!req || !req.config){
				req = typeof requirejs !== 'undefined'? requirejs : (typeof WEBPACK_BUILD === 'undefined' || !typeof WEBPACK_BUILD) && typeof require !== 'undefined'? require : req && req('requirejs');
			}
			return req.config(configuration) || req;
		}
		return req;
	};

	/**
	 * STATE: state variable for indicating "configs for requirejs are already applied"
	 * @memberOf mmir.internal
	 * @private
	 */
	var _isApplied = false;
	/**
	 * @memberOf mmir.internal
	 * @private
	 */
	var _configList = [];
	/**
	 * Applies all <code>config</code>s (that were added by
	 * {@link mmir.config}) to the requirejs instance.
	 *
	 * @param {PlainObject} mainConfig
	 * 			the main configuration for the framework
	 * 			(this is used as reference for merging config options if necessary - see also mainConfig.js)
	 *
	 * @memberOf mmir.internal
	 * @private
	 *
	 * @see #mergeModuleConfigs
	 */
	function applyConfigs(mainConfig, reqInstance){

		if(typeof require === 'undefined' && !moduleConfigHelper){
			return;
		}


		_isApplied = true;
		var conf;
		var confConfig, p;
		while(_configList.length > 0){

			conf = mergeModuleConfigs(_configList.shift(), mainConfig);

			//copy/remember all conf.config values that were not merged
			if(conf.config){
				for(p in conf.config){
					if(conf.config.hasOwnProperty(p) && typeof conf.config[p] !== 'undefined'){
						if(!confConfig){
							confConfig = {};
						}
						confConfig[p] = conf.config[p];
					}
				}
			}

			if(!moduleConfigHelper){
				for(p in conf){
					if(p === 'config'){
						continue;
					}
					if(mainConfig[p] && typeof mainConfig[p] === 'object'){
						for(var n in conf[p]){
							mainConfig[p][n] = conf[p][n];
						}
					} else {
						mainConfig[p] = conf[p];
					}
				}
			}
		}

		//if there were non-merged conf.config-values:
		//   we cannot just apply these, since they would overwrite the mainConfig.config
		//   -> so we copy all (possibly) merged values from the mainConfig.config over
		//      and then apply all the conf.config-values at once here
		if(confConfig){

			for(p in mainConfig.config){
				if(mainConfig.config.hasOwnProperty(p) && typeof mainConfig.config[p] !== 'undefined'){
					confConfig[p] = mainConfig.config[p];
				}
			}

			if(moduleConfigHelper){
				moduleConfigHelper.setConfig({config: confConfig});
				return;
			}

			// replace mainConfig's config with merged & collected config-values:
			mainConfig.config = confConfig;
		}

		if(mainConfig){
			if(moduleConfigHelper){
				moduleConfigHelper.setConfig(mainConfig);
			} else {
				mmir.require = _reqConfig(mainConfig, reqInstance);
			}
		}

		return mainConfig;
	}

	/**
	 * Helper for merging additional module-configurations with the (requirejs) main-config
	 * of the framework.
	 *
	 * <p>
	 * This allows to add module configurations outside the main-configuration (otherwise:
	 * requirejs by default overwrites additional module-config settings).
	 *
	 * <p>
	 * Merge behavior: if values in <code>mainConfig.config</code> exists, the primitive values
	 * 				   are overwritten with values from <code>conf.config</code> and object-values
	 * 				   are merged (recursively). Arrays are treated as primitive values (i.e.
	 * 				   overwritten, not merged/extended).
	 *
	 * <p>
	 * Note: removes <code>conf.config</code> if present and merges the values
	 *       into <code>mainConfig.config</code>.
	 *
	 * @param {PlainObject} conf
	 * 			the additional configuration options
	 * @param {PlainObject} mainConfig
	 * 			the main configuration for the framework
	 * 			(this is used as reference for merging config options if necessary - see mainConfig.js)
	 *
	 * @return {PlainObject} the <code>conf</code> setting.
	 * 			If necessary (i.e. if <code>conf.config</code> was present), the module-configuration
	 * 			was merged with the main-configuration
	 *
	 * @memberOf mmir.internal
	 * @private
	 */
	function mergeModuleConfigs(conf, mainConfig){
		if(!mainConfig || !conf || !mainConfig.config || !conf.config || typeof mainConfig.config !== 'object' || typeof conf.config !== 'object'){
			return conf;
		}
		//ASSERT mainConfig.config and conf.config exist

		var count = 0, merged = 0;
		for(var cname in conf.config){
			if(conf.config.hasOwnProperty(cname)){

				++count;

				//merge property cname into mainConfig
				if(doMergeInto(conf.config, mainConfig.config, cname)){
					//remove merge property from conf.config
					conf.config[cname] = void(0);
					++merged;
				}
			}
		}

		//lastly: remove the conf.config property itself, if
		//        all of its properties were merged
		if(count === merged){
			conf.config = void(0);
		}

		return conf;
	}

	/**
	 * Helper for recursively merging config values from <code>conf1</code> into
	 * <code>conf2</code> (and removing merged values from <code>conf1</code>) IF
	 * an object-property <code>name</code> already exists in <code>conf2</code>.
	 *
	 * @param {PlainObject} conf1
	 * 			the configuration object from which to take values (and removing them after merging)
	 * @param {PlainObject} conf2
	 * 			the configuration object to which values are merged
	 * @param {String} name
	 * 			the name of the property in <code>conf1</code> that should be merged into <code>conf2</code>
	 * @param {Boolean} [isNotRoot] OPTIONAL
	 * 			when cursively called, this should be TRUE, otherwise FALSE
	 * 			(i.e. this should only be used in the function's internal invocation)
	 *
	 * @return {Boolean} <code>true</code> if property <code>name</code> was merged into conf2.
	 *
	 * @memberOf mmir.internal
	 * @private
	 */
	function doMergeInto(conf1, conf2, name, isNotRoot){

		var v = conf1[name];

		if(typeof conf2[name] === 'undefined' || typeof v !== typeof conf2[name] || typeof v !== 'object'){

			//if not set in conf2 OR types differ OR value is primitive:
			if( ! isNotRoot){
				//... if it is at the root-level of the config-value:
				//  let requirejs.config() take care of it (-> will overwrite value in conf2 by applying conf1)
				//  -> signal that it was not merged, and should not be removed
				return false; ////////////////////////// EARLY EXIT ////////////
			} else {
				//... if not at root-level, we must move the property over to conf2,
				//    otherwise requirejs.config() would overwrite the entire property in conf2 with the one from conf1
				//    -> move property (copy to conf2, remove from conf1)
				//    -> signal that we merge the property
				conf2[name] = v;
				conf1[name] = void(0);
				return true; ////////////////////////// EARLY EXIT ////////////
			}
		}

		//ASSERT v has type object AND conf2 has an object value too

		//-> recursively merge
		for(var cname in conf1[name]){
			if(conf1[name].hasOwnProperty(cname)){
				//merge cname into conf2
				doMergeInto(conf1[name], conf2[name], cname, true);
			}
		}

			return true;
	}

	/**
	 * Check if the version number corresponds to the most significant (right-most)
	 * part of the mmir-lib's version number, i.e. check
	 *
	 * "is <code>version</code> <code>comp</code> than the mmir-lib version?"
	 *
	 * <br>
	 * NOTE: changing the {@link mmir.version} field will have no effect on this function
	 *       (i.e. it will use the original value of <code>version</code>)
	 *
	 * @param {Number} version
	 * 			the version number to check against
	 * @param {String} [comp] OPTIONAL
	 * 			the comparison type, e.g. <code> ">" | "<" | ">=" | "<=" | "==" | "===" | "!=" | "!==" </code>
	 * 			<br>Will be used as follows: <code>{mmir-lib version} {comp} {version}</code>
	 * 			<br>DEFAULT: "==="
	 * 			<br>NOTE: "=" will be interpreted as "=="
	 *
	 * @returns {Boolean|Void} returns the result of the comparison to most the significant part
	 *                         of the mmir-lib version number,
	 *                         or <code>VOID</code> if the mmir-lib version number is not available.
	 *
	 * @memberOf mmir.internal
	 * @private
	 */
	var _isVersion = function(version, comp){

		var ver = CORE_VERSION;
		if(ver){
			var sigNum = /^.*?(\d+)\./.exec(ver);
			sigNum = parseInt(sigNum[1], 10);
			if(isFinite(sigNum)){

				switch(comp){
				case '>=':
					return sigNum >= version;
				case '<=':
					return sigNum <= version;
				case '>':
					return sigNum > version;
				case '<':
					return sigNum < version;
				case '!=':
					return sigNum != version;
				case '!==':
					return sigNum !== version;
				case '='://
				case '==':
					return sigNum == version;
				case '===':
				default:
					return sigNum === version;
				}
			}
		}
		return void(0);
	};

	//DISABLED: un-used for now
//	/**
//	 * Helper for detecting array type.
//	 *
//	 * @param {any} obj
//	 * 			the object which should be checked
//	 *
//	 * @return {Boolean} <code>true</code> if <code>obj</code> is an Array
//	 *
//	 * @memberOf mmir.internal
//	 * @private
//	 */
//	var isArray = (function(){
//		if(typeof Array.isArray === 'function'){
//			return Array.isArray;
//		}
//		else {
//			return function(arr){
//				//workaround if Array.isArray is not available: use specified result for arrays of Object's toString() function
//				Object.prototype.toString.call(arr,arr) === '[object Array]';
//			};
//		}
//	})();

	var mmir = {

			/**
			 * Set the framework to "initialized" status (i.e. will
			 * trigger the "ready" event/callbacks)
			 *
			 * <p>
			 * WARNING: use this only, if you know what
			 *          you are doing -- normally this
			 *          functions is only called once
			 *          during initialization by the
			 *          framework to signal that all
			 *          settings, classes, set-up etc
			 *          for the framework are now
			 *          initialized.
			 * <p>
			 *
			 * NOTE: this is a semi-private function that
			 *          should only be used by the initialization
			 *          process.
			 *
			 * @memberOf mmir
			 * @name setInitialized
			 * @function
			 * @private
			 */
			setInitialized : function() {

				_isReady = true;

				//apply configurations to requirejs instance:
				applyConfigs();

				//execute all callbacks in queue
				while(!isEmpty()){
					deqExec();
				}
			},

			/**
			 * Register callbacks for initialization-event of framework.
			 *
			 * If used after framework has been initialized, the callback is invoked immediately.
			 *
			 * @memberOf mmir
			 * @name ready
			 * @function
			 * @public
			 *
			 * @param {Function} func
			 * 				callback Function that will be triggered when the framework has been initialized
			 */
			ready: function(func) {

				//SPECIAL MODE: if already active, execute the callback
				//				(if queue is not empty yet: queue function call in order to preserve the execution ordering)
				if(_isReady && isEmpty()){
					deqExec(func);
				}
				else {
					_funcList.push(func);
				}
			},

			/**
			 * Set options / settings for overwriting the default
			 * configuration for RequireJS:
			 *
			 * <br>
			 * Options / configurations that are added by this
			 * method will overwrite settings specified in
			 * <code>mainConfig.js</code>.
			 *
			 * <p>
			 * NOTE: the options added here will be applied in the order
			 *       they were added, i.e. if a later option specifies
			 *       settings that were already set by a previous call,
			 *       then these later options will overwrite the earlier
			 *       ones.
			 *
			 * @memberOf mmir
			 * @name config
			 * @function
			 * @param {PlainObject} options
			 * 			options for RequireJS
			 * @public
			 *
			 * @example
			 *
			 * //IMPORTANT these calls need to done, AFTER core.js is loaded, but BEFORE require.js+mainConfig.js is loaded
			 * //(see example index.html in starter-kit)
			 *
			 * //set specific log-level for module "moduleName":
			 * mmir.config({config: { 'moduleName': {logLevel: 'warn'}}});
			 *
			 * //modify default log-levels for dialogManager and inputManager:
			 * mmir.config({config: { 'mmirf/dialogManager': {logLevel: 'warn'}, 'mmirf/inputManager': {logLevel: 'warn'}}});
			 *
			 * //... or using alternative SCXML definition for dialog-engine:
			 * mmir.config({config: { 'mmirf/dialogManager': {modelUri: 'config/states/example-view_transitions-dialogDescriptionSCXML.xml'});
			 *
			 * //overwrite module location (BEWARE: you should know what you are doing, if you use this)
			 * mmir.config({paths: {'jquery': 'content/libs/zepto'}};
			 *
			 *
			 * //add ID and location for own module (NOTE: need to omit file-extension ".js" in location! see requirejs docs):
			 * mmir.config({paths: {'customAppRouter': 'content/libs/router'}};
			 */
			config: function(options){
				if(_isApplied && typeof require !== 'undefined'){
					_reqConfig(options, this.require);
				}
				else {
					_configList.push(options);
				}
			},

			/**
			 * Applies settings that were added via
			 * {@link #config}.
			 *
			 * <p>
			 * WARNING: use this only, if you know what
			 *          you are doing -- normally this
			 *          functions is only called once
			 *          during initialization by the
			 *          framework, after the default
			 *          configuration settings for
			 *          RequireJS in <code>mainConfig.js</code>
			 *          were applied.
			 * <p>
			 *
			 * NOTE: this is a semi-private function that
			 *          should only be used by the initialization
			 *          process.
			 *
			 * @memberOf mmir
			 * @name applyConfigs
			 * @function
			 * @protected
			 */
			applyConfig: applyConfigs,

			/**
			 * @copydoc mmir.internal._isVersion
			 * @memberOf mmir
			 * @name isVersion
			 * @function
			 * @public
			 */
			isVersion: _isVersion,

			/**
			 * The name of the (this) the core module:
			 * this is also the global variable by which the core module (this) can be accessed.
			 *
			 *
			 * NOTE: changing this name here will have no affect on the name of the global variable,
			 *       instead set global variable <code>MMIR_CORE_NAME</code> before loading mmir
			 *
			 * @memberOf mmir
			 * @name mmirName
			 * @type String
			 * @default {String} "mmir"
			 * @readonly
			 * @public
			 */
			mmirName: coreName,

			/**
			 * The version of mmir-lib.
			 *
			 * @memberOf mmir
			 * @name version
			 * @type String
			 * @readonly
			 * @public
			 */
			version: CORE_VERSION,

			/**
			 * The name / ID of the RequireJS module that will
			 * be loaded, after the configuration in
			 * <code>mainConfig.js</code> was applied.
			 *
			 * <p>
			 * This module should first start-up the framework and
			 * then signal the application (via {@link mmir.setInitialized})
			 * that it is ready to be used, i.e. fully initialized now.
			 *
			 * <p>
			 * NOTE: If set to <code>undefined</code>, no module will be
			 * loaded after configuration in <code>mainConfig.js</code>
			 * was applied.
			 *
			 * @memberOf mmir
			 * @name startModule
			 * @type String
			 * @default {String} "mmirf/main" will load the module specified in /main.js
			 * @public
			 */
			startModule: 'mmirf/main',

			/**
			 * A list of names / RequireJS module IDs, that will be loaded
			 * immediately before loading/initializing the mmir library.
			 *
			 * @memberOf mmir
			 * @name startModules
			 * @type Array<String>
			 * @default {Void}
			 * @public
			 */
			startModules: void(0),

			/**
			 * Mode for vendor libraries:
			 * if "min" the minified/optimized variants (if available) for vendor libraries
			 * are used.
			 *
			 * @memberOf mmir
			 * @name libMode
			 * @type undefined | "min"
			 * @default {Void}
			 * @public
			 */
			libMode: void(0),

			/**
			 * The jQuery instance that will be used by the MMIR library.
			 *
			 * Will be automatically set, if jQuery is loaded before the MMIR library initializes
			 * (or can be manually set, before the MMIR library initializes).
			 *
			 * If jQuery is present, the MMIR library will utilize its implementation for some
			 * utility functions (otherwise alternative, internal utiltiy implemenations will be used).
			 *
			 * NOTE: changing this field after the MMIR library has initialized will have no effect.
			 *
			 *
			 * @memberOf mmir
			 * @name jquery
			 * @type jQuery
			 * @default undefined (will be set automatically, if jQuery was loaded)
			 * @public
			 */
			jquery: void(0),

			/**
			 * Name / ID / load-path (requirejs) for the module
			 * that handles the views (i.e. "rendering" that is
			 * change from one view to the next).
			 *
			 * @memberOf mmir
			 * @name viewEngine
			 * @type String
			 * @default "mmirf/simpleViewEngine" will load the default view-engine that uses standard HTML document API
			 * @public
			 */
			viewEngine: 'mmirf/simpleViewEngine',

			/**
			 * Property for enabling / disabling logging:
			 * if set to <code>true</code> (or omitted), the default Logger implementation <code>tools/logger.js</code>
			 * will be loaded as "logger" module.
			 *
			 * If set to <code>false</code> the "dummy" Logger implementation <code>tools/loggerDisabled.js</code> will
			 * be loaded as "logger" module which essentially will create no logging output.
			 *
			 * @memberOf mmir
			 * @name debug
			 * @type Boolean
			 * @default true
			 * @public
			 *
			 * @see mmir.logLevel
			 */
			debug: true,

			/**
			 * Property for the log-level of the Logger module:
			 * if set, and property <code>debug</code> is <code>true</code>, then the logger module
			 * will use the log-level as default log-level.
			 *
			 * If omitted, the Logger's implementation defaults will be used.
			 *
			 * If set, the property must be either a Number or a String with one of the following values:
			 * <pre>
			 * 0: "verbose"
			 * 1: "debug"
			 * 2: "info"
			 * 3: "warn"
			 * 4: "error"
			 * 5: "critical"
			 * 6: "disabled"
			 * </pre>
			 *
			 * or a <code>LogLevelOptions</code> object:
			 * <pre>
			 * {
			 * 	level: LogLevel  // OPTIONAL the default log level as integer or string, DEFAULT: "debug"
			 * 	levels: {        // OPTIONAL list of modules for per log level (unspecified modules will have default log level)
			 * 		[logLevel]: Array<string>  // list of modules for the LogLevel
			 * 	},
			 * 	modules: {       // OPTIONAL log level per module (unspecified modules will have default log level)
			 * 		[moduleId]: LogLevel      // log level for the module
			 * }
			 * </pre>
			 * NOTE: LogLevelOptions.levels and LogLevelOptions.modules will be overriden by module configurations,
			 *       i.e. <pre>core.config({config: {"moduleId": {logLevel: LOGLEVEL}}})</pre>
			 *
			 * NOTE: if you want to disable logging completely, use {@link mmir.debug}.
			 *       Setting the logLevel to "disabled" will still allow specific module's to create logging output
			 *       (if their log-level is set appropriately)
			 *
			 * @memberOf mmir
			 * @name logLevel
			 * @type Integer | String | LogLevelOptions
			 * @default "debug"
			 * @public
			 *
			 * @see mmir.debug
			 * @example
			 * var logLevelOpt = {
			 * 	level: "warn",
			 * 	levels: {
			 * 		0: ["mmirf/mediaManager"],
			 * 		critical: ["mmirf/notificationManager", "mmirf/view"]
			 * 	},
			 * 	modules: {
			 * 		"mmirf/presentationManager": 3,
			 * 		"mmirf/commonUtils": "disabled"
			 * 	}
			 * }
			 */
			logLevel: 'debug',

			/**
			 * Property for enabling / disabling trace output in the Logger module:
			 * if set to <code>true</code>, and property <code>debug</code> is <code>true</code>, then
			 * the logger module will print a stack-trace for each log-message.
			 *
			 * If set to a configuration object:
			 * <pre>
			 * {
			 * 		"trace": [true | false],	//same as the Boolean primitive for logTrace, DEFAULT: true
			 * 		"depth": ["full" | any]	//OPTIONAL: if "full" then the complete stack trace is printed,
			 * 									// otherwise only the first stack-entry (i.e. the calling function)
			 * 									// is printed.
			 * 									//DEFAULT: any
			 * }
			 * </pre>
			 *
			 * i.e. <code>{trace: true}</code> would be the same as using <code>true</code> (or omitting this property).
			 *
			 *
			 * The default value (also if omitted!) is <code>true</code>.
			 *
			 * @memberOf mmir
			 * @name logTrace
			 * @type Boolean | PlainObject
			 * @default true
			 * @public
			 *
			 * @see mmir.debug
			 * @see mmir.logLevel
			 */
			logTrace: true,	//{trace: true, depth: 'full'},

			/**
			 * Attached require-function that is used by the framework to load dependencies.
			 *
			 * @memberOf mmir
			 * @name require
			 * @type Function
			 * @default requirejs
			 * @public
			 *
			 * @see https://requirejs.org/
			 */
			require: null,//is intialized in mainConfig.js

			/**
			 * Attached define-function for "declaring" modules that is used by the framework.
			 *
			 * See requirejs documentation on details about the <code>define</code> function.
			 *
			 * @memberOf mmir
			 * @name _define
			 * @type Function
			 * @default define
			 * @protected
			 *
			 * @see https://requirejs.org/
			 */
			_define: null,//is intialized in mainConfig.js

			/**
			 * The (relative) path pointing to the mmir-lib, in case the library is located
			 * somewhere other than <code>mmirf/</code> (relative to the main HTML page).
			 *
			 * Normally, it should not be necessary to change this.
			 *
			 * NOTE: if specified, the path should end with a slash, otherwise loading
			 *       the library may fail!
			 *
			 *
			 * @memberOf mmir
			 * @name _mmirLibPath
			 * @type String
			 * @default undefined (will use the default configuration for the path)
			 * @protected
			 */
			_mmirLibPath: void(0)
	};

	if(typeof define === 'function'){
		define('mmirf/core', function(){ return mmir; });
	}

	//if mmirGlobal, i.e. globalCtx[coreName] already exists:
	//  copy all its properties to the new core-mmir object
	//  (i.e. collisions will override the default impl.)
	if(mmirGlobal){
		for(var p in mmirGlobal){
			if(mmirGlobal.hasOwnProperty(p) && typeof mmir[p] === 'undefined'){
				mmir[p] = mmirGlobal[p];
			}
		}
	}

	//export core-module into global namespace:
	globalCtx[coreName] = mmir;

	return mmir;
}(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this));
