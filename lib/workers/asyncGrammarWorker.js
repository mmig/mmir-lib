
/**
 * worker for async-grammar execution
 *
 * @module workers/async-grammar
 * @requires workers/worker-utils
 *
 * @see mmir.grammar.AsyncGrammar
 */

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

		if(result && result.error && typeof result.error === 'object'){
			//-> convert error to string
			var errStr = result.error.stack.toString();
			var stack;
			if((stack = result.error.stack)){
				if(typeof stack === 'string' && stack.indexOf(errStr) !== -1){
					errStr = stack;
				} else if(stack !== errStr){
					errStr += ', ' + result.error.stack;
				}
			}
			result.error = errStr;
		}

		self.postMessage({cmd: 'parseresult', cmdId: cmdId, result: result});
	}

};

self.require = function(name){
	if (name === 'mmirf/semanticInterpreter') return semanticInterpreterImpl;
	else postError('asyncGrammarWorker: required unknown module: "'+name+'"');
};

self.onmessage = function(e){

	var data = e.data;
	switch(data.cmd){
		case 'parse':
			parse(data.text, data.id, data.options, data.cmdId);
			break;
		case 'load':
			load(data.url, data.libUrl, data.id);
			break;
		case 'init':
			init(data.text, data.id);
			break;
		case 'eval':
			evalGrammar(data.code, data.libUrl, data.id);
			break;
	}

};

function postError(msg){
	console.error(msg);
	self.postMessage({cmd: 'error', message: msg});
}

function load(compiledGrammarUrl, mmirBaseUrl, id){

	var libPath, loadErr;
	if(typeof WEBPACK_BUILD === 'undefined' || !WEBPACK_BUILD){
		libPath = getPath(compiledGrammarUrl, mmirBaseUrl);
		try {
			importScripts(libPath);
		} catch(err){
			loadErr = err;
		}
	} else {
		libPath = id;
		try {
			//-> webpack placeholder ID: will be resolved during webpack-build to all grammars that are configured for async-exec
			require('./<mmir-async-grammar-exec>/'+libPath);
		} catch(_err){
			try {
				//fallback: try grammar resource ID
				__webpack_require__(compiledGrammarUrl);
			} catch(_err2){
				try {
					//fallback: try cleaned grammar resource ID
					__webpack_require__(compiledGrammarUrl.replace(/\.js$/i, ''));
				} catch(err){
					libPath = './' + libPath + '" or "' + compiledGrammarUrl + '" or "' + compiledGrammarUrl.replace(/.\js$/i, '');//<- add error/debug details for all tried IDs/files
					loadErr = err;
				}
			}
		}
	}

	if(loadErr){
		var errMsg = 'ansync grammar execution (web worker) load ERROR: failed to load script "'+libPath+'" (for grammar '+id+') ';
		var errStack = loadErr.stack || '';

		postError(errMsg + errStack);
	}

}

function evalGrammar(grammarCode, _mmirBaseUrl, id){
	try {
		eval(grammarCode);
	} catch(err){
		var errMsg = 'ansync grammar execution (web worker) eval ERROR: failed to evaluate grammar code/script (for grammar '+id+') ';
		var errStack = err.stack || '';

		postError(errMsg + errStack);
	}
}

function init(phrase, id){
	semanticInterpreterImpl.execQuery(phrase, id, 'init');
}

function parse(phrase, id, opt, cmdid){
	semanticInterpreterImpl.execQuery(phrase, id, opt, cmdid);
};
