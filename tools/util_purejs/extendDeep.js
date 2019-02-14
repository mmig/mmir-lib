define(['mmirf/util/isArray'], function(isArray){

	/*!
	 * (extracted (slightly modified) from)
	 * jQuery JavaScript Library v2.0.3
	 * http://jquery.com/
	 *
	 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2013-07-03T13:30Z
	 */
	var class2type = {
			"[object Boolean]": "boolean",
			"[object Number]": "number",
			"[object String]": "string",
			"[object Function]": "function",
			"[object Array]": "array",
			"[object Date]": "date",
			"[object RegExp]": "regexp",
			"[object Object]": "object",
			"[object Error]": "error"
	};

	var core_toString = class2type.toString,
			core_hasOwn = class2type.hasOwnProperty;

	var isFunction = function(obj) {
		return type(obj) === "function";
	};

	var isWindow = function(obj) {
		return obj != null && obj === obj.window;
	};

	var type = function(obj) {
		if (obj == null) {
			return String(obj);
		}
		return typeof obj === "object" || typeof obj === "function" ?
				class2type[core_toString.call(obj)] || "object" :
					typeof obj;
	};

	var isPlainObject = function(obj) {
		if (type(obj) !== "object" || obj.nodeType || isWindow(obj)) {
			return false;
		}

		try {
			if (obj.constructor && !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
				return false;
			}
		} catch (e) {
			return false;
		}

		return true;
	};

	var extend = function() {
		var options,
		name,
		src,
		copy,
		copyIsArray,
		clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}

		if (typeof target !== "object" && !isFunction(target)) {
			target = {};
		}

		if (length === i) {
			target = this;
			--i;
		}

		for (; i < length; i++) {
			if ((options = arguments[i]) != null) {
				for (name in options) {
					src = target[name];
					copy = options[name];

					if (target === copy) {
						continue;
					}

					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];

						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						target[name] = extend(deep, clone, copy);

					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		return target;
	};

	return extend;
});
