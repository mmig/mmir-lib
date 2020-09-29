
define(['mmirf/util/deferred', 'mmirf/util/extend', 'mmirf/resources', 'mmirf/configurationManager', 'mmirf/logger', 'mmirf/events', 'module'],
	/**
	 * The MediaManager gives access to audio in- and output functionality.
	 *
	 * Depending on its configuration, the MediaManager loads different implementation modules
	 * (<em>plugins</em>) that realize the interface-functions differently.
	 *
	 * See directory <code>mmirf/env/media</code> for available plugins.
	 *
	 * This "class" is a singleton - so that only one instance is in use.<br>
	 *
	 * @class
	 * @name MediaManager
	 * @memberOf mmir
	 * @static
	 * @hideconstructor
	 *
	 * TODO remove / change dependency on forBrowser: res.isBrowserEnv()!!!
	 */
	function(
		deferred, extend, res, configurationManager, Logger, EventEmitter, module
){
	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope mmir.MediaManager.prototype */

	/**
	 * The instance that holds the singleton MediaManager object.
	 * @private
	 * @type MediaManager
	 * @memberOf MediaManager#
	 */
	var instance = null;

	/**
	 * The logger for the MediaManager.
	 *
	 * Exported as <code>_log</code> by the MediaManager instance.
	 *
	 * @private
	 * @memberOf MediaManager#
	 */
	var logger = Logger.create(module);//initialize with requirejs-module information

	/**
	 * HELPER get list of require plugins for an environment
	 *
	 * supported environments: <default> | 'cordova'
	 *
	 * TODO do we need to differentiate between more environments?
	 *
	 * @param  {Boolean} isCordovaEnv TRUE for cordova-environments, otherwise FALSE
	 * @return {Array<PluginEntry>} the list of required PluginEntry object for the env
	 *
	 * @private
	 * @memberOf mmir.MediaManager#
	 */
	function getRequiredPlugins(isCordovaEnv){
		return isCordovaEnv? [{mod: 'cordovaAudio', type: 'audio'}] : [{mod: 'webAudio', type: 'audio'}];
	}

	/**
	 * default configuration for env-settings "browser" and "cordova":
	 *
	 *  -> may be overwritten by settings in the configuration file.
	 *  e.g. adding the following JSON data to config/configuration.json:
	 * <pre>
	 *     "mediaManager": {
	 *     	"plugins": {
	 *     		"browser": ["webAudio",
	 *     		            "webspeechAudioInput",
	 *     		            {"mod": "audiotts", "config": "ttsMary", "type": "tts"},
	 *     		            {"mod": "webspeechAudioInput", "type": "asr",                    "ctx": "chrome"}
	 *     		],
	 *     		"cordova": ["cordovaAudio",
	 *     		            "mmir-plugin-speech-nuance",
	 *     		            "mmir-plugin-speech-nuance/ttsAndroid",
	 *     		            {"mod": "mmir-plugin-speech-android", "type": "asr",             "ctx": "native"},
	 *     		            {"mod": "mmir-plugin-speech-android/ttsAndroid", "type": "tts",  "ctx": "native"},
	 *     		            {"mod": "audiotts", "config": "ttsMary", "type": "tts",          "ctx": "web"}
	 *     		]
	 *     	}
	 *     }
	 * </pre>
	 *
	 * @private
	 * @type PlainObject
	 *
	 * @memberOf MediaManager#
	 */
	var _defaultPlugins = {
		'browser': getRequiredPlugins(false).concat([
					{mod: 'webspeechAudioInput', type: 'asr'},
					{mod: 'audiotts', config: 'ttsMary', type: 'tts'}
		]),
		'cordova': getRequiredPlugins(true).concat([
					{mod: 'androidAudioInput', type: 'asr'},
					{mod: 'audiotts', config: 'ttsMary', type: 'tts'}
		])
	};




	/**
	 * Mapping for modules to default module configurations.
	 *
	 * This is mainly used for backwards compatibility, to map deprecated modules to their
	 * new/corresponding configuration.
	 *
	 * Maps a module name/file to the corresponding (new) module configuration.
	 *
	 * NOTE: The module's name/file are in lower case.
	 *
	 * TODO extract to loadable migration module
	 *
	 * @private
	 * @type PlainObject
	 *
	 * @memberOf MediaManager#
	 */
	var _pluginsConfig = {
		'marytexttospeech': {mod: 'audiotts', config: 'ttsMary', type: 'tts'},
		'html5audioinput':  {mod: 'webAudioInput', config: 'asrGoogleXhr', type: 'asr'},
		'webkitaudioinput':  {mod: 'webspeechAudioInput', type: 'asr'},
		'html5audiooutput':  {mod: 'webAudio', type: 'audio'},
		'cordovaaudiooutput':  {mod: 'cordovaAudio', type: 'audio'},
		'webaudiotexttospeech':  {mod: 'audiotts', config: 'ttsMary', type: 'tts'}
	};

		/**
		 * Mapping for modules' config:
		 *
		 * This is used for backwards compatibility, to map deprecated module config fields to their
		 * new/corresponding configuration.
		 *
		 * NOTE: The config name/file are in lower case.
		 *
		 * TODO extract to loadable migration module
		 *
		 * @private
		 * @type PlainObject
		 *
		 * @memberOf MediaManager#
		 */
	var _pluginsConfigConfig = {
		'webttsmaryimpl': 'ttsMary',
		// 'webttsnuanceimpl': 'ttsNuanceXhr',
		// 'ttsspeakJsimpl': 'ttsSpeakjs',
		// 'webasrgoogleimpl': 'asrGoogleXhr',
		// 'webasrnuanceimpl': 'asrNuanceXhr',
		// 'webasrnuancewsimpl': 'asrNuanceWs',
	};

	/**
	 * Reference to the core mmir-lib object.
	 *
	 * Do not use directly, or call {@link #_getMmir} at least once, in order to initialize this field.
	 *
	 * NOTE: the reference may be undefined, if the core is not visible in the global namespace.
	 *
	 *
	 * @private
	 * @type mmir
	 *
	 * @memberOf MediaManager#
	 *
	 * @see _getVersion
	 */
	var _mmirLib;

	/**
	 * Get the core mmir-lib from the global namespace.
	 *
	 * NOTE: may be undefined, if the core is not visible in the global namespace.
	 *
	 * @returns {mmir} the core mmir-lib
	 *                 (or undefined, if the mmir-lib is not available in the global namespace)
	 *
	 * @private
	 * @memberOf MediaManager#
	 */
	var _getMmir = function(){

		if(!_mmirLib){
			var mmirName = typeof MMIR_CORE_NAME === 'string'? MMIR_CORE_NAME : 'mmir';
			var ctx = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this;
			_mmirLib = ctx[mmirName];
		}

		return _mmirLib;
	};



	/**
	 * Load an media-module implementation from plugin file.
	 *
	 * @param {String} fileName
	 * 			the file-name of the media-module that will be loaded.
	 * 			The file needs to be located in {@link mmir.Resources#getMediaPluginPath}.
	 * 			If fileName does not end with suffix ".js", it will be added, before
	 * 			loading the file.
	 * @param {Function} successCallback
	 * @param {Function} failureCallback
	 * @param {String} [execId]
	 * 			the context-ID into which the implementation of the media-module will be loaded.
	 * 			If omitted or FALSY, the default context will be used.
	 * @param {any} [config]
	 * 			a configuration value that will be passed to the media-module upon its initialization
	 *
	 * @private
	 * @function
	 *
	 * @memberOf MediaManager#
	 */
	var loadPlugin = function loadPlugin(filePath, successCallback, failureCallback, execId, config){
		try {

			if((typeof WEBPACK_BUILD === 'undefined' || !WEBPACK_BUILD) && !/\.js$/i.test(filePath)){

				filePath += '.js';
			}

			var processLoaded = function(newMediaPlugin){

				newMediaPlugin.initialize(function(exportedFunctions){

					if(execId){

						//create new "execution context" if necessary
						if(typeof instance.ctx[execId] === 'undefined'){

							instance.ctx[execId] = {};

						}

						//import functions and properties into execution-context:
						var func;
						for(var p in exportedFunctions){

							if(exportedFunctions.hasOwnProperty(p)){

								//only allow extension of the execution-context, no overwriting:
								if(typeof instance.ctx[execId][p] === 'undefined'){

									func = exportedFunctions[p];
									if(typeof func === 'function'){

										//need to "re-map" the execution context for the functions,
										// so that "they think" they are actually executed within the MediaManager instance

										(function(mediaManagerInstance, originalFunc, name, context, ttsFieldExists){
											//NOTE need closure to "preserve" values of for-iteration
											mediaManagerInstance.ctx[context][name] = function(){
//					    								logger.log('executing '+context+'.'+name+', in context '+mediaManagerInstance,mediaManagerInstance);//DEBUG
												return originalFunc.apply(mediaManagerInstance, arguments);
											};

											//add alias 'tts' for 'textToSpeech'
											if(!ttsFieldExists && name === 'textToSpeech'){
												logger.error('outdated TTS plugin '+filePath+': plugin implementation should replace textToSpeech() with tts()!');
												mediaManagerInstance.ctx[context]['tts'] = mediaManagerInstance.ctx[context]['textToSpeech'];
											}

										})(instance, func, p, execId, exportedFunctions['tts']);

									}
									else {

										//for non-functions: just attach to the new "sub-context"
										instance.ctx[execId][p] = func;
									}

								} else {

									//if there already is a function/property for this in the execution-context,
									// print out an error:

									logger.error('MediaManager', 'loadPlugin',
										'cannot load implemantion for '+p+' of plugin "'+filePath+
											'" into execution-context "'+execId+
											'": context already exists!'
									);

								}


							}//END if(exportedFunctions<own>)

						}//END for(p in exprotedFunctions)


					}//END if(execId)
					else {
						extend(instance,exportedFunctions);
						//add alias 'tts' for 'textToSpeech'
						if(typeof exportedFunctions['textToSpeech'] === 'function' && !exportedFunctions['tts']){
							logger.error('outdated TTS plugin '+filePath+': plugin implementation should replace textToSpeech() with tts()!');
							instance['tts'] = exportedFunctions['textToSpeech'];
						}
					}

					if (successCallback) successCallback(filePath, exportedFunctions);

				}, instance, execId, config);


			};

			if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
				var modResult;
				filePath = filePath.replace(/\.js$/i, '');
				try {
					//TODO convert file-URLs to alias/module IDs and only use __webpack_require__ (& create include list when building from configuration.json)
					modResult = require('../env/media/'+filePath);
				} catch(err){
					//load filePath "raw" as module ID:
					modResult = __webpack_require__(filePath);
				}
				processLoaded(modResult);
			} else {
				require([res.getMediaPluginPath() + filePath], processLoaded, function(_err){
					//try filePath as module ID instead:
					var moduleId = filePath.replace(/\.js$/i, '');
					if(logger.isd()) logger.debug('failed loading plugin from file '+(res.getMediaPluginPath() + filePath)+', trying module ID ' + moduleId)
					require([moduleId], processLoaded, failureCallback)
				});
			}

		} catch (e){
			logger.error('Error loading MediaPlugin '+filePath+': '+e);
			if (failureCallback) failureCallback();
		}

	};

	/**
	 * @constructs MediaManager
	 * @memberOf MediaManager.prototype
	 * @private
	 * @ignore
	 */
	function constructor(){

		/**
		 * event emitter / manager for media events
		 *
		 * @private
		 * @type mmir.tools.EventEmitter
		 * @memberOf MediaManager.prototype
		 */
		var listener = new EventEmitter(null);

		/**
		 * event emitter / manager of listener-observers:
		 * observers get notified if a listener for event X gets added/removed
		 *
		 * @private
		 * @type mmir.tools.EventEmitter
		 * @memberOf MediaManager.prototype
		 */
		var listenerObserver = new EventEmitter(null);

		/**
		 * exported as addListener() and on()
		 *
		 * @private
		 * @memberOf MediaManager.prototype
		 */
		var addListenerImpl = function(eventName, eventHandler){

			if(listener.on(eventName, eventHandler)){
				//notify listener-observers for this event-type
				this._notifyObservers(eventName, 'added', eventHandler);
			}
		};
		/**
		 * exported as removeListener() and off()
		 *
		 * @private
		 * @memberOf MediaManager.prototype
		 */
		var removeListenerImpl = function(eventName, eventHandler){
			if(listener.off(eventName, eventHandler)){
				//notify listener-observers for this event-type
				this._notifyObservers(eventName, 'removed', eventHandler);
				return true;
			}
			return false;
		};

		/**
		 * Default execution context for functions:
		 *
		 * if not <code>falsy</code>, then functions will be executed in this context by default.
		 *
		 * @private
		 * @type String
		 * @memberOf MediaManager.prototype
		 */
		var defaultExecId = void(0);

		/** @lends mmir.MediaManager.prototype */
		return {

				/**
				 * A logger for the MediaManager and its plugins/modules.
				 *
				 * <p>
				 * This logger MAY be used by media-plugins and / or tools and helpers
				 * related to the MediaManager.
				 *
				 * <p>
				 * This logger SHOULD NOT be used by "code" that non-related to the
				 * MediaManager
				 *
				 * @name _log
				 * @type mmir.tools.Logger
				 * @default mmir.Logger (logger instance for mmir.MediaManager)
				 * @public
				 *
				 * @memberOf mmir.MediaManager#
				 */
				_log: logger,

				/**
				 * Execution context for plugins
				 *
				 * TODO add doc
				 *
				 * @name ctx
				 * @type Object
				 * @default Object (empty context, i.e. plugins are loaded into the "root context", and no plugins loaded into the execution context)
				 * @public
				 *
				 * @memberOf mmir.MediaManager#
				 */
				ctx: {},

				/**
				 * Wait indicator, e.g. for speech input:
				 * <p>
				 * provides 2 functions:<br>
				 *
				 * <code>preparing()</code>: if called, the implementation indicates that the "user should wait"<br>
				 * <code>ready()</code>: if called, the implementation stops indicating that the "user should wait" (i.e. that the system is ready for user input now)<br>
				 *
				 * <p>
				 * If not set (or functions are not available) will do nothing
				 *
				 * @type mmir.env.media.IWaitReadyIndicator
				 * @memberOf mmir.MediaManager#
				 *
				 * @default Object (no implementation set)
				 *
				 * @see #_preparing
				 * @see #_ready
				 *
				 * @memberOf mmir.MediaManager#
				 *
				 * @example
				 * //define custom wait/ready implementation:
				 * var impl = {
				 * 	preparing: function(str){
				 * 		console.log('Media module '+str+' is preparing...');
				 * 	},
				 * 	ready: function(str){
				 * 		console.log('Media module '+str+' is ready now!');
				 * 	}
				 * };
				 *
				 * //configure MediaManager to use custom implementation:
				 * mmir.MediaManager.waitReadyImpl = impl;
				 *
				 * //-> now plugins that call  mmir.MediaManager._preparing() and  mmir.MediaManager._ready()
				 * //   will invoke the custom implementation's functions.
				 */
				waitReadyImpl: {},

				//... these are the standard audioInput procedures, that should be implemented by a loaded module/file:

///////////////////////////// audio input API: /////////////////////////////
				/**
				 * Start speech recognition with <em>end-of-speech</em> detection:
				 *
				 * the recognizer automatically tries to detect when speech has finished and
				 * triggers the status-callback accordingly with results.
				 *
				 * @async
				 *
				 * @param {PlainObject} [options] OPTIONAL
				 * 		options for Automatic Speech Recognition:
				 * 		<pre>{
				 * 			  success: OPTIONAL Function, the status-callback (see arg statusCallback)
				 * 			, error: OPTIONAL Function, the error callback (see arg failureCallback)
				 * 			, language: OPTIONAL String, the language for recognition (if omitted, the current language setting is used)
				 * 			, intermediate: OTPIONAL Boolean, set true for receiving intermediate results (NOTE not all ASR engines may support intermediate results)
				 * 			, results: OTPIONAL Number, set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)
				 * 			, mode: OTPIONAL "search" | "dictation", set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)
				 * 			, eosPause: OTPIONAL "short" | "long", length of pause after speech for end-of-speech detection (NOTE not all ASR engines may support this option)
				 * 			, disableImprovedFeedback: OTPIONAL Boolean, disable improved feedback when using intermediate results (NOTE not all ASR engines may support this option)
				 * 		}</pre>
				 *
				 * @param {Function} [statusCallback] OPTIONAL
				 * 			callback function that is triggered when, recognition starts, text results become available, and recognition ends.
				 * 			The callback signature is:
				 * 				<pre>
				 * 				callback(
				 * 					text: String | "",
				 * 					confidence: Number | Void,
				 * 					status: "FINAL"|"INTERIM"|"INTERMEDIATE"|"RECORDING_BEGIN"|"RECORDING_DONE",
				 * 					alternatives: Array<{result: String, score: Number}> | Void,
				 * 					unstable: String | Void
				 * 				)
				 * 				</pre>
				 *
				 * 			Usually, for status <code>"FINAL" | "INTERIM" | "INTERMEDIATE"</code> text results are returned, where
				 * 			<pre>
				 * 			  "INTERIM": an interim result, that might still change
				 * 			  "INTERMEDIATE": a stable, intermediate result
				 * 			  "FINAL": a (stable) final result, before the recognition stops
				 * 			</pre>
				 * 			If present, the <code>unstable</code> argument provides a preview for the currently processed / recognized text.
				 *
				 * 			<br>NOTE that when using <code>intermediate</code> mode, status-calls with <code>"INTERMEDIATE"</code> may
				 * 			     contain "final intermediate" results, too.
				 *
				 * 			<br>NOTE: if used in combination with <code>options.success</code>, this argument will supersede the options
				 *
				 * @param {Function} [failureCallback] OPTIONAL
				 * 			callback function that is triggered when an error occurred.
				 * 			The callback signature is:
				 * 				<code>callback(error)</code>
				 *
				 * 			<br>NOTE: if used in combination with <code>options.error</code>, this argument will supersede the options
				 *
				 *
				 * @memberOf mmir.MediaManager#
				 */
				recognize: function(options, statusCallback, failureCallback){

					if(typeof options === 'function'){
						failureCallback = statusCallback;
						statusCallback = options;
						options = void(0);
					}

					var funcName = 'recognize';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Input: Speech Recognition is not supported.");
					}
					else {
						logger.error("Audio Input: Speech Recognition is not supported.");
					}
				},
				/**
				 * Start continuous speech recognition:
				 *
				 * The recognizer continues until {@link #stopRecord} is called.
				 *
				 * @async
				 *
				 * @param {PlainObject} [options] OPTIONAL
				 * 		options for Automatic Speech Recognition:
				 * 		<pre>{
				 * 			  success: OPTIONAL Function, the status-callback (see arg statusCallback)
				 * 			, error: OPTIONAL Function, the error callback (see arg failureCallback)
				 * 			, language: OPTIONAL String, the language for recognition (if omitted, the current language setting is used)
				 * 			, intermediate: OTPIONAL Boolean, set true for receiving intermediate results (NOTE not all ASR engines may support intermediate results)
				 * 			, results: OTPIONAL Number, set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)
				 * 			, mode: OTPIONAL "search" | "dictation", set how many recognition alternatives should be returned at most (NOTE not all ASR engines may support this option)
				 * 			, eosPause: OTPIONAL "short" | "long", length of pause after speech for end-of-speech detection (NOTE not all ASR engines may support this option)
				 * 			, disableImprovedFeedback: OTPIONAL Boolean, disable improved feedback when using intermediate results (NOTE not all ASR engines may support this option)
				 * 		}</pre>
				 *
				 * @param {Function} [statusCallback] OPTIONAL
				 * 			callback function that is triggered when, recognition starts, text results become available, and recognition ends.
				 * 			The callback signature is:
				 * 				<pre>
				 * 				callback(
				 * 					text: String | "",
				 * 					confidence: Number | Void,
				 * 					status: "FINAL"|"INTERIM"|"INTERMEDIATE"|"RECORDING_BEGIN"|"RECORDING_DONE",
				 * 					alternatives: Array<{result: String, score: Number}> | Void,
				 * 					unstable: String | Void
				 * 				)
				 * 				</pre>
				 *
				 * 			Usually, for status <code>"FINAL" | "INTERIM" | "INTERMEDIATE"</code> text results are returned, where
				 * 			<pre>
				 * 			  "INTERIM": an interim result, that might still change
				 * 			  "INTERMEDIATE": a stable, intermediate result
				 * 			  "FINAL": a (stable) final result, before the recognition stops
				 * 			</pre>
				 * 			If present, the <code>unstable</code> argument provides a preview for the currently processed / recognized text.
				 *
				 * 			<br>NOTE that when using <code>intermediate</code> mode, status-calls with <code>"INTERMEDIATE"</code> may
				 * 			     contain "final intermediate" results, too.
				 *
				 * 			<br>NOTE: if used in combination with <code>options.success</code>, this argument will supersede the options
				 *
				 * @param {Function} [failureCallback] OPTIONAL
				 * 			callback function that is triggered when an error occurred.
				 * 			The callback signature is:
				 * 				<code>callback(error)</code>
				 *
				 * 			<br>NOTE: if used in combination with <code>options.error</code>, this argument will supersede the options
				 *
				 * @see #stopRecord
				 * @memberOf mmir.MediaManager#
				 */
				startRecord: function(options, statusCallback, failureCallback, isWithIntermediateResults){//TODO remove arg isWithIntermediateResults -> deprecated: use options instead

					if(typeof options === 'function'){
						isWithIntermediateResults = failureCallback;
						failureCallback = statusCallback;
						statusCallback = options;
						options = void(0);
					}

					var funcName = 'startRecord';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Input: Speech Recognition (recording) is not supported.");
					}
					else {
						logger.error("Audio Input: Speech Recognition (recording) is not supported.");
					}
				},
				/**
				 * Stops continuous speech recognition:
				 *
				 * After {@link #startRecord} was called, invoking this function will stop the recognition
				 * process and return the result by invoking the <code>succesCallback</code>.
				 *
				 * Note, that the <code>statusCallback</code> may not return an actual text result (i.e. the last
				 * text result may have been return in the <code>statusCallback</code> of the <code>startRecord()</code> call)
				 *
				 * @async
				 *
				 * @param {PlainObject} [options] OPTIONAL
				 * 		options for stopping the Automatic Speech Recognition:
				 * 		<pre>{
				 * 			  success: OPTIONAL Function, the status-callback (see arg statusCallback)
				 * 			, error: OPTIONAL Function, the error callback (see arg failureCallback)
				 * 		}</pre>
				 *
				 *
				 * @param {Function} [statusCallback] OPTIONAL
				 * 			callback function that is triggered when, recognition starts, text results become available, and recognition ends.
				 * 			The callback signature is:
				 * 				<pre>
				 * 				callback(
				 * 					text: String | "",
				 * 					confidence: Number | Void,
				 * 					status: "FINAL"|"INTERIM"|"INTERMEDIATE"|"RECORDING_BEGIN"|"RECORDING_DONE",
				 * 					alternatives: Array<{result: String, score: Number}> | Void,
				 * 					unstable: String | Void
				 * 				)
				 * 				</pre>
				 *
				 * 			Usually, for status <code>"FINAL" | "INTERIM" | "INTERMEDIATE"</code> text results are returned, where
				 * 			<pre>
				 * 			  "INTERIM": an interim result, that might still change
				 * 			  "INTERMEDIATE": a stable, intermediate result
				 * 			  "FINAL": a (stable) final result, before the recognition stops
				 * 			</pre>
				 * 			If present, the <code>unstable</code> argument provides a preview for the currently processed / recognized text.
				 *
				 * 			<br>NOTE that when using <code>intermediate</code> mode (as option in <code>startRecord()</code>),
				 * 				 status-calls with <code>"INTERMEDIATE"</code> may contain "final intermediate" results, too.
				 *
				 * @param {Function} [failureCallback] OPTIONAL
				 * 			callback function that is triggered when an error occurred.
				 * 			The callback signature is:
				 * 				<code>callback(error)</code>
				 *
				 *
				 * @see #startRecord
				 * @memberOf mmir.MediaManager#
				 */
				stopRecord: function(options, statusCallback, failureCallback){

					if(typeof options === 'function'){
						failureCallback = statusCallback;
						statusCallback = options;
						options = void(0);
					}

					var funcName = 'stopRecord';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Input: Speech Recognition (recording) is not supported.");
					}
					else {
						logger.error("Audio Input: Speech Recognition (recording) is not supported.");
					}
					},

					/**
					 * Cancel currently active speech recognition.
					 *
					 * Has no effect, if no recognition is active.
					 *
					 * @memberOf mmir.MediaManager#
					 */
				cancelRecognition: function(successCallback,failureCallback){

					var funcName = 'cancelRecognition';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Input: canceling Recognize Speech is not supported.");
					}
					else {
						logger.error("Audio Input: canceling Recognize Speech is not supported.");
					}
				},
					/**
					 * get list of supported languages for ASR (may not be supported by all plugins).
					 *
					 * @memberOf mmir.MediaManager#
					 */
				getRecognitionLanguages: function(successCallback,failureCallback){

					var funcName = 'getRecognitionLanguages';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Input: retrieving list of available languages not supported.");
					}
					else {
						logger.error("Audio Input: retrieving list of available languages not supported.");
					}
				},
