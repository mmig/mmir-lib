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


define(['mmirf/parsingResult', 'mmirf/storageUtils'],
	//this comment is needed by jsdoc2 [copy of comment for: function YieldDeclaration(...]
	/**
	 * The YieldDeclaration class holds the name of the yield-declaration (which is a place-holder for the contentFor-fields and is used in the layouts: content, header, footer, dialogs, ...)
	 * and its starting and ending position within the content-definition.
	 *
	 * @param {Object} parsingElement with properties <code>name</code> {String}, <code>start</code> {Integer}, <code>end</code> {Integer}
	 * @param {Integer} contentAreaType the type of the content area within the layout that this yield-declaration refers to (e.g. ViewConstants.CONTENT_AREA_BODY )
	 *
	 * borrows the getValue function from ParsingResult:
	 * 	@requires mmir.parser.ParsingResult#getValue
	 *
	 * @name YieldDeclaration
	 * @class
	 */
	function(
		ParsingResult, parser
) {
	/** @scope YieldDeclaration.prototype *///for jsdoc2

	//set to @ignore in order to avoid doc-duplication in jsdoc3
	/**
	 * The YieldDeclaration class holds the name of the yield-declaration (which is a place-holder for the contentFor-fields and is used in the layouts: content, header, footer, dialogs, ...)
	 * and its starting and ending position within the content-definition.
	 *
	 * @constructs YieldDeclaration
	 * @param {Object} parsingElement with properties <code>name</code> {String}, <code>start</code> {Integer}, <code>end</code> {Integer}
	 * @param {Integer} contentAreaType the type of the content area within the layout that this yield-declaration refers to (e.g. ViewConstants.CONTENT_AREA_BODY )
	 *
	 * borrows the getValue function from ParsingResult:
	 * 	@requires mmir.parser.ParsingResult#getValue
	 *
	 * @ignore
	 */
	function YieldDeclaration(parsingElement, contentAreaType){

		if(parsingElement){
			this.name     = parsingElement.name;
			this.nameType = parsingElement.nameType;

			this.start    = parsingElement.start;
			this.end      = parsingElement.end;
		}

		this.contentAreaType = contentAreaType;

		return this;
	}



	/**
	 * Gets the name of a {@link mmir.YieldDeclaration} object (e.g. content, header, footer, dialogs, ...).
	 *
	 * @function
	 * @returns {String} Name - used by yield tags in layout
	 * @public
	 */
	YieldDeclaration.prototype.getName = function(){
	    return this.name;
	};

	YieldDeclaration.prototype.getNameType = function(){
	    return this.nameType;
	};

	/**
	 * Gets the type of the content area that this {@link mmir.YieldDeclaration} object refers to (i.e. "areas" in the layout, e.g. bodyContents, dialogsContent).
	 *
	 * @function
	 * @returns {Integer} Content area type (see {@link mmir.Layout}, e.g. ViewConstants.CONTENT_AREA_BODY)
	 * @public
	 */
	YieldDeclaration.prototype.getAreaType = function(){
	    return this.contentAreaType;
	};

	/**
	 * Gets the start position (index) of a {@link mmir.YieldDeclaration} object.
	 *
	 * @function
	 * @returns {Integer} Start position of the Yield within the content (e.g. the bodyContent or the dialogsContent)
	 * @public
	 */
	YieldDeclaration.prototype.getStart = function(){
	    return this.start;
	};

	/**
	 * Gets the end position (index) of a {@link mmir.YieldDeclaration} object.
	 *
	 * @function
	 * @returns {Integer} End position of the Yield within the content (e.g. the bodyContent or the dialogsContent)
	 * @public
	 */
	YieldDeclaration.prototype.getEnd = function(){
	    return this.end;
	};


	/**
	 * Get the value for property <code>name</code> with the proper type
	 * (as specified by <code>nameType</code>).
	 * This may be neccessary, if the nameType is not e.g. STRING but a VARIABLE,
	 * in which case <code>name</code> does not reference the value itself, but the name
	 * for the variable
	 *
	 * This is a shortcut to the function
	 * mobileDS.parser.ParsingResult.prototype.getValue
	 *
	 * I.e. for YieldDeclration yield with a nameType of VARIABLE, to not use:
	 * <s><code>yield.getName()</code></s>
	 *
	 * but
	 *
	 * <code>yield.getValue(yield.getName(), yield.getNameType(), theRenderingData)</code>
	 * where theRenderingData is an object that contains a property from which the variable value can be retrieved, i.e.
	 * where <em>theRenderingData[yield.getName()]</em> contains the YieldDeclaration's name.
	 *
	 */
	YieldDeclaration.prototype.getValue = ParsingResult.prototype.getValue;

	YieldDeclaration.prototype.stringify = function(){

		// "plain properties" list
		var propList = [
	   	     'name',
	   	     'nameType',
	   	     'start',
	   	     'end',
	   	     'contentAreaType'
	   	];

	   	//function for iterating over the property-list and generating JSON-like entries in the string-buffer
	   	var appendStringified = parser.appendStringified;

	   	var sb = ['require("mmirf/storageUtils").restoreObject({ classConstructor: "mmirf/yield"', ','];

	   	appendStringified(this, propList, sb);

	   	//if last element is a comma, remove it
	   	if(sb[sb.length - 1] === ','){
	   		sb.splice( sb.length - 1, 1);
	   	}

	   	sb.push(' })');
	   	return sb.join('');
	};

	return YieldDeclaration;

});
