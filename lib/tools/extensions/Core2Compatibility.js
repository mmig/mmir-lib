define(['mmirf/core3Compatibility', 'mmirf/languageManagerCompatibility', 'mmirf/commonUtilsCompatibility'
],
	/**
	 * Set to "backwards compatibility mode v2" (for pre version 3.0) for module names and method names.
	 *
	 * NOTE: the API for v2 and v3 are the same, so compatibility-mode is essentially the same as
	 *       {@link mmir.compat.v3}.
	 *
	 *
	 * @class
	 * @namespace mmir.compat.v2
	 * @static
	 *
	 * @requires SemanticInterpreterCompatibility
	 *
	 * @example
	 * mmir.require(['mmirf/core2Compatibility', 'mmirf/core'], function(setCompatibility, mmir){
	 * 		setCompatibility(mmir);
	 * });
	 *
	 * //OR: if mmir-lib modules were require'd in application code, add v3 module-ID aliases first:
	 * mmir.require(['mmirf/core3ModuleIdCompatibility', 'mmirf/core2Compatibility', 'mmirf/core'], function(core3ModuleIdCompatibility, setCompatibility, mmir){
	 * 		core3ModuleIdCompatibility(mmir.require, window);
	 * 		setCompatibility(mmir);
	 * });
	 *
	 * @public
	 * @see mmir.compat.v3
	 */
	function(core3Compatibility){

	/**
	 * Set to "backwards compatibility mode v2" (for pre version 3.0).
	 *
	 * @function setToCompatibilityMode
	 * @param {mmir} mmir
	 * 			the (core) instance/namespace for MMIR
	 *
	 * @memberOf mmir.compat.v2
	 *
	 * @see mmir.compat.v3
	 */
	return setToCompatibilityMode = function(mmir) {

		core3Compatibility(mmir);
	};

});
