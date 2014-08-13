
define(function(){
	
	/**
	 * Constants for views:
	 * 
	 * area-types etc.
	 * 
	 * @class ViewConstants
	 * 
	 */
	var ViewConstants = function(){};
	
	ViewConstants.prototype = {
		CONTENT_AREA_HEAD 		: 0,
		CONTENT_AREA_BODY 		: 2,
		CONTENT_AREA_DIALOGS 	: 4,
		
		
		REMOTE_RESOURCES_ATTR_NAME : 'loc',
		REMOTE_RESOURCES_ATTR_VALUE : 'remote'
	};
	
	//return an instance (singleton)
	return new ViewConstants();
	
});