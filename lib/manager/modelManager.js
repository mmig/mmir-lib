
define( [ 'mmirf/resources', 'mmirf/commonUtils', 'mmirf/logger', 'mmirf/util/deferred', 'module' ],
	/**
	 *
	 * A class for managing the models of the application (MVC-Component). <br>
	 * It's purpose is to load the models automatically.
	 *
	 * This "class" is a singleton - so that only one instance is in
	 * use.<br>
	 *
	 * TODO add example for usage (models as "class" / models as "singleton")
	 *
	 * @class
	 * @name ModelManager
	 * @memberOf mmir
	 * @static
	 * @hideconstructor
	 *
	 */
	function(
			resources, commonUtils, Logger, deferred, module
){
	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope mmir.ModelManager.prototype */

	/**
	 * @private
	 * @type mmir.tools.Logger
	 * @memberOf mmir.ModelManager#
	 * @see mmir.Logging#create
	 */
	var logger = Logger.create(module);

	// private members
	/**
	 * Map of models
	 *
	 * @type Map
	 * @private
	 *
	 * @memberOf mmir.ModelManager#
	 */
	var models = new Map();

	/**
	 * Name of the default namespace
	 * (within the manager's space)
	 * into which Models will be loaded
	 *
	 * @constant
	 * @type String
	 * @private
	 *
	 * @memberOf mmir.ModelManager#
	 */
	var MODEL_DEFAULT_NAMESPACE_NAME = 'mmir';

	/**
	 * The "global" namespace for the model manager
	 *
	 * @constant
	 * @type Object
	 * @private
	 *
	 * @memberOf mmir.ModelManager#
	 */
	var MODEL_MANAGER_NAMESPACE = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;

	/**
	 *
	 * This function returns the fully qualified model name (including namespace(s)).
	 *
	 * @function
	 * @param {String}
	 *            modelClassName the model's class-name (i.e. without namespace)
	 * @returns {String} fully qualified name for the model
	 * @private
	 *
	 * @memberOf mmir.ModelManager#
	 */
	function getFullModelName(modelClassName){
		if( ! MODEL_DEFAULT_NAMESPACE_NAME){
			return modelClassName;
		}
		else {
			return MODEL_DEFAULT_NAMESPACE_NAME + '.' + modelClassName;
		}
	}

	/**
	 *
	 * This function returns all loaded models.
	 *
	 * @function
	 * @returns {Array<String>} all loaded model names
	 * @public
	 * @memberOf mmir.ModelManager#
	 */
	function getModelNames(){//TODO export this function on _instance?
		return Array.from(models.keys());
	}

	/**
	 * This function invokes the method
	 * {@link mmir.ModelManager#foundModelsCallBack} to load all
	 * models in the path specified by *modelPath*.
	 *
	 * @function
	 * @param {Function} [initCallbackFunction] OPTIONAL
	 *            The callback function from the constructor
	 *            which shall be called after the initialization of the
	 *            {@link mmir.ModelManager}.
	 *
	 * @param {Object} [ctx] OPTIONAL
	 * 				the context for the model implementations (DEFAULT: the global context, i.e. window)
	 * @returns {Promise}
	 * 					a deferred promise that gets fulfilled when models are loaded.
	 * @private
	 * @memberOf mmir.ModelManager#
	 */
	function _init(initCallbackFunction, ctx) {

		/** @scope mmir.ModelManager.prototype */

		//shift arguments if necessary:
		//shift arguments if necessary:
		if(!ctx && typeof initCallbackFunction !== 'function'){
			ctx = initCallbackFunction;
			initCallbackFunction = void(0);
		}

		/**
		 *
		 * This function returns the fully qualified model name (incl. namespace(s)).
		 *
		 * @function
		 * @name getModelByName
		 * @param {String|Array<String>} fullModelName the fully qualified model name (i.e. with namespace(s))
		 * 								Note, if {String} components/namespaces are separated by a <tt>.</tt> (dot)
		 * 								If {Array<String>} the entries correspond to the namespace components (without dots),
		 * 								  where the last entry corresponds to the class/singleton name
		 * @param {Object} [ctx] OPTIONAL
		 * 				the (base) context for the model implementations (DEFAULT: the global context MODEL_MANAGER_NAMESPACE)
		 * @returns {Object} the "raw" model object (may be a constructor or the main-singleton-namespace).
		 * 					 Or <tt>null</tt> if there is no Model with the name.
		 * @private
		 *
		 * @requires mmir.CommonUtils#isArray
		 *
		 * @see mmir.ModelManager#getFullModelName
		 * @see mmir.ModelManager#doGetModelInstance
		 *
		 * @memberOf mmir.ModelManager#
		 */
		function getModelByName(fullModelName, ctx){

			ctx = ctx || MODEL_MANAGER_NAMESPACE;

			var components;
			if(commonUtils.isArray(fullModelName)){
				components = fullModelName;
			}
			else {
				components = fullModelName.split('.');
			}

			//try to resolve fully-qualified name (without triggering an error)
			var currentNameSpace = ctx;
			for(var i=0, size = components.length; i < size; ++i){
				currentNameSpace = currentNameSpace[components[i]];
				if(typeof currentNameSpace !== 'undefined' ){
					if(i === size-1){
						return currentNameSpace;
					}
				}
				else {
					break;
				}
			}

			if(size > 0 && ctx[components[size-1]]){
				//try simple model name
				return ctx[components[size-1]];
			}

			var isReTry = ctx !== MODEL_MANAGER_NAMESPACE;

			var logFunc = isReTry? 'info' : 'error';
			logger[logFunc]('ModelManager.getModelByName: could not find model'
					+(isReTry? ' in model context with path "<modelContext>.' : ' "')
					+(components.join('.'))
					+'": '
					+(isReTry? 'there is no' : 'invalid')
					+' namespace/class: "'
					+components[i]
					+'"'
					+(isReTry? ', trying to find model in global namespace ...' : '')
			);

			return null;
		}

		/**
		 * Returns the instance for a model implementation:
		 *
		 * If the model-object is a constructor (i.e. a function),
		 * a new instance is created and returned.
		 *
		 * Otherwise the model-object itself is returned (e.g. for
		 * singleton pattern models).
		 *
		 * @function
		 * @private
		 *
		 * @see mmir.ModelManager#getModelByName
		 *
		 * @memberOf mmir.ModelManager#
		 */
		function doGetModelInstance(modelImplObject){


			if(typeof modelImplObject === 'function'){
				return new modelImplObject();
			}
			//TODO allow alternative initialization methods for models?:
//        	else if(typeof modelImplObject.getInstance === 'function'){
//        		return modelImplObject.getInstance();
//        	}
//        	else if(typeof modelImplObject.init === 'function'){
//        		return modelImplObject.init();
//        	}
			else{
				return modelImplObject;
			}

			//TODO export to requirejs?
			//define(modelImplObject.toString(), function(){ return THE_MODEL_INSTANCE;});

		}

		var _defer = deferred();
		if(initCallbackFunction){
			_defer.then(initCallbackFunction, initCallbackFunction);
		}

		commonUtils.loadImpl(

				resources.getModelPath(),

				false,

				function () {

					logger.debug('[loadModels] done');

					_defer.resolve(_instance);
				},

				function isAlreadyLoaded(_name) {
					return false; // ( _instance && _instance.getModel(name) ); TODO
				},

				function callbackStatus(status, fileName, msg) {

					if (status === 'info') {

						logger.info('[loadModel] "' + fileName);

						var modelName = fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/\.[^.]+$/g, "");
						var fullName = getFullModelName(modelName);
						var modelImpl = getModelByName(fullName, ctx);
						if(!modelImpl){
							modelImpl = getModelByName(fullName);
						}
						var modelInstance;
						if (modelImpl) {
							modelInstance = doGetModelInstance(modelImpl);
						} else {
							logger.error('ModelManager.load: Could not find implementation for Model "' + modelName + '" (' + fullName + ') for file ' + fileName);
							modelInstance = modelName;
						}
						models.set(fullName, modelInstance);

					}
					else if (status === 'warning') {
						logger.warn('[loadModel] "' + fileName + '": ' + msg);
					}
					else if (status === 'error') {
						logger.error('[loadModel] "' + fileName + '": ' + msg);
					}
					else {
						logger.error('[loadModel] ' + status + ' (UNKNOWN STATUS) -> "' + fileName + '": ' + msg);
					}
				}

//				, function callbackAfterLoading(jsfile) {
//					var modelName = jsfile.charAt(0).toUpperCase() + jsfile.slice(1).replace(/\.[^.]+$/g, "");
//					var fullName = getFullModelName(modelName);
//					var modelImpl = getModelByName(fullName);
//					var modelInstance;
//					if (modelImpl) {
//						modelInstance = doGetModelInstance(modelImpl);
//					} else {
//						logger.error('ModelManager.load: Could not find implementation for Model "' + modelName + '" (' + fullName + ') for file ' + jsfile);
//						modelInstance = modelName;
//					}
//					models.set(fullName, modelInstance);
//				}
		);


		return _defer;
	};

	/**
	 * Object containing the instance of the class {@link mmir.ModelManager}
	 *
	 * @type Object
	 * @private
	 * @ignore
	 */
	var _instance = {
			/** @scope mmir.ModelManager.prototype */

			// public members
			/**
			 * This function gets the model by name.
			 *
			 * @function
			 * @param {String}
			 *            modelName Name of the model which should be returned
			 * @returns {Object} The model if found, null else
			 * @public
			 * @memberOf mmir.ModelManager.prototype
			 */
			get: function(modelName) {
				var retModel = null;

				// TODO implement mechanism for multiple/configurable model namespaces
				// (add optional namespace argument to getModel)
				var fullModelName = getFullModelName(modelName);

				retModel = models.get(fullModelName);
				if (!retModel) {
					logger.error('Could not find Model "' + modelName + '" at ' + fullModelName);
					return null;
				}
				return retModel;
			},


			/**
			 * This function returns all loaded model names.
			 *
			 * @function
			 * @returns {Array<string>} All loaded model names
			 * @public
			 */
			getNames: getModelNames,

			/**
			 * This function must be called before using the {@link mmir.ModelManager}. The Initialization process is asynchronous,
			 * because javascript-files must be loaded (the models), so it forces a synchronous behavior by using
			 * a callback function containing the instructions, which rely on the presence of the loaded models.<br>
			 *
			 * It loads the models and then calls the callback functions and returns the instance of this class.
			 *
			 * <div class="box important">
			 * <b>Note:</b>
			 * The callback function should contain all (!) instructions which require the prior loading of the models.<br>
			 * The callback mechanism is necessary, because loading the models is asynchronous.<br><br>
			 * If provided, the callback function is invoked with 1 argument, the ModelManager instance:<br>
			 * <code> callbackFunction(modelManagerInstance) </code>
			 * </div>
			 *
			 * NOTE: use EITHER callback-function OR returned Promise -- do not use both!
			 *
			 * @function
			 * @async
			 * @param {Function} [callbackFunction]
			 * 					The function which should be called after loading all controllers
			 * @param {Object} [ctx] OPTIONAL
			 * 				the context for the model implementations (DEFAULT: the global context, i.e. window)
			 * @returns {Promise}
			 * 					a deferred promise that gets fulfilled when models are loaded.
			 * @example
			 * 	function afterLoadingModels(modelManagerInstance){
			 * 		var userModel = modelManagerInstance.get('User');
			 * 		//do something...
			 * 	}
			 * 	mmir.model.create(afterLoadingModels);
			 * @public
			 */
			init: _init

	};

	return _instance;

});
