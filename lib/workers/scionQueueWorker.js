
/**
 * This is a Worker script that is used as "threaded queue" for managing SCION event execution:
 *
 * New events for SCION are queued in order to allow raising new events from within SCION-event-processing.
 *
 * <p>
 * This "threaded queue" receives messages from the "WebWorker environment engine" of
 * {@link mmir.dialogEngine} - see {@link mmir.state.StateEngineFactory.StateEngineWebWorkerImpl}.
 *
 * <p>
 * The message / work flow is as follows:
 * <ul>
 * 	<li>on receiving <code>queueJob</code>: add new event-job to the queue</li>
 * 	<li>on receiving <code>finishedJob</code>:
 * 		<li>if queue is empty: does nothing</li>
 * 		<li>if queue is not empty: take next job from queue and send it as a <code>processNextJob</code> message to SCION</li>
 * 	</li>
 * </ul>
 *
 * @module workers/scion-queue
 */

if(typeof self === 'undefined' && typeof process !== 'undefined'){
	require('./nodeWorkerThreadsInit');
}


/**
 * A JobQueue is an Array with additional property JobQueue.readyForJob {Boolean}
 *
 * @private
 * @interface
 * @name JobQueue
 * @augments Array
 * @property {Boolean} readyForJob flag that indicates if queue is ready for the next job.
 *
 * @see ~Job
 * @see Array
 */

/**
 * the Job object, describing jobs on a JobQueue
 *
 * @private
 * @interface
 * @name Job
 * @property {Number | String} [engineId] the engine's ID for which this job should be queued
 * @property {String} [event] OPTIONAL the event name (must be present for command "queueJob")
 * @property {any} [eventData] OPTIONAL event data
 *
 * @see ~JobQueue
 */

/**
 * dictionary of <code>jobId -> JobQueue</code>
 *
 * @private
 * @type {PlainObject}
 *
 * @see ~JobQueue
 */
var queues = {};

/**
 * Handler for received messages.
 *
 * @function
 * @name onmessage
 * @param {Object} evt the message object with<br>
 * @param {"finishedJob" | "queueJob" | "destroyQueue"} evt.data.command the message type / name (e.g. <tt>finishedJob</tt>)<br>
 * @param {Number | String} evt.data.engineId Number the engine's ID for which this job should be queued
 * @param {module:workers/scion-queue~Job} [evt.data.job] the job object (e.g. in case of command <tt>queueJob</tt> the job that will be queued)
 *
 * @public
 * @memberOf module:workers/scion-queue#
 */
self.onmessage = function(evt){
	var data = evt.data;
	var queue = getQueue(data.engineId, data.command !== 'destroyQueue');
	switch(data.command){
		case 'finishedJob':
			queue.readyForJob = true;
			distributeJobs(queue);
			break;
		case 'queueJob':
			queue.push(data.job);
			distributeJobs(queue);
			break;
		case 'destroyQueue':
			delete queues[data.engineId];
			break;
		default:
			console.warn('ScionQueueWorker: received unknown message ', evt);
	}
};

/**
 * HELPER get queue for an engine (ID)
 *
 * @function
 * @private
 *
 * @param  {Number | String} engineId the engine ID
 * @param  {Boolean} [isCreate] if TRUE, the queue will be created if it does not exist yet
 * @return {module:workers/scion-queue~JobQuee} the queue for the engineId (if isCreate is FALSE, and no queue exits for the engineId, it will return UNDEFINED)
 */
function getQueue(engineId, isCreate){
	var queue;
	if(queues[engineId]){
		queue = queues[engineId];
	} else if(isCreate){
		queue = new Array();
		queue.readyForJob = true;
		queues[engineId] = queue;
	}
	return queue;
}

/**
 * Handler for sending messages.
 *
 * <p>
 * In case of <code>finishedJob</code>:
 * take next job for the engine-queue and send it to SCION, i.e. post a message <tt>e</tt> with <br>
 *
 * 	{String} event.data.command = <tt>processNextJob</tt><br>
 * 	{Object} event.data.job the job object (that was added before to the queue with command / message <tt>queueJob</tt>
 *
 *
 * @function
 * @public
 * @param {module:workers/scion-queue~JobQueue} queue the job queue
 */
function distributeJobs(queue){
	if(queue.readyForJob && queue.length > 0){
		readyForJob = false;
		var job = queue.shift();
		self.postMessage({
			command: 'processNextJob',
			job: job
		});
	}
};
