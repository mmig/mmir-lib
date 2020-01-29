
/**
 * MicLevelsAnalysis is a plugin/module for generating "microphone input levels changed events" for
 * ASR (speech recognition) modules based on Web Audio Input (i.e. analyze audio from getUserMedia)
 *
 * The plugin triggers events <code>miclevelchanged</code> on listeners registered to the MediaManager.
 *
 * In addition, if the mic-levels-audio plugin starts its own audio-stream, an <code>webaudioinputstarted</code>
 * event is trigger, when the plugin starts.
 *
 * @example
 *
 * ////////////////////////////////  within media plugin: load analyzer //////////////////////////////////
 * //within audio-input plugin that uses Web Audio: load mic-levels-analyzer plugin
 *
 * //first: check, if the analyzer plugin is already loaded (should be loaded only once)
 * if(!mediaManager.micLevelsAnalysis){
 *
 * 	//set marker so that other plugins may know that the analyzer will be loaded:
 * 	mediaManager.micLevelsAnalysis = true;
 *
 * 	//load the analyzer
 * 	mediaManager.loadFile(micLevelsImplFile, function success(){
 *
 * 		//... finish the audio-plugin initialization, e.g. invoke initializer-callback
 *
 * 	}, function error(err){
 *
 *	  	// ... in case the analyzer could not be loaded:
 *		// do some error handling ...
 *
 *		//... and supply a stub-implementation for the analyzer module:
 *	  	mediaManager.micLevelsAnalysis = {
 *	  		_active: false,
 *	  		start: function(){
 *	  			console.info('STUB::micLevelsAnalysis.start()');
 *	  		},
 *	  		stop: function(){
 *	  			console.info('STUB::micLevelsAnalysis.stop()');
 *	  		},
 *	  		enable: function(enable){
 *	  			console.info('STUB::micLevelsAnalysis.enable('+(typeof enable === 'undefined'? '': enable)+') -> false');
 *	  			return false;//<- the stub can never be enabled
 *	  		},
 *	  		active: function(active){
 *	  			this._active = typeof active === 'undefined'? this._active: active;
 *	  			console.info('STUB::micLevelsAnalysis.active('+(typeof active === 'undefined'? '': active)+') -> ' + this._active);
 *	  			return active;//<- must always return the input-argument's value
 *	  		}
 *	  	};
 *
 *	  	//... finish the audio-plugin initialization without the mic-levels-analyzer, e.g. invoke initializer-callback
 *
 *	  });
 * } else {
 *
 * 	//if analyzer is already loaded/loading: just finish the audio-plugin initialization,
 * 	//										 e.g. invoke initializer-callback
 *
 * }
 *
 *
 * ////////////////////////////////  use of mic-levels-analysis events //////////////////////////////////
 * //in application code: listen for mic-level-changes
 *
 * mmir.media.on('miclevelchange', function(micValue){
 *
 * });
 *
 * @class
 * @public
 * @name MicLevelsAnalysis
 * @memberOf mmir.env.media
 * @hideconstructor
 *
 * @see {@link mmir.env.media.WebspeechAudioInput} for an example on integrating the mic-levels-analysis plugin into an audio-input plugin
 *
 * @requires HTML5 AudioContext
 * @requires HTML5 getUserMedia (audio)
 */

