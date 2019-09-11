define([
	'mmirf/layout', 'mmirf/view', 'mmirf/partial'
	, 'mmirf/util/deferredWithState', 'mmirf/util/loadFile', 'mmirf/util/forEach'
	, 'mmirf/configurationManager', 'mmirf/checksumUtils', 'mmirf/controllerManager', 'mmirf/resources', 'mmirf/core', 'mmirf/commonUtils'
	, 'mmirf/logger', 'module'
	, 'mmirf/parserModule'//<- loaded, but not directly used
	//,'mmirf/renderUtils' DISABLED: loaded on-demand (see loadViews())
],
/**
 * @class
 * @name ViewLoader
 * @memberOf mmir.env.view
 */
function(
	Layout, View, Partial,
	deferred, loadFile, forEach,
	configurationManager, checksumUtils, controllerManager, resources, core, commonUtils,
	Logger, module
	//renderUtils
){

	/**
	 * Loads views (layouts and partials):
	 * either compiled views (i.e. JS files), or raw views (i.e. eHTML files).
	 *
	 * The loader checks, if compiled views are up-to-date (using the corresponding
	 * checksum file).
	 * If a compiled view is not up-to-date (or its checksum file is missing), then
	 * the raw view will be loaded and compiled.
	 *
	 * If raw views are loaded, the parsing-module will loaded for compiling the
	 * views (i.e. if only compiled views are loaded, the dependency for the template
	 * parser and renderer is not required).
	 *
	 *
	 * <br>
	 * <strong>Configuration (configuration.json)</strong>
	 * <br>
	 *
	 * The configuration value <code>"usePrecompiledViews"</code> (Boolean) allows
	 * the determine, if views should always be compiled from the eHTML files (even
	 * if up-to-date compiled views are present).
	 *
	 * For example, configuration <code>"usePrecompiledViews": true</code> will use
	 * compiled views, while <code>"usePrecompiledViews": false</code> will always
	 * compile the eHTML files.
	 *
	 *
	 * If the configuration value for {@link mmir.PresentationManager.CONFIG_DEFAULT_LAYOUT_NAME} is
	 * set to <code>NULL</code> no default layout will be loaded.
	 *
	 * If {@link mmir.PresentationManager.CONFIG_DEFAULT_LAYOUT_NAME} is a non-empty string, then
	 * the corresponding layout will be used as default layout, instead of
	 * {@link mmir.PresentationManager.DEFAULT_LAYOUT_NAME}.
	 *
	 *
	 * @param  {PresentationManager} _instance
	 *          the instance of the PresentationManager
	 * @param  {Map<string, Layout>} _layouts
	 *          the layout collection of the PresentationManager for adding loaded layouts
	 * @param  {Map<string, View>} _views
	 *          the view collection of the PresentationManager for adding loaded views
	 * @param  {Map<string, Partial>} _partials
	 *          the partials collection of the PresentationManager for adding loaded partials
	 * @param  {Function} createViewKey
	 *          the PresentationManager's helper function for creating keys to be used when
	 *          adding views to <code>_views</code>:<br>
	 *          <code>createViewKey(ctrl: {mmir.ctrl.Controller|String}, view: {mmir.view.View|String}) : {String}</code>
	 * @param  {Function} createPartialKey
	 *          the PresentationManager's helper function for creating keys to be used when
	 *          adding partials to <code>_partials</code>:<br>
	 *          <code>createPartialKey(partial: {mmir.view.Partial|String}, view: {mmir.view.View|String}) : {String}</code>
	 * @return {Promise}
	 *          a deferred promise that gets resolved when the views (layouts, and partials) are loaded
	 *
	 * @memberOf mmir.env.view.ViewLoader
	 */
	function loadViews (
			_instance, _layouts, _views, _partials, createViewKey, createPartialKey
	) {

		/**
		 * The name of the configuration field that holds
		 * the name for the default layout.
		 *
		 * @private
		 * @type String
		 * @constant
		 * @memberOf mmir.env.view.ViewLoader#
		 */
		var CONFIG_DEFAULT_LAYOUT_NAME = _instance.CONFIG_DEFAULT_LAYOUT_NAME;

		/**
		 * Name for the default layout, that will be loaded.
		 *
		 * If NULL, no default layout will be loaded
		 * (see below configurationManager.get(CONFIG_DEFAULT_LAYOUT_NAME...))
		 *
		 * @private
		 * @type String
		 * @memberOf mmir.env.view.ViewLoader#
		 */
		var defaultLayoutName = _instance.DEFAULT_LAYOUT_NAME;


		/**
		 * The logger for the PresentationManager.
		 *
		 * @private
		 * @type mmir.tools.Logger
		 * @memberOf mmir.env.view.ViewLoader#
		 */
		var logger = Logger.create(module);//initialize with requirejs-module information

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
		 * @memberOf mmir.env.view.ViewLoader#
		 *
		 * @example var isUsePrecompiledViews = mmir.conf.getBoolean("usePrecompiledViews");
		 *
		 */
		var CONFIG_PRECOMPILED_VIEWS_MODE = 'usePrecompiledViews';//TODO move this to somewhere else (collected config-vars?)? this should be a public CONSTANT...


		// determine if default-layout has a custom name (or is disabled, in it was set to null)
		var defLayoutName = configurationManager.get(CONFIG_DEFAULT_LAYOUT_NAME, void(0));
		if(typeof defLayoutName !== 'undefined'){
			defaultLayoutName = defLayoutName;
		}

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
		 * @memberOf mmir.env.view.ViewLoader#
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
			core.require(['mmirf/renderUtils'], function(){

				if(rawViewData && !isUpToDate(rawViewData, targetpath)){
					if(fail) fail('Precompiled view file is outdated!');
					else logger.warn('Outdated pre-compiled view at: '+targetpath);

					//-> do not load the pre-compiled view, instead let fail-callback handle re-parsing for the view
					return;/////////////////////// EARLY EXIT /////////////////////
				}

				commonUtils.loadScript( //scriptUrl, success, fail)
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
		 * @memberOf mmir.env.view.ViewLoader#
		 */
		var isUsePreCompiledViews = configurationManager.getBoolean(CONFIG_PRECOMPILED_VIEWS_MODE, false);

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
		 * @memberOf mmir.env.view.ViewLoader#
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

			loadFile({
				async: false,//<-- use "SYNC" modus here (NOTE: we win nothing with async here, because the following step (loading/not loading the pre-compiled view) strictly depends on the result of this)
				dataType: "text",
				url: viewVerificationInfoPath,
				success: function onSuccess(data){

					//compare raw String to checksum-data from file
					isCompiledViewUpToDate = checksumUtils.isSame(viewContent, data);

				},
				error: function onError(_jqxhr, status, err){

					// print out an error message
					var errMsg = err && err.stack? err.stack : err;
					logger.error("[" + status + "] On checking up-to-date, could not load '" + viewVerificationInfoPath + "': "+errMsg); //failure
				}
			});

			return isCompiledViewUpToDate;
		}

		/**
		 * This function loads the layouts for every controller and puts the
		 * name of the layouts into the <b>_layouts</b> array.
		 *
		 * @function
		 * @private
		 * @memberOf mmir.env.view.ViewLoader#
		 *
		 * @returns {Promise} a deferred promise that gets resolved upon loading all layouts; fails/is rejected, if not at least 1 layout was loaded
		 */
		function loadLayouts(){
			// Load application's layouts.

			/**
			 * @type Promise
			 * @private
			 * @memberOf mmir.env.view.ViewLoader#loadLayouts
			 */
			var defer = deferred();

			/**
			 * @type String
			 * @private
			 * @memberOf mmir.env.view.ViewLoader#loadLayouts
			 */
			var ctrlNameList = controllerManager.getNames();

			/**
			 * HELPER object for tracking the loading-status of the layouts
			 *
			 * @private
			 * @memberOf mmir.env.view.ViewLoader#loadLayouts
			 */
			var loadStatus = {
					loader: defer,
					remainingCtrlCount: ctrlNameList.length + 1,//+1: for the default layout
					currentLoadCount: 0,

					//additional property for keeping track on how many layouts were load overall
					// NOTE: this additional counter is necessary, since currentLoadCount
					//       keeps only track of how many controller's were checked. But since
					//       a controller may not have a layout-definition of its own, we have
					//       to use another counter to keep track of the actually loaded layouts.
					loadedLayoutsCount: 0,

					//need a custom function for checking the load status: if no layout was loaded,
					//                                                     the Derred will be rejected
					onCompletionImpl: function(status){

						//if there is a default-layout specified, but no layout was loaded -> fail
						if(status.loadedLayoutsCount < 1 && defaultLayoutName){

							//there must be at least on layout-file for the default-controller:
							status.loader.reject( 'Could not load any layout! At least one layout must be present at '
									+ resources.getLayoutPath()
									+ defaultLayoutName[0].toLowerCase() + defaultLayoutName.substring(1)
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
			 * @memberOf mmir.env.view.ViewLoader#loadLayouts
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
			 * @memberOf mmir.env.view.ViewLoader#loadLayouts
			 */
			var doLoadLayout = function(ctrlName, _index, theDefaultLayoutName){

				var layoutInfo;
				if(typeof theDefaultLayoutName === 'string'){

					ctrlName = theDefaultLayoutName;

					//create info-object for default-layout
					var layoutFileName = theDefaultLayoutName[0].toLowerCase()
											+ theDefaultLayoutName.substring(1, theDefaultLayoutName.length);
					layoutInfo = {
						name: theDefaultLayoutName,
						fileName: layoutFileName,
						genPath: resources.getCompiledLayoutPath()//TODO add compiled-path to view-info object (and read it from file-structure/JSON)
									+ layoutFileName + '.js',
						path: resources.getLayoutPath() + layoutFileName + '.ehtml'
					};

				}
				else {
					var ctrl = controllerManager.get( ctrlName );
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
			if(defaultLayoutName){
				doLoadLayout(null, null, defaultLayoutName);
			} else {
				logger.info('The name for the default Layout was set to "'+defaultLayoutName+'", no default Layout will be loaded!');
				--loadStatus.remainingCtrlCount;
				checkCompletion(loadStatus);
			}

			//load layouts for controllers (there may be none defined)
			forEach(ctrlNameList, doLoadLayout);

			checkCompletion(loadStatus);
			return defer;

		}//END: loadLayouts()

		/**
		 * This function actually loads the views for every controller, creates
		 * an instance of a view class and puts the view instance in the
		 * <b>_views</b> array.<br>
		 *
		 * @function
		 * @private
		 * @async
		 * @memberOf mmir.env.view.ViewLoader#
		 *
		 * @returns {Promise} a deferred promise that gets resolved upon loading all views
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
		 * @memberOf mmir.env.view.ViewLoader#
		 *
		 * @returns {Promise} a deferred promise, that resolves after all partials have been loaded
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
		 * @memberOf mmir.env.view.ViewLoader#
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
		 * @memberOf mmir.env.view.ViewLoader#
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
		 *         If necessary, the parser-classes (module 'mmirf/parseUtils') are loaded,
		 *         which are necessary to process the raw template content.
		 *
		 * @private
		 * @function
		 * @memberOf mmir.env.view.ViewLoader#
		 *
		 * @param {mmir.ctrl.Controller} controller
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
		 * 		<code>createConfig.collection</code>: the Map to which the created
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
			core.require(['mmirf/parseUtils', 'mmirf/renderUtils'], function(){

				var templateObj;
				if(controller){
					//"normal" view constructor: (Controller, nameAsString, templateAsString)
					templateObj = new config.constructor(controller, templateName , templateContent);
					config.collection.set( config.keyGen(controller.getName(), templateName), templateObj );
				}
				else {
					//in case of Layout: omit controller argument
					// -> layout constructor: (nameAsString, templateAsString)
					// -> there is a 1:1 correspondence betwenn controller and layout,
					//    and Layout.name === Controller.name
					//    => no need to create a lookup-key
					templateObj = new config.constructor(templateName , templateContent);
					config.collection.set( templateObj.getName(), templateObj );
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
		 * @memberOf mmir.env.view.ViewLoader#
		 *
		 * @see #doLoadTemplateFile
		 *
		 * @param {PlainObject} createConfig
		 * 			configuration object that determines which templates are loaded, and how
		 * 			the loaded data is processed.
		 *
		 *
		 * @returns {Promise} a deferred promise, that resolves after all partials have been loaded
		 * 					NOTE: loading failures will generate a warning message (on the console)
		 * 						  but will not cause the Promise to fail.
		 */
		var doProcessTemplateList = function(createConfig){

			/**
			 * @type Promise
			 * @private
			 * @memberOf mmir.env.view.ViewLoader#doProcessTemplateList
			 */
			var defer = deferred();

			/**
			 * @type String
			 * @private
			 * @memberOf mmir.env.view.ViewLoader#doProcessTemplateList
			 */
			var ctrlNameList = controllerManager.getNames();

			/**
			 * HELPER object for tracking the loading-status of the views
			 *
			 * @private
			 * @memberOf mmir.env.view.ViewLoader#doProcessTemplateList
			 */
			var loadStatus = {
					loader: defer,
					remainingCtrlCount: ctrlNameList.length,
					currentLoadCount: 0
			};

			forEach(ctrlNameList, function(controllerName){

				var controller = controllerManager.get(controllerName);

				forEach(controller[createConfig.accessorName](), function(templateInfo){

					doLoadTemplateFile(controller, templateInfo, createConfig, loadStatus);

				});//END: each(templateInfo)

				-- loadStatus.remainingCtrlCount;
				checkCompletion(loadStatus);

			});//END: each(ctrlName)

			checkCompletion(loadStatus);
			return defer;

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
		 * @param {mmir.ctrl.Controller} controller
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
		 * 		(Map; with controller's name as key).
		 *
		 * @param {PlainObject} loadStatus
		 * 		Object for managing the loading-status. The status is updated and used to
		 * 		determine, if all templates (e.g. from a list) have been (asynchronously)
		 * 		loaded.
		 *
		 * @function
		 * @private
		 * @async
		 * @memberOf mmir.env.view.ViewLoader#
		 */
		var doLoadTemplateFile = function(controller, templateInfo, createConfig, loadStatus){
			++loadStatus.currentLoadCount;

			if(!templateInfo.path){
				logger.warn('cannot check if pre-compiled view is updated: no template file available for '+templateInfo.name);
				loadPrecompiledView(null, templateInfo.genPath, function(){

					updateLoadStatus(loadStatus);

				}, function(err){

					logger.error('Could not load precompiled '+createConfig.typeName+' from '
							+templateInfo.genPath+'", because: '+err
					);
					updateLoadStatus(loadStatus);

				});
				return;///////////// EARLY EXIT //////////////////
			}

			loadFile({
				async: true,
				dataType: "text",
				url: templateInfo.path,
				success: function onSuccess(data){

					if(isUsePreCompiledViews){

						loadPrecompiledView(data, templateInfo.genPath, function(){

							updateLoadStatus(loadStatus);

						}, function(err){

							logger.warn('Could not load precompiled '+createConfig.typeName+' from '
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

				},
				error: function onError(_jqxhr, status, err){

					// print out an error message
					var errMsg = err && err.stack? err.stack : err;
					logger.error("[" + status + "] Could not load eHTML file '" + templateInfo.path + "': "+errMsg); //failure

					updateLoadStatus(loadStatus, true);
				}
			});

			checkCompletion(loadStatus);

		};//END: doLoadTemplateFile()


		///////////// start intialization: ////////////////

		/**
		 * Deferred / promise for loading views.
		 *
		 * @type Promise
		 * @private
		 * @memberOf mmir.env.view.ViewLoader#
		 */
		var defer = deferred();

		var isLayoutsLoaded = false;
		var isViewsLoaded = false;
		var isPartialsLoaded = false;

		/**
		 * Helper: called each time a loading-function finishes.
		 * Checks if all other loading-functions have finished, and if so, resolves the init-promise.
		 *
		 * @private
		 * @memberOf mmir.env.view.ViewLoader#
		 */
		var checkResolved = function(){
			if(isLayoutsLoaded && isViewsLoaded && isPartialsLoaded){
				defer.resolve();
			}
		};
		/**
		 * Helper: called if an error occured in one of the loading-functions:
		 * rejects/fails the init-promise.
		 *
		 * @private
		 * @memberOf mmir.env.view.ViewLoader#
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

		return defer;

	};//END: loadViews(){

	return loadViews;
});
