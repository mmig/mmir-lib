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

/**
 * @name media.plugin.cordovaAudioInput
 */
newMediaPlugin = {
		/** @scope media.plugin.cordovaAudioInput.prototype */
		initialize: function(callBack){
			
			var _pluginName = 'codovaAudioOutput';
			
			callBack({
				
				playWav: function(blob, successCallback, failureCallback){
					try {
						var blobURL = window.URL.createObjectURL(blob);
						var my_media = new Media(
								blobURL,
								function(){ 
//									console.log('WAV Audio created');

									my_media.release();
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
								} ,
								failureCallback
						);

						my_media.play();
					} catch (e){
						if(failureCallback){
							failureCallback.apply(my_media,arguments);
						}
					}
				},
				
				getURLAsAudio: function(url, onEnd, failureCallback, onCanPlay){
					
					try {
//						console.log(url);
						var my_media = null;

						var playStatus = 0;
						my_media = new Media(
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
						var enabled = true;
						var mediaImpl = {
								play: function(){
									if (enabled){
										my_media.play();
									}
								},
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
									}
									
//									if(playStatus == 2){//playing
//										my_media.stop();
//									}
//									else if(playStatus == 3){//paused
//										my_media.seekTo(0);
//									}
////									my_media.stop();
								},
								enable: function(){
									enabled = true;
								},
								disable: function(){
									if(enabled){
										this.stop();
										enabled = false;
									}
								},
								release: function(){
									if(enabled && ! this.isPaused()){
										this.stop();
									}
									enabled= false;
									if(my_media){
										my_media.release();
									}

								},
								setVolume: function(value){
									if(my_media){
										my_media.setVolume(value);
									}
								},
								getDuration: function(){
									if(my_media){
										return my_media.duration;
									}
									return -1;
								},
								isPaused: function(){
									if(my_media){
										return playStatus == 3;
									}
									return false;
								},
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
				}//END: getURLAsAudio
				
			});//END: callBack({...
		}
};