///////////////////////////// audio output API: /////////////////////////////

				/**
				 * Play PCM audio data.
				 *
				 * @memberOf mmir.MediaManager#
				 */
					playWAV: function(blob, onPlayedCallback, failureCallback){

						var funcName = 'playWAV';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Output: play WAV audio is not supported.");
					}
					else {
						logger.error("Audio Output: play WAV audio is not supported.");
					}
				},
				/**
				 * Play audio file from the specified URL.
				 *
				 * @memberOf mmir.MediaManager#
				 */
				playURL: function(url, onPlayedCallback, failureCallback){

					var funcName = 'playURL';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Output: play audio from URL is not supported.");
					}
					else {
						logger.error("Audio Output: play audio from URL is not supported.");
					}
				},
				/**
				 * Play audio file from the specified URL or WAV data.
				 *
				 * Convenience function for {@link #playWAV} and {@link #playURL}:
				 * if first argument is a String, then <code>playURL</code> will be invoked,
				 * otherwise <code>playWAV</code>.
				 *
				 * @memberOf mmir.MediaManager#
				 */
				play: function(urlOrData, onPlayedCallback, failureCallback){
					if(typeof urlOrData === 'string'){
						return this.playURL.apply(this, arguments);
					} else {
						return this.playWAV.apply(this, arguments);
					}
				},
				/**
				 * Get an audio object for the audio file specified by URL.
				 *
				 * The audio object exports the following functions:
				 *
				 * <pre>
				 * play()
				 * stop()
				 * release()
				 * enable()
				 * disable()
				 * setVolume(number)
				 * getDuration()
				 * isPaused()
				 * isEnabled()
				 * </pre>
				 *
				 * NOTE: the audio object should only be used, after the <code>onLoadedCallback</code>
				 *       was triggered.
				 *
				 * @param {String} url
				 * @param {Function} [onPlayedCallback] OPTIONAL
				 * @param {Function} [failureCallback] OPTIONAL
				 * @param {Function} [onLoadedCallback] OPTIONAL
				 *
				 * @returns {mmir.env.media.IAudio} the audio
				 *
				 * @see {mmir.env.media.IAudio#_constructor}
				 *
				 * @memberOf mmir.MediaManager#
				 */
				getURLAsAudio: function(url, onPlayedCallback, failureCallback, onLoadedCallback){

					var funcName = 'getURLAsAudio';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Output: create audio from URL is not supported.");
					}
					else {
						logger.error("Audio Output: create audio from URL is not supported.");
					}
				},
				/**
				 * Get an audio object for the audio file specified by URL URL or by WAV data.
				 *
				 * NOTE that getWAVAsAudio may not be supported by all modules!
				 *
				 * Convenience function for {@link #getURLAsAudio} and {@link #getWAVAsAudio}:
				 * if first argument is a String, then <code>getURLAsAudio</code> will be invoked,
				 * otherwise <code>getWAVAsAudio</code> (if the module supports this function).
				 *
				 * @memberOf mmir.MediaManager#
				 */
				getAudio: function(urlOrData, onPlayedCallback, failureCallback, onLoadedCallback){
					if(typeof urlOrData === 'string'){
						return this.getURLAsAudio.apply(this, arguments);
					} else {
						return this.getWAVAsAudio.apply(this, arguments);
					}
				},
				/**
				 * Get an empty audio object. This can be used as dummy or placeholder
				 * for a "real" audio object.
				 *
				 * The audio object exports the following functions:
				 *
				 * <pre>
				 * play()
				 * stop()
				 * release()
				 * enable()
				 * disable()
				 * setVolume(number)
				 * getDuration()
				 * isPaused()
				 * isEnabled()
				 * </pre>
				 *
				 * Note:
				 *
				 * <code>enable()</code> and <code>disable()</code> will set the internal
				 * enabled-state, which can be queried via <code>isEnabled()</code>.
				 *
				 * <code>play()</code> and <code>stop()</code> will set the internal
				 * playing-state, which can be queried via <code>isPaused()</code>
				 * (note however, that this empty audio does not actually play anything.
				 *
				 * <code>setVolume()</code> sets the internal volume-value.
				 *
				 * <code>getDuration()</code> will always return <code>0</code>.
				 *
				 *
				 * @returns {mmir.env.media.IAudio} the audio
				 *
				 * @see {mmir.env.media.IAudio#_constructor}
				 * @memberOf mmir.MediaManager#
				 */
				createEmptyAudio: function(){
					return {
						_enabled: true,
						_play: false,
						_volume: 1,
						play: function(){ this._play = true; return false;},
						stop: function(){ this._play = false; return true;},
						enable: function(){ this._enabled = true; },
						disable: function(){ this._enabled = false; },
						release: function(){ this._enabled = false; },
						setVolume: function(vol){ this._volume = vol; },
						getDuration: function(){ return 0; },
						isPaused: function(){ return !this._play; },
						isEnabled: function(){ return this._enabled; }
					};
				},
