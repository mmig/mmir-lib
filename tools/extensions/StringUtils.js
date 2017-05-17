define(function(){


	/**
	 * Escape quotes, i.e. replace single quotes <code>'</code> with <code>\'</code>.
	 * 
	 * @param {String} str
	 * 			the String that will be modified
	 * @returns {String}
	 * 			the modified String
	 * 
	 * @function
	 * @memberOf StringUtils
	 */
	var escapeQuotes = function(str) {
		if (str = this.toString()) {
			return str.replaceAll('\'', '\\\'', false);
		} else if(str == ''){
			return str;
		}
		throw new Error('Error in StringUtils.escapeQuotes: This is not a string: '+ (typeof this));
	};

	/**
	 * Escape double quotes, i.e. replace quotes <code>"</code> with <code>\"</code>.
	 * 
	 * @param {String} str
	 * 			the String that will be modified
	 * @returns {String}
	 * 			the modified String
	 * 
	 * @memberOf StringUtils
	 */
	var escapeDoubleQuotes = function(str) {
		var str;
		if (str = this.toString()) {
			return str.replaceAll('"', '\\"', false);
		} else if(str == ''){
			return str;
		}
		throw new Error('Error in StringUtils.escapeDoubleQuotes: This is not a string: '+ (typeof this));
	};

	/**
	 * Un-escape quotes, i.e. replace escaped single quotes <code>\'</code> with <code>'</code>.
	 * 
	 * @param {String} str
	 * 			the String that will be modified
	 * @returns {String}
	 * 			the modified String
	 * 
	 * @memberOf StringUtils
	 */
	var unescapeQuotes = function(str) {
		var str;
		if (str = this.toString()) {
			return str.replaceAll('\\\'', '\'', false);
		} else if(str == ''){
			return str;
		}
		throw new Error('Error in StringUtils.unescapeQuotes: This is not a string: '+ (typeof this));
	};

	/**
	 * Un-escape double quotes, i.e. replace escaped quotes <code>\"</code> with <code>"</code>.
	 * 
	 * @param {String} str
	 * 			the String that will be modified
	 * @returns {String}
	 * 			the modified String
	 * 
	 * @memberOf StringUtils
	 */
	var unescapeDoubleQuotes = function () {
		var str;
		if (str = this.toString()) {
			return str.replaceAll('\\"', '"', false);
		} else if(str == ''){
			return str;
		}
		throw new Error('Error in String.unescapeDoubleQuotes: This is not a string: '+ (typeof this));
	};
	
	/**
	 * Custom implementation for <code>trim()</code>:
	 * removes whitespaces from beginning and end of a String.
	 * 
	 * @param {String} str
	 * 			the String that will be modified
	 * @returns {String}
	 * 			the modified String
	 * 
	 * @memberOf StringUtils
	 */
	var trim = function(str){
		return str
				.replace(/^\s\s*/, '') //remove whitespace at start...
				.replace(/\s\s*$/, '');//... and whitespaces at the end of the String
	};
	
	return {
		trim: trim,
		escapeQuotes: escapeQuotes,
		unescapeQuotes: unescapeQuotes,
		escapeDoubleQuotes: escapeDoubleQuotes,
		unescapeDoubleQuotes: unescapeDoubleQuotes
	};

});
