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
 * Initializer for Standalone Template Parser script (StandaloneTemplateParserExec.js)
 * in NodeJS environment.
 * 
 */


//disable console-output during "initializtion"
// -> re-enable before actually running the parser
consoleLogImpl = console.log; 
console.log = function(){};
consoleDebugImpl = console.debug; 
console.debug = function(){};

//retrieve command-line argument for assets-path -> create base-path
var theBasePath = theArguments[2] + 'www/';

forBrowser = theBasePath;

//require(['constants'], function(constants){
//	constants.init(theBasePath);
//});
//var constants = require('constants');


IS_DEBUG_ENABLED = false;
isDebugOutput = false;

mmir = {};
window.mmir = mmir;

mmir.LanguageManager = {};
mmir.LanguageManager.getInstance = function dummyLangMang (){ return mmir.LanguageManager; };
mmir.LanguageManager.getText = function dummyGetText (id) {return 'dummy-text-'+id;};
mmir.LanguageManager.getLanguage = function dummyGetLang () {return 'NA';};