///////////////////////////// text-to-speech API: /////////////////////////////

				/**
				 * Synthesizes ("read out loud") text.
				 *
				 * @param {String|Array<String>|PlainObject} [options] OPTIONAL
				 * 		if <code>String</code> or <code>Array</code> of <code>String</code>s
				 * 			  synthesizes the text of the String(s).
				 * 			  <br>For an Array: each entry is interpreted as "sentence";
				 * 				after each sentence, a short pause is inserted before synthesizing the
				 * 				the next sentence<br>
				 * 		for a <code>PlainObject</code>, the following properties should be used:
				 * 		<pre>{
				 * 			  text: String | String[], text that should be read aloud
				 * 			, pauseDuration: OPTIONAL Number, the length of the pauses between sentences (i.e. for String Arrays) in milliseconds
				 * 			, language: OPTIONAL String, the language for synthesis (if omitted, the current language setting is used)
				 * 			, voice: OPTIONAL String, the voice (language specific) for synthesis; NOTE that the specific available voices depend on the TTS engine
				 * 			, success: OPTIONAL Function, the on-playing-completed callback (see arg onPlayedCallback)
				 * 			, error: OPTIONAL Function, the error callback (see arg failureCallback)
				 * 			, ready: OPTIONAL Function, the audio-ready callback (see arg onReadyCallback)
				 * 		}</pre>
				 *
				 * @param {Function} [onPlayedCallback] OPTIONAL
				 * 			callback that is invoked when the audio of the speech synthesis finished playing:
				 * 			<pre>onPlayedCallback()</pre>
				 *
				 * 			<br>NOTE: if used in combination with <code>options.success</code>, this argument will supersede the options
				 *
				 * @param {Function} [failureCallback] OPTIONAL
				 * 			callback that is invoked in case an error occurred:
				 * 			<pre>failureCallback(error: String | Error)</pre>
				 *
				 * 			<br>NOTE: if used in combination with <code>options.error</code>, this argument will supersede the options
				 *
				 * @param {Function} [onReadyCallback] OPTIONAL
				 * 			callback that is invoked when audio becomes ready / is starting to play.
				 * 			If, after the first invocation, audio is paused due to preparing the next audio,
				 * 			then the callback will be invoked with <code>false</code>, and then with <code>true</code>
				 * 			(as first argument), when the audio becomes ready again, i.e. the callback signature is:
				 * 			<pre>onReadyCallback(isReady: Boolean, audio: IAudio)</pre>
				 *
				 * 			<br>NOTE: if used in combination with <code>options.ready</code>, this argument will supersede the options
				 *
				 * @memberOf mmir.MediaManager#
				 */
				tts: function(options, onPlayedCallback, failureCallback, onReadyCallback){

					if(typeof options === 'function'){
						onInitCallback = failureCallback;
						failureCallback = onPlayedCallback;
						onPlayedCallback = options;
						options = void(0);
					}

					var funcName = 'tts';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Output: Text To Speech is not supported.");
					}
					else {
						logger.error("Audio Output: Text To Speech is not supported.");
					}
				},

				/**
				 * @deprecated use {@link #tts} instead
				 * @memberOf mmir.MediaManager#
				 */
				textToSpeech: function(parameter, onPlayedCallback, failureCallback){

					var funcName = 'textToSpeech';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Output: Text To Speech is not supported.");
					}
					else {
						logger.error("Audio Output: Text To Speech is not supported.");
					}
				},
				/**
				 * Cancel current synthesis.
				 *
				 * @memberOf mmir.MediaManager#
				 */
				cancelSpeech: function(successCallback,failureCallback){

					var funcName = 'cancelSpeech';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Output: canceling Text To Speech is not supported.");
					}
					else {
						logger.error("Audio Output: canceling Text To Speech is not supported.");
					}
				},

					/**
					 * get list of supported languages for TTS (may not be supported by all plugins).
					 *
					 * @memberOf mmir.MediaManager#
					 */
				getSpeechLanguages: function(successCallback,failureCallback){

					var funcName = 'getSpeechLanguages';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Output: retrieving list of available languages not supported.");
					}
					else {
						logger.error("Audio Output: retrieving list of available languages not supported.");
					}
				},

					/**
					 * get list of supported voices for TTS (may not be supported by all plugins).
					 *
					 *
					 */
				/**
				 * get list of supported voices for TTS (may not be supported by all plugins).
				 *
				 * @param  {String | VoiceOptions} [options] OPTIONAL if String, the language code (optionally with country code)
				 * 																					for which the voices should be listed.
				 * 																				 if VoiceOptions:
				 * 																				   options.language: {String} OPTIONAL the language code
				 * 																				   options.details: {Boolean} OPTIONAL if TRUE the returned list contains
				 * 																				                    VoiceDetail objects with
				 * 																				                    {name: STRING, language: STRING, gender: "female" | "male" | "unknown"}
				 * @param  {Function} successCallback the success callback: successCallback(Array<String | VoiceDetail>)
				 * @param  {Function} failureCallback the error callback: failureCallback(err)
				 *
				 * @memberOf mmir.MediaManager#
				 */
				getVoices: function(options,successCallback,failureCallback){

					var funcName = 'getVoices';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else if(failureCallback){
						failureCallback("Audio Output: retrieving list of available voices not supported.");
					}
					else {
						logger.error("Audio Output: retrieving list of available voices not supported.");
					}
				},

