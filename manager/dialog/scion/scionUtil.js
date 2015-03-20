
//TODO doc
	
define(['dictionary', 'stringExtension'], function(Dictionary) {

	return function(_scion) {

		/*
		 * if (testbed._util) return testbed._util;
		 */

		var _states = [], _transitions = new Dictionary();
		var _events = new Dictionary();
		

		(function() {
			
			var events = [], transitions = {}, 
				states = _scion.model.states, n, 
				stateObj, transitionObjects, m, ev, 
				targets, targetObject, t;

			// crawl all states, events and transitions
			for (n = 0; n < states.length; n++) {

				stateObj = states[n];

				var id = stateObj.id;
				if (!id.startsWith('$')){
					_states.push(id);
				}

				transitionObjects = stateObj.transitions;
				for (m = 0; m < transitionObjects.length; m++) {
					
					targets = transitionObjects[m].targets;
					ev = transitionObjects[m].events;
					events = events.concat(ev);
					
					if (targets) {
						for (t = 0; t < targets.length; t++) {
							
							targetObject = targets[t];
							if (typeof transitions[ev] === 'undefined') {
								transitions[ev] = targetObject.id;
							}
							else {
								var tmp = transitions[ev];
								
								if (typeof tmp === 'string') {
									var a = new Array();
									a.push(targetObject.id);
								}
								else if (tmp instanceof Array) {
									transitions[ev].push(targetObject[ev]);
								}
							}
						}
					}
					else {
						transitions[ev] = stateObj.id;
					}
				}

				_transitions.put(stateObj.id, transitions);
				transitions = {};

				_events.put(stateObj.id, events);
				events = [];
			}

		})();

		return {

			_scion : _scion,

			_states : _states,

			_events : _events,

			_transitions : _transitions,

			start : function() {
				_scion.start();
			},

			ignoreScript : function() {
				_scion.opts.retrace = true;
			},

			evalScript : function() {
				_scion.opts.retrace = false;
			},

			gen : function(event, data) {
				_scion.gen(event, data);
			},

			getStates : function() {
				return _scion.getConfiguration();
			},

			getActiveStates : function() {
				return _scion.getFullConfiguration();
			},

			getEvents : function() {
				var i, events = [], states = _scion.getConfiguration();
				for (i = 0; i < states.length; i++) {
					events = events.concat(_events.get(states[i]));
				}
				return events;
			},

			getActiveEvents : function() {
				
				var i, events = [], states = _scion.getFullConfiguration();
				
				for (i = 0; i < states.length; i++) {
					events = events.concat(_events.get(states[i]));
				}
				
				return events;
			},

			getTransitions : function() {
				
				var i, t, e, transitions = {}, states = _scion.getConfiguration();

				for (i = 0; i < states.length; i++) {
					
					t = _transitions.get(states[i]);
					
					for (e in t) {
						transitions[e] = t[e];
					}
				}
				
				return transitions;
			},

			getActiveTransitions : function() {
				
				var i, t, e, transitions = {}, states = _scion.getFullConfiguration();

				for (i = 0; i < states.length; i++) {
					
					t = _transitions.get(states[i]);
					
					for (e in t) {
						transitions[e] = t[e];
					}
				}
				
				return transitions;
			}

		};//END: return {...
		
	};//END: return function(_scion) {...
		
});//END: define(...
