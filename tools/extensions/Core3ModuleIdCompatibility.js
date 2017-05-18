define(['mmirf/util/isArray'],
	/**
     * Maps requirejs module IDs from mmir-lib v3 (and earlier) to module IDs used in mmir-lib version >= 4.
     * 
     * 
	 * 
	 * @class
	 * @name mmir.Core.getCompatibility3ModuleId
	 * @static
	 * 
	 * @example
	 * mmir.require(['mmirf/core3ModuleIdCompatibility', 'mmirf/core'], function(core3ModuleIdCompatibility, mmir){
	 * 		core3ModuleIdCompatibility(mmir.require, window, false);
	 * });
	 * 
	 * @public
	 */
	function(isArray){
	
	/**
	 * Map v3 IDs (input) to v4 IDs (output)
	 * 
	 * @memberOf mmir.Core.getCompatibility3ModuleId
	 */
	var core3Ids = {
			
		  'core': 'mmirf/core'
 	    , 'main': 'mmirf/main'
 	    , 'scion': 'mmirf/scion'
 	    , 'constants': 'mmirf/constants'
 	    , 'commonUtils': 'mmirf/commonUtils'
	    , 'stringExtension': 'mmirf/stringExtensions'
	    , 'dictionary': 'mmirf/dictionary'
	    , 'paramsParseFunc': 'mmirf/paramsParseFunc'
		, 'env': 'mmirf/env'
	    , 'inputManager': 'mmirf/inputManager'
	    , 'inputEngine': 'mmirf/inputEngine'
	    , 'dialogManager': 'mmirf/dialogManager'
	    , 'dialogEngine': 'mmirf/dialogEngine'
	    , 'engineConfig': 'mmirf/engineConfig'
	    , 'scionEngine': 'mmirf/scionEngine'
	    , 'scionUtil': 'mmirf/scionUtil'

	    , 'controllerManager': 'mmirf/controllerManager'
	    , 'controller': 'mmirf/controller'
	    , 'helper': 'mmirf/helper'
	    , 'modelManager': 'mmirf/modelManager'
	    , 'presentationManager': 'mmirf/presentationManager'
	    , 'jqmViewEngine': 'mmirf/jqmViewEngine'
		, 'waitDialog': 'mmirf/waitDialog'

	    , 'configurationManager': 'mmirf/configurationManager'
	    , 'languageManager': 'mmirf/languageManager'
	    , 'mediaManager': 'mmirf/mediaManager'
		, 'notificationManager': 'mmirf/notificationManager'

		, 'viewConstants': 'mmirf/viewConstants'
	    , 'layout': 'mmirf/layout'
	    , 'view': 'mmirf/view'
	    , 'partial': 'mmirf/partial'
	    , 'contentElement': 'mmirf/contentElement'
	    , 'yield': 'mmirf/yield'
	    , 'viewLoader': 'mmirf/viewLoader'

	    , 'antlr3': 'mmirf/antlr3'
	    , 'renderUtils': 'mmirf/renderUtils'
	    , 'parserModule': 'mmirf/parserModule'
		, 'storageUtils': 'mmirf/storageUtils'
	    , 'parseUtils': 'mmirf/parseUtils'
	    , 'ES3Lexer': 'mmirf/ES3Lexer'
	    , 'ES3Parser': 'mmirf/ES3Parser'
	    , 'scriptLexer': 'mmirf/scriptLexer'
	    , 'scriptParser': 'mmirf/scriptParser'
	    , 'contentLexer': 'mmirf/contentLexer'
	    , 'contentParser': 'mmirf/contentParser'
	    , 'templateLexer': 'mmirf/templateLexer'
	    , 'templateParser': 'mmirf/templateParser'
	    , 'templateProcessor': 'mmirf/templateProcessor'
	    , 'parsingResult': 'mmirf/parsingResult'

		, 'grammarConverter': 'mmirf/grammarConverter'
		, 'semanticInterpreter': 'mmirf/semanticInterpreter'
		, 'asyncGrammar': 'mmirf/asyncGrammar'
		, 'stemmer': 'mmirf/stemmer'
		, 'jscc': 'mmirf/jscc'
		, 'jison': 'mmirf/jison'
		, 'pegjs': 'mmirf/pegjs'
		, 'asyncGen': 'mmirf/asyncGen'
		, 'jsccGen': 'mmirf/jsccGen'
		, 'jsccAsyncGen': 'mmirf/jsccAsyncGen'
		, 'jisonGen': 'mmirf/jisonGen'
		, 'jisonAsyncGen': 'mmirf/jisonAsyncGen'
		, 'pegjsGen': 'mmirf/pegjsGen'
		, 'pegjsAsyncGen': 'mmirf/pegjsAsyncGen'

		, 'md5': 'mmirf/md5'
		, 'checksumUtils': 'mmirf/checksumUtils'
		, 'loadCss': 'mmirf/loadCss'

		, 'encodeUtils': 'mmirf/encodeUtils' 
		, 'jsonUtils': 'mmirf/jsonUtils'
	    , 'commonUtilsCompatibility': 'mmirf/commonUtilsCompatibility'
	    , 'languageManagerCompatibility': 'mmirf/languageManagerCompatibility'
	    , 'core3Compatibility' : 'mmirf/core3Compatibility'
	    , 'semanticInterpreterCompatibility' : 'mmirf/semanticInterpreterCompatibility'
    	, 'tools/resizeFitToSourroundingBox' : 'mmirf/resizeToFit'

		, 'logger': 'mmirf/logger'
    	, 'loggerEnabled': 'mmirf/logger'
    	, 'loggerDisabled': 'mmirf/loggerDisabled'
	    , 'stacktrace': 'mmirf/stacktrace'

	    //external libraries:
	    , 'jquery': 'jquery'
		, 'jqm': 'jqm'
		, 'jqmSimpleModal': 'jqmSimpleModal'
	};
	
	/**
	 * requirejs shim configuration for v3 modules (that are no longer used in v4).
	 * 
	 * @memberOf mmir.Core.getCompatibility3ModuleId
	 */
	var core3Shims = {
		shim: {
			//dependencies for jqmViewEngine (may not be loaded if jqmViewEngine is not loaded)
	    	'jqm': ['jquery'],
	    	'jqmSimpleModal': ['jqm']
		}
	};

	/**
     * 
     * Maps requirejs module IDs from mmir-lib v3 (and earlier) to module IDs used in mmir-lib version >= 4.
     * 
     * @param {String} id
     * 			the v3 module ID
     * @returns {String}
     * 			the corresponding v4 module ID
     * 
	 * @memberOf mmir.Core.getCompatibility3ModuleId
     */
    var getId = function(id) {
    	
    	var nid = core3Ids[id];
    	return nid? nid : id;
    	
    };
    
    /**
     * Get the requirejs shim configuration for v3 modules (that are no longer used in v4).
     * 
     * @returns {PlainObject}
     * 			the requirejs configuration for v3 module shims
     * 
     * @example
     * mmir.config(compat.getLegacyConfig());
     * 
	 * @memberOf mmir.Core.getCompatibility3ModuleId
     */
    var getLegacyConfig = function() {
    	
    	return core3Shims;
    	
    };
    
    /**
     * Set to "backwards compatibility mode" (for pre version 4.0).
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
	 * @memberOf mmir.Core.getCompatibility3ModuleId
     */
    var setToCompatibilityMode = function(requirejs, context, isSetJsOnly) {
    	
    	context = context || window;
    	
    	context['__requirejs'] = context['requirejs'];
    	
    	var _id = getId;
    	//helper function that maps module IDs to v3 module names, if necessary
    	var req = function(){
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
    		return context['__requirejs'].apply(context, arguments);
    	};
    	
    	if(!isSetJsOnly){
    		context['require'] = req;
    	}
    	context['requirejs'] = req;
    };
    
    return setToCompatibilityMode;
    
});
