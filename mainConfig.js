(function (requirejs, define) {//execute in anonymous namespace/closure:


/** @memberOf mmir.mainConfig */
var mmirf_config = {

	/** @memberOf mmir.require.config */
	baseUrl: './'

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
		  'core': 'mmirf/core'
 	    , 'main': 'mmirf/main'

	    // lib
 	    , 'scion': 'mmirf/vendor/libs/scion-amd-mod.min'

	    // globals and AMDs
 	    , 'constants': 'mmirf/tools/constants'
 	    , 'commonUtils': 'mmirf/tools/commonUtils'
	    , 'stringExtension': 'mmirf/tools/extensions/StringExtensions'
	    , 'dictionary': 'mmirf/tools/dictionary'
	    , 'paramsParseFunc': 'mmirf/tools/paramsParseFunc'
		, 'env': 'mmirf/tools/envDetect'

	    // dialog/input manager
	    , 'inputManager': 'mmirf/manager/dialog/inputManager'
	    , 'dialogManager': 'mmirf/manager/dialog/dialogManager'
	    , 'engineConfig': 'mmirf/manager/dialog/engineConfig'

	    , 'scionEngine': 'mmirf/manager/dialog/scion/scionEngine'
	    , 'scionUtil': 'mmirf/manager/dialog/scion/scionUtil'

	    // controllers/models
	    , 'controllerManager': 'mmirf/manager/controllerManager'
	    , 'controller': 'mmirf/mvc/controllers/controller'
	    , 'helper': 'mmirf/mvc/controllers/helper'
	    , 'modelManager': 'mmirf/manager/modelManager'

	    // #####################################################################
	    // ####################### PRESENTATION LAYER ##########################
	    // #####################################################################

	    , 'presentationManager': 'mmirf/manager/presentationManager'

	    //default view-engine (this ID is used in core.viewEngine)
	    , 'jqmViewEngine': 'mmirf/env/view/jqmViewEngine'

	    //TODO extract/make optional:
	    //dependencies for the jqmViewEngine (NOTE these may not be loaded, if jqmViewEngine is not loaded)
//	 	, 'jquery': 'mmirf/vendor/libs/jquery-2.2.3'
		, 'jqm': 'mmirf/vendor/libs/jquery.mobile-1.4.5'
		, 'jqmSimpleModal': 'mmirf/vendor/libs/jquery.simplemodal-1.4.4'

		, 'waitDialog': 'mmirf/tools/stdlne-wait-dlg'

	    // @chsc03 required by parseUtils and all its dependencies declared in presentationManager
	    , 'antlr3': 'mmirf/vendor/libs/antlr3-all'

	    , 'configurationManager': 'mmirf/manager/settings/configurationManager'

	    // @chsc03 required by contentElement, renderUtils, declared in presentationManager [@russa not really...]
	    , 'languageManager': 'mmirf/manager/settings/languageManager'

	    , 'mediaManager': 'mmirf/manager/mediaManager'
		, 'notificationManager': 'mmirf/manager/notificationManager'


		, 'viewConstants': 'mmirf/mvc/views/viewConstants'
	    // @chsc03 depends on parseUtils, renderUtils, yield, required in presentationManager
	    , 'layout': 'mmirf/mvc/views/layout'
	    // @chsc03 depends on parseUtils, renderUtils, contentElement, required in presentationManager
	    , 'view': 'mmirf/mvc/views/view'
	    // @chsc03 depends on parseUtils, renderUtils, contentElement, required in presentationManager
	    , 'partial': 'mmirf/mvc/views/partial'
	    , 'contentElement': 'mmirf/mvc/views/contentElement'
	    , 'yield': 'mmirf/mvc/views/yield'
	    	
	    // view loader: loads compiled views or raw views & compiles them:
	    , 'viewLoader': 'mmirf/env/view/viewLoader'

    	// @chsc03 renderUtils required by viewInitializer and depends on parserModule
	    , 'renderUtils': 'mmirf/mvc/parser/templateRenderUtils'
	    , 'parserModule': 'mmirf/mvc/parser/parserModule'

		, 'storageUtils': 'mmirf/mvc/parser/storageUtils'

	    // @chsc03 parseUtils depends on the following paths
	    , 'parseUtils': 'mmirf/mvc/parser/templateParseUtils'
	    , 'ES3Lexer': 'mmirf/gen/parser/ES3Lexer'
	    , 'ES3Parser': 'mmirf/gen/parser/ES3Parser'
	    , 'scriptLexer': 'mmirf/gen/parser/MmirScriptLexer'
	    , 'scriptParser': 'mmirf/gen/parser/MmirScriptParser'
	    , 'contentLexer': 'mmirf/gen/parser/MmirScriptContentLexer'
	    , 'contentParser': 'mmirf/gen/parser/MmirScriptContentParser'
	    , 'templateLexer': 'mmirf/gen/parser/MmirTemplateLexer'
	    , 'templateParser': 'mmirf/gen/parser/MmirTemplateParser'

	    // @chsc03 templateProcessor depends on parsingResult
	    , 'templateProcessor': 'mmirf/mvc/parser/templateProcessor'
	    , 'parsingResult': 'mmirf/mvc/parser/parsingResult'

	    // #####################################################################
	    // ########                SEMANTIC PROCESSING              ############
	    // ######## (grammar generation/compilation, execution etc) ############
	    // #####################################################################
		, 'grammarConverter': 'mmirf/semantic/grammarConverter'
		, 'semanticInterpreter': 'mmirf/semantic/semanticInterpreter'
		, 'asyncGrammar': 'mmirf/semantic/asyncGrammar'
		, 'stemmer': 'mmirf/semantic/stemmer'
		, 'jscc': 'mmirf/vendor/libs/jscc-amd'
		, 'jison': 'mmirf/vendor/libs/jison'
		, 'pegjs': 'mmirf/vendor/libs/peg-0.9.0'
		, 'asyncGen': 'mmirf/env/grammar/asyncGenerator'
		, 'jsccGen': 'mmirf/env/grammar/jsccGenerator'
		, 'jsccAsyncGen': 'mmirf/env/grammar/jsccAsyncGenerator'
		, 'jisonGen': 'mmirf/env/grammar/jisonGenerator'
		, 'jisonAsyncGen': 'mmirf/env/grammar/jisonAsyncGenerator'
		, 'pegjsGen': 'mmirf/env/grammar/pegjsGenerator'
		, 'pegjsAsyncGen': 'mmirf/env/grammar/pegjsAsyncGenerator'

		//MD5 checksum computation: for checking pre-compiled resources, e.g.
		//    grammars (JSON->JS), and templates (eHTML->JS)
		, 'md5': 'mmirf/vendor/libs/md5'
		, 'checksumUtils': 'mmirf/tools/checksumUtils'

		//utility function for loading LINK tags (i.e. CSS files) into the current document
		, 'loadCss': 'mmirf/tools/loadCss'

		, 'jsonUtils': 'mmirf/tools/extensions/JsonUtils'
	    , 'commonUtilsCompatibility': 'mmirf/tools/extensions/CommonUtilsCompatibility'
	    , 'languageManagerCompatibility': 'mmirf/tools/extensions/LanguageManagerCompatibility'


	    //optional or "dynamically" loaded modules

	    // #####################################################################
	    // #####         OPTIONAL / DYNAMICALLY LOADED MODULES          ########
	    // ##### (depending on configuration in core.js or global vars) ########
	    // #####################################################################

	    // (console) logging related modules (either 'loggerEnabled' or 'loggerDisabled' will be mapped to 'logger', depending on configuration
    	, 'loggerEnabled': 'mmirf/tools/logger'
    	, 'loggerDisabled': 'mmirf/tools/loggerDisabled'
	    , 'stacktrace': 'mmirf/vendor/libs/stacktrace-v0.6.4'

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
		'name': 'util',
		'location': 'mmirf/tools/util_purejs'
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
	var implName = isEnableLogger? 'loggerEnabled': 'mmirf/loggerDisabled';
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
				'name': 'util',
				'location': 'mmirf/tools/util_jquery'
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
