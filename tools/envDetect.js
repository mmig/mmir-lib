
/**
 * Exports the current runtime environment, by processing
 * the query-params of the URL (<code>window.location.search</code>
 * 
 *  currently supported settings are
 *  <ul>
 *  	<li>browser</li>
 *  	<li>android</li>
 *  </ul>
 *  
 *  @exports {Object} a singleton object with information about the runtime setting:
 *  		<pre>{ isBrowserEnv: [true|false] }</pre>
 */
define(['paramsParseFunc'], function(paramsParseFunc) {
	
	var params = paramsParseFunc( window.location.search );
	
	var isBrowserEnv;
	var isCordovaEnv;
	var envSetting = '';
	
	if(params.has('env')){
		envSetting = params['env'];
		
		if(envSetting === 'browser'){
			isBrowserEnv = true;
		}
		else {
			isBrowserEnv = false;
		}
		
		if(envSetting === 'cordova' || envSetting === 'android' || envSetting === 'ios'){
			isCordovaEnv = true;
			isBrowserEnv = false;
		}
		else {
			isCordovaEnv = false;
		}
	}
	else {
		isBrowserEnv = true;
		isCordovaEnv = false;
	}

	return {
		  isBrowserEnv: isBrowserEnv,
		  isCordovaEnv: isCordovaEnv,
		  envSetting: envSetting
//		, params : params
	};
});
