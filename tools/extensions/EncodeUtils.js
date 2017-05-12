define(function(){
	return {
		

		/**
		 * Encodes umlauts to <code>__{CHAR}[e|s]__</code>, e.g.
		 * <code>ä</code> to <code>__ae__</code>
		 * or
		 * <code>ß</code> to <code>__ss__</code>
		 * 
		 * @param {String|Object} target
		 * 							the String for wich all contained umlauts should be replaced with an encoded version.
		 * 							If this parameter is not a String, it will be converted using <code>JSON.stringify()</code>
		 * 							and the resulting String will be processed (may lead to errors if umlauts occur in "strange"
		 * 							places within the stringified object).
		 * @param {Boolean} [doAlsoEncodeUpperCase] OPTIONAL
		 * 							if <code>true</code>, then upper-case umlauts will be encoded, too
		 * 							DEFAULT: <code>false</code> (i.e. no encoding for upper-case umlauts)
		 * 		
		 * @returns {String|Object}
		 * 				the String with encoded umlauts.
		 * 				If the input argument <code>target</code> was an Object, the return value
		 * 				will also be an Object, for which the processing stringified Object is converted
		 * 				back using <code>JSON.parse()</code> (may lead to errors if umlauts occur in "strange"
		 * 				places within the stringified object).
		 */
		encodeUmlauts: function(target, doAlsoEncodeUpperCase){
			var isString = typeof target === 'string';
			var str;
			if(isString){
				str = target;
			}
			else {
				str = JSON.stringify(target);
			}
			
			//Java-Code:
			//	data = data.replaceAll("\u00E4", "__ae__");//HTML: &#228;
			//	data = data.replaceAll("\u00FC", "__ue__");//HTML: &#252;
			//	data = data.replaceAll("\u00F6", "__oe__");//HTML: &#246;
			//	data = data.replaceAll("\u00DF", "__ss__");//HTML: &#223;

			//	data = data.replaceAll("\u00C4", "__Ae__");//HTML: &#196;
			//	data = data.replaceAll("\u00DC", "__Ue__");//HTML: &#220;
			//	data = data.replaceAll("\u00D6", "__Oe__");//HTML: &#214;
			str = str.replace(/\u00F6/g,'__oe__').replace(/\u00E4/g,'__ae__').replace(/\u00FC/g,'__ue__').replace(/\u00DF/g,'__ss__');
			if(doAlsoEncodeUpperCase){
		    	str = str.replace(/\u00D6/g,'__Oe__').replace(/\u00C4/g,'__Ae__').replace(/\u00DC/g,'__Ue__');
			}
			
			if(isString){
				return str;
			}
			else {
				return JSON.parse(str);
			}
		},

		/**
		 * Decodes from <code>__{CHAR}[e|s]__</code> to umlauts, e.g.
		 * <code>__ae__</code> to <code>ä</code>
		 * or
		 * <code>__ss__</code> to <code>ß</code>
		 * 
		 * @param {String|Object} target
		 * 							the String for wich all contained umlauts-encoding should be replaced with the original umlauts.
		 * 							If this parameter is not a String, it will be converted using <code>JSON.stringify()</code>
		 * 							and the resulting String will be processed (may lead to errors if umlauts occur in "strange"
		 * 							places within the stringified object).
		 * @param {Boolean} [doAlsoEncodeUpperCase] OPTIONAL
		 * 							if <code>true</code>, then upper-case umlauts-encodings will be decoded, too
		 * 							DEFAULT: <code>false</code> (i.e. no decoding for upper-case umlauts-encodings)
		 * 		
		 * @returns {String|Object}
		 * 				the String with decoded umlauts-encodings (i.e. with the "original" umlauts).
		 * 				If the input argument <code>target</code> was an Object, the return value
		 * 				will also be an Object, for which the processing stringified Object is converted
		 * 				back using <code>JSON.parse()</code> (may lead to errors if umlauts occur in "strange"
		 * 				places within the stringified object).
		 */
		decodeUmlauts: function(target, doAlsoDecodeUpperCase){
			var isString = typeof target === 'string';
			var str;
			if(isString){
				str = target;
			}
			else {
				str = JSON.stringify(target);
			}
			
			str = str.replace(/__oe__/g,'\u00F6').replace(/__ae__/g,'\u00E4').replace(/__ue__/g,'\u00FC').replace(/__ss__/g,'\u00DF');
			if(doAlsoDecodeUpperCase){
		    	str = str.replace(/__Oe__/g,'\u00D6').replace(/__Ae__/g,'\u00C4').replace(/__Ue__/g,'\u00DC');
			}
			
			if(isString){
				return str;
			}
			else {
				return JSON.parse(str);
			}
		},
		
		/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true,
		plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
		/**
		 * HTML-Encode the supplied input
		 * 
		 * Parameters:
		 *
		 * @param {String} source    
		 *                     The text to be encoded.
		 * 
		 * @param {Boolean} [display] OPTIONAL
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
		 * @param {Number} [tabs] OPTIONAL
		 *                     The number of spaces to expand tabs to.  
		 *                     (Ignored if the 'display' parameter evaluates to false 
		 *                      or if tabs is not >= 0.)
		 *                      
		 *                     Default: undefined (do not replace tabs with spaces)
		 *                     
		 * @returns {String} the HTML encoded string
		 *
		 * version 2010-11-08 (modified: 2012-12-20)
		 */	
		htmlEncode: function (source, display, tabs) {
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
		}
	}
});