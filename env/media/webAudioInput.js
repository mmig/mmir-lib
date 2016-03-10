/*
 * 	Copyright (C) 2012-2016 DFKI GmbH
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


newMediaPlugin = {
	/**  @memberOf Html5AudioInput# */
	initialize: function(callBack, mediaManager, ctxId, moduleConfig){
		
		/**  @memberOf Html5AudioInput# */
		var _basePluginName = 'webAudioInput';

		/**
		 * Default implementation for WebAudioInput: Google Recognition Web Service v1
		 * @memberOf Html5AudioInput#
		 */
		var _defaultImplFile = 'webasrGooglev1Impl.js';
		
		/**
		 * Map for the worker-filenames of the various audio-input implementations:
		 * 
		 * If there is no (application-) specific configuration present, then the entry
		 * from this map will be used for loading the audio-input worker for the specific
		 * implementation.
		 * 
		 * @memberOf Html5AudioInput#
		 */
		var _defaultWorkerImpl = {
			'webasratntimpl.js':     'amrEncoder.js',
			'webasrgooglev1impl.js': 'recorderWorkerExt.js',
			'webasrgoogleimpl.js':   'flacEncoder.js',
			'webasrnuanceimpl.js':   'amrEncoder.js',
			'_default': 'recorderWorkerExt.js'
		};
		
		/** 
		 * When specifying the implementation file for an Audio Module Context
		 * 
		 * i.e.
		 * 	{"mod": "webAudioTextToSpeech.js", "ctx": CONTEXT} 
		 * 
		 * then plugin configuration will be check, if there is an entry for the ctx, 
		 * i.e. an implementation file name for entry ctx:
		 *  "webAudioTextToSpeech": { CONTEXT: IMPLEMENTATION_FILE_ENTRY },
		 * 
		 * Otherwise the plugin configuration's default entry will be used
		 *  "webAudioTextToSpeech": { CONTEXT: _defaultCtxName },
		 * 
		 * If no default entry exists, then {@link #_defaultImplFile} will be used as
		 * implementation.
		 * 
		 * @defaultValue "default"
		 * @memberOf Html5AudioInput#
		 */
		var _defaultCtxName = 'default';
		
		/** 
		 * @type mmir.LanguageManager
		 * @memberOf Html5AudioInput#
		 */
		var languageManager = require('languageManager');
		/** 
		 * @type mmir.ConfigurationManager
		 * @memberOf Html5AudioInput#
		 */
		var configurationManager = require('configurationManager');
		/** 
		 * @type mmir.Constants
		 * @memberOf Html5AudioInput#
		 */
		var constants = require('constants');
		/** 
		 * @type mmir.CommonUtils
		 * @memberOf Html5AudioInput#
		 */
		var commonUtils = require('commonUtils');

		/**  @memberOf Html5AudioInput# */
		var audioProcessor = {
			/**
    		 * Initializes the connection/send-function.
    		 * 
    		 * Will be set/"overwritten" by specific implementation.
			 * 
			 * @protected
    		 * @memberOf Html5AudioInput.AudioProcessor#
    		 */
	      	_init: function(){
	      		
	      		//NOTE _init may get called before audioProcessor impl. is loaded
	      		//     -> cache these invocation and apply them later, when audioProcessor is loaded
	      		if(!this._cached){
	      			this._cached = [];
	      		}
	      		
	      		this._cached.push(arguments);
	      	},
    		/** 
    		 * Initializes/prepares the next recognition session.
    		 * 
    		 * Will be set/"overwritten" by specific implementation.
			 * 
			 * @protected
    		 * @memberOf Html5AudioInput.AudioProcessor#
    		 */
      		initRec: function(){},
      		/**  
			 * Will be set/"overwritten" by specific implementation.
			 * 
			 * @memberOf Html5AudioInput.AudioProcessor#
			 */
    		sendData: function(msg){},
			oninit: function(){},
			onstarted: function(){},
			onstopped: function(){},
			onsendpart: function(){},
			onsilencedetected: function(){},
			onclear: function(){}
		};

		/** @memberOf Html5AudioInput# */
		var nonFunctional = false;
		
		/**
		 * The name of the plugin (w.r.t. the specific implementation).
		 *  
		 * Will be set/"overwritten" by specific implementation.
		 * 
		 * @protected
		 * @memberOf Html5AudioInput#
		 */
		var _pluginName;
		
		/**
		 * The name of the implementation file (converted to lower case).
		 * 
		 * Will be set when specific implementation is loaded.
		 * 
		 * @protected
		 * @memberOf Html5AudioInput#
		 */
		var _implFileName;
		
		/**  @memberOf Html5AudioInput# */
		var initImpl = function(impl){
			
			_pluginName = impl.getPluginName();
			
			var initCalls = audioProcessor._cached;
			audioProcessor = impl;
			
			//if there were init-calls before impl was loaded, apply them now:
			if(initCalls){
				
				for(var i=0,size=initCalls.length; i < size; ++i){
					audioProcessor._init.apply(audioProcessor, initCalls[i]);
				}
			}
			
		};
		
		/** @memberOf Html5AudioInput# */
		function htmlAudioConstructor(){
			
			/** 
			 * status-flag for indicating, if recording is in progress
			 * @memberOf Html5AudioInput#
			 */
			var recording = false;
			
			/** @memberOf Html5AudioInput# */
			var lastBlob = false;
			/** @memberOf Html5AudioInput# */
			var isUseIntermediateResults = false;
			/** 
			 * @type AudioContext
			 * @memberOf Html5AudioInput#
			 */
			var audio_context=null;
			/**
			 * @type LocalMediaStream
			 * @memberOf Html5AudioInput#
			 */
			var stream = null;
			/**
			 * @type RecorderExt
			 * @memberOf Html5AudioInput#
			 */
    		var recorder=null;
    		/** @memberOf Html5AudioInput# */
    		var totalText = '';
    		/** 
    		 * the function that is called on the recognized text that came back from the server
    		 * @memberOf Html5AudioInput#
    		 */
    		var textProcessor = function(e,id){};
    		/** 
    		 * @type WebWorker
    		 * @memberOf Html5AudioInput#
    		 */
    		var silenceDetection = null;
    		
    		/** @memberOf Html5AudioInput# */
    		var endOfSpeechDetection = false;
    		/**
    		 * @type Function
    		 * @memberOf Html5AudioInput#
    		 */
    		var currentFailureCallback = null;
    		
      		/**  @memberOf Html5AudioInput# */
      		function createAudioScriptProcessor(audioContext, bufferSize, numberOfInputChannels, numberOfOutputChannels){
      		    	if(audioContext.context.createJavaScriptNode){
      		    		return audioContext.context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
      		    	}
      		    	else if(audioContext.context.createScriptProcessor){
      		    		return audioContext.context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
      		    	}
      		    	else {
      		    		throw Error('Could not create script-processor for AudioContext: context provides no function for generating processor!');
      		    	}
      		    
      		}
    		
    		/**
    		 * creates Silence detector and recorder and connects them to the input stream
    		 * @param {LocalMediaStream} inputstream
    		 * @param {Function} [callback] OPTIONAL
    		 * @memberOf Html5AudioInput#
    		 */
    		function onStartUserMedia(inputstream, callback){
    			var buffer = 0;
    			stream = inputstream;
    			var input = audio_context.createMediaStreamSource(stream);
    			
    			if(!recorder){
    				var workerImpl = configurationManager.getString([_pluginName, 'encoder'], true);
    				if(!workerImpl){
    					workerImpl = _defaultWorkerImpl[_implFileName] || _defaultWorkerImpl._default; 
    				}
    				
    				var recorderWorkerPath = constants.getWorkerPath()+workerImpl;
    				recorder = new Recorder(input, {workerPath: recorderWorkerPath});
    			} else {
    				recorder.init(input);
    			}
    			
    			//FIXME experimental callback/listener for on-start-record -> API may change!
    			var onStartRecordListeners = mediaManager.getListeners('onallowrecord');
    			for(var i=0, size = onStartRecordListeners.length; i < size; ++i){
    				onStartRecordListeners[i](input, audio_context, recorder);
    			}
    			
    			silenceDetection = recorder.processor;
    			
    			/**
    			 * callback when audio-encoding has finished
    			 * 
    			 * @function
    			 * @param {Event} event
    			 * 			with property {data: buf BLOB}
    			 * 
    			 * @memberOf Html5AudioInput.recorder#
    			 */
    			recorder.onencodefinished = function(event){    				
    		    	  audioProcessor.sendData(event.data, textProcessor, currentFailureCallback);
    			};
    			
    			/**
    			 * @function
    			 * @memberOf Html5AudioInput.recorder#
    			 */
    			recorder.beforeonmessage = function (e){
    				
    				if(mediaManager._log.isDebug()) mediaManager._log.log(e.data);
    				
    				//attach current recorder
    				e.recorder = recorder;
    				
    				var isContinuePropagation;
    				if (e.data === 'Send partial!'){
    					
    					if(audioProcessor.onsendpart){
    						isContinuePropagation = audioProcessor.onsendpart(e);
    					}
    				}
    				else if (e.data === 'Silence detected!'){
    					
    					if(audioProcessor.onsilencedetected){
    						isContinuePropagation = audioProcessor.onsilencedetected(e);
    					}
    					
    					if (endOfSpeechDetection){
    						
    						stopUserMedia();
    					}
    				}
    				else if (e.data === 'clear'){
    					
    					if(audioProcessor.onclear){
    						isContinuePropagation = audioProcessor.onclear(e);
    					}
    				}
    				else if(e.data === 'Silence Detection initialized'){
    					
    					if(audioProcessor.oninit){
    						isContinuePropagation = audioProcessor.oninit(e);
    					}
    					
    				}
    				else if(e.data === 'Silence Detection started'){
    					
    					if(audioProcessor.onstarted){
    						isContinuePropagation = audioProcessor.onstarted(e);
    					}
    					
    				}
    				else if(e.data === 'Silence Detection Audio started'){
    					
    					if(audioProcessor.onaudiostarted){
    						isContinuePropagation = audioProcessor.onaudiostarted(e);
    					}
    					
    				}
    				else if(e.data === 'Silence Detection stopped'){
    					
    					if(audioProcessor.onstopped){
    						isContinuePropagation = audioProcessor.onstopped(e);
    					}
    					
    				} else {
    					
    					mediaManager._log.error('Unknown message: '+e.data);
    				}
    				
    				
    				if(typeof isContinuePropagation !== 'undefined' && !isContinuePropagation){
    					return false;
    				}
    			};
    			
    			/** @memberOf Html5AudioInput.recorder# */
    			var silenceDetectionConfig = {
					sampleRate: input.context.sampleRate,
					noiseTreshold : configurationManager.get(["silenceDetector", "noiseTreshold"]),
					pauseCount : configurationManager.get(["silenceDetector", "pauseCount"]),
					resetCount : configurationManager.get(["silenceDetector", "resetCount"])
				};
    			
    			//initialize silence-detection:
    			silenceDetection.postMessage({
    				cmd: 'initDetection',
    				config: silenceDetectionConfig
    			});
    			
    			callback && callback();
    			
    		}//END: onStartUserMedia
    		    		
    		try {
		        // unify the different kinds of HTML5 implementations
    			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    			//window.AudioContext = window.AudioContext || window.webkitAudioContext;
//		    	audio_context = new AudioContext;

    			if(typeof AudioContext !== 'undefined'){
    				audio_context = new AudioContext;
    			}
    			else {//if(typeof webkitAudioContext !== 'undefined'){
    				audio_context = new webkitAudioContext;
    			}
    		} 
    		catch (e) {
    			console.error('No web audio support in this browser! Error: '+(e.stack? e.stack : e));
    			nonFunctional = true;
 				 if (currentFailureCallback) 
  					 currentFailureCallback(e);
    		}
    		
    		if( nonFunctional !== true ) try {
    			audioProcessor._init(stopUserMedia);
    		} catch (e) {
    			console.error('Could not reach the voice recognition server!');
    			nonFunctional = true;
 				if(currentFailureCallback) 
  					 currentFailureCallback(e);
    		}

    		if (nonFunctional) {
    			return {};///////////////////////////// EARLY EXIT //////////////////////////////
    		}
    		
    		/**
    		 * get audioInputStream, i.e. open microphone
    		 * 
    		 * NOTE user might reject access to microphone
    		 * 
    		 * @param {Function} callback
    		 * @memberOf Html5AudioInput#
    		 */
    		var startUserMedia = function(callback){
    			
    			var onStarted = callback? function(stream){ onStartUserMedia.call(this, stream, callback); } : onStartUserMedia;
    			
    			navigator.getUserMedia({audio: true}, onStarted, function onError(e) {
						console.error('Could not access microphone: '+e);
						if (currentFailureCallback) 
		  					 currentFailureCallback(e);
					}
    			);
    			
    		};
    		
    		/**
    		 * close audioInputStream, i.e. turn microphone off
    		 * 
    		 * @param {Boolean} [isStopSilenceDetection] OPTIONAL
    		 * 			if false: do not stop silence detection,
    		 * 			if omitted or any other value than false: stop silence detection
    		 * 
    		 * @memberOf Html5AudioInput#
    		 */
    		var stopUserMedia = function(isStopSilenceDetection){
    			
    			if(recorder){
    				recorder.release();
    			};
    			
    			if(stream){
    				
    				var thestream = stream;
					stream = void(0);
					//DISABLED: MediaStream.stop() is deprecated -> instead: stop all tracks individually
//					stream.stop();
					try{
						if(thestream.active){
							var list = thestream.getTracks(), track;
							for(var i=list.length-1; i >= 0; --i){
								track = list[i];
								if(track.readyState !== 'ended'){
									track.stop();
								}
							}
						}
					} catch (err){
						console.log('webAudioInput: a problem occured while stopping audio input analysis: '+err);
					}
    			}
    			
    			if(silenceDetection && isStopSilenceDetection !== false){
    				silenceDetection.postMessage({cmd: 'stop'});
    			}
    			
    		};
			
    		//invoke the passed-in initializer-callback and export the public functions:
    		return {
    			/**
				 * @public
				 * @memberOf Html5AudioInput.prototype
				 * @see mmir.MediaManager#startRecord
				 */
    			startRecord: function(successCallback, failureCallback, intermediateResults){

    				if(intermediateResults){
        				textProcessor = successCallback;
    				} else {
    					textProcessor = function(e, onEnd){
    						totalText = totalText + ' '+e;
    					};
    				}
    				if (failureCallback){
    					currentFailureCallback = failureCallback;
    				}

					isUseIntermediateResults = intermediateResults? true : false;
    				endOfSpeechDetection = false;
					
    				audioProcessor.setCallbacks(textProcessor, currentFailureCallback, stopUserMedia, isUseIntermediateResults);
    				
    				startUserMedia(function(){
    					audioProcessor.initRec && audioProcessor.initRec();
    					recorder && recorder.clear();
        				recorder && recorder.record();
        				silenceDetection && silenceDetection.postMessage({cmd: 'start'});
    				});
    				
    				lastBlob = false;
					totalText = '';
    				audioProcessor.resetLastResult && audioProcessor.resetLastResult();
    				
    				recording=true;
    			},
    			/**
				 * @public
				 * @memberOf Html5AudioInput.prototype
				 * @see mmir.MediaManager#stopRecord
				 */
    			stopRecord: function(successCallback,failureCallback){//blobHandler){
    				if (failureCallback){
    					currentFailureCallback = failureCallback;
    				}
    				setTimeout(function(){
    					stopUserMedia(false);
        				if (successCallback){
        					/** @memberOf media.plugin.html5AudioInput.prototype */
        					textProcessor = function(e){
        						if (audioProcessor.isLastResult()) {
        							successCallback(totalText+ ' ' + e);
        						}
        						audioProcessor.resetLastResult();
        					};
        				}
        				audioProcessor.setCallbacks(textProcessor, currentFailureCallback, stopUserMedia);
        				
        				lastBlob = true;
        				audioProcessor.setLastResult && setLastResult.resetLastResult();
        				
        				silenceDetection && silenceDetection.postMessage({cmd: 'stop'});
        				
    				}, 100);
    				
    			},
    			/**
				 * @public
				 * @memberOf Html5AudioInput.prototype
				 * @see mmir.MediaManager#recognize
				 */
    			recognize: function(successCallback,failureCallback){

    				if (successCallback){
    					textProcessor = successCallback;
    				}
    				if (failureCallback){
    					currentFailureCallback = failureCallback;
    				}

    				endOfSpeechDetection = true;
    				
    				audioProcessor.setCallbacks(textProcessor, currentFailureCallback, stopUserMedia);
    				
    				startUserMedia(function(){
    					audioProcessor.initRec && audioProcessor.initRec();
    					recorder && recorder.clear();
        				recorder && recorder.record();
        				silenceDetection && silenceDetection.postMessage({cmd: 'start'});
    				});
    				
    				lastBlob = false;
    				totalText='';
    				audioProcessor.resetLastResult && audioProcessor.resetLastResult();
    				
    				recording=true;

    			},
    			/**
				 * @public
				 * @memberOf Html5AudioInput.prototype
				 * @see mmir.MediaManager#cancelRecognition
				 */
    			cancelRecognition: function(successCallback,failureCallback){
    				
    				if (failureCallback){
    					currentFailureCallback = failureCallback;
    				}
    				
    				stopUserMedia(false);
    				
    				lastBlob = true;
    				audioProcessor.setLastResult && audioProcessor.setLastResult();
    				
    				silenceDetection && silenceDetection.postMessage({cmd: 'stop'});
    				if (successCallback){
    					successCallback();
    				}
    			}
    		};//END: return
    		
		};//END: htmlAudioConstructor()
		
		var implFile, configPath = [_basePluginName, ctxId];
		
		if(moduleConfig){
			
			//if there config setting -> use as implementation-filename:
			implFile = moduleConfig;
			
		} else if(ctxId){
			//if plugin was loaded into a specific context, check, if there is a configuration value for this context)
			implFile = configurationManager.get(configPath, true);
		}
		
		if(!implFile){
			//use default configuration path
			configPath[1] = _defaultCtxName;
			implFile = configurationManager.get(configPath, true);
		}
		
		if(!implFile){
			
			//if no configuration: use default impl.
			implFile = _defaultImplFile;
			
		} else if(!/\.js$/.test(implFile)){
			
			implFile += '.js';
		}
		
		_implFileName = implFile.toLowerCase();

		var recLoaded = false, implLoaded = false;
		var checkInit = function(){
			
			if(recLoaded && implLoaded){

				var instance = htmlAudioConstructor();
				
				//initialize implementation:
				initImpl(newWebAudioAsrImpl);
				
				//invoke the passed-in initializer-callback and export the public functions:
				callBack(instance);
			}
		};
		
		//load the necessary scripts and then call htmlAudioConstructor
		
		commonUtils.loadScript(constants.getMediaPluginPath()+'recorderExt.js', function(){
			recLoaded = true;
			checkInit();
		});
		
		commonUtils.loadScript(constants.getMediaPluginPath()+implFile, function(){
			implLoaded = true;
			checkInit();
		});
		
	}//END: initialize()
		
};