define(['mmirf/mediaManager'], function(mediaManager){

return {
	/**  @memberOf mmir.env.media.MicLevelsAnalysis.module# */
	initialize: function(callBack, __mediaManager){//, ctxId, moduleConfig){//DISABLED this argument is currently un-used -> disabled

		/**
		 * @type navigator
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		var html5Navigator = navigator;
		/**
		 * @type AudioContext
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		var _audioContext;
		/**  @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		var createAudioContext = function(){

			if(typeof AudioContext !== 'undefined'){
				_audioContext = new AudioContext;
			}
			else {//if(typeof webkitAudioContext !== 'undefined'){
				_audioContext = new webkitAudioContext;
			}
		};
		var nonFunctional = false;

		try {
			// unify the different kinds of HTML5 implementations
			//window.AudioContext = window.AudioContext || window.webkitAudioContext;
			/**  @memberOf mmir.env.media.MicLevelsAnalysis.navigator# */
			html5Navigator.__getUserMedia = html5Navigator.getUserMedia || html5Navigator.webkitGetUserMedia || html5Navigator.mozGetUserMedia;
			//window.URL = window.URL || window.webkitURL;
			// _audioContext = new webkitAudioContext;
			// createAudioContext();
		}
		catch (e) {
			console.error('No web audio support in this browser! Error: '+(e.stack? e.stack : e));
			nonFunctional = true;
		}

		/**
		 * state-flag that indicates, if the process (e.g. ASR, recording)
		 * is actually active right now, i.e. if analysis calculations should be done or not.
		 *
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		var recording = false;
		/**
		 * Switch for generally disabling "microphone-level changed" calculations
		 * (otherwise calculation becomes active/inactive depending on whether or
		 *  not a listener is registered to event {@link #MIC_CHANGED_EVT_NAME})
		 *
		 * <p>
		 * TODO make this configurable?...
		 *
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		var isMicLevelsEnabled = true;
		/** MIC-LEVELS: the maximal value to occurs in the input data
		 * <p>
		 * FIXME verify / check if this is really the maximal possible value...
		 * @contant
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		var MIC_MAX_VAL = 2;//
		/** MIC-LEVELS: the maximal value for level changes (used for normalizing change-values)
		 * @constant
		 * @private
		 * @memberOf mmir.env.media.MicLevelsAnalysis# */
		var MIC_MAX_NORM_VAL = -90;// -90 dB ... ???

		/** MIC-LEVELS: normalization factor for values: adjust value, so that is
		 *              more similar to the results from the other input-modules
		 * @constant
		 * @private
		 * @memberOf mmir.env.media.MicLevelsAnalysis# */
		var MIC_NORMALIZATION_FACTOR = 3.5;//adjust value, so that is more similar to the results from the other input-modules
		/** MIC-LEVELS: time interval / pauses between calculating level changes
		 * @constant
		 * @private
		 * @memberOf mmir.env.media.MicLevelsAnalysis# */
		var MIC_QUERY_INTERVALL = 48;
		/** MIC-LEVELS: threshold for calculating level changes
		 * @constant
		 * @private
		 * @memberOf mmir.env.media.MicLevelsAnalysis# */
		var LEVEL_CHANGED_THRESHOLD = 1.05;
		/**
		 * MIC-LEVELS: Name for the event that is emitted, when the input-mircophone's level change.
		 *
		 * @private
		 * @constant
		 * @default "miclevelchanged"
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 */
		var MIC_CHANGED_EVT_NAME = 'miclevelchanged';

		/**
		 * STREAM_STARTED: Name for the event that is emitted, when the audio input stream for analysis becomes available.
		 *
		 * @private
		 * @constant
		 * @default "webaudioinputstarted"
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 */
		var STREAM_STARTED_EVT_NAME = 'webaudioinputstarted';

		/**
		 * HELPER normalize the levels-changed value to MIC_MAX_NORM_VAL
		 * @deprecated currently un-used
		 * @private
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 */
		var normalize = function (v){
			return MIC_MAX_NORM_VAL * v / MIC_MAX_VAL;
		};
		/**
		 * HELPER calculate the RMS value for list of audio values
		 * @deprecated currently un-used
		 * @private
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 */
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
		/**
		 * HELPER calculate the dezible value for PCM value
		 * @deprecated currently un-used
		 * @private
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 */
		var getDb = function (pcmData, upperLimit){
			return 20 * Math.log10(Math.abs(pcmData)/upperLimit);
		};
		/**
		 * HELPER determine if a value has change in comparison with a previous value
		 * 		  (taking the LEVEL_CHANGED_THRESHOLD into account)
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		var hasChanged = function(value, previousValue){
			var res = typeof previousValue === 'undefined' || Math.abs(value - previousValue) > LEVEL_CHANGED_THRESHOLD;
			return res;
		};
		/**
		 * @type LocalMediaStream
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_API#LocalMediaStream
		 */
		var _currentInputStream;
		/**
		 * @type AnalyserNode
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
		 */
		var _audioAnalyzer;

		var _ownsInputStream = true;

		//FIXME test
		// window.RAW_DATA = [];
		// window.DB_DATA = [];
		// window.RMS_DATA = [];

		/**
		 * HELPER callback for getUserMedia: creates the microphone-levels-changed "analyzer"
		 *        and fires mic-levels-changed events for registered listeners
		 * @param {LocalMediaStream} inputstream
		 * @private
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 */
		function _startUserMedia(inputstream, foreignAudioData){
			mediaManager._log.info('MicLevelsAnalysis: start analysing audio input...');
			var buffer = 0;
			// var prevDb;
			var prevRms;

			//we only need one analysis: if there is one active from a previous start
			//  -> do stop it, before storing the new inputstream in _currentInputStream
			if(_currentInputStream){
				_stopAudioAnalysis();
			}

			_currentInputStream = inputstream;

			if(_isAnalysisCanceled === true){
				//ASR was stopped, before the audio-stream for the analysis became available:
				// -> stop analysis now, since ASR is not active (and close the audio stream without doing anything)
				_stopAudioAnalysis();
				return;//////////////// EARLY EXIT //////////////////////
			}

			var inputNode;
			if(!foreignAudioData){

				_ownsInputStream = true;

				if(!_audioContext){
					createAudioContext();
				}

				inputNode = _audioContext.createMediaStreamSource(_currentInputStream);

				//fire event STREAM_STARTED to inform listeners & allow them to use the audio stream
				mediaManager._emitEvent(STREAM_STARTED_EVT_NAME, inputNode, _audioContext);
			}
			else {

				_ownsInputStream = false;

				_currentInputStream = true;
				inputNode = foreignAudioData.inputSource;
				_audioContext = foreignAudioData.audioContext;
			}

			///////////////////// VIZ ///////////////////
	//		recorder = recorderInstance;

			_audioAnalyzer = _audioContext.createAnalyser();
			_audioAnalyzer.fftSize = 2048;
			_audioAnalyzer.minDecibels = -90;
			_audioAnalyzer.maxDecibels = 0;
			_audioAnalyzer.smoothingTimeConstant = 0.8;//NOTE: value 1 will smooth everything *completely* -> do not use 1
			inputNode.connect(_audioAnalyzer);

	//		audioRecorder = new Recorder( _currentInputStream );
	//		recorder = new Recorder(_currentInputStream, {workerPath: recorderWorkerPath});

	//		updateAnalysers();

			var updateAnalysis = function(){
				if(!_currentInputStream){
					return;
				}

				var size = _audioAnalyzer.fftSize;//.frequencyBinCount;//
				var data = new Uint8Array(size);//new Float32Array(size);//
				_audioAnalyzer.getByteTimeDomainData(data);//.getFloatFrequencyData(data);//.getByteFrequencyData(data);//.getFloatTimeDomainData(data);//

				// var view = new DataView(data.buffer);

				var MAX = 255;//32768;
				var MIN = 0;//-32768;

				var min = MAX;//32768;
				var max = MIN;//-32768;
				var total = 0;
				for(var i=0; i < size; ++i){
					var datum = Math.abs(data[i]);

					//FIXM TEST
					// mediaManager._log.d('data '+(20 * Math.log10(data[i]/MAX)));//+view.getInt16(i));
					// mediaManager._log.d('data '+view.getInt16(i));
					// mediaManager._log.d('data '+data[i]);
					// window.RAW_DATA.push(data[i]);
					// window.DB_DATA.push(20 * Math.log10(data[i]/MAX));
					// window.RMS_DATA.push('');

					if (datum < min)
						min = datum;
					if (datum > max)
						max = datum;

					total += datum;
				}
				var avg = total / size;
	//			mediaManager._log.debug('audio ['+min+', '+max+'], avg '+avg);

	//			var rms = getRms(data, size);
	//			var db = 20 * Math.log(rms);// / 0.0002);

	//			mediaManager._log.debug('audio rms '+rms+', db '+db);

				/* RMS stands for Root Mean Square, basically the root square of the
				 * average of the square of each value. */
				var rms = 0, val;
				for (var i = 0; i < data.length; i++) {
					val = data[i] - avg;
					rms += val * val;
				}
				rms /= data.length;
				rms = Math.sqrt(rms);

				// window.RMS_DATA[window.RMS_DATA.length-1] = rms;//FIXME TEST
				// var db = 20 * Math.log10(Math.abs(max)/MAX);
				// var db = rms;
	//			mediaManager._log.debug('audio rms '+rms);
				// mediaManager._log.debug('audio rms changed: '+prevDb+' -> '+db);
				//actually fire the change-event on all registered listeners:
				if(hasChanged(rms, prevRms)){
					prevRms = rms;

					// //adjust value
					// db *= MIC_NORMALIZATION_FACTOR;
					db = 20 * Math.log10(Math.abs(max)/MAX);

					//mediaManager._log.debug('audio rms changed ('+db+'): '+prevRms+' -> '+rms);

					mediaManager._emitEvent(MIC_CHANGED_EVT_NAME, db, rms);
				}


				if(_isAnalysisActive && _currentInputStream){
					setTimeout(updateAnalysis, MIC_QUERY_INTERVALL);
				}
			};
			updateAnalysis();
			///////////////////// VIZ ///////////////////

		}


		/** internal flag: is/should mic-levels analysis be active?
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		var _isAnalysisActive = false;
		/** internal flag: is/should mic-levels analysis be active?
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		var _isAnalysisCanceled = false;
		/** HELPER start-up mic-levels analysis (and fire events for registered listeners)
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		function _startAudioAnalysis(audioInputData){
			if(_isAnalysisActive === true){
				return;
			}
			_isAnalysisCanceled = false;
			_isAnalysisActive = true;

			if(audioInputData){
				//use existing input stream for analysis:
				_startUserMedia(null, audioInputData);
			}
			else {

				//start analysis with own audio input stream:
				html5Navigator.__getUserMedia({audio: true}, _startUserMedia, function(e) {
					mediaManager._log.error("MicLevelsAnalysis: failed _startAudioAnalysis, error for getUserMedia ", e);
					_isAnalysisActive = false;
				});
			}
		}

		/** HELPER stop mic-levels analysis
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		function _stopAudioAnalysis(){

			if(_ownsInputStream){

				if(_currentInputStream){
					var stream = _currentInputStream;
					_currentInputStream = void(0);
					//DISABLED: MediaStream.stop() is deprecated -> instead: stop all tracks individually
//					stream.stop();
					try{
						if(stream.active){
							var list = stream.getTracks(), track;
							for(var i=list.length-1; i >= 0; --i){
								track = list[i];
								if(track.readyState !== 'ended'){
									track.stop();
								}
							}
						}
					} catch (err){
						mediaManager._log.error('MicLevelsAnalysis: a problem occured while stopping audio input analysis: '+(e.stack? e.stack : e));
					}
					_isAnalysisCanceled = false;
					_isAnalysisActive = false;

					mediaManager._log.info('MicLevelsAnalysis: stopped analysing audio input!');
				}
				else if(_isAnalysisActive === true){
					mediaManager._log.warn('MicLevelsAnalysis: stopped analysing audio input process, but no valid audio stream present!');
					_isAnalysisCanceled = true;
					_isAnalysisActive = false;
				}

			} else {//input stream is owned by external creator: just set internal flag for stopping analysis

				_currentInputStream = void(0);//remove foreign inputStream
				_audioContext = void(0);//remove foreign audioContext
				_isAnalysisCanceled = false;
				_isAnalysisActive = false;
			}
		}

		/** HELPER determine whether to start/stop audio-analysis based on
		 * 		   listeners getting added/removed on the MediaManager
		 * @memberOf mmir.env.media.MicLevelsAnalysis#
		 * @private
		 */
		function _updateMicLevelAnalysis(actionType, handler){

			//start analysis now, if necessary
			if(		actionType 			=== 'added' &&
					recording 			=== true &&
					_isAnalysisActive 	=== false &&
					isMicLevelsEnabled 	=== true
			){
				_startAudioAnalysis();
			}
			//stop analysis, if there is no listener anymore
			else if(actionType 			=== 'removed' &&
					_isAnalysisActive 	=== true &&
					mediaManager.hasListeners(MIC_CHANGED_EVT_NAME) === false
			){
				_stopAudioAnalysis();
			}
		}
		//observe changes on listener-list for mic-levels-changed-event
		mediaManager._addListenerObserver(MIC_CHANGED_EVT_NAME, _updateMicLevelAnalysis);

		callBack({micLevelsAnalysis: {
			/**
			 * Start the audio analysis for generating "microphone levels changed" events.
			 *
			 * This functions should be called, when ASR is starting / receiving the audio audio stream.
			 *
			 *
			 * When the analysis has started, listeners of the <code>MediaManager</code> for
			 * event <code>miclevelchanged</code> will get notified, when the mic-levels analysis detects
			 * changes in the microphone audio input levels.
			 *
			 * @param {AudioInputData} [audioInputData]
			 * 						If provided, the analysis will use these audio input objects instead
			 * 						of creating its own audio-input via <code>getUserMedia</code>.
			 * 						The AudioInputData object must have 2 properties:
			 * 	{
			 * 		inputSource: MediaStreamAudioSourceNode (HTML5 Web Audio API)
			 * 		audioContext: AudioContext (HTML5 Web Audio API)
			 * 	}
			 * 						If this argument is omitted, then the analysis will create its own
			 * 						audio input stream via <code>getUserMedia</code>
			 *
			 * @memberOf mmir.env.media.MicLevelsAnalysis.prototype
			 */
			start: function(audioInputData){

				if(isMicLevelsEnabled){//same as: this.enabled()
					_startAudioAnalysis(audioInputData);
				}
			},
			/**
			 * Stops the audio analysis for "microphone levels changed" events.
			 *
			 * This functions should be called, when ASR has stopped / closed the audio input stream.
			 *
			 * @memberOf mmir.env.media.MicLevelsAnalysis.prototype
			 */
			stop: function(){
				_stopAudioAnalysis();
			},
			/**
			 * Get/set the mic-level-analysis' enabled-state:
			 * If the analysis is disabled, then {@link #start} will not active the analysis (and currently running
			 * analysis will be stopped).
			 *
			 * This function is getter and setter: if an argument <code>enable</code> is provided, then the
			 * mic-level-analysis' enabled-state will be set, before returning the current value of the enabled-state
			 * (if omitted, just the enabled-state will be returned)
			 *
			 * @param {Boolean} [enable] OPTIONAL
			 * 				if <code>enable</code> is provided, then the mic-level-analysis' enabled-state
			 * 				is set to this value.
			 * @returns {Boolean}
			 * 				the mic-level-analysis' enabled-state
			 *
			 * @memberOf mmir.env.media.MicLevelsAnalysis.prototype
			 */
			enabled: function(enable){

				if(typeof enable !== 'undefined'){

					if(!enable && (isMicLevelsEnabled != enable || _isAnalysisActive)){
						this.stop();
					}

					isMicLevelsEnabled = enable;
				}
				return isMicLevelsEnabled;
			},
			/**
			 * Getter/Setter for ASR-/recording-active state.
			 *
			 * This function should be called with <code>true</code> when ASR starts and
			 * with <code>false</code> when ASR stops.
			 *
			 *
			 * NOTE setting the <code>active</code> state allows the analyzer to start
			 * processing when a listener for <code>miclevelchanged</code> is added while
			 * ASR/recording is already active (otherwise the processing would not start
			 * immediately, but when the ASR/recording is started the next time).
			 *
			 *
			 * @param {Boolean} [active]
			 * 				if <code>active</code> is provided, then the mic-level-analysis' (recording) active-state
			 * 				is set to this value.
			 * @returns {Boolean}
			 * 				the mic-level-analysis' (recording) active-state.
			 * 				If argument <code>active</code> was supplied, then the return value will be the same
			 * 				as this input value.
			 *
			 * @memberOf mmir.env.media.MicLevelsAnalysis.prototype
			 */
			active: function(active){
				if(typeof active !== 'undefined'){
					recording = active;
				}
				return recording;
			}
		}})
	}

};

});//END define
