(function () {//execute in anonymous namespace/closure:


/** @memberOf mmir.mainConfig */
var mmirf_config = {
	
	/** @memberOf mmir.require.config */		
	baseUrl: './mmirf'
		
	//TODO this should be defined/"defineable" somewhere else (outside the framework-scope) 
	, config: {
		
		/** @memberOf mmir.require.config.moduleConfig */
	    'inputManager': {
	        scxmlDoc: 'config/statedef/inputDescriptionSCXML.xml'
	        // simple | mode 
	        , mode: 'extended'
	        //EXAMPLE: set module-specific log-level to 'info'
//		    , logLevel: 'info'
	    }
	    
	    , 'dialogManager': {
	        scxmlDoc: 'config/statedef/dialogDescriptionSCXML.xml'
	        // simple | mode 
	        , mode: 'extended'
	        //EXAMPLE: set module-specific log-level to 'verbose'
//		    , logLevel: 'verbose'
	    }

        //EXAMPLE: set module-specific log-level to 'warn' 
	    //         log-levels: 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled'
	    //         or number:     0           1        2        3         4           5           6
//	    , 'view': { logLevel: 'warn' }
	    
	}

	, paths : {
		/** @memberOf mmir.require.config.paths */
	    // core
		  'core': 'core'
 	    , 'main': 'main'
 	    
	    // lib
 	    , 'jquery': 'vendor/libs/jquery-2.2.3'
 	    , 'scion': 'vendor/libs/scion-amd'
	    
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
	    
	    , 'presentationManager': 'manager/presentationManager'
	    
	    //default view-engine (this ID is used in core.viewEngine)
	    , 'jqmViewEngine': 'env/view/jqmViewEngine'
	    
	    //dependencies for the jqmViewEngine (NOTE these may not be loaded, if jqmViewEngine is not loaded)
		, 'jqm' : 			'vendor/libs/jquery.mobile-1.4.5'
		, 'jqmSimpleModal':	'vendor/libs/jquery.simplemodal-1.4.4'
		
		, 'waitDialog':		'tools/stdlne-wait-dlg'

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
		, 'asyncGrammar': 'semantic/asyncGrammar'
		, 'jscc':  'vendor/libs/jscc-amd'
		, 'jison': 'vendor/libs/jison'
		, 'pegjs': 'vendor/libs/peg-0.9.0'
		, 'asyncGen': 'env/grammar/asyncGenerator'
		, 'jsccGen': 'env/grammar/jsccGenerator'
		, 'jsccAsyncGen': 'env/grammar/jsccAsyncGenerator'
		, 'jisonGen': 'env/grammar/jisonGenerator'
		, 'jisonAsyncGen': 'env/grammar/jisonAsyncGenerator'
		, 'pegjsGen': 'env/grammar/pegjsGenerator'
		, 'pegjsAsyncGen': 'env/grammar/pegjsAsyncGenerator'

		//MD5 checksum computation: for checking pre-compiled resources, e.g.
		//    grammars (JSON->JS), and templates (eHTML->JS)
		, 'md5' : 'vendor/libs/md5'
		, 'checksumUtils' : 'tools/checksumUtils'

		//utility function for loading LINK tags (i.e. CSS files) into the current document
		, 'loadCss' : 'tools/loadCss'

		, 'jsonUtils' : 'tools/extensions/JsonUtils'
	    , 'commonUtilsCompatibility' : 'tools/extensions/CommonUtilsCompatibility'
	    , 'languageManagerCompatibility' : 'tools/extensions/LanguageManagerCompatibility'
	    
	},//END: paths : {...

	shim : {
		
		/** @memberOf mmir.require.config.shim */
	    'antlr3':			{deps: ['parsingResult'], exports : 'org'}
		
		, 'md5':            {exports : 'CryptoJS'}
		
		, 'pegjs':       	{exports: 'PEG'}
		
		, 'ES3Lexer':       {deps: ['antlr3'], init: function(org){ return ES3Lexer;} }
		, 'ES3Parser':      {deps: ['antlr3'], init: function(org){ return ES3Parser;} }
    	, 'scriptLexer':    {deps: ['antlr3'], init: function(org){ return MmirScriptLexer;} }
    	, 'scriptParser':   {deps: ['antlr3'], init: function(org){ return MmirScriptParser;} }
    	, 'contentLexer':   {deps: ['antlr3'], init: function(org){ return MmirScriptContentLexer;} }
    	, 'contentParser':  {deps: ['antlr3'], init: function(org){ return MmirScriptContentParser;} }
    	, 'templateLexer':  {deps: ['antlr3'], init: function(org){ return MmirTemplateLexer;} }
    	, 'templateParser': {deps: ['antlr3'], init: function(org){ return MmirTemplateParser;} }
    	
    	//dependencies for jqmViewEngine (may not be loaded if jqmViewEngine is not loaded)
    	, 'jqm': ['jquery']
    	, 'jqmSimpleModal': ['jqm']
	}
	
};//END: require.config({...

/** apply mmir-configuration and retrieve (local) requirejs instance
 * @type requirejs 
 * @memberOf mmir.mainConfig */
var reqInstance = requirejs.config(mmirf_config);

//start mmir initialization by (re-)loading the core-module, pre-configuring mmir, and then load the main-module:
reqInstance(['core'], /** @memberOf mmir.mainConfig */ function mmirLoader(core){
	
	//attach the local-require instance:
	core.require = reqInstance;
	
	//get the "entry-point", i.e. module-name/-id that will be loaded (default: "main") 
	var startModule = core.startModule;
	
	//setup the logger implementation:
	// one of ['logger' | 'loggerDisabled']
	var logConfig = {paths:{'logger': 'tools/logger'}};
	if(core.debug === false){
		//this will load a "disabled" logger implementation with no-op functions etc.
		logConfig.paths.logger += 'Disabled';
	}
	//if the "functional" logger is set, configure it:
	else {
		
		//retrieve/set the default log-level:
		if(typeof core.logLevel !== 'undefined'){
			logConfig.config = {'logger': {logLevel: core.logLevel}};
		}
		
		//set up the stacktrace for log messages (or not)
		var isEnableTrace = true;
		if(typeof core.logTrace !== 'undefined'){
			isEnableTrace = core.logTrace;
		}
		
		//normalize config object
		if(!logConfig.config){
			logConfig.config = {};
		}
		if(!logConfig.config['logger']){
			logConfig.config['logger'] = {};
		}
		
		if(isEnableTrace === true || (isEnableTrace && isEnableTrace.trace === true)){
			//add module ID for stacktrace library
			logConfig.paths['stacktrace'] = 'vendor/libs/stacktrace-v0.6.4';
			logConfig.config['logger'].trace = isEnableTrace;
		}
		else {
			//define dummy module for stacktrace library (will not be used!)
			define('stacktrace', function(){ return function(){}; });
			logConfig.config['logger'].trace = false;
		}

	}
	//"append" the logger-config
	core.config(logConfig);
	
	
	//apply all configs / modifications that were made on the core-module
	core.applyConfig(mmirf_config);
	
	
	//finally: trigger framework loading
	core.require(['logger',startModule]);
});

}());//END: (function(){...
