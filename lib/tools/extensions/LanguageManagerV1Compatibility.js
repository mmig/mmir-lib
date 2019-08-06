define(['mmirf/commonUtils', 'mmirf/presentationManager', 'mmirf/dialogManager'],
	/**
	 * Set to "backwards compatibility mode v1" (for pre version 2.0) for LanguageManager.
	 * NOTE: needs {@link mmir.compat.v1.CoreCompat} to be set first!
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
	 * @name mmir.compat.v1.LanguageManager
	 * @static
	 *
	 * @example
	 * mmir.require(['mmirf/core3Compatibility', 'mmirf/languageManagerCompatibility', 'mmirf/core', 'mmirf/languageManager'], function(setCoreCompatibility, setLanguageManagerCompatibility, mmir, languageManager){
	 * 		setCoreCompatibility(mmir);
	 * 		setLanguageManagerCompatibility(languageManager);
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
		 * @constructs mmir.compat.v1.LanguageManager
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

			/** @scope mmir.compat.v1.LanguageManager.prototype *///for jsdoc2

//            /**
//             * The instance that holds the extensions for compatibility
//             * mode, which really is the LanguageManager instance.
//             *
//             * @type mmir.compat.v1.LanguageManager
//             * @private
//             */
//            var compatibilitySelf = this;

		/**
		 * This function is used to localize the view description
		 * (ehtml) before they are displayed.
		 *
		 * @function
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
		 * @requires mmir.CommonUtils
		 * @requires requires that CommonUtils is set to
		 *           setToCompatibilityMode:
		 *           {@link mmir.CommonUtils#setToCompatibilityMode}
		 *
		 * @memberOf mmir.compat.v1.LanguageManager#
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
		 * FIXME does not work, since PresentationManager.reRenderView was removed!
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
		 * @requires mmir.PresentationManager
		 * @requires mmir.DialogManager
		 *
		 * @function
		 * @param {String}
		 *            newLang The new language which is to be used
		 *            henceforth
		 * @param {Boolean}
		 *            doReRenderView Should the currently displayed view
		 *            be rendered again in the new language?
		 * @returns {String} The translation of the keyword
		 * @public
		 *
		 * @memberOf mmir.compat.v1.LanguageManager#
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

		};//END: setToCompatibilityMode()

});
