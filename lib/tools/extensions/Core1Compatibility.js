define(['mmirf/core2Compatibility', 'mmirf/languageManagerCompatibility', 'mmirf/commonUtilsCompatibility'
],
	/**
	 * Set to "backwards compatibility mode v1" (for pre version 2.0) for module names and method names.
	 *
	 * Uses {@link mmir.compat.v2.CoreCompat}, {@link mmir.compat.v1.CommonUtils},
	 * and {@link mmir.compat.v1.LanguageManager}.
	 *
	 * @param {mmir} mmir
	 * 			the (core) instance/namespace for MMIR
	 *
	 *
	 * @class
	 * @name mmir.compat.v1.CoreCompat
	 * @static
	 *
	 * @requires SemanticInterpreterCompatibility
	 *
	 * @example
	 * mmir.require(['mmirf/core1Compatibility', 'mmirf/core'], function(setCompatibility, mmir){
	 * 		setCompatibility(mmir);
	 * });
	 *
	 * //OR: if mmir-lib modules were require'd in application code, add v3 module-ID aliases first:
	 * mmir.require(['mmirf/core1ModuleIdCompatibility', 'mmirf/core2Compatibility', 'mmirf/core'], function(core3ModuleIdCompatibility, setCompatibility, mmir){
	 * 		core3ModuleIdCompatibility(mmir.require, window);
	 * 		setCompatibility(mmir);
	 * });
	 *
	 * @public
	 */
	function(core2Compatibility, languageManager1Compatibility, commonUtils1Compatibility){

	/**
	 * Set to "backwards compatibility mode v1" (for pre version 2.0).
	 *
	 * This function re-adds deprecated and removed functions and
	 * properties to the (core) mmir namespace.
	 *
	 * NOTE that once set to compatibility mode, it cannot be reset to
	 * non-compatibility mode.
	 *
	 *
	 * @param {mmir} mmir
	 * 			the (core) instance/namespace for MMIR
	 *
	 * @constructs mmir.compat.v1.CoreCompat
	 */
	return setToCompatibilityMode = function(mmir) {

		core2Compatibility(mmir);
		languageManager1Compatibility(mmir.LanguageManager);
		commonUtils1Compatibility(mmir.CommonUtils);
	};

});
