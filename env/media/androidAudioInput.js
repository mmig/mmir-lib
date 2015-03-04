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


newMediaPlugin = {

		initialize: function(initCallBack, mediaManager){

			var _pluginName = 'androidAudioInput';

			var languageManager = require('languageManager');

			var id = 0;
			var currentSuccessCallback;
			var currentFailureCallback;
			var intermediate_results = true;
			var repeat = false;
			var last_result = void(0);

			//Nuance Error Codes:
//			var error_codes_enum = {
//					"UNKNOWN": 				0,
//					"SERVER_CONNECTION": 	1,
//					"SERVER_RETRY": 		2,
//					"RECOGNIZER": 			3,
//					"VOCALIZER": 			4,
//					"CANCEL": 				5
//			};
			
			//Android Error Codes:
//			/** Network operation timed out. */
//		    public static final int ERROR_NETWORK_TIMEOUT = 1;
//		    /** Other network related errors. */
//		    public static final int ERROR_NETWORK = 2;
//		    /** Audio recording error. */
//		    public static final int ERROR_AUDIO = 3;
//		    /** Server sends error status. */
//		    public static final int ERROR_SERVER = 4;
//		    /** Other client side errors. */
//		    public static final int ERROR_CLIENT = 5;
//		    /** No speech input */
//		    public static final int ERROR_SPEECH_TIMEOUT = 6;
//		    /** No recognition result matched. */
//		    public static final int ERROR_NO_MATCH = 7;
//		    /** RecognitionService busy. */
//		    public static final int ERROR_RECOGNIZER_BUSY = 8;
//		    /** Insufficient permissions */
//		    public static final int ERROR_INSUFFICIENT_PERMISSIONS = 9;

			var error_codes_enum = {
					"NETWORK_TIMEOUT":			1, //Nuance: SERVER_CONNECTION
					"NETWORK":					2, //Nuance: SERVER_RETRY
					"AUDIO": 					3, //Nuance: RECOGNIZER
					"SERVER": 					4, //Nuance: VOCALIZER
					"CLIENT": 					5, //Nuance: CANCEL
					"SPEECH_TIMEOUT":			6, //Nuance -> na
					"NO_MATCH":					7, //Nuance -> na
					"RECOGNIZER_BUSY":			8, //Nuance -> na
					"INSUFFICIENT_PERMISSIONS":	9, //Nuance -> na
					// >= 10  --> UNKNOWN:
					"UNKNOWN":					10 //Nuance -> 0
			};

			var result_types = {
					"FINAL": 				"FINAL",
					"INTERIM": 				"INTERIM",
					"INTERMEDIATE":			"INTERMEDIATE",
					"RECOGNITION_ERROR": 	"RECOGNITION_ERROR",
					"RECORDING_BEGIN": 		"RECORDING_BEGIN",
					"RECORDING_DONE": 		"RECORDING_DONE"
			};

			//FIXME application-dependent / jQuery-dependent mechanism for WAIT-feedback (i.e. when recognizer prepares to get ready)
			var _wait = (function($){

				var speech_input_wait_div_id = 
					typeof SPEECH_INPUT_WAIT_DLG_ID !== 'undefined'? //FIXME custom-mechanism for optionally setting this using a global variable
							SPEECH_INPUT_WAIT_DLG_ID : 
								"speech-input-wait-dlg";//<- default ID FIXME application dependent!?

				var speech_input_wait_div;

				var speech_input_wait_div_parent_selector = 'body';

				var getHtml = function(divId, msgStr){

					return '<div id="'
					+ divId
					+ '" class="ui-loader ui-corner-all ui-body-a ui-loader-verbose"><span class="ui-icon ui-icon-loading spin"></span><h1>'
					+ msgStr
					+ '</h1></div>';

				};

				var show_wait_on_result = function(){

					if ( $(speech_input_wait_div_parent_selector + '>.ui-loader:visible').length < 1){

						speech_input_wait_div = $('#'+speech_input_wait_div_id);

//						console.log("FOUND: " + speech_input_wait_div.length);

						//use externalized language String "loadingText" for message:
						var msgText = languageManager.getText('loadingText');
						
						if (speech_input_wait_div.length < 1){
							// element not inserted yet
							$(speech_input_wait_div_parent_selector).append(//speech_input_wait_div_src);
									getHtml(speech_input_wait_div_id, msgText)
							);
							speech_input_wait_div = $('#'+speech_input_wait_div_id);
						}
						else {
							$('h1', speech_input_wait_div).text(msgText);
						}

						speech_input_wait_div.show();
					}

				};

				var hide_wait_on_result = function(){
					if ($('#'+speech_input_wait_div_id).length > 0){
						// element inserted
						$('#'+speech_input_wait_div_id).hide();
					}
				};

				return {
					/**
					 * show / activate feedback for "start preparing"
					 */
					preparing:     show_wait_on_result,
					/**
					 * hide / activate feedback for "preparing done"
					 */
					ready: hide_wait_on_result
				};

			})(jQuery);
			////////////////////////////////// END: application dependent WAIT feedback //////////////////


			var MIC_CHANGED_EVT_NAME = 'miclevelchanged';
			
			//start/stop audio-analysis if listeners get added/removed
			function _updateMicLevelListeners(actionType, handler){
				//add to plugin-listener-list
				if(actionType=== 'added'){
					window.plugins.androidSpeechPlugin.onMicLevelChanged(handler);
				}
				//remove from plugin-listener-list
				else if(actionType === 'removed'){
					window.plugins.androidSpeechPlugin.offMicLevelChanged(handler);
				}
			}
			//observe changes on listener-list for mic-levels-changed-event
			mediaManager._addListenerObserver(MIC_CHANGED_EVT_NAME, _updateMicLevelListeners);
			var list = mediaManager.getListeners(MIC_CHANGED_EVT_NAME);
			for(var i=0, size= list.length; i < size; ++i){
				window.plugins.androidSpeechPlugin.onMicLevelChanged(list[i]);
			}
			

			var call_callback_with_last_result = function(){
				if(typeof last_result !== "undefined") {
					if (currentSuccessCallback){
						currentSuccessCallback.apply(mediaManager, last_result);
						last_result = void(0);
					} else {
						console.error("androidAudioInput Error: No callback function defined for success.");
					}
				} else {
					console.warn("androidAudioInput Warning: last_result is undefined.");
				}
			};

			/**
			 * successcallback(asr_result, asr_score, asr_type, asr_alternatives) OR in case of error:
			 * successcallback(asr_result, asr_score, asr_type, asr_error_code, asr_error_suggestion)
			 */
			var successCallbackWrapper = function successCallbackWrapper (cb){
				
				return (function (res){
					
					console.log("androidAudioInput"+(repeat? "(REPEAT_MODE)" : "")+": " + JSON.stringify(res));//FIXME DEBUG

					var asr_result = null;
					var asr_score = -1;
					var asr_type = -1;
					var asr_alternatives = [];
					var asr_unstable = null;

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
						if  (typeof res["unstable"] !== "undefined"){
							asr_unstable = res["unstable"];
						}
					}

					//call voice recognition again, if repeat is set to true
					if (repeat === true) {
						if (asr_type === result_types.RECORDING_BEGIN){
							// only call success-callback, if we started recording again.
							_wait.ready();
							call_callback_with_last_result();
						} else if (asr_type === result_types.RECORDING_DONE){
							// Do nothing right now at the recording done event
							console.log("androidAudioInput"+(repeat? "(REPEAT_MODE)" : "")+": RECORDING_DONE, last_result: " + JSON.stringify(last_result));//FIXME DEBUG
							
						} else if (asr_type === result_types.FINAL){
							// its the final result
							// post last result
							call_callback_with_last_result();
							last_result = [asr_result, asr_score, asr_type, asr_alternatives, asr_unstable];
							// post current result
							call_callback_with_last_result();
						} else if (asr_type === result_types.INTERIM){
							// its an interim result
							// -> save the last result
							call_callback_with_last_result();
							last_result = [asr_result, asr_score, asr_type, asr_alternatives, asr_unstable];
							// post current result
							call_callback_with_last_result();
						} else if (asr_type === result_types.INTERMEDIATE){
							_wait.preparing();
							// save the last result and start recognition again
							// (callback for intermediate results will be triggered on next RECORDING_BEGIN)
							last_result = [asr_result, asr_score, asr_type, asr_alternatives, asr_unstable];

							window.plugins.androidSpeechPlugin.recognizeNoEOS(
									languageManager.getLanguageConfig(_pluginName),
									successCallbackWrapper(currentSuccessCallback),
									failureCallbackWrapper(currentFailureCallback),
									intermediate_results
							);

						} else {
							// save the last result and start recognition again
//							last_result = [asr_result, asr_score, asr_type, asr_alternatives];

//							window.plugins.androidSpeechPlugin.recognizeNoEOS(
//							languageManager.getLanguageConfig(_pluginName),
//							successCallbackWrapper(currentSuccessCallback),
//							failureCallbackWrapper(currentFailureCallback),
//							intermediate_results
//							);
//							console.warn("[androidAudioInput] Success - Repeat - Else\nType: " + asr_type+"\n"+JSON.stringify(res));
						}

					} else {
						// no repeat, there won't be another recording, so call callback right now with previous and current result

						_wait.ready();

						if (asr_type === result_types.RECORDING_DONE){
						} else if (asr_type === result_types.FINAL){
						}
						call_callback_with_last_result();

						if(typeof res !== "undefined") {
							if (cb){
								cb(asr_result, asr_score, asr_type, asr_alternatives, asr_unstable);
							} else {
								console.error("androidAudioInput Error: No callback function defined for success.");
							}
						} else {
							console.warn("androidAudioInput Warning: result parameter is undefined.");
						}
					}
				});
			};

			
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

					console.error("androidAudioInput ERROR \""+error_msg+"\" (code "+error_code+", type "+error_type+")...");
					
					_wait.ready();

					// TEST: if there is still a pending last result, call successcallback first.
					call_callback_with_last_result();
					if (repeat === true){
						
						
//								"NETWORK_TIMEOUT":			1, //Nuance: SERVER_CONNECTION
//								"NETWORK":					2, //Nuance: SERVER_RETRY
//								"AUDIO": 					3, //Nuance: RECOGNIZER
//								"SERVER": 					4, //Nuance: VOCALIZER
//								"CLIENT": 					5, //Nuance: CANCEL
//								"SPEECH_TIMEOUT":			6  //Nuance -> na
//								"NO_MATCH":					7  //Nuance -> na
//								"RECOGNIZER_BUSY":			8  //Nuance -> na
//								"INSUFFICIENT_PERMISSIONS":	9  //Nuance -> na
//								// >= 10  --> UNKNOWN:
//								"UNKNOWN":					10 //Nuance -> 0
						
						//minor errors -> restart the recognition
						if (
									error_code == error_codes_enum.ERROR_RECOGNIZER_BUSY
								||	error_code == error_codes_enum.NETWORK_TIMEOUT
								||	error_code == error_codes_enum.SPEECH_TIMEOUT
								||	error_code == error_codes_enum.NO_MATCH
						){
							
							var restartFunc = function(){//show loader so that the user knows it may take a while before (s)he can start talking again
								
								if (error_type !== result_types.FINAL){
									_wait.preparing();
								}
								
								//restart:
								window.plugins.androidSpeechPlugin.recognizeNoEOS(
										languageManager.getLanguageConfig(_pluginName),
										successCallbackWrapper(currentSuccessCallback),
										failureCallbackWrapper(currentFailureCallback),
										intermediate_results
								);
							};
							
							//SPECIAL CASE: recognizer already busy -> need to cancel before restarting
							if(
										error_code === error_codes_enum.ERROR_RECOGNIZER_BUSY
							){
								
								//-> first need to cancel current recognizer, then restart again:
								window.plugins.androidSpeechPlugin.cancel(function(){
									
									//now we can restart the recognizer:
									restartFunc();
									
								}, function(error){
									if (cb){
										console.warn("androidAudioInput ERROR while CANCELING due to ERROR_RECOGNIZER_BUSY: Calling error callback (" + error_code + ": " + error_msg + ").");
										cb(error_msg, error_code, error_suggestion);
									}
									else {
										console.error("androidAudioInput ERROR while CANCELING due to ERROR_RECOGNIZER_BUSY: No callback function defined for failure "+error);
									}
									
								});
							}
							else {
								
								//just restart recognition:
								restartFunc();
							}
							
						}
						//on minor errors that do not stop the recognizer -> do nothing
						else if(
								error_code == error_codes_enum.CLIENT
						){
							console.info("androidAudioInput error: "+error_msg+" (code "+error_code+") - continueing ASR process...");
						}
						// call error callback on "severe" errors
						else 
//							if (		error_code < 1 //undefined error!!!
//								|| 	error_code == error_codes_enum.NETWORK
//								|| 	error_code == error_codes_enum.SERVER
//								|| 	error_code == error_codes_enum.AUDIO
//								|| 	error_code == error_codes_enum.INSUFFICIENT_PERMISSIONS
//								|| 	error_code >= error_codes_enum.UNKNOWN // >= : "catch all" for unknown/undefined errors
//						)
						{
							
							if (cb){
								console.warn("androidAudioInput: Calling error callback (" + error_code + ": " + error_msg + ").");
								cb(error_msg, error_code, error_suggestion);
							}
							else {
								console.error("androidAudioInput Error: No callback function defined for failure.");
							}
						}
						
					}
					// "one-time recogintion call", i.e. without intermediate results, that is no repeat-mode requested
					//  --> just call error callback:
					else {
						
						// do no repeat, just call errorCallback
						if (cb){
							console.debug("androidAudioInput: Calling error callback (" + error_code + ").");
							cb(error_msg, error_code, error_suggestion);
						} else {
							console.error("androidAudioInput Error: No callback function defined for failure.");
						}
					}
					
				});
			};

			initCallBack ({
				startRecord: function(successCallback, failureCallback, intermediateResults){

					currentFailureCallback = failureCallback;
					currentSuccessCallback = successCallback;
					repeat = true;
					// HACK: maybe there is a better way to determine intermediate_results with false as standard? similar to webkitAudioInput
					intermediate_results = (intermediateResults === false) ? false : true;

					_wait.preparing();

					window.plugins.androidSpeechPlugin.recognizeNoEOS(
							languageManager.getLanguageConfig(_pluginName),
							successCallbackWrapper(successCallback),
							failureCallbackWrapper(failureCallback),
							intermediate_results
					);
				},
				stopRecord: function(successCallback,failureCallback){
					repeat = false;
					window.plugins.androidSpeechPlugin.stopRecord(
							successCallbackWrapper(successCallback),
							failureCallbackWrapper(failureCallback)
					);
				},
				recognize: function(successCallback,failureCallback){
					repeat = false;

					_wait.preparing();

					window.plugins.androidSpeechPlugin.recognize(
							languageManager.getLanguageConfig(_pluginName),
							successCallbackWrapper(successCallback),
							failureCallbackWrapper(failureCallback)
					);
				},
				cancelRecognition: function(successCallBack,failureCallBack){
					last_result = void(0);
					repeat = false;

					_wait.ready();
					
					window.plugins.androidSpeechPlugin.cancel(successCallBack, failureCallBack);
				}
//				,getMicLevels: function(successCallback,failureCallback){
//
//					window.plugins.androidSpeechPlugin.getMicLevels(
//							successCallback,
//							failureCallback
//					);
//					
//				}
			});


		}

};