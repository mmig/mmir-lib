
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
define(function() {
	
	var isNodeJsEnv = false;
	if(typeof process !== 'undefined' && process.argv){
		isNodeJsEnv = true;
	}

	return {
		  isBrowserEnv: true,
		  isCordovaEnv: false,
		  isNodeJsEnv: isNodeJsEnv
	};
});
