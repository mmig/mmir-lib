define(['mmirf/core3Compatibility', 'mmirf/languageManagerCompatibility', 'mmirf/commonUtilsCompatibility'
],
	/**
     * Set to "backwards compatibility mode v2" (for pre version 3.0) for module names and method names.
     *
     * NOTE: the API for v2 and v3 are the same, so compatibility-mode is essentially the same as
     *       {@link mmir.compat.v3.CoreCompat}.
     *
     * @param {mmir} mmir
     * 			the (core) instance/namespace for MMIR
     *
	 *
	 * @class
	 * @name mmir.compat.v2.CoreCompat
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
	 * @see mmir.compat.v2.CoreCompat
	 * @see mmir.compat.v3.ModuleIdCompat
	 */
	function(core3Compatibility){

	/**
     * Set to "backwards compatibility mode v2" (for pre version 3.0).
     *
     * @constructs mmir.compat.v2.CoreCompat
     * @see mmir.compat.v3.CoreCompat
     */
    return setToCompatibilityMode = function(mmir) {

    	core3Compatibility(mmir);
    };

});
