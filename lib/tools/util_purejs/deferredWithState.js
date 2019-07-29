
define(function(){

	function DeferredWithState(){
		var state = 'pending';
		var __res, __rej;
		var p = new Promise(function(_resolve, _reject){
			__res = _resolve;
			__rej = _reject;
		});
		p.resolve = function(){
			state = 'resolved';
			__res.apply(null, arguments);
		}
		p.reject  = function(){
			state = 'rejected';
			__rej.apply(null, arguments);
		};
		p.state = function(){
			return state;
		}

		return p;
	}

	return DeferredWithState;
});
