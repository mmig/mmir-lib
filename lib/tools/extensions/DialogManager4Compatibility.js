
define(['mmirf/util/extend','mmirf/controllerManager','mmirf/presentationManager'
],
	/**
	 * Backwards compatibility for DialogManager (<= version 4.x):
	 *
	 * (re-)adds the following methods/functionality to the DialogManager instance:
	 *  * perform(ctrlName, actionName, data)
	 *  * performHelper(ctrlName, helperActionName, data)
	 *  * showDialog(ctrlName, dialogId, data)
	 *  * hideCurrentDialog()
	 *  * showWaitDialog(text, theme)
	 *  * hideWaitDialog()
	 *  * render(ctrlName, viewName, data)
	 *  * getOnPageRenderedHandler()
	 *  * setOnPageRenderedHandler(handlerFunction)
	 *
	 *  * _setControllerManager(controllerManager)
	 *  * _setPresentationManager(presentationManager)
	 *
	 * @example
	 * //extend DialogManager with helper/shortcut functions (e.g for <= v4.x backwards compatibility):
	 * var dialogManager = require('mmirf/dialogManager');
	 * //or: var dialogManager = mmir.dialog;
	 * require('mmirf/dialogManager4Compatibility')(dialogManager);
	 * dialogManager.render('Application', 'welcome').then(function(){ console.log('rendered welcome view') })
	 *
	 * @name mmir.compat.v4.DialogManager
	 * @static
	 * @class
	 * @hideconstructor
	 *
	 * @requires mmir.ControllerManager
	 * @requires mmir.PresentationManager
	 *
	 */
	function(extend, controllerManager, presentationManager
) {

	var _extend = function(dialogManager){

		//the next comment enables JSDoc2 to map all functions etc. to the correct class description
		/** @scope mmir.compat.v4.DialogManager.prototype */

		/**
		 * @private
		 * @type Function
		 *
		 * @see {@link mmir.compat.v4.DialogManager#getOnPageRenderedHandler}
		 * @see {@link mmir.compat.v4.DialogManager#setOnPageRenderedHandler}
		 *
		 * @memberOf mmir.compat.v4.DialogManager.prototype
		 */
		var onPageRenderedFunc;

		var ctrlManager = controllerManager;
		var presentManager = presentationManager;


		extend(dialogManager,
			/**
			 * @memberOf mmir.compat.v4.DialogManager#
			 */
			{

			/** @scope mmir.compat.v4.DialogManager.prototype */


			/**
			 * This function performs an action of a controller by calling
			 * the method {@link mmir.ControllerManager#perform} of the
			 * {@link mmir.ControllerManager}
			 *
			 * @function
			 * @param {String}
			 *            ctrlName Name of the controller to which the
			 *            action belongs
			 * @param {String}
			 *            actionName Name of the action that should be
			 *            performed
			 * @param {Object}
			 *            data optional data that can be submitted to the
			 *            action
			 * @returns {Object} the return object of the performed action
			 * @public
			 * @memberOf mmir.compat.v4.DialogManager.prototype
			 */
			perform: function(ctrlName, actionName, data) {

				// if(logger.isDebug()) logger.debug("going to perform ('" + ctrlName + "','" + actionName + "')");//debug

				return ctrlManager.perform(ctrlName, actionName, data);
			},

			/**
			 * This function performs an action of a helper-class for a
			 * controller by calling the method
			 * {@link mmir.ControllerManager#performHelper} of the
			 * {@link mmir.ControllerManager}
			 *
			 * @function
			 * @param {String}
			 *            ctrlName Name of the controller to which the
			 *            helper action belongs
			 * @param {String}
			 *            helper_method_name Name of the action that should
			 *            be performed by the helper
			 * @param {Object}
			 *            data optional data that can be submitted to the
			 *            action
			 * @returns {Object} the return object of the performed action
			 * @public
			 * @memberOf mmir.compat.v4.DialogManager.prototype
			 */
			performHelper : function(ctrlName, helper_method_name, data) {

				if (arguments.length > 3) {

					return ctrlManager.performHelper(
							ctrlName, helper_method_name, data, arguments[3]
					);
				}
				else {

					return ctrlManager.performHelper(
							ctrlName, helper_method_name, data
					);
				}
			},

			/**
			 * This function displays a dialog of a controller by calling
			 * the method {@link mmir.PresentationManager#showDialog} of the
			 * {@link mmir.PresentationManager}
			 *
			 * @function
			 * @param {String}
			 *            ctrlName Name of the controller to which the
			 *            dialog belongs
			 * @param {String}
			 *            dialogId Id of the dialog that should be displayed
			 * @param {Object}
			 *            data Optional data that can be submitted to the
			 *            dialog
			 * @public
			 * @memberOf mmir.compat.v4.DialogManager.prototype
			 */
			showDialog : function(ctrlName, dialogId, data) {
				presentManager.showDialog.apply(presentManager, arguments);
			},

			/**
			 * This function closes a dialog of a controller by calling the
			 * method {@link mmir.PresentationManager#hideCurrentDialog} of
			 * the {@link mmir.PresentationManager}
			 *
			 * @function
			 * @public
			 * @memberOf mmir.compat.v4.DialogManager.prototype
			 */
			hideCurrentDialog : function() {
				presentManager.hideCurrentDialog.apply(presentManager, arguments);
			},
			/**
			 * Shows a "wait" dialog, indicating work-in-progress.
			 *
			 * This is a shortcut for calling
			 * {@link mmir.PresentationManager#showWaitDialog}
			 * (see documentation in <code>PresentationManager</code>
			 *  for parameters).
			 *
			 * @function
			 *
			 * @public
			 *
			 * @see mmir.PresentationManager#showWaitDialog
			 * @see mmir.PresentationManager#hideWaitDialog
			 *
			 * @memberOf mmir.compat.v4.DialogManager.prototype
			 */
			showWaitDialog : function(text, theme) {
				presentManager.showWaitDialog.apply(presentManager, arguments);
			},

			/**
			 * Hides / closes the "wait" dialog.
			 *
			 *
			 * This is a shortcut for calling
			 * {@link mmir.PresentationManager#hideWaitDialog}
			 * (see documentation in <code>PresentationManager</code>
			 *  for parameters).
			 *
			 * @function
			 * @public
			 *
			 * @see mmir.PresentationManager#hideWaitDialog
			 * @see mmir.PresentationManager#showWaitDialog
			 *
			 * @memberOf mmir.compat.v4.DialogManager.prototype
			 */
			hideWaitDialog : function() {
				presentManager.hideWaitDialog.apply(presentManager, arguments);
			},

			/**
			 * This function displays a view of a controller by calling the
			 * method {@link mmir.PresentationManager#renderView} of the
			 * {@link mmir.PresentationManager}.
			 * <br>
			 * And after rendering, the function set via #setOnPageRenderedHandler will
			 * called in context of the controller instance with arguments:
			 * <code>Controller.onPageRenderedFunc(ctrlName, viewName, data)</code>
			 *
			 *
			 * @function
			 * @param {String}
			 *            ctrlName Name of the controller to which the view
			 *            belongs
			 * @param {String}
			 *            viewName Name of the view that should be rendered
			 * @param {Object}
			 *            data Optional data that can be submitted to the
			 *            generation of the view
			 * @returns {void|Promise}
			 * 			if void/undefined is returned, the view is rendered synchronously, i.e.
			 * 			the view is rendered, when this method returns.
			 * 			If a Promise is returned, the view is rendered asynchronously
			 * 			(rendering is finished, when the promise is resolved)
			 *
			 * @public
			 * @memberOf mmir.compat.v4.DialogManager.prototype
			 */
			render : function(ctrlName, viewName, data) {

				var defer = presentManager.render(ctrlName, viewName, data);

				if (typeof onPageRenderedFunc === 'function') {
					var ctrl = ctrlManager.get(ctrlName);
					if(defer){
						defer.then(function(){
							onPageRenderedFunc.call(ctrl, ctrlName, viewName, data);
						});
					} else {
						onPageRenderedFunc.call(ctrl, ctrlName, viewName, data);
					}
				}

				return defer;
			},
			/**
			 * Get the current on-page-rendered hook function (if it was
			 * set).
			 *
			 * @function
			 * @param {Function}
			 *            the onPageRendered handler (NOTE: this may not be
			 *            set, i.e. <tt>undefined</tt>)
			 *
			 * @memberOf mmir.compat.v4.DialogManager.prototype
			 */
			getOnPageRenderedHandler : function() {
				return onPageRenderedFunc;
			},
			/**
			 * Set the on_page_loaded callback function.
			 *
			 * If <code>onPageRenderedHook</code> is a function object, it
			 * will be executed after a view is rendered and after the
			 * view's controller on_page_load function(s) has/have been
			 * executed.
			 *
			 * <p>
			 * This function will be executed after the view's
			 * on_page_load()-function.<br>
			 * The <code>onPageRenderedHook</code> function takes 3
			 * arguments that refer to the parameters with which the
			 * render-function was invoked: <br>
			 * <code>{String} ctrlName </code> Name of the controller to
			 * which the view belongs <br>
			 * <code>{String} viewName</code> Name of the view that should
			 * be rendered <br>
			 * <code>{Object} [data]</code> <em>Optional</em> data that
			 * can be submitted to the generation of the view
			 *
			 * @function
			 * @param {Function}
			 *            onPageRenderedHook a callback function that will
			 *            be executed after a view was rendered i.e. after a
			 *            page was loaded.
			 *
			 * @memberOf mmir.compat.v4.DialogManager.prototype
			 */
			setOnPageRenderedHandler : function(onPageRenderedHook) {
				onPageRenderedFunc = onPageRenderedHook;
			},
			/** @memberOf mmir.compat.v4.DialogManager.prototype */
			_setControllerManager: function(ctrlManager){
				ctrlManager = ctrlManager;
			},
			/** @memberOf mmir.compat.v4.DialogManager.prototype */
			_setPresentationManager: function(presentManager){
				presentManager = presentManager;
			}

		});//END: extend(dialogManager, {...


		return dialogManager;
	};

	return _extend;

});//END: define(...
