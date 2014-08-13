/*
 *  License (MIT)
 *
 * 	Copyright (C) 2013 Matt Diamond
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


var recLength = 0,
  recBuffersL = [],
  recBuffersR = [],
  sampleRate;

this.onmessage = function(e){
  switch(e.data.command){
    case 'init':
      init(e.data.config);
      break;
    case 'record':
      record(e.data.buffer);
	  isSilent(e.data.buffer.length == 2? e.data.buffer[0]:e.data.buffer);///////////MOD
      break;
    case 'exportWAV':
      exportWAV(e.data.type);
      break;
    case 'exportMonoWAV':
      exportMonoWAV(e.data.type);
      break;
    case 'getBuffers':
    ////////////////////////MOD start
      if(e.data.id){
    	  getBuffersFor(e.data.id);
    	  break;
      }
    ////////////////////////MOD end
      getBuffers();
      break;
    case 'clear':
      clear();
      break;
    ////////////////////////MOD start
	  case 'initDetection':
	    initDetection(e.data.config);
	    break;
	  case 'start':
	    start();
	    break;
	  case 'isSilent':
	    isSilent(e.data.buffer);
	    break;
	  case 'stop':
	    stop();
	    break;
    ////////////////////////MOD end
  }
};

function init(config){
  sampleRate = config.sampleRate;
}

function record(inputBuffer){
  recBuffersL.push(inputBuffer[0]);
  recBuffersR.push(inputBuffer[1]);
  recLength += inputBuffer[0].length;
}

function exportWAV(type){
  var bufferL = mergeBuffers(recBuffersL, recLength);
  var bufferR = mergeBuffers(recBuffersR, recLength);
  var interleaved = interleave(bufferL, bufferR);
  var dataview = encodeWAV(interleaved);
  var audioBlob = new Blob([dataview], { type: type });

  this.postMessage(audioBlob);
}

function exportMonoWAV(type){
  var bufferL = mergeBuffers(recBuffersL, recLength);
  var dataview = encodeWAV(bufferL, true);
  var audioBlob = new Blob([dataview], { type: type });

  this.postMessage(audioBlob);
}

function getBuffers() {
  var buffers = [];
  buffers.push( mergeBuffers(recBuffersL, recLength) );
  buffers.push( mergeBuffers(recBuffersR, recLength) );
  this.postMessage(buffers);
}

function clear(){
  recLength = 0;
  recBuffersL = [];
  recBuffersR = [];
}

function mergeBuffers(recBuffers, recLength){
  var result = new Float32Array(recLength);
  var offset = 0;
  for (var i = 0; i < recBuffers.length; i++){
    result.set(recBuffers[i], offset);
    offset += recBuffers[i].length;
  }
  return result;
}

function interleave(inputL, inputR){
  var length = inputL.length + inputR.length;
  var result = new Float32Array(length);

  var index = 0,
    inputIndex = 0;

  while (index < length){
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function floatTo16BitPCM(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2){
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function writeString(view, offset, string){
  for (var i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(samples, mono){
  var buffer = new ArrayBuffer(44 + samples.length * 2);
  var view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 32 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, mono?1:2, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * 4, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, 4, true);
  /* bits per sample */
  view.setUint16(34, 16, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return view;
}


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


var silenceCount = 0, //how many silent blobs have there been in a row now?
	speechCount = 0, //how many blobs have been loud in a row now?
	lastInput = 0, // how long has there been no good loud input?
	recording= false,
	noiseTreshold = 0.1, //the bigger, the more is counted as silent
	sampleRate = 0,
	pauseCount = 3,
	resetCount = 15,
	maxBlobSize = 15,
	blobSizeCount = 0,
	blobNumber = 0;

var self = this;
  
//self.onmessage = function(e){
//  switch(e.data.command){
//    case 'init':
//      initDetection(e.data.config);
//      break;
//    case 'start':
//      start();
//      break;
//    case 'isSilent':
//      isSilent(e.data.buffer);
//      break;
//    case 'stop':
//      stop();
//      break;
//  }
//};

function getBuffersFor(id) {
  var buffers = [];
  buffers.push( mergeBuffers(recBuffersL, recLength) );
  buffers.push( mergeBuffers(recBuffersR, recLength) );
  this.postMessage({buffers: buffers, id: id});
}

/**
 * sets the config and echos back
 * @param config
 */
function initDetection(config){
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
  self.postMessage('Silence Detection initialized');
}

/**
 * recieves an audioBlob and decides whether or not there has been a real input (min. 3 loud blobs in a row)
 * and a real pause (min. <pauseCount> silent blobs in a row) afterwards. In this case it dictates a pause. 
 * If some time has gone by without any real input, it sends a signal to clear the buffers.
 * @param inputBuffer
 */
function isSilent(inputBuffer){
	if (recording){
		blobNumber++;
		if (blobNumber==3){
			self.postMessage('Silence detected!');
		}
		var thisSilent = true;
		var bound = 0;
		for (var i = 0; i < inputBuffer.length; i++) {
			if (( inputBuffer[i]> noiseTreshold)||( inputBuffer[i]<0-noiseTreshold)){
				if (inputBuffer[i]>bound) bound= inputBuffer[i];
				thisSilent = false;
			}
		}
		if (thisSilent){
			if (silenceCount>=pauseCount){
				self.postMessage('Silence detected!');
				speechCount = 0;
				silenceCount = 0;
				lastInput = 0;
				blobSizeCount = 0;
			}
			if (speechCount>=pauseCount){
				blobSizeCount++;
				silenceCount++;
			} 
			else {
				speechCount = 0;
				lastInput++;
			}
		} 
		else {
			if (speechCount>=pauseCount){
				silenceCount=0;
				blobSizeCount++;
			} 
			else {
				speechCount++;
				lastInput++;
			}
		}
		if (speechCount>pauseCount){
			
		}
		if (blobSizeCount >= maxBlobSize){
			self.postMessage('Send partial!');
			blobSizeCount = 0;
		}
		if (speechCount==0 && lastInput>resetCount){
			this.postMessage('clear');
			lastInput= 0;
		}
		
	}
}

/**
 * resets everything and switches the worker to recording mode.
 */
function start(){
	silenceCount=0;
	speechCount =0;
	lastInput = 0;
	recording = true;
	self.postMessage('Silence Detection started');
	blobNumber = 0;
}
function stop(){
	recording = false;
	if (speechCount>0){
		self.postMessage('Silence detected!');
		speechCount = 0;
		silenceCount = 0;
		lastInput = 0;
		blobsizeCount = 0;
	}
	self.postMessage('Silence Detection stopped');
}

