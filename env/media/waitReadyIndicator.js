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
 *                  "html5AudioOutput",
 *                  ...
 *      ],
 *      "cordova": ["waitReadyIndicator",
 *                  "androidAudioInput",
 *                  ...
 *      ]
 *      ...
 *    }
 *  },
 *  ...
 * </pre>
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
 * @requires stlne-wait-dlg (waitDialog module and CSS)
 */

newMediaPlugin = {
		/**  @memberOf WaitReadyIndicatorImpl# */
		initialize: function(callBack, mediaManager){//, ctxId, moduleConfig){//DISABLED this argument is currently un-used -> disabled
			
			/** 
			 * legacy mode: use pre-v4 API of mmir-lib
			 * @memberOf WaitReadyIndicatorImpl#
			 */
			var _isLegacyMode = true;
			/** 
			 * Reference to the mmir-lib core (only available in non-legacy mode)
			 * @type mmir
			 * @memberOf WaitReadyIndicatorImpl#
			 */
			var _mmir = null;
			if(mediaManager._get_mmir){
				//_get_mmir() is only available for >= v4
				_mmir = mediaManager._get_mmir();
				//just to make sure: set legacy-mode if version is < v4
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
			 * @memberOf WaitReadyIndicatorImpl#
			 */
			var _req = function(id){
				var name = (_isLegacyMode? '' : 'mmirf/') + id;
				return _mmir? _mmir.require(name) : require(name);
			};
			
			_req(['waitDialog'], function(dlg){

				/**  @memberOf WaitReadyIndicatorImpl# */
				var _pluginName = 'waitReadyIndicator';
				
				/** 
				 * @type mmir.LanguageManager
				 * @memberOf WaitReadyIndicatorImpl#
				 */
				var languageManager = _req('languageManager');
				
				/**  @memberOf WaitReadyIndicatorImpl# */
				var _id = 'media-plugin-wait';
				
				/**  @memberOf WaitReadyIndicatorImpl# */
				var caption;
				
				/**  @memberOf WaitReadyIndicatorImpl# */
				var cssUrl = 'mmirf/vendor/styles/' + dlg.styleUrl;//TODO make this configurable / retrieve this setting from somewhere
				
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
					    	var text = typeof caption !== 'undefined'? caption : languageManager.getText('loadingText');
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
				
			});
			
		}
};