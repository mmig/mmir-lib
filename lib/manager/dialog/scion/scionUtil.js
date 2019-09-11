
/**
 * Module for Extended SCION impl.
 *
 * @class StateEngineExtender
 * @memberOf mmir.state
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
	 * @memberOf mmir.state.StateEngineExtender#
	 */
	var extend = function (_scion, isNewApi) {

		/*
		 * if (testbed._util) return testbed._util;
		 */

		/** @memberOf mmir.state.StateEngineExtender#
		 * @private  */
		var _states = [];
		/** @memberOf mmir.state.StateEngineExtender#
		 * @private  */
		var _transitions = new Map();
		/** @memberOf mmir.state.StateEngineExtender#
		 * @private  */
		var _events = new Map();


		(function() {

			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var events = [];
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var transitions = {};
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var states = (isNewApi? _scion._model : _scion.model).states;


			//temporary variables:
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var n;
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var stateObj;
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var transitionObjects;
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var m;
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var ev;
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var targets;
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
			var targetObject;
			/** @memberOf mmir.state.StateEngineExtender#
			 * @private  */
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

		/**
		 * @class ExtendedStateEngineImpl
		 * @memberOf mmir.state
		 */
		return /** @lends mmir.state.ExtendedStateEngineImpl# */ {

			/** @memberOf mmir.state.ExtendedStateEngineImpl# */
			_scion : _scion,

			/** @public */
			_states : _states,

			/** @public */
			_events : _events,

			/** @public */
			_transitions : _transitions,

			/** @public */
			start : function() {
				this._scion.start();
			},

			/** @public */
			ignoreScript : function() {
				this._scion.opts.retrace = true;
			},

			/** @public */
			evalScript : function() {
				this._scion.opts.retrace = false;
			},

			/** @public */
			gen : function(event, data) {
				this._scion.gen(event, data);
			},

			/** @public */
			getStates : function() {
				return this._scion.getConfiguration();
			},

			/** @public */
			getActiveStates : function() {
				return this._scion.getFullConfiguration();
			},

			/** @public */
			getEvents : function() {
				var i, events = [], states = this._scion.getConfiguration();
				for (i = 0; i < states.length; i++) {
					events = events.concat(this._events.get(states[i]));
				}
				return events;
			},

			/** @public */
			getActiveEvents : function() {

				var i, events = [], states = this._scion.getFullConfiguration();

				for (i = 0; i < states.length; i++) {
					events = events.concat(this._events.get(states[i]));
				}

				return events;
			},

			/** @public */
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

			/** @public */
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
