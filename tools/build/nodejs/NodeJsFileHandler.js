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
 * This JavaScript is expected to run in the node.js environment
 * 
 * SETTINGS:
 *  - isDebugOutput: disable debugging output (console) by setting global variable isDebugOutput to FALSE
 *  
 * EXPORTS:
 * 	- creates global variable FILE_SYSTEM that hold the NodeJS file-system module reference (module js).
 */

var FILE_SYSTEM = require('fs');

var isDebugOutput = typeof isDebugOutput !== 'undefined'? isDebugOutput : true; 

/*
 * see loadLocalFile in IFileHandler.js
 */
function loadLocalFile(path, type){
	
	if(FILE_SYSTEM.existsSync(path) === false){
		throw new Error('error reading file '+path+': file does not exist!');
	}
	
	var fileContent = FILE_SYSTEM.readFileSync(path, 'utf8');

	if(isDebugOutput) console.log('read contents from file: '+path);
	
	if(type && type === 'text'){
		return fileContent;
	}
	
	return JSON.parse(fileContent);
}

/*
 * see saveToFile in IFileHandler.js
 * 
 */
function saveToFile(str, path, doNotOverWrite, doCreateMissingDirectories){
	
	if(typeof str !== 'string'){
		str = JSON.stringify(str, null, '  ');
	}
	
	var isCreateMissingDirs = doCreateMissingDirectories === false? false: true;
	if(isCreateMissingDirs){
		var mkDirList = [];
		var lastIndex = path.lastIndexOf('/');
		if(lastIndex !== -1){
			var dirPath = path.substring(0,lastIndex);
			var isDirExisting = FILE_SYSTEM.existsSync(dirPath);
			if(isDebugOutput) console.log('    writing: dir "'+dirPath+'" for file exists? -> '+isDirExisting);
			if( ! isDirExisting){
				
				mkDirList.push(dirPath);
				
				lastIndex = dirPath.lastIndexOf('/');
				while(lastIndex !== -1){
					dirPath = path.substring(0,lastIndex);
					
					if( ! FILE_SYSTEM.existsSync(dirPath)){
						mkDirList.push(dirPath);
						lastIndex = dirPath.lastIndexOf('/');
					}
					else {
						lastIndex = -1;
					}
				}
			}
		}
		
		if(mkDirList.length > 0){
			if(isDebugOutput) console.log('  creating missing dirs before writing file '+path+': '+mkDirList.join(', '));
			for(var i=mkDirList.length-1; i >= 0; --i){
				var dirPath = mkDirList[i];
				if(isDebugOutput) console.log('    writing: creating dir for '+dirPath);
				FILE_SYSTEM.mkdirSync(dirPath);
			}
		}
	}
	
	if(isDebugOutput) console.log('writing: file exists (overwriting)? '+FILE_SYSTEM.existsSync(path));
	
	if(doNotOverWrite && FILE_SYSTEM.existsSync(path)){
		return false;//////////////////////// EARLY EXIT ///////////////////////
	}
	
	var r = FILE_SYSTEM.createWriteStream(path
			//default options:
			,{	
				flags: 'w'
				, encoding: 'utf8'
//				, mode: 0666
			}
	);

//	r.write('\ufeff');//<- manually add BOM for indicating UTF-8 encoding
	r.write(str);
	r.end();
	r.destroySoon();
	
	console.log('wrote String (len '+str.length+') to file: '+path);
	return true;
}

if(typeof definejs !== 'undefined'){
	definejs('loadLocalFile', function(){ return loadLocalFile; });
	definejs('saveToFile', function(){ return saveToFile; });
}
