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
			 * @type mmir.LanguageManager
			 * @memberOf WebAudioTextToSpeech#
			 */
			var languageManager = require('languageManager');
			/** 
			 * @type mmir.Constants
			 * @memberOf WebAudioTextToSpeech#
			 */
			var constants = require('constants');
			/** 
			 * @type mmir.ConfigurationManager
			 * @memberOf WebAudioTextToSpeech#
			 */
			var configurationManager = require('configurationManager');
			/** 
			 * @type mmir.CommonUtils
			 * @memberOf WebAudioTextToSpeech#
			 */
			var commonUtils = require('commonUtils');
			

			/**  
			 * Will be set/"overwritten" by specific implementation.
			 * 
			 * @protected
			 * @memberOf WebAudioTextToSpeech#
			 */
			var _pluginName;

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
			var onEndCallBack= null;
			/**
			 * @function
			 * @memberOf WebAudioTextToSpeech# */
			var currentFailureCallBack = null;
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
					
					console.log("done playing EMPTY_SENTENCE");
					
					//trigger playing the next entry:
					playNextAfterPause();
					
				}, 10);
				
			};
			
			/** 
			 * HELPER for splitting a single String into "sentences", i.e. Array of Strings
			 * @param {String} text
			 * 			the input String
			 * @returns {Array<String>} a list of strings
			 * @memberOf WebAudioTextToSpeech#
			 */
			var defaultSplitter = function(text){
				text = text.replace(/\.\s|\?\s|\!\s/g,"#");
				return text.split("#");
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
					
					console.log("LongTTS play next in "+pause+ " ms... ");
					
					setTimeout(playNext, pause);
					
				} else {
					
					console.log("LongTTS played last audio, finishing up now... ");
					playNext();
				}
				
			};

			/**  @memberOf WebAudioTextToSpeech# */
			var playNext = function playNext(){
				
				playIndex++;
				if (playIndex < audioArray.length){
					
					if(audioArray[playIndex]){
						
						ttsMedia=audioArray[playIndex];
	
						console.log("LongTTS playing "+playIndex+ " '"+sentenceArray[playIndex]+ "'" + (!audioArray[playIndex].isEnabled()?' DISABLED':''));//FIXME debug
						
						audioArray[playIndex].setVolume(volume);
						audioArray[playIndex].play();
						loadNext();
					}
					else {
						// -> audio is not yet loaded...
						//    request loading the next audio, and use playNext as onLoaded-callback:
						loadNext(playNext);
					}
				}
				else {
					if (onEndCallBack){
						onEndCallBack();
						onEndCallBack = null;
					}
//					isReady = true;//DISABLED -> EXPERIMENTAL: command-queue feature.
					
					//EXPERIMENTAL: command-queue feature.
					processNextInCommandQueue();
				}
			};
			
			/**  @memberOf WebAudioTextToSpeech# */
			var ttsSingleSentence = function(text, onEnd, failureCallBack, onLoad, options){
				
				try {
					isReady = false;		   			
					ttsMedia = createAudio(text, options,
								function(){
//									isReady = true;//DISABLED -> EXPERIMENTAL: command-queue feature.
									if(onEnd){
										onEnd();
									};
									//EXPERIMENTAL: command-queue feature.
									processNextInCommandQueue();
								},
								function(){
//									isReady = true;//DISABLED -> EXPERIMENTAL: command-queue feature.
									if (failureCallBack){
										failureCallBack();
									};

									//EXPERIMENTAL: command-queue feature.
									processNextInCommandQueue();
								},
								function(){
									if(onLoad){
										onLoad();
									};
								});
					ttsMedia.play();
				} catch (e){
//					isReady=true;//DISABLED -> EXPERIMENTAL: command-queue feature.
		    		console.log('error!'+e);
					if (failureCallBack){
						failureCallBack();
					}

					//EXPERIMENTAL: command-queue feature.
					processNextInCommandQueue();
				}
				
			};

			/**  @memberOf WebAudioTextToSpeech# */
			var ttsSentenceArray = function(sentences, onEnd, failureCallBack, onInit, options){
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
							
						onEndCallBack = onEnd;
						currentFailureCallBack = failureCallBack;
						playIndex = -1;
						loadIndex = -1;
						audioArray = new Array(sentences.length);
						isLoading = false;
						loadNext(onInit);
					} catch (e){
//						isReady=true;//DISABLED -> EXPERIMENTAL: command-queue feature.
			    		console.log('error! '+e);
						if (failureCallBack){
							failureCallBack();
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
					console.log("LongTTS loading "+currIndex+ " "+currSentence);
					if(currSentence !== EMPTY_SENTENCE){
						
						audioArray[currIndex] = createAudio(currSentence, callOptions,
								
								function onend(){
							
									console.log("LongTTS done playing "+currIndex+ " '"+sentenceArray[currIndex]+"'");
									audioArray[currIndex].release();
									
									playNextAfterPause();
									
									//TODO only invoke this, if previously the test for (loadIndex-playIndex)<= bufferSize) failed ...
									//loadNext();
								},
	
								function onerror(){
									//TODO currently, all pending sentences are aborted in case of an error
									//     -> should we try the next sentence instead?
									
	//								isReady = true;//DISABLE -> EXPERIMENTAL: command-queue feature.
									if (currentFailureCallBack){
										currentFailureCallBack();
									};
									
									//EXPERIMENTAL: command-queue feature.
									processNextInCommandQueue();
								},
								
								function oninit(){
									console.log("LongTTS done loading "+currIndex+ " "+sentenceArray[currIndex]+ (!this.isEnabled()?' DISABLED':''));
									isLoading = false;
									loadNext();
									
									if(onInit){
										onInit();
									}
								}
						);
					}
					else {
						
						audioArray[currIndex] = EMPTY_SENTENCE;
						
						console.log("LongTTS done loading "+currIndex+ " EMPTY_SENTENCE");
						isLoading = false;
						loadNext();
						
						if(onInit){
							onInit();
						}
					}
					
					if (currIndex==0){
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
				 * @public
				 * @memberOf WebAudioTextToSpeech.prototype
				 * @see mmir.MediaManager#textToSpeech
				 */
				textToSpeech: function(parameter, successCallback, failureCallback, onInit, options){
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
//							console.error(errMsg);
//						}
//						return;
					}
					isReady = false;
					
					var text;
					var isMultiple = false;
					if (typeof parameter === 'object'){
						
						//TODO allow setting custom pause-duration, something like: (NOTE would need to reset pause in case of non-object arg too!)
//						if (parameter.pauseDuration!== null && parameter.pauseDuration>=0){
//							pauseDuration = parameter.pauseDuration;
//							console.log("PauseDuration: "+pauseDuration);
//						} else {
//							var configPause = configurationManager.get('pauseDurationBetweenSentences');
//							if (configPause) {
//								pauseDuration = configPause;
//							}
//							else{
//								pauseDuration = 500;
//							}
//						}
						
						if (parameter.text && commonUtils.isArray(parameter.text)){
							if (parameter.forceSingleSentence){
								text = commonUtils.concatArray(parameter.text);
							} else {
								text = parameter.text;
							}
						} 

						//if text is string: apply splitting, if requested:
						if (typeof parameter.text === 'string'){
							if (parameter.split || parameter.splitter){
								var splitter = parameter.splitter || defaultSplitter;
								text = splitter(parameter.text);
							} else {
								text = parameter.text;
							}
						}
						
						if(!text){
							text = parameter;
						}
						
						if(!options){
							options = parameter;
						}
						//TODO else: merge parameter into options
						
					} else {
						text = parameter;
					}
						
					if(text && commonUtils.isArray(text)){
						isMultiple = true;
					} else if (typeof text !== 'string'){
						text = typeof text !== 'undefined' && text !== null? text.toString() : '' + text;
					}
					
					if(text.length === 0){
						isReady = true;
						errMsg = "Aborted TTS: no text supplied (string has length 0)";
						if(failureCallback){
							failureCallback(errMsg);
						}
						else {
							console.error(errMsg);
						}

						//EXPERIMENTAL: command-queue feature.
						processNextInCommandQueue();
						
						return;/////////////////////////////////// EARLY EXIT /////////////////////////////
					}
					
					if(!isMultiple){
						
						ttsSingleSentence(text, successCallback, failureCallback, onInit, options);
						
					} else {
						
						ttsSentenceArray(text, successCallback, failureCallback, onInit, options);
					}
				},
				/**
				 * @public
				 * @memberOf WebAudioTextToSpeech.prototype
				 * @see mmir.MediaManager#cancelSpeech
				 */
				cancelSpeech: function(successCallBack, failureCallBack){
					console.debug('cancel tts...');
					try {
						

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
						
						if(onEndCallBack){
							onEndCallBack();
							onEndCallBack = null;
						}
						
						isReady = true;
						successCallBack();
					}catch (e){
						isReady = true;
						if (failureCallBack)
							failureCallBack();
					}
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
			
			var implPath = constants.getMediaPluginPath() + implFile;
			
			commonUtils.getLocalScript(implPath, function success(){
			
				var theNewWebAudioTtsImpl = newWebAudioTtsImpl;
				newWebAudioTtsImpl = void(0);
				
				//initialize implementation:
				initImpl(theNewWebAudioTtsImpl);
				
				//invoke the passed-in initializer-callback and export the public functions:
				callBack(_instance);
				
			}, function error(err){
				
				console.error('failed to media plugin file '+implPath+': '+err);
				
				//invoke the passed-in initializer-callback without exporting any functions:
				callBack({});
				
			});
		}
};
