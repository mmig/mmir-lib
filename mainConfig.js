(function () {//execute in anonymous namespace/closure:
    
require.config({
	
	baseUrl: './mmirf'
		
	//TODO this should be defined/"defineable" somewhere else (outside the framework-scope) 
	, config: {
		

	    'inputManager': {
	        scxmlDoc: 'config/statedef/inputDescriptionSCXML.xml'
	        // simple | mode 
	        , mode: 'extended'
	    }
	    
	    , 'dialogManager': {
	        scxmlDoc: 'config/statedef/dialogDescriptionSCXML.xml'
	        // simple | mode 
	        , mode: 'extended'

	    }
	    
	}

	, paths : {
	    
	    // core
		  'core': 'core'
 	    , 'main': 'main'
 	    
	    // lib
 	    , 'jquery': 'vendor/libs/jquery-2.1.3'
 	    , 'scion': 'vendor/libs/scion-amd'
// 	    , 'cordova': 'vendor/libs/cordova-2.8.1'
	    
	    // globals and AMDs
 	    , 'constants': 'tools/constants'
 	    , 'commonUtils': 'tools/commonUtils'
	    , 'stringExtension': 'tools/extensions/StringExtensions'		
	    , 'dictionary': 'tools/dictionary'
	    , 'paramsParseFunc': 'tools/paramsParseFunc'
		, 'env': 'tools/envDetect'
		, 'envInit': 'tools/envInit'
	    
	    // dialog/input manager
	    , 'inputManager': 'manager/dialog/inputManager'
	    , 'dialogManager': 'manager/dialog/dialogManager'
	    , 'engineConfig': 'manager/dialog/engineConfig'
	    
	    , 'scionEngine': 'manager/dialog/scion/scionEngine'
	    , 'scionUtil': 'manager/dialog/scion/scionUtil'
	    
	    // controllers/models
	    , 'controllerManager': 'manager/controllerManager'
	    , 'controller': 'mvc/controllers/controller'
	    , 'helper': 'mvc/controllers/helper'
	    , 'modelManager': 'manager/modelManager'
	    
	    // #####################################################################
	    // ########### PRESENTATION LAYER (TODO: make changeable) ##############
	    // #####################################################################
	    
	    , 'presentationManager':  'manager/presentationManager'
	    
	    , 'jqm': 'vendor/libs/jquery.mobile-1.4.3'
	    , 'jqmSimpleModal': 'vendor/libs/jquery.simplemodal-1.4.4'

	    // @chsc03 required by parseUtils and all its dependencies declared in presentationManager
	    , 'antlr3' : 'vendor/libs/antlr3-all'
	    
	    , 'configurationManager': 'manager/settings/configurationManager'
	    	
	    // @chsc03 required by contentElement, renderUtils, declared in presentationManager [@russa not really...]
	    , 'languageManager': 'manager/settings/languageManager'
	    	
	    , 'mediaManager': 'manager/mediaManager'
		, 'notificationManager': 'manager/notificationManager'
	    

		, 'viewConstants': 'mvc/views/viewConstants'
	    // @chsc03 depends on parseUtils, renderUtils, yield, required in presentationManager
	    , 'layout': 'mvc/views/layout'
	    // @chsc03 depends on parseUtils, renderUtils, contentElement, required in presentationManager
	    , 'view': 'mvc/views/view'
	    // @chsc03 depends on parseUtils, renderUtils, contentElement, required in presentationManager
	    , 'partial': 'mvc/views/partial'				
	    , 'contentElement': 'mvc/views/contentElement'
	    , 'yield': 'mvc/views/yield'
	    
    	// @chsc03 renderUtils required by presentationManager and depends on parserModule
	    , 'renderUtils': 'mvc/parser/templateRenderUtils'
	    , 'parserModule': 'mvc/parser/parserModule'
	    	

		, 'storageUtils': 'mvc/parser/storageUtils'
	    
	    // @chsc03 parseUtils depends on the following paths
	    , 'parseUtils': 'mvc/parser/templateParseUtils'				
	    , 'ES3Lexer': 'gen/parser/ES3Lexer'
	    , 'ES3Parser': 'gen/parser/ES3Parser'
	    , 'scriptLexer': 'gen/parser/MmirScriptLexer'
	    , 'scriptParser': 'gen/parser/MmirScriptParser'
	    , 'contentLexer': 'gen/parser/MmirScriptContentLexer'
	    , 'contentParser': 'gen/parser/MmirScriptContentParser'				
	    , 'templateLexer': 'gen/parser/MmirTemplateLexer'
	    , 'templateParser': 'gen/parser/MmirTemplateParser'
	    
	    // @chsc03 templateProcessor depends on parsingResult
	    , 'templateProcessor': 'mvc/parser/templateProcessor'
	    , 'parsingResult': 'mvc/parser/parsingResult'
	    	
    	//grammar related
		, 'grammarConverter': 'semantic/grammarConverter'
		, 'semanticInterpreter': 'semantic/semanticInterpreter'
		, 'jscc':  'vendor/libs/jscc-amd'
		, 'jison': 'vendor/libs/jison'
		, 'pegjs': 'vendor/libs/peg-0.8.0'
		, 'jsccGen':  'env/grammar/jsccGenerator'
		, 'jisonGen': 'env/grammar/jisonGenerator'
		, 'pegjsGen': 'env/grammar/pegjsGenerator'

		//MD5 checksum computation: for checking pre-compiled resources, e.g.
		//    grammars (JSON->JS), and templates (eHTML->JS)
		, 'md5' : 'vendor/libs/md5'
		, 'checksumUtils' : 'tools/checksumUtils'

		//utility function for loading LINK tags (i.e. CSS files) into the current document
		, 'loadCss' : 'tools/loadCss'

	    , 'commonUtilsCompatibility' : 'tools/extensions/CommonUtilsCompatibility'
	    , 'languageManagerCompatibility' : 'tools/extensions/LanguageManagerCompatibility'
	    
	},//END: paths : {...

	shim : {
	    
	      'jqm':            ['jquery']
	    
	    , 'antlr3':         {exports : 'org'}
		
		, 'md5':            {exports : 'CryptoJS'}
		
		, 'pegjs':       	{exports: 'PEG'}
		
		, 'ES3Lexer':       {deps: ['antlr3'], exports: 'ES3Lexer'}
		, 'ES3Parser':      {deps: ['antlr3'], exports: 'ES3Parser'}
    	, 'scriptLexer':    {deps: ['antlr3'], exports: 'MmirScriptLexer'}
    	, 'scriptParser':   {deps: ['antlr3'], exports: 'MmirScriptParser'}
    	, 'contentLexer':   {deps: ['antlr3'], exports: 'MmirScriptContentLexer'}
    	, 'contentParser':  {deps: ['antlr3'], exports: 'MmirScriptContentParser'}
    	, 'templateLexer':  {deps: ['antlr3'], exports: 'MmirTemplateLexer'}
    	, 'templateParser': {deps: ['antlr3'], exports: 'MmirTemplateParser'}
    	
    	//TODO implement explicit mechanism for declaring & loading dependencies (JS & CSS)
    	//QUICKFIX hardcode impl.-specific dependencies here:
    	, 'presentationManager': ['jqmCss', 'jqmSimpleModal']

	}
	
});//END: require.config({...


/** 
 * @depends jQuery#selector
 * @depends jQuery.appendTo
 */
//FIXME see remark above for shim::presentationManager
// -> QUICKFIX define the CSS dependency here:
define('jqmCss', ['jquery'], function loadJqmCss($) {
	
	$("<link/>", {
	    rel: "stylesheet",
	    type: "text/css",
	    href: "mmirf/vendor/styles/jquery.mobile-1.4.3.min.css"
	}).appendTo("head");
	
});


require(['core'], function(core){
	var startModule = core.startModule;
	
	core.applyConfig();
	
	require([startModule]);
});

}());//END: (function(){...
