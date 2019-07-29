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

	
define([	  'mmirf/core','mmirf/commonUtils','mmirf/parserModule','mmirf/parsingResult'
        	,'mmirf/ES3Lexer','mmirf/ES3Parser','mmirf/contentLexer','mmirf/contentParser'
        	,'mmirf/scriptLexer','mmirf/scriptParser','mmirf/antlr3'
        ],
        /**
         * Main implementation for parsing (view) templates.
         * 
         * Exports a function for extending MmirTemplateLexer objects
         * NOTE this function is imported in templateParseUtils.js and attached to the MmirTemplateLexer class
         * 
         * @class
         * @name TemplateProcessor
         * @memberOf mmir.parser
         * @static
         * @public
         * 
         * @depends ParserUtils#printInfo ("hidden" dependency when printing log-messages; accessed through the passed-in theLexerInstance)
         */
        function ( 
        	  mmir, commonUtils, parser, ParsingResult
        	, ES3Lexer, ES3Parser, MmirScriptContentLexer, MmirScriptContentParser
        	, MmirScriptLexer, MmirScriptParser, org
){//hidden dependency: templateParserUtils (for parser.printInfo)

		/**
		 * @type TemplateParser
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		var parserModule = parser;
		
		/**
		 * shortcut for constant-definitions in parser-module
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		var consts = parserModule.element;

		//internal "static" definitions for parsing mode/type

		/**
		 * @private  
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		var PARSER_SCRIPT_BLOCK 				= 0;
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		var PARSER_SCRIPT_STATMENT 				= 2;
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		var PARSER_SCRIPT_CONTENT 				= 4;
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		var PARSER_JS_CODE	 					= 8;
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		var isDebug = true;

		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		var SCRIPT_CHANNEL = 1;
		//theLexerInstance.nesting = 0;
		
		/**
		 * @function
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		var isArray = commonUtils.isArray;
		
		/**
		 * @param tokenType
		 * @param parser
		 * 
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
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
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
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
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
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
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function getBoundries(treeNode){
			
			return {
				start : treeNode.getToken().getStartIndex(),
				end   : treeNode.stopIndex +1
			};
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function getStringFor(boundriesObj, tokens, offset){
			
			if(!boundriesObj){
				return '';
			}
			
			var start = boundriesObj.start - offset;
			var end = boundriesObj.end - offset;  
			return tokens.toString().substring(start,end+1);
			
		}
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function getStringForSubTree(treeNode, tokens, offset){
			
			var start = treeNode.getToken().getStartIndex() - offset;
			var end = treeNode.stopIndex - offset;  
			return tokens.toString().substring(start,end+1);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
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
				var theValue = [];
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
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processBlock(parsingObj, result, tokens){
		
			parsingObj.scriptContent = result;
			
			if(!parsingObj.scriptContent){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - BLOCK] WARNING: ','invalid "script block" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.scriptBlocks.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processStatement(parsingObj, result, tokens){
		
			parsingObj.scriptContent = result;
			
			if(!parsingObj.scriptContent){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - STATEMENT] WARNING: ','invalid "script statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.scriptStatements.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processIncludeScript (parsingObj, result, tokens, parser){
		
			var tree = result.tree;
			var offset = tokens.tokens[0].getStartIndex();
			
			parsingObj.scriptPathType = getTokenName( tree.getChild(0).getType(), parser);
			parsingObj.scriptPath = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
			
			if(!parsingObj.scriptPath){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - SCRIPT LINK] WARNING: ','invalid "include script statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.includeScripts.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processIncludeStyle(parsingObj, result, tokens, parser){
		
			var tree = result.tree;
			var offset = tokens.tokens[0].getStartIndex();
			
			parsingObj.stylePathType = getTokenName( tree.getChild(0).getType(), parser);
			parsingObj.stylePath = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
			
			if(!parsingObj.stylePath){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - STYLE LINK] WARNING: ','invalid "include style statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.includeStyles.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processLocalize(parsingObj, result, tokens, parser){
		
			var tree = result.tree;
			var offset = tokens.tokens[0].getStartIndex();
			
			parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
			parsingObj.name = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
			
			if(!parsingObj.name || parsingObj.name.length === 0){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - LOCALIZE] WARNING: ','invalid "localize statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.locales.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processDeclareVar(parsingObj, result, tokens, parser){
			
			var tree = result.tree;
			var offset = tokens.tokens[0].getStartIndex();
			
			parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
			parsingObj.name = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
			
			if(!parsingObj.name || parsingObj.name.length === 0){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - VAR DECLARATION] WARNING: ','invalid "var declaration statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.vars.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processHelperFunction(parsingObj, result, tokens, parser){
		
			var tree = result.tree;
			var offset = tokens.tokens[0].getStartIndex();
			
			parsingObj.helperType = getTokenName( tree.getChild(0).getType(), parser);
//			parsingObj.helper = createJSObjectFrom(tree.getChild(0), null, parser );
			parsingObj.helper = getStringForSubTree(tree.getChild(0), tokens, offset);
			
			if(tree.getChildCount() === 2){
				parsingObj.dataType = getTokenName( tree.getChild(1).getType(), parser);
//				var param = null;
//				if('OBJECT' === parsingObj.dataType){
//					param = new Object();
//				}
//				parsingObj.dataArg = createJSObjectFrom(tree.getChild(1), param, parser );
				
				parsingObj.dataPos = getBoundries(tree.getChild(1));
				
			}
			
			if(!parsingObj.helper || parsingObj.helper.length === 0){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - HELPER CALL] WARNING: ','invalid "helper function statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.helpers.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processRenderPartial(parsingObj, result, tokens, parser){
		
			//parsingObj.controllerName = result.controller;
			//parsingObj.partialName = result.partial;
			//parsingObj.arguments = result.arguments;
			
					
			var tree = result.tree;
			var offset = tokens.tokens[0].getStartIndex();
			
			parsingObj.controllerType = getTokenName( tree.getChild(0).getType(), parser);
//			parsingObj.controller = createJSObjectFrom(tree.getChild(0), null, parser );
			parsingObj.controller = getStringForSubTree(tree.getChild(0), tokens, offset);
			
			parsingObj.partialType = getTokenName( tree.getChild(1).getType(), parser);
//			parsingObj.partial = createJSObjectFrom(tree.getChild(1), null, parser );
			parsingObj.partial = getStringForSubTree(tree.getChild(1), tokens, offset);
			
			if(tree.getChildCount() === 3){
				parsingObj.dataType = getTokenName( tree.getChild(2).getType(), parser);
//				var param = null;
//				if('OBJECT' === parsingObj.dataType){
//					param = new Object();
//				}
//				parsingObj.dataArg = createJSObjectFrom(tree.getChild(2), param, parser );
				
//				parsingObj.dataArg = getStringForSubTree(tree.getChild(2), tokens, offset);
				parsingObj.dataPos = getBoundries(tree.getChild(2));
				
			}
			
			if(false){//!parsingObj.partialName || parsingObj.partialName.length === 0){ TODO implement check
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - RENDER PARTIAL] WARNING: ','invalid "render partial statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.renderPartials.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processYieldDeclaration(parsingObj, result, tokens, parser){
		
			var tree = result.tree;
			var offset = tokens.tokens[0].getStartIndex();
			
			parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
			parsingObj.name = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
			
			if(!parsingObj.name || parsingObj.name.length === 0){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - YIELD DECLARATION] WARNING: ','invalid "yield declaration" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.yields.push(parsingObj);
			
		}

		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processYieldContentParam (parsingObj, result, tokens, parser){
		
			var tree = result.tree;
			var offset = tokens.tokens[0].getStartIndex();
			
			parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
			parsingObj.name = getStringForSubTree(tree.getChild(0), tokens, offset);//createJSObjectFrom(tree.getChild(0), null, parser );
			parsingObj.contentOffset = parsingObj.end + 1 + 2;// +2:  "){"
			
			if(!parsingObj.name){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - YIELD CONTENT PARAMETER] WARNING: ','invalid "content for specification" (missing name) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processYieldContent (parsingObj, result, tokens){
		
			parsingObj.content = result;
			
			if(!parsingObj.content){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - YIELD CONTENT] WARNING: ','invalid "content for specification" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.yieldContents.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processIfExpr (parsingObj, result, tokens, parser){
		
			//TODO validate expr! (e.g. detect assignments to undeclared variables...)
//			var tree = result.tree;
//			parsingObj.exprType = getTokenName( tree.getChild(0).getType(), parser);
//			parsingObj.expr = createJSObjectFrom(tree.getChild(0), null, parser );
			parsingObj.contentOffset = parsingObj.end + 1 + 2;// +2:  "){"

//			var lastElem = this.lastParsedElement;
			parsingObj.ifExpr = tokens.toString();
			
			if(!parsingObj.ifExpr){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - IF EXPR] WARNING: ','invalid "if statement" (missing expression) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processIfContent (parsingObj, result, tokens){
		
			parsingObj.content = result;
			
			if(!parsingObj.content){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - IF CONTENT] WARNING: ','invalid "if statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.ifs.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processElse (parsingObj, result, tokens){
		
			parsingObj.content = result;
			
			if(!parsingObj.content){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - ELSE CONTENT] WARNING: ','invalid "else statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			parsingObj.contentOffset = parsingObj.start + 1;// +1:  "{"
			
			var lastElem = this.lastParsedElement;
			if(lastElem.type !== this.INTERNAL_IF){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - ELSE CONTENT] WARNING: ','invalid "else statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				
				throw new org.antlr.runtime.NoViableAltException('invalid else statement: missing preceeding IF!', -1, -1, tokens);
			}
			
			var lastIf = this.ifs[this.ifs.length-1];
			if(lastIf.elseContent){
				
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - ELSE CONTENT] WARNING: ','invalid "else statement" (ELSE already defined) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				
				throw new org.antlr.runtime.NoViableAltException('invalid else statement: too many ELSE definitions - ELSE clause is already defined!', -1, -1, tokens);
			}
			
			lastIf.elseContent = parsingObj;
			//redefine getEnd of the if-element: use end of else-statement
			lastIf.getEnd = function(){
				return this.elseContent.getEnd();
			};
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processForControl (parsingObj, result, tokens, parser){
		
			//TODO validate expr! (e.g. detect assignments to undeclared variables...)
			var tree = result.tree;
			var offset = tokens.tokens[0].getStartIndex();
			
			parsingObj.forControlType = getTokenName( tree.getChild(0).getType(), parser);
			//parsingObj.forControl = createJSObjectFrom(tree.getChild(0), null, parser );
			
			parsingObj.contentOffset =  parsingObj.end + 1 + 2;// +2:  "){"
			
//			parsingObj.forControl = tokens.toString();
			
			if(parsingObj.forControlType === 'FORITER'){
//				parsingObj.forIterationExpr = getFirstChild(tree.getChild(0).getChild(0), 'Identifier', parser).toString();
//				parsingObj.forObjectExpr    = getFirstChild(tree.getChild(0).getChild(1), 'Identifier', parser).toString();
				parsingObj.forControlVarPos = parser.getVarReferences();
				//if one/both variables were not AmpersatVariables, we need to extract them manually:
				if(parsingObj.forControlVarPos.length < 2){
					
					//first try if the missing variable is the property-name variable (for iterating):
					var propVar = getFirstChild(tree.getChild(0).getChild(0), 'Identifier', parser);
					if(propVar){
						//put propVar parsing result at first position:
						propVar = new ParsingResult(propVar.token);
						propVar.end += 1;//adjust end position: token.end is exactly the end, while we need the position after the last char
						parsingObj.forControlVarPos.unshift(propVar);
					}
					
					//if still not both present, try to extract the object-variable (container/list for iterating):
					if(parsingObj.forControlVarPos.length < 2){
						var objVar =  getFirstChild(tree.getChild(0).getChild(1), 'Identifier', parser);
						if(objVar){
							//put objVar parsing result at second position:
							objVar = new ParsingResult(objVar.token);
							objVar.end += 1;//adjust end position: token.end is exactly the end, while we need the position after the last char
							parsingObj.forControlVarPos.push(objVar);
						}
					}
				}
				parsingObj.forControlPos  = extractBoundries(tree.getChild(0));
			}
			else {
				//-> type is 'FORSTEP'
				parsingObj.forInitExpr      = getStringFor( extractBoundries(tree.getChild(0).getChild(0)), tokens, offset);
				parsingObj.forConditionExpr = getStringFor( extractBoundries(tree.getChild(0).getChild(1)), tokens, offset);
				parsingObj.forIncrementExpr = getStringFor( extractBoundries(tree.getChild(0).getChild(2)), tokens, offset);
			}
			
//			if(!parsingObj.expr){
//				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - FOR EXPR] WARNING: ','invalid "for statement" (missing control statement) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
//				return;
//			}
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processForContent (parsingObj, result, tokens){
		
			parsingObj.content = result;
			
			if(!parsingObj.content){
				if(this.isDebug) parser.parserPrintWarning('[TemplateProcessor - FOR CONTENT] WARNING: ','invalid "for statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
				return;
			}
			
			this.fors.push(parsingObj);
			
		}
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function getLexerFor(self, parserType, input){
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
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function getParserFor(self, parserType, tokens){
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
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function doEnter(parserType, self, currentChannel, entryFunc, processFunc, parseResultObject, msg){
			
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
			
			if(self.isDebug) self.printDebug('enter embedded '+msg);//debug
			
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
				
				self.printInfo(msg+'_tokens('+start+'->'+end+')',tokens);
			}
			
			var parser = getParserFor(self, parserType, tokens);
			
			parser.isDebug = self.isDebug;
			var parseResult = parser[entryFunc]();
					
			if(self.isDebug) self.printDebug(msg+'.'+entryFunc+'() result: >'+parseResult+'<');//debug
			
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
				processFunc.call(self, result, parseResult, tokens, parser);
			}
			
			//FIXME NOOP? currentChannel is a function argument...
			
			// returns a SCRIPT token to the java parser but on a
			// different channel than the normal token stream so it
			// doesn't get in the way.
			currentChannel = self.SCRIPT_CHANNEL;
			
			self.lastParsedElement = result;
			
			return result;
		};
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processEscape(replacementText, msg){
			
			if(msg && this.isDebug){//debug
				this.printInfo(msg);
			}
			
			var result = new ParsingResult(null);
			result.text = replacementText;
			this.escape.push(result);
					
			return result;
		};
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function processComment(msg){
			
			if(msg && this.isDebug){//debug
				this.printInfo(msg);
			}
			
			var result = new ParsingResult(null);
			this.comments.push(result);
					
			return result;
		};
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function enterBlock(currentChannel, entryFunc, processFunc, msg, parseResultObject){
			return doEnter(this.PARSER_SCRIPT_BLOCK, this, currentChannel, entryFunc, processFunc, parseResultObject, msg);
		};
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function enterScript(currentChannel, entryFunc, processFunc, msg, parseResultObject){
			return doEnter(this.PARSER_SCRIPT_STATEMENT, this, currentChannel, entryFunc, processFunc, parseResultObject, msg);
		};
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function enterContent(currentChannel, entryFunc, processFunc, msg, parseResultObject){
			return doEnter(this.PARSER_SCRIPT_CONTENT, this, currentChannel, entryFunc, processFunc, parseResultObject, msg);
		};
		
		/**
		 * @private
		 * @memberOf mmir.parser.TemplateProcessor#
		 */
		function enterJavaScript(currentChannel, entryFunc, processFunc, msg, parseResultObject){
			return doEnter(this.PARSER_JS_CODE, this, currentChannel, entryFunc, processFunc, parseResultObject, msg);
		};
		
		/**
		 * "Processor" for the template parse-results:
		 * 
		 * This function is used by the generated (antlr) parsers.
		 * 
		 * @memberOf mmir.parser.TemplateProcessor#
		 * @constructor
		 * @ignore
		 */
		function _extend(theLexerInstance) {

			/** @scope mmir.parser.TemplateProcessor.prototype */
			
			org.antlr.lang.augmentObject(theLexerInstance, /** @augments MmirTemplateLexer */ {
				/** @memberOf MmirTemplateLexer */
				INTERNAL_INCLUDE_SCRIPT: consts.INCLUDE_SCRIPT,
				INTERNAL_INCLUDE_STYLE: consts.INCLUDE_STYLE,
				INTERNAL_LOCALIZE: consts.LOCALIZE,
				INTERNAL_YIELD_DECLARATION: consts.YIELD_DECLARATION,
				INTERNAL_YIELD_CONTENT: consts.YIELD_CONTENT,
				INTERNAL_BLOCK: consts.BLOCK,
				INTERNAL_STATEMENT: consts.STATEMENT,
				INTERNAL_HELPER: consts.HELPER,
				INTERNAL_IF: consts.IF,
				INTERNAL_ELSE: consts.ELSE,
				INTERNAL_FOR: consts.FOR,
				INTERNAL_RENDER: consts.RENDER,
				INTERNAL_ESCAPE_ENTER: consts.ESCAPE_ENTER,
				INTERNAL_ESCAPE_EXIT: consts.ESCAPE_EXIT,
				INTERNAL_FOR_TYPE_ITER: consts.FOR_TYPE_ITER,
				INTERNAL_FOR_TYPE_STEP: consts.FOR_TYPE_STEP,
				INTERNAL_VAR_DECLARATION: consts.VAR_DECLARATION,
				INTERNAL_VAR_REFERENCE: consts.VAR_REFERENCE,
				INTERNAL_COMMENT: consts.COMMENT,
	
			//internal "static" definitions for parsing mode/type
				PARSER_SCRIPT_BLOCK: PARSER_SCRIPT_BLOCK,
				PARSER_SCRIPT_STATMENT: PARSER_SCRIPT_STATMENT,
				PARSER_SCRIPT_CONTENT: PARSER_SCRIPT_CONTENT,
				PARSER_JS_CODE: PARSER_JS_CODE,
			
				isDebug: isDebug,
			
				SCRIPT_CHANNEL: SCRIPT_CHANNEL,
			//	nesting: 0,
			
				scriptBlocks: [],
				scriptStatements: [],
				includeScripts: [],
				includeStyles: [],
				locales: [],
				helpers: [],
				renderPartials: [],
				escape: [],
				ifs: [],
				fors: [],
				yields: [],
				yieldContents: [],
				vars: [],
				comments: [],
				lastParsedElement: null,
			
				processBlock: processBlock,
				processStatement: processStatement,
				processIncludeScript: processIncludeScript,
				processIncludeStyle: processIncludeStyle,
				processLocalize: processLocalize,
				processDeclareVar: processDeclareVar,
				processHelperFunction: processHelperFunction,
				processRenderPartial: processRenderPartial,
				processYieldDeclaration: processYieldDeclaration,
				processYieldContentParam: processYieldContentParam,
				processYieldContent: processYieldContent,
				processIfExpr: processIfExpr,
				processIfContent: processIfContent,
				processElse: processElse,
				processForControl: processForControl,
				processForContent: processForContent,
				processEscape: processEscape,
				processComment: processComment,
				enterBlock: enterBlock,
				enterScript: enterScript,
				enterContent: enterContent,
				enterJavaScript: enterJavaScript
			});
			
		};//END: extendMmirTemplateProcessor(){
		
		parser.extendMmirTemplateProcessor = _extend;
		
		return _extend;
		
	});//END: define
