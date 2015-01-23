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
	
    
    //STATE: state variable for indicating "doc is already loaded" (this needs to be set/reset manually)
	var _isReady = false;
	var _funcList = [];
	function dequeue () { return _funcList.shift(); };
	function isEmpty () { return _funcList.length === 0; };
	//param func OPTIONAL
	//			if func is present, func will be used instead of dequeueing a callback from the queue
	function deqExex (func) {
		if(!func){
			func = dequeue();
		}

		//run function in context of the document (whith jQuery as argument)
		func.call(mmir);
	};
	
	//STATE: state variable for indicating "configs for requirejs are already applied"
	var _isApplied = false;
	var _configList = [];
	function applyConfigs(){
		
		if(typeof require === 'undefined'){
			return;
		}
		
		
		_isApplied = true;
		while(_configList.length > 0){
			require.config( _configList.shift() );
		}
	}
	
	var mmir = {
			
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
			 *       the were added, i.e. if a later option specifies
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
			 * 
			 * @memberOf mmir
			 * @name applyConfigs
			 * @function
			 * @private this is a semi-private function that 
			 *          should only be used by the initialization
			 *          process.
			 */
			applyConfig: applyConfigs,
			
			/**
			 * The name / ID of the RequireJS module that will
			 * be loaded, after the configuration in
			 * <code>mainConfig.js</code> was applied.
			 * 
			 * <p>
			 * This module should first start-up the framework and
			 * then signal the application (via {@link #setInitialized}
			 * that it is ready to be used, i.e. fully initialized now.
			 * 
			 * <p>
			 * NOTE: If set to <code>undefined</code>, no module will be 
			 * loaded after configuration in <code>mainConfig.js</code>
			 * was applied.
			 * 
			 * @memberOf mmir
			 * @name startModule
			 * @property
			 * @type String
			 * @default "main" will load the module specified in main.js
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
			 * @property
			 * @type String
			 * @default "jqmViewEngine" will load the default view-engine that uses jQuery Mobile
			 * @public
			 */
			viewEngine: 'jqmViewEngine'
	};
	
	if(typeof define === 'function'){
		define(function(){ return mmir; });
	}
	
	//export as global namespace:
	window.mmir = mmir;
	
	return mmir;
}());
