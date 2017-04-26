define(function(){

	/** @memberOf util */
	function ToArray(obj){
		var list = obj.length? new Array(obj.length) : [];
		var i = 0;
		for(var k in Object.keys(obj)){
			list[i++] = obj[k];
		}
		return list;
	}
	
	return ToArray;
});
