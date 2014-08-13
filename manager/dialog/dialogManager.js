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

define([  'core', 'jquery'
        , 'commonUtils', 'module', 'engineConfig', 'controllerManager', 'presentationManager'
        , 'modelManager' 
	], 
	/**
	 * The DialogManager gives access to the most commonly used functions of
	 * the framework.
	 * 
	 * <p>
	 * On initialization, the DialogManager also creates the {@link mmir.DialogEngine}
	 * and returns it as the second argument of the {@link #init}() function's callback
	 * (or the Promise's triggered callbacks).
	 * 
	 * In addition, the DialogEngine is exported as module <code>"dialogEngine"</code> via
	 * RequireJS' <code>define()</code> function.
	 * 
	 * @example
	 * //initialization of inputManager
	 * require('dialogManager').init().then( function(dialogManagerInstance, dialogEngineInstance){
	 * 		//do something
	 * });
	 * 
	 * @name mmir.DialogManager
	 * @static
	 * @class
	 * 
	 * @depends mmir.ControllerManager
	 * @depends mmir.PresentationManager
	 * @depends mmir.ModelManager
	 */
	function(
			mmir, $, 
			commonUtils, module, engineConfig, controllerManager, presentationManager
) {

	//next 2 comments are needed by JSDoc so that all functions etc. can
	// be mapped to the correct class description
	/** @scope mmir.DialogManager.prototype */
	/**
	 * #@+
	 * @memberOf mmir.DialogManager.prototype 
	 */
		
	var _instance = {

		/** @scope mmir.DialogManager.prototype */
		
		/** 
		 * @deprecated instead: use mmir.DialogManager object directly.
		 */
		getInstance : function() {
			return this;
		},
		
		/**
		 * This function raises an event. 
		 * 
		 * @function raise
		 * @param {String} eventName
		 * 				The name of the event which is to be raised
		 * @param {Object} [eventData] OPTIONAL
		 * 				Data belonging to the event
		 * @throws {Error} if this function is invoked while the internal
		 * 				   event/state engine (i.e. {@link mmir.DialogEngine}
		 * 				   is not initialized yet
		 * @public
		 */
		raise : function(eventName, eventData) {
			//NOTE the functional implementation will be set during initialization (see below #init())
			throw new Error('DialogEngine not initialized yet: '
					+'call mmir.DialogManager.init(callback) and wait for the callback.'
			);
		},

		/**
		 * This function performs an action of a controller by calling
		 * the method {@link mmir.ControllerManager#perform} of the
		 * {@link mmir.ControllerManager}
		 * 
		 * @function perform
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
		 */
		perform : function(ctrlName, actionName, data) {
			
			//@russa what is this for?
//			var _data = {};
//			_data.timestamp = new Date().getTime();
//			_data.ctrl = ctrlName;
//			_data.name = actionName;
//			_data.args = data;
			
			// if(IS_DEBUG_ENABLED) console.debug("going to perform ('" + ctrlName + "','" + actionName + "')");//debug

			return controllerManager.perform(ctrlName, actionName, data);
		},

		/**
		 * This function performs an action of a helper-class for a
		 * controller by calling the method
		 * {@link mmir.ControllerManager#performHelper} of the
		 * {@link mmir.ControllerManager}
		 * 
		 * @function performHelper
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
		 */
		performHelper : function(ctrlName, helper_method_name, data) {
			
			if (arguments.length > 3) {
				
				return controllerManager.performHelper(
						ctrlName, helper_method_name, data, arguments[3]
				);
			}
			else {
				
				return controllerManager.performHelper(
						ctrlName, helper_method_name, data
				);
			}
		},

		/**
		 * This function displays a dialog of a controller by calling
		 * the method {@link mmir.PresentationManager#showDialog} of the
		 * {@link mmir.PresentationManager}
		 * 
		 * @function showDialog
		 * @param {String}
		 *            ctrlName Name of the controller to which the
		 *            dialog belongs
		 * @param {String}
		 *            dialogId Id of the dialog that should be displayed
		 * @param {Object}
		 *            data Optional data that can be submitted to the
		 *            dialog
		 * @public
		 */
		showDialog : function(ctrlName, dialogId, data) {

//			var eventData;
//			if (data) {
//				if (!data.evtdata) {
//					eventData = { evtdata: data };
//				}
//				else {
//					eventData = data;
//				}
//			}
//			writeLogEntry('showDialog_'+ctrlName+'_'+dialogId, eventData); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)

			presentationManager.showDialog(ctrlName, dialogId, data);
		},

		/**
		 * This function closes a dialog of a controller by calling the
		 * method {@link mmir.PresentationManager#hideCurrentDialog} of
		 * the {@link mmir.PresentationManager}
		 * 
		 * @function hideCurrentDialog
		 * @public
		 */
		hideCurrentDialog : function() {

//			writeLogEntry('hideCurrentDialog'); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)

			presentationManager.hideCurrentDialog();
		},
		/**
		 * Shows a "wait" dialog, indicating work-in-progress.
		 * 
		 * This is a shortcut for calling
		 * {@link mmir.PresentationManager#showWaitDialog}
		 * (see documentation in <code>PresentationManager</code>
		 *  for parameters).
		 * NOTE: the context for the function-call (i.e. <code>this</code>)
		 *       is the DialogManager instead of the PresentationManager,
		 *       when called from here! 
		 * 
		 * 
		 * 
		 * 
		 * @function showWaitDialog
		 * 
		 * @public
		 * 
		 * @see mmir.PresentationManager#showWaitDialog
		 * @see mmir.PresentationManager#hideWaitDialog
		 */
		showWaitDialog : function(text, theme) {

//			if ($('.ui-loading').length == 0) {
//				//only write log-entry, if waiting-dialog is newly opened with this call
////				console.debug('[DEBUG] show loading');//FIXM debug
////				writeLogEntry('showWaitingDialog'); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)
//			}
			
			//TODO should this function be called really in context of the DialogManager? 
			//     (but otherwise we cannot use .apply(), thus not forward the arguments generically...)
			
			presentationManager.showWaitDialog.apply(this, arguments);
		},

		/**
		 * Hides / closes the "wait" dialog.
		 * 
		 * 
		 * This is a shortcut for calling
		 * {@link mmir.PresentationManager#hideWaitDialog}
		 * (see documentation in <code>PresentationManager</code>
		 *  for parameters).
		 * NOTE: the context for the function-call (i.e. <code>this</code>)
		 *       is the DialogManager instead of the PresentationManager,
		 *       when called from here!
		 *  
		 *  
		 * @function hideWaitDialog
		 * @public
		 * 
		 * @see mmir.PresentationManager#hideWaitDialog
		 * @see mmir.PresentationManager#showWaitDialog
		 */
		hideWaitDialog : function() {

//			if ($('.ui-loading').length > 0) {
//				//only write log-entry, if waiting-dialog is currently open
////				writeLogEntry('closeWaitingDialog'); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)
//			}
			
			//TODO should this function be called really in context of the DialogManager? 
			//     (but otherwise we cannot use .apply(), thus not forward the arguments generically...)
			presentationManager.hideWaitDialog.apply(this, arguments);

		},

		/**
		 * This function displays a view of a controller by calling the
		 * method {@link mmir.PresentationManager#renderView} of the
		 * {@link mmir.PresentationManager}.<br>
		 * And after rendering binds event listeners to all buttons of
		 * the view.
		 * 
		 * @function render
		 * @param {String}
		 *            ctrlName Name of the controller to which the view
		 *            belongs
		 * @param {String}
		 *            viewName Name of the view that should be rendered
		 * @param {Object}
		 *            data Optional data that can be submitted to the
		 *            generation of the view
		 * @public
		 */
		render : function(ctrlName, viewName, data) {
			
			//@russa: what is this for
//			var _data = {};
//			_data.timestamp = new Date().getTime();
//			_data.ctrl = ctrlName;
//			_data.name = viewName;
//			_data.args = data;
			
			presentationManager.renderView(ctrlName, viewName, data);

			if (typeof onPageRenderedFunc === 'function') {
				
				onPageRenderedFunc(ctrlName, viewName, data);
			}
		},
		/**
		 * Get the current on-page-rendered hook function (if it was
		 * set).
		 * 
		 * @function getOnPageRenderedHandler
		 * @param {Function}
		 *            the onPageRendered handler (NOTE: this may not be
		 *            set, i.e. <tt>undefined</tt>)
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
		 * @function setOnPageRenderedHandler
		 * @param {Function}
		 *            onPageRenderedHook a callback function that will
		 *            be executed after a view was rendered i.e. after a
		 *            page was loaded.
		 */
		setOnPageRenderedHandler : function(onPageRenderedHook) {
			onPageRenderedFunc = onPageRenderedHook;
		}
		
	};//END: _instance = {...

	return $.extend(true, _instance, {

		init : function() {
			
			delete this.init;
			
			//"read" settings from requirejs' config (see mainConfig.js):
			var url = module.config().scxmlDoc;
			var mode = module.config().mode;
			
			//create a SCION engine:
			var engine = engineConfig(url, mode);

//			var _self = this;

			return $.Deferred(function(theDeferredObj) {
				
				engine.load().done(function(_engine) {
					
					_instance.raise = function raise(){
						_engine.raise.apply(_engine, arguments);
					};
					
//					mmir.DialogEngine = _engine;
//					mmir.DialogEngine.gen('init', _self);
					delete _engine.gen;
					
					//register the DialogeEngine with requirejs as module "dialogEngine":
					define("dialogEngine", function(){
						return _engine;
					});
					//immediately load the module-definition:
					require(['dialogEngine'], function(){
						//signal end of initialization process:
						theDeferredObj.resolve(_instance, _engine);	
					});
				});
				
			}).promise();
			
		}//END: init()

	});//END $.extend(...
	
	/** #@- */

});//END: define(...
