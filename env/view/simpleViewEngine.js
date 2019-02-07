
/**
 * Example for a simplified view/rendering engine:
 *
 * uses the standard document API for rendering / inserting views into the current document.
 *
 *
 * @example
 * mmir.DialogManager.render('theController', 'theView');
 *
 * @class
 * @name simpleViewEngine
 * @static
 *
 *  @depends document (DOM object)
 *  @depends HTMLElement.parentElement
 *  @depends HTMLElement.removeChild
 *
 */
define(['mmirf/loadCss', 'mmirf/logger', 'mmirf/util/deferred', 'module', 'require'],function(loadCss, Logger, Deferred, module, require){

	var log = Logger.create(module);

	var modConfig = module.config(module);
	//load CSS, if one is set/configured:
	var SVE_CSS_ID   = modConfig.cssId;
	var SVE_CSS_HREF = modConfig.cssUrl;
	if(SVE_CSS_HREF){
		//include default styles for simpleViewEngine in webpack build
		if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
			//FIXME detect, if mmirf/simpleViewEngine is used/included & if cssUrl-config-value points to the default styles -> only include css-file if both apply
			SVE_CSS_HREF = require('../../vendor/styles/simpleViewLayout.css');
		}
		loadCss({href: SVE_CSS_HREF, id: SVE_CSS_ID});
	}

	var promise = new Deferred();

	require(['mmirf/commonUtils', 'mmirf/renderUtils', 'mmirf/languageManager', 'mmirf/controllerManager', 'mmirf/waitDialog', 'mmirf/util/forEach'],
	    function(commonUtils, renderUtils, languageManager, controllerManager, dlg, forEach
	){

		var nodeFind = function(node, tagType, attrName, attrVal){
			var list = node.getElementsByTagName(tagType);
			var result = [], el;
			for(var i=0, size = list.length; i < size; ++i){
				el = list[i];
				if(el[attrName] == attrVal){
					result.push(el);
				}
			}
			return result;
		};

		//prepare resources for standalone-wait-dialog
		dlg._loadStyle();
		var _viewEngineWaitId = 'view-wait-dlg';

		/**
		 * delay in case a Layout that is rendered includes a CSS file:
		 * signal "on_page_load" after this delay so that (hopefully) the CSS has been loaded
		 *
		 * NOTE: the onload listener for LINK-tags does not work in all browsers, so it cannot be used for checking if CSS has been loaded
		 *
		 * TODO make configurable?
		 */
		var CSS_LOAD_DELAY = typeof window.CSS_LOAD_DELAY === 'number'? window.CSS_LOAD_DELAY : 10;//ms

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
		var FIELD_NAME_RESOLVE 		 = '__renderResolve';
		var FIELD_NAME_VIEW 		 = '__view';
		var FIELD_NAME_DATA 		 = '__renderData';
		var FIELD_NAME_CONTROLLER 	 = '__ctrl';

		/**
		 * Reference to the layout that was rendered last.
		 *
		 * This is updated in doRenderView() before the view is actually rendered.
		 *
		 * @type Layout
		 * @private
		 * @memberOf SimpleJqViewEngine#
		 */
		var lastLayout = null;

		//function for removing "old" content from DOM (-> remove old, un-used page content)
		var doRemoveElementsAfterViewLoad = function(event, data){

			var ctrl = data[FIELD_NAME_CONTROLLER];
			var view = data[FIELD_NAME_VIEW];
			var renderData = data[FIELD_NAME_DATA];
			var defer = data[FIELD_NAME_RESOLVE];

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
				console.error('PresentationManager[simpleViewEngine].__doRemoveElementsAfterViewLoad: missing controller (and view)!',data.options);
				return;
			}

			//trigger "after page loading" hooks on controller:
			// the hook for all views of the controller MUST be present/implemented:
			ctrl.perform('on_page_load', renderData, viewName);
			//... the hook for single/specific view MAY be present/implemented:
			if(view){
				ctrl.performIfPresent('on_page_load_'+viewName, renderData);
			}

			defer.resolve();
		};

		/**
		 * HELPER generate a marker for inserted LINK and STYLE elements
		 * 			(so that they can easily removed)
		 *
		 * @function
		 * @private
		 * @memberOf SimpleJqViewEngine#
		 */
		var getLayoutMarkerAttr = function(layout){
			return 'rendered_layout_' + layout.getName();
		};

		/**
		 * HELPER remove layout resources (before loading a new layout).
		 *
		 * @param {Layout} layout
		 * 				the layout which's resources should be removed
		 *
		 * @function
		 * @private
		 * @memberOf SimpleJqViewEngine#
		 */
		var doRemoveLayoutResources = function(layout){
//			jquery('head .' + getLayoutMarkerAttr(layout)).remove();
			var list = document.head.getElementsByClassName(getLayoutMarkerAttr(layout));
			var el;
			for(var i = list.length-1; i >= 0; --i){
				el = list[i];
				if(el && el.parentElement){
					el.parentElement.removeChild(el);
				}
			}
		};

		/**
		 * Prepares the layout, before loading a view:
		 * loads referenced SCRIPTs, LINKs, and STYLEs.
		 *
		 * This function should not be called, if the layout is already loaded,
		 * i.e. SCRIPTs etc. are meant to be load-once (not load-on-every-page-rendering)
		 *
		 * @param {Layout} layout
		 * 				the layout which's resources should be prepared
		 * @returns {Promise}
		 * 				a deferred promise that gets resolved when the resources have been prepared
		 *
		 * @function
		 * @private
		 * @memberOf SimpleJqViewEngine#
		 */
		var doPrepareLayout = function(layout){

			//initialize with layout contents:

			/** @type Array<TagElement> */
			var headerContents = layout.headerElements;

			var scriptList = [];
			var layoutMarker = getLayoutMarkerAttr(layout);
			var isLinkLoading = false;
			var head, htmlStyle;
			forEach(headerContents, function(elem){
				if( elem.isScript()){

					scriptList.push(elem.src);

				} else if(elem.isLink()){

					isLinkLoading = true;
					loadCss({'href': elem.href, 'class': layoutMarker});

				} else if(elem.isStyle()){

					if(!head){
						head = document.head;
					}
					htmlStyle = ['<style class="', layoutMarker, '">', elem.html(), '</style>' ].join('');
					head.innerHTML = htmlStyle;

				} else {

					console.warn('simpleViewEngine.doPrepareLayout: unknown header element type: '+ elem.tagName, elem);
				}
			});

			if(scriptList.length === 0){
				var defer = new Deferred();
				if(isLinkLoading){
					//if css file is loading, resolve with a small delay, so that (most/some of) the CSS is loaded by then
					setTimeout(function(){defer.resolve();}, CSS_LOAD_DELAY);
				} else {
					defer.resolve();
				}
				return defer;/////////////////////////// EARLY EXIT ///////////////////////////////
			} else {

				if(!head){
					head = document.head;
				}


				var defer = new Deferred();
				var resolved = 0;//<- counter for resolved async-executions
				var setResolved = function(){++resolved; checkResolve();}
				var checkResolve = function(){
					if(resolved === 2){//<- expected async-executions: 2
						defer.resolve();
					}
				}

				//wait until all referenced scripts form LAYOUT have been loaded (may be used/required when views get rendered)
				commonUtils.loadImpl(
					scriptList,
					true,//<- load serially, since scripts may depend on each other
					null,//<- use returned promise instead of callback
					function checkIsAlreadyLoadedFunc(fileName){
						//if script is already loaded, do not load again:
//						return head.find('script[src="'+fileName+'"]').length > 0;
						var list = nodeFind(head, 'script', 'src', fileName);
						return list.length > 0;
					}
				).then(setResolved);

				if(isLinkLoading){
					//if css file is loading, resolve with a small delay, so that (most/some of) the CSS is loaded by then
					setTimeout(setResolved, CSS_LOAD_DELAY);
				} else {
					setResolved();
				}

				return defer;/////////////////////////// EARLY EXIT ///////////////////////////////
			}
		};

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
		 * @returns {Promise}
		 * 	        	a Promise that gets resolved when rendering is finished
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

			var renderResolve = new Deferred();
			var presentMgr = this;
			var renderFunc = function(){

				var title = layout.title;
				if(title){
					document.title = title;
				}

				var layoutBody = renderUtils.renderViewContent(layout.bodyContentElement, null, view.contentFors, data);
				var layoutDialogs = renderUtils.renderViewDialogs(layout.getDialogsContents(), layout.getYields(), view.contentFors, data);

				var dialogs = document.getElementById("applications_dialogs");//<- TODO make this ID a CONST & export/collect all CONSTs in one place

				if(!dialogs){
					dialogs = document.getElementsByTagName('dialog');
					var len = dialogs.length;
					if(len === 0){
						log.warn('PresentationManager[simpleViewEngine].doRenderView: no dialogs container, inserting new one into document.body.');
						dialogs = document.createElement('div');
						dialogs.id = 'applications_dialogs';
						dialogs.innerHTML = layoutDialogs;
						document.body.appendChild(dialogs);
					} else if(len > 1){
						log.warn('PresentationManager[simpleViewEngine].doRenderView: too many <dialog> definitions ('+dialogs.length+').');
					}
					dialogs = dialogs[0];//<- dialogs is set to undefined, if no <dialog>-elements were found
				}


				if(dialogs){
					dialogs.innerHTML = layoutDialogs;
				}

				var pg = new RegExp(CONTENT_ID, "ig");
				var oldId = CONTENT_ID + presentMgr.pageIndex;

				// get old content from page
				var oldContent = document.getElementById(oldId);
				if(!oldContent && oldId == CONTENT_ID+'0'){
					//the ID of the first page (pageIndex 0) may have no number postfix
					// -> try without number:
					if(log.isVerbose()) log.debug('PresentationManager[simpleViewEngine].doRenderView: removing old content: no old centent found for old ID "'+oldId+'", trying "#'+CONTENT_ID+'" instead...');//debug
					oldId = CONTENT_ID;
					oldContent = document.getElementById(oldId);
				}

				++ presentMgr.pageIndex;
				var newId = CONTENT_ID + presentMgr.pageIndex;

				//TODO detect ID-attribute of content-TAG when layout is initialized instead of here
				layoutBody = layoutBody.replace(pg, newId);

				var newPage = layoutBody;

				//provide "change" data for before_page_load calls:
				var pageEvtData = {
					name: viewName,
					id: newId,
					oldSel: oldId,
					content: newPage
				};

				//trigger "before page loading" hooks on controller, if present/implemented:
				isContinue = ctrl.performIfPresent('before_page_load', data, pageEvtData);//<- this is triggered for every view in the corresponding controller
				if(isContinue === false){
					return;/////////////////////// EARLY EXIT ////////////////////////
				}

				isContinue = ctrl.performIfPresent('before_page_load_'+viewName, data, pageEvtData);
				if(isContinue === false){
					return;/////////////////////// EARLY EXIT ////////////////////////
				}

				//pass controller- and view-instance to "after page change" handler
				var changeOptions = {};
				changeOptions[FIELD_NAME_RESOLVE] = renderResolve;
				changeOptions[FIELD_NAME_VIEW] = view;
				changeOptions[FIELD_NAME_DATA] = data;
				changeOptions[FIELD_NAME_CONTROLLER] = ctrl;


				//change visible page from old to new one (using simple jQuery replace function)

				var pageContainer = oldContent;
				if(pageContainer && pageContainer.parentElement){
					pageContainer.parentElement.innerHTML = newPage;
				} else {
					log.error('PresentationManager[simpleViewEngine].doRenderView: could not find parent for pageContainer, inserting new one into document.body!');
					var pageContainerWrapper = document.createElement('div');
					pageContainerWrapper.id = 'pageContainer';
					pageContainerWrapper.innerHTML = newPage;
					document.body.appendChild(pageContainerWrapper);
				}
				newPage = document.getElementById(newId);
				doRemoveElementsAfterViewLoad.call(newPage,{},changeOptions);
			};

			if(layout !== lastLayout){
				//if lastLayout is not null: unload its SCRIPTs, LINKs, and STYLEs?
				if(lastLayout){
					doRemoveLayoutResources(lastLayout);
				}
				lastLayout = layout;
				doPrepareLayout(layout).then(renderFunc);
			} else {
				renderFunc();
			}

			return renderResolve;
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

            	//TODO implement this!

//                if (jq.modal != null) {
//                	//TODO implement this!
//                }
//                else {
//                	console.warn('PresentationManager[simpleViewEngine].hideCurrentDialog: could not find SimpleModal plugin: jQuery.modal is '+(typeof jq.modal));
//                }
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

					//TODO implement something!?!

				} else {
					console.error("PresentationManager[simpleViewEngine].showDialog: Could not find Controller for '" + ctrlName + "'");
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
			 * @depends stdlne-wait-dlg (Standalone Wait Dialog)
			 * @depends mmir.LanguageManager
			 *
			 * @see #hideWaitDialog
			 */
			showWaitDialog : function(text, theme) {

				var loadingText = typeof text === 'undefined'? languageManager.getText('loadingText') : text;

				if(typeof theme !== 'undefined'){
					dlg.defaultStyle = theme;
					//TODO
				}

				dlg.show(loadingText, _viewEngineWaitId);
			},

			/**
			 * Hides / closes the "wait" dialog.
			 *
			 * @function hideWaitDialog
			 * @public
			 *
			 * @depends stdlne-wait-dlg (Standalone Wait Dialog)
			 *
			 * @see #showWaitDialog
			 */
			hideWaitDialog : function() {
				dlg.hide(_viewEngineWaitId);
			},

			/////////////////////////////////// Additional non-standard functions & properties /////////////
			styleTagId: SVE_CSS_ID,
			styleTagHref: SVE_CSS_HREF,
			isStylePresent: function(){
				if(!SVE_CSS_HREF){
					//if no css URL was configured: always return state as if stylesheet was already loaded
					return true;
				}
				return document.getElementById(this.styleTagId);
			},
			loadStyle: function(){
				if(!this.isStylePresent()){
					loadCss({href: this.styleTagHref, id: this.styleTagId});
				}
			}
		});
	});

	return promise;
});
