define(['encodeUtils'],
	/**
     * Set to "backwards compatibility mode" (for pre version 4.0) for SemanticInterpreter (and GrammarConvert).
     *  
	 * @class
	 * @name mmir.SemanticInterpreter.setToCompatibilityModeExtension
	 * @static
	 * 
	 * @example
	 * require(['core3Compatibility'], function(setCompatibility){
	 * 		setCompatibility(mmir);
	 * });
	 * 
	 * @public
	 */
	function(encodeUtils){

	/**
     * Set to "backwards compatibility mode" (for pre version 4.0).
     * 
     * This function re-adds deprecated and removed functions and
     * properties to SemanticInterpreter and GrammarConverter.
     * 
     * NOTE that once set to compatibility mode, it cannot be reset to
     * non-compatibility mode.
     * 
     * 
     * @param {mmir.SemtanticInterpreter} semanticInterpreter
     * 			the SemanticInterpreter instance
     * 
     * @param {GrammarConverter} grammarConverter
     * 			the GrammarConverter constructor
     * 
     * 
     * @constructs mmir.SemanticInterpreter.setToCompatibilityModeExtension
     * 
     */
    return setToCompatibilityMode = function(semanticInterpreter, grammarConverter) {
    	

        semanticInterpreter.getInstance = function(){return this;};
    	
    	/**
	     * @memberOf mmir.SemanticInterpreter.setToCompatibilityModeExtension.SemanticInterpreter
    	 */
    	semanticInterpreter.getASRSemantic = semanticInterpreter.interpret;
    	
    	/**
	     * @private
	     * @memberOf mmir.SemanticInterpreter.setToCompatibilityModeExtension.SemanticInterpreter
    	 */
		var removeStopwordsAltFunc = function removeStopwords_alt(thePhrase, lang, gc){
			if(!gc){
				gc = doGetGrammar(lang);
			}
    		var stop_words_regexp = gc.getStopWordsRegExpr_alt();
        	
			while (thePhrase.match(stop_words_regexp)) {
				thePhrase = thePhrase.replace(stop_words_regexp, ' ');
				thePhrase = thePhrase.trim();
			}
			
			return thePhrase;
		};
		
		//FIXME impl:
		semanticInterpreter.getASRSemantic_alt = function(phrase, langCode){
        	
        	return process_asr_semantic(phrase, removeStopwordsAltFunc, langCode);
        	
        };
        
      //FIXME impl:
        /**
         * @memberOf SemanticInterpreter.prototype
         * @public
		 */
        semanticInterpreter.removeStopwords_alt = function(thePhrase, lang){
			return doRemoveStopWords(thePhrase, lang, removeStopwordsAltFunc);
		};

    	/**
    	 * alternative reg-exp for stop-words (a different method for detecting/removing stopwords must be used!)
    	 * @memberOf mmir.SemanticInterpreter.setToCompatibilityModeExtension.GrammarConverter
    	 */
    	grammarConverter.prototype.stop_words_regexp_alt;
    	

    	/**
    	 * default setting for loading JSON files:
    	 *  if set to true, old-style umlauts encodings (e.g. __oe__) will converted after loading the file
    	 *  Enable this, if you need to use old-style encoded grammars ... still, the better option would
    	 *   be to convert the old-style grammar (i.e. use un-encoded umlauts in the JSON grammar file).
    	 *   
    	 * @memberOf mmir.SemanticInterpreter.setToCompatibilityModeExtension.GrammarConverter
    	 */
    	grammarConverter.prototype.convertOldFormat = false;
    	
    	/**
    	 * original <code>loadGrammar</code> function
    	 * @memberOf mmir.SemanticInterpreter.setToCompatibilityModeExtension.GrammarConverter
    	 */
    	grammarConverter.prototype.__loadGrammar = grammarConverter.prototype.loadGrammar;
    	/**
    	 * restored "auto-upgrading" for loaded grammars
    	 * (original <code>loadGrammar</code> function will be available as <code>__loadGrammar</code>)
    	 * 
    	 * @memberOf mmir.SemanticInterpreter.setToCompatibilityModeExtension.GrammarConverter
    	 */
    	grammarConverter.prototype.loadGrammar = function(successCallback, errorCallback, grammarUrl, doLoadSynchronously){
    		var self = this;
    		var onsuccess = function(){
    			
    			//if auto-upgrading is enabled:
    			//   decode old-style umlaut masking before continuing
    			if(self.convertOldFormat){
    				self.recodeJSON(self. json_grammar_definition, self.decodeUmlauts);
    			}
    			
    			if (typeof successCallback == "function") {
    				successCallback.apply(this, arguments);
    			}
    		};
    		return this.__loadGrammar(onsuccess, errorCallback, grammarUrl, doLoadSynchronously);
    	};
    	
    	/**
    	 * initialize alternative version / regular expression for stopwords
    	 * 
    	 * @memberOf mmir.SemanticInterpreter.setToCompatibilityModeExtension.GrammarConverter
    	 */
    	grammarConverter.prototype.parseStopWords_alt = function(){
    		
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
    	
    	/**
    	 * alternative version / regular expression for stopwords
    	 * @memberOf mmir.SemanticInterpreter.setToCompatibilityModeExtension.GrammarConverter
    	 */
    	grammarConverter.prototype.getStopWordsRegExpr_alt = function(){
    		if(!this.stop_words_regexp_alt){
    			this.parseStopWords_alt();
    		}
    		return this.stop_words_regexp_alt;
    	};
    	
    	grammarConverter.prototype.encodeUmlauts = encodeUtils.encodeUmlauts;
    	grammarConverter.prototype.decodeUmlauts = encodeUtils.decodeUmlauts;
    	
    };
    
});
