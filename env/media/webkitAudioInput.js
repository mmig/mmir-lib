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
 * @name media.plugin.webkitAudioInput
 */
newMediaPlugin = {

		/** @scope media.plugin.webkitAudioInput.prototype */
		initialize: function(callBack, logvalue){

			var _pluginName = 'webkitAudioInput';
			
			var languageManager = require('languageManager');

            //detect feature avaibility:
			if(typeof webkitSpeechRecognition === 'undefined'){
				console.warn('Could not load webkitAudioInput plugin: API webkitSpeechRecognition is not available!');
				
				//FIXME this error message is a quick an dirty hack -- there should be a more general way for defining the error message...
				var msg = 'Unfortunately, your internet browser'
							+'\ndoes not support speech input.'
							+'\n\nPlease use Google Chrome,'
							+'\nif you want to use speech input.'
							+'\n\nhttp://www.google.com/chrome';
				
				callBack( {
					startRecord: function(successCallback, failureCallback){
	    				alert(msg);
	    				if(failureCallback)
	    					failureCallback();
					}
//					, stopRecord: function(successCallback,failureCallback){
//	    				//TODO error msg to user
//					}
					, recognize: function(successCallback,failureCallback){
						alert(msg);
	    				if(failureCallback)
	    					failureCallback();
					}
//	    			, cancelRecognition: function(successCallBack,failureCallBack){
//	    				//TODO error msg to user
//	    			}
				});
//				callBack({});
				return;////////////////////// EARLY EXIT ///////////////////////////
			}
			
			var recognition = new webkitSpeechRecognition();
			var currentSuccessCallback;
			var currentFailureCallback;
            var final_recognition_result = "";
            var default_error_handler_function;
            var default_error_handler_array;
            var error_handler_array;
            
            
            // flags
            var recording = false;
            var active = false;
            var aborted = false;
//            var restart_counter = 0;
            var intermediate_results = false;
            
            // loglevel - shows:
            // 0 - errors
            // 1 - warning, errors
            // 2 - info, warning, errors
            // 3 - logs, info, warning, errors
            // 4 - debugs, logs, info, warning, errors
            var loglevel = logvalue | 0;
            var self = this;
            
            var default_error_handler_array = {
                "no-speech": function(event){
                    if (loglevel >= 1){
                        console.warn("[newMediaPlugin.Warn] " + "event no-speech");
                    }
                    // no errorcallback ! restart
                },
                // Speech input was aborted somehow, maybe by some user-agent-specific behavior such as UI that lets the user cancel speech input.
                "aborted": function(event){
                    // do not restart!
                    aborted = true;
                    if (loglevel >= 1){
                        console.warn("[newMediaPlugin.Warn] " + "event aborted");
                    }
                    currentFailureCallback && currentFailureCallback(event.error);
                },
                // Audio capture failed.
                "audio-capture": function(event){
                    // do not restart!
                    aborted = true;
                    if (loglevel >= 1){
                        console.warn("[newMediaPlugin.Warn] " + "event no-speech");
                    }
                    currentFailureCallback && currentFailureCallback(event.error);
                },
                // Some network communication that was required to complete the recognition failed.
                "network": function(event){
                    // do not restart!
                    aborted = true;
                    if (loglevel >= 1){
                        console.warn("[newMediaPlugin.Warn] " + "event network");
                    }
                },
                // The user agent is not allowing any speech input to occur for reasons of security, privacy or user preference.
                "not-allowed": function(event){
                    // user denied access do not automatically restart!
                    aborted = true;
                    recording = false;
                    if (loglevel >= 1){
                        console.warn("[newMediaPlugin.Warn] " + "event not-allowed");
                    }
                    currentFailureCallback && currentFailureCallback(event.error);
                },
                // The user agent is not allowing the web application requested speech service, but would allow some speech service, to be used either because the user agent doesn't support the selected one or because of reasons of security, privacy or user preference.
                "service-not-allowed": function(event){
                    // user denied access do not automatically restart!
                    aborted = true;
                    if (loglevel >= 1){
                        console.warn("[newMediaPlugin.Warn] " + "event service-not-allowed");
                    }
                    currentFailureCallback && currentFailureCallback(event.error);
                },
                // There was an error in the speech recognition grammar or semantic tags, or the grammar format or semantic tag format is unsupported.
                "bad-grammar": function(event){
                    // do not automatically restart!
                    aborted = true;
                    if (loglevel >= 1){
                        console.warn("[newMediaPlugin.Warn] " + "event bad-grammar");
                    }
                    currentFailureCallback && currentFailureCallback(event.error);
                },
                // The language was not supported.
                "language-not-supported": function(event){
                    // do not automatically restart!, change the language
                    aborted = true;
                    if (loglevel >= 1){
                        console.warn("[newMediaPlugin.Warn] " + "event language-not-supported");
                    }
                    currentFailureCallback && currentFailureCallback(event.error);
                }
            }
            default_error_handler_function = function(event){
                if (default_error_handler_array.hasOwnProperty(event.error)){
                    default_error_handler_array[event.error](event);
                } else {
                    if (currentFailureCallback){
                        currentFailureCallback(event.error);
                    } else {
                        console.error("[newMediaPlugin.Error] " + event.error);
                    }
                }
            }
            
            // set remaining event-handler functions
            recognition.onaudiostart = function(event){
                active = true;
                // if audio can start, then we have been successful in starting the voice recognition
                // so: reset counter
                // TODO: check if this is really correct
//                restart_counter=0;
                if (loglevel >= 4){
                	console.debug("[newMediaPlugin.Debug] " + "Audio START");
                	console.debug("[newMediaPlugin.Debug] " + "active: " + active);
                }
            }
            recognition.onspeechstart = function(event){
                if (loglevel >= 4){
                	console.debug("[newMediaPlugin.Debug] " + "Speech START");
                }
            }
            recognition.onsoundstart  = function(event){
                if (loglevel >= 4){
                	console.debug("[newMediaPlugin.Debug] " + "Sound  START");
                }
            }
            recognition.onaudioend = function(event){
                active = false;
                if (loglevel >= 4){
                	console.debug("[newMediaPlugin.Debug] " + "Audio END");
                }
            }
            recognition.onspeechend = function(event){
                if (loglevel >= 4){
                	console.debug("[newMediaPlugin.Debug] " + "Speech END");
                }
            }
            recognition.onsoundend  = function(event){
                if (loglevel >= 4){
                	console.debug("[newMediaPlugin.Debug] " + "Sound  END");
                }
            }
            recognition.onstart  = function(event){
                if (loglevel >= 4){
                	console.debug("[newMediaPlugin.Debug] " + "asr START");
                }
            }
            recognition.onend  = function(event){
                active = false;
                if (loglevel >= 4){
                	console.debug("[newMediaPlugin.Debug] " + "asr END");
                	console.debug("[newMediaPlugin.Debug] " + "active: " + active);
                }
                // TODO: check if it is alright if we stop restarting the asr when reset_counter is greater than 3
                // --> this would mean, we can never start the asr again in this instance... bad choice
                if ((aborted === false) && (recording === true)){
//                    restart_counter++;
                    recognition.start();
                }
                //FIXME this is a HACK for the stopRecord function ...
                else if(recognition._stopRecordCallback){
                	var theCallback = recognition._stopRecordCallback;
                	//this is a "1-time callback" -> remove it...
                	delete recognition._stopRecordCallback;
                	//... and trigger the callback:
                	theCallback.call(recording, event);
                }
            }
            
            recognition.onerror = default_error_handler_function;
            
            // set maximum number of SpeechRecognitionAlternatives per result. 
            recognition.maxAlternatives = 1;
            
			callBack ({
				startRecord: function(successCallback, failureCallback, intermediateResults){
                    
                    // TODO: failureCallback parameter
                    if (active == true){
                        if (loglevel >= 1){
                            console.warn("[newMediaPlugin.Warn] " + "Voice recognition already running.");
                        }
                        failureCallback("already running");
                        return;
                    }
                    
                    aborted = false;
                    recording = true;
                    
                    // flush any old results
                    final_recognition_result = "";
                    
                    // set intermediate_results - for access by stopRecord
                    intermediate_results = intermediateResults;
                    
                    // set recognition language
                    var langStr = languageManager.getLanguageConfig(_pluginName);
                    if(!langStr){
                    	//default:
                    	langStr = "en-US";
                    }
                	recognition.lang = langStr;
                    
                    // do not stop recognition on silence
                    recognition.continuous = true;
                    
                    // get results continuously
                    recognition.interimResults = (loglevel >= 4) ? true : false;

					currentFailureCallback = failureCallback;
					currentSuccessCallback = successCallback;
                    
                    recognition.onerror = default_error_handler_function;
                    
                    // - see https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-event
                    recognition.onresult = function (event) {
                        var finalResult = '';

                        if (loglevel >= 4){
                            console.debug("[newMediaPlugin.Debug] " + "interim: " + event.results[event.resultIndex][0].transcript + " ("+event.results[event.resultIndex][0].confidence+")");
                        }

                        // if event.results[event.resultIndex].isFinal is true, then there is a pause.
                        if (event.results[event.resultIndex].isFinal) {
                            if (loglevel >= 4){
                                console.debug("[newMediaPlugin.Debug] " + "final");
                            }

                            finalResult = event.results[event.resultIndex][0].transcript;
                            
                            if (intermediate_results == true){
                                // call callback method with result
                                // final_recognition_result += " " + finalResult;
                                final_recognition_result += finalResult;
                                currentSuccessCallback && currentSuccessCallback(finalResult);
                                
                            } else {
                                // final_recognition_result += " " + finalResult;
                                final_recognition_result += finalResult;
                                
                                if (recording == false){
                                    currentSuccessCallback && currentSuccessCallback(final_recognition_result);
                                }
                            }
                        } 
                    };
                    
                    // start the recognition
                    recognition.start();
				},
                
				stopRecord: function(successCallback,failureCallback){
                // TODO: at end of recording return whole recognized stuff in successcallback
                    recording = false;
                    
                    var isSuccessTriggered = false;
                    
                    // recognize (recognition.continuous == true) or stopRecord (recognition.continuous == false)
                    if (recognition.continuous == false){
                        recognition.onresult = function (event) {
                            var finalResult = '';

                            if (loglevel >= 4){
                                console.debug("[newMediaPlugin.Debug] " + "interim: " + event.results[event.resultIndex][0].transcript);
                            }

                            // if event.results[event.resultIndex].isFinal is true, then there is a pause.
                            if (event.results[event.resultIndex].isFinal) {
                                if (loglevel >= 4){
                                    console.debug("[newMediaPlugin.Debug] " + "final");
                                }

                                finalResult = event.results[event.resultIndex][0].transcript;
                                
                                // is it called for the last time (recording == false)
                                if (recording == false){
                                    final_recognition_result += finalResult;
                                    
                                    if (intermediate_results == true){
                                        currentSuccessCallback && currentSuccessCallback(finalResult);
                                    } else {
                                        currentSuccessCallback && currentSuccessCallback(final_recognition_result);
                                    }
                                    
                                    if(successCallback){
                                    	if(isSuccessTriggered){
                                    		console.error('stopRecord: success callback was already triggered!');//FIXME debug
                                    	}
                                    	isSuccessTriggered = true;
                                    	successCallback(final_recognition_result);
                                    }
                                } else {
                                    // final_recognition_result += " " + finalResult;
                                    final_recognition_result += finalResult;
                                    if (intermediate_results == true){
                                        currentSuccessCallback && currentSuccessCallback(finalResult);
                                    }
                                }
                                
                            } 
                        };
                    }
                    // TODO: recognition.onstop = function(){successCallback}
                    
                    //HACK: set an "internal" callback, that will be checked in the onend-listener (see above)
                    //		(NOTE: the onstop()-listener does not seem to get called ...)
                    recognition._stopRecordCallback = function(){
                    	if(successCallback && !isSuccessTriggered){
                    		console.info('stopRecord: calling success callback onstop (without last ASR result)');//FIXME debug
                    		isSuccessTriggered = true;
                        	successCallback('');
                        }
                    };
                    
                    recognition.stop();
				},
                
                cancelRecognition: function(successCallback,failureCallback){
                    recording = false;
                    aborted = true;
                    // callback used if an error occurred - includes abort
                    // gets event as argument - see https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-error
                    // * if aborted - call successCallback

                    recognition.onerror = function(event){
                        if ((event.error == "aborted") && (aborted == true)){
                            aborted = false;
                            recognition.onerror = default_error_handler_function;
                            successCallback && successCallback(event.error);
                        } else {
                            // currentFailureCallback(event.error);
                            default_error_handler_function(event.error);
                        }
                    }

                    recognition.abort();
                },
                
                // doesn't require interimResult - because it stops after first pause; would make no sense
                // TODO: copy startRecord - 
                // FIX: no end event, if recognize() is stopped via stopRecord()
				recognize: function(successCallback,failureCallback){
                    console.warn("DO NOT USE AT THE MOMENT\nUnexpected behavior: if recognition is stopped (via 'stopRecord()'), the 'end' is not thrown. The recognizer is still active, but not usable.")
                
                    if (active == true){
                        if (loglevel >= 1){
                            console.warn("[newMediaPlugin.Warn] " + "Voice recognition already running.");
                        }
                        failureCallback("already running");
                        return;
                    }
                    aborted = false;
                    recording = true;
                    
                    // flush any old results
                    final_recognition_result = "";
                    
                    // recognition.lang = "en-US";
                    var langStr = languageManager.getLanguageConfig(_pluginName);
                    if(!langStr){
                    	//default:
                    	langStr = "en-US";
                    }
                	recognition.lang = langStr;

                    // stop recognition on silence
                    recognition.continuous = false;
                    
                    // not needed for recognize
                    // // set intermediate_results - for access by stopRecord
                    recognition.interimResults = (loglevel >= 4) ? true : false;

					currentFailureCallback = failureCallback;
					currentSuccessCallback = successCallback;
                    
                    recognition.onerror = default_error_handler_function;
                    
                    var self = this;
                    // - see https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-event
                    recognition.onresult = function (event) {
                        var finalResult = '';

                        if (loglevel >= 4){
                            console.debug("[newMediaPlugin.Debug] " + "interim: " + event.results[event.resultIndex][0].transcript);
                        }

                        // if event.results[event.resultIndex].isFinal is true, then there is a pause.
                        if (event.results[event.resultIndex].isFinal) {
                            if (loglevel >= 4){
                                console.debug("[newMediaPlugin.Debug] " + "final");
                            }

                            finalResult = event.results[event.resultIndex][0].transcript;
                            
                            // stop recording - finish after one sentence!
                            recording = false
                            
                            
                            // TODO: dirty hack - somehow it does not throw end event after recognition if recognize is used
                            self.cancelRecognition();
                            currentSuccessCallback && currentSuccessCallback(finalResult);
                        } 
                    };
                    
                    // start the recognition
                    recognition.start();
				},
                getLoglevel: function(){
                    return loglevel;
                },
                // default: set loglevel to 0
                setLoglevel: function(logvalue){
                    loglevel = logvalue | 0;
                    return loglevel;
                },
                getRecognition: function(){
                    return recognition;
                }
			});
		    		
		    		
		}
		
};