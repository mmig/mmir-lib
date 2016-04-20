
/**
 * MicLevelsAnalysis is a plugin/module for generating "microphone input levels changed events" for 
 * ASR (speech recognition) modules based on Web Audio Input (i.e. analyze audio from getUserMedia)
 * 
 * The plugin triggers events <code>miclevelchanged</code> on listeners registered to the MediaManager.
 * 
 * In addition, if the mic-levels-audio plugin starts its own audio-stream, an <code>webaudioinputstarted</code>
 * event is trigger, when the plugin starts.
 * 
 */

newMediaPlugin = {
	/**  @memberOf MicLevelsAnalysisModule# */
	initialize: function(callBack, mediaManager){//, ctxId, moduleConfig){//DISABLED this argument is currently un-used -> disabled

		/**  
		 * @type navigator
		 * @memberOf MicLevelsAnalysis#
		 */
		var html5Navigator = navigator;
		/**
		 * @type AudioContext
		 * @memberOf MicLevelsAnalysis#
		 */
		var _audioContext;
		/**  @memberOf MicLevelsAnalysis# */
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
			/**  @memberOf MicLevelsAnalysis.navigator# */
			html5Navigator.__getUserMedia = html5Navigator.getUserMedia || html5Navigator.webkitGetUserMedia || html5Navigator.mozGetUserMedia;
			//window.URL = window.URL || window.webkitURL;
	//    	_audioContext = new webkitAudioContext;
	
			createAudioContext();
		} 
		catch (e) {
			console.error('No web audio support in this browser! Error: '+(e.stack? e.stack : e));
			nonFunctional = true;
		}

		/** 
		 * state-flag that indicates, if the process (e.g. ASR, recording)
		 * is actually active right now, i.e. if analysis calculations should be done or not.
		 * 
		 * @memberOf MicLevelsAnalysis#
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
		 * @memberOf MicLevelsAnalysis#
		 */
		var isMicLevelsEnabled = true;
		/** MIC-LEVELS: the maximal value to occurs in the input data
		 * <p>
		 * FIXME verify / check if this is really the maximal possible value...
		 * @contant
		 * @memberOf MicLevelsAnalysis#
		 */
		var MIC_MAX_VAL = 2;//
		/** MIC-LEVELS: the maximal value for level changes (used for normalizing change-values)
		 * @constant
		 * @memberOf MicLevelsAnalysis# */
		var MIC_MAX_NORM_VAL = -90;// -90 dB ... ???
		
		/** MIC-LEVELS: normalization factor for values: adjust value, so that is 
		 *              more similar to the results from the other input-modules
		 * @constant
		 * @memberOf MicLevelsAnalysis# */
		var MIC_NORMALIZATION_FACTOR = 3.5;//adjust value, so that is more similar to the results from the other input-modules
		/** MIC-LEVELS: time interval / pauses between calculating level changes
		 * @constant
		 * @memberOf MicLevelsAnalysis# */
		var MIC_QUERY_INTERVALL = 128;
		/** MIC-LEVELS: threshold for calculating level changes
		 * @constant
		 * @memberOf MicLevelsAnalysis# */
		var LEVEL_CHANGED_THRESHOLD = 1.5;
		/**
		 * MIC-LEVELS: Name for the event that is emitted, when the input-mircophone's level change.
		 * 
		 * @private
		 * @constant
		 * @memberOf MicLevelsAnalysis#
		 */
		var MIC_CHANGED_EVT_NAME = 'miclevelchanged';
	
		/**
		 * STREAM_STARTED: Name for the event that is emitted, when the audio input stream for analysis becomes available.
		 * 
		 * @private
		 * @constant
		 * @memberOf MicLevelsAnalysis#
		 */
		var STREAM_STARTED_EVT_NAME = 'webaudioinputstarted';
		
		/**
		 * HELPER normalize the levels-changed value to MIC_MAX_NORM_VAL
		 * @deprecated currently un-used
		 * @memberOf MicLevelsAnalysis#
		 */
		var normalize = function (v){
			return MIC_MAX_NORM_VAL * v / MIC_MAX_VAL;
		};
		/**
		 * HELPER calculate the RMS value for list of audio values
		 * @deprecated currently un-used
		 * @memberOf MicLevelsAnalysis#
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
		 * HELPER determine if a value has change in comparison with a previous value
		 * 		  (taking the LEVEL_CHANGED_THRESHOLD into account)
		 * @memberOf MicLevelsAnalysis#
		 */
		var hasChanged = function(value, previousValue){
			var res = typeof previousValue === 'undefined' || Math.abs(value - previousValue) > LEVEL_CHANGED_THRESHOLD;
			return res;
		};
		/**
		 * @type LocalMediaStream
		 * @memberOf MicLevelsAnalysis#
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_API#LocalMediaStream
		 */
		var _currentInputStream;
		/**
		 * @type AnalyserNode
		 * @memberOf MicLevelsAnalysis#
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
		 */
		var _audioAnalyzer;
		
		var _ownsInputStream = true;
		
		/**
		 * HELPER callback for getUserMedia: creates the microphone-levels-changed "analyzer"
		 *        and fires mic-levels-changed events for registered listeners
		 * @param {LocalMediaStream} inputstream
		 * @memberOf MicLevelsAnalysis#
		 */
		function _startUserMedia(inputstream, foreignAudioData){
			console.log('MicLevelsAnalysis: start analysing audio input...');
			var buffer = 0;
			var prevDb;
			
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
				mediaManager._fireEvent(STREAM_STARTED_EVT_NAME, [inputNode, _audioContext]);
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
	//		_audioAnalyzer.smoothingTimeConstant = 0.9;//NOTE: value 1 will smooth everything *completely* -> do not use 1
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
	//			console.info('audio ['+min+', '+max+'], avg '+avg);
	
	//			var rms = getRms(data, size);
	//			var db = 20 * Math.log(rms);// / 0.0002);
	
	//			console.info('audio rms '+rms+', db '+db);
	
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
	//			console.info('audio rms '+rms);
	
				//actually fire the change-event on all registered listeners:
				if(hasChanged(db, prevDb)){
	//				console.info('audio rms changed: '+prevDb+' -> '+db);
					prevDb = db;
	
					//adjust value
					db *= MIC_NORMALIZATION_FACTOR;
	
					mediaManager._fireEvent(MIC_CHANGED_EVT_NAME, [db]);
				}
	
	
				if(_isAnalysisActive && _currentInputStream){
					setTimeout(updateAnalysis, MIC_QUERY_INTERVALL);
				}
			};
			updateAnalysis();
			///////////////////// VIZ ///////////////////
	
		}
		
		
		/** internal flag: is/should mic-levels analysis be active?
		 * @memberOf MicLevelsAnalysis#
		 */
		var _isAnalysisActive = false;
		/** internal flag: is/should mic-levels analysis be active?
		 * @memberOf MicLevelsAnalysis#
		 */
		var _isAnalysisCanceled = false;
		/** HELPER start-up mic-levels analysis (and fire events for registered listeners)
		 * @memberOf MicLevelsAnalysis#
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
					console.error("MicLevelsAnalysis: failed _startAudioAnalysis, error for getUserMedia ", e);
					_isAnalysisActive = false;
				});
			}
		}
	
		/** HELPER stop mic-levels analysis
		 * @memberOf MicLevelsAnalysis#
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
						console.log('MicLevelsAnalysis: a problem occured while stopping audio input analysis: '+err);
					}
					_isAnalysisCanceled = false;
					_isAnalysisActive = false;
		
					console.log('MicLevelsAnalysis: stopped analysing audio input!');
				}
				else if(_isAnalysisActive === true){
					console.warn('MicLevelsAnalysis: stopped analysing audio input process, but no valid audio stream present!');
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
		 * @memberOf MicLevelsAnalysis#
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
			 * @memberOf MicLevelsAnalysis.prototype
			 */
			start: function(audioInputData){
				_startAudioAnalysis(audioInputData);
			},
			/**
			 * Stops the audio analysis for "microphone levels changed" events.
			 * 
			 * This functions should be called, when ASR has stopped / closed the audio input stream.
			 * 
			 * @memberOf MicLevelsAnalysis.prototype
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
			 * @memberOf MicLevelsAnalysis.prototype
			 */
			enabled: function(enable){
				
				if(typeof enable !== 'undefined'){
					
					if(!enable && isMicLevelsEnabled != enable){
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
			 * @param {Boolean} [active]
			 * 				if <code>active</code> is provided, then the mic-level-analysis' (recording) active-state
			 * 				is set to this value.
			 * @returns {Boolean}
			 * 				the mic-level-analysis' (recording) active-state.
			 * 				If argument <code>active</code> was supplied, then the return value will be the same
			 * 				as this input value.
			 * 
			 * @memberOf MicLevelsAnalysis.prototype
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