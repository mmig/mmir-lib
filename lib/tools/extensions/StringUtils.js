define(function(){


	/**
	 * Escape quotes, i.e. replace single quotes <code>'</code> with <code>\'</code>.
	 *
	 * @param {String} inputStr
	 * 			the String that will be modified
	 * @returns {String}
	 * 			the modified String
	 *
	 * @function
	 * @memberOf StringUtils
	 */
	var escapeQuotes = function(inputStr) {
		if (str = inputStr.toString()) {
			return str.replace(/'/gm, '\\\'');
		} else if(str == ''){
			return str;
		}
		throw new Error('Error in StringUtils.escapeQuotes: This is not a string: '+ (typeof this));
	};

	/**
	 * Escape double quotes, i.e. replace quotes <code>"</code> with <code>\"</code>.
	 *
	 * @param {String} inputStr
	 * 			the String that will be modified
	 * @returns {String}
	 * 			the modified String
	 *
	 * @memberOf StringUtils
	 */
	var escapeDoubleQuotes = function(inputStr) {
		var str;
		if (str = inputStr.toString()) {
			return str.replace(/"/gm, '\\"');
		} else if(str == ''){
			return str;
		}
		throw new Error('Error in StringUtils.escapeDoubleQuotes: This is not a string: '+ (typeof this));
	};

	/**
	 * Un-escape quotes, i.e. replace escaped single quotes <code>\'</code> with <code>'</code>.
	 *
	 * @param {String} inputStr
	 * 			the String that will be modified
	 * @returns {String}
	 * 			the modified String
	 *
	 * @memberOf StringUtils
	 */
	var unescapeQuotes = function(inputStr) {
		var str;
		if (str = inputStr.toString()) {
			return str.replace(/\\'/gm, '\'');
		} else if(str == ''){
			return str;
		}
		throw new Error('Error in StringUtils.unescapeQuotes: This is not a string: '+ (typeof this));
	};

	/**
	 * Un-escape double quotes, i.e. replace escaped quotes <code>\"</code> with <code>"</code>.
	 *
	 * @param {String} inputStr
	 * 			the String that will be modified
	 * @returns {String}
	 * 			the modified String
	 *
	 * @memberOf StringUtils
	 */
	var unescapeDoubleQuotes = function(inputStr) {
		var str;
		if (str = inputStr.toString()) {
			return str.replace(/\\"/gm, '"');
		} else if(str == ''){
			return str;
		}
		throw new Error('Error in String.unescapeDoubleQuotes: This is not a string: '+ (typeof this));
	};

	/**
	 * HTML-Encode the supplied input
	 *
	 * Parameters:
	 *
	 * @param {string} source
	 *                     The text to be encoded.
	 *
	 * @param {boolean} [display]
	 *                     (optional)
	 *                     The output is intended for display.
	 *
	 *                     If true (or undefined):
	 *                     * Tabs will be expanded to the number of spaces
	 *                       indicated by the 'tabs' argument.
	 *                     * Line breaks will be converted to <br />.
	 *
	 *                     If false:
	 *                     * Tabs and linebreaks get turned into &#____;
	 *                       entities just like all other control characters.
	 *
	 * @param {number} [tabs]
	 *                     (optional)
	 *                     The number of spaces to expand tabs to.
	 *                     (Ignored if the 'display' parameter evaluates to false
	 *                      or if tabs is not >= 0.)
	 *
	 *                     Default: undefined (do not replace tabs with spaces)
	 *
	 * version 2010-11-08 (modified: 2012-12-20)
	 *
	 * @memberOf StringUtils
	 */
	var htmlEncode = function (source, display, tabs) {
		var i, s, ch, peek, line, result,
		next, endline, push,
		spaces;

		//'parse' parameters
		if(typeof display === 'number'){
			//use as tabs-parameter
			tabs = display;
			display = true;
		} else if(typeof display === 'undefined'){
			display = true;
		}
		if(typeof tabs === 'string'){
			tabs = parseInt(tabs,10);
		} else if(typeof tabs === 'number'){
			tabs = Math.floor(tabs);
		} else {
			tabs = -1;
		}

		// Stash the next character and advance the pointer
		next = function () {
			peek = source.charAt(i);
			i += 1;
		};

		// Start a new "line" of output, to be joined later by <br />
		endline = function () {
			line = line.join('');
			if (display) {
				// If a line starts or ends with a space, it evaporates in html
				// unless it's an nbsp.
				line = line.replace(/(^ )|( $)/g, '&nbsp;');
			}
			result.push(line);
			line = [];
		};

		// Push a character or its entity onto the current line
		push = function () {
			if (ch < ' ' || ch > '~') {
				line.push('&#' + ch.charCodeAt(0) + ';');
			} else {
				line.push(ch);
			}
		};


		result = [];
		line = [];

		i = 0;
		next();
		while (i <= source.length) { // less than or equal, because i is always one ahead
			ch = peek;
			next();

			// HTML special chars.
			switch (ch) {
			case '<':
				line.push('&lt;');
				break;
			case '>':
				line.push('&gt;');
				break;
			case '&':
				line.push('&amp;');
				break;
			case '"':
				line.push('&quot;');
				break;
			case "'":
				line.push('&#39;');
				break;
			default:
				// If the output is intended for display,
				// then end lines on newlines, and replace tabs with spaces.
				if (display) {
					switch (ch) {
					case '\r':
						// If this \r is the beginning of a \r\n, skip over the \n part.
						if (peek === '\n') {
							next();
						}
						endline();
						break;
					case '\n':
						endline();
						break;
					case '\t':
						// expand tabs?
						if(tabs >= 0){
							spaces = tabs - (line.length % tabs);
							for (s = 0; s < spaces; s += 1) {
								line.push(' ');
							}
						} else{
							//otherwise: preserve tabs
							push('&#9;');
						}
						break;
					default:
						// All other characters can be dealt with generically.
						push();
					}
				} else {
					// If the output is not for display,
					// then none of the characters need special treatment.
					push();
				}
			}
		}
		endline();

		// If you can't beat 'em, join 'em.
		result = result.join('<br />');

		if (display) {
			// Break up contiguous blocks of spaces with non-breaking spaces
			result = result.replace(/ {2}/g, ' &nbsp;');
		}

		// tada!
		return result;
	};

	return {
		htmlEncode: htmlEncode,
		escapeQuotes: escapeQuotes,
		unescapeQuotes: unescapeQuotes,
		escapeDoubleQuotes: escapeDoubleQuotes,
		unescapeDoubleQuotes: unescapeDoubleQuotes
	};

});
