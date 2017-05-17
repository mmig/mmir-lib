define(['mmirf/core3Compatibility', 'mmirf/languageManagerCompatibility', 'mmirf/commonUtilsCompatibility'
], 
	/**
     * Set to "backwards compatibility mode v2" (for pre version 3.0) for module names and method names.
     * 
     * 
     * @param {mmir} mmir
     * 			the (core) instance/namespace for MMIR
     * 
	 * 
	 * @class
	 * @name mmir.Core.setToCompatibilityModeExtension
	 * @static
	 * 
	 * @requires SemanticInterpreterCompatibility
	 * 
	 * @example
	 * require(['mmirf/core2Compatibility', 'mmirf/core'], function(setCompatibility, mmir){
	 * 		setCompatibility(mmir);
	 * });
	 * 
	 * @public
	 */
	function(core3Compatibility, languageManager2Compatibility, commonUtils2Compatibility){

	/**
     * Set to "backwards compatibility mode v2" (for pre version 3.0).
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
     * @constructs mmir.Core.setToCompatibilityModeExtension
     */
    return setToCompatibilityMode = function(mmir) {
    	
    	core3Compatibility(mmir);
    	languageManager2Compatibility(mmir.LanguageManager);
    	commonUtils2Compatibility(mmir.CommonUtils);
    };
    
});
