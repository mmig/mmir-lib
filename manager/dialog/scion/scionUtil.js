
/**
 * Module for Extended SCION impl.
 *
 * @class mmir.env.statemachine.engine.extended
 */
define(['mmirf/dictionary'], function(Dictionary) {

	/**
	 * @param {Engine} _scion
	 * 			the SCION engine instance
 	 * @param {Boolean} isNewApi
 	 * 			if _scion conforms to the >= v3 SCION API
	 *
	 * @return {ExtendedEngine}
	 * 			the extended SCION engine instance
	 *
	 * @memberOf mmir.env.statemachine.engine.extended
	 */
	var extend = function (_scion, isNewApi) {

		/*
		 * if (testbed._util) return testbed._util;
		 */

		/** @memberOf mmir.env.statemachine.engine.extended.private  */
		var _states = [];
		/** @memberOf mmir.env.statemachine.engine.extended.private  */
		var _transitions = new Dictionary();
		/** @memberOf mmir.env.statemachine.engine.extended.private  */
		var _events = new Dictionary();


		(function() {

			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var events = [];
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var transitions = {};
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var states = (isNewApi? _scion._model : _scion.model).states;


			//temporary variables:
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var n;
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var stateObj;
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var transitionObjects;
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var m;
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var ev;
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var targets;
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
			var targetObject;
			/** @memberOf mmir.env.statemachine.engine.extended.private  */
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

				_transitions.put(stateObj.id, transitions);
				transitions = {};

				_events.put(stateObj.id, events);
				events = [];
			}

		})();

		/** @class ExtendedEngineImpl  */
		return {
			/** @scope ExtendedEngineImpl  */

			/** @memberOf ExtendedEngineImpl  */
			_scion : _scion,

			_states : _states,

			_events : _events,

			_transitions : _transitions,

			start : function() {
				this._scion.start();
			},

			ignoreScript : function() {
				this._scion.opts.retrace = true;
			},

			evalScript : function() {
				this._scion.opts.retrace = false;
			},

			gen : function(event, data) {
				this._scion.gen(event, data);
			},

			getStates : function() {
				return this._scion.getConfiguration();
			},

			getActiveStates : function() {
				return this._scion.getFullConfiguration();
			},

			getEvents : function() {
				var i, events = [], states = this._scion.getConfiguration();
				for (i = 0; i < states.length; i++) {
					events = events.concat(this._events.get(states[i]));
				}
				return events;
			},

			getActiveEvents : function() {

				var i, events = [], states = this._scion.getFullConfiguration();

				for (i = 0; i < states.length; i++) {
					events = events.concat(this._events.get(states[i]));
				}

				return events;
			},

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
