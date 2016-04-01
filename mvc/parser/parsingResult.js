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
 * Dependencies:
 * 
 *  * parser.element (parserModule.js)
 *  * OPTIONALLY: ANTLR TokenStream (antlr3-all.js)
 *                (if present, the constructor may be able to automatically derive start/end properties from given argument)
 * 
 * 
 * @requires antlr3-all.js as <code>org</code> (see comment above)
 * 
 */

define(['parserModule'], 
//this comment is needed by jsdoc2 [copy of comment for: function ParsingResult(...]
/**
 * ParsingResult represents an element that was detected during parsing.
 * 
 * <p>
 * The detected element is referenced by the properties <code>start</code> and <code>end</code>
 * that refer to the start-index and end-index within the parsed text.
 * 
 * <p>
 * The ParsingResult has a <code>type</code> property which refers to the kind of element
 * that was detected (see constants in {@link mmir.parser.element}).
 * 
 * <p>
 * In addition, the ParsingResult may have several properties that depend of its type. In general,
 * these properties refer to detected parts of the element (e.g. for a invocation-statement, these
 * may refer to its arguments).
 * 
 * 
 * <p>
 * Properties for <strong>INCLUDE_SCRIPT</strong> type:
 * <ul>
 * 	<li><strong>scriptPath</strong>: the path / URL to the resource</li>
 * 	<li><strong>scriptPathType</strong>: the type of the <tt>scriptPath</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * </ul>
 * <p>
 * Properties for <strong>INCLUDE_STYLE</strong> type:
 * <ul>
 * 	<li><strong>stylePath</strong>: </li>
 * 	<li><strong>stylePathType</strong>: the type of the <tt>stylePath</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * </ul>
 * <p>
 * Properties for <strong>LOCALIZE</strong> type:
 * <ul>
 * 	<li><strong>name</strong>: the name/identifier for the localized String</li>
 * 	<li><strong>nameType</strong>: the type of the <tt>name</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * </ul>
 * <p>
 * Properties for <strong>YIELD_DECLARATION</strong> type:
 * <ul>
 * 	<li><strong>name</strong>: the name/identifier for the yield section</li>
 * 	<li><strong>nameType</strong>: the type of the <tt>name</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * </ul>
 * Properties for <strong>BLOCK</strong> type:
 * <ul>
 * 	<li><strong>scriptContent</strong> {String}: <tt>OPTIONALLY</tt> the script code as a String</li>
 * 	<li><strong>scriptEval</strong> {Function}: the compiled script code in form of a function. The 
 * 							function takes one argument: the current data-object.</li>
 * </ul>
 * <p>
 * Properties for <strong>STATEMENT</strong> type:
 * <ul>
 * 	<li><strong>scriptContent</strong> {String}: <tt>OPTIONALLY</tt> the script code as a String</li>
 * 	<li><strong>scriptEval</strong> {Function}: the compiled script code in form of a function. The 
 * 							function takes one argument: the current data-object.</li>
 * </ul>
 * <p>
 * Properties for <strong>HELPER</strong> type:
 * <ul>
 * 	<li><strong>helper</strong>: the name of the helper function</li>
 * 	<li><strong>helperType</strong>: the type of the <tt>helper</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * 	<li><strong>argsEval</strong> {Function}: OPTIONALLY compiled getter Function for retrieving the current ARGS 
 * 			(optional argument) of the helper expression. The function takes one argument: the current data-object.</li>
 * </ul>
 * <p>
 * Properties for <strong>IF</strong> type:
 * <ul>
 * 	<li><strong>ifEval</strong> {Function}: the condition statement, that was compiled into a Function. The 
 * 							function takes one argument: the current data-object.</li>
 * 	<li><strong>content</strong> {ContentElement}: the HTML / template content that should be render, in case the
 * 					if-expression evaluates to <code>true</code>.</li>
 *  <li><strong>elseContent</strong> {@link mmir.parser.ParsingResult}: OPTIONALLY a ParsingResult
 *  					representing an else-expression, see {@link mmir.parser.element.ELSE}.</li>
 * </ul>
 * <p>
 * Properties for <strong>ELSE</strong> type:
 * <ul>
 * 	<li><strong>content</strong> {ContentElement}: the HTML / template content that should be render, in case the
 * 					if-expression (to which the else-expression belongs) evaluates to <code>false</code>.</li>
 * </ul>
 * <p>
 * Properties for <strong>FOR</strong> type:
 * <ul>
 * 	<li><strong>forControlType</strong> {String}: the type of for-loop, either <code>FORITER</code> or <code>FORSTEP</code></li>
 * 	<li><strong>forInitEval</strong> {Function}: the initialization statement of the for-expression, compiled into
 * 									a Function. The function takes one argument: the current data-object.</li>
 * 		
 * 	<li><code>FORITER</code>: <code>@for(PROP in OBJ){ ... }@</code>
 * 	 <ul>
 * 		<li><strong>forIterator</strong> {Object}: an iterator object with functions <code>hasNext() : Boolean</code> and
 * 					<code>next() : String</code> (which returns the name of the property currently iterated).</li>
 * 		<li><strong>forPropName</strong> {String}: the variable name for the property which is currently iterated over.</li>
 * 	 </ul>
 * 	</li>
 * 	<li><code>FORSTEP</code>: <code>@for(INIT; CONDITION; INCREMENT){ ... }@</code>
 * 	 <ul>
 * 		<li><strong>forConditionEval</strong> {Function}: the condition statement of the for-expression, compiled into
 * 											a Function. The function takes one argument: the current data-object.</li>
 * 		<li><strong>forIncrementEval</strong> {Function}: the increment statement of the for-expression, compiled into
 * 											a Function. The function takes one argument: the current data-object.</li>
 * 	 </ul>
 * 	</li>
 * 	<li><strong>content</strong> {ContentElement}: the HTML / template content that should be rendered
 * 								 during each iteration of the for-loop.</li>
 * </ul>
 * <p>
 * Properties for <strong>RENDER</strong> type:
 * <ul>
 * 	<li><strong>partial</strong>: the name of the partial view</li>
 * 	<li><strong>partialType</strong>: the type of the <tt>partial</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * 	<li><strong>controller</strong>: the name of the controller, to which the partial view definition belongs</li>
 * 	<li><strong>controllerType</strong>: the type of the <tt>controller</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * 	<li><strong>argsEval</strong> {Function}: OPTIONALLY compiled getter Function for retrieving the current ARGS 
 * 								(optional argument) of the render expression. The function takes one argument: the current data-object.</li>
 * </ul>
 * <p>
 * Properties for <strong>ESCAPE_ENTER</strong> type:
 * <ul>
 * 	<li><strong>text</strong> {String}: the text that will be rendered (i.e. without the escape-character(s) itself).</li>
 * </ul>
 * <p>
 * Properties for <strong>ESCAPE_EXIT</strong> type:
 * <ul>
 * 	<li><strong>text</strong> {String}: the text that will be rendered (i.e. without the escape-character(s) itself).</li>
 * </ul>
 * <p>
 * Properties for <strong>VAR_DECLARATION</strong> type:
 * <ul>
 * 	<li><strong>name</strong>: the name for the variable (without the leading <tt>@</tt> of template variables)</li>
 * 	<li><strong>nameType</strong>: the type of the <tt>name</tt> field: <code>StringLiteral</code></li>
 * </ul>
 * 
 * <p>
 * 
 * @param {org.antlr.runtime.CommonTokenStream|org.antlr.runtime.Token} [thetokens] OPTIONAL
 * 					if <code>org.antlr.runtime.CommonTokenStream</code>:	
 * 												the TokenStream that corresponds to this parsed element;
 * 												when provided, the TokenStream is used to set the start- and end-
 * 												property of the new instance.<br>
 * 		  			if <code>org.antlr.runtime.Token</code>:
 * 												if the parameter is a single Token object, then the start- and end-
 * 												property for the new instance is set by this token object
 * @class
 * @name ParsingResult
 * @memberOf mmir.parser
 */		
function(parser){
	
var _antrl3;

//set to @ignore in order to avoid doc-duplication in jsdoc3
/**
 * @ignore
 * 
 * ParsingResult represents an element that was detected during parsing.
 * 
 * <p>
 * The detected element is referenced by the properties <code>start</code> and <code>end</code>
 * that refer to the start-index and end-index within the parsed text.
 * 
 * <p>
 * The ParsingResult has a <code>type</code> property which refers to the kind of element
 * that was detected (see constants in {@link mmir.parser.element}).
 * 
 * <p>
 * In addition, the ParsingResult may have several properties that depend of its type. In general,
 * these properties refer to detected parts of the element (e.g. for a invocation-statement, these
 * may refer to its arguments).
 * 
 * 
 * <p>
 * Properties for <strong>INCLUDE_SCRIPT</strong> type:
 * <ul>
 * 	<li><strong>scriptPath</strong>: the path / URL to the resource</li>
 * 	<li><strong>scriptPathType</strong>: the type of the <tt>scriptPath</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * </ul>
 * <p>
 * Properties for <strong>INCLUDE_STYLE</strong> type:
 * <ul>
 * 	<li><strong>stylePath</strong>: </li>
 * 	<li><strong>stylePathType</strong>: the type of the <tt>stylePath</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * </ul>
 * <p>
 * Properties for <strong>LOCALIZE</strong> type:
 * <ul>
 * 	<li><strong>name</strong>: the name/identifier for the localized String</li>
 * 	<li><strong>nameType</strong>: the type of the <tt>name</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * </ul>
 * <p>
 * Properties for <strong>YIELD_DECLARATION</strong> type:
 * <ul>
 * 	<li><strong>name</strong>: the name/identifier for the yield section</li>
 * 	<li><strong>nameType</strong>: the type of the <tt>name</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * </ul>
 * Properties for <strong>BLOCK</strong> type:
 * <ul>
 * 	<li><strong>scriptContent</strong> {String}: <tt>OPTIONALLY</tt> the script code as a String</li>
 * 	<li><strong>scriptEval</strong> {Function}: the compiled script code in form of a function. The 
 * 							function takes one argument: the current data-object.</li>
 * </ul>
 * <p>
 * Properties for <strong>STATEMENT</strong> type:
 * <ul>
 * 	<li><strong>scriptContent</strong> {String}: <tt>OPTIONALLY</tt> the script code as a String</li>
 * 	<li><strong>scriptEval</strong> {Function}: the compiled script code in form of a function. The 
 * 							function takes one argument: the current data-object.</li>
 * </ul>
 * <p>
 * Properties for <strong>HELPER</strong> type:
 * <ul>
 * 	<li><strong>helper</strong>: the name of the helper function</li>
 * 	<li><strong>helperType</strong>: the type of the <tt>helper</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * 	<li><strong>argsEval</strong> {Function}: OPTIONALLY compiled getter Function for retrieving the current ARGS 
 * 			(optional argument) of the helper expression. The function takes one argument: the current data-object.</li>
 * </ul>
 * <p>
 * Properties for <strong>IF</strong> type:
 * <ul>
 * 	<li><strong>ifEval</strong> {Function}: the condition statement, that was compiled into a Function. The 
 * 							function takes one argument: the current data-object.</li>
 * 	<li><strong>content</strong> {ContentElement}: the HTML / template content that should be render, in case the
 * 					if-expression evaluates to <code>true</code>.</li>
 *  <li><strong>elseContent</strong> {@link mmir.parser.ParsingResult}: OPTIONALLY a ParsingResult
 *  					representing an else-expression, see {@link mmir.parser.element.ELSE}.</li>
 * </ul>
 * <p>
 * Properties for <strong>ELSE</strong> type:
 * <ul>
 * 	<li><strong>content</strong> {ContentElement}: the HTML / template content that should be render, in case the
 * 					if-expression (to which the else-expression belongs) evaluates to <code>false</code>.</li>
 * </ul>
 * <p>
 * Properties for <strong>FOR</strong> type:
 * <ul>
 * 	<li><strong>forControlType</strong> {String}: the type of for-loop, either <code>FORITER</code> or <code>FORSTEP</code></li>
 * 	<li><strong>forInitEval</strong> {Function}: the initialization statement of the for-expression, compiled into
 * 									a Function. The function takes one argument: the current data-object.</li>
 * 		
 * 	<li><code>FORITER</code>: <code>@for(PROP in OBJ){ ... }@</code>
 * 	 <ul>
 * 		<li><strong>forIterator</strong> {Object}: an iterator object with functions <code>hasNext() : Boolean</code> and
 * 					<code>next() : String</code> (which returns the name of the property currently iterated).</li>
 * 		<li><strong>forPropName</strong> {String}: the variable name for the property which is currently iterated over.</li>
 * 	 </ul>
 * 	</li>
 * 	<li><code>FORSTEP</code>: <code>@for(INIT; CONDITION; INCREMENT){ ... }@</code>
 * 	 <ul>
 * 		<li><strong>forConditionEval</strong> {Function}: the condition statement of the for-expression, compiled into
 * 											a Function. The function takes one argument: the current data-object.</li>
 * 		<li><strong>forIncrementEval</strong> {Function}: the increment statement of the for-expression, compiled into
 * 											a Function. The function takes one argument: the current data-object.</li>
 * 	 </ul>
 * 	</li>
 * 	<li><strong>content</strong> {ContentElement}: the HTML / template content that should be rendered
 * 								 during each iteration of the for-loop.</li>
 * </ul>
 * <p>
 * Properties for <strong>RENDER</strong> type:
 * <ul>
 * 	<li><strong>partial</strong>: the name of the partial view</li>
 * 	<li><strong>partialType</strong>: the type of the <tt>partial</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * 	<li><strong>controller</strong>: the name of the controller, to which the partial view definition belongs</li>
 * 	<li><strong>controllerType</strong>: the type of the <tt>controller</tt>
 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
 * 	<li><strong>argsEval</strong> {Function}: OPTIONALLY compiled getter Function for retrieving the current ARGS 
 * 								(optional argument) of the render expression. The function takes one argument: the current data-object.</li>
 * </ul>
 * <p>
 * Properties for <strong>ESCAPE_ENTER</strong> type:
 * <ul>
 * 	<li><strong>text</strong> {String}: the text that will be rendered (i.e. without the escape-character(s) itself).</li>
 * </ul>
 * <p>
 * Properties for <strong>ESCAPE_EXIT</strong> type:
 * <ul>
 * 	<li><strong>text</strong> {String}: the text that will be rendered (i.e. without the escape-character(s) itself).</li>
 * </ul>
 * <p>
 * Properties for <strong>VAR_DECLARATION</strong> type:
 * <ul>
 * 	<li><strong>name</strong>: the name for the variable (without the leading <tt>@</tt> of template variables)</li>
 * 	<li><strong>nameType</strong>: the type of the <tt>name</tt> field: <code>StringLiteral</code></li>
 * </ul>
 * 
 * <p>
 * 
 * @constructs ParsingResult
 * @param {org.antlr.runtime.CommonTokenStream|org.antlr.runtime.Token} [thetokens] OPTIONAL
 * 					if <code>org.antlr.runtime.CommonTokenStream</code>:	
 * 												the TokenStream that corresponds to this parsed element;
 * 												when provided, the TokenStream is used to set the start- and end-
 * 												property of the new instance.<br>
 * 		  			if <code>org.antlr.runtime.Token</code>:
 * 												if the parameter is a single Token object, then the start- and end-
 * 												property for the new instance is set by this token object
 * 
 */
function ParsingResult (thetokens){
	var isSet = false;
	
	//try to extract start-/end-indexes from the argument:
	if(thetokens){
		
		if(typeof org !== 'undefined'){
			//NOTE: must invoke getTokens() for initializing size() etc.!
			if(thetokens instanceof org.antlr.runtime.CommonTokenStream && thetokens.getTokens() && thetokens.size() > 0){
				this.start = thetokens.getTokens()[0].getStartIndex();
				this.end = thetokens.getTokens()[thetokens.size()-1].getStopIndex();
				
				isSet = true;
			}
			else if(thetokens instanceof org.antlr.runtime.CommonToken || thetokens instanceof org.antlr.runtime.Token){
				this.start = thetokens.getStartIndex();
				this.end = thetokens.getStopIndex();
							
				isSet = true;
			}
		}
		
		//if not already set, try...
		if( isSet === false && typeof thetokens.getToken !== 'undefined' && (typeof thetokens.getToken().getStartIndex !== 'undefined' && typeof thetokens.getToken().getStopIndex !== 'undefined')){
			this.start = thetokens.getToken().getStartIndex();
			this.end = thetokens.getToken().getStopIndex();
						
			isSet = true;
		}
		else if(typeof thetokens.getStartIndex !== 'undefined' && typeof thetokens.getStopIndex !== 'undefined'){
			this.start = thetokens.getStartIndex();
			this.end = thetokens.getStopIndex();
						
			isSet = true;
		}
		else if(isSet === false) {
			var type = Object.prototype.toString.call(thetokens);//.match(/^\[object (.*)\]$/)[1];
			console.warn('unknown argument type: '+type);//debug
		}
	}
	
	if(isSet === false) {
		this.start = -1;
		this.end   = -1;
	}
};

/**
 * Set the start position (index) for this parsed element with regard to the TokenStream of the complete input.
 * 
 * @function
 * @param {org.antlr.runtime.CommonTokenStream} thetokens (optional) the TokenStream that corresponds to this parsed element;
 * 												when provided, the TokenStream is used to set the start-property of this object.
 * 
 * @public
 */
ParsingResult.prototype.setStartFrom = function(thetokens){
	//NOTE: must invoke getTokens() for initializing size() etc.!
	if(thetokens.getTokens() && thetokens.size() > 0){
		this.start = thetokens.getTokens()[0].getStartIndex();
	} 
	else {
		this.start = -1;
	}
};

/**
 * Set the end position (index) for this parsed element with regard to the TokenStream of the complete input.
 * 
 * @function
 * @param {org.antlr.runtime.CommonTokenStream} thetokens (optional) the TokenStream that corresponds to this parsed element;
 * 												when provided, the TokenStream is used to set the end-property of this object.
 * 
 * @public
 * @alias mmir.parser.ParsingResult
 */
ParsingResult.prototype.setEndFrom = function(thetokens){
	//NOTE: must invoke getTokens() for initializing size() etc.!
	if(thetokens.getTokens() && thetokens.size() > 0){
		this.end = thetokens.getTokens()[thetokens.size()-1].getStopIndex();
	} 
	else {
		this.end = -1;
	}
};
ParsingResult.prototype.getStart = function(){
	return this.start;
};
ParsingResult.prototype.getEnd = function(){
	return this.end;
};

/**
 * Get the type of this parsed element, i.e. as which type this element was parsed.
 * 
 * The type corresponds to one of the type defined in {mmir.parser.element}.
 * 
 * @function
 * @return {mmir.parser.element} the type for this ParsingResult
 * 
 * @public
 */
ParsingResult.prototype.getType = function(){
	return this.type;
};

//helper function for converting properties to the correct value.
// By default, the ParsingResult only contains "raw" property values.
// Which properties are available, depends on the type of the ParsingResult (see templateProcessor.js)
ParsingResult.prototype.getValue = function(rawPropertyValue, proptertyType, data){
	
	if(proptertyType === 'StringLiteral'){
		return rawPropertyValue.substring(1, rawPropertyValue.length-1);
	}
	else if(proptertyType === 'Identifier'){
		if(data){
			return data['@' + rawPropertyValue];
		}
		else {
			//just return variable name
			return rawPropertyValue;
		}
	}
	else if(proptertyType === 'IdentifierNameAmpersatStart'){
		if(data){
			return data[rawPropertyValue];
		}
		else {
			//just return variable name, but remove leading @:
			return rawPropertyValue.substring(1);
		}
	}
	else if(proptertyType === 'OBJECT'){
		return rawPropertyValue;//TODO
	}
	else if(proptertyType === 'DecimalLiteral'){
		return parseFloat(rawPropertyValue);
	}
//	else if(typeof proptertyType === 'undefined'){
//		return rawPropertyValue;
//	}
	else
		return rawPropertyValue;
};

ParsingResult.prototype.hasVarReferences = function(){
	return false;//TODO implement this
};

ParsingResult.prototype.isScriptTag = function(){
	if( parser.element.INCLUDE_SCRIPT === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isStyleTag = function(){
	if( parser.element.INCLUDE_STYLE === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isLocalize = function(){
	if( parser.element.LOCALIZE === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isYield = function(){
	if( parser.element.YIELD_DECLARATION === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isYieldContent = function(){
	if( parser.element.YIELD_CONTENT === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isScriptBlock = function(){
	if( parser.element.BLOCK === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isScriptStatement = function(){
	if( parser.element.STATEMENT === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isHelper = function(){
	if( parser.element.HELPER === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isIf = function(){
	if( parser.element.IF === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.hasElse = function(){
	if(this.isIf() && typeof this.elseContent != 'undefined'){
		return true;
	}
	return false;
};

ParsingResult.prototype.isElse = function(){
	if( parser.element.ELSE === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isFor = function(){
	if( parser.element.FOR === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isRender = function(){
	if( parser.element.RENDER === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isEscapeEnter = function(){
	if( parser.element.ESCAPE_ENTER === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isEscapeExit = function(){
	if( parser.element.ESCAPE_EXIT === this.getType() ){
		return true;
	}
	return false;
};

ParsingResult.prototype.isEscape = function(){
	return this.isEscapeEnter() || this.isEscapeExit();
};

/**
 * WARNING: do use sparingly -- an invocation triggers a list evaluation.
 * 
 * @returns {String} a String representation (name) for this ParsingResult's type
 * 
 * @see #getType
 */
ParsingResult.prototype.getTypeName = function(){
	
	if(this.typeName){
		return this.typeName;/////////////////// EARLY EXIT //////////////////////////
	}
	
	for(var prop in parser.element){
		if(parser.element.hasOwnProperty(prop) && parser.element[prop] === this.getType()){
			this.typeName = prop;
			return prop;/////////////////// EARLY EXIT //////////////////////////
		}
	}
	
	return void(0);
};

ParsingResult.prototype.hasCallData = function(){
	return typeof this.dataPos !== 'undefined';
};

ParsingResult.prototype.getCallDataStart = function(){
	return this.dataPos.start;
};

ParsingResult.prototype.getCallDataEnd = function(){
	return this.dataPos.end;
};

ParsingResult.prototype.getCallDataType = function(){
	return this.dataType;
};

ParsingResult.prototype.stringify = function(){
	
	//TODO use constants for lists
	
    //typed properties:
	// for each typed properties '<prop>' there is an additional property with name '<prop>Type'
	// (both of these properties are Strings themselves)
	var typedPropList = [
	     'scriptPath',
	     'stylePath', 
	     'name',
	     'helper',
	     'partial',
	     'controller'
	];
	
	//primitive-type properties:
	// write values 'as is' for these properties
	var propList = [
   	     'start',
	     'end',
	     'type',
	     'dataType',
	     'text',
	     'forControlType',
	     'forPropName'
	];
	
	//"stringify-able" object properties:
	var strPropList = [
   	     'content',
   	     'elseContent'
   	];
	
	//function properties:
	var funcPropList = [
   	     'scriptEval',
   	     'argsEval',
   	     'ifEval',
   	     'forInitEval',
   	     'forIterator',
   	     'forConditionEval',
   	     'forIncrementEval'
   	];
	
	//default function properties:
	// these functions from the prototype may have been overwritten
	//  -> if one is overwritten, i.e. not the default implementation, then store that one too
	var overwrittenFuncPropList = [
 	     'getEnd',
   	     'getStart',
   	     'getType',
   	     'getValue',
   	     'getTypeName',
   	     'getCallDataStart',
   	     'getCallDataEnd',
   	     'getCallDataType'
   	];
	
	//function for iterating over the property-list and generating JSON-like entries in the string-buffer
	var  appendStringified = parser.appendStringified;

	var sb = ['require("storageUtils").restoreObject({ classConstructor: "parsingResult"', ','];

	//TODO property dataPos: {start: Number, end: Number}
	if(this['dataPos']){
		sb.push( 'dataPos:{start:' );
		sb.push( this.dataPos.start );
		sb.push( ',end:' );
		sb.push( this.dataPos.end );
		sb.push( '}' );
		//NOTE: need to add comma in a separate entry 
		//      (-> in order to not break the removal method of last comma, see below)
		sb.push( ',' );
	}
		
	
	appendStringified(this, typedPropList, sb);
	appendStringified(this, typedPropList, sb, 'Type');
	appendStringified(this, propList, sb);
	//non-primitives with stringify() function:
	appendStringified(this, strPropList, sb, null, function stringifyableExtractor(name, value){
		return value.stringify();
	});
	//function definitions
	appendStringified(this, funcPropList, sb, null, function functionExtractor(name, value){
		return value.toString();
	});
	//add "overwritten" function definitions
	appendStringified(this, overwrittenFuncPropList, sb, null, function nonDefaultFunctionExtractor(name, value){
		var instanceImpl = value.toString();
		var defaultImpl = ParsingResult.prototype[name].toString();
		if(instanceImpl !== defaultImpl){
			return instanceImpl;
		}
		//DEFAULT: return void (will omit this from storage -> use default impl. of the prototype)
		return;
	});
	
	//if last element is a comma, remove it
	if(sb[sb.length - 1] === ','){
		sb.splice( sb.length - 1, 1);
	}
	
	sb.push(' })');
	return sb.join('');
};

/**
 * HELPER for making the namespace of the core-parser (i.e. ANTLR3) available
 * 
 * This is necessary in environments where the namespace is not automatically
 *  exported into the global namespace, e.g. when runnin in nodejs.
 * 
 * @static
 * @private
 * @param {String} parserNamerspace
 * 			the namespace object of the ANTLR parser (should be the object org which is exported by antlr3 module/shim) 
 */
ParsingResult._nsParserInit = function(parserNamerspace){
	
	_antrl3 = parserNamerspace;
	
	if(typeof org === 'undefined'){
		org = parserNamerspace;
	}
};

parser.ParsingResult = ParsingResult;

return parser.ParsingResult;

});//END: define(..., function(){