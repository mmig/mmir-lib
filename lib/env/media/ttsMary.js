
/**
 * Media Module: Implementation for Text-To-Speech via MARY TTS
 *
 * @requires CSP for accessing the MARY TTS server, e.g. for default server URL "media-src http://mary.dfki.de:59125/" or "default-src http://mary.dfki.de:59125/"
 *           NOTE if you have configured a different server URL, then that one needs to be enabled via CSP
 *
 * @class MaryWebAudioTTSImpl
 * @memberOf mmir.env.media
 *
 */

define(['mmirf/mediaManager', 'mmirf/configurationManager', 'mmirf/languageManager', 'mmirf/util/loadFile'], function(mediaManager, config, lang, load){

	/**
	 * @readonly
	 * @inner
	 * @default "ttsMary"
	 * @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 */
	var _pluginName = 'ttsMary';

	/**
	 * @readonly
	 * @inner
	 * @default "http://mary.dfki.de:59125/"
	 * @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 */
	var _defaultServerPath = 'http://mary.dfki.de:59125/';

	/**
	 * separator char for language- / country-code (specific to TTS service)
	 *
	 * @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @private
	 */
	var _langSeparator = void(0);

	/** @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @private
	 */
	var _getLangParam;
	/** @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @private
	 */
	var _getVoiceParam;

	/**
	 * HELPER retrieve language setting and apply impl. specific corrections/adjustments
	 * (i.e. deal with MARY specific quirks for language/country codes)
	 *
	 * @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @private
	 */
	var _getFixedLang = function(options){

		var locale = _getLangParam(options, _langSeparator);

		return lang.fixLang('mary', locale);
	};

	/**
	 * HELPER parse raw voice information
	 * @param {String} str the raw line decribing the voice (as returned from service)
	 * @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @private
	 */
	var _toVoiceDetails = function(str){

		var infos = str? str.trim().split(/\s/) : [];
		return {
			name: infos[0],
			language: infos[1],
			gender: /^(fe)?male$/i.test(infos[2])? infos[2].toLowerCase() : 'unknown'
		}
	};

	/**
	 * HELPER create filter-function for voice depending on language and/or gender
	 * @param {VoiceOptions} options for listing voices:
	 * 				options.language: the language code (may include country code)
	 * @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @private
	 */
	var _createVoiceFilter = function(options){

		var reLang;
		if(options.language){
			var parts = options.language.split(/[-_]/);
			var reStr = '^'+parts[0];
			if(parts[1]){
				reStr += '[-_]'+parts[1]+'$';
			}
			reLang = new RegExp(reStr, 'i');
		} else {
			reLang = null;
		}

		return function(voice){
			return reLang.test(voice.language);
		}
	};

	/**  @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @private
	 */
	var generateTTSURL = function(text, options){

		text = encodeURIComponent(text);

		var lang = _getFixedLang(options);

		var voice = _getVoiceParam(options);
		var voiceParamStr = voice? '&VOICE='+voice : '';

		return config.get([_pluginName, "baseUrl"], _defaultServerPath) +'process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=' + text + '&LOCALE='+lang + voiceParamStr + '&AUDIO=WAVE_FILE';
	};

	/**  @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @private
	 */
	var createAudio = function(sentence, options, onend, onerror, oninit){

		return mediaManager.getURLAsAudio(
				generateTTSURL(sentence, options),
				onend, onerror, oninit
		);

	};

	/** @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @requires CrossDomain and CSP: allow access to baseUrl (default: "http://mary.dfki.de:59125/")
	 * @private
	 */
	var getList = function(type, callback, onerror){

		var url = config.get([_pluginName, "baseUrl"], _defaultServerPath) + (type === 'voice'? 'voices' : 'locales');
		load({
			url: url,
			dataType: 'text',
			success: function(data){
				// console.log(data)
				callback && callback(data? data.trim().split(/\r?\n/) : []);
			},
			error: onerror
		});
	};

	/** @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @requires CrossDomain and CSP: allow access to baseUrl (default: "http://mary.dfki.de:59125/")
	 * @see mmir.MediaManager#getSpeechLanguages
	 * @private
	 */
	var getLanguageList = function(callback, onerror){

		getList('language', callback, onerror);
	};


	/** @memberOf mmir.env.media.MaryWebAudioTTSImpl#
	 * @requires CrossDomain and CSP: allow access to baseUrl (default: "http://mary.dfki.de:59125/")
	 * @see mmir.MediaManager#getVoices
	 * @private
	 */
	var getVoiceList = function(options, callback, onerror){

		getList('voice', function(list){
			var voices = list.map(function(raw){ return _toVoiceDetails(raw);});
			var isFilter = options && options.language;
			var filteredList = !isFilter? voices : voices.filter(_createVoiceFilter(options));
			var isDetails = options && options.details;
			callback && callback(isDetails? filteredList : filteredList.map(function(v){ return v.name;}));
		}, onerror);
	};

	/**  @memberOf mmir.env.media.MaryWebAudioTTSImpl# */
	return {
		/**
		 * @public
		 * @memberOf mmir.env.media.MaryWebAudioTTSImpl.prototype
		 */
		getPluginName: function(){
			return _pluginName;
		},
		/**
		 * @public
		 * @memberOf mmir.env.media.MaryWebAudioTTSImpl.prototype
		 */
		getCreateAudioFunc: function(){
			return createAudio;
		},
		/**
		 * @public
		 * @memberOf mmir.env.media.MaryWebAudioTTSImpl.prototype
		 */
		getLanguageListFunc: function(){
			return getLanguageList;
		},
		/**
		 * @public
		 * @memberOf mmir.env.media.MaryWebAudioTTSImpl.prototype
		 */
		getVoiceListFunc: function(){
			return getVoiceList;
		},
		/**
		 * @public
		 * @memberOf mmir.env.media.MaryWebAudioTTSImpl.prototype
		 */
		setLangParamFunc: function(getLangParamFunc){
			_getLangParam = getLangParamFunc;
		},
		/**
		 * @public
		 * @memberOf mmir.env.media.MaryWebAudioTTSImpl.prototype
		 */
		setVoiceParamFunc: function(getVoiceParamFunc){
			_getVoiceParam = getVoiceParamFunc;
		}
	};//END: return { ...

});
