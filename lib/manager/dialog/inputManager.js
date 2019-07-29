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
