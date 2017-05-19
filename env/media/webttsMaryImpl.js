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

/**
 * Media Module: Implementation for Text-To-Speech via MARY TTS
 * 
 * @requires CSP for accessing the MARY TTS server, e.g. for default server URL "media-src http://mary.dfki.de:59125/" or "default-src http://mary.dfki.de:59125/"
 *           NOTE if you have configured a different server URL, then that one needs to be enabled via CSP
 * 
 */
newWebAudioTtsImpl = (function MaryWebAudioTTSImpl(){
			
		/**  @memberOf MaryWebAudioTTSImpl# */
		var _pluginName = 'maryTextToSpeech';
		
		/** 
		 * legacy mode: use pre-v4 API of mmir-lib
		 * @memberOf WebspeechAudioInput#
		 */
		var _isLegacyMode = true;
		/** 
		 * Reference to the mmir-lib core (only available in non-legacy mode)
		 * @type mmir
		 * @memberOf MaryWebAudioTTSImpl#
		 */
		var _mmir = null;
		
		//get mmir-lib core from global namespace:
		_mmir = window[typeof MMIR_CORE_NAME === 'string'? MMIR_CORE_NAME : 'mmir'];
		if(_mmir){
			// set legacy-mode if version is < v4
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
		 * @memberOf MaryWebAudioTTSImpl#
		 */
		var _req = function(id){
			var name = (_isLegacyMode? '' : 'mmirf/') + id;
			return _mmir? _mmir.require(name) : require(name);
		};

		/**  @memberOf MaryWebAudioTTSImpl# */
		var _defaultServerPath = 'http://mary.dfki.de:59125/';
		
		/** 
		 * @type mmir.ConfigurationManager
		 * @memberOf MaryWebAudioTTSImpl#
		 */
		var _configurationManager = _req('configurationManager');

		/** 
		 * @type mmir.LanguageManager
		 * @memberOf MaryWebAudioTTSImpl#
		 */
		var _langManager = _req('languageManager');
		
		/** 
		 * @type mmir.MediaManager
		 * @memberOf MaryWebAudioTTSImpl#
		 */
		var _mediaManager = _req('mediaManager');
		
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
			
			var lang = _getLangParam(options, _langSeparator);
			
			return _langManager.fixLang('mary', lang);
		};
		
		/**  @memberOf MaryWebAudioTTSImpl# */
		var generateTTSURL = function(text, options){
			
			text = encodeURIComponent(text);
			
			var lang = _getFixedLang(options);
			
			var voice = _getVoiceParam(options);
			var voiceParamStr = voice? '&VOICE='+voice : '';
			
			return _configurationManager.get([_pluginName, "serverBasePath"], true, _defaultServerPath) +'process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=' + text + '&LOCALE='+lang + voiceParamStr + '&AUDIO=WAVE_FILE';
		};
		
		/**  @memberOf MaryWebAudioTTSImpl# */
		var createAudio = function(sentence, options, onend, onerror, oninit){
			
			return _mediaManager.getURLAsAudio(
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
})();
