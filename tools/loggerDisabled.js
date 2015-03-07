/*
 * 	Copyright (C) 2012-2015 DFKI GmbH
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



define( 
/**
 * A "silent" replacement for the Logger factory.<br>
 * Has the same interaface (functions etc.) as {@link mmir.Logging}.
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
 * 
 * @example <code>mmir.Logging.create('SomeClass')</code>
 * @class DisabledLogging
 * @name DisabledLogging
 * @exports DisabledLogging as mmir.DisabledLogging
 * @category tools
 * @static
 * 
 * @see mmir.Logging
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


/** NO-OP */
function noop(){}
/** @returns false **/
function deny(){return false;}

/**
 * Constructor-Method of Class DisabledLogger:
 * This logger implementation will never print logging output.
 * 
 * Has the same interface (functions etc) as {@link Logger},
 * but <code>isXXX</code> functions will always return <code>false</code>
 * and the logging-functions will never do anything (i.e. these are
 * <em>no-op</em> functions).
 * 
 * @constructor
 * @name DisabledLogger
 */
function Logger(){}


Logger.prototype = {//public instance members (basically all NO-OPs)
    getLevel : function(){
    	//always return "disabled" level:
    	return 6;
    },
    setLevel : noop,
    log: noop,
    verbose: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    critical: noop,
    iVerbose: deny,
    isDebug: deny,
    isInfo: deny,
    isWarn: deny,
    isError: deny,
    isCritical: deny,
    isDisabled: deny,
    v: noop,
    d: noop,
    i: noop,
    w: noop,
    e: noop,
    c: noop,
    isv: deny,
    isd: deny,
    isi: deny,
    isw: deny,
    ise: deny,
    isc: deny
};

/**
 * @memberOf mmir.DisabledLogging.prototype
 */
var _defaultLogger = new Logger();

return {//public API
	
	/**
	 * Will alway return the default logger for this logging module
	 * @returns {DisabledLogger}
	 * 
	 * @memberOf mmir.DisabledLogging.prototype
	 */
    create: function(){
        return _defaultLogger;
    },
    get: function(){
        return _defaultLogger;
    },
    setDefaultLogLevel: noop,
    getDefaultLogLevel: function(){
    	return 6;
    },
    log: noop,
    verbose: noop,
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
//    isDebug: deny,
//    isInfo: deny,
//    isWarn: deny,
//    isError: deny
    isDisabledLogger: true//special property for identifying the disabled logger-factory
};
    
});
