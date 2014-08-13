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

/*
 * NOTE: This file only specifies / documents the interface definition (API)
 * 		 For implementations, see xxxFileHanlder.js files.
 */

/**
 * Loads a file from the file system synchronously.
 * 
 * @param {String} path the path to the file
 * @param {String} [type] OPTIONAL: the content type.
 * 						  Valid values are:
 * 						    <code>"json", "text"</code>
 * 						  DEFAULT: if omitted or unknown value, the default <code>"json"</code> is used
 * @returns {String|Object} the contents of the read file. The type for the return value
 * 							corresponds to the requested <code>type</code> argument.
 * 
 * @function loadLocalFile
 * @public
 */
function loadLocalFile(path, type){}

/**
 * Saves a file to the file system synchronously.
 * 
 * @param {String} str the content, that is saved to the file as String 
 * @param {String} path the path to the file
 * @param {Boolean} [doNotOverWrite] OPTIONAL: if <code>true</code>, the file will 
 * 											   not be created if it already exists
 * 									 DEFAULT: <code>false</code>, i.e. file will be
 * 										      overwritten, if it exists.
 * @param {Boolean} [doCreateMissingDirectories] OPTIONAL:  if <code>true</code> missing directories
 * 												for the target path are created before
 * 												  writing the file.
 * 												if <code>false</code> missing
 * 												  directories will prove an error
 * 									DEFAULT: <code>true</code>
 * 
 * @returns {Boolean} <code>true</code> if file was written
 * 
 * @function saveToFile
 * @public
 */
function saveToFile(str, path, doNotOverWrite, doCreateMissingDirectories){}