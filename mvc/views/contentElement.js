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

	/**
	 * the "localizer" i.e. for handeling internationalization / localized Strings
	 * 
	 * @protected
	 * @type mmir.LanguageManager
	 * @memberOf ContentElement#
	 */
	this.localizer  = languageManager;
	
	if(arguments.length === 0){
		return this;
	}
	
	
	/**
	 * dummy name, if the ContentElement does not have a name:
	 * only ContentElements that represent Views and Partials have names -
	 * other sub-elements (@if,@for etc) do not have their own name/identifier.
	 * 
	 * TODO externalize as constant
	 * 
	 * @private
	 * @constant
	 * @memberOf ContentElement#
	 */
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
	
	//if this is a sub-ContentElement (i.e. not directly attached to a view, but to another ContentElement):
	// add a reference to its parent ContentElement
	if(typeof group.parent !== 'undefined'){
		/**
		 * the parent ContentElement, if this is a sub-ContentElement to another ContentElement
		 * 
		 * NOTE: this field will only be present, if the ContentElement is initialized from parsing a template
		 *       (i.e. not present when restored for persisted JS view)
		 * @private
		 * @type ContentElement
		 */
		this._parent = group.parent;
	}
	
	/**
	 * The ParsingResult that represents this ContentElement
	 * 
	 * @private
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 */
	var parsingResult = parser.parse(this.definition, this);
	/**
	 * The "raw" template text.
	 * 
	 * @protected
	 * @type String
	 * @memberOf ContentElement#
	 * 
	 */
	this.definition 	= parsingResult.rawTemplateText;
	/**
	 * List of the "localize" statements in the template.
	 * 
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.LOCALIZE
	 */
	this.localizations 	= parsingResult.localizations;
	/**
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.ESCAPE_ENTER
	 * @see mmir.parser.element.ESCAPE_EXIT
	 */
	this.escapes        = parsingResult.escapes;
	/**
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.HELPER
	 */
	this.helpers		= parsingResult.helpers;
	/**
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.BLOCK
	 */
	this.scriptBlocks     = parsingResult.scriptBlocks;
	/**
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.STATEMENT
	 */
	this.scriptStatements = parsingResult.scriptStatements;
////	this.includeScripts   = parsingResult.includeScripts; @see mmir.parser.element.INCLUDE_SCRIPT
////	this.includeStyles    = parsingResult.includeStyles; @see mmir.parser.element.INCLUDE_STYLE
	/**
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.RENDER
	 */
	this.partials         = parsingResult.partials;
	/**
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.IF
	 */
	this.ifs              = parsingResult.ifs;
	/**
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.FOR
	 */
	this.fors             = parsingResult.fors;
	/**
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.VAR_DECLARATION
	 */
	this.vars             = parsingResult.vars;
	/**
	 * @protected
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 * 
	 * @see mmir.parser.element.COMMENT
	 */
	this.comments         = parsingResult.comments;
	
	//NOTE by default this field is not added to the allContentElements list (i.e. will not be stored/stringified)
	this.yields         = parsingResult.yields;// @see mmir.parser.element.YIELD_DECLARATION
