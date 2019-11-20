

define(['mmirf/jison','mmirf/configurationManager','mmirf/grammarConverter','mmirf/baseGen','mmirf/util/deferred','mmirf/util/extend','mmirf/util/toArray','mmirf/logger', 'module'],
/**
 * Generator for executable language-grammars (i.e. converted JSON grammars).
 *
 * <p>
 * This generator uses Jison for compiling the JSON grammar.
 *
 * <p>
 * The generator for compiling the JSON grammar definitions in <code>www/config/languages/&lt;language code&gt;/grammar.json</code>
 * can be configured in <code>www/config/configuration.json</code>:<br>
 * <pre>
 * {
 *   ...
 *   "grammarCompiler": "jison",
 *   ...
 * }</pre>
 *
 * <p>
 * jison supports grammar generation for:
 * LALR(1), LR(0), SLR(1), LL(1)
 * [and experimental support for LR(1)]
 *
 * see <a href="http://zaach.github.io/jison/docs/#parsing-algorithms">jison documentation</a>
 *
 * @see <a href="https://github.com/zaach/jison">https://github.com/zaach/jison</a>
 *
 * @class
 * @constant
 * @public
 * @name JisonGenerator
 * @memberOf mmir.env.grammar
 * @hideconstructor
 *
 * @requires jison
 */
function(jison, configManager, GrammarConverter, BaseGenerator, deferred, extend, toArray, Logger, module){

/**
 * Deferred object that will be returned - for async-initialization:
 * the deferred object will be resolved, when this module has been initialized.
 *
 * @private
 * @type Deferred
 * @memberOf JisonGenerator#
 */
var deferred = deferred();
//no async initialization necessary for PEG.js generator -> resolve immediately
deferred.resolve();


/**
 * The Logger for the jison generator.
 *
 * @private
 * @type mmir.tools.Logger
 * @memberOf JisonGenerator#
 *
 * @see mmir.Logging
 */
var logger = Logger.create(module);

/**
 * The default options for the jison compiler.
 *
 * To overwrite the default options, configure the following property in <code>www/config/configuration.json</code>:<br>
 * <pre>
 * {
 *   ...
 *   "grammar": {
 *   	...
 *   	"jison": {
 *   		"type": "your configuration setting!"
 *   	}
 *   	...
 *   },
 *   ...
 * }</pre>
 *
 * Valid settings are:
 * <code>type = 'lr0' | 'slr' | 'lr' | 'll' | 'lalr'</code>
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
 * @default type := 'lalr', execMode := sync, genSourceUrl := FALSY
 * @memberOf JisonGenerator#
 */
var DEFAULT_OPTIONS = {
		type: 'lalr',//'lr0' | 'slr' | 'lr' | 'll' | default: lalr
		execMode: 'sync',//'sync' | 'async' | default: sync
		genSourceUrl: '',// true | STRING: the sourceURL for eval'ed parser-module | default: FALSY
};

/**
 * the ID for the grammar engine
 * @constant
 * @private
 * @memberOf JisonGenerator#
 */
var engineId = 'jison';

/**
 * Name for this plugin/grammar-generator (e.g. used for looking up configuration values in configuration.json).
 * @constant
 * @private
 * @memberOf JisonGenerator#
 */
var pluginName = 'grammar.'+engineId;

/**
 * instance of a BaseGenerator (provides common resources for generating grammar definitions).
 * @constant
 * @private
 * @type BaseGenerator
 * @memberOf JisonGenerator#
 */
var baseGenerator = new BaseGenerator(logger, engineId);

/**
 * Exported (public) functions for the jison grammar-engine.
 * @public
 * @type GrammarGenerator
 * @memberOf JisonGenerator#
 */
var jisonGen = {
	/** @scope JisonGenerator.prototype */

	/**
	 * The name/ID for the compile engine for the jison compiler
	 *
	 * @memberOf JisonGenerator.prototype
	 */
	engineId: engineId,
	/**
	 * @param {Function} [callback] OPTIONAL
	 * 			the callback that is triggered, when the engine is initialized
	 * @returns {Deferred}
	 * 			a promise that is resolved, when the engine is initialized
	 * 			(NOTE: if you use the same function for the <code>callback</code> AND the promise,
	 * 			       then the function will be invoked twice!)
	 *
	 * @memberOf JisonGenerator.prototype
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
	 * @param {mmir.grammar.GrammarConverter} theConverterInstance
	 * @param {String} instanceId
	 * 				the ID for the compiled grammar (usually this is a language code)
	 * @param {Number} fileFormatVersion
	 * 				the version of the file format (this is a constant within {@link mmir.SemanticInterpreter}
	 * @param callback
	 * @returns {mmir.grammar.GrammarConverter}
	 * 			the grammar instance with attached with the compiled function for executing the
	 * 			grammar to the instance's {@link GrammarConvert#executeGrammar} property/function.
	 */
	compileGrammar: function(theConverterInstance, instanceId, fileFormatVersion, callback){

		//attach functions for PEG.js conversion/generation to the converter-instance:
		extend(theConverterInstance, baseGenerator, JisonGrammarConverterExt);

		//start conversion: create grammar in jison syntax (from the JSON definition):
		theConverterInstance.init();
		this._preparePrintError();
		theConverterInstance.convertJSONGrammar();
		var grammarDefinition = theConverterInstance.getGrammarDef();

		//load options from configuration:
		var config = configManager.get(pluginName, {});
		//combine with default default options:
		var options = extend({id: instanceId}, DEFAULT_OPTIONS, config);

		//HELPER function for generating the parser-module (after parser was generated)
		var compileParserModule = function(grammarParser, hasError){

			var addGrammarParserExec = theConverterInstance.getCodeWrapPrefix(fileFormatVersion, JSON.stringify(options.execMode))
				+ grammarParser
				+ ';\n'
							+ 'function _printLog(){console.log.apply(console, arguments);};\n'
							+ 'function _noopFunc(){};\n'
							+ 'var _logDebug = _noopFunc;\n'
							+ 'var lexerOpt = parser.lexer.options;\n'
							+ 'var grammarFunc = function(inputStr, options){\n'
							// + '  options = options || {debug: true, trace: function(msg){window.alert(msg)}};\n' //TEST
							+ '  _logDebug = options && options.debug? _printLog : _noopFunc;\n'
							+ '  parser.trace = options && options.trace? typeof options.trace === "function"? options.trace : _printLog : _noopFunc;\n'
							+ '  lexerOpt.flex =  options && !!options.extensive;\n'
							+ '  lexerOpt.backtrack_lexer = options && !!options.backtrack;\n'
				+ '  var result;  try {\n'
				+ '    result = parser.parse.call(parser, inputStr);\n'
				+ '  } catch (err){\n'
				+ '    result = {error: err, phrase: inputStr, engine: "jison"};\n'//TODO warning/error messaging? -> need to handle encoded chars, if error message should be meaningful
				+ '  }\n'
				+ '  return result;\n'
				+ '};\n'
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

				var evalMsg = 'Error during eval() for "'+ instanceId +'": ' + err;

				if(jison.printError){
					jison.printError(evalMsg);
				}
				else {
					logger.error('jison', 'evalCompiled', evalMsg, err);
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

		var hasError = false;
		var grammarParser;
		try{
			var cfg = bnf.parse(grammarDefinition);
			var parser = Jison.Generator(cfg, options);
			grammarParser = parser.generate();
		} catch(error) {
//        	"{
//        	  "message": "Expected \"=\" or string but \"_\" found.",
//        	  "expected": [
//        	    {
//        	      "type": "literal",
//        	      "value": "=",
//        	      "description": "\"=\""
//        	    },
//        	    {
//        	      "type": "other",
//        	      "description": "string"
//        	    }
//        	  ],
//        	  "found": "_",
//        	  "offset": 4104,
//        	  "line": 40,
//        	  "column": 6,
//        	  "name": "SyntaxError"
//        	}"
			var msg = ' while compiling grammar "' + options.id + '": ';
			if(error.name === 'SyntaxError'){
				msg= 'SyntaxError' + msg + error.message;
			}
			else {
				msg = 'Error' + msg + (error && error.stack? error.stack : error);
			}

			if(typeof error.lineNumber !== 'undefined'){
				msg += ' at line '+error.lineNumber;
			}

			if(typeof error.column !== 'undefined'){
				msg += ':'+error.column;
			}

			if(typeof error.index !== 'undefined'){
				msg += ' (offset '+error.index+')';
			}

			msg += '\n-----------------------------\n  Grammar Definition:\n-----------------------------\n' + grammarDefinition;

			if(jison.printError){
				jison.printError(msg);
			}
			else {
				console.error(msg);
			}
			msg = '[INVALID GRAMMAR] ' + msg + (error && error.name === 'SyntaxError' && error.stack? error.stack : '');
			grammarParser = 'var parser = { parse: function(){ var msg = '+JSON.stringify(msg)+'; console.error(msg); throw msg;}, lexer: {options: {}}}';
			hasError = true;
		}

		return {def: grammarParser, hasError: hasError};
	},
	/**
	 * @protected
	 */
	_preparePrintError: function(){

		//setup logger for compile errors (if not already set)
		if(! jison.printError){
			/**
			 * The default logging / error-print function for jison.
			 *
			 * @private
			 * @name printError
			 * @function
			 * @memberOf JisonGenerator.jison#
			 *
			 * @see mmir.Logging
			 */
			jison.printError = function(){
				var args = toArray(arguments);
				//prepend "location-information" to logger-call:
				args.unshift('jison', 'compile');
				//output log-message:
				logger.error.apply(logger, args);
			};
		}
	},
	/**
	 * The default logging / error-print function for jison.
	 *
	 * @protected
	 *
	 * @see mmir.Logging
	 */
	printError: function(){
		jison.printError.apply(jison, arguments);
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
	}
};


////////////////////////////////////// Jison specific extensions to GrammarConverter ////////////////////////////////
/**
 * jison specific extension / implementation for {@link mmir.grammar.GrammarConverter} instances
 *
 * @type mmir.grammar.GrammarConverter
 * @memberOf JisonGenerator#
 */
var JisonGrammarConverterExt = {
	/** @memberOf JisonGrammarConverterExt */
	init: function(){

		this.THE_INTERNAL_GRAMMAR_CONVERTER_INSTANCE_NAME = "theGrammarConverterInstance";
		this._PARTIAL_MATCH_PREFIX = "$";
		this._PARTIAL_LOCATION_PREFIX = '@';

		this.grammar_tokens = "/* --- Token definitions --- */\n\n/* Characters to be ignored */\n"
			+ "\\s+    /* skip whitespace */\n\n/* Non-associative tokens */\n";

		this.grammar_utterances = "";
		this.grammar_phrases = "phrases:\n    ";
		this.token_variables = "%{\n  var " + this.variable_prefix + "result = '';\n";
		this.tokens_array = [];

		this.grammar_special_tokens = "";
		this.grammar_special_tokens_no = 0;

	},
	convertJSONGrammar: function(){

		this.json_grammar_definition = this.maskJSON(this.json_grammar_definition);

		this.token_variables += "  var semanticAnnotationResult = {};\n"
					//include some helper functions:
					+ this.helper_func_flatten
					+ this.helper_func_isarray
					+ this.helper_func_tok
					+ this.helper_func_offset
					+ this.helper_func_tokenList
					+ this.helper_func_getTok;


		this.parseTokens();
		this.parseUtterances();
		this.parseStopWords();

		this.token_variables += '\n' + this.helper_func_reset + '};\n';

		this.grammar_definition = this.token_variables
				+ "%}\n\n"
				+ "/* lexical grammar */\n%lex\n\n"
				+ this.grammar_special_tokens
				+ "\n\n%%"
				+ this.grammar_tokens
				+ "\n<<EOF>>   %{ return 'EOF'; %};\n\n/lex"
				+ "\n\n/* --- Grammar specification --- */\n%start utterance\n\n%% /* language grammar */\n\n"
				+ "__reset_routine: /* empty */ %{ _reset(); %};\n\n" //<- need a "reset rule" for jison, since the initializer-code is not scoped/reset, i.e. token & phrase variables need to be reset before executing the parser
				+ "utterance:\n    __reset_routine phrases EOF %{ "

				+ "_logDebug(" + this.variable_prefix + "result); "

				+ "semanticAnnotationResult.result = "
				+ this.variable_prefix + "result; return "+ this.variable_prefix +"result; %};\n\n" + this.grammar_utterances
				+ "\n" + this.grammar_phrases + ";\n\n"
		;

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

			this._addVarForReset(token_name);

			var sb = [];

			var isNotRegExpr = true;
			for(var i=0, size = words.length; i < size ; ++i){

				//NOTE RegExpr need to be recoded -> need to check, if current word is RegExp!
				//  example (see also _convertRegExpr()):
				//	INPUT:   '[a-zA-Z_]+'
				//	RECODED: [a-zA-Z_]+
				isNotRegExpr = this._checkIfNotRegExpr(words[i]);
				if( isNotRegExpr ){
					sb.push("\"");
				}

				//add TOKEN string:
				if(isNotRegExpr){
					sb.push(this._prepareToken(words[i]));
				}
				else {
					var special_token_name = "regexpr" + (++ this.grammar_special_tokens_no);
					this.grammar_special_tokens += special_token_name + "    " + this._convertRegExpr(words[i]) + "\n";
					sb.push("{" + special_token_name + "}");
				}


				if( isNotRegExpr ){
					sb.push("\"");
				}

				//if there is another word following, add OR operator
				if(i < size-1){
					sb.push("|");
				}
			}

			//close assignment for "= match:(" and create JavaScript processing for token
			sb.push(
				"     %{ _tok(" + pref + token_name.toLowerCase() + ", yytext); return '"+token_name+"'; %}\n"
			);

			self.grammar_tokens += sb.join("");
		}
	},


	//////////////// implementing/overriding BaseGenerator fields & functions: ////////////////////////

	//impl. abstract
	phrase_separator: "|",
	//impl. abstract
	phrase_match_var: "$$",
	//impl. abstract
	toUtteranceDeclarationHead: function(utteranceName){
		this._addVarForReset(utteranceName);
		return utteranceName + ':\n   ';
	},
	//impl. abstract
	toUtteranceDeclarationPhrase: function(_phrase, semanticInterpretation){
		// /*phrase +*/ semantic_interpretation
		return semanticInterpretation;
	},
	//impl. abstract
	addPhraseMatchForInterpretion: function(i, phraseList, phraseBuffer){
		// //create STR for phrase-matching
		// phraseStr += " " + phraseList[i];
		phraseBuffer.push(" " + phraseList[i]);
	},
	//impl. abstract
	addPartialPhraseInterpretion: function(i, tempPhrasesVar, phraseList, semanticProcBuffer){
		// //create STR for semantic processing of phrase
		// 	semanticProcResult += this.temp_phrase_match_var + " = " + this._PARTIAL_MATCH_PREFIX + num + ";"
		// 				+ this.temp_phrase_match_var + " = (typeof " + this.temp_phrase_match_var +" === 'string'? {"
		// 						+ this.entry_index_field + ": _offset("+ this._PARTIAL_LOCATION_PREFIX + num + "),"
		// 						+ this.entry_type_field + ": '" + phraseList[i].toLowerCase() + "',"
		// 						+ this.entry_token_field + ": " + this.temp_phrase_match_var
		// 					+ "} : " + this.temp_phrase_match_var + ");"
		// 				+ utterance_name + "_temp['phrases'].push(" + this.temp_phrase_match_var + ");\n\t\t";
		var num = i + 1;
		semanticProcBuffer.push(
			this.temp_phrase_match_var + " = " + this._PARTIAL_MATCH_PREFIX + num + ";"
						+ this.temp_phrase_match_var + " = (typeof " + this.temp_phrase_match_var + " === 'string'? {"
								+ this.entry_index_field + ": _offset("+ this._PARTIAL_LOCATION_PREFIX + num + "),"
								+ this.entry_type_field + ": '" + phraseList[i].toLowerCase() + "',"
								+ this.entry_token_field + ": " + this.temp_phrase_match_var
							+ "} : " + this.temp_phrase_match_var + ");"
						+ tempPhrasesVar + "['phrases'].push(" + this.temp_phrase_match_var + ");\n\t\t"
		);
	},
	// toPhraseMatchResultForInterpretion: -> use default impl.
	//impl. abstract
	toPhraseInterpretion: function(phraseMatchStr, pharseMatchResult, semanticProcResult){
		// return phraseStr + " %{\n\t   " + pharseMatchResult + "; " + semanticProcResult + "; \n\t%} ";
		return phraseMatchStr + " %{\n\t   " + pharseMatchResult + "; " + semanticProcResult + "; \n\t%} ";
	},
	//override default impl.:
	getPhraseMatchIndex: function(){
		return " _offset(" + this._PARTIAL_LOCATION_PREFIX + "1)";
	},
	//additional (custom) helper function:
	helper_func_offset: "  var _offset = function(pos, str){var c=pos.first_column,l=pos.first_line;if(l===1){return c;}var renl=/\\r?\\n/gm;var i=0, res;while(++i<l && (res=renl.exec(str))){}return res?res.index+res[0].length + c:c;};\n",
	helper_func_reset: "  var _reset = function(){",// function body will be generated -> see _addVarForReset


	//////////////// internal helpers: ////////////////////////

	_addVarForReset: function(token_or_utterance_name){
		this.helper_func_reset += this.variable_prefix + token_or_utterance_name.toLowerCase() + '.splice(0);';
	},

	_prepareToken: function(token){
		//need to mask delimiting quotes, i.e. "
		return token.replace(/"/g, '\\"');
	},
	_checkIfNotRegExpr: function(token){

		//test for character-group
		if( ! /([^\\]\[)|(^\[).*?[^\\]\]/.test(token)){

			//test for grouping
			if( ! /([^\\]\()|(^\().*?[^\\]\)/.test(token) ){

				//try for single-characters that occur in reg-expr FIXME this may procude false-positives!!!
				return ! /[\?|\*|\+|\^|\|\\]/.test(token); //excluded since these may be more common in natural text: . $
			}
		}

		return false;
	},
	_convertRegExpr: function(token){
		var sb = [], ch, last = null, isString = false, isGroup = false, isEsc = false/*, hasOr = false*/;
		for(var i=0, size = token.length; i < size; ++i){
			ch = token.charAt(i);
			switch(ch){
			case '(':
			case ')':
			case '[':
			case ']':
			case '+':
			case '*':
			case '?':
			case '$':
			case '^':
			case '.':
			case '|':
				if(last !== '\\'){

					//if changed from STRING -> non-STRING, then "close" string first:
					if(isString){

						//for "optional" expression: modify previous entry to be a single character-sequence
						// ...cars'?  -> ...car' 's'?
						if(ch === '?' && sb.length > 0){//TODO also for '+', '*', ...???
							sb[ sb.length - 1 ] = '" "' + sb[ sb.length - 1 ];
						}

						sb.push("\" ");
						isString = false;
					}

					//insert reg-expr symbol
//					if(ch !== '|'){
						sb.push(ch);
//					}
//					else {
//						sb.push(' | ');
//						hasOr = true;
//					}

					//is character-group opening/closing?
					if(isGroup && ch === ']'){
						isGroup = false;
					}
					else if(!isGroup && ch === '['){
						isGroup = true;
					}


					break;
				}
				else {
					isEsc = true;
				}
			default:

				if(isEsc){
					sb.splice(sb.length-1);//remove last element, i.e. the escape-character
					isEsc = false;
				}

				//if changed from non-STRING -> STRING, then "open" string now:
				if(!isGroup && !isString){
					sb.push(" \"");
					isString = ! isGroup;
				}
				sb.push(ch);
			}

			last = ch;
		}

		//if last char was a STRING, "close" string now:
		if(isString){
			sb.push("\"");
		}
//		if(hasOr){
//			sb.unshift('(');
//			sb.push(')');
//		}
		return sb.join('');
	}
};


return jisonGen;

});
