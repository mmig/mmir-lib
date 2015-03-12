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
 * A Utility class for parsing (eHTML) templates.<br>
 * 
 * @example <code>mmir.ParserUtils.getInstance()</code>
 * @class ParserUtils
 * @category parser
 * 
 * @see mmir.parser.ParserUtils#constructor
 */
//mmir.parser.ParserUtils = (function(){});


//(function ( mmir ) {

define([ 'parserModule', 'parsingResult', 'templateProcessor'
        , 'templateLexer', 'ES3Lexer', 'ES3Parser', 'contentLexer', 'contentParser'
        , 'scriptLexer', 'scriptParser', 'antlr3'
    ], 
    
    /**
     * Utility functions for parsing templates (and template elements, e.g. JS-parts of template expressions)
     * 
     * @class
     * @name ParserUtils
     * @memberOf mmir.parser
     * @static
     * 
     * @public
     */
    function( parser, ParsingResult, templateProcessor
    	, MmirTemplateLexer, ES3Lexer, ES3Parser, MmirScriptContentLexer, MmirScriptContentParser
    	, MmirScriptLexer, MmirScriptParser, org
){

	////////////////////////////////////helper for debugging / printing error details ////////////////////////

	/**
	 * -2: internal debug
	 * -1: interanl info
	 *  0: debug
	 *  1: info
	 *  2: warn
	 *  3: error
	 * TODO make this set-able (export getter/setter? use configurationManager?)
	 * 
	 * @private
	 * @memberOf ParserUtils#
	 */
	var errorLevel = 2;
	

	/**
	 * HELPER print internal debug messages during parsing (VERY VERBOSE)
	 * 
	 * @private
	 * @memberOf ParserUtils#
	 */
	function _print(msg){//FIXME
		if ( errorLevel <= -2 ) console.log(msg);
	};
	parser.print = _print;

	/**
	 * HELPER print internal, informational messages during parsing (VERBOSE)
	 * 
	 * @private
	 * @memberOf ParserUtils#
	 */
	function _printInfo(prefix, msg){//FIXME
		if (  errorLevel <= -1 ) console.info(parser.parserCreatePrintMessage(prefix,msg));
	};
	parser.printInfo = _printInfo;

	/**
	 * HELPER print debug messages during parsing
	 * 
	 * @private
	 * @memberOf ParserUtils#
	 */
	function _parserPrintDebug(prefix, msg, source){//FIXME
		if (  errorLevel <= 0  ) console.debug(parser.parserCreatePrintMessage(prefix,msg, source));
	};
	parser.parserPrintDebug = _parserPrintDebug;

	/**
	 * HELPER print informational messages during parsing
	 * 
	 * @private
	 * @memberOf ParserUtils#
	 */
	function _parserPrintInfo(prefix, msg, source){//FIXME
		if (  errorLevel <= 1  ) console.info(parser.parserCreatePrintMessage(prefix,msg, source));
	};
	parser.parserPrintInfo = _parserPrintInfo;
	
	/**
	 * HELPER print warnings during parsing
	 * 
	 * @private
	 * @memberOf ParserUtils#
	 */
	function _parserPrintWarning(prefix, msg, source){//FIXME
		if (  errorLevel <= 2  ) console.warn(parser.parserCreatePrintMessage(prefix,msg, source));
	};
	parser.parserPrintWarning = _parserPrintWarning;

	/**
	 * HELPER print errors during parsing
	 * 
	 * @private
	 * @memberOf ParserUtils#
	 */
	function _parserPrintError(prefix, msg, source){
		if (  errorLevel <= 3  ) console.error(parser.parserCreatePrintMessage(prefix,msg, source));
	};
	parser.parserPrintError = _parserPrintError;
	
	/**
	 * HELPER: attach internal print-functions to all classes (ie. prototypes) in the list
	 * 
	 * @private
	 * @memberOf ParserUtils#
	 */
	var _attachInternalPrintFunc = function(list){
		var _prototype;
		for(var i=0, size=list.length; i < size; ++i){
			_prototype = list[i].prototype;
			_prototype.printInfo  = parser.printInfo;
			_prototype.printDebug = parser.print;
		}
	};
	
	//attach the internal debug/print functions to all lexers/parsers:
	// (-> see import-list in define() above)
	_attachInternalPrintFunc([
		MmirTemplateLexer, ES3Lexer, ES3Parser, MmirScriptContentLexer, MmirScriptContentParser
		, MmirScriptLexer, MmirScriptParser
	]);
	
	/**
	 * @type View
	 * @private
	 * @memberOf ParserUtils#
	 */
	var _currentParsedView = null;//FIXME make this an argument in the printXXX functions (e.g. the current mechanism will not work, if templates are parsed concurrently/in parallel/using threads)
	
	/**
	 * Creates a message with parsing-information.
	 * 
	 * In case the <code>msg</code> is an error message containing relative/incorrect location information,
	 * an heuristic will be used to fix the location information; in addition the references location
	 * will be extracted from the source-String and a "pointer-String" will be generated, e.g.
	 * <pre>
	 * 	source:   "  	@{  mmmm.['sd']=wer ;}@"
	 * 	pointer:  "  	        ^"
	 * </pre>
	 * 
	 * @function
	 * @param {String} prefix
	 * 					a prefix for the message
	 * @param {String} msg
	 * 					the original message (may contain location-information "line <line_i>:<position_j>")
	 * @param {Object} [tokenSource] OPTIONAL
	 * 					the token-source, from where the error/message was triggered
	 * 					If the argument has the field <code>tokenSource.offset</code> (Number)
	 * 					 if will be used to correct/fix the location information in the original message.
	 * 					If the argument has the fields <code>tokenSource.start</code> (Number) and
	 * 					 <code>tokenSource.end</code> (Number), then this will be used to correct/fix
	 * 					 the location information in the original message text.
	 * @param {Object} [viewObj] OPTIONAL
	 * 					currently not used!
	 * 					(will replace _currentParsedView in the future!)
	 * 
	 * @private
	 * @memberOf ParserUtils#
	 */
	var parserCreatePrintMessage = (function(){//return function(prefix, msg, tokenSource, viewObj)
		
		/**
		 *
		 * Get the index in the String str, where line number lineNo
		 * starts.
		 * 
		 * New lines begin after \n, \r\n, or \r.
		 * 
		 * If lineNo is <= 1, the function returns always 0.
		 * 
		 * If the lineNo is greater than the count of lines in str, the string length itself is returned. 
		 * 
		 * <p>
		 * NOTE used by {@link #parserCreatePrintMessage}
		 * 
		 * @function
		 * @param {String} str the string
		 * @param {Number} lineNo the line number (first line is 1)
		 * 
		 * @private
		 * @memberOf ParserUtils.parserCreatePrintMessage
		 */
		var getIndexForLine = (function(){
			
			var detectLinebreak = /(\r?\n|\r)/igm;
			
			return function(str, lineNo){
				if(lineNo <= 1){
					return 0;
				}
				var match;
				var count = 1;
				while(match = detectLinebreak.exec(str)){
					//ASSERT: lineNo >= 2
					if(++count == lineNo){
						break;
					}
				}
				
				//reset regexpr:
				detectLinebreak.lastIndex = 0;
				
				if(match){
					return match.index + match[1].length;
				}
				
				//request line-no. >= 2 AND loop "detect enough" linebreaks => the request line index starts after strings ends => return string's length
				return str.length;
			};
		})();//END getIndexForLine

		/**
		 *
		 * Get the line in the String str, in which the char at index is included.
		 * 
		 * New lines begin after \n, \r\n, or \r,
		 * e.g. for line X: 
		 * <pre>
		 *  ...\r\n
		 *        ^
		 * </pre>
		 * the line number will be X (i.e. the line-break itself is still included in the current line).
		 * <p>
		 * If index is < 0, the function returns always 1.
		 * <p>
		 * If the index is greater than str.length, -1 is returned.
		 * <p>
		 * NOTE used by {@link #extractErrorPosition}
		 * 
		 * @function
		 * @param {String} str the string
		 * @param {Number} index the char index for which to find the line number (first line is 1)
		 * 
		 * @private
		 * 
		 * @memberOf ParserUtils.parserCreatePrintMessage
		 * 
		 */
		var getLineForIndex = (function(){
			
			var detectLinebreak = /(\r?\n|\r)/ig;
			
			return function(str, index){
				if(index < 0){
					return 1;
				}
				if(index >= str.length){
					return -1;
				}
				//ASSERT index is at least within line 1
				var match;
				var count = 1;
				var isNextLineFound = false;
	            var currentPos = -1;
	            var lastPos = 0;
				while(match = detectLinebreak.exec(str)){
	                currentPos = match.index + match[1].length;
					if(currentPos > index){
						isNextLineFound = true;
						break;
					}
	                lastPos = currentPos;
					++count;
				}
				
				//reset regexpr:
				detectLinebreak.lastIndex = 0;
				            
				return {
					line : count,
					index: index - lastPos
				};
			};
		})();//END getLineForIndex

		/**
		 * 
		 * NOTE used by {@link #parserCreatePrintMessage}
		 * 
		 * @private
		 * @function
		 * @memberOf ParserUtils.parserCreatePrintMessage
		 */
		var extractErrorPosition = (function(){
			
			var detectLineNo = /line (\d+):(-?\d+)/i;
			
			return function extractErrorPositionImpl(msg, offset, originalContent, tokenSource){
//				console.log('\nTEST1_extractErrorPositionImpl with arguments '+arguments.length+'\n');
				
				var result = detectLineNo.exec(msg);
				
				//reset regexpr:
				detectLineNo.lastIndex = 0;
				
//				console.log('\nTEST2_result for "'+msg+'": '+result+'\n');
				var pos = null;
				if(result){
					
					var line = parseInt(result[1],10);
					var index = parseInt(result[2],10);
					
					var isCorrected = false;
					
					if(tokenSource){
						
						//if we have "invalid" position-info.:
						//  -> the error probably occured at the very beginning of the parsed expression
						//  -> try to extract position from parent parser/lexer
						if(line === 0 || index === -1){
							line  = tokenSource.getLine();
							index = tokenSource.getCharPositionInLine();
						}
						
						//if there is an offest supplied by the tokenSource -> use it:
						if(tokenSource.offset){
							
							var iOffset = tokenSource.offset;
//							if(line === 1){
//								//
//								//this position information is derived from a script-eval (-> ConentElement.ScriptEvalError)
//								// -> need to increase offset by 1 or 2, since all script-elements have
//								//    an additional, internal offset of 1 or 2 (this is only an heuristical value...)
//								// e.g. @( ...
//								//      @{ ...
//								//   @for( ...
//								iOffset += 2;
//							}
							
							var contentOffset = getLineForIndex(originalContent, iOffset);
							
							//if it is "relatively" the first line, we need to adjust to index 
							//   (i.e. the position within the line)
							if(line === 1){
								index += contentOffset.index;
							}
							
							//adjust the line, i.e. make "relative" -> "absolute" line number
							line += contentOffset.line - 1;
							
							isCorrected = true;
						}
						
					}
					
					pos = {
							line: line,
							index: index
					};
//					console.log('\nTEST3_pos: '+JSON.stringify(pos)+', offset: '+offset+'\n');
					
					if(offset && offset !== 0){
//						console.log('\nTEST4_offset: '+offset+'\n');
						
						var newLine = line;
						var newIndex = index;
						if( ! isCorrected){
							var lineOffset = getLineForIndex(originalContent, offset);
							if(line < 2){
								newIndex = lineOffset.index + index;
								pos.originalIndex = index;
								pos.index = newIndex;
							}
							newLine = lineOffset.line + line - 1;
							pos.originalLine = line;
							pos.line = newLine;
						}
						
						var fixed = msg.substring(0,result.index + 'line '.length) + newLine + ':' + newIndex + msg.substring(result.index + result[0].length);
						pos.text = fixed;
//						pos.originalContent = originalContent;
//						pos.offset = offset + pos.index;
					}
					else {
						pos.text = msg;
					}
				}
				else if(tokenSource && tokenSource.start && tokenSource.end){
					
					pos = getLineForIndex(originalContent, tokenSource.start);
					pos.text = ' near /';
				}
				
				return pos;
			};
		})();//END extractErrorPosition
		
		/**
		 * Create a message for parsing-information.
		 * 
		 * In case the <code>msg</code> is an error message containing relative/incorrect location information,
		 * an heuristic will be used to fix the location information; in addition the references location
		 * will be extracted from the source-String and a "pointer-String" will be generated, e.g.
		 * <pre>
		 * 	source:   "  	@{  mmmm.['sd']=wer ;}@"
		 * 	pointer:  "  	        ^"
		 * </pre>
		 * 
		 * @private
		 * 
		 * @param {String} prefix
		 * 					a prefix for the message
		 * @param {String} msg
		 * 					the original message (may contain location-information "line <line_i>:<position_j>")
		 * @param {Object} [tokenSource] OPTIONAL
		 * 					the token-source, from where the error/message was triggered
		 * 					If the argument has the field <code>tokenSource.offset</code> (Number)
		 * 					 if will be used to correct/fix the location information in the original message.
		 * 					If the argument has the fields <code>tokenSource.start</code> (Number) and
		 * 					 <code>tokenSource.end</code> (Number), then this will be used to correct/fix
		 * 					 the location information in the original message text.
		 * @param {Object} [viewObj] OPTIONAL
		 * 					currently not used!
		 * 					(will replace _currentParsedView in the future!)
		 */
		return function parserCreatePrintMessageImpl(prefix, msg, tokenSource, viewObj){//FIXME
			var currentView = _currentParsedView;
			if(currentView != null){
				
				var rootView = null;
				var details = '';
				if(currentView.getController){
					details += 'CTRL("' + currentView.getController().getName() + '")';
				}
				
				if(currentView.getView){
					if(details.length > 0){
						details += '->';
					}
					details += 'VIEW("' + currentView.getView().getName() + '")';
					rootView = currentView.getView();
				}
				
				if(details.length > 0){
					details += '->';
				}
				details += currentView.constructor.name;
				
				if(currentView.getName){
					details += '("' + currentView.getName() + '")';
				}
				
				if(rootView && typeof currentView.getStart !== 'undefined'){
					
					var pos = extractErrorPosition(msg, currentView.getOffset(), rootView.getDefinition(), tokenSource);
		//			console.log('\nTEST_A_pos: '+JSON.stringify(pos)+', offset: '+currentView.getStart() +'\n');
					if(pos){
		
						msg = pos.text;
						
						//msg += '\n\t at line '+pos.line+', index '+pos.index;
						var content = rootView.getDefinition();
						var line = null;
						var offset = currentView.getStart();
		
						
						if(content){
							var start = getIndexForLine(content, pos.line);
							var end = start;
							var len = content.length;
							while(end < len && (content[end] != '\r' && content[end] != '\n')){
								++end;
							}
							
							line = content.substring(start,end);
						}
						
						if(line){
							
							//marker for "pointing" the error
							var marker = [];
							for(var i=0; i < pos.index; ++i){
								if(line[i] == '\t'){
									//need to include tabs themselves, since they
									//  take more than 1 char-positions when displayed:
									marker.push('\t');
								}
								else {
									marker.push(' ');
								}
							}
							//add marker symbol, that points to error in the line above:
							marker.push('^');
			
							msg += ' at line '+pos.line+':';
							msg += '\n "'+line+'"';        //<- the line with the error
							msg += '\n  '+marker.join(''); //<- the marker line (will only be correctly aligned for fixed-width fonts)
						}
					}
				}
				
				return prefix + 'in ' + details + ' - ' + msg;
			}
			else {
				return prefix+msg;
			}
		};//END parserCreatePrintMessage
		
	})();//END var parserCreatePrintMessage = ...
	
	parser.parserCreatePrintMessage = parserCreatePrintMessage; 
	
	//////////////////////////////////// END: helper for debugging, error details etc. ////////////////////////

		/**
	     * Object containing the instance of the class ParserUtils 
	     * 
	     * @type ParserUtils
	     * @private
	     * 
	     * @memberOf ParserUtils#
	     */
	    var instance = null;

	    /**
		 * @private
	     * @memberOf ParserUtils#
	     */
	    var isDebug = true;//TODO read/set from configuration
	    
	    MmirTemplateLexer.prototype.emitErrorMessage = function(msg) {
	    	parser.parserPrintError('[ERROR] TemplateLexer: ', msg, this);
		};
//		MmirTemplateParser.prototype.emitErrorMessage = function(msg) {
//			parser.parserPrintError('[ERROR] TemplateParser: ',msg);
//		};
		
		ES3Lexer.prototype.emitErrorMessage = function(msg) {
			parser.parserPrintError('[ERROR] JavaScriptLexer_ES3: ', msg, this);
		};
		ES3Parser.prototype.emitErrorMessage = function(msg) {
			parser.parserPrintError('[ERROR] JavaScriptParser_ES3: ', msg, this.getTokenStream().getTokenSource());
		};
		
		MmirScriptLexer.prototype.emitErrorMessage = function(msg) {
			var mode = this.isStatementMode()? 'Statement' : 'Block';
			parser.parserPrintError('[ERROR] Script'+mode+'Lexer: ',msg, this);
		};
		MmirScriptParser.prototype.emitErrorMessage = function(msg) {
			parser.parserPrintError('[ERROR] ScriptParser: ',msg, this.getTokenStream().getTokenSource());
		};
		
		MmirScriptContentLexer.prototype.emitErrorMessage = function(msg) {
			parser.parserPrintError('[ERROR] ContentLexer: ',msg, this);
		};
		MmirScriptContentParser.prototype.emitErrorMessage = function(msg) {
			parser.parserPrintError('[ERROR] ContentParser: ',msg, this.getTokenStream().getTokenSource());
		};
		
		/**
		 * @private
	     * @memberOf ParserUtils#
		 */
		function internalParse(text) {

		    var input = new org.antlr.runtime.ANTLRStringStream(text);//FIXME change, how dependency 'antlr3' is exported?
		  	var lexer = new MmirTemplateLexer(input);
		  	
		  	lexer.isDebug = isDebug;
		  	
		  	var tokens = new org.antlr.runtime.CommonTokenStream(lexer);//FIXME change, how dependency 'antlr3' is exported?

			var result 				= new Object();
			result.rawTemplateText 	= tokens.toString();
			result.scripts 			= lexer.includeScripts;
			result.styles 			= lexer.includeStyles;
			result.localizations 	= lexer.locales;
			result.ifs	 			= lexer.ifs;
			result.fors 			= lexer.fors;
			result.yields 			= lexer.yields;
			result.contentFors 		= lexer.yieldContents;
			result.helpers	 		= lexer.helpers;
			result.partials 		= lexer.renderPartials;
			result.escapes	 		= lexer.escape;
			result.scriptStatements	= lexer.scriptStatements;
			result.scriptBlocks		= lexer.scriptBlocks;
			result.vars				= lexer.vars;
			result.comments			= lexer.comments;
			//end: parsing results
			
			
			lexer = null;
			
			return result;
		}
		
		/**
		 * @private
	     * @memberOf ParserUtils#
		 */
		function internalParseJS(text, entryRuleName, offset) {
		  	
		  	var input = new org.antlr.runtime.ANTLRStringStream(text);
		  	var lexer = new ES3Lexer(input);
		  	lexer.isDebug = isDebug;
		  	lexer.offset = offset;
		  	
		  	var tokens = new org.antlr.runtime.CommonTokenStream(lexer);
			var parser = new ES3Parser(tokens);
			parser.offset = offset;
			
			if(!entryRuleName){
//			var parseResult = 
				parser.program();//<- parse with main rule 'program' in ES3Parser
			}
			else {
//				var parseResult = 
					parser[entryRuleName]();//<- parse with main rule 'program' in ES3Parser
			}
			var result 				= new Object();
			result.rawTemplateText 	= tokens.toString();
			
			var varRefs = parser.getVarReferences();
			if(varRefs){
				result.varReferences = varRefs;
			}
			
			//TODO handle potentially global var-declaration (i.e. assignments without preceding var, where the variable is undefined yet)
			
			//end: parsing results
			
			lexer = null;
			parser = null;
			
			return result;
		}
		
//		var getVarReferences = function(parser){
//			
//			var size = parser.ampersatIdentifiers.length;
//			
//			if(size === 0){
//				return null;
//			}
//			
//			var varRefs = new Array(size);
//			for(var i=0; i < size; ++i){
//				var ref = parser.ampersatIdentifiers[i];
//				
//				var refObj = new mmir.parser.ParsingResult(ref);
////				refObj.start = ref.start;
//				
//				//correct end-position (token's stop-index is exactly the last char-index, whereas ParsingResult's end-position is token.stopIndex + 1)
//				refObj.end = refObj.getEnd() + 1;
//				
//				refObj.type = mmir.parser.element.VAR_REFERENCE;
//				
//				varRefs[i] = refObj;
//			}
//			return varRefs;
//		};
		
	    /**
		 * Constructor-Method of Singleton mmir.parser.ParserUtils
		 * 
		 * @constructs ParserUtils
		 * @memberOf ParserUtils.prototype
		 * @private
		 * @ignore
		 * 
		 */
	    function constructor(){
	        //private members (currently none)
	    	
	    	/** @lends ParserUtils.prototype */
	    	return {
	        	//public members:

	    		/**
	    		 * Parse a text as view template (e.g. *.ehtml files). 
	    		 * 
	    		 * @param {String} rawTemplateString the text that should be parsed
	    		 * @param {Object} [view] (optional) the view to which the <tt>rawTemplateString</tt> belongs (only used for error messages)
	    		 * @returns {mmir.parser.ParsingResult} the parsing result
	    		 * 
	    		 * @public
	    		 * @memberOf mmir.parser.ParserUtils.prototype
	    		 */
	    		parse: function(rawTemplateString, view){
	    			
	    			if(view){
	    				_currentParsedView = view;
	    			}
	    			else {
	    				_currentParsedView = null;
	    			}
	    			
	    			return internalParse(rawTemplateString);
	    		},
	    		
	    		/**
	    		 * Parse a text as JavaScript.
	    		 * 
	    		 * @param {String} rawTemplateString the text that should be parsed
	    		 * @param {String} [parseEntryRuleName] (optional) specifies the JavaScript element that should be parsed for
	    		 * @param {Object} [view] (optional) the view to which the <tt>rawTemplateString</tt> belongs (only used for error messages)
	    		 * @returns {mmir.parser.ParsingResult} the parsing result
	    		 * 
	    		 * @public
	    		 */
	    		parseJS: function(rawTemplateString, parseEntryRuleName, view, inViewOffset){
	    			
	    			//in case only 2 or 3 arguments are present: is 2nd the View object?
	    			if(!inViewOffset && typeof parseEntryRuleName !== 'string' && typeof parseEntryRuleName === 'object'){
	    				
	    				if(typeof view === 'number'){
	    					inViewOffset = view;
	    				}
	    				
	    				view = parseEntryRuleName;
	    				parseEntryRuleName = null;
	    				
	    				
	    			}
	    			
	    			if(view){
	    				_currentParsedView = view;
	    			}
	    			else {
	    				_currentParsedView = null;
	    			}
	    			
	    			return internalParseJS(rawTemplateString, parseEntryRuleName, inViewOffset);
	    		}
	    	};//END: return{}
	    	
	    }//END: constructor()
	    
	    instance = new constructor();

	    /**
	     * @deprecated instead, use ParseUtils object directly (i.e. omit getInstance() call)
	     * 
		 * @function
		 * @name getInstance
		 * 
   		 * @public
	     * @memberOf ParserUtils#
	     */
	    instance.getInstance = function(){
	    	return this;
	    };
	    
	    //FIXME should the renderer be exported to parser.ParserUtils here?
	    parser.ParserUtils = instance;
	    
	    return instance;
		
	});//END define(..., function(){


