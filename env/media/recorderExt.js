/*
 * License (MIT)
 *
 * modifications:
 * 
 * 	Copyright (C) 2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 *  
 * based on
 * 	Copyright (C) 2013 Matt Diamond (MIT License)
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


(function(window){

  var WORKER_PATH = 'mmirf/workers/recorderWorker.js';

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
//    this.context = source.context;
//    this.createScriptProcessor = function(contextObj, bufferSize, numberOfInputChannels, numberOfOutputChannels){
//    	if(contextObj.createJavaScriptNode){
//    		return contextObj.createJavaScriptNode(bufferSize, numberOfInputChannels, numberOfOutputChannels);
//    	}
//    	else if(contextObj.createScriptProcessor){
//    		return contextObj.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
//    	}
//    	else {
//    		throw Error('Could not create script-processor for AudioContext: context provides no function for generating processor!');
//    	}
//    };
//    this.node = this.createScriptProcessor(this.context, bufferLen, 2, 2);
//    if(!this.context.createScriptProcessor){
//    	this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
//    }
//    else {
//    	this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
//    }
    var worker = new Worker(config.workerPath || WORKER_PATH);
//    worker.postMessage({
//    	command: 'init',
//    	config: {
//    		sampleRate: this.context.sampleRate
//    	}
//    });
    this.processor = worker;///////////TODO MOD
    
    var recording = false,
      currCallback;
    
    var dataListener;//TODO MOD

    var doRecordAudio = function(e){
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    }
    
    this._initSource = function(inputSource){

        this.context = inputSource.context;
        
        //if we already had another input-source before, we need to clean up first:
        if(this.node){
        	this.node.disconnect();
        }
        
    	if(!this.context.createScriptProcessor){
        	this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
        }
        else {
        	this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
        }

    	this.node.onaudioprocess = doRecordAudio;
    	
    	worker.postMessage({
        	command: 'init',
        	config: {
        		sampleRate: this.context.sampleRate
        	}
        });
    	
    	inputSource.connect(this.node);
        this.node.connect(this.context.destination); 
    }

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffers = function(cb, isListener) {//TODO MOD additional parameter
    	//TODO MOD start
      if(isListener === true){
    	  dataListener = cb;
          worker.postMessage({ command: 'getBuffers', id: 'listener' });
      }
      else {//TODO MOD end
    	  currCallback = cb || config.callback;
          worker.postMessage({ command: 'getBuffers' })
      }
    }

    this.exportWAV = function(cb, type){
    	currCallback = cb || config.callback;
    	type = type || config.type || 'audio/wav';
    	if (!currCallback) throw new Error('Callback not set');
    	worker.postMessage({
    		command: 'exportWAV',
    		type: type
    	});
    }

    this.exportMonoWAV = function(cb, type){
    	currCallback = cb || config.callback;
    	type = type || config.type || 'audio/wav';
    	if (!currCallback) throw new Error('Callback not set');
    	worker.postMessage({
    		command: 'exportMonoWAV',
    		type: type
    	});
    }
    
    var selfRef = this;///////////TODO MOD
    worker.onmessage = function(e){

    	var blob = e.data;
    	///////////TODO MOD start
    	if(blob.buffers){
    		var id = blob.id;
    		blob = blob.buffers;
    		if(id && id === 'listener' && dataListener){
    			dataListener(blob);
    		}
    		return;
    	}
    	///////////TODO MOD end
    	
    	///////////TODO MOD start
    	var result = true;
    	if(selfRef.beforeonmessage){
    		result = selfRef.beforeonmessage(e);
    	}
    	if(typeof result !== 'undefined' && !result){
    		return;
    	}
    	///////////TODO MOD end
    	
    	currCallback(blob);
    	
    }

//    source.connect(this.node);
//    this.node.connect(this.context.destination);    // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
    
    this._initSource(source);
  };

  Recorder.forceDownload = function(blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    var click = document.createEvent("Event");
    click.initEvent("click", true, true);
    link.dispatchEvent(click);
  }

  window.Recorder = Recorder;
})(window);
