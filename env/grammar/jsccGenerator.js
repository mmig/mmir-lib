
/**
 * Generator for executable language-grammars (i.e. converted JSON grammars).
 * 
 * This generator uses JS/CC for compiling the JSON grammar.
 * 
 * @see http://jscc.phorward-software.com/
 * 
 * 
 * @depends JS/CC
 * @depends jQuery.Deferred
 * @depends jQuery.extend
 * @depends jQuery.ajax
 */
define(['jscc', 'constants', 'grammarConverter', 'jquery'], function(jscc, constants, GrammarConverter, $){

//////////////////////////////////////  template loading / setup for JS/CC generator ////////////////////////////////

var deferred = $.Deferred();

var templatePath = constants.getGrammarPluginPath() + 'grammarTemplate_reduced.tpl';

/**
 * The argument name when generating the grammar function:
 * the argument holds the raw text that will be parsed by the generated grammar.
 * 
 * NOTE: this argument/variable name must not collide with any code that is generated for the grammar.
 * 
 * @constant
 * @private
 */
var INPUT_FIELD_NAME = 'asr_recognized_text';

var jsccGen = {
	init: function(callback){
		if(callback){
			deferred.always(callback);
		}
		return deferred;
	},
	isAsyncCompilation: function(){ return false; },
	compileGrammar: function(theConverterInstance, instanceId, fileFormatVersion, callback){
        
		//attach functions for JS/CC conversion/generation to the converter-instance: 
		$.extend(theConverterInstance, JsccGrammarConverterExt);
		
		//start conversion: create grammar in JS/CC syntax (from the JSON definition):
		theConverterInstance.init();	
        theConverterInstance.convertJSONGrammar();
        var grammarDefinition = theConverterInstance.getJSCCGrammar();

        //set up the JS/CC compiler:
        var dfa_table = '';
        error_output = new String();//FIXME impl. & use jcss.getErrorMessage()/Problems()...
        jscc.reset_all( jscc.EXEC_WEB );
        jscc.parse_grammar(grammarDefinition);
      
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
     
        if (jscc.getErrors() > 0 || jscc.getWarnings() > 0 && error_output != "") 
            console.error(''+error_output);
        jscc.resetErrors();
        jscc.resetWarnings();
        
//                console.debug("before replace " + theConverterInstance.PARSER_TEMPLATE);//debug
     
        var grammarParserStr = this.template;
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
//        
        eval(addGrammarParserExec);
//        
        //invoke callback if present:
        if(callback){
        	callback(theConverterInstance);
        }
        
        return theConverterInstance;
	}
};

$.ajax({
	url: templatePath,
	dataType: 'text',
	async: true,
	success: function(data){
		
		jsccGen.template = data;
		
		GrammarConverter.prototype.TEMPLATE = data;
		
		deferred.resolve();
		
//		jsccGen.init = function(callback){
//			if(callback){
//				callback();
//			}
//			return {
//				then: function(callback){
//					if(callback){
//						callback();
//					}
//				}
//			};
//		};
	},
	error: function(xhr, status, err){
		var msg = 'Failed to load grammar template file from "'+templatePath+'": '+status+', ERROR '+err;
		console.error(msg);
		deferred.reject(msg);
	}
});

////////////////////////////////////// JS/CC specific extensions to GrammarConverter ////////////////////////////////

var JsccGrammarConverterExt = {
		
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
	
		for(utterance_name in json_utterances){
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
		
		if(IS_DEBUG_ENABLED) console.debug('doCreateSemanticInterpretationForUtterance: '+semantic);//debug
		
		var semantic_as_string = JSON.stringify(semantic);
		if( semantic_as_string != null){
		this.variable_regexp.lastIndex = 0;
		var variables = this.variable_regexp.exec(semantic_as_string);
		while (variables != null) {
			var variable = variables[1],
			remapped_variable_name = "";
			
			if(IS_DEBUG_ENABLED) console.debug("variables " + variable, semantic_as_string);//debug
			
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
							+ "]]");
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
						+ duplicate_helper[phraseList[i]] + "] = %" + (i + 1)
						+ "; ";
		}
		result += "var " + this.variable_prefix + "phrase = %%; " + utterance_name
				+ "_temp['phrase']=" + this.variable_prefix + "phrase; "
				+ utterance_name + "_temp['semantic'] = " + semantic_as_string
				+ "; " + this.variable_prefix + utterance_name + "["
				+ this.variable_prefix + "phrase] = " + utterance_name + "_temp; "
				+ this.variable_prefix + "result = " + utterance_name + "_temp; *]";
		return result;
	}
};


return jsccGen;

});