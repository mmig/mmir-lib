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
 * Media Module: Implementation for Speech Recognition via the Google Web Speech Recognition service v1 using a proxy/mediator server
 * 
 * 
 * @requires Cross-Domain access, if proxy/mediator server is not located in the same domain as the web app
 * @requires CSP for accessing the proxy/mediator server via ws: or wss:, e.g. "connect-src ws://server-address" or "default-src connect-src ws://server-address"
 * 
 */
newWebAudioAsrImpl = (function() {

	/**  @memberOf Html5AudioInput# */
	var MODE = 'google1';

	/**  @memberOf Html5AudioInput# */
	var _pluginName = 'html5AudioInput';

	/** 
	 * @type mmir.LanguageManager
	 * @memberOf Html5AudioInput#
	 */
	var languageManager = require('languageManager');
	/** 
	 * @type mmir.ConfigurationManager
	 * @memberOf Html5AudioInput#
	 */
	var configurationManager = require('configurationManager');

	/** 
	 * @type mmir.ConfigurationManager
	 * @memberOf Html5AudioInput#
	 */
	var mediaManager = require('mediaManager');

	/** @memberOf Html5AudioInput# */
	var freeIds = [true];
	/** @memberOf Html5AudioInput# */
	var hasActiveId = false;

	/** @memberOf Html5AudioInput# */
	var inputId = 0;
	
	/** @memberOf Html5AudioInput# */
	var lastBlob = false;

	/** @memberOf Html5AudioInput# */
	var isUseIntermediateResults = false;
	
	/** 
	 * for gathering partial ASR results when using startRecord:
	 * @memberOf Html5AudioInput#
	 */
	var recordAsrResultCache = [];
	/** @memberOf Html5AudioInput# */
	var recordAsrResultSorter = function(a,b){return a.id - b.id;};
	/** @memberOf Html5AudioInput# */
	var asrResultCacheToString = function(cache){
		var size = cache.length;
		var sb = new Array(size);//use "StringBuffer" for concatenating partial results
		for(var i = 0; i < size; ++i){
			sb[i] = cache[i].text;
		}
		return sb.join('');
	};
	/** @memberOf Html5AudioInput# */
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
	/** @memberOf Html5AudioInput# */
	var recordAsrResultAggregator = function printResult(res,id){
		recordAsrResultCache.push({
			text: res,
			id:id
		});
		recordAsrResultCache.sort(recordAsrResultSorter);

		//FIXME debug output:
//		console.debug( asrResultCacheToString(recordAsrResultCache) );
	};

	/** 
	 * @type WebSocket
	 * @memberOf Html5AudioInput#
	 */
	var webSocket = null;
	
	var textProcessor, currentFailureCallback, closeMicFunc;

	/** @memberOf Html5AudioInput# */
	var doSend = function(msg, successCallback, failureCallback){
		
		if(successCallback){
			textProcessor = successCallback;
		}
		if(failureCallback){
			currentFailureCallback = failureCallback;
		}
		
		if(!webSocket || webSocket.readyState >= 2){//INVALID or CLOSING/CLOSED
			webSocket = null;//<- avoid close() call in initializer
			doInitSend(function(){ webSocket.send(msg); });
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

	};

	/** initializes the connection to the googleMediator-server, 
	 * where the audio will be sent in order to be recognized.
	 * 
	 * @memberOf Html5AudioInput#
	 */
	var doInitSend = function(oninit){ 
		
		if (webSocket){
			webSocket.close();
		}
		webSocket = new WebSocket(configurationManager.getString( [_pluginName, "webSocketAddress"] ));

		/**  @memberOf Html5AudioInput.webSocket# */
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
		/**  @memberOf Html5AudioInput.webSocket# */
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
//      		//ELSE: empty result (nothing was recognized)
//      		//		-> still need to notify the the textProcessor
//      		//		FIXME really, this is only necessary when stopping the ASR/recording (but would need to recoginze this case...)
//      		else if(textProcessor){
//  				textProcessor('', id);
//      		}    				 
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
		/**  @memberOf Html5AudioInput.webSocket# */
		webSocket.onerror = function(e) {

			closeMicFunc();
			lastBlob=false;

			if (currentFailureCallback){
				currentFailureCallback(e);
			}
			else {
				console.error('Websocket Error: '+e  + (e.code? ' CODE: '+e.code : '')+(e.reason? ' REASON: '+e.reason : ''));
			}
		};
		/**  @memberOf Html5AudioInput.webSocket# */
		webSocket.onclose = function(e) {
			console.info('Websocket closed!'+(e.code? ' CODE: '+e.code : '')+(e.reason? ' REASON: '+e.reason : ''));
		};
	};
	
	/** @memberOf Html5AudioInput# */
	var buffer = 0;
	
	/** @memberOf Html5AudioInput# */
	var onSendPart = function(evt){

		var recorder = evt.recorder;

		recorder && recorder.exportWAV(
				/** @memberOf Html5AudioInput.recorder# */
				function onSendPartial(blob, id){
					if(mediaManager._log.isDebug()) mediaManager._log.log("wav exported");
//					if(blob.size>2000000) {
//						alert("Message too large. You need to pause from time to time.");
//						console.log("Message too large. You need to pause from time to time.");
//					} else {
						//mediaManager.playWAV(blob,function(){},function(){alert("could not play blob");});
						if (!hasActiveId) {
	
							doSend("language "+ languageManager.getLanguage());//FIXME use languageManager.getLanguageConfig(_pluginName) instead?
	
							inputId = findLowestFreeId();
							hasActiveId = true;
							doSend("start "+ inputId);
							buffer = configurationManager.get([_pluginName, "silenceBuffer"]);
						}	else {
							buffer = 0;
						}
						doSend(blob);
//					}
				},
				buffer,
				inputId
		);

		return false;
	};

	/** @memberOf Html5AudioInput# */
	var onSilence = function(evt){

		var recorder = evt.recorder;

		// send record to server!
		recorder && recorder.exportWAV(
				/** @memberOf Html5AudioInput.recorder# */
				function onSilenceDetected(blob, id){
					if(mediaManager._log.isDebug()) mediaManager._log.log("wav exported");
					if(blob.size>2000000) {
						//TODO trigger callback / listener instead of aler-box
						alert("Message too large. You need to pause from time to time.");
						console.log("Message too large. You need to pause from time to time.");
						recorder.clear();
					} else {
						//mediaManagerInstance.playWAV(blob,function(){},function(){alert("could not play blob");});
						if (!hasActiveId) {
							inputId = findLowestFreeId();
							hasActiveId = true;
							doSend("start "+ inputId);
							buffer = configurationManager.get([_pluginName, "silenceBuffer"]);
						}	else {
							buffer = 0;
						}
						doSend(blob);
						doSend("stop");
						doSend("analyze "+ inputId);
						hasActiveId = false;

						//FIXME experimental callback/listener for on-detect-sentence -> API may change!
						var onDetectSentenceListeners = mediaManager.getListeners('ondetectsentence');
						for(var i=0, size = onDetectSentenceListeners.length; i < size; ++i){
							onDetectSentenceListeners[i](blob, inputId);
						}
					}
				},
				buffer,
				inputId
		);

		return false;
	};

	/** @memberOf Html5AudioInput# */
	var onClear = function(evt){

		evt.recorder && evt.recorder.clear();
		return false;
	};

	/** @memberOf Html5AudioInput# */
	var clearRec = function(){
		for (var k = 0; k < freeIds.length; k++){
			doSend("clear "+k);
		}
	};

	/** @memberOf Html5AudioInput# */
	var doStopPropagation = function(){
		return false;
	};

	/**  @memberOf Html5AudioInput# */
	return {
		/** @memberOf Html5AudioInput.AudioProcessor# */
		_init: doInitSend,
		initRec: clearRec,
		sendData: doSend,
		oninit: doStopPropagation,
		onstarted: doStopPropagation,
		onaudiostarted: onSilence,
		onstopped: doStopPropagation,
		onsendpart: onSendPart,
		onsilencedetected: onSilence,
		onclear: onClear,
		getPluginName: function(){
			return _pluginName;
		},
		setCallbacks: function(successCallback, failureCallback, stopUserMedia, isIntermediateResults){

			textProcessor = successCallback;
			currentFailureCallback = failureCallback;
			closeMicFunc = stopUserMedia;
			isUseIntermediateResults = isIntermediateResults;
		},
		setLastResult: function(){
			lastBlob = true;
		},
		resetLastResult: function(){
			lastBlob = false;
		},
		isLastResult: function(){
			return lastBlob;
		}
	};
	
})();