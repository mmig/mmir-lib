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

define(['languageManager', 'parserModule', 'storageUtils'],
	//this comment is needed by jsdoc2 [copy of comment for: function ContentElement(...]
	/**
	 * The ContentElement represents "content" parts of a view; it may itself contain one or more ContentElements.
	 * 
	 * This class holds the name of the content-field (used via the yield-tag in the layouts: content, header, footer, dialogs, ...)
	 * and its definition as HTML-String.
	 * 
	 * @class
	 * @name ContentElement
	 * @public
	 * 
	 * @param {Array|Object} group
	 * 				 an array or object with properties <code>name</code> {String}, and <code>content</code> {String}
	 * @param {Object} view 
	 * 				the view that owns this ContentElement-element 
	 * @param {mmir.parser.ParserUtils} parser 
	 * 				for the the content (optional) if supplied this object must have a function <code>parse({String})</code> (see templateParseUtil)
	 * @param {mmir.parser.RenderUtils} renderer
	 * 				 for the the content (optional) if supplied, a <code>parser</code> must also be supplied; the renderer must have a function <code>parse({String})</code> (see templateRenderUtil)
	 * 
	 */
	function(
			languageManager, parser_context
){//NOTE: dependency storageUtils is actually accessed through parser_context (i.e. it attaches its functions to parserModule)
	
/** @scope ContentElement.prototype *///for jsdoc2
	
//set to @ignore in order to avoid doc-duplication in jsdoc3
/**
 * @ignore
 * 
 * The ContentElement represents "content" parts of a view; it may itself contain one or more ContentElements.
 * 
 * This class holds the name of the content-field (used via the yield-tag in the layouts: content, header, footer, dialogs, ...)
 * and its definition as HTML-String.
 * 
 * @constructs ContentElement
 * @public
 * 
 * @param {Array|Object} group
 * 				 an array or object with properties <code>name</code> {String}, and <code>content</code> {String}
 * @param {Object} view 
 * 				the view that owns this ContentElement-element 
 * @param {mmir.parser.ParserUtils} parser 
 * 				for the the content (optional) if supplied this object must have a function <code>parse({String})</code> (see templateParseUtil)
 * @param {mmir.parser.RenderUtils} renderer
 * 				 for the the content (optional) if supplied, a <code>parser</code> must also be supplied; the renderer must have a function <code>parse({String})</code> (see templateRenderUtil)
 * 
 */
function ContentElement(group, view, parser, renderer){

	this.localizer  = languageManager;
	
	if(arguments.length === 0){
		return this;
	}
	
	//TODO externalize as constant
	var SUB_ELEMENT_NAME = "@fragment";
	
	this.parser     = parser;
	this.renderer   = renderer;
	this.view       = view;
	
	if(typeof group.name !== 'undefined' && typeof group.content !== 'undefined'){
		this.name = group.name;
		
		//check if the name needs to be converted from a "raw" value:
		if(typeof group.getValue === 'function' && typeof group.nameType !== 'undefined'){
			this.name = group.getValue(this.name, group.nameType, null);
		}
		
		this.definition = group.content;
	}
	else {
		this.name = group[1];
	    this.definition = group[2];
	}
	
	if(typeof group.start !== 'undefined' && typeof group.end !== 'undefined'){
		this.start = group.start;
		this.end = group.end;
	}
	
	if(typeof group.offset !== 'undefined'){
		/**
		 * The offset of the ContentElement's raw String-content
		 * in relation to its parent ContentElement. 
		 * <p>
		 * I.e. only when ContentElements are nested with other ContentElements.
		 * <p>
		 * For nested ContentElements, the offset always refers to outermost
		 * ContentElement, e.g.
		 * <pre>
		 *   content
		 *   ContentElement_1
		 *   	ContentElement_2.parentOffset: offset to ContentElement_1
		 *   		...
		 *   			ContentElement_i.parentOffset: offset to ContentElement_1</pre>
		 * 
		 * @type Number
		 * @private
		 */
		this.parentOffset = group.offset;
	}
	else if(typeof group.contentOffset !== 'undefined'){

		this.parentOffset = group.contentOffset;
	}
	else {
		this.parentOffset = 0;
	}
	
	var parsingResult = parser.parse(this.definition, this);
	
	this.definition 	= parsingResult.rawTemplateText;
	
	this.localizations 	= parsingResult.localizations;
	this.escapes        = parsingResult.escapes;
	
	this.helpers		= parsingResult.helpers;

	this.scriptBlocks     = parsingResult.scriptBlocks;
	this.scriptStatements = parsingResult.scriptStatements;
////	this.includeScripts   = parsingResult.includeScripts;
////	this.includeStyles    = parsingResult.includeStyles;
	this.partials         = parsingResult.partials;
	
	this.ifs              = parsingResult.ifs;
	this.fors             = parsingResult.fors;
	
	this.vars             = parsingResult.vars;

	this.comments         = parsingResult.comments;
	
//	this.yields           = parsingResult.yields;
//	this.contentFors    = parsingResult.contentFors;
	
	//create ALL array and sort localizations etc. ...
	var all = this.localizations.concat(
			this.escapes, 
			this.helpers,
			this.scriptBlocks,
			this.scriptStatements,
////			this.includeScripts,
////			this.includeStyles,
			this.partials,
			this.ifs,
			this.fors,
			this.vars,
			this.comments//,
//			this.yields,
//			this.contentFors
	);
	
	//sorting function -> sort elements by occurrence in raw template text
	var sortAscByStart=function(parsedElem1, parsedElem2){
		return parsedElem1.getStart() - parsedElem2.getStart();
	};
	all.sort(sortAscByStart);

	this.allContentElements = all;
	
	var checkHasDynamicContent = function(contentElement){
		return	(contentElement.localizations 		&& contentElement.localizations.length 		> 0)
			|| 	(contentElement.helpers 			&& contentElement.helpers.length 			> 0)
			|| 	(contentElement.scriptBlocks 		&& contentElement.scriptBlocks.length 		> 0)
			|| 	(contentElement.scriptStatements 	&& contentElement.scriptStatements.length 	> 0)
			|| 	(contentElement.partials 			&& contentElement.partials.length 			> 0)
			|| 	(contentElement.ifs 				&& contentElement.ifs.length 				> 0)
			|| 	(contentElement.fors 				&& contentElement.fors.length 				> 0)
			|| 	(contentElement.vars 				&& contentElement.vars.length 				> 0)
			//TODO should comments be "pre-rendered", i.e. already removed here, so that they need not be re-evaluated each time a view gets rendered?
			|| 	(contentElement.comments			&& contentElement.comments.length 			> 0)
		;//TODO if ContentElement supports more dynamic elements (e.g. child-ContentElement objects ...) then add appropriate checks here!
	};
	
	//"buffered" field that signifies if this ContentElement has dynamic content
	// (--> i.e. has to be evaluated on each rendering, or -if not- can be statically rendered once)
	this.internalHasDynamicContent = checkHasDynamicContent(this);
	
	/**
	 * Error for parsing problems with detailed location information (i.e. where the parsing problem occured).
	 *  
	 * @class
	 * @name ScriptEvalError
	 */
	var ScriptEvalError = function(error, strScript, contentElement, parsingElement){
		
		var err = Error.apply(this, arguments);
		err.name = this.name = 'ScriptEvalError';

		this.stack = err.stack;
		this.message = err.message;

		if(typeof this.stack === 'string'){
			//remove first line of stack (which would only contain a reference to this constructor)
			this.stack = this.stack.replace(/^.*?\r?\n/, this.name + ': ');
		}
		
		var offset = 0;
//		if(parsingElement.contentOffset){
//			console.error('elem.offset: '+parsingElement.contentOffset);
////			offset = parsingElement.contentOffset;
//		}
		offset += contentElement.getOffset();
		
		this.offset = offset;
		
		this.start = this.offset + parsingElement.getStart();
		this.end = this.offset + parsingElement.getEnd();
		
		this.errorDetails = parser_context.parserCreatePrintMessage(
				'ContentElement.ScriptEvalError: Error evaluating script '
					+JSON.stringify(strScript)
					+' for ' + parsingElement.getTypeName()
					+' element:\n', 
				this.message,
				this
		);
		
		this.getDetails = function(){
			return this.errorDetails;
		};
		
		return this;
	};
	
	//this creates a function for embedded JavaScript code:
	//	using a function pre-compiles codes, in order to avoid parsing the code  
	//  (by execution environment) each time the template is rendered
	var createJSEvalFunction = function(strFuncBody, strFuncName){
		
		//COMMENT: using new Function(..) may yield less performance than eval('function...'), 
		//         since the function-body using the Function(..)-method is re-evaluated on each invocation
		//         whereas when the eval('function...')-method behaves as if the function was declared statically 
		//         like a normal function-expression (after its first evaluation here).
		//
//		var func = new Function(parser_context.element.DATA_NAME, strFuncBody);
//		func.name = strFuncName;
		
		
//		//TEST use import/export VARs instead of data-object access:
//		//
//		//IMPORT
//		// * make properties of DATA available as local variables
//		// * synchronize the DATA properties to local variables (with property getters/setters)
//		//EXPORT
//		// * on exit: commit values of local variables to their corresponding DATA-fields (and remove previously set "sync"-code)
//		//
//		var dataFieldName = parser_context.element.DATA_NAME;
//		
//		//TODO do static "import" without eval(): only import VARs that were declared by @var() before!
//		//     ... also (OPTIMIZATION): during JS-parsing, gather/detect VARIABLE occurrences -> only import VAR if it gets "mentioned" in the func-body! (need to detect arguments vs. variables for this!)		
//		var iteratorName = '__$$ITER$$__';//<- iterator name (for iterating over DATA fields)
//		var varIteratorStartSrc = 'for(var '+iteratorName+' in '+dataFieldName+'){\
//	          if('+dataFieldName+'.hasOwnProperty('+iteratorName+')){';//<- TODO? add check, if field-name starts with @?
//		var varIteratorEndSrc = '}}';
//		
//		var importDataSrc = varIteratorStartSrc
//					//create local variable, initialized with the DATA's value 
//					+ 'eval("var "+'+iteratorName+'.substring(1)+" = '+dataFieldName+'[\'"+'+iteratorName+'+"\'];");'
//					//"synchronize" the DATA object to to the created local variable 
//					+ 'Object.defineProperty('+dataFieldName+', '+iteratorName+',{\
//		                    configurable : true,\
//		                    enumerable : true,\
//		    				set: eval("var dummy1 = function set(value){\\n "+'+iteratorName+'.substring(1)+" = value;\\n };dummy1"),\
//		    				get: eval("var dummy2 = function get(){\\n return "+'+iteratorName+'.substring(1)+";\\n };dummy2")\
//		    			});'
//					+ varIteratorEndSrc;
//		
//		//TODO do not define "export" with the function itself, since there may be problems due to return statements etc.
//		//     ... instead: do the "export" after the function was invoked, i.e. obj.evalScript() etc. in renderer
//		var exportDataSrc = varIteratorStartSrc
//					//DISABLED: use defineProperty() instead (see below) ... this would use the "proxy"/"sync" mechanism..
////					+ 'eval("'+dataFieldName+'[\'"+'+iteratorName+'+"\'] = "+'+iteratorName+'.substring(1)+";");'
//		
//					//reset to DATA property to normal behavior 
//					// i.e. remove proxy-behavior by removing the getter/setter
//					// and setting to current value
//					+ 'Object.defineProperty('+dataFieldName+', '+iteratorName+',{\
//							value : '+dataFieldName+'['+iteratorName+'],\
//                    		writable : true,\
//		                    configurable : true,\
//		                    enumerable : true\
//		    			});'
//					+ varIteratorEndSrc;
//		
//		var func = eval( 'var dummy=function '+strFuncName+'('+parser_context.element.DATA_NAME+'){'
//				+ importDataSrc + strFuncBody +';'+exportDataSrc+'};dummy' );//<- FIXME WARING: export does not work correctly, if there is a return-statement in the outermost scope of the strFuncBody!
		
		
//		//NOTE: need a dummy variable to catch and return the create function-definition in the eval-statement
//		//      (the awkward 'var dummy=...;dummy'-construction avoids leaking the dummy-var into the 
//		//       global name-space, where the last ';dummy' represent the the return-statement for eval(..) )
		var func = eval( 'var dummy=function '+strFuncName+'('+parser_context.element.DATA_NAME+'){'+strFuncBody+'};dummy' );
		
		return func;
	};
	
	//init iter-variables
	var i=0,size=0;
	var parsedJS = null, preparedJSCode = null, forPropNameRef = null, forListNameRef = null;
	var forIterInit = null, forIterFunc = null;
	var renderPartialsElement = null, helperElement = null, ifElement = null, forElement = null, subContentElement = null;
	
	//prepare render-partial-elements
	for(i=0, size = this.partials.length; i < size; ++i){
		renderPartialsElement = this.partials[i];
		
		//for @render(ctrl,name, DATA):
		//  initialize the DATA-argument, if present:
		if( renderPartialsElement.hasCallData() ){
			//TODO use original parser/results instead of additional parsing pass
			parsedJS = parser.parseJS( 
				this.definition.substring( renderPartialsElement.getCallDataStart(),  renderPartialsElement.getCallDataEnd() ),
				'embeddedStatementTail',//<- "internal" parser rule for parsing fragments: >>JS_STATEMENT EOF<<
				this//TODO supply/implement more accurate error-localization: this is indeed wrong, since it is not the view-defintion, but: this.definition=<view's contentFor>, then renderPartialsElement.rawResult and .dataPos contain the information, where exactly this element is located...
				, renderPartialsElement.getStart() + this.getOffset() + '@render('.length
			);
			preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
			
			try{
				renderPartialsElement.argsEval = createJSEvalFunction('return ('+preparedJSCode+');', 'argsEval');
			} catch (err){
				var error = new ScriptEvalError(err, preparedJSCode,  this, renderPartialsElement);
				//attach a dummy function that prints the error each time it is invoked:
				renderPartialsElement.argsEval = function(){ console.error(error.getDetails()); };
				//... and print the error now, too:
				console.error(error.getDetails());
			}
		}
	}
	
	//prepare helper-elements
	for(i=0, size = this.helpers.length; i < size; ++i){
		helperElement = this.helpers[i];
		
		//for @helper(name, DATA):
		//  initialize the DATA-argument, if present:
		if( helperElement.hasCallData() ){
			//TODO use original parser/results instead of additional parsing pass
			parsedJS = parser.parseJS( 
				this.definition.substring( helperElement.getCallDataStart(),  helperElement.getCallDataEnd() ),
				'embeddedStatementTail',//<- "internal" parser rule for parsing fragments: >>JS_STATEMENT EOF<<
				this//TODO supply/implement more accurate error-localization: this is indeed wrong, since it is not the view-defintion, but: this.definition=<view's contentFor>, then helperElement.rawResult and .dataPos contain the information, where exactly this element is located...
				, helperElement.getStart() + this.getOffset() + '@helper('
			);
			preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
			
			try{
				helperElement.argsEval = createJSEvalFunction('return ('+preparedJSCode+');', 'argsEval');
			} catch (err){
				var error = new ScriptEvalError(err, preparedJSCode,  this, helperElement);
				//attach a dummy function that prints the error each time it is invoked:
				helperElement.argsEval = function(){ console.error(error.getDetails()); };
				//... and print the error now, too:
				console.error(error.getDetails());
			}
		}
	}
	
	//prepare if-elements
	for(i=0, size = this.ifs.length; i < size; ++i){
		ifElement = this.ifs[i];
		
		//TODO use original parser/results instead of additional parsing pass
		parsedJS = parser.parseJS(
				ifElement.ifExpr, 
				this//TODO supply/implement more accurate error-localization: this is indeed wrong, since it is not the view-defintion, but: this.definition=<view's contentFor>, then helperElement.rawResult and .dataPos contain the information, where exactly this element is located...
				, ifElement.getStart() + this.getOffset() + '@if('.length
		);
		preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences);
		
		try{
			ifElement.ifEval = createJSEvalFunction('return ('+preparedJSCode+');', 'ifEval');
		} catch (err){
			var error = new ScriptEvalError(err, preparedJSCode,  this, ifElement);
			//attach a dummy function that prints the error each time it is invoked:
			ifElement.ifEval = function(){ console.error(error.getDetails()); };
			//... and print the error now, too:
			console.error(error.getDetails());
		}
	}
	
	//prepare for-elements
	for(i=0, size = this.fors.length; i < size; ++i){
		forElement = this.fors[i];

		if(forElement.forControlType === 'FORITER'){

//			forElement.forIterationExpr = ...;
//			forElement.forObjectExpr    = ...;

			forPropNameRef = forElement.forControlVarPos[0];
			forListNameRef = forElement.forControlVarPos[1];
			
			forElement.forPropName = this.definition.substring(forPropNameRef.getStart(), forPropNameRef.getEnd());
			forElement.forListName = this.definition.substring(forListNameRef.getStart(), forListNameRef.getEnd());
			
			//prepend variable-names with template-var-prefix if necessary:
			if( ! forElement.forPropName.startsWith('@')){
				forElement.forPropName = '@' + forElement.forPropName;
			}
			if( ! forElement.forListName.startsWith('@')){
				forElement.forListName = '@' + forElement.forListName;
			}
			
			forElement.forIterPos = null;
			
			if(!forIterInit){
				
				//the forIteration-function creates a list of all property names for the variable 
				// given in the FORITER statement
				
				forIterInit = function (data) {
					//TODO implement this using iteration-functionality of JavaScript (-> yield)
					var list = new Array(); 
					for(var theProp in data[this.forListName]){
						list.push(theProp);
					}
					return list;
				};
				
				//creates an iterator for the property-list:
				forIterFunc = function (data) {
					var iterList = this.forInitEval(data);
					var iterIndex = 0;
					return {
						hasNext : function(){
							return iterList.length > iterIndex;
						},
						next : function(){
							return iterList[iterIndex++];
						}
					};
				};
			}
			
			forElement.forInitEval = forIterInit;
			forElement.forIterator = forIterFunc;
		}
		else {
			
			//offset within the for-expression 
			// (-> for locating the init-/condition-/increase-statements in case of an error)
			var currentOffset = '@for('.length;//<- "@for("
			
			//TODO use original parser/results instead of additional parsing pass
			if(forElement.forInitExpr){
				parsedJS = parser.parseJS(
						forElement.forInitExpr, 
						this//TODO supply/implement more accurate error-localization: this is indeed wrong, since it is not the view-defintion, but: this.definition=<view's contentFor>, then helperElement.rawResult and .dataPos contain the information, where exactly this element is located...
						, forElement.getStart() + this.getOffset() + currentOffset
				);
				preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
				
				currentOffset += forElement.forInitExpr.length;
			}
			else {
				// -> empty init-statement
				preparedJSCode = '';
			}
			try{
				forElement.forInitEval = createJSEvalFunction(preparedJSCode+';', 'forInitEval');
			} catch (err){
				var error = new ScriptEvalError(err, preparedJSCode,  this, forElement);
				//attach a dummy function that prints the error each time it is invoked:
				forElement.forInitEval = function(){ console.error(error.getDetails()); };
				//... and print the error now, too:
				console.error(error.getDetails());
			}
			
			//increase by 1 for semicolon-separator:
			++currentOffset;
			
			if(forElement.forConditionExpr){
				parsedJS = parser.parseJS(
						forElement.forConditionExpr, 
						this//TODO supply/implement more accurate error-localization: this is indeed wrong, since it is not the view-defintion, but: this.definition=<view's contentFor>, then helperElement.rawResult and .dataPos contain the information, where exactly this element is located...
						, forElement.getStart() + this.getOffset() + currentOffset
				);
				preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
				
				currentOffset += forElement.forConditionExpr.length;
			}
			else {
				//-> empty condition-element
				preparedJSCode = 'true';
			}
			try {
				forElement.forConditionEval = createJSEvalFunction('return ('+preparedJSCode+');', 'forConditionEval');
			} catch (err){
				var error = new ScriptEvalError(err, preparedJSCode,  this, forElement);
				//attach a dummy function that prints the error each time it is invoked:
				forElement.forConditionEval = function(){ console.error(error.getDetails()); };
				//... and print the error now, too:
				console.error(error.getDetails());
			}


			//increase by 1 for semicolon-separator:
			++currentOffset;
			
			if(forElement.forIncrementExpr){
				parsedJS = parser.parseJS(
						forElement.forIncrementExpr,
						this//TODO supply/implement more accurate error-localization: this is indeed wrong, since it is not the view-defintion, but: this.definition=<view's contentFor>, then helperElement.rawResult and .dataPos contain the information, where exactly this element is located...
						, forElement.getStart() + this.getOffset() + currentOffset
				);
				preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
			}
			else {
				//-> empty "increase" expression
				preparedJSCode = '';
			}
			
			try{
				forElement.forIncrementEval = createJSEvalFunction(preparedJSCode+';', 'forIncrementEval');
			} catch (err){
				var error = new ScriptEvalError(err, preparedJSCode,  this, forElement);
				//attach a dummy function that prints the error each time it is invoked:
				forElement.forIncrementEval = function(){ console.error(error.getDetails()); };
				//... and print the error now, too:
				console.error(error.getDetails());
			}
		}
	}
	
	//recursively parse content-fields:
	for(i=0, size = all.length; i < size; ++i){
		subContentElement = all[i];
		
		if(typeof subContentElement.scriptContent === 'string'){
			
			var isScriptStatement = subContentElement.isScriptStatement();
			
			var parsedJS; 
			if(isScriptStatement===true){
				parsedJS = parser.parseJS(
						subContentElement.scriptContent, 
						'embeddedStatementTail',
						this//TODO supply/implement more accurate error-localization: this is indeed wrong, since it is not the view-defintion, but: this.definition=<view's contentFor>, then helperElement.rawResult and .dataPos contain the information, where exactly this element is located...
						, subContentElement.getStart() + this.getOffset() + '@('.length
				);
			}
			else {
				parsedJS = parser.parseJS(
						subContentElement.scriptContent,
						this//TODO supply/implement more accurate error-localization: this is indeed wrong, since it is not the view-defintion, but: this.definition=<view's contentFor>, then helperElement.rawResult and .dataPos contain the information, where exactly this element is located...
						, subContentElement.getStart() + this.getOffset() + '@{'.length
				);
			}
			
			subContentElement.scriptContent = parsedJS;
			
			preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences); 
			
			if(isScriptStatement===true){
				preparedJSCode = 'return ('+preparedJSCode+');';
			}
			
			try{
				subContentElement.scriptEval = createJSEvalFunction(preparedJSCode, 'scriptEval');
			} catch (err){
				var error = new ScriptEvalError(err, preparedJSCode,  this, subContentElement);
				//attach a dummy function that prints the error each time it is invoked:
				subContentElement.scriptEval = function(){ console.error(error.getDetails()); };
				//... and print the error now, too:
				console.error(error.getDetails());
			}
			
			this.internalHasDynamicContent = true;
		}
		
		if(typeof subContentElement.content === 'string'){
			
			subContentElement.content = new ContentElement({
					name: SUB_ELEMENT_NAME, 
					content: subContentElement.content,
					offset: this.getOffset() + subContentElement.contentOffset
				}, view, parser, renderer
			);
			
			this.internalHasDynamicContent = this.internalHasDynamicContent || subContentElement.content.hasDynamicContent();
		}
		
		//IF-elements can have an additional ELSE-content field:
		if(subContentElement.hasElse() && typeof subContentElement.elseContent.content === 'string'){
			
			subContentElement.elseContent.content = new ContentElement({
					name: SUB_ELEMENT_NAME,
					content: subContentElement.elseContent.content,
					offset: this.getOffset() + subContentElement.elseContent.contentOffset
				}, view, parser, renderer
			);

			this.internalHasDynamicContent = this.internalHasDynamicContent || subContentElement.elseContent.content.hasDynamicContent();
		}
	}
	
    return this;
}


