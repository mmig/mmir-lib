
//bootstrapping for requirejs in browser environment

;(function (requirejs, define, window) {//execute in anonymous namespace/closure:

requirejs(['./modulesBaseConfig', './mainConfigInit'], /** @memberOf mmir.mainConfig */ function(mmirf_config, mmirConfigInit){

	var mmirRoot = requirejs.toUrl('./');

	//allow to change baseUrl for mmir-lib
	var coreName = typeof MMIR_CORE_NAME === 'string'? MMIR_CORE_NAME : 'mmir';
	var mmirCore = window[coreName];
	if(typeof mmirCore !== 'undefined' && mmirCore){
		if(mmirCore._mmirLibPath){
			mmirRoot = mmirCore._mmirLibPath;
		} else {
			mmirCore._mmirLibPath = mmirRoot;
		}
	}

	var paths = mmirf_config.paths;

	//set default view engine & loader (can be overwritten in via mmir.config({paths: ...}))
	paths['mmirf/viewLoader'] = 'env/view/viewLoader';
	paths['mmirf/simpleViewEngine'] = 'env/view/simpleViewEngine';

	//adjust paths to mmir root path:
	for(var p in paths){
		paths[p] = mmirRoot + paths[p];
	}
	var packages = mmirf_config.packages;
	for(var i = packages.length - 1; i >= 0; --i){
		packages[i].location = mmirRoot + packages[i].location;
	}

	mmirf_config.config['mmirf/constants'] = {
		mmirBasePath: mmirRoot
	};


	/** apply mmir-configuration and retrieve (local) requirejs instance
	 * @type requirejs
	 * @memberOf mmir.mainConfig */
	var reqInstance = requirejs.config(mmirf_config);
	var defInstance = define;

	//start mmir initialization by (re-)loading the core-module, pre-configuring mmir, and then load the framework's start-module:
	reqInstance(['mmirf/core'], /** @memberOf mmir.mainConfig */ function mmirLoader(core){

		//pre-confgure mmir
		mmirConfigInit(core, mmirf_config, reqInstance, defInstance);

		//load main module
		core.require(['mmirf/logger', mmirCore.startModule]);
	});

});//END requirejs(['...

}(requirejs, define, typeof window !== 'undefined'? window : global));//END: (function(){...
