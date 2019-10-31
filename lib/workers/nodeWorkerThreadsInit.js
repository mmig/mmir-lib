
//ignore for WEBPACK build:
if(typeof WEBPACK_BUILD === 'undefined'  || !WEBPACK_BUILD){

	var worker_threads = require('worker_threads');
	var parentPort = worker_threads.parentPort;
	global.self = this;
	self.isMainThread = worker_threads.isMainThread;

	// var destroyed = false;
	// parentPort.on('exit', function(){
	// 	log('## [worker_threads::onexit] ')
	// 	destroyed = true;
	// });
	// parentPort.on('error', function(err){
	// 	log('## [worker_threads::onerr] ', err);
	// });
	//
	// var log = function(){
	// 	try{
	// 		console.log.apply(console, arguments);
	// 	} catch(_err){}
	// }

	Object.defineProperty(global.self, 'onmessage', {
		set: function(func){
			//simulate setting onmessage callback:
			if(parentPort.removeAllListeners){
				//onmessage hook is "singleton" -> remove any previously registered listeners
				parentPort.removeAllListeners('message');
			}
			//only register, if TRUTHY (i.e. interpret FALSY as "unregister listener/hook"):
			if(func){
				parentPort.on('message', function(data){
					// if(!destroyed) log('## [worker_threads::onmessage] ', data);
					func.call(global, {data: data});
				});
			}
		}
	});
	self.postMessage = function(data){
		// if(!destroyed) log('## [worker_threads::postMessage] ', data);
		parentPort.postMessage(data);
	};

	var path = require('path');

	global.importScripts = function(){
		var p;
		for(var i=0, size = arguments.length; i < size; ++i){
			p = arguments[i];
			if(!path.isAbsolute(p) && !/^[^/]+:\/\//.test(p)){
				p = path.join(__dirname, p);
			}
			require(p);
		}
	}

}
