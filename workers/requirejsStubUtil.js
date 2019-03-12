
/////////////// stub for define()/require() //////////////////////////////
// NOTE only single-requires are supported here! (i.e. no lists of required modules)

var _modules = {
	_idgen: 1,
	_customid: '',//<- set custom ID for next loaded module (will be reset after loading)
	_defined: {},
	_get: function(id){
		return this._defined[id];
	}
};

self.define = function(deps, moduleCreateFunc){
	if(typeof deps === 'function'){
		moduleCreateFunc = deps;
		deps = null;
	} else {
		var err;
		if(typeof deps === 'string'){
			err = 'invalid define: must be anonymous, but tried to set module ID '+deps;
		} if(deps && deps.length > 0) {
			err = 'invalid define: must not request dependencies, but requested '+JSON.stringify(deps);
		}
		if(err){
			self.postMessage({
			  init: false,
			  error: err + ' - ' + (new Error().stack)
		  });
		}
	}

	var modId;
	if(_modules._customid){
		modId = _modules._customid;
		_modules._customid = '';
	} else {
		modId = moduleCreateFunc.name? moduleCreateFunc.name : 'mod'+(this._idgen++);
	}
	_modules._defined[modId] =  moduleCreateFunc();
};
self.define.amd = true;

self.require = function(id, cb){
	if(cb){
		return cb(_modules._get(id));
	}
	return _modules._get(id);
};
