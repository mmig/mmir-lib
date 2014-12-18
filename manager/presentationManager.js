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



define([ 'controllerManager', 'constants', 'commonUtils', 'configurationManager', 'renderUtils'
         , 'layout', 'view', 'partial', 'dictionary', 'checksumUtils', 'languageManager'
         , 'jquery'//, 'module'
         , 'jqm', 'stringExtension', 'parserModule'
        
    ],
    
    /**
     * @class
     * @name mmir.PresentationManager
     * @static 
     *  
     * Libraries:
     *  - jQuery (>= v1.6.2); ajax, each, bind
     *  - jQuery Mobile (jQuery plugin, >= 1.2.0); $.mobile
     *  - SimpleModal (jQuery plugin, >= v1.4.2); $.modal
     *  TODO check for other dependencies on 3rd party libraries (& add missing entries)
     *  
     *  @depends document (DOM object)
     *  
     *  @depends jQuery.Deferred
     *  @depends jQuery.ajax
     *  @depends jQuery.each
     *  
     *  @depends jQuery.parseHTML
     *  @depends jQuery#selector
     *  
     *  @depends jQueryMobile.defaultPageTransition
     *  @depends jQueryMobile.pageContainer
     *  @depends jQueryMobile.loading
     *  @depends jQueryMobile.pageContainer
     *  
     *  @depends jQuerySimpleModalDialog
     */
    function ( controllerManager, constants, commonUtils, configurationManager, renderUtils
    		, Layout, View, Partial, Dictionary, checksumUtils, languageManager
            , $//, module
) {
	
	//next 2 comments are needed by JSDoc so that all functions etc. can
	// be mapped to the correct class description
	/** @scope mmir.PresentationManager.prototype */
	/**
	 * #@+
	 * @memberOf mmir.PresentationManager.prototype 
	 */
	
	/**
     * Counter that keeps track of the number of times, that a view is rendered
     * 
     * NOTE: for implementation specific reasons, jQuery Mobile requires that
     * 		 each page has a different ID. This pageIndex is used to generating
     * 		 such a unique ID, by increasing the number on each page-change
     * 		 (i.e. by rendering a view) and appending it to the page's ID/name.
     * 
     * @property pageIndex
     * @type Integer
     * @private
     */
	var pageIndex = 0;

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
	  * @property DEFAULT_LAYOUT_NAME
	  * @type String
	  * @private
	  * @constant
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
	  * @property CONFIG_PRECOMPILED_VIEWS_MODE
	  * @type String
	  * @private
	  * @constant
	  * 
	  * @example var isUsePrecompiledViews = mmir.Constants.get(CONFIG_PRECOMPILED_VIEWS_MODE);
	  * 
	  */
	 var CONFIG_PRECOMPILED_VIEWS_MODE = 'usePrecompiledViews';//TODO move this to somewhere else (collected config-vars?)? this should be a public CONSTANT...
	 
	 // private members
	 /**
	  * Array of layouts of the application
	  * 
	  * @property layouts
	  * @type Dictionary
	  * @private
	  */
	 var layouts = new Dictionary();

	 /**
	  * Array of all the views of the application
	  * 
	  * @property views
	  * @type Dictionary
	  * @private
	  */
	 var views = new Dictionary();

	 /**
	  * Array of all the partials of the application
	  * 
	  * @property partials
	  * @type Dictionary
	  * @private
	  */
	 var partials = new Dictionary();

	 
	 ///////////////////////////// jQuery Mobile specific fields/settings  /////////////////////////////
	 /**
	  * The ID attribute for the content / page-elements.
	  * 
	  * <p>
	  * This is jQuery Mobile specific:
	  * pages are contained in an element with <code>data-role="page"</code>.
	  * 
	  * These elements must have an ID attribute with the value of this constant
	  * (the actual value will be created and set on rendering the view / layout).
	  * 
	  * @property CONTENT_ID
	  * @type String
	  * @private
	  * @constant
	  */
	 var CONTENT_ID = "pageContainer";
	 
	 /**
	  * List of elements (jQuery objects) that should be remove from DOM
	  * after a page has loaded (loaded: after all contents inserted into the
	  * DOM and after all page transitions have been executed).
	  * 
	  * @private
	  */
	 var afterViewLoadRemoveList = [];
     
	 //property names for passing the respected objects from doRenderView() to doRemoveElementsAfterViewLoad()
	 var FIELD_NAME_VIEW 		= '__view';
	 var FIELD_NAME_DATA 		= '__renderData';
	 var FIELD_NAME_CONTROLLER 	= '__ctrl';
	 
     //function for removing "old" content from DOM (-> remove old, un-used page content)
     var doRemoveElementsAfterViewLoad = function(event, data){
     	//data.toPage: {String|Object} page to which view was changed
     	//data.options: the configuration for the page change
     	
     	//do remove previous/old content from page:
     	var size = afterViewLoadRemoveList.length;
     	for(var i=size-1; i >= 0; --i){
     		//remove element from DOM via jQuery method:
     		afterViewLoadRemoveList[i].remove();
     	}
     	if(size > 0){
     		//remove all elements from array
     		afterViewLoadRemoveList.splice(0, size);
     	}
     	
     	var ctrl = data.options[FIELD_NAME_CONTROLLER];
     	var view = data.options[FIELD_NAME_VIEW];
     	var renderData = data.options[FIELD_NAME_DATA];
        //trigger "after page loading" hooks on controller:
        // the hook for all views of the controller MUST be present/implemented:
		ctrl.perform('on_page_load', renderData, view.getName());
		//... the hook for single/specific view MAY be present/implemented:
		ctrl.performIfPresent('on_page_load_'+view.getName(), renderData);
		
     };
     
	 // set jQuery Mobile's default transition to "none":
     // TODO make this configurable (through mmir.ConfigurationManager)?
	 $.mobile.defaultPageTransition = 'none';


	 ///////////////////////////// END: jQuery Mobile specific fields/settings /////////////////////////////
	 
	 /**
	  * An object containing data for the currently displayed view.<br>
	  * It contains: name of the corresponding controller, name of the view
	  * and optionally data for the view
	  * 
	  * @property currentView
	  * @type Object
	  * @private
	  */
	 var currentView = new Object();

	 /**
	  * An object containing data for the previously displayed view - the one
	  * displayed before the current view.<br>
	  * It contains: name of the corresponding controller, name of the view
	  * and optionally data for the view
	  * 
	  * @property previousView
	  * @type Object
	  * @private
	  */
	 var previousView = new Object();

	 /**
	  * The currently displayed dialog object, if a dialog is displayed. Used
	  * mainly to close the dialog.
	  * 
	  * @property current_dialog
	  * @type Object
	  * @private
	  */
	 var current_dialog = null;
	 
	 var viewSeparator 		= '#';
     var partialSeparator 	= commonUtils.getPartialsPrefix();
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
     function createViewKey(ctrl, view){
     	return createLookupKey(ctrl, view, viewSeparator);
     }
     function createPartialKey(ctrl, partial){
     	return createLookupKey(ctrl, partial, partialSeparator);
     }
	 
	 /**
	  * Actually renders the View.<br>
	  * Fetches the layout for the controller, then fills the
	  * layout-template with the view content, while incorporating
	  * partials and contents that helper methods have provided. Then
	  * Dialogs are created and the pageContainer id is updated. At last
	  * all the content is localized using
	  * {@link mmir.LanguageManager#translateHTML}, and appended to
	  * the HTML document of the application, while the old one is
	  * removed.<br>
	  * At the end the <b>on_page_load</b> action is performed.
	  * 
	  * @function doRenderView
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
	  *            
	  * @private
	  */
	 var doRenderView = function(ctrlName, viewName, view, ctrl, data){
		 
		 //if set to FALSE by one of the hooks (ie. before_page_prepare / before_page_load)
		 //   will prevent rendering of the view! 
		 var isContinue;
		 
		 //trigger "before page preparing" hooks on controller, if present/implemented: 
		 isContinue = ctrl.performIfPresent('before_page_prepare', data, viewName);
		 if(isContinue === false){
			 return;/////////////////////// EARLY EXIT ////////////////////////
		 }
		 
		 isContinue = ctrl.performIfPresent('before_page_prepare_'+viewName, data);
		 if(isContinue === false){
			 return;/////////////////////// EARLY EXIT ////////////////////////
		 }
		 
		 var layout = _instance.getLayout(ctrlName, true);

		 var layoutBody = layout.getBodyContents();
		 var layoutDialogs = layout.getDialogsContents();
		 //TODO var layoutHeader = layout.getHeaderContents();

		 layoutBody = renderUtils.renderViewContent(layoutBody, layout.getYields(), view.contentFors, data );
		 layoutDialogs = renderUtils.renderViewDialogs(layoutDialogs, layout.getYields(), view.contentFors, data );

		 //TODO handle additional template syntax e.g. for BLOCK, STATEMENT (previously: partials)
		 var dialogs = $("#applications_dialogs");//<- TODO make this ID a CONST & export/collect all CONSTs in one place 
		 dialogs.empty();

		 dialogs.append(layoutDialogs);

//		 // Translate the Keywords or better: localize it... 
//		 NOTE: this is now done during rendering of body-content                  	layoutBody = mmir.LanguageManager.translateHTML(layoutBody);
		 //TODO do localization rendering for layout (i.e. none-body- or dialogs-content)

		 var pg = new RegExp(CONTENT_ID, "ig");
		 var oldId = "#" + CONTENT_ID + pageIndex;

		 // get old content from page
		 var oldContent = $(oldId);
		 if(oldContent.length < 1 && oldId == '#'+CONTENT_ID+'0'){
			 //the ID of the first page (pageIndex 0) may have no number postfix
			 // -> try without number:
			 if(IS_DEBUG_ENABLED) console.debug('PresentationManager.doRenderView: removing old content: no old centent found for old ID "'+oldId+'", trying "#'+CONTENT_ID+'" instead...');//debug
			 oldContent = $('#' + CONTENT_ID);
		 }

		 //mark old content for removal
		 afterViewLoadRemoveList.push(oldContent);

		 ++pageIndex;
		 var newId = CONTENT_ID + pageIndex;

		 //TODO detect ID-attribute of content-TAG when layout is initialized instead of here
		 layoutBody = layoutBody.replace(pg, newId);

		 if(typeof $.parseHTML !== 'undefined'){
			 layoutBody = $.parseHTML(layoutBody);
		 }
		 var newPage = $(layoutBody);

		 
		 //trigger "before page loading" hooks on controller, if present/implemented: 
		 isContinue = ctrl.performIfPresent('before_page_load', data, viewName);//<- this is triggered for every view in the corresponding controller
		 if(isContinue === false){
			 return;/////////////////////// EARLY EXIT ////////////////////////
		 }
		 
		 isContinue = ctrl.performIfPresent('before_page_load_'+viewName, data);
		 if(isContinue === false){
			 return;/////////////////////// EARLY EXIT ////////////////////////
		 }
		 
		 //'load' new content into the page (using jQuery mobile)
		 newPage.appendTo($.mobile.pageContainer);

		 //pass controller- and view-instance to "after page change" handler (jQuery Mobile specific!)
		 var changeOptions = {};
		 changeOptions[FIELD_NAME_VIEW] = view;
		 changeOptions[FIELD_NAME_DATA] = data;
		 changeOptions[FIELD_NAME_CONTROLLER] = ctrl;

		 
		 //set transition options, if present (jQuery Mobile specific!):
		 if(data && typeof data.transition !== 'undefined'){
			 
			 changeOptions.transition= data.transition;
		 }
		 if(data && typeof data.reverse !== 'undefined'){
			 
			 changeOptions.reverse = data.reverse;
		 }
		 

		 //change visible page from old to new one (using jQuery mobile)
		 
         //jQuery Mobile 1.4 API:
         var pageContainer = $(':mobile-pagecontainer');
         //add handler that removes old page, after the new one was loaded:
         pageContainer.pagecontainer({change: doRemoveElementsAfterViewLoad});
         //actually change the (visible) page to the new one:
         pageContainer.pagecontainer('change', '#' + newId, changeOptions);


         //FIX moved into doRemoveElementsAfterViewLoad()-handler (if transition-animation is used, these must be called from handler!)
//         //trigger "after page loading" hooks on controller:
//         // the hook for all views of the controller MUST be present/implemented:
//		 ctrl.perform('on_page_load', data);
//		 //... the hook for single/specific view MAY be present/implemented:
//		 ctrl.performIfPresent('on_page_load_'+viewName, data);
		 
	 };

	 
	 var _instance = {
			/** @scope mmir.PresentationManager.prototype  */
			 
			/**
			 * @deprecated instead: use mmir.PresentationManager directly
			 */
			getInstance: function () {
				return this;
			},

           // public members
            addLayout : function(layout) {
                layouts.put(layout.getName(), layout);
            },
            /**
             * This function returns a layout object by name.<br>
             * 
             * @function getLayout
             * @param {String}
             *            layoutName Name of the layout which should be returned
             * @param {Boolean}
             *            [doUseDefaultIfMissing] if supplied and
             *            <code>true</code>, the default controller's layout
             *            will be used as a fallback, in case no corresponding
             *            layout could be found
             * @returns {Object} The requested layout, "false" if not found
             * @public
             */
            getLayout : function(layoutName, doUseDefaultIfMissing) {
                var layout = false;
                layout = layouts.get(layoutName);
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

            addView : function(ctrlName, view) {
                views.put(createViewKey(ctrlName, view), view);
            },
            /**
             * This function returns a view object by name.<br>
             * 
             * @function getView
             * @param {String}
             *            controllerName Name of the controller for the view
             * @param {String}
             *            viewName Name of the view which should be returned
             * @returns {Object} The requested view, <tt>false</tt> if not
             *          found
             * @public
             */
            getView : function(controllerName, viewName) {
                viewName = createViewKey(controllerName, viewName);
                var view = false;
                view = views.get(viewName);

                if (!view) {
                    console.error('[PresentationManager.getView]: could not find view "' + viewName + '"');
                    return false;
                }
                return view;
            },
            
            addPartial: function(ctrlName, partial){
            	partials.put(createPartialKey(ctrlName, partial), partial);
            },

            /**
             * This function returns a partial object by name.<br>
             * 
             * @function getPartial
             * @param {String}
             *            controllerName Name of the controller for the view
             * @param {String}
             *            viewName Name of the partial which should be returned
             * @returns {Object} The requested partial, "false" if not found
             * @public
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

                partial = partials.get(partialKey);
                if (!partial) {
                    console.error('[PresentationManager.getPartial]: could not find partial "' + partialName + '" for controller "' + (controllerName ? (controllerName.getName? controllerName.getName(): controllerName) : 'undefined') + '"!');
                    return false;
                }
                return partial;
            },

            /**
             * Closes a modal window - in this case a dialog.<br>
             * 
             * <br>
             * TODO needs to be "settable", depending on the currently used
             * (modal) dialog library
             * 
             * @requires jQuery Mobile SimpleModal
             * 
             * @function hideCurrentDialog
             * @public
             */
            hideCurrentDialog : function() {
                
//                if (current_dialog != null){
//                	current_dialog.close();
//                	current_dialog = null;
//                }
            	
                if ($.modal != null) {
                    $.modal.close();
                }
            },

            /**
             * Function opens requested dialog.<br>
             * 
             * <br>
             * TODO needs to be "settable", depending on the currently used
             * (modal) dialog library
             * 
             * @requires jQuery Mobile SimpleModal
             * 
             * @function showDialog
             * @param {String}
             *            ctrlName Name of the controller
             * @param {String}
             *            dialogId Id of the dialog
             * @param {Object}
             *            data Optionally data - not used
             * @public
             */
            showDialog : function(ctrlName, dialogId, data) {

				this.hideCurrentDialog();

				var ctrl = controllerManager.getController(ctrlName);
				
				if (ctrl != null) {

					current_dialog = $("#" + dialogId).modal({
						
						overlayId : 'recorder-overlay',
						containerId : 'recorder-container',
						//$("#"+dialogId).modal({overlayId: dialogId+"overlay",containerId: dialogId+"container",  
          					  
          				//closeHTML: null,opacity: 65, position: ['0',],overlayClose: true,onOpen: this.open,onClose: this.close
						closeHTML : null,
						opacity : 65,
						position : [ '0' ],
						overlayClose : false//,
//						onOpen: current_dialog.open,
//						onClose: current_dialog.close

					});

				} else {
					console.error("Could not find: Controller for " + ctrlName);
				}

				//DISABLED: this would require jqtransform.js / jqtransform.css
//				$('.transformed-checkbox').jqTransform({
//					imgPath : 'jqtransformplugin/img/'
//				});
			},
			
			/**
			 * Shows a "wait" dialog, i.e. "work in progress" notification.
			 * 
			 * @function showWaitDialog
			 * 
			 * @param {String} [text] OPTIONAL
			 * 				the text that should be displayed.
			 * 				If omitted the language setting for <code>loadingText</code>
			 * 				will be used instead (from dictionary.json)
			 * @param {String} [theme] OPTIONAL
			 * 				set the jQuery Mobile theme to be used for the wait-dialog
			 * 				(e.g. "a" or "b").
			 * 				NOTE: if this argument is used, then the <code>text</code>
			 * 					  must also be supplied.
			 * 
			 * @public
			 * @requires jQuery Mobile: <code>$.mobile.loading</code>
			 * 
			 * @see #hideWaitDialog
			 */
			showWaitDialog : function(text, theme) {

				var loadingText = typeof text === 'undefined'? languageManager.getText('loadingText') : text;
				var themeSwatch = typeof theme === 'undefined'? 'b' : text;//TODO define a default & make configurable (-> mmir.ConfigurationManager) 
				
				if (loadingText !== null && loadingText.length > 0) {
//					console.log('[DEBUG] setting loading text to: "'+loadingText+'"');
					$.mobile.loading('show', {
						text : loadingText,
						theme: themeSwatch,
						textVisible : true
					});
				}
				else {
					$.mobile.loading('show',{
						theme: themeSwatch,
						textVisible : false
					});
				}
			},

			/**
			 * Hides / closes the "wait" dialog.
			 * 
			 * @function hideWaitDialog
			 * @public
			 * @requires jQuery Mobile: <code>$.mobile.loading</code>
			 * 
			 * @see #showWaitDialog
			 */
			hideWaitDialog : function() {

				$.mobile.loading('hide');

			},

			/**
			 * Gets the view for a controller, then executes helper methods on
			 * the view data. The Rendering of the view is done by the
			 * {@link #doRenderView} method. Also
			 * stores the previous and current view with parameters.<br>
			 * 
			 * @function renderView
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
			 */
            renderView : function(ctrlName, viewName, data) {
            	
                var ctrl = controllerManager.getController(ctrlName);

                if (ctrl != null) {
                    var view = this.getView(ctrlName, viewName);


					//DISABLED helper methods are now handled differently -> invoked during rendering where they are specified in the template/view definition
//					//execute the helper-scripts that were referenced in the view:
//					view.executeHelperMethods(data);

                    doRenderView(ctrlName, viewName, view, ctrl, data);

                    // Only overwrite previous state if and only if the view is not re-rendered!
					if (ctrlName != currentView["ctrlName"] || viewName != currentView["viewName"] || data != currentView["data"]){
						previousView["ctrlName"]=currentView["ctrlName"];
						previousView["viewName"]=currentView["viewName"];
						previousView["data"]=currentView["data"];
					}
					
					currentView["ctrlName"]=ctrlName; 
					currentView["viewName"]=viewName; 
					currentView["data"]=data;
                }
            },

            /**
             * Renders the current view again, using the
             * {@link #render} method.
             * 
             * @deprecated you should use {@link #render} with appropriate parameters instead.
             * 
             * @depends mmir.DialogManager
             * 
             * @function reRenderView
             * @public
             */
            reRenderView : function() {
                if (currentView) {
                    if (currentView["ctrlName"] && currentView["viewName"]) {
                        require('dialogManager').render(currentView["ctrlName"], currentView["viewName"], currentView["data"]);
                    }
                }
            },

            /**
             * Renders the previous view again, using the
             * {@link mmir.DialogManager#render} method.
             * 
             * 
             * @deprecated you should use {@link #render} with appropriate parameters instead.
             * 
             * @depends mmir.DialogManager
             * 
             * @function renderPreviousView
             * @public
             */
            renderPreviousView : function() {
                if (previousView) {
                    if (previousView["ctrlName"] && previousView["viewName"]) {
                    	require('dialogManager').render(previousView["ctrlName"], previousView["viewName"], previousView["data"]);
                    }
                }
            },        
	
            init: init
		};//END:  return{...
//	})();//END: (function(){...
	

	return _instance;
	
	function init () {

		/** @scope mmir.MediaManager.prototype */

		checksumUtils = require('checksumUtils');//FIXME why is this undefined on loading? dependency cycle? really, this should already be available, since it is mentioned in the deps of define()....

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

			if(! isUpToDate(rawViewData, targetpath)){
				if(fail) fail('Precompiled view file is outdated!');
				else console.warn('Outdated pre-compiled view at: '+targetpath);
			}

			commonUtils.getLocalScript( //scriptUrl, success, fail)
					targetpath, success, fail
			);
		}

		//determine if pre-compiled views (*.js) should be used
		//DEFAULT: use templates files (*.ehtml) and compile them (freshly) on-the-fly
		var isUsePreCompiledViews = configurationManager.getBoolean(CONFIG_PRECOMPILED_VIEWS_MODE, true, false);

		//util for checking if pre-compiled views are up-to-date
		// (i.e.: can we use the pre-compiled view, or do we need to use the template file and compile it on-the-fly)
		//TODO should this also be configurable -> up-to-date check (e.g. use pre-compiled views without checking for changes)
		var checksumUtils = checksumUtils.init();

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
		 * 
		 * @param {String} viewContent
		 * 						the content of the view template (i.e. loaded eHTML file)
		 * @param {String} preCompiledViewPath
		 * 						the path to the corresponding pre-compiled view file
		 * 
		 */
		function isUpToDate(viewContent, preCompiledViewPath){
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
		 * name of the layouts into the <b>layouts</b> array.
		 * 
		 * @function loadLayouts
		 * @private
		 * 
		 * @returns {Promise} a Deferred.promise that gets resolved upon loading all layouts; fails/is rejected, if not at least 1 layout was loaded
		 */
		function loadLayouts() {
			// Load application's layouts. 


			var defer = $.Deferred();

			var ctrlNameList = controllerManager.getControllerNames();

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

			var createLayoutConfig = {
					constructor: Layout,
					typeName: 'Layout',
					collection: layouts
			};

			//helper for loading a single layout-file
			var doLoadLayout = function(index, ctrlName, theDefaultLayoutName){

				var ctrlName;
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
		 * <b>views</b> array.<br>
		 * 
		 * @function loadViews
		 * @private
		 * @async
		 * 
		 * @returns {Promise} a Deferred.promise that gets resolved upon loading all views
		 * 
		 * @see doProcessTemplateList
		 */
		function loadViews() {

			var creatorConfig = {
					constructor: View,
					typeName: 'View',
					collection: views,
					keyGen: createViewKey,
					accessorName: 'getViews'
			};

			return doProcessTemplateList(creatorConfig);

		}//END: loadViews()

		/**
		 * This function actually loads the partials for every controller,
		 * creates an instance of a partial class and puts the partial instance
		 * in the <b>partials</b> array.<br>
		 * It uses a asynchronous way of loading the partials-files one after
		 * another.<br>
		 * <b>If you want to make sure, that all partials are indeed loaded,
		 * before proceeding with the subsequent instructions, you could look at
		 * the function
		 * {@link mmir.ControllerManager#foundControllersCallBack} for
		 * reference of a function which loads the files one after another - not
		 * asynchronously.</b>
		 * 
		 * @function loadPartials
		 * @private
		 * @async
		 * 
		 * @returns {Promise} a Deferred.promise, that resolves after all partials have been loaded
		 * 					NOTE: loading failures will generate a warning message (on the console)
		 * 						  but will not cause the Promise to fail.
		 */
		function loadPartials() {

			var creatorConfig = {
					constructor: Partial,
					typeName: 'Partial',
					collection: partials,
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
		 * @function doParseTemplate
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

			require(['parseUtils'], function(){

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
		 * @function doProcessTemplateList
		 * @private
		 * @async
		 * 
		 * @see doLoadTemplateFile
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

			var defer = $.Deferred();

			var ctrlNameList = controllerManager.getControllerNames();

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
		 *   collection: partials,        // the map/dictionary to which the created class-instance will be added
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
		 *   collection: layouts,        // the map/dictionary to which the created class-instance will be added
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
		 * @function doProcessTemplateList
		 * @private
		 * @async
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

		var defer = $.Deferred();

		var isLayoutsLoaded = false;
		var isViewsLoaded = false;
		var isPartialsLoaded = false;
		var checkResolved = function(){
			if(isLayoutsLoaded && isViewsLoaded && isPartialsLoaded){
				defer.resolve();
			}
		};
		var failPromise = function(msg){
			defer.reject(msg);
		};

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

		return defer.promise(_instance);

	};//END: init()

	/** #@- */
});

