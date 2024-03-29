
define(['mmirf/resources', 'mmirf/configurationManager', 'mmirf/commonUtils', 'mmirf/semanticInterpreter', 'mmirf/util/deferred', 'mmirf/util/loadFile', 'mmirf/logger', 'module'],

	/**
	 * A class for managing the language of the application. <br>
	 * It's purpose is to load the controllers and their views / partials and provide functions to find controllers or
	 * perform actions or helper-actions.
	 *
	 * This "class" is structured as a singleton - so that only one instance is in use.<br>
	 *
	 * @name LanguageManager
	 * @memberOf mmir
	 * @class
	 * @static
	 * @hideconstructor
	 *
	 *
	 * @requires mmir.Resources
	 * @requires mmir.CommonUtils
	 * @requires mmir.SemanticInterpreter
	 *
	 */
	function(
			res, configurationManager, commonUtils, semanticInterpreter, deferred, loadFile, Logger, module
){

	/**
	 * Object containing the instance of the class
	 * {@link LanguageManager}
	 *
	 * @type Object
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	var instance = null;

	/**
	 * @private
	 * @type mmir.tools.Logger
	 * @memberOf LanguageManager#
	 */
	var logger = Logger.create(module);

	/**
	 * @private
	 * @type LanguageManagerModuleConfig
	 * @memberOf LanguageManager#
	 */
	var _conf = module.config(module);

	/**
	 * JSON object containing the contents of a dictionary file - which are
	 * found in 'config/languages/&lt;language&gt;/dictionary.json'.
	 *
	 * @type JSON
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	var dictionary = null;

	/**
	 * A String holding the currently loaded language, e.g. "en".
	 *
	 * @type String
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	var currentLanguage = null;

	/**
	 * A JSON-Object holding the speech-configuration for the currently loaded language.
	 *
	 * @type JSON-Object
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	var currentSpeechConfig = null;

	/**
	 * An array of all available languages.
	 *
	 * @type Array
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	var languages = null;

	/**
	 * A keyword which can be used in views (ehtml) to display the current
	 * language.<br>
	 * If this keyword is used inside a view or partial, it is replaced by the
	 * current language string.
	 *
	 * @type String
	 * @private
	 * @example @localize('current_language')
	 *
	 * @memberOf LanguageManager#
	 */
	var keyword_current_language = 'current_language';

	/**
	 * Function to set a new language, but only if the new language is
	 * different from the current language.
	 *
	 * <p>
	 * Side Effects
	 * <ul>
	 *  <li>updates <code>"language"</code> setting in {@link mmir.ConfigurationManager}</li>
	 * </ul>
	 *
	 * @function
	 * @param {String} lang
	 *			the new language code
	 * @param {Boolean} [doNotLoadResources] OPTIONAL
	 *			 if omitted or TRUTHY will only change the current language, but will not try to load language resources
	 *			 (e.g. dictionary, speech configuration, and grammar).
	 *			 If <code>false</code> will force (re-)loading the language resources, even if <code>lang</code> is
	 *			 the same as the current language.
	 * @returns {String} The (new) current language
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	function doSetLanguage(lang, doNotLoadResources) {

		if (lang && (currentLanguage !== lang || doNotLoadResources === false)) {

			currentLanguage = lang;

			if(!doNotLoadResources){

				if(doCheckExistsDictionary(lang)){
					loadDictionary(lang);
				} else if(logger.isDebug()){
					logger.debug("setLanguage(): no dictionary for language " + lang);
					dictionary = {};
				}

				if(doCheckExistsSpeechConfig(lang)){
					loadSpeechConfig(lang);
				} else if(logger.isDebug()){//TODO set/generate default speech-config?
					logger.debug("setLanguage(): no speech-config (asr/tts) for language " + lang);
					currentSpeechConfig = {};
				}

				requestGrammar(lang);
			}

			configurationManager.set("language", currentLanguage);
		}

		return currentLanguage;
	}
	/**
	 * If a dictionary exists for the given language, true is
	 * returned. Else the method returns false.
	 *
	 * @function
	 * @param {String} lang the Language String, e.g. "en", "de"
	 * @returns {Boolean} True if a dictionary exists for given
	 *		  language.
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	function doCheckExistsDictionary (lang) {
		var langFiles = null;
		var retValue = false;

		if (lang != null) {
			langFiles = commonUtils.listDir(res.getLanguagePath() + lang);
			if (langFiles != null) {
				if (langFiles.indexOf(res.getDictionaryFileUrl()) > -1) {
					retValue = true;
				}
			}
		}
		return retValue;
	}

	/**
	 * If a speech-configuration (file) exists for the given language.
	 *
	 * @function
	 * @returns {Boolean}
	 * 				<code>true</code>if a speech-configuration exists for given language.
	 * 				Otherwise <code>false</code>.
	 *
	 * @param {String} lang
	 *			the language for which existence of the configuration should be checked, e.g. en, de
	 *
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	function doCheckExistsSpeechConfig(lang) {
		var langFiles = null;
		var retValue = false;

		if (lang != null) {
			langFiles = commonUtils.listDir(res.getLanguagePath() + lang);
			if (langFiles != null) {
				if (langFiles.indexOf(res.getSpeechConfigFileUrl()) > -1) {
					retValue = true;
				}
			}
		}
		return retValue;
	}

	/**
	 * Checks if either a JSON grammar file or a compiled grammar exists
	 * for the given language.
	 *
	 * @function
	 * @private
	 * @param {String} lang
	 *			Language String or grammar ID, e.g. "en", "de"
	 * @param {"source"|"bin"} [grammarType] OPTIONAL
	 *			only check grammar specifications ("source", i.e. JSON grammar),
	 *			or executable grammar ("bin", i.e. compiled grammar) existence
	 * @returns {Boolean} TRUE if a grammar exists for given language
	 * 										(and if grammarType was given, the existing grammar
	 * 										 must also match the given grammar type)
	 * @memberOf LanguageManager#
	 */
	function doCheckExistsGrammar(lang, grammarType) {
		var langFiles = null;
		var retValue = false;

		if (lang) {

			//check for existence of JSON grammar
			if(!grammarType || grammarType === 'source'){
				langFiles = commonUtils.listDir(res.getLanguagePath() + lang);
				if (langFiles) {
					if (langFiles.indexOf(res.getGrammarFileUrl()) > -1) {
						retValue = true;
					}
				}
			}

			//check for existence of compiled grammar
			if(!langFiles || !retValue && (!grammarType || grammarType === 'bin')){

				langFiles =	commonUtils.listDir(res.getGeneratedGrammarsPath().replace(/\/$/, ''));
				if(langFiles){
					var re = new RegExp(
										typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
												'^mmirf/grammar/'+lang+'\\.js$' :
												'^'+lang+'\\.js$',
										'i'
					);
					for(var i=langFiles.length - 1; i >= 0; --i){
						if(re.test(langFiles[i])){
							retValue = true;
							break;
						}
					}
				}

			}
		}
		return retValue;
	}

	/**
	 * Request grammar for the provided language.
	 *
	 * If there is no grammar available for the requested language, no new
	 * grammar is set.
	 *
	 * A grammar is available, if at least one of the following is true for the
	 * requested language
	 * <ul>
	 * <li>there exists a JSON grammar file (with correct name and at the
	 * 		correct location)</li>
	 * <li>there exists a compiled JavaScript grammar file (with correct name
	 * 		and at the correct location)</li>
	 * </ul>
	 *
	 * @function
	 * @param {String} lang The language of the grammar which should be loaded.
	 * @returns {String} The current grammar language
	 * @async
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	function requestGrammar(lang, doSetNextBestAlternative) {

		if (semanticInterpreter.hasGrammar(lang) || doCheckExistsGrammar(lang)) {
			semanticInterpreter.setCurrentGrammar(lang);
			return lang;
		}
		else if (doSetNextBestAlternative) {
			// try to find a language, for which a grammar is available
			var grammarLang = null;
			if (languages.length > 0) {
				// first: try to find a language with COMPILED grammar
				for ( var i = 0, size = languages.length; i < size; ++i) {
					grammarLang = languages[i];
					if (semanticInterpreter.hasGrammar(grammarLang)) {
						break;
					}
					else {
						grammarLang = null;
					}
				}

				// ... otherwise: try to find a language with JSON grammar:
				if (!grammarLang) {
					for ( var i = 0, size = languages.length; i < size; ++i) {
						grammarLang = languages[i];
						if (doCheckExistsGrammar(grammarLang)) {
							break;
						}
						else {
							grammarLang = null;
						}
					}
				}
			}

			if (grammarLang) {
				logger.warn('Could not find grammar for selected language ' + lang + ', using grammar for language ' + grammarLang + ' instead.');
				semanticInterpreter.setCurrentGrammar(grammarLang);
			}
			else {
				logger.info('Could not find any grammar for one of [' + languages.join(', ') + '], disabling SemanticInterpret.');
				semanticInterpreter.setEnabled(false);
			}
		}

		return semanticInterpreter.getCurrentGrammar();
	}

	/**
	 *
	 * @param  {"dictionary" | "speechConfig" | "grammar"} type the type of the resource
	 * @param  {String} lang the language code / ID
	 * @return {String} the resource ID for loading
	 */
	function getResourceUri(type, lang){
		if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
			// webpack ID: 'mmirf/settings/(dictionary|speechConfig|grammar)/<lang>'
			var id = 'mmirf/settings/'+type.replace(/Config$/, '')+'/'+lang;
			if(__webpack_modules__[id]){
				var mod = __webpack_require__(id);
				if(mod && mod.__esModule === true && typeof mod.default !== 'undefined'){
					mod = mod.default;
				}
				return mod;
			}
		}
		var funcName = 'get' + type[0].toUpperCase() + type.substring(1) + 'FileUrl';
		return res[funcName](lang);
	}

	/**
	 * Loads the speech-configuration for the specified language.
	 *
	 * @function
	 * @param {String} lang
	 *			The language of the speech-configuration which should be loaded.
	 * @returns {String} The current language
	 * @async
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	function loadSpeechConfig(lang) {

		if(_conf && _conf.speech && _conf.speech[lang]){
			if(logger.isVerbose()) logger.verbose("loadSpeechConfig(): loaded configuration from module.config().speech["+lang+"] -> ", _conf.speech[lang]);
			currentSpeechConfig = _conf.speech[lang];
			return;/////////// EARLY EXIT ///////////////
		}

		var path = getResourceUri('speechConfig', lang);
		loadFile({
			async : false,
			dataType : "json",
			url : path,
			success : function(data) {

				if(logger.isVerbose()) logger.v("loadSpeechConfig("+lang+"): success -> ", data);

				currentSpeechConfig = data;
			},
			error : function(_xhr, _statusStr, error) {
				logger.error("loadSpeechConfig("+lang+"): Error loading speech configuration from \""+path+"\": " + error? error.stack? error.stack : error : ''); // error
			}
		});
		return currentLanguage;
	}

	/**
	 * Loads the dictionary for the specified language.
	 *
	 * @function
	 * @param {String} lang The language of the dictionary which should be loaded.
	 * @returns {String} The current language
	 * @async
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	function loadDictionary(lang) {

		if(_conf && _conf.dictionary && _conf.dictionary[lang]){
			if(logger.isVerbose()) logger.verbose("loadDictionary(): loaded configuration from module.config().dictionary["+lang+"] -> ", _conf.dictionary[lang]);
			dictionary = _conf.dictionary[lang];
			return;/////////// EARLY EXIT ///////////////
		}

		var path = getResourceUri('dictionary', lang);
		loadFile({
			async : false,
			dataType : "json",
			url : path,
			success : function(data) {

				if(logger.isVerbose()) logger.v("loadDictionary("+lang+"): success -> ", data);

				dictionary = data;
			},
			error : function(_xhr, _statusStr, error) {
				logger.error("loadDictionary("+lang+"): Error loading language dictionary from \""+path+"\": " + error? error.stack? error.stack : error : ''); // error
			}
		});
		return currentLanguage;
	}
	/**
	 * Translates a keyword using the current dictionary and returns the
	 * translation.
	 *
	 * @function
	 * @param {String} textVarName The keyword which should be looked up
	 * @returns {String} the translation of the keyword
	 * @private
	 *
	 * @memberOf LanguageManager#
	 */
	function internalGetText(textVarName) {
		var translated = "";
		if (dictionary[textVarName] && dictionary[textVarName].length > 0) {
			translated = dictionary[textVarName];
		}
		else if (textVarName === keyword_current_language){
			translated = currentLanguage;
		}
		else {
			translated = "undefined";
			logger.warn("[Dictionary] '" + textVarName + "' not found in " + JSON.stringify(dictionary));
		}
		return translated;
	}

	/**
	 * Constructor-Method of Singleton mmir.LanguageManager.<br>
	 *
	 * @constructs LanguageManager
	 * @memberOf LanguageManager#
	 * @private
	 * @ignore
	 *
	 */
	function constructor() {

		var _isInitialized = false;

		/** @lends mmir.LanguageManager.prototype */
		return {

			/**
			 * @param {String} [lang] OPTIONAL
			 * 				a language code for setting the current language and
			 * 				selecting the corresponding language resources
			 *
			 * @returns {Promise}
			 * 				a deferred promise that gets resolved when the language manager is initialized
			 *
			 * @memberOf mmir.LanguageManager.prototype
			 */
			init: function(lang){

				if (!lang && !currentLanguage) {

					//try to retrieve language from configuration:
					var appLang = configurationManager.get("language");
					if (appLang) {

						lang = appLang;
						logger.info("init(): No language argument specified: using language from configuration '" + appLang + "'.");

					}
					else {

						appLang = res.getLanguage();

						if (appLang) {

							lang = appLang;
							logger.info("init(): No language argument specified: using language from mmir.res '" + appLang + "'.");
						}
						else {

							if (languages.length > 0) {

								appLang = this.determineLanguage(lang);
								if(appLang){

									lang = appLang;

									logger.info("init() No language argument specified: used determinLanguage() for selecting language '" + appLang + "'.");
								}
							}

						}//END: else(consts::lang)

					}//END: else(config::lang)

					if(!lang){
						logger.warn("init(): No language specified. And no language could be read from directory '" + res.getLanguagePath() + "'.");
					}

				}//END: if(!lang && !currentLanguage)

				currentLanguage = lang;

				configurationManager.set("language", currentLanguage);
				configurationManager.on("language", function(val){
					if(val !== currentLanguage){
						var lang = val || res.getLanguage();
						currentLanguage = lang;
					}
				});

				// get all the languages/dictionaries by name
				languages = commonUtils.listDir(res.getLanguagePath()) || [];

				if (logger.isDebug()) logger.debug("init() Found dictionaries for: " + JSON.stringify(languages));

				var defer = deferred();

				if(this.existsDictionary(lang)){
					loadDictionary(lang);
				} else if(logger.isDebug()){
					logger.debug("init(): no dictionary for language " + lang);
				}

				if(this.existsSpeechConfig(lang)){
					loadSpeechConfig(lang);
				} else if(logger.isDebug()){//TODO set/generate default speech-config?
					logger.debug("init(): no speech-config (asr/tts) for language " + lang);
				}

				//DISABLED semanticInterpreter may not be initialized yet / grammars loaded yet -> do this in main-initialization (see main.js)
				// requestGrammar(lang, true);//2nd argument TRUE: if no grammar is available for lang, try to find/set any available grammar

				_isInitialized = true;
				defer.resolve(this);

				return defer;
			},

			/**
			 * Returns the dictionary of the currently used language.
			 *
			 * @function
			 * @returns {Object} The JSON object for the dictionary of the
			 *		  currently used language
			 * @public
			 *
			 * @memberOf mmir.LanguageManager.prototype
			 */
			getDictionary : function() {
				return dictionary;
			},

			/**
			 *
			 * @copydoc LanguageManager#doCheckExistsDictionary
				 * @function
			 * @public
			 * @memberOf mmir.LanguageManager.prototype
			 */
			existsDictionary : doCheckExistsDictionary,

			/**
			 * Returns the speech configuration (for ASR/TTS) of the currently used language.
			 *
			 * @function
			 * @returns {Object} The JSON object for the speech-configuration of the
			 *		  currently used language
			 * @public
			 *
			 * @memberOf mmir.LanguageManager.prototype
			 */
			getSpeechConfig : function() {
				return currentSpeechConfig;
			},

			/**
			 * @copydoc LanguageManager#doCheckExistsSpeechConfig
			 * @function
			 * @public
			 * @memberOf mmir.LanguageManager.prototype
			 */
			existsSpeechConfig : doCheckExistsSpeechConfig,

			/**
				 * @copydoc LanguageManager#doCheckExistsGrammar
				 * @function
			 * @public
			 * @memberOf mmir.LanguageManager.prototype
			 */
			existsGrammar : doCheckExistsGrammar,
			/**
			 * @copydoc LanguageManager#requestGrammar
				 * @function
			 * @protected
			 * @memberOf mmir.LanguageManager.prototype
			 */
			_requestGrammar : requestGrammar,

			/**
			 * Chooses a language for the application.
			 *
			 * <p>
			 * The language selection is done as follows:
			 * <ol>
			 * <li>check if a default language exists<br>
			 * if it does and if both (!) grammar and dictionary exist for this
			 * language, return this language </li>
			 * <li>walk through all languages alphabetically
			 * <ol>
			 * <li>if for a language both (!) grammar and dictionary exist,
			 * return this language memorize the first language with a grammar
			 * (do not care, if a dictionary exists) </li>
			 * </ol>
			 * <li>test if a grammar exists for the default language - do not
			 * care about dictionaries - if it does, return the default language
			 * </li>
			 * <li>If a language was found (in Step 2.1) return this language
			 * </li>
			 * <li>If still no language is returned take the default language
			 * if it has a dictionary </li>
			 * <li>If a language exists, take it (the first one) </li>
			 * <li>Take the default language - no matter what </li>
			 * </ol>
			 *
			 * @function
			 * @returns {String} The determined language
			 * @public
			 *
			 * @memberOf mmir.LanguageManager.prototype
			 */
			determineLanguage : function(lang) {
				var tempLanguage = lang;
				var firstLanguageWithGrammar = null;

				// first check, if language - given in parameter - exists
				if (tempLanguage != null) {
					// check if both grammar and dictionary exist for given
					// language
					if (instance.existsGrammar(tempLanguage) && instance.existsDictionary(tempLanguage)) {
						return tempLanguage;
					}
				}

				tempLanguage = res.getLanguage();
				// then check, if default language exists
				if (tempLanguage != null) {
					// check if both grammar and dictionary exist for default
					// language
					if (instance.existsGrammar(tempLanguage) && instance.existsDictionary(tempLanguage)) {
						return tempLanguage;
					}
				}
				// walk through the languages alphabetically
				for ( var i = 0; i < languages.length; i++) {
					tempLanguage = languages[i];
					// check if a grammar and dictionary exists for every
					// language
					if (instance.existsGrammar(tempLanguage)) {

						// memorize the first language with a grammar (for
						// later)
						if (firstLanguageWithGrammar == null) {
							firstLanguageWithGrammar = tempLanguage;
						}

						if (instance.existsDictionary(tempLanguage)) {
							return tempLanguage;
						}
					}
				}

				// still no language found - take the default language and test
				// if a grammar exists
				tempLanguage = res.getLanguage();
				if (tempLanguage != null) {
					// check if both grammar and dictionary exist for default
					// language
					if (instance.existsGrammar(tempLanguage)) {
						return tempLanguage;
					} else if (firstLanguageWithGrammar != null) {
						return firstLanguageWithGrammar;
					} else if (instance.existsDictionary(tempLanguage)) {
						return tempLanguage;
					}
				}

				// still no language - take the first one
				tempLanguage = languages[0];
				if (tempLanguage != null) {
					return tempLanguage;
				}

				return res.getLanguage();
			},

			/**
			 * @copydoc LanguageManager#doSetLanguage
			 * @function
			 * @public
			 * @memberOf mmir.LanguageManager.prototype
			 */
			setLanguage : doSetLanguage,

			/**
			 * Gets the language currently used for the translation.
			 *
			 * @function
			 * @returns {String} The current language
			 * @public
			 *
			 * @memberOf mmir.LanguageManager.prototype
			 */
			getLanguage : function() {
				return currentLanguage;
			},

			/**
			 * Gets the default language.
			 *
			 * @function
			 * @returns {String} The default language
			 * @public
			 *
			 * @memberOf mmir.LanguageManager.prototype
			 */
			getDefaultLanguage : function() {
				return res.getLanguage();
			},

			/**
			 * Gets an array of all for the translation available languages.<br>
			 *
			 * @function
			 * @returns {String} An array of all for the translation available
			 *		  languages
			 * @public
			 *
			 * @memberOf mmir.LanguageManager.prototype
			 */
			getLanguages : function() {
				return languages;
			},

			/**
			 * @copydoc LanguageManager#internalGetText
			 * @function
			 * @public
			 * @memberOf mmir.LanguageManager.prototype
			 */
			getText : internalGetText,

			/**
			 * Get the language code setting for a specific plugin.
			 *
			 * Returns the default setting, if no specific setting for the specified plugin was defined.
			 *
			 * @public
			 * @param {String} pluginId
			 * @param {String|Array<String>} [feature] OPTIONAL
			 * 				dot-separate path String or "path Array"
			 * 				This parameter may be omitted, if no <code>separator</code> parameter
			 * 				is used.
			 * 				DEFAULT: "language" (the language feature)
			 * @param {String} [separator] OPTIONAL
			 * 				the speparator-string that should be used for separating
			 * 				the country-part and the language-part of the code
			 * @returns {String} the language-setting/-code
			 *
			 * @memberOf mmir.LanguageManager.prototype
			 */
			getLanguageConfig : function(pluginId, feature, separator) {

				if(!currentSpeechConfig){
					if(logger.isWarn()) logger.warn('no speech configuration ('+res.getSpeechConfigFileUrl()+') available for '+currentLanguage);
					if(!feature || feature === 'language' || feature === 'long'){
						return currentLanguage;
					}
					return void(0);
				}

				//if nothing is specfied:
				//	return default language-setting
				if(typeof pluginId === 'undefined'){
					return currentSpeechConfig.language; /////////// EARLY EXIT ///////////////
				}

				//ASSERT pluginId is defined

				//default feature is language
				if(typeof feature === 'undefined'){
					feature = 'language';
				}

				var value;
				if(currentSpeechConfig.plugins && currentSpeechConfig.plugins[pluginId] && typeof currentSpeechConfig.plugins[pluginId][feature] !== 'undefined'){
					//if there is a plugin-specific setting for this feature
					value = currentSpeechConfig.plugins[pluginId][feature];
				}
				else if(feature !== 'plugins' && typeof currentSpeechConfig[feature] !== 'undefined'){
					//otherwise take the default setting (NOTE: the name "plugins" is not allowed for features!)
					value = currentSpeechConfig[feature];
				}

				//fallback: if long language code was requested but neither plugin nor global long feature is available -> try to return language
				if(typeof value === 'undefined'){
					if(feature === 'long'){
						return this.getLanguageConfig(pluginId, 'language', separator);
					} else if(feature === 'language'){
						//fallback: if field "language" is not defined, return 2-letter language code
						if(logger.isWarn()) logger.warn('current speech configuration has no field "language" specified, using current language code instead: '+currentLanguage);
						return currentLanguage;
					}
				}

				//if there is a separator specified: replace default separator '-' with this one
				if(value && typeof separator !== 'undefined'){
					value = value.replace(/-/, separator);
				}

				return value;
			},

			/**
			 * HELPER for dealing with specific language / country code quirks of speech services:
			 * Get the language code for a specific ASR or TTS service, that is if the service requires some
			 * specific codes/transformations, then the transformed code is retruned by this function
			 * (otherwise the unchanged langCode is returned).
			 *
			 * @public
			 * @param {String} providerName
			 * 					corrections for: "nuance" | "mary"
			 * @param {String} langCode
			 * 					the original language / country code
			 * @returns {String} the (possibly "fixed") language-setting/-code
			 *
			 * @memberOf mmir.LanguageManager.prototype
			 */
			fixLang : function(providerName, langCode) {

				if(!langCode){
					return langCode;
				}

				if(providerName === 'nuance'){

					//QUIRK nuanceasr short-language code for the UK is UK instead of GB:
					//  replace en-GB with en-UK if necessary (preserving separator char)
					langCode = langCode.replace(/en(.)GB/i, 'en$1UK');

				} else if(providerName === 'mary'){

					//QUIRK marytts does not accept language+country code for German:
					//  must only be language code
					if(/de.DE/i.test(langCode)){
						langCode = 'de';
					}
				} else if(providerName === 'google' && langCode && langCode.length === 7){

					//convert 3-letter codes to 2-letter codes for Google services
					var m = /(\w\w)\w.(\w\w)\w/.exec(langCode);
					if(m){
						langCode = m[1] + '-' + m[2];
					}
				}

				return langCode;
			}

		};//END: return{}


	}//END: construcor = function(){...


	//FIXME as of now, the LanguageManager needs to be initialized,
	//		by calling init()
	//		-> should this be done explicitly (async-loading for dictionary and grammar? with returned Deferred?)
	instance = new constructor();

	return instance;

});
