
/**
 * @file This file contains interface definitions. 
 * 		 The interface definitions are purely for documentation and 
 * 		 should not be loaded / executed / or used in any way other
 * 		 than for reference purposes.
 */

/**
 * The Audio abstraction that is returned by {@link mmir.MediaManager#getURLAsAudio}.
 * 
 * <p>
 * NOTE: when an audio object is not used anymore, its {@link #release} method should
 * 		 be called.
 * 
 * <p>
 * 
 * @interface
 * @name IAudio
 * @memberOf mmir.env.media
 * @public
 */
var IAudio = {
	/**
	 * The constructor.
	 * 
	 * <p>
	 * NOTE that audio objects are created with a factory,
	 * e.g. via {@link mmir.MediaManager#getURLAsAudio}.
	 * 
	 * @param {String} url
	 * 			the URL for the audio file
	 * @param {Function} [onPlayedCallback] OPTIONAL
	 * 			callback that is triggered when audio did play and has ended
	 * @param {Function} [failureCallBack] OPTIONAL
	 * 			callback that is triggered when an error occurs (usually during initialization)<br>
	 * 			NOTE: this argument is positional (i.e. onPlayedCallback must be specified, but may be <code>null</code>)
	 * @param {Function} [onLoadedCallBack] OPTIONAL
	 * 			callback that is triggered when audio has been initialized and is ready to be played
	 * 			NOTE: this argument is positional (i.e. onPlayedCallback and failureCallBack must be specified, but may be <code>null</code>)
	 * 
	 * @protected
	 * @function
	 * @name _constructor
	 * @memberOf mmir.env.media.IAudio.prototype
	 * 
	 * @see mmir.MediaManager#getURLAsAudio
	 * 
	 * @example
	 *  var audio = mmir.MediaManager.getURLAsAudio(url, null, null, function onReady(){
	 *  	audio.play();
	 *  });
	 */
	_constructor: function(url, onPlayedCallback, failureCallBack, onLoadedCallBack){},
	/**
	 * Play audio.
	 * 
	 * @public
	 * @name play
	 * @function
	 * @memberOf mmir.env.media.IAudio.prototype
	 */
	play: function(){},
	/**
	 * Stop playing audio.
	 * 
	 * @public
	 * @name stop
	 * @function
	 * @memberOf mmir.env.media.IAudio.prototype
	 */
	stop: function(){},
	/**
	 * Enable audio (should only be used internally).
	 * 
	 * @protected
	 * @name enable
	 * @function
	 * @memberOf mmir.env.media.IAudio.prototype
	 */
	enable: function(){},
	/**
	 * Disable audio (should only be used internally).
	 * 
	 * @protected
	 * @name disable
	 * @function
	 * @memberOf mmir.env.media.IAudio.prototype
	 */
	disable: function(){},
	/**
	 * Release audio: should be called when the audio
	 * file is not used any more.
	 * 
	 * <p>
	 * NOTE some environments - such as Android - have limited resources available.
	 *      Not releasing resources may result in not being able to instantiate new
	 *      (audio) resources.
	 * 
	 * @public
	 * @name release
	 * @function
	 * @memberOf mmir.env.media.IAudio.prototype
	 */
	release: function(){},
	/**
	 * Set the volume of this audio file
	 * 
	 * @param {Number} value
	 * 			the new value for the volume:
	 * 			a number between [0.0, 1.0]
	 * 
	 * @public
	 * @name setVolume
	 * @function
	 * @memberOf mmir.env.media.IAudio.prototype
	 */
	setVolume: function(value){},
	/**
	 * Get the duration of the audio file
	 * 
	 * @returns {Number} the duration in MS (or <code>-1</code> if unknown)
	 * 
	 * @public
	 * @name getDuration
	 * @function
	 * @memberOf mmir.env.media.IAudio.prototype
	 */
	getDuration: function(){},
	/**
	 * Check if audio is currently paused.
	 * 
	 * <p>
	 * NOTE: the state "paused" is a different status than state "stopped".
	 * 
	 * @returns {Boolean} <code>true</code> if paused, <code>false</code> otherwise
	 * 
	 * @public
	 * @name isPaused
	 * @function
	 * @memberOf mmir.env.media.IAudio.prototype
	 */
	isPaused: function(){},
	/**
	 * Check if audio is currently enabled
	 * 
	 * @returns {Boolean} <code>true</code> if enabled
	 * 
	 * @public
	 * @name isEnabled
	 * @function
	 * @memberOf mmir.env.media.IAudio.prototype
	 */
	isEnabled: function(){}
};

