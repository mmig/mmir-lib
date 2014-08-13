
/**
 * sets up the runtime environment:
 * 
 * loads the Corodva library if necessary.
 */
define(['env', 'module'], function(env, module) {
	
	var isBrowserEnv = env.isBrowserEnv;

	//FIXME
	if( ! isBrowserEnv){
		require(['cordova']);
	}
});
