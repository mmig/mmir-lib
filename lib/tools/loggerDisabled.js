
define(
/**
 * A "silent" replacement for the Logger factory.<br>
 * Has the same interface (functions etc.) as {@link mmir.Logging}.
 *
 * <p>
 *
 * This logging module allows to disable logging completely.
 *
 * <p>
 *
 * Which logging module is used, can be configured in core
 * module in {@link mmir}.
 *
 * <div class="box important">
 * 	<b>Note:</b> after configuration
 * 	of {@link mmir.debug} with <code>false</code>, this
 * 	logging module, i.e. the <code>DisabledLogging</code> factory with
 * 	its <code>DisabledLogger</code> implementation, will be available
 * 	via <code>mmir.Logging</code>(and <u><strong>not</strong></u> as
 * 	<em>mmir.DisabledLogger</em>).
 * </div>
 *
 * @class
 * @name DisabledLogging
 * @memberOf mmir
 * @static
 * @hideconstructor
 *
 * @see mmir.Logging
 *
 * @example
 *
 * var DisabledLogger = mmir.require('mmirf/loggerDisabled');
 * var logger = DisabledLogger.create('SomeClass');
 *
 * //same as above, if mmir.debug was set to false, before initialization:
 * var Logger = mmir.require('mmirf/logger');
 * var logger = Logging.create('SomeClass');
 */
function(){

/**
 * logging levels
 *
 * 0: verbose
 * 1: debug
 * 2: info
 * 3: warn
 * 4: error
 * 5: critical
 * 6: disabled
 */


/**
 * NO-OP function
 * @private
 * @memberOf mmir.DisabledLogging#
 */
function noop(){}
/**
 * DENY function
 * @returns {Boolean} <code>false</code> (always)
 *
 * @private
 * @memberOf mmir.DisabledLogging#
 */
function deny(){return false;}

/**
 * Constructor-Method of Class DisabledLogger:
 * This logger implementation will never print logging output.
 *
 * Has the same interface (functions etc) as {@link mmir.tools.Logger} of the {@link mmir.Logging} factory,
 * but <em>isXXX</em> functions will always return <code>false</code>
 * and the logging-functions will never do anything (i.e. these are
 * <em>no-op</em> functions).
 *
 * @constructor
 * @name DisabledLogger
 * @memberOf mmir.tools
 */
function Logger(){}


Logger.prototype =
/** @lends mmir.tools.DisabledLogger# */
{//public instance members (basically all NO-OPs or DENYs)

	/**
	 * @public
	 * @function
	 */
	getLevel : function(){
		//always return "disabled" level:
		return 6;
	},
	/**
	 * @public
	 * @function
	 */
	setLevel : noop,
	/**
	 * @public
	 * @function
	 */
	log: noop,
	/**
	 * @public
	 * @function
	 */
	verbose: noop,
	/**
	 * @public
	 * @function
	 */
	debug: noop,
	/**
	 * @public
	 * @function
	 */
	info: noop,
	/**
	 * @public
	 * @function
	 */
	warn: noop,
	/**
	 * @public
	 * @function
	 */
	error: noop,
	/**
	 * @public
	 * @function
	 */
	critical: noop,
	/**
	 * @public
	 * @function
	 */
	isVerbose: deny,
	/**
	 * @public
	 * @function
	 */
	isDebug: deny,
	/**
	 * @public
	 * @function
	 */
	isInfo: deny,
	/**
	 * @public
	 * @function
	 */
	isWarn: deny,
	/**
	 * @public
	 * @function
	 */
	isError: deny,
	/**
	 * @public
	 * @function
	 */
	isCritical: deny,
	/**
	 * @public
	 * @function
	 */
	isDisabled: deny,
	/**
	 * @public
	 * @function
	 */
	v: noop,
	/**
	 * @public
	 * @function
	 */
	d: noop,
	/**
	 * @public
	 * @function
	 */
	i: noop,
	/**
	 * @public
	 * @function
	 */
	w: noop,
	/**
	 * @public
	 * @function
	 */
	e: noop,
	/**
	 * @public
	 * @function
	 */
	c: noop,
	/**
	 * @public
	 * @function
	 */
	isv: deny,
	/**
	 * @public
	 * @function
	 */
	isd: deny,
	/**
	 * @public
	 * @function
	 */
	isi: deny,
	/**
	 * @public
	 * @function
	 */
	isw: deny,
	/**
	 * @public
	 * @function
	 */
	ise: deny,
	/**
	 * @public
	 * @function
	 */
	isc: deny
};

/**
 * @private
 * @memberOf mmir.DisabledLogging#
 */
var _defaultLogger = new Logger();

return /** @lends mmir.DisabledLogging# */ {//public API

	/**
	 * Will always return the default logger for this logging module
	 * @returns {mmir.tools.DisabledLogger}
	 *
	 * @public
	 * @memberOf mmir.DisabledLogging.prototype
	 */
	create: function(){
		return _defaultLogger;
	},
	/**
	 * @public
	 */
	get: function(){
		return _defaultLogger;
	},
	/**
	 * @public
	 * @function
	 */
	setDefaultLogLevel: noop,
	/**
	 * @public
	 */
	getDefaultLogLevel: function(){
		return 6;
	},
	/**
	 * @public
	 * @function
	 */
	log: noop,
	/**
	 * @public
	 * @function
	 */
	verbose: noop,
	/**
	 * @public
	 * @function
	 */
	debug: noop,
	/**
	 * @public
	 * @function
	 */
	info: noop,
	/**
	 * @public
	 * @function
	 */
	warn: noop,
	/**
	 * @public
	 * @function
	 */
	error: noop,
//    isDebug: deny,
//    isInfo: deny,
//    isWarn: deny,
//    isError: deny
	/**
	 * Special property for identifying the disabled logger-factory
	 * @public
	 */
	isDisabledLogger: true
};

});
