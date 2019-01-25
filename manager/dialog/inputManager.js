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

define(['mmirf/core','mmirf/util/extend','mmirf/util/deferred','mmirf/commonUtils','mmirf/logger','mmirf/engineConfig','module','require'],
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
	 * require('mmirf/inputManager').init().then( function(inputManagerInstance, inputEngineInstance){
	 * 		//do something
	 * });
	 *
	 *
	 * @name mmir.InputManager
	 * @static
	 * @class
     *
     *  @requires mmir.require
     *  @requires mmir._define
	 *
	 */
	function(
		mmir, extend, deferred, commonUtils, Logger, engineConfig, module, require
){


	var _create = function(){

		//the next comment enables JSDoc2 to map all functions etc. to the correct class description
		/** @scope mmir.InputManager.prototype */

		/**
		 * @memberOf mmir.InputManager#
		 */
		var _instance = {

			/** @scope mmir.InputManager.prototype */

			/**
			 * This function raises an event.
			 *
			 * @function
			 * @param {String} eventName
			 * 				The name of the event which is to be raised
			 * @param {Object} [eventData] OPTIONAL
			 * 				Data belonging to the event
			 * @throws {Error} if this function is invoked while the internal
			 * 				   event/state engine (i.e. {@link mmir.InputEngine}
			 * 				   is not initialized yet
			 * @public
			 * @memberOf mmir.InputManager.prototype
			 */
			raise : function(eventName, eventData) {
				//NOTE the functional implementation will be set during initialization (see below #init())
				throw new Error('InputEngine not initialized yet: '
						+'call mmir.input.init(callback) and wait for the callback.'
				);
			}

		};

		var inst =  extend(_instance, {

			/**
			 * @function
			 * @name init
			 * @returns {Deferred}
			 *
			 * @memberOf mmir.InputManager.prototype
			 */
			init : function(isRegisterEngine) {

				isRegisterEngine = isRegisterEngine !== false;

//				delete this.init;

				//"read" settings from requirejs' config (see mainConfig.js):
				var modConf = module.config(module);
				var url = modConf.scxmlDoc;
				var mode = modConf.mode;

				//create a SCION engine:
				var engine = engineConfig(url, mode);

				this._log = Logger.create(module);
				engine._logger = Logger.create(module.id+'Engine', modConf.logLevel);

	//			var _self = this;

				var theDeferredObj = deferred();

				engine.load().then(function(engine) {

					inst.raise = function raise(){
						engine.raise.apply(engine, arguments);
					};

//					delete engine.gen;

					if(isRegisterEngine){
						//register the InputEngine with requirejs as module 'mmirf/inputEngine':
						define('mmirf/inputEngine', function(){
							return engine;
						});
						//immediately load the module-definition:
						require(['mmirf/inputEngine'], function(){
							//signal end of initialization process:
							theDeferredObj.resolve({manager: inst, engine: engine});
						});
					} else {
						//signal end of initialization process:
						theDeferredObj.resolve({manager: inst, engine: engine});
					}

				});

				return theDeferredObj;
			},
			_create: _create

		});

		return inst;

	};

	return _create();

});
