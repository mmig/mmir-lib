/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
	if (readyForJob && queue.length>0){
		readyForJob = false;
		var job = queue.shift();
		postMessage({command: 'toDo',
			toDo : job});
	}
};