
///////////////////////////////////////////////////////////////// MOD:

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

var SilenceDetector = (function(threadRef){
	
/** 
 * Counter:
 * 	how many silent blobs have there currently been in a row now?
 * @memberOf SilenceDetector.prototype
 */
var silenceCount = 0;
/**
 * Counter: 
 * 	how many blobs have been currently loud in a row now?
 * @memberOf SilenceDetector.prototype
 */
var speechCount = 0;
/** 
 * Counter:
 * 	how long has there been no loud enough input (in a row), up to now?
 * @memberOf SilenceDetector.prototype
 */
var lastInput = 0;
/** @memberOf SilenceDetector.prototype */
var recording= false;
/** 
 * the lower threshold for noise (lower than this is considered "silence"), i.e.
 * the bigger, the more is counted as silent
 * @memberOf SilenceDetector.prototype
 */
var noiseTreshold = 0.1;
/** @memberOf SilenceDetector.prototype */
var sampleRate = 0;
/** @memberOf SilenceDetector.prototype */
var pauseCount = 3;
/** @memberOf SilenceDetector.prototype */
var resetCount = 15;
/** @memberOf SilenceDetector.prototype */
var maxBlobSize = 15;
/** @memberOf SilenceDetector.prototype */
var blobSizeCount = 0;
/** @memberOf SilenceDetector.prototype */
var blobNumber = 0;

//events:
/** @memberOf SilenceDetector.prototype */
var STARTED = 'Silence Detection started';
/** @memberOf SilenceDetector.prototype */
var STOPPED = 'Silence Detection stopped';
/** @memberOf SilenceDetector.prototype */
var INITIALIZED = 'Silence Detection initialized';
/** @memberOf SilenceDetector.prototype */
var SEND_PARTIAL = 'Send partial!';//max. blob-size is reached: send data up to now as 'partial data'
/** @memberOf SilenceDetector.prototype */
var AUDIO_STARTED = 'Silence Detection Audio started';
/** @memberOf SilenceDetector.prototype */
var SILENCE = 'Silence detected!';//silence (after some noise) was detected
/** @memberOf SilenceDetector.prototype */
var CLEAR = 'clear';//data since last 'send partial'/'silence detected' only consists of silence -> can be cleared/deleted 

/**
 * sets the config and echos back
 * 
 * @param {PlainObject} config
 * 			configuration settings with properties
 * 				config.sampleRate 		INT		audio sampling rate
 * 				config.noiseThreshold 	INT		lower threshold up to which audio is considered as noise (i.e. "not silent")
 * 				config.pauseCount 		INT		"silence duration": count of "silent" data blobs in a row which must occur, in order to consider the input as "speech input pause" 
 * 				config.resetCount		INT		"pure silence": if there was no "noise" since the last "silence" and the amount of "silence" has passed, signal "clear" (i.e. clear/delete this silent audio); for saving bandwidth
 * 			
 * @private
 * @memberOf SilenceDetector.prototype
 */
function _initDetection(config){
  if (config.sampleRate){
	  sampleRate = config.sampleRate;
	  if(typeof sampleRate !== 'number'){
		  sampleRate = parseInt(sampleRate, 10);
	  }
  }
  if (config.noiseTreshold){
	  noiseTreshold = config.noiseTreshold;
	  if(typeof noiseTreshold !== 'number'){
		  noiseTreshold = parseFloat(noiseTreshold);
	  }
  }
  if (config.pauseCount){
	  pauseCount = config.pauseCount;
	  if(typeof pauseCount !== 'number'){
		  pauseCount = parseInt(pauseCount, 10);
	  }
  }
  if (config.resetCount){
	  resetCount = config.resetCount;
	  if(typeof resetCount !== 'number'){
		  resetCount = parseInt(resetCount, 10);
	  }
  }
  _sendMessage(INITIALIZED);
}

/**
 * recieves an audioBlob and decides whether or not there has been a real input (min. <speechCount> loud blobs in a row)
 * and a real pause (min. <pauseCount> silent blobs in a row) afterwards. In this case it dictates a pause. 
 * If some time has gone by without any real input, it sends a signal to clear the buffers.
 * 
 * @param inputBuffer
 * 
 * @private
 * @memberOf SilenceDetector.prototype
 */
function _isSilent(inputBuffer){
	if (recording){
		++blobNumber;
		if (blobNumber === 3){
			//at the very start (i.e. after 3 blobs): signal "started" by sending an initial silence-detected
			_sendMessage(AUDIO_STARTED);//SILENCE);
		}
		var thisSilent = true;
		var bound = 0, val;
		for (var i = 0; i < inputBuffer.length; ++i) {
			val = Math.abs( inputBuffer[i] );
			if ( val > noiseTreshold ){//( inputBuffer[i] > noiseTreshold) || ( inputBuffer[i] < 0-noiseTreshold) ){
				if (val > bound){//inputBuffer[i] > bound){
					bound = val;//inputBuffer[i];
				}
				thisSilent = false;
			}
		}
		if (thisSilent){
			if (silenceCount >= pauseCount){
				_sendMessage(SILENCE);
				speechCount = 0;
				silenceCount = 0;
				lastInput = 0;
				blobSizeCount = 0;
			}
			if (speechCount >= pauseCount){
				++blobSizeCount;
				++silenceCount;
			} 
			else {
				speechCount = 0;
				++lastInput;
			}
		} 
		else {
			if (speechCount >= pauseCount){
				silenceCount = 0;
				++blobSizeCount;
			} 
			else {
				++speechCount;
				++lastInput;
			}
		}
		if (speechCount > pauseCount){
			
		}
		if (blobSizeCount >= maxBlobSize){
			_sendMessage(SEND_PARTIAL);
			blobSizeCount = 0;
		}
		if (speechCount === 0 && lastInput > resetCount){
			this.postMessage(CLEAR);
			lastInput = 0;
		}
		
	}
}

/**
 * resets everything and switches the worker to recording mode.
 * 
 * @private
 * @memberOf SilenceDetector.prototype
 */
function _start(){
	silenceCount = 0;
	speechCount = 0;
	lastInput = 0;
	recording = true;
	_sendMessage(STARTED);
	blobNumber = 0;
}

/**
 * @private
 * @memberOf SilenceDetector.prototype
 */
function _stop(){
	recording = false;
	if (speechCount > 0){
		_sendMessage(SILENCE);
		speechCount = 0;
		silenceCount = 0;
		lastInput = 0;
		blobSizeCount = 0;
	}
	_sendMessage(STOPPED);
}

/**
 * @private
 * @memberOf SilenceDetector.prototype
 */
function _sendMessage(msg){
	
	threadRef.postMessage(msg);
}

/**
 * @param {String} cmd
 * 			one of "initDetection" | "start" | "isSilent" | "stop"
 * @param {PlainObject} [config]
 * 			SHOULD be provided if cmd is "initDetection"
 * 			see #_initDetection
 * @param {Buffer} [buffer]
 * 			MUST be provided if cmd is "isSilent"
 * 			see #_isSilent
 * 
 * @private
 * @memberOf SilenceDetector.prototype
 */
function _processesCommand(cmd, config, buffer){
	switch(cmd){
	  case 'initDetection':
	    _initDetection(config);
	    break;
	  case 'start':
	    _start();
	    break;
	  case 'isSilent':
	    _isSilent(buffer);
	    break;
	  case 'stop':
	    _stop();
	    break;
	  default:
		  console.error('SilenceDetector: unknown command "'+cmd+'"');
	}
};

return {
	/** @memberOf SilenceDetector */
	'initDetection': function(config){
		_initDetection(config);
	},
	'start': function(){
		_start();
	},
	'isSilent': function(buffer){
		_isSilent(buffer);
	},
	'stop': function(){
		_stop();
	},
	'exec': function(cmd, eventData){
		var config, bin;
		if(eventData.config){
			config = eventData.config;
		}
		if(eventData.buffer){
			bin = eventData.buffer;
		}
		_processesCommand(cmd, config, bin);
	}
};

})(this);
