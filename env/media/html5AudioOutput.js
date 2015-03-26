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


newMediaPlugin = {

		/**  @memberOf Html5AudioOutput# */
		initialize: function(callBack, mediaManagerInstance){
			
			/**  @memberOf Html5AudioOutput# */
			var _pluginName = 'html5AudioOutput';
			
			/**
			 * Media error (codes):
			 * 
			 * the corresponding code is their <code>index</code>.
			 * 
			 * <p>
			 * 
			 * Code 0 is an internal error code for unknown/unspecific error causes.
			 * <br>
			 * Codes 1 - 4 correspond to the HTML5 MediaError interface
			 * (which are the same as Cordova's Audio MediaError codes).
			 * The description texts are taken from the HTML5 documentation.
			 * 
			 * @enum
			 * @constant
			 * @type Array<String>
			 * @memberOf Html5AudioOutput#
			 * 
			 * @see <a href="https://html.spec.whatwg.org/multipage/embedded-content.html#mediaerror">https://html.spec.whatwg.org/multipage/embedded-content.html#mediaerror</a>
			 * @see <a href="http://plugins.cordova.io/#/package/org.apache.cordova.media">http://plugins.cordova.io/#/package/org.apache.cordova.media</a>
			 */
			var MediaError = [
			  	{name: 'MEDIA_ERR_UNKNOWN', 		code: 0, description: 'An unknown or unspecific (internal) error occurred.'},
			  	{name: 'MEDIA_ERR_ABORTED', 		code: 1, description: 'The fetching process for the media resource was aborted by the user agent at the user\'s request.'},
			  	{name: 'MEDIA_ERR_NETWORK', 		code: 2, description: 'A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.'},
			  	{name: 'MEDIA_ERR_DECODE', 			code: 3, description: 'An error of some description occurred while decoding the media resource, after the resource was established to be usable.'},
			  	{name: 'MEDIA_ERR_NONE_SUPPORTED', 	code: 4, description: 'The media resource indicated by the src attribute or assigned media provider object was not suitable.'}
			];

			//invoke the passed-in initializer-callback and export the public functions:
			callBack({
				/**
				 * @public
				 * @memberOf Html5AudioOutput.prototype
				 * @see mmir.MediaManager#playWAV
				 */
				playWAV: function(blob, successCallback, failureCallback){
					try {
						blobURL = window.webkitURL.createObjectURL(blob);
						var my_audio = new Audio(blobURL,null,failureCallback);
						if(successCallback){
							my_audio.addEventListener('ended', successCallack, false);
						}
						my_audio.play();
					} catch (e){
						if(failureCallBack){
							failureCallBack(e);
						}
					}
				},
				/**
				 * @public
				 * @memberOf Html5AudioOutput.prototype
				 * @see mmir.MediaManager#playURL
				 */
				playURL: function(url, onEnd, failureCallBack, successCallback){
					try {

						var my_media = new Audio(url,null,failureCallback);

						if(successCallback){
							my_media.addEventListener('ended', onEnd, false);
							my_media.addEventListener('canplay', successCallback, false);
						}
						my_media.play();
					} catch (e){
						if(failureCallback){
							failureCallback(e);
						}
					}
				},
				/**
				 * @public
				 * @memberOf Html5AudioOutput.prototype
				 * @see mmir.MediaManager#getURLAsAudio
				 */
				getURLAsAudio: function(url, onEnd,  failureCallback, successCallback){
					try {

						/**
						 * @private
						 * @memberOf AudioHtml5Impl#
						 */
						var enabled = true;
						/**
						 * @private
						 * @memberOf AudioHtml5Impl#
						 */
						var ready = false;
						/**
						 * @private
						 * @memberOf AudioHtml5Impl#
						 */
						var my_media = new Audio(url,null,failureCallback);
						
						/**
						 * Wrapper for error callback:
						 * normalize error events with attached MediaErrors to Cordova-error objects
						 *  
						 * @private
						 * @memberOf AudioHtml5Impl#
						 */
						var errorWrapper = function(evt){
							
							var code, mErr;
							//extract MediaError from event's (audio) target:
							if(evt && evt.target && evt.target.error && (code = evt.target.error.code) && code > 0 && code < 5){
								mErr = MediaError[code];
							}
							else {
								mErro = MediaError[0];
							}
							
							var err = {
									code: 			mErr.code,
									message: 		mErr.name,
									description: 	mErr.description + (code===0 && evt? ' ' + evt.toString() : '')
							};
							
							if(failureCallback){
								failureCallback.call(mediaImpl, err, evt);
							}
							else {
								console.error(err.message + ' (code '+err.code + '): '+err.description, evt);
							}
						};
						my_media.addEventListener('error', errorWrapper, false);
						
						
						my_media.addEventListener('ended',
							/**
							 * @private
							 * @memberOf AudioHtml5Impl#
							 */
							function onEnded(){

								//only proceed if we have a media-object (may have already been released)
								if(enabled & mediaImpl){
									mediaImpl.stop();
								}
								if (onEnd){
									onEnd.apply(mediaImpl, arguments);
								}
							},
							false
						);
						
						
						/**
						 * @private
						 * @memberOf AudioHtml5Impl#
						 */
						var canPlayCallback = function(){
							ready = true;
//							console.log("sound is ready!");

							//FIX: remove this listener after first invocation 
							//     (this is meant as "on-init" listener, but "canplay" 
							//      may be triggered multiple times during the lifetime of the audio object).
							this.removeEventListener('canplay', canPlayCallback);

							if (enabled && successCallback){
								successCallback.apply(mediaImpl, arguments);
							}
						};
						my_media.addEventListener('canplay', canPlayCallback, false);

						/**
						 * The Audio abstraction that is returned by {@link mmir.MediaManager#getURLAsAudio}.
						 * 
						 * <p>
						 * NOTE: when an audio object is not used anymore, its {@link #release} method should
						 * 		 be called.
						 * 
						 * <p>
						 * This is the same interface as {@link mmir.env.media.AudioCordovaImpl}.
						 * 
						 * @class
						 * @name AudioHtml5Impl
						 * @memberOf mmir.env.media
						 * @implements mmir.env.media.IAudio
						 * @public
						 */
						var mediaImpl = {
								/**
								 * Play audio.
								 * 
								 * @inheritdoc
								 * @name play
								 * @memberOf mmir.env.media.AudioHtml5Impl.prototype
								 */
								play: function(){
									if (enabled){
										// if (ready){
										my_media.play();
										// } else {
										//	 my_media.addEventListener('canplay', my_media.play, false);
										// }

									};
								},
								/**
								 * Stop playing audio.
								 * 
								 * @inheritdoc
								 * @name stop
								 * @memberOf mmir.env.media.AudioHtml5Impl.prototype
								 */
								stop: function(){
									if(enabled){
										if(my_media.stop){
											//TODO really we should check first, if the audio is playing...
											my_media.stop();
										}
										else {
											my_media.pause();
											//apparently, browser treat pause() differently: Chrome pauses, Firefox seems to stop... -> add try-catch-block in case, pause was really stop...
											try{
												my_media.currentTime=0;

												//HACK: for non-seekable audio in Chrome
												//      -> if currentTime cannot be set, we need to re-load the data
												//         (otherwise, the audio cannot be re-played!) 
												if(my_media.currentTime != 0){
													my_media.load();
												}
											}catch(e){};
										}
									}
								},
								/**
								 * Enable audio (should only be used internally).
								 * 
								 * @inheritdoc
								 * @name enable
								 * @memberOf mmir.env.media.AudioHtml5Impl.prototype
								 */
								enable: function(){
									if(my_media != null){
										enabled = true;
									}
									return enabled;
								},
								/**
								 * Disable audio (should only be used internally).
								 * 
								 * @inheritdoc
								 * @name disable
								 * @memberOf mmir.env.media.AudioHtml5Impl.prototype
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
								 * @inheritdoc
								 * @name release
								 * @memberOf mmir.env.media.AudioHtml5Impl.prototype
								 */
								release: function(){
									if(enabled && ! this.isPaused()){
										this.stop();
									}
									enabled= false;
									my_media=null;
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
								 * @memberOf mmir.env.media.AudioHtml5Impl.prototype
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
								 * @memberOf mmir.env.media.AudioHtml5Impl.prototype
								 */
								getDuration: function(){
									if(my_media){
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
								 * @memberOf mmir.env.media.AudioHtml5Impl.prototype
								 */
								isPaused: function(){
									if(my_media){
										return my_media.paused;
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
								 * @memberOf mmir.env.media.AudioHtml5Impl.prototype
								 */
								isEnabled: function(){
									return enabled;
								}
						};

						return mediaImpl;

					} catch (e){
						if(failureCallback){
							failureCallback(e);
						}
					}
				}
			});
		}
};
