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



define( [ 'dictionary', 'constants', 'commonUtils', 'jquery' ],
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
	 * 
	 * @requires jQuery.Deferred
	 * 
	 */
	function( 
    		Dictionary,  constants, commonUtils, $
){
	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope mmir.ModelManager.prototype */

	// private members
    /**
     * Array of models
     * 
     * @type Dictionary
     * @private
     * 
	 * @memberOf mmir.ModelManager#
     */
	var models = new Dictionary();
	
	/**
     * Name of the default namespace 
     * (within the global space) 
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
     * The global namespace
     * 
     * @constant
     * @type Object
     * @private
     * 
	 * @memberOf mmir.ModelManager#
     */
	var GLOBAL_NAMESPACE = window;

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
    	return models.getKeys();
    }

	/**
	 * This function invokes the method
	 * {@link mmir.ModelManager#foundModelsCallBack} to load all
	 * models in the path specified by *modelPath*.
	 * 
	 * @function
	 * @param {Function}
	 *            myCallbackFunction The callback function from the constructor
	 *            which shall be called after the initialization of the
	 *            {@link mmir.ModelManager}.
	 * @private
	 * @memberOf mmir.ModelManager#
	 */
	function _init(myCallbackFunction) {
		
		/** @scope mmir.ModelManager.prototype */

//		delete _instance.init;
		/**
		 * <code>init</code> as alias for #getInstance
		 * @private
		 * @function
		 * @name init
		 * @memberOf mmir.ModelManager#
		 */
		_instance.init = _instance.getInstance;

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
        function getModelByName(fullModelName){
        	var components;
        	if(commonUtils.isArray(fullModelName)){
        		components = fullModelName;
        	}
        	else {
        		components = fullModelName.split('.');
        	}
        	
        	var currentNameSpace = GLOBAL_NAMESPACE;
        	for(var i=0, size = components.length; i < size; ++i){
        		currentNameSpace = currentNameSpace[components[i]]; 
    			if(typeof currentNameSpace !== 'undefined' ){
            		if(i === size-1){
            			return currentNameSpace;
            		}
    			}
    			else {
    				console.error('ModelManager.getModelByName: could not find model "'
    						+(components.join('.'))
    						+'": invalid namespace/class: '
    						+components[i]
    				);
    				break;
    			}
        	}
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

		var _defer = $.Deferred();
		if(myCallbackFunction){
			_defer.always(myCallbackFunction);
		}

		commonUtils.loadImpl(

				constants.getModelPath(), 

				false, 

				function () {
					
					console.log('[loadModels] done');

					_defer.resolve(_instance);
				},

				function isAlreadyLoaded(name) {
					return false; // ( _instance && _instance.getModel(name) ); TODO
				}, 

				function callbackStatus(status, fileName, msg) {
					
					if (status === 'info') {
						
						console.info('[loadModel] "' + fileName);
						
						var modelName = fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/\.[^.]+$/g, "");
						var fullName = getFullModelName(modelName);
						var modelImpl = getModelByName(fullName);
						var modelInstance;
						if (modelImpl) {
							modelInstance = doGetModelInstance(modelImpl);
						} else {
							console.error('ModelManager.load: Could not find implementation for Model "' + modelName + '" (' + fullName + ') for file ' + fileName);
							modelInstance = modelName;
						}
						models.put(fullName, modelInstance);
						
					}
					else if (status === 'warning') {
						console.warn('[loadModel] "' + fileName + '": ' + msg);
					}
					else if (status === 'error') {
						console.error('[loadModel] "' + fileName + '": ' + msg);
					}
					else {
						console.error('[loadModel] ' + status + ' (UNKNOWN STATUS) -> "' + fileName + '": ' + msg);
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
//						console.error('ModelManager.load: Could not find implementation for Model "' + modelName + '" (' + fullName + ') for file ' + jsfile);
//						modelInstance = modelName;
//					}
//					models.put(fullName, modelInstance);
//				}
		);


		return _defer.promise(_instance);
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

			/**
			 * @deprecated use ModelManager object directly, e.g. instead of: mmir.ModelManager.getInstance().getModel()
			 * 				use: mmir.ModelManager.getModel()
			 * 
			 * NOTE: ModelManager must be initialized before it can be used.
			 * 
			 * @memberOf mmir.ModelManager.prototype
			 */
			getInstance : function () {
				return this;
			},

			// public members
			/**
			 * This function gets the model by name.
			 * 
			 * @function
			 * @param {String}
			 *            modelName Name of the model which should be returned
			 * @returns {Object} The model if found, null else
			 * @public
			 */
			getModel : function(modelName) {
				var retModel = null;

				// TODO implement mechanism for multiple/configurable model namespaces
				// (add optional namespace argument to getModel)
				var fullModelName = getFullModelName(modelName);

				retModel = models.get(fullModelName);
				if (!retModel) {
					console.error('Could not find Model "' + modelName + '" at ' + fullModelName);
					return null;
				}
				return retModel;
			},


			/**
			 * This function returns all loaded models.
			 * 
			 * @function
			 * @returns {Array} All loaded models
			 * @public
			 */
			getModels : function() {
				return models;
			},

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
			 * @param {Function} [callbackFunction] 
			 * 					The function which should be called after loading all controllers
			 * @returns {Promise} 
			 * 					a Deferred.promise that gets fulfilled when models are loaded.
			 * @example
			 * 	function afterLoadingModels(modelManagerInstance){
			 * 		var userModel = modelManagerInstance.getModel('User');
			 * 		//do something...
			 * 	} 
			 * 	mmir.ModelManager.create(afterLoadingModels);
			 * @public
			 */
			init: _init

	};

	return _instance;
	
});
