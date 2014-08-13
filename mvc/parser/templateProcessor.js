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

	
define([	  'core', 'commonUtils', 'parserModule', 'parsingResult'
        	, 'ES3Lexer', 'ES3Parser', 'contentLexer', 'contentParser'
        	, 'scriptLexer', 'scriptParser', 'antlr3'
        ], function ( 
        	  mmir, commonUtils, parser, ParsingResult
        	, ES3Lexer, ES3Parser, MmirScriptContentLexer, MmirScriptContentParser
        	, MmirScriptLexer, MmirScriptParser, org
){//hidden dependency: templateParserUtils (for parser.printInfo

		//TODO move to separate file (extension-file):
		//START extensions
		/**
		 * @memberOf ES3Parser.prototype
		 */
		ES3Parser.prototype.getVarReferences = function(){
			
			var size = this.ampersatIdentifiers.length;
			
			if(size === 0){
				return null;
			}
			
			var varRefs = new Array(size);
			for(var i=0; i < size; ++i){
				var ref = this.ampersatIdentifiers[i];
				
				var refObj = new ParsingResult(ref);
	//			refObj.start = ref.start;
				
				//correct end-position (token's stop-index is exactly the last char-index, whereas ParsingResult's end-position is token.stopIndex + 1)
				refObj.end = refObj.getEnd() + 1;
				
				refObj.type = parser.element.VAR_REFERENCE;
				
				varRefs[i] = refObj;
			}
			return varRefs;
		};
		//END extensions
	
		var parserModule = parser;
		/**
		 * "Processor" for the template parse-results:
		 * 
		 * This function is used by the generated (antlr) parsers.
		 * 
		 * @name mmir.parser.TemplateProcessor
		 * @class
		 */
		parser.extendMmirTemplateProcessor = function(theLexerInstance) {

			/** @scope mmir.parser.TemplateProcessor.prototype */
			/**
			 * #@+
			 * @memberOf mmir.parser.TemplateProcessor.prototype
			 */
			
			theLexerInstance.INTERNAL_INCLUDE_SCRIPT 	= parser.element.INCLUDE_SCRIPT;
			theLexerInstance.INTERNAL_INCLUDE_STYLE 	= parser.element.INCLUDE_STYLE;
			theLexerInstance.INTERNAL_LOCALIZE 			= parser.element.LOCALIZE;
			theLexerInstance.INTERNAL_YIELD_DECLARATION = parser.element.YIELD_DECLARATION;
			theLexerInstance.INTERNAL_YIELD_CONTENT 	= parser.element.YIELD_CONTENT;
			theLexerInstance.INTERNAL_BLOCK 			= parser.element.BLOCK;
			theLexerInstance.INTERNAL_STATEMENT 		= parser.element.STATEMENT;
			theLexerInstance.INTERNAL_HELPER 			= parser.element.HELPER;
			theLexerInstance.INTERNAL_IF 				= parser.element.IF;
			theLexerInstance.INTERNAL_ELSE 				= parser.element.ELSE;
			theLexerInstance.INTERNAL_FOR 				= parser.element.FOR;
			theLexerInstance.INTERNAL_RENDER 			= parser.element.RENDER;
			theLexerInstance.INTERNAL_ESCAPE_ENTER		= parser.element.ESCAPE_ENTER;
			theLexerInstance.INTERNAL_ESCAPE_EXIT 		= parser.element.ESCAPE_EXIT;
			
			theLexerInstance.INTERNAL_FOR_TYPE_ITER		= parser.element.FOR_TYPE_ITER;
			theLexerInstance.INTERNAL_FOR_TYPE_STEP		= parser.element.FOR_TYPE_STEP;

			theLexerInstance.INTERNAL_VAR_DECLARATION   = parser.element.VAR_DECLARATION;
			theLexerInstance.INTERNAL_VAR_REFERENCE     = parser.element.VAR_REFERENCE;
			
			theLexerInstance.INTERNAL_COMMENT           = parser.element.COMMENT;

			//"shortcut" for accessing the IF-type
			var IF_TYPE = theLexerInstance.INTERNAL_IF;
			
			//internal "static" definitions for parsing mode/type
			theLexerInstance.PARSER_SCRIPT_BLOCK 	= 0;
			theLexerInstance.PARSER_SCRIPT_STATMENT = 2;
			theLexerInstance.PARSER_SCRIPT_CONTENT 	= 4;
			theLexerInstance.PARSER_JS_CODE	 		= 8;
			
			theLexerInstance.isDebug = true;
			
			theLexerInstance.SCRIPT_CHANNEL = 1;
			//theLexerInstance.nesting = 0;
			
			theLexerInstance.scriptBlocks = new Array();
			theLexerInstance.scriptStatements = new Array();
			theLexerInstance.includeScripts = new Array();
			theLexerInstance.includeStyles = new Array();
			theLexerInstance.locales = new Array();
			theLexerInstance.helpers = new Array();
			theLexerInstance.renderPartials = new Array();

			theLexerInstance.escape = new Array();
			
			theLexerInstance.ifs = new Array();
			theLexerInstance.fors = new Array();
			
			theLexerInstance.yields = new Array();
			theLexerInstance.yieldContents = new Array();
			
			theLexerInstance.vars = new Array();
			theLexerInstance.comments = new Array();
			
			theLexerInstance.lastParsedElement =  null;
			
			var isArray = commonUtils.isArray;
			
			var getTokenName = (function(){
				
				var _jsTokens = null;
				
				return function getTokenNameImpl(tokenType, parser){
			
					if(!_jsTokens){
						_jsTokens = parser.getTokenNames();
					}
					return _jsTokens[tokenType];
				};
				
			})();
			//theLexerInstance.getTokenName = getTokenName;
			
			function getFirstChild(treeNode, strChildType, parser){
				var type = getTokenName(treeNode.getType(), parser);
				if(type === strChildType){
					return treeNode;
				}
				else {
					if(treeNode.getChildCount() === 0){
						return null;
					}
					else {
						for(var i = 0, size = treeNode.getChildCount(); i < size; ++i){
							var result = getFirstChild(treeNode.getChild(i), strChildType, parser);
							if(result !== null){
								return result;
							}
						}
						return null;
					}
				}
			}
			
			function extractBoundries(subTree, buffer){
				
				var start = subTree.getToken().getStartIndex();
				if(typeof start === 'number' && start !== -1){
					if(!buffer){
						buffer ={
								start: null,
								stop: null
						};
					}
					
					if(buffer.start == null || start < buffer.start){
						buffer.start = start;
					}
					var end = subTree.getToken().getStopIndex();
					if(buffer.end == null || end > buffer.end){
						buffer.end = end;
					}
				}
				
				if(subTree.getChildCount() === 0){
					return buffer;
				}
				else {
					for(var i = 0, size = subTree.getChildCount(); i < size; ++i){
						buffer = extractBoundries(subTree.getChild(i), buffer);
					}
					return buffer;
				}
			}
			
			function getBoundries(treeNode){
				
				return {
					start : treeNode.getToken().getStartIndex(),
					end   : treeNode.stopIndex +1
				};
			}
			
			function getStringFor(boundriesObj, tokens, offset){
				
				if(!boundriesObj){
					return '';
				}
				
				var start = boundriesObj.start - offset;
				var end = boundriesObj.end - offset;  
				return tokens.toString().substring(start,end+1);
				
			}
			
			function getStringForSubTree(treeNode, tokens, offset){
				
				var start = treeNode.getToken().getStartIndex() - offset;
				var end = treeNode.stopIndex - offset;  
				return tokens.toString().substring(start,end+1);
				
			}
			
			function createJSObjectFrom(parseElement, parentObject, parser){
				
				var type = getTokenName(parseElement.getType(), parser);
				if('StringLiteral' === type){
					var str = parseElement.getText();
					return str.substring(1,str.length - 1);
				}
				else if ( 'NAMEDVALUE' === type ){
					
					var name = createJSObjectFrom(parseElement.getChild(0), null, parser);
					
					var value = createJSObjectFrom(parseElement.getChild(1), null, parser);
					
					if(!parentObject){
						parentObject = new Object();
					}
					
					parentObject[name] = value;
					
					return parentObject;
				}
				else if ( 'OBJECT' === type ){
				
					var theValue = new Object();
					var current = null;
					
					for(var data_index = 0, data_size = parseElement.getChildCount(); data_index < data_size; ++ data_index){
						current = parseElement.getChild(data_index);
						theValue = createJSObjectFrom(current, theValue, parser);
					}
					return theValue;
				}
				else if ( 'ARRAY' === type ){
					
					var array_size = parseElement.getChildCount();
					var theValue = new Array();
					var current = null;
					
					for(var array_index = 0; array_index < array_size; ++ array_index){
						current = parseElement.getChild(array_index);
						theValue[array_index] = createJSObjectFrom(current.getChild(0), theValue, parser);
					}
					return theValue;
				}
				else {
					return parseElement.getText();
				}
			}
			//theLexerInstance.createJSObjectFrom = createJSObjectFrom;
			
			function processBlock(parsingObj, result, tokens){
			
				parsingObj.scriptContent = result;
				
				if(!parsingObj.scriptContent){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - BLOCK] WARNING: ','invalid "script block" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.scriptBlocks.push(parsingObj);
				
			}
			theLexerInstance.processBlock = processBlock;
			
			function processStatement(parsingObj, result, tokens){
			
				parsingObj.scriptContent = result;
				
				if(!parsingObj.scriptContent){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - STATEMENT] WARNING: ','invalid "script statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.scriptStatements.push(parsingObj);
				
			}
			theLexerInstance.processStatement = processStatement;
			
			function processIncludeScript (parsingObj, result, tokens, parser){
			
				var tree = result.tree;
				var offset = tokens.tokens[0].getStartIndex();
				
				parsingObj.scriptPathType = getTokenName( tree.getChild(0).getType(), parser);
				parsingObj.scriptPath = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
				
				if(!parsingObj.scriptPath){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - SCRIPT LINK] WARNING: ','invalid "include script statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.includeScripts.push(parsingObj);
				
			}
			theLexerInstance.processIncludeScript = processIncludeScript;
			
			function processIncludeStyle(parsingObj, result, tokens, parser){
			
				var tree = result.tree;
				var offset = tokens.tokens[0].getStartIndex();
				
				parsingObj.stylePathType = getTokenName( tree.getChild(0).getType(), parser);
				parsingObj.stylePath = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
				
				if(!parsingObj.stylePath){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - STYLE LINK] WARNING: ','invalid "include style statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.includeStyles.push(parsingObj);
				
			}
			theLexerInstance.processIncludeStyle = processIncludeStyle;
			
			function processLocalize(parsingObj, result, tokens, parser){
			
				var tree = result.tree;
				var offset = tokens.tokens[0].getStartIndex();
				
				parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
				parsingObj.name = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
				
				if(!parsingObj.name || parsingObj.name.length === 0){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - LOCALIZE] WARNING: ','invalid "localize statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.locales.push(parsingObj);
				
			}
			theLexerInstance.processLocalize = processLocalize;
			
			function processDeclareVar(parsingObj, result, tokens, parser){
				
				var tree = result.tree;
				var offset = tokens.tokens[0].getStartIndex();
				
				parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
				parsingObj.name = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
				
				if(!parsingObj.name || parsingObj.name.length === 0){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - VAR DECLARATION] WARNING: ','invalid "var declaration statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.vars.push(parsingObj);
				
			}
			theLexerInstance.processDeclareVar = processDeclareVar;
			
			function processHelperFunction(parsingObj, result, tokens, parser){
			
				var tree = result.tree;
				var offset = tokens.tokens[0].getStartIndex();
				
				parsingObj.helperType = getTokenName( tree.getChild(0).getType(), parser);
//				parsingObj.helper = createJSObjectFrom(tree.getChild(0), null, parser );
				parsingObj.helper = getStringForSubTree(tree.getChild(0), tokens, offset);
				
				if(tree.getChildCount() === 2){
					parsingObj.dataType = getTokenName( tree.getChild(1).getType(), parser);
//					var param = null;
//					if('OBJECT' === parsingObj.dataType){
//						param = new Object();
//					}
//					parsingObj.dataArg = createJSObjectFrom(tree.getChild(1), param, parser );
					
					parsingObj.dataPos = getBoundries(tree.getChild(1));
					
				}
				
				if(!parsingObj.helper || parsingObj.helper.length === 0){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - HELPER CALL] WARNING: ','invalid "helper function statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.helpers.push(parsingObj);
				
			}
			theLexerInstance.processHelperFunction = processHelperFunction;
			
			function processRenderPartial(parsingObj, result, tokens, parser){
			
				//parsingObj.controllerName = result.controller;
				//parsingObj.partialName = result.partial;
				//parsingObj.arguments = result.arguments;
				
						
				var tree = result.tree;
				var offset = tokens.tokens[0].getStartIndex();
				
				parsingObj.controllerType = getTokenName( tree.getChild(0).getType(), parser);
//				parsingObj.controller = createJSObjectFrom(tree.getChild(0), null, parser );
				parsingObj.controller = getStringForSubTree(tree.getChild(0), tokens, offset);
				
				parsingObj.partialType = getTokenName( tree.getChild(1).getType(), parser);
//				parsingObj.partial = createJSObjectFrom(tree.getChild(1), null, parser );
				parsingObj.partial = getStringForSubTree(tree.getChild(1), tokens, offset);
				
				if(tree.getChildCount() === 3){
					parsingObj.dataType = getTokenName( tree.getChild(2).getType(), parser);
//					var param = null;
//					if('OBJECT' === parsingObj.dataType){
//						param = new Object();
//					}
//					parsingObj.dataArg = createJSObjectFrom(tree.getChild(2), param, parser );
					
//					parsingObj.dataArg = getStringForSubTree(tree.getChild(2), tokens, offset);
					parsingObj.dataPos = getBoundries(tree.getChild(2));
					
				}
				
				if(false){//!parsingObj.partialName || parsingObj.partialName.length === 0){ TODO implement check
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - RENDER PARTIAL] WARNING: ','invalid "render partial statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.renderPartials.push(parsingObj);
				
			}
			theLexerInstance.processRenderPartial = processRenderPartial;
			
			function processYieldDeclaration(parsingObj, result, tokens, parser){
			
				var tree = result.tree;
				var offset = tokens.tokens[0].getStartIndex();
				
				parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
				parsingObj.name = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
				
				if(!parsingObj.name || parsingObj.name.length === 0){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - YIELD DECLARATION] WARNING: ','invalid "yield declaration" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.yields.push(parsingObj);
				
			}
			theLexerInstance.processYieldDeclaration = processYieldDeclaration;

			function processYieldContentParam (parsingObj, result, tokens, parser){
			
				var tree = result.tree;
				var offset = tokens.tokens[0].getStartIndex();
				
				parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
				parsingObj.name = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
				parsingObj.contentOffset = parsingObj.end + 1 + 2;// +2:  "){"
				
				if(!parsingObj.name){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - YIELD CONTENT PARAMETER] WARNING: ','invalid "content for specification" (missing name) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
			}
			theLexerInstance.processYieldContentParam = processYieldContentParam;
			
			function processYieldContent (parsingObj, result, tokens){
			
				parsingObj.content = result;
				
				if(!parsingObj.content){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - YIELD CONTENT] WARNING: ','invalid "content for specification" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.yieldContents.push(parsingObj);
				
			}
			theLexerInstance.processYieldContent = processYieldContent;
			
			function processIfExpr (parsingObj, result, tokens, parser){
			
				//TODO validate expr! (e.g. detect assignments to undeclared variables...)
//				var tree = result.tree;
//				parsingObj.exprType = getTokenName( tree.getChild(0).getType(), parser);
//				parsingObj.expr = createJSObjectFrom(tree.getChild(0), null, parser );
				parsingObj.contentOffset = parsingObj.end + 1 + 2;// +2:  "){"

//				var lastElem = theLexerInstance.lastParsedElement;
				parsingObj.ifExpr = tokens.toString();
				
				if(!parsingObj.ifExpr){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - IF EXPR] WARNING: ','invalid "if statement" (missing expression) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
			}
			theLexerInstance.processIfExpr = processIfExpr;
			
			function processIfContent (parsingObj, result, tokens){
			
				parsingObj.content = result;
				
				if(!parsingObj.content){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - IF CONTENT] WARNING: ','invalid "if statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.ifs.push(parsingObj);
				
			}
			theLexerInstance.processIfContent = processIfContent;
			
			function processElse (parsingObj, result, tokens){
			
				parsingObj.content = result;
				
				if(!parsingObj.content){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - ELSE CONTENT] WARNING: ','invalid "else statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				parsingObj.contentOffset = parsingObj.start + 1;// +1:  "{"
				
				var lastElem = theLexerInstance.lastParsedElement;
				if(lastElem.type !== IF_TYPE){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - ELSE CONTENT] WARNING: ','invalid "else statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					
					throw new org.antlr.runtime.NoViableAltException('invalid else statement: missing preceeding IF!', -1, -1, tokens);
				}
				
				var lastIf = theLexerInstance.ifs[theLexerInstance.ifs.length-1];
				if(lastIf.elseContent){
					
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - ELSE CONTENT] WARNING: ','invalid "else statement" (ELSE already defined) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					
					throw new org.antlr.runtime.NoViableAltException('invalid else statement: too many ELSE definitions - ELSE clause is already defined!', -1, -1, tokens);
				}
				
				lastIf.elseContent = parsingObj;
				//redefine getEnd of the if-element: use end of else-statement
				lastIf.getEnd = function(){
					return this.elseContent.getEnd();
				};
			}
			theLexerInstance.processElse = processElse;
			
			function processForControl (parsingObj, result, tokens, parser){
			
				//TODO validate expr! (e.g. detect assignments to undeclared variables...)
				var tree = result.tree;
				var offset = tokens.tokens[0].getStartIndex();
				
				parsingObj.forControlType = getTokenName( tree.getChild(0).getType(), parser);
				//parsingObj.forControl = createJSObjectFrom(tree.getChild(0), null, parser );
				
				parsingObj.contentOffset =  parsingObj.end + 1 + 2;// +2:  "){"
				
//				parsingObj.forControl = tokens.toString();
				
				if(parsingObj.forControlType === 'FORITER'){
//					parsingObj.forIterationExpr = getFirstChild(tree.getChild(0).getChild(0), 'Identifier', parser).toString();
//					parsingObj.forObjectExpr    = getFirstChild(tree.getChild(0).getChild(1), 'Identifier', parser).toString();
					parsingObj.forControlVarPos = parser.getVarReferences();
					parsingObj.forControlPos  = extractBoundries(tree.getChild(0));
				}
				else {
					//-> type is 'FORSTEP'
					parsingObj.forInitExpr      = getStringFor( extractBoundries(tree.getChild(0).getChild(0)), tokens, offset);
					parsingObj.forConditionExpr = getStringFor( extractBoundries(tree.getChild(0).getChild(1)), tokens, offset);
					parsingObj.forIncrementExpr = getStringFor( extractBoundries(tree.getChild(0).getChild(2)), tokens, offset);
				}
				
//				if(!parsingObj.expr){
//					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - FOR EXPR] WARNING: ','invalid "for statement" (missing control statement) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
//					return;
//				}
			}
			theLexerInstance.processForControl = processForControl;
			
			function processForContent (parsingObj, result, tokens){
			
				parsingObj.content = result;
				
				if(!parsingObj.content){
					if(theLexerInstance.isDebug) parser.parserPrintWarning('[TemplateProcessor - FOR CONTENT] WARNING: ','invalid "for statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
					return;
				}
				
				theLexerInstance.fors.push(parsingObj);
				
			}
			theLexerInstance.processForContent = processForContent;
			
			var getLexerFor = function (self, parserType, input){
				if(self.PARSER_SCRIPT_BLOCK === parserType){
					var scriptLexer = new MmirScriptLexer(input);
					scriptLexer.setBlockMode();
					return scriptLexer;
				}
				else if(self.PARSER_SCRIPT_STATEMENT === parserType){
					var scriptLexer = new MmirScriptLexer(input);
					scriptLexer.setStatementMode();
					return scriptLexer;
				}
				else if(self.PARSER_SCRIPT_CONTENT === parserType){
					return new MmirScriptContentLexer(input);
				}
				else if(self.PARSER_JS_CODE === parserType){
					return new ES3Lexer(input);
				}
				parser.parserPrintWarning('[TemplateProcessor - creating Lexer] WARNING: ','getLexerFor unkonwn parser type '+parserType);
				return null;
			};
			
			var getParserFor = function (self, parserType, tokens){
				if(self.PARSER_SCRIPT_BLOCK === parserType){
					return new MmirScriptParser(tokens);
				}
				else if(self.PARSER_SCRIPT_STATEMENT === parserType){
					return new MmirScriptParser(tokens);
				}
				else if(self.PARSER_SCRIPT_CONTENT === parserType){
					return new MmirScriptContentParser(tokens);
				}
				else if(self.PARSER_JS_CODE === parserType){
					return new ES3Parser(tokens);
				}
				parser.parserPrintWarning('[TemplateProcessor - creating parser] WARNING: ','getParserFor unkonwn parser type '+parserType);
				return null;
			};
			
			var doEnter = function (parserType, self, currentChannel, entryFunc, processFunc, parseResultObject, msg){
				
				if(!entryFunc){
					entryFunc = 'main';
				}
				
				if(!parseResultObject){
					parseResultObject = null;
					if(typeof processFunc !== 'function'){
						msg = processFunc;
						processFunc = null;
					}
				}
				if(!msg){
					msg = '';
				}
				
				if(self.isDebug) theLexerInstance.printDebug('enter embedded '+msg);//debug
				
				var lexer = getLexerFor(self, parserType, self.input);

				lexer.isDebug = self.isDebug;
				var tokens = new org.antlr.runtime.CommonTokenStream(lexer);
				
				
				var result;
				if(parseResultObject){
					result = parseResultObject;
					result.setEndFrom(tokens);
				}
				else {
					result = new ParsingResult(tokens);
				}
				
				if(self.isDebug){//debug
					//alert(msg+'\n'+JSON.stringify(result));
					var start = result.start;//tokens.getTokens()[0].getStartIndex();
					var end = result.end;//tokens.getTokens()[tokens.size()-1].getStopIndex();
					
					theLexerInstance.printInfo(msg+'_tokens('+start+'->'+end+')',tokens);
				}
				
				var parser = getParserFor(self, parserType, tokens);
				
				parser.isDebug = self.isDebug;
				var parseResult = parser[entryFunc]();
						
				if(self.isDebug) theLexerInstance.printDebug(msg+'.'+entryFunc+'() result: >'+parseResult+'<');//debug
				
				if(result.rawResult){
					if(isArray(result.rawResult)){
						result.rawResult.push(rawResults);
					}
					else {
						var rawResults = new Array(2);
						rawResults[0] = result.rawResult;
						rawResults[1] = parseResult;
						result.rawResult = rawResults;
					}
				}
				else {
					result.rawResult = parseResult;
				}
				
				if(parserType === self.PARSER_JS_CODE){
					var varRefs = parser.getVarReferences();
					if(varRefs){
						if(result.varReferences){
							result.varReferences = result.varReferences.concat(varRefs);
						}
						else{
							result.varReferences = varRefs;
						}
					}
				}
				
				if(typeof processFunc === 'function'){
					processFunc(result, parseResult, tokens, parser);
				}
				
				//FIXME NOOP? currentChannel is a function argument...
				
				// returns a SCRIPT token to the java parser but on a
				// different channel than the normal token stream so it
				// doesn't get in the way.
				currentChannel = theLexerInstance.SCRIPT_CHANNEL;
				
				theLexerInstance.lastParsedElement = result;
				
				return result;
			};
			
			theLexerInstance.processEscape = function (replacementText, msg){
				
				if(msg && typeof self !== 'undefined' && self.isDebug){//debug
					theLexerInstance.printInfo(msg);
				}
				
				var result = new ParsingResult(null);
				result.text = replacementText;
				this.escape.push(result);
						
				return result;
			};
			
			theLexerInstance.processComment = function (msg){
				
				if(msg && typeof self !== 'undefined' && self.isDebug){//debug
					theLexerInstance.printInfo(msg);
				}
				
				var result = new ParsingResult(null);
				this.comments.push(result);
						
				return result;
			};
			
			theLexerInstance.enterBlock = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
				return doEnter(theLexerInstance.PARSER_SCRIPT_BLOCK, theLexerInstance, currentChannel, entryFunc, processFunc, parseResultObject, msg);
			};
			
			theLexerInstance.enterScript = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
				return doEnter(theLexerInstance.PARSER_SCRIPT_STATEMENT, theLexerInstance, currentChannel, entryFunc, processFunc, parseResultObject, msg);
			};
			
			theLexerInstance.enterContent = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
				return doEnter(theLexerInstance.PARSER_SCRIPT_CONTENT, theLexerInstance, currentChannel, entryFunc, processFunc, parseResultObject, msg);
			};
			
			theLexerInstance.enterJavaScript = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
				return doEnter(theLexerInstance.PARSER_JS_CODE, theLexerInstance, currentChannel, entryFunc, processFunc, parseResultObject, msg);
			};
			
			/** #@- */

		};//END: extendMmirTemplateProcessor(){
		
		
		return parser.extendMmirTemplateProcessor;
		
	});//END: define
	

