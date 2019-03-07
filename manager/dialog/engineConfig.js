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
 * @class mmir.env.statemachine.engine.exec
 *
 * @requires cordova.plugins.queuePlugin [Cordova/android]: needed for Android before 4.4 -> Cordova plugin for non-WebWorker-based execution-queue
 * or
 * @requires Worker (WebWorker) on window or global object
 * or
 * @requires setTimeout (fallback/stub implementation)
 */
define(['mmirf/resources', 'mmirf/scionEngine', 'mmirf/util/extend', 'require'], function(constants, createScionEngine, extend, require) {

	/**
	 * HELPER logging for state-changes
	 *
	 * @param {Engine} ctx
	 * 				the context for the state-machine, i.e. the DialogEngine or InputEngine instance
	 *
     * @memberOf mmir.env.statemachine.engine.exec#
	 */
	var printDebugStates = function(ctx){
		if(!ctx._logger.isDebug()){
			return;
		}
		ctx._logger.debug(ctx.name, 'current state: ' + JSON.stringify(ctx.getStates()));
		ctx._logger.debug(ctx.name, 'active states: ' + JSON.stringify(ctx.getActiveStates()));
		ctx._logger.debug(ctx.name, 'active events: ',+ JSON.stringify(ctx.getActiveEvents()));
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
     * @memberOf mmir.env.statemachine.engine.exec#
	 */
    var _baseFactory = function(_instance, envFactory){ /** @class StateEngineDefaultImpl */ return {
    		/** @scope  StateEngineDefaultImpl */

    		/** @memberOf  StateEngineDefaultImpl */
    		name : envFactory.name? envFactory.name : 'base_engine',

    		doc : null,

    		onraise : function() {

    			if (this._logger.isd()) {
    				printDebugStates(_instance);
    			};

    		},

    		evalScript : true,

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

    		raise: envFactory.createRaise(_instance)
    	};
    };

    /**
	 * Factory for WebWorker-based implementation of raise function.
	 *
	 * Provide creator-functions:
	 * <code>createWorker(_engineInstance, genFunc) : WebWorker</code>
	 * <code>createRaise(_engineInstance) : Function</code>
	 *
     * @memberOf mmir.env.statemachine.engine.exec#
	 */
    var _browserFactory = {
		/** @scope  StateEngineWebWorkerImpl */

		/** @memberOf  StateEngineWebWorkerImpl */
		name: 'webworkerGen',
		workerConstructor: void(0),
		createWorker: function(_instance, gen) {

			var scionQueueWorker = new this.workerConstructor(
				typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
						void(0) :
						constants.getWorkerPath()+ 'ScionQueueWorker.js'
			);

			scionQueueWorker._engineInstance = _instance;
			scionQueueWorker._engineGen = gen;

			scionQueueWorker.onmessage = function(e) {

				if (e.data.command == "toDo") {
					var inst = this._engineInstance;
					inst._logger.debug('raising:' + e.data.toDo.event);

					this._engineGen.call(inst, e.data.toDo.event, e.data.toDo.eventData);

					// @chsc03: attention if something goes wrong along the transition,
					// the worker is not ready for any incoming jobs
					this.postMessage({
						command : 'readyForJob'
					});

					inst.onraise();
				}
			};

			return scionQueueWorker;

		},
		createRaise: function(_instance){
			return function(event, eventData) {

				if (eventData){
					this._logger.debug('new Job:' + event);
				}

				_instance.worker.postMessage({
					command : 'newJob',
					job : {
						event : event,
						eventData : eventData
					}
				});
			};
		}

    };

    /**
	 * Factory for CordovaPlugin-based implementation of raise function.
	 *
	 * Provide creator-functions:
	 * <code>createWorker(_engineInstance, genFunc) : WebWorker</code>
	 * <code>createRaise(_engineInstance) : Function</code>
	 *
	 *
	 * @requires cordova.plugins.queuePlugin (Cordova plugin for execution-queue)
	 *
     * @memberOf mmir.env.statemachine.engine.exec#
	 */
    var _queuePluginFactory = {
		/** @scope  StateEngineQueuePluginImpl */

		/** @memberOf  StateEngineQueuePluginImpl */
        name: 'queuepluginGen',
		createWorker: (function initWorkerFactory() {

			//"global" ID-list for all queues (i.e. ID-list for all engines)
			var callBackList = [];

			return function workerFactory(_instance, gen){

				var id = callBackList.length;
				var execQueue = window.cordova.plugins.queuePlugin;

				function successCallBackHandler(args){
					if (args.length===2){
//	  					console.debug('QueuePlugin: success '+ JSON.stringify(args[0]) + ', '+JSON.stringify(args[1]));//DEBUG
						callBackList[args[0]](args[1]);
					}
				}

				function failureFallbackHandler(err){

					_instance._logger.error('failed to initialize SCION extension for ANDROID evn');
					_instance.worker = (function(gen){
						return {
							raiseCordova: function fallback(event, eventData){
								setTimeout(function(){
									gen.call(_instance, event, eventData);
								}, 10);
							}
						};
					})();//END: fallback
				}

				callBackList.push(function(data){
					var inst = _instance;
					if(inst._logger.isv()) inst._logger.debug('raising:'+ data.event);
					var generatedState = gen.call(inst, data.event, data.eventData);
					if(inst._logger.isv()) inst._logger.debug('QueuePlugin: processed event '+id+' for '+ data.event+' -> new state: '+JSON.stringify(generatedState)+ ' at ' + inst.url);
					execQueue.readyForJob(id, successCallBackHandler, failureFallbackHandler);

					inst.onraise();
				});
				execQueue.newQueue(id, function(args){
						if(_instance._logger.isv()) _instance._logger.debug('QueuePlugin: entry '+id+' created.' + ' at ' + _instance.url);
					}, failureFallbackHandler
				);

				return {
					_engineInstance: _instance,
					raiseCordova: function (event, eventData){
						if(this._engineInstance._logger.isv()) this._engineInstance._logger.debug('QueuePlugin: new Job: '+ id + ' at ' + this._engineInstance.url);
						execQueue.newJob(id, {event: event, eventData: eventData}, successCallBackHandler,failureFallbackHandler);
					}
				};

			};//END: workerFactory(_instance, gen)

		})(),//END: initWorkerFactory()

		createRaise: function(_instance){
			return function(event, eventData) {

				if (eventData) _instance._logger.log('new Job:' + event);

				_instance.worker.raiseCordova(event, eventData);
			};
		}

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
     * @memberOf mmir.env.statemachine.engine.exec#
	 */
    var _stubFactory = {
		/** @scope  StateEngineStubImpl */

		/** @memberOf  StateEngineStubImpl */
        name: 'stubGen',
		createWorker: function(_instance, gen) {

			return {
				_engineGen: gen,
				_engineInstance: _instance,
				raiseStubImpl: function fallback(event, eventData){
					setTimeout(function(){
						gen.call(_instance, event, eventData);
					}, 50);
				}
			};

		},
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
     * @memberOf mmir.env.statemachine.engine.exec#
     */
    function getScionEnvFactory(){

    	var ctx = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;
    	var hasWebWorkers = ctx && typeof ctx.Worker !== 'undefined';

    	//TODO make this configurable? through ConfigurationManager?
    	if(hasWebWorkers){
				if(!_browserFactory.workerConstructor){
					_browserFactory.workerConstructor = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? require('../../workers/ScionQueueWorker.js') : ctx.Worker;
				}
    		return _browserFactory; //_browser;
    	}
    	else {
    		var isCordovaEnv = constants.isCordovaEnv();
    		//if queue-plugin is available:
        	if(isCordovaEnv && cordova.plugins && cordova.plugins.queuePlugin){
        		return _queuePluginFactory;//_cordova;
        	}
        	else {
        		//otherwise use fallback:
        		return _stubFactory;//_stub;
        	}
    	}

    }

    /**
     * no-op function for dummy logger
     * @memberOf mmir.env.statemachine.engine.exec#
     */
    function noop(){};
    /**
     * always-false function for dummy logger
     * @memberOf mmir.env.statemachine.engine.exec#
     */
    function deny(){return false;};
//    /**
//     * print-warning function for dummy logger
//     * @memberOf mmir.env.statemachine.engine.exec#
//     */
//	function pw(){console.warn.apply(console,arguments);};
    /**
     * print-error function for dummy logger
     * @memberOf mmir.env.statemachine.engine.exec#
     */
	function pe(){console.error.apply(console,arguments);};
	/**
     * dummy logger that does nothing:
     * the engine-creator should replace this with a "real" implementation
     * e.g. something like this (see also init() in dialogManager):
     *
     *  engine = require('mmirf/engineConfig')('some-url', 'some-mode');
     *  engine._logger = require('mmirf/logger').create('my-module-id');
     *
     * @memberOf mmir.env.statemachine.engine.exec#
     */
    var nolog = {
        /** @scope mmir.env.statemachine.engine.exec.DummyLogger */
    	/** @memberOf DummyLogger */
    	d: noop,
    	debug: noop,
    	w: noop,//pw,
    	warn: noop,//pw,
    	e: pe,
    	error: pe,
    	log: noop,
    	isVerbose: deny,
    	isv: deny,
    	isDebug: deny,
    	isd: deny
    };

    /**
     * Exported factory function for creating / adding impl. to SCION engine instance
     *
     * @memberOf mmir.env.statemachine.engine.exec#
     */
	return function create(url, _mode) {

		var baseFactory = _baseFactory;
		var scionEnvConfig = getScionEnvFactory();

		var _instance = {url: url,_logger: nolog};
//		var scionConfig = scionEnvConfig(_instance);
		var scionConfig = baseFactory( _instance,  scionEnvConfig);

		scionConfig.doc = url;
		_instance = createScionEngine(scionConfig, _instance);

		return _instance;
	};

});
