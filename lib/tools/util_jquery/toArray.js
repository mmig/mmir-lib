/**
 * toArray implementation
 *
 * NOTE: due to more universal conversion capabilities, Array.from() is used
 *       instead of jQuery.makeArray() which is targeted at jQuery's internal
 *       array-like structures, but may not convert other iterable objects
 *       like Set
 *
 * NOTE: for older browser/execution environments, the vendor directory contains
 *       a polyfill for Array.from() (see es6-map-set-polyfill.js)
 *
 */
define(function(){
	return Array.from;
});
