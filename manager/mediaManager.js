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



define(['jquery', 'constants', 'commonUtils', 'configurationManager', 'dictionary', 'logger', 'module'],
	/**
	 * The MediaManager gives access to audio in- and output functionality.
	 * 
	 * Depending on its configuration, the MediaManager loads different implementation modules
	 * (<em>plugins</em>) that realize the interface-functions differently.
	 * 
	 * See directory <code>mmirf/env/media</code> for available plugins.
	 * 
	 * This "class" is a singleton - so that only one instance is in use.<br>
	 * 
	 * @class
	 * @name MediaManager
	 * @memberOf mmir
	 * @static
	 * 
	 * @requires jQuery.extend
	 * @requires jQuery.Deferred
	 * 
	 * TODO remove / change dependency on forBrowser: constants.isBrowserEnv()!!!
	 */
	function(
		jQuery, constants, commonUtils, configurationManager, Dictionary, Logger, module
){
	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope mmir.MediaManager.prototype */

	/**
	 * The instance that holds the singleton MediaManager object.
	 * @private
	 * @type MediaManager
	 * @memberOf MediaManager#
	 */
    var instance = null;
    
    /**
     * default configuration for env-settings "browser" and "cordova":
     * 
     *  -> may be overwritten by settings in the configuration file.
     *  e.g. adding the following JSON data to config/configuration.json:
     * <pre>
	 *     "mediaManager": {
	 *     	"plugins": {
	 *     		"browser": ["html5AudioOutput.js",
	 *     		            "html5AudioInput.js",
	 *     		            "maryTextToSpeech.js",
	 *     		            {"mod": "webkitAudioInput.js",    "ctx": "chrome"}
	 *     		],
	 *     		"cordova": ["cordovaAudioOutput.js",
	 *     		            "nuanceAudioInput.js",
	 *     		            "nuanceTextToSpeech.js",
	 *     		            {"mod": "androidAudioInput.js",   "ctx": "native"},
	 *     		            {"mod": "androidTextToSpeech.js", "ctx": "native"},
	 *     		            {"mod": "maryTextToSpeech.js",    "ctx": "web"}
	 *     		]
	 *     	}
	 *     }
	 * </pre>
	 * 
	 * @private
	 * @type PlainObject
	 * 
	 * @memberOf MediaManager#
	 */
    var _defaultPlugins = {
    		'browser': ['waitReadyIndicator.js',
    		            'html5AudioOutput.js',
    		            'html5AudioInput.js',
    		            'maryTextToSpeech.js'
    		],
    		'cordova': ['waitReadyIndicator.js',
    		            'cordovaAudioOutput.js',
    		            'androidAudioInput.js',
    		            'maryTextToSpeech.js'
    		]
    };
    
    /**
     * Load an media-module implementation from plugin file.
     * 
     * @param {String} filePath
     * @param {Function} successCallback
     * @param {Function} failureCallback
     * @param {String} [execId]
     * 
     * @private
	 * @function
	 * 
	 * @memberOf MediaManager#
	 */
    var loadPlugin = function loadPlugin(filePath, successCallback, failureCallback, execId){
    	try {
    		
    		commonUtils.loadScript(constants.getMediaPluginPath() + filePath, function(){
    			
	    		if (typeof newMediaPlugin !== 'undefined' && newMediaPlugin){
	    			
	    			newMediaPlugin.initialize(function(exportedFunctions){
	    				
	    				if(execId){
	    					
	    					//create new "execution context" if necessary
	    					if(typeof instance.ctx[execId] === 'undefined'){
	    						
	    						instance.ctx[execId] = {};
	    						
	    					}
	    					
	    					//import functions and properties into execution-context:
    						var func;
	    					for(var p in exportedFunctions){
	    						
	    						if(exportedFunctions.hasOwnProperty(p)){
	    							
	    							//only allow extension of the execution-context, no overwriting:
	    							if(typeof instance.ctx[execId][p] === 'undefined'){
	    								
	    								func = exportedFunctions[p];
		    							if(typeof func === 'function'){
		    								
		    								//need to "re-map" the execution context for the functions,
		    								// so that "they think" they are actually executed within the MediaManager instance
			    							
		    								(function(mediaManagerInstance, originalFunc, name, context){
		    									//NOTE need closure to "preserve" values of for-iteration
		    									mediaManagerInstance.ctx[context][name] = function(){
//					    								console.log('executing '+context+'.'+name+', in context '+mediaManagerInstance,mediaManagerInstance);//DEBUG
				    								return originalFunc.apply(mediaManagerInstance, arguments);
				    							};
		    								})(instance, func, p, execId);
		    								
		    							}
		    							else {
		    								//for non-functions: just attach to the new "sub-context"
			    							instance.ctx[execId][p] = func;
		    							}
		    							
	    							} else {
	    								
	    								//if there already is a function/property for this in the execution-context,
	    								// print out an error:
	    								
	    	    						logger.error('MediaManager', 'loadPlugin', 
	    	    							'cannot load implemantion for '+p+' of plugin "'+filePath+
	    	    								'" into execution-context "'+execId+
	    	    								'": context already exists!'
	    	    						);
	    	    						
	    	    					}
	    							
	    							
	    						}//END if(exportedFunctions<own>)
	    						
	    					}//END for(p in exprotedFunctions)
		    					
	    					
	    				}//END if(execId)
	    				else {
	    					jQuery.extend(true,instance,exportedFunctions);
	    					newMediaPlugin = null;
	    				}
	    				
						if (successCallback) successCallback();
						
	    			}, instance, execId);
	    			
	    			//"delete" global var for media plugin after loading
	    			// TODO remove when/if other loading mechanism is established
//	    			newMediaPlugin = void(0);
	    			delete newMediaPlugin;
	    			
	    		}
	    		else {
	        		console.error('Error loading MediaPlugin '+filePath + ' - no newMediaPlugin set!');
	    			if (failureCallback) failureCallback();
	    		}
			});
    		

    		//DISABLED @russa: currently disabled, since debugging eval'ed code is problematic
    		//                 NOTE support for code-naming feature (see below) is currently somewhat broken in FireFox (e.g. location in error-stack is not done correctly) 
//        	//NOTE: this new loading-mechanism avoids global VARIABLES by
//    		//	* loading the script as text
//    		//	* evaluating the script-text (i.e. executing the JavaScript) within an local context
//    		//  * uses code-naming feature for eval'ed code: //@ sourceURL=...
//    		//i.e. eval(..) is used ...
//    		var targetPath = constants.getMediaPluginPath()+filePath;
//    		$.ajax({
//                async: true,
//                dataType: "text",
//                url: targetPath,
//                success: function(data){
//                	
//                	//add "dummy-export-code" to script-text 
//                	// -> for "retrieving" the media-plugin implementation as return value from eval(..)
//            		var LOAD_MODULE_TEMPLATE_POSTFIX = 'var dummy = newMediaPlugin; dummy';
//            		//use eval code naming feature...
//            		var codeId = ' sourceURL=' + constants.getMediaPluginPath()+filePath + '\n';
//            		//... for WebKit:
//            		var CODE_ID_EXPR1 = '//@';
//            		// ... and for FireFox:
//            		var CODE_ID_EXPR2 = '//#';
//            		
//                	var newMediaPlugin = eval(data 
//                			+ CODE_ID_EXPR1 + codeId 
//                			+ CODE_ID_EXPR2 + codeId 
//                			+ LOAD_MODULE_TEMPLATE_POSTFIX
//                	);
//                	
//                	if (typeof newMediaPlugin !== 'undefined' && newMediaPlugin){
//    	    			newMediaPlugin.initialize(function(exportedFunctions){
//    	    					jQuery.extend(true,instance,exportedFunctions);
//    	    					newMediaPlugin = null;
//    							if (successCallback) successCallback();
//    	    			}, instance);
//    	    		}
//    	    		else {
//    	        		console.error('Error loading MediaPlugin '+filePath + ' - no newMediaPlugin set!');
//    	    			if (failureCallback) failureCallback();
//    	    		}
//                }
//            }).fail(function(jqxhr, settings, err){
//                // print out an error message
//				var errMsg = err && err.stack? err.stack : err;
//                console.error("[" + settings + "] " + JSON.stringify(jqxhr) + " -- " + partial.path + ": "+errMsg); //failure
//            });
    	}catch (e){
    		console.error('Error loading MediaPlugin '+filePath+': '+e);
    		if (failureCallback) failureCallback();
    	}
	
    };
    
//    /**
//     * "Register" a media-module implementation to the MediaManager.
//     * 
//     * @param {MediaPlugin} newMediaPlugin
//     * 				The new media-plugin which must have the
//     * 				function <code>initialize</code>:
//     * 				The initializer function will be called with 3 arguments:
//     * 				(callbackFuntion(mediaPlugin: Object), instance: MediaManager, execId: String)
//     * 
//     * 				the first argument (this callback-function from the MediaManager)
//     * 				should be invoked by the media-plugin when it has it finished 
//     * 				initializing in its <code>initializeFunc</code>.
//     * 				The callback must be invoked with on argument:
//     * 				(mediaPlugin: Object)
//     * 				where mediaPlugin is an object with all the functions and properties,
//     * 				that the media-plugin exports to the MediaManager.
//     * 
//     * @private
//	 * @function
//	 * 
//	 * @memberOf MediaManager#
//	 */
//    function registerMediaPlugin(newMediaPlugin, successCallback, failureCallback, execId){
//    	TODO move code from loadPlugin here:
//    	* export this as MediaManager.registerPlugin
//    	* media-plugins should call registerPlugin on MediaManager (instead of creating object newMediaPlugin)
//    	* open problem: how can success-callback for MediaManager-initialization be handled this way? (should be called after all plugins have themselves initialized)
//    }
    
    /**
     * @constructs MediaManager
     * @memberOf MediaManager.prototype
     * @private
     * @ignore
     */
    function constructor(){
    	
    	/**
    	 * map of listeners: 
    	 * 		event(String) -&gt; listener(Function)
    	 * 
		 * @private
    	 * @memberOf MediaManager.prototype
    	 */
    	var listener = new Dictionary();
    	
    	/**
    	 * map of listener-observers:
    	 *  observers get notified if a listener for event X gets added/removed
    	 * 
		 * @private
    	 * @memberOf MediaManager.prototype
    	 */
    	var listenerObserver = new Dictionary();
    	
		/** 
		 * exported as addListener() and on()
		 * 
		 * @private
		 * @memberOf MediaManager.prototype
		 */
    	var addListenerImpl = function(eventName, eventHandler){
			var list = listener.get(eventName);
			if(!list){
				list = [eventHandler];
				listener.put(eventName, list);
			}
			else {
				list.push(eventHandler);
			}

			//notify listener-observers for this event-type
			this._notifyObservers(eventName, 'added', eventHandler);
		};
		/**
		 * exported as removeListener() and off()
		 *  
		 * @private
		 * @memberOf MediaManager.prototype
		 */
    	var removeListenerImpl = function(eventName, eventHandler){
			var isRemoved = false;
			var list = listener.get(eventName);
			if(list){
				var size = list.length;
				for(var i = size - 1; i >= 0; --i){
					if(list[i] ===  eventHandler){
						
						//move all handlers after i by 1 index-position ahead:
						for(var j = size - 1; j > i; --j){
							list[j-1] = list[j];
						}
						//remove last array-element
						list.splice(size-1, 1);
						
						//notify listener-observers for this event-type
						this._notifyObservers(eventName, 'removed', eventHandler);
						
						isRemoved = true;
						break;
					}
				}
			}
			return isRemoved;
		};
		
		
		/**
		 * The logger for the MediaManager.
		 * 
		 * Exported as <code>_log</code> by the MediaManager instance.
		 * 
		 * @private
		 * @memberOf MediaManager.prototype
		 */
		var logger = Logger.create(module);//initialize with requirejs-module information
		

		/**
		 * Default execution context for functions:
		 * 
		 * if not <code>falsy</code>, then functions will be executed in this context by default.
		 * 
		 * @private
		 * @type String
		 * @memberOf MediaManager.prototype
		 */
		var defaultExecId = void(0);
    	
    	/** @lends mmir.MediaManager.prototype */
    	return {
    			
    			/**
    			 * A logger for the MediaManager and its plugins/modules.
    			 * 
    			 * <p>
    			 * This logger MAY be used by media-plugins and / or tools and helpers
    			 * related to the MediaManager.
    			 * 
    			 * <p>
    			 * This logger SHOULD NOT be used by "code" that non-related to the
    			 * MediaManager 
    			 * 
				 * @name _log
				 * @type mmir.Logger
				 * @default mmir.Logger (logger instance for mmir.MediaManager)
				 * @public
				 * 
				 * @memberOf mmir.MediaManager#
    			 */
    			_log: logger,
    			
    			/**
    			 * Execution context for plugins
    			 * 
    			 * TODO add doc
    			 * 
				 * @name ctx
				 * @type mmir.Logger
				 * @default Object (empty context, i.e. plugins are loaded into the "root context", and no plugins loaded into the execution context)
				 * @public
				 * 
				 * @memberOf mmir.MediaManager#
    			 */
    			ctx: {},
    			
    			/**
    			 * Wait indicator, e.g. for speech input:
    			 * <p>
    			 * provides 2 functions:<br>
    			 * 
    			 * <code>preparing()</code>: if called, the implementation indicates that the "user should wait"<br>
    			 * <code>ready()</code>: if called, the implementation stops indicating that the "user should wait" (i.e. that the system is ready for user input now)<br>
    			 * 
    			 * <p>
    			 * If not set (or functions are not available) will do nothing
    			 * 
    			 * @type mmir.env.media.IWaitReadyIndicator
    			 * @memberOf mmir.MediaManager#
    			 * 
    			 * @default Object (no implementation set)
    			 * 
    			 * @see #_preparing
    			 * @see #_ready
    			 * 
    			 * @example
    			 * //define custom wait/ready implementation:
    			 * var impl = {
    			 * 	preparing: function(str){
    			 * 		console.log('Media module '+str+' is preparing...');
    			 * 	},
    			 * 	ready: function(str){
    			 * 		console.log('Media module '+str+' is ready now!');
    			 * 	}
    			 * };
    			 * 
    			 * //configure MediaManager to use custom implementation:
    			 * mmir.MediaManager.waitReadyImpl = impl;
    			 * 
    			 * //-> now plugins that call  mmir.MediaManager._preparing() and  mmir.MediaManager._ready()
    			 * //   will invoke the custom implementation's functions.
    			 */
    			waitReadyImpl: {},
    		
    			//TODO add API documentation
    		
    			//... these are the standard audioInput procedures, that should be implemented by a loaded file
    		
///////////////////////////// audio input API: /////////////////////////////
	    		/**
	    		 * Start speech recognition with <em>end-of-speech</em> detection:
	    		 * 
	    		 * the recognizer automatically tries to detect when speech has finished and then
	    		 * triggers the callback with the result.
	    		 * 
	    		 * @async
	    		 * 
	    		 * @param {Function} [successCallBack] OPTIONAL
	    		 * 			callback function that is triggered when a text result is available.
	    		 * 			The callback signature is:
	    		 * 				<code>callback(textResult)</code>
	    		 * @param {Function} [failureCallBack] OPTIONAL
	    		 * 			callback function that is triggered when an error occurred.
	    		 * 			The callback signature is:
	    		 * 				<code>callback(error)</code> 
	    		 */
    			recognize: function(successCallBack, failureCallBack){
    				if(failureCallBack){
    					failureCallBack("Audio Input: Speech Recognition is not supported.");
    				}
    				else {
    					console.error("Audio Input: Speech Recognition is not supported.");
    				}
    			},
    			/**
	    		 * Start continuous speech recognition:
	    		 * 
	    		 * The recognizer continues until {@link #stopRecord} is called.
	    		 * 
	    		 * <p>
	    		 * If <code>isWithIntermediateResults</code> is used, the recognizer may
	    		 * invoke the callback with intermediate recognition results.
	    		 * 
	    		 * TODO specify whether stopRecord should return the "gathered" intermediate results, or just the last one
	    		 * 
	    		 * NOTE that not all implementation may support this feature.
	    		 * 
	    		 * @async
	    		 * 
	    		 * @param {Function} [successCallBack] OPTIONAL
	    		 * 			callback function that is triggered when a text result is available.
	    		 * 			The callback signature is:
	    		 * 				<code>callback(textResult)</code>
	    		 * @param {Function} [failureCallBack] OPTIONAL
	    		 * 			callback function that is triggered when an error occurred.
	    		 * 			The callback signature is:
	    		 * 				<code>callback(error)</code>
	    		 * @param {Boolean} [isWithIntermediateResults] OPTIONAL
	    		 * 			if <code>true</code>, the recognizer will return intermediate results
	    		 * 			by invoking the successCallback
	    		 * 
	    		 * @see #stopRecord
	    		 */
    			startRecord: function(successCallBack,failureCallBack, isWithIntermediateResults){
    				if(failureCallBack){
    					failureCallBack("Audio Input: Speech Recognition (recording) is not supported.");
    				}
    				else {
    					console.error("Audio Input: Speech Recognition (recording) is not supported.");
    				}
    			},
    			/**
	    		 * Stops continuous speech recognition:
	    		 * 
	    		 * After {@link #startRecord} was called, invoking this function will stop the recognition
	    		 * process and return the result by invoking the <code>succesCallback</code>.
	    		 * 
	    		 * TODO specify whether stopRecord should return the "gathered" intermediate results, or just the last one
	    		 * 
	    		 * @async
	    		 * 
	    		 * @param {Function} [successCallBack] OPTIONAL
	    		 * 			callback function that is triggered when a text result is available.
	    		 * 			The callback signature is:
	    		 * 				<code>callback(textResult)</code>
	    		 * @param {Function} [failureCallBack] OPTIONAL
	    		 * 			callback function that is triggered when an error occurred.
	    		 * 			The callback signature is:
	    		 * 				<code>callback(error)</code>
	    		 * 
	    		 * @see #startRecord
	    		 */
    			stopRecord: function(successCallBack,failureCallBack){
    				if(failureCallBack){
    					failureCallBack("Audio Input: Speech Recognition (recording) is not supported.");
    				}
    				else {
    					console.error("Audio Input: Speech Recognition (recording) is not supported.");
    				}
    	   		},

    	   		/**
    	   		 * Cancel currently active speech recognition.
    	   		 * 
    	   		 * Has no effect, if no recognition is active.
    	   		 */
    			cancelRecognition: function(successCallBack,failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: canceling Recognize Speech is not supported.");
    				}
    				else {
    					console.error("Audio Output: canceling Recognize Speech is not supported.");
    				}
    			},
///////////////////////////// audio output API: /////////////////////////////
    	   		
    			/**
    			 * Play PCM audio data.
    			 */
    	   		playWAV: function(blob, onPlayedCallback, failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: play WAV audio is not supported.");
    				}
    				else {
    					console.error("Audio Output: play WAV audio is not supported.");
    				}
    			},
    			/**
    			 * Play audio file from the specified URL.
    			 */
    			playURL: function(url, onPlayedCallback, failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: play audio from URL is not supported.");
    				}
    				else {
    					console.error("Audio Output: play audio from URL is not supported.");
    				}
    			},
    			/**
    			 * Get an audio object for the audio file specified by URL.
    			 * 
    			 * The audio object exports the following functions:
    			 * 
    			 * <pre>
    			 * play()
    			 * stop()
    			 * release()
    			 * enable()
    			 * disable()
    			 * setVolume(number)
    			 * getDuration()
    			 * isPaused()
    			 * isEnabled()
    			 * </pre>
    			 * 
    			 * NOTE: the audio object should only be used, after the <code>onLoadedCallback</code>
    			 *       was triggered.
    			 * 
    			 * @param {String} url
    			 * @param {Function} [onPlayedCallback] OPTIONAL
    			 * @param {Function} [failureCallBack] OPTIONAL
    			 * @param {Function} [onLoadedCallBack] OPTIONAL
    			 * 
    			 * @returns {mmir.env.media.IAudio} the audio
    			 * 
    			 * @see {mmir.env.media.IAudio#_constructor}
    			 */
    			getURLAsAudio: function(url, onPlayedCallback, failureCallBack, onLoadedCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: create audio from URL is not supported.");
    				}
    				else {
    					console.error("Audio Output: create audio from URL is not supported.");
    				}
    			},
    			/**
    			 * Get an empty audio object. This can be used as dummy or placeholder
    			 * for a "real" audio object.
    			 * 
    			 * The audio object exports the following functions:
    			 * 
    			 * <pre>
    			 * play()
    			 * stop()
    			 * release()
    			 * enable()
    			 * disable()
    			 * setVolume(number)
    			 * getDuration()
    			 * isPaused()
    			 * isEnabled()
    			 * </pre>
    			 * 
    			 * Note:
    			 * 
    			 * <code>enable()</code> and <code>disable()</code> will set the internal
    			 * enabled-state, which can be queried via <code>isEnabled()</code>.
    			 * 
    			 * <code>play()</code> and <code>stop()</code> will set the internal 
    			 * playing-state, which can be queried via <code>isPaused()</code>
    			 * (note however, that this empty audio does not actually play anything.
    			 * 
    			 * <code>setVolume()</code> sets the internal volume-value.
    			 * 
    			 * <code>getDuration()</code> will always return <code>0</code>.
    			 * 
    			 * 
    			 * @returns {mmir.env.media.IAudio} the audio
    			 * 
    			 * @see {mmir.env.media.IAudio#_constructor}
				 */
				createEmptyAudio: function(){
					return {
						_enabled: true,
						_play: false,
						_volume: 1,
						play: function(){ this._play = true; },
						stop: function(){ this._play = true; },
						enable: function(){ this._enabled = true; },
						disable: function(){ this._enabled = false; },
						release: function(){ this._enabled = false; },
						setVolume: function(vol){ this._volume = vol; },
						getDuration: function(){ return 0; },
						isPaused: function(){ return !this._play; },
						isEnabled: function(){ return this._enabled; }
					};
				},
