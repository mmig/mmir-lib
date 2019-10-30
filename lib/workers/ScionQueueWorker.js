
/**
 * This is a Worker script that is used as "threaded queue" for managing SCION event execution:
 *
 * New events for SCION are queued in order to allow raising new events from within SCION-event-processing.
 *
 * <p>
 * This "threaded queue" receives messages from the "Android environment engine" of
 * {@link mmir.DialogEngine} - see manager/dialog/engineConfig.js::_androidFactory.
 *
 * <p>
 * The message / work flow is as follows:
 * <ul>
 * 	<li>on receiving <code>newJob</code>: add new event-job to the queue</li>
 * 	<li>on receiving <code>readyForJob</code>:
 * 		<li>if queue is empty: does nothing</li>
 * 		<li>if queue is not empty: take next job from queue and send it as a <code>toDo</code> message to SCION</li>
 * 	</li>
 * </ul>
 *
 * @module workers/scionRaiseQueue
 */

if(typeof self === 'undefined' && typeof process !== 'undefined'){
	require('./nodeWorkerThreadsInit');
}

/**
 * @private
 */
var queue = [],
	readyForJob = true;

/**
 * Handler for received messages.
 *
 * @function
 * @param {Object} e the message object with<br>
 * 			{String} e.data.command the message type / name (e.g. <tt>readyForJob</tt>)<br>
 * 			{Object} [e.data.job] the job object (e.g. in case of command <tt>newJob</tt> the job that will be queued)
 *
 * @public
 */
self.onmessage = function(e){
	switch(e.data.command){
		case 'readyForJob':
			readyForJob = true;
			distributeJobs();
			break;
		case 'newJob':
			queue.push(e.data.job);
			distributeJobs();
			break;
	}
};

/**
 * Handler for sending messages.
 *
 * <p>
 * In case of <code>readyForJob</code>:
 * take next job and send it to SCION, i.e. post a message <tt>e</tt> with <br>
 *
 * 	{String} e.data.command = <tt>toDo</tt>)<br>
 * 	{Object} e.data.toDo the job object (that was added before to the queue with command / message <tt>newJob</tt>)
 *
 *
 * @function
 * @private
 */
function distributeJobs(){
	if (readyForJob && queue.length > 0){
		readyForJob = false;
		var job = queue.shift();
		self.postMessage({
			command: 'toDo',
			toDo : job
		});
	}
};
