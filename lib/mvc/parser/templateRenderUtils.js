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



define (['mmirf/commonUtils','mmirf/languageManager','mmirf/controllerManager','mmirf/presentationManager','mmirf/parserModule','mmirf/viewConstants',
         'mmirf/logger', 'module'
   ],

   /**
    * A Utility class for rendering parsed (eHTML) templates, or more specifically ParsingResult objects.<br>
    *
    * @example mmir.parser.RenderUtils.render(parseResult, contentElementList);
    *
    * @class RenderUtils
    * @name mmir.parser.RenderUtils
    * @export RenderUtils as mmir.parser.RenderUtils
    * @public
    * @static
    *
    */
   function (
		   commonUtils, languageManager, controllerManager, presentationManager, parser, ViewConstants,
		   Logger, module
) {

		/**
	     * Object containing the instance of the class RenderUtils
	     *
	     * @type RenderUtils
	     *
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
	    var instance = null;

	    /**
	     * the logger for the RenderUtils
	     *
	     * @type Logger
	     *
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
	    var logger = Logger.create(module);

	  //internal "constants" for the RENDERING mode
	    /**
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
		var RENDER_MODE_LAYOUT 			= 0;
		/**
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
		var RENDER_MODE_PARTIAL 		= 2;
		/**
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
		var RENDER_MODE_VIEW_CONTENT 	= 4;
		/**
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
		var RENDER_MODE_VIEW_DIALOGS 	= 8;
		/**
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
		var RENDER_MODE_JS_SOURCE       = 16;
		/**
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
		var RENDER_MODE_JS_SOURCE_FORCE_VAR_PREFIX = 32;

		/**
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
		var DATA_NAME       = parser.element.DATA_NAME;
		/**
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
		var PARAM_DATA_NAME = parser.element.DATA_ARGUMENT_NAME;
		/**
	     * @private
	     * @memberOf mmir.parser.RenderUtils#
	     */
		var PARAM_ARGS_NAME = parser.element.ARGUMENT_ARGUMENT_NAME;


		/**
		 * HELPER for detecting if an object is an Array
		 *
		 * @function
		 *
	     * @private
		 * @memberOf mmir.parser.RenderUtils#
		 *
		 * @see mmir.CommonUtils#isArray
		 */
		var isArray = commonUtils.isArray;

		/**
		 * helper for sorting an Arrays.
		 *
		 * Notes:
		 * 1. all array elements must have a function {Number} getStart()
		 * 2. the array will be sorted ascending by getStart(), e.g. sort by occurrence in the raw template-text
		 *
		 * Usage example:
		 * <code>
		 * theArray.sort(sortAscByStart);
		 * </code>
		 *
	     * @private
		 * @memberOf mmir.parser.RenderUtils#
		 */
		var sortAscByStart=function(parsedElem1, parsedElem2){
			return parsedElem1.getStart() - parsedElem2.getStart();
		};

	    /**
		 * Constructor-Method of Singleton mmir.parser.RenderUtils
		 *
		 * @private
		 * @ignore
		 *
		 * @memberOf mmir.parser.RenderUtils#
		 */
	    function constructor(){
	        //private members.

	    	/**
	    	 * @type mmir.LanguageManager
	    	 * @name localizer
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	var localizer = languageManager;

	    	/**
	    	 * Prepares the layout:
	    	 *
	    	 * after loading a layout file, this methods prepares the layout
	    	 * for rendering content into it
	    	 * (i.e. "prepare layout definition for later view-renderings").
	    	 *
	    	 *
	    	 * NOTE: this does not actually render the layout for "viewing"
	    	 *       (see renderContent(..))!
	    	 *
	    	 * @param {ParsingResult} result the parsing result for the layout string
	    	 * @param {Array<ContentElement>} contentForArray (usually this would be NULL for pre-rendering layouts)
	    	 * @param {Number} renderingMode the rendering mode for layouts
	    	 * @returns {String} the (pre-) rendered layout
	    	 *
	    	 *
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 * @name renderLayoutImpl
	    	 */
	    	function renderLayout(result, contentForArray, renderingMode) {

	    		//TODO need to enable dynamic elements for this LAYOUT-rendering
	    		//     (e.g. for 'calculating' variables that can be used as @yield-arguments ... should vars for this be disabled?)

	    		//create list of all template-expressions
	    		var all = result.scripts.concat(
	    			result.styles//[DISABLED: only process script- and style-tags at this stage], result.yields, result.localizations
	    		);
	    		//sort list by occurrence:
	    		all.sort(sortAscByStart);

	    		var renderResult = new Array();

	    		var pos = 1;
	    		for(var i=0, size = all.length; i < size; ++i){

	    			var scriptElem = all[i];
	    			//render the "static" content, beginning from the
	    			//	lastly rendered "dynamic" element up to the start
	    			//  of the current "dynamic" element:
	    			renderResult.push(result.rawTemplateText.substring(pos-1, scriptElem.getStart()));

	    			//render the current "dynamic" element:
	    			renderElement(scriptElem, contentForArray, renderingMode, result.rawTemplateText, renderResult);

	    			//set position-marker for "static" content after entry position
	    			// of current "dynamic" element:
	    			pos = scriptElem.getEnd() + 1;

	    			//alert('Replacing \n"'+rawTemplateText.substring(scriptElem.getStart(), scriptElem.getEnd())+'" with \n"'+content+'"');
	    		}

	    		if(pos - 1 < result.rawTemplateText.length){
	    			renderResult.push(result.rawTemplateText.substring(pos - 1));
	    		}

	    		return renderResult.join('');
	    	}

	    	/**
	    	 * Prepares JavaScript source code for usage in rendering the template (view/partial etc.).
	    	 *
	    	 * The replacement-list contains information which parts of the raw JavaScript code should be
	    	 * modified (e.g. indices [start,end] for replacing text in the source code).
	    	 *
	    	 * The function returns the modified JavaScript source code as a String.
	    	 *
	    	 *
	    	 * If the mode is <code>RENDER_MODE_JS_SOURCE_FORCE_VAR_PREFIX</code>, the variable-names that correspond
	    	 * to replacementObjectsList are check: if a name does not start with @, then the name will prepended with @ before
	    	 * rendering.
	    	 *
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 * @name renderJSSourceImpl
	    	 */
	    	function renderJSSource(rawJSSourceCode, replacementObjectsList, renderingMode) {

	    		if(!replacementObjectsList || replacementObjectsList.length < 1){
	    			return rawJSSourceCode; //////////////////////////// EARLY EXIT //////////////////////////
	    		}

	    		var all = replacementObjectsList;
	    		//sort list by occurrence:
	    		all.sort(sortAscByStart);

	    		var renderResult = new Array();

	    		var pos = 1;
	    		for(var i=0, size = all.length; i < size; ++i){

	    			var scriptElem = all[i];
	    			//render the "static" content, beginning from the
	    			//	lastly rendered "dynamic" element up to the start
	    			//  of the current "dynamic" element:
	    			renderResult.push(rawJSSourceCode.substring(pos-1, scriptElem.getStart()));

	    			//render the current "dynamic" element:
	    			renderElement(scriptElem, null, renderingMode, rawJSSourceCode, renderResult);

	    			//set position-marker for "static" content after entry position
	    			// of current "dynamic" element:
	    			pos = scriptElem.getEnd() + 1;

	    			//alert('Replacing \n"'+rawTemplateText.substring(scriptElem.getStart(), scriptElem.getEnd())+'" with \n"'+content+'"');
	    		}

	    		if(pos - 1 < rawJSSourceCode.length){
	    			renderResult.push(rawJSSourceCode.substring(pos - 1));
	    		}

	    		return renderResult.join('');
	    	}

	    	/**
	    	 * Render a View
	    	 *
	    	 * Renders the contents into a layout definition (i.e. "render for viewing").
	    	 *
        	 * @param {String} htmlContentString the "raw" content string that was parsed
    		 * @param {Array<YieldDeclaration>} yieldDeclarationsArray a list of yield-declarations for the parsed htmlContentString
    		 * @param {Array<ContentElement>} contentForObjectsArray a list of content-for objects for the parsed htmlContentString. This list must supply a corresponding object for each entry in the <tt>yieldDeclarationsArray</tt>.
    		 * @param {Number} renderingMode the render mode
    		 * @param {Object} data the rendering data
    		 * @returns {String} the evaluated and rendered view-content
    		 *
	    	 *
	    	 * @private
	    	 * @function
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 * @name renderContentImpl
	    	 */
	    	function renderContent(htmlContentString, yieldDeclarationsArray, contentForArray, renderingMode, data) {

	    		yieldDeclarationsArray.sort(sortAscByStart);

	    		var renderResult = new Array();

	    		var pos = 1;
	    		for(var i=0, size = yieldDeclarationsArray.length; i < size; ++i){

	    			var yieldDeclaration = yieldDeclarationsArray[i];

	    			if(
	    					(renderingMode === RENDER_MODE_VIEW_CONTENT && yieldDeclaration.getAreaType() !== ViewConstants.CONTENT_AREA_BODY)
	    				||	(renderingMode === RENDER_MODE_VIEW_DIALOGS && yieldDeclaration.getAreaType() !== ViewConstants.CONTENT_AREA_DIALOGS)
	    			){
	    				continue;
	    			}

	    			//render the "static" content, beginning from the
	    			//	lastly rendered "dynamic" element up to the start
	    			//  of the current "dynamic" element:
	    			renderResult.push(htmlContentString.substring(pos-1, yieldDeclaration.getStart()));

	    			//render the current "dynamic" element:
	    			renderYield(yieldDeclaration, contentForArray, renderingMode, htmlContentString, renderResult, data);

	    			//set position-marker for "static" content after entry position
	    			// of current "dynamic" element:
	    			pos = yieldDeclaration.getEnd() + 1;

	    		}

	    		if(pos - 1 < htmlContentString.length){
	    			renderResult.push(htmlContentString.substring(pos - 1));
	    		}

	    		return renderResult.join('');
	    	}

	    	/**
	    	 * Renders a ContentElement object into the renderingBuffer.
	    	 *
	    	 *
	    	 * @param {ContentElement} contentElement
	    	 * 						the ContentElement object that should be rendered
	    	 * @param {Array} renderingBuffer
	    	 * 						of Strings (if <code>null</code> a new buffer will be created)
	    	 * @param {Object} data
	    	 * 						the data/arguments/variables object;
	    	 * 						the event data with which the rendering was invoked is accessible via <DATA_NAME>[<PARAM_DATA_NAME>]
	    	 *
    		 * @param {Array<ContentElement>} [contentForObjectsArray] OPTIONAL
    		 * 						for rendering layouts, i.e. when YieldDeclarations are contained in the contentElement.allContentElements fields:
    		 * 						a list of content-for objects for the parsed htmlContentString. This list must supply a corresponding object for each entry in the <tt>yieldDeclarationsArray</tt>.
	    	 * @returns {Array}
	    	 * 						a list of Strings the renderingBuffer where the contents of this object are added at the end of the Array
	    	 *
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 * @name renderContentElementImpl
	    	 */
	    	function renderContentElement(contentElement, renderingBuffer, data, contentForObjectsArray){

	    		//create "buffer" if necessary:
	    		var renderResult = getRenderingBuffer(renderingBuffer);

	    		//initialize the contentElement with the current rendering-data object:
	    		contentElement.setRenderData(data);

	    		contentForObjectsArray = contentForObjectsArray || null;

	    		var pos = 1;
	    		//iterate over elements, and render them into the "buffer":
	    		for(var i=0, size = contentElement.allContentElements.length; i < size; ++i){

	    			var childContentElement = contentElement.allContentElements[i];

	    			//render the "static" content, beginning from the
	    			//	lastly rendered "dynamic" element up to the start
	    			//  of the current "dynamic" element:
	    			renderResult.push(contentElement.definition.substring(pos-1, childContentElement.getStart()));

	    			if(!contentForObjectsArray && childContentElement.isYield()){

	    				logger.e('encountered YieldDeclaration, but now ContentFor list was supplied');

	    			} else {

		    			//render the current "dynamic" element:
		    			renderElement(
		    					childContentElement,
		    					contentForObjectsArray,//<- contentForArray: must be specified, if not used (only for LAYOUTS)
		    					RENDER_MODE_VIEW_CONTENT,//<- renderingMode: render as normal view (i.e. generate all replacements)
		    					contentElement.getRawText(),
		    					renderResult,
		    					data,
		    					contentElement
		    			);
	    			}

	    			//set position-marker for "static" content after entry position
	    			// of current "dynamic" element:
	    			pos = childContentElement.getEnd() + 1;

	    			//alert('Replacing \n"'+rawTemplateText.substring(childContentElement.getStart(), childContentElement.getEnd())+'" with \n"'+content+'"');
	    		}

	    		//append the last part, i.e. if there is some template-text after the last element:
	    		if(pos - 1 < contentElement.definition.length){
	    			if(pos === 1){
	    				renderResult.push(contentElement.definition);
	    			}
	    			else {
	    				renderResult.push(contentElement.definition.substring(pos-1));
	    			}
	    		}

	    		return renderResult;
	    	}

	    	/**
	    	 * HELPER creates a new rendering buffer if neccessary
	    	 * @returns {Array} rendering buffer
	    	 *
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function getRenderingBuffer(renderingBuffer){
    		if(renderingBuffer)// && isArray(renderingBuffer))
	    			return renderingBuffer;

	    		return new Array();
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderElement(elem, contentForArray, renderingMode, rawTemplateText, renderingBuffer, data, /*optional: */ containingContentElement) {
	    		var type = elem.type;
	    		if(type === parser.element.INCLUDE_SCRIPT){
	    			return renderIncludeScript(elem, renderingMode, rawTemplateText, renderingBuffer, data);
	    		}
	    		else if(type === parser.element.INCLUDE_STYLE){
	    			return renderIncludeStyle(elem, renderingMode, rawTemplateText, renderingBuffer, data);
	    		}
	    		else if(type === parser.element.LOCALIZE){
	    			return renderLocalize(elem, renderingMode, rawTemplateText, renderingBuffer, data);
	    		}
	    		else if(type === parser.element.YIELD_DECLARATION){
	    			return renderYield(elem, contentForArray, renderingMode, rawTemplateText, renderingBuffer, data);
	    		}
	    		else if(type === parser.element.ESCAPE_ENTER){
	    			return renderEscape(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}
	    		else if(type === parser.element.ESCAPE_EXIT){
	    			return renderEscape(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}
	    		else if(type === parser.element.COMMENT){
	    			return renderComment(elem, renderingMode, rawTemplateText, renderingBuffer, data);
	    		}
	    		else if(type === parser.element.HELPER){
	    			return renderHelper(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement);
	    		}

	    		else if(type === parser.element.YIELD_CONTENT){
		    		//ignore: this should not be rendered itself, but instead its content should be rendered
		    		//        in for the corresponding yield-declaration element.
	    			logger.warn('ParseUtil.renderElement: encountered YIELD_CONTENT for '+elem.name+' -> this sould be handled by renderYieldDeclaration!');
	    		}

	    		else if(type === parser.element.IF){
	    			return renderIf(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement);
	    		}

	    		else if(type === parser.element.FOR){
	    			return renderFor(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement);
	    		}

	    		else if(type === parser.element.RENDER){
	    			return renderPartial(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement);
	    		}

	    		else if(type === parser.element.BLOCK){
	    			return renderScriptBlock(elem, renderingMode, rawTemplateText, renderingBuffer, data);
	    		}
	    		else if(type === parser.element.STATEMENT){
	    			return renderScriptStatement(elem, renderingMode, rawTemplateText, renderingBuffer, data);
	    		}
	    		else if(type === parser.element.VAR_DECLARATION){
	    			return renderVarDeclaration(elem, renderingMode, rawTemplateText, renderingBuffer, data);
	    		}
	    		else if(type === parser.element.VAR_REFERENCE){
	    			return renderVarReference(elem, renderingMode, rawTemplateText, renderingBuffer, data);
	    		}
	    		else {
	    			logger.error('ParseUtil.renderElement: unknown element type -> '+type);
	    			return null;
	    		}
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer){
	    		renderingBuffer = getRenderingBuffer(renderingBuffer);
	    		renderingBuffer.push(
	    				rawTemplateText.substring(elem.getStart(), elem.getEnd())
	    		);
	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderIncludeScript(elem, renderingMode, rawTemplateText, renderingBuffer, data){
	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		renderingBuffer.push('<script type="text/javascript" charset="utf-8" src="');
	    		renderingBuffer.push( elem.getValue(elem.scriptPath, elem.scriptPathType, data) );
	    		renderingBuffer.push('.js"></script>');

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderIncludeStyle(elem, renderingMode, rawTemplateText, renderingBuffer, data){
	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		renderingBuffer.push('<link rel="stylesheet" type="text/css" href="content/stylesheets/');
	    		renderingBuffer.push( elem.getValue(elem.stylePath, elem.stylePathType, data) );
	    		renderingBuffer.push('.css" />');

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderLocalize(elem, renderingMode, rawTemplateText, renderingBuffer, data){
	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}

	    		var name = elem.getValue(elem.name, elem.nameType, data);
	    		var text = localizer.getText(name);
	    		if(!text){
	    			logger.warn('RenderUtils.renderLocalize: could not find localization text for "'+elem.name+'"');
	    		}
	    		else{
	    			renderingBuffer.push(text);
	    		}

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderHelper(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}

	    		var name = elem.getValue(elem.helper, elem.helperType, data);

	    		//set arguments, if helper-statement was given a data-argument:
	    		var prevArgs = null;
	    		if(typeof elem.argsEval !== 'undefined'){
		    		//TODO handle scope & collisions more elaborately?
	    			if(typeof data[PARAM_ARGS_NAME] !== 'undefined'){
	    				prevArgs = data[PARAM_ARGS_NAME];
	    			}
		    		data[PARAM_ARGS_NAME] = elem.argsEval(data);
	    		}

	    		var text = containingContentElement.getController().performHelper(name, data[PARAM_DATA_NAME], data[PARAM_ARGS_NAME]);

	    		//clean-up: handle scope for ARGS
	    		delete data[PARAM_ARGS_NAME];
	    		if(prevArgs !== null){
	    			data[PARAM_ARGS_NAME] = prevArgs;
	    		}

	    		if(typeof text !== 'string'){
	    			logger.debug('RenderUtils.renderHelper: not a STRING result for '+containingContentElement.getController().getName()+'::Helper.'+name+'(), but '+(typeof text));
	    			text = text === null || typeof text === 'undefined'? '' + text : text.toString();
	    		}

    			//TODO HTML escape for toString before pushing the result (?)
    			renderingBuffer.push(text);

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderPartial(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}

	    		var partialName = elem.getValue(elem.partial, elem.partialType, data);

	    		//set arguments, if render-statement was given a data-argument:
	    		var prevArgs = null;
	    		if(typeof elem.argsEval !== 'undefined'){
		    		//TODO handle scope & collisions more elaborately?
	    			if(typeof data[PARAM_ARGS_NAME] !== 'undefined'){
	    				prevArgs = data[PARAM_ARGS_NAME];
	    			}
		    		data[PARAM_ARGS_NAME] = elem.argsEval(data);
	    		}

	    		//get the Controller object:
	    		var ctrlName = elem.getValue(elem.controller, elem.controllerType, data);
	    		var ctrl;
	    		//check if we already have the controller:
	    		if(containingContentElement.getController() && containingContentElement.getController().getName() == ctrlName){
	    			ctrl = containingContentElement.getController();
	    		}
	    		else {
	    			//...if not: retrieve controller

	    				ctrl = controllerManager.getController(ctrlName);


	    		}

	    		//TODO (?) move getPartial-method from PresentationManager (i.e. remove dependency here)?


	    		//NOTE previously, there was a dependency cycle: upon loading of templateRendererUtils.js, the presentationManager was not yet loaded.
		    	//     This should not happen anymore, but just to be save, load the presentationManager, if it is not available yet
		    	if(!presentationManager){
		    		presentationManager = require('mmirf/presentationManager');
		    	}

    			var partial = presentationManager.getPartial(ctrl, partialName);


	    		if(!partial){
	    			logger.warn('RenderUtils.renderPartial: no partial for controller '+containingContentElement.getController().getName()+', with name >'+partialName+'<');
	    		}
	    		else {
	    			renderContentElement(partial.getContentElement(), renderingBuffer, data);
	    		}

	    		//clean-up: handle scope for ARGS
	    		delete data[PARAM_ARGS_NAME];
	    		if(prevArgs !== null){
	    			data[PARAM_ARGS_NAME] = prevArgs;
	    		}

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderIf(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}

	    		var evalCondResult = elem.ifEval(data);
	    		if(evalCondResult) {
	    			renderContentElement(elem.content, renderingBuffer, data);
	    		}
	    		else if(elem.elseContent) {
	    			renderContentElement(elem.elseContent.content, renderingBuffer, data);
	    		}

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderFor(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}

	    		if(elem.forControlType === 'FORITER'){
	    			//FOR-type: for(prop in obj)...

	    			//get iterator for prop-values:
	    			var it = elem.forIterator(data);
	    			var current;

	    			while( it.hasNext() ){
	    				current = it.next();

	    				//make the prop-name available in inner FOR-block through the data-object:
	    				data[elem.forPropName] = current;

	    				try{

		    				//render inner FOR-content:
		    				renderContentElement(elem.content, renderingBuffer, data);

	    				} catch(err){
	    					//FIXME experimental mechanism for BREAK within @for
	    					//      (need to add syntax for this: @break)

	    					//simulate BREAK statement:
	    					if(err == 'break'){//FIXME use internal/private element for this! (add @break to syntax?)
	    						break;
	    					}
	    					else {
	    						//if it is an error: re-throw it
	    						throw err;
	    					}
	    				}
	    			}
	    		}
	    		else {
	    			//FOR-type: for(var i=0; i < size; ++i)...

	    			elem.forInitEval(data);

	    			while( elem.forConditionEval(data) ){

	    				try{

		    				//render inner FOR-content:
		    				renderContentElement(elem.content, renderingBuffer, data);

	    				} catch(err){

	    					//simulate BREAK statement:
	    					if(err == 'break'){//FIXME use internal/private element for this! (add @break to syntax?)
	    						break;
	    					}
	    					else {
	    						//if it is an error: re-throw it
	    						throw err;
	    					}
	    				}

	    				//execute INCREMENT of FOR-statement:
	    				elem.forIncrementEval(data);
	    			}

	    		}

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderScriptBlock(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}

	    		evaluate(elem.scriptContent, data, elem, containingContentElement);

	    		//return unchanged renderingBuffer
	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderScriptStatement(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}

	    		var result = evaluate(elem.scriptContent, data, elem, containingContentElement);
	    		//TODO escape rendered string (?)
	    		renderingBuffer.push(result);

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderVarDeclaration(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}

	    		//NOTE all template-vars start with special char @
//    			var fieldName = '@'+ elem.getValue(elem.name, elem.nameType, data);
	    		var varName = elem.getValue(elem.name, elem.nameType);//FIXME: do not invoke with data; we only want the VAR-name!//, data);
	    		var fieldName = '@'+ varName;

	    		//initialize field for var-declaration
	    		if(typeof data[fieldName] === 'undefined'){
	    			data[fieldName] = null;
	    			//TODO impl. structures/mechanisms for deleting/removing the var on exiting
	    			//		the scope of the corresponding ContentElement
	    			//		... with special case when field already existed before:
	    			//          (1) delete/remove only on the outer most scope exit
	    			//          (2) on 'inner' exits we need to restore the value that the variable had
	    			//              when we entered the scope (i.e. when we "overwrote" the existing var
	    			//              with an inner local var)
	    			//              --> (a) we need to store the value here when var already exists
	    			//                  (b) on parsing JS code we need to consider var-declarations, i.e. @-variables
	    			//                      that are proceeded with a 'var'-statement, e.g.: 'var @varName = ...'

	    		}
	    		// TODO handle case when field already exists (?)

	    		//return unchanged renderingBuffer
	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderVarReference(elem, renderingMode, rawTemplateText, renderingBuffer, data, containingContentElement){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText, renderingBuffer);
	    		}

	    		var varName = rawTemplateText.substring(elem.getStart(),elem.getEnd());

	    		//handle "import"/"export" of call/args-data
	    		if(varName === PARAM_DATA_NAME || varName === PARAM_ARGS_NAME){

		    		//TODO should there be a check included -> for var-existance?
		    		//     --> currently: on assignment, if var does not exists, it will be created
		    		//     --> change (?), so that there is a check first, and if var does not exists an ReferenceError is thrown (?)
		    		renderingBuffer.push(DATA_NAME);
		    		renderingBuffer.push('["');

		    		if(renderingMode === RENDER_MODE_JS_SOURCE_FORCE_VAR_PREFIX){
		    			//ensure that the replacement variable-name starts with an @:
		    			if( ! varName[0] === '@'){
		    				varName = '@' + varName;
		    			}
		    		}

		    		//extract var-name from original source-code (NOTE this var must start with @)
		    		renderingBuffer.push(varName);
		    		renderingBuffer.push('"]');


	    		} else {
	    			//render variable (without leading @ symbol)
	    			renderingBuffer.push(varName[0] === '@'? varName.substring(1) : varName);
	    		}

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderEscape(elem, renderingMode, rawTemplateText, renderingBuffer){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText);
	    		}

	    		renderingBuffer.push( elem.text);

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderComment(elem, renderingMode, rawTemplateText, renderingBuffer){

	    		//render comment: omit comment text from rendering!
//	    		renderingBuffer = getRenderingBuffer(renderingBuffer);
//
//	    		if(RENDER_MODE_LAYOUT === renderingMode){
//	    			return renderRaw(elem, renderingMode, rawTemplateText);
//	    		}
//	    		var comment = rawTemplateText.substring(elem.getStart()+2,elem.getEnd()-2);
//	    		renderingBuffer.push( comment );

	    		return renderingBuffer;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function getContentForYield(name, contentForArray){
	    		for(var i=0, size = contentForArray.length; i < size; ++i){
	    			if(name === contentForArray[i].getName()){
	    				return contentForArray[i];
	    			}
	    		}
	    		return null;
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function renderYield(elem, contentForArray, renderingMode, rawTemplateText, renderingBuffer, data){

	    		renderingBuffer = getRenderingBuffer(renderingBuffer);

	    		if(RENDER_MODE_LAYOUT === renderingMode){
	    			return renderRaw(elem, renderingMode, rawTemplateText);
	    		}
	    		else {

	    			var name = elem.getValue(elem.name, elem.nameType, data);
		    		var contentFor = getContentForYield(name, contentForArray);
		    		if(!contentFor){
		    			logger.info('ParseUtil.renderYield: could not find content-definition for yield '+name);
		    			return renderingBuffer;
		    		}

		    		if(contentFor.hasDynamicContent()){
		    			return renderContentElement(contentFor, renderingBuffer, data);
		    		}
		    		else {
		    			renderingBuffer.push(contentFor.getRawText());
			    		return renderingBuffer;
		    		}

//		    		return contentFor.toHtml();
	    		}
	    	}

	    	/**
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function evaluate(evalStatement, data, element, containingContentElement){

	    		var result = element.scriptEval(data);

	    		return result;
	    	}

	    	/**
	    	 * HELPER for creating the data-object
	    	 * @private
	    	 * @memberOf mmir.parser.RenderUtils#
	    	 */
	    	function createInternalData(eventData){

	    		//create DATA object that contains (or will be filled with)
				// 1. event data (in PARAM_DATA_NAME)
				// TODO 2. arguments (for template expressions that support arguments; in ARGS_NAME)
				// 3. declared template variables (under the name of their declaration)
				// TODO 4. variables in template script-blocks/script-statements that were not declared (for avoiding global var declarations when evaluating these script fragements)
				var dataArgs = new Object();
				dataArgs[PARAM_DATA_NAME] = eventData;

				return dataArgs;
	    	}

	    	/** @lends mmir.parser.RenderUtils.prototype */
	    	return {
	        	//public members:

	    		/**
	    		 * Renders a layout in preparation for displaying content:
	    		 * This function should be used to preperare the layout content, so that its
	    		 * views can be rendered into it (needs to be done only once, after the layout is loaded).
	    		 *
	    		 * @param {mmir.parser.ParsingResult} parseResult the parsed view template
	    		 * @param {ContentElement[]} [contentForArray]
	    		 * @returns {String} the prepared layout content
	    		 *
	    		 * @public
	    		 * @memberOf mmir.parser.RenderUtils.prototype
	    		 */
	    		renderLayout: function(parseResult, contentForArray){
	    			return renderLayout(parseResult, contentForArray, RENDER_MODE_LAYOUT);
	    		},

	    		/**
	    		 * Renders a view.
	    		 *
	    		 * <p>During rendering, the view's template-expressions are evaluated, and the results rendered into
	    		 * the returned String.
	    		 *
	        	 * @param {String|ContentElement} htmlContentString
	        	 * 				the original view-content of the layout-template text, see {@link Layout#getBodyContents}
	        	 * 				or a ContentElement with its YieldDeclarations in its allContentElements field (by default yields are not contained in ContentElement.allContentElements)
	    		 * @param {Array<YieldDeclaration>} yieldDeclarationsArray
	    		 * 				a list of yield-declarations of the layout
	    		 * @param {Array<ContentElement>} contentForObjectsArray
	    		 * 				a list of content-for objects of the view. This list must supply a corresponding objecet for each entry in the <tt>yieldDeclarationsArray</tt>.
	    		 * @param {Object} [data] OPTIONAL
	    		 * 				a JSON object which's fields will be available during rendering/evaluation of the template expressions
	    		 * @returns {String} the evaluated and rendered view-content
	    		 *
	    		 * @public
	    		 * @memberOf mmir.parser.RenderUtils.prototype
	    		 */
	    		renderViewContent: function(htmlContentString, yieldDeclarationsArray, contentForObjectsArray, data){

	    			var dataArgs = createInternalData(data);

	    			if(typeof htmlContentString === 'string'){

	    				return renderContent(htmlContentString, yieldDeclarationsArray, contentForObjectsArray, RENDER_MODE_VIEW_CONTENT, dataArgs);

	    			} else {

		    			return renderContentElement(
		    					htmlContentString,
		    					null,//<- yields should be in htmlContentString.allContentElements
		    					dataArgs,
		    					contentForObjectsArray
		    			).join('');
	    			}
	    		},

	    		/**
	    		 * Renders a single {@link ContentElement} object.
	    		 *
	    		 * <p>During rendering, the view's template-expressions are evaluated, and the results rendered into
	    		 * the returned String.
	    		 *
		    	 * @param {ContentElement} contentElement the ContentElement object that should be rendered
	    		 * @param {Object} [data] a JSON object which's fields will be available during rendering/evaluation of the template expressions
	    		 * @param {Array<String>} [renderingBuffer] if provided, the partial rendering results will be appended to this Array
	    		 * @returns {String} the evaluated and rendered ContentElement; if <tt>renderingBuffer</tt> was provided and not empty, the result will be prepended with the concatenated contents of the Array's Strings
	    		 *
	    		 * @public
	    		 * @memberOf mmir.parser.RenderUtils.prototype
	    		 */
	    		renderContentElement: function(contentElement, data, renderingBuffer/*optional*/){

	    			var dataArgs = createInternalData(data);

	    			return renderContentElement(contentElement, renderingBuffer, dataArgs);
	    		},

	    		/**
	    		 * Renders the dialog content for a view.
	    		 *
	    		 * <p>During rendering, the view's template-expressions are evaluated, and the results rendered into
	    		 * the returned String.
	    		 *
	        	 * @param {String} htmlContentString the original dialog-content of the layout-template text, see {@link Layout#getDialogsContents}
	    		 * @param YieldDeclaration[]} yieldDeclarationsArray a list of yield-declarations of the layout
	    		 * @param {ContentElement[]} contentForObjectsArray a list of content-for objects of the view. This list must supply a corresponding objecet for each entry in the <tt>yieldDeclarationsArray</tt>.
	    		 * @param {Object} [data] a JSON object which's fields will be available during rendering/evaluation of the template expressions
	    		 * @returns {String} the evaluated and rendered dialog-content
	    		 *
	    		 * @public
	    		 * @memberOf mmir.parser.RenderUtils.prototype
	    		 */
	    		renderViewDialogs: function(htmlContentString, yieldDeclarationsArray, contentForObjectsArray, data){

	    			var dataArgs = createInternalData(data);

	    			return renderContent(htmlContentString, yieldDeclarationsArray, contentForObjectsArray, RENDER_MODE_VIEW_DIALOGS, dataArgs);
	    		},

	    		/**
	        	 * Prepares JavaScript source code for usage in rendering the template (view/partial etc.).
	        	 *
	        	 * The replacement-list contains information which parts of the raw JavaScript code should be
	        	 * modified (e.g. indices [start,end] for replacing text in the source code).
	        	 *
	        	 * The function returns the modified JavaScript source code as a String.
	        	 *
	        	 *
	        	 * If the mode is <code>isForcePrefix == true</code>, the variable-names that correspond
	        	 * to replacementObjectsList are check: if a name does not start with @, then the name will prepended with @ before
	        	 * rendering.
	        	 *
	        	 * @param {String} rawJSSourceCode the original JavaScript source code
	        	 * @param {mmir.parser.ParsingResult[]} replacementObjectsList
	        	 * @param {Boolean} [isForcePrefix]
	        	 *
	    		 * @public
	    		 * @memberOf mmir.parser.RenderUtils.prototype
	        	 */
	    		renderJS: function(rawJSSourceCode, replacementObjectsList, isForcePrefix){
	    			var mode = isForcePrefix? RENDER_MODE_JS_SOURCE_FORCE_VAR_PREFIX : RENDER_MODE_JS_SOURCE;
	    			return renderJSSource(rawJSSourceCode, replacementObjectsList, mode);
	    		}

	    	};//END: return{}

	    }//END: constructor()

	    instance = new constructor();

	    //FIXME should the renderer be exported to parser.RenderUtils here?
	    parser.RenderUtils = instance;

	    return instance;
	});//END: define(..., function(){

//}( this.mmir = this.mmir || {} ));
