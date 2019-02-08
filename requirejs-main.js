
//bootstrapping for requirejs in node environment

var path = require('path');

try {
	global.Worker = require('webworker-threads').Worker;
} catch(err) {
	console.log(err)
	console.log('[INFO] module "webworker-threads" not installed: not using WebWorkers/parallel threads for mmir...');
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

config.config['mmirf/constants'] = {
	mmirBasePath: mmirRoot + path.sep
};

//scion-lib for node env:
config.paths['mmirf/scion'] = path.resolve(__dirname, 'env/node/scion.js').replace(/\.js$/, '');

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
		var req = requirejs.config(config);
		var core = mmirInitFunc(mmirCore, config, req, requirejs.define);
		return mmirCore.require(mmirCore.startModule);
	}
};

module.exports = coreModule;
