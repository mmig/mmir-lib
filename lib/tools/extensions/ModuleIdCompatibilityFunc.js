define(['mmirf/util/isArray'],
/**
 * Maps requirejs module IDs from mmir-lib v3 (and earlier) to module IDs used in mmir-lib version >= 4.
 *
 *
 *
 * @class
 * @name mmir.compat.ModuleIdCompatFunc
 * @static
 *
 * @example
 * mmir.require(['mmirf/moduleIdCompatibilityFunc', 'mmirf/core'], function(moduleIdCompatibilityFunc, mmir){
 * 		function moduleMapFunc(id){
 * 			return if(isOldId(id)) return 'mmirf/'+id;
 * 			return id;
 * 		}
 * 		var req = moduleIdCompatibilityFunc(mmir.require, moduleMapFunc);
 * 		mmir.require = req;
 * });
 *
 * @public
 */
function(isArray){

	/**
	 * HELPER for creating require() function that maps old module IDs to new ones.
	 *
	 * @param {Function} requirejs
	 * 			the require function, e.g. <code>mmir.require</code>
	 *
	 * @param {Function} getIdFunc
	 * 			function for mapping module IDs:
	 * 			takes a string (module ID) as input, and returns a string (the new/valid module ID)
	 * 			<code>getIdFunc(id: string): string</code>
	 *
	 * @memberOf mmir.compat.ModuleIdCompatFunc#
	 */
	var createModuleMapRequire = function(requirejs, getIdFunc) {

		var _id = getIdFunc;
		//helper function that maps module IDs to v3 module names, if necessary
		return function(){
			var len = arguments.length;
			if(len > 0){
				var dep = arguments[0];
				if(isArray(dep)){
					for(var i=dep.length - 1; i >= 0; --i){
						dep[i] = _id(dep[i]);
					}
				} else if(typeof dep === 'string') {
					dep = _id(dep);
				}
				arguments[0] = dep;
			}
			return requirejs.apply(this, arguments);
		};
	};

	return createModuleMapRequire;

});
