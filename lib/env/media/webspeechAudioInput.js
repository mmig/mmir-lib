
define(['mmirf/mediaManager', 'mmirf/configurationManager', 'mmirf/languageManager', 'mmirf/logger'], function(mediaManager, config, lang, Logger){

/**
 * @class WebspeechAudioInput
 * @memberOf mmir.env.media
 * @hideconstructor
 */
return {

	/**  @memberOf mmir.env.media.WebspeechAudioInput# */
	initialize: function(callBack, ctxId, _moduleConfig){

		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @readonly
		 * @protected
		 * @default "webspeechAudioInput"
		 */
		var _pluginName = 'webspeechAudioInput';

		/**
		 * @type mmir.tools.Logger
		 * @memberOf mmir.env.media.WebspeechAudioInput#
 		 * @private
		 */
		var logger = Logger.create(_pluginName + (ctxId? ':'+ctxId : ''));

		/** @type SpeechRecognition
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var SpeechRecognitionImpl;

		//detect feature avaibility:
		if(typeof webkitSpeechRecognition !== 'undefined'){
			SpeechRecognitionImpl = webkitSpeechRecognition;
		} else if(typeof SpeechRecognition !== 'undefined'){
			SpeechRecognitionImpl = SpeechRecognition;
		}

		if(!SpeechRecognitionImpl){
			//... browser does NOT support this speech-input-module: create warning message and dummy functions for the MediaManager

			logger.error('Could not load '+_pluginName+' plugin: API SpeechRecognition is not available!');

			//FIXME this error message is a quick an dirty hack -- there should be a more general way for defining the error message...
			var msg = 'Unfortunately, your internet browser'
				+'\ndoes not support Web Speech Recognition.'
				+'\n\nPlease use Google Chrome,'
				+'\nif you want to use speech input.'
				+'\n\nhttps://www.google.com/chrome';

			callBack({}, {
				mod: _pluginName,
				disabled: ['startRecord', 'stopRecord', 'recognize', 'cancelRecognition', 'getRecognitionLanguages', 'getLoglevel', 'setLoglevel'],
				message: msg
			});
			return;////////////////////// EARLY EXIT ///////////////////////////
		}

		/**
		 * @constant
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var EVENT_RESULT_FIELD = "transcript";
		/**
		 * @constant
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var EVENT_SCORE_FIELD = "confidence";
		/**
		 * @constant
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var UNSTABLE_LIMIT = 0.01;

		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private */
		var DEFAULT_LANGUAGE = 'en-US';

		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private */
		var DEFAULT_ALTERNATIVE_RESULTS = 1;

		/**
		 * Result types (returned by the native/Cordova plugin)
		 *
		 * @type Enum
		 * @constant
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput#
		 */
		var RESULT_TYPES = {
				"FINAL": 				"FINAL",
				"INTERIM": 				"INTERIM",
				"INTERMEDIATE":			"INTERMEDIATE",
				"RECOGNITION_ERROR": 	"RECOGNITION_ERROR",
				"RECORDING_BEGIN": 		"RECORDING_BEGIN",
				"RECORDING_DONE": 		"RECORDING_DONE"
		};

		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private */
		var micLevelsImplFile = 'webMicLevels';

		/** @type SpeechRecognition
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var recognition = new SpeechRecognitionImpl();
		/** @type Function
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var currentSuccessCallback;
		/** @type Function
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var currentFailureCallback;
		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private */
		var final_recognition_result = "";
		/** @type Function
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var default_error_function;
		/** @type Function
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var helper_error_handler;


		// flags

		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private */
		var recording = false;
		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private */
		var active = false;
		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private */
		var aborted = false;
//		var restart_counter = 0;
		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private */
		var intermediate_results = false;

		var loglevel = config.get([_pluginName, 'logLevel']);
		if(typeof loglevel !== 'undefined'){
			logger.setLevel(loglevel);
		}

		/**
		 * field for storing the previous (main) recontion result
		 * (this is used for calculating "unstable" parts, see {@link #helper_extract_results})
		 * @type String
 		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput#
		 */
		var _prevResult;
		/**
		 * create callback-arguments for ASR-result callback:
		 *
		 * @returns Array with
		 * 		<pre>
		 * 		[	String result,
		 * 			Number score,
		 * 			String type ["INTERIM" | "FINAL" ],
		 * 			Array<Results> alternatives,         //OPTIONAL
		 * 			String unstable                      //OPTIONAL
		 * 		]
		 * 		</pre>
		 *
		 * @memberOf mmir.env.media.WebspeechAudioInput#
 		 * @private
 		 * @function
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
				res.push(recording? RESULT_TYPES.INTERMEDIATE : RESULT_TYPES.FINAL);
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

			//NOTE "unstable" part of ASR result is not "natively" supported by webkitSpeechInput...
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

						if(logger.isi()) logger.info('found unstable ASR part: "'+_prevResult.substring(prefixIndex+1)+'"');
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
		 * Counter for error-in-a-row:
		 * each time an error is encountered, this counter is increased.
		 * On starting/canceling, or on an internal success/result callback,
		 * the counter is reset.
		 *
		 * Thus, this counter keeps track how many times in a row
		 * the (internal) error-callback was triggered.
		 *
		 * NOTE: this is currently used, to try restarting <code>max_error_retry</code>
		 * 		 times the ASR, even on "critical" errors (during repeat-mode).
		 *
		 * @see #max_error_retry
		 *
		 * @memberOf AndroidAudioInput#
 		 * @private
		 */
		var error_counter = 0;

		/**
		 * Maximal number of errors-in-a-row for trying to restart
		 * recognition in repeat-mode.
		 *
		 * @see #error_counter
		 *
		 * @memberOf mmir.env.media.WebspeechAudioInput#
		 * @default 5
 		 * @private
		 */
		var max_error_retry = 5;

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
		 *
		 * @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private
		 * @function helper_error_handler
		 */
		helper_error_handler = function(event) {

			var type = event.error;

			switch(type){
			case "no-speech":

				if (logger.isi()) logger.info("event " + type);

				// no errorcallback, just restart (if in RECORD mode)...
				return true;

				////////////////
				// "serious" errors: cannot not automatically restart...

				// Audio capture failed.
			case "audio-capture":
				// if analysing-audio for microphone levels (via getUserMedia)
				//    is enabled, the error may have been caused by the browser/device
				//    due to the fact, that it does not allow multiple/parallel access
				//    to the microphone resource...
				// -> try once again, but with disabled analysing-audio feature:
				if(mediaManager.micLevelsAnalysis.enabled()){
					mediaManager.micLevelsAnalysis.enabled(false);
					return true;
				}

				// ...otherwise: do not restart!

				// Some network communication that was required to complete the recognition failed.
			case "network":
				// do not restart!

				//for "serious errors": if errors-in-a-row-counter is under the limit, DO try to restart
				if(error_counter < max_error_retry){
					return true;
				}

				// Speech input was aborted somehow, maybe by some user-agent-specific behavior such as UI that lets the user cancel speech input.
			case "aborted":
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

				if (logger.isw()) logger.warn("event " + type);

				currentFailureCallback && currentFailureCallback(event.error);
				return true;

			default:
				//for unknown errors: return false
				break;

			}//END: switch

			return false;
		}; //END: helper_error_handler(event){...

		/** @memberOf mmir.env.media.WebspeechAudioInput#
		 * @private */
		default_error_function = function(event){

			++error_counter;

//			if (helper_error_handler.hasOwnProperty(event.error)){
//				helper_error_handler[event.error](event);
//			} else
			if( ! helper_error_handler(event) ){

				if (currentFailureCallback){
					currentFailureCallback(event.error);
				} else {
					logger.error("event " + event.error);
				}
			}
		};

		// set remaining event-handler functions

		/**
		 * Side-Effects:
		 *
		 * sets recognition-status to "active"
		 *
		 * starts audio-analysis (if listeners are registered for mic-levels-changed event)
		 *
		 * @memberOf mmir.env.media.WebspeechAudioInput.recognition#
		 * @private
		 */
		recognition.onaudiostart = function(_event){
			active = true;
			// if audio can start, then we have been successful in starting the voice recognition
			// so: reset counter
			// TODO: check if this is really correct
			// restart_counter=0;
			if (logger.isd()){
				logger.debug("Audio START");
				logger.debug("  active: " + active);
			}

			mediaManager.micLevelsAnalysis.start();
		};
		/** @memberOf mmir.env.media.WebspeechAudioInput.recognition#
		 * @private */
		recognition.onaudioend = function(_event){
			active = false;

			if (logger.isd()) logger.debug("Audio END");

			// mediaManager.micLevelsAnalysis.stop();// MOVED to onend: in some cases, onaudioend will not be triggered, but onend will always get triggered
		};

		/**
		 * Side-Effects:
		 *
		 * sets recognition-status to "inactive"
		 *
		 * re-starts recognition if in "recoring" mode OR calls stopped-callback
		 *
		 * @memberOf mmir.env.media.WebspeechAudioInput.recognition#
		 * @private
		 */
		recognition.onend = function(event){

			active = false;

			if (logger.isd()) logger.debug("Recognition END (active: "+active+")");

			//NOTE there may be no analysis open, but stopping here (and not e.g. in onaudioen)
			//     will ensure that we _always_ remove analysis, if it is present:
			mediaManager.micLevelsAnalysis.stop();

			// TODO: check if it is all right, if we stop restarting the asr when reset_counter is greater than 3
			// --> this would mean, we can never start the asr again in this instance... bad choice
			if ((aborted === false) && (recording === true)){
				// restart_counter++;
				recognition.start();
			}
			//FIXME this is a HACK for the stopRecord function ...
			else if(recognition._stopRecordCallback){
				var theCallback = recognition._stopRecordCallback;
				//this is a "1-time callback" -> remove it...
				delete recognition._stopRecordCallback;
				//... and trigger the callback:
				theCallback.call(recognition, event);
			}
		};

		/**
		 * @type function
		 * @memberOf mmir.env.media.WebspeechAudioInput.recognition#
		 * @private
		 */
		recognition.onerror = default_error_function;

		// only set hooks if logging level is DEBUG:
		if (logger.isd()) {

			/** @memberOf mmir.env.media.WebspeechAudioInput.recognition#
			 * @private */
			recognition.onspeechstart = function(_event){
				logger.debug("Speech START");
			};
			/** @memberOf mmir.env.media.WebspeechAudioInput.recognition#
			 * @private */
			recognition.onsoundstart  = function(_event){
				logger.debug("Sound  START");
			};
			/** @memberOf mmir.env.media.WebspeechAudioInput.recognition#
			 * @private */
			recognition.onspeechend = function(_event){
				logger.debug("Speech END");
			};
			/** @memberOf mmir.env.media.WebspeechAudioInput.recognition#
			 * @private */
			recognition.onsoundend  = function(_event){
				logger.debug("Sound  END");
			};
			/** @memberOf mmir.env.media.WebspeechAudioInput.recognition#
			 * @private */
			recognition.onstart  = function(_event){
				logger.debug("Recognition START");
			};
		}

		/**
		 * set maximum number of SpeechRecognitionAlternatives per result.
		 *
		 * @type Number
		 * @memberOf mmir.env.media.WebspeechAudioInput.recognition#
		 * @private
		 */
		recognition.maxAlternatives = DEFAULT_ALTERNATIVE_RESULTS;


		// HACK [russa 2021-10]:
		//      if stopRecord() is called while startRecord()/recognize() is still initializing (e.g. onaudiostart() has not triggered yet),
		//      then recognition is started, even if recognition.stop() was called AFTER recognition.start()
		//
		// -> WORKAROUND: if startRecord()/recognize() was started less than MIN_STOP_DELAY before stopRecord() was called,
		//                then do inovked stopRecord() delayed, in order to allow initializing of recognition some time to get to a "stoppable" state
		var MIN_STOP_DELAY = 60;
		var stopTimer;
		var startTime;
		var cancelDelayedStop = function(){
			if(stopTimer){
				clearTimeout(stopTimer);
				stopTimer = 0;
			}
		};

		/** @type webspeechAudioInput
		 * @private
		 * @memberOf mmir.env.media.WebspeechAudioInput# */
		var pluginExports = {
				/**
				 * Start speech recognition (without <em>end-of-speech</em> detection):
				 * after starting, the recognition continues until {@link #stopRecord} is called.
				 *
				 * @async
				 *
				 * @param {PlainObject} [options] OPTIONAL
				 * 		options for Automatic Speech Recognition:
				 * 		<pre>{
				 * 			  success: OPTIONAL Function, the status-callback (see arg statusCallback)
				 * 			, error: OPTIONAL Function, the error callback (see arg failureCallback)
				 * 			, language: OPTIONAL String, the language for recognition (if omitted, the current language setting is used)
				 * 			, intermediate: OTPIONAL Boolean, set true for receiving intermediate results (NOTE not all ASR engines may support intermediate results)
				 * 			, results: OTPIONAL Number, set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)
				 * 			, mode: OTPIONAL "search" | "dictation", set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)
				 * 			, eosPause: OTPIONAL "short" | "long", length of pause after speech for end-of-speech detection (NOTE not all ASR engines may support this option)
				 * 			, disableImprovedFeedback: OTPIONAL Boolean, disable improved feedback when using intermediate results (NOTE not all ASR engines may support this option)
				 * 		}</pre>
				 *
				 * @param {Function} [statusCallback] OPTIONAL
				 * 			callback function that is triggered when, recognition starts, text results become available, and recognition ends.
				 * 			The callback signature is:
				 * 				<pre>
				 * 				callback(
				 * 					text: String | "",
				 * 					confidence: Number | Void,
				 * 					status: "FINAL"|"INTERIM"|"INTERMEDIATE"|"RECORDING_BEGIN"|"RECORDING_DONE",
				 * 					alternatives: Array<{result: String, score: Number}> | Void,
				 * 					unstable: String | Void
				 * 				)
				 * 				</pre>
				 *
				 * 			Usually, for status <code>"FINAL" | "INTERIM" | "INTERMEDIATE"</code> text results are returned, where
				 * 			<pre>
				 * 			  "INTERIM": an interim result, that might still change
				 * 			  "INTERMEDIATE": a stable, intermediate result
				 * 			  "FINAL": a (stable) final result, before the recognition stops
				 * 			</pre>
				 * 			If present, the <code>unstable</code> argument provides a preview for the currently processed / recognized text.
				 *
				 * 			<br>NOTE that when using <code>intermediate</code> mode, status-calls with <code>"INTERMEDIATE"</code> may
				 * 			     contain "final intermediate" results, too.
				 *
				 * 			<br>NOTE: if used in combination with <code>options.success</code>, this argument will supersede the options
				 *
				 * @param {Function} [failureCallback] OPTIONAL
				 * 			callback function that is triggered when an error occurred.
				 * 			The callback signature is:
				 * 				<code>callback(error)</code>
				 *
				 * 			<br>NOTE: if used in combination with <code>options.error</code>, this argument will supersede the options
				 *
				 * @memberOf mmir.env.media.WebspeechAudioInput.prototype
				 * @see mmir.MediaManager#startRecord
				 */
				startRecord: function(options, statusCallback, failureCallback, intermediateResults){//argument intermediateResults is deprecated (use options.intermediate instead)

					if(typeof options === 'function'){
						intermediateResults = failureCallback;
						failureCallback = statusCallback;
						statusCallback = options;
						options = void(0);
					}

					if(!options){
						options = {};
					}
					options.success = statusCallback? statusCallback : options.success;
					options.error = failureCallback? failureCallback : options.error;
					options.intermediate = typeof intermediateResults === 'boolean'? intermediateResults : !!options.intermediate;
					options.language = options.language? options.language : lang.getLanguageConfig(_pluginName) || DEFAULT_LANGUAGE;
					options.results = options.results? options.results : DEFAULT_ALTERNATIVE_RESULTS;
					//TODO
//					options.disableImprovedFeedback =
//					options.mode =
//					options.eosPause =

					var errMsg;
					if (active == true){

						errMsg = "Voice recognition already running.";

						if(options.error){
							options.error('[WARN] '+_pluginName+': '+errMsg);
						} else {
							logger.warn(errMsg);
						}
						return;////////////////////////// EARLY EXIT //////////////////////////
					}

					//HACK [russa] for delayed stopRecord()
					cancelDelayedStop();
					startTime = Date.now();

					aborted = false;
					recording = mediaManager.micLevelsAnalysis.active(true);
					error_counter = 0;

					_prevResult = void(0);

					// flush any old results
					final_recognition_result = "";

					// set recognition language
					recognition.lang = options.language;

					// set max. alternative results:
					recognition.maxAlternatives = options.results;

					// do not stop recognition on silence
					recognition.continuous = true;

					// set intermediate_results - for access by stopRecord
					intermediate_results = !!options.intermediate;
					// get results continuously
					recognition.interimResults = intermediate_results;

					currentFailureCallback = options.error;
					currentSuccessCallback = options.success;

					recognition.onerror = default_error_function;

					var self = this;

					// - see https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-event
					recognition.onresult = function (event) {
						var finalResult = '';


						error_counter = 0;

						var evtResults = event.results[event.resultIndex];
						if (logger.isd()){
//							logger.debug("interim: " + event.results[event.resultIndex][0][EVENT_RESULT_FIELD] + " ("+event.results[event.resultIndex][0].confidence+")");
							logger.debug("interim: " + JSON.stringify(event.results));
						}

						// if event.results[event.resultIndex].isFinal is true, then there is a pause.
						if (evtResults.isFinal) {

							if (logger.isd())logger.debug("final result");

							finalResult = evtResults[0][EVENT_RESULT_FIELD];

							if (intermediate_results == true){

								//INTERMEDIATE results mode: only post last ASR to callback:

								// call callback method with result
								// final_recognition_result += " " + finalResult;
								final_recognition_result += finalResult;
								currentSuccessCallback && currentSuccessCallback.apply(self, helper_extract_results(evtResults) );

							} else {

								//FINAL results mode: message collected ASR results to callback:

								// final_recognition_result += " " + finalResult;
								final_recognition_result += finalResult;

								//audio-input already closed --> this is the last invocation of the callback, so send final result
								if (recording == false){
									currentSuccessCallback && currentSuccessCallback.call(self,final_recognition_result);
								}
							}

						}
						//for intermediate result (only if we have a callback):
						else if (intermediate_results == true && currentSuccessCallback){
							currentSuccessCallback.apply(self, helper_extract_results(evtResults) );
						}
					};

					// start the recognition
					try{

						recognition.start();

					} catch (exc){

						errMsg = "Could not start voice recognition: ";

						if(options.error){
							options.error('[ERROR] '+_pluginName+': ' + errMsg + (exc && exc.stack? exc.stack : exc));
						} else {
							logger.error(errMsg + exc, exc);
						}
					}
				},
				/**
				 * @public
				 * @memberOf mmir.env.media.WebspeechAudioInput.prototype
				 * @see mmir.MediaManager#stopRecord
				 */
				stopRecord: function(options, statusCallback, failureCallback){

					var self = this;

					//HACK [russa] decide/handle delayed stopRecord()
					if(Date.now() - startTime  < MIN_STOP_DELAY){

						if(stopTimer){
							//-> already started stop-timeout, do not start again
							return;
						}
						stopTimer = setTimeout(function(){
							self.stopRecord(options, statusCallback, failureCallback);
						}, MIN_STOP_DELAY);

						return;////////////////// EARLY EXIT /////////////////////////
					}
					cancelDelayedStop();

					if(typeof options === 'function'){
						failureCallback = statusCallback;
						statusCallback = options;
						options = void(0);
					}

					if(options){
						statusCallback = statusCallback? statusCallback : options.success;
						failureCallback = failureCallback? failureCallback : options.error;
					}

					recording = mediaManager.micLevelsAnalysis.active(false);

					// HACK [russa 2021-10] mark as "aborted":
					//      if stopRecord() is called while startRecord()/recognize() is still initializing (e.g. onaudiostart() has not triggered yet),
					//      then recognition is started, even if recognition.stop() was called AFTER recognition.start()
					aborted = true;

					var isSuccessTriggered = false;

					// recognize (recognition.continuous == true) or stopRecord (recognition.continuous == false)
					if (recognition.continuous == false){

						recognition.onresult = function (event) {
							var finalResult = '';

							if (logger.isd()) logger.debug("interim: " + event.results[event.resultIndex][0][EVENT_RESULT_FIELD]);

							var evtResults = event.results[event.resultIndex];
							// if event.results[event.resultIndex].isFinal is true, then there is a pause.
							if (evtResults.isFinal) {

								if (logger.isd()) logger.debug("final result");

								finalResult = evtResults[0][EVENT_RESULT_FIELD];

								// is it called for the last time (recording == false)
								if (recording == false){
									final_recognition_result += finalResult;

									if (intermediate_results == true){
//											currentSuccessCallback && currentSuccessCallback(finalResult);
										currentSuccessCallback && currentSuccessCallback.apply(self, helper_extract_results(evtResults) );
									} else {
										currentSuccessCallback && currentSuccessCallback.call(self, final_recognition_result);
									}

									if(statusCallback){
										if(isSuccessTriggered){
											logger.info('stopRecord: success callback was already triggered!');
										}
										isSuccessTriggered = true;
										statusCallback.call(self, final_recognition_result);
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
					// TODO: recognition.onstop = function(){statusCallback}

					//HACK: set an "internal" callback, that will be checked in the onend-listener (see above)
					//		(NOTE: the onstop()-listener does not seem to get called ...)
					recognition._stopRecordCallback = function(_evt){
						if(statusCallback && !isSuccessTriggered){
//								logger.debug('stopRecord: calling success callback onstop (without last ASR result)');//FIXM debug
							isSuccessTriggered = true;
							statusCallback.call(self,'', -1, 'RECORDING_DONE');
						}
					};

					try{

						recognition.stop();

					} catch (exc){

						var errMsg = "Could not stop voice recognition: "+ exc;

						if(failureCallback){

							failureCallback(errMsg);

							logger.error(errMsg, exc);
						}
						else {
							logger.error(errMsg, exc);
						}
					}
				},


				/**
				 * Start speech recognition with <em>end-of-speech</em> detection:
				 *
				 * the recognizer automatically tries to detect when speech has finished and
				 * triggers the status-callback accordingly with results.
				 *
				 * <p>
				 * NOTE:  no end event, if recognize() is stopped via stopRecord()
				 *
				 * @public
				 * @memberOf mmir.env.media.WebspeechAudioInput.prototype
				 * @see mmir.MediaManager#recognize
				 * @see #startRecord
				 */
				recognize: function(options, statusCallback, failureCallback, intermediateResults){//argument intermediateResults is deprecated (use options.intermediate instead)

					if(typeof options === 'function'){
						intermediateResults = failureCallback;
						failureCallback = statusCallback;
						statusCallback = options;
						options = void(0);
					}

					if(!options){
						options = {};
					}
					options.success = statusCallback? statusCallback : options.success;
					options.error = failureCallback? failureCallback : options.error;
					options.intermediate = typeof intermediateResults === 'boolean'? intermediateResults : !!options.intermediate;
					options.language = options.language? options.language : lang.getLanguageConfig(_pluginName) || DEFAULT_LANGUAGE;
					options.results = options.results? options.results : DEFAULT_ALTERNATIVE_RESULTS;
					//TODO
//					options.disableImprovedFeedback =
//					options.mode =
//					options.eosPause =

					var errMsg;
					if (active == true){

						errMsg = "Voice recognition already running.";

						if(failureCallback){

							failureCallback('[WARN] '+_pluginName+': '+errMsg);

							logger.warn(errMsg);
						}
						else {
							logger.warn(errMsg);
						}
						return;
					}

					//HACK [russa] for delayed stopRecord()
					cancelDelayedStop();
					startTime = Date.now();

					aborted = false;
					recording = mediaManager.micLevelsAnalysis.active(true);
					error_counter = 0;

					_prevResult = void(0);

					// flush any old results
					final_recognition_result = "";

					recognition.lang = options.language;

					// set max. alternative results:
					recognition.maxAlternatives = options.results;

					// stop recognition on silence
					recognition.continuous = false;

					//set intermediate_results - for access by stopRecord
					recognition.interimResults = options.intermediate;

					currentFailureCallback = options.error;
					currentSuccessCallback = options.success;

					recognition.onerror = default_error_function;

					var self = this;
					// - see https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-event
					recognition.onresult = function (event) {
//						var finalResult = '';

						if (logger.isd()) logger.debug("interim: " + event.results[event.resultIndex][0][EVENT_RESULT_FIELD]);

						// if event.results[event.resultIndex].isFinal is true, then there is a pause.
						if (event.results[event.resultIndex].isFinal) {

							if (logger.isd()) logger.debug("final result");

							//stop recording - finish after one sentence!
							//NOTE do this before calling helper_extract_results(), in order to make the result type FINAL
							recording = mediaManager.micLevelsAnalysis.active(false);

							var returnArgs = helper_extract_results(event.results[event.resultIndex]);

							// TODO: dirty hack - somehow it does not throw end event after recognition if recognize is used
							self.cancelRecognition();
							currentSuccessCallback && currentSuccessCallback.apply(self, returnArgs);//finalResult);
						}
					};

					// start the recognition
					try{

						recognition.start();

					} catch (exc){

						errMsg = "Could not start voice recognition: ";

						if(options.error){
							options.error('[ERROR] '+_pluginName+': ' + errMsg + (exc && exc.stack? exc.stack : exc));
						} else {
							logger.error(errMsg + exc, exc);
						}
					}
				},
				/**
				 * @public
				 * @memberOf mmir.env.media.WebspeechAudioInput.prototype
				 * @see mmir.MediaManager#cancelRecognition
				 */
				cancelRecognition: function(successCallback, failureCallback){
					recording = mediaManager.micLevelsAnalysis.active(false);
					aborted = true;
					error_counter = 0;
					currentFailureCallback = failureCallback;

					//HACK [russa] for delayed stopRecord()
					cancelDelayedStop();

					var self = this;
					// callback used if an error occurred - includes abort
					// gets event as argument - see https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-error
					// * if aborted - call successCallback

					recognition.onerror = function(event){
						if ((event.error == "aborted") && (aborted == true)){
							aborted = false;
							recognition.onerror = default_error_function;
							successCallback && successCallback.call(self,event.error);
						} else {
							// currentFailureCallback(event.error);
							default_error_function.call(self,event.error);
						}
					};

					recognition.abort();
				},
				/**
				 * @public
				 * @memberOf mmir.env.media.WebspeechAudioInput.prototype
				 * @see mmir.MediaManager#cancelRecognition
				 */
				getRecognitionLanguages: function(_successCallBack, failureCallBack){
					var msg = 'FIXME impl. '+_pluginName+'.getRecognitionLanguages()!';
					if(failureCallBack)
						failureCallBack(msg);
					else
						logger.error(msg);
				},
				/**
				 * for debugging - NOTE use with caution, be removed in the future
				 * @private
				 * @see see Logger#getLevel
				 * @memberOf mmir.env.media.WebspeechAudioInput.prototype
				 */
				getLoglevel: function(){
					return logger.getLevel();
				},
				/**
				 * for debugging - NOTE use with caution, be removed in the future
				 * @default 'warning' (see {@link mmir.tools.Logger#setLevel})
				 * @private
				 * @memberOf mmir.env.media.WebspeechAudioInput.prototype
				 */
				setLoglevel: function(logvalue){
					logger.setLevel(logvalue);
					return logger.getLevel();
				}
		};


		if(!mediaManager.micLevelsAnalysis){

			//load mic-levels-analysis before invoking initializer-callback

			mediaManager.micLevelsAnalysis = true;//<- indicate that micLevelsAnalysis will be loaded (in case other plugins want to load it)

			//load mic-levels-analysis implementation into mediaManager's default context (i.e. omit 4th argument),
			// since mic-levels-analysis should be used as singleton
			mediaManager.loadPlugin(micLevelsImplFile, function success(){

				logger.debug('initialized microphone-levels analysis for '+_pluginName);

				//invoke the passed-in initializer-callback and export the public functions:
				callBack(pluginExports);

			}, function error(err){

				logger.error('ERROR: using stub implementation  for microphone-levels analysis, because loading the implementation file '+implPath+' failed: '+err);


				/**
				 * @class mmir.env.media.WebspeechAudioInput.MicLevelsAnalysisStub
				 * @extends mmir.env.media.MicLevelsAnalysis
				 * @hideconstructor
				 */
				mediaManager.micLevelsAnalysis = {
						_active: false,
						start: function(){
							logger.info('STUB::micLevelsAnalysis.start()');
						},
						stop: function(){
							logger.info('STUB::micLevelsAnalysis.stop()');
						},
						enable: function(enable){
							logger.info('STUB::micLevelsAnalysis.enable('+(typeof enable === 'undefined'? '': enable)+') -> false');
							return false;
						},
						active: function(active){
							this._active = typeof active === 'undefined'? this._active: active;
							logger.info('STUB::micLevelsAnalysis.active('+(typeof active === 'undefined'? '': active)+') -> ' + this._active);
							return active;
						}
				};

				//invoke the passed-in initializer-callback and export the public functions:
				callBack(pluginExports);

			});
		}
		else {
			//micLevelsAnalysis already loaded

			// -> immediately invoke initializer-callback and export the public functions:
			callBack(pluginExports);
		}

	}//END: initialize()

};

});//END define
