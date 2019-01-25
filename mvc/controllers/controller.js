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


define ( [ 'mmirf/commonUtils', 'mmirf/helper', 'mmirf/logger', 'module' ],
	//this comment is needed by jsdoc2 [copy of comment for: function Controller(...]
	/**
	 * The Controller Class is a kind of interface-class which gives access to the methods of a controller and its helper. <br>
	 * Also holds information about views and partials associated with the controller.
	 * 
	 * @param {String} name Name of the Controller
	 * @param {Object} jsonDef Information about the controllers, views, and partials
	 * @param {Object} [ctx] OPTIONAL the context for the controller implementation (DEFAULT: global context, i.e. window)
	 * 
	 * @name Controller
	 * @class
	 */
	function (
			commonUtils, Helper, Logger, module
){
	
	/**
	 * @private
	 * @type Logger
	 * @memberOf Controller#
	 * @see mmir.Logging#create
	 */
	var logger = Logger.create(module);
	
	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope Controller.prototype */
	
	//set to @ignore in order to avoid doc-duplication in jsdoc3
	/**
	 * @ignore
	 * 
	 * The Controller Class is a kind of interface-class which gives access to the methods of a controller and its helper. <br>
	 * Also holds information about views and partials associated with the controller.
	 * 
	 * @constructs Controller
	 * @param {String} name Name of the Controller
	 * @param {Object} jsonDef Information about the controllers, views, and partials
	 * @param {Object} ctx the context for the controller implementation, i.e. where the constructor exists: ctx.<controller name>()
	 */
	function Controller(name, jsonDef, ctx){
//	    console.log("controller name " + name);

	    /**
	     * The json definition of the views and partials associated with the controller. Also contains paths to controller and its views/partials. 
	     * 
	     * @type Object
	     * @public
	     */
	    this.def = jsonDef;

	    /**
	     * The name of the controller. 
	     * 
	     * @type String
	     * @public
	     */
	    this.name = name;
	    
	    var viewDefs = this.def.views;

	    /**
	     * An array holding the names of all views associated with the controller.  
	     * 
	     * @type Array<String>
	     * @public
	     */
	    this.views = [];
	    this.parseViews(viewDefs);

	    // parsing the partials and saving the names in an array
	    var partialDefs = this.def.partials;
	    

	    /**
	     * An array holding the names of all partials associated with the controller.  
	     * 
	     * @type Array<String>
	     * @public
	     */
	    this.partials = [];
	    this.parsePartials(partialDefs);


	    /**
	     * The instance of the with the controller associated helper.  
	     * 
	     * @type Helper
	     * @public
	     */
	    this.helper;
	    
	    /**
	     * The layout (info) for this controller (if undefined, the default layout should be used)
	     * @type Object
	     */
	    this.layout = this.def.layout;

	    /**
	     * The definition of the controller object, i.e. its (application specific) implementation,
	     * containing all properties and functions of the controller.<br>
	     * 
	     * A method of the controller implementation can be called via:
		 * <pre>
		 * 	this.instance.method(parameter);
		 * </pre>
	     * 
	     * @type Object
	     * @protected
	     */
		// this can only be invoked, if a function with the name "name" exists in the object/context ctx
	    this.impl = new ctx[name](this);
	    
	    /**
	     * @deprecated use {@link #impl} instead
	     * @protected
	     */
	    this.script = this.impl;
	}


	/**
	 * This function loads the helper of the controller - if it exists.
	 * 
	 * @function
	 * @param {String} name Name of the Helper to be loaded
	 * @param {String} helperPath Path to the helper file to load
	 * @param {Object} ctx the context for the helper implementation, i.e. where the constructor exists: ctx.<helper name>()
	 * @protected
	 */
	Controller.prototype.loadHelper = function(name, helperPath, ctx){
		
		var self = this;
		
		//TODO move check of helper existence to Controller.foundControllersCallBack ?

		//determine if there is a helper for the controller:
		var path = helperPath;
		var fileName = path;
		var lastPathSeparatorIndex = path.lastIndexOf('/');
		if(lastPathSeparatorIndex !== -1){
			path = path.substring(0,lastPathSeparatorIndex);
			fileName = fileName.substring( lastPathSeparatorIndex + 1 );
		}
		//get contents of the helper directory:
		var dirContents = commonUtils.listDir(path);
		if(!dirContents){
			logger.warn('Could not determine contents for directory "'+path+'"');
			return; ////////////////////// EARLY EXIT //////////////////////////////
		}
		else if(! commonUtils.isArray(dirContents) || dirContents.length < 1){
			logger.warn('Invalid information for contents of directory "'+path+'": '+dirContents);
			return; ////////////////////// EARLY EXIT //////////////////////////////
		}
		
		//check, if there is an implementation file for this helper:
		var helperIsSpecified = false;
		for(var i=0, size= dirContents.length; i < size; ++i){
			if(dirContents[i] === fileName){
				helperIsSpecified = true;
				break;
			}
		}
		
		if( ! helperIsSpecified){
			if(logger.isVerbose()) logger.v("[HELPER] no helper available (not implemented) at '"+ helperPath+"'");
			return; ////////////////////// EARLY EXIT //////////////////////////////
		}
		
		//if there is a file: load the helper
		commonUtils.getLocalScript(helperPath, function(data, textStatus, jqxhr){
			
				if(logger.isVerbose()) logger.v("[HELPER] load "+ helperPath);//debug
				
				self.helper = new Helper(self, name, ctx);
			},
			function(exception) {
				// print out an error message
				logger.error("[WARN] Could not load helper -> '"+ helperPath + "'", exception); //failure
			}
		);
	};


	/**
	 * This function performs an action of a controller - which is represented by this instance of the Controller <br>
	 * class - by calling the method from the corresponding controller, e.g. assets/www/controllers/application.js   
	 * 
	 * @function
	 * @param {String} actionName Name of the method to be executed
	 * @param {Object} data Data to pass to the method of the controller as argument
	 * @returns {Object} The return value of the executed method 
	 * @public
	 */
	Controller.prototype.perform = function(actionName, data){
		
		if(logger.isVerbose()) logger.v("should perform '" + actionName + "' of '" + this.name + "'"+ ((typeof data !== 'undefined' && data !== null)? " with data: "+JSON.stringify(data): ""));//debug
		
	    if(arguments.length > 2){
	    	return this.impl[actionName](data, arguments[2]);
		}
		else {
			return this.impl[actionName](data);
		}
	};

	/**
	 * 
	 * This function performs an action of a controller, but only if an action with this name exists; otherwise nothing is done.
	 * 
	 * In difference to perform(..), the method does not trigger an ERROR, if the action does not exist / is not implemented.
	 * As a consequence, this method refers to "optionally" implemented functions, whereas perform(..) refers to mandatory functions.
	 * 
	 * @function
	 * @param {String} actionName Name of the method to be executed
	 * @param {Object} data Data to pass to the method of the controller as argument
	 * @returns {Object} The return value of the executed method 
	 * @public
	 */
	Controller.prototype.performIfPresent = function(actionName, data){
		if(typeof this.impl[actionName] === 'function'){
		    
			if(logger.isVerbose()) logger.v("performing '" + actionName + "' of '" + this.name + "'"+ ((typeof data !== 'undefined' && data !== null)? " with data: "+JSON.stringify(data): ""));//debug
		    
		    return this.perform.apply(this, arguments);
		    
		} else if(typeof this.impl[actionName] !== 'undefined'){
			if(logger.isVerbose()) logger.info("could not perform '" + actionName + "' of '" + this.name + "'"+ ((typeof data !== 'undefined' && data !== null)? " with data: "+JSON.stringify(data): "")+": no function ("+typeof this.impl[actionName]+")");//debug
		} else {
			if(logger.isVerbose()) logger.debug("could not perform '" + actionName + "' of '" + this.name + "'"+ ((typeof data !== 'undefined' && data !== null)? " with data: "+JSON.stringify(data): "")+": not implemented (undefined)");//debug
		}
	};


	/**
	 * This function performs a helper action of a controller by calling the appropriate method<br>
	 * {@link Helper#perform} of the instance of the helper class associated with the controller.
	 * 
	 * @function
	 * @param {String} actionName Name of the helper method to be executed
	 * @param {Object} data Data to pass to the helper method as argument
	 * @returns {Object} The return value of the executed method 
	 * @public
	 */
	Controller.prototype.performHelper = function(actionName, data){
		if(arguments.length > 2){
			return this.helper.perform(actionName, data, arguments[2]);
		}
		else {
			return this.helper.perform(actionName, data);
		}
	};


	/**
	 * Returns the helper of the controller instance.
	 * 
	 * @function
	 * @returns {Object} The helper instance 
	 * @public
	 */
	Controller.prototype.getHelper = function(){
		return this.helper;
	};


	/**
	 * Stores all names of the views of the controller by iterating over the array of the views definition.<br>
	 * This function is called by the constructor of the {@link mmir.Controller} class.
	 * 
	 * @function
	 * @param {Array} viewDefs Array of the json-definition of the controllers views - containing name of the views and their corresponding path to the js-files
	 * @public
	 */
	Controller.prototype.parseViews = function(viewDefs){
		
		for(var i=0, size = viewDefs.length; i < size; ++i){
			this.views.push(viewDefs[i].name);
		}
		
	};


	/**
	 * Stores all names of the partials of the controller by iterating over the array of the partials definition.<br>
	 * This function is called by the constructor of the {@link mmir.Controller} class.
	 * 
	 * @function
	 * @param {Array} partialDefs Array of the json-definition of the controllers partials - containing name of the partials and their corresponding path to the js-files
	 * @public
	 */
	Controller.prototype.parsePartials = function(partialDefs){
	    
	    for(var i=0, size = partialDefs.length; i < size; ++i){
			this.partials.push(partialDefs[i].name);
		}
	    
	};


	/**
	 * Returns the view names for the controller instance.
	 * 
	 * @function
	 * @returns {Array<String>} An array of the controllers views 
	 * @public
	 */
	Controller.prototype.getViewNames = function(){
		return this.views;
	};

	/**
	 * Returns the view names for the controller instance.
	 * 
	 * TODO should this be private/hidden? -> provides "internal" JSON-details object (used in PresentationManager)
	 * 
	 * Each info object has properties:
	 * {String} name
	 * {String} path
	 * 
	 * @function
	 * @returns {Array<Object>} An array of the controllers views 
	 * @public
	 */
	Controller.prototype.getViews = function(){
		return this.def.views;
	};

	/**
	 * Returns the partial names for the controller instance.
	 * 
	 * @function
	 * @returns {Array<String>} An array of the controllers partials 
	 * @public
	 */
	Controller.prototype.getPartialNames = function(){
	    return this.partials;
	};

	/**
	 * Returns the partial info object for the controller instance.
	 * 
	 * TODO should this be private/hidden? -> provides "internal" JSON-details object (used in PresentationManager)
	 * 
	 * Each info object has properties:
	 * {String} name
	 * {String} path
	 * 
	 * @function
	 * @returns {Array<Object>} An array of the controllers partials 
	 * @public
	 */
	Controller.prototype.getPartials = function(){
	    return this.def.partials;
	};

	/**
	 * Returns the layout of the controller instance.
	 * 
	 * If undefined, the default layout should be used.
	 * 
	 * TODO should this be private/hidden? -> provides "internal" JSON-details object (used in PresentationManager)
	 * 
	 * The info object has properties:
	 * {String} name
	 * {String} path
	 * {String} fileName
	 * 
	 * @function
	 * @returns {Object} The controller's layout (may be undefined) 
	 * @public
	 */
	Controller.prototype.getLayout = function(){
	    return this.layout;
	};

	/**
	 * Returns the layout name for the controller instance.
	 * 
	 * This is equal to the controller name.
	 * 
	 * If undefined, the default layout should be used.
	 * 
	 * @function
	 * @returns {String} The controller's layout name (may be undefined) 
	 * @public
	 */
	Controller.prototype.getLayoutName = function(){
	    return this.layout? this.layout.name : this.layout;
	};

	/**
	 * Returns the name of the controller instance.
	 * 
	 * @function
	 * @returns {String} The name of the controller 
	 * @public
	 */
	Controller.prototype.getName = function(){
	    return this.name;
	};

	return Controller;
	
});
