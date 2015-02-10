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


/**
 * A Logger factory.<br>
 * 
 * @example 
 *  //use logger
 *  var Logger = require('logger');
 *  var log = Logger.create('example');
 *  
 *  if(log.isVerbose()) log.debug('test');//will write the message to debug-console)
 *  log.error(new Error());//will write the error (including its stack) to error console)
 *  
 *  //example for setting up a logger in a requirejs-module:
 *  define(['logger', 'module'], function(Logger, module){
 *  
 *    var logger = Logger.create(module);
 *    //this would create the same logger-object:
 *    //  Logger.create(module.id, module.config().logLevel);
 *    
 *    //use the logger instance...
 *    
 *    //create / retrieve the same logger
 *    var sameLogger = Logger.create(module.id);
 *    
 *  });
 * 
 *  
 * @class mmir.Logging
 * @category core
 * 
 * @see mmir.Logging
 */
define(['dictionary', 'module'], function(Dictionary, module){
	
var _loggers = new Dictionary();
//var logLevels = new Dictionary();

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
 */
var _level = 1;


var tmpLogLevel = module.config().logLevel;
if(typeof tmpLogLevel !== 'undefined'){
	if(typeof tmpLogLevel !== 'number'){
		tmpLogLevel = getAsLevel(tmpLogLevel);
	}
	_level = tmpLogLevel;
}


//	//TODO extend / implement helpers for writing CSV file data
//	var csvHeader = [
//	    'User name', 'Time', 'Modality', 'Recognized speech', 'Event name', 'Event data', 'Dialog state'
//	];
//	
//	function getCsvLine(){
//		return new Array(csvHeader.length);
//	}

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
	
	print(loggerName, logLevel, createErr(createMsg(className, funcName, msg), error));
}

/**
 *	creates the message text.
 * @returns {string} the message text 
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

function isErr(errObj){
	
	//TODO also do feature detection for error-like objects?
	return errObj instanceof Error;
}

/**
 * Creates error message (with stack trace, if possible).
 * 
 * @returns {string} the error message
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

function print(loggerName, logLevel, msg){
	var prefix, func;
	switch(logLevel){
	case 0:
		prefix = '[VERBOSE] ';
		func = 'log';
		break;
	case 1:
		prefix = '[DEBUG] ';
		func = 'debug';
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



/**
 * Constructor-Method of Class {@link mmir.Logger}<br>
 * @constructor
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


Logger.prototype = {//public instance members
	/**
	 * 
	 * 0: verbose
	 * 1: debug
	 * 2: info
	 * 3: warn
	 * 4: error
	 * 5: critical
	 * 6: disabled
	 * 
	 * @returns {number} the logging level
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
     * @param loggingLevel if {number} the logging level as a number
     *                     is {string} the logging level as a string (see #getLevel())
     */
    setLevel : function(loggingLevel){
    	
    	if(typeof loggingLevel !== 'number'){
    		loggingLevel = getAsLevel(loggingLevel);
    	}
    	
    	this.level = loggingLevel;
    },
    log: function(className, funcName, msg, error){
    	if(this.isDebug()){
    		printe(this.name, 1 /*getAsLevel('debug')*/, className, funcName, msg, error);
    	}
    },
    //TODO implement/add helpers for file-logging (+ CSV data helpers etc)
    verbose : function(className, funcName, msg){
    	if(this.isVerbose()){
    		print( this.name, 0 /*getAsLevel('verbose')*/, createMsg(className, funcName, msg));
    	}
    },
    debug : function(className, funcName, msg){
    	if(this.isDebug()){
    		print( this.name, 1 /*getAsLevel('debug')*/, createMsg(className, funcName, msg));
    	}
    },
    info : function(className, funcName, msg){
    	if(this.isInfo()){
    		print( this.name, 2 /*getAsLevel('info')*/, createMsg(className, funcName, msg));
    	}
    },
    warn : function(className, funcName, msg){
    	if(this.isWarn()){
    		print( this.name, 3 /*getAsLevel('warn')*/, createMsg(className, funcName, msg));
    	}
    },
    error : function(className, funcName, msg, error){
    	if(this.isError()){
    		printe(this.name, 4 /*getAsLevel('error')*/, className, funcName, msg, error);
    	}
    },
    critical : function(className, funcName, msg, error){
    	if(this.isCritical()){
    		printe(this.name, 5 /*getAsLevel('critical')*/, className, funcName, msg, error);
    	}
    },
    isVerbose : function(loggerName){
    	return this.getLevel() <= 0;// getAsLevel('verbose');
    },
    isDebug : function(loggerName){
    	return this.getLevel() <= 1;//getAsLevel('debug');
    },
    isInfo : function(loggerName){
    	return this.getLevel() <= 2;//getAsLevel('info');
    },
    isWarn : function(loggerName){
    	return this.getLevel() <= 3;//getAsLevel('warn');
    },
    isError : function(loggerName){
    	return this.getLevel() <= 4;//getAsLevel('error');
    },
    isCritical : function(loggerName){
    	return this.getLevel() <= 5;//getAsLevel('critical');
    },
    isDisabled : function(loggerName){
    	return this.getLevel() <= 6;//getAsLevel('disabled');
    }
};

