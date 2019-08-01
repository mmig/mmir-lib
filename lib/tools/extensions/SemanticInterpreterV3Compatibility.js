define(['mmirf/encodeUtils'],
	/**
     * Set to "backwards compatibility mode v3" (for pre version 4.0) for SemanticInterpreter (and GrammarConvert).
     *
     * Used by {@link mmir.compat.v3.CoreCompat}.
     *
	 * @class
	 * @name mmir.compat.v3.SemanticInterpreter
	 * @static
	 *
	 * @example
	 * mmir.require(['mmirf/semanticInterpreterCompatibility', 'mmirf/semanticInterpreter', 'mmirf/grammarConverter'], function(setCompatibility, semanticInterpreter, GrammarConverter){
	 * 		setCompatibility(semanticInterpreter, GrammarConverter);
	 * });
	 *
	 * @public
	 * @see mmir.compat.v3.CoreCompat
	 * @see mmir.compat.v3.GrammarConverter
	 *
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
     * @constructs mmir.compat.v3.SemanticInterpreter
     *
     */
    return setToCompatibilityMode = function(semanticInterpreter, grammarConverter) {


        semanticInterpreter.getInstance = function(){return this;};

    	/**
	     * @memberOf mmir.compat.v3.SemanticInterpreter#
    	 */
    	semanticInterpreter.getASRSemantic = semanticInterpreter.interpret;

    	/**
	     * @private
	     * @memberOf mmir.compat.v3.SemanticInterpreter#
    	 */
		var removeStopwordsAltFunc = function removeStopwords_alt(thePhrase, lang, gc){
			if(!gc){
				gc = semanticInterpreter.getGrammarConverter(lang);
			}
    		var stop_words_regexp = gc.getStopWordsRegExpr_alt();

			while (thePhrase.match(stop_words_regexp)) {
				thePhrase = thePhrase.replace(stop_words_regexp, ' ');
				thePhrase = thePhrase.trim();
			}

			return thePhrase;
		};

		//helper: pre-processing with legacy alternative stopword removal function
		var preprocAlt = function preproc_alt(thePhrase, pos, maskFunc, stopwordFunc){
			return removeStopwordsAltFunc(thePhrase, null, this);
		};

		//helper: post-processing with legacy alternative stopword removal function
		var postprocAlt = function postproc_alt(procResult, recodeFunc){
			return this.unmaskJSON(procResult);
		};

		/**
		 * WARNING: there must only be 1 active call at a time of either of <code>getASRSemantic_alt</code>
		 *            and of <code>getASRSemantic</code>.
		 *
		 * NOTE: in difference to the original implementation, this backwards-compatibility version offers
		 *       an optional 3rd parameter for a callback function, allowing asynchronous grammar execution.
		 *       WARNING: A compiled grammar must already exist, i.e. this function does not support
		 *                "auto-compilation", if the compiled version of the grammar does not exist yet
		 *                (that will most likely result in an error).
		 *                As a work-around, you can use first the non-alt version (<code>getASRSemantic(phrase, lanc, callback)</code>)
		 *                for the same language and using a callback, and after the callback was invoked, use this alt-version
		 *                for getting the ASR semantic result.
		 */
		semanticInterpreter.getASRSemantic_alt = function(phrase, langCode, callback){

			var gc = this.getGrammarConverter(langCode);

			var orig_preproc = gc.preproc;
			var orig_postproc = gc.postproc;
			gc.preproc = preprocAlt;
			gc.postproc = postprocAlt;

			var isSync = false;//helper for detecting, if getASRSemantic is executed asynchronously
			var resultSync, resultAsync;
        	resultSync = this.getASRSemantic(phrase, langCode, function(res){

        		isSync = true;

        		resultAsync = res;

    			gc.preproc = orig_preproc;
    			gc.postproc = orig_postproc;

    			if(callback){
    				callback.apply(null, arguments);
    			}
        	});

        	if(isSync){//if synchronously executed, then isSync is true at this point (-> must not restore preproc, postproc if async exec)

    			gc.preproc = orig_preproc;
    			gc.postproc = orig_postproc;
        	}
        	return resultSync? resultSync : resultAsync;
        };

        /**
         * @memberOf SemanticInterpreter.prototype
         * @public
		 */
        semanticInterpreter.removeStopwords_alt = function(thePhrase, lang){
			return this.removeStopwords(thePhrase, lang, removeStopwordsAltFunc);
		};

    	/**
    	 * alternative reg-exp for stop-words (a different method for detecting/removing stopwords must be used!)
    	 * @memberOf mmir.compat.v3.GrammarConverter#
    	 */
    	grammarConverter.prototype.stop_words_regexp_alt;


    	/**
    	 * default setting for loading JSON files:
    	 *  if set to true, old-style umlauts encodings (e.g. __oe__) will converted after loading the file
    	 *  Enable this, if you need to use old-style encoded grammars ... still, the better option would
    	 *   be to convert the old-style grammar (i.e. use un-encoded umlauts in the JSON grammar file).
    	 *
    	 * @memberOf mmir.compat.v3.GrammarConverter#
    	 */
    	grammarConverter.prototype.convertOldFormat = false;

    	/**
    	 * original <code>loadGrammar</code> function
    	 * @memberOf mmir.compat.v3.GrammarConverter#
    	 */
    	grammarConverter.prototype.__loadGrammar = grammarConverter.prototype.loadGrammar;
    	/**
    	 * restored "auto-upgrading" for loaded grammars
    	 * (original <code>loadGrammar</code> function will be available as <code>__loadGrammar</code>)
    	 *
    	 * @memberOf mmir.compat.v3.GrammarConverter#
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
    	 * @memberOf mmir.compat.v3.GrammarConverter#
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
    	 * @memberOf mmir.compat.v3.GrammarConverter#
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
