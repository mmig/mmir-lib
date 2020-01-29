// inspired by tiny-events:
// https://github.com/ZauberNerd/tiny-events
// MIT License (MIT), Copyright (c) 2014 Björn Brauer

define(['mmirf/util//isArray', 'mmirf/util//toArray'], function(isArray, toArray){

/**
 * <blockquote>
 * Inspired by <a href="https://github.com/ZauberNerd/tiny-events">tiny-events</a><br>
 * MIT License (MIT), Copyright (c) 2014 Björn Brauer
 * </blockquote>
 *
 * Simple Event Emitter / Manager.
 *
 * Optionally, a list of supported events can be specified:
 * if a list of supported events is given, trying the register a listener for an
 * unsupported event will cause an error.
 *
 * @param       {any} [thisArg] OPTIONAL
 *                              this context when emitting events:
 *                              if omitted, the this context will be the EventEmitter
 *                              instance.
 *                              WARNING: if thisArg is an Array, then events argument
 *                                       must also be given, either as an Array, or
 *                                       <code>false</code> for disabling the
 *                                       supported events restriction
 *
 * @param       {Array<string>} [events] OPTIONAL
 * 															A list of supported event types/names:
 * 															if calling EventEmitter.on() with an unsupported
 * 															type, an error will be thrown.
 * 															If omitted, any event type/names is allowed.
 * @constructor
 * @memberOf mmir.tools
 */
function EventEmitter(thisArg, events) {
	if (isArray(thisArg) && typeof events === 'undefined') {
		events = thisArg;
		thisArg = void(0);
	}
	this._ctx = typeof thisArg === 'undefined'? this : thisArg;
	this._events = events? new Set(events) : null;
	this._listeners = new Map();
}

/**
 * Verifies that an event type can be used with the EventEmitter instance
 * (see <code>events</code> argument in constructor).
 *
 * @param       {string} type the event type to check
 *
 * @throws Error if the event type is not supported by the EventEmitter instance
 */
EventEmitter.prototype.verify = function _on(type) {
	if (this._events && !this._events.has(type)) {
		throw new Error('unsupported event '+type+', must be one of '+Array.from(this._events));
	}
};

/**
 * Register a listener for an event type.
 *
 * Will be ignored, if the listener already is registered for that event type.
 *
 * If a list of supported event types is specified for the EventEmitter instance,
 * and <code>type</code> is not a supported type, an error will be thrown.
 *
 * @param       {string} type the event type
 * @param       {Function} listener this listener that will be registered
 * @return      {boolean} <code>true</code> if the listener was registered
 *
 * @throws Error if the event type is not supported by the EventEmitter instance
 */
EventEmitter.prototype.on = function _on(type, listener) {
	this.verify(type);

	var l = this._listeners.get(type);
	if (!l) {
		l = new Set();
		this._listeners.set(type, l);
	}

	if(!l.has(listener)){
		l.add(listener);
		return true;
	}

	return false;
};

/**
 * Register a listener for an event type to be called one time.
 *
 * @param       {string} type the event type
 * @param       {Function} listener this listener that will be registered
 * @return      {boolean} <code>true</code> if the listener was registered
 *
 * @throws Error if the event type is not supported by the EventEmitter instance
 *
 * @see #on
 */
EventEmitter.prototype.once = function _once(type, listener) {
	var self = this;

	function __once() {
		var args = toArray(arguments);
		self.off(type, __once);
		listener.apply(self._ctx, args);
	}

	__once.listener = listener;

	return this.on(type, __once);
};

/**
 * Unregister a listener for an event.
 *
 * @param       {string} type the event type
 * @param       {Function} [listener] OPTIONAL
 * 												 The listener to be removed.
 * 												 If omitted, all listeners for the event type will be
 * 												 removed.
 * @return      {boolean} <code>true</code> if the listener was removed
 */
EventEmitter.prototype.off = function _off(type, listener) {
	var l = this._listeners.get(type);
	if (!l) {
		return false;
	}

	if (typeof listener === 'undefined') {
		this._listeners.delete(type);
		return l.size > 0;
	}

	if(l.delete(listener)) {
		//NOTE remove l, if it becomes empty!
		if(l.size === 0) {
			this._listeners.delete(type);
		}
		return true;
	}

	return false;
};

/**
 * Emit an event to registered listeners.
 *
 * @param       {string} type the event type that will be emitted
 * @param       {...any} [args] OPTIONAL arguments that will be emitted to
 *                              the listeners
 * @return      {boolean} <code>true</code> if at least one listener was notified
 */
EventEmitter.prototype.emit = function _emit(type) {
	var l = this._listeners.get(type);
	if (!l || l.size === 0) {
		return false;
	}

	var size = arguments.length;
	var args = new Array(size - 1);
	for (var i = 1; i < size; ++i) {
		args[i - 1] = arguments[i];
	}

	l.forEach(function __emit(listener) {
		listener.apply(this, args);
	}, this._ctx);

	return true;
};

/**
 * Check if the EventEmitter instance has any listener registered.
 *
 * @return      {boolean} <code>true</code> if no listener is registered
 */
EventEmitter.prototype.empty = function _empty() {
	//ASSERT this._listeners does not contain empty event type collections/Sets
	//       (that is: no empty Sets will be added & if a Set becomes empty, it will be removed)
	return this._listeners.size === 0;
};

/**
 * Get a list of registered listeners for an event type.
 *
 * @param       {string} type the event type
 * @return      {Array<Function>} a list of listeners or undefined, if there
 * 																are none for the event type
 */
EventEmitter.prototype.get = function _get(type) {
	var l = this._listeners.get(type);
	//ASSERT if l is present, then l.size > 0
	return l? toArray(l) : l;
};

/**
 * Check if listener is registered for an event.
 *
 * @param       {string} type the event type
 * @param       {Function} [listener] OPTIONAL
 * 												 The listener to be checked.
 * 												 If omitted, it will be checked, if there is any listener
 * 												 of the event type.
 * @return      {boolean} <code>true</code> if the listener (or any if listener
 * 												 was not specified) is registered for the event type
 */
EventEmitter.prototype.has = function _has(type, listener) {
	var l = this._listeners.get(type);
	//ASSERT if l is present, then l.size > 0
	return l? (listener? l.has(listener) : true) : false;
};

return EventEmitter;

});