/**
 * Audio object that is used for the sound notifications
 * by the {@link mmir.NotificationManager}.
 * 
 * @interface
 * @name INotificationSound
 * @augments mmir.env.media.IAudio
 * @memberOf mmir.env.media
 */
var INotificationSound = {
	/**
	 * The name / identifier for the sound.
	 * 
	 * @public
	 * @type String
	 * @name name
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	name : null,
	/**
	 * Flag for the play status.
	 * 
	 * @protected
	 * @type Boolean
	 * @name isNotificationPlaying
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	isNotificationPlaying : false,
	/**
	 * Field that holds the value for the repeat number:
	 * specifies how many times the sound should be played, before
	 * {@link #isNotificationPlaying} is set to <code>false</code>.
	 * <p>
	 * MUST be <code>>= 1</code>, otherwise the sound will not be played.
	 * 
	 * @protected
	 * @type Number
	 * @name repeatNotification
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	repeatNotification : 0,
	/**
	 * The callback for "finished" events.
	 * 
	 * @protected
	 * @type Function
	 * @name onFinishedListener
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	onFinishedListener : null,
	/**
	 * The callback for "error" events.
	 * 
	 * @protected
	 * @type Function
	 * @name onErrorListener
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	onErrorListener : null,
	/**
	 * Field that holds the value for the repeat number:
	 * specifies how many times the sound should be played, before
	 * {@link #isNotificationPlaying} is set to <code>false</code>.
	 * <p>
	 * MUST be <code>>= 1</code>, otherwise the sound will not be played.
	 * 
	 * @param {Number} repeatNTimes
	 * 					specifies how many times the sound should be played, before
	 * 					{@link #isNotificationPlaying} is set to <code>false</code>.
	 * 					<br>
	 * 					MUST be <code>>= 1</code>, otherwise the sound will not be played.
	 * 		
	 * 
	 * @public
	 * @function
	 * @name playNotification
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	playNotification : function(repeatNTimes){},
	/**
	 * Set callback functions for when the sound has finished playing, and
	 * for errors.
	 * <p>
	 * The sound finishes playing, when its audio object has been played
	 * <code>repeatNTimes</code> as specified when invoking
	 * <code>function playNotification(repeatNTimes)</code>.
	 * 
	 * 
	 * @param {Function} onFinished
	 * 				the callback for the finished event
	 * @param {Function} onError
	 * 				the callback for errors
	 * 
	 * @public
	 * @function
	 * @name setCallbacks
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	setCallbacks : function(onFinished, onError){},
	/**
	 * Clears the "finished" and "error" callbacks.
	 * 
	 * @public
	 * @function
	 * @name clearCallbacks
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	clearCallbacks : function(){},
	/**
	 * Fires the "finished" event for its callback (if one is set).
	 * 
	 * @protected
	 * @function
	 * @name fireFinished
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	fireFinished : function(){},
	/**
	 * Fires the "error" event for its callback (if one is set).
	 * 
	 * @param {any} error
	 * 			the error that occurred
	 * 
	 * @protected
	 * @function
	 * @name fireError
	 * @memberOf mmir.env.media.INotificationSound.prototype
	 */
	fireError : function(error){}
};