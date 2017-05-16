/*
 * 	Copyright (C) 2012-2016 DFKI GmbH
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

importScripts('workerUtil.js');

var semanticInterpreterImpl = {
	
	_grammars: {},
	
	addGrammar: function(langCode, grammarFunc, options){
		
		var grammarData = this._grammars[langCode];
		
		if(!grammarData){
			
			grammarData = {
				id: langCode,
				exec: grammarFunc
			};
			
			this._grammars[langCode] = grammarData;
			
		} else {
			
			grammarData.exec = grammarFunc;
			
		}
		
		self.postMessage({cmd: 'setgrammar', id: langCode, options: options});
	},
	
	setStopwords: function(langCode, stopwordList){
		
		self.postMessage({cmd: 'stopwords', id: langCode, stopwords: stopwordList});
	},
	
	execQuery: function(text, langCode, cmdId){
		
		var grammarData = this._grammars[langCode];
		if(!grammarData){
			postError('no grammar available for "'+langCode+'"');
		}
		
		var result = grammarData.exec(text);
		
		self.postMessage({cmd: 'parseresult', cmdId: cmdId, result: result});
	}
	
};

require = function(name){
	if (name === 'mmirf/semanticInterpreter') return semanticInterpreterImpl;
	else console.error('unknown module: "'+name+'"');
};

self.onmessage = function(e){
	
  switch(e.data.cmd){
  	case 'load':
  	  load(e.data.url, e.data.id);
  	  break;
    case 'init':
      init(e.data.text, e.data.id);
      break;
    case 'parse':
      parse(e.data.text, e.data.id, e.data.cmdId);
      break;
  }
  
};

function postError(msg){
	self.postMessage({cmd: 'error', message: msg});
}

function load(compiledGrammarUrl, id){
	var libPath = getPath(compiledGrammarUrl);
	importScripts( libPath );
}

/**
 * sets the config and echos back
 * @param config
 * @private
 */
function init(phrase, id){
	semanticInterpreterImpl.execQuery(phrase, id, 'init');
}

function parse(phrase, id, cmdid){
	semanticInterpreterImpl.execQuery(phrase, id, cmdid);
};
