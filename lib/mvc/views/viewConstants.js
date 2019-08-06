
define(function(){

	/**
	 * Constants for views:
	 *
	 * area-types etc.
	 *
	 * @class ViewConstants
	 * @name ViewConstants
	 *
	 * @property {Number} CONTENT_AREA_HEAD				value: <code>0</code>
	 * @property {Number} CONTENT_AREA_BODY				value: <code>2</code>
	 * @property {Number} CONTENT_AREA_DIALOGS			value: <code>4</code>
	 * @property {String} REMOTE_RESOURCES_ATTR_NAME	value: <code>"loc"</code>
	 * @property {String} REMOTE_RESOURCES_ATTR_VALUE	value: <code>"remote"</code>
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