/**
 * Gets the name of a {@link mmir.ContentElement} object (content, header, footer, dialogs, ...).
 * 
 * @function
 * @returns {String} Name - used by yield tags in layout
 * @public
 */ 
ContentElement.prototype.getName = function(){
    return this.name;
};

/**
 * Gets the owner for this ContentElement, i.e. the {@link mmir.View} object.
 * 
 * @function
 * @returns {mmir.View} the owning View
 * @public
 */ 
ContentElement.prototype.getView = function(){
    return this.view;
};

/**
 * Gets the controller for this ContentElement.
 * 
 * @function
 * @returns {mmir.Controller} the Controller of the owning view
 * @public
 */ 
ContentElement.prototype.getController = function(){
    return this.getView().getController();
};

/**
 * Gets the definition of a {@link mmir.ContentElement} object.
 * 
 * TODO remove this?
 * 
 * @function
 * @returns {String} The HTML content.
 * @public
 */
ContentElement.prototype.toHtml = function(){
//	return this.definition;
	return this.toStrings().join('');
};

/**
 * Renders this object into the renderingBuffer.
 * 
 * @param renderingBuffer {Array} of Strings (if <code>null</code> a new buffer will be created)
 * @param data {Any} (optional) the event data with which the rendering was invoked
 * @returns {Array} of Strings the renderingBuffer with the contents of this object added at the end
 * 
 * @public
 */
