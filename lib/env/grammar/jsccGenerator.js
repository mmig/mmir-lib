
define(['mmirf/jscc','mmirf/resources','mmirf/configurationManager','mmirf/grammarConverter','mmirf/util/deferred','mmirf/util/extend','mmirf/util/toArray','mmirf/util/loadFile','mmirf/logger', 'module'],
/**
 * Generator for executable language-grammars (i.e. converted JSON grammars).
 *
 * <p>
 * This generator uses JS/CC for compiling the JSON grammar.
 *
 * <p>
 * The generator for compiling the JSON grammar definitions in <code>www/config/languages/&lt;language code&gt;/grammar.json</code>
 * can be configured in <code>www/config/configuration.json</code>:<br>
 * <pre>
 * {
 *   ...
 *   "grammarCompiler": "jscc",
 *   ...
 * }</pre>
 *
 * <em>NOTE: this is the default grammar engine (if there is no setting in
 * 			 <code>configuration.json</code>, then this engine will be used)
 * </em>
 *
 *  <p>
 * JS/CC supports grammar generation for:
 * LALR(1)
 *
 * (in difference to jison, JS/CC supports backtracking to certain extend)
 *
 * @see <a href="http://jscc.phorward-software.com/">http://jscc.phorward-software.com/</a>
 *
 * @class
 * @constant
 * @public
 * @name JsccGenerator
 * @memberOf mmir.env.grammar
 *
 * @requires JS/CC
 */
function(jscc, resources, configManager, GrammarConverter, deferred, extend, toArray, loadFile, Logger, module){

//////////////////////////////////////  template loading / setup for JS/CC generator ////////////////////////////////

/**
 * Deferred object that will be returned - for async-initialization:
 * the deferred object will be resolved, when this module has been initialized.
 *
 * @private
 * @type Deferred
 * @memberOf JsccGenerator#
 *
 * @see #_loadTemplate
 */
var deferred = deferred();

/**
 * The Logger for the JS/CC generator.
 *
 * @private
 * @type Logger
 * @memberOf JsccGenerator#
 *
 * @see mmir.Logging
 */
var logger = Logger.create(module);


//setup logger for compile-messages
/**
 * HELPER for creating default logging / error-print functions
 *
 * @function
 * @private
 * @memberOf JsccGenerator#
 *
 * @see mmir.Logging
 */
function _createCompileLogFunc(log /*Logger*/, level /*String: log-function-name*/, toArray/*helper-lib: provides function makeArray(obj); e.g. jquery*/){
	return function(){
		var args = toArray(arguments);
		//prepend "location-information" to logger-call:
		args.unshift('JS/CC', 'compile');
		//output log-message:
		log[level].apply(log, args);
	};
}

/**
 * The URL to the JS/CC template file (generated code-text will be "embedded" in this template)
 *
 * @private
 * @type String
 * @memberOf JsccGenerator#
 */
var templatePath = resources.getGrammarPluginPath() + 'grammarTemplate_reduced.tpl';

/**
 * The default options for the JS/CC compiler.
 *
 * To overwrite the default options, configure the following property in <code>www/config/configuration.json</code>:<br>
 * <pre>
 * {
 *   ...
 *   "grammar": {
 *   	...
 *   	"jscc": {
 *   		"execMode": "your configuration setting!"
 *   	}
 *   	...
 *   },
 *   ...
 * }</pre>
 *
 * Valid settings are:
 * <code>execMode = 'sync' | 'async'</code>
 * <code>genSourceUrl = true | STRING | FALSY'</code>
 *
 *
 * genSourceUrl: if TRUTHY, the sourceUrl for eval'ed parser-module is set
 *               (i.e. eval'ed code will appear at the URL in debugger, if browser supports sourceURL setting)
 *               if true: the sourceUrl will be generated using the grammar's ID
 *               if STRING: the string will be used as sourceUrl; if "<id>" is contained, it will be replaced by the grammar's ID
 *
 * @constant
 * @private
 * @default targetType := jscc.MODE_GEN_JS, execMode := sync, genSourceUrl := FALSY
 * @memberOf JsccGenerator#
 */
var DEFAULT_OPTIONS = {
		targetType: jscc.MODE_GEN_JS,
		execMode: 'sync',//'sync' | 'async' | default: sync
		genSourceUrl: '',// true | STRING: the sourceURL for eval'ed parser-module | default: FALSY
};

/**
 * Name for this plugin/grammar-generator (e.g. used for looking up configuration values in configuration.json).
 * @constant
 * @private
 * @memberOf JsccGenerator#
 */
var pluginName = 'grammar.jison';

/**
 * Exported (public) functions for the JS/CC grammar-engine.
 * @public
 * @type GrammarGenerator
 * @memberOf JsccGenerator#
 */
var jsccGen = {
	/** @scope JsccGenerator.prototype */

	/**
	 * The name/ID for the compile engine for the JS/CC compiler
	 *
	 * @memberOf mmir.env.grammar.JsccGenerator.prototype
	 */
	engineId: 'jscc',
	/**
	 * @param {Function} [callback] OPTIONAL
	 * 			the callback that is triggered, when the engine is initialized
	 * @returns {Deferred}
	 * 			a promise that is resolved, when the engine is initialized
	 * 			(NOTE: if you use the same function for the <code>callback</code> AND the promise,
	 * 			       then the function will be invoked twice!)
	 *
	 * @memberOf mmir.env.grammar.JsccGenerator.prototype
	 */
	init: function(callback){
		if(callback){
			deferred.then(callback, callback);
		}
		return deferred;
	},
	/** @returns {Boolean} if this engine compilation works asynchronously. The current implementation works synchronously (returns FALSE) */
	isAsyncCompilation: function(){ return false; },
	/**
	 * The function for compiling a JSON grammar:
	 *
	 *
	 * @param {GrammarConverter} theConverterInstance
	 * @param {String} instanceId
	 * 				the ID for the compiled grammar (usually this is a language code)
	 * @param {Number} fileFormatVersion
	 * 				the version of the file format (this is a constant within {@link mmir.SemanticInterpreter}
	 * @param callback
	 * @returns {GrammarConverter}
	 * 			the grammar instance with attached with the compiled function for executing the
	 * 			grammar to the instance's {@link GrammarConvert#executeGrammar} property/function.
	 */
	compileGrammar: function(theConverterInstance, instanceId, fileFormatVersion, callback){

		//attach functions for JS/CC conversion/generation to the converter-instance:
		extend(theConverterInstance, JsccGrammarConverterExt);
		//attach the JS/CC template to the converter instance
		theConverterInstance.TEMPLATE = this.template;

		//start conversion: create grammar in JS/CC syntax (from the JSON definition):
		theConverterInstance.init();
		this._preparePrintError();
	theConverterInstance.convertJSONGrammar();
	var grammarDefinition = theConverterInstance.getGrammarDef();

	//load options from configuration:
	var config = configManager.get(pluginName, {});
	//combine with default default options:
	var options = extend({id: instanceId}, DEFAULT_OPTIONS, config);

	var compileParserModule = function(grammarParserStr, hasError){

		var addGrammarParserExec = theConverterInstance.getCodeWrapPrefix(fileFormatVersion, JSON.stringify(options.execMode))
			+ 'var grammarFunc = function(nl_input_text, options){\n\n'
			+ 'function _printLog(){console.log.apply(console, arguments);};\n'
			+ 'function _noopFunc(){};\n'
			+ grammarParserStr
			+ '\n};\n'
			+ theConverterInstance.getCodeWrapSuffix(theConverterInstance.getEncodedStopwords(), 'grammarFunc', instanceId);

		if(options.genSourceUrl){

		var sourceUrlStr;
		if(options.genSourceUrl === true){
			sourceUrlStr = 'gen/grammar/_compiled_grammar_'+instanceId;
		} else {
			sourceUrlStr = options.genSourceUrl.toString().replace(/<id>/g,instanceId);
		}

		//for Chrome / FireFox debugging: provide an URL for eval'ed code
		addGrammarParserExec += '//@ sourceURL='+sourceUrlStr+'\n'
								+'//# sourceURL='+sourceUrlStr+'\n';

	}

		theConverterInstance.setGrammarSource(addGrammarParserExec);

		try{

			eval(addGrammarParserExec);

		} catch (err) {

			//TODO russa: generate meaningful error message with details about error location
			//			  eg. use esprima (http://esprima.org) ...?
			//			... as optional dependency (see deferred initialization above?)

			var evalMsg = 'Error during eval() for "'+ instanceId +'": ' + err + ', source code:\n'+addGrammarParserExec+'\n\ntemplate code:\n'+theConverterInstance.TEMPLATE;

			if(jscc.get_printError()){
				jscc.get_printError()(evalMsg);
			}
			else {
				logger.error('JS/CC', 'evalCompiled', evalMsg, err);
			}

			if(! hasError){
			evalMsg = '[INVALID GRAMMAR JavaScript CODE] ' + evalMsg;
			var parseDummyFunc = (function(msg, error){
				return function(){ console.error(msg); console.error(error); throw msg;};
			})(evalMsg, err);

			parseDummyFunc.hasErrors = true;

			theConverterInstance.setGrammarFunction(parseDummyFunc);
			}

		}

		//invoke callback if present:
		if(callback){
			callback(theConverterInstance);
		}
		};

		var isPreventDefault = this._afterCompileParser(compileParserModule, callback);
	var result = this._compileParser(grammarDefinition, options, isPreventDefault);

	if(!isPreventDefault){
		var hasError = result.hasError;
		compileParserModule(result.def, hasError);
	}

	return theConverterInstance;
	},
	/**
	 * @protected
	 */
	_compileParser: function(grammarDefinition, options, afterCompileParserResult){

		//set up the JS/CC compiler:
	var dfa_table = '';
	jscc.reset_all( jscc.EXEC_WEB );
				jscc.set_debug(/*show errors: */true, /*show warnings: */true, /*hide trace: */false);

	var hasError = false;
	var grammarParser;
	try {

		jscc.parse_grammar(grammarDefinition, 'grammar ' + options.id);

	} catch (err){
		var msg = 'Error while compiling grammar: ' + (err.stack?err.stack:err);
		hasError = msg;

		msg = '[INVALID GRAMMAR] ' + msg
								+ '\n-----------------------------\n  Grammar Definition:\n-----------------------------\n'
								+ grammarDefinition;

		grammarParser = 'var msg = '+JSON.stringify(msg)+'; console.error(msg); return {error: msg, phrase: nl_input_text, engine: "jscc"};';
	}

				var errorCount = jscc.getErrors();
				var warnCount = jscc.getWarnings();
	if (errorCount == 0) {
		jscc.undef();
		jscc.unreachable();
					errorCount = jscc.getErrors();

	if (errorCount == 0) {
		jscc.first();
		jscc.print_symbols();
		dfa_table = jscc.create_subset(jscc.get_nfa_states());
		dfa_table = jscc.minimize_dfa(dfa_table);

		jscc.set_dfa_table(dfa_table);//FIXME: check, if this is really necessary

		jscc.lalr1_parse_table(false);
	}
	}

	if (errorCount > 0 || warnCount > 0){
	logger.error(
			'JSCC', 'compile', 'there occured'
			+ (warnCount  > 0? warnCount  + ' warning(s)' : '')
			+ (errorCount > 0? errorCount + ' error(s)'   : '')
			+ ' during compilation.'
	);
						hasError = errorCount > 0;
	}

//      console.debug("before replace " + theConverterInstance.PARSER_TEMPLATE);//debug

	if( ! hasError){

		var genData = this._getGenerated(options.targetType, dfa_table);
		grammarParser = this._applyGenerated(genData, this.template);

	} else {

						var msg = 'Error'+(errorCount === 1? '': 's')+' parsing grammar ('+errorCount+'):\n  ' + jscc.getErrorMessages().join('\n  ');
						if(warnCount > 0){
							msg += '\nWarning'+(warnCount === 1? '': 's')+' parsing grammar('+warnCount+'):\n  ' + jscc.getWarningMessages().join('\n  ');
						}
						hasError = msg;

			msg = '[INVALID GRAMMAR] ' + msg
									+ '\n-----------------------------\n  Grammar Definition:\n-----------------------------\n'
									+ grammarDefinition;

			grammarParser = 'var msg = '+JSON.stringify(msg)+'; console.error(msg); return {error: msg, phrase: nl_input_text, engine: "jscc"};';
				}
	jscc.resetErrors();
	jscc.resetWarnings();

		return {def: grammarParser, hasError: hasError};
	},
	/**
	 * @protected
	 */
	_preparePrintError: function(){

		//only set print-message function, if it is not already set
		//  (i.e. if JS/CC still has its default print function set)
		if(jscc.is_printError_default()){
			/**
			 * The default logging function for printing compilation errors.
			 * @private
			 * @name set_printError
			 * @function
			 * @memberOf JsccGenerator.jscc#
			 */
			jscc.set_printError(	_createCompileLogFunc(logger, 'error', toArray));
		}
		if(jscc.is_printWarning_default()){
			/**
			 * The default logging function for printing compilation warnings.
			 * @private
			 * @name set_printWarning
			 * @function
			 * @memberOf JsccGenerator.jscc#
			 */
			jscc.set_printWarning(	_createCompileLogFunc(logger, 'warn', toArray));
		}
		if(jscc.is_printInfo_default()){
			/**
			 * The default logging function for printing compilation information.
			 * @private
			 * @name set_printInfo
			 * @function
			 * @memberOf JsccGenerator.jscc#
			 */
			jscc.set_printInfo(		_createCompileLogFunc(logger, 'info', toArray));
		}
	},
	/**
	 * The default logging / error-print function for JS/CC.
	 *
	 * @protected
	 *
	 * @see mmir.Logging
	 */
	printError: function(){
		var errorFunc = jscc.get_printError();
		if(errorFunc){
			errorFunc.apply(jscc, arguments);
		} else {
			var args = toArray(arguments);
			//prepend "location-information" to logger-call:
			args.unshift('JS/CC', 'compile');
			//output log-message:
			logger.error.apply(logger, args);
		}
	},
	/**
	 * Optional hook for pre-processing the generated parser, after the parser is generated.
	 *
	 * By default, this function returns VOID, in which case the parser-module is created by default.
	 *
	 * If a function is returned instead, then it must invoke <code>compileParserModuleFunc</code>:
	 * <code>compileParserModuleFunc(compiledParser : STRING, hasErrors : BOOLEAN)</code>
	 *
	 *
	 * @param {Function} compileParserModuleFunc
	 * 				the function that generates the parser-module:
	 * 				<code>compileParserModuleFunc(compiledParser : STRING, hasErrors : BOOLEAN)</code>
	 *
	 * @param {Function} compileCallbackFunc
	 * 				the callback function which will be invoked by compileParserModuleFunc, after it has finished.
	 * 				If compileParserModuleFunc() is prevented from exectution then the callback MUST be invoked manually
	 * 				<code>compileCallbackFunc(theConverterInstance: GrammarConverter)</code>
	 *
	 * @returns {TRUTHY|VOID}
	 * 				FALSY for the default behavior.
	 * 				IF a TRUTHY value is returned, then the default action after compiling the parser
	 * 				is not executed:
	 * 					i.e. compileParserModuleFunc is not automatically called and in consequence the callback is not invoked
	 *
	 *
	 * 				NOTE: if not FALSY, then either compileParserModuleFunc() must be invoked, or the callback() must be invoked!
	 *
	 * @protected
	 */
	_afterCompileParser: function(compileParserModuleFunc, compileCallbackFunc){
		//default: return VOID
		return;
	},
	/**
	 * @protected
	 */
	_getGenerated: function(genMode, dfaTable){
		return {
			head: jscc.get_code_head(),
			tables: jscc.print_parse_tables(genMode),//jscc.MODE_GEN_JS
			dfa: jscc.print_dfa_table(dfaTable),//dfa_table
			terminals: jscc.print_term_actions(),
			labels: jscc.print_symbol_labels(),
			actions: jscc.print_actions(),
			error: jscc.get_error_symbol_id(),
			eof: jscc.get_eof_symbol_id(),
			whitespace: jscc.get_whitespace_symbol_id()
		};
	},
	/**
	 * @protected
	 */
	_applyGenerated: function(genData, template){

		var grammarParserStr = template;
		grammarParserStr = grammarParserStr.replace(/##PREFIX##/g, "");
		grammarParserStr = grammarParserStr.replace(/##HEADER##/g, genData.head);
		grammarParserStr = grammarParserStr.replace(/##TABLES##/g, genData.tables);
		grammarParserStr = grammarParserStr.replace(/##DFA##/g, genData.dfa);
		grammarParserStr = grammarParserStr.replace(/##TERMINAL_ACTIONS##/g, genData.terminals);
		grammarParserStr = grammarParserStr.replace(/##LABELS##/g, genData.labels);
		grammarParserStr = grammarParserStr.replace(/##ACTIONS##/g, genData.actions);
		grammarParserStr = grammarParserStr.replace(/##FOOTER##/g,

				  "\n_dbg_withtrace = options && !!options.trace;\n"
				// +"options = options || {debug: true, trace: function(msg){window.alert(msg)}};\n" //TEST

				+ "var _logDebug = options && !!options.debug? _printLog : _noopFunc;\n"
				+ "var alert = options && options.trace? typeof options.trace === 'function'? options.trace : _printLog : _noopFunc;\n"

				+ "var _semanticAnnotationResult = {result: {phrase: nl_input_text, engine: 'jscc'}};\n"
				+ "__parse(nl_input_text, [], [], _semanticAnnotationResult);\n"
				+ "return _semanticAnnotationResult.result;"
		);
		grammarParserStr = grammarParserStr.replace(/##ERROR##/g, genData.error);
		grammarParserStr = grammarParserStr.replace(/##EOF##/g, genData.eof);
		grammarParserStr = grammarParserStr.replace(/##WHITESPACE##/g, genData.whitespace);

		return grammarParserStr;
	}
};

if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
	jsccGen.template = require('./grammarTemplate_reduced.tpl');
	deferred.resolve();
} else {
	/**
	 * Initializes the grammar-engine:
	 *
	 * loads the template and resolves the engine as initialzed.
	 *
	 * @param {String} url
	 * 			URL to the template file
	 * @param {GrammarGenerator} jsccGenerator
	 * 			the JS/CC grammar generator instance
	 * @param {Deferred} promise
	 * 			the {@link #deferred} for resolving the generator
	 * 			as initialized.
	 *
	 *
	 * @private
	 * @function
	 * @memberOf JsccGenerator#
	 */
	function _loadTemplate(url, jsccGenerator, promise){
		loadFile({//$.ajax({
			url: url,
			dataType: 'text',
			async: true,
			success: function(data){

				jsccGenerator.template = data;

				promise.resolve();

			},
			error: function(_xhr, status, err){
				var msg = 'Failed to load grammar template file from "'+templatePath+'": '+status+', ERROR '+err;
				logger.error(msg);
				promise.reject(msg);
			}
		});
	}

	//load the JS/CC template and resolve this module as "initialzed":
	_loadTemplate(templatePath, jsccGen, deferred);
}

////////////////////////////////////// JS/CC specific extensions to GrammarConverter ////////////////////////////////

/**
 * JS/CC specific extension / implementation for {@link GrammarConverter} instances
 *
 * @type GrammarConverter
 * @memberOf JsccGenerator#
 */
var JsccGrammarConverterExt = {
	/** @memberOf JsccGrammarConverterExt */
	init: function(){

		this.THE_INTERNAL_GRAMMAR_CONVERTER_INSTANCE_NAME = "theGrammarConverterInstance";
		this._PARTIAL_MATCH_PREFIX = "%";
		this._PARTIAL_LOCATION_PREFIX = '@';

		this.grammar_tokens = "/~ --- Token definitions --- ~/\n\n/~ Characters to be ignored ~/\n!   ' |\\t' ;\n\n/~ Non-associative tokens ~/\n";
		this.grammar_utterances = "";
		this.grammar_phrases = "phrases:";
		this.token_variables = "[*\n"
				//some helper functions
				+ "  var _tokenList = function(match, list) {if(!list){list = [];}var size = match.length, t;for (var i = 0; i < size; ++i) {t = match[i];if (!t) {continue;}if (t."+this.entry_token_field+".join) {_tokenList(t."+this.entry_token_field+", list);} else {list.push(t."+this.entry_token_field+");}}return list;};\n"
				+ "  var _getTok = function(phrases, type, index) {var count = 0, p;for(var i=0, size = phrases.length; i < size; ++i){p = phrases[i];if(p."+this.entry_type_field+" === type){if(index === count++){return typeof p."+this.entry_token_field+" === 'string'? p."+this.entry_token_field+" : p;}}}};\n"
				//global variable for storing the result:
				+ "  var " + this.variable_prefix + "result = '';\n"
		;
		this.tokens_array = [];
	},
	convertJSONGrammar: function(){

		this.json_grammar_definition = this.maskJSON(this.json_grammar_definition);

		this.parseTokens();
		this.parseUtterances();
		this.parseStopWords();

		this.jscc_grammar_definition = this.token_variables
				+ "*]\n\n"
				+ this.grammar_tokens
				+ "\n\n ##\n\n/~ --- Grammar specification --- ~/\n\nutterance:      phrases    [*  "

				+ "_logDebug(" + this.variable_prefix + "result); "

				+ "semanticAnnotationResult.result = "
				+ this.variable_prefix + "result; *] ;\n\n" + this.grammar_utterances
				+ "\n" + this.grammar_phrases + ";";

		this.json_grammar_definition = this.unmaskJSON(this.json_grammar_definition);
	},
	parseTokens: function(){
		var self = this;
		var json_tokens =  this.json_grammar_definition.tokens;
		var pref = self.variable_prefix;

		for(var token_name in json_tokens){

			var words = json_tokens[token_name];

			self.token_variables += "  var " + pref
					+ token_name.toLowerCase() + " = [];\n";

			var grammar_token ="    '";

			for(var i=0, size = words.length; i < size ; ++i){
				if(i > 0){
					grammar_token += "|";
				}
				grammar_token += this._prepareToken(words[i]);
			}

			grammar_token += "'    " + token_name + " [* " +
					pref + token_name.toLowerCase() + ".push(%match);"
					+ "%match = {"
						+ this.entry_index_field + ": %offset,"
						+ this.entry_type_field + ": '" + token_name.toLowerCase() + "',"
						+ this.entry_token_field + ": %match"
					+ "}; *];\n";

			self.grammar_tokens += grammar_token;
		}
	},
	parseUtterances: function(){
		var self = this;
		var utt_index = 0;
		var json_utterances =  this.json_grammar_definition.utterances;

		for(var utterance_name in json_utterances){
			var utterance_def = json_utterances[utterance_name];
			if(utt_index > 0){
				self.grammar_phrases += "\n\t|";
			}
			utt_index++;
			self.doParseUtterance(utterance_name, utterance_def);
		}
	},
	doParseUtterance: function(utterance_name, utterance_def){
		var grammar_utterance = utterance_name + ":";
		var self = this;
		self.token_variables += "  var " + self.variable_prefix
				+ utterance_name.toLowerCase() + " = [];\n";
		self.grammar_phrases += utterance_name + "  " ;
		var phrases = utterance_def.phrases;
		var semantic  = self.doCreateSemanticInterpretationForUtterance(utterance_name, utterance_def);

		for(var index=0,size=phrases.length; index < size; ++index){
			if(index > 0){
				grammar_utterance += "\n|";
			}
			var phrase = phrases[index];
			var semantic_interpretation = self.doCreateSemanticInterpretationForPhrase(
					utterance_name.toLowerCase(), utterance_def, phrase, semantic
			);
			grammar_utterance += phrase + semantic_interpretation;
		}
		self.grammar_utterances += grammar_utterance + ";\n\n";
	},
	doCreateSemanticInterpretationForUtterance: function(utterance_name, utterance_def){
		var semantic = utterance_def.semantic,
			variable_index, variable_name;

		if(logger.isDebug()) logger.debug('doCreateSemanticInterpretationForUtterance: '+semantic);//debug

		var semantic_as_string = JSON.stringify(semantic);
		if( semantic_as_string != null){
			this.variable_regexp.lastIndex = 0;
			var variables = this.variable_regexp.exec(semantic_as_string);
			while (variables != null) {
				var variable = variables[1],
					remapped_variable_name = "";

				if(logger.isDebug()) logger.debug("variables " + variable, semantic_as_string);//debug

				variable_index = /\[(\d+)\]/.exec(variable);
				variable_name = new RegExp('_\\$([a-zA-Z_][a-zA-Z0-9_\\-]*)').exec(variable)[1];
//			variableObj = /_\$([a-zA-Z_][a-zA-Z0-9_\-]*)(\[(\d+)\])?(\["semantic"\]|\['semantic'\]|\.semantic)?/.exec(variable);
//			variableObj = /_\$([a-zA-Z_][a-zA-Z0-9_\-]*)(\[(\d+)\])?((\[(("(.*?[^\\])")|('(.*?[^\\])'))\])|(\.(\w+)))?/.exec(variable);
				//"_$NAME[INDEX]['FIELD']":  _$NAME                  [ INDEX ]        [" FIELD "]  | [' FIELD ']      |   .FIELD
				if (variable_index == null) {
					remapped_variable_name = "return " + variable;
				} else {
						//TODO replace try/catch with safe_acc function
						//     PROBLEM: currently, the format for variable-access is not well defined
						//              -> in case of accessing the "semantic" field for a variable reference of another Utterance
						//                 we would need another safe_acc call
						//				   ... i.e. need to parse expression for this, but since the format is not well defined
						//				   we cannot say, for what exactly we should parse...
						//                 NORMAL VAR EXPR: 		_$a_normal_token[0]
						//                 ACCESS TO SEMANTICS: 	_$other_utterance[0]['semantic']
						//                                      but this could also be expressed e.g. as _$other_utterance[0].semantic
						//                                      ...
//					remapped_variable_name = variable.replace(
//							  '[' + variable_index[1] + ']'
//							, "[safe_acc("
//								+ utterance_name.toLowerCase() + "_temp, 'phrases', '"
//								+ variable_name.toLowerCase() + "', "
//								+ variable_index[1]
//								+ ")]"
//							);
						remapped_variable_name = "var res = _getTok("+utterance_name.toLowerCase() + "_temp['phrases'],'"
										+ variable_name.toLowerCase() + "', "
										+ variable_index[1]+");"
										+ " return typeof res === 'string'? res : (typeof res === 'object' && res? "+variable+" : void(0))";
				}
				semantic_as_string = semantic_as_string.replace(
						variables[0],
						//TODO replace try/catch with safe_acc function
						" function(){try{ " + remapped_variable_name
						+ ";} catch(e){return void(0);}}() "
				);
				variables =  this.variable_regexp.exec(semantic_as_string);
			}
		}
		return semantic_as_string;
	},
	doCreateSemanticInterpretationForPhrase: function(utterance_name, utterance_def, phrase, semantic_as_string){

		var phraseList = phrase.split(/\s+/),
			length = phraseList.length,
			phrase_name;


//		var phraseStr = "";
		var i = 0;


		var pharseMatchResult = "%% = {"
				+ this.entry_index_field + ": "+ this._PARTIAL_MATCH_PREFIX +"1." + this.entry_index_field + ","
				+ this.entry_type_field + ": '" + utterance_name + "',"
				+ this.entry_token_field + ": null";

		var semanticProcResult = "var "+utterance_name+"_temp = {}, tempMatch; "+utterance_name+"_temp['phrases'] = [];";
		var num;
		for (i = 0; i < length; ++i) {

			num = i + 1;

			//create STR for semantic processing of phrase
			semanticProcResult += "tempMatch = " + this._PARTIAL_MATCH_PREFIX + num + ";"
									+ utterance_name + "_temp['phrases'].push(tempMatch);\n\t\t";
		}

		pharseMatchResult += "}";

		semanticProcResult += "%%.tok = " + utterance_name + "_temp['phrases'];"
				+ utterance_name + "_temp['phrase']=_tokenList("+utterance_name + "_temp['phrases']).join(' ');\n "
				+ utterance_name + "_temp['utterance']='" + utterance_name + "'; "
				+ utterance_name + "_temp['engine']='jscc'; "
				+ utterance_name + "_temp['semantic'] = " + semantic_as_string
				+ "; " + this.variable_prefix + utterance_name + ".push(" + utterance_name + "_temp); "
				+ this.variable_prefix + "result = " + utterance_name + "_temp;";

		return " [* " + pharseMatchResult + "; " + semanticProcResult + " *]";
	},
	_prepareToken: function(token){
		//need to mask delimiting quotes, i.e. '
		return token.replace(/'/g, "\\'");
	}
};


return jsccGen;

});
