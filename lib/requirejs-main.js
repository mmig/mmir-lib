
//bootstrapping for requirejs in node environment

var path = require('path');

var nodeWorkerErr;
try {

	global.Worker = require('webworker-threads').Worker;
	console.log('[INFO] using module "webworker-threads" implementation for WebWorkers...');

} catch(err) {

	try {
		global.Worker = require('worker_threads').Worker;
		console.log('[INFO] using module "worker_threads" implementation for WebWorkers...');
	} catch(err) {
		nodeWorkerErr = err;
	}
}
if(nodeWorkerErr){
	// console.log(nodeWorkerErr);
	console.log('[INFO] could not load implementation for WebWorkers: not using WebWorkers/parallel threads for mmir...');
	console.log('[INFO]   try enabling WebWorkers for node:');
	console.log('[INFO]   * for node >= 10.5.0: enable experimental node worker_threads (recommanded)');
	console.log('[INFO]     * via command line argument:');
	console.log('[INFO]         node --experimental-worker ...');
	console.log('[INFO]         npm --node-options --experimental-worker ...');
	console.log('[INFO]     * via env variable NODE_OPTIONS:');
	console.log('[INFO]       set (or add space-separated) --experimental-worker to the env var');
	console.log('[INFO]     * for npm via config:');
	console.log('[INFO]       create file ".npmrc" with line "node-options = --experimental-worker"');
	console.log('[INFO]   * or: install npm package webworker-threads (>= version 0.8.x)');
	global.Worker = void(0);
}

require('./core.js');
var mmirCore = global.mmir;

var config = require('./modulesBaseConfig.js');

var mmirRoot = __dirname;

mmirCore._mmirLibPath = mmirCore._mmirLibPath || mmirRoot + path.sep;

var paths = config.paths;
for(var n in paths){
	paths[n] = path.resolve(mmirRoot, paths[n] + '.js').replace(/\.js$/, '');
}
var packages = config.packages;
for(var i = packages.length - 1; i >= 0; --i){
	packages[i].location = path.resolve(mmirRoot, packages[i].location);
}

// configure/set the library path:
config.config['mmirf/resources'] = {
	mmirBasePath: mmirRoot + path.sep
};

config.paths['mmirf/node/getLocalScript'] = path.resolve(mmirRoot, 'env/node/getLocalScript.js').replace(/\.js$/, '');

//scion-lib for node env:
var scionLibPath = path.resolve(mmirRoot, 'env/node/scion.js').replace(/\.js$/, '');
config.paths['mmirf/scion'] = scionLibPath;
config.paths['mmirf/scionRuntimeLib'] = scionLibPath;

var mmirInitFunc = require('./mainConfigInit.js');

mmirCore._config = config;
mmirCore.init = function(preinitFunc){
	if(preinitFunc){
		var newInst = preinitFunc(mmirCore);
		if(newInst){
			mmirCore = newInst;
		}
	}
	var requirejs = require('requirejs');
	global.requirejs = requirejs;
	mmirCore._requirejs = requirejs;
	config.nodeRequire = require;
	var req = requirejs.config(config);
	/*var core = */mmirInitFunc(mmirCore, config, req, requirejs.define);

	//set node env implementation for getLocalScript():
	mmirCore.require('mmirf/commonUtils').getLocalScript = mmirCore.require('mmirf/node/getLocalScript');

	if(mmirCore.startModules){
		for(var i=0,size=mmirCore.startModules.length; i < size; ++i){
			mmirCore.require(mmirCore.startModules[i]);
		}
	}
	return mmirCore.require(mmirCore.startModule);
};

if(typeof WEBPACK_BUILD === 'undefined' || !WEBPACK_BUILD){
	//HACK improve compatibility with TypeScript/babel compiled modules:
	//     if this is not set, start-imports may cache & import the un-initialized mmirLib instance
	//     ("star-import" means something like: import * as mmir from 'mmirLib')
	mmirCore.__esModule = true;
}

module.exports = mmirCore;
