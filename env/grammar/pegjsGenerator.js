
define(['pegjs', 'constants', 'configurationManager', 'grammarConverter', 'jquery', 'logger', 'module'],
/**
 * Generator for executable language-grammars (i.e. converted JSON grammars).
 * 
 * <p>
 * This generator uses PEG.js for compiling the JSON grammar.
 * 
 * <p>
 * The generator for compiling the JSON grammar definitions in <code>www/config/languages/&lt;language code&gt;/grammar.json</code>
 * can be configured in <code>www/config/configuration.json</code>:<br>
 * <pre>
 * {
 *   ...
 *   "grammarCompiler": "pegjs",
 *   ...
 * }</pre>
 * 
 * 
 * 
 * @see <a href="http://pegjs.majda.cz/">http://pegjs.majda.cz/</a>
 * 
 * @class
 * @constant
 * @public
 * @name PegJsGenerator
 * @exports PegJsGenerator as mmir.env.grammar.PegJsGenerator
 * 
 * @requires PEG.js
 * @requires jQuery.Deferred
 * @requires jQuery.extend
 * @requires jQuery.makeArray
 */		
function(pegjs, constants, configManager, GrammarConverter, $, Logger, module){

//////////////////////////////////////  template loading / setup for JS/CC generator ////////////////////////////////

/**
 * Deferred object that will be returned - for async-initialization:
 * the deferred object will be resolved, when this module has been initialized.
 * 
 * @property
 * @private
 * @type Deferred
 * @memberOf PegJsGenerator#
 */
var deferred = $.Deferred();
//no async initialization necessary for PEG.js generator -> resolve immediately
deferred.resolve();

/**
 * The Logger for the PEGjs generator.
 * 
 * @property
 * @private
 * @type Logger
 * @memberOf PegJsGenerator#
 * 
 * @see mmir.Logging
 */
var logger = Logger.create(module);

//setup logger for compile errors, if not already set
if(! pegjs.printError){
	/**
	 * The default logging / error-print function for PEGjs.
	 * 
	 * @private
	 * @name printError
	 * @function
	 * @memberOf PegJsGenerator.pegjs#
	 * 
	 * @see mmir.Logging
	 */
	pegjs.printError = function(){
		var args = $.makeArray(arguments);
		//prepend "location-information" to logger-call:
		args.unshift('PEGjs', 'compile');
		//output log-message:
		logger.error.apply(logger, args);
	};
}

/**
 * The argument name when generating the grammar function:
 * the argument holds the raw text that will be parsed by the generated grammar.
 * 
 * NOTE: this argument/variable name must not collide with any code that is generated for the grammar.
 * 
 * @constant
 * @private
 * @function
 * @memberOf PegJsGenerator#
 */
var INPUT_FIELD_NAME = 'asr_recognized_text';

/**
 * The default options for the PEGjs compiler.
 * 
 * To overwrite the default options, configure the following property in <code>www/config/configuration.json</code>:<br>
 * <pre>
 * {
 *   ...
 *   "grammar": {
 *   	...
 *   	"pegjs": {
 *   		"cache": [true | false], 			// "If true, makes the parser cache results, avoiding exponential parsing time in pathological cases but making the parser slower" - DEFAULT false
 *   		"optimize": ["speed" | "size"], 	//optimizing the generated parser for speed or (code) size - DEFAULT "speed"
 *   		"output": ["source" | "parser"], 	//should not be changed!!! whether to return TEXT or evaluated JavaScript - DEFAULT: "source"
 *   		"allowedStartRules": RULE_NAMES 	//should not be changed!!! - DEFAULT: not set
 *   	}
 *   	...
 *   },
 *   ...
 * }</pre>
 * 
 * 
 * @constant
 * @private
 * @default cache := false, optimize := 'speed', output := 'source' allowedStartRules := undefined
 * @memberOf PegJsGenerator#
 */
var DEFAULT_OPTIONS = {
	cache:    false,
	optimize: "speed",
	output:   "source"
};

/**
 * Name for this plugin/grammar-generator (e.g. used for looking up configuration values in configuration.json).
 * @constant
 * @private
 * @memberOf PegJsGenerator#
 */
var pluginName = 'grammar.pegjs';

/**
 * Exported (public) functions for the PEGjs grammar-engine.
 * @public
 * @type GrammarGenerator
 * @memberOf PegJsGenerator#
 */
var pegjsGen = {
	/** @scope PegJsGenerator.prototype */
	
	/**
	 * @param {Function} [callback] OPTIONAL
	 * 			the callback that is triggered, when the engine is initialized
	 * @returns {Deferred}
	 * 			a promise that is resolved, when the engine is initialized
	 * 			(NOTE: if you use the same function for the <code>callback</code> AND the promise,
	 * 			       then the function will be invoked twice!)
	 * 
	 * @memberOf mmir.env.grammar.PegJsGenerator.prototype
	 */
	init: function(callback){
		if(callback){
			deferred.always(callback);
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
        
		//attach functions for PEG.js conversion/generation to the converter-instance: 
		$.extend(theConverterInstance, PegJsGrammarConverterExt);
		
		//start conversion: create grammar in JS/CC syntax (from the JSON definition):
		theConverterInstance.init();	
		theConverterInstance.convertJSONGrammar();
        var grammarDefinition = theConverterInstance.getJSCCGrammar();
        
        //load options from configuration:
        var config = configManager.get(pluginName, true, {});
        //combine with default default options:
        var options = $.extend({}, DEFAULT_OPTIONS, config);
        
        var hasError = false;
        var grammarParser;
        try{
        	grammarParser = pegjs.buildParser(grammarDefinition, options);
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
        	hasError = true;
        	var msg = ' while compiling grammar "' + instanceId+ '": ';
        	if(error.name === 'SyntaxError'){
        		msg= 'SyntaxError' + msg + error.message;
        	}
        	else {
        		msg = 'Error' + msg + (error && error.stack? error.stack : error);
        	}
        	
        	if(typeof error.line !== 'undefined'){
        		msg += ' at line '+error.line;
        	}

        	if(typeof error.column !== 'undefined'){
        		msg += ':'+error.column;
        	}
        	
        	if(typeof error.offset !== 'undefined'){
        		msg += ' (offset '+error.offset+')';
        	}
        	
        	if(pegjs.printError){
        		pegjs.printError(msg);
        	}
        	else {
        		console.error(msg);
        	}
        	msg = '[INVALID GRAMMAR] ' + msg;
        	grammarParser = '{ parse: function(){ var msg = '+JSON.stringify(msg)+'; console.error(msg); throw msg;} }';//FIXME
        }
        
        //FIXME attach compiled parser to some other class/object
        var moduleNameString = '"'+instanceId+'GrammarJs"';
        var addGrammarParserExec = 
//    	  'define('+moduleNameString+',["semanticInterpreter"],function(semanticInterpreter){\n'
    	  '(function(){\n  var semanticInterpreter = require("semanticInterpreter");\n'//FIXME
        	+ 'var fileFormatVersion = '+fileFormatVersion+';\n'
        	+ 'var parser = '
        	+ grammarParser
//        	+ ';\nvar grammarFunc = parser.parse;\n'
        	+ ';\nvar grammarFunc = function(){\n'
        	+ '  var result;  try {\n'
        	+ '    result = parser.parse.apply(this, arguments);\n'
        	+ '  } catch (err){\n'
        	+ '    console.error(err.stack?err.stack:err); result = {};\n'//TODO warning/error messaging? -> need to handle encoded chars, if error message should be meaningful
        	+ '  }\n'
        	+ '  return result;\n'
        	+ '};\n'
        	+ 'semanticInterpreter.addGrammar("'
        		+instanceId
        		+'", grammarFunc, fileFormatVersion);\n\n'
        	+ 'semanticInterpreter.setStopwords("'
        		+instanceId+'",'
        		
        		//store stopwords with their Unicode representation (only for non-ASCII chars)
        		+JSON.stringify(
        				theConverterInstance.getEncodedStopwords()
        		).replace(/\\\\u/gm,'\\u')//<- revert JSON.stringify encoding for the Unicodes
        	+ ');\n'
        	+ 'return grammarFunc;\n'
//                	+ '});\n'
//                	+ 'require(['+moduleNameString+']);\n';//requirejs needs this, in order to trigger initialization of the grammar-module (since this is a self-loading module that may not be referenced in a dependency in a define() call...)
        	+ '})();'//FIXME

//        	//for Chrome / FireFox debugging: provide an URL for eval'ed code
//        	+ '//@ sourceURL=gen/grammar/'+instanceId+'_compiled_grammar\n//# sourceURL=gen/grammar/'+instanceId+'_compiled_grammar\n'
        ;
        
        theConverterInstance.setJSGrammar(addGrammarParserExec);

//        doAddGrammar(instanceId, theConverterInstance);
        
        try{
        	
        	eval(addGrammarParserExec);
        	
        } catch (err) {
        	
        	//TODO russa: generate meaningful error message with details about error location
        	//			  eg. use esprima (http://esprima.org) ...?
        	//			... as optional dependency (see deferred initialization above?)
        	
        	var evalMsg = 'Error during eval() for "'+ instanceId +'": ' + err;
        	
        	if(pegjs.printError){
        		pegjs.printError(evalMsg);
        	}
        	else {
        		logger.error('PEGjs', 'evalCompiled', evalMsg, err);
        	}
        	
        	if(! hasError){
            	evalMsg = '[INVALID GRAMMAR JavaScript CODE] ' + evalMsg;
            	var parseDummyFunc = (function(msg, error){ 
            		return function(){ console.error(msg); console.error(error); throw msg;};
            	})(evalMsg, err);
            	
            	parseDummyFunc.hasErrors = true;
            	
            	//theConverterInstance = doGetGrammar(instanceId);
            	theConverterInstance.setGrammarFunction(parseDummyFunc);
        	}
        	
        }
        
        //invoke callback if present:
        if(callback){
        	callback(theConverterInstance);
        }
        
        return theConverterInstance;
	}
};


////////////////////////////////////// PEG.js specific extensions to GrammarConverter ////////////////////////////////
/**
 * PEGjs specific extension / implementation for {@link GrammarConverter} instances
 * 
 * @type GrammarConverter
 * @memberOf PegJsGenerator#
 */
var PegJsGrammarConverterExt = {
	/** @memberOf PegJsGrammarConverterExt */
	init: function(){
		
		this.THE_INTERNAL_GRAMMAR_CONVERTER_INSTANCE_NAME = "theGrammarConverterInstance";
		this._WHITESPACE_TOKEN_NAME = "WS";
		this._PARTIAL_MATCH_PREFIX = "_r";
		this.grammar_tokens = "/* --- Token definitions --- */\n\n/* Characters to be ignored */\n"
			+ this._WHITESPACE_TOKEN_NAME +" = ' '/'\\t';\n\n/* Non-associative tokens */\n";
		
		this.grammar_utterances = "";
		this.grammar_phrases = "phrases\n    = ";
		this.token_variables = "{\n  var " + this.variable_prefix + "result = '';\n";
		this.tokens_array = [];
		
	},
	convertJSONGrammar: function(){
	
		this.json_grammar_definition = this.maskJSON(this.json_grammar_definition);
		
		this.token_variables += "  var semanticAnnotationResult = {};\n"
			+ "  var _flatten = function(match){ if(!match.join){ return match;} for(var i=0, size = match.length; i < size; ++i){if(!match[i]){continue;}if(match[i].join){match[i] = _flatten(match[i])}} return match.join('') };\n"
			+ "  var _tok = function(field, match){ match = _flatten(match); field[match] = match; return match;}\n"
		;
		
		this.parseTokens();
		this.parseUtterances();
		this.parseStopWords();
		
		this.jscc_grammar_definition = this.token_variables
				+ "}\n\n"
				+ "\n\n/* --- Grammar specification --- */\n\nutterance\n    = phrases    {  "
				
				//TODO use LOG LEVEL for activating / deactivating this:
				+ "console.log("
				+ this.variable_prefix + "result); "
				
				+ "semanticAnnotationResult.result = "
				+ this.variable_prefix + "result; return "+ this.variable_prefix +"result;} ;\n\n" + this.grammar_utterances
				+ "\n" + this.grammar_phrases + ";\n\n"
				+ this.grammar_tokens;

		this.json_grammar_definition = this.unmaskJSON(this.json_grammar_definition);
	},
	parseTokens: function(){
		var self = this;
		var json_tokens =  this.json_grammar_definition.tokens;
		var pref = self.variable_prefix;
		
		
		for(token_name in json_tokens){
			
			var words = json_tokens[token_name];
			
			self.token_variables += "  var " + pref
					+ token_name.toLowerCase() + " = {};\n";
			
			var sb = [token_name, "\n    = _m:("];
			
			var isNotRegExpr = true;
			for(var i=0, size = words.length; i < size ; ++i){
				
				//NOTE RegExpr need to be recoded -> need to check, if current word is RegExp!
				//  example (see also _convertRegExpr()):
				//	INPUT:   '[a-zA-Z_]+'
				//	RECODED: [a-zA-Z_]+
				isNotRegExpr = this._checkIfNotRegExpr(words[i]);
				if( isNotRegExpr ){
					sb.push("'");
				}
				
				//add TOKEN string:
				sb.push( isNotRegExpr? words[i] : this._convertRegExpr(words[i]));

				
				if( isNotRegExpr ){
					sb.push("'");
				}
				
				//if there is another word following, add OR operator
				if(i < size-1){
					sb.push("/");
				}
			}
			
			//close assignment for "= match:(" and create JavaScript processing for token
			sb.push(
				")  { return _tok(" + pref + token_name.toLowerCase() + ", _m); };\n"
			);
			
			self.grammar_tokens += sb.join("");
		}
	},
	parseUtterances: function(){
		var self = this;
		var utt_index = 0;
		var json_utterances =  this.json_grammar_definition.utterances;

		for(var utterance_name in json_utterances){
			var utterance_def = json_utterances[utterance_name];
			if(utt_index > 0){
				self.grammar_phrases += "\n\t/";
			}
			utt_index++;
			self.doParseUtterance(utterance_name, utterance_def);
		}
	},
	doParseUtterance: function(utterance_name, utterance_def){
		
		var self = this; 
		
		self.token_variables += "  var " + self.variable_prefix
				+ utterance_name.toLowerCase() + " = {};\n";
		

		var grammar_utterance = utterance_name + "\n   = ";
		//self.grammar_phrases += utterance_name + "  " +  self.doCreateSemanticInterpretationForUtterance(utterance_name, utterance_def);
		self.grammar_phrases += utterance_name + "  " ;
		var phrases = utterance_def.phrases;
		var semantic  = self.doCreateSemanticInterpretationForUtterance(utterance_name, utterance_def);
		
		for(var index=0,size=phrases.length; index < size; ++index){
			if(index > 0){
				grammar_utterance += "\n  / ";
			}
			var phrase = phrases[index];
			var semantic_interpretation = self.doCreateSemanticInterpretationForPhrase(
					utterance_name.toLowerCase(), utterance_def, phrase, semantic
			);
			grammar_utterance += /*phrase +*/ semantic_interpretation;
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
				remapped_variable_name = variable;
			} else {
					remapped_variable_name = variable.replace(
							  '[' + variable_index[1] + ']'
							, "["
								+ utterance_name.toLowerCase() + "_temp['phrases']['"
								+ variable_name.toLowerCase() + "']["
								+ variable_index[1]
							+ "]."+this.entry_token_field+"]");
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
			}
			semantic_as_string = semantic_as_string.replace(
					variables[0],
					" function(){try{return " + remapped_variable_name
						+ ";} catch(e){return void(0);}}() "
//					"' + " + remapped_variable_name + " + '"//TODO replace try/catch with safe_acc function
			);
			variables =  this.variable_regexp.exec(semantic_as_string);
		}
		}
		return semantic_as_string;
	},
	doCreateSemanticInterpretationForPhrase: function(utterance_name, utterance_def, phrase, semantic_as_string){
		var phraseList = phrase.split(/\s+/),
		length = phraseList.length,
		duplicate_helper = {};
	
		var phraseStr = "";
	//	var result = " { var _m = ";
		var i = 0;
		
		var pharseMatchResult = "var _m = ";
	//	for (; i < length; ++i){
	//		pharseMatchResult += this._PARTIAL_MATCH_PREFIX + (i+1);
	//		if(i < length){
	//			pharseMatchResult += " + ' ' + ";
	//		}
	//	}
		
	//	result += "; var "+utterance_name+"_temp = {}; "+utterance_name+"_temp['phrases'] = {};";
		
		var semanticProcResult = "var "+utterance_name+"_temp = {}; "+utterance_name+"_temp['phrases'] = {};";
		var num;
		for (i = 0; i < length; ++i) {
			
			num = i+1;
			
			//create STRING for phrase-matching
			if(i > 0){
				phraseStr += " " + this._WHITESPACE_TOKEN_NAME + " ";
			}
			phraseStr += this._PARTIAL_MATCH_PREFIX + num + ":" + phraseList[i];
			
			//create STRING for concatenated match of all partial phrases
			pharseMatchResult += this._PARTIAL_MATCH_PREFIX + num;
			if(num < length){
				pharseMatchResult += " + ' ' + ";
			}
			
			//create STRING for semantic processing of phrase
			if (typeof(duplicate_helper[phraseList[i]]) == "undefined") {
				duplicate_helper[phraseList[i]] = 0;
				semanticProcResult += utterance_name+"_temp['phrases']['"+phraseList[i].toLowerCase()+"'] = [];\n\t\t";
			} else {
				duplicate_helper[phraseList[i]] += 1;
			}
			semanticProcResult += utterance_name + "_temp['phrases']['"
						+ phraseList[i].toLowerCase() + "']["
						+ duplicate_helper[phraseList[i]] + "] = {"
							+ this.entry_token_field + ": " + this._PARTIAL_MATCH_PREFIX + num + ","
							+ this.entry_index_field + ": " + (num-1)
						+"};\n\t\t";
		}
		
		semanticProcResult += "var " + this.variable_prefix + "phrase = _m; " 
				+ utterance_name + "_temp['phrase']=" + this.variable_prefix + "phrase; "
				+ utterance_name + "_temp['utterance']='" + utterance_name + "'; "
				+ utterance_name + "_temp['engine']='pegjs'; "//FIXME debug
				+ utterance_name + "_temp['semantic'] = " + semantic_as_string
				+ "; " + this.variable_prefix + utterance_name + "["
				+ this.variable_prefix + "phrase] = " + utterance_name + "_temp; "
				+ this.variable_prefix + "result = " + utterance_name + "_temp;";
		
		return phraseStr + " {\n\t   " + pharseMatchResult +  "; " + semanticProcResult + "; return _m; \n\t} ";
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
		var sb = [], ch, last = null, isString = false, isGroup = false, isEsc = false, hasOr = false;
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
							sb[ sb.length - 1 ] = '\' \'' + sb[ sb.length - 1 ];
						}
						
						sb.push("' ");
						isString = false;
					}
					
					//insert reg-expr symbol
					if(ch !== '|'){
						sb.push(ch);
					}
					else {
						sb.push(' / ');
						hasOr = true;
					}
					
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
					sb.push(" '");
					isString = ! isGroup;
				}
				sb.push(ch);
			}
			
			last = ch;
		}
		
		//if last char was a STRING, "close" string now:
		if(isString){
			sb.push("'");
		}
		if(hasOr){
			sb.unshift('(');
			sb.push(')');
		}
		return sb.join('');
	}
};


return pegjsGen;

});