
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
	console.log('[INFO]   * install npm package webworker-threads (>= version 8.x)');
	console.log('[INFO]   * enable experimental node worker_threads:');
	console.log('[INFO]     * via command line argument:');
	console.log('[INFO]         node --experimental-worker ...');
	console.log('[INFO]         npm --node-options --experimental-worker ...');
	console.log('[INFO]     * via env variable NODE_OPTIONS:');
	console.log('[INFO]       set (or add space-separated) --experimental-worker to the env var');
	console.log('[INFO]     * for npm via config:');
	console.log('[INFO]       create file ".npmrc" with line "node-options = --experimental-worker"');
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

config.config['mmirf/resources'] = {
	mmirBasePath: mmirRoot + path.sep
};

//scion-lib for node env:
config.paths['mmirf/scion'] = path.resolve(mmirRoot, 'env/node/scion.js').replace(/\.js$/, '');

var mmirInitFunc = require('./mainConfigInit.js');

var coreModule = {
	mmir: mmirCore,
	requirejs: void(0),
	config: config,
	init: function(preinitFunc){
		if(preinitFunc){
			preinitFunc(mmirCore);
		}
		var requirejs = require('requirejs');
		global.requirejs = requirejs;
		coreModule.requirejs = requirejs;
		config.nodeRequire = require;
		var req = requirejs.config(config);
		/*var core = */mmirInitFunc(mmirCore, config, req, requirejs.define);

		if(mmirCore.startModules){
			for(var i=0,size=mmirCore.startModules.length; i < size; ++i){
				mmirCore.require(mmirCore.startModules[i]);
			}
		}
		return mmirCore.require(mmirCore.startModule);
	}
};

module.exports = coreModule;
