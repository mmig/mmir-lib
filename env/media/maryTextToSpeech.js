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
		/**  @memberOf MaryTextToSpeech# */
		initialize: function(callBack, mediaManager){
			
			/**  @memberOf MaryTextToSpeech# */
			var _pluginName = 'maryTextToSpeech';
			
			/** 
			 * @type mmir.LanguageManager
			 * @memberOf MaryTextToSpeech#
			 */
			var languageManager = require('languageManager');
			/** 
			 * @type mmir.ConfigurationManager
			 * @memberOf MaryTextToSpeech#
			 */
			var configurationManager = require('configurationManager');
			/** 
			 * @type mmir.CommonUtils
			 * @memberOf MaryTextToSpeech#
			 */
			var commonUtils = require('commonUtils');
			
			/**  @memberOf MaryTextToSpeech# */
			var volume = 1.0;
			
			/**  @memberOf MaryTextToSpeech# */
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
			 * @memberOf MaryTextToSpeech# 
			 */
			var commandQueue = [];
			/** EXPERIMENTAL: command-queue
			 * @memberOf MaryTextToSpeech# */
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
			 * @memberOf MaryTextToSpeech# */
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
			 * @memberOf MaryTextToSpeech# */
			var clearCommandQueue = function(args){
				commandQueue.splice(0, commandQueue.length);
			};
//			///////////////////////// END: command-queue ////////////////////////////////// 
			
			/**
			 * @function
			 * @memberOf MaryTextToSpeech# */
			var onEndCallBack= null;
			/**
			 * @function
			 * @memberOf MaryTextToSpeech# */
			var currentFailureCallBack = null;
			/**  @memberOf MaryTextToSpeech# */
			var isReady= true;
			/** internal field for single-sentence audio-object.
			 * Used in {@link #ttsSingleSentence}
			 * @type AudioImpl
			 * @memberOf MaryTextToSpeech# */
			var ttsMedia = null;
			/**  @memberOf MaryTextToSpeech# */
			var playIndex = 0;
			/**  @memberOf MaryTextToSpeech# */
			var firstSentence = true;
			/**  @memberOf MaryTextToSpeech# */
			var loadIndex = 0;
			/**  @memberOf MaryTextToSpeech# */
			var isLoading = false;
			/** 
			 * number of audio-objects that should be pre-fetched/buffered
			 * when in sentence-mode.
			 * @memberOf MaryTextToSpeech#
			 */
			var bufferSize = 3;
			/** internal field for list of "sentence audio-object".
			 * Used in {@link #ttsSentenceArray}
			 * @type Array<AudioImpl>
			 * @memberOf MaryTextToSpeech#
			 */
			var audioArray = [];
			/** internal field for list of (text) sentences to be played.
			 * Used in {@link #ttsSentenceArray}
			 * @type Array<String>
			 * @memberOf MaryTextToSpeech#
			 */
			var sentenceArray = [];
			/**  
			 * In sentence mode: pause (in milli-seconds) between reading sentences.
			 * @memberOf MaryTextToSpeech#
			 */
			var pauseDuration = 500;
			/** 
			 * HELPER for splitting a single String into "sentences", i.e. Array of Strings
			 * @param {String} text
			 * 			the input String
			 * @returns {Array<String>} a list of strings
			 * @memberOf MaryTextToSpeech#
			 */
			var defaultSplitter = function(text){
				text = text.replace(/\.\s|\?\s|\!\s/g,"#");
				return text.split("#");
			};
			/**  @memberOf MaryTextToSpeech# */
			var generateTTSURL = function(text){
				text = encodeURIComponent(text);
				var lang = languageManager.getLanguageConfig(_pluginName);
				var voice = languageManager.getLanguageConfig(_pluginName, 'voice');
				
				var voiceParamStr = voice? '&VOICE='+voice : '';
				
				return configurationManager.get([_pluginName, "serverBasePath"])+'process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=' + text + '&LOCALE='+lang + voiceParamStr + '&AUDIO=WAVE_FILE';
			};

			/**  @memberOf MaryTextToSpeech# */
			var playNext = function playNext(){
				
				playIndex++;
				if (playIndex<(audioArray.length)){
					ttsMedia=audioArray[playIndex];

					console.log("LongTTS playing "+playIndex+ " '"+sentenceArray[playIndex]+ "'" + (!audioArray[playIndex].isEnabled()?' DISABLED':''));//FIXME debug
					
					audioArray[playIndex].setVolume(volume);
					audioArray[playIndex].play();
					loadNext();
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
			
			/**  @memberOf MaryTextToSpeech# */
			var ttsSingleSentence = function(text, onEnd, failureCallBack, onLoad){
				
				try {
					isReady = false;		   			
					ttsMedia = mediaManager.getURLAsAudio(generateTTSURL(text), 
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

			/**  @memberOf MaryTextToSpeech# */
			var ttsSentenceArray = function(sentences, onEnd, failureCallBack, onInit){
				{
					try {
						firstSentence = true;
						
						//"clean up" texts in sentence array (ignore empty texts)
						var size = sentences.length;
						var theText = null;
						
						sentenceArray= [];
						for(var i=0; i < size; ++i){
							if(sentences[i] && sentences[i].length > 0){
								theText = sentences[i].trim();
								if(theText.length > 0){
									sentenceArray.push(theText);
								}
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

			/**  @memberOf MaryTextToSpeech# */
			var loadNext = function loadNext(onInit){//TODO not onInit is currently only used for the very first sentence ...
				if (isLoading) return null;
				//FIXME need to handle case that loadingIndex is not within buffer-size ...
				if (((loadIndex-playIndex)<= bufferSize) && (loadIndex<(audioArray.length-1))){
					isLoading = true;
					var currIndex = ++loadIndex;
					console.log("LongTTS loading "+currIndex+ " "+sentenceArray[currIndex]);
					audioArray[currIndex] = mediaManager.getURLAsAudio(generateTTSURL(sentenceArray[currIndex]), 
							function(){
								console.log("LongTTS done playing "+currIndex+ " "+sentenceArray[currIndex]);
								audioArray[currIndex].release();
								

								console.log("LongTTS play next in "+pauseDuration+ " ms... ");
								setTimeout(playNext, pauseDuration);
								
								//TODO only invoke this, if previously the test for (loadIndex-playIndex)<= bufferSize) failed ...
//								loadNext();
							},

							function(){
								//TODO currently, all pending sentences are aborted in case of an error
								//     -> should we try the next sentence instead?
								
//								isReady = true;//DISABLE -> EXPERIMENTAL: command-queue feature.
								if (currentFailureCallBack){
									currentFailureCallBack();
								};
								
								//EXPERIMENTAL: command-queue feature.
								processNextInCommandQueue();
							},
							function(){
								console.log("LongTTS done loading "+currIndex+ " "+sentenceArray[currIndex]+ (!this.isEnabled()?' DISABLED':''));
								isLoading = false;
								loadNext();
								
								if(onInit){
									onInit();
								}
							}
					);
					
					if (currIndex==0){
						playNext();
					}
					
					loadNext();
				}
			};
			
			/**  @memberOf MaryTextToSpeech# */
			var _instance = {
				/**
				 * @public
				 * @memberOf MaryTextToSpeech.prototype
				 * @see mmir.MediaManager#textToSpeech
				 */
				textToSpeech: function(parameter, successCallback, failureCallback, onInit){
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
					if ((typeof parameter) == 'string'){
						if(parameter.length === 0){
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
						ttsSingleSentence(parameter, successCallback, failureCallback, onInit);
					} else if((typeof parameter !== 'undefined')&& commonUtils.isArray(parameter) ){
						ttsSentenceArray(parameter, successCallback, failureCallback, onInit);
					} else if ((typeof parameter == 'object')){
						if (parameter.pauseDuration!== null && parameter.pauseDuration>=0){
							pauseDuration = parameter.pauseDuration;
							console.log("PauseDuration: "+pauseDuration);
						} else {
							var configPause = configurationManager.get('pauseDurationBetweenSentences');
							if (configPause) {
								pauseDuration = configPause;
							}
							else pauseDuration = 1000;
						}
						if ((typeof parameter.text !== 'undefined')&& commonUtils.isArray(parameter.text) ){
							if (parameter.forceSingleSentence){
								ttsSingleSentence(commonUtils.concatArray(parameter.text),successCallback, failureCallback, onInit);
							} else {
								ttsSentenceArray(parameter.text, successCallback, failureCallback, onInit);
							}
						}
						if ((typeof parameter.text)== 'string'){
							if (parameter.split || parameter.splitter){
								var splitter = parameter.splitter || defaultSplitter;
								ttsSentenceArray(splitter(parameter.text), successCallback, failureCallback, onInit);
							} else {
								ttsSingleSentence(parameter.text, successCallback, failureCallback, onInit);
							}
						}
					}
				},
				/**
				 * @public
				 * @memberOf MaryTextToSpeech.prototype
				 * @see mmir.MediaManager#cancelSpeech
				 */
				cancelSpeech: function(successCallBack, failureCallBack){
					console.debug('cancel tts...');
					try {
						

						//EXPERIMENTAL: use command-queue in case TTS is currently in use -> empty queue
						//              TODO should queue stay left intact? i.e. only current TTS canceled ...?
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
				 * @memberOf MaryTextToSpeech.prototype
				 * @see mmir.MediaManager#setTextToSpeechVolume
				 */
				setTextToSpeechVolume: function(newValue){
					_setVolume(newValue);
				}
			};//END: _instance = { ...
			
			//invoke the passed-in initializer-callback and export the public functions:
			callBack(_instance);
		}
};
