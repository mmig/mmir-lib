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



define(['jquery', 'constants', 'commonUtils', 'configurationManager', 'dictionary'],
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
	 * @exports MediaManager as mmir.MediaManager
	 * @static
	 * 
	 * @depends jQuery.extend
	 * @depends jQuery.Deferred
	 * 
	 * TODO remove / change dependency on forBrowser: constants.isBrowserEnv()!!!
	 */
	function(
		jQuery, constants, commonUtils, configurationManager, Dictionary
){
	//next 2 comments are needed by JSDoc so that all functions etc. can
	// be mapped to the correct class description
	/** @scope mmir.MediaManager.prototype */
	/**
	 * #@+
	 * @memberOf mmir.MediaManager.prototype 
	 */

    var instance = null;
    
    //default configuration for env-settings "browser" and "cordova":
    //
    // -> may be overwritten by settings in the configuration file.
    // e.g. adding the following JSON data to config/configuration.json:
    //
	//    "mediaManager": {
	//    	"plugins": {
	//    		"browser": ["html5AudioOutput.js",
	//    		            "html5AudioInput.js",
	//    		            "maryTextToSpeech.js"
	//    		],
	//    		"cordova": ["cordovaAudioOutput.js",
	//    		            "nuanceAudioInput.js",
	//    		            "nativeTextToSpeech.js"
	//    		]
	//    	}
	//    }
    var pluginsToLoad = {
    		'browser': ['html5AudioOutput.js',
    		            'html5AudioInput.js',
    		            'maryTextToSpeech.js'
    		],
    		'cordova': ['cordovaAudioOutput.js',
    		            'nuanceAudioInput.js',
    		            'nativeTextToSpeech.js'
    		]
    };
    
    var loadPlugin = function loadPlugin (filePath, successCallback, failureCallback){
    	try {
    		commonUtils.loadScript(constants.getMediaPluginPath() + filePath, function(){
	    		if (typeof newMediaPlugin !== 'undefined' && newMediaPlugin){
	    			newMediaPlugin.initialize(function(exportedFunctions){
	    					jQuery.extend(true,instance,exportedFunctions);
	    					newMediaPlugin = null;
							if (successCallback) successCallback();
	    			}, instance);
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
    
    /**
     * @constructs mmir.MediaManager
     * @memberOf mmir.MediaManager.prototype
     * @ignore
     */
    function constructor(){
    	
    	/** @scope mmir.MediaManager.prototype */
    	
    	var listener = new Dictionary(); 
    	
    	return {
    		
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

    			cancelRecognition: function(successCallBack,failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: canceling Recognize Speech is not supported.");
    				}
    				else {
    					console.error("Audio Output: canceling Recognize Speech is not supported.");
    				}
    			},
///////////////////////////// audio output API: /////////////////////////////
    	   		
    	   		playWAV: function(blob, successCallBack, failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: play WAV audio is not supported.");
    				}
    				else {
    					console.error("Audio Output: play WAV audio is not supported.");
    				}
    			},
    			playURL: function(url, successCallback, failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: play audio from URL is not supported.");
    				}
    				else {
    					console.error("Audio Output: play audio from URL is not supported.");
    				}
    			},
    			getURLAsAudio: function(url, successCallback, failureCallBack, onLoadedCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: create audio from URL is not supported.");
    				}
    				else {
    					console.error("Audio Output: create audio from URL is not supported.");
    				}
    			},
///////////////////////////// text-to-speech API: /////////////////////////////
    			
    			/**
    			 * parameter: string OR string Array OR object with attributes:
    			 * 		text: string OR string Array, text that should be read aloud
    			 * 		pauseLength: Length of the pauses between sentences in milliseconds
    			 * 		forceSingleSentence: boolean, if true, a string Array will be turned into a single string
    			 * 		split: boolean, if true and the text is a single string, it will be split using a splitter function
    			 * 		splitter: function, replaces the default splitter-function. It takes a simple string as input and gives a string Array as output
    			 */
    			textToSpeech: function(parameter, successCallBack,failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: Text To Speech is not supported.");
    				}
    				else {
    					console.error("Audio Output: Text To Speech is not supported.");
    				}
    			},
    			cancelSpeech: function(successCallBack,failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: canceling Text To Speech is not supported.");
    				}
    				else {
    					console.error("Audio Output: canceling Text To Speech is not supported.");
    				}
    			},
    			
///////////////////////////// ADDITIONAL (optional) functions: ///////////////////////////// 
    			
    			setTextToSpeechVolume: function(newValue){
    				console.error("Audio Output: set volume for Text To Speech is not supported.");
				}
    			
    			/**
    			 * @param eventName String
    			 * @param eventHandler Function
    			 */
    			, addListener: function(eventName, eventHandler){
    				var list = listener.get(eventName);
    				if(!list){
    					list = [eventHandler];
    					listener.put(eventName, list);
    				}
    				else {
    					list.push(eventHandler);
    				}
    			}
    			/**
    			 * @param eventName String
    			 * @param eventHandler Function
    			 */
    			, removeListener: function(eventName, eventHandler){
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
    							
    							isRemoved = true;
    							break;
    						}
    					}
    				}
    				return isRemoved;
    			}
    			/**
    			 * @returns Array<Function> of event-handlers; empty, if there are no event handlers for eventName
    			 */
    			, getListeners: function(eventName){
    				var list = listener.get(eventName);
    				if(list){
    					return list;
    				}
    				return [];
    			}
    			
    	};//END: return{...
    	
    };//END: constructor(){...
    
    
    //has 2 default configuarions:
    // if isCordovaEnvironment TRUE: use 'cordova' config
    // if FALSEy: use 'browser' config
    //
    // NOTE: this setting/paramater is overwritten, if the configuration has a property 'mediaPlugins' set!!!
    function getPluginsToLoad(isCordovaEnvironment){
    	var env = null;
    	var pluginArray = [];
    	if (isCordovaEnvironment) {
    		env = 'cordova';
    	} else {
    		env = 'browser';
    	}
    	
    	var dataFromConfig = configurationManager.get('mediaManager.plugins', true);
    	if (dataFromConfig && dataFromConfig[env]){
    		pluginArray = pluginArray.concat(dataFromConfig[env]);
    	} else{
    		pluginArray = pluginArray.concat(pluginsToLoad[env]);
    	}
    	
    	return pluginArray;
    }
    
    function loadAllPlugins(pluginArray, successCallback,failureCallback){
    	if (pluginArray == null || pluginArray.length<1){
    		if (successCallback) {
    			successCallback();
    		}
    		return;
    	}
    	var newPluginName = pluginArray.pop();
    	loadPlugin(newPluginName, function (){
    		console.log(newPluginName+' loaded!');
    		loadAllPlugins(pluginArray,successCallback, failureCallback);},
    		failureCallback
    	);
    }
    	
    
    var _stub = {
    	
    	/** @scope mmir.MediaManager.prototype */
    	
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
         * @param {Array<Object>} [listenerList] OPTIONAL a list of listeners that should be registered
         * @return {Object} Object containing the instance of the class {@link mmir.MediaManager}
         * @public
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
                
                var isCordovaEnvironment = ! constants.isBrowserEnv();//FIXME implement mechanism for configuring this!!
                
            	var pluginArray = getPluginsToLoad(isCordovaEnvironment);
                loadAllPlugins(pluginArray,deferredSuccess, deferredFailure);

            }
            else if(listenerList){
            	for(var i=0, size = listenerList.length; i < size; ++i){
            		instance.addListener(listenerList[i].name, listenerList[i].listener);
            	}
            }
            
            return defer.promise(this);
        },
        getInstance: function(){
            return this.init(null, null);
        },
        /**
         * loads a file. If the file implements a function initialize(f)
         * where the function f is called with a set of functions e, then those functions in e 
         * are added to the visibility of audioInput, and will from now on be applicable by calling
         * mmir.MediaManager.<function name>().
         * 
         * @deprecated
         */
    	loadFile: function(filePath,successCallback, failureCallback){
    		if (instance=== null) {
    			this.init();
    		}
    		
    		loadPlugin(filePath,sucessCallback, failureCallback);
			
    	}
    };
    
    return _stub;
	
	/** #@- */
    
});//END: define(..., function(){...
