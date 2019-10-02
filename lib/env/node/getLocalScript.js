
//node implementation/replacement for commonUtils.getLocalScript
define(function(){

	return function __node__getLocalScript(scriptUrl, success, fail) {

		//force use of require() for loading scripts
		var uri = this.requireProtocol + scriptUrl;

		//try with "main" function for loading scripts:
		return this.loadScript(uri, success, fail);
	};
});
