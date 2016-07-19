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



define([ 'controllerManager', 'constants', 'commonUtils', 'configurationManager'//DISABLED: now loaded on-demand (see init()) -> 'renderUtils'
         , 'layout', 'view', 'partial', 'dictionary', 'checksumUtils', 'languageManager'
         , 'jquery', 'core'//, 'module'
         , 'stringExtension', 'parserModule'
    ],
    
    /**
     * @class
     * @name mmir.PresentationManager
     * @static 
     *  
     * Libraries:
     *  - jQuery (>= v1.6.2); ajax, each
     *  
     *  @requires document (DOM object)
     *  
     *  @requires jQuery.Deferred
     *  @requires jQuery.ajax
     *  @requires jQuery.each
     *  
     */
    function ( controllerManager, constants, commonUtils, configurationManager//, renderUtils
    		, Layout, View, Partial, Dictionary, checksumUtils, languageManager
            , $, core//, module
) {
	
	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope mmir.PresentationManager.prototype */
	
	/**
     * Counter that keeps track of the number of times, that a view is rendered
     * 
     * NOTE: for implementation specific reasons, jQuery Mobile requires that
     * 		 each page has a different ID. This pageIndex is used to generating
     * 		 such a unique ID, by increasing the number on each page-change
     * 		 (i.e. by rendering a view) and appending it to the page's ID/name.
     * 
     * @type Integer
     * @public
	 * @memberOf mmir.PresentationManager#
     */
	var _pageIndex = 0;

	 /**
	  * Name for the default layout.
	  * 
	  * <p>
	  * There must exist a layout definition by
	  * this name, i.e.
	  * <pre>views/layout/<DEFAULT_LAYOUT_NAME>.ehtml</pre>
	  * 
	  * NOTE: while the name begins with an upper case
	  *       letter, the file name for the layout must
	  *       start with a lower case letter, e.g. for
	  *       name <code>Default</code>, the file name
	  *       must be <code>default.ehtml</code>.
	  * 
	  * @type String
	  * @private
	  * @constant
	  * @memberOf mmir.PresentationManager#
	  */
	 var DEFAULT_LAYOUT_NAME = 'Default';
	 
	 /**
	  * Name of the configuration property that specifies whether or not to use 
	  * pre-compiled views, i.e. whether to use generated JavaScript files
	  * instead of parsing & compiling the "raw" templates (eHTML files).
	  * 
	  * <p>
	  * NOTE: the configuration value, that can be retrieved by querying this configuration-property
	  * 	  has is either a Boolean, or a String representation of a Boolean value:
	  * 		<code>[true|false|"true"|"false"]</code>
	  * <br>
	  * NOTE2: There may be no value set at all in the configuration for this property.
	  * 	   In this case you should assume that it was set to <code>false</code>. 
	  * 
	  * @type String
	  * @private
	  * @constant
	  * @memberOf mmir.PresentationManager#
	  * 
	  * @example var isUsePrecompiledViews = mmir.Constants.get(CONFIG_PRECOMPILED_VIEWS_MODE);
	  * 
	  */
	 var CONFIG_PRECOMPILED_VIEWS_MODE = 'usePrecompiledViews';//TODO move this to somewhere else (collected config-vars?)? this should be a public CONSTANT...
	 
	 // private members
	 /**
	  * Array of layouts of the application
	  * 
	  * @type Dictionary
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
	 var _layouts = new Dictionary();

	 /**
	  * Array of all the views of the application
	  * 
	  * @type Dictionary
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
	 var _views = new Dictionary();

	 /**
	  * Array of all the partials of the application
	  * 
	  * @type Dictionary
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
	 var _partials = new Dictionary();

	 /**
	  * An object containing data for the currently displayed view.<br>
	  * It contains: name of the corresponding controller, name of the view
	  * and optionally data for the view
	  * 
	  * @type View
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
	 var _currentView = {};

	 /**
	  * An object containing data for the previously displayed view - the one
	  * displayed before the current view.<br>
	  * It contains: name of the corresponding controller, name of the view
	  * and optionally data for the view
	  * 
	  * @type View
	  * @private
	  * @memberOf mmir.PresentationManager#
	  * 
	  * @deprecated do not use
	  */
	 var _previousView = {};

	 /**
	  * The currently displayed dialog object, if a dialog is displayed. Used
	  * mainly to close the dialog.
	  * 
	  * @type Object
	  * @private
	  * @memberOf mmir.PresentationManager#
	  * 
	  * @see mmir.PresentationManager#showDialog
	  * @see mmir.PresentationManager#hideCurrentDialog
	  */
	 var _currentDialog = null;
	 
	 /**
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
	 var viewSeparator 		= '#';
	 /**
	  * @type String
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
     var partialSeparator 	= commonUtils.getPartialsPrefix();
     /**
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
     function createLookupKey(ctrl, viewObj, separator){
     	if(typeof ctrl.getName !== 'undefined'){
     		ctrl = ctrl.getName();
     	}
     	if(typeof viewObj.getName !== 'undefined'){
     		viewObj = viewObj.getName();
     	}
     	//TODO remove all >partialSeparator< from partial-string beginning
     	return ctrl+separator+viewObj;
     }
     /**
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
     function createViewKey(ctrl, view){
     	return createLookupKey(ctrl, view, viewSeparator);
     }
     /**
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
     function createPartialKey(ctrl, partial){
     	return createLookupKey(ctrl, partial, partialSeparator);
     }
     

	 /**
	  * Default implementation for the rendering-engine:
	  * 
	  * does nothing but writing an error message to the console,
	  * if any of its functions is invoked.
	  * 
	  * The rendering engine can be set via {@link mmir.PresentationManager#setRenderEngine}.
	  * 
	  * @type RenderEngine
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
     var _renderEngine = {
    		 /**
    		  * The function that actually renders the View.<br>
    		  * 
    		  * The function will be invoked in context of the PresentationManager instance
    		  * (i.e. the manager will be the <em>this</em> context).
    		  * 
    		  * Implementations of this function should adhere to the following procedure:
    		  * 
    		  * <br>
    		  * 
    		  * First this function fetches the <em>layout</em> for the <em>controller</em>
    		  * (or uses the <code>dialogManager.DEFAULT_LAYOUT<code>).
    		  * 
    		  * Then the <code>before_page_prepare</code> of the <em>controller</em> is invoked (if it exists).
    		  * 
    		  * Then renders the <em>view</em> into the
    		  * layout-template; <em>partials</em>, <em>helpers</em> etc.
    		  * that are referenced in the <em>view</em> will be processed,
    		  * executed etc.; during this, localized Strings should be processed and rendered by
    		  * {@link mmir.LanguageManager#getText}. 
    		  * 
    		  * Then <em>dialogs</em> are created and the <code>dialogManager.pageIndex</code> is updated.
    		  * 
    		  * The new content is inserted into the document/page (invisibly).
    		  * 
    		  * Then the <code>before_page_load</code> of the <em>controller</em> is invoked (if it exists).
    		  * 
    		  * The new content/page is made visible, and the old one invisible and / or is removed.
    		  * 
    		  * At the end the <b>on_page_load</b> action of the <em>controller</em> is performed.
    		  * 
    		  * @function
    		  * @memberOf mmir.PresentationManager._renderingEngine
    		  * 
    		  * @param {String}
    		  *            ctrlName Name of the controller
    		  * @param {String}
    		  *            viewName Name of the view to render
    		  * @param {Object}
    		  *            view View object that is to be rendered
    		  * @param {Object}
    		  *            ctrl Controller object of the view to render
    		  * @param {Object}
    		  *            [data] optional data for the view.
    		  */
    		 render: function(ctrlName, viewName, view, ctrl, data){
    			 console.error('PresentationManager.render: no rendering engine set!');
    		 },
    		 showDialog: function(ctrlName, dialogId, data) {
    			 console.error('PresentationManager.showDialog: no rendering engine set!');
    		 },
    		 hideCurrentDialog: function(){
    			 console.error('PresentationManager.hideCurrentDialog: no rendering engine set!');
    		 },
    		 showWaitDialog: function(text, data) {
    			 console.error('PresentationManager.showWaitDialog: no rendering engine set!');
    		 },
    		 hideWaitDialog: function() {
    			 console.error('PresentationManager.hideWaitDialog: no rendering engine set!');
    		 }
     };
	 /**
	  * Reference to the rendering-engine implementation / instance.
	  * 
	  * This reference should not be accessed directly.
	  * Custom functions of the rendering implementation can be
	  * invoked via {@link mmir.PresentationManager#callRenderEngine}.
	  * 
	  * @type Object
	  * @private
	  */
     _renderEngine._engine = _renderEngine;
	 
	 var _instance = {
			/** @scope mmir.PresentationManager.prototype  */
			 
			/**
			 * @deprecated instead: use mmir.PresentationManager directly
			 * 
			 * @memberOf mmir.PresentationManager.prototype
			 */
			getInstance: function () {
				return this;
			},

           // public members
            addLayout : function(layout) {
                _layouts.put(layout.getName(), layout);
            },
            /**
             * This function returns a layout object by name.<br>
             * 
             * @function
             * @param {String}
             *            layoutName Name of the layout which should be returned
             * @param {Boolean}
             *            [doUseDefaultIfMissing] if supplied and
             *            <code>true</code>, the default controller's layout
             *            will be used as a fallback, in case no corresponding
             *            layout could be found
             * @returns {Object} The requested layout, "false" if not found
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            getLayout : function(layoutName, doUseDefaultIfMissing) {
                var layout = false;
                layout = _layouts.get(layoutName);
                if (!layout) {
                    if (doUseDefaultIfMissing) {
                        layout = _instance.getLayout(DEFAULT_LAYOUT_NAME, false);
                    }
                    else {
                        console.error('[PresentationManager.getLayout]: could not find layout "' + layoutName +'"')
                        return false;
                    }
                }
                return layout;
            },

            /**
             * 
             * @param {String|Controller} ctrlName
             * @param {String|View} view
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            addView : function(ctrlName, view) {
                _views.put(createViewKey(ctrlName, view), view);
            },
            /**
             * This function returns a view object by name.<br>
             * 
             * @function
             * @param {String}
             *            controllerName Name of the controller for the view
             * @param {String}
             *            viewName Name of the view which should be returned
             * @returns {Object} The requested view, <tt>false</tt> if not
             *          found
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            getView : function(controllerName, viewName) {
                viewName = createViewKey(controllerName, viewName);
                var view = false;
                view = _views.get(viewName);

                if (!view) {
                    console.error('[PresentationManager.getView]: could not find view "' + viewName + '"');
                    return false;
                }
                return view;
            },
            /**
             * 
             * @param {String|Controller} ctrlName
             * @param {String|Partial} partial
             * 
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            addPartial: function(ctrlName, partial){
            	_partials.put(createPartialKey(ctrlName, partial), partial);
            },

            /**
             * This function returns a partial object by name.<br>
             * 
             * @function
             * @param {String}
             *            controllerName Name of the controller for the view
             * @param {String}
             *            viewName Name of the partial which should be returned
             * @returns {Object} The requested partial, "false" if not found
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            getPartial : function(controllerName, partialName) {
                var partial = false;

                var partialKey = null;
                if (controllerName) {
                    partialKey = createPartialKey(controllerName, partialName);
                }
                else {
                    console.error('[PresentationManager.getPartial]: requested partial "' + partialName + '" for unknown controller: "' + (controllerName ? (controllerName.getName? controllerName.getName(): controllerName) : 'undefined')
                            + '"');
                    return false;
                }

                partial = _partials.get(partialKey);
                if (!partial) {
                    console.error('[PresentationManager.getPartial]: could not find partial "' + partialName + '" for controller "' + (controllerName ? (controllerName.getName? controllerName.getName(): controllerName) : 'undefined') + '"!');
                    return false;
                }
                return partial;
            },

            /**
             * Closes a modal window / dialog (if one is open).
             * <br>
             * 
             * @function
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            hideCurrentDialog : function() {
				_renderEngine.hideCurrentDialog.apply(this,arguments);
            },

            /**
             * Opens the dialog for ID <code>dialogId</code>.
             * <br>
             * 
             * @function
             * @param {String} ctrlName
             *            the Name of the controller
             * @param {String} dialogId
             *            the ID of the dialog
             * @param {Object} [data] OPTIONAL
             *            a data / options object
             *            
             * @returns {Object} the instance of the opened dialog (void or falsy dialog was not opened)
             * 
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            showDialog : function(ctrlName, dialogId, data) {
            	_currentDialog = _renderEngine.showDialog.apply(this,arguments);
				return _currentDialog;
			},
			
			/**
			 * Shows a "wait" dialog, i.e. "work in progress" notification.
			 * 
			 * @function
			 * 
			 * @param {String} [text] OPTIONAL
			 * 				the text that should be displayed.
			 * 				If omitted the language setting for <code>loadingText</code>
			 * 				will be used instead (from dictionary.json)
			 * @param {Object} [data] OPTIONAL
			 * 				a data / options object
			 * 
			 * @public
			 * @memberOf mmir.PresentationManager.prototype
			 * 
			 * @see mmir.PresentationManager#hideWaitDialog
			 */
			showWaitDialog : function(text, data) {
				_renderEngine.showWaitDialog.apply(this,arguments);
			},

			/**
			 * Hides / closes the "wait" dialog.
			 * 
			 * @function
			 * @public
			 * @memberOf mmir.PresentationManager.prototype
			 * 
			 * @see mmir.PresentationManager#showWaitDialog
			 */
			hideWaitDialog : function() {
				_renderEngine.hideWaitDialog.apply(this,arguments);
			},

			/**
			 * Gets the view for a controller, then executes helper methods on
			 * the view data. The Rendering of the view is done by the
			 * {@link #doRenderView} method. Also
			 * stores the previous and current view with parameters.<br>
			 * 
			 * @function
			 * @param {String}
			 *            ctrlName Name of the controller
			 * @param {String}
			 *            viewName Name of the view to render
			 * @param {Object}
			 *            [data] optional data for the view.
			 *            Currently same jQuery Mobile specific properties are supported: <br>
			 *            When these are present, they will be used for animating the 
			 *            page transition upon rendering.
			 *            
			 *            <pre>{transition: STRING, reverse: BOOLEAN}</pre>
			 *            where<br>
			 *            <code>transition</code>: the name for the transition (see jQuery Mobile Doc for possible values)
			 *            							DEFAULT: "none".
			 *            <code>reverse</code>: whether the animation should in "forward" (FALSE) direction, or "backwards" (TRUE)
			 *            						DEFAULT: FALSE
			 * @public
			 * @memberOf mmir.PresentationManager.prototype
			 */
            renderView : function(ctrlName, viewName, data) {
            	
                var ctrl = controllerManager.getController(ctrlName);

                if (ctrl != null) {
                    var view = this.getView(ctrlName, viewName);
                    
                    _renderEngine.render.call(this, ctrlName, viewName, view, ctrl, data);

                    //TODO russa: _previousView is deprecated (should use a history instead, i.e. application level)
                    // Only overwrite previous state if and only if the view is not re-rendered!
					if (ctrlName != _currentView.ctrlName || viewName != _currentView.viewName || data != _currentView.data){
						_previousView.ctrlName=_currentView.ctrlName;
						_previousView.viewName=_currentView.viewName;
						_previousView.data=_currentView.data;
					}
					
					_currentView.ctrlName=ctrlName; 
					_currentView.viewName=viewName; 
					_currentView.data=data;
                }
                else {
                	console.warn('PresentationManager.renderView: could not retrieve controller "'+ctrlName+'"');
                }
            },

            /**
             * Renders the current view again, using the
             * {@link #renderView} method.
             * 
             * @deprecated you should use {@link #renderView} with appropriate parameters instead.
             * 
             * @requires mmir.DialogManager
             * 
             * @function
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            reRenderView : function() {
                if (_currentView) {
                    if (_currentView.ctrlName && _currentView.viewName) {
                        core.require('dialogManager').render(_currentView.ctrlName, _currentView.viewName, _currentView.data);
                    }
                }
            },

            /**
             * Renders the previous view again, using the
             * {@link mmir.DialogManager#render} method.
             * 
             * 
             * @deprecated you should use {@link #renderView} with appropriate parameters instead.
             * 
             * @requires mmir.DialogManager
             * 
             * @function
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            renderPreviousView : function() {
                if (_previousView) {
                    if (_previousView.ctrlName && _previousView.viewName) {
                    	core.require('dialogManager').render(_previousView.ctrlName, _previousView.viewName, _previousView.data);
                    }
                }
            },        
	
            /**
             * @function
			 * @memberOf mmir.PresentationManager.prototype
             */
            init: init,
            
            /**
             * Sets the <em>rendering engine</em> for the views.
             * 
             * The render engine <b>must</b> implement a function <em>render</em>
             * and <i>may</i> implement functions <em>showDialog</em>,
             * <em>hideCurrentDialog</em>, <em>showWaitDialog</em>, and <em>hideWaitDialog</em>:
             * 
             * <ul>
             * 	<li><b>theRenderEngine.<code>render(ctrlName : String, viewName : String, view : View, ctrl : Controller, data : Object) : void</code></b></li>
             * 	<li>theRenderEngine.<code>showDialog(ctrlName : String, dialogId : String, data : Object) : Dialog</code></li>
             * 	<li>theRenderEngine.<code>hideCurrentDialog(): void</code></li>
             * 	<li>theRenderEngine.<code>showWaitDialog(text : String, data : Object): void</code></li>
             * 	<li>theRenderEngine.<code>hideWaitDialog(): void</code></li>
             * </ul>
             * 
             * The functions of <code>theRenderEngine</code> will be called in
             * context of the PresentationManager.
             * 
             * Custom functions of the specific rendering engine implementation 
             * (i.e. non-standard functions) can be call via {@link #callRenderEngine}.
             * 
             * 
             * <br>
             * By default, the rendering-engine as defined by the module ID/path in
             * <code>core.viewEngine</code> will be loaded and set during initialization
             * of the DialogManager.
             * 
             * <br>
             * The implementation of the default view-engine is at
             * <code>mmirf/env/view/presentation/jqmViewEngine.js</code>.
             * 
             * @param {Object} theRenderEngine
             * 			the render-engine for views
             * 
             * @function
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             * 
             * @see mmir.PresentationManager#renderView
             * @see mmir.PresentationManager#showDialog
             * @see mmir.PresentationManager#hideCurrentDialog
             * @see mmir.PresentationManager#showWaitDialog
             * @see mmir.PresentationManager#hideWaitDialog
             * 
             * @see mmir.PresentationManager#callRenderEngine
             * 
             */
            setRenderEngine: function(theRenderEngine){
            	_renderEngine.render 			= theRenderEngine.render;
            	_renderEngine.showDialog		= theRenderEngine.showDialog;
            	_renderEngine.hideCurrentDialog	= theRenderEngine.hideCurrentDialog;
            	_renderEngine.showWaitDialog	= theRenderEngine.showWaitDialog;
            	_renderEngine.hideWaitDialog	= theRenderEngine.hideWaitDialog;
            	_renderEngine._engine			= theRenderEngine;
            },
            /**
             * This function allows to call custom functions of the rendering-engine
             * that was set via {@link #setRenderEngine}.
             * 
             * IMPORTANT:
             * note that the function will be invoked in context of rendering-engine
             * (i.e. <code>this</code> references will refer to rendering-engine
             * and not to the PresentationManager instance.
             * For example, when <code>mmir.PresentationManager.callRenderEngine('hideWaitDialog')</code>
             * is called, any <code>this</code> references within the <code>hideWaitDialog</code>
             * implementation would refer to object, that was set in <code>setRenderEngine(object)</code>.
             * In comparison, when called as <code>mmir.PresentationManager.hideWaitDialog()</code> the
             * <code>this</code> references refer to the mmir.PresentationManager instance.
             * 
             * <br>
             * NOTE that calling non-existing functions on the rendering-engine 
             *      will cause an error.
             * 
             * @param {String} funcName
             * 			the name of the function, that should be invoked on the rendering
             * 			engine.
             * @param {Array<any>} [args] OPTIONAL
             * 			the arguments for <code>funcName</code> invoked
             *          via <code>Function.apply(renderingEngine, args)</code>, e.g.
             * 			for <code>args = [param1, param2, param3]</code> the
             * 			function will be called with
             * 			<code>funcName(param1, param2, param3)</code>
             * 			(note that the function receives 3 arguments, and
             *           not 1 Array-argument).
             * 
             * @function
             * @public
			 * @memberOf mmir.PresentationManager.prototype
             */
            callRenderEngine: function(funcName, args){
            	return _renderEngine._engine[funcName].apply(_renderEngine._engine, args);
            },
            
            //exported properties / constants:
            /**
             * @public
             * @type Integer
             * @constant
			 * @memberOf mmir.PresentationManager.prototype
             */
            pageIndex:		_pageIndex
		};//END:  return{...
//	})();//END: (function(){...
	

	return _instance;
	
	function init () {

		/** @scope mmir.MediaManager.prototype */

		delete _instance.init;//FIXME should init be deleted?

		/**
		 * Checks if a pre-compiled view is up-to-date:
		 * loads the view, if it is current.
		 * 
		 * If the pre-compiled view is not current, or loading-errors
		 * occur, the fail-callback will be triggered 
		 * (the callback argument may contain information about the cause).
		 * 
		 * @async
		 * @private
		 * @memberOf mmir.MediaManager.init
		 * 
		 * @param {String} rawViewData
		 * 					the text content of the view template (i.e. content of a eHTML file "as is")
		 * @param {String} targetPath
		 * 					the path to the pre-compiled view file
		 * @param {Function} success
		 * 					callback that will be triggered, if pre-compiled view file was loaded
		 * 					NOTE: the JS code of the loaded file may not have been fully executed yet!
		 * @param {Function} fail
		 * 					callback that will be triggered, if pre-compiled view is not up-to-date or
		 * 					an error occurs while loading the file
		 */
		function loadPrecompiledView(rawViewData, targetpath, success, fail){

			//NOTE: stored template require the renderUtils:
			core.require(['renderUtils'], function(){
				
				if(! isUpToDate(rawViewData, targetpath)){
					if(fail) fail('Precompiled view file is outdated!');
					else console.warn('Outdated pre-compiled view at: '+targetpath);
					
					//-> do not load the pre-compiled view, instead let fail-callback handle re-parsing for the view
					return;/////////////////////// EARLY EXIT /////////////////////
				}
	
				commonUtils.getLocalScript( //scriptUrl, success, fail)
						targetpath, success, fail
				);
				
			});
			
		}

		/**
		 * Flag for determining if pre-compiled views (*.js) should be used
		 * 
		 * Reads property {@link #CONFIG_PRECOMPILED_VIEWS_MODE}. If the property is not set,
		 * <code>false</code> is used by default, i.e. no pre-compiled views are used.
		 *
		 * @protected
		 * @default
		 * @type Boolean
		 * @default false: use templates files (*.ehtml) and compile them (freshly) on-the-fly
		 * @memberOf mmir.MediaManager.init
		 */
		var isUsePreCompiledViews = configurationManager.getBoolean(CONFIG_PRECOMPILED_VIEWS_MODE, true, false);

		/**
		 * Read the checksum file that was created when the pre-compiled view was created:
		 * 
		 * it contains the view's template size (the length of its String representation) and MD5 hash.
		 * 
		 * -> by calculating the viewContent's size and MD5 hash, we can determine, if it has changed
		 *    by comparing it with the data of the checksum file.
		 *    
		 * @sync the checksum file is loaded in synchronous mode
		 * @private
		 * @memberOf mmir.MediaManager.init
		 * 
		 * @param {String} viewContent
		 * 						the content of the view template (i.e. loaded eHTML file)
		 * @param {String} preCompiledViewPath
		 * 						the path to the corresponding pre-compiled view file
		 * 
		 */
		function isUpToDate(viewContent, preCompiledViewPath){
			
			//there is no pre-compiled view -> need to compile ehtml
			if(!preCompiledViewPath){
				return false;///////////////////// EARLY EXIT ////////////////////////
			}
			
			//replace file extension with the checksum-file's one: '.js' -> '.checksum.txt'
			var  viewVerificationInfoPath = 
					preCompiledViewPath.substring(0, preCompiledViewPath.length - 3) 
						+ checksumUtils.getFileExt();

			var isCompiledViewUpToDate = false;

			$.ajax({
				async: false,//<-- use "SYNC" modus here (NOTE: we win nothing with async here, because the following step (loading/not loading the pre-compiled view) strictly depends on the result of this)
				dataType: "text",
				url: viewVerificationInfoPath,
				success: function(data){

					//compare raw String to checksum-data from file
					isCompiledViewUpToDate = checksumUtils.isSame(viewContent, data);
				}
			}).fail(function(jqxhr, status, err){
				// print out an error message
				var errMsg = err && err.stack? err.stack : err;
				console.error("[" + status + "] Could not load '" + viewVerificationInfoPath + "': "+errMsg); //failure
			});

			return isCompiledViewUpToDate;
		}

		/**
		 * This function loads the layouts for every controller and puts the
		 * name of the layouts into the <b>_layouts</b> array.
		 * 
		 * @function
		 * @private
		 * @memberOf mmir.MediaManager.init
		 * 
		 * @returns {Promise} a Deferred.promise that gets resolved upon loading all layouts; fails/is rejected, if not at least 1 layout was loaded
		 */
		function loadLayouts(){
			// Load application's layouts. 

			/**
			 * @type jQuery.Deffered
			 * @private
			 * @memberOf mmir.MediaManager.init.loadLayouts
			 */
			var defer = $.Deferred();
			
			/**
			 * @type String
			 * @private
			 * @memberOf mmir.MediaManager.init.loadLayouts
			 */
			var ctrlNameList = controllerManager.getControllerNames();
			
			/**
			 * HELPER object for tracking the loading-status of the layouts
			 * 
			 * @private
			 * @memberOf mmir.MediaManager.init.loadLayouts
			 */
			var loadStatus = {
					loader: defer,
					remainingCtrlCount: ctrlNameList.length + 1,//+1: for the default layout
					currentLoadCount: 0,

					//additional property for keeping track on how many layouts were load overall
					// NOTE: this additional counter is necessary, since currentLoadCount
					//       keeps only track of how many controller's were checked. But since
					//       a controller may not have a layout-defintion of its own, we have
					//       to use another counter to keep track of actually loaded layouts.
					loadedLayoutsCount: 0,

					//need a custom function for checking the load status: if no layout was loaded, 
					//                                                     the Derred will be rejected
					onCompletionImpl: function(status){
						if(status.loadedLayoutsCount < 1){

							//there must be at least on layout-file for the default-controller:
							status.loader.reject( 'Could not load any layout! At least one layout must be present at '
									+ constants.getLayoutPath() 
									+ DEFAULT_LAYOUT_NAME[0].toLowerCase() + DEFAULT_LAYOUT_NAME.substring(1) 
									+ '.ehtml'
							);
						}
						else {
							status.loader.resolve();
						} 
					},

					//extend the status-update function: in case loading succeeded, increase the counter
					//                                   for overall loaded layouts.
					extLoadStatusFunc: function(status, hasLoadingFailed){
						if(hasLoadingFailed === true){
							//do nothing
						}
						else {
							++status.loadedLayoutsCount;
						}
					}
			};

			/**
			 * HELPER object for loading/creating the layouts
			 * @private
			 * @memberOf mmir.MediaManager.init.loadLayouts
			 */
			var createLayoutConfig = {
					constructor: Layout,
					typeName: 'Layout',
					collection: _layouts
			};

			/**
			 * helper for loading a single layout-file
			 * 
			 * @private
			 * @memberOf mmir.MediaManager.init.loadLayouts
			 */
			var doLoadLayout = function(index, ctrlName, theDefaultLayoutName){

				var layoutInfo;
				if(theDefaultLayoutName){

					ctrlName = theDefaultLayoutName;

					//create info-object for default-layout
					var layoutFileName = theDefaultLayoutName[0].toLowerCase() 
					+ theDefaultLayoutName.substring(1, theDefaultLayoutName.length);
					layoutInfo = {
						name: theDefaultLayoutName,
						fileName: layoutFileName,
						genPath: constants.getCompiledLayoutPath()//TODO add compiled-path to view-info object (and read it from file-structure/JSON) 
									+ layoutFileName + '.js',
						path: constants.getLayoutPath() + layoutFileName + '.ehtml'
					};

				}
				else {
					var ctrl = controllerManager.getController( ctrlName );
					ctrlName = ctrl.getName();
					layoutInfo = ctrl.getLayout();
				}

				if(layoutInfo){

					doLoadTemplateFile(null, layoutInfo, createLayoutConfig, loadStatus);

				}

				--loadStatus.remainingCtrlCount;
				checkCompletion(loadStatus);

			};//END: doLoadLayout(){...

			//load the default layout:
			doLoadLayout(null, null, DEFAULT_LAYOUT_NAME);

			//load layouts for controllers (there may be none defined)
			$.each(ctrlNameList, doLoadLayout);

			checkCompletion(loadStatus);
			return defer.promise();

		}//END: loadLayouts()

		/**
		 * This function actually loads the views for every controller, creates
		 * an instance of a view class and puts the view instance in the
		 * <b>_views</b> array.<br>
		 * 
		 * @function
		 * @private
		 * @async
		 * @memberOf mmir.MediaManager.init
		 * 
		 * @returns {Promise} a Deferred.promise that gets resolved upon loading all views
		 * 
		 * @see doProcessTemplateList
		 */
		function loadViews() {

			var creatorConfig = {
					constructor: View,
					typeName: 'View',
					collection: _views,
					keyGen: createViewKey,
					accessorName: 'getViews'
			};

			return doProcessTemplateList(creatorConfig);

		}//END: loadViews()

		/**
		 * This function actually loads the partials for every controller,
		 * creates an instance of a partial class and puts the partial instance
		 * in the <b>_partials</b> array.<br>
		 * It uses a asynchronous way of loading the partials-files one after
		 * another.<br>
		 * <b>If you want to make sure, that all partials are indeed loaded,
		 * before proceeding with the subsequent instructions, you could look at
		 * the function
		 * {@link mmir.ControllerManager#foundControllersCallBack} for
		 * reference of a function which loads the files one after another - not
		 * asynchronously.</b>
		 * 
		 * @function
		 * @private
		 * @async
		 * @memberOf mmir.MediaManager.init
		 * 
		 * @returns {Promise} a Deferred.promise, that resolves after all partials have been loaded
		 * 					NOTE: loading failures will generate a warning message (on the console)
		 * 						  but will not cause the Promise to fail.
		 */
		function loadPartials() {

			var creatorConfig = {
					constructor: Partial,
					typeName: 'Partial',
					collection: _partials,
					keyGen: createPartialKey,
					accessorName: 'getPartials'
			};

			return doProcessTemplateList(creatorConfig);

		}//END: loadPartials()

		/**
		 * HELPER for checking the loading status.
		 * 
		 * As long as the Deferred <code>status.loader</code> is
		 * still pending, the loading status will be checked:
		 * 
		 * Depending on <code>status.currentLoadCount</code> and
		 * <code>status.remainingCtrlCount</code> the completion
		 * of the loading process is checked.
		 * 
		 * If loading is completed, the Deferred <code>status.loader</code>
		 * will be resolved.
		 * 
		 * If OPTIONAL <code>status.loader</code> (Function) exists, intead of resolving
		 * <code>status.loader</code>, this function is invoked in case of completion
		 * with <code>status</code> as argument.
		 * 
		 * @private
		 * @function
		 * @memberOf mmir.MediaManager.init
		 * 
		 * @param {PlainObject} status
		 * 		the object for managing the laoding status.
		 * 
		 */
		var checkCompletion = function(status){
			if(status.loader.state() === 'pending' && status.remainingCtrlCount === 0 && status.currentLoadCount === 0){

				if(status.onCompletionImpl){
					status.onCompletionImpl(status);
				}
				else {
					status.loader.resolve();
				}

			}
		};

		/**
		 * HELPER for updating the loading status.
		 * 
		 * Invokes {@link checkCompletion} with <code>status</code> as argument.
		 * 
		 * @private
		 * @function
		 * @memberOf mmir.MediaManager.init
		 * 
		 * @param {PlainObject} status
		 * 		the object for managing the laoding status:
		 * 		<code>status.currentLoadCount</code> (Integer): this property will be decreased by 1.
		 * 											This value should initially be set to the count
		 * 											of files, that will / should be loaded.
		 * 		OPTIONAL <code>status.extLoadStatusFunc</code> (Function): if this property is set, the
		 * 											function will be invoked with <code>status</code>
		 * 											and <code>hasLoadingFailed</code> as arguments.
		 * 
		 * @param {Boolean} [hasLoadingFailed] OPTIONAL
		 * 		if present and <code>true</code>: this indicates that the loading process for the current
		 * 		template file (*.ehtml) has failed. NOTE that this is NOT used, when loading of a 
		 * 		_compiled_ template file (*.js) fails!
		 */
		var updateLoadStatus = function(status, hasLoadingFailed){
			--status.currentLoadCount;

			if(status.extLoadStatusFunc){
				status.extLoadStatusFunc(status, hasLoadingFailed);
			}

			checkCompletion(status);
		};

		/**
		 * HELPER: creates a template-object (e.g. a View or a Partial) for the 
		 *         raw template conent.
		 *         
		 *         If necessary, the parser-classes (module 'parseUtils') are loaded,
		 *         which are necessary to process the raw template content.
		 * 
		 * @private
		 * @function
		 * @memberOf mmir.MediaManager.init
		 * 
		 * @param {Controller} controller
		 * 		the controller to which the template files belong.
		 * 		May be <code>null</code>: in this case, this argument will be omitted when
		 * 		creating the template object and creating the lookup-key (e.g. in case of a Layout).
		 * 
		 * @param {String} templateName
		 * 		the name for the template (e.g. file-name without extension)
		 * 
		 * @param {PlainObject} createConfig
		 * 		configuration that is used to create the template-object
		 * 		for the template-contents:
		 * 		<code>createConfig.constructor</code>: the constructor function
		 *                    IF controller IS NOT null: <code>(controller, templateName, templateContent)</code> 
		 *                    							 (e.g. View, Partial)
		 *                    IF controller IS null:     <code>(templateName, templateContent)</code>
		 *                    							 (e.g. Layout)
		 *                    
		 * 		<code>createConfig.collection</code>: the Dictionary to which the created
		 * 											 template-object will be added
		 * 		<code>createConfig.keyGen</code>: a generator function for creating the lookup-key when adding
		 * 										the template-object to the collection.
		 * 										This function is invoked with <code>(controller.getName(), templateName)</code>,
		 * 										that is <code>(String, String)</code>.
		 * 										
		 * 										NOTE: if controller IS null, the keyGen function will not be used, and
		 * 											  instead the template-object will be added with the
		 * 											  created template-object's name as lookup-key.
		 * @param {PlainObject} status
		 * 			the object for managing the loading status.
		 * 			After creating and adding the template-object to the collection, the loading
		 * 			status will be updated via {@link updateLoadStatus}
		 * 
		 */
		var doParseTemplate = function(controller, templateName, config, templateContent, status){

			//NOTE need to request renderUtils here too, since it is needed during parsing!
			core.require(['parseUtils', 'renderUtils'], function(){

				var templateObj;
				if(controller){
					//"normal" view constructor: (Controller, nameAsString, templateAsString)
					templateObj = new config.constructor(controller, templateName , templateContent);
					config.collection.put( config.keyGen(controller.getName(), templateName), templateObj );
				}
				else {
					//in case of Layout: omit controller argument
					// -> layout constructor: (nameAsString, templateAsString)
					// -> there is a 1:1 correspondence betwenn controller and layout,
					//    and Layout.name === Controller.name
					//    => no need to create a lookup-key
					templateObj = new config.constructor(templateName , templateContent);
					config.collection.put( templateObj.getName(), templateObj );
				}

				updateLoadStatus(status);

			});

		};

		/**
		 * Generic helper for loading a list of template files (*.ehtml)
		 * that correspond to a specific template type (e.g. <code>View</code>s, or <code>Partial</code>s).
		 * 
		 *  If compiled representations of the template file exist AND is up-to-date AND
		 *  the configuration is set to load the compiled files rather than the raw template
		 *  file (see <code>isUsePreCompiledViews</code>), then the compiled template is used.
		 *  
		 *  
		 * This function uses an asynchronous method for loading the template-files.<br>
		 * 
		 * <b>If you want to make sure, that all templates have indeed been loaded, before
		 * proceeding with the subsequent program flow, you should have a look at the
		 * function {@link mmir.ControllerManager#foundControllersCallBack}: use the returned
		 * Deferred.Promise for executing code that depends on the templates being loaded.</b>
		 * 
		 * <p>
		 * Uses {@link doloadTemplateFile} for loading single template files.
		 * 
		 * @function
		 * @private
		 * @async
		 * @memberOf mmir.MediaManager.init
		 * 
		 * @see #doLoadTemplateFile
		 * 
		 * @param {PlainObject} createConfig
		 * 			configuration object that determines which templates are loaded, and how
		 * 			the loaded data is processed.
		 * 
		 * 
		 * @returns {Promise} a Deferred.promise, that resolves after all partials have been loaded
		 * 					NOTE: loading failures will generate a warning message (on the console)
		 * 						  but will not cause the Promise to fail.
		 */
		var doProcessTemplateList = function(createConfig){

			/**
			 * @type jQuery.Deferred
			 * @private
			 * @memberOf mmir.MediaManager.init.doProcessTemplateList
			 */
			var defer = $.Deferred();
			
			/**
			 * @type String
			 * @private
			 * @memberOf mmir.MediaManager.init.doProcessTemplateList
			 */
			var ctrlNameList = controllerManager.getControllerNames();
			
			/**
			 * HELPER object for tracking the loading-status of the views
			 * 
			 * @private
			 * @memberOf mmir.MediaManager.init.doProcessTemplateList
			 */
			var loadStatus = {
					loader: defer,
					remainingCtrlCount: ctrlNameList.length,
					currentLoadCount: 0
			};

			$.each(ctrlNameList, function(ctrlIndex, controllerName){

				var controller = controllerManager.getController(controllerName); 

				$.each(controller[createConfig.accessorName](), function(index, templateInfo){

					doLoadTemplateFile(controller, templateInfo, createConfig, loadStatus);

				});//END: each(templateInfo)

				-- loadStatus.remainingCtrlCount;
				checkCompletion(loadStatus);

			});//END: each(ctrlName)

			checkCompletion(loadStatus);
			return defer.promise();

		};//END: doProcessTemplateList()

		/**
		 * HELPER that loads a single template file asynchronously and creates a corresponding template-class instance
		 * (depending on <code>createConfig</code>).
		 * 
		 * The <code>status</code> is updated on successful loading or on error (see {@link updateLoadStatus}).
		 * 
		 * @example
		 * 
		 * //EXAMPLE for createConfig for loading template contents into a Partial
		 * var theCreateConfig = {
		 *   constructor: Partial,        // the class constructor that takes the loaded template data
		 *   typeName: 'Partial',         // the name of the class that will be created
		 *   collection: _partials,        // the map/dictionary to which the created class-instance will be added
		 *   keyGen: createPartialKey,    // the function for creating the lookup-key (for the dictionary)
		 *   accessorName: 'getPartials'  // the accessor-function's name for accessing the info-objects on the controller-instance
		 * };
		 * doLoadTemplateFiles(theCreateConfig).then(function(){
		 * 	//do something that depends on loading of the template files... 
		 * });
		 * 
		 * //EXAMPLE for createConfig for loading template contents into a Layout
		 * var theCreateLayoutConfig = {
		 *   constructor: Layout,        // the class constructor that takes the loaded template data
		 *   typeName: 'Layout',         // the name of the class that will be created
		 *   collection: _layouts,        // the map/dictionary to which the created class-instance will be added
		 * };
		 * 
		 * doLoadTemplateFiles(theCreateLayoutConfig).then(function(){
		 * 	//do something that depends on loading of the template files... 
		 * });
		 * 
		 * //for createConfig for loading template contents into a Partial
		 * 
		 * @param {Controller} controller
		 * 		the controller to which the template files belong.
		 * 		May be <code>null</code>: see {@link doParseTemplate}.
		 * 
		 * @param {PlainObject} templateInfo
		 * 		the JSON-like object containing information for the template
		 * 		(e.g. <code>name</code>, <code>file-path</code> etc.; see
		 * 		 {@link mmir.ControllerManager#getControllerResources} for 
		 *          more information).
		 *          
		 * @param {PlainObject} createConfig
		 * 		configuration that is used to create a corresponding template-object
		 * 		for the loaded template-contents.
		 * 		The created object will be added to <code>createConfig.collection</code>
		 * 		(Dictionary; with controller's name as key).
		 * 
		 * @param {PlainObject} loadStatus
		 * 		Object for managing the loading-status. The status is updated and used to
		 * 		determine, if all templates (e.g. from a list) have been (asynchronously)
		 * 		loaded.
		 * 
		 * @function
		 * @private
		 * @async
		 * @memberOf mmir.MediaManager.init
		 */
		var doLoadTemplateFile = function(controller, templateInfo, createConfig, loadStatus){
			++loadStatus.currentLoadCount;

			$.ajax({
				async: true,
				dataType: "text",
				url: templateInfo.path,
				success: function(data){

					if(isUsePreCompiledViews){

						loadPrecompiledView(data, templateInfo.genPath, function(){

							updateLoadStatus(loadStatus);

						}, function(err){

							console.warn('Could not load precompiled '+createConfig.typeName+' from '
									+templateInfo.genPath+'", because: '+err
									+', compiling template instead: '
									+templateInfo.path
							);

							doParseTemplate(controller, templateInfo.name, createConfig , data, loadStatus);

						});

					}
					else {

						doParseTemplate(controller, templateInfo.name, createConfig, data, loadStatus);

					}
				}

			}).fail(function(jqxhr, status, err){

				// print out an error message
				var errMsg = err && err.stack? err.stack : err;
				console.error("[" + status + "] Could not load '" + templateInfo.path + "': "+errMsg); //failure

				updateLoadStatus(loadStatus, true);
			});

			checkCompletion(loadStatus);

		};//END: doLoadTemplateFile()

		
		///////////// start intialization: ////////////////

		/**
		 * Deferred / promise for loading views.
		 * 
		 * @type jQuery.Deferred
		 * @private
		 * @memberOf mmir.MediaManager.init
		 */
		var defer = $.Deferred();

		var isLayoutsLoaded = false;
		var isViewsLoaded = false;
		var isPartialsLoaded = false;
		var isViewEngineLoaded = false;//MOD modularize view-engine jqm
		
		/**
		 * Helper: called each time a loading-function finishes.
		 * Checks if all other loading-functions have finished, and if so, resolves the init-promise.
		 * 
		 * @private
		 * @memberOf mmir.MediaManager.init
		 */
		var checkResolved = function(){
			if(isLayoutsLoaded && isViewsLoaded && isPartialsLoaded && isViewEngineLoaded){
				defer.resolve();
			}
		};
		/**
		 * Helper: called if an error occured in one of the loading-functions:
		 * rejects/fails the init-promise.
		 * 
		 * @private
		 * @memberOf mmir.MediaManager.init
		 */
		var failPromise = function(msg){
			defer.reject(msg);
		};

		//util for checking if pre-compiled views are up-to-date
		// (i.e.: can we use the pre-compiled view, or do we need to use the template file and compile it on-the-fly)
		//TODO should this also be configurable -> up-to-date check (e.g. use pre-compiled views without checking for changes)
		checksumUtils = checksumUtils.init();
		
		loadLayouts().then(
				function(){ isLayoutsLoaded = true; checkResolved(); },
				failPromise
		);
		loadViews().then(
				function(){ isViewsLoaded = true; checkResolved(); },
				failPromise
		);
		loadPartials().then(
				function(){ isPartialsLoaded = true; checkResolved(); },
				failPromise
		);
		
		//MOD modularize view-engine jqm: load viewEngine (default is based on jQuery Mobile)
		core.require([core.viewEngine], function(viewEngineInit){
			viewEngineInit.then(
				function(viewEngine){
					_instance.setRenderEngine(viewEngine);
					isViewEngineLoaded = true;
					checkResolved();
				}, failPromise
			);
		});

		return defer.promise(_instance);

	};//END: init()
	
});
