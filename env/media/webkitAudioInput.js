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
			
			
			
			
			
			
			var html5Navigator = navigator;
			var _audioContext, nonFunctional = false;
			try {
		        // unify the different kinds of HTML5 implementations
				//window.AudioContext = window.AudioContext || window.webkitAudioContext;
				html5Navigator.__getUserMedia = html5Navigator.getUserMedia || html5Navigator.webkitGetUserMedia || html5Navigator.mozGetUserMedia;
				//window.URL = window.URL || window.webkitURL;
//		    	_audioContext = new webkitAudioContext;

				if(typeof AudioContext !== 'undefined'){
					_audioContext = new AudioContext;
				}
				else {//if(typeof webkitAudioContext !== 'undefined'){
					_audioContext = new webkitAudioContext;
				}
			} 
			catch (e) {
				console.error('No web audio support in this browser! Error: '+(e.stack? e.stack : e));
				nonFunctional = true;
			}
			
			var MIC_MAX_VAL = 2;//FIXME verify / check if this is really the maximal possible value...
			var MIC_MAX_NORM_VAL = -90;// -90 dB ... ???
			var normalize = function (v){
				return MIC_MAX_NORM_VAL * v / MIC_MAX_VAL;
			}
			var getRms = function (buffer, size){
				if(!buffer || size === 0){
					return 0;
				}
				
				var sum = 0, i = 0;
				for(; i < size; ++i){
					sum += buffer[i];
				}
				var avg = sum / size;
				
				var meansq = 0;
				for(i=0; i < size; ++i){
					meansq += Math.pow(buffer[i] - avg, 2); 
				}
				
				var avgMeansq = meansq / size;
				
				return Math.sqrt(avgMeansq);
			};
			var _currentInputStream;
			var _audioAnalyzer;
			function _startUserMedia(inputstream){
				console.log('webkitAudioInput: start analysing audio input...');
				var buffer = 0;
				
				_currentInputStream = inputstream;
				var inputNode = _audioContext.createMediaStreamSource(_currentInputStream);
				
				  ///////////////////// VIZ ///////////////////
//				  recorder = recorderInstance;

				  _audioAnalyzer = _audioContext.createAnalyser();
				  _audioAnalyzer.fftSize = 2048;
//				  _audioAnalyzer.smoothingTimeConstant = 1;
				  inputNode.connect(_audioAnalyzer);
				  
//				  audioRecorder = new Recorder( inputPoint );
//				  recorder = new Recorder(inputPoint, {workerPath: recorderWorkerPath});

//				  updateAnalysers();
				  
				  var updateAnalysis = function(){
					  if(!_currentInputStream){
						  return;
					  }
					  
					  var size = _audioAnalyzer.fftSize;//.frequencyBinCount;//
					  var data = new Uint8Array(size);//new Float32Array(size);//
					  _audioAnalyzer.getByteTimeDomainData(data);//.getFloatFrequencyData(data);//.getByteFrequencyData(data);//.getFloatTimeDomainData(data);//
					  
					  var min = 32768;
					  var max = -32768;
					  var total = 0;
					  for(var i=0; i < size; ++i){
						  var datum = Math.abs(data[i]); 
						  if (datum < min)
							  min = datum;
						  if (datum > max)
							  max = datum;
						  
						  total += datum;
					  }
					  var avg = total / size;
//					  console.info('audio ['+min+', '+max+'], avg '+avg);
				  
//					  _currentMicMax = normalize(max);
//					  _currentMicMin = normalize(min);
//					  _currentMicAvg = normalize(avg);
//					  _currentMicTime = new Date().getTime();
//					  
//					  _currentMicValues.push({v: normalize(max), t: new Date().getTime()});
					  
//					  var rms = getRms(data, size);
//					  var db = 20 * Math.log(rms);// / 0.0002);
//					  
//					  console.info('audio rms '+rms+', db '+db);
					  
					  /* RMS stands for Root Mean Square, basically the root square of the
					   * average of the square of each value. */
					  var rms = 0, val;
					  for (var i = 0; i < data.length; i++) {
						val = data[i] - avg;
					    rms += val * val;
					  }
					  rms /= data.length;
					  rms = Math.sqrt(rms);
					  
					  var db = rms;
//					  console.info('audio rms '+rms);
					  
					  _currentMicValues.push({v: db, t: new Date().getTime()});
					  
					  if(_currentInputStream){
						  setTimeout(updateAnalysis, 50);
					  }
				  }
				  updateAnalysis();
				  ///////////////////// VIZ ///////////////////
				  
			}
			function doGetUserAudio(){
				html5Navigator.__getUserMedia({audio: true}, _startUserMedia, function(e) {console.error(e)});
			}
			function doStopUserAudio(){
				if(_currentInputStream){
					var stream = _currentInputStream;
					_currentInputStream = void(0);
					stream.stop();
//					_currentMicMax = void(0);
//					_currentMicMin = void(0);
//					_currentMicAvg = void(0);
//					_currentMicTime = void(0);
					
					_currentMicValues.splice(0, _currentMicValues.length);
					console.log('webkitAudioInput: stopped analysing audio input!');
				}
			}
