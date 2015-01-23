
/**
 * View engine that uses jQuery Mobile for loading the views as new jQM pages.
 * 
 * The render-functions supports the jQM page-transitions.
 * 
 * NOTE: loading the module will in effect load all jQuery Mobile functionality
 *       (and its side effects, e.g. auto-enhancement of HTML elements, e.g. for input/text)
 * 
 * <h3>Side Effects</h3>
 * <ul>
 * 	<li>loads the jQuery Mobile CSS file</li>
 * 	<li>defines and loads the RequireJS ID "jqm" (jQuery Mobile)</li>
 * 	<li>defines and loads the RequireJS ID "jqmSimpleModal" (jQuery Mobile plugin SimpleModal)</li>
 * </ul>
 * 
 * @example
 * //use page-transition with effect 'slide' (animated as not reversed motion)
 * mmir.DialogManager.render('theController', 'theView', {transition: 'slide', reverse: false});
 * 
 * @class
 * @name jqmViewEngine
 * @static 
 *  
 * Libraries:
 *  - jQuery (>= v1.6.2)
 *  - jQuery Mobile (jQuery plugin, >= 1.2.0); $.mobile
 *  - SimpleModal (jQuery plugin, >= v1.4.2); $.modal
 *  
 *  @depends document (DOM object)
 *  
 *  @depends jQuery.Deferred
 *  
 *  @depends jQuery.parseHTML
 *  @depends jQuery.appendTo
 *  @depends jQuery#selector
 *  
 *  @depends jQueryMobile.defaultPageTransition
 *  @depends jQueryMobile.pageContainer
 *  @depends jQueryMobile.loading
 *  @depends jQueryMobile.pageContainer
 *  
 *  @depends jQuerySimpleModalDialog
 */
