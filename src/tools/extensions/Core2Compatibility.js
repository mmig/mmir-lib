define(['mmirf/core3Compatibility', 'mmirf/languageManagerCompatibility', 'mmirf/commonUtilsCompatibility'
], 
	/**
     * Set to "backwards compatibility mode v2" (for pre version 3.0) for module names and method names.
     * 
     * NOTE: the API for v2 and v3 are the same, so compatibility-mode is essentially the same as
     *       {@link mmir.Core.setToCompatibilityMode3Extension}.
     * 
     * @param {mmir} mmir
     * 			the (core) instance/namespace for MMIR
     * 
	 * 
	 * @class
	 * @name mmir.Core.setToCompatibilityMode2Extension
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
	 * @see mmir.Core.setToCompatibilityMode2Extension
	 * @see mmir.Core.getCompatibility3ModuleId
	 */
	function(core3Compatibility){

	/**
     * Set to "backwards compatibility mode v2" (for pre version 3.0).
     * 
     * @constructs mmir.Core.setToCompatibilityMode2Extension
     * @see mmir.Core.setToCompatibilityMode3Extension
     */
    return setToCompatibilityMode = function(mmir) {
    	
    	core3Compatibility(mmir);
    };
    
});
