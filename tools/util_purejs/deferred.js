define(function(){

	/** @memberOf util */
	function Deferred(){
		var __res, __rej;
		var p = new Promise(function(_resolve, _reject){
			__res = _resolve;
			__rej = _reject;
		});
		p.resolve = __res;
		p.reject  = __rej;

		return p;
	}

	return Deferred;
});
