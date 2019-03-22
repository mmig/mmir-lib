
/**
 * Media Module: Implementation for Text-To-Speech via MARY TTS
 *
 * @requires CSP for accessing the MARY TTS server, e.g. for default server URL "media-src http://mary.dfki.de:59125/" or "default-src http://mary.dfki.de:59125/"
 *           NOTE if you have configured a different server URL, then that one needs to be enabled via CSP
 *
 */

define(['mmirf/mediaManager', 'mmirf/configurationManager', 'mmirf/languageManager'], function(mediaManager, config, lang){

	/**  @memberOf MaryWebAudioTTSImpl# */
	var _pluginName = 'ttsMary';

	/**  @memberOf MaryWebAudioTTSImpl# */
	var _defaultServerPath = 'http://mary.dfki.de:59125/';

	/**
	 * separator char for language- / country-code (specific to TTS service)
	 *
	 * @memberOf MaryWebAudioTTSImpl#
	 */
	var _langSeparator = void(0);

	/** @memberOf MaryWebAudioTTSImpl# */
	var _getLangParam;
	/** @memberOf MaryWebAudioTTSImpl# */
	var _getVoiceParam;

	/**
	 * HELPER retrieve language setting and apply impl. specific corrections/adjustments
	 * (i.e. deal with MARY specific quirks for language/country codes)
	 *
	 * @memberOf MaryWebAudioTTSImpl#
	 */
	var _getFixedLang = function(options){

		var locale = _getLangParam(options, _langSeparator);

		return lang.fixLang('mary', locale);
	};

	/**  @memberOf MaryWebAudioTTSImpl# */
	var generateTTSURL = function(text, options){

		text = encodeURIComponent(text);

		var lang = _getFixedLang(options);

		var voice = _getVoiceParam(options);
		var voiceParamStr = voice? '&VOICE='+voice : '';

		return config.get([_pluginName, "baseUrl"], _defaultServerPath) +'process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=' + text + '&LOCALE='+lang + voiceParamStr + '&AUDIO=WAVE_FILE';
	};

	/**  @memberOf MaryWebAudioTTSImpl# */
	var createAudio = function(sentence, options, onend, onerror, oninit){

		return mediaManager.getURLAsAudio(
				generateTTSURL(sentence, options),
				onend, onerror, oninit
		);

	};

	/**  @memberOf MaryWebAudioTTSImpl# */
	return {
		/**
		 * @public
		 * @memberOf MaryWebAudioTTSImpl.prototype
		 */
		getPluginName: function(){
			return _pluginName;
		},
		/**
		 * @public
		 * @memberOf MaryWebAudioTTSImpl.prototype
		 */
		getCreateAudioFunc: function(){
			return createAudio;
		},
		/**
		 * @public
		 * @memberOf MaryWebAudioTTSImpl.prototype
		 */
		setLangParamFunc: function(getLangParamFunc){
			_getLangParam = getLangParamFunc;
		},
		/**
		 * @public
		 * @memberOf MaryWebAudioTTSImpl.prototype
		 */
		setVoiceParamFunc: function(getVoiceParamFunc){
			_getVoiceParam = getVoiceParamFunc;
		}
	};//END: return { ...

});