//define alias'
Logger.prototype.l = function(){
	return this.log.apply(this, arguments);
};
Logger.prototype.v = function(){
	return this.verbose.apply(this, arguments);
};
Logger.prototype.d = function(){
	return this.debug.apply(this, arguments);
};
Logger.prototype.i = function(){
	return this.info.apply(this, arguments);
};
Logger.prototype.w = function(){
	return this.warn.apply(this, arguments);
};
Logger.prototype.e = function(){
	return this.error.apply(this, arguments);
};
Logger.prototype.c = function(){
	return this.critical.apply(this, arguments);
};
Logger.prototype.isv = function(){
	return this.isVerbose.apply(this, arguments);
};
Logger.prototype.isd = function(){
	return this.isDebug.apply(this, arguments);
};
Logger.prototype.isi = function(){
	return this.isInfo.apply(this, arguments);
};
Logger.prototype.isw = function(){
	return this.isWarn.apply(this, arguments);
};
Logger.prototype.ise = function(){
	return this.isError.apply(this, arguments);
};
Logger.prototype.isc = function(){
	return this.isCrictial.apply(this, arguments);
};


var _defaultLogger = new Logger();
//default logger always has default/global log-level:
_defaultLogger.getLevel = function(){
	return _level;
};

var instance = {//public API
	
    create: function(loggerName, logLevel){
    	
    	//special argument: is first argument is a (requirejs) module?
    	if(typeof loggerName === 'object' && loggerName && loggerName.id && typeof loggerName.config === 'function'){
    		//extract parameters from module object:
    		logLevel = loggerName.config().logLevel;//<- may be undefined
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
        	//create, if not existing
        	var theNewLogger = new Logger(loggerName, logLevel);
        	_loggers.put(loggerName, theNewLogger);
        	
        	return theNewLogger;
        }
        
        if(typeof logLevel !== 'undefined'){
        	theLogger.setLevel(logLevel);
        }
        
        return theLogger;
    },
    setDefaultLogLevel: function(theLevel){
    	_level = theLevel;
    },
    getDefaultLogLevel: function(){
    	return _level;
    },
    log: function(){
    	_defaultLogger.log.apply(_defaultLogger, arguments);
    },
    verbose: function(){
    	_defaultLogger.verbose.apply(_defaultLogger, arguments);
    },
    debug: function(){
    	_defaultLogger.debug.apply(_defaultLogger, arguments);
    },
    info: function(){
    	_defaultLogger.info.apply(_defaultLogger, arguments);
    },
    warn: function(){
    	_defaultLogger.warn.apply(_defaultLogger, arguments);
    },
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
