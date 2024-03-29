/**
 * Factory for creating the state-machine's <em>raise()</em> function.
 *
 * Creates implementation for the state-engine's
 * <pre>
 * {
 * 		name: STRING        // engine name / description
 * 		doc: STRING         // the URL to the SCXML document that holds the engine's definition
 * 		evalScript: BOOLEAN // true
 * 		onraise: FUNCTION   // default impl. for onraise: print debug output (depending on logging-level for DialogEngine / InputEngine)
 * 		onload: FUNCTION    // default impl. handling initialization of state-engine after SCXML definition was loaded
 * 		raise: FUNCTION     // default impl. for raise-function: use execution-queue for allowing raise-invocations from within SCXML scripts
 * }
 * </pre>
 *
 * @class StateEngineFactory
 * @memberOf mmir.state
 * @hideconstructor
 *
 * @requires cordova.plugins.queuePlugin [Cordova/android]: needed for Android before 4.4 -> Cordova plugin for non-WebWorker-based execution-queue
 * or
 * @requires Worker (WebWorker) on window or global object
 * or
 * @requires setTimeout (fallback/stub implementation)
 */
define(['mmirf/resources', 'mmirf/scionEngine', 'mmirf/asyncUtils', 'mmirf/util/extend', 'require'], function(resources, createScionEngine, asyncUtils, extend, require) {

	/**
	 * HELPER logging for state-changes
	 *
	 * @param {Engine} ctx
	 * 				the context for the state-machine, i.e. the DialogEngine or InputEngine instance
	 *
	 * @memberOf mmir.state.StateEngineFactory#
	 */
	var printDebugStates = function(ctx){
		if(!ctx._logger.isDebug()){
			return;
		}
		ctx._logger.debug(ctx.name, 'current state: ' + JSON.stringify(ctx.getStates()));
		ctx._logger.debug(ctx.name, 'active states: ' + JSON.stringify(ctx.getActiveStates()));
		ctx._logger.debug(ctx.name, 'active events: ' + JSON.stringify(ctx.getActiveEvents()));
		ctx._logger.debug(ctx.name, 'active transitions: '+ JSON.stringify(ctx.getStates()) + ":"+ JSON.stringify(ctx.getActiveTransitions()));
	};

	/**
	 * Factory for base / default implementation for state-engine, returns
	 * <pre>
	 * {
	 * 		name: STRING        // engine name / description
	 * 		doc: STRING         // the URL to the SCXML document that holds the engine's definition
	 * 		evalScript: BOOLEAN // true
	 * 		onraise: FUNCTION   // default impl. for onraise: print debug output (depending on logging-level for DialogEngine / InputEngine)
	 * 		onload: FUNCTION    // default impl. handling initialization of state-engine after SCXML definition was loaded
	 * 		raise: FUNCTION     // raise-function created by envFactory(_instance)
	 * }
	 * </pre>
	 *
	 * @param {Engine} _engine
	 * 				the instance of the SCION state-machine
	 *
	 * @param {ExecFactory} envFactory
	 * 				the factory for creating the Worker/Thread and the raise() function
	 *
	 * @returns the implementation with raise-function
	 *
	 * @memberOf mmir.state.StateEngineFactory#
	 */
	var _baseFactory = function(_instance, envFactory){
		/** @class StateEngineDefaultImpl
		 * @memberOf mmir.state
		 */
		return /** @lends mmir.state.StateEngineDefaultImpl# */ {

			/** @type String
			 * @memberOf  mmir.state.StateEngineDefaultImpl#
			 */
			name : envFactory.name? envFactory.name : 'base_engine',

			/** @type String */
			doc : null,

			/** @function */
			onraise : function() {

				if (this._logger.isd()) {
					printDebugStates(_instance);
				};

			},

			/** @type Boolean */
			evalScript : true,

			/** @function */
			onload : function(scion, deferred) {

				//FIX (russa) for jQuery > 2.x: extend() uses isPlainObject(), which's impl. changed in 2.x
				//                  -> isPlainObject() now requires a constructor that is different from the native Object.constructor
				//					   in order to be able to detect, that an object is NOT a plain object
				//					   ... but scion does not provide such a non-native constructor for its _scion property
				//					   (which causes deep-copy in extend() to run into an infinite loop)
				// QUICK-FIX: just attach a dummy constructor function, so that isPlainObject will correctly detect property
				//            _scion as not-a-plain-object (this should really be FIXed in the scion library itself...)
				//
				//TODO russa: check if we really need a deep copy here (maybe we should make a copy TO scion and replace _instance with the ext. scion obj. ...?)
				if(scion['_scion']) scion['_scion'].constructor = function dummy(){};//NOTE _scion only does exist on old SCION lib version!

				extend(_instance, scion);
				_instance.__proto__ = scion.constructor.prototype;//FIX: in newer SCION implementations we need the prototype too

				_instance.worker = envFactory.createWorker(_instance, _instance.gen);//_instance._genFuncFactory(_instance, _instance.gen);

				//FIXME @russa: is this a general functionality? should this be removed?
				if (!_instance.evalScript){
					_instance.ignoreScript();
				}

				// delete _instance.gen;
				delete _instance.evalScript;

				_instance.start();

				deferred.resolve(_instance);

			},//END: onload

			/** @function */
			raise: envFactory.createRaise(_instance),

			/** @function */
			destroy: function(){
				if(_instance.worker.destroy){
					_instance.worker.destroy();
				}
			}
		};
	};

	/**
	 * Factory for WebWorker-based implementation of raise function.
	 *
	 * Provide creator-functions:
	 * <code>createWorker(_engineInstance, genFunc) : WebWorker</code>
	 * <code>createRaise(_engineInstance) : Function</code>
	 *
	 * @class StateEngineWebWorkerImpl
	 * @memberOf mmir.state.StateEngineFactory
	 *
	 * @requires workers/scion-queue
	 */
	var _browserFactory = /** @lends mmir.stateStateEngineFactory.StateEngineWebWorkerImpl# */ {

		/**
		 * @type {String}
 		 * @memberOf  mmir.stateStateEngineFactory.StateEngineWebWorkerImpl
		 */
		name: 'webworkerGen',
		/**
		 * @type {Array<{_engineId: number, _engineInstance: ScionEngine, _engineGen: Function}>}
 		 * @memberOf  mmir.stateStateEngineFactory.StateEngineWebWorkerImpl
		 */
		engines: [],
		/** @function */
		workerConstructor: void(0),
		/** @type Worker */
		workerInstance: void(0),
		/** @function */
		createWorkerInstance: function() {

			var scionQueueWorker = new this.workerConstructor(
				typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
						void(0) :
						resources.getWorkerPath()+ 'scionQueueWorker.js'
			);

			scionQueueWorker._engines = this.engines;

			asyncUtils.onMessage(scionQueueWorker, function(evt) {

				if (evt.data.command == 'processNextJob') {
					var jobData = evt.data.job;
					var engine = this._engines[jobData.engineId];
					var inst = engine._engineInstance;

					if(inst._logger.isd()){
						inst._logger.debug('raising: ' + jobData.event);
					}

					engine._engineGen.call(inst, jobData.event, jobData.eventData);

					// after gen-call has finished, notify worker queue to
					// process next job (if there is any):
					this.postMessage({
						command: 'finishedJob',
						engineId: this._engineId
					});

					inst.onraise();
				}
			});

			// if worker implementation supports unref(), do "declare" that program
			// should exit even if the worker is still running:
			if(typeof scionQueueWorker.unref === 'function'){
				scionQueueWorker.unref();
			}

			if(typeof scionQueueWorker.terminate === 'function'){
				scionQueueWorker.destroy = function(){
					this.terminate();
				};
			} else {
				scionQueueWorker.destroy = function(){};
			}

			scionQueueWorker.addEngine = function(engineEntry){
				var id = this._engines.length;
				engineEntry._engineId = id;
				this._engines.push(engineEntry);
			};

			scionQueueWorker.removeEngine = function(engineEntry){
				this._engines.splice(engineEntry._engineId, 1);
			};

			this.workerInstance = scionQueueWorker;

			return scionQueueWorker;
		},
		/** @function */
		createWorker: function(instance, gen) {

			var workerInstance = this.workerInstance || this.createWorkerInstance();

			var scionQueueWorker = {
				_engineId: -1,
				_engineInstance: instance,
				_engineGen: gen,
				_workerInstance: workerInstance,
				destroy: function(){

					this._workerInstance.removeEngine(this._engineId);
					if(this._workerInstance._engines.length === 0){
						this._workerInstance.destroy();
					} else {
						this._workerInstance.postMessage({
							command: 'destroyQueue',
							engineId: this._engineId
						});
					}

				}
			};

			workerInstance.addEngine(scionQueueWorker);

			return scionQueueWorker;

		},
		/** @function */
		createRaise: function(instance){
			return function(event, eventData) {

				if (this._logger.isd()){
					this._logger.debug('new Job: ' + event);
				}

				instance.worker._workerInstance.postMessage({
					command: 'queueJob',
					engineId: this._engineId,
					job: {
						engineId: instance.worker._engineId,
						event: event,
						eventData: eventData
					}
				});
			};
		}

	};

	/**
	 * Returns factory for CordovaPlugin-based implementation of raise function.
	 *
	 * Provide creator-functions:
	 * <code>createWorker(_engineInstance, genFunc) : WebWorker</code>
	 * <code>createRaise(_engineInstance) : Function</code>
	 *
	 * @requires cordova.plugins.queuePlugin (Cordova plugin for execution-queue)
	 *
	 * @function
	 * @param {Window | Worker | Global} ctx the global context
	 * @returns {StateEngineQueuePluginImpl}
	 * @memberOf mmir.state.StateEngineFactory
	 */
	var _getQueuePluginFactory = function(ctx){
		return ctx.cordova.plugins.queuePlugin.queueFactory;
	};

	/**
	 * Factory for stub/dummy implementation of raise function.
	 *
	 * Provide creator-functions:
	 * <code>createWorker(_engineInstance, genFunc) : WebWorker</code>
	 * <code>createRaise(_engineInstance) : Function</code>
	 *
	 *
	 * @requires cordova.plugins.queuePlugin (Cordova plugin for execution-queue)
	 *
	 * @class StateEngineStubImpl
	 * @memberOf mmir.state.StateEngineFactory
	 */
	var _stubFactory = /** @lends  mmir.state.StateEngineFactory.StateEngineStubImpl# */ {

		/** @memberOf  mmir.state.StateEngineFactory.StateEngineStubImpl# */
		name: 'stubGen',
		/** @function */
		createWorker: function(_instance, gen) {

			return {
				_engineGen: gen,
				_engineInstance: _instance,
				raiseStubImpl: function fallback(event, eventData){
					_instance._engineRaiseTimeout = setTimeout(function(){
						gen.call(_instance, event, eventData);
					}, 50);
				},
				destroy: function(){
					clearTimeout(_instance._engineRaiseTimeout);
				}
			};

		},
		/** @function */
		createRaise: function(_instance){
			return function(event, eventData) {

				if (eventData) _instance._logger.log('new Job:' + event);

				_instance.worker.raiseStubImpl(event, eventData);
			};
		}
	};

	/**
	 * Get factory for raise-impl. depending on the runtime environment.
	 *
	 * Currently there are 3 impl. available
	 *  * WebWorker
	 *  * Android QueuePlugin
	 *  * STUB IMPLEMENTATION
	 *
	 * @memberOf mmir.state.StateEngineFactory#
	 */
	function getScionEnvFactory(){

		var ctx = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;
		var hasWebWorkers = ctx && typeof ctx.Worker !== 'undefined';

		//TODO make this configurable? through ConfigurationManager?
		if(hasWebWorkers){
			if(!_browserFactory.workerConstructor){
				_browserFactory.workerConstructor = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? require('../../workers/scionQueueWorker.js') : ctx.Worker;
			}
			return _browserFactory; //_browser;
		}
		else {
			var isCordovaEnv = resources.isCordovaEnv();
			//if queue-plugin is available:
			if(isCordovaEnv && ctx.cordova.plugins && ctx.cordova.plugins.queuePlugin){
				return _getQueuePluginFactory(ctx);//_cordova;
			}
			else {
				//otherwise use fallback:
				return _stubFactory;//_stub;
			}
		}

	}

	/**
	 * no-op function for dummy logger
	 * @memberOf mmir.state.StateEngineFactory#
	 */
	function noop(){};
	/**
	 * always-false function for dummy logger
	 * @memberOf mmir.state.StateEngineFactory#
	 */
	function deny(){return false;};
//    /**
//     * print-warning function for dummy logger
//     * @memberOf mmir.state.StateEngineFactory#
//     */
//	function pw(){console.warn.apply(console,arguments);};
	/**
	 * print-error function for dummy logger
	 * @memberOf mmir.state.StateEngineFactory#
	 */
	function pe(){console.error.apply(console,arguments);};
	/**
	 * dummy logger that does nothing:
	 * the engine-creator should replace this with a "real" implementation
	 * e.g. something like this (see also init() in dialogManager):
	 * @example
	 *  engine = require('mmirf/engineConfig')('some-url', 'some-mode');
	 *  engine._logger = require('mmirf/logger').create('my-module-id');
	 *
	 * @class StubLogger
	 * @memberOf mmir.state.StateEngineFactory
	 */
	var nolog = /** @lends mmir.state.StateEngineFactory.StubLogger# */ {
		/** @memberOf mmir.state.StateEngineFactory.StubLogger# */
		d: noop,
		/** @function */
		debug: noop,
		/** @function */
		w: noop,//pw,
		/** @function */
		warn: noop,//pw,
		/** @function */
		e: pe,
		/** @function */
		error: pe,
		/** @function */
		log: noop,
		/** @function */
		isVerbose: deny,
		/** @function */
		isv: deny,
		/** @function */
		isDebug: deny,
		/** @function */
		isd: deny
	};

	/**
	 * Exported factory function for creating / adding impl. to SCION engine instance
	 *
	 * @memberOf mmir.state.StateEngineFactory#
	 */
	return function create(url, _mode) {

		var baseFactory = _baseFactory;
		var scionEnvConfig = getScionEnvFactory();

		var _instance = {url: url,_logger: nolog};
		var scionConfig = baseFactory(_instance,  scionEnvConfig);

		scionConfig.doc = url;
		_instance = createScionEngine(scionConfig, _instance);

		return _instance;
	};

});