define(['jquery', 'loadCss'],function(jquery, loadCss){

	//load CSS for jQuery Mobile:
	loadCss('mmirf/vendor/styles/jquery.mobile-1.4.3.min.css');
	
	require.config({
		paths:{
			'jqm' : 			'vendor/libs/jquery.mobile-1.4.3',
			'jqmSimpleModal':	'vendor/libs/jquery.simplemodal-1.4.4'
		}//,
	
		//DISABLED russa: technically, we need jQuery as dependency, but since we already 
		//				  have requested jQuery in the definition of this module, we can
		//				  omit the shim-definitions that would specify jQuery as dependency.
//		shim : {
//		      'jqm': ['jquery'],
//    		  'jqmSimpleModal': ['jquery']
//		}
		
	});
	
	var promise = jquery.Deferred();
	
	require(['jquery', 'renderUtils', 'languageManager', 'controllerManager',
	         'jqm','jqmSimpleModal'],
	    function(jq, renderUtils, languageManager, controllerManager
	){

		/**
		 * List of elements (jQuery objects) that should be remove from DOM
		 * after a page has loaded (loaded: after all contents inserted into the
		 * DOM and after all page transitions have been executed).
		 * 
		 * @private
		 */
		var afterViewLoadRemoveList = [];

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
		 * @public
		 * @constant
		 */
		var CONTENT_ID = "pageContainer";

		//property names for passing the respected objects from doRenderView() to doRemoveElementsAfterViewLoad()
		var FIELD_NAME_VIEW 		 = '__view';
		var FIELD_NAME_DATA 		 = '__renderData';
		var FIELD_NAME_CONTROLLER 	 = '__ctrl';

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

			//FIX handle missing ctrl/view parameter gracefully 
			//     this may occur when doRemoveElementsAfterViewLoad is 
			//     triggered NOT through doRenderView but by some automatic
			//	   mechanism, e.g. BACK history event that was not handled
			//	   by the framework (which ideally should not happen ...)
			var viewName;
			if(view){
				viewName = view.getName();
			}

			if(!ctrl){
				console.error('PresentationManager[jqmViewEngine].__doRemoveElementsAfterViewLoad: missing controller (and view)!',data.options);
				return;
			}

			//trigger "after page loading" hooks on controller:
			// the hook for all views of the controller MUST be present/implemented:
			ctrl.perform('on_page_load', renderData, viewName);
			//... the hook for single/specific view MAY be present/implemented:
			if(view){
				ctrl.performIfPresent('on_page_load_'+viewName, renderData);
			}

		};

		// set jQuery Mobile's default transition to "none":
		// TODO make this configurable (through mmir.ConfigurationManager)?
		jq.mobile.defaultPageTransition = 'none';

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

			var layout = this.getLayout(ctrlName, true);

			var layoutBody = layout.getBodyContents();
			var layoutDialogs = layout.getDialogsContents();
			//TODO var layoutHeader = layout.getHeaderContents();

			layoutBody = renderUtils.renderViewContent(layoutBody, layout.getYields(), view.contentFors, data );
			layoutDialogs = renderUtils.renderViewDialogs(layoutDialogs, layout.getYields(), view.contentFors, data );

			//TODO handle additional template syntax e.g. for BLOCK, STATEMENT (previously: partials)
			var dialogs = jq("#applications_dialogs");//<- TODO make this ID a CONST & export/collect all CONSTs in one place 
			dialogs.empty();

			dialogs.append(layoutDialogs);

//			// Translate the Keywords or better: localize it... 
//			NOTE: this is now done during rendering of body-content                  	layoutBody = mmir.LanguageManager.translateHTML(layoutBody);
			//TODO do localization rendering for layout (i.e. none-body- or dialogs-content)

			var pg = new RegExp(CONTENT_ID, "ig");
			var oldId = "#" + CONTENT_ID + this.pageIndex;

			// get old content from page
			var oldContent = jq(oldId);
			if(oldContent.length < 1 && oldId == '#'+CONTENT_ID+'0'){
				//the ID of the first page (pageIndex 0) may have no number postfix
				// -> try without number:
//				if(IS_DEBUG_ENABLED) console.debug('PresentationManager[jqmViewEngine].doRenderView: removing old content: no old centent found for old ID "'+oldId+'", trying "#'+CONTENT_ID+'" instead...');//debug
				oldContent = jq('#' + CONTENT_ID);
			}

			//mark old content for removal
			afterViewLoadRemoveList.push(oldContent);

			++ this.pageIndex;
			var newId = CONTENT_ID + this.pageIndex;

			//TODO detect ID-attribute of content-TAG when layout is initialized instead of here
			layoutBody = layoutBody.replace(pg, newId);

			if(typeof jq.parseHTML !== 'undefined'){
				layoutBody = jq.parseHTML(layoutBody);
			}
			var newPage = jq(layoutBody);


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
			newPage.appendTo(jq.mobile.pageContainer);

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
			var pageContainer = jq(':mobile-pagecontainer');
			//add handler that removes old page, after the new one was loaded:
			pageContainer.pagecontainer({change: doRemoveElementsAfterViewLoad});
			//actually change the (visible) page to the new one:
			pageContainer.pagecontainer('change', '#' + newId, changeOptions);


			//FIX moved into doRemoveElementsAfterViewLoad()-handler (if transition-animation is used, these must be called from handler!)
//			//trigger "after page loading" hooks on controller:
//			// the hook for all views of the controller MUST be present/implemented:
//			ctrl.perform('on_page_load', data);
//			//... the hook for single/specific view MAY be present/implemented:
//			ctrl.performIfPresent('on_page_load_'+viewName, data);

		};
		
		promise.resolve({
			render: doRenderView,
			/**
             * Closes a modal window / dialog.<br>
             * 
             * @depends jQuery Mobile SimpleModal
             * 
             * @function hideCurrentDialog
             * @public
             */
            hideCurrentDialog : function() {
                
                if (jq.modal != null) {
                    jq.modal.close();
                }
                else {
                	console.warn('PresentationManager[jqmViewEngine].hideCurrentDialog: could not find SimpleModal plugin: jQuery.modal is '+(typeof jq.modal));
                }
            },
            /**
             * Opens the requested dialog.<br>
             * 
             * @depends jQuery Mobile SimpleModal
             * @depends mmir.ControllerManager
             * 
             * 
             * @function showDialog
             * @param {String}
             *            ctrlName Name of the controller
             * @param {String}
             *            dialogId Id of the dialog
             * @param {Object}
             *            data Optionally data - not used
             *            
             * @returns {Object} the instance of the current dialog that was opened
             * 
             * @public
             */
            showDialog : function(ctrlName, dialogId, data) {

				this.hideCurrentDialog();

				var ctrl = controllerManager.getController(ctrlName);
				
				if (ctrl != null) {

					return jq("#" + dialogId).modal({
						
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

					}); /////////////////////////////////// EARLY EXIT ////////////////////////


					//DISABLED: this would require jqtransform.js / jqtransform.css
//					jq('.transformed-checkbox').jqTransform({
//						imgPath : 'jqtransformplugin/img/'
//					});
					
				} else {
					console.error("PresentationManager[jqmViewEngine].showDialog: Could not find Controller for '" + ctrlName + "'");
				}
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
			 * 
			 * @depends jQuery Mobile: <code>$.mobile.loading</code>
			 * @depends mmir.LanguageManager
			 * 
			 * @see #hideWaitDialog
			 */
			showWaitDialog : function(text, theme) {

				var loadingText = typeof text === 'undefined'? languageManager.getText('loadingText') : text;
				var themeSwatch = typeof theme === 'undefined'? 'b' : text;//TODO define a default & make configurable (-> mmir.ConfigurationManager) 
				
				if (loadingText !== null && loadingText.length > 0) {
//					console.log('[DEBUG] setting loading text to: "'+loadingText+'"');
					jq.mobile.loading('show', {
						text : loadingText,
						theme: themeSwatch,
						textVisible : true
					});
				}
				else {
					jq.mobile.loading('show',{
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
			 * 
			 * @depends jQuery Mobile: <code>$.mobile.loading</code>
			 * 
			 * @see #showWaitDialog
			 */
			hideWaitDialog : function() {

				jq.mobile.loading('hide');

			}
		});
	});
	
	return promise;
});
