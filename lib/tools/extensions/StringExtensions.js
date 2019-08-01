
/*
 * JavaScript extensions for String type
 *
 */
define (['mmirf/stringUtils'], function(stringUtils){

	if( !String.prototype.startsWith ){
		/**
		 * Check if the String starts with token
		 * @function
		 */
		String.prototype.startsWith = function (token, ignoreCase) {
			/// <summary>
			/// Check if the String starts with token
			/// </summary>
			/// <param name="token" type="String">
			///     the token to check for
			/// </param>
			/// <param name="ignoreCase" type="Boolean">
			///     (optional) if <code>true</code> checking will ignore case of characters.
			///		Default is <code>false</code>.
			/// </param>
			/// <returns type="Boolean">
			///     true, if the String starts with token, otherwise false.
			/// </returns>
			var str, isStarting = false;
			var isIgnoreCase = typeof ignoreCase !== 'undefined' && ignoreCase == true;
			if(isIgnoreCase){
				token = token.toLowerCase();
				str = this.toLowerCase();
			}
			else {
				str = this;
			}

			isStarting = str.lastIndexOf(token, 0) === 0;

			return isStarting;
		};
	}//END: if( !String.prototype.startsWith
	else {

		//if it already exists, then it is probably startsWith(str [, position])
		String.prototype.startsWithOrig = String.prototype.startsWith;

		//"map" startsWith(str,number) to startsWith(str,boolean):
		String.prototype.startsWith = function (token, startIndex, ignoreCase) {
			if(typeof ignoreCase === 'undefined' && typeof startIndex === 'boolean' || startIndex === 'true'){
				ignoreCase = startIndex;
				startIndex = null;
			}
			var isIgnoreCase = typeof ignoreCase !== 'undefined' && ignoreCase == true;

			var str = this.toString(), other = token.toString();
			if(isIgnoreCase){
				str = str.toLowerCase();
				other = other.toLowerCase();
			}

			if(startIndex){
				return str.startsWithOrig(other, startIndex);
			}
			else {
				return str.startsWithOrig(other);
			}
		};
	}



	if( !String.prototype.endsWith ){
		/**
		 * Check if the String ends with token
		 * @function
		 */
		String.prototype.endsWith = function (token, ignoreCase) {
			/// <summary>
			/// Check if the String ends with token
			/// </summary>
			/// <param name="token" type="String">
			///     the token to check for
			/// </param>
			/// <param name="ignoreCase" type="Boolean">
			///     (optional) if <code>true</code> checking will ignore case of characters.
			///		Default is <code>false</code>.
			/// </param>
			/// <returns type="Boolean">
			///     true, if the String ends with token, otherwise false.
			/// </returns>
			var str, isEnding = false, pos;
			var isIgnoreCase = typeof ignoreCase !== 'undefined' && ignoreCase == true;
			if(isIgnoreCase){
				token = token.toLowerCase();
				str = this.toLowerCase();
			}
			else {
				str = this;
			}

			pos = str.length - token.length;
			//sanity check if the token is smaller than the String itself -> token cannot be a sub-string!
			if(pos < 0){
				return false;
			}
			isEnding = str.indexOf(token, pos) === pos;

			return isEnding;
		};
	}//END: if( !String.prototype.endsWith
	else {

		//if it already exists, then it is probably endsWith(str [, position])
		String.prototype.endsWithOrig = String.prototype.endsWith;

		//"map" endsWith(str,number) to endsWith(str,boolean):
		String.prototype.endsWith = function (token, startIndex, ignoreCase) {
			if(typeof ignoreCase === 'undefined' && typeof startIndex === 'boolean' || startIndex === 'true'){
				ignoreCase = startIndex;
				startIndex = null;
			}
			var isIgnoreCase = typeof ignoreCase !== 'undefined' && ignoreCase == true;

			var str = this.toString(), other = token.toString();
			if(isIgnoreCase){
				str = str.toLowerCase();
				other = other.toLowerCase();
			}

			if(startIndex){
				return str.endsWithOrig(other, startIndex);
			}
			else {
				return str.endsWithOrig(other);
			}
		};
	}

	if( !String.prototype.replaceAll ){
		/**
		 * ReplaceAll by Fagner Brack (MIT License):
		 *
		 * Replace all occurrences of a String with a new String
		 *
		 * @param {String} token
		 * 				the String to replace (all its occurrences)
		 * @param {String} newToken
		 * 				the new String for the replacement
		 * @param {String} [ignoreCase]
		 *     			if true, the String token is matched/searched for without
		 *     			taking case into account
		 *
		 * @returns {String}
		 *     a new String in which all occurrences of token are replaced by newToken.
		 *     If token or newToken are not Strings, the unmodified String will be returned.
		 *
		 * @function
		 */
		String.prototype.replaceAll = function (token, newToken, ignoreCase) {
			var str, i = -1, _token;
			if ((str = this.toString()) && typeof token === "string" && typeof newToken === "string") {
				_token = ignoreCase === true ? token.toLowerCase() : undefined;
				while ((i = (
						_token !== undefined ?
								str.toLowerCase().indexOf(
										_token,
										i >= 0 ? i + newToken.length : 0
								) : str.indexOf(
										token,
										i >= 0 ? i + newToken.length : 0
								)
				)) !== -1) {
					str = str.substring(0, i)
					.concat(newToken)
					.concat(str.substring(i + token.length));
				}
			}
			return str;
		};
	}//END: if( !String.prototype.replaceAll

	/**
	 * Escape quotes, i.e. replace single quotes <code>'</code> with <code>\'</code>
	 * @function
	 */
	String.prototype.escapeQuotes = function () {
		return stringUtils.escapeQuotes(this);
	};

	/**
	 * Escape double quotes, i.e. replace quotes <code>"</code> with <code>\"</code>
	 */
	String.prototype.escapeDoubleQuotes = function () {
		return stringUtils.escapeDoubleQuotes(this);
	};

	/**
	 * Un-escape quotes, i.e. replace escaped single quotes <code>\'</code> with <code>'</code>
	 */
	String.prototype.unescapeQuotes = function () {
		return stringUtils.unescapeQuotes(this);
	};

	/**
	 * Un-escape double quotes, i.e. replace escaped quotes <code>\"</code> with <code>"</code>
	 */
	String.prototype.unescapeDoubleQuotes = function () {
		return stringUtils.unescapeDoubleQuotes(this);
	};

	//TRIM function: only define, if the platform does not provide it already
	if (!String.prototype.trim) {

		console.info('WARNING: No String.trim() function defined, extending String with custom trim() function...');

		/**
		 * Custom implementation for <code>trim()</code>:
		 * removes whitespaces from beginning and end of a String.
		 *
		 * @returns {String}
		 * 			the modified String
		 *
		 * @memberOf StringUtils
		 */
		String.prototype.trim = function(){
			return this
			.replace(/^\s\s*/, '') //remove whitespace at start...
			.replace(/\s\s*$/, '');//... and whitespaces at the end of the String
		};
	}


	if(String.prototype.htmlEncode == null){


		/**
		 * HTML-Encode the supplied input
		 */
		String.prototype.htmlEncode = function (display, tabs) {
			return stringUtils.htmlEncode(this, display, tabs);
		};

	}
});
