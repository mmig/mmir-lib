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
 * @name media.plugin.html5AudioInput
 */
newMediaPlugin = {
		
	/** @scope media.plugin.html5AudioInput.prototype */
		
	initialize: function(callBack, mediaManagerInstance){
		
		var _pluginName = 'html5AudioInput';
		
		var languageManager = require('languageManager');
		var configurationManager = require('configurationManager');
		var mediaManager = require('mediaManager');
		var constants = require('constants');
		var commonUtils = require('commonUtils');
		
		/**
		 * @constructs media.plugin.html5AudioInput
		 */
		function htmlAudioConstructor(){
			
			// variable that describes if recording is in process
			var recording = false;
			var freeIds = [true];
			var hasActiveId = false;
			var webSocket = null;
			var nonFunctional = false;
			var lastBlob = false;
			var isUseIntermediateResults = false;
			var inputId = 0;
			var audio_context=null;
			var stream = null;
    		var recorder=null;
    		var totalText = '';
    		//the function that is called on the recognized text that came back from the server
    		var textProcessor = function(e,id){};
    		var silenceDetection = null;
    		var silenceDetectionInput = null;
    		var endOfSpeechDetection = false;
    		var currentFailureCallback = null;
    		
    		//for gathering partial ASR results when using startRecord:
    		var recordAsrResultCache = [];
    		var recordAsrResultSorter = function(a,b){return a.id - b.id;};
    		var asrResultCacheToString = function(cache){
    			var size = cache.length;
    			var sb = new Array(size);//use "StringBuffer" for concatenating partial results
    			for(var i = 0; i < size; ++i){
    				sb[i] = cache[i].text;
    			}
    			return sb.join('');
    		};
    		function findLowestFreeId(){
    			for (var i=0;i<freeIds.length;i++){
    				if (freeIds[i]){
    					freeIds[i] = false;
    					return i;
    				}
    			}
    			freeIds.push(false);
    			return freeIds.length-1;
    		}
    		var recordAsrResultAggregator = function printResult(res,id){
    			recordAsrResultCache.push({
    				text: res,
    				id:id
    			});
    			recordAsrResultCache.sort(recordAsrResultSorter);

    			//FIXME debug output:
//    			console.debug( asrResultCacheToString(recordAsrResultCache) );
    		};
    		
    		function webSocketSend(msg){
    			if(!webSocket || webSocket.readyState >= 2){//INVALID or CLOSING/CLOSED
    				webSocket = null;//<- avoid close() call in initializer
    				initializeWebSocket( function(){ webSocket.send(msg); });
    			}
    			else if(webSocket.readyState == 0){//CONNECTING
    				if(webSocket.onInitStack){
    					webSocket.onInitStack.push(msg);
    				}
    				else {
    					webSocket.onInitStack = [msg];
    				}
    			}
    			else{
    				try{//FIXME this should not be necessary...
    					webSocket.send(msg);
    				} catch(err){
    					console.error(err);
    				}
    			}
    			
    		}
    		/** initializes the connection to the googleMediator-server, 
    		 * where the audio will be sent in order to be recognized. **/
      		 function initializeWebSocket(oninit){ 
      			 if (webSocket){
      				 webSocket.close();
      			 }
      			 webSocket = new WebSocket(configurationManager.getString( [_pluginName, "webSocketAddress"] ));
      			
      			 
      			 webSocket.onopen = function () {
      				if(oninit){
      					console.log("invoking on-init callback for websocket");
      					oninit();
      				}
      				
      				if(this.onInitStack){
      					for(var i=0, size = this.onInitStack; i < size; ++i){
      						this.send(this.onInitStack[i]);
      					}
      					delete this.onInitStack;
      				}
      			 };
      			 
      			 webSocket.onmessage = function(e) {
      				 if (e.data.substring(0,5) == 'ERROR'){
      					 console.error('Serverside Error '+e.data.substring(6));  	
      					 return;/////////////////// EARLY EXIT ////////////////////
      				 }
      				 var id = e.data.substring(0,e.data.indexOf("_"));
      				 this.send("clear "+ id);
      				 freeIds[id] = true;
      				 var jsonText = e.data.substring(e.data.indexOf("_")+1, e.data.length);

          			//FIXME debug output:
          			console.debug('HTML5-Speech-Recoginition_received ASR: '+jsonText );
		      		if(jsonText && jsonText.length > 0){//FIXME
		      				 var jsonResponse = JSON.parse(jsonText);
		      				 if (jsonResponse.hypotheses.length>0){
		      					 if(textProcessor){
		      						 textProcessor(jsonResponse.hypotheses[0].utterance, id);
		      					 }
		      					 
		      					 //aggregate / gather text-parts into the recordAsrResultCache:
		      					 recordAsrResultAggregator(jsonResponse.hypotheses[0].utterance, id);
		      				 }
		//      				 //ELSE: empty result (nothing was recognized)
		//      				 //		-> still need to notify the the textProcessor
		//      				 //		FIXME really, this is only necessary when stopping the ASR/recording (but would need to recoginze this case...)
		//      				 else if(textProcessor){
		//  						 textProcessor('', id);
		//      				 }    				 
		     				 else if(lastBlob || isUseIntermediateResults){
		  						 textProcessor('');
		      				 }
		      				 lastBlob = false;
		      		}
		      		else if(lastBlob || isUseIntermediateResults){
						 textProcessor('');
					 }
					 lastBlob = false;
      			 };	
      			 webSocket.onerror = function(e) {
       				
       				recorder && recorder.stop();
       				lastBlob=false;
     				silenceDetection && silenceDetection.postMessage({command: 'cancel'});

       				 if (currentFailureCallback){
       					 currentFailureCallback(e);
       				 }
       				 else {
       				 	console.error('Websocket Error: '+e  + (e.code? ' CODE: '+e.code : '')+(e.reason? ' REASON: '+e.reason : ''));
       				 }
       			 };
       			webSocket.onclose = function(e) {
       				console.info('Websocket closed!'+(e.code? ' CODE: '+e.code : '')+(e.reason? ' REASON: '+e.reason : ''));
       			};
      		 }
      		 
      		 function createAudioScriptProcessor(audioContext, bufferSize, numberOfInputChannels, numberOfOutputChannels){
      		    	if(audioContext.context.createJavaScriptNode){
      		    		return audioContext.context.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
      		    	}
      		    	else if(audioContext.context.createScriptProcessor){
      		    		return audioContext.context.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
      		    	}
      		    	else {
      		    		throw Error('Could not create script-processor for AudioContext: context provides no function for generating processor!');
      		    	}
      		    
      		 }
      		 
		    /**
		     * creates a new AudioNode, that communicates sound to the silence detector
		     */
		    function startNewInputNode(){
//		    	if (silenceDetectionInput) {
//		    		silenceDetectionInput.onaudioprocess= function(e){};
//		    	}
//		    	var input = audio_context.createMediaStreamSource(stream); 	    		    
//		    	silenceDetectionInput = createAudioScriptProcessor(input, configurationManager.get([_pluginName, "soundPackageSize"]), 2, 2);
//		    	silenceDetectionInput.onaudioprocess = function(e){
//		    		if (recording){
//		    			silenceDetection.postMessage({
//		    				command: 'isSilent',
//		    				buffer: e.inputBuffer.getChannelData(0)
//		    			});
//		    		}
//		    	};
//		    	input.connect(silenceDetectionInput);
//		    	silenceDetectionInput.connect(input.context.destination);    

		    }
    		
    		/**
    		 * creates Silence detector and recorder and connects them to the input stream
    		 * @param inputstream
    		 */
    		function startUserMedia(inputstream){
    			var buffer = 0;
    			stream = inputstream;
    			var input = audio_context.createMediaStreamSource(stream);
    			var recorderWorkerPath = constants.getWorkerPath()+'recorderWorkerExt.js';
    			recorder = new Recorder(input, {workerPath: recorderWorkerPath});
    			
    			//FIXME experimental callback/listener for on-start-record -> API may change!
    			var onStartRecordListeners = mediaManagerInstance.getListeners('onallowrecord');
    			for(var i=0, size = onStartRecordListeners.length; i < size; ++i){
    				onStartRecordListeners[i](input, audio_context, recorder);
    			}
    			
    			
//    			silenceDetection = new Worker(configurationManager.get([_pluginName, "silenceDetectorPath"]));
//    			silenceDetection.onmessage = function (e){
//    				console.log(e.data);
//    				if (e.data=='Send partial!'){
//    					recorder && recorder.exportWAV(function(blob, id){
//    						console.log("wav exported");
//    						if(blob.size>2000000) {
//    							alert("Message too large. You need to pause from time to time.");
//    							console.log("Message too large. You need to pause from time to time.");
//    						} else {
//    							//mediaManager.playWAV(blob,function(){},function(){alert("could not play blob");});
//    	    					if (!hasActiveId) {
//			   						
//    	    						webSocketSend("language "+configurationManager.getLanguage());//FIXME
//			   					
//    	    						inputId = findLowestFreeId();
//    	    						hasActiveId = true;
//    	    						webSocketSend("start "+ inputId);
//    	    						buffer = configurationManager.get([_pluginName, "silenceBuffer"]);
//    	    					}	else {
//    	    						buffer = 0;
//    	    					}
//    	    					webSocketSend(blob);
//    						}
//    					}, buffer,inputId);
//    				}
//    				if (e.data=='Silence detected!'){
//    					// send record to server!
//    					recorder && recorder.exportWAV(function(blob, id){
//    						console.log("wav exported");
//    						if(blob.size>2000000) {
//    							alert("Message too large. You need to pause from time to time.");
//    							console.log("Message too large. You need to pause from time to time.");
//    						} else {
//    							//mediaManager.playWAV(blob,function(){},function(){alert("could not play blob");});
//    	    					if (!hasActiveId) {
//    	    						inputId = findLowestFreeId();
//    	    						hasActiveId = true;
//    	    						webSocketSend("start "+ inputId);
//    	    						buffer = configurationManager.get([_pluginName, "silenceBuffer"]);
//    	    					}	else {
//    	    						buffer = 0;
//    	    					}
//    	    					webSocketSend(blob);
//    	    					webSocketSend("stop");
//    	    					webSocketSend("analyze "+ inputId);
//    	    					hasActiveId = false;
//
//    	              			//debug output:
//    	              			console.debug('HTML5-Speech-Recoginition_sent audio to recognizer... ');
//    	              			
//    	              			//test
//    	              			Recorder.forceDownload( blob, "myRecording" + ((inputId<10)?"0":"") + inputId + ".wav" );
//    						}
//    					}, buffer,inputId);
//    					if (endOfSpeechDetection){
//    	    				recorder && recorder.stop();
//    	    				silenceDetection && silenceDetection.postMessage({command: 'stop'});
//    					}
//    				}
//    				if (e.data=='clear'){
//    					recorder.clear(configurationManager.get([_pluginName, "silenceBuffer"]));
//    				}
//    			};
//    			silenceDetection.postMessage({
//    				command: 'init',
//    				config: {
//    					sampleRate: input.context.sampleRate,
//    					noiseTreshold : configurationManager.get([_pluginName, "silenceDetector.noiseTreshold"]),
//    					pauseCount : configurationManager.get([_pluginName, "silenceDetector.pauseCount"]),
//    					resetCount : configurationManager.get([_pluginName, "silenceDetector.resetCount"])
//    				}
//    			});
    			
    			silenceDetection = recorder.processor;
    			recorder.beforeonmessage = function (e){
    				if(mediaManagerInstance._log.isDebug()) mediaManagerInstance._log.log(e.data);
    				
    				var isProcessed = false;
    				if (e.data=='Send partial!'){
    					
    					isProcessed = true;
    					
    					recorder && recorder.exportWAV(function(blob, id){
    						if(mediaManagerInstance._log.isDebug()) mediaManagerInstance._log.log("wav exported");
//    						if(blob.size>2000000) {
//    							alert("Message too large. You need to pause from time to time.");
//    							console.log("Message too large. You need to pause from time to time.");
//    						} else {
    							//mediaManager.playWAV(blob,function(){},function(){alert("could not play blob");});
    	    					if (!hasActiveId) {
			   						
    	    						webSocketSend("language "+ languageManager.getLanguage());//FIXME use languageManager.getLanguageConfig(_pluginName) instead?
			   					
    	    						inputId = findLowestFreeId();
    	    						hasActiveId = true;
    	    						webSocketSend("start "+ inputId);
    	    						buffer = configurationManager.get([_pluginName, "silenceBuffer"]);
    	    					}	else {
    	    						buffer = 0;
    	    					}
    	    					webSocketSend(blob);
//    						}
    					}, buffer,inputId);
    				}
    				else if (e.data=='Silence detected!'){
    					
    					isProcessed = true;
    					
    					// send record to server!
    					recorder && recorder.exportWAV(function(blob, id){
    						if(mediaManagerInstance._log.isDebug()) mediaManagerInstance._log.log("wav exported");
    						if(blob.size>2000000) {
    							//TODO trigger callback / listener instead of aler-box
    							alert("Message too large. You need to pause from time to time.");
    							console.log("Message too large. You need to pause from time to time.");
    	    					recorder.clear();
    						} else {
    							//mediaManager.playWAV(blob,function(){},function(){alert("could not play blob");});
    	    					if (!hasActiveId) {
    	    						inputId = findLowestFreeId();
    	    						hasActiveId = true;
    	    						webSocketSend("start "+ inputId);
    	    						buffer = configurationManager.get([_pluginName, "silenceBuffer"]);
    	    					}	else {
    	    						buffer = 0;
    	    					}
    	    					webSocketSend(blob);
    	    					webSocketSend("stop");
    	    					webSocketSend("analyze "+ inputId);
    	    					hasActiveId = false;

    	              			//FIXME experimental callback/listener for on-detect-sentence -> API may change!
    	            			var onDetectSentenceListeners = mediaManager.getListeners('ondetectsentence');
    	            			for(var i=0, size = onDetectSentenceListeners.length; i < size; ++i){
    	            				onDetectSentenceListeners[i](blob, inputId);
    	            			}
    						}
    					}, buffer,inputId);
    					if (endOfSpeechDetection){
    	    				recorder && recorder.stop();
    	    				silenceDetection && silenceDetection.postMessage({command: 'stop'});
    					}
    				}
    				else if (e.data=='clear'){
    					
    					isProcessed = true;
    					
    					recorder.clear();
    				}
    				else if(e.data=='Silence Detection initialized' || e.data=='Silence Detection started' || e.data=='Silence Detection stopped'){
    					
    					isProcessed = true;
    					
    				}
    				
    				
    				if(isProcessed === true){
    					return false;
    				}
    			};
    			var silenceDetectionConfig = {
					sampleRate: input.context.sampleRate,
					noiseTreshold : configurationManager.get([_pluginName, "silenceDetector.noiseTreshold"]),
					pauseCount : configurationManager.get([_pluginName, "silenceDetector.pauseCount"]),
					resetCount : configurationManager.get([_pluginName, "silenceDetector.resetCount"])
				};
    			silenceDetection.postMessage({
    				command: 'initDetection',
    				config: silenceDetectionConfig
    			});
    		}//END: startUserMedia
    		
    		try {
		        // unify the different kinds of HTML5 implementations
    			//window.AudioContext = window.AudioContext || window.webkitAudioContext;
    			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    			//window.URL = window.URL || window.webkitURL;
//		    	audio_context = new webkitAudioContext;

    			if(typeof AudioContext !== 'undefined'){
    				audio_context = new AudioContext;
    			}
    			else {//if(typeof webkitAudioContext !== 'undefined'){
    				audio_context = new webkitAudioContext;
    			}
    		} 
    		catch (e) {
    			console.error('No web audio support in this browser! Error: '+(e.stack? e.stack : e));
    			nonFunctional = true;
 				 if (currentFailureCallback) 
  					 currentFailureCallback(e);
    		}
    		
    		if( nonFunctional !== true ) try {
    			initializeWebSocket();
    		} catch (e) {
    			console.error('Could not reach the voice recognition server!');
    			nonFunctional = true;
 				 if (currentFailureCallback) 
  					 currentFailureCallback(e);
    		}

    		if (nonFunctional) {
    			return {};///////////////////////////// EARLY EXIT //////////////////////////////
    		}

    		// get audioInputStream
    		navigator.getUserMedia({audio: true}, startUserMedia, function(e) {});

    		return {
    			startRecord: function(successCallback, failureCallback, intermediateResults){
    				lastBlob = false;
    				for (var k = 0; i < freeIds.length; i++){
    					webSocketSend("clear "+k);
    				}
					totalText = '';
					isUseIntermediateResults = intermediateResults? true : false;
    				if(intermediateResults){
        				textProcessor = successCallback;
    				} else {
    					/** @memberOf media.plugin.html5AudioInput.prototype */
    					textProcessor = function(e, onEnd){
    						totalText = totalText + ' '+e;
    					};
    				}
    				endOfSpeechDetection = false;
    				if (failureCallback){
    					currentFailureCallback = failureCallback;
    				}
    				silenceDetection && startNewInputNode();
    				recording=true;
    				recorder && recorder.clear();
    				recorder && recorder.record();
    				silenceDetection && silenceDetection.postMessage({command: 'start'});
    			},
    			stopRecord: function(successCallback,failureCallback){//blobHandler){
    				if (failureCallback){
    					currentFailureCallback = failureCallback;
    				}
    				setTimeout(function(){
    					recorder && recorder.stop();
        				if (successCallback){
        					/** @memberOf media.plugin.html5AudioInput.prototype */
        					textProcessor = function(e){
        						if (lastBlob) {
        							successCallback(totalText+ ' ' + e);
        						}
        						lastBlob = false;
        					};
        				}
        				lastBlob = true;
        				silenceDetection && silenceDetection.postMessage({command: 'stop'});
    				}, 100);
    				
    			},
    			recognize: function(successCallback,failureCallback){
    				lastBlob = false;
    				totalText='';
    				if (successCallback){
    					textProcessor = successCallback;
    				}
    				if (failureCallback){
    					currentFailureCallback = failureCallback;
    				}
    				endOfSpeechDetection = true;
    				silenceDetection && startNewInputNode();
    				recording=true;
    				recorder && recorder.clear();
    				recorder && recorder.record();
    				silenceDetection && silenceDetection.postMessage({command: 'start'});

    			},
    			cancelRecognition: function(successCallback,failureCallback){
    				if (failureCallback){
    					currentFailureCallback = failureCallback;
    				}
    				
					recorder && recorder.stop();
    				lastBlob = true;
    				silenceDetection && silenceDetection.postMessage({command: 'stop'});
    				if (successCallback){
    					successCallback();
    				}
    			}
    		};//END: return
		};//END: htmlAudioConstructor()
			
		// the code starts here, loads the necessary scripts and then calls htmlAudioConstructor
		commonUtils.loadScript(constants.getWorkerPath()+'recorderWorkerExt.js',function(){
			commonUtils.loadScript(constants.getMediaPluginPath()+'recorderExt.js', function(){
				callBack(htmlAudioConstructor());
			});
		});
	}//END: initialize()
		
};