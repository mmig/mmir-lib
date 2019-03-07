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



define([ 'mmirf/controllerManager', 'mmirf/commonUtils', 'mmirf/viewLoader', 'mmirf/logger'
         , 'mmirf/util/deferredWithState', 'mmirf/core', 'module', 'require'
    ],

    /**
     * @class
     * @name mmir.PresentationManager
     * @static
     *
     * @requires dialogManager if reRenderView() or renderPreviousView() are used
     *
     */
    function ( controllerManager, commonUtils, viewLoader, Logger
            , deferred, core, module, require
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
	  *
	  * @example var defaultLayoutName = mmir.conf.get(mmir.presentation.CONFIG_DEFAULT_LAYOUT);
	  */
	 var DEFAULT_LAYOUT_NAME = 'Default';

	 /**
	  * Name of the configuration property that specifies a custom name for the default layout.
	  *
	  * <p>
	  * NOTE: if FALSY (other than <code>undefined</code>) no default layout will be loaded.
	  *       Rendering views may fail, if they rely on a {@link Layout}!
	  *
	  * @type String
	  * @private
	  * @constant
	  * @memberOf mmir.PresentationManager#
	  *
	  * @example var defaultLayout = mmir.conf.get(mmir.presentation.CONFIG_DEFAULT_LAYOUT_NAME);
	  *
	  */
	 var CONFIG_DEFAULT_LAYOUT_NAME = 'defaultLayoutName';//TODO move this to somewhere else (collected config-vars?)? this should be a public CONSTANT...

	 // private members
	 /**
	  * The logger for the PresentationManager.
	  *
	  * @private
	  * @type Logger
	  * @memberOf mmir.PresentationManager#
	  */
	var logger = Logger.create(module);//initialize with requirejs-module information

	 /**
	  * Array of layouts of the application
	  *
	  * @type Map
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
	 var _layouts = new Map();

	 /**
	  * Array of all the views of the application
	  *
	  * @type Map
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
	 var _views = new Map();

	 /**
	  * Array of all the partials of the application
	  *
	  * @type Map
	  * @private
	  * @memberOf mmir.PresentationManager#
	  */
	 var _partials = new Map();

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
    		  * @returns {void|Promise}
    		  * 			if void/undefined is returned, the view is rendered synchronously, i.e.
			  * 			the view is rendered, when this method returns.
			  * 			If a Promise is returned, the view is rendered asynchronously
			  * 			(rendering is finished, when the promise is resolved)
    		  */
    		 render: function(ctrlName, viewName, view, ctrl, data){
    			 logger.error('PresentationManager.render: no rendering engine set!');
    		 },
    		 showDialog: function(ctrlName, dialogId, data) {
    			 logger.error('PresentationManager.showDialog: no rendering engine set!');
    		 },
    		 hideCurrentDialog: function(){
    			 logger.error('PresentationManager.hideCurrentDialog: no rendering engine set!');
    		 },
    		 showWaitDialog: function(text, data) {
    			 logger.error('PresentationManager.showWaitDialog: no rendering engine set!');
    		 },
    		 hideWaitDialog: function() {
    			 logger.error('PresentationManager.hideWaitDialog: no rendering engine set!');
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

           // public members
			/**
			 * @param {Layout} layout
			 * 			the layout to add
			 * @memberOf mmir.PresentationManager.prototype
			 */
            addLayout : function(layout) {
                _layouts.set(layout.getName(), layout);
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
                        logger.error('[PresentationManager.getLayout]: could not find layout "' + layoutName +'"')
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
                _views.set(createViewKey(ctrlName, view), view);
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
                    logger.error('[PresentationManager.getView]: could not find view "' + viewName + '"');
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
            	_partials.set(createPartialKey(ctrlName, partial), partial);
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
                    logger.error('[PresentationManager.getPartial]: requested partial "' + partialName + '" for unknown controller: "' + (controllerName ? (controllerName.getName? controllerName.getName(): controllerName) : 'undefined')
                            + '"');
                    return false;
                }

                partial = _partials.get(partialKey);
                if (!partial) {
                    logger.error('[PresentationManager.getPartial]: could not find partial "' + partialName + '" for controller "' + (controllerName ? (controllerName.getName? controllerName.getName(): controllerName) : 'undefined') + '"!');
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
             * @returns {Object} the instance of the opened dialog (void or falsy if dialog was not opened)
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
			 * @returns {void|Promise}
			 * 			if void/undefined is returned, the view is rendered synchronously, i.e.
			 * 			the view is rendered, when this method returns.
			 * 			If a Promise is returned, the view is rendered asynchronously
			 * 			(rendering is finished, when the promise is resolved)
			 *
			 * @public
			 * @memberOf mmir.PresentationManager.prototype
			 */
            render : function(ctrlName, viewName, data) {

                var ctrl = controllerManager.get(ctrlName);
                var renderResult;

                if (ctrl != null) {

                    var view = this.getView(ctrlName, viewName);

                    if(!view){
                    	logger.error('PresentationManager.renderView: could not find view "'+viewName+'" for controller "'+ctrlName+'"');
                    	return;
                    }

                    renderResult = _renderEngine.render.call(this, ctrlName, viewName, view, ctrl, data);

                }
                else {
                	logger.error('PresentationManager.renderView: could not retrieve controller "'+ctrlName+'"');
                }

                return renderResult;
            },

            /**
             * @function
			 * @memberOf mmir.PresentationManager.prototype
             */
            init: function(){

            	var defer = deferred();

            	var isViewEngineLoaded = false;//MOD modularize view-engine
            	var isViewsLoaded = false;//MOD modularize view-loading & -compiling

            	var checkResolved = function(){
            		if(isViewEngineLoaded && isViewsLoaded){
            			defer.resolve(_instance);
            		}
            	};

            	var failPromise = function(msg){
        			defer.reject(msg);
        		};

        		//MOD modularize view-engine: load viewEngine (default uses standard HTML document API)
        		require([typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD? 'mmirf/simpleViewEngine' : core.viewEngine], function(viewEngineInit){//FIXME
        			viewEngineInit.then(
        				function(viewEngine){
        					_instance.setRenderEngine(viewEngine);
        					isViewEngineLoaded = true;
        					checkResolved();
        				}, failPromise
        			);
        		});

            	viewLoader(
        			_instance, _layouts, _views, _partials, createViewKey, createPartialKey
            	).then(function(){
            		isViewsLoaded = true;
            		checkResolved();
            	}, failPromise);

            	return defer;
            },// init,

            /**
             * Sets the <em>rendering engine</em> for the views.
             *
             * The render engine <b>must</b> implement a function <em>render</em>
             * and <i>may</i> implement functions <em>showDialog</em>,
             * <em>hideCurrentDialog</em>, <em>showWaitDialog</em>, and <em>hideWaitDialog</em>:
             *
             * <ul>
             * 	<li><b>theRenderEngine.<code>render(ctrlName : String, viewName : String, view : View, ctrl : Controller, data : Object) : void|Promise</code></b></li>
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
             * <code>mmirf/env/view/presentation/simpleViewEngine.js</code>.
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
	 };//END:  _instance = {...

	 //export constants:
	 _instance.DEFAULT_LAYOUT_NAME = DEFAULT_LAYOUT_NAME;
	 _instance.CONFIG_DEFAULT_LAYOUT_NAME = CONFIG_DEFAULT_LAYOUT_NAME;


	return _instance;
});

//});
