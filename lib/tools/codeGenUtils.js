
/**
 * Utilities for handling generated code (e.g. grammars, views etc.)
 *
 * @name CodeGenUtils
 * @class
 * @memberOf mmir.tools
 * @static
 * @hideconstructor
 *
 * @example
 *  var codeGenUtils = mmir.require('mmirf/codeGenUtils');
 *  var prefixCode = codeGenUtils.getCodeWrapPrefix();
 *  //...
 *
 */
define(function(){
	return {
		/**
		 * Prefix for wrapping persisted objects:
		 *
		 * <ul>
		 *  <li> wraps code into a closure
		 *  </li><li> makes global namespace available as variable <code>global</code>
		 *  </li><li> makes mmirf/core available as variable <code>mmir</code> (if mmirf/core is present in global namespace)
		 *  </li><li> makes mmirf/core's require function available as <code>require</code> (if mmirf/core is present and has require function)
		 * </ul>
		 *
		 * @param  {Boolean} [disableStrictMode] OPTIONAL 	disable JavaScript strict mode in the generated closure
		 * 																								 (i.e. allow non-strict JS code in the generated code)
		 *
		 * @returns {String} the prefix code for closure-wrapping generated code (i.e. prepend to generated code)
		 *
		 * @see #getCodeWrapSuffix
		 *
		 * @public
		 * @function
		 * @memberOf mmir.tools.CodeGenUtils#
		 */
		getCodeWrapPrefix: function(disableStrictMode){

			return  ';(function(global){\n' +
								(disableStrictMode? '' : '"use strict";\n')+
								'var mmirName = typeof MMIR_CORE_NAME === "string"? MMIR_CORE_NAME : "mmir";\n'+
								'var mmir = global? global[mmirName] : void(0);\n'+
								'var require = mmir && mmir.require? mmir.require : (typeof requirejs !== "undefined"? requirejs : (global? global.require : require));\n';
		},
		/**
		 * Suffix for wrapping generated code in a closure:
		 *
		 * <ul>
		 *  <li> closes and self-calls closure
		 *  </li>
		 *  <li> sets global namespace to <code>window</code> (browser) or <code>self</code> (browser webworker) or <code>global</code> (node module)
		 *  		(via the closure function's argument)
		 *  </li>
		 * </ul>
		 *
		 * @returns {String} the suffix code for closure-wrapping of generated code (i.e. append to generated code)
		 *
		 * @see #getCodeWrapPrefix
		 *
		 * @public
		 * @function
		 * @memberOf mmir.tools.CodeGenUtils#
		 */
		getCodeWrapSuffix: function(){

			return '\n})(typeof window !== "undefined" ? window : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : this);\n';
		}
	}
});
