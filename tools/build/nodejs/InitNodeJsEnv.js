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
 * General initializer for NodeJS JavaScript environment 
 */

if (!window) {
	var window = module;
	global.window = window;
}

if(!console.debug){
	console.debug = function (text){
		console.log('[DEBUG] '+text);
	};
}
if(!console.info){
	console.info = function (text){
		console.log('[INFO] '+text);
	};
}
if(!console.warn){
	console.warn = function (text){
		console.log('[WARN] '+text);
	};
}
if(!console.error){
	console.error = function (text){
		console.log('[ERROR] '+text);
	};
}

var theArguments = process.argv;
for(var arguments_i=0,arguments_size=theArguments.length; arguments_i < arguments_size; ++arguments_i){
	console.log('node.js.env.arguments ('+arguments_i+'): '+ theArguments[arguments_i]);
}
