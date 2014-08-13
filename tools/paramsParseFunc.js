
define(function() {
	
	////////////////////// exports ///////////////////////
	
	/**
     * Convert parameter-part of an URL to a "dictionary", containing
     * the parameter keys and values
     * 
     * @example <code>?id=5&name=heinz&name=kunz</code> &rarr;
     *          <code>dict['id']=5, dict['name'] = ['heinz', 'kunz']</code>
     * 
     * The returnd "dictionary" has the following functions:
     * <ul>
     * <li>has(String key): returns <code>true</code> if the
     * dictionary contains an entry for <code>key</code></li>
     * <li>isMultiple(String key): returns <code>true</code> if the
     * entry for <code>key</code> is an Array (i.e. the URL contained
     * multiple values for this key)</li>
     * <li>getKeys(): returns an Array with the keys (String) for all
     * entries</li>
     * </ul>
     * 
     * @function parseParamsToDictionary
     * @param {String}
     *            the parameter-part of the URL, i.e. <code>&...</code>
     * @return {Object} an "dictionary" for the parameters
     * @public
     */
    function parseParamsToDictionary(urlParamsPartStrings) {
		var dict = new Object();

		dict.has = function(key) {
			return typeof dict[key] !== 'undefined';
		};
		dict.isMultiple = function(key) {
			// use not-allowed-as-part-of-parameter-name char & as
			// prefix for meta-data 'isMultiple' on field 'key':
			return typeof dict['&' + key] !== 'undefined' && dict['&' + key] === true;
		};
		// use not-allowed-as-part-of-parameter-name char & as prefix
		// for meta-data 'keys-list':
		dict['&&keys'] = new Array();
		dict.getKeys = function() {
			return dict['&&keys'];
		};

		if (urlParamsPartStrings) {
			if (typeof urlParamsPartStrings !== 'string') {
				urlParamsPartStrings = urlParamsPartStrings.toString();
			}
			if (urlParamsPartStrings.length < 1) {
				return dict;//////////////////////// EARLY EXIT /////////////////////////////
			}
			if (urlParamsPartStrings.charAt(0) === '?') {
				urlParamsPartStrings = urlParamsPartStrings.substring(1);
			}

			var params = urlParamsPartStrings.split('&');
			var cur = null;
			var keyValue = null;
			var theKey = null;
			var theValue = null;
			for (var i_params = 0, size_params = params.length; i_params < size_params; ++i_params) {

				cur = params[i_params];

				// "parse" parameter into key & value:
				keyValue = cur.split('=');
				theKey = keyValue[0];
				if (keyValue.length > 1) {
					theValue = keyValue[1];
				}
				else {
					theValue = null;
				}

				// create entry in dict for the parameter
				if (dict.has(theKey)) {

					if (dict.isMultiple(theKey)) {
						dict[theKey].push(theValue);
					}
					else {
						// entry already exist, but is not multiple (=Array) yet:
						var arr = new Array(2);
						arr[0] = dict[theKey];
						arr[1] = theValue;
						dict[theKey] = arr;
						dict['&' + theKey] = true;
					}
				}
				else {
					dict[theKey] = theValue;
					dict['&&keys'].push(theKey);
				}
			}
		}
		return dict;
    }

    return parseParamsToDictionary;
	
});
