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
	

//TODO additional dependency on LanguageManager for 
//		* getLanguage() -> languageManager.getLanguage()
//		* setLanguage(lang) -> languageManager.setLanguage(lang)
//
// should the dependency on LanguageManager be made OPTIONAL?
//
define(['constants', 'jquery' ],
	/**
	 * A class for managing the configuration. <br>
	 * It's purpose is to load the configuration and settings automatically.
	 * 
	 * This "class" is structured as a singleton - so that only one instance is in use.<br>
	 * 
	 * @class
	 * @name mmir.ConfigurationManager
	 * @static
	 * 
	 * @category core
	 * 
	 * @depends jQuery.ajax
	 * @depends jQuery.isArray
	 * 
	 */
	function (
		constants, $
){
	
	//next 2 comments are needed by JSDoc so that all functions etc. can
	// be mapped to the correct class description
	/** @scope mmir.ConfigurationManager.prototype */
	/**
	 * #@+
	 * @memberOf mmir.ConfigurationManager.prototype 
	 */

    /**
     * Object containing the instance of the class {@link mmir.ConfigurationManager}.
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;
    
	/**
	 * Constructor-Method of Singleton mmir.ConfigurationManager.
	 * 
	 * @constructs mmir.ConfigurationManager
	 * @memberOf mmir.ConfigurationManager.prototype
	 * @private
	 * 
	 */
    function constructor(){

    	/** @scope mmir.ConfigurationManager.prototype */
    	
    	/**
    	 * the configuration data (i.e. properties)
		 * @property configData
		 * @type Object
		 * @private
    	 */
    	var configData = null;
    	
    	//FIXME change implementation to async-loading?
    	//		-> would need to add init()-function, with callback and/or return Deferred.promise
    	
        //load configuration file synchronously:
    	function _loadConfigFile(){
	        $.ajax({
	    		async: false,
	    		dataType: "json",
	    		url: constants.getConfigurationFileUrl(),
	    		success: function(data){
	    			
	    			if(IS_DEBUG_ENABLED) console.debug("ConfigurationManager.constructor: loaded language settings from "+constants.getConfigurationFileUrl());//debug
	    			
					if(data){
	    				configData = data;
	    			}
	    		},
	    		error: function(data){
	    			console.error("ConfigurationManager.constructor: failed to load configuration from '"+constants.getConfigurationFileUrl()+"'! ERROR: "+ JSON.stringify(data));
	    		}
	    	});
    	}
    	
    	//immediately load the configuration:
    	_loadConfigFile();
        
        /**
         * @private
         * @param {String|Array<String>} propertyName
         * 				resolves a dot-separated property-name into an array.
         * 				If <code>propertyName</code> is an Array, all contained
         * 				String entries will be resolved, if necessary
         * 				
         */
        function _getAsPath(propertyName){
        	
        	var path = propertyName;
        	if( ! $.isArray(path)){
        		path = propertyName.split('.');
        	}
        	else {
        		
        		var entry;
        		var increase = 0;
        		var size = propertyName.length;
        		var tempPath;
        		
        		for(var i=0; i < size; ++i){
        			
        			entry = propertyName[i];
        			tempPath = entry.split('.');
        			
        			//if entry contained dot-separated path:
        			// replace original entry with the new sub-path
        			if(tempPath.length > 1){
        				propertyName[i] = tempPath;
        				increase += (tempPath.length - 1);
        			}
        		}
        		
        		//if sup-paths were inserted: flatten the array
        		if(increase > 0){
        			
        			//create new array that can hold all entries
        			var newPath = new Array(size + increase);
        			var index = 0;
        			for(var i=0; i < size; ++i){

            			entry = propertyName[i];
        				
            			//flatten sub-paths into the new array:
        				if( $.isArray(entry) ){
        					
	    	        		for(var j=0, len=entry.length; j < len; ++j){
	    	        			newPath[index++] = entry[j];
	    					}
        				}
        				else {
        					//for normal entries: just insert 
        					newPath[index++] = entry;
        				}
        			}
        			
        			path = newPath;
        		}
        	}
        	
        	return path;
        }
    	
        
        return { 

        	// public members
        	
			/**
			 * Returns the currently used language. 
			 * 
			 * <p>This does not return the language of the configuration, but is a
			 * shortcut for {@link mmir.LanguageManager#getLanguage}.
			 * 
			 * 
			 * @deprecated use {@link mmir.LanguageManager#getLanguage}() instead!
			 * 
			 * @depends mmir.LanguageManager
			 * 
			 * @function getLanguage
			 * @returns {String} The currently used language
			 * @public
			 */
            getLanguage: function(){
                return require('languageManager').getInstance().getLanguage();
            },
			/**
			 * Sets the currently used language.
			 * 
			 * <p>This does not set the language of the configuration, but is a
			 * shortcut for {@link mmir.LanguageManager#setLanguage}.
			 * 
			 * 
			 * @deprecated use {@link mmir.LanguageManager#setLanguage}(lang) instead!
			 * 
			 * @depends mmir.LanguageManager
			 * 
			 * @function setLanguage
			 * @param {String} lang The language which is to be used
			 * @public
			 */
            setLanguage: function(lang){
            	require('languageManager').getInstance().setLanguage(lang);
            },
			/**
			 * Returns the value of a property.
			 *  
			 * @function get
			 * @param {String} propertyName
			 * 					The name of the property.
			 * 					NOTE: If the property does not exists at the root-level,
			 * 						  dot-separated names will be resolved into
			 * 						  object-structures, e.g.
			 * 						  <code>some.property</code> will be resolved
			 * 						  so that the <code>value</code> at:
			 * 						  <code>some: {property: &lt;value&gt;}</code>
			 * 						  will be returned
			 * @param {Boolean} [useSafeAccess] OPTIONAL
			 * 					if <code>true</code>, resolution of dot-separated paths
			 * 					will be done "safely", i.e. if a path-element does not
			 * 					exists, no <code>error</code> will be thrown, but instead
			 * 					the function will return the <code>defaultValue</code>
			 * 					(which will be <code>undefined</code> if the argument is not given).
			 * @param {any} [defaultValue] OPTIONAL
			 * 					a default value that will be returned, in case there is no property
			 * 					<code>propertyName</code>.
			 * 
             * 					NOTE: if this argument is used, <code>useSafeAccess</code> must also be given!
			 * 
			 * @returns {any} 
			 * 					The value of the property
			 * @public
			 */
            get: function(propertyName, useSafeAccess, defaultValue){
            	
            	if(configData){
            		
            		if(typeof configData[propertyName] !== 'undefined'){
            			return configData[propertyName];//////////// EARLY EXIT ///////////////////
            		}
            		
            		var path = _getAsPath(propertyName);
            		
            		//ASSERT path.length == 1: already handled by if(configData[propertyName]...
            		
            		if(path.length > 1){
            			
            			if(useSafeAccess && typeof configData[ path[0] ] === 'undefined'){
            				return defaultValue;///////////// EARLY EXIT /////////////////////////
            			}
            			
                		var obj = configData;
                		var prop;
                		while(path.length > 1){
                			prop = path.shift();
                			obj = obj[prop];
                			
                			if(useSafeAccess && typeof obj === 'undefined'){
                				return defaultValue;///////////// EARLY EXIT /////////////////////
                			}
                		}
                		
                		//ASSERT now: path.length == 1
                		
                		return obj[path[0]];
                	}
            	}
            	
            	return defaultValue;
            },
			/**
			 * Sets a property to a given value.
			 *  
			 * @function set
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
			 */
            set: function(propertyName, value){
            	if(!configData){
            		configData = {};
            	}
            	
            	var path = _getAsPath(propertyName);
            	
            	if(path.length > 1){
            		var obj = configData;
            		var prop;
            		while(path.length > 1){
            			
            			prop = path.shift();
            			
            			if(typeof obj[prop] === 'undfined' || obj[prop] === null){
            				obj[prop] = {};
            			}
            			else if(typeof obj[prop] !== 'object'){
            				throw new Error('Cannot expand path "'+propertyName+'": path-element "'+prop+'" already exist and has type "'+(typeof obj[prop])+'"');
            			}
            			
            			obj = obj[prop];
            		}
            		
            		//ASSERT path.length == 1
            		
            		obj[path[0]] = value;
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
             */
            getBoolean: function(propertyName, useSafeAccess, defaultValue){
            	
            	var val = this.get(propertyName, useSafeAccess);
            	
            	if(typeof val === 'undefined' && typeof defaultValue !== 'undefined' ){
            		val = defaultValue;
            	}
            	
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
             */
            getString: function(propertyName, useSafeAccess, defaultValue){
            	
            	var val = this.get(propertyName, useSafeAccess);
            	
            	if(typeof val === 'undefined' && typeof defaultValue !== 'undefined' ){
            		val = defaultValue;
            	}
            	
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
        
    }//END: construcor = function(){...

		    	
	instance = new constructor();
	
	/**
	 * @deprecated instead: use mmir.ConfigurationManager directly
	 * 
	 * @function
	 * @name getInstance
	 * @memberOf mmir.ConfigurationManager.prototype 
	 */
	instance.getInstance = function(){
		return instance;
	};
	
	return instance;

	/** #@- */
});
