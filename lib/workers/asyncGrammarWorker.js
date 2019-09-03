
typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD?
				require('./workerUtil.js') :
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

		if(options && options.stopwords){
			this.setStopwords(langCode, options.stopwords);
		}
	},

	setStopwords: function(langCode, stopwordList){

		self.postMessage({cmd: 'stopwords', id: langCode, stopwords: stopwordList});
	},

	execQuery: function(text, langCode, opt, cmdId){

		var grammarData = this._grammars[langCode];
		if(!grammarData){
			postError('no grammar available for "'+langCode+'"');
		}

		var result = grammarData.exec(text, opt);

		self.postMessage({cmd: 'parseresult', cmdId: cmdId, result: result});
	}

};

self.require = function(name){
	if (name === 'mmirf/semanticInterpreter') return semanticInterpreterImpl;
	else console.error('unknown module: "'+name+'"');
};

self.onmessage = function(e){

	var data = e.data;
	switch(data.cmd){
		case 'load':
			load(data.url, data.id);
			break;
		case 'init':
			init(data.text, data.id);
			break;
		case 'parse':
			parse(data.text, data.id, data.options, data.cmdId);
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

function init(phrase, id){
	semanticInterpreterImpl.execQuery(phrase, id, 'init');
}

function parse(phrase, id, opt, cmdid){
	semanticInterpreterImpl.execQuery(phrase, id, opt, cmdid);
};
