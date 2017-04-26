(function (requirejs, define) {//execute in anonymous namespace/closure:


/** @memberOf mmir.mainConfig */
var mmirf_config = {

	/** @memberOf mmir.require.config */
	baseUrl: './mmirf'

	//configurations for the modules:
	, config: {

		/** @memberOf mmir.require.config.moduleConfig */
	    'inputManager': {
	        scxmlDoc: 'config/statedef/inputDescriptionSCXML.xml'
	        // simple | mode
	        , mode: 'extended'
	        //EXAMPLE: set module-specific log-level to 'info'
//		    , logLevel: 'info'
	    }
		/** @memberOf mmir.require.config.moduleConfig */
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

	//definition for the module IDs and their (file) paths
	, paths : {
		/** @memberOf mmir.require.config.paths */
	    // core
		  'core': 'core'
 	    , 'main': 'main'

	    // lib
 	    , 'scion': 'vendor/libs/scion-amd-mod.min'

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
	    // ####################### PRESENTATION LAYER ##########################
	    // #####################################################################

	    , 'presentationManager': 'manager/presentationManager'

	    //default view-engine (this ID is used in core.viewEngine)
	    , 'jqmViewEngine': 'env/view/jqmViewEngine'

	    //TODO extract/make optional:
	    //dependencies for the jqmViewEngine (NOTE these may not be loaded, if jqmViewEngine is not loaded)
//	 	, 'jquery': 'vendor/libs/jquery-2.2.3'
		, 'jqm': 'vendor/libs/jquery.mobile-1.4.5'
		, 'jqmSimpleModal': 'vendor/libs/jquery.simplemodal-1.4.4'

		, 'waitDialog': 'tools/stdlne-wait-dlg'

	    // @chsc03 required by parseUtils and all its dependencies declared in presentationManager
	    , 'antlr3': 'vendor/libs/antlr3-all'

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

	    // #####################################################################
	    // ########                SEMANTIC PROCESSING              ############
	    // ######## (grammar generation/compilation, execution etc) ############
	    // #####################################################################
		, 'grammarConverter': 'semantic/grammarConverter'
		, 'semanticInterpreter': 'semantic/semanticInterpreter'
		, 'asyncGrammar': 'semantic/asyncGrammar'
		, 'stemmer': 'semantic/stemmer'
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
		, 'md5': 'vendor/libs/md5'
		, 'checksumUtils': 'tools/checksumUtils'

		//utility function for loading LINK tags (i.e. CSS files) into the current document
		, 'loadCss': 'tools/loadCss'

		, 'jsonUtils': 'tools/extensions/JsonUtils'
	    , 'commonUtilsCompatibility': 'tools/extensions/CommonUtilsCompatibility'
	    , 'languageManagerCompatibility': 'tools/extensions/LanguageManagerCompatibility'


	    //optional or "dynamically" loaded modules

	    // #####################################################################
	    // #####         OPTIONAL / DYNAMICALLY LOADED MODULES          ########
	    // ##### (depending on configuration in core.js or global vars) ########
	    // #####################################################################

	    // (console) logging related modules (either 'loggerEnabled' or 'loggerDisabled' will be mapped to 'logger', depending on configuration
    	, 'loggerEnabled': 'tools/logger'
    	, 'loggerDisabled': 'tools/loggerDisabled'
	    , 'stacktrace': 'vendor/libs/stacktrace-v0.6.4'

	},//END: paths : {...

	shim : {

		/** @memberOf mmir.require.config.shim */
	    'antlr3':			{deps: ['parsingResult'], exports : 'org'}

		/** @memberOf mmir.require.config.shim */
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

	
	, packages: [{
		name: "util",
		location: "tools/util_purejs"
     }]
	
//	, bundles: {
//		'util_modules': ['util/loadFile', 'util/deferred', 'util/isArray', 'util/extend', 'util/forEach', 'util/toArray', 'util/deferredWithState']
//	}

};//END: require.config({...


//var base = mmirf_config.baseUrl, path;
//mmirf_config.baseUrl = '';
//if(base) for(var mod in mmirf_config.paths){
//	path = mmirf_config.paths[mod];
//	mmirf_config.paths[mod] = base +'/'+ path;
//}

//allow to change baseUrl for mmir-lib
var coreName = typeof MMIR_CORE_NAME === 'string'? MMIR_CORE_NAME : 'mmir';
var mmirCore = window[coreName];
if(typeof mmirCore !== 'undefined'){
	if(mmirCore && mmirCore._mmirLibPath){
		mmirf_config.baseUrl = mmirCore._mmirLibPath;
	}
}


/** apply mmir-configuration and retrieve (local) requirejs instance
 * @type requirejs
 * @memberOf mmir.mainConfig */
var reqInstance = requirejs.config(mmirf_config);
var defInstance = define;

//start mmir initialization by (re-)loading the core-module, pre-configuring mmir, and then load the framework's start-module:
reqInstance(['core'], /** @memberOf mmir.mainConfig */ function mmirLoader(core){

	//attach the local-require instance:
	core.require = reqInstance;
	core._define = defInstance;

	//get the "entry-point", i.e. module-name/-id that will be loaded (default: "main")
	var startModule = core.startModule;

	//setup the logger implementation:
	// map 'logger' to one of  ['loggerEnabled' | 'loggerDisabled']
	var isEnableLogger = core.debug !== false;//NOTE: only explicitly setting debug to boolean false will disable logging
	var implName = isEnableLogger? 'loggerEnabled' : 'loggerDisabled';
	var implPath = mmirf_config.paths[implName];
	var logConfig = {paths:{'logger': implPath}};

	//if the "functional" logger is set, configure it
	// (NOTE: for "disabled" logger, the implementation is provided with no-op functions etc.)
	if(isEnableLogger) {

		logConfig.config = {'logger': {}};
		var logSettings = logConfig.config['logger'];

		//retrieve/set the default log-level:
		if(typeof core.logLevel !== 'undefined'){
			logSettings.logLevel = core.logLevel;
		}

		//set up the stacktrace for log messages (or not)
		var isEnableTrace = true;
		if(typeof core.logTrace !== 'undefined'){
			isEnableTrace = core.logTrace;
		}

		if(isEnableTrace === true || (isEnableTrace && isEnableTrace.trace === true)){
			//add module ID for stacktrace library
			logSettings.trace = isEnableTrace;
		}
		else {
			//define dummy module for stacktrace library
			// (will not be used anyway, but this avoids loading the actual stacktrace impl. from file)
			define('stacktrace', function(){ return function(){}; });
			logSettings.trace = false;
		}

	}
	//"append" the logger-config
	core.config(logConfig);
	
	//if there already is a jQuery version loaded, use that one
	var jq = null;
	if(typeof jQuery !== 'undefined' || core.jquery){
		
		if(!core.jquery){
			core.jquery = jQuery;
		}
		
		jq = core.jquery;
		
		core.config({
			//make jQuery available in requirejs
			paths: {'jquery': void(0)},
			//configure tools to use jQuery implementation:
			packages: [{
				name: "util",
				location: "tools/util_jquery"
			}]
		});
	}


	//apply all configs / modifications that were made on the core-module
	core.applyConfig(mmirf_config);
	
	if(jq){
		core._define('jquery', function(){
			return jq;
		});
	}


	//finally: trigger framework loading
	core.require(['logger',startModule]);
});

}(requirejs, define));//END: (function(){...
