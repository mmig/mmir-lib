
/**
 * Media Module: Implementation for Text-To-Speech via WebSpeech API SpeechSynthesis
 *
 * @requires HTML5 SpeechSynthesis
 *
 * @class WebSpeechTTSImpl
 * @memberOf mmir.env.media
 * @hideconstructor
 *
 * @see https://wicg.github.io/speech-api/#tts-section
 *
 */

define(['mmirf/languageManager', 'mmirf/util/toArray'], function(lang, toArray){

	var globalCtx = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;
	var speechSynthesis = globalCtx.speechSynthesis || null;

	/**
	 * @readonly
	 * @inner
	 * @default "ttsWebspeech"
	 * @memberOf mmir.env.media.WebSpeechTTSImpl#
	 */
	var _pluginName = 'ttsWebspeech';

	if(!speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined'){
		throw new Error('Could not initialize media plugin '+_pluginName+': Web Speech Synthesis is not supported.');
	}

	return function createWebSpeechTTSImpl(_defaultLogger){

		/** @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */
		var _getLangParam;
		/** @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */

		/**
		 * HELPER retrieve language setting and apply impl. specific corrections/adjustments
		 * (i.e. deal with WebSpeech specific quirks for language/country codes)
		 *
		 * @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */
		var _getFixedLang = function(options){

			var locale = _getLangParam(options, void(0));

			return lang.fixLang('google', locale);
		};

		/**
		 * HELPER retrieve voice setting and apply impl. specific corrections/adjustments
		 *
		 * @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */
		var _getFixedVoice = function(options, language){

			var voiceParam = _getVoiceParam(options, language);

			var voice;
			if(typeof voiceParam === 'string'){
				var filterOpt = /^male|female$/i.test(voiceParam)? {details: {gender: voiceParam}, language: language} : {details: {name: voiceParam}};
				voice = _selectVoice(filterOpt);
			} else {
				voice = voiceParam
			}

			return voice;
		};

		var _getVoiceParam;

		/** @memberOf mmir.env.media.WebSpeechTTSImpl#
		* @private
		*/
		var _lastSelectedVoice;//{query: QueryOptions, voice: VoiceDetails}
		/**
		 * HELPER retrieve voice setting and apply impl. specific corrections/adjustments
		 *
		 * @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */
		var _selectVoice = function(filterOpt){
			if(_lastSelectedVoice){
				var q = _lastSelectedVoice.query;
				if(q.language === filterOpt.language && q.details.gender === filterOpt.details && q.details.name === filterOpt.details.name){
					return _lastSelectedVoice.voice;
				}
			}
			var voices = _getVoiceList().filter(_createVoiceFilter(filterOpt));
			if(voices.length > 0 && speechSynthesis){
				var id = voices[0].name;
				var voice = speechSynthesis.getVoices().find(function(v){ return v.voiceURI === id});
			}
			_lastSelectedVoice = {query: filterOpt, voice: voice};
			return voice;
		};

		/**
		 * HELPER convert raw voice information
		 * @param {SpeechSynthesisVoice} infos the raw voice information
		 * @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */
		var _toVoiceDetails = function(infos){

			var gm = /\b((fe)?male)\b/i.exec(infos.name);
			var genderInfo = !gm? 'unknown' : gm[2]? 'female' : gm[1]? 'male' : 'unknown';
			return {
				name: infos.voiceURI,
				language: infos.lang,
				gender: genderInfo,
				local: infos.localService
			}
		};

		/**
		 * HELPER create filter-function for voice depending on language and/or gender
		 * @param {VoiceOptions} options for listing voices:
		 * 				options.language: the language code (may include country code)
		 * 				options.details: boolean | {name: string, gender: 'male' | 'female' | 'unknown'}
		 * @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */
		var _createVoiceFilter = function(options){

			var reLang = null, reStr = null;
			if(options.language){
				var parts = options.language.split(/[-_]/);
				reStr = '^'+parts[0];
				if(parts[1]){
					reStr += '[-_]'+parts[1]+'$';
				}
				reLang = new RegExp(reStr, 'i');
			}

			var reName = null;
			var reGender = null;
			var valVoice = null;
			if(options.details){

				valVoice = options.details.name;
				reStr = valVoice;
				if(reStr){
					// NOTE reStr.replace(..): escape RegExp symbols for possibly "raw" voice value
					//                         adapted from:
					//                             https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
					//                             MIT License, Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
					reName = reStr.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
					reName = new RegExp('^' + reName + '$', 'i');
				}

				reStr = options.details.gender;
				if(reStr){
					reGender = new RegExp('^'+reStr+'$', 'i');
				}
			}

			return function(voice){
				return (!reLang || reLang.test(voice.language)) && (!reName || valVoice === voice.name || reName.test(voice.name)) && (!reGender || reGender.test(voice.gender));
			}
		};

		/**  @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */
		var _invokeAsync = function(func){
			return setTimeout(func, 10);
		}

		/**  @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */
		var createAudio = function(sentence, options, onend, onerror, oninit){

			return _createUtteranceAudio(sentence, options, onend, onerror, oninit);
		};

		/** @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @private
		 */
		var _getVoiceList = function(callback, onerror){

			if(speechSynthesis){
				var list = speechSynthesis.getVoices().map(function(raw){ return _toVoiceDetails(raw)});
				if(callback){
					_invokeAsync(function(){callback(list)});
				} else {
					return list;
				}
			} else if(onerror) {
				_invokeAsync(function(){onerror(_pluginName + ': no SpeechSynthesis instance available!')});
			}
		};

		/** @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @see mmir.MediaManager#getSpeechLanguages
		 * @private
		 */
		var getLanguageList = function(callback, onerror){

			_getVoiceList(function(list){
				var langs = new Set();
				list.forEach(function(v){ langs.add(v.language)});
				callback && callback(toArray(langs));
			}, onerror || console.error);
		};


		/** @memberOf mmir.env.media.WebSpeechTTSImpl#
		 * @see mmir.MediaManager#getVoices
		 * @private
		 */
		var getVoiceList = function(options, callback, onerror){

			_getVoiceList(function(voices){
				var isFilter = options && (options.language || (options.details && (options.details.name || options.details.gender)));
				var filteredList = !isFilter? voices : voices.filter(_createVoiceFilter(options));
				var isDetails = options && options.details;
				callback && callback(isDetails? filteredList : filteredList.map(function(v){ return v.name;}));
			}, onerror || console.error);
		};

		/**
		 * HELPER create AudioImpl wrapper for SpeechSynthesisUtterance instance.
		 * @private
		 * @memberOf mmir.env.media.WebSpeechTTSImpl#
		 */
		var _createUtteranceAudio = function(text, options, onEnd, failureCallback, onCanPlay){

			try {

				/**
				 * status:
				 * 0 - initial
				 * 1 - ready/initialized
				 * 2 - playing
				 * 3 - paused
				 * 4 - ended/stopped
				 * @private
				 * @memberOf AudioSpeechSynthesisImpl#
				 */
				var playStatus = 0;

				var my_media = new SpeechSynthesisUtterance();

				var lang = _getFixedLang(options);
				var voice = _getFixedVoice(options, lang);
				if(typeof voice !== 'undefined'){
					my_media.voice = voice;
				} else {
					if(typeof lang !== 'undefined'){
						my_media.lang = lang;//'en-US';
					}
				}

				if(typeof options.rate !== 'undefined'){
					my_media.rate = options.rate; // 0.1 to 10
				}
				if(typeof options.pitch !== 'undefined'){
					my_media.pitch = options.pitch; //0 to 2
				}

				my_media.text = text;

				var onplay = function(){
					// console.warn('SpeechSynthesisUtterance['+JSON.stringify(text)+']: '+e.type+'!');
					playStatus = 2;
				};
				var onpause = function(){
					// console.warn('SpeechSynthesisUtterance['+JSON.stringify(text)+']: '+e.type+'!');
					playStatus = 3
				}
				my_media.onstart = onplay;
				my_media.onresume = onplay;
				my_media.onpause = onpause;
				my_media.onend = function() {
					// console.log('Finished in ' + event.elapsedTime + ' seconds.');
					// console.warn('SpeechSynthesisUtterance['+JSON.stringify(text)+']: '+e.type+'!');

					mediaImpl.__FIX__clearChromePrematureStopBug();//FIXME HACK for Chrome Bug

					playStatus = 4;
					if (onEnd){
						onEnd.apply(mediaImpl, arguments);
					}
				};
				my_media.onerror = function() {
					// console.log('Finished in ' + event.elapsedTime + ' seconds.');
					// console.warn('SpeechSynthesisUtterance['+JSON.stringify(text)+']: '+e.type+' -> ', e);

					mediaImpl.__FIX__clearChromePrematureStopBug();//FIXME HACK for Chrome Bug

					playStatus = 4;//FIXME do this?
					if (failureCallback){
						failureCallback.apply(mediaImpl, arguments);
					}
				};

				/**
				 * @private
				 * @memberOf AudioSpeechSynthesisImpl#
				 */
				var enabled = !!speechSynthesis;

				/**
				 * @private
				 * @memberOf AudioSpeechSynthesisImpl#
				 */
				var onReadyTimer = 0;

				/**
				 * The Audio abstraction that wraps the underlaying SpeechSynthesisUtterance instance.
				 *
				 * <p>
				 * NOTE: when an audio object is not used anymore, its {@link #release} method should
				 * 		 be called.
				 *
				 * <p>
				 * This is the same interface as {@link mmir.env.media.AudioHtml5Impl}.
				 *
				 * @class
				 * @name AudioSpeechSynthesisImpl
				 * @memberOf mmir.env.media
				 * @implements mmir.env.media.IAudio
				 * @hideconstructor
				 * @public
				 */
				 var mediaImpl = {
						/**
						 * start timer for Chrome Bug-FIX
						 *
						 * FIXME HACK for Chrome bug https://issues.chromium.org/issues/41294170
						 *       ... TTS stops after around 15 sec (bug is still present in Chrome 128.0.6613.138)
						 *       -> WORKAROUND: pause() and then immediately resume() the media at regular intervals
						 *          see https://issues.chromium.org/issues/41294170#comment10
						 *
						 * @see also HACK implementation in mmir.env.media.AudioSpeechSynthesisImpl.prototype.play
						 * @see https://issues.chromium.org/issues/41294170
						 *
						 * @private
						 * @name __FIX__chromePrematureStopBug
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
					 	__FIX__chromePrematureStopBug: function(){
							// only apply HACK, if still speaking
							if(speechSynthesis.speaking){
								speechSynthesis.pause();
								speechSynthesis.resume();
								// premature stop occurs around 15 sec, so check well before that:
								// TODO check remaining duration and adjust timout or omit restarting it...
								var self = this;
								this.__fixTimer = setTimeout(function(){self.__FIX__chromePrematureStopBug()}, 9000);
						 }
					 },
						/**
						 * stop / clear fix for Chrome Bug
						 *
						 * @private
						 * @name __FIX__clearChromePrematureStopBug
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						__FIX__clearChromePrematureStopBug: function(){
							if(this.__fixTimer){
								clearTimeout(this.__fixTimer);
								this.__fixTimer = 0;
							}
						},

						/**
						 * Play audio.
						 *
						 * @inheritdoc
						 * @name play
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						play: function(){
							if (enabled){

								this.__FIX__clearChromePrematureStopBug();//FIXME HACK for Chrome Bug

								if(playStatus > 0 && playStatus < 4){
									if(speechSynthesis.speaking || speechSynthesis.pending){
										speechSynthesis.cancel();
									}
									speechSynthesis.speak(my_media);
									if(speechSynthesis.paused){
										speechSynthesis.resume()
									}

									//FIXME HACK start fix-timer for Chrome Bug:
									this.__FIX__chromePrematureStopBug();

								}
								return playStatus >= 1;
							}
							return false;
						},
						/**
						 * Stop playing audio.
						 *
						 * @inheritdoc
						 * @name stop
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						stop: function(){

							this.__FIX__clearChromePrematureStopBug();//FIXME HACK for Chrome Bug

							//only try to stop if playing and/or paused
							if(speechSynthesis && (playStatus === 2 || playStatus === 3)){
								// my_media.stop();
								speechSynthesis.cancel();
								return true;
							}
							return playStatus === 4;
						},
						/**
						 * Enable audio (should only be used internally).
						 *
						 * @inheritdoc
						 * @name enable
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						enable: function(){
							enabled = !!speechSynthesis;
						},
						/**
						 * Disable audio (should only be used internally).
						 *
						 * @inheritdoc
						 * @name disable
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						disable: function(){
							if(enabled){
								this.stop();
								enabled = false;
							}
						},
						/**
						 * Release audio: should be called when the audio
						 * file is not used any more.
						 *
						 * NOTE Android has limited resources available - not releasing resources
						 *      may result in not being able to instantiate new (audio) resources.
						 *
						 * @inheritdoc
						 * @name release
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						release: function(){
							clearTimeout(onReadyTimer);
							if(enabled && ! this.isPaused()){
								this.stop();
							}
							enabled= false;
							if(my_media){
								my_media.onstart = null;
								my_media.onresume = null;
								my_media.onpause = null;
								my_media.onend = null;
								my_media.onerror = null;
								my_media = null;
							}

						},
						/**
						 * Set the volume of this audio file
						 *
						 * @param {Number} value
						 * 			the new value for the volume:
						 * 			a number between [0.0, 1.0]
						 *
						 * @inheritdoc
						 * @name setVolume
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						setVolume: function(value){
							if(my_media){
								my_media.volume = value;
							}
						},
						/**
						 * Get the duration of the audio file
						 *
						 * @returns {Number} the duration in MS (or -1 if unknown)
						 *
						 * @inheritdoc
						 * @name getDuration
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						getDuration: function(){
							if(my_media && typeof my_media.duration === 'number'){
								return my_media.duration;
							}
							return -1;
						},
						/**
						 * Check if audio is currently paused.
						 *
						 * NOTE: "paused" is a different status than "stopped".
						 *
						 * @returns {Boolean} TRUE if paused, FALSE otherwise
						 *
						 * @inheritdoc
						 * @name isPaused
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						isPaused: function(){
							if(my_media){
								return playStatus === 3;
							}
							return false;
						},
						/**
						 * Check if audio is currently enabled
						 *
						 * @returns {Boolean} TRUE if enabled
						 *
						 * @inheritdoc
						 * @name isEnabled
						 * @memberOf mmir.env.media.AudioSpeechSynthesisImpl.prototype
						 */
						isEnabled: function(){
							return enabled;
						}
				};

				// set status to ready immediately:
				playStatus = 1;
				if (onCanPlay){
					// if onready callback is present, invoke asynchronously
					onReadyTimer = setTimeout(function(){
						onCanPlay.apply(mediaImpl, arguments);
					}, 10);
				}

				return mediaImpl;

			} catch (e){
				(failureCallback || console.error)(e);
			}
		};

		/**  @memberOf mmir.env.media.WebSpeechTTSImpl# */
		return {
			/**
			 * @public
			 * @memberOf mmir.env.media.WebSpeechTTSImpl.prototype
			 */
			getPluginName: function(){
				return _pluginName;
			},
			/**
			 * @public
			 * @memberOf mmir.env.media.WebSpeechTTSImpl.prototype
			 */
			getCreateAudioFunc: function(){
				return createAudio;
			},
			/**
			 * @public
			 * @memberOf mmir.env.media.WebSpeechTTSImpl.prototype
			 */
			getLanguageListFunc: function(){
				return getLanguageList;
			},
			/**
			 * @public
			 * @memberOf mmir.env.media.WebSpeechTTSImpl.prototype
			 */
			getVoiceListFunc: function(){
				return getVoiceList;
			},
			/**
			 * @public
			 * @memberOf mmir.env.media.WebSpeechTTSImpl.prototype
			 */
			setLangParamFunc: function(getLangParamFunc){
				_getLangParam = getLangParamFunc;
			},
			/**
			 * @public
			 * @memberOf mmir.env.media.WebSpeechTTSImpl.prototype
			 */
			setVoiceParamFunc: function(getVoiceParamFunc){
				_getVoiceParam = getVoiceParamFunc;
			}
		};//END: return { ...

	};//END: function createWebSpeechTTSImpl(){...

});
