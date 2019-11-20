define(['mmirf/moduleIdCompatibilityFunc'],
/**
 * Maps requirejs module IDs from mmir-lib v4 (and earlier) to module IDs used in mmir-lib version >= 5.
 *
 *
 *
 * @class
 * @name mmir.compat.v4.ModuleIdCompat
 * @static
 * @hideconstructor
 *
 * @example
 * mmir.require(['mmirf/core4ModuleIdCompatibility', 'mmirf/core'], function(core4ModuleIdCompatibility, mmir){
 * 		core4ModuleIdCompatibility(mmir.require, mmir, false);
 * });
 *
 * @public
 */
function(moduleIdCompatibilityFunc){

	/**
	 * Map v4 IDs (input) to v5 IDs (output)
	 *
	 * @memberOf mmir.compat.v4.ModuleIdCompat#
	 */
	var core4Ids = {
		'mmirf/constants': 'mmirf/resources'
	};

	/**
	 *
	 * Maps requirejs module IDs from mmir-lib v4 (and earlier) to module IDs used in mmir-lib version >= 5.
	 *
	 * @param {String} id
	 * 			the v4 module ID
	 * @returns {String}
	 * 			the corresponding v5 module ID
	 *
	 * @memberOf mmir.compat.v4.ModuleIdCompat#
	 */
	var getId = function(id) {

		var nid = core4Ids[id];
		return nid? nid : id;
	};

	/**
	 * Set to "backwards compatibility mode" (for pre version 5.0).
	 *
	 * This function "re-adds" module IDs for mmir v4 for requiring modules.
	 *
	 * NOTE that once set to compatibility mode, it cannot be reset to
	 * non-compatibility mode.
	 *
	 * @param {Function} requirejs
	 * 			the require function, e.g. <code>mmir.require</code>
	 * @param {object} [context]
	 * 			the context to which the modified require()-function will be attached:
	 * 			if omitted the global context will be used
	 * @param {Boolean} [onlySetRequirejs]
	 * 			if FALSE, the modified require()-function will be attached to fields 'require' and 'requirejs' of context
	 * 			if TRUE, only to field 'requirejs'
	 *
	 * @memberOf mmir.compat.v4.ModuleIdCompat#
	 */
	var setToCompatibilityMode = function(requirejs, context, onlySetRequirejs) {

		//helper function that maps module IDs to v4 module names, if necessary
		var req = moduleIdCompatibilityFunc(requirejs, getId)

		context = context || (typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this);

		if(!onlySetRequirejs){
			if(context['require']){
				context['__require'] = context['require'];
			}
			context['require'] = req;
		}

		if(context['requirejs']){
			context['__requirejs'] = context['requirejs'];
		}
		context['requirejs'] = req;
	};

	return setToCompatibilityMode;

});
