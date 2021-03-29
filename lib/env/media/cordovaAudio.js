
define(['mmirf/mediaManager', 'mmirf/util/deferred', 'mmirf/util/extend'], function(mediaManager, Deferred, extend){

var globalCtx = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;

/**
 * Audio handling for Cordova environment
 *
 * @class
 * @name CordovaAudioOutput
 * @memberOf mmir.env.media
 * @hideconstructor
 *
 * @requires cordova-plugin-media
 * @requires cordova-plugin-file
 */
return {
	/**  @memberOf mmir.env.media.CordovaAudioOutput# */
	initialize: function(callBack){

		/**
		 * @default "cordovaAudio"
		 * @readonly
		 * @protected
		 * @memberOf mmir.env.media.CordovaAudioOutput#
		 */
		var _pluginName = 'cordovaAudio';

		// HELPER wait for cordova to initialize (reset to NULL, when cordova is initialized)
		var _cordovaWaitReady = new Deferred();
		globalCtx.document.addEventListener('deviceready', function(){
			_cordovaWaitReady.resolve();
			_cordovaWaitReady = null;
		}, false);

		var _cordovaFileSystem;
		function getFileSystem(callback){

			if(_cordovaFileSystem){
				return callback(null, _cordovaFileSystem);
			}

			if(_cordovaWaitReady){
				return _cordovaWaitReady.then(function(){
					getFileSystem(callback);
				});
			}

			globalCtx.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (dirEntry) {
				_cordovaFileSystem = dirEntry;
				callback(null, dirEntry);
			}, function(err){
				if(mediaManager._log.ise()) mediaManager._log.error('['+_pluginName+'] ERROR resolving filesystem '+ cordova.file.cacheDirectory + ', '+err, err);
				callback(err);
			});
		}

		function writeToFile(blob, callback, attempts){

			getFileSystem(function(err, dirEntry){

				if(err){
					return callback(err);
				}

				var rand = Math.random() + '';
				var fileName = 'temp_audio_' + rand.replace(/\./, '');

				//try to create temporary file (fail, if it already exists)
				dirEntry.getFile(fileName, {create: true, exclusive: true}, function(fileEntry) {

					fileEntry.createWriter(function (fileWriter) {

						fileWriter.onwriteend = function() {
							if(mediaManager._log.isd()) mediaManager._log.debug('['+_pluginName+'] successfully created file '+ cordova.file.cacheDirectory + fileName);
							callback(null, fileEntry.nativeURL);
						};

						fileWriter.onerror = function (e) {
							if(mediaManager._log.ise()) mediaManager._log.error('['+_pluginName+'] ERROR writing to file '+ cordova.file.cacheDirectory + fileName + ': '+e, e);
							callback(e);
						};

						fileWriter.write(blob);
					});

				}, function(err){

					if(attempts < 10){
						attempts = attempts || 0;
						writeToFile(blob, callback, ++attempts);
					} else {
						if(mediaManager._log.ise()) mediaManager._log.error('['+_pluginName+'] ERROR writing file: tried 10 times but failed to write (temporary) file to '+ cordova.file.cacheDirectory + ': '+err, err);
						callback(err);
					}
				});

			});
		}

		function removeFile(filePath, callback){

			getFileSystem(function(err, dirEntry){

				if(err){
					return callback && callback(err);
				}

				// extract file-name from path:
				var fileName = /.*\/([^/]+)/.exec(filePath);
				fileName = fileName? fileName[1] : filePath;

				// try to get temporary file (fail, if it already exists)
				dirEntry.getFile(fileName, {create: false, exclusive: true}, function(fileEntry) {

					fileEntry.remove(
						function(){
							if(mediaManager._log.isd()) mediaManager._log.debug('['+_pluginName+'] successfully removed file: '+ filePath);
							callback && callback(null);
						}, function(err){
							if(mediaManager._log.ise()) mediaManager._log.error('['+_pluginName+'] ERROR removing file: tried to remove (temporary) file '+ filePath + ', may not exist anymore(?) '+err, err);
							callback && callback(err);
					})

				}, function(err){
					if(mediaManager._log.ise()) mediaManager._log.error('['+_pluginName+'] ERROR removing file: tried to remove (temporary) file '+ cordova.file.cacheDirectory+fileName + ', may not exist anymore(?) '+err, err);
					callback && callback(err);
				});

			});
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
		 * @memberOf mmir.env.media.CordovaAudioOutput#
		 */
		function createDataUrl(blob, callback, errorCallback){

			writeToFile(blob, function(err, url){
				if(err){
					return errorCallback(err);
				}
				callback(url);
			});
		}

		/**
		 * HELPER for releasing data-URL
		 *
		 * @param {String} dataUrl
		 * 			The data URL for the audio blob
		 *
		 * @private
		 * @memberOf mmir.env.media.CordovaAudioOutput#
		 */
		function releaseDataUrl(dataUrl){

			removeFile(dataUrl, function(err){
				if(err){
					mediaManager._log.d('failed to release data-url '+dataUrl);
				}
			});
		}

		//invoke the passed-in initializer-callback and export the public functions:
		callBack({
			/**
			 * @public
			 * @memberOf mmir.env.media.CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#playWAV
			 * @copydoc mmir.MediaManager#playWAV
			 * @function
			 */
			playWAV: function(blob, successCallback, failureCallback){

				var self = this;
				createDataUrl(blob, function(dataUrl){

					self.playURL(dataUrl,
							function onend(){
								releaseDataUrl(dataUrl);
								onEnd && onEnd.apply(this, arguments);
							},
							failureCallback, successCallback);

				}, function(e){
					if(failureCallback){
						failureCallback(e);
					} else {
						mediaManager._log.error('['+_pluginName+'] '+ err, e);
					}
				});

			},
			/**
			 * @public
			 * @memberOf mmir.env.media.CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#playURL
			 * @copy mmir.MediaManager#playURL
			 * @function
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
					} else {
						if(mediaManager._log.ise()) mediaManager._log.error('['+_pluginName+'] failed to play '+url+': '+e, e);
					}
				}
			},
			/**
			 * @public
			 * @memberOf mmir.env.media.CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#play
			 * @copydoc mmir.MediaManager#play
			 * @function play
			 */
			play: mediaManager.play,

			/**
			 * @public
			 * @memberOf mmir.env.media.CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#getWAVAsAudio
			 * @copydoc mmir.MediaManager#getWAVAsAudio
			 */
			getWAVAsAudio: function(blob, callback, onEnd, failureCallback, onInit, emptyAudioObj){

				if(!emptyAudioObj){
					emptyAudioObj = mediaManager.createEmptyAudio();
				}

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

				}, function(err){

					if(failureCallback){
						failureCallback.call(emptyAudioObj, err);
					}
					else {
						mediaManager._log.error('['+_pluginName+'] '+ err, e);
					}
				});

				return emptyAudioObj;
			},
			/**
			 * @public
			 * @memberOf mmir.env.media.CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#getURLAsAudio
			 * @copydoc mmir.MediaManager#getURLAsAudio
			 */
			getURLAsAudio: function(url, onEnd, failureCallback, onCanPlay, audioObj){

				try {

					/**
					 * @private
					 * @memberOf AudioCordovaImpl#
					 */
					var enabled =  audioObj? audioObj._enabled : true;

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
					 * @hideconstructor
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
					if(failureCallback){
						failureCallback(e);
					} else {
						if(mediaManager._log.ise()) mediaManager._log.error('['+_pluginName+'] failed to initialized audio for '+url+':'+e, e);
					}
				}
			},//END: getURLAsAudio
			/**
			 * @public
			 * @memberOf mmir.env.media.CordovaAudioOutput.prototype
			 * @see mmir.MediaManager#getAudio
			 * @copydoc mmir.MediaManager#getAudio
			 * @function
			 */
			getAudio:  mediaManager.getAudio,

		});//END: callBack({...
	}
};

});//END module wrapper/factory
