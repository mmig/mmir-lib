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
 * Initializer for Standalone Grammar Generator script (StandaloneSemanticParserCompileExec.js)
 * in NodeJS environment.
 * 
 */

var theJSONGrammarPath 					= theArguments && theArguments.length > 2? theArguments[2] : null;
var theJSONGrammarFileName				= theArguments && theArguments.length > 3? theArguments[3] : null;
var theJSONGrammarLanguageStr 			= theArguments && theArguments.length > 4? theArguments[4] : null;
var theCompiledGrammarTargetPath		= theArguments && theArguments.length > 5? theArguments[5] : null;
var theCompiledGrammarTargetFileName	= theArguments && theArguments.length > 6? theArguments[6] : null;
var theRequireJsLibPath					= theArguments && theArguments.length > 7? theArguments[7] : null;

//initialize requirejs
var require = require(theRequireJsLibPath);

//create VAR for requirejs' define() function
var definejs = require.define;
