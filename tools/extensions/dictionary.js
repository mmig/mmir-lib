/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

define(
	//this comment is needed by jsdoc2 [copy of comment for: function Dictionary(...]
	/**
	 * A dictionary (or map) for key-value storage and access.
	 * @name Dictionary
	 * @class
	 */
	function(){

//set to @ignore in order to avoid doc-duplication in jsdoc3
/**
 * @ignore
 * 
 * A dictionary (or map) for key-value storage and access.
 * @constructs Dictionary
 */
function Dictionary() {

	/**
	 * "map" for the dictionary
	 * 
	 * @private
	 * 
	 * @memberOf Dictionary#
	 */
	var map = {};

	/**
	 * This list contains the "keys" of all current entries in <tt>map</tt>.
	 * 
	 * @private
	 * 
	 * @memberOf Dictionary#
	 */
	var keyList = [];

	/**
	 * Prefix for keys in internal MAP object, for avoiding overwrite of
	 * existing Object properties/functions
	 * 
	 * @constant
	 * @private
	 * 
	 * @memberOf Dictionary#
	 */
	var KEY_PREFIX = '$$';

	/**
	 * Helper function that creates the actual lookup key.
	 * 
	 * The "lookup key" is original key with applied key-prefix.
	 * 
	 * @param {String} key
	 * 			the key (without the internal key prefix)
	 * @returns {String}
	 * 			the key prefixed with the internal key prefix
	 * 
	 * @private
	 * 
	 * @memberOf Dictionary#
	 */
	var lookupKey = function(key) {
		return KEY_PREFIX + key;
	};

	/** @lends Dictionary.prototype */
	return {
		/**
		 * Put / add an entry to the dictionary.
		 * 
		 * @param {String}
		 *            key the lookup key for the value
		 * @param {any}
		 *            value the value to store
		 * 
		 * @public
		 * 
		 * @memberOf Dictionary.prototype
		 */
		put : function(key, value) {

			var isAlreadyPresent = this.containsKey(key);

			var lKey = lookupKey(key);
			map[lKey] = value;

			if (!isAlreadyPresent) {
				keyList.push(lKey);
			}
		},
		/**
		 * Check if the dictionary contains an entry for a key.
		 * 
		 * @param {String}
		 *            key the lookup key to check
		 * @returns {Boolean} <code>true</code> if an entry exists, otherwise
		 *          <code>false</code>
		 * 
		 * @public
		 * @memberOf Dictionary.prototype
		 */
		containsKey : function(key) {
			return typeof map[lookupKey(key)] !== 'undefined';
		},
		/**
		 * Check if the dictionary contains an entry with the value.
		 * 
		 * <p>
		 * NOTE that this function may execute rather slowly, with O(n).
		 * 
		 * @param {any}
		 *            value the value to check
		 * @param {Boolean}
		 *            [useStrict] if <code>true</code> entry-values are
		 *            checked against param <tt>value</tt> with
		 *            <code>===</code>. If <code>false</code> or omitted,
		 *            values are compared with each other using <code>==</code>.
		 * @returns {Boolean} <code>true</code> if an entry exists, otherwise
		 *          <code>false</code>
		 * 
		 * @public
		 * @memberOf Dictionary.prototype
		 */
		containsValue : function(value, useStrict) {
			for (var i = 0, size = keyList.length; i < size; ++i) {
				if (useStrict) {
					if (map[keyList[i]] === value) {
						return true;
					}
				} else {
					if (map[keyList[i]] == value) {
						return true;
					}
				}
			}
			return false;
		},
		/**
		 * Get the value for a key.
		 * 
		 * @param {String}
		 *            key the lookup key with was used to store the entry/value.
		 * @returns {any} the value for the <tt>key</tt>, or
		 *          <code>undefined</code> if the dictionary has no entry for
		 *          the <tt>key</tt>.
		 * 
		 * @public
		 * @memberOf Dictionary.prototype
		 */
		get : function(key) {
			return map[lookupKey(key)];
		},
		/**
		 * Remove an entry from the dictionary.
		 * 
		 * <p>
		 * NOTE that this may execute rather slowly, with O(n).
		 * 
		 * 
		 * @param {String}
		 *            key the lookup key for the entry to remove
		 * @returns {Boolean} <code>true</code> if the entry was removed. If
		 *          there was no entry for the <tt>key</tt> and nothing was
		 *          removed, <code>false</code> is returned.
		 * 
		 * @public
		 * @memberOf Dictionary.prototype
		 */
		remove : function(key) {

			if (this.containsKey(key)) {

				var lKey = lookupKey(key);

				// remove from map:
				map[lKey] = void(0);

				// remove from key-list
				for (var i = 0, size = keyList.length; i < size; ++i) {
					if (keyList[i] == lKey) {
						keyList.splice(i, 1);
						break;
					}
				}
				return true;
			}

			return false;
		},
		/**
		 * Get a list of the keys for all entries in the dictionary.
		 * 
		 * <p>
		 * The returned list has no specific ordering.
		 * 
		 * <p>
		 * NOTE that this may execute rather slowly, with O(n).
		 * 
		 * <p>
		 * NOTE that the returned list is no "view" for the keys, i.e. changes
		 * on this list will not be reflected by the dictionary's key-list.
		 * 
		 * @returns {Array<String>} a list of all keys
		 * @public
		 * @memberOf Dictionary.prototype
		 */
		getKeys : function() {
			var prefixLen = KEY_PREFIX.length;
			var size = keyList.length;
			var list = new Array(size);
			// create copy of keyList with removed key-prefixes:
			for (var i = 0; i < size; ++i) {
				list[i] = keyList[i].substring(prefixLen);
			}
			return list;
		},
		/**
		 * Get the size of the dictionary.
		 * 
		 * @returns {Number} the count of entries in the dictionary
		 * @public
		 * @memberOf Dictionary.prototype
		 */
		size : function() {
			return keyList.length;
		},
		/**
		 * Remove all entries from the dictionary.
		 * 
		 * <p>
		 * NOTE that this may execute rather slowly, with O(n).
		 * 
		 * @public
		 * @memberOf Dictionary.prototype
		 */
		clear : function() {
			// var size = keyList.length;
			// for(var i=0; i < size; ++i){
			// delete map[keyList[i]];
			// }
			// keyList.splice(0, size);
			map = void(0);
			map = {};
			keyList.splice(0, keyList.length);
		}
	};
};

return Dictionary;
});
