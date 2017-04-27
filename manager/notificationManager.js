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


define(['module', 'constants', 'mediaManager', 'dictionary'], 
	/**
	 * 
	 * @name NotificationManager
	 * @memberOf mmir
	 * @static
	 * @class
	 * 
	 * @requires Dictionary
	 * @requires mmir.MediaManager
	 */
	function(
		module, constants, mediaManager, Dictionary
){
	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope mmir.NotificationManager.prototype *///for jsdoc2
	
	
    //private members
	
	
	/**
	 * TODO replace by "real" ENV mechanism ... instead of !forBrowser / ! constants.isBrowserEnv()
	 * 
	 * @private
	 * @memberOf NotificationManager#
	 */
	var isCordovaEnv = ! constants.isBrowserEnv();
	
	/**
	 * @private
	 * @memberOf NotificationManager#
	 */
    var instance = null;
    
    
    //private methods
    
    /**
	 * Constructor-Method of Singleton mmir.NotificationManager.<br> 
	 * 
	 * @constructs NotificationManager
	 * @memberOf NotificationManager#
	 * @ignore
	 */
    function constructor(){
    	
    	/**
    	 * @private
    	 * @memberOf NotificationManager.prototype
    	 */
    	var INIT = 'init';
    	
    	/**
    	 * VIBRATE initialization status
    	 * @private
    	 * @memberOf NotificationManager.prototype
    	 */
    	var isHapticEnabled = true;

    	/**
    	 * Implementation for vibrate-function:
    	 * platform-dependent (if platform/device does not support it: as stub-function)
    	 * 
    	 * @private
    	 * @type {Function}
    	 * @memberOf NotificationManager.prototype
    	 */
    	var doVibrate = null;
    	
    	/**
    	 * Implementation for confirm-function:
    	 * shows "native" platform-specific confirm-dialog.
    	 * 
    	 * <code>function(message, confirmCallback, title, buttonLabels)</code>
    	 * 
    	 * @private
    	 * @type {Function}
    	 * @memberOf NotificationManager.prototype
    	 */
    	var doConfirm = null;
    	
    	/**
    	 * Implementation for confirm-function:
    	 * shows "native" platform-specific alert-dialog.
    	 * 
    	 * <code>(message, alertCallback, title, buttonName)</code>
    	 * 
    	 * @private
    	 * @type {Function}
    	 * @memberOf NotificationManager.prototype
    	 */
    	var doAlert = null;
    	
    	/**
    	 * Initialize the NotificationManager.
    	 * 
    	 * At the moment this set the internal vibrate-function,
    	 * if available in the current execution environment
    	 * (or with a dummy function, if not).
    	 * 
    	 * In addition, the alert-, and confirm-functions are set to their
    	 * platform-specific implementation.
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 * @private
    	 * @function
    	 */
    	var _init = function(){
	    	if(isCordovaEnv){
	    		
	    		if(navigator.notification && navigator.notification.vibrate){
//		    		console.debug('Vibrate: navigator.notification');
	    			/** @ignore */
		    		doVibrate = function vibrate(n){ navigator.notification.vibrate(n); };
	    		}
	    		else {
	    			console.warn('NotificationManager.INIT: could not detect navigator.notification.vibrate, using NOOP dummy instead.');
	    			/** @ignore */
	        		doVibrate = function dummyVibrate(n){ console.error('NotificationManager.vibrate('+n+') triggered in CORDOVA environment, but no VIBRATE functionality available.'); };// DEBUG
	    		}
	    		
	    	}
	    	else if (navigator.vibrate){
//	    		console.debug('Vibrate API');
	    		/** @ignore */
	    		doVibrate = function vibrate(n){ navigator.vibrate(n); };
	    	}
	    	else if (navigator.webkitVibrate){
//	    		console.debug('Vibrate: webkit');
	    		/** @ignore */
	    		doVibrate = function vibrate(n){ navigator.webkitVibrate(n); };
	    	}
	    	
	    	//set confirm-implementation
	    	if(navigator.notification && navigator.notification.confirm){
//	    		console.debug('Confirm: navigator.notification');
    			/** @ignore */
	    		doConfirm = function confirm(message, confirmCallback, title, buttonLabels){
	    			
	    			var cbWrapper = confirmCallback;
	    			if(confirmCallback){
	    				var self = this;
		    			cbWrapper = function(result){
		    				//need to convert NUMBER result to BOOLEAN:
		    				//  result = [1,2,..] 
		    				//  -> default is: OK = 1, CANCEL = 2, close-the-dialog = 0
		    				var res = result === 1 ? true : false;
		    				confirmCallback.call(self, res);
		    			};
	    			}
	    			
	    			navigator.notification.confirm(message, cbWrapper, title, buttonLabels);
	    		};
    		}
    		else if(typeof window !== 'undefined' && window && window.confirm) {
    			/** @ignore */
    			doConfirm = function confirmWindow(message, confirmCallback, title, buttonLabels){
    				//TODO use setTimeout here to "simulate" async execution?
    				var result = window.confirm(message);
    				if(confirmCallback){
    					confirmCallback.call(this, result);
    				}
    			};
    		}
	    	
	    	//set alert-implementation
	    	if(navigator.notification && navigator.notification.alert){
//	    		console.debug('Alert: navigator.notification');
    			/** @ignore */
	    		doAlert = function confirm(message, alertCallback, title, buttonLabels){
	    			navigator.notification.alert(message, alertCallback, title, buttonLabels);
	    		};
    		}
    		else if(typeof window !== 'undefined' && window && window.alert){
    			/** @ignore */
    			doAlert = function confirmWindow(message, alertCallback, title, buttonLabels){
    				//TODO use setTimeout here to "simulate" async execution?
    				window.alert(message);
    				if(alertCallback){
    					alertCallback.call(this);
    				}
    			};
    		}
    	};
    	
    	
    	//SOUND / BEEP initialization:
    	
    	/**
    	 * @private
    	 * @type Number
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 */
    	var beepVolume = 1.0;
    	
    	/**
    	 * The Audio object for the <em>beep</em> sound.
    	 * 
    	 * @private
    	 * @type AudioObject
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 */
    	var beepAudio = null;
    	
    	/**
    	 * Dictionary that manages the currently loaded sounds
    	 * 
    	 * @private
    	 * @type Dictionary
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 */
    	//TODO add option for limiting size of soundMap (-> e.g. how many resources are max. cached/occupied for Android) 
    	var soundMap = new Dictionary();
    	
    	/**
    	 * Factory function for creating "sounds objects",
    	 * i.e. extend the basic Audio objects with needed functions/properties
    	 * 
    	 * @private
    	 * @function
    	 * 
    	 * @param {mmir.env.media.IAudio} audioObj
    	 * @param {String} name
    	 * 
    	 * @returns {mmir.env.media.INotificationSound} the extended audio object, i.e. a NotificationSound
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 */
    	function initNotificationSound(audioObj, name){
    		audioObj.name = name;
    		audioObj.setVolume(beepVolume);
			audioObj.isNotificationPlaying = false;
			audioObj.repeatNotification = 0;
			audioObj.playNotification = function(repeatNTimes){
				
//				console.debug('isPlaying: '+this.isNotificationPlaying+', repeat: '+this.repeatNotification+',  args: '+repeatNTimes+'');
				
				//"blocking mode": only re-start, if not already playing
				if(!this.isNotificationPlaying){
					this.repeatNotification = repeatNTimes ? repeatNTimes : 0;
				}
				
				if( this.repeatNotification < 1){
					//end recurusion
					this.isNotificationPlaying = false;
					this.repeatNotification = 0;
				}
				else {
					this.isNotificationPlaying = true;
					--this.repeatNotification;
//					this.stop();
					this.play();
				}
			};
			
			audioObj.setCallbacks = function(onFinished, onError){
				this.onFinishedListener = onFinished;
				this.onErrorListener = onError;
			};
			audioObj.clearCallbacks = function(){
				this.onFinishedListener = null;
				this.onErrorListener = null;
			};
			audioObj.fireFinished = function(){
				
				var tempOnFinishedListener = this.onFinishedListener;
				//clear callbacks
				// NOTE: do this before triggering callback, in case the callback re-plays the notification with new callbacks!
				//       (if we would clear callbacks after invocation, we would delete the new callbacks!)
				this.clearCallbacks();
				if(tempOnFinishedListener){
					tempOnFinishedListener();
				}
			};
			audioObj.fireError = function(error){
				
				var tempOnErrorListener = this.onErrorListener;
				//clear callbacks
				// NOTE: do this before triggering callback, in case the callback re-plays the notification with new callbacks!
				//       (if we would clear callbacks after invocation, we would delete the new callbacks!)
				this.clearCallbacks();
				
				//create error message with details
				var id;
				if(this.name){
					var entry = soundMap.get(this.name);
					id = '"' + this.name + '" -> ' + (entry? '"'+entry.url+'"' : 'UNDEF'); 
				}
				else {
					id = '"BEEP" -> "'+constants.getBeepUrl()+'"'; 
				}
				var msg = 'Notification: Error playing the sound for notification '+id;
				
				//create Error object if necessary
				if(!error){
					error = new Error(msg);
					msg = null;
				}
				
				
				if(tempOnErrorListener){
					tempOnErrorListener(error, msg);
				}
				else {
					//if no callback: print debug output in error stream:
					console.error( (msg? msg + ': ' : '') + error);
				}
			};
			
			return audioObj;
    	};
    	
    	/**
    	 * Helper for creating an Audio object
    	 * 
    	 * @private
    	 * @function
    	 * 
    	 * @param {String} url
    	 * @param {Function} success
    	 * @param {Function} fail
    	 * @param {Function} init
    	 * 
    	 * @returns {AudioObject} audio object
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 */
    	function createAudio(url, success, fail, init){
    		return mediaManager.getURLAsAudio(url, success, fail, init);
    	}
    	
    	/**
    	 * Helper for "registering" a NotificationSound.
    	 * 
    	 * Stores the sound object in {@link #soundMap}
    	 * with the ID <code>name</code>.
    	 * 
    	 * The sound object will be initialized on first
    	 * retrieval, ie. {@link #doGetSoundFromMap}
    	 * 
    	 * @private
    	 * @function
    	 * 
    	 * @param {String} name
    	 * @param {String} theUrl
    	 * @param {Boolean} isKeepOnPause
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 */
    	function initAudioSoundEntry(name, theUrl, isKeepOnPause){
    		var config = {url: theUrl, audio: null};
    		if(isKeepOnPause){
    			config.isKeepOnPause = true;
    		}
    		soundMap.put(name, config);
    	}
    	
    	/**
    	 * Helper for retrieving an existing sound from
    	 * the {@link #soundMap}.
    	 * 
    	 * Initializes the sound if necessary.
    	 * 
    	 * @private
    	 * @function
    	 * 
    	 * @param {String} name
    	 * @param {Function} onErrorCallback
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 */
    	function doGetSoundFromMap(name, onErrorCallback){
    		var audioObj = null;
    		var audioUrl = null;
    		var keepOnPause = false;
    		
    		//if no name: use default beep
    		if(!name){
    			audioObj = beepAudio;
    			audioUrl = constants.getBeepUrl();
    		}
    		else {
    			//retrieve information for sound
    			var soundEntry = soundMap.get(name);
    			if(soundEntry === INIT){
    				//TODO set repeat-times?
    				
    				//sound is still initializing -> return
    				return null; ////////////////////// EARLY EXIT //////////////////////
    			}
    			
    			if(!soundEntry){
    				var errMsg = 'NotificationManager: no sound "'+name+'" initialized!';
    				if(onErrorCallback){
    					onErrorCallback(errMsg);
    				}
    				else {
    					console.error(errMsg);
    				}
//    				throw new Error(errMsg);
    				return null; ////////////////////// EARLY EXIT //////////////////////
    			}
    			
    			audioObj = soundEntry.audio;//<- may be null
    			audioUrl = soundEntry.url;//<- must NOT be null
    			keepOnPause = soundEntry.isKeepOnPause? true : false;
    		}
    		
    		return {
    			sound: audioObj,
    			url: audioUrl,
    			isKeepOnPause: keepOnPause
    		};
    	}
    	
    	/**
    	 * Helper for playing a registered notification sound.
    	 * 
    	 * Initializes the sound if necessary.
    	 * 
    	 * @private
    	 * @function
    	 * 
    	 * @param {String} name
    	 * 				ID of the sound
    	 * @param {Number} times 
    	 * @param {Function} onFinishedCallback
    	 * @param {Function} onErrorCallback
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 */
    	function playAudioSound(name, times, onFinishedCallback, onErrorCallback){
    		
    		var soundEntry = doGetSoundFromMap(name, onErrorCallback);
    		
    		if(soundEntry === null){
    			//could not retrieve sound-object
    			// (error callback will already have been invoked, so just return)
    			return;/////////////////////// EARYL EXIT ///////////
    		}
    		
    		var audioObj = soundEntry.sound;
    		var audioUrl = soundEntry.url;
    		var isKeepOnPause = soundEntry.isKeepOnPause;

    		//create audio-object, if not existing yet
    		if(audioObj === null){
    			
    			if(name){
    				soundMap.put(name, INIT);
    			}

    			audioObj = createAudio(
    					audioUrl,
    					function onFinished(){ 
    						this.playNotification();

    						audioObj.fireFinished();
    					}, 
    					function onError(e){ 
    						if(name) {
    							soundMap.remove(name);
    						};
    						
    						if(audioObj && audioObj.fireError){
    							audioObj.fireError(e);
    						}
    						else {
    							if(onErrorCallback){
    								onErrorCallback(e);
    							}
    							else {
    								console.error('Notification: Error playing the sound from "'+audioUrl+'": '+e);
    							}
    						}
    					},
    					function onInit(){ 
    						
    						//FIX for Android/Cordova: return-value of createAudio will not set audioObj "fast enough"
    						// 						   (i.e. may not use async-initialization, depending on where the audio-file is located)
    						//						   ... in order to be able to use keep variable audioObj useful -> do assignment now/here
    						audioObj = this;

    	    				initNotificationSound(audioObj, name);
    	    				audioObj.setCallbacks(onFinishedCallback, onErrorCallback);
    	    				
    	    	    		//if no name: assume default beep
    	    				if(!name){
    	    					beepAudio = audioObj;
    	    	    		}
    	    				else {
    	    					var theEntry = {url: audioUrl, audio: audioObj};
    	    					if(isKeepOnPause){
    	    						theEntry.isKeepOnPause = true;
    	    					}
    	    					soundMap.put(name, theEntry);
    	    				}
    	    				
    						audioObj.playNotification(times);
    	    				
    	    			}
    			);
    			
//    			//FIXME this is a QUICK-FIX:
//    			//		Android needs invocation of a media-method, before it triggers the on-init callback.
//    			//		We need to do this here, not within the
//    			if(isCordovaEnv){
//    				audioObj.init();
//    			}
    		}
    		else {
				audioObj.setCallbacks(onFinishedCallback, onErrorCallback);
    			audioObj.playNotification(times);
    		}
    		
    	}
    	
    	/**
    	 * Helper for stop playing a registered notification sound.
    	 * 
    	 * Initializes the sound if necessary.
    	 * 
    	 * @private
    	 * @function
    	 * 
    	 * @param {String} name
    	 * 				ID of the sound
    	 * @param {Function} onFinishedCallback
    	 * @param {Function} onErrorCallback
    	 * 
    	 * @memberOf NotificationManager.prototype
    	 */
    	function stopAudioSound(name, onFinishedCallback, onErrorCallback){
    		
    		var soundEntry = doGetSoundFromMap(name, onErrorCallback);
    		

//			console.error('Notification: invoked stop on notification-sound '+name+' -> '+JSON.stringify(soundEntry));//FIXM debug
    		
    		if(soundEntry === null){
    			//could not retrieve sound-object
    			// (error callback will already have been invoked, so just return)
    			return;/////////////////////// EARYL EXIT ///////////
    		}
    		
    		var audioObj = soundEntry.sound;
    		//NOTE audioObj may be null, e.g. if sound is still initializing.
    		
    		if(audioObj != null){
    			if(audioObj.repeatNotification > 0)
    				audioObj.repeatNotification = 0;
    			if(audioObj.isNotificationPlaying === true)
    				audioObj.isNotificationPlaying = false;
    			if(audioObj.stop){
//  				console.error('Notification: stopping notification-sound -> '+name);//FIXM debug
    				audioObj.stop();
    			}
    		}
    		
    		if(onFinishedCallback){
    			onFinishedCallback.call(audioObj);
    		}
    		
    	};
    	
    	//on Android: release resources on pause/exit, since they are limited
    	if(isCordovaEnv){
    		
    		document.addEventListener("resume", function(event){
    			//initialize beep sound:
        		playAudioSound(null, 0);
    		});
    		
    		document.addEventListener(
    				"pause", 
    				function(event){
    					
    					//use temporal variable for minimizing concurrency problems
    					var temp;
    					
    					if(beepAudio !== null){
    						
    						temp = beepAudio;
    						beepAudio = null;
    						temp.release();
    						
    						console.info('Notification: released media resources for beep.');
    					}
    					
    					var keys = soundMap.getKeys();
    					for(var i = keys.length - 1; i >= 0; --i){
    						
    						var entry = soundMap.get(keys[i]);
	    					if(entry !== null && entry != INIT && ! entry.isKeepOnPause){
	    						
	    						temp = entry.audio;
	    						
	    						//audio may not be initialized yet:
	    						if(temp != null){
		    						entry.audio = null;
		    						temp.release();
	    						}
	    						
	    						console.info('Notification: released media resources for '+entry.url);
	    					}
    					}
    				},
    				false
    		);
    	}
    	
		/** @lends mmir.NotificationManager.prototype */
    	return { //public members and methods
    		/** @scope mmir.NotificationManager.prototype */
            
        	/**
        	 * Trigger a haptic vibration feedback.
        	 * 
        	 * <p>Note: The device / execution environment may not support haptic vibration feedback
        	 * 
        	 * @function
        	 * @param {Number} milliseconds
        	 * 		duration for vibration in milliseconds. Must be <code>> 0</code>
        	 * @public
        	 * 
        	 * @memberOf mmir.NotificationManager.prototype
        	 */
            vibrate: function(milliseconds){
            	if (isHapticEnabled && doVibrate){
            		doVibrate(milliseconds);
            	}
            },
            /**
             * Check if {@link #vibrate} is functional and enabled.
             * 
             * <p>
             * If <code>false</code> is returned, calling the <code>vibrate()</code>
             * function will have no effect.
             * 
        	 * @function
        	 * @returns {Boolean} <code>true</code> if {@link #vibrate} is functional
        	 * @public
        	 */
            isVibrateEnabled: function(){
            	if (isHapticEnabled && doVibrate){
            		return true;
            	}
            	else {
            		return false;
            	}
            },
            /**
             * Check if the execution environment supports {@link #vibrate}.
             * 
             * <p>
             * If <code>false</code> is returned, calling the <code>vibrate()</code>
             * function will have no effect.
             * 
        	 * @function
        	 * @returns {Boolean} <code>true</code> if {@link #vibrate} is functional
        	 * @public
        	 */
            isVibrateAvailable: function(){
            	if (doVibrate){
            		return true;
            	}
            	else {
            		return false;
            	}
            },
            /**
             * Enable or disable {@link #vibrate}.
             * <p>
             * NOTE: If {@ #isVibrateAvailable} returns <code>false</code>, enabling will have no effect.
             * 
        	 * @function
        	 * @public
        	 * 
        	 * @param {Boolean} enabled
        	 * 			set vibrate function to <code>enable</code>
        	 */
            setVibrateEnabled: function(enabled){
            	isHapticEnabled = enabled;
            },
            /**
             * Opens a (native) alert-notification dialog.
             * 
             * @param {String} message
             * 				the alert message
             * @param {Function} [alertCallback]			
             * 				callback that is triggered, after dialog was closed
             * @param {String} [title] OPTIONAL
             * 				the title for the alert dialog
             * 				(may not be provided / settable in all execution environments)
             * @param {String} [buttonName] OPTIONAL
             * 				the label for the close button in the alert dialog
             * 				(may not be provided / settable in all execution environments)
             * @function
             * @public
             */
            alert: function(message, alertCallback, title, buttonName){
            	if(doAlert){
            		doAlert.call(this, message, alertCallback, title, buttonName);
            	}
            	else {
            		console.warn('NotificationManager.alert: No alert dialog implementation available ', message, alertCallback, title, buttonName);
            	}
            },
            /**
             * Opens a (native) confirm-notification dialog.
             * 
             * @param {String} message
             * 				the confirm message
             * @param {Function} [alertCallback]			
             * 				callback that is triggered, after dialog was closed.
             * 				The callback will be invoked with 1 argument:<br>
             * 				<code>callback(wasConfirmed : Boolean)</code><br>
             * 				if the OK/CONFIRM button was pressed, <code>wasConfirmed</code>
             * 				will be <code>true</code>, otherwise <code>false</code>.
             * @param {String} [title] OPTIONAL
             * 				the title for the confirm dialog
             * 				(may not be provided / settable in all execution environments)
             * @param {Array<String>} [buttonLabels] OPTIONAL
             * 				the labels for the buttons of the confirm dialog
             * 				(may not be provided / settable in all execution environments)
             * 
             * @function
             * @public
             */
            confirm: function(message, confirmCallback, title, buttonLabels){
            	if(doConfirm){
            		doConfirm.call(this, message, confirmCallback, title, buttonLabels);
            	}
            	else {
            		console.warn('NotificationManager.confirm: No confirm dialog implementation available ', message, confirmCallback, title, buttonLabels);
            	}
            },
            /**
             * Trigger a beep notification sound.
             * 
             * @function
             * @param {Number} times
             * 			how many times should to beep repeated
             * @public
             */
            beep: function(times){
        		if (times>0){
        			playAudioSound(null, times);
        		}
            },
            
            getVolume: function(){
            	return beepVolume;
            },
            /**
             * Set the volume for sound notifications.
             * 
             * @param {Number} vol
             * 			the new volume: a number between [0, 1]
             * 
             * @see mmir.env.media.IAudio#setVolume
             */
            setVolume: function(vol){
            	if(typeof vol !== 'number'){
            		throw new TypeError('argument vol (value: '+vol+') must be a number, but is instead: '+(typeof vol));
            	}
            	
            	if(vol !== beepVolume){
            		
            		//set volume for beep notification
	            	beepVolume = vol;
	            	if(beepAudio){
	            		beepAudio.setVolume(beepVolume);
	            	}
	            	
	            	//set volume for notification sounds
	            	var keys = soundMap.getKeys();
	            	var entry = null;
	            	for(var i = 0, size = keys.length; i < size; ++i){
	            		entry = soundMap.get(keys[i]);
	            		if(entry.audio !== null){
	            			entry.audio.setVolume(vol);
	            		}
	            	}
	            	
            	}
            }
            
            /**
             * Trigger a sound notification by NAME (needs to be created first).
             * 
             * @function
             * @param {String} name
             * 				the name / identifier for the sound (if <code>null</code>, beep notification is used)
             * @param {Number} times
             * 				how many times should to beep repeated
             * @public
             * 
             * @see #createSound
             */
            ,playSound: function(name, times, onFinished, onError){
        		if (times>0){
        			playAudioSound(name, times, onFinished, onError);
        		}
            },
            /**
             * Create a sound notification.
             * 
             * <p>
             * After creation, the sound "theSoundId" can be played via 
             * <code>playSound("theSoundId", 1)</code>
             * 
             * @function
             * @param {String} name 
             * 			the name / identifier for the sound
             * @param {String} url
             * 			the URL for the audio of the sound
             * @param {Boolean} [isKeepOnPause] OPTIONAL
             * 			flag indicating, if the audio resources should be keept
             * 			when the device goes into <em>pause mode</em>
             * 			(may not apply to all execution environments; 
             * 			 e.g. relevant for Android environment)
             * 			<br>
             * 			DEFAULT: <code>false</code> 
             * @public
             */
            createSound: function(name, url, isKeepOnPause){ // TODO add callbacks? this would make the impl. more complex ..., successCallback, errorCallback){
            	initAudioSoundEntry(name, url, isKeepOnPause);

            	//DISABLED this triggers an error if MediaManager / LanguageManager etc. are not initialized yet!
//            	console.error('created sound "'+name+'" for url "'+url+'", calling from: ' + new Error().stack);
//            	//immediately initialize the sound (but do not play it yet);
//            	playAudioSound(name, 0);
            }
            /**
             * Stop a sound notification, if it is playing.
             * 
             * Has no effect, if the notification is not playing.
             * 
             * @function
             * @param {String} name 
             * 			the name / identifier for the sound
             */
            ,stopSound: function(name){
        		stopAudioSound(name);
            }
            
            , initBeep: function(){//<- used by framework to initialize the default beep-sound
            	//initialize beep sound:
        		playAudioSound(null, 0);
            }
            /**
             * Initialize a sound notification.
             * 
             * <p>
             * NOTE a sound does not need to be explicitly initialized, <code>playSound</code> will
             * automatically initialize the sound if necessary.
             * 
             * <p>
             * Initializing a sound prepares all resources, so that the sound can be immediately played.
             * 
             * For instance, a sound that needs to loaded from a remote server first, may take some time
             * before it can be played.
             * 
             * <p>
             * NOTE the sound must be {@link #createSound|created} first, before initializing it.
             * 
             * @function
             * @param {String} name 
             * 			the name / identifier for the sound
             * @public
             * 
             * @see #createSound
             */
            , initSound: function(name){
            	//initialize sound (identified by its name):
        		playAudioSound(name, 0);
            }
            , init: function(){//<- used by framework to initialize the NotificationManager
            	_init();
            	this.init = function(){ return this; };
            	
            	return this;
            }
        };
    }
    
    instance = new constructor();
    	    
	/**
	 * @deprecated instead: use mmir.NotificationManager directly
	 * 
	 * @function
	 * @name getInstance
	 * @memberOf mmir.NotificationManager#
	 */
	instance.getInstance = function(){
		return instance;
	};
    		
    return instance;
    
});//END: define(..., function(){...