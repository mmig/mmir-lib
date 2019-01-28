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

		/**  @memberOf WebAudioTextToSpeech# */
		initialize: function(callBack, mediaManager, ctxId, moduleConfig){

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

			/**
			 * legacy mode: use pre-v4 API of mmir-lib
			 * @memberOf WebAudioTextToSpeech#
			 */
			var _isLegacyMode = true;
			/**
			 * Reference to the mmir-lib core (only available in non-legacy mode)
			 * @type mmir
			 * @memberOf WebAudioTextToSpeech#
			 */
			var _mmir = null;
			if(mediaManager._get_mmir){
				//_get_mmir() is only available for >= v4
				_mmir = mediaManager._get_mmir();
				//just to make sure: set legacy-mode if version is < v4
				_isLegacyMode = _mmir? _mmir.isVersion(4, '<') : true;
			}
			/**
			 * HELPER for require():
			 * 		use module IDs (and require instance) depending on legacy mode
			 *
			 * @param {String} id
			 * 			the require() module ID
			 *
			 * @returns {any} the require()'ed module
			 *
			 * @memberOf WebAudioTextToSpeech#
			 */
			var _req = function(id){
				var name = (_isLegacyMode? '' : 'mmirf/') + id;
				return _mmir? _mmir.require(name) : require(name);
			};
			/**
			 * HELPER for cofigurationManager.get() backwards compatibility (i.e. legacy mode)
			 *
			 * @param {String|Array<String>} path
			 * 			the path to the configuration value
			 * @param {any} [defaultValue]
			 * 			the default value, if there is no configuration value for <code>path</code>
			 *
			 * @returns {any} the configuration value
			 *
			 * @memberOf WebAudioTextToSpeech#
			 */
			var _conf = function(path, defaultValue){
				return _isLegacyMode? configurationManager.get(path, true, defaultValue) : configurationManager.get(path, defaultValue);
			};


			//backwards compatibility (pre 3.?)
			if(!mediaManager._preparing){
				mediaManager._preparing = function(name){_logger.warn(name +' is preparing - NOTE: this is a stub-function. Overwrite MediaManager._preparing for setting custom implementation.');};
			}
			if(!mediaManager._ready){
				mediaManager._ready     = function(name){_logger.warn(name + ' is ready - NOTE: this is a stub-function. Overwrite MediaManager._ready for setting custom implementation.');};
			}

			/**
			 * @type mmir.LanguageManager
			 * @memberOf WebAudioTextToSpeech#
			 */
			var languageManager = _req('languageManager');
			/**
			 * @type mmir.Constants
			 * @memberOf WebAudioTextToSpeech#
			 */
			var constants = _req('constants');
			/**
			 * @type mmir.ConfigurationManager
			 * @memberOf WebAudioTextToSpeech#
			 */
			var configurationManager = _req('configurationManager');
			/**
			 * @type mmir.CommonUtils
			 * @memberOf WebAudioTextToSpeech#
			 */
			var commonUtils = _req('commonUtils');

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

			/////////////////////////// EXPERIMENTAL: command-queue for queuing up TTS requests (instead of discarding when already busy) ////////
			/**
			 * EXPERIMENTAL: command-queue in case TTS is currently in use
			 * -> if TTS invoked, but currently not ready: add to queue
			 * -> after processing current TTS: process next on queue
			 *
			 * @memberOf WebAudioTextToSpeech#
			 */
			var commandQueue = [];
			/** EXPERIMENTAL: command-queue
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
			/** EXPERIMENTAL: command-queue
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
			/** EXPERIMENTAL: command-queue
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
			var getLangParam = function(options, langSeparator){
				return options && options.language? options.language : languageManager.getLanguageConfig(_pluginName, 'language', langSeparator);
			};

			/**  @memberOf WebAudioTextToSpeech# */
			var getVoiceParam = function(options){
				//NOTE voice-options may be empty string -> need to check against undefined
				return options && typeof options.voice !== 'undefined'? options.voice : languageManager.getLanguageConfig(_pluginName, 'voice');
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
								if (failureCallback){
									failureCallback(err);
								} else {
									_logger.error(err);
								}

								//EXPERIMENTAL: command-queue feature.
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
//					isReady=true;//DISABLED -> EXPERIMENTAL: command-queue feature.
					if (failureCallback){
						failureCallback(err);
					} else {
						_logger.error(err);
					}

					//EXPERIMENTAL: command-queue feature.
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
//						isReady=true;//DISABLED -> EXPERIMENTAL: command-queue feature.
						if (failureCallback){
							failureCallback(err);
							_resetCallbacks();
						}

						//EXPERIMENTAL: command-queue feature.
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

	//								isReady = true;//DISABLE -> EXPERIMENTAL: command-queue feature.
									if (currentFailureCallback){
										currentFailureCallback(err);
										_resetCallbacks();
									}

									//EXPERIMENTAL: command-queue feature.
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
				_logger = _req('logger').create(_pluginName);

				var logLevel = _conf([_pluginName, 'logLevel'], null);
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

						//EXPERIMENTAL: use command-queue in case TTS is currently in use.
						addToCommandQueue(arguments);
						return;

						//EXPERIMENTAL: command-queue feature.
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
					if(typeof options === 'string' || commonUtils.isArray(options)){
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
					var isMultiple = commonUtils.isArray(text);
					if(typeof text !== 'string' && !commonUtils.isArray(text)){
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

						//EXPERIMENTAL: command-queue feature.
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

						//EXPERIMENTAL: use command-queue in case TTS is currently in use -> empty queue
						//              TODO should queue stay left intact? i.e. only current TTS canceled ...?
						//NOTE: if command-queue would not be cleared: need to take care of delayed audio-objects
						//      where the audio-object is not created immediately but delayed (e.g. via getWAVAsAudio(..)
						//       as in nuanceHttpTextToSpeech), e.g. by using additional canceled-flag?
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
				implFile = _conf(configPath);
			}

			if(!implFile){
				//use default configuration path
				configPath[1] = _defaultCtxName;
				implFile = _conf(configPath);
			}

			if(!implFile){

				//if no configuration: use default impl.
				implFile = _defaultImplFile;

			} else if(!/\.js$/i.test(implFile)){
				implFile += '.js';
			}

			var implPath = constants.getMediaPluginPath() + implFile;

			var ctx = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;

			var processLoaded = function success(){

				var theNewWebAudioTtsImpl = ctx.newWebAudioTtsImpl;
				ctx.newWebAudioTtsImpl = void(0);

				//initialize implementation:
				initImpl(theNewWebAudioTtsImpl);

				//invoke the passed-in initializer-callback and export the public functions:
				callBack(_instance);

			}
			var handleError = function error(err){

				(_logger? _logger : console).error('failed to media plugin file '+implPath+': '+err);

				//invoke the passed-in initializer-callback without exporting any functions:
				callBack({});

			};

			if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
				try{
					ctx.newWebAudioTtsImpl = require('./'+implFile);
					processLoaded();
				} catch(err){
					handleError(err);
				}
			} else {
				commonUtils.getLocalScript(implPath, processLoaded, handleError);
			}
		}
};

if(typeof module === 'object' && module.exports){
	module.exports = newMediaPlugin;
}