//			var _currentMicMax;
//			var _currentMicMin;
//			var _currentMicAvg;
//			var _currentMicTime;
			
			var _currentMicValues = [];
			
			
			

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
			
			var EVENT_RESULT_FIELD = "transcript";
			var EVENT_SCORE_FIELD = "confidence";
			var UNSTABLE_LIMIT = 0.01;
			
			var RESULT_TYPES = {
				"FINAL": 				"FINAL",
				"INTERIM": 				"INTERIM",
				"INTERMEDIATE":			"INTERMEDIATE",
				"RECOGNITION_ERROR": 	"RECOGNITION_ERROR",
				"RECORDING_BEGIN": 		"RECORDING_BEGIN",
				"RECORDING_DONE": 		"RECORDING_DONE"
			};
			
			var recognition = new webkitSpeechRecognition();
			var currentSuccessCallback;
			var currentFailureCallback;
            var final_recognition_result = "";
            var default_error_function;
            var helper_error_handler;
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
            var loglevel = 4;//FIXME logvalue | 0;
            var self = this;
            
            var _prevResult;
            /**
             * create callback-arguments for ASR-result callback: 
             * 
             * @resturns Array with 
             * 		[	String result, 
             * 			Number score, 
             * 			String type ["INTERIM" | "FINAL" ], 
             * 			Array<Results> alternatives,		//OPTIONAL
             * 			String unstable						//OPTIONAL (NOTE: not supported by this plugin, i.e. webkitSpeechInput)
             * 		]
             */
            var helper_extract_results = function(eventResultsObject){
            	var res = [];
            	var size = eventResultsObject.length;
            	
            	if(size < 1){
            		return res;
            	}
            	
            	//ASSERT size >= 1
            	
            	var result = eventResultsObject[0][EVENT_RESULT_FIELD];
            	// [0]: main result
            	res.push(result);
            	// [1]: main confidence score
            	res.push(eventResultsObject[0][EVENT_SCORE_FIELD]);
            	
            	// [2]: result type
            	if(eventResultsObject.isFinal){
            		res.push(RESULT_TYPES.FINAL);
            	}
            	else {
            		res.push(RESULT_TYPES.INTERIM);
            	}
            	
            	// [3]: array with alternative results
            	if(size > 1){
            		var altRes = [];
            		for(var i=1; i < size; ++i){
            			altRes.push({
            				result: eventResultsObject[i][EVENT_RESULT_FIELD],
            				score:  eventResultsObject[i][EVENT_SCORE_FIELD]
            			});
            		}
            		res.push(altRes);
            	}
            	else {
            		
            		//if no alternative results: add undefined-entry:
            		res.push(void(0));
            	}
            	
            	// [4]: UNSTABLE part for main result
            	
            	//NOTE "unstable" part of ASR result is not supported by webkitSpeechInput...
            	//HACK: detect unstable for non-final results:
            	//      * set to unstable if confidence is lower than UNSTABLE_LIMIT
            	//      * otherwise (ie. result is basically STABLE), try 
            	//        to detect an UNSTABLE part using the previous result
            	//        (if previous result contained more than the current stable one...)
            	if( ! eventResultsObject.isFinal){
            		
            		//set to unstable, if result has a LOW score
            		if(res[1] <= UNSTABLE_LIMIT){
            			//add result as "unstable":
	            		res.push(result);
	            		//set main-result to empty
	            		res[0] = "";
            		}
            		//try to recover unstable part:
            		else if(res[1] > UNSTABLE_LIMIT && _prevResult && _prevResult.length > length){
            			            			
            			//try to detect stable part: detect matching prefix with previous result
            			var prefixIndex = 0;
            			var size = result.length;
            			var ch = result.charAt(prefixIndex).toLowerCase();
            			while(size > prefixIndex && ch === _prevResult.charAt(prefixIndex).toLowerCase()){
            				ch = result.charAt(++prefixIndex).toLowerCase();
            			}
            			
            			//-> use REST from matching prefix as UNSTABLE text
            			//NOTE: use simplification (i.e. simpler code) ignore matches <= 1, ie. prefixIndex > 0
            			if(prefixIndex > 0 && prefixIndex + 1 < _prevResult.length){

    	            		//add REST to detected PREFIX as "unstable":
    	            		res.push(_prevResult.substring(prefixIndex+1));

            				console.info('found unstable ASR part: "'+_prevResult.substring(prefixIndex+1)+'"');
            			}
            			else {
            				// -> we have relatively stable result, that has no unstable postfix -> reset _prevResult;
            				_prevResult = void(0);
            			}
            		}
            		
                	//remember current (main) result STRING, if it "adds information":
            		if(!_prevResult || result.length >= _prevResult.length){
            			_prevResult = result;
            		}
            		
            	}
            	else {
                	//if FINAL, reset field for previous-result 
                	_prevResult = void(0);
            	}
            	
            	
            	return res;
            };
            
            /**
             * default helper for error-events:
             * 
             * determines, if RESTART is allowed/possible (in case of RECORDing mode),
             * AND otherwise triggers the current failure-callbacks.
             * 
             * SIDE-EFFECTS: sets private field aborted:=true if RESTART is NOT possible.
             * 
             * @returns {Boolean} true, if the function could process the error
             * 		 (i.e. return false for unknown errors; these should be handled by 
             *        the invoking code of this helper function)
             */
            var helper_error_handler = function(event) {
            	
            	var type = event.error;
            	
            	switch(type){
            	case "no-speech":
                    if (loglevel >= 1){
                        console.info("[newMediaPlugin.Warn] event " + type);
                    }
                    // no errorcallback, just restart (if in RECORD mode)...
                    return true;
                    
                ////////////////
                // "serious" errors: cannot not automatically restart...
                
                // Speech input was aborted somehow, maybe by some user-agent-specific behavior such as UI that lets the user cancel speech input.
            	case "aborted":
                    // do not restart!
                
                // Audio capture failed.
            	case "audio-capture":
                    // do not restart!
                
                // Some network communication that was required to complete the recognition failed.
            	case "network":
                    // do not restart!
                
                // The user agent is not allowing any speech input to occur for reasons of security, privacy or user preference.
            	case "not-allowed":
                    // user denied access -> do not automatically restart!
                
                // The user agent is not allowing the web application requested speech service, but would allow some speech service, to be used either because the user agent doesn't support the selected one or because of reasons of security, privacy or user preference.
            	case "service-not-allowed":
                    // user agent denied access -> do not automatically restart!
            		
                // There was an error in the speech recognition grammar or semantic tags, or the grammar format or semantic tag format is unsupported.
            	case "bad-grammar":
                    // do not automatically restart!
            		
                // The language was not supported.
            	case "language-not-supported":
                    // do not automatically restart!, change the language
                    aborted = true;
                    if (loglevel >= 1){
                        console.warn("[newMediaPlugin.Warn] event " + type);
                    }
                    currentFailureCallback && currentFailureCallback(event.error);
                    return true;
                    
            	default:
                	//for unknown errors: return false
            		break;
            		
            	}//END: switch
            	
            	return false;
            }; //END: helper_error_handler(event){...
            
            default_error_function = function(event){
//                if (helper_error_handler.hasOwnProperty(event.error)){
//                    helper_error_handler[event.error](event);
//                } else {
            	if( ! helper_error_handler(event) ){
            		
                    if (currentFailureCallback){
                        currentFailureCallback(event.error);
                    } else {
                        console.error("[newMediaPlugin.Error] event " + event.error);
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

                doGetUserAudio();
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

                doStopUserAudio();
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
            
            recognition.onerror = default_error_function;
            
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
                    
                    _prevResult = void(0);
                    
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
                    
                    recognition.onerror = default_error_function;
                    
                    // - see https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-event
                    recognition.onresult = function (event) {
                        var finalResult = '';

                        var evtResults = event.results[event.resultIndex];
                        if (loglevel >= 4){
//                            console.debug("[newMediaPlugin.Debug] " + "interim: " + event.results[event.resultIndex][0][EVENT_RESULT_FIELD] + " ("+event.results[event.resultIndex][0].confidence+")");
                            
                            console.debug("[newMediaPlugin.Debug] " + "interim: " + JSON.stringify(event.results));
                        }

                        // if event.results[event.resultIndex].isFinal is true, then there is a pause.
                        if (evtResults.isFinal) {
                            if (loglevel >= 4){
                                console.debug("[newMediaPlugin.Debug] " + "final");
                            }

                            finalResult = evtResults[0][EVENT_RESULT_FIELD];
                            
                            if (intermediate_results == true){
                            	
                            	//INTERMEDIATE results mode: only message last ASR to callback: 
                            	
                                // call callback method with result
                                // final_recognition_result += " " + finalResult;
                                final_recognition_result += finalResult;
//                                currentSuccessCallback && currentSuccessCallback(finalResult);
                                currentSuccessCallback && currentSuccessCallback.apply(this, helper_extract_results(evtResults) );
                                
                            } else {

                            	//FINAL results mode: message collected ASR results to callback:
                            	
                                // final_recognition_result += " " + finalResult;
                                final_recognition_result += finalResult;
                                
                                //audio-input already closed --> this is the last invocation of the callback, so send final result
                                if (recording == false){
                                    currentSuccessCallback && currentSuccessCallback(final_recognition_result);
                                }
                            }
                            
                        }
                        //for intermediate result (only if we have a callback):
                        else if (intermediate_results == true && currentSuccessCallback){
                            currentSuccessCallback.apply(this, helper_extract_results(evtResults) );
                        }
                    };
                    
                    // start the recognition
                    recognition.start();
				},
                
				stopRecord: function(successCallback,failureCallback){
                // TODO: at end of recording return whole recognized stuff in successcallback
                    recording = false;
                    
                    var isSuccessTriggered = false;
                    
                    var self = this;
                    
                    // recognize (recognition.continuous == true) or stopRecord (recognition.continuous == false)
                    if (recognition.continuous == false){
                    	
                        recognition.onresult = function (event) {
                            var finalResult = '';

                            if (loglevel >= 4){
                                console.debug("[newMediaPlugin.Debug] " + "interim: " + event.results[event.resultIndex][0][EVENT_RESULT_FIELD]);
                            }
                            
                            var evtResults = event.results[event.resultIndex];
                            // if event.results[event.resultIndex].isFinal is true, then there is a pause.
                            if (evtResults.isFinal) {
                                if (loglevel >= 4){
                                    console.debug("[newMediaPlugin.Debug] " + "final");
                                }

                                finalResult = evtResults[0][EVENT_RESULT_FIELD];
                                
                                // is it called for the last time (recording == false)
                                if (recording == false){
                                    final_recognition_result += finalResult;
                                    
                                    if (intermediate_results == true){
//                                        currentSuccessCallback && currentSuccessCallback(finalResult);
                                    	currentSuccessCallback && currentSuccessCallback.apply(self, helper_extract_results(evtResults) );
                                    } else {
                                        currentSuccessCallback && currentSuccessCallback.call(self, final_recognition_result);
                                    }
                                    
                                    if(successCallback){
                                    	if(isSuccessTriggered){
                                    		console.error('stopRecord: success callback was already triggered!');//FIXME debug
                                    	}
                                    	isSuccessTriggered = true;
                                    	successCallback.call(self, final_recognition_result);
                                    }
                                } else {
                                    // final_recognition_result += " " + finalResult;
                                    final_recognition_result += finalResult;
                                    if (intermediate_results == true){
                                        currentSuccessCallback && currentSuccessCallback.call(self, finalResult);
                                    }
                                }
                                
                            }
                            else {
                            	currentSuccessCallback && currentSuccessCallback.apply(self, helper_extract_results(evtResults) );
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
                            recognition.onerror = default_error_function;
                            successCallback && successCallback(event.error);
                        } else {
                            // currentFailureCallback(event.error);
                            default_error_function(event.error);
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
                    
                    _prevResult = void(0);
                    
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
                    
                    recognition.onerror = default_error_function;
                    
                    var self = this;
                    // - see https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-event
                    recognition.onresult = function (event) {
//                        var finalResult = '';

                        if (loglevel >= 4){
                            console.debug("[newMediaPlugin.Debug] " + "interim: " + event.results[event.resultIndex][0][EVENT_RESULT_FIELD]);
                        }

                        // if event.results[event.resultIndex].isFinal is true, then there is a pause.
                        if (event.results[event.resultIndex].isFinal) {
                            if (loglevel >= 4){
                                console.debug("[newMediaPlugin.Debug] " + "final");
                            }

//                            finalResult = event.results[event.resultIndex][0][EVENT_RESULT_FIELD];
                            
                            var returnArgs = helper_extract_results(event.results[event.resultIndex]);
                            
                            // stop recording - finish after one sentence!
                            recording = false;
                            
                            
                            // TODO: dirty hack - somehow it does not throw end event after recognition if recognize is used
                            self.cancelRecognition();
                            currentSuccessCallback && currentSuccessCallback.apply(self, returnArgs);//finalResult);
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
                // default: set loglevel to 0
                getMicLevels: function(cb){
                	var value;
//                	if(typeof _currentMicTime === 'undefined'){
//                		value = [];
//                	}
//                	else {
//                		value = [{v: _currentMicMax, t: _currentMicTime }];
//                	}

            		value = _currentMicValues.splice(0, _currentMicValues.length);
                	
                	if(cb){
                		cb.call(this, value);
                	}
                	
                	return value;
                }
//                , getRecognition: function(){
//                    return recognition;
//                }
			});
		    		
		    		
		}
		
};
