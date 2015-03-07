
/**
 *  @requires jQuery.Deferred
 */

//TODO doc

define(['scion', 'scionUtil', 'jquery'], function( scion, scionUtil, $ ) {

    /**
     * An array containing all states active.
     * 
     * @property statesActive
     * @type Array
     * @private
     */
    var statesActive = new Array();

    var newInstance = function( scion, scionUtil, instanceContext ) {
    	
        var _interpreter = null;

        var load = function(){

            var _url = this.arguments || this.doc
            	, _defer = $.Deferred();
            
            if (typeof _url === 'undefined') {
            	instanceContext._log.error('URL is missing!');
                return;
            }

            var self = this;
            
            scion.urlToModel(_url, function(err, model) {

                if (err) {
                	
                	var url = '';
                	var printError = function(){
                		console.error('error for SCXML model at ',_url, ': ',
                				(url? 'could not load "' + url + '" ' : ''),
                				(err.statusText? ': ' + err.statusText : ''),
                				err,
                				model
                		);
                	};
                	if(err.always) err.always(function(){url = this.url; printError();});
                	else printError();
                	
//                    alert('SCXML is not valid!');
                	_defer.fail(err);
                    return;
                }

                // instantiate the interpreter
                _interpreter = new scion.SCXML(model);

                // listener for transitions / state-changes:
                var listener = {
                    onEntry : function(stateName) {
                        statesActive.push(stateName);
                        if (instanceContext._log.isDebug()) instanceContext._log.debug('SCXML State Entry: "' + stateName + '"');// debug
                    },
                    onExit : function(stateName) {
                        statesActive.pop();

                        if (instanceContext._log.isDebug()) instanceContext._log.debug('SCXML State Exit: "' + stateName + '"');// debug
                    },
                    onTransition : function(sourceState, targetStatesArray) {
                        
                    	if (instanceContext._log.isDebug()) instanceContext._log.debug('SCXML State Transition: "' + sourceState + '"->"' + targetStatesArray + '"');// debug

                        if (targetStatesArray && targetStatesArray.length > 1) {
                        	instanceContext._log.warn('SCXML State Transition: multiple target states!');
                        }
                    }
                };

                _interpreter.registerListener(listener);

                if (self.onload) {
                	var _scion = scionUtil( _interpreter );
                	if(!self.evalScript) self.scion.ignoreScript();
                	self.onload( _scion, _defer );
                } else {
                	deferred.resolve(instanceContext);
                }
                
            });//END: scion.urlToModel(...

            
            return _defer.promise();
            
        };//END: load = function(){...

        /**
    	 * @deprecated instead use the object directly
    	 */
        instanceContext.getInstance= function () {
        	return this;
        };
        instanceContext.load = load;
        instanceContext.onload = null;
        instanceContext.doc = null;
        instanceContext.raise = null;
        
        return instanceContext;
        
    };//END: newInstance(){...

    
    //export:
    
    /**
     * Creates a new SCION engine.
     * 
     * @param {Object} configuration
     * 				The configuration object for the SCION engine:
     * 				all properties and functions from this object will be attached
     * 				to the returned SCION engine (i.e. the <code>context</code> object).
     * @param {Object} context
     * 				The context object: the SCION engine will be attached to this object.
     * 				The context object must have a property <code>_log</code> with the
     * 				following attributes (may be empty non-function):
     * 				<code>_log.isDebug() : Boolean</code>  (this SHOULD NOT print / show any message)
     * 				<code>_log.debug(String) : void</code> (this SHOULD NOT print / show any message)
     * 				<code>_log.warn(String) : void</code>  (this MAY print / show a warning message)
     * 				<code>_log.error(String) : void</code> (this SHOULD print / show an error message)
     * 				or use a Logger instance (see /tools/logger.js) that is setup for the module
     * 				that calls this function (see e.g. /manager/dialog/dialogManager::init).
     * @returns {Object} the created SCION engine object
     */
	return function (configuration , context){
		
        var _instance = newInstance( scion, scionUtil , context);
        
        for (var key in configuration) {
            _instance[key] = configuration[key];
        }
        
        return _instance;
                    
	};

});
