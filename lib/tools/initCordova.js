(function(){

	//TODO implement other / better mechanism for this:
	//	Cordova 3.x JS-file needs to be loaded before requirejs, but we also need to
	//  determine if cordova.js should be loaded at all ...
	//
	// this WORKAROUND has several drawbacks:
	//  * additional environment-checking (should be done only in one place/code -> see detectEnv.js)
	//  * the script-element for the cordova-lib is written as-is into the document

	var params = window.location.search;
	var isCordovaEnv = /env=(android|ios|cordova)/igm.test(params);
	//create script-element for cordova (only if run on Android):
	if(isCordovaEnv){
		var cordovaScript = '<script type="text/javascript" src="cordova.js"></script>';
		try {
			document.write(cordovaScript);
		} catch (_err) {
			document.currentScript.insertAdjacentHTML('beforebegin', cordovaScript);
		}
	}

})();
