

define(['mmirf/mediaManager', 'mmirf/configurationManager', 'mmirf/languageManager', 'mmirf/constants', 'mmirf/util/isArray', 'mmirf/logger'], function(mediaManager, config, lang, consts, isArray, Logger){

/**  @class WebAudioTextToSpeech */
return {

	/**  @memberOf WebAudioTextToSpeech# */
	initialize: function(callBack, __mediaManager, ctxId, moduleConfig){

		/**  @memberOf WebAudioTextToSpeech# */
		var _basePluginName = 'webAudioTextToSpeech';

		/**
		 * Default implementation for WebAudioTTS: MARY TTS
		 * @memberOf WebAudioTextToSpeech#
		 */
		var _defaultImplFile = 'maryttsImpl.js';

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
		 * @memberOf WebAudioTextToSpeech#
		 */
		var _defaultCtxName = 'default';

		//backwards compatibility (pre 3.?)
		if(!mediaManager._preparing){
			mediaManager._preparing = function(name){_logger.warn(name +' is preparing - NOTE: this is a stub-function. Overwrite MediaManager._preparing for setting custom implementation.');};
		}
		if(!mediaManager._ready){
			mediaManager._ready     = function(name){_logger.warn(name + ' is ready - NOTE: this is a stub-function. Overwrite MediaManager._ready for setting custom implementation.');};
		}

		/**
		 * Will be set/"overwritten" by specific implementation.
		 *
		 * @protected
		 * @memberOf WebAudioTextToSpeech#
		 * @see #initImpl
		 */
		var _pluginName;

		/**
		 * Will be set when specific implementation is initialized.
		 *
		 * @type mmir.Logger
		 * @protected
		 * @memberOf WebAudioTextToSpeech#
		 * @see #initImpl
		 */
		var _logger;

		/**
		 * Will be set/"overwritten" by specific implementation.
		 *
		 * @protected
		 * @memberOf WebAudioTextToSpeech#
		 */
		var createAudio;

		/**  @memberOf WebAudioTextToSpeech# */
		var volume = 1.0;

		/**  @memberOf WebAudioTextToSpeech# */
		var _setVolume = function(val){
			volume = val;

			for(var i=0,size=audioArray.length; i < size; ++i){
				if(audioArray[i] && audioArray[i].setVolume){
					audioArray[i].setVolume(val);
				}
			}
		};

		/**  @memberOf WebAudioTextToSpeech# */
		var _resetCallbacks = function(){
			currentFailureCallback = null;
			onEndCallback = null;
			onReadyCallback = null;
		};

		/////////////////////////// command-queue for queuing up TTS requests (instead of discarding when already busy) ////////
		/**
		 * command-queue in case TTS is currently in use
		 * -> if TTS invoked, but currently not ready: add to queue
		 * -> after processing current TTS: process next on queue
		 *
		 * @memberOf WebAudioTextToSpeech#
		 */
		var commandQueue = [];
		/** command-queue
		 * @memberOf WebAudioTextToSpeech# */
		var addToCommandQueue = function(args){

			//copy argument list:
			var len = args.length;
			var list = new Array(len);
			for(var i=len-1; i >= 0; --i){
				list[i] = args[i];
			}

			commandQueue.push(list);
		};
		/** command-queue
		 * @memberOf WebAudioTextToSpeech# */
		var processNextInCommandQueue = function(){

			isReady = false;
			if(commandQueue.length > 0){
				var args = commandQueue.shift();
				isReady = true;
				_instance.textToSpeech.apply(_instance, args);
			}
			else {
				isReady = true;
			}

		};
		/** command-queue
		 * @memberOf WebAudioTextToSpeech# */
		var clearCommandQueue = function(args){
			commandQueue.splice(0, commandQueue.length);
		};
//			///////////////////////// END: command-queue //////////////////////////////////

		/**
		 * @function
		 * @memberOf WebAudioTextToSpeech# */
		var onEndCallback= null;
		/**
		 * @function
		 * @memberOf WebAudioTextToSpeech# */
		var currentFailureCallback = null;
		/**
		 * @function
		 * @memberOf WebAudioTextToSpeech# */
		var onReadyCallback= null;
		/**  @memberOf WebAudioTextToSpeech# */
		var isReady= true;
		/** internal field for single-sentence audio-object.
		 * Used in {@link #ttsSingleSentence}
		 * @type AudioImpl
		 * @memberOf WebAudioTextToSpeech# */
		var ttsMedia = null;
		/**  @memberOf WebAudioTextToSpeech# */
		var playIndex = 0;
		/**  @memberOf WebAudioTextToSpeech# */
		var firstSentence = true;
		/**  @memberOf WebAudioTextToSpeech# */
		var loadIndex = 0;
		/**  @memberOf WebAudioTextToSpeech# */
		var isLoading = false;
		/**
		 * number of audio-objects that should be pre-fetched/buffered
		 * when in sentence-mode.
		 * @memberOf WebAudioTextToSpeech#
		 */
		var bufferSize = 3;
		/** internal field for list of "sentence audio-object".
		 * Used in {@link #ttsSentenceArray}
		 * @type Array<AudioImpl>
		 * @memberOf WebAudioTextToSpeech#
		 */
		var audioArray = [];
		/** internal field for list of (text) sentences to be played.
		 * Used in {@link #ttsSentenceArray}
		 * @type Array<String>
		 * @memberOf WebAudioTextToSpeech#
		 */
		var sentenceArray = [];

		var callOptions = void(0);

		/**
		 * In sentence mode: pause (in milli-seconds) between reading sentences.
		 * @memberOf WebAudioTextToSpeech#
		 */
		var pauseDuration = 500;

		/**
		 * Placeholder for empty text / sentences:
		 * no audio will be created for empty text/sentences, but using this placeholder-audio,
		 * pause-durations etc will be applied (e.g. during sentence-mode).
		 *
		 * @memberOf WebAudioTextToSpeech#
		 */
		var EMPTY_SENTENCE = mediaManager.createEmptyAudio();
		EMPTY_SENTENCE.type = 'empty';
		EMPTY_SENTENCE.play = function(){

			//simulate async playing via setTimeout
			setTimeout(function(){

				_logger.debug("done playing EMPTY_SENTENCE");

				//trigger playing the next entry:
				playNextAfterPause();

			}, 10);

			//silence did start to play immediately, so return TRUE
			return true;
		};

		/**  @memberOf WebAudioTextToSpeech# */
		var getLangParam = function(options, langSeparator, useLongLangCode){
			return options && options.language? options.language : lang.getLanguageConfig(_pluginName, useLongLangCode? 'long' : 'language', langSeparator);
		};

		/**  @memberOf WebAudioTextToSpeech# */
		var getVoiceParam = function(options){
			//NOTE voice-options may be empty string -> need to check against undefined
			return options && typeof options.voice !== 'undefined'? options.voice : lang.getLanguageConfig(_pluginName, 'voice');
		};

		/**  @memberOf WebAudioTextToSpeech# */
		var playNextAfterPause = function(){

			if(playIndex < audioArray.length - 1){

				var pause = callOptions && typeof callOptions.pauseDuration === 'number'? callOptions.pauseDuration : pauseDuration;

				if(_logger.isd()) _logger.d("LongTTS play next in "+pause+ " ms... ");

				setTimeout(playNext, pause);

			} else {

				if(_logger.isd()) _logger.d("LongTTS played last audio, finishing up now... ");
				playNext();
			}

		};

		/**  @memberOf WebAudioTextToSpeech# */
		var playNext = function playNext(){

			playIndex++;
			if (playIndex < audioArray.length){

				if(audioArray[playIndex]){

					ttsMedia=audioArray[playIndex];

					if(_logger.isd()) _logger.d("LongTTS playing "+playIndex+ " '"+sentenceArray[playIndex]+ "'" + (!audioArray[playIndex].isEnabled()?' DISABLED':''));

					audioArray[playIndex].setVolume(volume);
					var startedImmediatelely = audioArray[playIndex].play();

					if(!startedImmediatelely){

						if(_logger.isd()) _logger.d('LongTTS '+playIndex+': preparing...');
						mediaManager._preparing(_pluginName);
						audioArray[playIndex].__notready = true;

						if(onReadyCallback){
							onReadyCallback(false, audioArray[playIndex]);
						}
					}

					loadNext();
				}
				else {

					if(_logger.isd()) _logger.d('LongTTS '+playIndex+': not ready, waiting until next is loaded ...');
					mediaManager._preparing(_pluginName);

					if(onReadyCallback){
						if(_logger.isd()) _logger.d('LongTTS '+playIndex+': audio not yet loading...');
						onReadyCallback(false, audioArray[playIndex]);
					}

					// -> audio is not yet loaded...
					//    request loading the next audio, and use playNext as onLoaded-callback:
					loadNext(playNext);
				}
			}
			else {
				if (onEndCallback){
					onEndCallback();
					_resetCallbacks();
				}
//					isReady = true;//DISABLED -> EXPERIMENTAL: command-queue feature.

				//EXPERIMENTAL: command-queue feature.
				processNextInCommandQueue();
			}
		};

		/**  @memberOf WebAudioTextToSpeech# */
		var ttsSingleSentence = function(text, onEnd, failureCallback, onLoad, options){

			try {
				isReady = false;
				mediaManager._preparing(_pluginName);
				ttsMedia = createAudio(text, options,
						function(){
//								isReady = true;//DISABLED -> EXPERIMENTAL: command-queue feature.
							if(onEnd){
								onEnd();
							}
							ttsMedia.release();
							//EXPERIMENTAL: command-queue feature.
							processNextInCommandQueue();
						},
						function(err){
//								isReady = true;//DISABLED -> EXPERIMENTAL: command-queue feature.

							mediaManager._ready(_pluginName);
							if (failureCallback){
								failureCallback(err);
							} else {
								_logger.error(err);
							}

							processNextInCommandQueue();
						},
						function(){
							mediaManager._ready(_pluginName);
							if(onLoad){
								onLoad(true, this);
							}
						});
				ttsMedia.play();
			} catch (err){

				if (failureCallback){
					failureCallback(err);
				} else {
					_logger.error(err);
				}

				processNextInCommandQueue();
			}

		};

		/**  @memberOf WebAudioTextToSpeech# */
		var ttsSentenceArray = function(sentences, onEnd, failureCallback, onInit, options){
			{
				try {
					firstSentence = true;

					//"clean up" texts in sentence array (ignore empty texts)
					var size = sentences.length;
					var theText = null;

					callOptions = options;
					sentenceArray= [];
					for(var i=0; i < size; ++i){
						if(sentences[i] && sentences[i].length > 0){
							theText = sentences[i].trim();
							if(theText.length > 0){
								sentenceArray.push(theText);
							}
							else {
								sentenceArray.push(EMPTY_SENTENCE);
							}
						}
						else {
							sentenceArray.push(EMPTY_SENTENCE);
						}
					}

					onEndCallback = onEnd;
					currentFailureCallback = failureCallback;
					onReadyCallback = onInit;
					playIndex = -1;
					loadIndex = -1;
					audioArray = new Array(sentences.length);
					isLoading = false;
					loadNext(onInit);
				} catch (err){

					if (failureCallback){
						failureCallback(err);
						_resetCallbacks();
					}

					processNextInCommandQueue();
				}
			}
		};

		/**  @memberOf WebAudioTextToSpeech# */
		var loadNext = function loadNext(onInit){//TODO not onInit is currently only used for the very first sentence ...

			if (isLoading) return null;

			//FIXME need to handle case that loadingIndex is not within buffer-size ...
			if (((loadIndex-playIndex)<= bufferSize) && (loadIndex<(audioArray.length-1))){
				isLoading = true;
				var currIndex = ++loadIndex;
				var currSentence = sentenceArray[currIndex];
				if(_logger.isd()) _logger.d("LongTTS loading "+currIndex+ " "+currSentence);
				if(currSentence !== EMPTY_SENTENCE){

					audioArray[currIndex] = createAudio(currSentence, callOptions,

							function onend(){

								if(_logger.isd()) _logger.d("LongTTS done playing "+currIndex+ " '"+sentenceArray[currIndex]+"'");

								if(audioArray[currIndex]){//GUARD: audio object may have been removed by cancelSpeech(), and this listener triggered async
									audioArray[currIndex].release();
								}

								playNextAfterPause();
							},

							function onerror(err){
								//TODO currently, all pending sentences are aborted in case of an error
								//     -> should we try the next sentence instead?

								if (currentFailureCallback){
									currentFailureCallback(err);
									_resetCallbacks();
								}

								processNextInCommandQueue();
							},

							function oninit(){
								if(_logger.isd()) _logger.d("LongTTS done loading "+currIndex+ " "+sentenceArray[currIndex]+ (!this.isEnabled()?' DISABLED':''));
								isLoading = false;
								loadNext();

								if(onInit){
									if(_logger.isd()) _logger.d('LongTTS: invoking onInit now.');
									mediaManager._ready(_pluginName);
									onInit(true, this);
								} else if(this.__notready && onReadyCallback){
									if(_logger.isd()) _logger.d('LongTTS: ready again.');
									mediaManager._ready(_pluginName);
									onReadyCallback(true, this);
								}
							}
					);
				}
				else {

					audioArray[currIndex] = EMPTY_SENTENCE;

					if(_logger.isd()) _logger.d("LongTTS done loading "+currIndex+ " EMPTY_SENTENCE");
					isLoading = false;
					loadNext();

					if(onInit){
						onInit(true, EMPTY_SENTENCE);
					}
				}

				if (currIndex === 0){
					playNext();
				}

				loadNext();
			}
		};


		/**  @memberOf WebAudioTextToSpeech# */
		var initImpl = function(impl){

			var pluginName = impl.getPluginName();
			var createAudioFunc = impl.getCreateAudioFunc();

			_pluginName = pluginName;
			_logger = Logger.create(_pluginName);

			var logLevel = config.get([_pluginName, 'logLevel'], null);
			if(logLevel !== null){
				_logger.setLevel(logLevel);
			}

			createAudio = createAudioFunc;

			//optional: set default implementations, if imp. "requests" it by specifying a setter function
			if(impl.setLangParamFunc){
				//set default impl
				impl.setLangParamFunc(getLangParam);
			}
			if(impl.setVoiceParamFunc){
				//set default impl
				impl.setVoiceParamFunc(getVoiceParam);
			}

			if(impl.setMediaManager){
				//set MediaManager reference
				impl.setMediaManager(mediaManager);
			}

		};

		/**  @memberOf WebAudioTextToSpeech# */
		var _instance = {
			/**
			 * @deprecated use {@link #tts} instead
			 * @memberOf WebAudioTextToSpeech.prototype
			 */
			textToSpeech: function(){
				return mediaManager.perform(ctxId, 'tts', arguments);
			},
			/**
			 * @copydoc mmir.MediaManager#tts
			 * @public
			 * @memberOf WebAudioTextToSpeech.prototype
			 * @see mmir.MediaManager#tts
			 */
			tts: function(options, successCallback, failureCallback, onReadyCallback, options2){//NOTE params onReadyCallback and options2 are deprecated, use (first) param options instead
				var errMsg;
				if (!isReady) {

					addToCommandQueue(arguments);
					return;

					// -> DISABLED error case (not needed anymore, if queuing TTS requests...)
//						errMsg = "TTS is already used at the moment.";
//						if(failureCallback){
//							failureCallback(errMsg);
//						}
//						else {
//							_logger.error(errMsg);
//						}
//						return;
				}
				isReady = false;


				//convert first argument to options-object, if necessary
				if(typeof options === 'string' || isArray(options)){
					options = {text: options};
				}

				if(successCallback){
					options.success = successCallback;
				}

				if(failureCallback){
					options.error = failureCallback;
				}

				if(onReadyCallback){
					options.ready = onReadyCallback;
				}

				//backwards-compatibility: copy old-API options-object over, if necessary
				if(options2){
					for(var p in options2){
						if(options2.hasOwnProperty(p)) options[p] = options2[p];
					}
				}

				var text = options.text;
				var isMultiple = isArray(text);
				if(typeof text !== 'string' && !isArray(text)){
					text = text? text.toString() : '' + text;
					options.text = text;
				}

				if(text.length === 0){
					isReady = true;
					errMsg = "Aborted TTS: no text supplied (string has length 0)";
					if(failureCallback){
						failureCallback(errMsg);
					}
					else {
						_logger.error(errMsg);
					}

					processNextInCommandQueue();

					return;/////////////////////////////////// EARLY EXIT /////////////////////////////
				}

				if(!isMultiple){

					ttsSingleSentence(text, options.success, options.error, options.ready, options);

				} else {

					ttsSentenceArray(text, options.success, options.error, options.ready, options);
				}
			},
			/**
			 * @public
			 * @memberOf WebAudioTextToSpeech.prototype
			 * @see mmir.MediaManager#cancelSpeech
			 */
			cancelSpeech: function(successCallback, failureCallback){
				_logger.debug('cancel tts...');
				try {

					//immediately disable onReadyCallback / ready callbacks:
					onReadyCallback = null;

					//NOTE 1: use command-queue in case TTS is currently in use -> empty queue
					//              TODO should queue stay left intact? i.e. only current TTS canceled ...?
					//NOTE 2: if command-queue would not be cleared: need to take care of delayed audio-objects
					//        where the audio-object is not created immediately but delayed (e.g. via getWAVAsAudio(..)
					//         as in nuanceHttpTextToSpeech), e.g. by using additional canceled-flag?
					clearCommandQueue();

					//prevent further loading:
					loadIndex = audioArray.length;

					//disable playing for sentence-modus
					audioArray.forEach(function (audio){
						if (audio) {
							audio.disable();
							audio.release();
						}
					});

					//stop currently playing
					if (!isReady){
						ttsMedia.disable();
					}

					if(onEndCallback){
						onEndCallback();
						onEndCallback = null;
					}

					isReady = true;
					if(successCallback)
						successCallback();

				}catch (e){

					isReady = true;
					if (failureCallback)
						failureCallback(e);
				}

				_resetCallbacks();
			},
			/**
			 * @public
			 * @memberOf WebAudioTextToSpeech.prototype
			 * @see mmir.MediaManager#setTextToSpeechVolume
			 */
			setTextToSpeechVolume: function(newValue){
				_setVolume(newValue);
			}
		};//END: _instance = { ...

		//load specific implementation of WebAudio TTS:

		var implFile, configPath = [_basePluginName, ctxId];

		if(moduleConfig){

			//if there config setting -> use as implementation-filename:
			implFile = moduleConfig;

		} else if(ctxId){
			//if plugin was loaded into a specific context, check, if there is a configuration value for this context)
			implFile = config.get(configPath);
		}

		if(!implFile){
			//use default configuration path
			configPath[1] = _defaultCtxName;
			implFile = config.get(configPath);
		}

		if(!implFile){

			//if no configuration: use default impl.
			implFile = _defaultImplFile;

		} else if(!/\.js$/i.test(implFile)){
			implFile += '.js';
		}

		var rePluginId = /^mmir-plugin-[^/]+$/;
		var implPath = (rePluginId.test(implFile)? '' : consts.getMediaPluginPath()) + implFile;

		var processLoaded = function success(theNewWebAudioTtsImpl){

			//initialize implementation:
			initImpl(theNewWebAudioTtsImpl);

			//invoke the passed-in initializer-callback and export the public functions:
			callBack(_instance);

		};

		var handleError = function error(err){

			(_logger? _logger : console).error('failed to media plugin file '+implPath+': '+err);

			//invoke the passed-in initializer-callback without exporting any functions:
			callBack({});

		};

		if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
			try{
				var dep = rePluginId.test(implFile)? __webpack_require__(implFile.replace(/\.js$/i, '')) : require('./'+implFile);
				processLoaded(dep);
			} catch(err){
				handleError(err);
			}
		} else {
			require([implPath], processLoaded, handleError);
		}
	}
};

});//END define
