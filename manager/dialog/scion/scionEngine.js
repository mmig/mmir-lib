
//TODO doc

define(['scion', 'scionUtil'], function( scion, scionUtil ) {

//    var _instance = null;

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
                console.error('URL is missing!');
                return;
            }


            scion.urlToModel(_url, function(err, model) {

                if (err) {
                    alert('SCXML is not valid!');
                    return;
                }

                // instantiate the interpreter
                _interpreter = new scion.SCXML(model);

                // listener for transitions / state-changes:
                var listener = {
                    onEntry : function(stateName) {
                        statesActive.push(stateName);
                        if (IS_DEBUG_ENABLED) console.debug('SCXML State Entry: "' + stateName + '"');// debug
                    },
                    onExit : function(stateName) {
                        statesActive.pop();

                        if (IS_DEBUG_ENABLED) console.debug('SCXML State Exit: "' + stateName + '"');// debug
                    },
                    onTransition : function(sourceState, targetStatesArray) {
                        
                    	if (IS_DEBUG_ENABLED) console.debug('SCXML State Transition: "' + sourceState + '"->"' + targetStatesArray + '"');// debug

                        if (targetStatesArray && targetStatesArray.length > 1) {
                            console.warn('SCXML State Transition: multiple target states!');
                        }
                    }
                };

                _interpreter.registerListener(listener);
                // _interpreter.start();
                
            });//END: scion.urlToModel(...

            // needed when interpreter.start is executed outside the
            // scion.urlToModel callback!
            // not clear if there is evident need to start the interpreter
            // inside the mmir code
            var isTimeout = false;
            var startTime = new Date();
            var timeout = 10000;
            
            function isReady() {
                isTimeout = new Date() - startTime > timeout;
                if (!_interpreter && !isTimeout) {
                    setTimeout(function(context) {
                        isReady.call(context);
                    }, 50, this);
                }
                else if (_interpreter) {
                    if (this.onload) {
                    	var scion = scionUtil( _interpreter );
                    	if(!this.evalScript) this.scion.ignoreScript();
                    	this.onload( scion, _defer );
                    }
                }
                else {
                    if (confirm) {
                        var result = confirm('Could not initialize ScxmlEngine (time out).\nContinue to wait another\n ' + (timeout / 1000).toFixed(3) + ' seconds?');
                        if (result) {
                            startTime = new Date();
                            setTimeout(function(context) {
                                isReady.call(context);
                            }, 50, this);
                        }
                        else {
                            console.error('Could not initialize ScxmlEngine (time out).');
                        }
                    }
                    else {
                        console.error('Could not initialize ScxmlEngine (time out).');
                    }
                }
            };//END: isReady(){...

            isReady.call(this);
            
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
     * 				The context object: the SCION engine will be attached to 
     * 				this object.
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