ContentElement.prototype.toStrings = function(renderingBuffer, data){

	return this.renderer.renderContentElement(this, data, renderingBuffer);
	
};

/**
 * @public
 * @returns {String} the raw text from which this content element was parsed
 * @see #getDefinition
 * 
 * @public
 */
ContentElement.prototype.getRawText = function(){
    return this.definition;
};
/**
 * @deprecated use {@link #getRawText} instead
 * @returns {String} the raw text from which this content element was parsed
 * @see #getRawText
 * 
 * @public
 */
ContentElement.prototype.getDefinition = function(){
    return this.definition;
};
/**
 * @returns {Number} the start position for this content Element within {@link #getRawText}
 * @public
 */
ContentElement.prototype.getStart = function(){
    return this.start;
};
/**
 * @returns {Number} the end position for this content Element within {@link #getRawText}
 * @public
 */
ContentElement.prototype.getEnd = function(){
    return this.end;
};

//FIXME add to storage? (this should only be relevant for parsing, which is not necessary in case of store/restore...)
ContentElement.prototype.getOffset = function(){
    return this.parentOffset;
};

/**
 * @returns {Boolean} returns <code>true</code> if this ContentElement conatains dynamic content,
 * 					i.e. if it needs to be "evaluated" for rendering 
 * 					(otherwise, its plain text representation can be used for rendering)
 * @public
 */
