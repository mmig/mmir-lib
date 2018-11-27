
//bootstrapping for requirejs

var path = require('path');

try {
	global.Worker = require('webworker-threads').Worker;
} catch(err) {
	console.log('[INFO] module "webworker-threads" not installed: not using WebWorkers/parallel threads for mmir...');
	global.Worker = void(0);
}

require('./core.js');

var mmirCore = global.mmir;
mmirCore._mmirLibPath = __dirname + path.sep;
mmirCore.basePath = __dirname + path.sep;

// requirejs('mmirf/mainConfig');

var config = require('./requirejs.build.base-config.js');
for(var n in config.paths){
	config.paths[n] = path.resolve(__dirname, config.paths[n] + '.js').replace(/\.js$/, '');
}
for(var i = config.packages.length - 1; i >= 0; --i){
	config.packages[i].location = path.resolve(__dirname, config.packages[i].location);
}
config.baseUrl = __dirname;

//scion-lib for node env:
config.paths['mmirf/scion'] = path.resolve(__dirname, 'env/node/scion.js').replace(/\.js$/, '');

// console.log('rqjs -> ', requirejs.config(config));
// console.log('define -> ', requirejs.define);

var coreModule = {
	mmir: mmirCore,
	requirejs: void(0),
	config: config,
	init: function(){
		var requirejs = require('requirejs');
		global.requirejs = requirejs;
		coreModule.requirejs = requirejs;
		var req = requirejs.config(config);
		mmirCore.require = req;
		mmirCore._define = requirejs.define;
		req('mmirf/main');
		return req('mmirf/core');
	}
};

module.exports = coreModule;


// coreModule.init();//TEST

// var appConfig = require('build-tool/webpack-app-config');
// require('build-tool/webpack-helper-module-config').init(appConfig);
//
// //trigger initialization
// require('mmirf/logger');
// require('mmirf/main');
// module.exports = require('mmirf/core');
//
// if(appConfig.applyIncludes){
// 	appConfig.applyIncludes();
// }

// //FIXME TEST:
// require('mmirf/asyncGrammar');
// require('mmirf/jsccAsyncGen');
// require('mmirf/jisonAsyncGen');
// require('mmirf/pegjsAsyncGen');
