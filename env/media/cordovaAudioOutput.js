
/**
 * Audio handling for Cordova environment
 *
 * @requires cordova-plugin-media
 * @require window.URL or window.webkitURL for #playWAV
 *
 */

// ;(function (root, factory) {
//
// 	if (typeof define === 'function' && define.amd) {
// 			// AMD. Register as an anonymous module.
// 			define(function () {
// 					return factory(root);
// 			});
// 	} else if (typeof module === 'object' && module.exports) {
// 			// Node. Does not work with strict CommonJS, but
// 			// only CommonJS-like environments that support module.exports,
// 			// like Node.
// 			module.exports = factory(root);
// 	}
//
// }(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this, function (window) {


define(['mmirf/mediaManager'], function(mediaManager){

var globalCtx = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;

/**  @class CordovaAudioOutput */
return {
	/**  @memberOf CordovaAudioOutput# */
	initialize: function(callBack, __mediaManager){

		/**  @memberOf CordovaAudioOutput# */
		var _pluginName = 'codovaAudioOutput';

		/**
		 * HELPER for releasing data-URL
		 *
		 * @param {String} dataUrl
		 * 			The data URL for the audio blob
		 *
		 * @memberOf Html5AudioOutput#
		 */
		function releaseDataUrl(dataUrl){

			if(globalCtx.URL || globalCtx.webkitURL){
				(globalCtx.URL || globalCtx.webkitURL).revokeObjectURL(dataUrl);
			}
			else {
				mediaManager._log.d('cannot release media URL: no URL.revokeObjectURL() available!')
			}
		}

		//invoke the passed-in initializer-callback and export the public functions:
		callBack({
			/**
			 * @public
			 * @memberOf CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#playWAV
			 */
			playWAV: function(blob, successCallback, failureCallback){
				try {
					var blobURL = (globalCtx.URL || globalCtx.webkitURL).createObjectURL(blob);
					var my_media = new Media(
							blobURL,
							function(){
//									console.log('WAV Audio created');

								my_media.release();
								releaseDataUrl(blobURL);
								if(successCallback){
									successCallback();
								}
							},failureCallback
					);

					my_media.play();

				} catch (e){
					if(failureCallback){
						failureCallback(e);
					}
				}
			},
			/**
			 * @public
			 * @memberOf CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#playURL
			 */
			playURL: function(url, successCallback, failureCallback){
				try {
//						console.log(url);
					var my_media = new Media(
							url,
							function(){
//									console.log('Audio played');

								my_media.release();
								if(successCallback){
									successCallback.apply(my_media,arguments);
								}
							},
							failureCallback
					);

					my_media.play();
				} catch (e){
					if(failureCallback){
						failureCallback.apply(my_media,arguments);
					}
				}
			},
			/**
			 * @public
			 * @type Function
			 * @memberOf CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#play
			 */
			play: mediaManager.play,
			/**
			 * @public
			 * @memberOf CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#getURLAsAudio
			 */
			getURLAsAudio: function(url, onEnd, failureCallback, onCanPlay){

				try {

					/**
					 * @private
					 * @memberOf AudioCordovaImpl#
					 */
					var playStatus = 0;
					/**
					 * @private
					 * @memberOf AudioCordovaImpl#
					 */
					var my_media = new Media(
							url
							,null //DEBUG: function(){console.log('native onReady CB');}
							,failureCallback
							,function(status){
//									console.debug("media status change "+playStatus+" -> "+status+"  for: "+url);

								playStatus = status;

								if (status==1){
									if (onCanPlay){
										onCanPlay.apply(mediaImpl, arguments);
										onCanPlay = null;//remove onCanPlay callback after first invocation
									}
								}
//									else if (status==2){
//									console.log("Audio started");
//									}
//									else if (status==3){
//									console.log("Audio paused");
//									}
								else if(status == 4){
									if (onEnd){
										onEnd.apply(mediaImpl, arguments);
									}
								}
							}
					);

					/**
					 * @private
					 * @memberOf AudioCordovaImpl#
					 */
					var enabled = true;


					/**
					 * The Audio abstraction that is returned by {@link mmir.MediaManager#getURLAsAudio}.
					 *
					 * <p>
					 * NOTE: when an audio object is not used anymore, its {@link #release} method should
					 * 		 be called.
					 *
					 * <p>
					 * This is the same interface as {@link mmir.env.media.AudioHtml5Impl}.
					 *
					 * @class
					 * @name AudioCordovaImpl
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
							 * @memberOf mmir.env.media.AudioCordovaImpl.prototype
							 */
							play: function(){
								if (enabled){
									my_media.play();
									return playStatus >= 1;
								}
								return false;
							},
							/**
							 * Stop playing audio.
							 *
							 * @inheritdoc
							 * @name stop
							 * @memberOf mmir.env.media.AudioCordovaImpl.prototype
							 */
							stop: function(){
								//use "manual" stop instead of Cordova's stop
								//in order to allow "forgiving" behavior when audio is already stopped
								//	-> Cordova's stop() requires the audio to be playing, otherwise an error is thrown/triggered

//									console.info('CordovaAudio.stop[state '+playStatus
//											+', duration '+my_media.duration
//											+', position '+my_media.position
////											+', currentPosition '+my_media.getCurrentPosition()
//											+']: '+url);

								//only try to stop if playing and/or paused
								if(playStatus == 2 || playStatus == 3){
									my_media.stop();
									return true;
								}

//									if(playStatus == 2){//playing
//										my_media.stop();
//									}
//									else if(playStatus == 3){//paused
//										my_media.seekTo(0);
//									}
////									my_media.stop();
								return playStatus === 4;
							},
							/**
							 * Enable audio (should only be used internally).
							 *
							 * @inheritdoc
							 * @name enable
							 * @memberOf mmir.env.media.AudioCordovaImpl.prototype
							 */
							enable: function(){
								enabled = true;
							},
							/**
							 * Disable audio (should only be used internally).
							 *
							 * @inheritdoc
							 * @name disable
							 * @memberOf mmir.env.media.AudioCordovaImpl.prototype
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
							 * NOTE Android has limited resources available - not releasing resources
							 *      may result in not being able to instantiate new (audio) resources.
							 *
							 * @inheritdoc
							 * @name release
							 * @memberOf mmir.env.media.AudioCordovaImpl.prototype
							 */
							release: function(){
								if(enabled && ! this.isPaused()){
									this.stop();
								}
								enabled= false;
								if(my_media){
									my_media.release();
								}

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
							 * @memberOf mmir.env.media.AudioCordovaImpl.prototype
							 */
							setVolume: function(value){
								if(my_media){
									my_media.setVolume(value);
								}
							},
							/**
							 * Get the duration of the audio file
							 *
							 * @returns {Number} the duration in MS (or -1 if unknown)
							 *
							 * @inheritdoc
							 * @name getDuration
							 * @memberOf mmir.env.media.AudioCordovaImpl.prototype
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
							 * @memberOf mmir.env.media.AudioCordovaImpl.prototype
							 */
							isPaused: function(){
								if(my_media){
									return playStatus == 3;
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
							 * @memberOf mmir.env.media.AudioCordovaImpl.prototype
							 */
							isEnabled: function(){
								return enabled;
							}
					};

					//WORK-AROUND for Android: need to invoke a method on the Media object in
					//							order to trigger the on-init callback.
					my_media.seekTo(0);


					return mediaImpl;

				} catch (e){
					console.error(e);
					if(failureCallback){
						failureCallback(e);
					}
				}
			},//END: getURLAsAudio
			/**
			 * @public
			 * @type Function
			 * @memberOf CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#getAudio
			 */
			getAudio: function(url, onPlayedCallback, failureCallBack, onLoadedCallBack){
				if(typeof url !== 'string'){
					mediaManager._log.error(_pluginName+'.getAudio(): getWAVAsAudio is not supported by this module.');
				} else {
					return this.getURLAsAudio.apply(this, arguments);
				}
			}

		});//END: callBack({...
	}
};

}));//END module wrapper/factory