///////////////////////////// text-to-speech API: /////////////////////////////
    			
    			/**
    			 * Synthesizes ("read out loud") text.
    			 * 
    			 * @param {String|Array<String>|PlainObject} parameter
    			 * 		if <code>String</code> or <code>Array</code> of <code>String</code>s
    			 * 			  synthesizes the text of the String, for an Array: each entry is interpreted as "sentence";
    			 * 				after each sentence, a short pause is inserted before synthesizing the
    			 * 				the next sentence<br>
    			 * 		for a <code>PlainObject</code>, the following properties should be used:
    			 * 		<pre>{
    			 * 			  text: string OR string Array, text that should be read aloud
    			 * 			, pauseLength: OPTIONAL Length of the pauses between sentences in milliseconds
    			 * 			, forceSingleSentence: OPTIONAL boolean, if true, a string Array will be turned into a single string
    			 * 			, split: OPTIONAL boolean, if true and the text is a single string, it will be split using a splitter function
    			 * 			, splitter: OPTIONAL function, replaces the default splitter-function. It takes a simple string as input and gives a string Array as output
    			 * 		}</pre>
    			 */
    			textToSpeech: function(parameter, onPlayedCallback, failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: Text To Speech is not supported.");
    				}
    				else {
    					console.error("Audio Output: Text To Speech is not supported.");
    				}
    			},
    			/**
    			 * Cancel current synthesis.
    			 */
    			cancelSpeech: function(successCallBack,failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: canceling Text To Speech is not supported.");
    				}
    				else {
    					console.error("Audio Output: canceling Text To Speech is not supported.");
    				}
    			},
    			
