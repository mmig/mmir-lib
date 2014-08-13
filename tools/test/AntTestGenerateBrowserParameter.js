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
 * Generates a string from the properties given in the config file.
 * This string is used to specify on which browsers the tests should run
 * - by using the "- -browser" option.
 * This script required to run in the context of an ANT build script.
 */

function lengthOfProperty(prop){
	var strprop = project.getProperty(prop);
	if (strprop != null){
		return strprop.length();
	}
	return 0;
}

var browserstr="";
var first=true;

// Firefox
if (project.getProperty("config.browser.firefox.found") == "true"){
	if (first != true){
		browserstr+=','
	}
	first=false;
	browserstr+='"'+ project.getProperty("browser.firefox")+'"';
} else if (lengthOfProperty("browser.firefox") > 0){
	project.log("WARNING: Browser-Path wrong: '" + project.getProperty("browser.firefox") + "' not found - omit this browser.",1);
}

if (project.getProperty("config.browser.iexplore.found") == "true"){
	if (first != true){
		browserstr+=','
	}
	first=false;
	browserstr+='"'+ project.getProperty("browser.iexplore")+'"';
}else if (lengthOfProperty("browser.iexplore") > 0){
	project.log("WARNING: Browser-Path wrong: '" + project.getProperty("browser.iexplore") + "' not found - omit this browser.",1);
}

if (project.getProperty("config.browser.chrome.found") == "true"){
	if (first != true){
		browserstr+=','
	}
	first=false;
	browserstr+='"'+ project.getProperty("browser.chrome")+'"';
}else if (lengthOfProperty("browser.chrome") > 0){
	project.log("WARNING: Browser-Path wrong: '" + project.getProperty("browser.chrome") + "' not found - omit this browser.",1);
}

if (project.getProperty("config.browser.opera.found") == "true"){
	if (first != true){
		browserstr+=','
	}
	first=false;
	browserstr+='"'+ project.getProperty("browser.opera")+'"';
}else if (lengthOfProperty("browser.opera") > 0){
	project.log("WARNING: Browser-Path wrong: '" + project.getProperty("browser.opera") + "' not found - omit this browser.",1);
}

if (project.getProperty("config.browser.safari.found") == "true"){
	if (first != true){
		browserstr+=','
	}
	first=false;
	browserstr+='"'+ project.getProperty("browser.safari")+'"';
}else if (lengthOfProperty("browser.safari") > 0){
	project.log("WARNING: Browser-Path wrong: '" + project.getProperty("browser.safari") + "' not found - omit this browser.",1);
}

project.setProperty("config.browser.args", browserstr);
