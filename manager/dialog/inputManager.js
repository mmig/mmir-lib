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

define(['core', 'jquery', 'commonUtils', 'module', 'engineConfig' ],
	/**
	 * The InputManager handles input events.
	 * 
	 * <p>
	 * On initialization, the InputManager also creates the {@link mmir.InputEngine},
	 * and returns it as the second argument of the {@link #init}() function's callback
	 * (or the Promise's triggered callbacks).
	 * 
	 * In addition, the InputEngine is exported as module <code>"inputEngine"</code> via
	 * RequireJS' <code>define()</code> function.
	 * 
	 * @example
	 * //initialization of inputManager
	 * require('inputManager').init().then( function(inputManagerInstance, inputEngineInstance){
	 * 		//do something
	 * });
	 * 
	 * 
	 * @name mmir.InputManager
	 * @static
	 * @class
	 * 
	 */
	function(
		mmir, $, commonUtils,module, engineConfig
){

	//next 2 comments are needed by JSDoc so that all functions etc. can
	// be mapped to the correct class description
	/** @scope mmir.InputManager.prototype */
	/**
	 * #@+
	 * @memberOf mmir.InputManager.prototype 
	 */
	
	var _instance = {

		/** @scope mmir.InputManager.prototype */
		
		/** 
		 * @deprecated instead: use mmir.InputManager object directly.
		 */
		getInstance : function() {
			return this;
		},
		
		/**
		 * This function raises an event. 
		 * 
		 * @function raise
		 * @param {String} eventName
		 * 				The name of the event which is to be raised
		 * @param {Object} [eventData] OPTIONAL
		 * 				Data belonging to the event
		 * @throws {Error} if this function is invoked while the internal
		 * 				   event/state engine (i.e. {@link mmir.InputEngine}
		 * 				   is not initialized yet
		 * @public
		 */
		raise : function(eventName, eventData) {
			//NOTE the functional implementation will be set during initialization (see below #init())
			throw new Error('InputEngine not initialized yet: '
					+'call mmir.InputManager.init(callback) and wait for the callback.'
			);
		}

	};

	return $.extend(true, _instance, {

		init : function() {
			delete this.init;
			
			//"read" settings from requirejs' config (see mainConfig.js):
			var url = module.config().scxmlDoc;
			var mode = module.config().mode;
			
			//create a SCION engine:
			var engine = engineConfig(url, mode);

//			var _self = this;

			return $.Deferred(function(theDeferredObj) {
				
				engine.load().done(function(_engine) {
					
					_instance.raise = function raise(){
						_engine.raise.apply(_engine, arguments);
					};
					
//					mmir.InputEngine = _engine;
					delete _engine.gen;

					//register the InputEngine with requirejs as module "inputEngine":
					define("inputEngine", function(){
						return _engine;
					});
					//immediately load the module-definition:
					require(['inputEngine'], function(){
						//signal end of initialization process:
						theDeferredObj.resolve(_instance, _engine);	
					});
					
				});
				
			}).promise();
		}
	});
	
	/** #@- */

});
