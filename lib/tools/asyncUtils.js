
/**
 * Helper for handling Web Workers "cross-environments"
 * @memberOf mmir.tools
 * @class AsyncUtils
 * @hideconstructor
 */
define(function() {

/**
 * HELPER for registering onmessage listener on worker instance
 *        regardless of execution environment
 *
 * supported enviornments:
 *  * web/browser/html5 (incl. electron)
 *  * node.js (worker_threads, webworker-threads)
 *
 * @param  {Worker} worker the web worker instance
 * @param  {Function} onmessage the onmessage listener: <pre>onmessage(event)</pre>
 *
 * @function
 * @memberOf mmir.tools.AsyncUtils.private
 * @private
 */
function registerOnMesssage(worker, onmessage){
	if(typeof worker.on === 'function'){
		worker.on('message', function(data){ onmessage.call(worker, {data: data})});
	} else {
		worker.onmessage = onmessage;
	}
}

return {
	/**
	 * @copydoc mmir.tools.AsyncUtils.registerOnMesssage
	 * @function
	 * @public
	 */
	onMessage: registerOnMesssage
};

});
