


define(['util/extend', 'parserModule'],
/**
 * Extends the parser-module with helper functions for
 * storing/restoring compiled templates (eHTML -> layout, view, partial etc)
 *
 * Dependencies:
 *  
 *  alternatively: set <code>mmir.parser.CLASS_EXTENDER</code> with an object that 
 *  exposes a function <tt>extend(obj1,obj1)</tt>, i.e.
 *  
 *  <code>mmir.parser.CLASS_EXTENDER.extend(obj1, obj2)</code>
 * 
 * @class
 * @name StorageUtils
 * @memberOf mmir.parser
 * 
 */		
function(extend, parser){

/**
 * @public
 * @constant
 * @memberOf mmir.parser
 */
var STORAGE_FILE_FORMAT_NUMBER = 2;
parser.STORAGE_FILE_FORMAT_NUMBER = STORAGE_FILE_FORMAT_NUMBER;

/**
 * Creates the appropriate object from a JSON-like <tt>storedObject</tt>.
 * 
 * <p>
 * NOTE that in difference to a real JSON object, the <tt>storedObject</tt> 
 * may contain function definitions.
 * 
 * <p>
 * The storedObject must have a String property <strong>classConstructor</strong>
 * <ul>
 * 	<li>that must correspond to a constructor function (which will be invoked with <tt>new</tt>)</li>
 * 	<li>the constructor function must be invokable without parameters</li>
 * 	<li>the constructor function must be accessable from the global namespace
 * 		(or <tt>classConstuctor</tt> must contain the code for retrieving the constructor
 * 		 function from the global namespace)</li>
 * </ul>
 * 
 * 
 * <p>
 * If <tt>storedObject</tt> contains a function <tt>init</tt>, then this function will be invoked
 * before returning the new newly created object.
 * 
 * 
 * @function
 * @static
 * @public
 * @memberOf mmir.parser
 * 
 * @param {Object} storedObject 
 * 				    a JSON-like object with fields and functions (which will be transfered to the returned object).
 * @param {Boolean} [isTriggerPublish] OPTIONAL
 * 					if <code>true</code> then the restore function call
 * 					<code>initPublish()</code> on the restored object before returning.
 * 					This should only be <code>true</code> for the root-object
 * 					(e.g. the View-object or Partial-object; nested objects should NOT invoke
 * 					 restoreObject() with this argument set to true).
 * @param {Number} [fileFormatNo] OPTIONAL
 * 					NOTE: if argument <code>isTriggerPublish</code> was used with value <code>true</code>,
 * 						  then this argument MUST be used too!
 * 					If the number given does not match {@link parser.STORAGE_FILE_FORMAT_NUMBER}
 * 					the file format is assumed to be out-dated and an Error will be thrown.
 * @returns {Object} 
 *          an new instance created with the constructor <tt>classConstructor</tt> and
 * 			set with all properties (fields and functions) from <tt>storedObject</tt>.
 * 
 * @throws Error if <code>fileFormatNo</code> does not match STORAGE_FILE_FORMAT_NUMBER.
 * 
 */
function restoreObject(storedObject, isTriggerPublish, fileFormatNo){
	
	if(isTriggerPublish && fileFormatNo != parser.STORAGE_FILE_FORMAT_NUMBER){
		
		throw new Error('Compiled template file has wrong format: need file with format version '
				+ parser.STORAGE_FILE_FORMAT_NUMBER +', but got: '+ fileFormatNo
				+ '. Please re-compile views / templates.'
		);
		
	}
	
	var classExtender = {};
	if(parser.CLASS_EXTENDER && typeof parser.CLASS_EXTENDER.extend === 'function'){
		classExtender = parser.CLASS_EXTENDER;
	}
	else {
		classExtender = {extend: extend};
	}
	
	
	//NOTE: for require-ing to work, all Classes (i.e. JS-files) need to already have been loaded & required (i.e. "async-required" once before)
	var constructor = require(storedObject.classConstructor);
	
	var obj = classExtender.extend( new constructor(), storedObject);
	if(typeof obj.init === 'function'){
		obj.init();
	}
	
	if(isTriggerPublish && typeof obj.initPublish === 'function'){
		obj.initPublish();
	}
	
	return obj;
};
parser.restoreObject = restoreObject;

/**
 * Creates String-representations (JSON-like) for the specified properties and appends them to the StringBuffer.
 * 
 * <p>
 * This function iterates over the Array <tt>propertyNames</tt>:
 * If a property with that name exists in <tt>obj</tt>, a JSON-like String-representation is generated
 * and appended at the end of the array <tt>stringBuffer</tt>.
 * <br>
 * Multiple representations are separated by comma entry <code>','</code> in <tt>stringBuffer</tt>.
 * <br>
 * The last entry in <tt>stringBuffer</tt> is a comma entry <code>','</code> if at least one property 
 * entry was inserted in <tt>stringBuffer</tt>.
 * 
 * <p>
 * NOTE that the String-representation inserted into <tt>stringBuffer</tt> may not have a 1:1 correspondence
 * with properties (only the last entry is guaranteed to be <code>','</code>, if a property was inserted).
 * <br>
 * For pratical use, the returned (or modified) <tt>stringBuffer</tt> should be converted into a String
 * e.g. by <code>stringBuffer.join('')</code>.
 * 
 * 
 * @function
 * @static
 * @public
 * @memberOf mmir.parser
 * 
 * @param {Object} obj 
 * 				the object, that contains the properties for which String representations should be generated.
 * @param {Array<String>} propertyNames 
 * 				the names of the properties, for which String-representations should be generated.
 * @param {Array<String>} stringBuffer 
 * 				the buffer: String-representations will be appended as entries at the end of the buffer
 * @param {String} [propertyNamePostfix] 
 * 				OPTIONAL if present, this postfix will be appended to each property name, before processing it.
 * 				This is a convenience method, e.g. if all properties in <tt>propertyNames</tt> should end with
 * 				the same String / postfix.
 * @param {Function} [valueFunc] 
 * 				OPTIONAL by default, value representations are generated using the <code>JSON.stringify</code>
 * 				function. If instead this argument is present, this function will be invoked for creating
 * 				the string representation of the property-value.
 * 				The function signature is <code>valueFunc(propertyName : String, propertyValue : Object) : String</code>.
 * 				If the function returns <code>void</code>, then the corresponding property will not be added/stringified.
 * 
 * @returns {Array<String>} the modified <tt>stringBuffer</tt>
 * 
 * @requires JSON.stringify
 * 
 * @example
 * 
 * var obj = {
 * 	some: "properties",
 * 	including: function(arg1,arg2){ return 'functions' }
 * };
 * 
 * var sb = mobileDS.parser.appendStringified(obj, ['some'], []);
 * var str = sb.join(',');
 * //str will be: "some:\"properties\","
 * 
 */
function appendStringified(obj, propertyNames, stringBuffer, propertyNamePostfix, valueFunc){
	
	//"shift" arguments, if necessary
	if(typeof propertyNamePostfix === 'function' && ! valueFunc){
		valueFunc = propertyNamePostfix;
		propertyNamePostfix = null;
	}
	
	var prop, val;
	for(var i=0, size = propertyNames.length; i < size; ++i){
		prop = propertyNames[i];
		
		if(propertyNamePostfix){
			prop += propertyNamePostfix;
		}

		if(typeof obj[prop] === 'undefined'){
			continue;
		}
		
		
		if(valueFunc){
			val = valueFunc(prop, obj[prop]);
		}
		else {
			val = JSON.stringify(obj[prop]);
		}
		
		if(typeof val === 'undefined'){
			continue;
		}
		
		stringBuffer.push( prop );
		stringBuffer.push( ':' );
		stringBuffer.push( val );

		stringBuffer.push( ',' );
	}
	
	return stringBuffer;
};
parser.appendStringified = appendStringified;

return parser;

});//END: define(..., function(){