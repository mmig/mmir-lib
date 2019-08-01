
define([ 'mmirf/util/extend', 'mmirf/managerFactory', 'module'
	],
	/**
	 * The DialogManager gives access to the most commonly used functions of
	 * the framework.
	 *
	 * <p>
	 * On initialization, the DialogManager also creates the {@link mmir.DialogEngine}
	 * and returns it as the second argument of the {@link #init}() function's callback
	 * (or the Promise's triggered callbacks).
	 *
	 * In addition, the DialogEngine is exported as module <code>"mmirf/dialogEngine"</code> via
	 * RequireJS' <code>define()</code> function.
	 *
	 * @example
	 * //initialization of inputManager
	 * require('mmirf/dialogManager').init().then( function(data){
	 * 		var dialogManagerInstance = data.manager;
	 * 		var dialogEngineInstance  = data.engine;
	 * 		//do something...
	 * });
	 *
	 * @name mmir.DialogManager
	 * @static
	 * @class
	 */
	function( extend, managerFactory, module
) {

	var _create = function(){


		/**
		 * @memberOf mmir.DialogManager#
		 */
		var _instance = managerFactory();

		var inst = extend(_instance, {

			init : function(isRegisterEngine) {

				return _instance._init(module.id, module.config(module), isRegisterEngine);

			},//END: init()
			_create: _create

		});//END: var inst = extend(...

		return inst;
	};

	return _create();

});//END: define(...
