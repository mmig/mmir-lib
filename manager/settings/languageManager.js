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


define(['mmirf/constants', 'mmirf/configurationManager', 'mmirf/commonUtils', 'mmirf/semanticInterpreter', 'mmirf/util/deferred', 'mmirf/util/loadFile', 'mmirf/logger', 'module'],
		
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
	 * 
	 * 
	 * @requires mmir.Constants
	 * @requires mmir.CommonUtils
	 * @requires mmir.SemanticInterpreter
	 * 
	 */
	function( 
			constants, configurationManager, commonUtils, semanticInterpreter, deferred, loadFile, Logger, module
){
			//the next comment enables JSDoc2 to map all functions etc. to the correct class description
			/** @scope mmir.LanguageManager.prototype */
			
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
		     * @type Logger
		     * @memberOf LanguageManager#
		     */
		    var logger = Logger.create(module);

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
		     * Function to set a new language, but only, if the new language is
		     * different from the current language.
		     * 
		     * @function
		     * @param {String}
		     *            lang The language of the dictionary which should be loaded.
		     * @returns {String} The (new) current language
		     * @private
		     * 
		     * @memberOf LanguageManager#
		     */
		    function setLanguage(lang) {
		        if ((lang) && (currentLanguage != lang)) {
		            loadDictionary(lang);
		            loadSpeechConfig(lang);
		            requestGrammar(lang);
		        }
		        return currentLanguage;
		    }

		    /**
		     * @function
		     * @memberOf LanguageManager#
		     */
		    function doCheckExistsGrammar(lang) {
		        var langFiles = null;
		        var retValue = false;

		        if (lang != null) {
		            langFiles = commonUtils.listDir(constants.getLanguagePath() + lang);
		            if (langFiles != null) {
		                if (langFiles.indexOf(constants.getGrammarFileName()) > -1) {
		                    retValue = true;
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
		     * TODO document location for JSON and JavaScript grammar files
		     * 
		     * @function
		     * @param {String}
		     *            lang The language of the grammar which should be loaded.
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
		                logger.warn('Could not find any grammar for one of [' + languages.join(', ') + '], disabling SemanticInterpret.');
		                semanticInterpreter.setEnabled(false);
		            }
		        }

		        return semanticInterpreter.getCurrentGrammar();
		    }
		    /**
		     * Loads the speech-configuration for the provided language and updates the current
		     * language.
		     * 
		     * @function
		     * @param {String} lang
		     *            The language of the speech-configuration which should be loaded.
		     * @returns {String} The (new) current language
		     * @async
		     * @private
		     * 
		     * @memberOf LanguageManager#
		     */
		    function loadSpeechConfig(lang) {

		        if (lang && currentLanguage != lang) {
		            currentLanguage = lang;
		        }
		        var path = constants.getLanguagePath() + lang + "/" + constants.getSpeechConfigFileName();
		        loadFile({
		            async : false,
		            dataType : "json",
		            url : path,
		            success : function(data) {
		                
		            	if(logger.isVerbose()) logger.v("[LanguageManager] Success. " + data);
		                
		            	currentSpeechConfig = data;
		                
		                if(logger.isVerbose()) logger.v("[LanguageManager] " + JSON.stringify(dictionary));
		            },
		            error : function(xhr, statusStr, error) {
		                logger.error("[LanguageManager] Error loading speech configuration from \""+path+"\": " + error? error.stack? error.stack : error : ''); // error
		            }
		        });
		        return currentLanguage;
		    }

		    /**
		     * Loads the dictionary for the provided language and updates the current
		     * language.
		     * 
		     * @function
		     * @param {String}
		     *            lang The language of the dictionary which should be loaded.
		     * @returns {String} The (new) current language
		     * @async
		     * @private
		     * 
		     * @memberOf LanguageManager#
		     */
		    function loadDictionary(lang) {

		        if (lang && currentLanguage != lang) {
		            currentLanguage = lang;
		        }
		        var path = constants.getLanguagePath() + lang + "/" + constants.getDictionaryFileName();
		        loadFile({
		            async : false,
		            dataType : "json",
		            url : path,
		            success : function(data) {
		                dictionary = data;
		            },
		            error : function(xhr, statusStr, error) {
		                logger.error("[LanguageManager] Error loading language dictionary from \""+path+"\": " + error? error.stack? error.stack : error : ''); // error
		            }
		        });
		        return currentLanguage;
		    }
		    /**
		     * Translates a keyword using the current dictionary and returns the
		     * translation.
		     * 
		     * @function
		     * @param {String}
		     *            textVarName The keyword which should be looked up
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
		        
		        /** @lends LanguageManager.prototype */
		        return {
		        	
		        	/**
		        	 * @param {String} [lang] OPTIONAL
		        	 * 				a language code for setting the current language and
		        	 * 				selecting the corresponding language resources
		        	 * 
		        	 * @returns {Promise}
		        	 * 				a deferred promise that gets resolved when the language manager is initialized
		        	 * 
		        	 * @memberOf LanguageManager.prototype
		        	 */
		        	init: function(lang){
		        		
		        		if (!lang && !currentLanguage) {

		        			//try to retrieve language from configuration:
				            var appLang = configurationManager.get("language");
				            if (appLang) {
				            	
				                lang = appLang;
				                logger.info("[LanguageManager] No language argument specified: using language from configuration '" + appLang + "'.");
				                
				            }
				            else {
				            	
					            appLang = constants.getLanguage();
					            
				            	if (appLang) {
				            
					                lang = appLang;
					                logger.info("[LanguageManager] No language argument specified: using language from mmir.constants '" + appLang + "'.");
					            }
				            	else {
					            	
					                if (languages.length > 0) {
					                	
					                	appLang = this.determineLanguage(lang);
					                	if(appLang){
					                		
					                		lang = appLang;
					                		
					                		logger.info("[LanguageManager] No language argument specified: used determinLanguage() for selecting language '" + appLang + "'.");
					                	}
					                }
					                
					            }//END: else(consts::lang)
				            	
				            }//END: else(config::lang)
				        
			        		if(!lang){
			        			logger.warn("[LanguageManager.init] No language specified. And no language could be read from directory '" + constants.getLanguagePath() + "'.");
			        		}
			        		
				        }//END: if(!lang && !currentLanguage)
		        		

				        // get all the languages/dictionaries by name
				        languages = commonUtils.listDir(constants.getLanguagePath());

				        if (logger.isDebug()) logger.debug("[LanguageManager] Found dictionaries for: " + JSON.stringify(languages));// debug

				        var defer = deferred();
				        
				        loadDictionary(lang);   
				        loadSpeechConfig(lang);
				        requestGrammar(lang, true);//2nd argument TRUE: if no grammar is available for lang, try to find/set any available grammar
				        
				        _isInitialized = true;
				        defer.resolve(this);
				        
				        return defer;
		        	},
		        	
		            /**
		             * Returns the dictionary of the currently used language.
		             * 
		             * @function
		             * @returns {Object} The JSON object for the dictionary of the
		             *          currently used language
		             * @public
		             */
		            getDictionary : function() {
		                return dictionary;
		            },

		            /**
		             * If a dictionary exists for the given language, 'true' is
		             * returned. Else the method returns 'false'.
		             * 
		             * @function
		             * @returns {Boolean} True if a dictionary exists for given
		             *          language.
		             * @param {String}
		             *            Language String, i.e.: en, de
		             * @public
		             */
		            existsDictionary : function(lang) {
		                var langFiles = null;
		                var retValue = false;

		                if (lang != null) {
		                    langFiles = commonUtils.listDir(constants.getLanguagePath() + lang);
		                    if (langFiles != null) {
		                        if (langFiles.indexOf(constants.getDictionaryFileName()) > -1) {
		                            retValue = true;
		                        }
		                    }
		                }
		                return retValue;
		            },

		            /**
		             * If a speech-configuration (file) exists for the given language.
		             * 
		             * @function
		             * @returns {Boolean}
		             * 				<code>true</code>if a speech-configuration exists for given language.
		             * 				Otherwise <code>false</code>.
		             * 
		             * @param {String} lang
		             *            the language for which existence of the configuration should be checked, e.g. en, de
		             *            
		             * @public
		             */
		            existsSpeechConfig : function(lang) {
		                var langFiles = null;
		                var retValue = false;

		                if (lang != null) {
		                    langFiles = commonUtils.listDir(constants.getLanguagePath() + lang);
		                    if (langFiles != null) {
		                        if (langFiles.indexOf(constants.getSpeechConfigFileName()) > -1) {
		                            retValue = true;
		                        }
		                    }
		                }
		                return retValue;
		            },

		            /**
		             * If a JSON grammar file exists for the given language, 'true' is
		             * returned. Else the method returns 'false'.
		             * 
		             * @function
		             * @returns {Boolean} True if a grammar exists for given language.
		             * @param {String}
		             *            Language String, i.e.: en, de
		             * @public
		             */
		            existsGrammar : doCheckExistsGrammar,

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

		                tempLanguage = constants.getLanguage();
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
		                tempLanguage = constants.getLanguage();
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

		                return constants.getLanguage();
		            },

		            /**
		             * Sets a new language, but only, if the new language is different
		             * from the current language.
		             * 
		             * @function
		             * @returns {String} The (new) current language
		             * @public
		             */
		            setLanguage : function(lang) {
		                return setLanguage(lang);
		            },

		            /**
		             * Gets the language currently used for the translation.
		             * 
		             * @function
		             * @returns {String} The current language
		             * @public
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
		             */
		            getDefaultLanguage : function() {
		                return constants.getLanguage();
		            },

		            /**
		             * Gets an array of all for the translation available languages.<br>
		             * 
		             * @function
		             * @returns {String} An array of all for the translation available
		             *          languages
		             * @public
		             */
		            getLanguages : function() {
		                return languages;
		            },

		            /**
		             * Cycles through the available languages.
		             * 
		             * @function
		             * @returns {String} The (new) current language
		             * @public
		             * @deprecated unused
		             */
		            setNextLanguage : function() {
		                var indexCurrentLanguage = languages.indexOf(currentLanguage);

		                if (logger.isVerbose()) logger.v("[LanguageManager] Current language is " + currentLanguage);

		                if (indexCurrentLanguage > -1) {
		                    indexCurrentLanguage = indexCurrentLanguage + 1;
		                    if (indexCurrentLanguage > languages.length - 1) {
		                        indexCurrentLanguage = 0;
		                    }
		                    currentLanguage = languages[indexCurrentLanguage];

		                    if (logger.isVerbose()) logger.v("[LanguageManager] Next language is " + currentLanguage);
		                    
		                    loadSpeechConfig(currentLanguage);
		                    return loadDictionary(currentLanguage);
		                }
		                return currentLanguage;
		            },

		            /**
		             * Looks up a keyword in the current dictionary and returns the
		             * translation.
		             * 
		             * @function
		             * @param {String}
		             *            textVarName The keyword which is to be translated
		             * @returns {String} The translation of the keyword
		             * @public
		             */
		            getText : function(textVarName) {
		                return internalGetText(textVarName);
		            },
		            
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
		             */
		            getLanguageConfig : function(pluginId, feature, separator) {
		                
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
		             */
		            fixLang : function(providerName, langCode) {
		            	
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
		            	}
		            	
		            	return langCode;
		            }
		            
		            /**
		             * Set to "backwards compatibility mode" (for pre version 2.0).
		             * 
		             * This function re-adds deprecated and removed functions and
		             * properties to the CommonUtils instance.
		             * 
		             * NOTE that once set to compatibility mode, it cannot be reset to
		             * non-compatibility mode.
		             * 
		             * NOTE: Requires jQuery to be present.
		             * 
		             * @deprecated use only for backwards compatibility
		             * 
		             * @public
		             * @async
				     * @requires jQuery
				     * @requires mmir.LanguageManager.setToCompatibilityModeExtension
				     * 
				     * @param {Function} [success]
				     * 				a callback function that is invoked, after compatibility mode
				     * 				was set (alternatively the returned promise can be used).
				     * @param {Function} [requireFunction]
				     * 				the require-function that is configured for loading the compatibility module/file.
				     * 				Normally, this would be the function <code>mmir.require</code>.
				     * 				If omitted, the global <code>require</code> function will be used.
				     * 				NOTE: this argument is positional, i.e. argument <code>success</code> must be present, if
				     * 				      you want to specify this argument
				     * @returns {Promise}
				     * 				a Deffered promise that is resolved, after compatibility mode
				     * 				was set
				     * 
				     * @see mmir.LanguageManager.setToCompatibilityModeExtension
		             */
		            , setToCompatibilityMode : function(success, requireFunction) {
		            	
		            	var defer = deferred();
				    	if(success){
				    		defer.then(success, success);
				    	}
				    	requireFunction = requireFunction || require;
				    	requireFunction(['mmirf/languageManagerCompatibility'],function(setCompatibility){
				    		
				    		setCompatibility(instance);
				    		
				    		defer.resolve();
				    	});
				    	
				    	return defer;
		                
		            }//END: setToCompatibilityMode()
		            
		        };//END: return{}
		        
		        
		    }//END: construcor = function(){...

		    		    
		    //FIXME as of now, the LanguageManager needs to be initialized,
		    //		either by calling getInstance() or init()
		    //		-> should this be done explicitly (async-loading for dictionary and grammar? with returned Deferred?)
		    instance = new constructor();
		    		    
		    return instance;
			
});
