
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
 * @name jqmSimpleViewEngine
 * @static
 *
 *  @depends document (DOM object)
 *  @depends HTMLElement.parentElement
 *  @depends HTMLElement.removeChild
 *
 */
define(['mmirf/logger', 'mmirf/util/deferred', 'module', 'require'],function(Logger, Deferred, module, require){

	var log = Logger.create(module);

	var promise = new Deferred();

	//property names for passing the respected objects from doRenderView() to doRemoveElementsAfterViewLoad()
	var FIELD_NAME_RESOLVE 		 = '__renderResolve';
	var FIELD_NAME_VIEW 		 = '__view';
	var FIELD_NAME_DATA 		 = '__renderData';
	var FIELD_NAME_CONTROLLER 	 = '__ctrl';

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
			log.e('PresentationManager[simpleViewEngine].__doRemoveElementsAfterViewLoad: missing controller (and view)!',data.options);
			return;
		}

		log.d('on_page_load::'+viewName, renderData);

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

		log.d('before_page_prepare::'+viewName, data);

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

			//provide "change" data for before_page_load calls:
			var pageEvtData = {
				name: viewName
			};

			log.d('before_page_load::'+viewName, pageEvtData);

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

			doRemoveElementsAfterViewLoad.call(null,{},changeOptions);
		};

		renderFunc();
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
						//stub: do nothing
						log.i('hideCurrentDialog');
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
						//stub: do nothing
						log.i('showDialog');
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
			//stub: do nothing
			log.i('showWaitDialog');
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
			//stub: do nothing
			log.i('hideWaitDialog');
		},
	});

	return promise;
});
