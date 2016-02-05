
var _makeArray = function(obj) {
	var list = [];
	for(var i in obj){
		list.push(obj[i]);
	}
	return list;
};

var defaultOptions = {};
var _getOptions = function(opt){
	return opt? opt : defaultOptions;
};

function verifyInit(engine, engineId, taskId){
	
	if(!engine){
		self.postMessage({error: 'ReferenceError: parser-compiler "'+engineId+'" is not initialized yet!', level: 'error', id: taskId});
		return false;
	}
	
	return true;
}

/**
 * initialized the compiler and sends init-complete message when finished
 * 
 * @param {PlainObject} config
 * 			configuration with property <code>config.engineUrl</code> (String)
 * @private
 */
function init(config){
	
  if (config.engineUrl){
	  
	  _init(config.engineUrl);
	  self.postMessage({init: true});
	  
  } else {

	  self.postMessage({
		  init: false,
		  error: 'Could not load library for parser-compiler: missing property engineUrl in configuration: '+JSON.stringify(config)
	  });
  }
}
