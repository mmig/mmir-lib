;(function (root, factory) {
		if (typeof define === 'function' && define.amd) {
				// AMD. Register as an anonymous module.
				define(function () {
						return factory();
				});
		} else if (typeof module === 'object' && module.exports) {
				// Node. Does not work with strict CommonJS, but
				// only CommonJS-like environments that support module.exports,
				// like Node.
				module.exports = factory();
		} else {
				// Browser globals
				root.mmirInit = factory();
		}
}(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this, function () {


	return function mmirConfigInit(core, mmirf_config, reqInstance, defInstance) {

		//attach the local-require instance:
		core.require = reqInstance;
		core._define = defInstance;

		//setup the logger implementation:
		// map 'mmirf/logger' to one of  ['mmirf/loggerEnabled' | 'mmirf/loggerDisabled']
		var isEnableLogger = core.debug !== false;//NOTE: only explicitly setting debug to boolean false will disable logging
		var implName = isEnableLogger? 'mmirf/loggerEnabled': 'mmirf/loggerDisabled';
		var implPath = mmirf_config.paths[implName];
		var logConfig = {paths:{'mmirf/logger': implPath}};

		//if the "functional" logger is set, configure it
		// (NOTE: for "disabled" logger, the implementation is provided with no-op functions etc.)
		if(isEnableLogger) {

			logConfig.config = {'mmirf/logger': {}};
			var logSettings = logConfig.config['mmirf/logger'];

			//retrieve/set the default log-level:
			if(typeof core.logLevel !== 'undefined'){
				logSettings.logLevel = core.logLevel;
			}

			//set up the stacktrace for log messages (or not)
			var isEnableTrace = true;
			if(typeof core.logTrace !== 'undefined'){
				isEnableTrace = core.logTrace;
			}

			if(isEnableTrace === true || (isEnableTrace && isEnableTrace.trace === true)){
				//add module ID for stacktrace library
				logSettings.trace = isEnableTrace;
			}
			else {
				//define dummy module for stacktrace library
				// (will not be used anyway, but this avoids loading the actual stacktrace impl. from file)
				define('mmirf/stacktrace', function(){ return function(){}; });
				logSettings.trace = false;
			}

		}
		//"append" the logger-config
		core.config(logConfig);

		//if there already is a jQuery version loaded, use that one
		var jq = null;
		if(typeof jQuery !== 'undefined' || core.jquery){

			if(!core.jquery){
				core.jquery = jQuery;
			}

			jq = core.jquery;

			var entry;
			for(var i=mmirf_config.packages.length - 1; i >= 0; --i){
				entry = mmirf_config.packages[i];
				if(entry.name === 'mmirf/util'){
					entry.location = entry.location.replace(/util_purejs$/, 'util_jquery');
					core.config({
						//make jQuery available in requirejs
						paths: {'jquery': void(0)},
						//configure tools to use jQuery implementation:
						packages: [entry]
					});
				}
			}
		}

		if(core.libMode === 'min'){
			var p;
			for(var n in mmirf_config.paths){
				p = mmirf_config.paths[n];
				if(/(^|\/)(vendor|parser\/gen)\//.test(p) && !/\.min$/.test(p)){
					mmirf_config.paths[n] = p + '.min';
				}
			}
		}

		//apply all configs / modifications that were made on the core-module
		core.applyConfig(mmirf_config, requirejs);

		if(jq){
			core._define('jquery', function(){
				return jq;
			});
		}

		return core;
	}

}));
