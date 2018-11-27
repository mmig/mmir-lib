//copied requirejs config from mmirf/mainConfig.js
//MODIFICATIONS:
//  * added path.logger = 'mmirf/tools/logger'
//  * added path.jquery = 'empty:'
//FIXME need solution for pre-init in mainConfig.js
module.exports = ({


	//FIXME [START] requirejs-build: additional dependencies that should be included in build
	include: [
//		'mmirf/tools/util_jquery/isArray'
//		, 'mmirf/jscc'
		//, 'parseUtils', 'renderUtils'
		'mmirf/logger',
		'mmirf/stacktrace'
	],
	//FIXME [STOP] requirejs-build


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
	    	, cssUrl: 'vendor/styles/simpleViewLayout.css'
	    }

        //EXAMPLE: set module-specific log-level to 'warn'
	    //         log-levels: 'verbose' | 'debug' | 'info' | 'warn' | 'error' | 'critical' | 'disabled'
	    //         or number:     0           1        2        3         4           5           6
//	    , 'mmirf/view': { logLevel: 'warn' }

	}

	//definition for the module IDs and their (file) paths
	, paths : {

		//FIXME [START] requirejs-build
		'jquery': 'empty:',
		'mmirf/logger': 'tools/logger',
		//FIXME [STOP] requirejs-build

		/** @memberOf mmir.require.config.paths */
	    // core
		  'mmirf/core': 'core'
 	    , 'mmirf/main': 'main'

	    // lib
 	    , 'mmirf/scion': 'vendor/libs/scion-amd-mod.min'

	    // globals and AMDs
 	    , 'mmirf/constants': 'tools/constants'
 	    , 'mmirf/commonUtils': 'tools/commonUtils'
	    , 'mmirf/dictionary': 'tools/dictionary'
	    , 'mmirf/paramsParseFunc': 'tools/paramsParseFunc'
		, 'mmirf/env': 'tools/envDetect'

	    // dialog/input manager
	    , 'mmirf/inputManager': 'manager/dialog/inputManager'
	    , 'mmirf/dialogManager': 'manager/dialog/dialogManager'
	    , 'mmirf/engineConfig': 'manager/dialog/engineConfig'

	    , 'mmirf/scionEngine': 'manager/dialog/scion/scionEngine'
	    , 'mmirf/scionUtil': 'manager/dialog/scion/scionUtil'

	    // controllers/models
    	//FIXME replace controller manager:
	    , 'mmirf/controllerManager': 'manager/controllerManager'
	    // , 'mmirf/controllerManager': 'requirejs_build/appjs/ionicControllerManager'
	    , 'mmirf/controller': 'mvc/controllers/controller'
	    , 'mmirf/helper': 'mvc/controllers/helper'
	    , 'mmirf/modelManager': 'manager/modelManager'

	    // #####################################################################
	    // ####################### PRESENTATION LAYER ##########################
	    // #####################################################################


	    , 'mmirf/presentationManager': 'manager/presentationManager'

    	//FIXME replace view engine:
//	    //simple viewEngine for inserting/rendering views into the HTML page
//	    , 'mmirf/simpleViewEngine': 'env/view/simpleViewEngine'
	    // , 'mmirf/simpleViewEngine': 'requirejs_build/appjs/ionicViewEngine'
		    , 'mmirf/simpleViewEngine': 'env/view/stubViewEngine'

	    //helper module that provides a "please wait"-kind of overlay dialog
		, 'mmirf/waitDialog': 'tools/stdlne-wait-dlg'

	    , 'mmirf/configurationManager': 'manager/settings/configurationManager'

	    // @chsc03 required by contentElement, renderUtils, declared in presentationManager [@russa not really...]
	    , 'mmirf/languageManager': 'manager/settings/languageManager'

	    , 'mmirf/mediaManager': 'manager/mediaManager'
		, 'mmirf/notificationManager': 'manager/notificationManager'

		, 'mmirf/viewConstants': 'mvc/views/viewConstants'
	    // @chsc03 depends on parseUtils, renderUtils, yield, required in presentationManager
	    , 'mmirf/layout': 'mvc/views/layout'
	    // @chsc03 depends on parseUtils, renderUtils, contentElement, required in presentationManager
	    , 'mmirf/view': 'mvc/views/view'
	    // @chsc03 depends on parseUtils, renderUtils, contentElement, required in presentationManager
	    , 'mmirf/partial': 'mvc/views/partial'
	    , 'mmirf/contentElement': 'mvc/views/contentElement'
	    , 'mmirf/yield': 'mvc/views/yield'

	    //FIXME replace view loader:
	    // view loader: loads compiled views or raw views & compiles them:
//	    , 'mmirf/viewLoader': 'env/view/viewLoader'
    	, 'mmirf/viewLoader': 'env/view/stubViewLoader'

    	// @chsc03 renderUtils required by viewInitializer and depends on parserModule
	    , 'mmirf/renderUtils': 'mvc/parser/templateRenderUtils'
	    , 'mmirf/parserModule': 'mvc/parser/parserModule'

		, 'mmirf/storageUtils': 'mvc/parser/storageUtils'


		//// template processing / compiling: ////////////

	    // @chsc03 required by parseUtils and all its dependencies declared in presentationManager
	    , 'mmirf/antlr3': 'vendor/libs/antlr3-all'
	    // @chsc03 parseUtils depends on the following paths
	    , 'mmirf/parseUtils': 'mvc/parser/templateParseUtils'
	    , 'mmirf/ES3Lexer': 'gen/parser/ES3Lexer'
	    , 'mmirf/ES3Parser': 'gen/parser/ES3Parser'
	    , 'mmirf/scriptLexer': 'gen/parser/MmirScriptLexer'
	    , 'mmirf/scriptParser': 'gen/parser/MmirScriptParser'
	    , 'mmirf/contentLexer': 'gen/parser/MmirScriptContentLexer'
	    , 'mmirf/contentParser': 'gen/parser/MmirScriptContentParser'
	    , 'mmirf/templateLexer': 'gen/parser/MmirTemplateLexer'
	    , 'mmirf/templateParser': 'gen/parser/MmirTemplateParser'

	    // @chsc03 templateProcessor depends on parsingResult
	    , 'mmirf/templateProcessor': 'mvc/parser/templateProcessor'
	    , 'mmirf/parsingResult': 'mvc/parser/parsingResult'

	    // #####################################################################
	    // ########                SEMANTIC PROCESSING              ############
	    // ######## (grammar generation/compilation, execution etc) ############
	    // #####################################################################
		, 'mmirf/grammarConverter': 'semantic/grammarConverter'
		, 'mmirf/semanticInterpreter': 'semantic/semanticInterpreter'
		, 'mmirf/asyncGrammar': 'semantic/asyncGrammar'
		, 'mmirf/stemmer': 'semantic/stemmer'
		, 'mmirf/jscc': 'vendor/libs/jscc-amd'
		, 'mmirf/jison': 'vendor/libs/jison'
		, 'mmirf/pegjs': 'vendor/libs/peg-0.9.0'
		, 'mmirf/asyncGen': 'env/grammar/asyncGenerator'
		, 'mmirf/jsccGen': 'env/grammar/jsccGenerator'
		, 'mmirf/jsccAsyncGen': 'env/grammar/jsccAsyncGenerator'
		, 'mmirf/jisonGen': 'env/grammar/jisonGenerator'
		, 'mmirf/jisonAsyncGen': 'env/grammar/jisonAsyncGenerator'
		, 'mmirf/pegjsGen': 'env/grammar/pegjsGenerator'
		, 'mmirf/pegjsAsyncGen': 'env/grammar/pegjsAsyncGenerator'

		//MD5 checksum computation: for checking pre-compiled resources, e.g.
		//    grammars (JSON->JS), and templates (eHTML->JS)
		, 'mmirf/md5': 'vendor/libs/md5'
		, 'mmirf/checksumUtils': 'tools/checksumUtils'

		//utility function for loading LINK tags (i.e. CSS files) into the current document
		, 'mmirf/loadCss': 'tools/loadCss'

		//"backward compatibility-restorer":
		, 'mmirf/encodeUtils': 'tools/extensions/EncodeUtils'
		, 'mmirf/jsonUtils': 'tools/extensions/JsonUtils'
		, 'mmirf/stringUtils': 'tools/extensions/StringUtils'
		, 'mmirf/resizeToFit': 'tools/extensions/ResizeFitToSourroundingBox'
	    , 'mmirf/stringExtension': 'tools/extensions/StringExtensions'
	    , 'mmirf/core1Compatibility' : 'tools/extensions/Core1Compatibility'
	    , 'mmirf/commonUtilsCompatibility': 'tools/extensions/CommonUtilsV1Compatibility'
	    , 'mmirf/languageManagerCompatibility': 'tools/extensions/LanguageManagerV1Compatibility'
	    , 'mmirf/core2Compatibility' : 'tools/extensions/Core2Compatibility'
	    , 'mmirf/core3Compatibility' : 'tools/extensions/Core3Compatibility'
	    , 'mmirf/semanticInterpreterCompatibility' : 'tools/extensions/SemanticInterpreterV3Compatibility'
	    , 'mmirf/core3ModuleIdCompatibility' : 'tools/extensions/Core3ModuleIdCompatibility'


	    //optional or "dynamically" loaded modules

	    // #####################################################################
	    // #####         OPTIONAL / DYNAMICALLY LOADED MODULES          ########
	    // ##### (depending on configuration in core.js or global vars) ########
	    // #####################################################################

	    // (console) logging related modules (either 'mmirf/loggerEnabled' or 'mmirf/loggerDisabled' will be mapped to 'mmirf/logger', depending on configuration
    	, 'mmirf/loggerEnabled': 'tools/logger'
    	, 'mmirf/loggerDisabled': 'tools/loggerDisabled'
	    , 'mmirf/stacktrace': 'vendor/libs/stacktrace-v0.6.4-mod'

			//FIXME "hardlink" mmirf/logger:
			, 'mmirf/logger': 'tools/logger'

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
		'location': 'tools/util_purejs'
     }]
//	, bundles: {
//		'util_modules': ['util/loadFile', 'util/deferred', 'util/isArray', 'util/extend', 'util/forEach', 'util/toArray', 'util/deferredWithState']
//	}

})