//	this.contentFors    = parsingResult.contentFors; @see mmir.parser.element.YIELD_CONTENT
	

	/**
	 * a list of VarReferences that are relevant/active for sub-content elements
	 * (e.g. content of FOR elements)
	 * 
	 * 
	 * NOTE: this field is only filled, if the ContentElement is created for parsing a template
	 *       (i.e. not present when restored from a persisted JS view object).
	 * 
	 * @private
	 * @type mmir.parser.ParsingResult
	 * @memberOf ContentElement#
	 */
	this._contentVars             = [];
	
	//create ALL array and sort localizations etc. ...
	/**
	 * create ALL array and sort it, i.e. for localizations etc. ...
	 * @private
	 * @type Array<mmir.parser.ParsingResult>
	 * @memberOf ContentElement#
	 */
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
	
	/**
	 * HELPER sorting function -> sort elements by occurrence in raw template text
	 * @private
	 * @function
	 * @memberOf ContentElement#
	 */
	var sortAscByStart = function(parsedElem1, parsedElem2){
		return parsedElem1.getStart() - parsedElem2.getStart();
	};
	all.sort(sortAscByStart);

	this.allContentElements = all;
	
	/**
	 * HELPER check if a ContentElement has "dynamic content"
	 * 
	 * @private
	 * @function
	 * @memberOf ContentElement#
	 */
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
	 * @property {String} name		the error name, that triggered the ScriptEvalError
	 * @property {String} message	the message of the error that triggered the ScriptEvalError
	 * @property {String} stack		the error stack (if available)
	 * 
	 * @property {String} details	the detailed message of the ScriptEvalError including the positional information and the error that triggered it
	 * @property {Number} offset	the offset (number of characters) of the ContentElement where the error occurred (in relation to its parent/owning Element)
	 * @property {Number} start		the starting position for the content (number of characters) within the ContentElement's <code>rawText</code>
	 * @property {Number} end		the end position for the content (number of characters) within the ContentElement's <code>rawText</code>
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
		
		/**
		 * Get the detailed error message with origin information.
		 * 
		 * @public
		 * @returns {String} the detailed error message
		 * @see #details
		 * 
		 * @var {Function} ScriptEvalError#getDetails
		 */
		this.getDetails = function(){
			return this.errorDetails;
		};
		
		return this;
	};
	
	/**
	 * HELPER: get a list of VarReference ParsingResults from this ContentElement and all its parent ContentElements
	 *         (i.e. all VarReferences that this ContentElement may "need to know about" in order to execute JavaScript code, e.g. template ScriptStatements like @())
	 * 
	 * @returns {Array<VarReference>} list of VarReference ParsingResults from this ContentElement and all its parent ContentElements
	 * 
	 * @private
	 * @function
	 * @memberOf ContentElement#
	 */
	var getAllVars = function(contentElement){
		
		var vars = contentElement.vars;
		var list = vars.slice(0, vars.length);
		var parent = contentElement._parent;
		while(parent){
			list = list.concat(parent.vars, parent._contentVars);
			parent = parent._parent;
		}
		unifyVarList(list, null);
		return list;
	};
	
	/**
	 * HELPER: get a list of VarReference ParsingResults from this ContentElement and all its parent ContentElements
	 *         (i.e. all VarReferences that this ContentElement may "need to know about" in order to execute JavaScript code, e.g. template ScriptStatements like @())
	 * 
	 * @param {Array<VarReference>} varList
	 * @param {String} [rawText]
	 * 				NOTE: if the list contains var-references from parsed JS-text, then the actual var-name must be extracted from the rawText
	 * 					  (if necessary, the extracted var-name will be attached to the VarReference)
	 * 				can be omitted, if no VarReference entries in varList originate for parsing JS-content (i.e. renderer.parseJS())
	 * @returns {Array<VarReference>} list of VarReference ParsingResults from this ContentElement and all its parent ContentElements
	 * 
	 * @private
	 * @function
	 * @memberOf ContentElement#
	 */
	var unifyVarList = function(varList, rawText){
		
		var dict = {}, e, val, start;
		for(var i=varList.length-1; i >= 0; --i){
			e = varList[i];
			val = e.getValue(e.name, e.nameType);
			
			//for VarReference from parsed JS code: need to extract the actual var-name:
			if(typeof val === 'undefined' && rawText){
				start = e.start;
				if(rawText.charAt(e.start) === '@'){//omit template-var char
					++start;
				}
				val = rawText.substring(start, e.end);
				e.name = e.name || val;
				e.nameType = e.nameType || 'Identifier';
			} else {
				val.startsWith('@')? val.substring(1) : val;//normalize var-name if necessary
			}
			
			if(dict[val]){
				//remove duplicate entry from list;
				varList.slice(i,1);
			} else {
				dict[val] = true;
			}
		}
	}
	
	/**
	 * HELPER: check whether a var-reference is already present
	 * 
	 * @param {Array<VarReference>} varList
	 * @param {String} varName
	 * 					 the name for the variable (if it starts with "@", it will be removed before checking)
	 * @returns {Boolean} <code>true</code> if <code>varName</code> corresponds to one of the VarReference entries in <code>varList</code>
	 * 
	 * @private
	 * @function
	 * @memberOf ContentElement#
	 */
	var isVarInList = function(varList, varName){

		varName = varName.startsWith('@')? varName.substring(1) : varName;
		var e, val;
		for(var i=varList.length-1; i >= 0; --i){
			e = varList[i];
			val = e.getValue(e.name, e.nameType);
			if(val === varName){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * HELPER: this creates function-code for embedded JavaScript code:
	 *  		using a function pre-compiles codes - this avoids (re-) parsing the code  
	 *   		(by the execution environment) each time that the template is rendered.
	 *   
	 * @param {String} strFuncBody
	 * 			the JavaScript code for the function body
	 * @param {String} strFuncName
	 * 			the name for the function
	 * @returns {PlainObject} an object with the function-code with one input argument (see <code>DATA_NAME</code>) and the function ID/name:
	 * 						<code>{func: STRING, funcName: STRING}</code>
	 * 
	 * @private
	 * @function
	 * @memberOf ContentElement#
	 */
	var createJSEvalCode = function(strFuncBody, strFuncName){


		//"automatic" export/update for variables 
		// FIXME this introduces an extra function/function-call which should be avoided
		//       (NOTE: the function exportRenderDataTo() is generated later in createJSEvalFunction(), see below)
		var resultVarName = parser_context.element.DATA_NAME+'RESULT__';
		var funcWrapStart = '\nvar '+resultVarName+' = (function(){\n';
		var funcWrapEnd = '\n})(); exportRenderDataTo('+parser_context.element.DATA_NAME+'); return ' + resultVarName + ';'
		
		var func = 'function '+strFuncName+'('+parser_context.element.DATA_NAME+'){'+//TODO use strict mode?: +'\n"use strict";\n'
			funcWrapStart+strFuncBody+funcWrapEnd+'}';
		
		return {
			'func': func,
			'funcName': strFuncName
		};
	};
	
	/**
	 * HELPER: this creates the initialize-function for the generated script-eval functions
	 *         which will be attached to <code>initEvalFunctions</code>.
	 *         
	 * The init-function embeds all variables with their "clear name" (i.e. without prefix @)
	 * so that these can be referenced from within the javascript code (i.e. functions in <code>funcList</code>)
	 * without additional modifications.
	 * 
	 * When the init-function is invoked, it will set the generated functions to their corresponding ParsingResult
	 * in <code>allContentElements</code>.
	 * 
	 * In addition 2 functions are attached to the ContentElement itself:
	 * <code>setRenderData(data)</code>: this function must be called with the current render-data, 
	 *                               each time before rendering the ContentElement
	 *                               
	 * <code>exportRenderData(data)</code>: this function will export the current render-data to the
	 *                               data-argument. This function can be used to retrieve the possibly
	 *                               modified data after rendering.
	 * 
	 * 
	 * @param {Array<GenFunc>} funcList
	 * 			the list of generated functions, where each entry has the form
	 * 			<code>{
	 * 				index: 		Integer: the index of the ParsingResult that contains the function in field allContentElements
	 * 				funcName: 	String: the name of the function in its ParsingResult
	 * 				code: 		the function-code as generated by createJSEvalCode
	 * 			}</code>
	 * @param {Array<VarReference>} templateVars
	 * 			the list of template variables (i.e. ParsingResult that encapsules a VarReference)
	 * @returns {Function} the function that initializes
	 * 
	 * @private
	 * @function
	 * @memberOf ContentElement#
	 */
	var createJSEvalFunction = function(funcList, templateVars){
		
		//COMMENT: using new Function(..) may yield less performance than eval('function...'), 
		//         since the function-body using the Function(..)-method is re-evaluated on each invocation
		//         whereas when the eval('function...')-method behaves as if the function was declared statically 
		//         like a normal function-expression (after its first evaluation here).
		//
//		var func = new Function(parser_context.element.DATA_NAME, strFuncBody);
//		func.name = strFuncName;
		
		//create import/export data-argument
		// for making fields in data-argument accessible without context-information within the function
		// (e.g. instead of "data.theField" -> "theField") 
		var size=templateVars.length;
		var importVarValues, exportVarValues, declVars;
		if(size > 0){
			
			importVarValues = [];
			exportVarValues = [];
			declVars = [];
			var v, vname, nvname;
			for(var i=0; i < size; ++i){
				v = templateVars[i];
				vname = v.getValue(v.name, v.nameType);
				if(vname.startsWith('@')){
					nvname = vname.substring(1);
				} else {
					nvname = vname;
					vname = '@' + nvname;
				}
				importVarValues.push('\n', nvname, ' = ', parser_context.element.DATA_NAME, '["', vname, '"];');
				exportVarValues.push('\n', parser_context.element.DATA_NAME, '["', vname, '"] = ', nvname, ';');
				declVars.push('\nvar ', nvname, ';');
			}

			importVarValues = importVarValues.join('') +'\n';
			exportVarValues = exportVarValues.join('') + '\n return ' + parser_context.element.DATA_NAME + ';';
			declVars = declVars.join('') +'\n';
			
		} else {
			importVarValues = '';
			exportVarValues = '';
			declVars = '';
		}
		
		var strFuncName = 'initEvalFunctions';
		
		
		var el;
		var funcs = [
		    'this.setRenderData = function('+parser_context.element.DATA_NAME+'){'+importVarValues+'};\n',
		    'var exportRenderDataTo = function('+parser_context.element.DATA_NAME+'){'+exportVarValues+'};\n',
		    'this.exportRenderDataTo = exportRenderDataTo;\n'
		];
		for(var i=0,size=funcList.length; i < size; ++i){
			el = funcList[i];
			funcs.push('this.allContentElements[',el.index, '].', el.funcName, '=', el.code, ';\n');
		}
		
		var strFuncBody = funcs.join('');
		
//		//NOTE: need a dummy variable to catch and return the create function-definition in the eval-statement
//		//      (the awkward 'var dummy=...;dummy'-construction avoids leaking the dummy-var into the 
//		//       global name-space, where the last ';dummy' represent the the return-statement for eval(..) )
		var func = eval( 'var '+strFuncName+'=function '+strFuncName+'(){'//TODO use strict mode?: +'\n"use strict";\n'
				+declVars+strFuncBody+'};'+strFuncName );
		
		return func;
	};
	
	var allVars = getAllVars(this);
	
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
				renderPartialsElement.argsEval = createJSEvalCode('return ('+preparedJSCode+');', 'argsEval');
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
				helperElement.argsEval = createJSEvalCode('return ('+preparedJSCode+');', 'argsEval');
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
			ifElement.ifEval = createJSEvalCode('return ('+preparedJSCode+');', 'ifEval');
		} catch (err){
			var error = new ScriptEvalError(err, preparedJSCode,  this, ifElement);
			//attach a dummy function that prints the error each time it is invoked:
			ifElement.ifEval = function(){ console.error(error.getDetails()); };
			//... and print the error now, too:
			console.error(error.getDetails());
		}
	}
	

	//gather additional variables that may get "introduced" in for(in)-expressions
	var allForVars = allVars;//DISABLED [now always export for-vars to all-vars]: .slice(0, allVars.length);
	
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

			//special case FOR-statement: "implicitly declare" property-name variable, if it is not declared yet (i.e. make available for JS code within for-loop)
			var normalizedPropName = forElement.forPropName.startsWith('@')? forElement.forPropName.substring(1) : forElement.forPropName;
			if(!isVarInList(allVars, normalizedPropName) && !isVarInList(this._contentVars, normalizedPropName)){
				//add name to ParsingResult, so that there is no need to extract it from raw-template anymore:
				forPropNameRef.name = normalizedPropName;
				forPropNameRef.nameType = 'Identifier';
				this._contentVars.push(forElement.forControlVarPos[0]);
			}
			
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
				
				//TODO implement this using iteration-functionality of JavaScript (-> yield)
				forIterInit = function (data) {
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
			
			//TODO remove?
//			//list for template-vars: these may increased by "implicit" for-init-variables (see comment below)
//			var allForVars = allVars.slice(0, allVars.length);
			
			//TODO use original parser/results instead of additional parsing pass
			if(forElement.forInitExpr){
				parsedJS = parser.parseJS(
						forElement.forInitExpr, 
						this//TODO supply/implement more accurate error-localization: this is indeed wrong, since it is not the view-defintion, but: this.definition=<view's contentFor>, then helperElement.rawResult and .dataPos contain the information, where exactly this element is located...
						, forElement.getStart() + this.getOffset() + currentOffset
				);
				preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);

				currentOffset += forElement.forInitExpr.length;
				
				//special case FOR-statement: if there occur template-vars in init-expression, then "implicitly declare" these (i.e. make available for JS code within for-loop)
				var forInitVars = parsedJS.varReferences;
				unifyVarList(parsedJS.varReferences, parsedJS.rawTemplateText);
				if(forInitVars.length > 0){
					//add to current var-list used in for-loop
					allForVars = allForVars.concat(forInitVars);
					unifyVarList(allForVars);
					//add to content-var-list (for child content elements)
					this._contentVars = this._contentVars.concat(forInitVars);
					unifyVarList(this._contentVars);
				}
				
			}
			else {
				// -> empty init-statement
				preparedJSCode = '';
			}
			try{
				forElement.forInitEval = createJSEvalCode(preparedJSCode+';', 'forInitEval');
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
				forElement.forConditionEval = createJSEvalCode('return ('+preparedJSCode+');', 'forConditionEval');
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
				forElement.forIncrementEval = createJSEvalCode(preparedJSCode+';', 'forIncrementEval');
			} catch (err){
				var error = new ScriptEvalError(err, preparedJSCode,  this, forElement);
				//attach a dummy function that prints the error each time it is invoked:
				forElement.forIncrementEval = function(){ console.error(error.getDetails()); };
				//... and print the error now, too:
				console.error(error.getDetails());
			}
		}
	}
	
	//(recursively) parse content-fields:
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
				subContentElement.scriptEval = createJSEvalCode(preparedJSCode, 'scriptEval');
			} catch (err){
				var error = new ScriptEvalError(err, preparedJSCode,  this, subContentElement);
				//attach a dummy function that prints the error each time it is invoked:
				subContentElement.scriptEval = function(){ console.error(error.getDetails()); };
				//... and print the error now, too:
				console.error(error.getDetails());
			}
			
			this.internalHasDynamicContent = true;
		}
		
		//recursively parse template-content by creating sub-ContentElements:
		
		if(typeof subContentElement.content === 'string'){
			
			subContentElement.content = new ContentElement({
					name: SUB_ELEMENT_NAME, 
					content: subContentElement.content,
					offset: this.getOffset() + subContentElement.contentOffset,
					parent: this
				}, view, parser, renderer
			);
			
			this.internalHasDynamicContent = this.internalHasDynamicContent || subContentElement.content.hasDynamicContent();
		}
		
		//IF-elements can have an additional ELSE-content field:
		if(subContentElement.hasElse() && typeof subContentElement.elseContent.content === 'string'){
			
			subContentElement.elseContent.content = new ContentElement({
					name: SUB_ELEMENT_NAME,
					content: subContentElement.elseContent.content,
					offset: this.getOffset() + subContentElement.elseContent.contentOffset,
					parent: this
				}, view, parser, renderer
			);

			this.internalHasDynamicContent = this.internalHasDynamicContent || subContentElement.elseContent.content.hasDynamicContent();
		}
	}
	
	//initialize generated functions
	//(recursively) parse content-fields:
	
	//1. gather generated functions (TODO create list when generating functions)
	var funcs = [];
	var reFuncTest = /Eval$/;//<- by convention the functions have the suffix 'Eval'
	var prop;
	for(i=0, size = all.length; i < size; ++i){
		
		subContentElement = all[i];
		
		//TODO avoid for(n in obj) 
		for(pname in subContentElement){
			
			if(reFuncTest.test(pname) && subContentElement.hasOwnProperty(pname)){
				prop = subContentElement[pname];
				
				if(prop.func && prop.funcName){
					funcs.push({index: i, funcName: pname, code: prop.func});
				}
			} 
		}
		
	}
	
	//2. create the (eval'ed) initializer-function for the generated function code:
	this.initEvalFunctions = createJSEvalFunction(funcs, allVars);

	//3. invoke initialzer-function and set the generated functions to their ParsingResult elements
	this.initEvalFunctions();
	
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
 * @returns {Array<String>} of Strings the renderingBuffer with the contents of this object added at the end
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
 * @requires RenderUtils
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
	
	if(this.initEvalFunctions) sb.push( 'initEvalFunctions: ',this.initEvalFunctions.toString(),',');//MOD glob vars
	
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
	
	if(this['renderer'] || this['view'] || this['this.initEvalFunctions']){
		//add initializer function
		//  (NOTE: needs to be called before view/controller or renderer can be accessed!)
		sb.push( 'init: function(){');
		
		if(this['renderer']){
			sb.push( ' this.initRenderer(); ' );
		}
//		if(this['view']){
//			sb.push( ' this.initView(); ' );
//		}
		if(this['initEvalFunctions']){//MOD glob vars
			sb.push(' this.initEvalFunctions(); ');
		}
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