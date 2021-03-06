
//TODO doc

define(['mmirf/scion', 'mmirf/scionUtil', 'mmirf/util/deferred'], function( scion, scionUtil, deferred ) {

	/**
	 * An array containing all states active.
	 *
	 * @type Array
	 * @private
	 * @memberOf mmir.env.statemachine#
	 */
	var statesActive = new Array();

	/**
	 * Factory function for creating a new (extended) SCION interpreter instance.
	 *
	 * @param {SCION} scion
	 * 			the SCION module
	 * @param {SCIONUtil} scionUtil
	 * 			the util/helper for exending the SCION engine
	 * @param {Objcect} instanceContext
	 *
	 * @private
	 * @memberOf mmir.env.statemachine#
	 */
	var newInstance = function( scion, scionUtil, instanceContext ) {

		/**
		 * @type SCIONInterpreter
		 * @memberOf mmir.env.statemachine.create#
		 */
		var _interpreter = null;

		/**
		 * The load function for <code>instanceContext</code>
		 *
		 * @function
		 * @returns {Deferred} a promise that is resolved when the SCION model is loaded
		 * @memberOf mmir.env.statemachine.create#
		 */
		var load = function(){
			/**
			 * @type String
			 * @memberOf mmir.env.statemachine.engine#
			 */
			var _url = this.arguments || this.doc;
			/**
			 * @type Deferred
			 * @memberOf mmir.env.statemachine.engine#
			 */
			var _defer = deferred();

			if (typeof _url === 'undefined') {
				instanceContext._logger.error('URL is missing!');
				return;
			}
			/**
			 * @type SCION
			 * @memberOf mmir.env.statemachine.engine#
			 */
			var self = this;

			var isNewScionImpl = scion.SCXML? false : true;
			var loadFunc = isNewScionImpl? 'pathToModel' : 'urlToModel';

			/**
			 * Loads the SCXML file and creates the SCION model.
			 *
			 * Resolves the {@link #_defer} promise (or fails it, if an error occurred).
			 *
			 * @param {XMLHTTPRequest} err
			 * 			if <code>falsey</code>, loading was successful.
			 * 			Otherwise contains the failed request for loading the SCXML file.
			 * @param {SCIONModel} model
			 * 			if err is <code>falsey</code>, holds the SCIONModel.
			 * 			Otherwise empty.
			 *
			 * @function
			 * @memberOf mmir.env.statemachine.engine#
			 */
			scion[loadFunc](_url, function urlToModel(err, model) {

				if (err) {

					var url = '';
					var printError = function(){
						console.error('error for SCXML model at ',_url, ': ',
								(url? 'could not load "' + url + '" ' : ''),
								(err.statusText? ': ' + err.statusText : ''),
								err,
								model
						);
					};
					var printErrorFunc = function(){url = this.url; printError();};
					if(err.then) err.then(printErrorFunc, printErrorFunc);
					else printError();

//                    alert('SCXML is not valid!');
					_defer.reject(err);
					return;
				}

				// listener for transitions / state-changes:
				var listener = {
					/**
					 * Listener for state changes (ENTRY) in the SCXML model.
					 *
					 * @param {String} stateName
					 * 			the name of the state that was entered
					 *
					 * @function
					 * @memberOf mmir.env.statemachine.engine.listener#
					 *
					 * @requires instanceContext._logger {@link mmir.tools.Logger} (i.e. the Logger of the DialogEngine/InputEngine)
					 */
					onEntry : function(stateName) {
						statesActive.push(stateName);
						if (instanceContext._logger.isDebug()) instanceContext._logger.debug('SCXML State Entry: "' + stateName + '"');// debug
					},
					/**
					 * Listener for state changes (EXIT) in the SCXML model.
					 *
					 * @param {String} stateName
					 * 			the name of the state that was exited
					 *
					 * @function
					 * @memberOf mmir.env.statemachine.engine.listener#
					 *
					 * @requires instanceContext._logger {@link mmir.tools.Logger} (i.e. the Logger of the DialogEngine/InputEngine)
					 */
					onExit : function(stateName) {
						statesActive.pop();
						if (instanceContext._logger.isDebug()) instanceContext._logger.debug('SCXML State Exit: "' + stateName + '"');// debug
					},
					/**
					 * Listener for state changes (TRANSITIONS) in the SCXML model.
					 *
					 * @param {String} sourceState
					 * 			the name of the origin state for the state transition
					 * @param {Array<String>} targetStatesArray
					 * 			the names of the target states for the state transition
					 *
					 * @function
					 * @memberOf mmir.env.statemachine.engine.listener#
					 *
					 * @requires instanceContext._logger {@link mmir.tools.Logger} (i.e. the Logger of the DialogEngine/InputEngine)
					 */
					onTransition : function(sourceState, targetStatesArray) {

						if (instanceContext._logger.isDebug()) instanceContext._logger.debug('SCXML State Transition: "' + sourceState + '"->"' + targetStatesArray + '"');// debug

						if (targetStatesArray && targetStatesArray.length > 1) {
							instanceContext._logger.warn('SCXML State Transition: multiple target states!');
						}
					}
				};

				//HELPER signal initialization:
				var resolveInit = function(_interpreter){

				_interpreter.registerListener(listener);

				if (self.onload) {
					var _scion = scionUtil(_interpreter, isNewScionImpl);
					if(!self.evalScript) self.scion.ignoreScript();
					self.onload( _scion, _defer );
				} else {
					_defer.resolve(instanceContext);
				}

				}

				// instantiate the interpreter
				if(isNewScionImpl){

					model.prepare(function(err, fnModel) {

						if(err) throw err;

						listener.onError = function(error) {
							if (instanceContext._logger.isError()){
								var stackInfo = error.stack? ', ' + (error.stack.replace? error.stack.replace(error.reason, '') : error.stack) : '';
														if(error.data && error.data.tagname){
															if(!stackInfo){
																stackInfo = ' ['+error.type+': '+error.name+']';
															}
															error = error.data;
														}
								instanceContext._logger.error('SCXML ERROR: in <'+error.tagname+'> ('+error.line+':'+error.column+'): ' + error.reason + stackInfo);
							}
						}

						//instantiate the interpreter
						_interpreter = new scion.scion.Statechart(fnModel);
						resolveInit(_interpreter);
					});

				} else {

					_interpreter = new scion.SCXML(model);
					resolveInit(_interpreter);
				}

			});//END: scion.urlToModel(...


			return _defer;

		};//END: load = function(){...

		instanceContext.load = load;
		instanceContext.onload = null;
		instanceContext.doc = null;
		instanceContext.raise = null;

		return instanceContext;

	};//END: newInstance(){...


	//export:

	/**
	 * Creates a new SCION engine.
	 *
	 * @param {Object} configuration
	 * 				The configuration object for the SCION engine:
	 * 				all properties and functions from this object will be attached
	 * 				to the returned SCION engine (i.e. the <code>context</code> object).
	 * @param {Object} context
	 * 				The context object: the SCION engine will be attached to this object.
	 * 				The context object must have a property <code>_logger</code> with the
	 * 				following attributes (may be empty non-function):
	 * 				<code>_logger.isDebug() : Boolean</code>  (this SHOULD NOT print / show any message)
	 * 				<code>_logger.debug(String) : void</code> (this SHOULD NOT print / show any message)
	 * 				<code>_logger.warn(String) : void</code>  (this MAY print / show a warning message)
	 * 				<code>_logger.error(String) : void</code> (this SHOULD print / show an error message)
	 * 				or use a Logger instance (see /tools/logger.js) that is setup for the module
	 * 				that calls this function (see e.g. /manager/dialog/dialogManager::init).
	 * @returns {Object} the created SCION engine object
	 *
	 * @public
	 * @memberOf mmir.env.statemachine#
	 */
	function createEngine(configuration , context){

		var _instance = newInstance( scion, scionUtil , context);

		for (var key in configuration) {
			_instance[key] = configuration[key];
		}

		return _instance;

	};
	return createEngine;

});
