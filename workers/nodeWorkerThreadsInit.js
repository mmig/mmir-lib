
// global.WEBPACK_BUILD = true;
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
		parentPort.on('message', function(data){
			// if(!destroyed) log('## [worker_threads::onmessage] ', data);
			func.call(global, {data: data});
		});
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
