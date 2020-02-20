
define(['mmirf/stacktrace', 'module'],
/**
 * A Logger factory.<br>
 *
 * @example
 *  //use logger
 *  var Logger = mmir.require('mmirf/logger');
 *  var log = Logger.create('example');
 *
 *  if(log.isVerbose()) log.debug('test');//will write the message to debug-console)
 *  log.error(new Error());//will write the error (including its stack) to error console)
 *
 *  //example for setting up a logger in a requirejs-module:
 *  define(['mmirf/logger', 'module'], function(Logger, module){
 *
 *    var logger = Logger.create(module);
 *    //this would create the same logger-object:
 *    //  Logger.create(module.id, module.config(module).logLevel);
 *
 *    //use the logger instance...
 *
 *    //create / retrieve the same logger
 *    var sameLogger = Logger.create(module.id);
 *
 *  });
 *
 * @class
 * @name Logging
 * @memberOf mmir
 * @static
 * @hideconstructor
 *
 * @see mmir.tools.Logger
 *
 */
function(stacktrace, module){

/**
 * created loggers:
 * loggerId (string) -> Logger
 * @type {Map<string, mmir.tools.Logger>}
 * @private
 */
var _loggers = new Map();
/**
 * pre-configured/"default" log-levels when creating loggers:
 * number -> loggerId (string)
 * @type {Map<number, string>}
 * @private
 */
var _logLevels = new Map();

/**
 * the (global) logging level
 *
 * 0: verbose
 * 1: debug
 * 2: info
 * 3: warn
 * 4: error
 * 5: critical
 * 6: disabled
 *
 * @memberOf mmir.Logging#
 */
var _level = 1;

/**
 * @private
 * @type String
 * @memberOf mmir.Logging#
 */
var tmpLogLevel = module.config(module).logLevel;
if(typeof tmpLogLevel !== 'undefined'){
	if(tmpLogLevel && typeof tmpLogLevel === 'object'){
		if(tmpLogLevel.levels){
			parseLogLevels(tmpLogLevel.levels, 'levels');
		}
		if(tmpLogLevel.modules){
			parseLogLevels(tmpLogLevel.modules, 'modules');
		}
		tmpLogLevel = typeof tmpLogLevel.level !== 'undefined'? tmpLogLevel.level : 'debug';
	}
	if(typeof tmpLogLevel !== 'number'){
		tmpLogLevel = getAsLevel(tmpLogLevel);
	}
	_level = tmpLogLevel;
}

function parseLogLevels(opt, mode){
	if(mode === 'levels'){
		// [field]: Array<moduleId>
		var list, level;
		for(var l in opt){
			if(opt.hasOwnProperty(l)){
				list = opt[l];
				level = parseLogLevel(l);
				for(var i=0, size=list.length; i < size; ++i){
					setLogLevel(list[i], level);
				}
			}
		}
	} else if(mode === 'modules'){
		// [moduleId]: logLevel
		for(var modId in opt){
			if(opt.hasOwnProperty(modId)){
				setLogLevel(modId, opt[modId]);
			}
		}
	} else {
		print('logger', getAsLevel('error'), 'parseLogLevels(): invalid mode '+mode);
	}
}

function parseLogLevel(logLevel){
	if(typeof logLevel === 'string'){
		var num = parseFloat(logLevel);
		if(isFinite(num)){
			return num;
		}
	}
	if(typeof logLevel !== 'number'){
		return getAsLevel(logLevel);
	}
	return logLevel;
}


/**
 * Get the log-level as number.
 *
 * @param {String} strLogLevel
 * 			the string representation for the log-level
 * @returns {Number}
 * 				the log-level as number
 * @private
 * @memberOf mmir.tools.Logger.prototype
 *
 * @see #getLevel
 */
function getAsLevel(strLogLevel){
	if(typeof strLogLevel === 'string'){
		var str = strLogLevel.toLowerCase();
		if(str === 'verbose'){
			return 0;
		} else if(str === 'debug'){
			return 1;
		} else if(str === 'info'){
			return 2;
		} else if(str === 'warn'){
			return 3;
		} else if(str === 'error'){
			return 4;
		} else if(str === 'critical'){
			return 5;
		} else if(str === 'disabled'){
			return 6;
		} else
			throw new Error('Logger.getAsLevel: unknown parameter value "'+strLogLevel+'"');
	}

	throw new TypeError('Logger.getAsLevel: parameter must be number or string, but "'+strLogLevel+'" is '+typeof strLogLevel);
}

/**
 * configure default log-level for a logger:
 * in case the logger is created without specifying a log-level, this pre-configured
 * log-level will be used.
 *
 * @param {String} loggerId
 * 			the ID for the logger
 * @param {Number|String} logLevel
 * 				the log-level for the logger
 * @private
 * @memberOf mmir.tools.Logger.prototype
 */
function setLogLevel(loggerId, logLevel){
	if(typeof loggerId !== 'string'){
		loggerId = loggerId + '';
	}
	if(typeof logLevel !== 'number'){
		logLevel = getAsLevel(logLevel);
	}
	_logLevels.set(loggerId, logLevel);
}

/**
 * print log message with error information.
 *
 * @private
 * @memberOf mmir.tools.Logger.prototype
 */
function printe(loggerName, logLevel, className, funcName, msg, error){

	if( isErr(className)){
		error = className;
		className = '';
	} else if( isErr(funcName) ){
		error = funcName;
		funcName = void(0);
		if(typeof className === 'undefined'){
			className = '';
		}
	} else if( isErr(msg) ){
		error = msg;
		msg = void(0);
		if(typeof className === 'undefined'){
			if(typeof funcName === 'undefined'){
				className = '';
			}
			else {
				className = funcName;
				funcName = void(0);
			}
		}
	}

	print(loggerName, logLevel, createErr(createMsg(className, funcName, msg), error), true);
}

/**
 * creates the message text.
 *
 * @returns {string} the message text
 *
 * @private
 * @memberOf mmir.tools.Logger.prototype
 */
function createMsg(className, funcName, msg){

	var out;

	if(className){
		if(funcName){
			if(msg){
				out = className+'.'+funcName+': '+msg;
			} else {

//					if(arguments.callee !== 'undefined'){
//						out('callee: '+arguments.callee());
//					}

				out = className+': '+funcName;
			}
		} else {

//				if(arguments.callee !== 'undefined'){
//					out('callee: '+arguments.callee());
//				}

			out = className;
		}
	} else {

//			if(arguments.callee !== 'undefined'){
//				out('callee: '+arguments.callee());
//			}

		if(typeof className === 'undefined'){
			out = 'UNDEFINED';
		} else if(typeof className !== 'string'){
			out = Object.prototype.toString.call(null, className);
		} else {
			out = className;
		}
	}

	return out;
}

/**
 * HELPER: check if errObj is an Error
 *
 * @returns {Boolean}
 *
 * @private
 * @memberOf mmir.tools.Logger.prototype
 */
function isErr(errObj){

	//TODO also do feature detection for error-like objects?
	return errObj instanceof Error;
}

/**
 * Creates error message (with stack trace, if possible).
 *
 * @returns {string} the error message
 *
 * @private
 * @memberOf mmir.tools.Logger.prototype
 */
function createErr(msg, error){

	var err ='';
	var errMsg = '';
	var re;
	if(error){

		if(error.name){
			err = '<'+error.name+'> ';
		}

		if(error.number){
			err += '#'+error.number+' ';
		}

		if(error.stack){

			errMsg = error.stack;

			if(error.name && (re = new RegExp('^'+error.name)).test(errMsg)){
				errMsg = errMsg.replace(re, '');
			}

		} else {

			if(error.message){
				errMsg = ' - ' + error.message;
			}

			if(error.description){
				errMsg = ' - ' + error.description;
			}

			if(error.fileName){

				var lineNo = '';

				if(error.lineNumber){
					lineNo = ', line ' + error.lineNumber;
				}

				errorMsg += ' ('+error.fileName+lineNo+')';
			}
		}

	}

	return err+msg+errMsg;
}

//in some environments console.debug may not exits -> use console.log instead
var DEBUG_FUNC_NAME = console.debug? 'debug' : 'log';

/**
 * @private
 * @memberOf mmir.tools.Logger.prototype
 */
function print(loggerName, logLevel, msg){
	var prefix, func;
	switch(logLevel){
	case 0:
		prefix = '[VERBOSE] ';
		func = 'log';
		break;
	case 1:
		prefix = '[DEBUG] ';
		func = DEBUG_FUNC_NAME;
		break;
	case 2:
		prefix = '[INFO] ';
		func = 'info';
		break;
	case 3:
		prefix = '[WARN] ';
		func = 'warn';
		break;
	case 4:
		prefix = '[ERROR] ';
		func = 'error';
		break;
	case 5:
		prefix = '[CRITICAL] ';
		func = 'error';
		break;
	case 6:		//debug-level "disabled" -> do nothing
		return; /////////////////// EARLY EXIT //////////
	default:
		prefix = '[UNDEF_LOG_LEVEL_'+logLevel+'] ';
		func = 'log';
		break;
	}
	console[func](prefix + loggerName + msg);
}


//enable tracing?
/**
 * configuration value for enabling/disabling tracing in log-output
 * @private
 * @type Object
 * @memberOf mmir.tools.Logger.prototype
 */
var tmpTraceConfig = module.config(module).trace;
if(tmpTraceConfig !== false || (tmpTraceConfig !== null && typeof tmpTraceConfig === 'object' && tmpTraceConfig.trace !== false)){

	/**
	 * options object for tracing
	 * @private
	 * @type Object
	 * @memberOf mmir.tools.Logger.prototype
	 */
	var pnTraceOptions = tmpTraceConfig === true? void(0) : tmpTraceConfig;
	/**
	 * setting for trace-depth (i.e. stack-depth)
	 * @private
	 * @type Boolean
	 * @memberOf mmir.tools.Logger.prototype
	 */
	var isFullStackDepth = pnTraceOptions && pnTraceOptions.depth === "full";

	/**
	 * proxy object for storing the original implementation
	 * of {@link mmir.tools.Logger#print} function.
	 *
	 * (only used, if tracing is enabled!)
	 *
	 * @private
	 * @type Function
	 * @memberOf mmir.tools.Logger.prototype
	 */
	var pnOriginal = print;

	//do enable tracing: append stacktrace to messages in print-function
	if(isFullStackDepth){

		//NOTE code duplication for the sake of a more efficient print function

		/**
		 * Extension for {@link mmir.tools.Logger#print} function with tracing.
		 *
		 * This extension prints the full stack trace in log-output.
		 *
		 * (only used, if tracing is enabled!)
		 *
		 * @private
		 * @name printFullStack
		 * @function
		 * @memberOf mmir.tools.Logger.prototype
		 */
		print = function printFullStack(loggerName, logLevel, msg, isErrInvoked){
			if(typeof msg === 'undefined' || msg === null){
				msg = '';
			}
			//if isErrInvoked is TRUE: this function was invoked via additional printe()-call
			// => need to take 1 more step down the stack
			msg += '\n  ' + stacktrace.getSync(pnTraceOptions).slice(isErrInvoked? 3 : 2).join('\n  ');
			pnOriginal.call(this, loggerName, logLevel, msg);
		};
	}
	else {

		//NOTE code duplication for the sake of a more efficient print function

		/**
		 * Extension for {@link mmir.tools.Logger#print} function with tracing.
		 *
		 * This extension prints only the first entry of the stack trace in log-output.
		 *
		 * (only used, if tracing is enabled!)
		 *
		 * @private
		 * @name printStack
		 * @function
		 * @memberOf mmir.tools.Logger.prototype
		 */
		print = function printStack(loggerName, logLevel, msg, isErrInvoked){
			if(typeof msg === 'undefined' || msg === null){
				msg = '';
			}
			//if isErrInvoked is TRUE: this function was invoked via additional printe()-call
			// => need to take 1 more step down the stack
			msg += '\n  ' + stacktrace.getSync(pnTraceOptions)[isErrInvoked? 3 : 2];
			pnOriginal.call(this, loggerName, logLevel, msg);
		};
	}

}

/**
 * Constructor-Method of Class Logger<br>
 * @constructor
 * @class
 * @name Logger
 * @memberOf mmir.tools
 *
 * @param {String} theName
 * 					the name / ID for the logger
 * @param {String|Number} [theLevel] OPTIONAL
 * 					the log-level.
 * 					If omitted, the logger will use
 * 					the default log-level
 *
 * @see #getAsLevel
 * @see #getLevel
 */
function Logger(theName, theLevel){

	//the name (/key) for the logger instance
	this.name = '';
	if(typeof theName !== 'undefined'){
		this.name = '['+theName+'] ';
	}

	if(typeof theLevel !== 'undefined'){
		if(typeof theLevel !== 'number'){
			theLevel = getAsLevel(theLevel);
		}

		this.level = theLevel;
	}
}

Logger.prototype =
/** @lends mmir.tools.Logger# */
{//public instance members

	/**
	 * Get the current log-level:
	 * if a specific log-level for this Logger instance is set,
	 * this value is returned.
	 * Otherwise, the default log-level as returned by {@link mmir.Logging#getDefaultLogLevel}
	 * is used.
	 *
	 * Log-levels:
	 * <ul>
	 * 	<li>0: verbose</li>
	 * 	<li>1: debug</li>
	 * 	<li>2: info</li>
	 * 	<li>3: warn</li>
	 * 	<li>4: error</li>
	 * 	<li>5: critical</li>
	 * 	<li>6: disabled</li>
	 * <ul>
	 *
	 * @returns {Number} the logging level
	 *
	 * @see #setLevel
	 */
	getLevel : function(){

		if(typeof this.level !== 'undefined'){
			return this.level;
		}

		//return default/global logging-level:
		return _level;
	},
	/**
	 * Set the logging level.
	 *
	 * @param {String|Number} loggingLevel
	 * 						if {Number} the logging level as a number
	 *                      if {String} the logging level as a string (see {@link #getLevel})
	 *
	 * @see #getLevel
	 */
	setLevel : function(loggingLevel){

		if(typeof loggingLevel !== 'number'){
			loggingLevel = getAsLevel(loggingLevel);
		}

		this.level = loggingLevel;
	},
	/**
	 *
	 * Print a log message, if at least <code>debug</code> log-level is set.
	 *
	 * @param {String} [className] OPTIONAL
	 * 			the name of the class/object from which the logging is invoked from
	 * @param {String} [funcName] OPTIONAL
	 * 			the name of the function (within the class) from which the logging is invoked from
	 * @param {String} msg
	 * 			the log message
	 * @param {Error} [error] OPTIONAL
	 * 			an error object: if available, its message and error-stack will be print to the output
	 * @public
	 */
	log: function(className, funcName, msg, error){
		if(this.isDebug()){
			printe(this.name, 1 /*getAsLevel('debug')*/, className, funcName, msg, error);
		}
	},

	/**
	 *
	 * Print a <em>verbose</em> log message, if at least <code>verbose</code> (0) log-level is set.
	 *
	 * @param {String} [className] OPTIONAL
	 * 			the name of the class/object from which the logging is invoked from
	 * @param {String} [funcName] OPTIONAL
	 * 			the name of the function (within the class) from which the logging is invoked from
	 * @param {String} msg
	 * 			the log message
	 * @public
	 */
	//TODO implement/add helpers for file-logging (+ CSV data helpers etc)
	verbose : function(className, funcName, msg){
		if(this.isVerbose()){
			print( this.name, 0 /*getAsLevel('verbose')*/, createMsg(className, funcName, msg));
		}
	},

	/**
	 *
	 * Print a <em>debug</em> log message, if at least <code>debug</code> (1) log-level is set.
	 *
	 * @param {String} [className] OPTIONAL
	 * 			the name of the class/object from which the logging is invoked from
	 * @param {String} [funcName] OPTIONAL
	 * 			the name of the function (within the class) from which the logging is invoked from
	 * @param {String} msg
	 * 			the log message
	 * @public
	 */
	debug : function(className, funcName, msg){
		if(this.isDebug()){
			print( this.name, 1 /*getAsLevel('debug')*/, createMsg(className, funcName, msg));
		}
	},

	/**
	 *
	 * Print an <em>information</em> log message, if at least <code>info</code> (2) log-level is set.
	 *
	 * @param {String} [className] OPTIONAL
	 * 			the name of the class/object from which the logging is invoked from
	 * @param {String} [funcName] OPTIONAL
	 * 			the name of the function (within the class) from which the logging is invoked from
	 * @param {String} msg
	 * 			the log message
	 * @public
	 */
	info : function(className, funcName, msg){
		if(this.isInfo()){
			print( this.name, 2 /*getAsLevel('info')*/, createMsg(className, funcName, msg));
		}
	},

	/**
	 *
	 * Print a <em>warning</em> log message, if at least <code>warn</code> (3) log-level is set.
	 *
	 * @param {String} [className] OPTIONAL
	 * 			the name of the class/object from which the logging is invoked from
	 * @param {String} [funcName] OPTIONAL
	 * 			the name of the function (within the class) from which the logging is invoked from
	 * @param {String} msg
	 * 			the log message
	 * @public
	 */
	warn : function(className, funcName, msg){
		if(this.isWarn()){
			print( this.name, 3 /*getAsLevel('warn')*/, createMsg(className, funcName, msg));
		}
	},

	/**
	 *
	 * Print an <em>error</em> log message, if at least <code>error</code> (4) log-level is set.
	 *
	 * @param {String} [className] OPTIONAL
	 * 			the name of the class/object from which the logging is invoked from
	 * @param {String} [funcName] OPTIONAL
	 * 			the name of the function (within the class) from which the logging is invoked from
	 * @param {String} msg
	 * 			the log message
	 * @param {Error} [error] OPTIONAL
	 * 			an error object: if available, its message and error-stack will be print to the output
	 * @public
	 */
	error : function(className, funcName, msg, error){
		if(this.isError()){
			printe(this.name, 4 /*getAsLevel('error')*/, className, funcName, msg, error);
		}
	},

	/**
	 *
	 * Print a <em>critical</em> (exception) log message, if at least <code>critical</code> (5) log-level is set.
	 *
	 * @param {String} [className] OPTIONAL
	 * 			the name of the class/object from which the logging is invoked from
	 * @param {String} [funcName] OPTIONAL
	 * 			the name of the function (within the class) from which the logging is invoked from
	 * @param {String} msg
	 * 			the log message
	 * @param {Error} [error] OPTIONAL
	 * 			an error object: if available, its message and error-stack will be print to the output
	 * @public
	 */
	critical : function(className, funcName, msg, error){
		if(this.isCritical()){
			printe(this.name, 5 /*getAsLevel('critical')*/, className, funcName, msg, error);
		}
	},

	/**
	 *
	 * Check if the current log-level is at least <code>verbose</code>.
	 *
	 * @returns {Boolean}
	 * 				<code>true</code> if at least log-level <code>verbose</code> (0)
	 * @public
	 *
	 * @see #verbose
	 */
	isVerbose : function(loggerName){
		return this.getLevel() <= 0;// getAsLevel('verbose');
	},

	/**
	 *
	 * Check if the current log-level is at least <code>debug</code>.
	 *
	 * @returns {Boolean}
	 * 				<code>true</code> if at least log-level <code>debug</code> (1)
	 * @public
	 *
	 * @see #debug
	 */
	isDebug : function(loggerName){
		return this.getLevel() <= 1;//getAsLevel('debug');
	},

	/**
	 *
	 * Check if the current log-level is at least <code>info</code>.
	 *
	 * @returns {Boolean}
	 * 				<code>true</code> if at least log-level <code>info</code> (2)
	 * @public
	 *
	 * @see #info
	 */
	isInfo : function(loggerName){
		return this.getLevel() <= 2;//getAsLevel('info');
	},

	/**
	 *
	 * Check if the current log-level is at least <code>warn</code>.
	 *
	 * @returns {Boolean}
	 * 				<code>true</code> if at least log-level <code>warn</code> (3)
	 * @public
	 *
	 * @see #warn
	 */
	isWarn : function(loggerName){
		return this.getLevel() <= 3;//getAsLevel('warn');
	},

	/**
	 *
	 * Check if the current log-level is at least <code>error</code>.
	 *
	 * @returns {Boolean}
	 * 				<code>true</code> if at least log-level <code>error</code> (4)
	 * @public
	 *
	 * @see #error
	 */
	isError : function(loggerName){
		return this.getLevel() <= 4;//getAsLevel('error');
	},

	/**
	 *
	 * Check if the current log-level is at least <code>critical</code>.
	 *
	 * @returns {Boolean}
	 * 				<code>true</code> if at least log-level <code>critical</code> (5)
	 * @public
	 *
	 * @see #critical
	 */
	isCritical : function(loggerName){
		return this.getLevel() <= 5;//getAsLevel('critical');
	},

	/**
	 *
	 * Check if the current log-level is at least <code>disabled</code>.
	 *
	 * @returns {Boolean}
	 * 				<code>true</code> if at least log-level <code>disable</code> (6)
	 * @public
	 *
	 * @see #getLevel
	 */
	isDisabled : function(loggerName){
		return this.getLevel() <= 6;//getAsLevel('disabled');
	}
};

//define alias'

/**
 * Alias for {@link #log}.
 *
 * @public
 * @function l
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#log
 */
Logger.prototype.l = function(){
	return this.log.apply(this, arguments);
};

/**
 * Alias for {@link #verbose}.
 *
 * @public
 * @function v
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#verbose
 */
Logger.prototype.v = function(){
	return this.verbose.apply(this, arguments);
};

/**
 * Alias for {@link #debug}.
 *
 * @public
 * @function d
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#debug
 */
Logger.prototype.d = function(){
	return this.debug.apply(this, arguments);
};

/**
 * Alias for {@link #info}.
 *
 * @public
 * @function i
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#info
 */
Logger.prototype.i = function(){
	return this.info.apply(this, arguments);
};

/**
 * Alias for {@link #warn}.
 *
 * @public
 * @function w
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#warn
 */
Logger.prototype.w = function(){
	return this.warn.apply(this, arguments);
};

/**
 * Alias for {@link #error}.
 *
 * @public
 * @function e
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#error
 */
Logger.prototype.e = function(){
	return this.error.apply(this, arguments);
};

/**
 * Alias for {@link #critical}.
 *
 * @public
 * @function c
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#critical
 */
Logger.prototype.c = function(){
	return this.critical.apply(this, arguments);
};

/**
 * @scope Logger#
 */

/**
 * Alias for {@link #isVerbose}.
 *
 * @public
 * @function isv
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#isVerbose
 */
Logger.prototype.isv = function(){
	return this.isVerbose.apply(this, arguments);
};

/**
 * Alias for {@link #isDebug}.
 *
 * @public
 * @function isd
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#isDebug
 */
Logger.prototype.isd = function(){
	return this.isDebug.apply(this, arguments);
};

/**
 * Alias for {@link #isInfo}.
 *
 * @public
 * @function isi
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#isInfo
 */
Logger.prototype.isi = function(){
	return this.isInfo.apply(this, arguments);
};

/**
 * Alias for {@link #isWarn}.
 *
 * @public
 * @function isw
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#isWarn
 */
Logger.prototype.isw = function(){
	return this.isWarn.apply(this, arguments);
};

/**
 * Alias for {@link #isError}.
 *
 * @public
 * @function ise
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#isError
 */
Logger.prototype.ise = function(){
	return this.isError.apply(this, arguments);
};

/**
 * Alias for {@link #isCritical}.
 *
 * @public
 * @function isc
 * @memberOf mmir.tools.Logger#
 * @copydoc mmir.tools.Logger#isCritical
 */
Logger.prototype.isc = function(){
	return this.isCrictial.apply(this, arguments);
};


/**
 * The default logger:
 * access by invoking {@link mmir.Logging#create} without arguments
 * @private
 * @type mmir.tools.Logger
 * @memberOf mmir.Logging
 * @member _defaultLogger
 * @inner
 * @example
 * var defaultLogger = mmir.require('mmirf/logger').create();
 */
var _defaultLogger = new Logger();
//default logger always has default/global log-level:
/**
 * @copydoc mmir.tools.Logger#getLevel
 * @memberOf mmir.Logging~_defaultLogger
 */
_defaultLogger.getLevel = function(){
	return _level;
};

//the instance for the Logging factory:
var instance =
/** @lends mmir.Logging.prototype */
{//public API

	/**
	 * Creates a {@link mmir.tools.Logger} instance.
	 *
	 * If a logger for <code>loggerName</code> already exists,
	 * the existing logger is returned (instead of creating a new one).
	 *
	 * @param {String|Object} [loggerName]
	 * 			If String: a name / ID for the logger that should be created / retrieved.<br>
	 * 			If Object: an requirejs <code>module</code> object, i.e. should contain properties
	 * 							<code>id</code> (String) which will set the <code>loggerName</code>, and a property/function
	 * 							<code>config</code> (Function) that returns an object with property
	 * 							<code>logLevel</code> (i.e. <code>config().logLevel</code> should be valid).<br>
	 * 			If omitted, the default logger will be returned.
	 * @param {String} [logLevel]
	 * 			a name / ID for the logger that should be created / retrieved.
	 * 			If omitted, the default logger will be returned.
	 *
	 * @returns {mmir.tools.Logger} the created (or retrieved) logger
	 *
	 * @memberOf mmir.Logging.prototype
	 * @public
	 *
	 * @see mmir.tools.Logger
	 * @see mmir.tools.Logger#setLevel
	 */
	create: function(loggerName, logLevel){

			//special argument: is first argument is a (requirejs) module?
			if(typeof loggerName === 'object' && loggerName && loggerName.id){
				//extract parameters from module object:
				if(typeof loggerName.config === 'function'){
					logLevel = loggerName.config(loggerName).logLevel;//<- may be undefined
				} else if(typeof WEBPACK_BUILD !== 'undefined' && WEBPACK_BUILD){
					//NOTE automatic injection by webpack of config-function (into module) does not work here, because loggerName is generic & webpack cannot statically inter its type as Module
					//     -> explicitly use module.config() helper module:
					logLevel = require('build-tool/module-config-helper').config(loggerName).logLevel;//<- may be undefined
				}
				loggerName = loggerName.id;
			}

		//no logger specified: return default logger
		if(! loggerName){
			return _defaultLogger;
		}

		if(typeof loggerName !== 'string'){
			loggerName = loggerName.toString();
		}

		//return specified logger
		var theLogger = _loggers.get(loggerName);
		if(typeof theLogger === 'undefined'){
			if(typeof logLevel === 'undefined'){
				logLevel = _logLevels.get(loggerName);
				// if(typeof logLevel === 'number'){
				// 	console.log('using predefined log level ', logLevel, ' for ', loggerName);
				// }
			}
			//create, if not existing
			var theNewLogger = new Logger(loggerName, logLevel);
			_loggers.set(loggerName, theNewLogger);

			return theNewLogger;
		}

		if(typeof logLevel !== 'undefined'){
			theLogger.setLevel(logLevel);
		}

		return theLogger;
	},
	/**
	 * Sets the default log-level.
	 *
	 * This setting is used by loggers, that do not have
	 * a specific log-level set.
	 *
	 * @param {String|Number} theLevel
	 * 			if NUMBER, the log level as a number between 0 (verbose) and 6 (disabled)
	 * 			if STRING, the logging level as a string (see {@link #getLevel})
	 *
	 * @public
	 *
	 * @see #getDefaultLogLevel
	 * @see mmir.tools.Logger#getLevel
	 */
	setDefaultLogLevel: function(theLevel){

		if(typeof theLevel !== 'number'){
			theLevel = getAsLevel(theLevel);
		}

		_level = theLevel;
	},
	/**
	 * Sets the default log-level.
	 *
	 * @returns {Number}
	 * 			the log level: a number between 0 (verbose) and 6 (disabled)
	 *
	 * @public
	 * @see #setDefaultLogLevel
	 * @see mmir.tools.Logger#getLevel
	 */
	getDefaultLogLevel: function(){
		return _level;
	},
	/**
	 * Print log output with default logger.
	 * @public
	 * @see mmir.tools.Logger#log
	 */
	log: function(){
		_defaultLogger.log.apply(_defaultLogger, arguments);
	},
	/**
	 * Print verbose output with default logger.
	 * @public
	 * @see mmir.tools.Logger#verbose
	 */
	verbose: function(){
		_defaultLogger.verbose.apply(_defaultLogger, arguments);
	},
	/**
	 * Print debug message with default logger.
	 * @public
	 * @see mmir.tools.Logger#debug
	 */
	debug: function(){
		_defaultLogger.debug.apply(_defaultLogger, arguments);
	},
	/**
	 * Print information message with default logger.
	 * @public
	 * @see mmir.tools.Logger#info
	 */
	info: function(){
		_defaultLogger.info.apply(_defaultLogger, arguments);
	},
	/**
	 * Print warning message with default logger.
	 * @public
	 * @see mmir.tools.Logger#warn
	 */
	warn: function(){
		_defaultLogger.warn.apply(_defaultLogger, arguments);
	},
	/**
	 * Print error with default logger.
	 * @public
	 * @see mmir.tools.Logger#error
	 */
	error: function(){
		_defaultLogger.error.apply(_defaultLogger, arguments);
	}//,
//    isDebug : function(loggerName){
//    	return _level <= getAsLevel('debug');
//    },
//    isInfo : function(loggerName){
//    	return _level <= getAsLevel('info');
//    },
//    isWarn : function(loggerName){
//    	return _level <= getAsLevel('warn');
//    },
//    isError : function(loggerName){
//    	return _level <= getAsLevel('error');
//    }
};

//define alias'
instance.get = instance.create;


return instance;

});
