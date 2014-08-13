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


/* NOTE:
 * This script is required to run in the context of an ANT build script.
 * 
 * 
 * Script for generating a String that contains a comma-separated list
 * of language codes.
 * The list contains only language code, for which a JSON-grammar file can be found
 * in the respective config/language directory.
 * 
 * The script requires the input produced by AntScriptFileListGenerator.js in 
 * env-variable ${JSONDirString}, that is a "stringified" JSON-object 
 * containing the directory-structure:
 * 
 * This script, then searches for the entry of the "/config/languages" 
 * (from env-variable ${grammarDefinitionJsonDir} ) entry which
 * contains the sub-direcotries for all languages.
 * Then the entries for the found languages are scanned, if they contain a grammar-JSON file
 * (which's name is taken form env-variable ${grammarDefinitionJsonFile}). 
 * 
 */

function echo(text){
	var echo = project.createTask("echo");
	echo.setMessage(text);
	echo.perform();
}

var strDirList = project.getProperty("JSONDirString");
var jsonDirList;
//try to avoid eval() -> use JSON if available
if(typeof JSON !== 'undefined'){
	jsonDirList = JSON.parse(strDirList);
}
else {
	jsonDirList = eval('var dummy='+strDirList+';dummy');
}

var baseLanguageDir = project.getProperty("grammarDefinitionJsonDir");
var grammarFileName = project.getProperty("grammarDefinitionJsonFile");
echo('language directory: '+baseLanguageDir);
echo('grammar JSON file name: '+grammarFileName);

var contains = function(array, entry){
	for(var i=0, size = array.length; i < size; ++i){
		if(array[i]==entry){
			return true;
		}
	}
	return false;
};


var result = [];

for(var prop in jsonDirList){
	var len = (""+baseLanguageDir).length - prop.toString().length - 1;
//	echo('matched index for "'+prop+'": '+baseLanguageDir.indexOf(prop) +'\t '+len);
	if( baseLanguageDir.indexOf(prop) === len){
		echo('found language dir in file-struture list:' + prop+' -> '+jsonDirList[prop]);
		var list = jsonDirList[prop];
		for(var i=0, size = list.length; i < size; ++i){
			var langSubDir = list[i];
			var dir = prop+'/'+langSubDir;
			echo('\tchecking for JSON file in: '+dir);
			
			if(typeof jsonDirList[dir] !== 'undefined'){
				var content = jsonDirList[dir];
//				echo('\t\tlanguage dir contents: '+content);
				if(contains(content, grammarFileName)){

					echo('\t\tlanguage dir contains grammar JSON file!');
					result.push(langSubDir);
				}
			}
		}
	}
}

project.setProperty("grammarLanguageList",result.join(','));

echo("done, found grammar files for languages: "+result);