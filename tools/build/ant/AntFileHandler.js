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
 * This JavaScript is expected to run in the Rhino environment 
 * (or the default ANT JavaScript environment)
 * 
 * -> requires access to Java classes
 * 
 * 
 * SETTINGS:
 *  - isDebugOutput: disable debugging output (console) by setting global variable isDebugOutput to FALSE
 * 
 */

importClass(java.io.File);
importClass(java.io.FileInputStream);
//importClass(java.io.FileWriter);
importClass(java.io.InputStreamReader);
importClass(java.io.OutputStreamWriter);
importClass(java.io.FileOutputStream);
importClass(java.io.LineNumberReader);


var isDebugOutput = typeof isDebugOutput !== 'undefined'? isDebugOutput : true; 

/*
 * see loadLocalFile in IFileHandler.js
 */
function loadLocalFile(path, type){
	
	var f = new File(path);
	
	if(f.exists() === false){
		throw new Error('error reading file '+path+': file does not exist!');
	}
	
	var r = new LineNumberReader(new InputStreamReader( new FileInputStream(f), 'UTF-8'));
	
	var line;
	var theJSONgrammarString = '';
	while ((line = r.readLine()) != null) {
		theJSONgrammarString += line;
	}
	r.close();
	
	if(isDebugOutput) console.log('read contents from file: '+path);
	
	if(type && type === 'text'){
		return theJSONgrammarString;
	}
	
	return JSON.parse(theJSONgrammarString);
}

/*
 * see saveToFile in IFileHandler.js
 */
function saveToFile(str, path, doNotOverWrite, doCreateMissingDirectories){
	
	if(typeof str !== 'string'){
		str = JSON.stringify(str, null, '  ');
	}
	
	var f = new File(path);
	
	var isCreateMissingDirs = doCreateMissingDirectories === false? false: true;
	if(isCreateMissingDirs){
		var parentDir = f.getParentFile();
		if(!parentDir.exists()){
			if(isDebugOutput) console.log('  writing: creating missing dir '+parentDir.getAbsolutePath());
			parentDir.mkdirs();
		}
	}
	
	
	if(isDebugOutput) console.log('writing: file exists (overwriting)? '+f.exists());
	
	if(doNotOverWrite && f.exists()){
		return false;//////////////////////// EARLY EXIT ///////////////////////
	}
	
//	var r = new FileWriter(f, false);

	var r = new OutputStreamWriter( new FileOutputStream(f, false), 'UTF-8');
	
//	r.write('\ufeff');//<- manually add BOM for indicating UTF-8 encoding
	r.write(str);
	
	r.close();
	
	if(isDebugOutput) console.log('wrote String (len '+str.length+') to file: '+path);
	
	return true;
}
