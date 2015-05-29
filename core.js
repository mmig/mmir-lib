(
/**
 * Main module / namespace for the MMIR framework.
 * 
 * On initialization, a global module <code>window.mmir</code> is created.
 * 
 * If called multiple times, the existing module instance is returned.
 * 
 * If a function <code>require</code> exists, the module tries to registers itself
 * according to the <em>RequireJS</em> interface (using the default as its module name, i.e. "core").
 * 
 * @name mmir
 * @export initMmir as mmir
 * @class
 * @namespace
 * 
 * @returns the module instance <code>mmir</code>
 * 
 */
function initMmir() {
    
	if(window.mmir){
		if(typeof define === 'function'){
			define(function(){ return window.mmir; });
		}
		return window.mmir;
	}
	
    
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
	function deqExex (func) {
		if(!func){
			func = dequeue();
		}

		//run function in context of the document (whith jQuery as argument)
		func.call(mmir);
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
	function applyConfigs(mainConfig){
		
		if(typeof require === 'undefined'){
			return;
		}
		
		
		_isApplied = true;
		var conf;
		while(_configList.length > 0){
			conf = mergeModuleConfigs(_configList.shift(), mainConfig);
			require.config( conf );
		}
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
					deqExex();
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
				if(_isReady && ! isEmpty()){
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
			 * mmir.config({config: { 'dialogManager': {logLevel: 'warn'}, 'inputManager': {logLevel: 'warn'}}});
			 * 
			 * //... or using alternative SCXML definition for dialog-engine:
			 * mmir.config({config: { 'dialogManager': {scxmlDoc: 'config/statedef/example-view_transitions-dialogDescriptionSCXML.xml'});
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
					require.config(options);
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
			 * @default {String} "main" will load the module specified in /main.js
			 * @public
			 */
			startModule: 'main',

			/**
			 * Name / ID / load-path (requirejs) for the module
			 * that handles the views (i.e. "rendering" that is
			 * change from one view to the next).
			 * 			 
			 * @memberOf mmir
			 * @name viewEngine
			 * @type String
			 * @default "jqmViewEngine" will load the default view-engine that uses jQuery Mobile
			 * @public
			 */
			viewEngine: 'jqmViewEngine',
			
			
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
			 * 
			 * 0: "verbose"
			 * 1: "debug"
			 * 2: "info"
			 * 3: "warn"
			 * 4: "error"
			 * 5: "critical"
			 * 6: "disabled"
			 * 
			 * NOTE: if you want to disable logging completely, use {@link mmir.debug}.
			 *       Setting the logLevel to "disabled" will still allow specific module's to create logging output
			 *       (if their log-level is set appropriately)
			 * 			 
			 * @memberOf mmir
			 * @name logLevel
			 * @type Integer | String
			 * @default "debug"
			 * @public
			 * 
			 * @see mmir.debug
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
			 * 		"trace": [true | false],	//same as the Boolean primitive for logTrace
			 * 		"depth": ["full" | other]	//OPTIONAL: if "full" then the complete stack trace is printed,
			 * 									// otherwise only the first stack-entry (i.e. the calling function)
			 * 									// is printed.
			 * 									//DEFAULT: other
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
			logTrace: true	//{trace: true, depth: 'full'}
	};
	
	if(typeof define === 'function'){
		define(function(){ return mmir; });
	}
	
	//export as global namespace:
	window.mmir = mmir;
	
	return mmir;
}());
