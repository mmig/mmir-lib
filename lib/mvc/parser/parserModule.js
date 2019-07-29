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


define(
	/**
	 * This module holds functions / classes for template parsing.
	 * 
	 * <p>
	 * This module contains definitions for constants used in the Template Parser and Renderer.
	 * 
	 * 
	 * 
	 * @namespace
	 * @name mmir.parser
	 * @example
	 * //access the parser module
	 * // (it is a sub-module of mmir!)
	 * var someConst = mmir.parser.element.INCLUDE_SCRIPT;
	 * ...
	 * 
	 */
	function(
){

	
var parser = {
	/**
	 * @namespace
	 * @name mmir.parser.element
	 */
	element: {

	//TODO detect&use Object.defineProperty (if positively detected), e.g.:
//		Object.defineProperty(parser.element, 'INCLUDE_SCRIPT', {value : 0, writable : false, configurable : false, enumerable : true});

	/**
	 * Constant for template expression type <tt>include script</tt>.
	 * 
	 * <p>
	 * The template expression generates a script TAG.
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type INCLUDE_SCRIPT:
	 * <ul>
	 * 	<li><strong>scriptPath</strong>: the path / URL to the resource</li>
	 * 	<li><strong>scriptPathType</strong>: the type of the <tt>scriptPath</tt>
	 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
	 * </ul>
	 * 
	 * @memberOf @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	INCLUDE_SCRIPT 		: 0,
	/**
	 * Constant for template expression type <tt>include style</tt>.
	 * 
	 * <p>
	 * The template expression generates a style reference, i.e.
	 * a link TAG with <tt>rel</tt> attribute <code>stylesheet</code>.
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type INCLUDE_STYLE:
	 * <ul>
	 * 	<li><strong>stylePath</strong>: </li>
	 * 	<li><strong>stylePathType</strong>: the type of the <tt>stylePath</tt>
	 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	INCLUDE_STYLE 		: 2,
	/**
	 * Constant for template expression type <tt>localize</tt>.
	 * 
	 * <p>
	 * The template expression inserts a localized String.
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type LOCALIZE:
	 * <ul>
	 * 	<li><strong>name</strong>: the name/identifier for the localized String</li>
	 * 	<li><strong>nameType</strong>: the type of the <tt>name</tt>
	 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	LOCALIZE	 		: 4,
	/**
	 * Constant for template expression type <tt>yield declaration</tt>.
	 * 
	 * <p>
	 * The template expression declares a yield section.
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type YIELD_DECLARATION:
	 * <ul>
	 * 	<li><strong>name</strong>: the name/identifier for the yield section</li>
	 * 	<li><strong>nameType</strong>: the type of the <tt>name</tt>
	 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	YIELD_DECLARATION 	: 8,
	/**
	 * Constant for template expression type <tt>yield content</tt>.
	 * 
	 * <p>
	 * The template expression specifies the content of a yield section.
	 * 
	 * <p>
	 * A yield section corresponds to a {@link ContentElement}:
	 * Its content can itself contain HTML content as well as template expressions.
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	YIELD_CONTENT 		: 16,
	/**
	 * Constant for template expression type <tt>code block</tt>.
	 * 
	 * <p>
	 * The template expression represents a compiled code block (script).
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type BLOCK:
	 * <ul>
	 * 	<li><strong>scriptContent</strong> {String}: <tt>OPTIONALLY</tt> the script code as a String</li>
	 * 	<li><strong>scriptEval</strong> {Function}: the compiled script code in form of a function. The 
	 * 							function takes one argument: the current data-object.</li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	BLOCK 				: 32,
	/**
	 * Constant for template expression type <tt>code statement</tt>.
	 * 
	 * <p>
	 * The template expression represents a compiled code statement (script).
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type STATEMENT:
	 * <ul>
	 * 	<li><strong>scriptContent</strong> {String}: <tt>OPTIONALLY</tt> the script code as a String</li>
	 * 	<li><strong>scriptEval</strong> {Function}: the compiled script code in form of a function. The 
	 * 							function takes one argument: the current data-object.</li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	STATEMENT 			: 64,
	/**
	 * Constant for template expression type <tt>helper</tt>.
	 * 
	 * <p>
	 * The template expression will invoke a function in the {@link Helper} instance
	 * (depending of the {@link Controller}, in which's view definition this template expression is used).
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type HELPER:
	 * <ul>
	 * 	<li><strong>helper</strong>: the name of the helper function</li>
	 * 	<li><strong>helperType</strong>: the type of the <tt>helper</tt>
	 * 		 field: one of <code>StringLiteral</code>, <code>Identifier</code>, <code>IdentifierNameAmpersatStart</code></li>
	 * 	<li><strong>argsEval</strong> {Function}: OPTIONALLY compiled getter Function for retrieving the current ARGS 
	 * 			(optional argument) of the helper expression. The function takes one argument: the current data-object.</li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	HELPER	 			: 128,
	/**
	 * Constant for template expression type <tt>if</tt>.
	 * 
	 * <p>
	 * The template expression represents an if-expression, including the content-block
	 * that follows the condition-statement of the if-expression.
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type IF:
	 * <ul>
	 * 	<li><strong>ifEval</strong> {Function}: the condition statement, that was compiled into a Function. The 
	 * 							function takes one argument: the current data-object.</li>
	 * 	<li><strong>content</strong> {ContentElement}: the HTML / template content that should be render, in case the
	 * 					if-expression evaluates to <code>true</code>.</li>
	 *  <li><strong>elseContent</strong> {@link mmir.parser.ParsingResult}: OPTIONALLY a ParsingResult
	 *  					representing an else-expression, see {@link mmir.parser.element.ELSE}.</li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	IF		 			: 256,
	/**
	 * Constant for template expression type <tt>else</tt>.
	 * 
	 * <p>
	 * The template expression represents an else-expression (including its content-block);
	 * an else-expression may occur in combination with an if-expression, see {@link mmir.parser.element.IF}.
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type ELSE:
	 * <ul>
	 * 	<li><strong>content</strong> {ContentElement}: the HTML / template content that should be render, in case the
	 * 					if-expression (to which the else-expression belongs) evaluates to <code>false</code>.</li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	ELSE	 			: 512,
	/**
	 * Constant for template expression type <tt>for</tt>.
	 * 
	 * <p>
	 * The template expression represents for-expression (including its content-block);
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type FOR:
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
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	FOR		 			: 1024,
	/**
	 * Constant for template expression type <tt>render</tt>.
	 * 
	 * <p>
	 * The template expression renders a <tt>partial view</tt> into a view.
	 * 
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type RENDER:
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
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	RENDER	 			: 2048,
	/**
	 * Constant for template expression type <tt>escape enter</tt>.
	 * 
	 * <p>
	 * The template expression represents an escape statement (when entering a template expression);
	 * escaping means, that the following sequence is not interpreted as template expression.
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type ESCAPE_ENTER:
	 * <ul>
	 * 	<li><strong>text</strong> {String}: the text that will be rendered (i.e. without the escape-character(s) itself).</li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	ESCAPE_ENTER		: 4096,
	/**
	 * Constant for template expression type <tt>escape exit</tt>.
	 * 
	 * <p>
	 * The template expression represents an escape statement (when exiting a template expression);
	 * escaping means, that the following sequence is not interpreted as template expression.
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type ESCAPE_EXIT:
	 * <ul>
	 * 	<li><strong>text</strong> {String}: the text that will be rendered (i.e. without the escape-character(s) itself).</li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	ESCAPE_EXIT			: 8192,

	/**
	 * Constant for for-expression type <tt>iter</tt> ("iteration").
	 * 
	 * <p>
	 * This type identifies an ITERATION type for-expression.
	 * 
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 * 
	 * @see parser.element.FOR
	 */
	FOR_TYPE_ITER		: 16384,
	/**
	 * Constant for for-expression type <tt>step</tt> ("step-wise").
	 * 
	 * <p>
	 * This type identifies an STEP-wise type for-expression.
	 * 
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 * 
	 * @see parser.element.FOR
	 */
	FOR_TYPE_STEP		: 32768,

	/**
	 * Constant for template expression type <tt>variable declaration</tt>.
	 * 
	 * <p>
	 * The template expression represents a variable declaration.
	 * 
	 * <p>
	 * Properties of {@link mmir.parser.ParsingResult} objects with type VAR_DECLARATION:
	 * <ul>
	 * 	<li><strong>name</strong>: the name for the variable (without the leading <tt>@</tt> of template variables)</li>
	 * 	<li><strong>nameType</strong>: the type of the <tt>name</tt> field: <code>StringLiteral</code></li>
	 * </ul>
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	VAR_DECLARATION		: 65536,
	/**
	 * Constant for template expression type <tt>variable reference</tt>.
	 * 
	 * <p>
	 * This template expression is used within JavaScript code blocks / statements,
	 * in order to replace the occurrence of the <tt>template variable</tt> by an
	 * appropriate getter function, that retrieves the current value of the variable
	 * during the execution of the script code.
	 * 
	 * <p>
	 * NOTE: this is used during compilation of the Function objects, used e.g. by BLOCK, STATEMENT, FOR etc.
	 * 
	 * <p>
	 * NOTE: the name of the variable is extracted from the raw-template text during processing/compilation
	 * 		 of the Functions.
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	VAR_REFERENCE		: 131072,

	/**
	 * Constant for template expression type <tt>comment</tt>.
	 * 
	 * <p>
	 * The template expression represents a template-comment: the content of the comment will be ignored
	 * (that is: removed during processing of the template).
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type Number
	 * @public
	 */
	COMMENT				: 262144,

	/**
	 * Constant for <tt>data</tt> name that is used to hold the <tt>current data</tt>:
	 * this name will be used for the argument name of generated/compiled Functions, and in the Function code block
	 * appropriate getter/setter expression will be inserted.
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type String
	 * @public
	 */
	DATA_NAME				: '__$$DATA$$__',
	/**
	 * Constant for the name of the reserved <tt>data</tt> variable: the optional data argument is passed in 
	 * into rendering-calls for views, layouts etc. (see PresentationManager)
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type String
	 * @public
	 */
	DATA_ARGUMENT_NAME		: '@data',
	/**
	 * Constant for the name of the reserved <tt>argument</tt> variable: some template expressions
	 * have an (optional) <tt>argument</tt> argument, which can be accessed using the variable name
	 * within the template expressions inner content-/code-blocks. 
	 * 
	 * @memberOf mmir.parser.element
	 * @constant
	 * @type String
	 * @public
	 */
	ARGUMENT_ARGUMENT_NAME	: '@argument'
	
	}//END element: {...

};//END: parser: {...

return parser;
});
