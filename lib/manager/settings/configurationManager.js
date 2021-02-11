
define(['mmirf/resources', 'mmirf/logger', 'mmirf/events', 'mmirf/util/loadFile', 'mmirf/util/isArray', 'module'],
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
		res, Logger, EventEmitter, loadFile, isArray, module
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
		 * EventEmitter for change-listeners that will be notified on changes on specific
		 * configurtion paths (dot-speparated property path)
		 *
		 * @private
		 * @type mmir.tools.EventEmitter
		 * @memberOf mmir.ConfigurationManager#
		 */
		var listeners = new EventEmitter(null);

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

			if(listeners.empty()){
				return;///////// EARLY EXIT ////////////
			}

			var pathStr = isArray(path)? path.join('.') : path;
			path = pathStr? _getAsPath(path) : null;

			//emit to listeners of "any change" (i.e. empty property-path string):
			listeners.emit('', newValue, oldValue, path || []);

			if(pathStr){
				//emit to listeners of the property-path:
				listeners.emit(pathStr, newValue, oldValue, path);
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
		 * 														<pre>listener(newValue: any, oldValue: any, propertyName: string[])</pre>
		 * 														where <code>propertyName</code> is the list of property-name path components
		 * 														(the last component is the property name itself)
		 * 														NOTE: if parameter <code>propertyName</code> was not specified, the third argument
		 * 														      for the listener will be invoked with an empty Array.
		 *
		 * @param  {Boolean} [emitOnAdding] OPTIONAL if <code>true</code> the listener will be immediately be invoked
		 * 														after adding it with the current value
		 * 														<pre>listener(newValue: <current value>, oldValue: undefined, propertyName: <propertyName>)</pre>
		 * 														NOTE: can only be used when param <code>propertyName</code> is specified.
		 *
		 * @private
		 * @memberOf mmir.ConfigurationManager#
		 */
		function _onChange(propertyName, listener, emitOnAdding){

			if(typeof propertyName === 'function'){
				listener = propertyName;
				propertyName = void(0);
			}

			// use empty string as "any change" event type:
			var path = propertyName? _getAsPath(propertyName) : null;
			var pathStr = propertyName? path.join('.') : '';
			listeners.on(pathStr, listener);

			if(propertyName && emitOnAdding){
				// ASSERT path is
				listener(_get(path), void(0), path);
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

			// use empty string as "any change" event type:
			var path = propertyName? _getAsPath(propertyName).join('.') : '';
			return listeners.off(path, listener);
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
		 * "Normalizes" a (dot-separated) string or an array into a path:
		 * the result is an array of path components (i.e. each path component is a separate entry).
		 *
		 * NOTE: if propertyName is an Array, its entries are used as-is, i.e. are
		 *       NOT processed for string-entries that have dot-separating content:
		 *       <pre>
		 *       _getAsPath(['dot', 'separated.list']);//-> returns: ['dot', 'separated.list']
		 *       </pre>
		 *
		 * @example
		 *   //result is ['dot', 'separated', 'list']
		 *   _getAsPath('dot.separated.list');
		 *   _getAsPath(['dot', 'separated', 'list']);
		 *
		 * @private
		 * @param {String|Array<String>} propertyName
		 * 				resolves a dot-separated property-name into an array.
		 * 				If <code>propertyName</code> is an Array, all contained
		 * 				String entries will be resolved, if necessary
		 *
		 * @returns {Array<String>} list of dot-separated components (without the dots)
		 *
		 * @memberOf mmir.ConfigurationManager#
		 */
		function _getAsPath(propertyName){

			return isArray(propertyName)? propertyName : propertyName.split('.');
		}

		/**
		 * "Normalizes" an array of Strings by separating
		 * each String at dots and creating one single (flat) array where
		 * each path-component is a single entry.
		 *
		 * Processes (and flattens) string-entries that have themselves dot-separating
		 * notation:
		 * <pre>
		 *  _flattenPath(['dot', 'separated.list']);//-> returns: ['dot', 'separated', 'list']
		 * </pre>
		 *
		 * @private
		 * @param {String|Array<String>} pathStringOrList
		 * 				resolves a dot-separated path or array with paths, i.e. dot-separated property-names
		 * 				into a single, flat array where each path component is a separate Strings
		 *
		 * @returns {Array<String>} list of dot-separated components (without the dots)
		 *
		 * @memberOf mmir.ConfigurationManager#
		 *
		 *   //result is ['dot', 'separated', 'list']
		 *   _toPath(['dot', 'separated.list']);
		 *   _toPath('dot.separated.list');
		 *   _toPath(['dot', 'separated', 'list']);
		 */
		function _toPath(pathStringOrList){

			var pathList = isArray(pathStringOrList)? pathStringOrList : pathStringOrList.split('.');
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
		 * @param {Boolean} [setAsDefaultIfUnset] OPTIONAL
		 * 					if <code>true</code>, and there is no value set yet for <code>propertyName</code>,
		 * 					then the specified <code>defaultValue</code> will be set for <code>propertyName</code>.
		 *
		 * 					<br>DEFAULT: <code>false</code>
		 * 					<br>NOTE: if this argument is used, param <code>defaultValue</code> must also be given!
		 *
		 * @returns {any}
		 * 					The value of the property
		 * @private
		 * @memberOf mmir.ConfigurationManager#
		 */
		function _get(propertyName, defaultValue, setAsDefaultIfUnset){

			if(configData){

				if(typeof configData[propertyName] !== 'undefined'){
					return configData[propertyName];///////////// EARLY EXIT /////////////////////
				}

				var path = _getAsPath(propertyName);

				if(typeof configData[ path[0] ] === 'undefined'){
					return !setAsDefaultIfUnset? defaultValue : _set(path, defaultValue);///////////// EARLY EXIT /////////////////////
				}

				var obj = configData, prop;
				for(var i = 0, size = path.length, len = size - 1; i < size; ++i){
					prop = path[i];
					obj = obj[prop];

					if(typeof obj === 'undefined'){
						return !setAsDefaultIfUnset? defaultValue : _set(path, defaultValue);///////////// EARLY EXIT /////////////////////
					} else if(i === len){
						return obj;///////////// EARLY EXIT /////////////////////
					}
				}
			}

			return defaultValue;
		}

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
		 * @returns {any}
		 * 					The newly set value for the property
		 *
		 * @throws {Error} if the propertyName is dot-separated AND
		 * 					one of its path-elements (except for the last)
		 * 					already exists AND its type is not 'object'
		 *
		 * @private
		 * @memberOf mmir.ConfigurationManager#
		 */
		function _set(propertyName, value){

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

			} else {

				oldVal = configData[propertyName];
				configData[propertyName] = value;
				_emitChange(value, oldVal, path);
			}

			return value;
		}

		/** @lends mmir.ConfigurationManager.prototype */
		return {

			// public members
			/**
 			 * @copydoc mmir.ConfigurationManager#_get
 			 * @function
			 * @public
			 * @memberOf mmir.ConfigurationManager.prototype
			 * @see #set
			 */
			get: _get,
			/**
 			 * @copydoc mmir.ConfigurationManager#_set
 			 * @function
			 * @public
			 * @memberOf mmir.ConfigurationManager.prototype
			 * @see #get
			 */
			set: _set,

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
			 * 			NOTE: the default value will also be converted
			 * 				  to a Boolean value, if necessary.
			 *
			 * @see #get
			 * @memberOf mmir.ConfigurationManager.prototype
			 */
			getBoolean: function(propertyName, defaultValue, setAsDefaultIfUnset){

				var val = this.get(propertyName, defaultValue, setAsDefaultIfUnset);

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
			 * 			NOTE: the default value will also be converted
			 * 				  to a String value, if necessary.
			 *
			 * @see #get
			 * @memberOf mmir.ConfigurationManager.prototype
			 */
			getString: function(propertyName, defaultValue, setAsDefaultIfUnset){

				var val = this.get(propertyName, defaultValue, setAsDefaultIfUnset);

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
			 * Uses {@link #get}.
			 *
			 * If the property does not exists, returns <code>undefined</code>,
			 * otherwise values will be converted into Number values.
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
			 * 			NOTE: the default value will also be converted
			 * 				  to a Number value, if necessary.
			 *
			 * @see #get
			 * @memberOf mmir.ConfigurationManager.prototype
			 */
			getNumber: function(propertyName, defaultValue, setAsDefaultIfUnset){

				var val = this.get(propertyName, defaultValue, setAsDefaultIfUnset);

				if(typeof val !== 'undefined'){

					if(typeof val === 'number'){
						return val;
					}
					else {
						return parseFloat(val);
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
			off: _offChange,

			/**
 			 * @copydoc mmir.ConfigurationManager#_toPath
 			 * @function
			 * @public
			 * @memberOf mmir.ConfigurationManager.prototype
			 * @see #get
			 */
			toPath: _toPath,

		};//END: return {...

	}//END: constructor = function(){...


	instance = new constructor();

	return instance;
});
