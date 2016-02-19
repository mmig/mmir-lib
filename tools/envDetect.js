
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
	
	var env;
	if(isBrowserEnv){
		env = 'browser';
	} else {
	
		//if available, use plugin cordova-plugin-device for detecting specific env
		if(typeof device !== 'undefined' && device.platform){
			
			var platform = device.platform;
			if(/\bios\b/i.test(platform)){
				env = 'ios';
			} else if(/\bandroid\b/i.test(platform)){
				env = 'android';
			} else {//TODO handle other platforms
				console.warn('Unknown platform "'+platform+'"');
				env = 'default';
			}
			
		} else {
			
			//fallback: use UserAgent for detecting env
			var userAgent = navigator.userAgent;
			if(/(iPad|iPhone|iPod)/ig.test(userAgent)){
				env = 'ios';
			} else if(/android/i.test(userAgent)){
				env = 'android';
			} else {//TODO handle other platforms
				console.warn('Unknown platform for userAgent "'+userAgent+'"');
				env = 'default';
			}
			
		}
		
	}

	return {
		  isBrowserEnv: isBrowserEnv,
		  isCordovaEnv: isCordovaEnv,
		  envSetting: envSetting,
		  platform: env
//		, params : params
	};
});
