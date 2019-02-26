
/**
 * Default / standard implementation for wait-/ready-indication:
 *
 * media-modules may signal that they are <code>preparing</code> a resource, and then that
 * they are <code>ready</code> via the {@link mmir.MediaManager#_preparing} and
 * {@link mmir.MediaManager#_ready}.
 *
 * This implementation provides a simple mechanism for showing these states to the user:
 * upon <em>preparing</em> an overlay with a "please wait" message is shown, and upon
 * <em>ready</em> the overlay is hidden again.
 *
 * See {@link #setWaitCaption} for details on setting a custom text message.
 *
 * In order to load this implementation, add the entry <code>"waitReadyIndicator"</code>
 * to the <code>mediaManager.plugins</code> list in the MMIR configuration file
 * at <code>config/configuration.json</code>:
 * <pre>
 * ...
 *   "mediaManager": {
 *    "plugins": {
 *      "browser": ["waitReadyIndicator",
 *                  // OR: {"mod": "waitReadyIndicator", "config": "url to css styles"},
 *                  "webAudioOutput",
 *                  ...
 *      ],
 *      "cordova": ["waitReadyIndicator",
 *                  // OR: {"mod": "waitReadyIndicator", "config": "url to css styles"},
 *                  "androidAudioInput",
 *                  ...
 *      ]
 *      ...
 *    }
 *  },
 *  ...
 * </pre>
 * NOTE: the optional configuration value specifies an URL to a CSS file for styling the
 *       wait-/ready-indication dialog.
 *       If not specified, the default styling of stlne-wait-dlg is used.
 *
 * @example
 *
 * //starting to prepare a resource:
 * mmir.MediaManager._preparing();
 *
 * // do something ...
 *
 * //... when the resouce has been prepared
 * // and is ready to be used:
 * mmir.MediaManager._ready();
 *
 * @class
 * @public
 * @name  WaitReadyIndicatorImpl
 * @memberOf mmir.env.media
 *
 * @requires mmirf/waitDialog the stlne-wait-dlg implementation (waitDialog module and CSS)
 */


define(['mmirf/languageManager', 'mmirf/waitDialog'], function(lang, dlg){


if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
	require.resolve('mmirf/waitDialog')
}

/**  @class WaitReadyIndicatorImpl */
return {
	/**  @memberOf WaitReadyIndicatorImpl# */
	initialize: function(callBack, __mediaManager, ctxId, moduleConfig){

		/**  @memberOf WaitReadyIndicatorImpl# */
		var _pluginName = 'waitReadyIndicator';

		/**  @memberOf WaitReadyIndicatorImpl# */
		var _id = 'media-plugin-wait';

		/**  @memberOf WaitReadyIndicatorImpl# */
		var caption;

		/**  @memberOf WaitReadyIndicatorImpl# */
		var cssUrl = moduleConfig? moduleConfig : dlg.styleUrl;

		//load the stylesheet file for the wait-dialog
		// (does nothing, if this load-function was already called before)
		dlg._loadStyle(cssUrl);

		//create the DOM elements for the wait dialog (hidden)
		dlg.create(_id);//, {type: 'verbose', theme: 'a'});//DISABLED: these are the default options

		//invoke the passed-in initializer-callback and export the public functions:
		callBack({waitReadyImpl: {
			/**
			 * Shows wait dialog.
			 *
			 * @public
			 * @memberOf WaitReadyIndicatorImpl.prototype
			 * @see mmir.MediaManager#_preparing
			 */
		    preparing: function (){
		    	var text = typeof caption !== 'undefined'? caption : lang.getText('loadingText');
		    	dlg.show(text, _id);
		    },
		    /**
		     * Hides wait dialog.
		     *
			 * @public
			 * @memberOf WaitReadyIndicatorImpl.prototype
			 * @see mmir.MediaManager#_ready
			 */
  			ready: function(){
  				dlg.hide(_id);
  			},
  			/**
  			 * Set caption for wait dialog.
  			 *
  			 * <p>
  			 * By default (i.e. not set), the dictionary entry for
  			 * "loadingText" is used as caption / label.
  			 *
  			 * @param {String} text
  			 * 		set the caption / label for the wait-dialog.<br>
  			 * 		If <code>undefined</code>, the default caption will be used.
  			 *
			 * @public
			 * @memberOf WaitReadyIndicatorImpl.prototype
			 * @see mmir.MediaManager#ready
			 * @see mmir.LanguageManager#getText
			 */
		    setWaitCaption: function(text){
  				caption = text;
  			},
  			/**
  			 * Get current caption for wait dialog.
  			 *
  			 * NOTE if none is set, then internally the value of "loadingText"
  			 * property of the current language dictionary will be used.
  			 *
			 * @public
			 * @memberOf WaitReadyIndicatorImpl.prototype
			 * @see mmir.MediaManager#_ready
			 * @see #setWaitCaption
			 */
		    getWaitCaption: function(){
  				return caption;
  			}
		}});

	}
};

});//END define
