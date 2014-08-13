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
 * @name media.plugin.html5AudioOutput
 */
newMediaPlugin = {

		/** @scope media.plugin.html5AudioOutput.prototype */
		
		initialize: function(callBack, mediaManagerInstance){
			
			var _pluginName = 'html5AudioOutput';

			callBack({
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
				getURLAsAudio: function(url, onEnd,  failureCallback, successCallback){
					try {

						var enabled = true;
						var ready = false;
						var my_media = new Audio(url,null,failureCallback);

						my_media.addEventListener('ended', function(){

							//only proceed if we have a media-object (may have already been released)
							if(enabled & mediaImpl){
								mediaImpl.stop();
							}
							if (onEnd){
								onEnd.apply(mediaImpl, arguments);
							}
						}, false);

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


						var mediaImpl = {
								play: function(){
									if (enabled){
										// if (ready){
										my_media.play();
										// } else {
										//	 my_media.addEventListener('canplay', my_media.play, false);
										// }

									};
								},
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
								enable: function(){
									if(my_media != null){
										enabled = true;
									}
									return enabled;
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
									my_media=null;
								},
								setVolume: function(value){
									if(my_media){
										my_media.volume = value;
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
										return my_media.paused;
									}
									return false;
								},
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

