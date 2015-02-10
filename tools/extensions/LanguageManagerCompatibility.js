define(['commonUtils', 'presentationManager', 'dialogManager'],
	/**
     * Set to "backwards compatibility mode" (for pre version 2.0) for LanguageManager.
     * 
	 * This function re-adds deprecated and removed functions and
     * properties to the CommonUtils instance.
     * 
     * NOTE that once set to compatibility mode, it cannot be reset to
     * non-compatibility mode.
     * 
     * <p>
     * In addition, the following functions of LanguageManager are made accessible
     * on the <code>mmir.LanguageManager</code> instance with these additional names
     * <ul>
     * 	<li> {@link mmir.LanguageManager#getLanguage} as
     *          <b><u>getCurrentLanguage() : String</u></b>
     *  </li><li>
     *  	 {@link mmir.LanguageManager#existsGrammar} as
     *          <b><u>existsGrammarForLanguage(String: lang) : Boolean</u></b>
     * </li><li>
     * 		 {@link mmir.LanguageManager#existsDictionary} as
     *          <b><u>existsDictionaryForLanguage(String: lang) : Boolean</u></b>
     * </li><li>
     * 		 {@link mmir.LanguageManager#existsSpeechConfig} as
     *          <b><u>existsSpeakerForLanguage(String: lang) : Boolean</u></b>
     * </li><li>
     * 		 {@link mmir.LanguageManager#setNextLanguage} as
     *          <b><u>cycleLanguages()</u></b>
     * </li>
     * </ul>
     * 
     * @param {mmir.LanguageManager} compatibilitySelf
     * 			the instance of mmir.LanguageManager to which the compatibility functions etc.
     * 			will be attached
     * 
	 * 
	 * @class
	 * @name mmir.LanguageManager.setToCompatibilityModeExtension
	 * @static
	 * 
	 * @example
	 * require(['languageManagerCompatibility'], function(setCompatibility){
	 * 		setCompatibility(mmir.LanguageManager);
	 * });
	 * 
	 * @public
	 */
	function(
		commonUtils, presentationManager, dialogManager
) {
	
		/**
         * Set to "backwards compatibility mode" (for pre version 2.0).
         * 
         * This function re-adds deprecated and removed functions and
         * properties to the CommonUtils instance.
         * 
         * NOTE that once set to compatibility mode, it cannot be reset to
         * non-compatibility mode.
         * 
         * @param {mmir.LanguageManager} compatibilitySelf
         * 			the instance of mmir.LanguageManager to which the compatibility functions etc.
         * 			will be attached
         * 
         * @constructs mmir.LanguageManager.setToCompatibilityModeExtension
         * 
         * @borrows mmir.LanguageManager#getLanguage as
         *          this.getCurrentLanguage
         * @borrows mmir.LanguageManager#existsGrammar as
         *          this.existsGrammarForLanguage
         * @borrows mmir.LanguageManager#existsDictionary as
         *          this.existsDictionaryForLanguage
         * @borrows mmir.LanguageManager#existsSpeechConfig as
         *          this.existsSpeakerForLanguage
         * @borrows mmir.LanguageManager#setNextLanguage as
         *          this.cycleLanguages
         */
        return setToCompatibilityMode = function(compatibilitySelf) {
        	
        	/** @scope mmir.LanguageManager.setToCompatibilityModeExtension.prototype */
        	
        	/**
        	 * #@+
        	 * @memberOf mmir.LanguageManager.setToCompatibilityModeExtension.prototype
        	 */
        	
//            /**
//             * The instance that holds the extensions for compatibility
//             * mode, which really is the LanguageManager instance.
//             * 
//             * @property compatibilitySelf
//             * @type mmir.LanguageManager
//             * @private
//             */
//            var compatibilitySelf = this;

            /**
             * This function is used to localize the view description
             * (ehtml) before they are displayed.
             * 
             * @function translateHTML
             * @param {String}
             *            html The (HTML) string which is to be localized
             *            into the currently used language
             * @returns {String} The localized (HTML) string
             * @throws {Error} if {@link mmir.CommonUtils#getTranslationRegExp} is not
             * 			available (i.e. commonUtils has not been set to compatibility mode)
             * 
             * @public
             * @deprecated used for old template format
             * 
             * 
             * @depends mmir.CommonUtils
             * @depends requires that CommonUtils is set to
             *           setToCompatibilityMode:
             *           {@link mmir.CommonUtils#setToCompatibilityMode}
             */
            var translateHTML = function(html) {
            	
            	if(commonUtils && !commonUtils.getTranslationRegExp){
            		throw new Error('No function CommonUtils.getTranslationRegExp(): need to set commonUtils to compatibility mode too!');
            	}
            	
                var translationRegExp = commonUtils.getTranslationRegExp();
                if (html.match(translationRegExp)) {
                    while (tre = translationRegExp.exec(html)) {
                        var translated = internalGetText(tre[1]);
                        html = html.replace(tre[0], translated);
                    }
                }
                return html;
            };
            compatibilitySelf.translateHTML = translateHTML;

            /**
             * 
             * 
             * This function changes the application language and, if
             * requested, renders the current view again, so that the change
             * of the language is applied to the currently displayed view.
             * After changing the language (and re-rendering the view) an
             * event "language_choosen" is raised on the DialogManager.<br>
             * 
             * <div class="box important"> <b>Note:</b> Momentarily this
             * function is used by 'controllers/application.js' to generate
             * a menu to choose the application language.<br>
             * This should better be implemented as a partial. </div>
             * 
             * @depends mmir.PresentationManager
             * @depends mmir.DialogManager
             * 
             * @function changeLanguage
             * @param {String}
             *            newLang The new language which is to be used
             *            henceforth
             * @param {Boolean}
             *            doReRenderView Should the currently displayed view
             *            be rendered again in the new language?
             * @returns {String} The translation of the keyword
             * @public
             */
            var changeLanguage = function(newLang, doReRenderView) {

                console.debug("[Language] selected " + newLang);// debug

                // instance.setLanguage(newLang);
                this.setLanguage(newLang);

                if (doReRenderView == true) {
                    presentationManager.reRenderView();
                }
                dialogManager.raise("language_choosen", newLang);
            };
            compatibilitySelf.changeLanguage = changeLanguage;

            compatibilitySelf.getCurrentLanguage = compatibilitySelf.getLanguage;
            compatibilitySelf.cycleLanguages = compatibilitySelf.setNextLanguage;
            
            /** #@- */
            
        };//END: setToCompatibilityMode()
});