ContentElement.prototype.hasDynamicContent = function(){
    return this.internalHasDynamicContent; 
};

/**
 * create a String representation for this content element.
 * @returns {String} the string-representation
 * @public
 * 
 * @requires StorageUtils
 */
ContentElement.prototype.stringify = function(){
	
	//TODO use constants for lists
		
	//primitive-type properties:
	// write values 'as is' for these properties
	var propList = [
	     'name',
   	     'definition',
	     'start',
	     'end',
	     'internalHasDynamicContent'
	];
	
	//Array-properties
	var arrayPropList = [
   	     'allContentElements' //element type: ParsingResult (stringify-able)
   	];
	

//	//SPECIAL: store view by getter function initView: use the view's name view {View} -> 'viewName' {String}, 'ctrlName' {String}
//	
//	//USED BY RENDERER:
////	allContentElements
////	definition
////	getRawText() == definition
////	getController() (by view)
//
//	//SPECIAL: store renderer by getter function initRenderer
//	
//	//function properties:
//	var funcPropList = [
//   	     'initView',
//   	     'initRenderer'
//   	];
	

	//function for iterating over the property-list and generating JSON-like entries in the string-buffer
	var appendStringified = parser_context.appendStringified;
	
	var sb = ['require("storageUtils").restoreObject({ classConstructor: "contentElement"', ','];
	
	appendStringified(this, propList, sb);
	
	//non-primitives array-properties with stringify() function:
	appendStringified(this, arrayPropList, sb, null, function arrayValueExtractor(name, arrayValue){
		
		var buf =['['];
		for(var i=0, size = arrayValue.length; i < size; ++i){
			buf.push(arrayValue[i].stringify());
			buf.push(',');
		}
		//remove last comma
		if(arrayValue.length > 0){
			buf.splice( buf.length - 1, 1);
		}
		buf.push(']');
		
		return buf.join('');
	});
	
	//TODO is there a better way to store the view? -> by its name and its contoller's name, and add a getter function...
	if(this['view']){
		//getter/setter function for the view/controller
		//  (NOTE: needs to be called before view/controller can be accessed!)
		sb.push( 'initView: function(){');
		
		// store view-name:
		sb.push( ' var viewName = ');
		sb.push( JSON.stringify(this.getView().getName()) );
		
		// store controller-name:
		sb.push( '; var ctrlName = ');
		sb.push( JSON.stringify(this.getController().getName()) );
		
		// ... and the getter/setter code:
		sb.push( '; this.view = require("presentationManager").get');
		sb.push(this['view'].constructor.name);//<- insert getter-name dependent on the view-type (e.g. View, Partial)
		sb.push('(ctrlName, viewName); this.getView = function(){return this.view;}; return this.view; },' );
		
		
		sb.push( 'getView: function(){ return this.initView();}');
		
		//NOTE: need to add comma in a separate entry 
		//      (-> in order to not break the removal method of last comma, see below)
		sb.push( ',' );
	}
	
	//TODO is there a better way to store the renderer? -> by a getter function...
	if(this['renderer']){
		//getter/setter function for the (default) renderer
		//  (NOTE: needs to be called before view/controller can be accessed!)
		sb.push( 'initRenderer: function(){');
		// ... and the getter/setter code:
		sb.push( ' this.renderer = require("renderUtils"); }' );
		
		//NOTE: need to add comma in a separate entry 
		//      (-> in order to not break the removal method of last comma, see below)
		sb.push( ',' );
	}
	
	if(this['renderer'] || this['view']){
		//add initializer function
		//  (NOTE: needs to be called before view/controller or renderer can be accessed!)
		sb.push( 'init: function(){');
		
		if(this['renderer']){
			sb.push( ' this.initRenderer(); ' );
		}
//		if(this['view']){
//			sb.push( ' this.initView(); ' );
//		}
		sb.push( ' }' );
		
		//NOTE: need to add comma in a separate entry 
		//      (-> in order to not break the removal method of last comma, see below)
		sb.push( ',' );
	}
	
	//if last element is a comma, remove it
	if(sb[sb.length - 1] === ','){
		sb.splice( sb.length - 1, 1);
	}
	
	sb.push(' })');
	return sb.join('');
};

return ContentElement;

});//END: define(..., function(){