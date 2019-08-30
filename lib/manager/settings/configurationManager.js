
define(['mmirf/resources', 'mmirf/logger', 'mmirf/util/loadFile', 'mmirf/util/isArray', 'module'],
	/**
	 * A class for managing the configuration. <br>
	 * It's purpose is to load the configuration and settings automatically.
	 *
	 * This "class" is structured as a singleton - so that only one instance is in use.<br>
	 *
	 * @name ConfigurationManager
	 * @memberOf mmir
	 * @static
	 * @class
	 *
	 * @requires mmir.require for getting/setting language code (e.g. see {@link mmir.ConfigurationManager.getLanguage}
	 *
	 */
	function (
		res, Logger, loadFile, isArray, module
){

	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope ConfigurationManager.prototype */

	/**
	 * Object containing the instance of the class {@link mmir.ConfigurationManager}.
	 *
	 * @type Object
	 * @private
	 *
	 * @memberOf ConfigurationManager#
	 */
	var instance = null;

	/**
	 * @private
	 * @type Logger
	 * @memberOf ConfigurationManager#
	 */
	var logger = Logger.create(module);

	/**
	 * @private
	 * @type ConfigurationManagerModuleConfig
	 * @memberOf ConfigurationManager#
	 */
	var _conf = module.config(module);

	/**
	 * Constructor-Method of Singleton mmir.ConfigurationManager.
	 *
	 * @private
	 *
	 * @memberOf ConfigurationManager#
	 */
	function constructor(){

		/** @scope ConfigurationManager.prototype */

		/**
		 * the configuration data (i.e. properties)
		 * @type Object
		 * @private
		 *
		 * @memberOf ConfigurationManager#
		 */
		var configData = null;

//    	/**
//         * Reference to the {@link mmir.LanguageManager} instance.
//         *
//         * Will be initialized lazily
//         *
//         * @type LanguageManager
//         * @private
//         *
//         * @see #getLanguage
//         * @see #setLanguage
//         *
//    	 * @memberOf LanguageManager#
//         */
//        var languageManager = null;
//        /**
//         * HELPER returns (and sets if necessary) {@link #languageManager}
//         *
//         * @returns {mmir.LanguageManager} the LanguageManager instance
//         * @private
//         *
//    	 * @memberOf LanguageManager#
//         */
//        var getLanguageManager = function(){
//        	if(!languageManager){
//            	var req;
//            	if(typeof mmir === 'undefined'){
//            		//fallback if global mmir is undefined, try to use global require-function
//            		req = require;
//            	} else {
//            		req = mmir.require;
//            	}
//        		languageManager = req('mmirf/languageManager');
//        	}
//        	return languageManager;
//        };

		/**
		 * Helper that loads configuration file synchronously.
		 *
		 * @private
		 * @memberOf ConfigurationManager#
		 */
		//FIXME change implementation to async-loading?
		//		-> would need to add init()-function, with callback and/or return Deferred
		function _loadConfigFile(){

					if(_conf && _conf.configuration){
						logger.verbose("loadConfigFile(): loaded configuration from module.config().configuration");
						configData = _conf.configuration;
						return;/////////// EARLY EXIT ///////////////
					}

			loadFile({
				async: false,
				dataType: "json",
				url: res.getConfigurationFileUrl(),
				success: function(data){

				logger.verbose("loadConfigFile(): loaded configuration from "+res.getConfigurationFileUrl());

					if(data){
						configData = data;
					}
				},
				error: function(data){
					var errStr = "loadConfigFile(): failed to load configuration from '"+res.getConfigurationFileUrl()+"'! ERROR: ";
					try{
						errStr += JSON.stringify(data);
						logger.error(errStr);
					}catch(e){
						logger.error(errStr, errStr);
					}
				}
			});
		}

		//immediately load the configuration:
		_loadConfigFile();

		/**
		 * "Normalizes" a string or an array into a path:
		 * the result is a single, flat array where each string has
		 * been separated at dots (i.e. each path component is a separate entry).
		 *
		 * @example
		 *   //result is ['dot', 'separated', 'list']
		 *   _getAsPath('dot.separated.list');
		 *   _getAsPath(['dot', 'separated.list']);
		 *   _getAsPath(['dot', 'separated', 'list']);
		 *
		 * @private
		 * @param {String|Array<String>} propertyName
		 * 				resolves a dot-separated property-name into an array.
		 * 				If <code>propertyName</code> is an Array, all contained
		 * 				String entries will be resolved, if necessary
		 *
		 * @memberOf ConfigurationManager#
		 */
		function _getAsPath(propertyName){

			var path = propertyName;
			if( ! isArray(path)){
				path = propertyName.split('.');
			}
			else {
				path = _toPathArray(propertyName);
			}

			return path;
		}

		/**
		 * "Normalizes" an array of Strings by separating
		 * each String at dots and creating one single (flat) array where
		 * each path-component is a single entry.
		 *
		 * @private
		 * @param {Array<String>} pathList
		 * 				resolves an array with paths, i.e. dot-separated property-names
		 * 				into a single, flat array where each path component is a separate Strings
		 *
		 * @memberOf ConfigurationManager#
		 */
		function _toPathArray(pathList){

			var entry;
			var increase = 0;
			var size = pathList.length;
			var tempPath;

			for(var i=0; i < size; ++i){

				entry = pathList[i];
				tempPath = entry.split('.');

				//if entry contained dot-separated path:
				// replace original entry with the new sub-path
				if(tempPath.length > 1){
					pathList[i] = tempPath;
					increase += (tempPath.length - 1);
				}
			}

			//if sup-paths were inserted: flatten the array
			if(increase > 0){

				//create new array that can hold all entries
				var newPath = new Array(size + increase);
				var index = 0;
				for(var i=0; i < size; ++i){

					entry = pathList[i];

					//flatten sub-paths into the new array:
					if( isArray(entry) ){

						for(var j=0, len=entry.length; j < len; ++j){
							newPath[index++] = entry[j];
						}
					}
					else {
						//for normal entries: just insert
						newPath[index++] = entry;
					}
				}

				pathList = newPath;
			}

			return pathList;
		}

		/** @lends mmir.ConfigurationManager.prototype */
		return {

			// public members
			/**
			 * Returns the value of a property.
			 *
			 * @function
			 * @param {String} propertyName
			 * 					The name of the property.
			 * 					NOTE: If the property does not exists at the root-level,
			 * 						  dot-separated names will be resolved into
			 * 						  object-structures, e.g.
			 * 						  <code>some.property</code> will be resolved
			 * 						  so that the <code>value</code> at:
			 * 						  <code>some: {property: &lt;value&gt;}</code>
			 * 						  will be returned
			 * @param {any} [defaultValue] OPTIONAL
			 * 					a default value that will be returned, in case there is no property
			 * 					<code>propertyName</code>.
			 * @param {Boolean} [useSafeAccess] OPTIONAL
			 * 					if <code>true</code>, resolution of dot-separated paths
			 * 					will be done "safely", i.e. if a path-element does not
			 * 					exists, no <code>error</code> will be thrown, but instead
			 * 					the function will return the <code>defaultValue</code>
			 * 					(which will be <code>undefined</code> if the argument is not given).
			 *
			 * 					<br>DEFAULT: <code>true</code>
			 * 					<br>NOTE: if this argument is used, param <code>defaultValue</code> must also be given!
			 *
			 * @returns {any}
			 * 					The value of the property
			 * @public
			 * @memberOf mmir.ConfigurationManager.prototype
			 */
			get: function(propertyName, defaultValue, useSafeAccess){

				if(configData){

					if(typeof configData[propertyName] !== 'undefined'){
						return configData[propertyName];//////////// EARLY EXIT ///////////////////
					}

					var path = _getAsPath(propertyName);

					if(typeof useSafeAccess === 'undefined'){
						useSafeAccess = true;
					}

					if(useSafeAccess && typeof configData[ path[0] ] === 'undefined'){
						return defaultValue;///////////// EARLY EXIT /////////////////////////
					}

					var obj = configData, prop;
					for(var i = 0, size = path.length, len = size - 1; i < size; ++i){
					// while(path.length > 1){
						prop = path[i];
						obj = obj[prop];

						if(useSafeAccess && typeof obj === 'undefined'){
							return defaultValue;///////////// EARLY EXIT /////////////////////
						} else if(i === len){
							return obj;///////////// EARLY EXIT /////////////////////
						}
					}
				}

				return defaultValue;
			},
			/**
			 * Sets a property to a given value.
			 *
			 * @function
			 * @param {String|Array<String>} propertyName
			 *
			 * 				The name of the property.
			 *
			 * 				If <code>propertyName</code> is an Array, it
			 * 				will be treated as if its entries were path-elements
			 * 				analogous to a dot-separated String propertyName.
			 *
			 * 				NOTE: dot-separated names will be resolved into
			 * 					  object-structures, e.g.
			 * 					  <code>some.property</code> will be resolved
			 * 					  so that the <code>value</code> will set to:
			 * 					  <code>some: {property: &lt;value&gt;}</code>
			 *
			 * @param {any} value
			 * 				The value of the property
			 *
			 * @throws {Error} if the propertyName is dot-separated AND
			 * 					one of its path-elements (except for the last)
			 * 					already exists AND its type is not 'object'
			 *
			 * @public
			 * @memberOf mmir.ConfigurationManager.prototype
			 */
			set: function(propertyName, value){

				if(!configData){
					configData = {};
				}

				var path = _getAsPath(propertyName);

				if(path.length > 1){
					var obj = configData, prop;
					for(var i = 0, size = path.length, len = size - 1; i < size; ++i){

						prop = path[i];

						if(i === len){
							obj[prop] = value;
						}
						else if(typeof obj[prop] === 'undefined' || obj[prop] === null){
							obj[prop] = {};
						}
						else if(typeof obj[prop] !== 'object' && i < size - 1){
							throw new Error('Cannot expand path "'+propertyName+'": path-element "'+prop+'" already exist and has type "'+(typeof obj[prop])+'"');
						}

						obj = obj[prop];
					}
				}
				else {
					configData[propertyName] = value;
				}
			},

			/**
			 * Uses {@link #get}.
			 *
			 * If the propertyName does not exists, returns <code>undefined</code>,
			 * otherwise values will be converted into Boolean values.
			 *
			 * Special case for Strings:
			 * the String <code>"false"</code> will be converted to
			 * Boolean value <code>false</code>.
			 *
			 * @public
			 * @param {any} [defaultValue] OPTIONAL
			 *
			 * 			if a default value is specified and there exists
			 * 			no property <code>propertyName</code>, the
			 * 			specified default value will be returned.
			 *
			 * 			NOTE: if this argument is used, <code>useSafeAccess</code> must also be given!
			 *
			 * 			NOTE: the default value will also be converted
			 * 				  to a Boolean value, if necessary.
			 *
			 * @see {@link #get}
			 * @memberOf mmir.ConfigurationManager.prototype
			 */
			getBoolean: function(propertyName, defaultValue, useSafeAccess){

				var val = this.get(propertyName, defaultValue, useSafeAccess);

				if(typeof val !== 'undefined'){

					if( val === 'false'){
						return false;
					}
					else {
						return val? true : false;
					}
				}

			},

			/**
			 * Uses {@link #get}.
			 *
			 * If the property does not exists, returns <code>undefined</code>,
			 * otherwise values will be converted into String values.
			 *
			 * If the value has not the type <code>"string"</code>, it will
			 * be converted by <code>JSON.stringify</code>.
			 *
			 * @public
			 * @param {any} [defaultValue] OPTIONAL
			 * 			if a default value is specified and there exists
			 * 			no property <code>propertyName</code>, the
			 * 			specified default value will be returned.
			 *
			 * 			NOTE: if this argument is used, <code>useSafeAccess</code> must also be given!
			 *
			 * 			NOTE: the default value will also be converted
			 * 				  to a String value, if necessary.
			 *
			 * @see {@link #get}
			 * @memberOf mmir.ConfigurationManager.prototype
			 */
			getString: function(propertyName, defaultValue, useSafeAccess){

				var val = this.get(propertyName, defaultValue, useSafeAccess);

				if(typeof val !== 'undefined'){

					if(typeof val === 'string'){
						return val;
					}
					else {
						return JSON.stringify(val);
					}
				}

			}

		};//END: return {...

	}//END: constructor = function(){...


	instance = new constructor();

	return instance;
});
