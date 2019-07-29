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


define ( ['mmirf/commonUtils','mmirf/contentElement','mmirf/storageUtils','require'],
	//this comment is needed by jsdoc2 [copy of comment for: function Partial(...]
	/**
	 * The Partial class is a containing the definition of the partial and methods to access the definition.
	 *
	 * @param {Object} ctrl
	 * 			Controller instance / object
	 * @param {String} name
	 * 			Name of the Partial
	 * @param {String} definition
	 * 			Partial description, i.e. the raw template code that will be processed.
	 * 			May be empty: in this case the processed contents must be
	 * 						  added manually (cf. parser.StorageUtils)
	 *
	 * @requires if param definition is NOT empty: parser.RenderUtils (must be loaded beforehand via <code>require(["mmirf/renderUtils"]...</code>)
	 * @requires if param definition is NOT empty: parser.ParseUtils (must be loaded beforehand via <code>require(["mmirf/parseUtils"]...</code>)
	 *
	 * @name Partial
	 * @class
	 */
	function (
			commonUtils, ContentElement, parser, require
){
	/** @scope Partial.prototype *///for jsdoc2

	//set to @ignore in order to avoid doc-duplication in jsdoc3
	/**
	 * @ignore
	 *
	 * The Partial class is a containing the definition of the partial and methods to access the definition.
	 *
	 * @constructs Partial
	 * @param {Object} ctrl
	 * 			Controller instance / object
	 * @param {String} name
	 * 			Name of the Partial
	 * @param {String} definition
	 * 			Partial description, i.e. the raw template code that will be processed.
	 * 			May be empty: in this case the processed contents must be
	 * 						  added manually (cf. parser.StorageUtils)
	 *
	 * @requires if param definition is NOT empty: parser.RenderUtils (must be loaded beforehand via <code>require(["mmirf/renderUtils"]...</code>)
	 * @requires if param definition is NOT empty: parser.ParseUtils (must be loaded beforehand via <code>require(["mmirf/parseUtils"]...</code>)
	 *
	 */
	function Partial(ctrl, name, definition){
//	    var HTMLCommentRegExp = /<!--[\s\S]*?-->/g;

		if(definition){
			//remove HTML comments:
	    	definition = definition.replace(commonUtils.regexHTMLComment, '');
	    }

	    this.controller = ctrl;
	    this.def = definition;
	    this.name = name;
//	    console.log("[Partial] parsed Partial '" +this.controller + "-"+this.name+ "'.");

	    if(definition){

		    var contentElementInfo = {
		    		//this name is purely informational:
		    		name : this.controller.getName() + 'Partial',
		    		content : this.def
		    };
		    var parserUtils = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? __webpack_require__('mmirf/parseUtils') : require('mmirf/parseUtils');
		    var renderUtils = typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? __webpack_require__('mmirf/renderUtils') : require('mmirf/renderUtils');
		    this.contentElement = new ContentElement(contentElementInfo, this, parserUtils, renderUtils);
	    }
	}


	/**
	 * Gets the definition of a partial.
	 *
	 * @function
	 * @returns {String} The partial description string
	 */
	Partial.prototype.getDefinition = function(){
	    return this.def;
	};

	/**
	 * Gets the name of a partial.
	 *
	 * @function
	 * @returns {String} The name of the partial
	 */
	Partial.prototype.getName = function(){
		return this.name;
	};

	/**
	 * Gets the controller of a partial - each partial is assigned to a specific controller, although they can be used from different controllers.
	 *
	 * @function
	 * @returns {Object} The controller of the partial
	 */
	Partial.prototype.getController = function(){
	    return this.controller;
	};

	/**
	 * Gets the {@link mmir.ContentElement}, i.e. the content that this instance represents.
	 *
	 * @function
	 * @returns {mmir.ContentElement} The ContentElement object
	 */
	Partial.prototype.getContentElement = function(){
	    return this.contentElement;
	};

	Partial.prototype.stringify = function(){

		// "plain properties" list
		var propList = [
		     'name',
		     'def'
		];

		//Array-properties
		var stringifyablePropList = [
	   	     'contentElement' //element type: ContentElement (stringify-able)
	   	];

		//function for iterating over the property-list and generating JSON-like entries in the string-buffer
		var appendStringified = parser.appendStringified;

		var moduleNameString = '"'+this.name+this.getController().getName()+'Partial"';

		var sb = [parser.STORAGE_CODE_WRAP_PREFIX, 'require("mmirf/storageUtils").restoreObject({ classConstructor: "mmirf/partial"', ','];

		appendStringified(this, propList, sb);

		//non-primitives properties with stringify() function:
		appendStringified(this, stringifyablePropList, sb, null, function arrayValueExtractor(name, stringifyableValue){
			return stringifyableValue.stringify();
		});


		//NOTE the use of require() here, assumes that the dependency has already been loaded (i.e. has already been request by some other module!)
		sb.push( 'initPublish: function(){ require("mmirf/presentationManager").addPartial(this.getController(), this); }');
		sb.push(',');

		//TODO is there a better way to store the controller? -> by its contoller's name, and add a getter function...
		if(this['controller']){

			//getter/setter function for controller
			//  (NOTE: this init-function needs to be called before controller can be accessed!)
			sb.push( 'initController: function(){');

			// store controller-name:
			sb.push( ' var ctrlName = ');
			sb.push( JSON.stringify(this.getController().getName()) );

			// ... and the getter/setter code:
			sb.push( '; this.controller = require("mmirf/controllerManager").get(ctrlName); },' );//TODO see remark about use of require() above


			//add initializer function
			//  (NOTE: needs to be called before controller or renderer can be accessed!)
			sb.push( 'init: function(){');
			sb.push( ' this.initController(); ' );
			sb.push( ' }' );

			//NOTE: need to add comma in a separate entry
			//      (-> in order to not break the removal method of last comma, see below)
			sb.push( ',' );
		}

		//if last element is a comma, remove it
		if(sb[sb.length - 1] === ','){
			sb.splice( sb.length - 1, 1);
		}

		//TODO use requirejs mechanism? (see remark above)
//		sb.push(' }, true); });\n require([' //<- add require-call, so that this JS-file adds itself to the loaded dependencies in requirejs
//				+ moduleNameString + ']);');

		sb.push(' }, true, '+parser.STORAGE_FILE_FORMAT_NUMBER+');');
		sb.push(parser.STORAGE_CODE_WRAP_SUFFIX);
		return sb.join('');
	};

	return Partial;

});
