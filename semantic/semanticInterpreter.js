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


define(['constants', 'grammarConverter'//, 'grammarParserTemplate', 'jscc'
        ], 
	/**
	 * @name SemanticInterpreter
	 * @exports SemanticInterpreter as mmir.SemanticInterpreter
	 * @static
	 * @class
	 */
	function (
		constants, GrammarConverter//, template, jscc
){
	
	/**
	 * The instance for the singleton SemanticInterpreter
	 * 
	 * @type SemanticInterpreter
	 * @private
	 */
	var instance = null;
    
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
    
    
    
    /**
     * @param doRecompile (OPTIONAL) IF {Boolean}: if true, the JSON grammar in content\grammar.json will be recompiled (needs to be accessible via AJAX!)
     * 					IF {String}: the String's contents will be used as a String-representation of the JSON grammar
     * 					IF {Object}: the Object will be used as JSON representation for the grammar
     * 
     * @param {String} [generatedParserLanguageCode]  if param doRecompile is used, this String specifies the 
     * 					language for the generated grammar-parser.
     * 					NOTE: this should be a valid ISO language code!
     * 
     * @constructs SemanticInterpreter
     * @memberOf SemanticInterpreter.prototype
     * @private
     */
    function constructor(doRecompile, generatedParserLanguageCode){
    
	    /**
	     * "map" for grammar implementations (e.g. for different languages)
	     * 
	     * @property grammarImplMap
	     * @private
	     */
	    var grammarImplMap = {};
	    /**
	     * list of IDs for grammar implementations (e.g. for different languages).
	     * 
	     * This list contains the "keys" of all current entries in <tt>grammarImplMap</tt>.
	     * 
	     * @property grammarImplList
	     * @private
	     */
	    var grammarImplList = [];
	    
	    /**
	     * id (i.e. the <em>key</em> for map <tt>grammarImplMap</tt>) for currently used
	     * grammar.
	     * 
	     * If for invocations of getASRSemantic(..) etc. function the ID/languageCode
	     * argument is missing/omitted, then this id will be used.
	     * 
	     * NOTE: if not <tt>NULL</tt>, the grammar must be available, either
	     * 		 as compiled JS file (which must be already loaded, i.e. already present in <tt>grammarImplMap</tt>), or
	     * 		 as JSON grammar file (which must be available at <tt>/config/languages/[ID]/grammar.json</tt>
	     * 
	     * @property currentGrammarId
	     * @private
	     */
	    var currentGrammarId = null;
    	
	    /**
	     * Flag for enabling/disabling processing of SemanticInterpreter.
	     * 
	     * If disabled, getASRSemantic(), removeStopwords() etc. (+ <tt>_alt</tt> versions) will return <tt>null</tt> values. 
	     * 
	     * NOTE: if no grammar for any language is available, the SemanticInterpreter should be disabled.
	     * 
	     *  Setting a language, automatically enables the the SemanticInterpreter.
	     * 
	     * @property _isEnabled
	     * @type Boolean
	     * @private
	     */
	    var _isEnabled = false;
	    
	    var doSetEnabled = function(isEnabled){
        	_isEnabled = isEnabled;
        };
        var doCheckIsEnabled = function(){
        	return _isEnabled;
        };
	    
	    /**
	     * 
	     * NOTE: if no other grammar is available yet, <tt>currentGrammarId</tt> will be set to <tt>id</tt>.
	     * 
	     * NOTE: if currently disabled, calling this function automatically enables ( setEnabled(TRUE) ),
	     * 		 the semantic interpreter.
	     * 
	     * @function
	     * @param id {String} ID for the grammar (e.g. an ISO-639 language code)
	     * @param grammarImpl {GrammarConverter|Function} the executable JavaScript grammar implementation
	     * 					IF {GrammarConverter}: the impl. with valid member {Function} {@link GrammarConverter.executeGrammar()}
	     * 					IF {Function}: the {Function} {@link GrammarConverter.executeGrammar()} - 
	     * 									In this case, if no GrammarConverter instance fo <tt>id</tt> is present, a new one will be created; 
	     * 									The stopwords must already be set, or must additionally be set for the GrammarConverter instance
	     * 									  (e.g. using {@link mmir.SemanticInterpreter.setStopwords}) 
	     */
    	var doAddGrammar = function(id, grammarImpl){
        	
    		//the grammar function must be "wrapped" in a GrammarConverter instance
    		// ... if not, do so now:
        	if( ! (grammarImpl instanceof GrammarConverter)){
        		var gc = doGetGrammar(id, true);
        		
        		//if for this ID (= language code) no grammar-converter
        		// exists yet, create a now one
        		// (otherwise, re-use the existing one)
        		if(!gc){
        			gc = new GrammarConverter();
        		}
        		gc.setGrammarFunction(grammarImpl);
        		grammarImpl = gc;
        	}
//        	else {
//        		
//        	}
        	
        	var isAlreadyPresent = checkHasGrammar(id);
        	grammarImplMap[id] = grammarImpl;
        	
        	if( ! isAlreadyPresent){
        		
        		//DISABLED: this may produce side effects (now: current grammar must be explicitly set using setCurrentGrammar(lang))
//	        	if(grammarImplList.length === 0){
//	        		currentGrammarId = id;
//	        	}
	        	grammarImplList.push(id);
        	}
        	
        	doSetEnabled(true);
        };
        
        var doSetStopwords = function(id, stopwordArray){
        	doGetGrammar(id).setStopWords(stopwordArray);
        };
        /**
         * HELPER retrieve the executable grammar:
         * if already loaded, return the grammar instance, otherwise load & compile.
         * 
         * @param {String} id
         * 		the ID (e.g. language code) for the grammar
         * @param {Boolean} [doNotResolve] OPTIONAL
         * 		if <code>false</code> AND the request grammar is not loaded, yet
         * 		then the grammar will NOT be loaded (if omitted or <code>true</code>
         * 		missing grammars will automatically be loaded and compiled)
         * @param {Function} [callback] OPTIONAL
         * 		if grammar has to be loaded (and compiled), the provided callback
         * 		will be called, after completion.
         * 
         * @return {GrammarExecFunction}
         * 			the exectuable grammar (i.e. execution function), if the grammar is
         * 			already loaded (if grammar has to loaded and compiled, you need to
         * 			wait for the callback-call and then re-invoke doGetGrammar()).
         */
        var doGetGrammar = function(id, doNotResolve, callback){//NOTE: this should stay private
        	
        	if(!id){
        		if(!currentGrammarId){
        			throw 'Could not retrieve grammar: required grammar ID is missing';
        		}
        		else {
        			id = currentGrammarId;
        		}
        	}
        	
        	//shift arguments, if necessary:
        	if(!callback && typeof doNotResolve === 'function'){
        		callback = doNotResolve;
        		doNotResolve = false;
        	}
        	
        	if(!callback){
        		//TODO do this depending on DEBUG setting
        		isDefaultCallback = true;
        		callback = function(){
        			console.info('created executable grammar for "'+id+'" from source '+jsonGrammarUrl);
        		};
        	}
        	
        	if(!doNotResolve && ! checkHasGrammar(id) ){
        		var jsonGrammarUrl = instance.get_json_grammar_url(id);
        		
        		createAndAddGrammar(jsonGrammarUrl, id, callback);
        	}
        	else if(callback){
        		callback();
        	}
        	
        	return grammarImplMap[id];
        };
        var checkHasGrammar = function(id){
        	return typeof grammarImplMap[id] !== 'undefined';
        };
        var doRemoveGrammar = function(id){
        	
        	if( checkHasGrammar(id) ){
        		
        		//remove from impl.-map:
	        	delete grammarImplMap[id];
	        	
	        	//remove from ID-list
	        	for(var i=0, size = grammarImplList.length; i < size; ++i){
	        		if(grammarImplList[i]==id){
		        		grammarImplList.splice(i, 1);
	        			break;
	        		}
	        	}
        	}
        };
        
        
        //TODO move create/build into GrammarConverter
    	/**
         * @param doRecompile (OPTIONAL) IF {Boolean}: if true, the JSON grammar in content\grammar.json will be recompiled (needs to be accessable through ajax!)
         * 					IF {String}: the String's contents will be used as a String-representation of the JSON grammar
         * 					IF {Object}: the Object will be used as JSON representation for the grammar
         * 					IF omitted: the current grammar-JSON file will be loaded into the GrammarConverter.json_grammar_definition 
         * 
         * @param generatedParserLanguageCode (OPTIONAL) {String} if param doRecompile is used, this String specifies the 
         * 					language for the generated grammatic-parser. If omitted, the default "de" (German) will be used.
         * 					NOTE: this must be a valid ISO language code!
         * 
         * @param callback (OPTIONAL) {Function} a callback that is invoked after the grammar was created and added to the SemanticInterpreter. 
         * 							The callback-function will be invoked without arguments, i.e. <code>callback();</code>
         * @function
         */
        function createAndAddGrammar(doRecompile, generatedParserLanguageCode, callback){
        	
        	var gc = new GrammarConverter();
        	
        	function build_grammar(theConverterInstance){
        	    
        		require(['jscc'], function(jscc){
                
	                theConverterInstance.convertJSONGrammar();
	                var grammarDefinition = theConverterInstance.getJSCCGrammar();
	                
	//                grammarDefinitionText = grammarDefinition;
	                
	//                var pure_code, out_code, i;
	
	                //set up the JS/CC compiler:
	                var dfa_table = '';
	//                html_output = new String();
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
	             
	                var grammarParser = new String(theConverterInstance.PARSER_TEMPLATE);
	                grammarParser = grammarParser.replace(/##PREFIX##/gi, "");
	                grammarParser = grammarParser.replace(/##HEADER##/gi, jscc.get_code_head());
	                grammarParser = grammarParser.replace(/##TABLES##/gi, jscc.print_parse_tables(jscc.MODE_GEN_JS));
	                grammarParser = grammarParser.replace(/##DFA##/gi, jscc.print_dfa_table(dfa_table));
	                grammarParser = grammarParser.replace(/##TERMINAL_ACTIONS##/gi, jscc.print_term_actions());
	                grammarParser = grammarParser.replace(/##LABELS##/gi, jscc.print_symbol_labels());
	                grammarParser = grammarParser.replace(/##ACTIONS##/gi, jscc.print_actions());
	                grammarParser = grammarParser.replace(/##FOOTER##/gi, "\nvar _semanticAnnotationResult = { result: {}};\n__parse( "+INPUT_FIELD_NAME+", new Array(), new Array(), _semanticAnnotationResult);\nreturn _semanticAnnotationResult.result;");
	                grammarParser = grammarParser.replace(/##ERROR##/gi, jscc.get_error_symbol_id());
	                grammarParser = grammarParser.replace(/##EOF##/gi, jscc.get_eof_symbol_id());
	                grammarParser = grammarParser.replace(/##WHITESPACE##/gi, jscc.get_whitespace_symbol_id());
	                
	                
	                //FIXME attach compiled parser to some other class/object
	                var moduleNameString = '"'+generatedParserLanguageCode+'GrammarJs"';
	                var addGrammarParserExec = 
//                	  'define('+moduleNameString+',["semanticInterpreter"],function(semanticInterpreter){\n'
                	  '(function(){\n  var semanticInterpreter = require("semanticInterpreter");\n'//FIXME
	                	+ 'var grammarFunc = function('+INPUT_FIELD_NAME+'){'
                			//TODO active/use safe_acc (instead of try-catch construct in semantic-result extraction
//                			+ "var safe_acc = function(obj){\n  \tvar len = arguments.length;\n  \tif(len === 1){\n  \t    return null;\n  \t}\n  \tvar curr = obj, prop = arguments[1], i = 2;\n  \tfor(; i < len; ++i){\n  \tif(obj[prop] != null){\n  \t    obj = obj[prop];\n  \t}\n  \tprop = arguments[i];\n  \t}\n  \tvar res = obj[prop];\n  \treturn typeof res !== 'undefined'? res : null;\n  \t};"
                			+ grammarParser
	                	+ '\n};\n'
	                	+ 'semanticInterpreter.addGrammar("'
	                		+generatedParserLanguageCode
	                		+'", grammarFunc);\n\n'
	                	+ 'semanticInterpreter.setStopwords("'
	                		+generatedParserLanguageCode+'",'
	                		+JSON.stringify(theConverterInstance.getStopWords())
	                	+ ');\n'
	                	+ 'return grammarFunc;\n'
	//                	+ '});\n'
	//                	+ 'require(['+moduleNameString+']);\n';//requirejs needs this, in order to trigger initialization of the grammar-module (since this is a self-loading module that may not be referenced in a dependency in a define() call...)
	                	+ '})();'//FIXME
	                ;
	                
	                theConverterInstance.setJSGrammar(addGrammarParserExec);
	
	                doAddGrammar(generatedParserLanguageCode, theConverterInstance);
	                
	                eval(addGrammarParserExec);
	                
	                //invoke create&add callback if present:
	                if(callback){
	                	callback();
	                }
	                
        		});//END: require([jscc])
                
            }//END function build_grammar
        	
            if(doRecompile === true || doRecompile === 'true'){//FIXME this option must be re-implemented (there is no 'default' grammar any more!)
            	gc.loadGrammar(build_grammar, function(){ throw 'Could not find JSON grammar file at default location'; } );
            } else if(typeof doRecompile === 'string'){
            	//interpret STRING as URL for the JSON grammar:
            	gc.loadGrammar(build_grammar, function(err){
            			throw 'Could not find JSON grammar file at "'+doRecompile+'": '+err;
            		} , doRecompile
            	);
            } else if(typeof doRecompile === 'object'){
            	gc.json_grammar_definition = doRecompile;
            	build_grammar(gc);
            } else {
            	//try to use the GrammarConvert's default settings for retrieving a JSON grammar definition
            	gc.loadGrammar();
            	doAddGrammar(generatedParserLanguageCode, gc);
            	if(callback){
            		callback();
            	}
            }
        }
        
        var process_asr_semantic = function(phrase, stopwordFunc, langCode, callback){

			if(!doCheckIsEnabled()){
				console.warn('SemanticInterpreter.getASRSemantic: currently disabled!');
				return null;
			}
			
			if(typeof langCode === 'function'){
				callback = langCode;
				langCode = void(0);
			}
			
			var grammarReadyCallback;
			if(callback){
				grammarReadyCallback = function(){
					grammarConverter = doGetGrammar(langCode);
					
					callback( execGrammar(grammarConverter, phrase, stopwordFunc, langCode) );
				};
			}
			
        	var grammarConverter = doGetGrammar(langCode, grammarReadyCallback);
        	
        	var execGrammar = function(grammarConverter, phrase, stopwordFunc, langCode){
	            var strPreparedPhrase = grammarConverter.maskString( phrase.toLowerCase() );
	            strPreparedPhrase = stopwordFunc(strPreparedPhrase, langCode, grammarConverter);
	           
	            if(IS_DEBUG_ENABLED) console.debug('SemanticInterpreter.process_asr_semantic('+langCode+'): removed stopwords, now parsing phrase "'+strPreparedPhrase+'"');//debug
	            
	    		var result = grammarConverter.executeGrammar( strPreparedPhrase );
	            
	    		//unmask previously mask non-ASCII chars in all Strings of the returned result:
	    		result = grammarConverter.unmaskJSON(
	    				result
	    		);
	            
	            return result;//TODO return copy instead of original instance?
        	};
        	

        	if(!grammarConverter && ! grammarReadyCallback){
    			throw 'NoGrammar_'+langCode;
    		}
        	
        	if(!grammarReadyCallback){
        		return execGrammar(grammarConverter, phrase, stopwordFunc, langCode);
        	}
        };
        

		var removeStopwordsFunc =  function removeStopwords(thePhrase, lang, gc){
			if(!gc){
				gc = doGetGrammar(lang);
			}
    		var stop_words_regexp = gc.getStopWordsRegExpr();
        	return thePhrase.replace(stop_words_regexp, '').trim();
    	};
    	
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
        
		var doRemoveStopWords = function(thePhrase, lang, func){
			if(!doCheckIsEnabled()){
				console.warn('SemanticInterpreter.'+func.name+': currently disabled!');
				return null;
			}
			
			var grammarConverter = doGetGrammar(lang);
        	
        	if(!grammarConverter){
    			throw 'NoGrammar_'+langCode;
    		}
        	
            var str = grammarConverter.maskString( thePhrase );
            
//			var str = grammarConverter.encodeUmlauts(thePhrase, true);
			str = func(str, lang, grammarConverter);
			return grammarConverter.unmaskString( str );//grammarConverter.decodeUmlauts(str, true);
		};
		
		/** @lends SemanticInterpreter.prototype */
        return { // public members
        	/**
             * @param {String} phrase
             * 					the phrase that will be parsed
             * @param {String} langCode
             * 					the language code (identifier) for the parser/grammar
             * @param {Function} [callback] OPTIONAL
             * 					a callback function that receives the return value
             * 					(instead of receiving the result as return value from
             * 					 this function directly).
             * 					The signature for the callback is: <code>callback(result: Object)</code>
             * 					  (i.e. the result that would be returned by this function itself is
             * 					   passed as argument into the callback function; see also documentation
             * 					   for <em>returns</em>).
             * 					NOTE: in case, the grammar for the requested <code>langCode</code>
             * 						  is not compiled yet (i.e. not present as executable JavaScript),
             * 						  the corresponding JSON definition of the grammar needs to be
             * 					      compiled first, before processing the ASR's semantics is possible.
             * 						  In this case, a <code>callback</code> function <strong>MUST</strong>
             * 						  be supplied in order to receive a result (since compilation of the
             * 					      grammar may be <em>asynchronous</em>).  
             * 
             * @returns {Object}
             * 				the parsing result (as processed by the parser / grammar;
             * 				usually a JSON-like object).
             * 				WARNING: if a <code>callback</code> function was provided, then
             * 						 there is no return object.
             */
            getASRSemantic: function(phrase, langCode, callback){
            	
            	return process_asr_semantic(phrase, removeStopwordsFunc, langCode, callback);
            	
            },
            /**
             * @deprecated use {@link #getASRSemantic} instead
             */
            getASRSemantic_alt: function(phrase, langCode){
            	
            	return process_asr_semantic(phrase, removeStopwordsAltFunc, langCode);
            	
            },
            /**
             * Removes stopwords using the stopword-list from the parser/grammar
             * for <code>lang</code>.
             * 
             * NOTE: <code>{@link #getASRSemantic}</code> automatically applies stopword-removal
             * 		 (i.e. there is no need to manually remove stopwords using this function
             * 		  when using <code>{@link #getASRSemantic}</code>).
             * 
             * @param {String} thePhrase
             * 					the Phrase for which stopwords should be removed
             * @param {String} lang
             * 					the language code (identifier) for the parser/grammar
             */
			removeStopwords: function(thePhrase, lang){
				return doRemoveStopWords(thePhrase, lang, removeStopwordsFunc);
			},
			/**
			 * @deprecated use {@link #removeStopwords} instead
			 */
			removeStopwords_alt: function(thePhrase, lang){
				return doRemoveStopWords(thePhrase, lang, removeStopwordsAltFunc);
			},
			/** NOTE: the grammar must be compiled first, see getNewInstance(true) */
			getGrammarDefinitionText: function(id){
				return doGetGrammar(id).getJSCCGrammar();//grammarDefinitionText;
			},
			/** NOTE: the grammar must be compiled first, see getNewInstance(true) */
			getGrammarParserText: function(id){
				return doGetGrammar(id).getJSGrammar();//grammarParser;
			},
			getGrammarConverter: function(id){
				return doGetGrammar(id);
			},
			
			createGrammar: function(rawGrammarSrc, id, callback){
				
				if(!id){
					throw 'missing ID for generated grammar';//TODO
				}
		        
				createAndAddGrammar(rawGrammarSrc, id, callback);
				
				return this;
			},
			
	        addGrammar: doAddGrammar,
	        setStopwords: doSetStopwords,
//	        getGrammar: doGetGrammar, <- set to private
	        hasGrammar: checkHasGrammar,
	        removeGrammar: doRemoveGrammar,

	        /**
	         * Sets the current grammar.
	         * 
	         * If in invocations of {@link #getASRSemantic} the grammar ID (e.g. language code) is missing,
	         * then this grammar that is set here is used.
	         * 
	         * The id must reference either a grammar that was compiled (i.e. generated JavaScript file)
	         * for this id, or there must exists JSON-grammar file for which the language-dir matches the id parameter,
	         * e.g. <code>config/languages/[id]/grammar.json</code>.
	         * 
	         * @param {String} id the ID for the grammar, e.g. an ISO language code
	         * 
	         * @function
	         * @public
	         */
	        setCurrentGrammar: function(id){
	        	currentGrammarId = id;
	        	
	        	//set semantic-interpreter to enabled
	        	//  (this ensures, that JSON-grammars are automatically loaded,
	        	//   if no corresponding compiled JS-grammar is available yet) 
	        	doSetEnabled(true);
	        },
	        getCurrentGrammar: function(){
	        	return currentGrammarId;
	        },
	        
	        setEnabled: function(isEnabled){
	        	doSetEnabled(isEnabled);
	        },
	        isEnabled: function(){
	        	return doCheckIsEnabled();
	        },
	        
	        //FIXME rename/move functions
	        get_json_grammar_url: function(id){
	        	var configLangPath = constants.getLanguagePath();
	        	var jsonGrammarFileName = constants.getGrammarFileName();
	        	
	        	return configLangPath + id + '/' +jsonGrammarFileName;
	        }
        };
    }
    
    instance = new constructor();
    
    /**
	 * @deprecated instead: use <code>mmir.SemanticInterpreter</code> directly
	 * 
	 * @function
	 * @name getInstance
     * @memberOf SemanticInterpreter.prototype
	 */
	instance.getInstance = function(){
		return instance;
	};
    
    return instance;
    
});//END: define(..., function(){
