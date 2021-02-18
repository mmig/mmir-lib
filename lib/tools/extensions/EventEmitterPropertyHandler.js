

/**
 * extends class EventEmitter (module "mmirf/events") with method
 * <pre>
 * EventEmitter.prototype.createEventHandlerProperty(eventName)
 * </pre>
 *
 * Creates a property for on[eventName] (all lower case) that adds/removes a listener
 * when property is set / unset.
 *
 * @requires Object.defineProperty
 */
define(['mmirf/events'], function(EventEmitter){

/**
 * Helper for creating event handler properties on the EventEmitter context:
 * for example, for event "SoundStart" the property "onsoundstart" would be created.
 *
 * Setting a value with type <code>function</code> to the created property, adds the value as listener for the event;
 * if it replaces a value, the previously set/added listener will be removed first.
 *
 * NOTE: the EventEmitter instance must have been initialized with a valid context / <code>thisArg</code>
 *       other than <code>null</code> (see constructor), otherwise this function will throw an error.
 *
 * NOTE: should not be used in combination with <code>enableHooks</code> (see constructor)
 *       (which offers an alternative low resources workaround for creating event handler properties)
 *
 * @param {String} eventName name for the event for which the event handler property should be created
 *
 * @throws {TypeError} if EventEmitter was initialized without context / <code>thisArg</code>
 *
 * @function
 * @memberOf mmir.extensions.EventEmitter#
 *
 * @example
 *
 * var EventEmitter = mmir.require('mmirf/events');
 *
 * var context = {};// if undefined, the context would be the emitter itself
 * var emitter = new EventEmitter(context);
 *
 * emitter.createEventHandlerProperty('SoundStart');
 *
 * context.onsoundstart = function(){ console.log('sound has started') };
 *
 * emitter.emit('SoundStart');// -> console output: "sound has started"
 *
 * context.onsoundstart = null;// -> unregisters the listener
 */
EventEmitter.prototype.createEventHandlerProperty = function _createEventHandlerProperty(eventName) {

	var propertyName = 'on'+eventName.toLowerCase();
	var interalPropertyField = '_'+propertyName;
	var emitter = this;

	this._ctx[interalPropertyField] = null;
	Object.defineProperty(this._ctx, propertyName, {
		get() {
			return this[interalPropertyField];
		},
		set(newValue) {

			if(this[interalPropertyField] && this[interalPropertyField] !== newValue){
				emitter.off(eventName, this[interalPropertyField]);
			}

			if(typeof newValue === 'function'){
				this[interalPropertyField] = newValue;
				emitter.on(eventName, newValue);
			} else {
				this[interalPropertyField] = null;
			}
		}
	});
};


return EventEmitter;

});
