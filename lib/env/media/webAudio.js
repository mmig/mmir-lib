
define(['mmirf/mediaManager', 'mmirf/util/extend'], function(mediaManager, extend){

var globalCtx = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;

/**
 * Audio handling for web / HTML5 environment
 *
 * @class
 * @name Html5AudioOutput
 * @memberOf mmir.env.media
 * @hideconstructor
 *
 * @requires window.URL or window.webkitURL for #playWAV
 */
return {

	/**  @memberOf mmir.env.media.Html5AudioOutput# */
	initialize: function(callBack){

		/**
		 * @default "webAudio"
		 * @readonly
		 * @protected
		 * @memberOf mmir.env.media.Html5AudioOutput#
		 */
		var _pluginName = 'webAudio';

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
		 * @memberOf mmir.env.media.Html5AudioOutput#
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

		/**
		 * HELPER for creating error object that is returned in the failureCallbacks
		 *
		 * @param {Number} code
		 * 			The error code: if in [1,4], the corresponding HTML5 MediaError information will be returned
		 * 			Otherwise an "error 0", i.e. internal/unknown error will be created
		 * @param {Event|Error} errorEvent
		 * 			the causing event- or error-object
		 *
		 * @returns {Object} the error object, which has 3 properties:
		 * 			  code (Number): the error code
		 * 			  message (String): the error name
		 * 			  description (String): a descriptive text for the error
		 *
		 * @private
		 * @memberOf mmir.env.media.Html5AudioOutput#
		 */
		function createError(code, errorEvent){

			var mErr;
			if(code > 0 && code < 5){
				mErr = MediaError[code];
			}
			else {
				mErr = MediaError[0];
			}

			return {
					code: 			mErr.code,
					message: 		mErr.name,
					description: 	mErr.description + (code===0 && errorEvent? ' ' + errorEvent.toString() : '')
			};
		}

		/**
		 * FACTORY for creating error-listeners (that trigger the failureCallback)
		 *
		 * @param {Object} [ctx]
		 * 			the context for the errorCallback.
		 * 			IF omitted, the callback will be within the default (i.e. global) context.
		 * @param {Function} [errorCallback]
		 * 			the error callback.
		 * 			Is invoked with 2 arguments:
		 * 			errorCallback(error, event)
		 * 			where error has 3 properties:
		 * 			  code (Number): the error code
		 * 			  message (String): the error name
		 * 			  description (String): a descriptive text for the error
		 *
		 * 			IF omitted, the error will be printed to the console.
		 *
		 * @return {Function} wrapper function that can be registered as event-listener (takes one argument: the event)
		 *
		 * @private
		 * @memberOf mmir.env.media.Html5AudioOutput#
		 */
		function createErrorWrapper(ctx, errorCallback){

			return function(evt){

				var code;
				//extract MediaError from event's (audio) target:
				if(evt && evt.target && evt.target.error && (code = evt.target.error.code) && code > 0 && code < 5){
//						code = code; //NO-OP: code value was already assigned in IF clause
				}
				else {
					//unknown cause: create internal-error object
					code = 0;
				}

				var err = createError(code, evt);

				if(errorCallback){
					errorCallback.call(ctx, err, evt);
				}
				else {
					mediaManager._log.error('['+_pluginName+'] '+ err.message + ' (code '+err.code + '): '+err.description, evt);
				}
			};
		}

		/**
		 * HELPER for creating data-URL from binary data (blob)
		 *
		 * @param {Blob} blob
		 * 			The audio data as blob
		 * @param {Function} callback
		 * 			callback that will be invoked with the data-URL:
		 * 			<code>callback(dataUrl)</code>
		 *
		 * @private
		 * @memberOf mmir.env.media.Html5AudioOutput#
		 */
		function createDataUrl(blob, callback){

			if(globalCtx.URL || globalCtx.webkitURL){
				callback( (globalCtx.URL || globalCtx.webkitURL).createObjectURL(blob) );
			}
			else {

				//DEFAULT: use file-reader:
				var fileReader = new FileReader();

				// onload needed since Google Chrome doesn't support addEventListener for FileReader
				fileReader.onload = function (evt) {
					// Read out "file contents" as a Data URL
					var dataUrl = evt.target.result;
					callback(dataUrl);
				};

				//start loading the blob as Data URL:
				fileReader.readAsDataURL(blob);
			}

		}

		/**
		 * HELPER for releasing data-URL
		 *
		 * @param {String} dataUrl
		 * 			The data URL for the audio blob
		 *
		 * @private
		 * @memberOf mmir.env.media.Html5AudioOutput#
		 */
		function releaseDataUrl(dataUrl){

			if(globalCtx.URL || globalCtx.webkitURL){
				(globalCtx.URL || globalCtx.webkitURL).revokeObjectURL(dataUrl);
			}
			else {
				mediaManager._log.d('cannot release media URL: no URL.revokeObjectURL() available!')
			}

		}

		/**
		 * HELPER for handling new play() promise mechanism:
		 * play may get rejected due to no user-interaction -> trigger 'errorplay' event on MediaManager
		 *
		 * @param {Promise|void} p
		 * 			The promise returned by calling WebAudio.play() (or FALSY, if no promise was returned)
		 * @param {IAudio} audio
		 * 			The audio object for which play was invoked
		 * @param {Function} errorHandler
		 * 			The error handler/callback for the audio
		 *
		 * @returns {mmir.env.media.IAudio} the audio
		 *
		 * @private
		 * @memberOf mmir.env.media.Html5AudioOutput#
		 */
		function handlePlayPromise(p, audio, errorHandler) {
			if(p && p.catch){
				p.catch(function(err){
					mediaManager._emitEvent('errorplay', audio, err);
					errorHandler.call(audio, {
						code: 			err.code,
						message: 		err.name,
						description: 	err.message
					});
				});
			}
		}

		//invoke the passed-in initializer-callback and export the public functions:
		callBack({
			/**
			 * @public
			 * @memberOf mmir.env.media.Html5AudioOutput.prototype
			 * @see mmir.MediaManager#playWAV
			 * @copydoc mmir.MediaManager#playWAV
			 */
			playWAV: function(blob, onEnd, failureCallback, successCallback){

				try {

					var self = this;
					createDataUrl(blob, function(dataUrl){

						self.playURL(dataUrl,
								function onend(){
									releaseDataUrl(dataUrl);
									onEnd && onEnd.apply(this, arguments);
								},
								failureCallback, successCallback);

					});


				} catch (e){

					var err = createError(0,e);
					if(failureCallback){
						failureCallback.call(null, err, e);
					}
					else {
						mediaManager._log.error('['+_pluginName+'] '+ err.message + ': ' + err.description, e);
					}
				}
			},
			/**
			 * @public
			 * @memberOf mmir.env.media.Html5AudioOutput.prototype
			 * @see mmir.MediaManager#playURL
			 * @copydoc mmir.MediaManager#playURL
			 */
			playURL: function(url, onEnd, failureCallback, successCallback){

				try {

					var audio = new Audio(url);

					if(failureCallback){
						audio.addEventListener('error', createErrorWrapper(audio, failureCallback), false);
					}

					if(onEnd){
						audio.addEventListener('ended', onEnd, false);
					}

					if(successCallback){
						audio.addEventListener('canplay', successCallback, false);
					}

					var p = audio.play();
					handlePlayPromise(p, audio, failureCallback);

				} catch (e){

					var err = createError(0,e);
					if(failureCallback){
						failureCallback.call(null, err, e);
					}
					else {
						mediaManager._log.error('['+_pluginName+'] '+ err.message + ': ' + err.description, e);
					}
				}

			},
			/**
 			 * @public
 			 * @memberOf mmir.env.media.Html5AudioOutput.prototype
 			 * @see mmir.MediaManager#play
 			 * @copydoc mmir.MediaManager#play
 			 * @function play
 			 */
			play: mediaManager.play,

			/**
			 * @public
			 * @memberOf mmir.env.media.Html5AudioOutput.prototype
			 * @see mmir.MediaManager#getWAVAsAudio
			 * @copydoc mmir.MediaManager#getWAVAsAudio
			 */
			getWAVAsAudio: function(blob, callback, onEnd, failureCallback, onInit, emptyAudioObj){

				if(!emptyAudioObj){
					emptyAudioObj = mediaManager.createEmptyAudio();
				}

				try {

					var self = this;

					createDataUrl(blob, function(dataUrl){

						var audioObj;

						//do not start creating the blob, if the audio was already discarded:
						if(emptyAudioObj.isEnabled()){
							audioObj = self.getURLAsAudio(dataUrl, onEnd, failureCallback, onInit, emptyAudioObj);
							audioObj._wavrelease = audioObj.release;
							audioObj.release = function(){
								if(this.isEnabled()){
									releaseDataUrl(dataUrl);
								}
								return this._wavrelease();
							};
						} else {
							audioObj = emptyAudioObj;
							releaseDataUrl(dataUrl);
						}

						if(callback){
							callback.call(audioObj, audioObj);
						}

					});


				} catch (e){

					var err = createError(0, e);
					if(failureCallback){
						failureCallback.call(emptyAudioObj, err, e);
					}
					else {
						mediaManager._log.error('['+_pluginName+'] '+ err.message + ': ' + err.description, e);
					}
				}

				return emptyAudioObj;
			},

			/**
			 * @public
			 * @memberOf mmir.env.media.Html5AudioOutput.prototype
			 * @see mmir.MediaManager#getURLAsAudio
			 * @copydoc mmir.MediaManager#getURLAsAudio
			 */
			getURLAsAudio: function(url, onEnd, failureCallback, successCallback, audioObj){

				try {

					/**
					 * @private
					 * @memberOf AudioHtml5Impl#
					 */
					var enabled = audioObj? audioObj._enabled : true;
					/**
					 * @private
					 * @memberOf AudioHtml5Impl#
					 */
					var ready = false;
					/**
					 * @private
					 * @memberOf AudioHtml5Impl#
					 */
					var my_media = new Audio(url);

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
						canPlayCallback = null;

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
					 * @hideconstructor
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

									if (ready){

										var p = my_media.play();
										handlePlayPromise(p, mediaImpl, failureCallback);

										return true;

									} else {

										var autoPlay = function(){

											//start auto-play only once (i.e. remove after first invocation):
											this.removeEventListener('canplay', autoPlay);
											autoPlay = null;

											if(enabled){
												var p = my_media.play();
												handlePlayPromise(p, mediaImpl, failureCallback);
											}
										};
										my_media.addEventListener('canplay', autoPlay , false);
									}

								}
								return false;
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
										//apparently, browsers treat pause() differently: Chrome pauses, Firefox seems to stop... -> add try-catch-block in case, pause was really stop...
										try{
											my_media.currentTime=0;

											//HACK: for non-seekable audio in Chrome
											//      -> if currentTime cannot be set, we need to re-load the data
											//         (otherwise, the audio cannot be re-played!)
											if(my_media.currentTime != 0){
												my_media.load();
											}
										}catch(e){
											return false;
										};
									}
									return true;
								}
								return false;
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

					my_media.addEventListener('error', createErrorWrapper(mediaImpl, failureCallback), false);

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

					//if Audio was given: "merge" with newly created Audio
					if(audioObj){

						extend(audioObj, mediaImpl);

						//transfer (possibly) changed values to newly created Audio
						if(audioObj._volume !== 1){
							audioObj.setVolume( audioObj._volume );
						}
						if(audioObj._play){
							audioObj.play();

						}

						//remove internal properties / impl. that are not used anymore:
						audioObj._volume  = void(0);
						audioObj._play    = void(0);
						audioObj._enabled = void(0);

						mediaImpl = audioObj;
					}

					return mediaImpl;

				} catch (e){
					var err = createError(0,e);
					if(failureCallback){
						failureCallback.call(mediaImpl, err, e);
					}
					else {
						mediaManager._log.error('['+_pluginName+'] '+ err.message + ': ' + err.description, e);
					}
				}
			},//END getURLAsAudio

			/**
			 * @public
			 * @memberOf mmir.env.media.Html5AudioOutput.prototype
			 * @see mmir.MediaManager#getAudio
			 * @copydoc mmir.MediaManager#getAudio
			 * @function
			 */
			getAudio: mediaManager.getAudio,
		});
	}
};

});//END define