///////////////////////////// ADDITIONAL (optional) functions: /////////////////////////////
				/**
				 * Set the volume for the speech synthesis (text-to-speech).
				 *
				 * @param {Number} newValue
				 * 				TODO specify format / range
				 *
				 * @memberOf mmir.MediaManager#
				 */
				setTextToSpeechVolume: function(newValue){

					var funcName = 'setTextToSpeechVolume';
					if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
						return this.ctx[defaultExecId][funcName].apply(this, arguments);
					}
					else {
						logger.error("Audio Output: set volume for Text To Speech is not supported.");
					}
				}


///////////////////////////// MediaManager "managing" functions: /////////////////////////////
				/**
				 * Adds the handler-function for the event.
				 *
				 * This function calls {@link #_notifyObservers} for the eventName with
				 * <code>actionType "added"</code>.
				 *
				 *
				 * Event names (and firing events) are specific to the loaded media plugins.
				 *
				 * TODO list events that the default media-plugins support
				 *   * "miclevelchanged": fired by AudioInput plugins that support querying the microphone (audio input) levels
				 *
				 * A plugin can tigger / fire events using the helper {@link #_emitEvent}
				 * of the MediaManager.
				 *
				 *
				 * Media plugins may observe registration / removal of listeners
				 * via {@link #_addListenerObserver} and {@link #_removeListenerObserver}.
				 * Or get and iterate over listeners via {@link #getListeners}.
				 *
				 *
				 *
				 *
				 * @param {String} eventName
				 * @param {Function} eventHandler
				 *
				 * @function
				 * @memberOf mmir.MediaManager#
				 */
				, addListener: addListenerImpl
				/**
				 * Removes the handler-function for the event.
				 *
				 * Calls {@link #_notifyObservers} for the eventName with
				 * <code>actionType "removed"</code>, if the handler
				 * was actually removed.
				 *
				 * @param {String} eventName
				 * @param {Function} eventHandler
				 *
				 * @returns {Boolean}
				 * 		<code>true</code> if the handler function was actually
				 * 		removed, and <code>false</code> otherwise.
				 *
				 * @function
				 * @memberOf mmir.MediaManager#
				 */
				, removeListener: removeListenerImpl
				/**
				 * Add an event listener.
				 *
				 * @param {String} eventName
				 * 				the name of the event
				 * @param {Function} eventHandler
				 * 				the event handler / callback function
				 *
				 *
				 * @function
				 * @memberOf mmir.MediaManager#
				 * @see #off
				 */
				, on: addListenerImpl
				/**
				 * Add an event listener.
				 *
				 * @param {String} eventName
				 * 				the name of the event
				 * @param {Function} eventHandler
				 * 				the event handler / callback function
				 *
				 * @function
				 * @memberOf mmir.MediaManager#
				 * @see #on
				 */
				, off: removeListenerImpl
				/**
				 * Get list of registered listeners / handlers for an event.
				 *
				 * @returns {Array<Function>} of event-handlers.
				 * 				Empty, if there are no event handlers for eventName
				 *
				 * @memberOf mmir.MediaManager#
				 */
				, getListeners: function(eventName){
					return listener.get(eventName) || [];
				}
				/**
				 * Check if at least one listener / handler is  registered for the event.
				 *
				 * @returns {Boolean} <code>true</code> if at least 1 handler is registered
				 * 					  for eventName; otherwise <code>false</code>.
				 *
				 * @memberOf mmir.MediaManager#
				 */
				, hasListeners: function(eventName){
					return listener.has(eventName);
				}
				/**
				 * Helper for firing / triggering an event.
				 * This should only be used by media plugins (that handle the eventName).
				 *
				 * @param {String} eventName
				 * @param {Array} argsArray
				 * 					the list of arguments with which the event-handlers
				 * 					will be called.
				 * @protected
				 * @memberOf mmir.MediaManager#
				 * @see #on
				 *
				 * @deprecated use {@link #_emitEvent} instead!
				 */
				, _fireEvent: function(eventName, argsArray){
					logger.warn('DEPRECATED: do NOT use mediaManager._fireEvent(type, argList) anymore, instead use use mediaManager._emitEvent(type, ...args)');
					var list = argsArray;
					if(list){
						list.unshift(eventName);
					} else {
						list = [eventName];
					};
					this._emitEvent.apply(this, list);
				}
				/**
				 * Helper for firing / triggering an event.
				 * This should only be used by media plugins (that handle the eventName).
				 *
				 * @param {String} eventName
				 * @param {...any} [args] OPTIONAL
				 * 					the arguments (event data) with which the event-handlers
				 * 					will be called.
				 * @protected
				 * @memberOf mmir.MediaManager#
				 * @see #on
				 * @example
				 * // will invoke listeners for "someevent":
				 * mmir.media._emitEvent('someevent');
				 * // will invoke listeners for "otherevent" with the 2 event data arguments:
				 * mmir.media._emitEvent('otherevent', withTwo, dataParameters);
				 */
				, _emitEvent: function(eventName, args){
					listener.emit.apply(listener, arguments);
				}
				/**
				 * Helper for notifying listener-observers about changes (adding/removing listeners).
				 * This should only be used by media plugins (that handle the eventName).
				 *
				 * @param {String} eventName
				 * @param {String} actionType
				 * 					the change-type that occurred for the event/event-handler:
				 * 					one of <code>["added" | "removed"]</code>.
				 * @param {Function} eventHandler
				 * 					the event-handler function that has changed.
				 *
				 * @protected
				 * @memberOf mmir.MediaManager#
				 * @see #on
				 * @see #off
				 */
				, _notifyObservers: function(eventName, actionType, eventHandler){//actionType: one of "added" | "removed"
					listenerObserver.emit.apply(listenerObserver, arguments);
				}
				/**
				 * Add an observer for registration / removal of event-handler.
				 *
				 * The observer gets notified,when handlers are registered / removed for the event.
				 *
				 * The observer-callback function will be called with the following
				 * arguments
				 *
				 * <code>(eventName, ACTION_TYPE, eventHandler)</code>
				 * where
				 * <ul>
				 *  <li>eventName: String the name of the event that should be observed</li>
				 *  <li>ACTION_TYPE: the type of action: "added" if the handler was
				 *      registered for the event, "removed" if the the handler was removed
				 *  </li>
				 *  <li>eventHandler: the handler function that was registered or removed</li>
				 * </ul>
				 *
				 * @param {String} eventName
				 * @param {Function} observerCallback
				 *
				 * @protected
				 * @see #_removeListenerObserver
				 * @memberOf mmir.MediaManager#
				 */
				, _addListenerObserver: function(eventName, observerCallback){
					listenerObserver.on(eventName, observerCallback);
				}
				/**
				 * Remove an observer that gets notified on registration / removal of event-handler.
				 *
				 * @protected
				 * @see #_addListenerObserver
				 * @memberOf mmir.MediaManager#
				 */
				, _removeListenerObserver: function(eventName, observerCallback){
					return listenerObserver.off(eventName, observerCallback);
				}
				/**
				 * Executes function <code>funcName</code> in "sub-module" <code>ctx</code>
				 * with arguments <code>args</code>.
				 *
				 * <p>
				 * If there is no <code>funcName</code> in "sub-module" <code>ctx</code>,
				 * then <code>funcName</code> from the "main-module" (i.e. from the MediaManager
				 * instance itself) will be used.
				 *
				 * @param {String} ctx
				 * 			the execution context, i.e. "sub-module", in which to execute funcName.<br>
				 * 			If <code>falsy</code>, the "root-module" will used as execution context.
				 * @param {String} funcName
				 * 			the function name
				 * @param {Array} args
				 * 			the arguments for function "packaged" in an array
				 *
				 * @throws {ReferenceError}
				 * 			if <code>funcName</code> does not exist in the requested Execution context.<br>
				 * 			Or if <code>ctx</code> is not <code>falsy</code> but there is no valid execution
				 * 			context <code>ctx</code> in MediaManager.
				 *
				 * @memberOf mmir.MediaManager#
				 * @example
				 *
				 *  //same as mmir.MediaManager.ctx.android.textToSpeech("...", function...):
				 * 	mmir.MediaManager.perform("android", "textToSpeech", ["some text to read out loud",
				 * 		function onFinished(){ console.log("finished reading."); }
				 * 	]);
				 *
				 *  //same as mmir.MediaManager.textToSpeech("...", function...)
				 *  //... IF the defaultExecId is falsy
				 *  //    (i.e. un-changed or set to falsy value via setDefaultExec())
				 * 	mmir.MediaManager.perform(null, "textToSpeech", ["some text to read out loud",
				 * 		function onFinished(){ console.log("finished reading."); }
				 * 	]);
				 *
				 */
				, perform: function(ctx, funcName, args){

					var func;

					if(!ctx){

						if(defaultExecId && typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
							func =  this.ctx[defaultExecId][funcName];
						}


					}
					else if(ctx && typeof this.ctx[ctx] !== 'undefined') {

						if(typeof this.ctx[ctx][funcName] !== 'undefined') {
							func = this.ctx[ctx][funcName];
						}

					} else {
						throw new ReferenceError('There is no context for "'+ctx+'" in MediaManager.ctx!');///////////////////////////// EARLY EXIT ////////////////////
					}


					if(!func){
						func = this[funcName];
					}


					if(typeof func === 'undefined'){
						throw new ReferenceError('There is no function '+funcName+' in MediaManager'+(ctx? ' context ' + ctx : (defaultExecId? ' default context ' + defaultExecId : '')) + '!');///////////////////////////// EARLY EXIT ////////////////////
					}

					return func.apply(this, args);
				}
				/**
				 * Returns function <code>funcName</code> from "sub-module" <code>ctx</code>.
				 *
				 * <p>
				 * If there is no <code>funcName</code> in "sub-module" <code>ctx</code>,
				 * then <code>funcName</code> from the "main-module" (i.e. from the MediaManager
				 * instance itself) will be returned.
				 *
				 * <p>
				 * NOTE that the returned functions will always execute within the context of the
				 * MediaManager instance (i.e. <code>this</code> will refer to the MediaManager instance).
				 *
				 *
				 * @param {String} ctx
				 * 			the execution context, i.e. "sub-module", in which to execute funcName.<br>
				 * 			If <code>falsy</code>, the "root-module" will used as execution context.
				 * @param {String} funcName
				 * 			the function name
				 *
				 * @throws {ReferenceError}
				 * 			if <code>funcName</code> does not exist in the requested Execution context.<br>
				 * 			Or if <code>ctx</code> is not <code>falsy</code> but there is no valid execution
				 * 			context <code>ctx</code> in MediaManager.
				 *
				 * @memberOf mmir.MediaManager#
				 * @example
				 *
				 *  //same as mmir.MediaManager.ctx.android.textToSpeech("...", function...):
				 * 	mmir.MediaManager.getFunc("android", "textToSpeech")("some text to read out loud",
				 * 		function onFinished(){ console.log("finished reading."); }
				 * 	);
				 *
				 *  //same as mmir.MediaManager.textToSpeech("...", function...):
				 *  //... IF the defaultExecId is falsy
				 *  //    (i.e. un-changed or set to falsy value via setDefaultExec())
				 * 	mmir.MediaManager.getFunc(null, "textToSpeech")("some text to read out loud",
				 * 		function onFinished(){ console.log("finished reading."); }
				 * 	);
				 *
				 */
				, getFunc: function(ctx, funcName){//this function performs worse for the "root execution" context, than perform(), since an additional wrapper function must be created

					var isRoot = false;

					if(!ctx){

						if(!defaultExecId){
							isRoot = true;
						}
						else {
							if(typeof this.ctx[defaultExecId][funcName] !== 'undefined'){
								return this.ctx[defaultExecId][funcName];/////////// EARLY EXIT //////////////////
							}
							else {
								isRoot = true;
							}
						}
					}

					if(ctx && typeof this.ctx[ctx] !== 'undefined'){
						if(!isRoot && typeof this.ctx[ctx][funcName] !== 'undefined'){
							return this.ctx[ctx][funcName];///////////////////////////// EARLY EXIT ////////////////////
						}
					}
					else {
						throw new ReferenceError('There is no context for "'+ctx+'" in MediaManager.ctx!');///////////////////////////// EARLY EXIT ////////////////////
					}

					//-> return the implementation of the "root execution context"

					if(typeof instance[funcName] === 'undefined'){
						throw new ReferenceError('There is no function '+funcName+' in MediaManager'+(ctx? ' context ' + ctx : (defaultExecId? ' default context ' + defaultExecId : '')) + '!');///////////////////////////// EARLY EXIT ////////////////////
					}

					//need to create proxy function, in order to preserve correct execution context
					// (i.e. the MediaManager instance)
					return function() {
						return instance[funcName].apply(instance, arguments);
					};

				},
				/**
				 * Set the default execution context.
				 *
				 * If not explicitly set, or set to a <code>falsy</code> value,
				 * then the "root" execution context is the default context.
				 *
				 * @param {String} ctxId
				 * 		the new default excution context for loaded media modules
				 * 		(if <code>falsy</code> the default context will be the "root context")
				 *
				 * @throws {ReferenceError}
				 * 			if <code>ctxId</code> is no valid context
				 *
				 * @memberOf mmir.MediaManager#
				 * @example
				 *
				 * //if context "nuance" exists:
				 * mmir.MediaManager.setDefaultCtx("nuance")
				 *
				 * // -> now the following calls are equal to mmir.MediaManager.ctx.nuance.textToSpeech("some text")
				 * mmir.MediaManager.perform(null, "textToSpeech", ["some text"]);
				 * mmir.MediaManager.getFunc(null, "textToSpeech")("some text");
				 *
				 * //reset to root context:
				 * mmir.MediaManager.setDefaultCtx(false);
				 *
				 * // -> now the following call is equal to mmir.MediaManager.textToSpeech("some text") again
				 * mmir.MediaManager.perform("textToSpeech", ["some text"]);
				 *
				 */
				setDefaultCtx: function(ctxId){
					if(ctxId && typeof instance.ctx[ctxId] === 'undefined'){
						throw new ReferenceError('There is no context for "'+ctxId+'" in MediaManager.ctx!');///////////////////////////// EARLY EXIT ////////////////////
					}
					defaultExecId = ctxId;
				},
				/**
				 * This function is called by media plugin implementations (i.e. modules)
				 * to indicate that they are preparing something and that the user should
				 * wait.
				 *
				 * <p>
				 * The actual implementation for <code>_preparing(String)</code> is given by
				 * {@link #waitReadyImpl}.preparing (if not set, then calling <code>_preparing(String)</code>
				 * will have no effect.
				 *
				 * @param {String} moduleName
				 * 			the module name from which the function was invoked
				 *
				 * @function
				 * @protected
				 * @memberOf mmir.MediaManager#
				 *
				 * @see #waitReadyImpl
				 * @see #_ready
				 */
				_preparing: function(moduleName){
					if(this.waitReadyImpl && this.waitReadyImpl.preparing){
						this.waitReadyImpl.preparing(moduleName);
					}
				},
				/**
				 * This function is called by media plugin implementations (i.e. modules)
				 * to indicate that they are now ready and that the user can start interacting.
				 *
				 * <p>
				 * The actual implementation for <code>_ready(String)</code> is given by the
				 * {@link #waitReadyImpl} implementation (if not set, then calling <code>_ready(String)</code>
				 * will have no effect.
				 *
				 * @param {String} moduleName
				 * 			the module name from which the function was invoked
				 *
				 * @function
				 * @protected
				 * @memberOf mmir.MediaManager#
				 *
				 * @see #waitReadyImpl
				 * @see #_ready
				 */
				_ready: function(moduleName){
					if(this.waitReadyImpl && this.waitReadyImpl.ready){
						this.waitReadyImpl.ready(moduleName);
					}
				}

		};//END: return{...

	};//END: constructor(){...


	//has 2 default configuarions:
	// if isCordovaEnvironment TRUE: use 'cordova' config
	// if FALSEy: use 'browser' config
	//
	// NOTE: this setting/paramater is overwritten, if the configuration has a property 'mediaPlugins' set!!!
	/**
	 * HELPER for init-function:
	 * 	determines, which plugins (i.e. files) should be loaded.
	 *
	 * <p>
	 * has 2 default configuarions:<br>
	 * if isCordovaEnvironment TRUE: use 'cordova' config<br>
	 * if FALSEy: use 'browser' config
	 * <p>
	 * OR<br>
	 * loads the list for the current environment (cordova or browser) that is set in configuration.json via <br>
	 * <pre>
	 * "mediaManager": {
	 * 		"cordova": [...],
	 * 		"browser": [...]
	 * }
	 * </pre>
	 *
	 * <p>
	 * Each entry may either be a String (file name of the plugin) or an Object with
	 * properties
	 * <pre>
	 * 	mod: <file name for the module> //String
	 * 	ctx: <an ID for the module>     //String
	 * </pre>
	 *
	 * If <b>String</b>: the functions of the loaded plugin will be attached to the MediaManager instance:
	 * <code>mmir.MediaManager.thefunction()</code>
	 * <br>
	 * If <b>{mod: plugin,ctx: theContextId}</b>: the functions of the loaded plugin will be attached to the "sub-module"
	 * to the MediaManager instance <em>(NOTE the execution context of the function will remain within
	 * the MediaManager instance, i.e. <code>this</code> will still refer to the MediaManager instance)</em>:
	 * <code>mmir.MediaManager.theId.thefunction()</code>
	 *
	 * <p>
	 * If plugins are loaded with an ID, you can use
	 * <code>mmir.MediaManager.getFunc(ctxId, func)(the, arguments)</code> or
	 * <code>mmir.MediaManager.perform(ctxId, func, [the, arguments])</code>:
	 * If the "sub-module" ctxId does not have the function func (i.e. no MediaManager.ctx.ctxId.func exists), then the default function
	 * in MediaManager will be executed (i.e.  MediaManager.func(the, arguments) ).
	 *
	 *
	 * @returns {Array<String>}
	 * 				the list of plugins which should be loaded
	 *
	 * @private
	 * @memberOf mmir.MediaManager#
	 */
	function getPluginsToLoad(configurationName){//if configurationName is omitted, then it is automatically detected

		var env = configurationName;

		var dataFromConfig = configurationManager.get('mediaManager.plugins');

		if(!env){

			var envSetting = res.getEnv();
			if(envSetting === 'cordova'){

				//try to find config for specific cordova-env
				envSetting = res.getEnvPlatform();
				if(envSetting !== 'default'){

					//if there is a config present for the specific envSetting, then use it:
					if((dataFromConfig && dataFromConfig[envSetting]) || _defaultPlugins[envSetting]){
						//if there is a config present for the envSetting, then use it:
						env = envSetting;
					}

				}

			} else if(dataFromConfig && dataFromConfig[envSetting]){
				//if there is a non-default config present for the envSetting, then use it
				//  if there is a deault config, then the env will also be a default one
				//  -> this will be detected by default-detection-mechanism below
				env = envSetting;
			}

			//if there is no env value yet, use default criteria browser vs. cordova env:
			if(!env){
				var isCordova = res.isCordovaEnv();
				if (isCordova) {
					env = 'cordova';
				} else {
					env = 'browser';
				}
			}

			//ASSERT env is non-empty String
		}

			var pluginArray;
		if (dataFromConfig && dataFromConfig[env]){
			pluginArray = dataFromConfig[env].slice();
		} else{
			pluginArray = _defaultPlugins[env].slice();
		}


		return pluginArray;
	}

		/**
		 * HELPER remove a plugin by its mod-field from a list of plugin-entries
		 *
		 * @param  {String} pluginModule the normalized plugin "mod" field (may end with ".js")
		 * @param  {Array<PluginEntry>} pluginList a list of plugin entries, i.e. {mod: "..." ...}
		 *
		 * @private
		 * @memberOf mmir.MediaManager#
		 */
		function removePlugin(pluginModule, pluginList){
			var size = pluginList? pluginList.length : 0;
			if(size === 0){
				return;
			}
			pluginModule = pluginModule.replace(/\.js/i, '');
			for(var i=size - 1; i >= 0; --i){
				if(pluginList[i].mod === pluginModule){
					pluginList.splice(i, 1);
					break;
				}
			}
		}


		/**
		 * HELPER verify that plugin list contains at least one entry of each required plugin or plugin-type
		 *        and if not, adds required plugin entry/type(s).
		 *
		 * 				If there is at least 1 entry in plugins that has not type-field, the HELPER returns FALSE,
		 * 				indicating that required plugins need to be added separately; however requiredPlugins may have been modified
		 * 				that is, entries removed, if the corresponding "mod"-field did match a required plugin.
		 *
		 * 				Otherwise, if TRUE is returned, plugins will contain all required plugins (that is: plugin-types).
		 * 				Any required plugin that was added from requiredPlugins, or was found in plugins, will be removed from requiredPlugins
		 *
		 * @param  {Array<PluginEntry>} plugins the list of specified plugin entries to load (NOTE "mod" name may not be normalized!); may get modified by adding required plugins
		 * @param  {Array<PluginEntry>} requiredPlugins the list of required plugins (that is plugin-types); may get modified by removing plugins that are already in plugins list
		 * @returns {Boolean} TRUE if plugins already contains all required plugin-types, or if the required plugins could be successfully added
		 *
		 * @private
		 * @memberOf mmir.MediaManager#
		 */
		function verifyRequiredPlugins(plugins, requiredPlugins){
			var isVerified = true;
			var entry, mod, rq;
			for(var i=plugins.length-1; i >= 0; --i){
				entry = plugins[i];
				mod = typeof entry === 'string'? mod : entry.mod;
				if(!entry.type){
					isVerified = false;
				}
				for(var j=requiredPlugins.length-1; j >= 0; --j){
					rq = requiredPlugins[j];
					if(mod === rq.mod || rq.type === entry.type){
						plugins.splice(i, 1);
					}
				}
				if(requiredPlugins.length === 0){
					break;
				}
			}
			var len = requiredPlugins.length;
			if(isVerified && len > 0){
				for(var i=0; i < len; ++i){
					plugins.unshift(requiredPlugins[i]);
				}
			}
			return isVerified || len === 0;
		}

	/**
	 *
	 * @private
	 * @memberOf mmir.MediaManager#
	 */
	function loadAllPlugins(pluginArray, successCallback, failureCallback){

		logger.verbose('loading media plugins: ', pluginArray);

		var count = (pluginArray && pluginArray.length) || 0;
		if(count === 0){
			logger.warn('empty plugin list');
			checkCompleted();
			return;////////////////// EARLY EXIT //////////////////////
		}

		function checkCompleted(){
			if (!pluginArray || count === 0){
				if (successCallback) {
					successCallback();
				} else {
						logger.debug('loadAllPlugins completed');
					}
				return;
			}
		}

		function onLoaded(pluginName, _pluginInstance){
			logger.verbose(pluginName + ' loaded!');
			--count;
			checkCompleted();
		};

		function onError(err){
			logger.error('Error loading' + (err.requireModules? ' ' + err.requireModules : '') + ': '+err, err);
			--count;
			checkCompleted();
			failureCallback && failureCallback;
		};

		var isCordova = res.isCordovaEnv();
		var requiredPlugins = getRequiredPlugins(isCordova);

		if(verifyRequiredPlugins(pluginArray, requiredPlugins)){
			requiredPlugins = null;
		}
		// pluginArray may have been modified by verifyRequiredPlugins() -> update count:
		count = pluginArray.length;

		var ctxId, config, newPluginName;
		for(var i = 0, size = count; i < size; ++i){
			newPluginName = pluginArray[i];

			if(newPluginName.mod){
				ctxId = newPluginName.ctx? newPluginName.ctx : void(0);
			config = newPluginName.config? newPluginName.config : void(0);
				newPluginName = newPluginName.mod;
			} else {
				ctxId = config = void(0);
			}

			//check if there is a "replacement" / default configuration for the requested module
			var legacyModule = newPluginName? _pluginsConfig[newPluginName.toLowerCase().replace(/\.js$/, '')] : null;
			if(legacyModule){
				ctxId  = ctxId  || legacyModule.ctxId;
				config = config || legacyModule.config;
				newPluginName = legacyModule.mod;
			}

			//check if there is a "replacement" for a requested string config-value
			config = typeof config === 'string' && config?
									_pluginsConfigConfig[config.toLowerCase().replace(/\.js$/, '')] || config
									: config;

			removePlugin(newPluginName, requiredPlugins);

			loadPlugin(newPluginName,
				onLoaded, onError,
				ctxId,
				config
			);

			if(i === size -1 && requiredPlugins && requiredPlugins.length > 0){

				if(logger.isi()) logger.info('required plugins for '+(isCordova? 'cordova' : 'default')+' environment were not explicitly specified, now loading required plugins: '+JSON.stringify(requiredPlugins));

				for(var j=0, rlen=requiredPlugins.length; j < rlen; ++j){
					++count;
					++size;
					pluginArray.push(requiredPlugins[j]);
				}
				requiredPlugins = null;
			}
		}
	}


	var _stub = {

		/** @scope MediaManager.prototype */

		//TODO add for backwards compatibility?:
//    	create : function(){ return this.init.apply(this, arguments); },

		/**
		 * Object containing the instance of the class {{#crossLink "audioInput"}}{{/crossLink}}
		 *
		 * If <em>listenerList</em> is provided, each listener will be registered after the instance
		 * is initialized, but before media-plugins (i.e. environment specfific implementations) are
		 * loaded.
		 * Each entry in the <em>listenerList</em> must have fields <tt>name</tt> (String) and
		 * <tt>listener</tt> (Function), where
		 * <br>
		 * name: is the name of the event
		 * <br>
		 * listener: is the listener implementation (the signature/arguments of the listener function depends
		 * 			 on the specific event for which the listener will be registered)
		 *
		 *
		 * @method init
		 * @async
		 * @param {Function} [successCallback] OPTIONAL
		 * 				 callback that gets triggered after the MediaManager instance has been initialized.
		 * @param {Function} [failureCallback] OPTIONAL
		 * 				 a failure callback that gets triggered if an error occurs during initialization.
		 * @param {Array<Object>} [listenerList] OPTIONAL
		 * 				 a list of listeners that should be registered, where each entry is an Object
		 * 				 with properties:
		 * 				 <pre>
		 * 					{
		 * 						name: String the event name,
		 * 						listener: Function the handler function
		 * 					}
		 * 				 </pre>
		 * @return {Object}
		 * 				a Deferred object that gets resolved, after the {@link mmir.MediaManager}
		 * 				has been initialized.
		 * @public
		 *
		 * @memberOf mmir.MediaManager.prototype
		 *
		 */
		init: function(successCallback, failureCallback, listenerList){

			var defer = deferred();
			var deferredSuccess = function(){
				defer.resolve();
			};
			var deferredFailure = function(){
				defer.reject();
			};

			if(successCallback || failureCallback){
				defer.then(successCallback, failureCallback);
			}

			if (instance === null) {
				extend(this,constructor());
				instance = this;

				if(listenerList){
					for(var i=0, size = listenerList.length; i < size; ++i){
						instance.addListener(listenerList[i].name, listenerList[i].listener);
					}
				}

				var pluginConfig = getPluginsToLoad();
				loadAllPlugins(pluginConfig, deferredSuccess, deferredFailure);

			}
			else if(listenerList){
				for(var i=0, size = listenerList.length; i < size; ++i){
					instance.addListener(listenerList[i].name, listenerList[i].listener);
				}
			}

			return defer;
		},
		/**
		 * loads a file. If the file implements a function initialize(f)
		 * where the function f is called with a set of functions e, then those functions in e
		 * are added to the visibility of audioInput, and will from now on be applicable by calling
		 * mmir.MediaManager.<function name>().
		 *          *
		 * @function
		 * @protected
		 * @memberOf mmir.MediaManager.prototype
		 *
		 * @example
		 * NOTE should only be used by plugin implementations for loading (dependent/sub-) plugins.
		 *
		 */
		loadFile: function(filePath,successCallback, failureCallback, execId){
			if (instance=== null) {
				this.init();
			}

			loadPlugin(filePath,successCallback, failureCallback, execId);

		},

		/**
		 * @copydoc MediaManager#_getMmir
		 * @function
		 * @protected
		 * @memberOf mmir.MediaManager.prototype
		 *
		 * @example
		 * NOTE should only be used by plugin implementations.
		 */
		_get_mmir: _getMmir
	};

	return _stub;

});//END: define(..., function(){...
