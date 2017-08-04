(function (requirejs, define, window) {//execute in anonymous namespace/closure:


/** @memberOf mmir.mainConfig */
var mmirf_config = {

	/** @memberOf mmir.require.config */
	baseUrl: './'

	//configurations for the modules:
	, config: {

		/** @memberOf mmir.require.config.moduleConfig */
	    'mmirf/inputManager': {
	        scxmlDoc: 'config/statedef/inputDescriptionSCXML.xml'
	        // simple | mode
	        , mode: 'extended'
	        //EXAMPLE: set module-specific log-level to 'info'
//		    , logLevel: 'info'
	    }
		/** @memberOf mmir.require.config.moduleConfig */
	    , 'mmirf/dialogManager': {
	        scxmlDoc: 'config/statedef/dialogDescriptionSCXML.xml'
	        // simple | mode
	        , mode: 'extended'
	        //EXAMPLE: set module-specific log-level to 'verbose'
//		    , logLevel: 'verbose'
	    }
	    , 'mmirf/simpleViewEngine': {
	    	//ID attribute when inserting simpleViewEngine style:
	    	cssId: 'simple-view'
	    	//the path to the css file for the simpleViewEngine style:
	    	, cssUrl: 'mmirf/vendor/styles/simpleViewLayout.css'
	    }

        //EXAMPLE: set module-specific log-level to 'warn'
	    //         log-levels: 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled'
	    //         or number:     0           1        2        3         4           5           6
//	    , 'mmirf/view': { logLevel: 'warn' }

	}

	//definition for the module IDs and their (file) paths
	, paths : {
		/** @memberOf mmir.require.config.paths */
	    // core
		  'mmirf/core': 'mmirf/core'
 	    , 'mmirf/main': 'mmirf/main'

	    // lib
 	    , 'mmirf/scion': 'mmirf/vendor/libs/scion-amd-mod.min'

	    // globals and AMDs
 	    , 'mmirf/constants': 'mmirf/tools/constants'
 	    , 'mmirf/commonUtils': 'mmirf/tools/commonUtils'
	    , 'mmirf/dictionary': 'mmirf/tools/dictionary'
	    , 'mmirf/paramsParseFunc': 'mmirf/tools/paramsParseFunc'
		, 'mmirf/env': 'mmirf/tools/envDetect'

	    // dialog/input manager
	    , 'mmirf/inputManager': 'mmirf/manager/dialog/inputManager'
	    , 'mmirf/dialogManager': 'mmirf/manager/dialog/dialogManager'
	    , 'mmirf/engineConfig': 'mmirf/manager/dialog/engineConfig'

	    , 'mmirf/scionEngine': 'mmirf/manager/dialog/scion/scionEngine'
	    , 'mmirf/scionUtil': 'mmirf/manager/dialog/scion/scionUtil'

	    // controllers/models
	    , 'mmirf/controllerManager': 'mmirf/manager/controllerManager'
	    , 'mmirf/controller': 'mmirf/mvc/controllers/controller'
	    , 'mmirf/helper': 'mmirf/mvc/controllers/helper'
	    , 'mmirf/modelManager': 'mmirf/manager/modelManager'

	    // #####################################################################
	    // ####################### PRESENTATION LAYER ##########################
	    // #####################################################################

	    , 'mmirf/presentationManager': 'mmirf/manager/presentationManager'
	    
	    //simple viewEngine for inserting/rendering views into the HTML page 
	    , 'mmirf/simpleViewEngine': 'mmirf/env/view/simpleViewEngine'
	    
	    //helper module that provides a "please wait"-kind of overlay dialog
		, 'mmirf/waitDialog': 'mmirf/tools/stdlne-wait-dlg'

	    , 'mmirf/configurationManager': 'mmirf/manager/settings/configurationManager'

	    // @chsc03 required by contentElement, renderUtils, declared in presentationManager [@russa not really...]
	    , 'mmirf/languageManager': 'mmirf/manager/settings/languageManager'

	    , 'mmirf/mediaManager': 'mmirf/manager/mediaManager'
		, 'mmirf/notificationManager': 'mmirf/manager/notificationManager'

		, 'mmirf/viewConstants': 'mmirf/mvc/views/viewConstants'
	    // @chsc03 depends on parseUtils, renderUtils, yield, required in presentationManager
	    , 'mmirf/layout': 'mmirf/mvc/views/layout'
	    // @chsc03 depends on parseUtils, renderUtils, contentElement, required in presentationManager
	    , 'mmirf/view': 'mmirf/mvc/views/view'
	    // @chsc03 depends on parseUtils, renderUtils, contentElement, required in presentationManager
	    , 'mmirf/partial': 'mmirf/mvc/views/partial'
	    , 'mmirf/contentElement': 'mmirf/mvc/views/contentElement'
	    , 'mmirf/yield': 'mmirf/mvc/views/yield'
	    	
	    // view loader: loads compiled views or raw views & compiles them:
	    , 'mmirf/viewLoader': 'mmirf/env/view/viewLoader'

    	// @chsc03 renderUtils required by viewInitializer and depends on parserModule
	    , 'mmirf/renderUtils': 'mmirf/mvc/parser/templateRenderUtils'
	    , 'mmirf/parserModule': 'mmirf/mvc/parser/parserModule'

		, 'mmirf/storageUtils': 'mmirf/mvc/parser/storageUtils'
		
		
		//// template processing / compiling: ////////////

	    // @chsc03 required by parseUtils and all its dependencies declared in presentationManager
	    , 'mmirf/antlr3': 'mmirf/vendor/libs/antlr3-all'
	    // @chsc03 parseUtils depends on the following paths
	    , 'mmirf/parseUtils': 'mmirf/mvc/parser/templateParseUtils'
	    , 'mmirf/ES3Lexer': 'mmirf/gen/parser/ES3Lexer'
	    , 'mmirf/ES3Parser': 'mmirf/gen/parser/ES3Parser'
	    , 'mmirf/scriptLexer': 'mmirf/gen/parser/MmirScriptLexer'
	    , 'mmirf/scriptParser': 'mmirf/gen/parser/MmirScriptParser'
	    , 'mmirf/contentLexer': 'mmirf/gen/parser/MmirScriptContentLexer'
	    , 'mmirf/contentParser': 'mmirf/gen/parser/MmirScriptContentParser'
	    , 'mmirf/templateLexer': 'mmirf/gen/parser/MmirTemplateLexer'
	    , 'mmirf/templateParser': 'mmirf/gen/parser/MmirTemplateParser'

	    // @chsc03 templateProcessor depends on parsingResult
	    , 'mmirf/templateProcessor': 'mmirf/mvc/parser/templateProcessor'
	    , 'mmirf/parsingResult': 'mmirf/mvc/parser/parsingResult'

	    // #####################################################################
	    // ########                SEMANTIC PROCESSING              ############
	    // ######## (grammar generation/compilation, execution etc) ############
	    // #####################################################################
		, 'mmirf/grammarConverter': 'mmirf/semantic/grammarConverter'
		, 'mmirf/semanticInterpreter': 'mmirf/semantic/semanticInterpreter'
		, 'mmirf/asyncGrammar': 'mmirf/semantic/asyncGrammar'
		, 'mmirf/stemmer': 'mmirf/semantic/stemmer'
		, 'mmirf/jscc': 'mmirf/vendor/libs/jscc-amd'
		, 'mmirf/jison': 'mmirf/vendor/libs/jison'
		, 'mmirf/pegjs': 'mmirf/vendor/libs/peg-0.9.0'
		, 'mmirf/asyncGen': 'mmirf/env/grammar/asyncGenerator'
		, 'mmirf/jsccGen': 'mmirf/env/grammar/jsccGenerator'
		, 'mmirf/jsccAsyncGen': 'mmirf/env/grammar/jsccAsyncGenerator'
		, 'mmirf/jisonGen': 'mmirf/env/grammar/jisonGenerator'
		, 'mmirf/jisonAsyncGen': 'mmirf/env/grammar/jisonAsyncGenerator'
		, 'mmirf/pegjsGen': 'mmirf/env/grammar/pegjsGenerator'
		, 'mmirf/pegjsAsyncGen': 'mmirf/env/grammar/pegjsAsyncGenerator'

		//MD5 checksum computation: for checking pre-compiled resources, e.g.
		//    grammars (JSON->JS), and templates (eHTML->JS)
		, 'mmirf/md5': 'mmirf/vendor/libs/md5'
		, 'mmirf/checksumUtils': 'mmirf/tools/checksumUtils'

		//utility function for loading LINK tags (i.e. CSS files) into the current document
		, 'mmirf/loadCss': 'mmirf/tools/loadCss'

		//"backward compatibility-restorer":
		, 'mmirf/encodeUtils': 'mmirf/tools/extensions/EncodeUtils'
		, 'mmirf/jsonUtils': 'mmirf/tools/extensions/JsonUtils'
		, 'mmirf/stringUtils': 'mmirf/tools/extensions/StringUtils'
		, 'mmirf/resizeToFit': 'mmirf/tools/extensions/ResizeFitToSourroundingBox'
	    , 'mmirf/stringExtension': 'mmirf/tools/extensions/StringExtensions'
	    , 'mmirf/core1Compatibility' : 'mmirf/tools/extensions/Core1Compatibility'
	    , 'mmirf/commonUtilsCompatibility': 'mmirf/tools/extensions/CommonUtilsV1Compatibility'
	    , 'mmirf/languageManagerCompatibility': 'mmirf/tools/extensions/LanguageManagerV1Compatibility'
	    , 'mmirf/core2Compatibility' : 'mmirf/tools/extensions/Core2Compatibility'
	    , 'mmirf/core3Compatibility' : 'mmirf/tools/extensions/Core3Compatibility'
	    , 'mmirf/semanticInterpreterCompatibility' : 'mmirf/tools/extensions/SemanticInterpreterV3Compatibility'
	    , 'mmirf/core3ModuleIdCompatibility' : 'mmirf/tools/extensions/Core3ModuleIdCompatibility'


	    //optional or "dynamically" loaded modules

	    // #####################################################################
	    // #####         OPTIONAL / DYNAMICALLY LOADED MODULES          ########
	    // ##### (depending on configuration in core.js or global vars) ########
	    // #####################################################################

	    // (console) logging related modules (either 'mmirf/loggerEnabled' or 'mmirf/loggerDisabled' will be mapped to 'mmirf/logger', depending on configuration
    	, 'mmirf/loggerEnabled': 'mmirf/tools/logger'
    	, 'mmirf/loggerDisabled': 'mmirf/tools/loggerDisabled'
	    , 'mmirf/stacktrace': 'mmirf/vendor/libs/stacktrace-v0.6.4-mod'

	},//END: paths : {...

	shim : {

		/** @memberOf mmir.require.config.shim */
	    'mmirf/antlr3':			{deps: ['mmirf/parsingResult'], exports : 'org'}

		/** @memberOf mmir.require.config.shim */
		, 'mmirf/md5':            {exports : 'CryptoJS'}

		, 'mmirf/pegjs':       	{exports: 'PEG'}

		, 'mmirf/ES3Lexer':       {deps: ['mmirf/antlr3'], init: function(org){ return ES3Lexer;} }
		, 'mmirf/ES3Parser':      {deps: ['mmirf/antlr3'], init: function(org){ return ES3Parser;} }
    	, 'mmirf/scriptLexer':    {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptLexer;} }
    	, 'mmirf/scriptParser':   {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptParser;} }
    	, 'mmirf/contentLexer':   {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptContentLexer;} }
    	, 'mmirf/contentParser':  {deps: ['mmirf/antlr3'], init: function(org){ return MmirScriptContentParser;} }
    	, 'mmirf/templateLexer':  {deps: ['mmirf/antlr3'], init: function(org){ return MmirTemplateLexer;} }
    	, 'mmirf/templateParser': {deps: ['mmirf/antlr3'], init: function(org){ return MmirTemplateParser;} }
	}

	
	, packages: [{
		'name': 'mmirf/util',
		'location': 'mmirf/tools/util_purejs'
     }]

};//END: require.config({...


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
reqInstance(['mmirf/core'], /** @memberOf mmir.mainConfig */ function mmirLoader(core){

	//attach the local-require instance:
	core.require = reqInstance;
	core._define = defInstance;

	//get the "entry-point", i.e. module-name/-id that will be loaded (default: "mmirf/main")
	var startModule = core.startModule;

	//setup the logger implementation:
	// map 'mmirf/logger' to one of  ['mmirf/loggerEnabled' | 'mmirf/loggerDisabled']
	var isEnableLogger = core.debug !== false;//NOTE: only explicitly setting debug to boolean false will disable logging
	var implName = isEnableLogger? 'mmirf/loggerEnabled': 'mmirf/loggerDisabled';
	var implPath = mmirf_config.paths[implName];
	var logConfig = {paths:{'mmirf/logger': implPath}};

	//if the "functional" logger is set, configure it
	// (NOTE: for "disabled" logger, the implementation is provided with no-op functions etc.)
	if(isEnableLogger) {

		logConfig.config = {'mmirf/logger': {}};
		var logSettings = logConfig.config['mmirf/logger'];

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
			define('mmirf/stacktrace', function(){ return function(){}; });
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
				'name': 'mmirf/util',
				'location': 'mmirf/tools/util_jquery'
			}]
		});
	}


	//apply all configs / modifications that were made on the core-module
	core.applyConfig(mmirf_config, requirejs);
	
	if(jq){
		core._define('jquery', function(){
			return jq;
		});
	}


	//finally: trigger framework loading
	core.require(['mmirf/logger',startModule]);
});

}(requirejs, define, typeof window !== 'undefined'? window : global));//END: (function(){...
