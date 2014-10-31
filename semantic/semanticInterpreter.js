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
     * The version number for the format of generated (JavaScript) grammars.
     * 
     * This number is "written into" the generated grammars and then
     * used as argument, when the grammar adds itself via
     * <code>addGrammar(id, func, versionNumber)</code>.
     * 
     * See generator function build_grammar() within createAndAddGrammar().
     * 
     * NOTE: This version number must be increased, when way changes, how 
     *       grammars are generated.
     *       Or more precisely: when previously generated grammars cannot
     *       be used anymore, after the generation mechanism has been changed.
     * 
     * @constant
     * @private
     */
    var GRAMMAR_FILE_FORMAT_VERSION = 3;
    
    /**
     * @constructs SemanticInterpreter
     * @memberOf SemanticInterpreter.prototype
     * @private
     */
    function constructor(){
    
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
	    
	    
	    var currentGrammarEningeId = null;
	    var DEFAULT_GRAMMAR_ENGINE = 'jscc';
	    var GRAMMAR_MODULE_ID_POSTFIX = 'Gen';
	    
	    var doSetGrammarEngine = function(id){
	    	currentGrammarEningeId = id;
	    };
	    var doGetGrammarEngine = function(){
	    	if(currentGrammarEningeId){
		    	return currentGrammarEningeId;	
	    	}
	    	return DEFAULT_GRAMMAR_ENGINE;
	    };
    	
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
	     * @param {Number} [fileFormatNo] OPTIONAL
		 * 					If the number given does not match {@link #GRAMMAR_FILE_FORMAT_VERSION}
		 * 					the file format is assumed to be out-dated and an Error will be thrown.
		 * 
	     * @throws Error if <code>fileFormatNo</code> is given, but does not match GRAMMAR_FILE_FORMAT_VERSION. 
	     */
    	var doAddGrammar = function(id, grammarImpl, fileFormatNo){
    		
    		//check if the added grammar has correct format
    		if(fileFormatNo && fileFormatNo != GRAMMAR_FILE_FORMAT_VERSION){
    			
    			//grammar has old / out-dated format:
    			throw new Error('Grammar file has wrong format: need grammar file with format version '
    					+GRAMMAR_FILE_FORMAT_VERSION+', but got: '+fileFormatNo
    					+ '. Please update generated grammar (delete '
    					+ constants.getGeneratedGrammarsPath() +' and re-build grammars).'
    			);
    		}
        	
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
         * @param {String|JSONObject} doRecompile
         * 					IF {String}: the String's contents will be used as a String-representation of the JSON grammar
         * 					IF {Object}: the Object will be used as JSON representation for the grammar 
         * 
         * @param {String} [generatedParserLanguageCode] OPTIONAL 
         * 					if param doRecompile is used, this String specifies the 
         * 					   language for the generated grammatic-parser. If omitted, the default "de" (German) will be used.
         * 					NOTE: this must be a valid ISO language code!
         * 
         * @param {Function} [callback] OPTIONAL
         * 							a callback that is invoked after the grammar was created and added to the SemanticInterpreter. 
         * 							The callback-function will be invoked without arguments, i.e. <code>callback();</code>
         * @function
         */
        function createAndAddGrammar(doRecompile, generatedParserLanguageCode, callback){
        	
        	var gc = new GrammarConverter();
        	
        	//callback that will be used after the JSON file for the grammar was loaded:
        	function build_grammar(theConverterInstance){//<- argument is the GrammarConverter instance
        	    
        		var genId   = doGetGrammarEngine();//one of ['jscc' | 'pegjs' | 'jison'];
        		var genName = genId + GRAMMAR_MODULE_ID_POSTFIX;
        		
        		require([genName], function(gen){ 
        			
        			//initialize the generator (initialization may be async -> need callback/Promise)
        			// (-> if already initialized, the then-callback will be invoked immediately)
        			gen.init().then(function(){
        				
        				//actually start compilation of the grammar definition:
        				// usually this involves 2 steps: 
        				//    (1) converting the JSON grammar into a specific ParserParser syntax (e.g. JS/CC syntax)
        				//    (2) compiling this syntax using the corresponding Parser-Generator
        				// -> the resulting parser-function will then be registered on the SemanticInterpreter instance
        				//    (using its addGrammar() function) along with the stopword definition (using the setStopwords() function)
        				gen.compileGrammar(theConverterInstance, generatedParserLanguageCode, GRAMMAR_FILE_FORMAT_VERSION, function(convertedInstance){
	        		        
        					//add the grammar-parser-text and grammar-definition-text to the newly registered Grammar-instance
        					// (-> registering is done within the compileGrammar() function!)
	        		        var registeredGrammarInstance = doGetGrammar(generatedParserLanguageCode, true);
	        		        if(registeredGrammarInstance){
		        		        registeredGrammarInstance.setJSGrammar(convertedInstance.getJSGrammar());
		        		        registeredGrammarInstance.setJSCCGrammar(convertedInstance.getJSCCGrammar());
	        		        }
	        		        else {
	        		        	console.error('A problem occured during generation of grammar for "'+generatedParserLanguageCode+'"');
	        		        }
	        		        
	        		        //invoke callback if present:
	        		        if(callback){
	        		        	callback(registeredGrammarInstance);
	        		        }
        				});
        			});
        			
        		});//END: require([jsccGen])
                
            }//END function build_grammar
        	
            if(typeof doRecompile === 'string'){// arg. is URL for JSON grammar definition
            	
            	//interpret STRING as URL for the JSON grammar:
            	gc.loadGrammar(build_grammar, function(err){
            			throw 'Could not find JSON grammar file at "'+doRecompile+'": '+err;
            		}, doRecompile, true
            	);
            } else if(typeof doRecompile === 'object'){// arg. is JSONObject (ie. JSON grammar defintion)
            	
            	gc.json_grammar_definition = doRecompile;
            	build_grammar(gc);
            	
            } else {
            	console.error('SemanticInterpreter.__createAndAddGrammar: could not build grammar due to missing argumens');
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
        	
			var grammarReadyCallback;
			if(callback){
				grammarReadyCallback = function(){
					grammarConverter = doGetGrammar(langCode);
					
					callback( execGrammar(grammarConverter, phrase, stopwordFunc, langCode) );
				};
			}
			
        	var grammarConverter = doGetGrammar(langCode, grammarReadyCallback);
        	
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
    		
    		var str = thePhrase;
    		var encoded_stop_words_regexp = gc.getStopWordsEncRegExpr();
    		if(encoded_stop_words_regexp){
    			str = str.replace(gc.stop_words_regexp_enc, ' ').trim();
    		}
    		
        	return str.replace(stop_words_regexp, '').trim();
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
	        
	        /**
	         * Get the ID of the current grammar engine / compiler.
	         * 
	         * @default "jcss"
	         * @returns {String}
	         * 			the ID of the current grammar engine
	         */
	        getGrammarEngine: function(){
	        	return doGetGrammarEngine();
	        },
	        /**
	         * Set the grammar engine, i.e. the
	         * compiler engine for the JSON grammar
	         * 
	         * NOTE: implementations of the grammar engines are located at env/grammar/
	         *       The file-name for an implementation should follow the convention: ID+"Generator.js"
	         *       and should be registered with requirejs with the module-ID: ID+"Gen"
	         * 
	         * @param {String} egnineId
	         * 			the ID for the engine.
	         * 			Possible values: "jscc", "jison", "pegjs"
	         */
	        setGrammarEngine: function(engineId){
	        	doSetGrammarEngine(engineId);
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
