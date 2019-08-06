
/**
 * Module for Extended SCION impl.
 *
 * @class StateEngineExtender
 */
define(function() {

	/**
	 * @param {Engine} _scion
	 * 			the SCION engine instance
	 * @param {Boolean} isNewApi
	 * 			if _scion conforms to the >= v3 SCION API
	 *
	 * @return {ExtendedEngine}
	 * 			the extended SCION engine instance
	 *
	 * @memberOf StateEngineExtender
	 */
	var extend = function (_scion, isNewApi) {

		/*
		 * if (testbed._util) return testbed._util;
		 */

		/** @memberOf StateEngineExtender.private  */
		var _states = [];
		/** @memberOf StateEngineExtender.private  */
		var _transitions = new Map();
		/** @memberOf StateEngineExtender.private  */
		var _events = new Map();


		(function() {

			/** @memberOf StateEngineExtender.private  */
			var events = [];
			/** @memberOf StateEngineExtender.private  */
			var transitions = {};
			/** @memberOf StateEngineExtender.private  */
			var states = (isNewApi? _scion._model : _scion.model).states;


			//temporary variables:
			/** @memberOf StateEngineExtender.private  */
			var n;
			/** @memberOf StateEngineExtender.private  */
			var stateObj;
			/** @memberOf StateEngineExtender.private  */
			var transitionObjects;
			/** @memberOf StateEngineExtender.private  */
			var m;
			/** @memberOf StateEngineExtender.private  */
			var ev;
			/** @memberOf StateEngineExtender.private  */
			var targets;
			/** @memberOf StateEngineExtender.private  */
			var targetObject;
			/** @memberOf StateEngineExtender.private  */
			var t;

			// crawl all states, events and transitions
			for (n = 0; n < states.length; n++) {

				stateObj = states[n];

				var id = stateObj.id;
				if (id[0] !== '$'){
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

				_transitions.set(stateObj.id, transitions);
				transitions = {};

				_events.set(stateObj.id, events);
				events = [];
			}

		})();

		/** @class ExtendedStateEngineImpl */
		return {
			/** @scope ExtendedStateEngineImpl */

			/** @memberOf ExtendedStateEngineImpl */
			_scion : _scion,

			/** @memberOf ExtendedStateEngineImpl */
			_states : _states,

			/** @memberOf ExtendedStateEngineImpl */
			_events : _events,

			/** @memberOf ExtendedStateEngineImpl */
			_transitions : _transitions,

			/** @memberOf ExtendedStateEngineImpl */
			start : function() {
				this._scion.start();
			},

			/** @memberOf ExtendedStateEngineImpl */
			ignoreScript : function() {
				this._scion.opts.retrace = true;
			},

			/** @memberOf ExtendedStateEngineImpl */
			evalScript : function() {
				this._scion.opts.retrace = false;
			},

			/** @memberOf ExtendedStateEngineImpl */
			gen : function(event, data) {
				this._scion.gen(event, data);
			},

			/** @memberOf ExtendedStateEngineImpl */
			getStates : function() {
				return this._scion.getConfiguration();
			},

			/** @memberOf ExtendedStateEngineImpl */
			getActiveStates : function() {
				return this._scion.getFullConfiguration();
			},

			/** @memberOf ExtendedStateEngineImpl */
			getEvents : function() {
				var i, events = [], states = this._scion.getConfiguration();
				for (i = 0; i < states.length; i++) {
					events = events.concat(this._events.get(states[i]));
				}
				return events;
			},

			/** @memberOf ExtendedStateEngineImpl */
			getActiveEvents : function() {

				var i, events = [], states = this._scion.getFullConfiguration();

				for (i = 0; i < states.length; i++) {
					events = events.concat(this._events.get(states[i]));
				}

				return events;
			},

			/** @memberOf ExtendedStateEngineImpl */
			getTransitions : function() {

				var i, t, e, transitions = {}, states = this._scion.getConfiguration();

				for (i = 0; i < states.length; i++) {

					t = this._transitions.get(states[i]);

					for (e in t) {
						transitions[e] = t[e];
					}
				}

				return transitions;
			},

			/** @memberOf ExtendedStateEngineImpl */
			getActiveTransitions : function() {

				var i, t, e, transitions = {}, states = this._scion.getFullConfiguration();

				for (i = 0; i < states.length; i++) {

					t = this._transitions.get(states[i]);

					for (e in t) {
						transitions[e] = t[e];
					}
				}

				return transitions;
			}

		};//END: return {...

	};//END: extend = function(_scion) {...

	return extend;

});//END: define(...
