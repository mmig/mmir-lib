
define(['jscc', 'constants', 'grammarConverter', 'jquery', 'logger', 'module'],
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
 * @requires jQuery.Deferred
 * @requires jQuery.extend
 * @requires jQuery.ajax
 * @requires jQuery.makeArray
 */		
function(jscc, constants, GrammarConverter, $, Logger, module){

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
var deferred = $.Deferred();

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
function _createCompileLogFunc(log /*Logger*/, level /*String: log-function-name*/, libMakeArray/*helper-lib: provides function makeArray(obj); e.g. jquery*/){
	return function(){
		var args = libMakeArray.makeArray(arguments);
		//prepend "location-information" to logger-call:
		args.unshift('JS/CC', 'compile');
		//output log-message:
		log[level].apply(log, args);
	};
}
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
	jscc.set_printError(	_createCompileLogFunc(logger, 'error', $));
}
if(jscc.is_printWarning_default()){
	/**
	 * The default logging function for printing compilation warnings.
	 * @private
	 * @name set_printWarning
	 * @function
	 * @memberOf JsccGenerator.jscc#
	 */
	jscc.set_printWarning(	_createCompileLogFunc(logger, 'warn', $));
}
if(jscc.is_printInfo_default()){
	/**
	 * The default logging function for printing compilation information.
	 * @private
	 * @name set_printInfo
	 * @function
	 * @memberOf JsccGenerator.jscc#
	 */
	jscc.set_printInfo(		_createCompileLogFunc(logger, 'info', $));
}

/**
 * The URL to the JS/CC template file (generated code-text will be "embedded" in this template)
 * 
 * @private
 * @type String
 * @memberOf JsccGenerator#
 */
var templatePath = constants.getGrammarPluginPath() + 'grammarTemplate_reduced.tpl';

/**
 * The argument name when generating the grammar function:
 * the argument holds the raw text that will be parsed by the generated grammar.
 * 
 * NOTE: this argument/variable name must not collide with any code that is generated for the grammar.
 * 
 * @constant
 * @private
 * @memberOf JsccGenerator#
 */
var INPUT_FIELD_NAME = 'asr_recognized_text';

/**
 * Exported (public) functions for the JS/CC grammar-engine.
 * @public
 * @type GrammarGenerator
 * @memberOf JsccGenerator#
 */
var jsccGen = {
	/** @scope JsccGenerator.prototype */
	
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
        
		//attach functions for JS/CC conversion/generation to the converter-instance: 
		$.extend(theConverterInstance, JsccGrammarConverterExt);
		//attach the JS/CC template to the converter instance
		theConverterInstance.TEMPLATE = this.template;
		
		//start conversion: create grammar in JS/CC syntax (from the JSON definition):
		theConverterInstance.init();
        theConverterInstance.convertJSONGrammar();
        var grammarDefinition = theConverterInstance.getJSCCGrammar();
        var grammarParserStr;

        //set up the JS/CC compiler:
        var dfa_table = '';
        jscc.reset_all( jscc.EXEC_WEB );
        
        var isParsingFailed = false;
        try {
        	jscc.parse_grammar(grammarDefinition);
        } catch (err){
        	var msg = 'Error while compiling grammar: ' + (err.stack?err.stack:err);
        	isParsingFailed = msg;
        	
        	msg = '[INVALID GRAMMAR] ' + msg;
        	grammarParserStr = 'var msg = '+JSON.stringify(msg)+'; console.error(msg); throw msg;';//FIXME
        }
      
        if (jscc.getErrors() == 0) {
        	jscc.undef();
        	jscc.unreachable();
                
            if (jscc.getErrors() == 0) {
            	jscc.first();
            	jscc.print_symbols();
            	dfa_table = jscc.create_subset(jscc.get_nfa_states());
            	dfa_table = jscc.minimize_dfa(dfa_table);
            	
            	jscc.set_dfa_table(dfa_table);//FIXME: check, if this is really necessary
                
            	jscc.lalr1_parse_table(false);
            	jscc.resetErrors();
            }
        }
     
        if (jscc.getErrors() > 0 || jscc.getWarnings() > 0){
            logger.error(
            		'JSCC', 'compile', 'there occured' 
            		+ (jscc.getWarnings() > 0? jscc.getWarnings() + ' warning(s)' : '')
            		+ (jscc.getErrors() > 0? jscc.getErrors() + ' error(s)' : '')
            		+ ' during compilation.'
            );
        }
        jscc.resetErrors();
        jscc.resetWarnings();
        
//                console.debug("before replace " + theConverterInstance.PARSER_TEMPLATE);//debug
     
        if( ! isParsingFailed){
	        grammarParserStr = this.template;
	        grammarParserStr = grammarParserStr.replace(/##PREFIX##/gi, "");
	        grammarParserStr = grammarParserStr.replace(/##HEADER##/gi, jscc.get_code_head());
	        grammarParserStr = grammarParserStr.replace(/##TABLES##/gi, jscc.print_parse_tables(jscc.MODE_GEN_JS));
	        grammarParserStr = grammarParserStr.replace(/##DFA##/gi, jscc.print_dfa_table(dfa_table));
	        grammarParserStr = grammarParserStr.replace(/##TERMINAL_ACTIONS##/gi, jscc.print_term_actions());
	        grammarParserStr = grammarParserStr.replace(/##LABELS##/gi, jscc.print_symbol_labels());
	        grammarParserStr = grammarParserStr.replace(/##ACTIONS##/gi, jscc.print_actions());
	        grammarParserStr = grammarParserStr.replace(/##FOOTER##/gi, "\nvar _semanticAnnotationResult = { result: {}};\n__parse( "+INPUT_FIELD_NAME+", new Array(), new Array(), _semanticAnnotationResult);\nreturn _semanticAnnotationResult.result;");
	        grammarParserStr = grammarParserStr.replace(/##ERROR##/gi, jscc.get_error_symbol_id());
	        grammarParserStr = grammarParserStr.replace(/##EOF##/gi, jscc.get_eof_symbol_id());
	        grammarParserStr = grammarParserStr.replace(/##WHITESPACE##/gi, jscc.get_whitespace_symbol_id());
        }
        
        //FIXME attach compiled parser to some other class/object
        var moduleNameString = '"'+instanceId+'GrammarJs"';
        var addGrammarParserExec = 
//        	  'define('+moduleNameString+',["semanticInterpreter"],function(semanticInterpreter){\n'
    	  '(function(){\n  var semanticInterpreter = require("semanticInterpreter");\n'//FIXME
        	+ 'var fileFormatVersion = '+fileFormatVersion+';\n'
        	+ 'var grammarFunc = function('+INPUT_FIELD_NAME+'){'
    			//TODO active/use safe_acc (instead of try-catch construct in semantic-result extraction
//        			+ "var safe_acc = function(obj){\n  \tvar len = arguments.length;\n  \tif(len === 1){\n  \t    return null;\n  \t}\n  \tvar curr = obj, prop = arguments[1], i = 2;\n  \tfor(; i < len; ++i){\n  \tif(obj[prop] != null){\n  \t    obj = obj[prop];\n  \t}\n  \tprop = arguments[i];\n  \t}\n  \tvar res = obj[prop];\n  \treturn typeof res !== 'undefined'? res : null;\n  \t};"
    			+ grammarParserStr
        	+ '\n};\n'
        	
        	//add "self registering" for the grammar-function
        	//  i.e. register the grammar-function for the ID with the SemanticInterpreter
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
        	+ '})();'

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
            	
            	//theConverterInstance = doGetGrammar(instanceId);
            	theConverterInstance.setGrammarFunction(parseDummyFunc);
        	}
        	
        }
//        
        //invoke callback if present:
        if(callback){
        	callback(theConverterInstance);
        }
        
        return theConverterInstance;
	}
};

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
	$.ajax({
		url: url,
		dataType: 'text',
		async: true,
		success: function(data){
			
			jsccGenerator.template = data;
			
			promise.resolve();
			
		},
		error: function(xhr, status, err){
			var msg = 'Failed to load grammar template file from "'+templatePath+'": '+status+', ERROR '+err;
			console.error(msg);
			promise.reject(msg);
		}
	});
}

//load the JS/CC template and resolve this module as "initialzed":
_loadTemplate(templatePath, jsccGen, deferred);

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
		this.grammar_tokens = "/~ --- Token definitions --- ~/\n\n/~ Characters to be ignored ~/\n!   ' |\\t' ;\n\n/~ Non-associative tokens ~/\n";
		this.grammar_utterances = "";
		this.grammar_phrases = "phrases:";
		this.token_variables = "[*\n  var " + this.variable_prefix
				+ "result = '';\n";
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
				
				//TODO use LOG LEVEL for activating / deactivating this:
				+ "console.log("
				+ this.variable_prefix + "result); "
				
				+ "semanticAnnotationResult.result = "
				+ this.variable_prefix + "result; *] ;\n\n" + this.grammar_utterances
				+ "\n" + this.grammar_phrases + ";";
	
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
			
			var grammar_token ="    '";
			
			for(var i=0, size = words.length; i < size ; ++i){
				if(i > 0){
					grammar_token += "|";
				}
				grammar_token += words[i];
			}
			
			grammar_token += "'    " + token_name + " [* " + pref
					+ token_name.toLowerCase() + "[%match] = %match; *];\n";
			
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
				+ utterance_name.toLowerCase() + " = {};\n";
		//self.grammar_phrases += utterance_name + "  " +  self.doCreateSemanticInterpretationForUtterance(utterance_name, utterance_def);
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
		
		var result = " [* %% = ";
		var i = 0;
		while (i < length){
			i++;
			result += "%"+i;
			if(i < length){
				result += " + ' ' + ";
			}
		}
		result += "; var "+utterance_name+"_temp = {}; "+utterance_name+"_temp['phrases'] = {};";
		for (i = 0; i < length; i += 1) {
			if (typeof(duplicate_helper[phraseList[i]]) == "undefined") {
				duplicate_helper[phraseList[i]] = 0;
				result += utterance_name+"_temp['phrases']['"+phraseList[i].toLowerCase()+"'] = [];";
			} else {
				duplicate_helper[phraseList[i]] += 1;
			}
			result += utterance_name + "_temp['phrases']['"
						+ phraseList[i].toLowerCase() + "']["
						+ duplicate_helper[phraseList[i]] + "] = {"
							+ this.entry_token_field + ": %" + (i + 1) + ","
							+ this.entry_index_field + ": " + i
						+"};\n\t\t";
		}
		result += "var " + this.variable_prefix + "phrase = %%; " 
				+ utterance_name + "_temp['phrase']=" + this.variable_prefix + "phrase; "
				+ utterance_name + "_temp['utterance']='" + utterance_name + "'; "
				+ utterance_name + "_temp['engine']='jscc'; "//FIXME debug
				+ utterance_name + "_temp['semantic'] = " + semantic_as_string
				+ "; " + this.variable_prefix + utterance_name + "["
				+ this.variable_prefix + "phrase] = " + utterance_name + "_temp; "
				+ this.variable_prefix + "result = " + utterance_name + "_temp; *]";
		return result;
	}
};


return jsccGen;

});