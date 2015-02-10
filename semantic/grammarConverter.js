/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */



/**
* @module mmir.semantic
* 
*/

/**
* The GrammarConverter object initializes the grammar for the voice recognition.
* 
* @class GrammarConverter
* @constructor
* @category core
* 
* @requires mmir.CommonUtils.isArray
* @requires jQuery.ajax
*/
define(['commonUtils', 'jquery'], function(commonUtils, $){

/**
 * @class GrammarConverter
 */
var GrammarConverter = function(){
	
//	this.THE_INTERNAL_GRAMMAR_CONVERTER_INSTANCE_NAME = "theGrammarConverterInstance";
//	this.grammar_tokens = "/~ --- Token definitions --- ~/\n\n/~ Characters to be ignored ~/\n!   ' |\\t' ;\n\n/~ Non-associative tokens ~/\n";
//	this.grammar_utterances = "";
//	this.grammar_phrases = "phrases:";
//	this.token_variables = "[*\n  var " + this.variable_prefix
//			+ "result = '';\n";
//	this.tokens_array = new Array();
	
	this.variable_prefix = "_$";
	this.variable_regexp = /"(_\$[^\"]*)"/igm;// /"_$([^\"]*)/igm;
	
	//regular expression for detecting encoded chars (see mask/unmask functions)
	this.enc_regexp_str = "~~([0-9|A-F|a-f]{4})~~";

	this.jscc_grammar_definition = "";
	this.js_grammar_definition = "";
	this.json_grammar_definition = null;
	this.stop_words_regexp;
	
	//default setting for masking value Strings in JSON values (see maskJSON() / unmaskJSON)
	this.maskValues = true;
	//default setting for masking property-name Strings in JSON values (see maskJSON() / unmaskJSON)
	// WARNING: this is actually EXPERIMENTAL; it should be set to false, since JS/CC may not be able to handle masked ID names...
	this.maskNames = false;
	//default setting for loading JSON files:
	// if set to true, old-style umlauts encodings (e.g. __oe__) will converted after loading the file
	// Enable this, if you need to use old-style encoded grammars ... still, the better option would
	//  be to convert the old-style grammar (i.e. use un-encoded umlauts in the JSON grammar file).
	this.convertOldFormat = false;
	

	//alternative reg-exp for stop-words (a different method for detecting/removing stopwords must be used!)
	this.stop_words_regexp_alt;
	
};

GrammarConverter.prototype.loadGrammar = function(successCallback, errorCallback, grammarUrl, doLoadSynchronously){
	var self = this;
	var success = function(data, status, xhr){
		
		//DISABLED: old-style masking for umlauts:
//		data = self.recodeJSON(data, self.encodeUmlauts);
		
		//if auto-upgrading is enabled:
		//   decode old-style umlaut masking before continuing
		if(self.convertOldFormat){
			data = self.recodeJSON(data, self.decodeUmlauts);
		}
		
		self.json_grammar_definition = data;
		
		if (typeof successCallback == "function") {
			successCallback.call(this, self, xhr);
		}
	};
	var error = function(xhr, status, data){
		alert("failed to load the grammar! error: "+ JSON.stringify(data));
		if (typeof errorCallback == "function") {
			errorCallback.call(this, self);
		}
	};
	this.loadResource(success, error, grammarUrl, doLoadSynchronously);
};

GrammarConverter.prototype.loadResource = function(successCallback, errorCallback, resourceUrl, doLoadSynchronously){

	var theUrl = resourceUrl;
	if(!theUrl){
		console.error('GrammarConverter.loadResource: missing URL!');
		if(errorCallback){
			errorCallback.call(this, this);
		}
		return;///////////////// EARLY EXIT //////////////////////
	}
	
	var isLoadAsync = false;
	if(typeof doLoadSynchronously !== 'undefined' && doLoadSynchronously === false){
		isLoadAsync = true;
	}
	
	$.ajax({
		async: isLoadAsync,
		dataType: 'json',
		url:theUrl,
		success: successCallback,
		error: errorCallback
	});
};

GrammarConverter.prototype.setStopWords = function(stopWordArray){
	
	if(!this.json_grammar_definition){
		this.json_grammar_definition = {};
	}
	
	this.json_grammar_definition.stop_word = this.maskJSON(stopWordArray);
	
	this.parseStopWords();
	this.parseStopWords_alt();
	
	//use unmask-function in order to ensure masking/unmasking is reversible
	//  (or in case it is not: the error will be held in property stop_word)
	this.json_grammar_definition.stop_word = this.unmaskJSON(this.json_grammar_definition.stop_word);
};

GrammarConverter.prototype.getStopWords = function(){
	if(!this.json_grammar_definition){
		return null;
	}
	return this.json_grammar_definition.stop_word;
};

/**
 * HELPER creates a copy of the stopword list and encodes all non-ASCII chars to their unicode
 *        representation (e.g. for save storage of stringified stopword list, even if file-encoding
 *        does not support non-ASCII letters).
 * 
 * @returns {Array<String>} a copy of the stopword list, from the current JSON grammar
 * 							(or empty list, if no grammar is present)
 */
GrammarConverter.prototype.getEncodedStopwords = function(){
	var list = this.getStopWords();
	if(!list){
		return [];
	}
	
	//use copy, since recoding works in-place (we do not want to modify the stored stopword list here)
	list = list.slice(0, list.length);
	
	//store stopwords with their Unicode representation (only for non-ASCII chars)
	return this.recodeJSON(
			list, this.maskAsUnicode
	);
};

//this is the original / main implementation for creating the RegExp for stopword removal
GrammarConverter.prototype.parseStopWords = function(){

	//create RegExp for stop words:
	var json_stop_words = this.json_grammar_definition.stop_word;
	var size = json_stop_words.length;
	var stop_words = "";
	
	//FIX for encoded chars: if a word begins or ends with an encoded char, \b cannot detect the word's boundaries
	//	-> FIX if we encounter such words, create a separate RegExpr that uses 
	//         whitespaces & START-/END-expression for detecting word-boundaries, i.e. something like: (\s|^)(~~ ... words ... ~~)(\s|$)
	//
	//  NOTE: the word-boundaries expression \b seems to have no effect in case of non-ASCII chars in general
	//        (e.g. for Japanese characters / words)
	//        .... so we would need to use this alternative mechanism (e.g. using whitespaces & START-/END-expr.) 
	//        even if these characters were not encoded! 
	var encStartTester = new RegExp("^" + this.enc_regexp_str      ,"gm");
	var encEndTester   = new RegExp(      this.enc_regexp_str + "$","gm");
	var enc_stop_words = "";
	var isEncWord = function(str){
		return encStartTester.test(str) || encEndTester.test(str); 
	};
	
	
	if(size > 0){
		
		//... then the RegExp matches each stopword:
		for(var index=0; index < size ; ++index){
			var stop_word = json_stop_words[index];
			
			//special treatment for word that begin/end with encoded chars:
			if(isEncWord(stop_word)){
				if(enc_stop_words.length === 0){
					enc_stop_words = "(\\s|^)(";
				}
				else {
					enc_stop_words += "|";
				}
				
				enc_stop_words += stop_word;
				
				continue;
			}
			
			//... for "normal" stopwords:
			
			if (stop_words.length > 0){
				stop_words +=	"|";    //... if there is already a previous stopword-entry: do add OR-matching ...
			}
	
			stop_words +=	stop_word;  //... add the stopword "stop_word"
		}
	}
	
	if(stop_words.length > 0){
		
		stop_words = 
				 "\\b("             //starting at a word-boundary (-> ignore within-word matches)
			   
			+ stop_words 
			   
			   + ")"
		       + "\\b"	            //... ending with a word-boundary -> avoid "cutting out" matching partial strings
	                                //    e.g. without \b: '(in)\s?' would match (and cut out all matches) within "winning" -> "wng"
		       
		       + "\\s?";	        //... and optionally: one white-character that follows the stopword
	}
	else {
		//for empty stopword definition: match empty string
		//  (basically: remove nothing)
		stop_words += '^$';
	}
	this.stop_words_regexp = new RegExp(stop_words,"igm");	//RegExp options: 
															// ignore-case (i),
															// match globally i.e. all occurrences in the String (g), 
															// do not stop at line breaks (m)
	
	
	//only create ReExp for special stopwords, if we actually have at least 1 of those:
	//NOTE for replacement, we need to use a space-char (i.e. replace these with spaces, not empty strings: str.replace(..., ' '); )
	if(enc_stop_words.length > 0){
			enc_stop_words += ")(\\s|$)";
			this.stop_words_regexp_enc = new RegExp(enc_stop_words,"igm");	
	}

	//DISABLED: only create these if necessary (i.e. if getStopWordsRegExpr_alt() is called)
//	//initialize the alternative version / regular expression for stopwords:
//	this.parseStopWords_alt();
};

//initialize alternative version / regular expression for stopwords:
GrammarConverter.prototype.parseStopWords_alt = function(){
	
	var json_stop_words = this.json_grammar_definition.stop_word;
	var size = json_stop_words.length;
	var stop_words = "";
	
	if(size > 0){
		stop_words += "(";

		for(var index=0; index < size ; ++index){
			var stop_word = json_stop_words[index];
			if (index > 0) {
				stop_words += "|";
			}
			//create match pattern for: (1) stopword enclosed in spaces, (2) the stopword at 'line end' preceded by a space, (3) the stopword at 'line start' followed by a space
			stop_words += " " + stop_word + " | " + stop_word + "$|^" + stop_word
					+ " ";
		}
		
		stop_words += ")";
	}
	else {
		//for empty stopword definition: match empty string
		//  (basically: remove nothing)
		stop_words += '^$';
	}
	this.stop_words_regexp_alt = new RegExp(stop_words,"igm");
};

GrammarConverter.prototype.getStopWordsRegExpr = function(){
	if(!this.stop_words_regexp){
		this.parseStopWords();
	}
	return this.stop_words_regexp;
};

/**
 * FIX for stopwords that start or end with encoded chars (i.e. non-ASCII chars)
 * 
 * This RegExp may be NULL/undefined, if no stopwords exist, that begin/end with encoded chars
 * i.e. you need to check for NULL, before trying to use this RegExpr.
 * 
 *  Usage:
 *  @example 
 *  
 *  //remove normal stopwords:
 *  var removedStopwordsStr  = someStr.replace( gc.getStopWordsRegExpr(), '');
 *  
 *  
 *  var removedStopwordsStr2 = removedStopwordsStr;
 *  if(gc.getStopWordsEncRegExpr()){
 *  	//NOTE replace stopwords with spaces (not with empty String as above, ie. with "normal" stopwords) 
 *  	removedStopwordsStr2 = gc.getStopWordsEncRegExpr().replace( gc.getStopWordsEncRegExpr(), ' ');
 *  }
 */
GrammarConverter.prototype.getStopWordsEncRegExpr = function(){
	if(!this.stop_words_regexp){
		this.parseStopWords();
	}
	return this.stop_words_regexp_enc;
};

//alternative version / regular expression for stopwords:
GrammarConverter.prototype.getStopWordsRegExpr_alt = function(){
	if(!this.stop_words_regexp_alt){
		this.parseStopWords_alt();
	}
	return this.stop_words_regexp_alt;
};

/**
 * Get JS/CC grammar definition text.
 * 
 * This is the "source code" input for the JS/CC compiler.
 * 
 * @returns {String} the JS/CC grammar definition
 */
GrammarConverter.prototype.getJSCCGrammar = function(){
	return  this.jscc_grammar_definition;
};

GrammarConverter.prototype.setJSCCGrammar = function(rawGrammarSyntax){
	this.jscc_grammar_definition = rawGrammarSyntax;
};

/**
 * Get the compiled JavaScript grammar source code.
 * 
 * This is the output of the JS/CC compiler (with additional
 * JavaScript "framing" in SemanticInterpreter.createGrammar).
 * 
 * This needs to be eval'ed before it can be executed (eval will add
 * the corresponding executable grammar to SemanticInterpreter).
 * 
 * @returns {String} the compiled, JavaScript grammar source code
 */
GrammarConverter.prototype.getJSGrammar = function(){
	return  this.js_grammar_definition;
};

GrammarConverter.prototype.setJSGrammar = function(src_code){
	 this.js_grammar_definition = src_code;
};

//GrammarConverter.prototype.parseTokens = function(){
//	var self = this;
//	var json_tokens =  this.json_grammar_definition.tokens;
//	
//	for(token_name in json_tokens){
//		
//		var words = json_tokens[token_name];
//		
//		self.token_variables += "  var " + self.variable_prefix
//				+ token_name.toLowerCase() + " = {};\n";
//		
//		var grammar_token ="    '";
//		
//		for(var i=0, size = words.length; i < size ; ++i){
//			if(i > 0){
//				grammar_token += "|";
//			}
//			grammar_token += words[i];
//		}
//		
//		grammar_token += "'    " + token_name + " [* " + self.variable_prefix
//				+ token_name.toLowerCase() + "[%match] = %match; *];\n";
//		
//		self.grammar_tokens += grammar_token;
//	}
//};
//
//GrammarConverter.prototype.parseUtterances = function(){
//	var self = this;
//	var utt_index = 0;
//	var json_utterances =  this.json_grammar_definition.utterances;
//
//	for(utterance_name in json_utterances){
//		var utterance_def = json_utterances[utterance_name];
//		if(utt_index > 0){
//			self.grammar_phrases += "\n\t|";
//		}
//		utt_index++;
//		self.doParseUtterance(utterance_name, utterance_def);
//	}
//};
//
//GrammarConverter.prototype.doParseUtterance = function(utterance_name, utterance_def){
//	var grammar_utterance = utterance_name + ":";
//	var self = this; 
//	self.token_variables += "  var " + self.variable_prefix
//			+ utterance_name.toLowerCase() + " = {};\n";
//	//self.grammar_phrases += utterance_name + "  " +  self.doCreateSemanticInterpretationForUtterance(utterance_name, utterance_def);
//	self.grammar_phrases += utterance_name + "  " ;
//	var phrases = utterance_def.phrases;
//	var semantic  = self.doCreateSemanticInterpretationForUtterance(utterance_name, utterance_def);
//	
//	for(var index=0,size=phrases.length; index < size; ++index){
//		if(index > 0){
//			grammar_utterance += "\n|";
//		}
//		var phrase = phrases[index];
//		var semantic_interpretation = self.doCreateSemanticInterpretationForPhrase(
//				utterance_name.toLowerCase(), utterance_def, phrase, semantic
//		);
//		grammar_utterance += phrase + semantic_interpretation;
//	}
//	self.grammar_utterances += grammar_utterance + ";\n\n";
//};
//
//
//GrammarConverter.prototype.doCreateSemanticInterpretationForUtterance = function(utterance_name, utterance_def){
//	var semantic = utterance_def.semantic,
//	variable_index, variable_name;
//	
//	if(logger.isDebug()) logger.debug('doCreateSemanticInterpretationForUtterance: '+semantic);//debug
//	
//	var semantic_as_string = JSON.stringify(semantic);
//	if( semantic_as_string != null){
//	this.variable_regexp.lastIndex = 0;
//	var variables = this.variable_regexp.exec(semantic_as_string);
//	while (variables != null) {
//		var variable = variables[1],
//		remapped_variable_name = "";
//		
//		if(logger.isDebug()) logger.debug("variables " + variable, semantic_as_string);//debug
//		
//		variable_index = /\[(\d+)\]/.exec(variable);
//		variable_name = new RegExp('_\\$([a-zA-Z_][a-zA-Z0-9_\\-]*)').exec(variable)[1];
////		variableObj = /_\$([a-zA-Z_][a-zA-Z0-9_\-]*)(\[(\d+)\])?(\["semantic"\]|\['semantic'\]|\.semantic)?/.exec(variable);
////		variableObj = /_\$([a-zA-Z_][a-zA-Z0-9_\-]*)(\[(\d+)\])?((\[(("(.*?[^\\])")|('(.*?[^\\])'))\])|(\.(\w+)))?/.exec(variable);
////"_$NAME[INDEX]['FIELD']":  _$NAME                  [ INDEX ]        [" FIELD "]  | [' FIELD ']      |   .FIELD
//		if (variable_index == null) {
//			remapped_variable_name = variable;
//		} else {
//				remapped_variable_name = variable.replace(
//						  '[' + variable_index[1] + ']'
//						, "["
//							+ utterance_name.toLowerCase() + "_temp['phrases']['"
//							+ variable_name.toLowerCase() + "']["
//							+ variable_index[1]
//						+ "]]");
//				//TODO replace try/catch with safe_acc function
//				//     PROBLEM: currently, the format for variable-access is not well defined
//				//              -> in case of accessing the "semantic" field for a variable reference of another Utterance
//				//                 we would need another safe_acc call 
//				//				   ... i.e. need to parse expression for this, but since the format is not well defined
//				//				   we cannot say, for what exactly we should parse...
//				//                 NORMAL VAR EXPR: 		_$a_normal_token[0]
//				//                 ACCESS TO SEMANTICS: 	_$other_utterance[0]['semantic']
//				//                                      but this could also be expressed e.g. as _$other_utterance[0].semantic
//				//                                      ...
////				remapped_variable_name = variable.replace(
////						  '[' + variable_index[1] + ']'
////						, "[safe_acc("
////							+ utterance_name.toLowerCase() + "_temp, 'phrases', '"
////							+ variable_name.toLowerCase() + "', "
////							+ variable_index[1] 
////							+ ")]"
////						);
//		}
//		semantic_as_string = semantic_as_string.replace(
//				variables[0],
//				" function(){try{return " + remapped_variable_name
//					+ ";} catch(e){return void(0);}}() "
////				"' + " + remapped_variable_name + " + '"//TODO replace try/catch with safe_acc function
//		);
//		variables =  this.variable_regexp.exec(semantic_as_string);
//	}
//	}
//	return semantic_as_string;
//};
//
//GrammarConverter.prototype.doCreateSemanticInterpretationForPhrase = function(utterance_name, utterance_def, phrase, semantic_as_string){
//	var splitted_phrase = phrase.split(/\s+/),
//	length = splitted_phrase.length,
//	duplicate_helper = {};
//	
//	var result = " [* %% = ";
//	var i = 0;
//	while (i < length){
//		i++;
//		result += "%"+i;
//		if(i < length){
//			result += " + ' ' + ";
//		}
//	}
//	result += "; var "+utterance_name+"_temp = {}; "+utterance_name+"_temp['phrases'] = {};";
//	for (i = 0; i < length; i += 1) {
//		if (typeof(duplicate_helper[splitted_phrase[i]]) == "undefined") {
//			duplicate_helper[splitted_phrase[i]] = 0;
//			result += utterance_name+"_temp['phrases']['"+splitted_phrase[i].toLowerCase()+"'] = [];";
//		} else {
//			duplicate_helper[splitted_phrase[i]] += 1;
//		}
//		result += utterance_name + "_temp['phrases']['"
//					+ splitted_phrase[i].toLowerCase() + "']["
//					+ duplicate_helper[splitted_phrase[i]] + "] = %" + (i + 1)
//					+ "; ";
//	}
//	result += "var " + this.variable_prefix + "phrase = %%; " + utterance_name
//			+ "_temp['phrase']=" + this.variable_prefix + "phrase; "
//			+ utterance_name + "_temp['semantic'] = " + semantic_as_string
//			+ "; " + this.variable_prefix + utterance_name + "["
//			+ this.variable_prefix + "phrase] = " + utterance_name + "_temp; "
//			+ this.variable_prefix + "result = " + utterance_name + "_temp; *]";
//	return result;
//};

/**
 * Set the executable grammar function.
 * 
 * The grammar function takes 1 String argument: the text that should be parsed.
 * The returned result depends on the JSON definition of the grammar.
 * 
 * @param {Function} func
 * 			the executable grammar function: <code>func(string) : object</code>
 * 
 * @see #exectueGrammar
 */
GrammarConverter.prototype.setGrammarFunction = function(func){
	this.executeGrammar = func;
};

/**
 * Execute the grammar.
 * 
 * NOTE: do not use directly, but {@link mmir.SemanticInterpreter.getASRSemantic} instead,
 * 		since that function applies some pre- and post-processing to the text (stopword removal
 * 		en-/decoding of special characters etc.).
 * 
 * @param {String} text
 * 			the text String that should be parse.
 * @returns {Object}
 * 			the result of the grammar execution:
 * 			<code>{phrase: STRING, phrases: OBJECT, semantic: OBJECT}</code>
 * 
 * 			The property <code>phrase</code> contains the <code>text</code> which was matched (with removed stopwords).
 * 
 * 			The property <code>phrases</code> contains the matched <tt>TOKENS</tt> and <tt>UTTERANCES</tt> from
 * 			the JSON definition of the grammar as properties as arrays
 *          (e.g. for 1 matched TOKEN "token": <code>{token: ["the matched text"]}</code>).
 * 
 *          The returned property <code>semantic</code> depends on the JSON definition of the grammar.
 *          
 */
GrammarConverter.prototype.executeGrammar = function(text){
	console.warn('GrammarConverter.executeGrammar: this is only a stub. No grammar implementation set yet...');
};

/**
 * Masks unicoded characters strings.
 * 
 * Unicode characters are mask by replacing them with
 * <code>~~XXXX~~</code>
 * where <code>XXXX</code> is the four digit unicode HEX number.
 * 
 * <p>
 * NOTE that this function is <em>stable</em> with regard to
 * multiple executions:
 * 
 * If the function is invoked on the returned String again, the
 * returned String will be the same / unchanged, i.e.
 * maskings (i.e. "~~XXXX~~") will not be masked again.
 * </p>
 * <p>
 * NOTE: currently, the masking pattern cannot be escaped,
 * 		 i.e. if the original String contains a substring
 * 		 that matches the masking pattern, it cannot
 * 		 be escaped, so that the unmask-function
 * 		 will leave it untouched.
 * </p>
 * 
 * @param {String} str
 * 				the String to process
 * @param {String} [prefix] OPTIONAL
 * 				an alternative prefix used for masking, i.e instead of <code>~~</code>
 * 				(ignored, if argument has other type than <code>string</code>)
 * @param {String} [postfix] OPTIONAL
 * 				an alternative postfix used for masking, i.e instead of <code>~~</code>
 * 				(ignored, if argument has other type than <code>string</code>)
 * @returns {String} 
 * 				the masked string
 */
GrammarConverter.prototype.maskString = function (str, prefix, postfix) {
	var i, s, ch, peek, result,
		next, endline, push, mask,
		spaces, source = str;
	
	var ESC_START = typeof prefix  === 'string'? prefix  : '~~';
	var ESC_END   = typeof postfix === 'string'? postfix : '~~';
	
	// Stash the next character and advance the pointer
	next = function () {
		peek = source.charAt(i);
		i += 1;
	};
	
	// Start a new "line" of output, to be joined later by <br />
	endline = function () {
		result.push('\n');
	};
	
	function mask(theChar) {
		
		result.push(ESC_START);
		
		var theUnicode = theChar.charCodeAt(0).toString(16).toUpperCase();
		var j = theUnicode.length;
		while (j < 4) {
//			theUnicode = '0' + theUnicode;
			result.push('0');
			++j;
		}
		result.push(theUnicode);

		result.push(ESC_END);
	};
	
	// Push a character or its entity onto the current line
	push = function () {
		
		//handle NEWLINE:
		if (ch === '\r' || ch === '\n') {
			if (ch === '\r') {
				if (peek === '\n') {
					next();
				}
				endline();
			}
			if (ch === '\n') {
				if (peek === '\r') {
					next();
				}
				endline();
			}
		}
		//handle tabs
		else if (ch === '\t') {
			result.push(ch);
		}
		//handle NON-ASCII
		else if (ch < ' ' || ch > '~') {
			mask( ch );
		} 
		//handle normal chars
		else {
			result.push(ch);
		}
	};
	
	
	result = [];

	i = 0;
	next();
	while (i <= source.length) { // less than or equal, because i is always one ahead
		ch = peek;
		next();
		
		push();
	}
	
	return result.join('');
};

/**
 * HELPER uses #maskString for encoding non-ASCII chars to their Unicode representation,
 * i.e. <code>\uXXXX</code> where XXXX is the Unicode HEX number.
 * 
 * 
 * SHORTCUT for calling <code>maskString(str, '\\u', '')</code>.
 * 
 * @example
 * //for Japanese "下さい" ("please")
 * maskAsUnicode("下さい") -> "\u4E0B\u3055\u3044"
 * 
 * //... and using default masking:
 * maskString("下さい") -> "~~4E0B~~~~3055~~~~3044~~"
 */
GrammarConverter.prototype.maskAsUnicode = function (str) {
	return this.maskString(str, '\\u', '');
};

/**
 * Unmasks <i>masked unicoded characters</i> in a string.
 * 
 * Masked unicode characters are assumed to have the pattern:
 * <code>~~XXXX~~</code>
 * where <code>XXXX</code> is the four digit unicode HEX number.
 * 
 * <p>
 * NOTE that this function is <em>stable</em> with regard to
 * multiple executions, <b>IF</b> the original String <tt>str</tt> did not
 * contain a sub-string that conforms to the encoding pattern 
 * (see remark for {@link #maskString}):
 * 
 * If the function is invoked on the returned String again, the
 * returned String will be the same, i.e. unchanged. 
 * </p>
 * 
 * @param {String} str
 * @param {RegExp} [detector] OPTIONAL
 * 				an alternative detector-RegExp:
 * 				the RegExp must conatin at least one grouping which detects a unicode number (HEX),
 * 				e.g. default detector is <code>~~([0-9|A-F|a-f]{4})~~</code> (note the grouping
 * 				for detecting a 4-digit HEX number within the brackets).
 * @returns {String} the unmasked string
 */
GrammarConverter.prototype.unmaskString = function (str, detector) {
	var match, source = str, result = [], pos = 0, i, len = str.length;
	
	//RegExpr for: ~~XXXX~~
	// where XXXX is the unicode HEX number: ~~([0-9|A-F|a-f]{4})~~
	var REGEXPR_ESC = detector? detector : new RegExp( this.enc_regexp_str, "igm");
	
	while(match = REGEXPR_ESC.exec(source)){
		i =  match.index;
		//add previous:
		if(i > pos){
			result.push(source.substring(pos, i));
		}
		
		//add matched ESC as UNICODE:
		result.push(String.fromCharCode(  parseInt(match[1], 16) ));
		
		//update position:
		pos = i + match[0].length;
	}
	
	if(pos < len){
		result.push(source.substring(pos));
	}

	return result.join('');
};


GrammarConverter.prototype.maskJSON = function (json, isMaskValues, isMaskNames) {
	return this.recodeJSON(json, this.maskString, isMaskValues, isMaskNames);
};

GrammarConverter.prototype.unmaskJSON = function (json, isMaskValues, isMaskNames) {
	return this.recodeJSON(json, this.unmaskString, isMaskValues, isMaskNames);
};

/**
 * Recodes Strings of a JSON-like object.
 * 
 * @param {Object} json 
 * 					the JSON-like object (i.e. PlainObject)
 * 
 * @param {Function} recodeFunc
 * 								the "recoding" function for modifying String values:
 * 								 must accecpt a String argument and return a String
 * 									<code>String recodeFunc(String)</code>.
 * 								The <tt></tt> function is invoked in context of the GrammarConverter object.
 * 								Example: this.maskString().
 * 								See {@link #maskString}.k
 * 
 * @param {Boolean} [isMaskValues] OPTIONAL
 * 								 if true, the object's property String values will be processed
 * 								 NOTE: in case this parameter is specified, then <code>recodeFunc</code> must
 * 									   also be specified!
 * 								 DEFAULT: uses property {@link #maskValues}
 * @param {Boolean} [isMaskNames]  OPTIONAL
 * 								 if true, the property names will be processed
 * 								 NOTE: in case this parameter is specified, then <code>recodeFunc</code> and
 * 									   <code>isMaskValues</code> must also be specified!
 * 								 DEFAULT: uses property {@link #maskNames}
 * 
 * @returns {Object} the recoded JSON object
 * 
 * @requires {@link mmir.CommonUtils#isArray} or {@link Array#isArray}
 */
GrammarConverter.prototype.recodeJSON = (function () {//<- NOTE this is only the initializer (i.e. see returned function below)
	
	var isArray;
	if(typeof commonUtils !== 'undefined'){
		isArray = commonUtils.isArray;//FIXME this requires ArrayExtension.js !!!
	} 
	else { 
		isArray = Array.isArray;
	}
	
	//recursive processing for an object
	//returns: the processed object
	var processJSON = function(obj, recodeFunc, isMaskValues, isMaskNames){
		
		//different treatments for: STRING, ARRAY, OBJECT types (and 'REST' type, i.e. all ohters)
		if(typeof obj === 'string' && isMaskValues){
			//STRING: encode the string
			return recodeFunc.call(this, obj);
		}
		else if( isArray(obj) ) {
			//ARRAY: process all entries:
			for(var i=0, size = obj.length; i < size; ++i){
				obj[i] = processJSON.call(this, obj[i], recodeFunc, isMaskValues, isMaskNames);
			}
			
			return obj;
		}
		else if(typeof obj === 'object') {
			//OBJECT: process all the object's properties (but only, if they are not inherited)
			for(var p in obj){
				if(obj.hasOwnProperty(p)){
					
					obj[p] = processJSON.call(this, obj[p], recodeFunc, isMaskValues, isMaskNames);
					
					//if the property-name should also be encoded:
					if(typeof p === 'string' && isMaskNames){
						
						var masked = recodeFunc.call(this, p);
						if(masked !== p){
							obj[masked] = obj[p];
							delete obj[p];
						}
					}
				}
			}
			return obj;
		}
		else {
			return obj;
		}
	};
	
	return function (json, recodeFunc, isMaskValues, isMaskNames){
		//evalate arguments:
		if(typeof isMaskValues === 'undefined'){
			isMaskValues = this.maskValues;
		}
		if(typeof isMaskNames === 'undefined'){
			isMaskNames = this.maskNames;
		}
		
		return processJSON.call(this, json, recodeFunc, isMaskValues, isMaskNames);
	};
	
})();

/**
 * 
 * @deprecated this is used for the old-style encoding / decoding for umlauts (now masking for ALL unicode chars is used!)
 * 
 * @param {String|Object} target
 * 							the String for wich all contained umlauts should be replaced with an encoded version.
 * 							If this parameter is not a String, it will be converted using <code>JSON.stringify()</code>
 * 							and the resulting String will be processed (may lead to errors if umlauts occur in "strange"
 * 							places within the stringified object).
 * @param {Boolean} [doAlsoEncodeUpperCase] OPTIONAL
 * 							if <code>true</code>, then upper-case umlauts will be encoded, too
 * 							DEFAULT: <code>false</code> (i.e. no encoding for upper-case umlauts)
 * 		
 * @returns {String|Object}
 * 				the String with encoded umlauts.
 * 				If the input argument <code>target</code> was an Object, the return value
 * 				will also be an Object, for which the processing stringified Object is converted
 * 				back using <code>JSON.parse()</code> (may lead to errors if umlauts occur in "strange"
 * 				places within the stringified object).
 */
GrammarConverter.prototype.encodeUmlauts = function(target, doAlsoEncodeUpperCase){
	var isString = typeof target === 'string';
	var str;
	if(isString){
		str = target;
	}
	else {
		str = JSON.stringify(target);
	}
	
	//Java-Code:
	//	data = data.replaceAll("\u00E4", "__ae__");//HTML: &#228;
	//	data = data.replaceAll("\u00FC", "__ue__");//HTML: &#252;
	//	data = data.replaceAll("\u00F6", "__oe__");//HTML: &#246;
	//	data = data.replaceAll("\u00DF", "__ss__");//HTML: &#223;

	//	data = data.replaceAll("\u00C4", "__Ae__");//HTML: &#196;
	//	data = data.replaceAll("\u00DC", "__Ue__");//HTML: &#220;
	//	data = data.replaceAll("\u00D6", "__Oe__");//HTML: &#214;
	str = str.replace(/\u00F6/g,'__oe__').replace(/\u00E4/g,'__ae__').replace(/\u00FC/g,'__ue__').replace(/\u00DF/g,'__ss__');
	if(doAlsoEncodeUpperCase){
    	str = str.replace(/\u00D6/g,'__Oe__').replace(/\u00C4/g,'__Ae__').replace(/\u00DC/g,'__Ue__');
	}
	
	if(isString){
		return str;
	}
	else {
		return JSON.parse(str);
	}
};

/**
 * 
 * @deprecated this is used for the old-style encoding / decoding for umlauts (now masking for ALL unicode chars is used!)
 * 
 * @param {String|Object} target
 * 							the String for wich all contained umlauts-encoding should be replaced with the original umlauts.
 * 							If this parameter is not a String, it will be converted using <code>JSON.stringify()</code>
 * 							and the resulting String will be processed (may lead to errors if umlauts occur in "strange"
 * 							places within the stringified object).
 * @param {Boolean} [doAlsoEncodeUpperCase] OPTIONAL
 * 							if <code>true</code>, then upper-case umlauts-encodings will be decoded, too
 * 							DEFAULT: <code>false</code> (i.e. no decoding for upper-case umlauts-encodings)
 * 		
 * @returns {String|Object}
 * 				the String with decoded umlauts-encodings (i.e. with the "original" umlauts).
 * 				If the input argument <code>target</code> was an Object, the return value
 * 				will also be an Object, for which the processing stringified Object is converted
 * 				back using <code>JSON.parse()</code> (may lead to errors if umlauts occur in "strange"
 * 				places within the stringified object).
 */
GrammarConverter.prototype.decodeUmlauts = function(target, doAlsoDecodeUpperCase){
	var isString = typeof target === 'string';
	var str;
	if(isString){
		str = target;
	}
	else {
		str = JSON.stringify(target);
	}
	
	str = str.replace(/__oe__/g,'\u00F6').replace(/__ae__/g,'\u00E4').replace(/__ue__/g,'\u00FC').replace(/__ss__/g,'\u00DF');
	if(doAlsoDecodeUpperCase){
    	str = str.replace(/__Oe__/g,'\u00D6').replace(/__Ae__/g,'\u00C4').replace(/__Ue__/g,'\u00DC');
	}
	
	if(isString){
		return str;
	}
	else {
		return JSON.parse(str);
	}
};

return GrammarConverter;

});//END: define(..., function(){