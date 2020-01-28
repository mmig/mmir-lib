
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
	 * @hideconstructor
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
	 * @memberOf mmir.ConfigurationManager#
	 */
	var instance = null;

	/**
	 * @private
	 * @type mmir.tools.Logger
	 * @memberOf mmir.ConfigurationManager#
	 */
	var logger = Logger.create(module);

	/**
	 * @private
	 * @type ConfigurationManagerModuleConfig
	 * @memberOf mmir.ConfigurationManager#
	 */
	var _conf = module.config(module);

	/**
	 * Constructor-Method of Singleton mmir.ConfigurationManager.
	 *
	 * @private
	 *
	 * @memberOf mmir.ConfigurationManager#
	 */
	function constructor(){

		/** @scope ConfigurationManager.prototype */

		/**
		 * the configuration data (i.e. properties)
		 * @type Object
		 * @private
		 *
		 * @memberOf mmir.ConfigurationManager#
		 */
		var configData = null;

		/**
		 * list of change-listeners that will be notified on all configuration
		 * changes
		 *
		 * @private
		 * @type Array<Function>
		 * @memberOf mmir.ConfigurationManager#
		 */
		var allListeners = [];

		/**
		 * change-listeners that will be notified on changes on specific
		 * configurtion paths (dot-speparated property path):
		 *
		 * [configPath] -> Array<function>
		 *
		 * @private
		 * @type Map<string, Array<Function>>
		 * @memberOf mmir.ConfigurationManager#
		 */
		var listeners = new Map();

		/**
		 * HELPER for emitting on-change events to listeners
		 *
		 * @param       {any} newValue the new configuration value
		 * @param       {any} oldValue the old configuration value
		 * @param       {Array<string>} path the configuration path, i.e. list of
		 * 																	 segements of dot-separated path
		 *
		 * @private
		 * @memberOf mmir.ConfigurationManager#
		 */
		function _emitChange(newValue, oldValue, path){

			var asize = allListeners.length;
			var lsize = listeners.size;
			var pathStr = (asize || lsize) && isArray(path)? path.join('.') : void(0);

			for(var i = 0; i < asize; ++i){
				allListeners[i](newValue, oldValue, pathStr);
			}

			if(lsize > 0 && pathStr){
				var list = listeners.get(pathStr);
				if(list){
					for(var i = 0, size = list.length; i < size; ++i){
						list[i](newValue, oldValue, pathStr);
					}
				}
			}
		}

		/**
		 * Register listener for configuration changes.
		 *
		 * @param {String|Array<String>} [propertyName] OPTIONAL
		 *
		 * 				The name of the property, to listen for changes:
		 * 				if unspecified, listener will be invoked on all configuration
		 * 				changes.
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
		 * @param  {Function} listener the listener function that will be invoked
		 * 														when a configuration value is changed:
		 * 														<pre>listener(newValue: any, oldValue: any, propertyName: string)</pre>
		 *
		 * @private
		 * @memberOf mmir.ConfigurationManager#
		 */
		function _onChange(propertyName, listener){

			if(typeof propertyName === 'function'){
				listener = propertyName;
				propertyName = void(0);
			}

			if(propertyName){
				var path = _getAsPath(propertyName).join('.');
				var list = listeners.get(path);
				if(!list){
					list = [listener];
					listeners.set(path, list);
				} else {
					list.push(listener);
				}
			} else {
				allListeners.push(listener);
			}
		}

		/**
		 * Remove listener for configuration changes:
		 * if listener was registered multiple times, the first one is removed.
		 *
		 * @param {String|Array<String>} [propertyName] OPTIONAL
		 *
		 * 				The name of the property, to listen for changes:
		 * 				if unspecified, listener will be removed from list of listeners
		 * 				for all configuration changes, otherwise it will be removed
		 * 				from listeners for the specified property-path.
		 *
		 * @param  {Function} listener the listener function that will be invoked
		 * 														when a configuration value is changed:
		 * 														<pre>listener(newValue: any, oldValue: any, propertyName: string)</pre>
		 *
		 * @returns {boolean} <code>true</code> if a listener was removed,
		 * 										otherwise <code>false</code>.
		 *
		 * @private
		 * @memberOf mmir.ConfigurationManager#
		 */
		function _offChange(propertyName, listener){

			if(typeof propertyName === 'function'){
				listener = propertyName;
				propertyName = void(0);

			}
			var list;
			if(propertyName){
				var path = _getAsPath(propertyName).join('.');
				list = listeners.get(path);
				if(!list){
					return false;////////////// EARLY EXIT //////////////////////
				}
			} else {
				list = allListeners;
			}
			for(var i = 0, size = list.length; i < size; ++i){
				if(list[i] === listener){
					list.splice(i, 1);
					return true;////////////// EARLY EXIT //////////////////////
				}
			}
			return false;
		}

		/**
		 * Helper that loads configuration file synchronously.
		 *
		 * @private
		 * @memberOf mmir.ConfigurationManager#
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
		 * @memberOf mmir.ConfigurationManager#
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
		 * @memberOf mmir.ConfigurationManager#
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
			 * @param {String|Array<String>} propertyName
			 * 					if String: The name of the property.
			 * 					NOTE: If the property does not exists at the root-level,
			 * 						  dot-separated names will be resolved into
			 * 						  object-structures, e.g.
			 * 						  <code>some.property</code> will be resolved
			 * 						  so that the <code>value</code> at:
			 * 						  <code>some: {property: &lt;value&gt;}</code>
			 * 						  will be returned
			 * 					if String array: each entry corresponds to component in a
			 * 					dot-separated path (see above)
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

				var oldVal;
				if(path.length > 1){
					var obj = configData, prop;
					for(var i = 0, size = path.length, len = size - 1; i < size; ++i){

						prop = path[i];

						if(i === len){
							oldVal = obj[prop];
							obj[prop] = value;
							_emitChange(value, oldVal, path);
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
					oldVal = configData[propertyName];
					configData[propertyName] = value;
					_emitChange(value, oldVal, path);
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
			 * @see #get
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
			 * @see #get
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

			},

			/**
			 * @copydoc mmir.ConfigurationManager#_onChange
			 * @public
			 * @function
			 * @memberOf mmir.ConfigurationManager.prototype
			 * @see #on
			 */
			addListener: _onChange,
			/**
			 * @copydoc mmir.ConfigurationManager#_offChange
			 * @public
			 * @function
			 * @memberOf mmir.ConfigurationManager.prototype
			 * @see #off
			 */
			removeListener: _offChange,

			/**
			 * @copydoc mmir.ConfigurationManager#_onChange
			 * @public
			 * @function
			 * @memberOf mmir.ConfigurationManager.prototype
			 * @see #addListener
			 */
			on: _onChange,
			/**
			 * @copydoc mmir.ConfigurationManager#_offChange
			 * @public
			 * @function
			 * @memberOf mmir.ConfigurationManager.prototype
			 * @see #removeListener
			 */
			off: _offChange

		};//END: return {...

	}//END: constructor = function(){...


	instance = new constructor();

	return instance;
});
