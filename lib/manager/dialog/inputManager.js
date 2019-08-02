
define([ 'mmirf/util/extend', 'mmirf/managerFactory', 'module'],
	/**
	 * The InputManager handles input events.
	 *
	 * <p>
	 * On initialization, the InputManager also creates the {@link mmir.InputEngine},
	 * and returns it as the second argument of the {@link #init}() function's callback
	 * (or the Promise's triggered callbacks).
	 *
	 * In addition, the InputEngine is exported as module <code>"mmirf/inputEngine"</code> via
	 * RequireJS' <code>define()</code> function.
	 *
	 * @example
	 * //initialization of inputManager
	 * require('mmirf/inputManager').init().then( function(data){
	 * 		var inputManagerInstance = data.manager;
	 * 		var inputEngineInstance  = data.engine;
	 * 		//do something...
	 * });
	 *
	 *
	 * @name mmir.InputManager
	 * @extends mmir.ManagerFactory
	 * @static
	 * @class
	 *
	 */
	function( extend, managerFactory, module
){


	var _create = function(){

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

});
