define(function(){
	/**
	 * BaseGenerator for common methods, resources etc. for parsing JSON grammars
	 * and generating (engine-specific) grammar definitions, that are then compiled
	 * by a grammer-engine into an executable grammar.
	 *
	 * The BaseGenerator is used/extended in the specific
	 * <code>*Generator.compileGrammar()</code> implementations
	 *
	 * @class
	 * @constant
	 * @public
	 * @name BaseGenerator
	 * @memberOf mmir.env.grammar
	 *
	 * @param {mmir.Logger} logger the logger instance of the specific engine/generator
	 * @param {String} engineId the engine's ID, e.g "jscc"
	 *
	 * @see mmir.env.grammar.JsccGenerator
	 * @see mmir.env.grammar.JisonGenerator
	 * @see mmir.env.grammar.PegJsGenerator
	 */
return function BaseGenerator(logger, engineId) {
	var gen = {

		engineId: engineId,

		//TO impl. by sub-classes:

		/**
		 * engine's syntax: separator for phrases (= rule)
		 *
		 * @memberOf BaseGenerator
		 * @example
		 * entryRule: rule1 | rule2 | rule3 ...
		 * // -> "|"
		 */
		phrase_separator: "|",
		/**
		 * engine's syntax: (internal) variable for accessing the matched phrase (= rule)
		 *
		 * @memberOf BaseGenerator
		 * @example
		 * rule:  TOKEN1 rule2 TOKEN3 [* %% = ...
		 * // ->"%%"
		 */
		phrase_match_var: "%%",
		/**
		 * engine's syntax:
		 * generate the utterance (= rule) declaration/heading according to the engines
		 *
		 * @param {String} utteranceName
		 * 				the name of the utterance that will be declared
		 * @returns {String} the utterance (=rule) declaration heading
		 *
		 * @memberOf BaseGenerator
		 * @example
		 * rule1:  TOKEN1 rule2 TOKEN3
		 * // for utteranceName "rule1" -> "rule1:  "
		 */
		toUtteranceDeclarationHead: function(utteranceName){ throw Error('not implemented');},//impl. abstract
		/**
		 * engine's syntax:
		 * generate the utterance's phrase-definition incl. the processing for the phrases' semantic interpretation
		 *
		 * NOTE:
		 * some implementations may include the phrase definition in semanticInterpretation
		 * e.g. in case the phrase's tokens/utterances need to be referenced by local variables for processing the
		 * semantic interpretation.<br/>
		 * In these cases, <code>toUtteranceDeclarationPhrase(..)</code> may only return
		 * <code>semanticInterpretation</code>, since it already includes <code>phrase</code>.
		 *
		 * @param {String} phrase
		 * 				the phrase definition
		 * @param {String} semanticInterpretation
		 * 				the code for processing the phrases' semantic interpretation
		 * @returns {String} the (concatenated) phrase-definition and processing for the phrases' semantic interpretation
		 *
		 * @memberOf BaseGenerator
		 * @example
		 * return phrase + semanticInterpretation;
		 */
		toUtteranceDeclarationPhrase: function(phrase, semanticInterpretation){ throw Error('not implemented');},//impl. abstract
		/**
		 * engine's syntax:
		 * for generating custom phrase-strings, e.g. adding local variables for referencing tokens/utterances in the phrases
		 * (and then processing them in the semantic interpretation code).
		 *
		 * Implementation may do nothing, if no custom phrase string is required for generating the engine's grammar definition
		 *
		 * @param {Number} i
		 * 				current index of the phrase
		 * @param {Array<String>} phraseList
		 * 				the phrase list
		 * @param {Array<String>} phraseBuffer
		 * 				the buffer for generated phrases (will be concated after processing all phrases)
		 *
		 * @memberOf BaseGenerator
		 * @see #toUtteranceDeclarationPhrase
		 * @example
		 * //simple example (jison):
		 * phraseBuffer.push(" " + phraseList[i]);
		 *
		 * //more intricate example (pegjs):
		 * if(i > 0){
		 *   phraseBuffer.push(" " + this._WHITESPACE_TOKEN_NAME + " ");
		 * }
		 * phraseBuffer.push(this._PARTIAL_MATCH_PREFIX + (i+1) + ":" + phraseList[i]);
		 */
		addPhraseMatchForInterpretion: function(i, phraseList, phraseBuffer){ throw Error('not implemented');},//impl. abstract
		/**
		 * engine's syntax:
		 * for generating the semantic-interpretation processing code for a phrase:
		 *  1. store current phrase match into (local/temporary) variable {@link #temp_phrase_match_var}
		 *  2. add the matched phrase (var) to array of field <code>.phrases</code> in {@link #tempPhrasesVarName}
		 *
		 * @param {Number} i
		 * 				current index of the phrase
		 * @param {String} tempPhrasesVarName
		 * 				name of the current utterance (to which the current phrase belongs)
		 * @param {Array<String>} phraseList
		 * 				the phrase list
		 * @param {Array<String>} semanticProcBuffer
		 * 				the buffer for generated semantic-interpretation processing code (will be concated after processing all phrases)
		 *
		 * @memberOf BaseGenerator
		 * @see #toUtteranceDeclarationPhrase
		 * @example
		 * var code = this.temp_phrase_match_var + " = " + this._PARTIAL_MATCH_PREFIX + (i+1) + ";"
		 *          + tempPhrasesVar + "['phrases'].push(" + this.temp_phrase_match_var + ");\n\t\t";
		 * semanticProcBuffer.push(code);
		 */
		addPartialPhraseInterpretion: function(i, tempPhrasesVarName, phraseList, semanticProcBuffer){ throw Error('not implemented');},//impl. abstract
		/**
		 * engine's syntax:
		 * for generating the complete phrase string incl. its semantic interpretation processing code
		 *
		 * @param {String} phraseMatchStr
		 * 				the (custom) phrase string as generated by <code>addPhraseMatchForInterpretion(..)</code>
		 * 				(may be empty if no custom phrase string was generated)
		 * @param {String} pharseMatchResult
		 * 				the phrase matching definition (internally generated)
		 * @param {String} semanticProcResult
		 * 				the (custom) phrase string as generated by <code>addPartialPhraseInterpretion(..)</code>
		 * @returns {String} the complete phrase string incl. its semantic interpretation processing code
		 *
		 * @see #temp_phrase_match_var
		 * @see #addPhraseMatchForInterpretion
		 * @see #addPartialPhraseInterpretion
		 * @see #toUtteranceDeclarationPhrase
		 *
		 * @example
		 * return phraseMatchStr + " %{\n\t   " + pharseMatchResult + "; " + semanticProcResult + "; \n\t%} ";
		 */
		toPhraseInterpretion: function(phraseMatchStr, pharseMatchResult, semanticProcResult){ throw Error('not implemented');},//impl. abstract

		/**
		 * NOTE: default implementation (may be overridden if needed)
		 *
 		 * engine's syntax:
 		 * the code for specifying the return-value of a phrase (= rule) match
 		 *
		 * @param {String} pharseMatchResultDef
		 * 				the phrase match code
		 * @return {String} code for getting index of match within the input string
		 *
		 * @see #phrase_match_var
		 * @example
		 * //example 1 (default implementation):
		 * return this.phrase_match_var  + " = {" + pharseMatchResultDef + "}";
		 * //example 2 (pegjs):
		 * return "var " + this.phrase_match_var  + " = {" + pharseMatchResultDef + "}";
		 */
		toPhraseMatchResultForInterpretion: function(pharseMatchResultDef){
			return this.phrase_match_var  + " = {" + pharseMatchResultDef + "}";
		},
		/**
		 * NOTE: default implementation (may be overridden if needed)
		 *
 		 * engine's syntax:
 		 * code for retrieving the index/location/offset of match within the input string
 		 *
		 * @return {String} code for getting index of match within the input string
		 *
		 * @see #helper_func_index
		 * @example
		 * // default implementation:
		 * return "_index("+ this._PARTIAL_MATCH_PREFIX +"1)";
		 */
		getPhraseMatchIndex: function(){
			return "_index("+ this._PARTIAL_MATCH_PREFIX +"1)";
		},

		//common grammar parsing & generation functions

		/**
		 * entry point for parsing JSON-grammar's utterances:
		 * generates (engine-specific) rules for the utterances, their phrases,
		 * and the corresponding semantic interpretation processing code.
		 */
		parseUtterances: function(){
			var self = this;
			var utt_index = 0;
			var json_utterances =  this.json_grammar_definition.utterances;

			for(var utterance_name in json_utterances){
				var utterance_def = json_utterances[utterance_name];
				if(utt_index > 0){
					self.grammar_phrases += '\n\t' + self.phrase_separator;
				}
				utt_index++;
				self.doParseUtterance(utterance_name, utterance_def);
			}
		},
		/**
		 * generates the (engine-specific) rule-body for one utterances, their phrases,
		 * and the corresponding semantic interpretation processing code.
		 *
		 * SIDE EFFECTS
		 *  * appends a "token variable" declaration code for the utterance to {@link #token_variables}
		 *  * appends generated rule-body for the utterance to {@link #grammar_utterances}
		 *
		 * @param {String} utterance_name the utterance name
		 * @param {UtteranceJson} utterance_def the JSON definition for the utterance
		 */
		doParseUtterance: function(utterance_name, utterance_def){

			var self = this;

			self.token_variables += "  var " + self.variable_prefix
					+ utterance_name.toLowerCase() + " = [];\n";


			var grammar_utterance = self.toUtteranceDeclarationHead(utterance_name);//impl. abstract
			self.grammar_phrases += utterance_name + "  " ;
			var phrases = utterance_def.phrases;
			var semantic  = self.doCreateSemanticInterpretationForUtterance(utterance_name, utterance_def);

			for(var index=0,size=phrases.length; index < size; ++index){
				if(index > 0){
					grammar_utterance += '\n  ' + self.phrase_separator;
				}
				var phrase = phrases[index];
				var semantic_interpretation = self.doCreateSemanticInterpretationForPhrase(
						utterance_name.toLowerCase(), phrase, semantic
				);
				grammar_utterance += self.toUtteranceDeclarationPhrase(phrase, semantic_interpretation);//impl. abstract
			}
			self.grammar_utterances += grammar_utterance + ";\n\n";
		},
		/**
		 * generates the (engine-specific) semantic interpretation processing code for an utterance.
		 *
		 * @param {String} utterance_name the utterance name
		 * @param {UtteranceJson} utterance_def the JSON definition for the utterance
		 *
		 * @returns {String} the code for the utterance's semantic interpretation processing
		 */
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

		/**
		 * generates the (engine-specific) semantic interpretation processing code for a phrase (of an utterance).
		 *
		 * @param {String} utterance_name the utterance name
		 * @param {String} phrase the phrase definition
		 * @param {String} semantic_as_string the result of {@link #doCreateSemanticInterpretationForUtterance} for the utterance
		 *
		 * @returns {String} the code for the phrases's semantic interpretation processing
		 */
		doCreateSemanticInterpretationForPhrase: function(utterance_name, phrase, semantic_as_string){
			var phraseList = phrase.split(/\s+/),
				length = phraseList.length;

			var phraseBuffer = [];
			var semanticProcBuffer = [];
			var tempPhrasesVarName = utterance_name + "_temp";

			for (var i = 0; i < length; ++i) {

				// //create STRING for phrase-matching
				// if(i > 0){
				// 	phraseStr += " " + this._WHITESPACE_TOKEN_NAME + " ";
				// }
				// phraseStr += this._PARTIAL_MATCH_PREFIX + num + ":" + phraseList[i];
				this.addPhraseMatchForInterpretion(i, phraseList, phraseBuffer);//impl. abstract

				//create STR for semantic processing of phrase
				// semanticProcResult += this.temp_phrase_match_var" = " + this._PARTIAL_MATCH_PREFIX + num + ";"
				// 			+ utterance_name + "_temp['phrases'].push("+this.temp_phrase_match_var+");\n\t\t";
				this.addPartialPhraseInterpretion(i, tempPhrasesVarName, phraseList, semanticProcBuffer);//impl. abstract
			}

			var pharseMatchResultDef = this.entry_index_field + ": "
					+ this.getPhraseMatchIndex() + ","
					+ this.entry_type_field + ": '" + utterance_name + "',"
					+ this.entry_token_field + ": null";

			// "var _m = {" + pharseMatchResult += "}";
			pharseMatchResult = this.toPhraseMatchResultForInterpretion(pharseMatchResultDef);//impl. abstract

			var semanticProcResult = "var "+utterance_name+"_temp = {}, "+this.temp_phrase_match_var+"; "+utterance_name+"_temp['phrases'] = [];"
					+ (semanticProcBuffer.length > 0? semanticProcBuffer.join('') : '')
					+ this.phrase_match_var + "." + this.entry_token_field + " = " + utterance_name + "_temp['phrases'];"
						+ utterance_name + "_temp['phrase']=_tokenList("+utterance_name + "_temp['phrases']).join(' ');"
						+ utterance_name + "_temp['utterance']='" + utterance_name + "'; "
						+ utterance_name + "_temp['engine']='" + this.engineId + "'; "
						+ utterance_name + "_temp['semantic'] = " + semantic_as_string
					+ "; " + this.variable_prefix + utterance_name + ".push(" + utterance_name + "_temp); "
					+ this.variable_prefix + "result = " + utterance_name + "_temp";

			// return phraseStr + " {\n\t   " + pharseMatchResult +  "; " + semanticProcResult + "; return _m; \n\t} ";
			return this.toPhraseInterpretion(phraseBuffer.length > 0? phraseBuffer.join('') : '', pharseMatchResult, semanticProcResult);//impl. abstract
		},

		//NOTE: moved from GrammarConverter
		variable_prefix: "_$",
		variable_regexp: /"(_\$[^\"]*)"/igm,
		temp_phrase_match_var: "tempMatch",
		/** NOTE: must consist of ASCI "word chars", i.e. not whitepaces, numbers etc.*/
		entry_token_field: "tok",
		/** NOTE: must consist of ASCI "word chars", i.e. not whitepaces, numbers etc.*/
		entry_index_field: "i",
		/** NOTE: must consist of ASCI "word chars", i.e. not whitepaces, numbers etc.*/
		entry_type_field: "type",


		//NOTE need access to var-defs of instance -> set these later (see below)

		/** code for HELPER (match) -> string: flatten arrays and return as concatenated string */
		helper_func_flatten: null,
		/** code for HELPER (match) -> number: get the index/offset (~ location) of a match within the input string */
		helper_func_index: null,
		/** code for HELPER (field, match) -> string: get the token/string-representation for a match, and add it to the field variable */
		helper_func_tok: null,
		/** code for HELPER (match, list) -> string[]: add match (recursively) to token-list entry in list */
		helper_func_tokenList: null,
		/** code for HELPER (phrases, type, index) -> string: get token for type at index from phrases-list  */
		helper_func_getTok: null,

	};

	gen.helper_func_flatten = "  var _flatten = function(match){ if(!match.join){ return match;} for(var i=0, size = match.length; i < size; ++i){if(!match[i]){continue;}if(match[i].join){match[i] = _flatten(match[i])}} return match.join('') };\n";
	gen.helper_func_index = "  var _index = function(match){return match."+gen.entry_index_field+"};\n";
	gen.helper_func_tok = "  var _tok = function(field, match){ match = _flatten(match); field[match] = match; return match;}\n";
	gen.helper_func_tokenList = "  var _tokenList = function(match, list) {list = list || [];var size = match.length, t;for (var i = 0; i < size; ++i) {t = match[i];if (!t) {continue;}if (t."+gen.entry_token_field+".join) {_tokenList(t."+gen.entry_token_field+", list);} else {list.push(t."+gen.entry_token_field+");}}return list;};\n";
	gen.helper_func_getTok = "  var _getTok = function(phrases, type, index) {var count = 0, p;for(var i=0, size = phrases.length; i < size; ++i){p = phrases[i];if(p."+gen.entry_type_field+" === type){if(index === count++){return typeof p."+gen.entry_token_field+" === 'string'? p."+gen.entry_token_field+" : p;}}}};\n";

	return gen;

}

});
