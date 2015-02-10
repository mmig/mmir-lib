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
 *  @depends jQuery.extend
 */

//FIXME hidden dependencies:
//  * plugins.queuePlugin: needed for Cordova/Android -> Cordova plugin for execution queue (make this explicitly required?)
//
define(['constants', 'scionEngine', 'jquery'], function(constants, createScionEngine, $) {

	
	var printDebugStates = function(ctx){
		ctx._log.debug(ctx.name, 'current state: ' + JSON.stringify(ctx.getStates()));
		ctx._log.debug(ctx.name, 'active states: ' + JSON.stringify(ctx.getActiveStates()));
		ctx._log.debug(ctx.name, 'active events: ',+ JSON.stringify(ctx.getActiveEvents()));
		ctx._log.debug(ctx.name, 'active transitions: '+ JSON.stringify(ctx.getStates()) + ":"+ JSON.stringify(ctx.getActiveTransitions()));
	};

//	var _browser = function(_instance){ return {
    var _defaultFactory = function(_instance, envFactory){ return {

    		name : 'extended_engine',

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
    
    
    var _browserFactory = {
		createWorker: function(_instance, gen) {

			var scionQueueWorker = new Worker(
					constants.getWorkerPath()+ 'ScionQueueWorker.js'
			);

			scionQueueWorker.onmessage = function(e) {

				if (e.data.command == "toDo") {

					_instance._log.debug('raising:' + e.data.toDo.event);

					gen(e.data.toDo.event, e.data.toDo.eventData);

					// @chsc03: attention if something goes wrong along the transition,
					// the worker is not ready for any incoming jobs
					this.postMessage({
						command : 'readyForJob'
					});

					_instance.onraise();
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
    
    var _androidFactory = {
		createWorker: (function initWorkerFactory() {

			//"global" ID-list for all queues (i.e. ID-list for all engines)
			var callBackList = [];

			function successCallBackHandler(args){
				if (args.length=2){
//  				console.debug('QueuePlugin: success '+ JSON.stringify(args[0]) + ', '+JSON.stringify(args[1]));//DEBUG
					callBackList[args[0]](args[1]);
				}
			}



			return function workerFactory(_instance, gen){

				var id = callBackList.length;

				function failureFallbackHandler(err){

					_instance._log.error('failed to initialize SCION extension for ANDROID evn');
					_instance.worker = (function(gen){
						return { 
							raiseCordova: function fallback(event, eventData){
								setTimeout(function(){
									gen(event, eventData);
								}, 1);
							}
						};
					})();//END: fallback
				}

				callBackList.push(function(data){
					if(_instance._log.isv()) _instance._log.debug('raising:'+ data.event);
					var generatedState = gen(data.event, data.eventData);
					if(_instance._log.isv()) _instance._log.debug('QueuePlugin: processed event '+id+' for '+ data.event+' -> new state: '+JSON.stringify(generatedState)+ ' at ' + _instance.url);
					plugins.queuePlugin.readyForJob(id, successCallBackHandler, failureFallbackHandler);

					_instance.onraise();
				});
				plugins.queuePlugin.newQueue(id, function(args){
					if(_instance._log.isv()) _instance._log.debug('QueuePlugin: entry '+id+' created.' + ' at ' + _instance.url);
				}, failureFallbackHandler
				);

				return {
					raiseCordova: function (event, eventData){
						if(_instance._log.isv()) _instance._log.debug('QueuePlugin: new Job: '+ id + ' at ' + _instance.url);
						plugins.queuePlugin.newJob(id, {event: event, eventData: eventData}, successCallBackHandler,failureFallbackHandler);
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

    
    var _stubFactory = {
		createWorker: function(_instance, gen) {

			return { 
				raiseStubImpl: function fallback(event, eventData){
					setTimeout(function(){
						gen(event, eventData);
					}, 1);
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

    function getScionEnvFactory(){
    	
    	var hasWebWorkers = typeof window.Worker !== 'undefined';
    	
    	//TODO make this configurable? through ConfigurationManager?
    	if(hasWebWorkers){
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
    
    //dummy logger that does nothing:
    // the engine-creator should replace this with a "real" implementation
    // e.g. something like this (see also init() in dialogManager):
    //
    //  engine = require('engineConfig')('some-url', 'some-mode');
    //  engine._log = require('logger').create('my-module-id');
    //
    function noop(){};
    function deny(){return false;};
//	function pw(){console.warn.apply(console,arguments);};
	function pe(){console.error.apply(console,arguments);};
    var nolog = {
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
    
	return function(url, _mode) {

//		switch (_mode) {
//		
//		case 'extended':
//			_extended.doc = url;
//			_instance = scionEngine(_extended);
//			return _instance;
//			break;
//			
//		case 'simple':
//		default:
//			_simple.doc = url;
//			_instance = scionEngine(_simple);
//			return _instance;
//			break;
//		}
		
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
