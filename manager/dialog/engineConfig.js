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
 * @requires jQuery.extend
 * @requires cordova.plugins.queuePlugin: needed for Android < 4.4 -> Cordova plugin for non-WebWorker-based execution-queue
 */
define(['constants', 'scionEngine', 'jquery'], function(constants, createScionEngine, $) {

	/**
	 * HELPER logging for state-changes
	 * 
	 * @param {Engine} ctx
	 * 				the context for the state-machine, i.e. the DialogEngine or InputEngine instance
	 * 
     * @memberOf mmir.env.statemachine.engine.exec#
	 */
	var printDebugStates = function(ctx){
		if(!ctx._log.isDebug()){
			return;
		}
		ctx._log.debug(ctx.name, 'current state: ' + JSON.stringify(ctx.getStates()));
		ctx._log.debug(ctx.name, 'active states: ' + JSON.stringify(ctx.getActiveStates()));
		ctx._log.debug(ctx.name, 'active events: ',+ JSON.stringify(ctx.getActiveEvents()));
		ctx._log.debug(ctx.name, 'active transitions: '+ JSON.stringify(ctx.getStates()) + ":"+ JSON.stringify(ctx.getActiveTransitions()));
	};

	/**
	 * Factory for default implementation for state-engine, returns
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
    var _defaultFactory = function(_instance, envFactory){ /** @class StateEngineDefaultImpl */ return {
    		/** @scope  StateEngineDefaultImpl */

    		/** @memberOf  StateEngineDefaultImpl */
    		name : envFactory.name? envFactory.name : 'default_engine',

    		doc : null,

    		onraise : function() {

    			if (this._log.isd()) {
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
    			scion['_scion'].constructor = function dummy(){};
    			$.extend(true, _instance, scion);

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
		createWorker: function(_instance, gen) {

			var scionQueueWorker = new Worker(
					constants.getWorkerPath()+ 'ScionQueueWorker.js'
			);
			scionQueueWorker._engineInstance = _instance;
			scionQueueWorker._engineGen = gen;

			scionQueueWorker.onmessage = function(e) {

				if (e.data.command == "toDo") {
					var inst = this._engineInstance;
					inst._log.debug('raising:' + e.data.toDo.event);

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
					this._log.debug('new Job:' + event);
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
	 * Factory for Android-based implementation of raise function.
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
    var _androidFactory = {
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
					if (args.length=2){
//	  					console.debug('QueuePlugin: success '+ JSON.stringify(args[0]) + ', '+JSON.stringify(args[1]));//DEBUG
						callBackList[args[0]](args[1]);
					}
				}

				function failureFallbackHandler(err){

					_instance._log.error('failed to initialize SCION extension for ANDROID evn');
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
					if(inst._log.isv()) inst._log.debug('raising:'+ data.event);
					var generatedState = gen.call(inst, data.event, data.eventData);
					if(inst._log.isv()) inst._log.debug('QueuePlugin: processed event '+id+' for '+ data.event+' -> new state: '+JSON.stringify(generatedState)+ ' at ' + inst.url);
					execQueue.readyForJob(id, successCallBackHandler, failureFallbackHandler);

					inst.onraise();
				});
				execQueue.newQueue(id, function(args){
						if(_instance._log.isv()) _instance._log.debug('QueuePlugin: entry '+id+' created.' + ' at ' + _instance.url);
					}, failureFallbackHandler
				);

				return {
					_engineInstance: _instance,
					raiseCordova: function (event, eventData){
						if(this._engineInstance._log.isv()) this._engineInstance._log.debug('QueuePlugin: new Job: '+ id + ' at ' + this._engineInstance.url);
						execQueue.newJob(id, {event: event, eventData: eventData}, successCallBackHandler,failureFallbackHandler);
					}
				};
				
			};//END: workerFactory(_instance, gen)

		})(),//END: initWorkerFactory()
		
		createRaise: function(_instance){
			return function(event, eventData) {

				if (eventData) _instance._log.log('new Job:' + event);

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
				raiseStubImpl: function fallback(event, eventData){
					setTimeout(function(){
						gen(event, eventData);
					}, 50);
				}
			};

		},
		createRaise: function(_instance){
			return function(event, eventData) {

				if (eventData) _instance._log.log('new Job:' + event);

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
    	
    	var hasWebWorkers = typeof window.Worker !== 'undefined';
    	
    	//TODO make this configurable? through ConfigurationManager?
    	if(hasWebWorkers && constants.isBrowserEnv()){
    		return _browserFactory; //_browser;
    	}
    	else {
    		var isCordovaEnv = !constants.isBrowserEnv();
        	if(isCordovaEnv){
        		return _androidFactory;//_cordova;
        	}
        	else {
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
     *  engine = require('engineConfig')('some-url', 'some-mode');
     *  engine._log = require('logger').create('my-module-id');
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
		
		var baseFactory = _defaultFactory;
		var scionEnvConfig = getScionEnvFactory();

		var _instance = {url: url,_log: nolog};
//		var scionConfig = scionEnvConfig(_instance);
		var scionConfig = baseFactory( _instance,  scionEnvConfig);
		
		scionConfig.doc = url;
		_instance = createScionEngine(scionConfig, _instance);
		
		return _instance;
	};

});