///////////////////////////// ADDITIONAL (optional) functions: ///////////////////////////// 
    			/**
    			 * Set the volume for the speech synthesis (text-to-speech).
    			 * 
    			 * @param {Number} newValue
    			 * 				TODO specify format / range
    			 */
    			setTextToSpeechVolume: function(newValue){
    				console.error("Audio Output: set volume for Text To Speech is not supported.");
				}
    			

///////////////////////////// MediaManager "managing" functions: ///////////////////////////// 
    			/**
    	    	 * Adds the handler-function for the event.
    	    	 * 
    	    	 * This function calls {@link #_notifyObservers} for the eventName with
    	    	 * <code>actionType "added"</code>.
    	    	 * 
    	    	 * 
    	    	 * Event names (and firing events) are specific to the loaded media plugins.
    	    	 * 
    	    	 * TODO list events that the default media-plugins support
    	    	 *   * "miclevelchanged": fired by AudioInput plugins that support querying the microphone (audio input) levels
    	    	 * 
    	    	 * A plugin can tigger / fire events using the helper {@link #_fireEvent}
    	    	 * of the MediaManager.
    	    	 * 
    	    	 * 
    	    	 * Media plugins may observe registration / removal of listeners
    	    	 * via {@link #_addListenerObserver} and {@link #_removeListenerObserver}.
    	    	 * Or get and iterate over listeners via {@link #getListeners}.
    	    	 * 
    	    	 * 
    	    	 * 
    	    	 * 
    	    	 * @param {String} eventName
    	    	 * @param {Function} eventHandler
    	    	 * 
    	    	 * @function
    	    	 */
    			, addListener: addListenerImpl
    			/**
    	    	 * Removes the handler-function for the event.
    	    	 * 
    	    	 * Calls {@link #_notifyObservers} for the eventName with
    	    	 * <code>actionType "removed"</code>, if the handler
    	    	 * was actually removed.
    	    	 * 
    	    	 * @param {String} eventName
    	    	 * @param {Function} eventHandler
    	    	 * 
    	    	 * @returns {Boolean}
    	    	 * 		<code>true</code> if the handler function was actually 
    	    	 * 		removed, and <code>false</code> otherwise.
    	    	 * 
    	    	 * @function
    	    	 */
    			, removeListener: removeListenerImpl
    			/** 
    			 * @function
    			 * @see #addListener
    			 */
    			, on:addListenerImpl
    			/** 
    			 * @function
    			 * @see #removeListener
    			 */
    			, off: removeListenerImpl
    			/**
    			 * Get list of registered listeners / handlers for an event.
    			 * 
    			 * @returns {Array<Function>} of event-handlers. 
    			 * 				Empty, if there are no event handlers for eventName
    			 */
    			, getListeners: function(eventName){
    				var list = listener.get(eventName);
    				if(list && list.length){
    					//return copy of listener-list
    					return list.slice(0,list.length);
    				}
    				return [];
    			}
    			/**
    			 * Check if at least one listener / handler is  registered for the event.
    			 * 
    			 * @returns {Boolean} <code>true</code> if at least 1 handler is registered 
    			 * 					  for eventName; otherwise <code>false</code>.
    			 */
    			, hasListeners: function(eventName){
    				var list = listener.get(eventName);
    				return list && list.length > 0;
    			}
    			/**
    			 * Helper for firing / triggering an event.
    			 * This should only be used by media plugins (that handle the eventName).
    			 * 
    	    	 * @param {String} eventName
    	    	 * @param {Array} argsArray
    	    	 * 					the list of arguments with which the event-handlers
    	    	 * 					will be called.
    	    	 * @protected
    			 */
    			, _fireEvent: function(eventName, argsArray){
    				var list = listener.get(eventName);
    				if(list && list.length){
    					for(var i=0, size = list.length; i < size; ++i){
    						list[i].apply(this, argsArray);
    					}
    				}
    			}
    			/** 
    			 * Helper for notifying listener-observers about changes (adding/removing listeners).
    			 * This should only be used by media plugins (that handle the eventName).
    			 * 
    			 * @param {String} eventName
    			 * @param {String} actionType
    			 * 					the change-type that occurred for the event/event-handler:
    			 * 					one of <code>["added" | "removed"]</code>.
    	    	 * @param {Function} eventHandler
    	    	 * 					the event-handler function that has changed.
    	    	 * 
    			 * @protected
    			 */
    			, _notifyObservers: function(eventName, actionType, eventHandler){//actionType: one of "added" | "removed"
    				var list = listenerObserver.get(eventName);
    				if(list && list.length){
    					for(var i=0, size = list.length; i < size; ++i){
    						list[i](actionType,eventHandler);
    					}
    				}
    			}
    			/**
    			 * Add an observer for registration / removal of event-handler.
    			 * 
    			 * The observer gets notified,when handlers are registered / removed for the event.
    			 * 
    			 * The observer-callback function will be called with the following
    			 * arguments
    			 * 
    			 * <code>(eventName, ACTION_TYPE, eventHandler)</code>
    			 * where
    			 * <ul>
    			 *  <li>eventName: String the name of the event that should be observed</li>
    			 *  <li>ACTION_TYPE: the type of action: "added" if the handler was 
    			 *      registered for the event, "removed" if the the handler was removed
    			 *  </li>
    			 *  <li>eventHandler: the handler function that was registered or removed</li>
    			 * </ul> 
    			 * 
    	    	 * @param {String} eventName
    	    	 * @param {Function} observerCallback
    			 */
    			, _addListenerObserver: function(eventName, observerCallback){
    				var list = listenerObserver.get(eventName);
    				if(!list){
    					list = [observerCallback];
    					listenerObserver.put(eventName, list);
    				}
    				else {
    					list.push(observerCallback);
    				}
    			}
    			
    			, _removeListenerObserver: function(eventName, observerCallback){
    				var isRemoved = false;
    				var list = listenerObserver.get(eventName);
    				if(list){
    					var size = list.length;
    					for(var i = size - 1; i >= 0; --i){
    						if(list[i] ===  observerCallback){
    							
    							//move all handlers after i by 1 index-position ahead:
    							for(var j = size - 1; j > i; --j){
    								list[j-1] = list[j];
    							}
    							//remove last array-element
    							list.splice(size-1, 1);
    							
    							isRemoved = true;
    							break;
    						}
    					}
    				}
    				return isRemoved;
    			}
    			/**
    			 * Executes function <code>funcName</code> in "sub-module" <code>ctx</code>
    			 * with arguments <code>args</code>.
    			 * 
    			 * <p>
    			 * If there is no <code>funcName</code> in "sub-module" <code>ctx</code>,
    			 * then <code>funcName</code> from the "main-module" (i.e. from the MediaManager
    			 * instance itself) will be used.
    			 * 
    			 * @param {String} ctx
    			 * 			the execution context, i.e. "sub-module", in which to execute funcName.<br>
    			 * 			If <code>falsy</code>, the "root-module" will used as execution context.
    			 * @param {String} funcName
    			 * 			the function name
    			 * @param {Array} args
    			 * 			the arguments for function "packaged" in an array
    			 * 
    			 * @throws {ReferenceError}
    			 * 			if <code>funcName</code> does not exist in the requested Execution context.<br>
    			 * 			Or if <code>ctx</code> is not <code>falsy</code> but there is no valid execution
    			 * 			context <code>ctx</code> in MediaManager.
    			 * 
    			 * @example
    			 * 
    			 *  //same as mmir.MediaManager.ctx.android.textToSpeech("...", function...):
    			 * 	mmir.MediaManager.perform("android", "textToSpeech", ["some text to read out loud",
    			 * 		function onFinished(){ console.log("finished reading."); }
    			 * 	]);
    			 * 
    			 *  //same as mmir.MediaManager.textToSpeech("...", function...)
    			 *  //... IF the defaultExecId is falsy 
    			 *  //    (i.e. un-changed or set to falsy value via setDefaultExec())
    			 * 	mmir.MediaManager.perform(null, "textToSpeech", ["some text to read out loud",
    			 * 		function onFinished(){ console.log("finished reading."); }
    			 * 	]);
    			 * 
    			 */
    			, perform: function(ctx, funcName, args){
    				
    				var func;
    				
    				if(!ctx){
    					
    					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
    						func =  this.ctx[defaultExecId][funcName];
    					}
    					
        				
    				}
    				else if(ctx && typeof this.ctx[ctx] !== 'undefined') {

        				if(typeof this.ctx[ctx][funcName] !== 'undefined') {
        					func = this.ctx[ctx][funcName];
        				}
        				
    				} else {
    					throw new ReferenceError('There is no context for "'+ctx+'" in MediaManager.ctx!');///////////////////////////// EARLY EXIT ////////////////////
    				}
    				
    				
    				if(!func){
						func = this[funcName];
    				}
    				
    				
    				if(typeof func === 'undefined'){
    					throw new ReferenceError('There is no function '+funcName+' in MediaManager'+(ctx? ' context ' + ctx : (defaultExecId? ' default context ' + defaultExecId : '')) + '!');///////////////////////////// EARLY EXIT ////////////////////
    				}
    				
    				return func.apply(this, args);
    			}
    			/**
    			 * Returns function <code>funcName</code> from "sub-module" <code>ctx</code>.
    			 * 
    			 * <p>
    			 * If there is no <code>funcName</code> in "sub-module" <code>ctx</code>,
    			 * then <code>funcName</code> from the "main-module" (i.e. from the MediaManager
    			 * instance itself) will be returned.
    			 * 
    			 * <p>
    			 * NOTE that the returned functions will always execute within the context of the
    			 * MediaManager instance (i.e. <code>this</code> will refer to the MediaManager instance).
    			 * 
    			 * 
    			 * @param {String} ctx
    			 * 			the execution context, i.e. "sub-module", in which to execute funcName.<br>
    			 * 			If <code>falsy</code>, the "root-module" will used as execution context.
    			 * @param {String} funcName
    			 * 			the function name
    			 * 
    			 * @throws {ReferenceError}
    			 * 			if <code>funcName</code> does not exist in the requested Execution context.<br>
    			 * 			Or if <code>ctx</code> is not <code>falsy</code> but there is no valid execution
    			 * 			context <code>ctx</code> in MediaManager.
    			 * 
    			 * @example
    			 * 
    			 *  //same as mmir.MediaManager.ctx.android.textToSpeech("...", function...):
    			 * 	mmir.MediaManager.getFunc("android", "textToSpeech")("some text to read out loud",
    			 * 		function onFinished(){ console.log("finished reading."); }
    			 * 	);
    			 * 
    			 *  //same as mmir.MediaManager.textToSpeech("...", function...):
    			 *  //... IF the defaultExecId is falsy 
    			 *  //    (i.e. un-changed or set to falsy value via setDefaultExec())
    			 * 	mmir.MediaManager.getFunc(null, "textToSpeech")("some text to read out loud",
    			 * 		function onFinished(){ console.log("finished reading."); }
    			 * 	);
    			 * 
    			 */
    			, getFunc: function(ctx, funcName){//this function performs worse for the "root execution" context, than perform(), since an additional wrapper function must be created
    				
    				var isRoot = false;
    				
    				if(!ctx){
    					
    					if(!defaultExecId){
    						isRoot = true;
    					}
    					else {
    						if(typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
    							return this.ctx[defaultExecId][funcName];/////////// EARLY EXIT //////////////////
    						}
    						else {
        						isRoot = true;
    						}
    					}
    				}
    				
    				if(ctx && typeof this.ctx[ctx] !== 'undefined'){
	    				if(!isRoot && typeof this.ctx[ctx][funcName] !== 'undefined'){
	    					return this.ctx[ctx][funcName];///////////////////////////// EARLY EXIT ////////////////////
	    				}
    				}
    				else {
        				throw new ReferenceError('There is no context for "'+ctx+'" in MediaManager.ctx!');///////////////////////////// EARLY EXIT ////////////////////
    				}
    				
    				//-> return the implementation of the "root execution context"
    				
    				if(typeof instance[funcName] === 'undefined'){
    					throw new ReferenceError('There is no function '+funcName+' in MediaManager'+(ctx? ' context ' + ctx : (defaultExecId? ' default context ' + defaultExecId : '')) + '!');///////////////////////////// EARLY EXIT ////////////////////
    				}
    				
					//need to create proxy function, in order to preserve correct execution context
					// (i.e. the MediaManager instance)
					return function() {
						return instance[funcName].apply(instance, arguments);
					};
    				
    			},
    			/**
    			 * Set the default execution context.
    			 * 
    			 * If not explicitly set, or set to a <code>falsy</code> value,
    			 * then the "root" execution context is the default context.
    			 * 
    			 * @param {String} ctxId
    			 * 		the new default excution context for loaded media modules
    			 * 		(if <code>falsy</code> the default context will be the "root context")
    			 * 
    			 * @throws {ReferenceError}
    			 * 			if <code>ctxId</code> is no valid context
    			 * 
    			 * @example
    			 * 
    			 * //if context "nuance" exists:
    			 * mmir.MediaManager.setDefaultCtx("nuance")
    			 * 
    			 * // -> now the following calls are equal to mmir.MediaManager.ctx.nuance.textToSpeech("some text")
    			 * mmir.MediaManager.perform(null, "textToSpeech", ["some text"]);
    			 * mmir.MediaManager.getFunc(null, "textToSpeech")("some text");
    			 * 
    			 * //reset to root context:
    			 * mmir.MediaManager.setDefaultCtx("nuance");
    			 * 
    			 * // -> now the following call is equal to mmir.MediaManager.textToSpeech("some text") again
    			 * mmir.MediaManager.perform("textToSpeech", ["some text"]);
    			 * 
    			 */
    			setDefaultCtx: function(ctxId){
    				if(ctxId && typeof instance.ctx[ctxId] === 'undefined'){
    					throw new ReferenceError('There is no context for "'+ctxId+'" in MediaManager.ctx!');///////////////////////////// EARLY EXIT ////////////////////
    				}
    				defaultExecId = ctxId;
    			},
    			/**
    	    	 * This function is called by media plugin implementations (i.e. modules)
    	    	 * to indicate that they are preparing something and that the user should
    	    	 * wait.
    	    	 * 
    	    	 * <p>
    	    	 * The actual implementation for <code>_preparing(String)</code> is given by
    	    	 * {@link #waitReadyImpl}.preparing (if not set, then calling <code>_preparing(String)</code>
    	    	 * will have no effect.
    	    	 * 
    	    	 * @param {String} moduleName
    	    	 * 			the module name from which the function was invoked
    	    	 * 
    	    	 * @function
    	    	 * @protected
    	    	 * 
    	    	 * @see #waitReadyImpl
    	    	 * @see #_ready
    	    	 */
    			_preparing: function(moduleName){
    				if(this.waitReadyImpl && this.waitReadyImpl.preparing){
    					this.waitReadyImpl.preparing(moduleName);
    				}
    			},
    			/**
    	    	 * This function is called by media plugin implementations (i.e. modules)
    	    	 * to indicate that they are now ready and that the user can start interacting.
    	    	 * 
    	    	 * <p>
    	    	 * The actual implementation for <code>_ready(String)</code> is given by the
    	    	 * {@link #waitReadyImpl} implementation (if not set, then calling <code>_ready(String)</code>
    	    	 * will have no effect.
    	    	 * 
    	    	 * @param {String} moduleName
    	    	 * 			the module name from which the function was invoked
    	    	 * 
    	    	 * @function
    	    	 * @protected
    	    	 * 
    	    	 * @see #waitReadyImpl
    	    	 * @see #_ready
    	    	 */
    			_ready: function(moduleName){
    				if(this.waitReadyImpl && this.waitReadyImpl.ready){
    					this.waitReadyImpl.ready(moduleName);
    				}
    			}
    			
    	};//END: return{...
    	
    };//END: constructor(){...
    
    
    //has 2 default configuarions:
    // if isCordovaEnvironment TRUE: use 'cordova' config
    // if FALSEy: use 'browser' config
    //
    // NOTE: this setting/paramater is overwritten, if the configuration has a property 'mediaPlugins' set!!!
    /**
     * HELPER for init-function:
     * 	determines, which plugins (i.e. files) should be loaded.
     * 
     * <p>
     * has 2 default configuarions:<br>
     * if isCordovaEnvironment TRUE: use 'cordova' config<br>
     * if FALSEy: use 'browser' config
     * <p>
     * OR<br>
     * loads the list for the current environment (cordova or browser) that is set in configuration.json via <br>
     * <pre>
     * "mediaManager": {
     * 		"cordova": [...],
     * 		"browser": [...]
     * } 
     * </pre>
     * 
     * <p>
     * Each entry may either be a String (file name of the plugin) or an Object with
     * properties
     * <pre>
     * 	mod: <file name for the module> //String
     * 	ctx: <an ID for the module>     //String
     * </pre>
     * 
     * If <b>String</b>: the functions of the loaded plugin will be attached to the MediaManager instance:
     * <code>mmir.MediaManager.thefunction()</code>
     * <br>
     * If <b>{mod: plugin,ctx: theContextId}</b>: the functions of the loaded plugin will be attached to the "sub-module"
     * to the MediaManager instance <em>(NOTE the execution context of the function will remain within 
     * the MediaManager instance, i.e. <code>this</code> will still refer to the MediaManager instance)</em>:
     * <code>mmir.MediaManager.theId.thefunction()</code>
     * 
     * <p>
     * If plugins are loaded with an ID, you can use 
     * <code>mmir.MediaManager.getFunc(ctxId, func)(the, arguments)</code> or
     * <code>mmir.MediaManager.perform(ctxId, func, [the, arguments])</code>:
     * If the "sub-module" ctxId does not have the function func (i.e. no MediaManager.ctx.ctxId.func exists), then the default function
     * in MediaManager will be executed (i.e.  MediaManager.func(the, arguments) ).
     * 
     * 
     * @returns {Array<String>}
     * 				the list of plugins which should be loaded
     * 
	 * @private
	 * @memberOf mmir.MediaManager#
     */
    function getPluginsToLoad(configurationName){//if configurationName is omitted, then it is automatically detected
    	
    	var env = configurationName;
    	var pluginArray = [];

    	var dataFromConfig = configurationManager.get('mediaManager.plugins', true);
    	
    	if(!env){
    		
    		var envSetting = constants.getEnv();
    		if(envSetting === 'cordova'){
    			
    			//try to find config for specific cordova-env
    			envSetting = constants.getEnvPlatform();
    			if(envSetting !== 'default'){
    				
    				//if there is a config present for the specific envSetting, then use it:
    				if((dataFromConfig && dataFromConfig[envSetting]) || _defaultPlugins[envSetting]){
    	    			//if there is a config present for the envSetting, then use it:
    					env = envSetting;
    				}
    				
    			}
    			
    		} else if(dataFromConfig && dataFromConfig[envSetting]){
    			//if there is a non-default config present for the envSetting, then use it
    			//  if there is a deault config, then the env will also be a default one 
    			//  -> this will be detected by default-detection-mechanism below
				env = envSetting;
			}
    		
    		//if there is no env value yet, use default criteria browser vs. cordova env:
    		if(!env){
    			
	    		var isCordovaEnvironment = ! constants.isBrowserEnv();
	        	if (isCordovaEnvironment) {
	        		env = 'cordova';
	        	} else {
	        		env = 'browser';
	        	}
    		}
    		
    		//ASSERT env is non-empty String
    	}
        
    	if (dataFromConfig && dataFromConfig[env]){
    		pluginArray = pluginArray.concat(dataFromConfig[env]);
    	} else{
    		pluginArray = pluginArray.concat(_defaultPlugins[env]);
    	}
    	
    	return pluginArray;
    }
    /**
     * 
	 * @private
	 * @memberOf mmir.MediaManager#
     */
    function loadAllPlugins(pluginArray, successCallback,failureCallback){
    	
    	if (pluginArray == null || pluginArray.length<1){
    		if (successCallback) {
    			successCallback();
    		}
    		return;
    	}
    	
    	var ctxId;
    	var newPluginName = pluginArray.pop();
    	if(newPluginName.ctx && newPluginName.mod){
    		ctxId = newPluginName.ctx;
    		newPluginName = newPluginName.mod;
    	}
    	
    	loadPlugin(newPluginName, function (){
    		console.log(newPluginName+' loaded!');
    		loadAllPlugins(pluginArray,successCallback, failureCallback);},
    		failureCallback,
    		ctxId
    	);
    }
    	
    
    var _stub = {
    	
    	/** @scope MediaManager.prototype */
    	
    	//TODO add for backwards compatibility?:
//    	create : function(){ return this.init.apply(this, arguments); },
    	
        /**
         * Object containing the instance of the class {{#crossLink "audioInput"}}{{/crossLink}} 
         * 
         * If <em>listenerList</em> is provided, each listener will be registered after the instance
         * is initialized, but before media-plugins (i.e. environment specfific implementations) are
         * loaded.
         * Each entry in the <em>listenerList</em> must have fields <tt>name</tt> (String) and
         * <tt>listener</tt> (Function), where
         * <br>
         * name: is the name of the event
         * <br>
         * listener: is the listener implementation (the signature/arguments of the listener function depends
         * 			 on the specific event for which the listener will be registered)
         *  
         * 
         * @method init
         * @param {Function} [successCallback] OPTIONAL
         * 				 callback that gets triggered after the MediaManager instance has been initialized.
         * @param {Function} [failureCallback] OPTIONAL
         * 				 a failure callback that gets triggered if an error occurs during initialization.
         * @param {Array<Object>} [listenerList] OPTIONAL
         * 				 a list of listeners that should be registered, where each entry is an Object
         * 				 with properties:
         * 				 <pre>
         * 					{
         * 						name: String the event name,
         * 						listener: Function the handler function
         * 					}
         * 				 </pre>
         * @return {Object}
         * 				an Deferred object that gets resolved, after the {@link mmir.MediaManager}
         * 				has been initialized.
         * @public
         * 
         * @memberOf mmir.MediaManager.prototype
         * 
         */
        init: function(successCallback, failureCallback, listenerList){
        	
        	var defer = jQuery.Deferred();
        	var deferredSuccess = function(){
    			defer.resolve();
    		};
        	var deferredFailure = function(){
    			defer.reject();
    		};
        	
    		
        	if(successCallback){
        		defer.done(successCallback);
        	}
        	
        	if(deferredFailure){
        		defer.fail(failureCallback);
        	}
        	
        	
            if (instance === null) {
            	jQuery.extend(true,this,constructor());
                instance = this;
                
                if(listenerList){
                	for(var i=0, size = listenerList.length; i < size; ++i){
                		instance.addListener(listenerList[i].name, listenerList[i].listener);
                	}
                }
                
            	var pluginConfig = getPluginsToLoad();
                loadAllPlugins(pluginConfig,deferredSuccess, deferredFailure);

            }
            else if(listenerList){
            	for(var i=0, size = listenerList.length; i < size; ++i){
            		instance.addListener(listenerList[i].name, listenerList[i].listener);
            	}
            }
            
            return defer.promise(this);
        },
        /**
         * Same as {@link #init}.
         * 
         * @deprecated access MediaManger directly via <code>mmir.MediaManager.someFunction</code> - <em>&tl;internal: for initialization use <code>init()</code> instead&gt;</em>
         * 
         * @function
         * @public
         * @memberOf mmir.MediaManager.prototype
         */
        getInstance: function(){
            return this.init(null, null);
        },
        /**
         * loads a file. If the file implements a function initialize(f)
         * where the function f is called with a set of functions e, then those functions in e 
         * are added to the visibility of audioInput, and will from now on be applicable by calling
         * mmir.MediaManager.<function name>().
         * 
         * @deprecated do not use.
         * @function
         * @protected
         * @memberOf mmir.MediaManager.prototype
         * 
         */
    	loadFile: function(filePath,successCallback, failureCallback, execId){
    		if (instance=== null) {
    			this.init();
    		}
    		
    		loadPlugin(filePath,sucessCallback, failureCallback, execId);
			
    	}
    };
    
    return _stub;
    
});//END: define(..., function(){...
