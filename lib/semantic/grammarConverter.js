
/**
* The GrammarConverter object initializes the grammar for processing
* <em>natural language text</em>, e.g. from the voice recognition.
*
* @class
* @name GrammarConverter
*
* @requires util/loadFile
* @requires util/isArray
*/
define(['mmirf/util/isArray', 'mmirf/util/loadFile'], function(isArray, loadFile){



/**
 * @ignore
 *
 * @constructs GrammarConverter
 */
function GrammarConverter(){

	this.variable_prefix = "_$";
	this.variable_regexp = /"(_\$[^\"]*)"/igm;// /"_$([^\"]*)/igm;

	this.entry_token_field = "tok";//must consist of ASCI "word chars", i.e. not whitepaces, numbers etc.
	this.entry_index_field = "i";//must consist of ASCI "word chars", i.e. not whitepaces, numbers etc.
	this.entry_type_field = "type";//must consist of ASCI "word chars", i.e. not whitepaces, numbers etc.

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

	//if execution of the grammar is asynchronously done (i.e. result is delivered using a callback)
	this.is_async = false;
};

GrammarConverter.prototype.loadGrammar = function(successCallback, errorCallback, grammarUrl, doLoadSynchronously){
	var self = this;
	var success = function(data, status, xhr){

		self.json_grammar_definition = data;

		if (typeof successCallback == "function") {
			successCallback.call(this, self, xhr);
		}
	};
	var error = function(xhr, status, data){

		if (typeof errorCallback == "function") {
			errorCallback.call(this, self);
		} else {
			console.error("failed to load the grammar! error: "+ JSON.stringify(data));
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

	loadFile({
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

/**
 * Get grammar definition text.
 *
 * This is the "source code" input for the grammar compiler
 * (i.e. syntax for jison, PEG.js or JS/CC).
 *
 * The grammar definition text is generated from the JSON grammar.
 *
 * @returns {String} the grammar definition in compiler-specific syntax
 */
GrammarConverter.prototype.getGrammarDef = function(){
	return  this.jscc_grammar_definition;
};

/**
 * Sets the grammar definition text.
 *
 * This function should only be used during compilation of the JSON grammar
 * to the executable grammar.
 *
 * NOTE: Setting this "manually" will have no effect on the executable grammar.
 *
 * @see #getGrammarDef
 * @protected
 *
 * @param {String} rawGrammarSyntax
 * 		the grammar definition in compiler-specific syntax
 */
GrammarConverter.prototype.setGrammarDef = function(rawGrammarSyntax){
	this.jscc_grammar_definition = rawGrammarSyntax;
};

/**
 * Get the compiled JavaScript grammar source code.
 *
 * This is the output of the grammar compiler (with additional
 * JavaScript "framing" in SemanticInterpreter.createGrammar).
 *
 * This needs to be eval'ed before it can be executed (eval() will add
 * the corresponding executable grammar to SemanticInterpreter).
 *
 * @returns {String} the compiled, JavaScript grammar source code
 */
GrammarConverter.prototype.getGrammarSource = function(){
	return  this.js_grammar_definition;
};

GrammarConverter.prototype.setGrammarSource = function(src_code){
	 this.js_grammar_definition = src_code;
};

/**
 * Set the executable grammar function.
 *
 * The grammar function takes a String argument: the text that should be parsed.
 *                            a Function argument: the callback for the result.
 *                            where the callback itself takes 1 argument for the result: <code>callback(result)</code>
 *
 * The returned result depends on the JSON definition of the grammar:
 * <code>func(inputText, resultCallback)</code>
 *
 *
 * @param {Function} func
 * 			the executable grammar function: <code>func(string, object, function(object)) : object</code>
 * @param {Boolean} [isAsnc] OPTIONAL
 * 					set to TRUE, if execution is asynchronously done.
 * 					DEFAULT: FALSE
 *
 * @see #exectueGrammar
 */
GrammarConverter.prototype.setGrammarFunction = function(func, isAsync){
	this.is_async = !!isAsync;
	this.executeGrammar = func;
};

GrammarConverter.prototype.isAsyncExec = function(){
	return this.is_async;
};

/**
 *
 * @param {String} thePhrase
 * 				the string from which to remove stopwords (and trim()'ed)
 * @param {Array<Position>} [positions] OPTIONAL
 * 				if provided, the positions at which stopwords were removed will be added
 * 				to this array, where each position-object is comprised of
 * 				<pre>
 * 					{
 * 						i: NUMBER the index at which the stopword was removed
 * 						mlen: NUMBER the length of the stopword that was removed
 * 					}
 * 				</pre>
 * 				the positions will order by occurance (i.e. by <code>pos.i</code>)
 *
 * @returns {String}
 * 				the string where stopwords were removed
 */
GrammarConverter.prototype.removeStopwords = function(thePhrase, positions){

	var stop_words_regexp = this.getStopWordsRegExpr();

	var str = thePhrase;

	var replStr,//<- replacement string used in removeFunc
		appendPos,//<- controls if position-info should append or prepended to position-list
		replOffset,//<- global offset (i.e. offset with regard to input string thePhrase)
		iCalc,//<- helper index for calculating offset in modified strings
		calcPos,//<- helper function for calculating offset in modified strings
		replPositions,//<- helper/temporary positions-array for calculating offset in modified strings
		removeFunc;//<- replacement-function that also tracks the positions that were modified (via argument positions)

	if(positions){

		//initialize helpers for tracking positions

		replOffset = 0;
		iCalc = 0;
		appendPos = true;

		removeFunc = function(){//HELPER for matched stopwords: log its position and remove it

			var argLen = arguments.length;
			var match = arguments[0];
			var offset = arguments[argLen-2];

			if(positions){

				var index = calcPos(offset);

//				//FIXM DEBUG
//				var word = argLen === 4? arguments[1] : (argLen === 6? arguments[2] : 'WHITESPACE');
//				var start = index;
//				var end = start + match.length;
//				var isError = word !== 'WHITESPACE'? thePhrase.substring(start, end).trim() !== word : !/\s+/.test(thePhrase.substring(start, end));
//				console[isError? 'error' : 'log']('matched "'+match+'" -> found stopword "'+word+'" from '+start+' to '+end+ ' -> "'+thePhrase.substring(start, end)+'"');
////				console.log('    stopword-removal: ', arguments);
//				//FIXM DEBUG END

				if(appendPos){
					positions.push({i: index, mlen: match.length, len: replStr.length});
				} else {
					positions.unshift({i: index, mlen: match.length, len: replStr.length});
				}
			}

			return replStr;
		};

		calcPos = function(offset){

			if(!replPositions){
				return offset;
			}

			var pos;
			for(var size = replPositions.length; iCalc < size; ++iCalc){
				pos = replPositions[iCalc];
				if(pos.i > offset + replOffset){
					break;
				}
				replOffset += pos.mlen - pos.len;
			}

			return offset + replOffset;
		};
	}

	var encoded_stop_words_regexp = this.getStopWordsEncRegExpr();
	replStr = ' ';
	if(encoded_stop_words_regexp){

//		console.log('_______STOPWORD-rem-enc: "'+str+'"');//FIXM DEBUG
		str = str.replace(this.stop_words_regexp_enc, positions? removeFunc : replStr);

		if(positions){
			//update helper variables for calculating global offset (after string was modified):
			replOffset = 0;
			iCalc = 0;
			replPositions = positions.slice(0);
		}
	}

//	console.log('_______STOPWORD-rem: "'+str+'"');//FIXM DEBUG

	replStr = '';
	replLen = str.length;
	str = str.replace(stop_words_regexp, positions? removeFunc : replStr);

	if(positions){
		positions.sort(function(a,b){return a.i - b.i;});//<- positions may not be ordered, if encoded_stop_words_regexp was applied
		//update helper variables for calculating global offset (after string was modified):
		replOffset = 0;
		iCalc = 0;
		replPositions = positions.slice(0);
	}

	if(positions){

		//trim with tracking of positions
//		console.log('_______STOPWORD-rem-ws: "'+str+'"');//FIXM DEBUG

		replStr = '';
		str = str.replace(/\s+$/, removeFunc);//<- trim at end

		positions.sort(function(a,b){return a.i - b.i;});//<- positions may not be ordered, if words were removed from the end of the string

		//update helper variables for calculating global offset (after string was modified):
		replOffset = 0;
		iCalc = 0;
		replPositions = positions.slice(0);

		appendPos = false;//<- prepending "start-trimming"-position may not be accurate, but should be "nearly" correct (w.r.t. to ordering by index pos.i)

		str = str.replace(/^\s+/, removeFunc);//<- trim at beginning

		positions.sort(function(a,b){return a.i - b.i;});//<- positions may not be ordered, if words were removed from the beginning of the string


//		console.log('_______STOPWORD-positions: "'+JSON.stringify(positions)+'"');//FIXM DEBUG

	} else {
		str = str.trim();
	}

//	console.log(JSON.stringify(str));//FIXM DEBUG

	return str;
};

/**
 * Apply pre-processing to the string, before applying the grammar:
 *  * mask non-ASCI characters
 *  * remove stopwords
 *
 * @param {String} thePhrase
 * @param {PlainObject} [pos] OPTIONAL
 * 				in/out argument: if given, the pre-processor will add fields with information
 * 								 on how the input string <code>thePhrase</code> was modified
 * 				Namely, the position information for removed stopwords will be added to
 * 				<code>pos.stopwords</code> (see {@link #removeStopwords} for more details)
 *
 * 				NOTE that this may not work, if custom <code>maskFunc</code> and/or <code>stopwordFunc</code>
 * 				     are provided as well.
 *
 * @param {Function} [maskFunc] OPTIONAL
 * 				custom function for masking non-ASCI characters:
 * 				<pre>maskFunc(inputStr : STRING [, isCalcPosition: BOOLEAN]) : STRING | {str: STRING, pos: ARRAY<POSITION>}</pre>
 * 				DEFAUL: use of <code>this.maskString(thePhrase, !!pos)</code>
 *
 * @param {Function} [stopwordFunc] OPTIONAL
 * 				custom function for removing stopwords
 * 				<pre>stopwordFunc(inputStr : STRING [, positions: ARRAY]) : STRING | {str: STRING, pos: ARRAY<POSITION>}</pre>
 * 				DEFAUL: use of <code>this.removeStopwords(str, [])</code>
 *
 * 				NOTE that <code>maskFunc</code> must also be specified, if this argument is used
 *
 * @returns {String} the pre-processed string
 */
GrammarConverter.prototype.preproc = function(thePhrase, pos, maskFunc, stopwordFunc){

	if(typeof pos === 'function'){
		stopwordFunc = maskFunc;
		maskFunc = pos;
		pos = void(0);
	}

	var str = maskFunc? maskFunc(thePhrase) : this.maskString(thePhrase, !!pos);

	var maskedPos;
	if(typeof str === 'object'){
		if(pos){
			maskedPos = str.pos;
		}
		str = str.str;
	}

	var stopwordPos;
	if(pos){
		stopwordPos = [];
		pos.stopwords = stopwordPos;
	}
	var result = stopwordFunc? stopwordFunc(str) : this.removeStopwords(str, stopwordPos);

	if(pos && stopwordPos.length > 0){

//		console.log('___________masking-input-pos: '+JSON.stringify(maskedPos));
//		console.log('___________stopword-input-pos: '+JSON.stringify(pos.stopwords));

		//recalculate stopword positions w.r.t. reverted masking:
		var offset = 0, mi = 0, msize =  maskedPos.length;
		var mpos, spos, sposend, mlen, mposi;
		for(var i1=0, size1 = stopwordPos.length; i1 < size1; ++i1){

			spos = stopwordPos[i1];

			for(; mi < msize; ++mi){

				mpos = maskedPos[mi];

				mposi = mpos.i + offset;

				sposend = spos.i + spos.mlen;
				if(sposend <= mposi){
					//if stopword ends before masking starts:
					// we already tried all maskings that could have effected the stopword
					//-> continue with next stopword
					break;
				}

				mlen = mpos.len - mpos.mlen;//<- length difference due to modification
				offset += mlen;//<- offset for masked strings, after masking was applied (i.e. when stopwords are removed

				if(mposi < spos.i){
					//if masking-position starts before stopword even begins:
					// the masking can not effect the stopword
					//-> continue with next masking position
					continue;
				}

				if(mposi + mpos.len <= sposend){

					//if masking-position occurs within stopword:
					//adjust stopword-length
					spos.mlen = spos.mlen - mlen;

					//need to "pre-adjust" index, since offset was already (in this case falsely) adjusted
					spos.i += mlen;

				} else {
					//... otherwise continue with next stopword
					break;
				}
			}
			spos.i -= offset;
		}

//		//FIXM DEBUG
//		console.log('__RECONST__stopword-input-pos: '+JSON.stringify(pos.stopwords));
//		for(var li = 0, lsize = pos.stopwords.length; li < lsize; ++li){
//			var lpos = pos.stopwords[li];
//			console.log('    '+JSON.stringify(lpos) + ' "'+thePhrase.substring(lpos.i, lpos.i + lpos.mlen)+'"');
//		}
//		//FIXM DEBUG END
	}

	return result;
};

/**
 * Post-processes the result from the applied grammar:
 *  * un-masks non-ASCI characters
 *
 * @param {SemanticResult} procResult
 * @param {Function} [recodeFunc]
 * 				function that recodes non-ASCI characters (or reverts the recoding)
 */
GrammarConverter.prototype.postproc = function(procResult, recodeFunc){
	if(recodeFunc){
		return this.recodeJSON(procResult, recodeFunc);//this.decodeUmlauts(procResult, true);
	}
	//unmask previously mask non-ASCII chars in all Strings of the returned result:
	return this.unmaskJSON(
			procResult
	);
};

GrammarConverter.prototype.removeStopwords_alt = function(thePhrase){

	var stop_words_regexp = this.getStopWordsRegExpr_alt();

	while (thePhrase.match(stop_words_regexp)) {
		thePhrase = thePhrase.replace(stop_words_regexp, ' ');
		thePhrase = thePhrase.trim();
	}

	return thePhrase;
};

/**
 * Execute the grammar.
 *
 * NOTE: do not use directly, but {@link mmir.SemanticInterpreter.interpret} instead,
 * 		since that function applies some pre- and post-processing to the text (stopword removal
 * 		en-/decoding of special characters etc.).
 *
 * @param {String} text
 * 			the text String that should be parse.
 * @param {Object} [options]
 * 			additional parsing options (some grammar engines may support further options)
 * 				options.debug: BOOLEAN enable printing debug information
 * 				options.trace: BOOLEAN | FUNCTION enable printing verbose/tracing information (may not be supported by the grammar engine)
 * @param {Function} [callback]
 * 			if #isAsyncExec is TRUE, then executeGrammar will have no return value, but instead the result
 * 			of the grammar execution is delivered by the <code>callback</code>:
 * 			<pre>function callback(result){ ... }</pre>
 * 			(see also description of <code>return</code> value below)
 * @returns {Object}
 * 			the result of the grammar execution:
 * 			<code>{phrase: STRING, phrases: ARRAY<OBJECT>, semantic: OBJECT}</code>
 *
 * 			The property <code>phrase</code> contains the <code>text</code> which was matched (with removed stopwords).
 *
 * 			The property <code>phrases</code> contains the matched <tt>TOKENS</tt> and <tt>UTTERANCES</tt> from
 * 			the JSON definition of the grammar as properties as arrays
 *          (e.g. for 1 matched TOKEN "token": <code>{token: ["the matched text"]}</code>).
 *
 *          The returned property <code>semantic</code> depends on the JSON definition of the grammar.
 *
 *          NOTE: if #isAsyncExec is TRUE, then there will be no return value, but instead the callback
 *                is invoked with the return value.
 *
 */
GrammarConverter.prototype.executeGrammar = function(text, options, callback){
	console.warn('GrammarConverter.executeGrammar: this is only a stub. No grammar implementation set yet...');
};

//TODO move code-wrapper generator functions to separate generator module?

/**
 * Get code-prefix for wrapping generated, executable grammars.
 *
 * @param {Number} fileFormatVersion
 * 				the file format (see {@link mmir.SemanticInterpreter#getFileVersion})
 * @param {String} execMode
 * 				the execution mode for the generated grammar: 'sync' | 'async'
 *
 * @returns {String} the prefix code for generated grammars (i.e. prepend to generated grammar code)
 *
 * @see mmir.parser#STORAGE_CODE_WRAP_PREFIX
 */
GrammarConverter.prototype.getCodeWrapPrefix = function(fileFormatVersion, execMode){

	return  '(function(global){\n' +
			  	'var mmirName = typeof MMIR_CORE_NAME === "string"? MMIR_CORE_NAME : "mmir";\n'+
			  	'var mmir = global? global[mmirName] : void(0);\n'+
			  	'var require = mmir && mmir.require? mmir.require : (typeof requirejs !== "undefined"? requirejs : (global? global.require : require));\n'+
			  	'var semanticInterpreter = require("mmirf/semanticInterpreter");\n'+
			  	'var options = {fileFormat:'+fileFormatVersion+',execMode:'+JSON.stringify(execMode)+'};\n';
};

/**
 * Get code-suffix for wrapping generated, executable grammars.
 *
 * @param {Array<string>} encodedStopwords
 * 				the list of encoded stopwords (see {@link #getEncodedStopwords})
 * @param {String} grammarFuncName
 * 				the (variable's) name of the grammar function that was generated
 * 				(and will be used in {@link #executeGrammar})
 * @param {String} grammarId
 * 				the ID for the grammar (e.g. language code) with which the grammar
 * 				will be registered with SemanticInterpreter (see {@link mmir.SemanticInterpreter#addGrammar})
 *
 * @returns {String} the suffix code for generated grammars (i.e. append to generated grammar code)
 *
 * @see mmir.parser#STORAGE_CODE_WRAP_SUFFIX
 */
GrammarConverter.prototype.getCodeWrapSuffix = function(encodedStopwords, grammarFuncName, grammarId){

	return '\noptions.stopwords=' +
					//store stopwords with their Unicode representation (only for non-ASCII chars)
					JSON.stringify(encodedStopwords).replace(/\\\\u/gm,'\\u') +//<- revert JSON.stringify encoding for the Unicodes
				';\n' +
				//add "self registering" for the grammar-function
				//  i.e. register the grammar-function for the ID with the SemanticInterpreter
				'semanticInterpreter.addGrammar("' +
					grammarId + '", ' + grammarFuncName + ', options);\n\n' +
				'return ' + grammarFuncName + ';\n' +
				'})(typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : this);\n'
};


//TODO move masking/recoding functions to separate utility module?

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
 * @param {Boolean} [computePositions] OPTIONAL
 * 				DEFAULT: false
 * @param {String} [prefix] OPTIONAL
 * 				an alternative prefix used for masking, i.e instead of <code>~~</code>
 * 				(ignored, if argument has other type than <code>string</code>)
 * @param {String} [postfix] OPTIONAL
 * 				an alternative postfix used for masking, i.e instead of <code>~~</code>
 * 				(ignored, if argument has other type than <code>string</code>)
 * @returns {String|{str: String, pos: ARRAY<Position>}}
 * 				the masked string, or if <code>computePositions</code> was <code>true</code>
 * 				a result object with
 * 				<pre>
 * 				{
 * 					str: STRING, // the masked string
 * 					pos: [POSITION] // array of maskink-positions: {i: NUMBER, len: NUMBER, mlen: NUMBER}
 * 				}
 * 				</pre>
 * 				where POSITION is an object with
 * 				<pre>
 * 				{
 * 					i: NUMBER, // the index within the modified string
 * 					len: NUMBER, // the length before the modification (i.e. of sub-string that is to be masked)
 * 					mlen: NUMBER // the length after the modification (i.e. of sub-string that that was masked)
 * 				}
 * 				</pre>
 */
GrammarConverter.prototype.maskString = function (str, computePositions, prefix, postfix) {
	var i, s, ch, peek, result,
		next, endline, push, mask,
		spaces, source = str;

	var positions, esclen;//<- will only be used, if computePositions === TRUE

	//shift arguments if necessary
	if(typeof computePositions === 'string'){
		postfix = prefix;
		prefix = computePositions;
		computePositions = false;
	}

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

	mask = function (theChar) {

		if(computePositions){
			//store position information for the masking:
			// i: position in original string
			// len: modified length of the string, i.e. the length of masking string
			// mlen: original length of the string, i.e. the length of the string that will get masked (in this case it is always 1, i.e. 1 char)
			positions.push({i: i-2, len: esclen, mlen: theChar.length});//<needed?:> , start: result.length});//<- would need to compute the actual position from current result-buffer content...
		}

		result.push(ESC_START);

		var theUnicode = theChar.charCodeAt(0).toString(16).toUpperCase();
		var j = theUnicode.length;
		while (j < 4) {
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
	if(computePositions){
		esclen = ESC_START.length + 4 + ESC_END.length;
		positions = [];
	}

	i = 0;
	next();
	while (i <= source.length) { // less than or equal, because i is always one ahead
		ch = peek;
		next();

		push();
	}

//	//FIXM DEBUG: show position-logging for masking
//	if(computePositions && positions.length > 0){
//		console.log('_______LOG-mask-pos("'+str+'" -> "'+result.join('')+'"): ');
//		var lres = result.join('');
//		var loffset = 0;
//		for(var li = 0, lsize = positions.length; li < lsize; ++li){
//			var lpos = positions[li];
//			console.log('    '+JSON.stringify(lpos) + ' "'+str.substring(lpos.i, lpos.i + 1)+'" -> "'+lres.substring(loffset + lpos.i, loffset + lpos.i +lpos.len )+'"');
//			loffset += lpos.len - 1;
//		}
//	}//END: DEBUG

	if(computePositions){
		return {str: result.join(''), pos: positions};
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
 * @param {Boolean} [computePositions] OPTIONAL
 * 				DEFAULT: false
 * @param {RegExp} [detector] OPTIONAL
 * 				an alternative detector-RegExp:
 * 				the RegExp must conatin at least one grouping which detects a unicode number (HEX),
 * 				e.g. default detector is <code>~~([0-9|A-F|a-f]{4})~~</code> (note the grouping
 * 				for detecting a 4-digit HEX number within the brackets).
 * @returns {String|{str: String, pos: ARRAY<Position>}}
 * 				the masked string, or if <code>computePositions</code> was <code>true</code>
 * 				a result object with
 * 				<pre>
 * 				{
 * 					str: STRING, // the masked string
 * 					pos: [POSITION] // array of maskink-positions: {i: NUMBER, len: NUMBER, mlen: NUMBER}
 * 				}
 * 				</pre>
 * 				where POSITION is an object with
 * 				<pre>
 * 				{
 * 					i: NUMBER, // the index within the modified string
 * 					len: NUMBER, // the length before the modification (i.e. of sub-string that is to be masked)
 * 					mlen: NUMBER // the length after the modification (i.e. of sub-string that that was masked)
 * 				}
 * 				</pre>
 */
GrammarConverter.prototype.unmaskString = function (str, computePositions, detector) {
	var match, mlen, ch, positions, source = str, result = [], pos = 0, i, len = str.length;

	//shift arguments if necessary
	if(typeof computePositions === 'object'){
		detector = computePositions;
		computePositions = false;
	}

	if(computePositions){
		positions = [];
	}

	//RegExpr for: ~~XXXX~~
	// where XXXX is the unicode HEX number: ~~([0-9|A-F|a-f]{4})~~
	var REGEXPR_ESC = detector? detector : new RegExp( this.enc_regexp_str, "igm");

	while(match = REGEXPR_ESC.exec(source)){

		i =  match.index;
		mlen = match[0].length;

		//add previous:
		if(i > pos){
			result.push(source.substring(pos, i));
		}

		//add matched ESC as UNICODE:
		ch = String.fromCharCode(  parseInt(match[1], 16) );
		result.push(ch);

		//update position:
		pos = i + mlen;

		if(computePositions){
			//store position information for the masking:
			// i: position in original string
			// len: modified length of the string, i.e. the length of the unmasked string
			// mlen: original length of the string, i.e. the length of the masked string, that will get unmasked
			positions.push({i: i, len: ch.length, mlen: mlen});
		}
	}

	if(pos < len){
		result.push(source.substring(pos));
	}

//	//FIXM DEBUG: show position-logging for masking
//	if(computePositions && positions.length > 0){
//		console.log('--------LOG-UNMASK-pos("'+str+'" -> "'+result.join('')+'"): ');
//		var lres = result.join('');
//		var loffset = 0;
//		for(var li = 0, lsize = positions.length; li < lsize; ++li){
//			var lpos = positions[li];
//			console.log('    '+JSON.stringify(lpos) + ' "'+str.substring(lpos.i, lpos.i + lpos.mlen)+'" -> "'+lres.substring(loffset + lpos.i, loffset + lpos.i + lpos.len)+'"');
//			loffset += lpos.len - lpos.mlen;
//		}
//	}//END: DEBUG

	if(computePositions){
		return {str: result.join(''), pos: positions};
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
 * @function
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
 * @requires util/isArray
 */
GrammarConverter.prototype.recodeJSON = (function (isArray) {//<- NOTE this is only the initializer (i.e. see returned function below)

	/**
	 * HELPER for sorting position objects
	 *
	 * @private
	 */
	var sortPosFunc = function(pos1, pos2){
		return pos1.target.i - pos2.target.i;
	};

	/**
	 * HELPER for setting a recoded string value
	 *
	 * @param {StringResult|String} recodedVal
	 * 				the recoding-result:
	 * 				<pre>{str: STRING, pos: ARRAY<POSITION>}</pre>
	 *
	 * 				If undefined, nothing will be done
	 *
	 * @param {String} origVal
	 * 				the original string value (i.e. "un-recoded")
	 *
	 * @param {Object} obj
	 * 				the parent-object for the recoded string property
	 *
	 * @param {String} pname
	 * 				the property name in the parent-object for the recoded string property
	 *
	 * @param {Array<Position>} [recodedPositions] OPTIONAL
	 * 				if present, the modification information of the recoding will be added to the array
	 * 				The elements of the array:
	 * 				<pre>
	 * 				{
	 * 					target: Token, // the token that was modified/recoded
	 * 					mlen: NUMBER   // the length of the un-modified string (i.e. before recoding)
	 * 				}
	 * 				</pre>
	 * 				where Token:
	 * 				<pre>
	 * 				{
	 * 					i: NUMBER, // the index of the token w.r.t. to the input string
	 * 					tok: STRING, // the (recoded/modified) token
	 * 				}
	 * 				</pre>
	 * @private
	 */
	var setRecodedVal = function(recodedVal, origVal, obj, pname, recodedPositions){

		var recVal;
		if(typeof recodedVal === 'string'){
			recVal = recodedVal;
		} else if(typeof recodedVal !== 'undefined' && typeof recodedVal.str === 'string'){
			recVal = recodedVal.str;
		}

		//only set, if there was a recoding:
		if(typeof recVal !== 'undefined' && typeof recVal === 'string'){

			if(origVal !== recVal){
				//set recoded value
				var str = recVal;
				obj[pname] = str;
			}

			//special treatment for token-objects, i.e.
			// {
			//	tok: STRING,
			//	i: NUMBER
			// }
			//
			// -> store some information for recalculating the index, in case tokens were recoded
			if(pname === 'tok' && typeof obj.i === 'number'){

//				var offset = 0;
//				var pos;
//				for(var i=recodedVal.pos.length-1; i >= 0; --i){
//					pos = recodedVal.pos[i];
//					offset += pos.mlen - pos.len;
//				}
				var modLen = origVal.length;// offset + str.length;
//				if(offset + str.length !== origVal.length){
//					console.error('ERROR: unexpected length!!!!');
//				}

//				obj.len = origVal.length - offset;
//				if(obj.len !== obj.tok.length){
//					console.error('ERROR: unexpected length!!!!');
//				}

				if(recodedPositions){
					recodedPositions.push({target: obj, mlen: modLen});//, i: start});//recodedVal);
				}
			}
		}
	};

	/**
	 * HELPER for adjusting the index-information in token-objects of an SemanticResult
	 *        (w.r.t. recoded tokens).
	 *
	 * @param {Array} recodedPositions
	 * 			the list with modification information w.r.t. the tokens (as created by setRecodedVal)
	 *
	 * @see #setRecodedVal
	 * @private
	 */
	var recalculatePos = function(recodedPositions){
		if(recodedPositions && recodedPositions.length > 0){

//			console.log('__________RECODE_pre-sort__'+JSON.stringify(recodedPositions));//FIXM DEBUG

			recodedPositions.sort(sortPosFunc);

//			console.log('__________RECODE_post-sort_'+JSON.stringify(recodedPositions));//FIXM DEBUG

			var repos, token;
			var offset = 0;
			for(var i=0, size = recodedPositions.length; i < size; ++i){
				repos = recodedPositions[i];
				token = repos.target;
				token.i -= offset;
				offset += repos.mlen - token.tok.length;
			}
		}
	};

	/**
	 * Recursive processing for an object / recoding a JSON-like object.
	 * NOTE: the recoding happens "in-place", i.e. the object itself is modified
	 *
	 * See doc of recodeJSON() for details w.r.t. the arguments
	 *
	 * NOTE: argument recodedPositions is an internal (OPITONAL) parameter
	 *       that is used when recoding SemanticResult objects (applied grammar)
	 *
	 * @returns {PlainObject} the object where its string-values are recoded
	 * @private
	 */
	var processJSON = function(obj, recodeFunc, isMaskValues, isMaskNames, recodedPositions){

		//different treatments for: STRING, ARRAY, OBJECT types (and 'REST' type, i.e. all others)
		if(typeof obj === 'string' && isMaskValues){
			//STRING: encode the string
			return recodeFunc.call(this, obj, true);
		}
		else if( isArray(obj) ) {
			//ARRAY: process all entries:
			for(var i=0, size = obj.length; i < size; ++i){

				var pv = obj[i];

				var pvn = processJSON.call(this, pv, recodeFunc, isMaskValues, isMaskNames, recodedPositions);
				setRecodedVal(pvn, pv, obj, i, recodedPositions);
			}

			return obj;
		}
		else if(obj === null) {//NOTE null is typeof object!
			return null;
		}
		else if(typeof obj === 'object') {
			//OBJECT: process all the object's properties (but only, if they are not inherited)
			for(var p in obj){
				if(obj.hasOwnProperty(p)){

					var pv = obj[p];

					//special treatment for token-lists, i.e. elements like:
					//
					// phrases: {
					//   token1:[
					//	 {
					//		tok: STRING,
					//		i: NUMBER
					//	 },
					//	 ...
					//  ]
					//  token2:
					//	 ...
					// }
					//
					// -> create list for storing some information for recalculating the index, in case tokens were recoded
					var isCalcPos = false;
					if(!recodedPositions && p === 'phrases' && typeof pv === 'object' && pv){// typeof pv.i === 'number' && typeof pv.tok === 'string'){
						isCalcPos = true;
						recodedPositions = [];
					}

					var pvn = processJSON.call(this, pv, recodeFunc, isMaskValues, isMaskNames, recodedPositions);
					setRecodedVal(pvn, pv, obj, p, recodedPositions);

					if(isCalcPos){
						recalculatePos(recodedPositions);
						recodedPositions = void(0);
					}

					//if the property-name should also be encoded:
					if(typeof p === 'string' && isMaskNames){

						var masked = recodeFunc.call(this, p);
						if(masked && typeof masked.str === 'string' && masked.str !== p){
							obj[masked.str] = obj[p];
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
		//evaluate arguments:
		if(typeof isMaskValues === 'undefined'){
			isMaskValues = this.maskValues;
		}
		if(typeof isMaskNames === 'undefined'){
			isMaskNames = this.maskNames;
		}

		return processJSON.call(this, json, recodeFunc, isMaskValues, isMaskNames);
	};

})(isArray);//<- dependency util/isArray


return GrammarConverter;

});//END: define(..., function(){
