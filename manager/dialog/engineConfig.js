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


//FIXME hidden dependencies:
//  * plugins.queuePlugin: needed for Cordova/Android -> Cordova plugin for execution queue (make this explicitly required?)
//
define(['constants', 'scionEngine', 'jquery'], function(constants, scionEngine, $) {

//	var _instance = null;

    var _browser = function(_instance){ return {

    		name : 'extended_engine',

    		doc : null,

    		onraise : function() {

    			if (IS_DEBUG_ENABLED) {
    				
    				console.debug('[%s] current state:', _instance.name, _instance.getStates());// debug

    				console.debug('[%s] active states:', _instance.name, _instance.getActiveStates());// debug

    				console.debug('[%s] active events:', _instance.name, _instance.getActiveEvents());// debug

    				console.debug('[%s] active transitions:', _instance.name, _instance.getStates() + ":"+ JSON.stringify(_instance.getActiveTransitions()));// debug
    			};

    		},

    		evalScript : true,

    		onload : function(scion, deferred) {

    			$.extend(true, _instance, scion);

    			_instance.worker = (function(gen) {
    				
    				var scionQueueWorker = new Worker(
    						constants.getWorkerPath()+ 'ScionQueueWorker.js'
    				);
    				
    				scionQueueWorker.onmessage = function(e) {
    					
    					if (e.data.command == "toDo") {
    						
    						console.log('raising:' + e.data.toDo.event);//FIXME DEBUG
    						
    						gen(e.data.toDo.event, e.data.toDo.eventData);

    						// @chsc03: attention if something goes wrong along the transition,
    						// the worker is not ready for any incoming jobs
    						_instance.worker.postMessage({
    							command : 'readyForJob'
    						});

    						_instance.onraise();
    					}
    				};

    				return scionQueueWorker;
    				
    			}(_instance.gen));

    			//FIXME @russa: is this a general functionality? should this be removed?
    			if (!_instance.evalScript){
    				_instance.ignoreScript();
    			}

    			// delete _instance.gen;
    			delete _instance.evalScript;

    			_instance.start();

    			deferred.resolve(_instance);
    			
    		},//END: onload

    		raise : function(event, eventData) {

    			if (eventData)
    				console.log('new Job:' + event);

    			_instance.worker.postMessage({
    				command : 'newJob',
    				job : {
    					event : event,
    					eventData : eventData
    				}
    			});
    		}
    	};
    };
    

	var _createCordovaRaiseFunc = (function(){
		
		//"global" queue (i.e. queue for all engines)
		var callBackList = [];
		
		function successCallBackHandler(args){
			if (args.length=2){
//    			console.debug('QueuePlugin: success '+ JSON.stringify(args[0]) + ', '+JSON.stringify(args[1]));
				callBackList[args[0]](args[1]);
			}
		}
		return{
	    	newSCIONExtension: function(_instance, gen, failureCallBack){
	    		var id = callBackList.length;
	    		callBackList.push(function(data){
//	    				console.log('raising:'+ data.event);
	    				var generatedState = gen(data.event, data.eventData);
//	    				console.debug('QueuePlugin: processed event '+id+' for '+ data.event+' -> new state: '+JSON.stringify(generatedState)+ ' at ' + _instance.url);
	    				plugins.queuePlugin.readyForJob(id, successCallBackHandler, failureCallBack);
	    				
	    				_instance.onraise();
	    		});
	    		plugins.queuePlugin.newQueue(id, function(args){
	    				console.debug('QueuePlugin: entry '+id+' created.' + ' at ' + _instance.url);
	    			},failureCallBack
	    		);
	    		
	    		return {
	    			raiseCordova: function (event, eventData){
//		    			console.debug('QueuePlugin: new Job: '+ id + ' at ' + _instance.url);
		    			plugins.queuePlugin.newJob(id, {event: event, eventData: eventData}, successCallBackHandler,failureCallBack);
		    		}
	    		};
	    	}
		};//END: return
	})();//END: _createCordovaRaiseFunc
	
    var _cordova = function(_instance){ return {

    		name : 'extended_engine',

    		doc : null,

    		onraise : function() {

    			if (IS_DEBUG_ENABLED) {
    				
    				console.debug('[%s] current state:', _instance.name, _instance.getStates());// debug

    				console.debug('[%s] active states:', _instance.name, _instance.getActiveStates());// debug

    				console.debug('[%s] active events:', _instance.name, _instance.getActiveEvents());// debug

    				console.debug('[%s] active transitions:', _instance.name, _instance.getStates() + ":"+ JSON.stringify(_instance.getActiveTransitions()));// debug
    			};

    		},

    		evalScript : true,

    		onload : function(scion, deferred) {

    			$.extend(true, _instance, scion);

    			_instance.worker = _createCordovaRaiseFunc.newSCIONExtension(_instance, _instance.gen, function(){
    				
    				console.error('failed to initialize SCION extension for ANDROID evn');
    				_instance.worker = (function(gen){
    					return { 
    						raiseCordova: function fallback(event, eventData){
								setTimeout(function(){
									gen(event, eventData);
								}, 1);
							}
						};
    				})();//END: fallback
    				
    			});

    			_instance.start();

    			deferred.resolve(_instance);
    			
    		},//END: onload

    		raise : function(event, eventData) {

    			if (eventData)
    				console.log('new Job:' + event);

    			_instance.worker.raiseCordova(event, eventData);
    		}
    	};
    };
    
    var _stub = function(_instance){ return {

			name : 'extended_engine',
	
			doc : null,
	
			onraise : function() {
	
				if (IS_DEBUG_ENABLED) {
					
					console.debug('[%s] current state:', _instance.name, _instance.getStates());// debug
	
					console.debug('[%s] active states:', _instance.name, _instance.getActiveStates());// debug
	
					console.debug('[%s] active events:', _instance.name, _instance.getActiveEvents());// debug
	
					console.debug('[%s] active transitions:', _instance.name, _instance.getStates() + ":"+ JSON.stringify(_instance.getActiveTransitions()));// debug
				};
	
			},
	
			evalScript : true,
	
			onload : function(scion, deferred) {
	
				$.extend(true, _instance, scion);
	
				_instance.worker = (function(gen) {
					
					return { 
						raiseStubImpl: function fallback(event, eventData){
							setTimeout(function(){
								gen(event, eventData);
							}, 1);
						}
					};
					
				}(_instance.gen));
	
				//FIXME @russa: is this a general functionality? should this be removed?
				if (!_instance.evalScript){
					_instance.ignoreScript();
				}
	
				// delete _instance.gen;
				delete _instance.evalScript;
	
				_instance.start();
	
				deferred.resolve(_instance);
				
			},//END: onload
	
			raise : function(event, eventData) {
	
				if (eventData)
					console.log('new Job:' + event);
	
				_instance.worker.raiseStubImpl(event, eventData);
			}
		};
    };
    
    function getScionConfig(){
    	
    	var hasWebWorkers = window.Worker !== 'undefined';
    	
    	//TODO make this configurable? through ConfigurationManager?
    	if(hasWebWorkers){
    		return _browser;
    	}
    	else {
    		var isCordovaEnv = !constants.isBrowserEnv();
        	if(isCordovaEnv){
        		return _cordova;
        	}
        	else {
        		return _stub;
        	}	
    	}
    	
    }
    
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
		
		var scionConfig = getScionConfig();

		var _instance = {url: url};
		scionConfig = scionConfig(_instance);
		
		scionConfig.doc = url;
		_instance = scionEngine(scionConfig, _instance);
		return _instance;
	};

});
