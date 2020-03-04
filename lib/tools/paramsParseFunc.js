
define(function() {

	////////////////////// exports ///////////////////////

	/**
	 * Convert parameter-part of an URL to a "dictionary", containing
	 * the parameter keys and values
	 * <p>
	 *
	 * 	<code>?id=5&name=heinz&name=kunz</code> &rarr;
	 * 	<pre>
	 * 	{
	 * 	  id: "5",
	 * 	  name: ["heinz", "kunz"],
	 *
	 * 	  //utility functions
	 * 	  has: function(key) : Boolean,
	 * 	  isMultiple: function(key) : Boolean,// is entry an Array of values
	 * 	  getKeys: function() : String[],     // get list of all keys
	 * 	}
	 * 	</pre>
	 * <p>
	 *
	 * The returned "dictionary" has the following functions:
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
	 * @param {String} urlParamsPartStrings
	 *            the parameter-part of the URL, i.e. <code>&...</code>
	 * @return {mmir.tools.ParamsDictionary} a <em>dictionary</em> for the URL parameters.<br>
	 * 																			 NOTE should be treated as read-only object.
	 * @public
	 * @memberOf mmir.tools
	 *
	 *
	 */
	function parseParamsToDictionary(urlParamsPartStrings) {

		/**
		 * A dictionary for parsed URL parameters.
		 *
		 * If the same parameter occurs multiple times, its values are stored in an
		 * array.
		 *
		 * Parameter values will be indexed by their name, e.g. <code>param=val</code>:
		 * <pre>dict["param"] // -> "val"</pre>
		 *
		 * If the parameter name collides with a dictionary built-in function, it will
		 * be prefixed by "&", e.g. <code>has=green</code>:
		 * <pre>dict["&has"] // -> "green"</pre>
		 *
		 * NOTE the dictionary should be treated as read-only:
		 *      adding / modifying / removing entries may result in an inconsistent
		 *      state of the dictionary, e.g. w.r.t. #has(key) function etc.
		 *
		 * @name ParamsDictionary
		 * @class
		 * @memberOf mmir.tools
		 * @static
		 * @hideconstructor
		 *
		 * @example
		 * var parseFunc = mmir.require('mmirf/paramsParseFunc');
		 * var dict = parseFunc(document.location.search);
		 * // or:
		 * var dict = mmir.util.parseParamsToDictionary(document.location.search);
		 *
		 * var key1 = dict.getKeys()[0];
		 * if(dict.has(key1)){
		 * 	if(dict.isMultiple(key1))
		 * 		console.log(dict[key1].join(', '));
		 * 	else
		 * 		console.log(dict[key1]);
		 * }
		 */
		var dict = {
			// use not-allowed-as-part-of-parameter-name char & as prefix
			// for meta-data 'keys-list':
			'_&&keys': [],
			/**
			 * Check if a parameter is present in the dictionary
			 * @param  {String} key the parameter name
			 * @return {Boolean} if the parameter entry is present in the dictionary
			 *
			 * @see #isMultiple
			 */
			has: function(key) {
				return typeof dict[key] !== 'undefined';
			},
			/**
			 * Check if a parameter has multiple values:
			 * multiple values are
			 *
			 *
			 * @param  {String} key the parameter name
			 * @return {Boolean} if the parameter has multiple values
			 *
			 * @see #has
			 *
			 * @example
			 * if(dict.isMultiple(key1)) dict[key1].forEach(function(val){
			 * 	console.log(val);
			 * });
			 */
			isMultiple: function(key) {
				// use not-allowed-as-part-of-parameter-name character '&' as
				// prefix for meta-data 'isMultiple' on field 'key':
				return dict['_&' + key] === true;
			},
			/**
			 * Get list of all parameter keys
			 *
			 * @return {Array<String>} (a copy of) the list of parameter keys that are
			 * 												 contained the dictionary
			 */
			getKeys: function() {
				return dict['_&&keys'].slice();
			}
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
			var cur, keyValue, theKey, theValue, valList, cont, j;
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

				//handle collision of parameter key with function name of the dictionary instance:
				if(typeof dict[theKey] === 'function'){
					theKey = '&' + theKey;
				}

				// create entry in dict for the parameter
				if (dict.has(theKey)) {

					if (dict.isMultiple(theKey)) {
						valList = dict[theKey], cont = false;
						for(j=valList.length-1; j >= 0; --j){
							if(valList[j] === theValue){
								cont = true
								break;
							}
						}
						if(!cont){
							valList.push(theValue);
						}
					}
					else if(dict[theKey] !== theValue) {
						// entry already exist, but is not multiple (=Array) yet:
						dict[theKey] = [dict[theKey], theValue];
						dict['_&' + theKey] = true;
					}
				}
				else {
					dict[theKey] = theValue;
					dict['_&&keys'].push(theKey);
				}
			}
		}
		return dict;
	}

	return parseParamsToDictionary;

});
