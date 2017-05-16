define(['mmirf/stringExtension'], function(){

return {
    /**
     * Converts the object to a valid JSON String value.
     * 
     * Ensures that the returned value does not contain (un-escaped)
     * double-quotes, so that the returned value can be used as a JSON
     * value, e.g. </br>
     * 
     * @function
     * @param {Object}
     *            theObjectValue the object to convert to a JSON String
     *            value. If NULL or UNDEFINED, an EMPTY String will be
     *            returned
     * @returns {String} the String value
     * @public
	 * @memberOf mmir.extensions.JsonUtils.prototype
	 * 
     * @example
     *  var JsonUtils = mmir.require('mmirf/jsonUtils');
     *  var jsonValue = JsonUtils.toJSONStringValue(someValue);
     *  var data = JSON.parse('"theValue":"' + jsonValue + '"');
     */
    toJSONStringValue : function(theObjectValue) {
		if (typeof theObjectValue !== 'undefined' && theObjectValue !== null) {
			if (typeof theObjectValue !== 'string') {
				theObjectValue = theObjectValue.toString();
			}
			theObjectValue = theObjectValue.escapeDoubleQuotes();
		}
		else {
			theObjectValue = '';
		}
		return theObjectValue;
    },

    /**
     * Converts the object to a valid JSON String value.
     * 
     * Ensures that the returned value does not contain (un-escaped)
     * double-quotes, so that the returned value can be used as a JSON
     * value, also does replace all newlines with the HTML-equivalent
     * '&lt;br/&gt;', e.g.
     * 
     * @function
     * @param {Object}
     *            theObjectValue the object to convert to a JSON String
     *            value. If NULL or UNDEFINED, an EMPTY String will be
     *            returned
     * @returns {String} the String value
     * @public
	 * @memberOf mmir.extensions.JsonUtils.prototype
	 * 
     * @example 
     *  var JsonUtils = mmir.require('mmirf/jsonUtils');
     *  var jsonValue = JsonUtils.convertJSONStringValueToHTML(someValue);
     *  var data = JSON.parse('"theValue":"' + jsonValue + '"');
     *  ...
     */
    convertJSONStringValueToHTML : function(str) {
		if (typeof str !== 'undefined' && str !== null) {
		
			if (typeof str !== 'string') {
				str = str.toString();
			}
			// escape double-quotes, if necessary
			// replace (all variants of) newlines with HTML-newlines
			str = str.escapeDoubleQuotes().replaceAll('\r\n', '<br/>')
					.replaceAll('\n', '<br/>')
					.replaceAll('\r', '<br/>');
		} else {
			str = '';
		}
		return str;

    },

    /**
     * Converts the object's direct properties to a valid JSON String
     * (i.e. no recursion for Object properties).
     * 
     * @function
     * @param {Object}
     *            _o the object to convert to a JSON String.
     * @returns {String} the String value
     * @public
	 * @memberOf mmir.extensions.JsonUtils.prototype
     */
    convertJSONStringToHTML : function(_o) {
		// var parse = function(_o){
		var a = new Array(), t;
		for ( var p in _o) {
			if (_o.hasOwnProperty(p)) {
				t = _o[p];
				if (t != null) {
					if (t && typeof t == "object") {
						a[a.length] = p + ":{ " + arguments.callee(t).join(", ") + "}";
					}
					else {
						if (typeof t == "string") {
							a[a.length] = [ p + ": \"" + t.toString() + "\"" ];
						} 
						else {
							a[a.length] = [ p + ": " + t.toString() ];
						}
					}
				}
			}
		}
		// return a;
		// };
		// return "{" + parse(o).join(", ") + "}";

		return "{" + a.join(", ") + "}";
    }
};

});