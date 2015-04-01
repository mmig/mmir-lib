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
 * part of Cordova plugin: de.dfki.iui.mmir.NuancePlugin
 * @version 0.7.0
 * @ignore
 */
newMediaPlugin = {
		/**  @memberOf NuanceAndroidAudioInput# */
		initialize: function(callBack, mediaManager){
			
			/**  @memberOf NuanceAndroidAudioInput# */
			var _pluginName = 'nuanceAudioInput';
			/** 
			 * @type mmir.LanguageManager
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var languageManager = require('languageManager');

			/**  @memberOf NuanceAndroidAudioInput# */
			var id = 0;
			/**  
			 * @type Function
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var currentSuccessCallback;
			/**  
			 * @type Function
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var currentFailureCallback;
			/**  @memberOf NuanceAndroidAudioInput# */
			var intermediate_results = true;
			/**  @memberOf NuanceAndroidAudioInput# */
			var repeat = false;
			/**
			 * The last received result (or undefined, if there is none).
			 * 
			 * [ text : String, score : Number, type : result_types, alternatives : Array, unstable : String ]
			 * 
			 * NOTE: "unstable" field/entry is currently not used by Nuance plugin.
			 * 
			 * @type Array
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var last_result = void(0);
			
			/**
			 * activate / deactivate improved feedback mode:
			 * <br>
			 * If activated, this will take effect during start-/stop-Record mode <em>with</em> intermediate results.
			 * <p>
			 * 
			 * This deals with the fact, that the Nuance recognizer has a very noticeable pause between stopping the recording
			 * and re-starting the recording for the next voice input. 
			 * 
			 * The improved feedback mode will return recognition results NOT immediately when they are received, but
			 * when the recognition has restarted (i.e. listens again) - or when it stops 
			 * (i.e. stopRecognition is called or error occurred).
			 * 
			 * 
			 * This can improve user interactions, since the results will only be shown, when the recognizer is active again,
			 * i.e. users do not have to actively interpret the START prompt (if it is active!) or other WAIT indicators
			 * during the time when recording stops and restarts again (i.e. when input-recording is inactive).
			 * 
			 * Instead they are "prompted" by the appearing text of the last recognition result.
			 * 
			 * @memberOf NuanceAndroidAudioInput#
			 * @default false: improved feedback mode is enabled by default
			 */
			var disable_improved_feedback_mode = false;

			/**
			 * Error codes (returned by the native/Cordova plugin)
			 * @type Enum
			 * @constant
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var error_codes_enum = {
					"UNKNOWN": 				0,
					"SERVER_CONNECTION": 	1,
					"SERVER_RETRY": 		2,
					"RECOGNIZER": 			3,
					"VOCALIZER": 			4,
					"CANCEL": 				5
			};

			/**
			 * Result types (returned by the native/Cordova plugin)
			 * 
			 * @type Enum
			 * @constant
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var result_types = {
					"FINAL": 				"FINAL",
					"INTERMEDIATE": 		"INTERMEDIATE",
					"RECOGNITION_ERROR": 	"RECOGNITION_ERROR",
					"RECORDING_BEGIN": 		"RECORDING_BEGIN",
					"RECORDING_DONE": 		"RECORDING_DONE"
			};
			
			//backwards compatibility (pre v0.6.0)
			if(!mediaManager._preparing){
				mediaManager._preparing = function(name){console.warn(name + ' is preparing - NOTE: this is a stub-function. Overwrite MediaManager._preparing for setting custom implementation.');};
			}
			if(!mediaManager._ready){
				mediaManager._ready     = function(name){console.warn(name + ' is ready - NOTE: this is a stub-function. Overwrite MediaManager._ready for setting custom implementation.');};
			}

			/**
			 * MIC-LEVELS: Name for the event that is emitted, when the input-mircophone's level change.
			 * 
			 * @private
			 * @constant
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var MIC_CHANGED_EVT_NAME = 'miclevelchanged';
			
			/**
			 * MIC-LEVELS: start/stop audio-analysis if listeners get added/removed.
			 * 
			 * @private
			 * @memberOf NuanceAndroidAudioInput#
			 */
			function _updateMicLevelListeners(actionType, handler){
				//add to plugin-listener-list
				if(actionType=== 'added'){
					window.plugins.nuancePlugin.onMicLevelChanged(handler);
				}
				//remove from plugin-listener-list
				else if(actionType === 'removed'){
					window.plugins.nuancePlugin.offMicLevelChanged(handler);
				}
			}
			//observe changes on listener-list for mic-levels-changed-event
			mediaManager._addListenerObserver(MIC_CHANGED_EVT_NAME, _updateMicLevelListeners);
			var list = mediaManager.getListeners(MIC_CHANGED_EVT_NAME);
			for(var i=0, size= list.length; i < size; ++i){
				window.plugins.nuancePlugin.onMicLevelChanged(list[i]);
			}

			/**
			 * HELPER invoke current callback function with last recognition results.
			 * @private
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var call_callback_with_last_result = function(){
				if(typeof last_result !== "undefined") {
					if (currentSuccessCallback){
						currentSuccessCallback.apply(mediaManager, last_result);
						last_result = void(0);
					} else {
						console.error("nuanceAudioInput Error: No callback function defined for success.");
					}
				} else {
					console.warn("nuanceAudioInput Warning: last_result is undefined.");
				}
			};

			/**
			 * Creates the wrapper for the success-back:
			 * 
			 * successcallback(asr_result, asr_score, asr_type, asr_alternatives, asr_unstable) OR in case of error:
			 * successcallback(asr_result, asr_score, asr_type, asr_error_code, asr_error_suggestion)
			 * 
			 * @private
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var successCallbackWrapper = function successCallbackWrapper (cb){
				return (function (res){
					
//					console.log("nuanceAudioInput: " + JSON.stringify(res));//FIXM DEBUG

					var asr_result = null;
					var asr_score = -1;
					var asr_type = -1;
					var asr_alternatives = [];

					if(res) {
						
						if(typeof res['result'] !== "undefined"){
							asr_result = res['result'];
						}
						if  (typeof res["score"] !== "undefined"){
							asr_score = res["score"];
						}
						if  (typeof res["type"] !== "undefined"){
							asr_type = res["type"];
						}
						if  (typeof res["alternatives"] !== "undefined"){
							asr_alternatives = res["alternatives"];
						}
					}

					//call voice recognition again, if repeat is set to true
					if (repeat === true) {
						if (asr_type === result_types.RECORDING_BEGIN){
							// only call success-callback, if we started recording again.
							mediaManager._ready(_pluginName);
							call_callback_with_last_result();
						} else if (asr_type === result_types.RECORDING_DONE){
							// Do nothing right now at the recording done event
						} else if (asr_type === result_types.FINAL){
							// its the final result
							// post last result
							call_callback_with_last_result();
							last_result = [asr_result, asr_score, asr_type, asr_alternatives];
							// post current result
							call_callback_with_last_result();
						} else if (asr_type === result_types.INTERMEDIATE){
							mediaManager._preparing(_pluginName);
							// save the last result and start recognition again
							last_result = [asr_result, asr_score, asr_type, asr_alternatives];
							
							//if improved-feedback-mode is disabled: immediately call success-callback with results
							if(disable_improved_feedback_mode === true){
								call_callback_with_last_result();
							}

							window.plugins.nuancePlugin.recognizeNoEOS(
									languageManager.getLanguageConfig(_pluginName),
									successCallbackWrapper(currentSuccessCallback),
									failureCallbackWrapper(currentFailureCallback),
									intermediate_results
							);

						} else {
							// save the last result and start recognition again
//							last_result = [asr_result, asr_score, asr_type, asr_alternatives];

//							window.plugins.nuancePlugin.recognizeNoEOS(
//							languageManager.getLanguageConfig(_pluginName),
//							successCallbackWrapper(currentSuccessCallback),
//							failureCallbackWrapper(currentFailureCallback),
//							intermediate_results
//							);
//							console.warn("[NuanceAudioInput] Success - Repeat - Else\nType: " + asr_type+"\n"+JSON.stringify(res));
						}

					} else {
						// no repeat, there won't be another recording, so call callback right now with previous and current result

						mediaManager._ready(_pluginName);

						if (asr_type === result_types.RECORDING_DONE){
						} else if (asr_type === result_types.FINAL){
						}
						call_callback_with_last_result();

						if(typeof res !== "undefined") {
							if (cb){
								cb(asr_result, asr_score, asr_type, asr_alternatives);
							} else {
								console.error("nuanceAudioInput Error: No callback function defined for success.");
							}
						} else {
							console.warn("nuanceAudioInput Warning: result parameter is undefined.");
						}
					}
				});
			};

			
			/**
			 * creates the wrapper for the failure callback.
			 * 
			 * NOTE: error code 2 - there is no difference between a long silence and unintelligible words
			 * 
			 * @private
			 * @memberOf NuanceAndroidAudioInput#
			 */
			var failureCallbackWrapper = function failureCallbackWrapper (cb){
				return (function (res){
					var error_code = -1;
					var error_msg = "";
					var error_suggestion = "";
					var error_type = -1;

					if (typeof res !== "undefined"){
						if(typeof res['error_code'] !== "undefined") {

							error_code = res['error_code'];
						}
						if  (typeof res["msg"] !== "undefined"){
							error_msg = res["msg"];
						}

						if (typeof res["suggestion"] !== "undefined"){
							error_suggestion = res["suggestion"];
						}

						if  (typeof res["type"] !== "undefined"){
							error_type = res["type"];
						}
					}

					mediaManager._ready(_pluginName);

					// TEST: if there is still a pending last result, call successcallback first.
					call_callback_with_last_result();
					if (repeat === true){
						// only call error callback on "severe" errors
						// TODO: on SERVER_RETRY => message to user
						if (		(error_code == error_codes_enum.UNKNOWN)
								// if asr is active and the internet connection is lost, it throws error code 1 (SERVER_CONNECTION) once and thereafter error code 3 (RECOGNIZER)
								||	(error_code == error_codes_enum.SERVER_CONNECTION)
								// if asr is started when the internet connection is disabled, error code 1 (SERVER_CONNECTION) is not thrown, only error code 3 (RECOGNIZER) - so also stop at recognizer error.
								||	(error_code == error_codes_enum.RECOGNIZER)
								||	(error_code == error_codes_enum.CANCEL)
						){
							if (cb){
								console.warn("nuanceAudioInput: Calling error callback (" + error_code + ": " + error_msg + ").");
								cb(error_msg, error_code, error_suggestion);
							} else {
								console.error("nuanceAudioInput Error: No callback function defined for failure.");
							}
						} else {
							
							// this is a minor error, call success-callback with empty result-string
							currentSuccessCallback("", -1, result_types.RECOGNITION_ERROR, error_code, error_suggestion);
							
							//show loader so that the user knows it may take a while before he can start talking again
							if (error_type !== result_types.FINAL){
								mediaManager._preparing(_pluginName);
							}
							
							//no (serious) error, call voice recognition again
							return window.plugins.nuancePlugin.recognizeNoEOS(
									languageManager.getLanguageConfig(_pluginName),
									successCallbackWrapper(currentSuccessCallback),
									failureCallbackWrapper(currentFailureCallback),
									intermediate_results
							);
						}
						
					} else {
						
						// do no repeat, just call errorCallback
						if (cb){
							console.debug("nuanceAudioInput: Calling error callback (" + error_code + ").");
							cb(error_msg, error_code, error_suggestion);
						} else {
							console.error("nuanceAudioInput Error: No callback function defined for failure.");
						}
					}
				});
			};

			//invoke the passed-in initializer-callback and export the public functions:
			callBack ({
				/**
				 * @public
				 * @memberOf NuanceAndroidAudioInput.prototype
				 * @see mmir.MediaManager#startRecord
				 */
				startRecord: function(successCallback, failureCallback, intermediateResults, isDisableImprovedFeedback){

					currentFailureCallback = failureCallback;
					currentSuccessCallback = successCallback;
					repeat = true;
					// HACK: maybe there is a better way to determine intermediate_results with false as standard? similar to webkitAudioInput
					intermediate_results = (intermediateResults === false) ? false : true;
					
					//EXPERIMENTAL: allow disabling the improved feedback mode
					if(isDisableImprovedFeedback === true){
						disable_improved_feedback_mode = isDisableImprovedFeedback;
					}
					else {
						disable_improved_feedback_mode = false;
					}

					mediaManager._preparing(_pluginName);

					window.plugins.nuancePlugin.recognizeNoEOS(
							languageManager.getLanguageConfig(_pluginName),
							successCallbackWrapper(successCallback),
							failureCallbackWrapper(failureCallback),
							intermediate_results
					);
				},
				/**
				 * @public
				 * @memberOf NuanceAndroidAudioInput.prototype
				 * @see mmir.MediaManager#stopRecord
				 */
				stopRecord: function(successCallback,failureCallback){
					repeat = false;
					window.plugins.nuancePlugin.stopRecord(
							successCallbackWrapper(successCallback),
							failureCallbackWrapper(failureCallback)
					);
				},
				/**
				 * @public
				 * @memberOf NuanceAndroidAudioInput.prototype
				 * @see mmir.MediaManager#recognize
				 */
				recognize: function(successCallback,failureCallback){
					repeat = false;

					mediaManager._preparing(_pluginName);

					window.plugins.nuancePlugin.recognize(
							languageManager.getLanguageConfig(_pluginName),
							successCallbackWrapper(successCallback),
							failureCallbackWrapper(failureCallback)
					);
				},
				/**
				 * @public
				 * @memberOf NuanceNuanceAndroidAudioInput.prototype
				 * @see mmir.MediaManager#cancelRecognition
				 */
				cancelRecognition: function(successCallBack,failureCallBack){
					last_result = void(0);
					repeat = false;

					mediaManager._ready(_pluginName);

					window.plugins.nuancePlugin.cancelRecognition(successCallBack, failureCallBack);
				},
				getMicLevels: function(successCallback,failureCallback){

					window.plugins.nuancePlugin.getMicLevels(
							successCallback,
							failureCallback
					);
					
				}
			});


		}

};