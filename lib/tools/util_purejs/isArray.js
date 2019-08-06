define(function(){
	/**
	 * This helper initializes a function for detecting if an Object is an
	 * Array.
	 *
	 * The helper tries to find native or library JavaScript functions for this; if
	 * none can be found, a custom implementation is used.
	 *
	 * NOTE: The current implementation checks jQuery.isArray for presences
	 *
	 * @type Function
	 * @param {any} obj
	 * 				the object that should be tested
	 * @returns {Boolean} TRUE if obj is an array
	 *
	 * @memberOf util
	 */
	var IsArray = (function() {

		// this is the initializer: the following will overwrite the
		// isArray-function
		// with the appropriate version (use jQuery method, if present,
		// otherwise use alternative)

		//use native method, if present
		if(Array.isArray){
			return Array.isArray;
		}
		// if present, use jQuery method:
		else if (typeof jQuery !== 'undefined' && typeof jQuery.isArray === 'function') {
			return jQuery.isArray;
		}
		else {
			// use the toString method with well-defined return-value from
			// Object:
			var staticToString = Object.prototype.toString;

			return function(obj) {
				return staticToString.call(obj) === '[object Array]';
			};
		}
	})();//<- immediately initialize the isArray-function

	return IsArray;
});
