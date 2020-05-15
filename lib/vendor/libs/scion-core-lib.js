(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["scionCoreLib"] = factory();
	else
		root["scionCoreLib"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! @scion-scxml/core */ "./node_modules/@scion-scxml/core/lib/Statechart.js");

/***/ }),

/***/ "./node_modules/@scion-scxml/core-base/lib/ArraySet.js":
/*!*************************************************************!*\
  !*** ./node_modules/@scion-scxml/core-base/lib/ArraySet.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/* begin ArraySet */

/** @constructor */
function ArraySet(l) {
  l = l || [];
  this.o = new Set(l);
}

ArraySet.prototype = {
  add: function add(x) {
    this.o.add(x);
  },
  remove: function remove(x) {
    return this.o["delete"](x);
  },
  union: function union(l) {
    var _iterator = _createForOfIteratorHelper(l.o),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var v = _step.value;
        this.o.add(v);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return this;
  },
  difference: function difference(l) {
    var _iterator2 = _createForOfIteratorHelper(l.o),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var v = _step2.value;
        this.o["delete"](v);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return this;
  },
  contains: function contains(x) {
    return this.o.has(x);
  },
  iter: function iter() {
    return Array.from(this.o);
  },
  isEmpty: function isEmpty() {
    return !this.o.size;
  },
  size: function size() {
    return this.o.size;
  },
  equals: function equals(s2) {
    if (this.o.size !== s2.size()) {
      return false;
    }

    var _iterator3 = _createForOfIteratorHelper(this.o),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var v = _step3.value;

        if (!s2.contains(v)) {
          return false;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    return true;
  },
  toString: function toString() {
    return this.o.size === 0 ? '<empty>' : Array.from(this.o).join(',\n');
  }
};
module.exports = ArraySet;

/***/ }),

/***/ "./node_modules/@scion-scxml/core-base/lib/constants.js":
/*!**************************************************************!*\
  !*** ./node_modules/@scion-scxml/core-base/lib/constants.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var STATE_TYPES = {
  BASIC: 0,
  COMPOSITE: 1,
  PARALLEL: 2,
  HISTORY: 3,
  INITIAL: 4,
  FINAL: 5
};
var SCXML_IOPROCESSOR_TYPE = 'http://www.w3.org/TR/scxml/#SCXMLEventProcessor';
var HTTP_IOPROCESSOR_TYPE = 'http://www.w3.org/TR/scxml/#BasicHTTPEventProcessor';
var RX_TRAILING_WILDCARD = /\.\*$/;
module.exports = {
  STATE_TYPES: STATE_TYPES,
  SCXML_IOPROCESSOR_TYPE: SCXML_IOPROCESSOR_TYPE,
  HTTP_IOPROCESSOR_TYPE: HTTP_IOPROCESSOR_TYPE,
  RX_TRAILING_WILDCARD: RX_TRAILING_WILDCARD
};

/***/ }),

/***/ "./node_modules/@scion-scxml/core-base/lib/helpers.js":
/*!************************************************************!*\
  !*** ./node_modules/@scion-scxml/core-base/lib/helpers.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var constants = __webpack_require__(/*! ./constants */ "./node_modules/@scion-scxml/core-base/lib/constants.js"),
    STATE_TYPES = constants.STATE_TYPES,
    RX_TRAILING_WILDCARD = constants.RX_TRAILING_WILDCARD;

var printTrace = false;
module.exports = {
  extend: extend,
  transitionWithTargets: transitionWithTargets,
  transitionComparator: transitionComparator,
  initializeModel: initializeModel,
  isEventPrefixMatch: isEventPrefixMatch,
  isTransitionMatch: isTransitionMatch,
  scxmlPrefixTransitionSelector: scxmlPrefixTransitionSelector,
  eventlessTransitionSelector: eventlessTransitionSelector,
  getTransitionWithHigherSourceChildPriority: getTransitionWithHigherSourceChildPriority,
  sortInEntryOrder: sortInEntryOrder,
  getStateWithHigherSourceChildPriority: getStateWithHigherSourceChildPriority,
  initializeModelGeneratorFn: initializeModelGeneratorFn,
  deserializeSerializedConfiguration: deserializeSerializedConfiguration,
  deserializeHistory: deserializeHistory
};

function extend(to, from) {
  Object.keys(from).forEach(function (k) {
    to[k] = from[k];
  });
  return to;
}

;

function transitionWithTargets(t) {
  return t.targets;
}

function transitionComparator(t1, t2) {
  return t1.documentOrder - t2.documentOrder;
}

function initializeModel(rootState, opts) {
  var transitions = [],
      idToStateMap = new Map(),
      documentOrder = 0; //TODO: need to add fake ids to anyone that doesn't have them
  //FIXME: make this safer - break into multiple passes

  var idCount = {};

  function generateId(type) {
    if (idCount[type] === undefined) idCount[type] = 0;

    do {
      var count = idCount[type]++;
      var id = '$generated-' + type + '-' + count;
    } while (idToStateMap.has(id));

    return id;
  }

  function wrapInFakeRootState(state) {
    return {
      $deserializeDatamodel: state.$deserializeDatamodel || function () {},
      $serializeDatamodel: state.$serializeDatamodel || function () {
        return null;
      },
      $idToStateMap: idToStateMap,
      //keep this for handy deserialization of serialized configuration
      docUrl: state.docUrl,
      name: state.name,
      states: [{
        $type: 'initial',
        transitions: [{
          target: state
        }]
      }, state]
    };
  }

  var statesWithInitialAttributes = [];
  /**
    @this {SCTransition}
  */

  function transitionToString(sourceState) {
    return "".concat(sourceState, " -- ").concat(this.events ? '(' + this.events.join(',') + ')' : null).concat(this.cond ? '[' + this.cond.name + ']' : '', " --> ").concat(this.targets ? this.targets.join(',') : null);
  }
  /**
    @this {SCState}
  */


  function stateToString() {
    return this.id;
  }

  function populateStateIdMap(state) {
    //populate state id map
    if (state.id) {
      idToStateMap.set(state.id, state);
    }

    if (state.states) {
      for (var j = 0, len = state.states.length; j < len; j++) {
        populateStateIdMap(state.states[j]);
      }
    }
  }

  function traverse(ancestors, state) {
    if (printTrace) state.toString = stateToString; //add to global transition and state id caches

    if (state.transitions) transitions.push.apply(transitions, state.transitions); //create a default type, just to normalize things
    //this way we can check for unsupported types below

    state.$type = state.$type || 'state'; //add ancestors and depth properties

    state.ancestors = ancestors;
    state.depth = ancestors.length;
    state.parent = ancestors[0];
    state.documentOrder = documentOrder++; //add some information to transitions

    state.transitions = state.transitions || [];

    for (var j = 0, len = state.transitions.length; j < len; j++) {
      var transition = state.transitions[j];
      transition.documentOrder = documentOrder++;
      transition.source = state;
      if (printTrace) transition.toString = transitionToString.bind(transition, state);
    }

    ; //recursive step

    if (state.states) {
      var ancs = [state].concat(ancestors);

      for (var j = 0, len = state.states.length; j < len; j++) {
        traverse(ancs, state.states[j]);
      }
    } //setup fast state type


    switch (state.$type) {
      case 'parallel':
        state.typeEnum = STATE_TYPES.PARALLEL;
        state.isAtomic = false;
        break;

      case 'initial':
        state.typeEnum = STATE_TYPES.INITIAL;
        state.isAtomic = true;
        break;

      case 'history':
        state.typeEnum = STATE_TYPES.HISTORY;
        state.isAtomic = true;
        break;

      case 'final':
        state.typeEnum = STATE_TYPES.FINAL;
        state.isAtomic = true;
        break;

      case 'state':
      case 'scxml':
        if (state.states && state.states.length) {
          state.typeEnum = STATE_TYPES.COMPOSITE;
          state.isAtomic = false;
        } else {
          state.typeEnum = STATE_TYPES.BASIC;
          state.isAtomic = true;
        }

        break;

      default:
        throw new Error('Unknown state type: ' + state.$type);
    } //descendants property on states will now be populated. add descendants to this state


    if (state.states) {
      state.descendants = state.states.concat(state.states.map(function (s) {
        return s.descendants;
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []));
    } else {
      state.descendants = [];
    }

    var initialChildren;

    if (state.typeEnum === STATE_TYPES.COMPOSITE) {
      //set up initial state
      if (Array.isArray(state.initial) || typeof state.initial === 'string') {
        statesWithInitialAttributes.push(state);
      } else {
        //take the first child that has initial type, or first child
        initialChildren = state.states.filter(function (child) {
          return child.$type === 'initial';
        });
        state.initialRef = [initialChildren.length ? initialChildren[0] : state.states[0]];
        checkInitialRef(state);
      }
    } //hook up history


    if (state.typeEnum === STATE_TYPES.COMPOSITE || state.typeEnum === STATE_TYPES.PARALLEL) {
      var historyChildren = state.states.filter(function (s) {
        return s.$type === 'history';
      });
      state.historyRef = historyChildren;
    } //now it's safe to fill in fake state ids


    if (!state.id) {
      state.id = generateId(state.$type);
      idToStateMap.set(state.id, state);
    } //normalize onEntry/onExit, which can be single fn or array, or array of arrays (blocks)


    ['onEntry', 'onExit'].forEach(function (prop) {
      if (state[prop]) {
        if (!Array.isArray(state[prop])) {
          state[prop] = [state[prop]];
        }

        if (!state[prop].every(function (handler) {
          return Array.isArray(handler);
        })) {
          state[prop] = [state[prop]];
        }
      }
    });

    if (state.invokes && !Array.isArray(state.invokes)) {
      state.invokes = [state.invokes];
      state.invokes.forEach(function (invoke) {
        if (invoke.finalize && !Array.isArray(invoke.finalize)) {
          invoke.finalize = [invoke.finalize];
        }
      });
    }
  } //TODO: convert events to regular expressions in advance


  function checkInitialRef(state) {
    if (!state.initialRef) throw new Error('Unable to locate initial state for composite state: ' + state.id);
  }

  function connectIntialAttributes() {
    for (var j = 0, len = statesWithInitialAttributes.length; j < len; j++) {
      var s = statesWithInitialAttributes[j];
      var initialStates = Array.isArray(s.initial) ? s.initial : [s.initial];
      s.initialRef = initialStates.map(function (initialState) {
        return idToStateMap.get(initialState);
      });
      checkInitialRef(s);
    }
  }

  var RX_WHITESPACE = /\s+/;

  function connectTransitionGraph() {
    //normalize as with onEntry/onExit
    for (var i = 0, len = transitions.length; i < len; i++) {
      var t = transitions[i];

      if (t.onTransition && !Array.isArray(t.onTransition)) {
        t.onTransition = [t.onTransition];
      } //normalize "event" attribute into "events" attribute


      if (typeof t.event === 'string') {
        t.events = t.event.trim().split(RX_WHITESPACE);
      }

      delete t.event;

      if (t.targets || typeof t.target === 'undefined') {
        //targets have already been set up
        continue;
      }

      if (typeof t.target === 'string') {
        var target = idToStateMap.get(t.target);
        if (!target) throw new Error('Unable to find target state with id ' + t.target);
        t.target = target;
        t.targets = [t.target];
      } else if (Array.isArray(t.target)) {
        t.targets = t.target.map(function (target) {
          if (typeof target === 'string') {
            target = idToStateMap.get(target);
            if (!target) throw new Error('Unable to find target state with id ' + t.target);
            return target;
          } else {
            return target;
          }
        });
      } else if (_typeof(t.target) === 'object') {
        t.targets = [t.target];
      } else {
        throw new Error('Transition target has unknown type: ' + t.target);
      }
    } //hook up LCA - optimization


    for (var i = 0, len = transitions.length; i < len; i++) {
      var t = transitions[i];
      if (t.targets) t.lcca = getLCCA(t.source, t.targets[0]); //FIXME: we technically do not need to hang onto the lcca. only the scope is used by the algorithm

      t.scope = getScope(t);
    }
  }

  function getScope(transition) {
    //Transition scope is normally the least common compound ancestor (lcca).
    //Internal transitions have a scope equal to the source state.
    var transitionIsReallyInternal = transition.type === 'internal' && transition.source.typeEnum === STATE_TYPES.COMPOSITE && //is transition source a composite state
    transition.source.parent && //root state won't have parent
    transition.targets && //does it target its descendants
    transition.targets.every(function (target) {
      return transition.source.descendants.indexOf(target) > -1;
    });

    if (!transition.targets) {
      return null;
    } else if (transitionIsReallyInternal) {
      return transition.source;
    } else {
      return transition.lcca;
    }
  }

  function getLCCA(s1, s2) {
    var commonAncestors = [];

    for (var j = 0, len = s1.ancestors.length; j < len; j++) {
      var anc = s1.ancestors[j];

      if ((opts && opts.legacySemantics ? anc.typeEnum === STATE_TYPES.COMPOSITE : anc.typeEnum === STATE_TYPES.COMPOSITE || anc.typeEnum === STATE_TYPES.PARALLEL) && anc.descendants.indexOf(s2) > -1) {
        commonAncestors.push(anc);
      }
    }

    ;
    if (!commonAncestors.length) throw new Error("Could not find LCA for states.");
    return commonAncestors[0];
  } //main execution starts here
  //FIXME: only wrap in root state if it's not a compound state


  populateStateIdMap(rootState);
  var fakeRootState = wrapInFakeRootState(rootState); //I wish we had pointer semantics and could make this a C-style "out argument". Instead we return him

  traverse([], fakeRootState);
  connectTransitionGraph();
  connectIntialAttributes();
  return fakeRootState;
}

function isEventPrefixMatch(prefix, fullName) {
  prefix = prefix.replace(RX_TRAILING_WILDCARD, '');

  if (prefix === fullName) {
    return true;
  }

  if (prefix.length > fullName.length) {
    return false;
  }

  if (fullName.charAt(prefix.length) !== '.') {
    return false;
  }

  return fullName.indexOf(prefix) === 0;
}

function isTransitionMatch(t, eventName) {
  return t.events.some(function (tEvent) {
    return tEvent === '*' || isEventPrefixMatch(tEvent, eventName);
  });
}

function scxmlPrefixTransitionSelector(t, event, evaluator, selectEventlessTransitions) {
  return (selectEventlessTransitions ? !t.events : t.events && event && event.name && isTransitionMatch(t, event.name)) && (!t.cond || evaluator(t.cond));
}

function eventlessTransitionSelector(state) {
  return state.transitions.filter(function (transition) {
    return !transition.events || transition.events && transition.events.length === 0;
  });
} //priority comparison functions


function getTransitionWithHigherSourceChildPriority(_args) {
  var t1 = _args[0],
      t2 = _args[1];
  var r = getStateWithHigherSourceChildPriority(t1.source, t2.source); //compare transitions based first on depth, then based on document order

  if (t1.source.depth < t2.source.depth) {
    return t2;
  } else if (t2.source.depth < t1.source.depth) {
    return t1;
  } else {
    if (t1.documentOrder < t2.documentOrder) {
      return t1;
    } else {
      return t2;
    }
  }
}

function sortInEntryOrder(s1, s2) {
  return getStateWithHigherSourceChildPriority(s1, s2) * -1;
}

function getStateWithHigherSourceChildPriority(s1, s2) {
  //compare states based first on depth, then based on document order
  if (s1.depth > s2.depth) {
    return -1;
  } else if (s1.depth < s2.depth) {
    return 1;
  } else {
    //Equality
    if (s1.documentOrder < s2.documentOrder) {
      return 1;
    } else if (s1.documentOrder > s2.documentOrder) {
      return -1;
    } else {
      return 0;
    }
  }
}

function initializeModelGeneratorFn(modelFn, opts, interpreter) {
  return modelFn.call(interpreter, opts._x, opts._x._sessionid, opts._x._ioprocessors, interpreter.isIn.bind(interpreter));
}

function deserializeSerializedConfiguration(serializedConfiguration, idToStateMap) {
  return serializedConfiguration.map(function (id) {
    var state = idToStateMap.get(id);
    if (!state) throw new Error('Error loading serialized configuration. Unable to locate state with id ' + id);
    return state;
  });
}

function deserializeHistory(serializedHistory, idToStateMap) {
  var o = {};
  Object.keys(serializedHistory).forEach(function (sid) {
    o[sid] = serializedHistory[sid].map(function (id) {
      var state = idToStateMap.get(id);
      if (!state) throw new Error('Error loading serialized history. Unable to locate state with id ' + id);
      return state;
    });
  });
  return o;
}

/***/ }),

/***/ "./node_modules/@scion-scxml/core-base/lib/query.js":
/*!**********************************************************!*\
  !*** ./node_modules/@scion-scxml/core-base/lib/query.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(/*! ./constants */ "./node_modules/@scion-scxml/core-base/lib/constants.js"); //model accessor functions


var query = {
  isDescendant: function isDescendant(s1, s2) {
    //Returns 'true' if state1 is a descendant of state2 (a child, or a child of a child, or a child of a child of a child, etc.) Otherwise returns 'false'.
    return s2.descendants.indexOf(s1) > -1;
  },
  getAncestors: function getAncestors(s, root) {
    var ancestors, index, state;
    index = s.ancestors.indexOf(root);

    if (index > -1) {
      return s.ancestors.slice(0, index);
    } else {
      return s.ancestors;
    }
  },
  isOrthogonalTo: function isOrthogonalTo(s1, s2) {
    //Two control states are orthogonal if they are not ancestrally
    //related, and their smallest, mutual parent is a Concurrent-state.
    return !this.isAncestrallyRelatedTo(s1, s2) && this.getLCA(s1, s2).typeEnum === constants.STATE_TYPES.PARALLEL;
  },
  isAncestrallyRelatedTo: function isAncestrallyRelatedTo(s1, s2) {
    //Two control states are ancestrally related if one is child/grandchild of another.
    return this.getAncestorsOrSelf(s2).indexOf(s1) > -1 || this.getAncestorsOrSelf(s1).indexOf(s2) > -1;
  },
  getAncestorsOrSelf: function getAncestorsOrSelf(s, root) {
    return [s].concat(query.getAncestors(s, root));
  },
  getDescendantsOrSelf: function getDescendantsOrSelf(s) {
    return [s].concat(s.descendants);
  },
  getLCA: function getLCA(s1, s2) {
    var commonAncestors = this.getAncestors(s1).filter(function (a) {
      return a.descendants.indexOf(s2) > -1;
    }, this);
    return commonAncestors[0];
  }
};
module.exports = query;

/***/ }),

/***/ "./node_modules/@scion-scxml/core-base/lib/scion-core-base.js":
/*!********************************************************************!*\
  !*** ./node_modules/@scion-scxml/core-base/lib/scion-core-base.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, setImmediate) {//   Copyright 2012-2012 Jacob Beard, INFICON, and other SCION contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

/**
 * SCION-CORE global object
 * @namespace scion
 */

/**
 * An Array of strings representing the ids all of the basic states the
 * interpreter is in after a big-step completes.
 * @typedef {Array<string>} Configuration
 */

/**
 * A set of basic and composite state ids.
 * @typedef {Array<string>} FullConfiguration
 */

/**
 * A set of basic and composite state ids.
 * @typedef {Array<string>} FullConfiguration
 */


function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var EventEmitter = __webpack_require__(/*! tiny-events */ "./node_modules/tiny-events/lib/index.js").EventEmitter,
    util = __webpack_require__(/*! util */ "./node_modules/util/util.js"),
    ArraySet = __webpack_require__(/*! ./ArraySet */ "./node_modules/@scion-scxml/core-base/lib/ArraySet.js"),
    constants = __webpack_require__(/*! ./constants */ "./node_modules/@scion-scxml/core-base/lib/constants.js"),
    helpers = __webpack_require__(/*! ./helpers */ "./node_modules/@scion-scxml/core-base/lib/helpers.js"),
    query = __webpack_require__(/*! ./query */ "./node_modules/@scion-scxml/core-base/lib/query.js"),
    extend = helpers.extend,
    transitionWithTargets = helpers.transitionWithTargets,
    transitionComparator = helpers.transitionComparator,
    initializeModel = helpers.initializeModel,
    isEventPrefixMatch = helpers.isEventPrefixMatch,
    isTransitionMatch = helpers.isTransitionMatch,
    scxmlPrefixTransitionSelector = helpers.scxmlPrefixTransitionSelector,
    eventlessTransitionSelector = helpers.eventlessTransitionSelector,
    getTransitionWithHigherSourceChildPriority = helpers.getTransitionWithHigherSourceChildPriority,
    sortInEntryOrder = helpers.sortInEntryOrder,
    getStateWithHigherSourceChildPriority = helpers.getStateWithHigherSourceChildPriority,
    initializeModelGeneratorFn = helpers.initializeModelGeneratorFn,
    deserializeSerializedConfiguration = helpers.deserializeSerializedConfiguration,
    deserializeHistory = helpers.deserializeHistory,
    BASIC = constants.STATE_TYPES.BASIC,
    COMPOSITE = constants.STATE_TYPES.COMPOSITE,
    PARALLEL = constants.STATE_TYPES.PARALLEL,
    HISTORY = constants.STATE_TYPES.HISTORY,
    INITIAL = constants.STATE_TYPES.INITIAL,
    FINAL = constants.STATE_TYPES.FINAL,
    SCXML_IOPROCESSOR_TYPE = constants.SCXML_IOPROCESSOR_TYPE;

var printTrace = typeof process !== 'undefined' && !!process.env.DEBUG;
/**
 * @interface EventEmitter
 */

/**
* @event scion.BaseInterpreter#onError
* @property {string} tagname The name of the element that produced the error. 
* @property {number} line The line in the source file in which the error occurred.
* @property {number} column The column in the source file in which the error occurred.
* @property {string} reason An informative error message. The text is platform-specific and subject to change.
*/

/**
 * @function
 * @name EventEmitter.prototype#on
 * @param {string} type
 * @param {callback} listener
 */

/**
 * @function
 * @name EventEmitter.prototype#once
 * @param {string} type
 * @param {callback} listener
 */

/**
 * @function
 * @name EventEmitter.prototype#off
 * @param {string} type
 * @param {callback} listener
 */

/**
 * @function
 * @name EventEmitter.prototype#emit
 * @param {string} type
 * @param {any} args
 */

/** 
 * @description The SCXML constructor creates an interpreter instance from a model object.
 * @abstract
 * @class BaseInterpreter
 * @memberof scion
 * @extends EventEmitter
 * @param {SCJSON | scxml.ModelFactory} modelOrModelFactory Either an SCJSON root state; or an scxml.ModelFactory, which is a function which returns an SCJSON object. 
 * @param opts
 * @param {string} [opts.sessionid] Used to populate SCXML _sessionid.
 * @param {function} [opts.generateSessionid] Factory used to generate sessionid if sessionid keyword is not specified
 * @param {Map<string, BaseInterpreter>} [opts.sessionRegistry] Map used to map sessionid strings to Statechart instances.
 * @param [opts.Set] Class to use as an ArraySet. Defaults to ES6 Set.
 * @param {object} [opts.params]  Used to pass params from invoke. Sets the datamodel when interpreter is instantiated.
 * @param {Snapshot} [opts.snapshot] State machine snapshot. Used to restore a serialized state machine.
 * @param {Statechart} [opts.parentSession]  Used to pass parent session during invoke.
 * @param {string }[opts.invokeid]  Support for id of invoke element at runtime.
 * @param {boolean} [opts.legacySemantics]
 * @param [opts.console]
 * @param [opts.transitionSelector]
 * @param [opts.customCancel]
 * @param [opts.customSend]
 * @param [opts.sendAsync]
 * @param [opts.doSend]
 * @param [opts.invokers]
 * @param [opts.xmlParser]
 * @param [opts.interpreterScriptingContext]
 * @param [opts.invokerExecutionContext]
 */

var BaseInterpreter = /*#__PURE__*/function (_EventEmitter) {
  _inherits(BaseInterpreter, _EventEmitter);

  var _super = _createSuper(BaseInterpreter);

  function BaseInterpreter(modelOrModelFactory, opts) {
    var _this;

    _classCallCheck(this, BaseInterpreter);

    _this = _super.call(this);
    _this.opts = opts;
    _this.opts.InterpreterScriptingContext = _this.opts.InterpreterScriptingContext || InterpreterScriptingContext;
    _this._isStepping = false;
    _this._scriptingContext = _this.opts.interpreterScriptingContext || (_this.opts.InterpreterScriptingContext ? new _this.opts.InterpreterScriptingContext(_assertThisInitialized(_this)) : {});
    _this.opts.generateSessionid = _this.opts.generateSessionid || BaseInterpreter.generateSessionid;
    _this.opts.sessionid = _this.opts.sessionid || _this.opts.generateSessionid();
    _this.opts.sessionRegistry = _this.opts.sessionRegistry || BaseInterpreter.sessionRegistry; //TODO: define a better interface. For now, assume a Map<sessionid, session>

    _this.opts.invokerExecutionContext = opts.invokerExecutionContext || modelOrModelFactory._executionContext;
    var _ioprocessors = {};
    _ioprocessors[SCXML_IOPROCESSOR_TYPE] = {
      location: "#_scxml_".concat(_this.opts.sessionid)
    };
    _ioprocessors.scxml = _ioprocessors[SCXML_IOPROCESSOR_TYPE]; //alias
    //SCXML system variables:

    _this.opts._x = {
      _sessionid: _this.opts.sessionid,
      _ioprocessors: _ioprocessors
    };
    var model;

    if (typeof modelOrModelFactory === 'function') {
      model = initializeModelGeneratorFn(modelOrModelFactory, _this.opts, _assertThisInitialized(_this));
    } else if (_typeof(modelOrModelFactory) === 'object') {
      model = JSON.parse(JSON.stringify(modelOrModelFactory)); //assume object
    } else {
      throw new Error('Unexpected model type. Expected model factory function, or scjson object.');
    }

    _this._model = initializeModel(model, _this.opts);
    _this.opts.console = _this.opts.console || (typeof console === 'undefined' ? {
      log: function log() {}
    } : console); //rely on global console if this console is undefined

    _this.opts.Set = _this.opts.Set || ArraySet;
    _this.opts.priorityComparisonFn = _this.opts.priorityComparisonFn || getTransitionWithHigherSourceChildPriority;
    _this.opts.transitionSelector = _this.opts.transitionSelector || scxmlPrefixTransitionSelector;

    _this.opts.sessionRegistry.set(String(_this.opts.sessionid), _assertThisInitialized(_this));

    _this._scriptingContext.log = _this._scriptingContext.log || function log() {
      if (this.opts.console.log.apply) {
        this.opts.console.log.apply(this.opts.console, arguments);
      } else {
        //console.log on older IE does not support Function.apply, so just pass him the first argument. Best we can do for now.
        this.opts.console.log(Array.prototype.slice.apply(arguments).join(','));
      }
    }.bind(_assertThisInitialized(_this)); //set up default scripting context log function


    _this._externalEventQueue = [];
    _this._internalEventQueue = [];

    if (_this.opts.params) {
      _this._model.$deserializeDatamodel(_this.opts.params); //load up the datamodel

    } //check if we're loading from a previous snapshot


    if (_this.opts.snapshot) {
      _this._configuration = new _this.opts.Set(deserializeSerializedConfiguration(_this.opts.snapshot[0], _this._model.$idToStateMap));
      _this._historyValue = deserializeHistory(_this.opts.snapshot[1], _this._model.$idToStateMap);
      _this._isInFinalState = _this.opts.snapshot[2];

      _this._model.$deserializeDatamodel(_this.opts.snapshot[3]); //load up the datamodel


      _this._internalEventQueue = _this.opts.snapshot[4];
    } else {
      _this._configuration = new _this.opts.Set();
      _this._historyValue = {};
      _this._isInFinalState = false;
    } //add debug logging


    BaseInterpreter.EVENTS.forEach(function (event) {
      this.on(event, this._log.bind(this, event));
    }, _assertThisInitialized(_this));
    module.exports.emit('new', _assertThisInitialized(_this));
    return _this;
  }
  /** 
  * Cancels the session. This clears all timers; puts the interpreter in a
  * final state; and runs all exit actions on current states.
  * @memberof BaseInterpreter.prototype
  */


  _createClass(BaseInterpreter, [{
    key: "cancel",
    value: function cancel() {
      delete this.opts.parentSession;
      if (this._isInFinalState) return;
      this._isInFinalState = true;

      this._log("session cancelled ".concat(this.opts.invokeid));

      this._exitInterpreter(null);
    }
  }, {
    key: "_exitInterpreter",
    value: function _exitInterpreter(event) {
      var _this2 = this;

      //TODO: cancel invoked sessions
      //cancel all delayed sends when we enter into a final state.
      this._cancelAllDelayedSends();

      var statesToExit = this._getFullConfiguration().sort(getStateWithHigherSourceChildPriority);

      for (var j = 0, len = statesToExit.length; j < len; j++) {
        var stateExited = statesToExit[j];

        if (stateExited.onExit !== undefined) {
          for (var exitIdx = 0, exitLen = stateExited.onExit.length; exitIdx < exitLen; exitIdx++) {
            var block = stateExited.onExit[exitIdx];

            for (var blockIdx = 0, blockLen = block.length; blockIdx < blockLen; blockIdx++) {
              var actionRef = block[blockIdx];

              try {
                actionRef.call(this._scriptingContext, null);
              } catch (e) {
                this._handleError(e, actionRef);

                break;
              }
            }
          }
        } //cancel invoked session


        if (stateExited.invokes) stateExited.invokes.forEach(function (invoke) {
          _this2._scriptingContext.cancelInvoke(invoke.id);
        }); //if he is a top-level <final> state, then return the done event

        if (stateExited.$type === 'final' && stateExited.parent.$type === 'scxml') {
          if (this.opts.parentSession) {
            this._scriptingContext.send({
              target: '#_parent',
              name: 'done.invoke.' + this.opts.invokeid,
              data: stateExited.donedata && stateExited.donedata.call(this._scriptingContext, event)
            });
          }

          this.opts.sessionRegistry["delete"](this.opts.sessionid);
          this.emit('onExitInterpreter', event);
        }
      }
    }
    /** 
     * Starts the interpreter. Should only be called once, and should be called
     * before BaseInterpreter.prototype#gen is called for the first time.  Returns a
     * Configuration.
     * @return {Configuration}
     * @memberof BaseInterpreter.prototype
     * @emits scion.BaseInterpreter#onEntry
     * @emits scion.BaseInterpreter#onExit
     * @emits scion.BaseInterpreter#onTransition
     * @emits scion.BaseInterpreter#onDefaultEntry
     * @emits scion.BaseInterpreter#onError
     * @emits scion.BaseInterpreter#onBigStepBegin
     * @emits scion.BaseInterpreter#onBigStepEnd
     * @emits scion.BaseInterpreter#onBigStepSuspend
     * @emits scion.BaseInterpreter#onBigStepResume
     * @emits scion.BaseInterpreter#onSmallStepBegin
     * @emits scion.BaseInterpreter#onSmallStepEnd
     * @emits scion.BaseInterpreter#onBigStepEnd
     * @emits scion.BaseInterpreter#onExitInterpreter
     */

  }, {
    key: "start",
    value: function start() {
      this._initStart();

      this._performBigStep();

      return this.getConfiguration();
    }
    /**
     * This callback is displayed as a global member.
     * @callback genCallback
     * @param {Error} err
     * @param {Configuration} configuration
     */

    /**
     * Starts the interpreter asynchronously
     * @param  {genCallback} cb Callback invoked with an error or the interpreter's stable configuration
     * @memberof BaseInterpreter.prototype 
     * @emits scion.BaseInterpreter#onEntry
     * @emits scion.BaseInterpreter#onExit
     * @emits scion.BaseInterpreter#onTransition
     * @emits scion.BaseInterpreter#onDefaultEntry
     * @emits scion.BaseInterpreter#onError
     * @emits scion.BaseInterpreter#onBigStepBegin
     * @emits scion.BaseInterpreter#onBigStepEnd
     * @emits scion.BaseInterpreter#onBigStepSuspend
     * @emits scion.BaseInterpreter#onBigStepResume
     * @emits scion.BaseInterpreter#onSmallStepBegin
     * @emits scion.BaseInterpreter#onSmallStepEnd
     * @emits scion.BaseInterpreter#onBigStepEnd
     * @emits scion.BaseInterpreter#onExitInterpreter
     */

  }, {
    key: "startAsync",
    value: function startAsync(cb) {
      cb = this._initStart(cb);
      this.genAsync(null, cb);
    }
  }, {
    key: "_initStart",
    value: function _initStart(cb) {
      var _this3 = this;

      if (typeof cb !== 'function') {
        cb = nop;
      }

      this._log("performing initial big step"); //We effectively need to figure out states to enter here to populate initial config. assuming root is compound state makes this simple.
      //but if we want it to be parallel, then this becomes more complex. so when initializing the model, we add a 'fake' root state, which
      //makes the following operation safe.


      this._model.initialRef.forEach(function (s) {
        return _this3._configuration.add(s);
      });

      return cb;
    }
    /** 
    * Returns state machine {@link Configuration}.
    * @return {Configuration}
    * @memberof BaseInterpreter.prototype 
    */

  }, {
    key: "getConfiguration",
    value: function getConfiguration() {
      return this._configuration.iter().map(function (s) {
        return s.id;
      });
    }
  }, {
    key: "_getFullConfiguration",
    value: function _getFullConfiguration() {
      return this._configuration.iter().map(function (s) {
        return [s].concat(query.getAncestors(s));
      }, this).reduce(function (a, b) {
        return a.concat(b);
      }, []). //flatten
      reduce(function (a, b) {
        return a.indexOf(b) > -1 ? a : a.concat(b);
      }, []); //uniq
    }
    /** 
    * @return {FullConfiguration}
    * @memberof BaseInterpreter.prototype 
    */

  }, {
    key: "getFullConfiguration",
    value: function getFullConfiguration() {
      return this._getFullConfiguration().map(function (s) {
        return s.id;
      });
    }
    /** 
    * @return {boolean}
    * @memberof BaseInterpreter.prototype 
    * @param {string} stateName
    */

  }, {
    key: "isIn",
    value: function isIn(stateName) {
      return this.getFullConfiguration().indexOf(stateName) > -1;
    }
    /** 
    * Is the state machine in a final state?
    * @return {boolean}
    * @memberof BaseInterpreter.prototype 
    */

  }, {
    key: "isFinal",
    value: function isFinal() {
      return this._isInFinalState;
    }
    /** @private */

  }, {
    key: "_performBigStep",
    value: function _performBigStep(e) {
      var currentEvent, keepGoing, allStatesExited, allStatesEntered;

      var _this$_startBigStep = this._startBigStep(e);

      var _this$_startBigStep2 = _slicedToArray(_this$_startBigStep, 4);

      allStatesExited = _this$_startBigStep2[0];
      allStatesEntered = _this$_startBigStep2[1];
      keepGoing = _this$_startBigStep2[2];
      currentEvent = _this$_startBigStep2[3];

      while (keepGoing) {
        var _this$_selectTransiti = this._selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited);

        var _this$_selectTransiti2 = _slicedToArray(_this$_selectTransiti, 2);

        currentEvent = _this$_selectTransiti2[0];
        keepGoing = _this$_selectTransiti2[1];
      }

      this._finishBigStep(currentEvent, allStatesEntered, allStatesExited);
    }
  }, {
    key: "_selectTransitionsAndPerformSmallStep",
    value: function _selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited) {
      //first select with null event
      var selectedTransitions = this._selectTransitions(currentEvent, true);

      if (selectedTransitions.isEmpty()) {
        var ev = this._internalEventQueue.shift();

        if (ev) {
          currentEvent = ev;
          selectedTransitions = this._selectTransitions(currentEvent, false);
        }
      }

      if (!selectedTransitions.isEmpty()) {
        this.emit('onSmallStepBegin', currentEvent);
        var statesExited, statesEntered;

        var _this$_performSmallSt = this._performSmallStep(currentEvent, selectedTransitions);

        var _this$_performSmallSt2 = _slicedToArray(_this$_performSmallSt, 2);

        statesExited = _this$_performSmallSt2[0];
        statesEntered = _this$_performSmallSt2[1];
        if (statesExited) statesExited.forEach(function (s) {
          return allStatesExited.add(s);
        });
        if (statesEntered) statesEntered.forEach(function (s) {
          return allStatesEntered.add(s);
        });
        this.emit('onSmallStepEnd', currentEvent);
      }

      var keepGoing = !selectedTransitions.isEmpty() || this._internalEventQueue.length;
      return [currentEvent, keepGoing];
    }
  }, {
    key: "_startBigStep",
    value: function _startBigStep(e) {
      var _this4 = this;

      this.emit('onBigStepBegin', e); //do applyFinalize and autoforward

      this._configuration.iter().forEach(function (state) {
        if (state.invokes) state.invokes.forEach(function (invoke) {
          if (invoke.autoforward) {
            //autoforward
            _this4._scriptingContext.send({
              target: "#_".concat(invoke.id),
              name: e.name,
              data: e.data
            });
          }

          if (invoke.id === e.invokeid) {
            //applyFinalize
            if (invoke.finalize) invoke.finalize.forEach(function (action) {
              return _this4._evaluateAction(e, action);
            });
          }
        });
      });

      if (e) this._internalEventQueue.push(e);
      var allStatesExited = new Set(),
          allStatesEntered = new Set();
      var keepGoing = true;
      var currentEvent = e;
      return [allStatesEntered, allStatesExited, keepGoing, currentEvent];
    }
  }, {
    key: "_finishBigStep",
    value: function _finishBigStep(e, allStatesEntered, allStatesExited, cb) {
      var _this5 = this;

      var statesToInvoke = Array.from(new Set(_toConsumableArray(allStatesEntered).filter(function (s) {
        return s.invokes && !allStatesExited.has(s);
      }))).sort(sortInEntryOrder); // Here we invoke whatever needs to be invoked. The implementation of 'invoke' is platform-specific

      statesToInvoke.forEach(function (s) {
        s.invokes.forEach(function (f) {
          return _this5._evaluateAction(e, f);
        });
      }); // cancel invoke for allStatesExited

      allStatesExited.forEach(function (s) {
        if (s.invokes) s.invokes.forEach(function (invoke) {
          _this5._scriptingContext.cancelInvoke(invoke.id);
        });
      }); // TODO: Invoking may have raised internal error events and we iterate to handle them        
      //if not internalQueue.isEmpty():
      //    continue

      this._isInFinalState = this._configuration.iter().every(function (s) {
        return s.typeEnum === FINAL;
      });

      if (this._isInFinalState) {
        this._exitInterpreter(e);
      }

      this.emit('onBigStepEnd', e);
      if (cb) cb(undefined, this.getConfiguration());
    }
  }, {
    key: "_cancelAllDelayedSends",
    value: function _cancelAllDelayedSends() {
      var _iterator = _createForOfIteratorHelper(this._scriptingContext._timeouts),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var timeoutOptions = _step.value;
          if (!timeoutOptions.sendOptions.delay) continue;

          this._log('cancelling delayed send', timeoutOptions);

          clearTimeout(timeoutOptions.timeoutHandle);

          this._scriptingContext._timeouts["delete"](timeoutOptions);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      Object.keys(this._scriptingContext._timeoutMap).forEach(function (key) {
        delete this._scriptingContext._timeoutMap[key];
      }, this);
    }
  }, {
    key: "_performBigStepAsync",
    value: function _performBigStepAsync(e, cb) {
      var currentEvent, keepGoing, allStatesExited, allStatesEntered;

      var _this$_startBigStep3 = this._startBigStep(e);

      var _this$_startBigStep4 = _slicedToArray(_this$_startBigStep3, 4);

      allStatesExited = _this$_startBigStep4[0];
      allStatesEntered = _this$_startBigStep4[1];
      keepGoing = _this$_startBigStep4[2];
      currentEvent = _this$_startBigStep4[3];

      function nextStep(emit) {
        this.emit(emit);

        var _this$_selectTransiti3 = this._selectTransitionsAndPerformSmallStep(currentEvent, allStatesEntered, allStatesExited);

        var _this$_selectTransiti4 = _slicedToArray(_this$_selectTransiti3, 2);

        currentEvent = _this$_selectTransiti4[0];
        keepGoing = _this$_selectTransiti4[1];

        if (keepGoing) {
          this.emit('onBigStepSuspend');
          setImmediate(nextStep.bind(this, 'onBigStepResume'));
        } else {
          this._finishBigStep(currentEvent, allStatesEntered, allStatesExited, cb);
        }
      }

      nextStep.call(this, 'onBigStepBegin');
    }
    /** @private */

  }, {
    key: "_performSmallStep",
    value: function _performSmallStep(currentEvent, selectedTransitions) {
      this._log("selecting transitions with currentEvent", currentEvent);

      this._log("selected transitions", selectedTransitions);

      var statesExited, statesEntered;

      if (!selectedTransitions.isEmpty()) {
        //we only want to enter and exit states from transitions with targets
        //filter out targetless transitions here - we will only use these to execute transition actions
        var selectedTransitionsWithTargets = new this.opts.Set(selectedTransitions.iter().filter(transitionWithTargets));
        statesExited = this._exitStates(currentEvent, selectedTransitionsWithTargets);

        this._executeTransitions(currentEvent, selectedTransitions);

        statesEntered = this._enterStates(currentEvent, selectedTransitionsWithTargets);

        this._log("new configuration ", this._configuration);
      }

      return [statesExited, statesEntered];
    }
  }, {
    key: "_exitStates",
    value: function _exitStates(currentEvent, selectedTransitionsWithTargets) {
      var basicStatesExited, statesExited;

      var _this$_getStatesExite = this._getStatesExited(selectedTransitionsWithTargets);

      var _this$_getStatesExite2 = _slicedToArray(_this$_getStatesExite, 2);

      basicStatesExited = _this$_getStatesExite2[0];
      statesExited = _this$_getStatesExite2[1];

      this._log('exiting states');

      for (var j = 0, len = statesExited.length; j < len; j++) {
        var stateExited = statesExited[j];
        if (stateExited.isAtomic) this._configuration.remove(stateExited);

        this._log("exiting ", stateExited.id); //invoke listeners


        this.emit('onExit', stateExited.id);

        if (stateExited.onExit !== undefined) {
          for (var exitIdx = 0, exitLen = stateExited.onExit.length; exitIdx < exitLen; exitIdx++) {
            var block = stateExited.onExit[exitIdx];

            for (var blockIdx = 0, blockLen = block.length; blockIdx < blockLen; blockIdx++) {
              var actionRef = block[blockIdx];

              try {
                actionRef.call(this._scriptingContext, currentEvent);
              } catch (e) {
                this._handleError(e, actionRef);

                break;
              }
            }
          }
        }

        var f;

        if (stateExited.historyRef) {
          var _iterator2 = _createForOfIteratorHelper(stateExited.historyRef),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var historyRef = _step2.value;

              if (historyRef.isDeep) {
                f = function f(s0) {
                  return s0.typeEnum === BASIC && stateExited.descendants.indexOf(s0) > -1;
                };
              } else {
                f = function f(s0) {
                  return s0.parent === stateExited;
                };
              } //update history


              this._historyValue[historyRef.id] = statesExited.filter(f);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }

      return statesExited;
    }
    /** @private */

  }, {
    key: "_getStatesExited",
    value: function _getStatesExited(transitions) {
      var statesExited = new this.opts.Set();
      var basicStatesExited = new this.opts.Set(); //States exited are defined to be active states that are
      //descendants of the scope of each priority-enabled transition.
      //Here, we iterate through the transitions, and collect states
      //that match this condition. 

      var transitionList = transitions.iter();

      for (var txIdx = 0, txLen = transitionList.length; txIdx < txLen; txIdx++) {
        var transition = transitionList[txIdx];
        var scope = transition.scope,
            desc = scope.descendants; //For each state in the configuration
        //is that state a descendant of the transition scope?
        //Store ancestors of that state up to but not including the scope.

        var configList = this._configuration.iter();

        for (var cfgIdx = 0, cfgLen = configList.length; cfgIdx < cfgLen; cfgIdx++) {
          var state = configList[cfgIdx];

          if (desc.indexOf(state) > -1) {
            basicStatesExited.add(state);
            statesExited.add(state);
            var ancestors = query.getAncestors(state, scope);

            for (var ancIdx = 0, ancLen = ancestors.length; ancIdx < ancLen; ancIdx++) {
              statesExited.add(ancestors[ancIdx]);
            }
          }
        }
      }

      var sortedStatesExited = statesExited.iter().sort(getStateWithHigherSourceChildPriority);
      return [basicStatesExited, sortedStatesExited];
    }
  }, {
    key: "_executeTransitions",
    value: function _executeTransitions(currentEvent, selectedTransitions) {
      var sortedTransitions = selectedTransitions.iter().sort(transitionComparator);

      this._log("executing transitition actions");

      for (var stxIdx = 0, len = sortedTransitions.length; stxIdx < len; stxIdx++) {
        var transition = sortedTransitions[stxIdx];
        var targetIds = transition.targets && transition.targets.map(function (target) {
          return target.id;
        });
        this.emit('onTransition', transition.source.id, targetIds, transition.source.transitions.indexOf(transition));

        if (transition.onTransition !== undefined) {
          for (var txIdx = 0, txLen = transition.onTransition.length; txIdx < txLen; txIdx++) {
            var actionRef = transition.onTransition[txIdx];

            try {
              actionRef.call(this._scriptingContext, currentEvent);
            } catch (e) {
              this._handleError(e, actionRef);

              break;
            }
          }
        }
      }
    }
  }, {
    key: "_enterStates",
    value: function _enterStates(currentEvent, selectedTransitionsWithTargets) {
      var _this6 = this;

      this._log("entering states");

      var statesEntered = new Set();
      var statesForDefaultEntry = new Set(); // initialize the temporary table for default content in history states

      var defaultHistoryContent = {};

      this._computeEntrySet(selectedTransitionsWithTargets, statesEntered, statesForDefaultEntry, defaultHistoryContent);

      statesEntered = Array.from(statesEntered).sort(sortInEntryOrder);

      this._log("statesEntered ", statesEntered);

      for (var enterIdx = 0, enterLen = statesEntered.length; enterIdx < enterLen; enterIdx++) {
        var stateEntered = statesEntered[enterIdx];
        if (stateEntered.isAtomic) this._configuration.add(stateEntered);

        this._log("entering", stateEntered.id);

        this.emit('onEntry', stateEntered.id);

        if (stateEntered.onEntry !== undefined) {
          for (var entryIdx = 0, entryLen = stateEntered.onEntry.length; entryIdx < entryLen; entryIdx++) {
            var block = stateEntered.onEntry[entryIdx];

            for (var blockIdx = 0, blockLen = block.length; blockIdx < blockLen; blockIdx++) {
              var actionRef = block[blockIdx];

              try {
                actionRef.call(this._scriptingContext, currentEvent);
              } catch (e) {
                this._handleError(e, actionRef);

                break;
              }
            }
          }
        }

        if (statesForDefaultEntry.has(stateEntered)) {
          var _iterator3 = _createForOfIteratorHelper(stateEntered.initialRef),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var initialState = _step3.value;
              this.emit('onDefaultEntry', initialState.id);

              if (initialState.typeEnum === INITIAL) {
                var transition = initialState.transitions[0];

                if (transition.onTransition !== undefined) {
                  this._log('executing initial transition content for initial state of parent state', stateEntered.id);

                  for (var txIdx = 0, txLen = transition.onTransition.length; txIdx < txLen; txIdx++) {
                    var _actionRef = transition.onTransition[txIdx];

                    try {
                      _actionRef.call(this._scriptingContext, currentEvent);
                    } catch (e) {
                      this._handleError(e, _actionRef);

                      break;
                    }
                  }
                }
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }

        if (defaultHistoryContent[stateEntered.id]) {
          var _transition = defaultHistoryContent[stateEntered.id];

          if (_transition.onTransition !== undefined) {
            this._log('executing history transition content for history state of parent state', stateEntered.id);

            for (var txIdx = 0, txLen = _transition.onTransition.length; txIdx < txLen; txIdx++) {
              var _actionRef2 = _transition.onTransition[txIdx];

              try {
                _actionRef2.call(this._scriptingContext, currentEvent);
              } catch (e) {
                this._handleError(e, _actionRef2);

                break;
              }
            }
          }
        }
      }

      for (var enterIdx = 0, enterLen = statesEntered.length; enterIdx < enterLen; enterIdx++) {
        var stateEntered = statesEntered[enterIdx];

        if (stateEntered.typeEnum === FINAL) {
          var parent = stateEntered.parent;
          var grandparent = parent.parent;

          this._internalEventQueue.push({
            name: "done.state." + parent.id,
            data: stateEntered.donedata && stateEntered.donedata.call(this._scriptingContext, currentEvent)
          });

          if (grandparent && grandparent.typeEnum === PARALLEL) {
            if (grandparent.states.every(function (s) {
              return _this6.isInFinalState(s);
            })) {
              this._internalEventQueue.push({
                name: "done.state." + grandparent.id
              });
            }
          }
        }
      }

      return statesEntered;
    }
  }, {
    key: "_getEffectiveTargetStates",
    value: function _getEffectiveTargetStates(transition) {
      var targets = new Set();

      var _iterator4 = _createForOfIteratorHelper(transition.targets),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var s = _step4.value;

          if (s.typeEnum === HISTORY) {
            if (s.id in this._historyValue) this._historyValue[s.id].forEach(function (state) {
              return targets.add(state);
            });else _toConsumableArray(this._getEffectiveTargetStates(s.transitions[0])).forEach(function (state) {
              return targets.add(state);
            });
          } else {
            targets.add(s);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return targets;
    }
  }, {
    key: "_computeEntrySet",
    value: function _computeEntrySet(transitions, statesToEnter, statesForDefaultEntry, defaultHistoryContent) {
      var _iterator5 = _createForOfIteratorHelper(transitions.iter()),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var t = _step5.value;

          var _iterator6 = _createForOfIteratorHelper(t.targets),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var s = _step6.value;

              this._addDescendantStatesToEnter(s, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          var ancestor = t.scope;

          var _iterator7 = _createForOfIteratorHelper(this._getEffectiveTargetStates(t)),
              _step7;

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var _s2 = _step7.value;

              this._addAncestorStatesToEnter(_s2, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "_computeExitSet",
    value: function _computeExitSet(transitions) {
      var statesToExit = new Set();

      var _iterator8 = _createForOfIteratorHelper(transitions),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var t = _step8.value;

          if (t.targets) {
            var scope = t.scope;

            var _iterator9 = _createForOfIteratorHelper(this._getFullConfiguration()),
                _step9;

            try {
              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                var s = _step9.value;
                if (query.isDescendant(s, scope)) statesToExit.add(s);
              }
            } catch (err) {
              _iterator9.e(err);
            } finally {
              _iterator9.f();
            }
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }

      return statesToExit;
    }
  }, {
    key: "_addAncestorStatesToEnter",
    value: function _addAncestorStatesToEnter(state, ancestor, statesToEnter, statesForDefaultEntry, defaultHistoryContent) {
      var _this7 = this;

      var traverse = function traverse(anc) {
        if (anc.typeEnum === PARALLEL) {
          var _iterator10 = _createForOfIteratorHelper(anc.states),
              _step10;

          try {
            var _loop = function _loop() {
              var child = _step10.value;

              if (child.typeEnum !== HISTORY && !_toConsumableArray(statesToEnter).some(function (s) {
                return query.isDescendant(s, child);
              })) {
                _this7._addDescendantStatesToEnter(child, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
              }
            };

            for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
              _loop();
            }
          } catch (err) {
            _iterator10.e(err);
          } finally {
            _iterator10.f();
          }
        }
      };

      var _iterator11 = _createForOfIteratorHelper(query.getAncestors(state, ancestor)),
          _step11;

      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var anc = _step11.value;
          statesToEnter.add(anc);
          traverse(anc);
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }

      traverse(ancestor);
    }
  }, {
    key: "_addDescendantStatesToEnter",
    value: function _addDescendantStatesToEnter(state, statesToEnter, statesForDefaultEntry, defaultHistoryContent) {
      var _this8 = this;

      if (state.typeEnum === HISTORY) {
        if (this._historyValue[state.id]) {
          var _iterator12 = _createForOfIteratorHelper(this._historyValue[state.id]),
              _step12;

          try {
            for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
              var s = _step12.value;

              this._addDescendantStatesToEnter(s, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
            }
          } catch (err) {
            _iterator12.e(err);
          } finally {
            _iterator12.f();
          }

          var _iterator13 = _createForOfIteratorHelper(this._historyValue[state.id]),
              _step13;

          try {
            for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
              var _s3 = _step13.value;

              this._addAncestorStatesToEnter(_s3, state.parent, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
            }
          } catch (err) {
            _iterator13.e(err);
          } finally {
            _iterator13.f();
          }
        } else {
          defaultHistoryContent[state.parent.id] = state.transitions[0];

          var _iterator14 = _createForOfIteratorHelper(state.transitions[0].targets),
              _step14;

          try {
            for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
              var _s4 = _step14.value;

              this._addDescendantStatesToEnter(_s4, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
            }
          } catch (err) {
            _iterator14.e(err);
          } finally {
            _iterator14.f();
          }

          var _iterator15 = _createForOfIteratorHelper(state.transitions[0].targets),
              _step15;

          try {
            for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
              var _s5 = _step15.value;

              this._addAncestorStatesToEnter(_s5, state.parent, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
            }
          } catch (err) {
            _iterator15.e(err);
          } finally {
            _iterator15.f();
          }
        }
      } else {
        statesToEnter.add(state);

        if (state.typeEnum === COMPOSITE) {
          statesForDefaultEntry.add(state); //for each state in initialRef, if it is an initial state, then add ancestors and descendants.

          var _iterator16 = _createForOfIteratorHelper(state.initialRef),
              _step16;

          try {
            for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
              var _s6 = _step16.value;
              var targets = _s6.typeEnum === INITIAL ? _s6.transitions[0].targets : [_s6];

              var _iterator18 = _createForOfIteratorHelper(targets),
                  _step18;

              try {
                for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
                  var targetState = _step18.value;

                  this._addDescendantStatesToEnter(targetState, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                }
              } catch (err) {
                _iterator18.e(err);
              } finally {
                _iterator18.f();
              }
            }
          } catch (err) {
            _iterator16.e(err);
          } finally {
            _iterator16.f();
          }

          var _iterator17 = _createForOfIteratorHelper(state.initialRef),
              _step17;

          try {
            for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
              var _s7 = _step17.value;

              var _targets = _s7.typeEnum === INITIAL ? _s7.transitions[0].targets : [_s7];

              var _iterator19 = _createForOfIteratorHelper(_targets),
                  _step19;

              try {
                for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
                  var _targetState = _step19.value;

                  this._addAncestorStatesToEnter(_targetState, state, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                }
              } catch (err) {
                _iterator19.e(err);
              } finally {
                _iterator19.f();
              }
            }
          } catch (err) {
            _iterator17.e(err);
          } finally {
            _iterator17.f();
          }
        } else {
          if (state.typeEnum === PARALLEL) {
            var _iterator20 = _createForOfIteratorHelper(state.states),
                _step20;

            try {
              var _loop2 = function _loop2() {
                var child = _step20.value;

                if (child.typeEnum !== HISTORY && !_toConsumableArray(statesToEnter).some(function (s) {
                  return query.isDescendant(s, child);
                })) {
                  _this8._addDescendantStatesToEnter(child, statesToEnter, statesForDefaultEntry, defaultHistoryContent);
                }
              };

              for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
                _loop2();
              }
            } catch (err) {
              _iterator20.e(err);
            } finally {
              _iterator20.f();
            }
          }
        }
      }
    }
  }, {
    key: "isInFinalState",
    value: function isInFinalState(s) {
      var _this9 = this;

      if (s.typeEnum === COMPOSITE) {
        return s.states.some(function (s) {
          return s.typeEnum === FINAL && _this9._configuration.contains(s);
        });
      } else if (s.typeEnum === PARALLEL) {
        return s.states.every(this.isInFinalState.bind(this));
      } else {
        return false;
      }
    }
    /** @private */

  }, {
    key: "_evaluateAction",
    value: function _evaluateAction(currentEvent, actionRef) {
      try {
        return actionRef.call(this._scriptingContext, currentEvent); //SCXML system variables
      } catch (e) {
        this._handleError(e, actionRef);
      }
    }
  }, {
    key: "_handleError",
    value: function _handleError(e, actionRef) {
      var event = e instanceof Error || typeof e.__proto__.name === 'string' && e.__proto__.name.match(/^.*Error$/) ? //we can't just do 'e instanceof Error', because the Error object in the sandbox is from a different context, and instanceof will return false
      {
        name: 'error.execution',
        data: {
          tagname: actionRef.tagname,
          line: actionRef.line,
          column: actionRef.column,
          reason: e.message
        },
        type: 'platform'
      } : e.name ? e : {
        name: 'error.execution',
        data: e,
        type: 'platform'
      };

      this._internalEventQueue.push(event);

      this.emit('onError', event);
    }
  }, {
    key: "_log",
    value: function _log() {
      if (printTrace) {
        var args = Array.from(arguments);
        this.opts.console.log("".concat(args[0], ": ").concat(args.slice(1).map(function (arg) {
          return arg === null ? 'null' : arg === undefined ? 'undefined' : typeof arg === 'string' ? arg : arg.toString() === '[object Object]' ? util.inspect(arg) : arg.toString();
        }).join(', '), "\n"));
      }
    }
    /**
    * @interface Listener
    */

    /**
    * @function
    * @name Listener#onEntry 
    * @param {string} stateId
    */

    /**
    * @function
    * @name Listener#onExit 
    * @param {string} stateId
    */

    /**
    * @function
    * @name Listener#onTransition 
    * @param {string} sourceStateId Id of the source state
    * @param {Array<string>} targetStatesIds Ids of the target states
    * @param {number} transitionIndex Index of the transition relative to other transitions originating from source state.
    */

    /**
    * @function
    * @name Listener#onError
    * @param {Error} errorInfo
    */

    /**
    * @function
    * @name Listener#onBigStepBegin
    */

    /**
    * @function
    * @name Listener#onBigStepResume
    */

    /**
    * @function
    * @name Listener#onBigStepSuspend
    */

    /**
    * @function
    * @name Listener#onBigStepEnd
    */

    /**
    * @function
    * @name Listener#onSmallStepBegin
    * @param {string} event
    */

    /**
    * @function
    * @name Listener#onSmallStepEnd
    */

    /** 
    * Provides a generic mechanism to subscribe to state change and runtime
    * error notifications.  Can be used for logging and debugging. For example,
    * can attach a logger that simply logs the state changes.  Or can attach a
    * network debugging client that sends state change notifications to a
    * debugging server.
    * This is an alternative interface to {@link EventEmitter.prototype#on}.
    * @memberof BaseInterpreter.prototype 
    * @param {Listener} listener
    */

  }, {
    key: "registerListener",
    value: function registerListener(listener) {
      BaseInterpreter.EVENTS.forEach(function (event) {
        if (listener[event]) this.on(event, listener[event]);
      }, this);
    }
    /** 
    * Unregister a Listener
    * @memberof BaseInterpreter.prototype 
    * @param {Listener} listener
    */

  }, {
    key: "unregisterListener",
    value: function unregisterListener(listener) {
      BaseInterpreter.EVENTS.forEach(function (event) {
        if (listener[event]) this.off(event, listener[event]);
      }, this);
    }
    /** 
    * Query the model to get all transition events.
    * @return {Array<string>} Transition events.
    * @memberof BaseInterpreter.prototype 
    */

  }, {
    key: "getAllTransitionEvents",
    value: function getAllTransitionEvents() {
      var events = {};

      function getEvents(state) {
        if (state.transitions) {
          for (var txIdx = 0, txLen = state.transitions.length; txIdx < txLen; txIdx++) {
            events[state.transitions[txIdx].event] = true;
          }
        }

        if (state.states) {
          for (var stateIdx = 0, stateLen = state.states.length; stateIdx < stateLen; stateIdx++) {
            getEvents(state.states[stateIdx]);
          }
        }
      }

      getEvents(this._model);
      return Object.keys(events);
    }
    /**
    * Three things capture the current snapshot of a running SCION interpreter:
    *
    *      <ul>
    *      <li> basic configuration (the set of basic states the state machine is in)</li>
    *      <li> history state values (the states the state machine was in last time it was in the parent of a history state)</li>
    *      <li> the datamodel</li>
    *      </ul>
    *      
    * The snapshot object can be serialized as JSON and saved to a database. It can
    * later be passed to the SCXML constructor to restore the state machine
    * using the snapshot argument.
    *
    * @return {Snapshot} 
    * @memberof BaseInterpreter.prototype 
    */

  }, {
    key: "getSnapshot",
    value: function getSnapshot() {
      return [this.getConfiguration(), this._serializeHistory(), this._isInFinalState, this._model.$serializeDatamodel(), this._internalEventQueue.slice()];
    }
  }, {
    key: "_serializeHistory",
    value: function _serializeHistory() {
      var o = {};
      Object.keys(this._historyValue).forEach(function (sid) {
        o[sid] = this._historyValue[sid].map(function (state) {
          return state.id;
        });
      }, this);
      return o;
    }
    /**
     * @interface Event
     */

    /** 
    * @member name
    * @memberof Event.prototype 
    * @type string
    * @description The name of the event
    */

    /** 
    * @member data
    * @memberof Event.prototype 
    * @type any
    * @description The event data
    */

    /** 
    * An SCXML interpreter takes SCXML events as input, where an SCXML event is an
    * object with "name" and "data" properties. These can be passed to method `gen`
    * as two positional arguments, or as a single object.
    * @param {string|Event} evtObjOrName
    * @param {any=} optionalData
    * @emits scion.BaseInterpreter#onEntry
    * @emits scion.BaseInterpreter#onExit
    * @emits scion.BaseInterpreter#onTransition
    * @emits scion.BaseInterpreter#onDefaultEntry
    * @emits scion.BaseInterpreter#onError
    * @emits scion.BaseInterpreter#onBigStepBegin
    * @emits scion.BaseInterpreter#onBigStepEnd
    * @emits scion.BaseInterpreter#onBigStepSuspend
    * @emits scion.BaseInterpreter#onBigStepResume
    * @emits scion.BaseInterpreter#onSmallStepBegin
    * @emits scion.BaseInterpreter#onSmallStepEnd
    * @emits scion.BaseInterpreter#onBigStepEnd
    * @emits scion.BaseInterpreter#onExitInterpreter
    */

  }, {
    key: "gen",
    value: function gen(evtObjOrName, optionalData) {
      var currentEvent;

      switch (_typeof(evtObjOrName)) {
        case 'string':
          currentEvent = {
            name: evtObjOrName,
            data: optionalData
          };
          break;

        case 'object':
          if (typeof evtObjOrName.name === 'string') {
            currentEvent = evtObjOrName;
          } else {
            throw new Error('Event object must have "name" property of type string.');
          }

          break;

        default:
          throw new Error('First argument to gen must be a string or object.');
      }

      if (this._isStepping) throw new Error('Cannot call gen during a big-step'); //otherwise, kick him off

      this._isStepping = true;

      this._performBigStep(currentEvent);

      this._isStepping = false;
      return this.getConfiguration();
    }
    /**
    * Injects an external event into the interpreter asynchronously
    * @param {Event}  currentEvent The event to inject
    * @param {genCallback} cb Callback invoked with an error or the interpreter's stable configuration
    * @emits scion.BaseInterpreter#onEntry
    * @emits scion.BaseInterpreter#onExit
    * @emits scion.BaseInterpreter#onTransition
    * @emits scion.BaseInterpreter#onDefaultEntry
    * @emits scion.BaseInterpreter#onError
    * @emits scion.BaseInterpreter#onBigStepBegin
    * @emits scion.BaseInterpreter#onBigStepEnd
    * @emits scion.BaseInterpreter#onBigStepSuspend
    * @emits scion.BaseInterpreter#onBigStepResume
    * @emits scion.BaseInterpreter#onSmallStepBegin
    * @emits scion.BaseInterpreter#onSmallStepEnd
    * @emits scion.BaseInterpreter#onBigStepEnd
    * @emits scion.BaseInterpreter#onExitInterpreter
    */

  }, {
    key: "genAsync",
    value: function genAsync(currentEvent, cb) {
      if (currentEvent !== null && (_typeof(currentEvent) !== 'object' || !currentEvent || typeof currentEvent.name !== 'string')) {
        throw new Error('Expected currentEvent to be null or an Object with a name');
      }

      if (typeof cb !== 'function') {
        cb = nop;
      }

      this._externalEventQueue.push([currentEvent, cb]); //the semantics we want are to return to the cb the results of processing that particular event.


      function nextStep(e, c) {
        this._performBigStepAsync(e, function (err, config) {
          c(err, config);

          if (this._externalEventQueue.length) {
            nextStep.apply(this, this._externalEventQueue.shift());
          } else {
            this._isStepping = false;
          }
        }.bind(this));
      }

      if (!this._isStepping) {
        this._isStepping = true;
        nextStep.apply(this, this._externalEventQueue.shift());
      }
    }
  }]);

  return BaseInterpreter;
}(EventEmitter);

BaseInterpreter.EVENTS = ['onEntry', 'onExit', 'onTransition', 'onDefaultEntry', 'onError', 'onBigStepBegin', 'onBigStepSuspend', 'onBigStepResume', 'onSmallStepBegin', 'onSmallStepEnd', 'onBigStepEnd', 'onExitInterpreter']; //some global singletons to use to generate in-memory session ids, in case the user does not specify these data structures

BaseInterpreter.sessionIdCounter = 1;

BaseInterpreter.generateSessionid = function () {
  return BaseInterpreter.sessionIdCounter++;
};

BaseInterpreter.sessionRegistry = new Map(); // Do nothing

function nop() {}

var InterpreterScriptingContext = /*#__PURE__*/function () {
  function InterpreterScriptingContext(interpreter) {
    _classCallCheck(this, InterpreterScriptingContext);

    this._interpreter = interpreter;
    this._timeoutMap = {};
    this._invokeMap = {};
    this._timeouts = new Set(); //Regex from:
    //  http://daringfireball.net/2010/07/improved_regex_for_matching_urls
    //  http://stackoverflow.com/a/6927878

    this.validateUriRegex = /(#_.*)|\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
    this.invokeSendTargetRegex = /^#_(.*)$/;
    this.scxmlSendTargetRegex = /^#_scxml_(.*)$/;
  }

  _createClass(InterpreterScriptingContext, [{
    key: "raise",
    value: function raise(event) {
      this._installDefaultPropsOnEvent(event, true);

      this._interpreter._internalEventQueue.push(event);
    }
  }, {
    key: "parseXmlStringAsDOM",
    value: function parseXmlStringAsDOM(xmlString) {
      return (this._interpreter.opts.xmlParser || InterpreterScriptingContext.xmlParser).parse(xmlString);
    }
  }, {
    key: "invoke",
    value: function invoke(invokeObj) {
      var _this10 = this;

      //look up invoker by type. assume invokers are passed in as an option to constructor
      this._invokeMap[invokeObj.id] = new Promise(function (resolve, reject) {
        (_this10._interpreter.opts.invokers || InterpreterScriptingContext.invokers)[invokeObj.type](_this10._interpreter, invokeObj, _this10._interpreter.opts.invokerExecutionContext, function (err, session) {
          if (err) return reject(err);

          _this10._interpreter.emit('onInvokedSessionInitialized', session);

          resolve(session);
        });
      });
    }
  }, {
    key: "cancelInvoke",
    value: function cancelInvoke(invokeid) {
      var _this11 = this;

      //TODO: on cancel invoke clean up this._invokeMap
      var sessionPromise = this._invokeMap[invokeid];

      this._interpreter._log("cancelling session with invokeid ".concat(invokeid));

      if (sessionPromise) {
        this._interpreter._log("sessionPromise found");

        sessionPromise.then(function (session) {
          _this11._interpreter._log("resolved session ".concat(invokeid, ". cancelling... "));

          session.cancel(); //clean up

          delete _this11._invokeMap[invokeid];
        }, function (err) {//TODO: dispatch error back into the state machine as error.communication
        });
      }
    }
  }, {
    key: "_installDefaultPropsOnEvent",
    value: function _installDefaultPropsOnEvent(event, isInternal) {
      if (!isInternal) {
        event.origin = this._interpreter.opts._x._ioprocessors.scxml.location; //TODO: preserve original origin when we autoforward? 

        event.origintype = event.type || SCXML_IOPROCESSOR_TYPE;
      }

      if (typeof event.type === 'undefined') {
        event.type = isInternal ? 'internal' : 'external';
      }

      ['name', 'sendid', 'invokeid', 'data', 'origin', 'origintype'].forEach(function (prop) {
        if (typeof event[prop] === 'undefined') {
          event[prop] = undefined;
        }
      });
    }
  }, {
    key: "send",
    value: function send(event, options) {
      this._interpreter._log('send event', event, options);

      options = options || {};
      var sendType = options.type || SCXML_IOPROCESSOR_TYPE; //TODO: move these out

      function validateSend(event, options, sendAction) {
        if (event.target) {
          var targetIsValidUri = this.validateUriRegex.test(event.target);

          if (!targetIsValidUri) {
            throw {
              name: "error.execution",
              data: 'Target is not valid URI',
              sendid: event.sendid,
              type: 'platform'
            };
          }
        }

        if (sendType !== SCXML_IOPROCESSOR_TYPE) {
          //TODO: extend this to support HTTP, and other IO processors
          throw {
            name: "error.execution",
            data: 'Unsupported event processor type',
            sendid: event.sendid,
            type: 'platform'
          };
        }

        sendAction.call(this, event, options);
      }

      function defaultSendAction(event, options) {
        var _this12 = this;

        if (typeof setTimeout === 'undefined') throw new Error('Default implementation of BaseInterpreter.prototype.send will not work unless setTimeout is defined globally.');
        var match;

        if (event.target === '#_internal') {
          this.raise(event);
        } else {
          this._installDefaultPropsOnEvent(event, false);

          event.origintype = SCXML_IOPROCESSOR_TYPE; //TODO: extend this to support HTTP, and other IO processors
          //TODO : paramterize this based on send/@type?

          if (!event.target) {
            doSend.call(this, this._interpreter);
          } else if (event.target === '#_parent') {
            if (this._interpreter.opts.parentSession) {
              event.invokeid = this._interpreter.opts.invokeid;
              doSend.call(this, this._interpreter.opts.parentSession);
            } else {
              throw {
                name: "error.communication",
                data: 'Parent session not specified',
                sendid: event.sendid,
                type: 'platform'
              };
            }
          } else if (match = event.target.match(this.scxmlSendTargetRegex)) {
            var targetSessionId = match[1];

            var session = this._interpreter.opts.sessionRegistry.get(targetSessionId);

            if (session) {
              doSend.call(this, session);
            } else {
              throw {
                name: 'error.communication',
                sendid: event.sendid,
                type: 'platform'
              };
            }
          } else if (match = event.target.match(this.invokeSendTargetRegex)) {
            //TODO: test this code path.
            var invokeId = match[1];

            this._invokeMap[invokeId].then(function (session) {
              doSend.call(_this12, session);
            });
          } else {
            throw new Error('Unrecognized send target.'); //TODO: dispatch error back into the state machine
          }
        }

        function doSend(session) {
          //TODO: we probably now need to refactor data structures:
          //    this._timeouts
          //    this._timeoutMap
          var timeoutHandle = setTimeout(function () {
            if (event.sendid) delete this._timeoutMap[event.sendid];

            this._timeouts["delete"](timeoutOptions);

            if (this._interpreter.opts.doSend) {
              this._interpreter.opts.doSend(session, event);
            } else {
              session[this._interpreter.opts.sendAsync ? 'genAsync' : 'gen'](event);
            }
          }.bind(this), options.delay || 0);
          var timeoutOptions = {
            sendOptions: options,
            timeoutHandle: timeoutHandle
          };
          if (event.sendid) this._timeoutMap[event.sendid] = timeoutHandle;

          this._timeouts.add(timeoutOptions);
        }
      }

      function publish() {
        this._interpreter.emit(event.name, event.data);
      } //choose send function
      //TODO: rethink how this custom send works


      var sendFn;

      if (event.type === 'https://github.com/jbeard4/SCION#publish') {
        sendFn = publish;
      } else if (this._interpreter.opts.customSend) {
        sendFn = this._interpreter.opts.customSend;
      } else {
        sendFn = defaultSendAction;
      }

      options = options || {};

      this._interpreter._log("sending event", event.name, "with content", event.data, "after delay", options.delay);

      validateSend.call(this, event, options, sendFn);
    }
  }, {
    key: "cancel",
    value: function cancel(sendid) {
      if (this._interpreter.opts.customCancel) {
        return this._interpreter.opts.customCancel.apply(this, [sendid]);
      }

      if (typeof clearTimeout === 'undefined') throw new Error('Default implementation of BaseInterpreter.prototype.cancel will not work unless setTimeout is defined globally.');

      if (sendid in this._timeoutMap) {
        this._interpreter._log("cancelling ", sendid, " with timeout id ", this._timeoutMap[sendid]);

        clearTimeout(this._timeoutMap[sendid]);
      }
    }
  }]);

  return InterpreterScriptingContext;
}();

module.exports = extend(new EventEmitter(), {
  BaseInterpreter: BaseInterpreter,
  ArraySet: ArraySet,
  STATE_TYPES: constants.STATE_TYPES,
  initializeModel: initializeModel,
  InterpreterScriptingContext: InterpreterScriptingContext,
  helpers: helpers,
  query: query
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../process/browser.js */ "./node_modules/process/browser.js"), __webpack_require__(/*! ./../../../timers-browserify/main.js */ "./node_modules/timers-browserify/main.js").setImmediate))

/***/ }),

/***/ "./node_modules/@scion-scxml/core/lib/Statechart.js":
/*!**********************************************************!*\
  !*** ./node_modules/@scion-scxml/core/lib/Statechart.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var base = __webpack_require__(/*! @scion-scxml/core-base */ "./node_modules/@scion-scxml/core-base/lib/scion-core-base.js"),
    helpers = base.helpers,
    query = base.query,
    transitionComparator = base.helpers.transitionComparator;
/** 
 * @description Implements semantics described in Algorithm D of the SCXML specification. 
 * See {@link scion.BaseInterpreter} for information on the constructor arguments.
 * @class SCInterpreter 
 * @extends BaseInterpreter
 */


var Statechart = /*#__PURE__*/function (_base$BaseInterpreter) {
  _inherits(Statechart, _base$BaseInterpreter);

  var _super = _createSuper(Statechart);

  function Statechart(modelOrModelFactory, opts) {
    _classCallCheck(this, Statechart);

    opts = opts || {};
    opts.legacySemantics = false;
    return _super.call(this, modelOrModelFactory, opts);
  }
  /** @private */


  _createClass(Statechart, [{
    key: "_selectTransitions",
    value: function _selectTransitions(currentEvent, selectEventlessTransitions) {
      var transitionSelector = this.opts.transitionSelector;
      var enabledTransitions = new this.opts.Set();

      var e = this._evaluateAction.bind(this, currentEvent);

      var atomicStates = this._configuration.iter().sort(transitionComparator);

      var _iterator = _createForOfIteratorHelper(atomicStates),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var state = _step.value;

          var _iterator2 = _createForOfIteratorHelper([state].concat(query.getAncestors(state))),
              _step2;

          try {
            loop: for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var s = _step2.value;

              var _iterator3 = _createForOfIteratorHelper(s.transitions),
                  _step3;

              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  var t = _step3.value;

                  if (transitionSelector(t, currentEvent, e, selectEventlessTransitions)) {
                    enabledTransitions.add(t);
                    break loop;
                  }
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var priorityEnabledTransitions = this._removeConflictingTransition(enabledTransitions);

      this._log("priorityEnabledTransitions", priorityEnabledTransitions);

      return priorityEnabledTransitions;
    }
    /** @private */

  }, {
    key: "_removeConflictingTransition",
    value: function _removeConflictingTransition(enabledTransitions) {
      var _this = this;

      var filteredTransitions = new this.opts.Set(); //toList sorts the transitions in the order of the states that selected them

      var _iterator4 = _createForOfIteratorHelper(enabledTransitions.iter()),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var t1 = _step4.value;
          var t1Preempted = false;
          var transitionsToRemove = new Set();

          var _iterator5 = _createForOfIteratorHelper(filteredTransitions.iter()),
              _step5;

          try {
            var _loop = function _loop() {
              var t2 = _step5.value;

              //TODO: can we compute this statically? for example, by checking if the transition scopes are arena orthogonal?
              var t1ExitSet = _this._computeExitSet([t1]);

              var t2ExitSet = _this._computeExitSet([t2]);

              var hasIntersection = _toConsumableArray(t1ExitSet).some(function (s) {
                return t2ExitSet.has(s);
              }) || _toConsumableArray(t2ExitSet).some(function (s) {
                return t1ExitSet.has(s);
              });

              _this._log('t1ExitSet', t1.source.id, _toConsumableArray(t1ExitSet).map(function (s) {
                return s.id;
              }));

              _this._log('t2ExitSet', t2.source.id, _toConsumableArray(t2ExitSet).map(function (s) {
                return s.id;
              }));

              _this._log('hasIntersection', hasIntersection);

              if (hasIntersection) {
                if (t2.source.descendants.indexOf(t1.source) > -1) {
                  //is this the same as being ancestrally related?
                  transitionsToRemove.add(t2);
                } else {
                  t1Preempted = true;
                  return "break";
                }
              }
            };

            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _ret = _loop();

              if (_ret === "break") break;
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }

          if (!t1Preempted) {
            var _iterator6 = _createForOfIteratorHelper(transitionsToRemove),
                _step6;

            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var t3 = _step6.value;
                filteredTransitions.remove(t3);
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }

            filteredTransitions.add(t1);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return filteredTransitions;
    }
  }]);

  return Statechart;
}(base.BaseInterpreter);

base.Statechart = Statechart; //simple default invoker

base.InterpreterScriptingContext.invokers = {
  "http://www.w3.org/TR/scxml/": function httpWwwW3OrgTRScxml(invokingSession, invokeObj, invokerExecutionContext, cb) {
    //put invoke logic here: 
    var method, arg;

    if (invokeObj.constructorFunction) {
      var fnModel = invokeObj.constructorFunction;
      var options = {
        invokeid: invokeObj.id,
        params: invokeObj.params,
        parentSession: invokingSession,
        docUrl: invokeObj.docUrl //sessionid : //TODO: construct or generate a sessionid for invoked session

      };
      var model = invokerExecutionContext;
      var interpreter;

      if (options.parentSession instanceof Statechart) {
        interpreter = new Statechart(fnModel, options);
      }

      cb(null, interpreter, fnModel, model); //we introduce a delay here before starting the interpreter to give clients that are subscribed to onInvokedSessionInitialized event a chance to subscribe to events on the newly instantiated interpreter

      setImmediate(function () {
        return interpreter.start();
      });
    } else {
      throw new Error('Invoke object needs a constructorFunction property');
    }
  }
};
base.InterpreterScriptingContext.invokers[undefined] = base.InterpreterScriptingContext.invokers[null] = base.InterpreterScriptingContext.invokers['scxml'] = base.InterpreterScriptingContext.invokers["http://www.w3.org/TR/scxml/"];
module.exports = base;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../timers-browserify/main.js */ "./node_modules/timers-browserify/main.js").setImmediate))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
  "use strict";

  if (global.setImmediate) {
    return;
  }

  var nextHandle = 1; // Spec says greater than zero

  var tasksByHandle = {};
  var currentlyRunningATask = false;
  var doc = global.document;
  var registerImmediate;

  function setImmediate(callback) {
    // Callback can either be a function or a string
    if (typeof callback !== "function") {
      callback = new Function("" + callback);
    } // Copy function arguments


    var args = new Array(arguments.length - 1);

    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i + 1];
    } // Store and register the task


    var task = {
      callback: callback,
      args: args
    };
    tasksByHandle[nextHandle] = task;
    registerImmediate(nextHandle);
    return nextHandle++;
  }

  function clearImmediate(handle) {
    delete tasksByHandle[handle];
  }

  function run(task) {
    var callback = task.callback;
    var args = task.args;

    switch (args.length) {
      case 0:
        callback();
        break;

      case 1:
        callback(args[0]);
        break;

      case 2:
        callback(args[0], args[1]);
        break;

      case 3:
        callback(args[0], args[1], args[2]);
        break;

      default:
        callback.apply(undefined, args);
        break;
    }
  }

  function runIfPresent(handle) {
    // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
    // So if we're currently running a task, we'll need to delay this invocation.
    if (currentlyRunningATask) {
      // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
      // "too much recursion" error.
      setTimeout(runIfPresent, 0, handle);
    } else {
      var task = tasksByHandle[handle];

      if (task) {
        currentlyRunningATask = true;

        try {
          run(task);
        } finally {
          clearImmediate(handle);
          currentlyRunningATask = false;
        }
      }
    }
  }

  function installNextTickImplementation() {
    registerImmediate = function registerImmediate(handle) {
      process.nextTick(function () {
        runIfPresent(handle);
      });
    };
  }

  function canUsePostMessage() {
    // The test against `importScripts` prevents this implementation from being installed inside a web worker,
    // where `global.postMessage` means something completely different and can't be used for this purpose.
    if (global.postMessage && !global.importScripts) {
      var postMessageIsAsynchronous = true;
      var oldOnMessage = global.onmessage;

      global.onmessage = function () {
        postMessageIsAsynchronous = false;
      };

      global.postMessage("", "*");
      global.onmessage = oldOnMessage;
      return postMessageIsAsynchronous;
    }
  }

  function installPostMessageImplementation() {
    // Installs an event handler on `global` for the `message` event: see
    // * https://developer.mozilla.org/en/DOM/window.postMessage
    // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
    var messagePrefix = "setImmediate$" + Math.random() + "$";

    var onGlobalMessage = function onGlobalMessage(event) {
      if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
        runIfPresent(+event.data.slice(messagePrefix.length));
      }
    };

    if (global.addEventListener) {
      global.addEventListener("message", onGlobalMessage, false);
    } else {
      global.attachEvent("onmessage", onGlobalMessage);
    }

    registerImmediate = function registerImmediate(handle) {
      global.postMessage(messagePrefix + handle, "*");
    };
  }

  function installMessageChannelImplementation() {
    var channel = new MessageChannel();

    channel.port1.onmessage = function (event) {
      var handle = event.data;
      runIfPresent(handle);
    };

    registerImmediate = function registerImmediate(handle) {
      channel.port2.postMessage(handle);
    };
  }

  function installReadyStateChangeImplementation() {
    var html = doc.documentElement;

    registerImmediate = function registerImmediate(handle) {
      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var script = doc.createElement("script");

      script.onreadystatechange = function () {
        runIfPresent(handle);
        script.onreadystatechange = null;
        html.removeChild(script);
        script = null;
      };

      html.appendChild(script);
    };
  }

  function installSetTimeoutImplementation() {
    registerImmediate = function registerImmediate(handle) {
      setTimeout(runIfPresent, 0, handle);
    };
  } // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.


  var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
  attachTo = attachTo && attachTo.setTimeout ? attachTo : global; // Don't get fooled by e.g. browserify environments.

  if ({}.toString.call(global.process) === "[object process]") {
    // For Node.js before 0.9
    installNextTickImplementation();
  } else if (canUsePostMessage()) {
    // For non-IE10 modern browsers
    installPostMessageImplementation();
  } else if (global.MessageChannel) {
    // For web workers, where supported
    installMessageChannelImplementation();
  } else if (doc && "onreadystatechange" in doc.createElement("script")) {
    // For IE 6–8
    installReadyStateChangeImplementation();
  } else {
    // For older browsers
    installSetTimeoutImplementation();
  }

  attachTo.setImmediate = setImmediate;
  attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = typeof global !== "undefined" && global || typeof self !== "undefined" && self || window;
var apply = Function.prototype.apply; // DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};

exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};

exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}

Timeout.prototype.unref = Timeout.prototype.ref = function () {};

Timeout.prototype.close = function () {
  this._clearFn.call(scope, this._id);
}; // Does not start the time, just sets up the members needed.


exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);
  var msecs = item._idleTimeout;

  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
}; // setimmediate attaches itself to the global object


__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js"); // On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.


exports.setImmediate = typeof self !== "undefined" && self.setImmediate || typeof global !== "undefined" && global.setImmediate || this && this.setImmediate;
exports.clearImmediate = typeof self !== "undefined" && self.clearImmediate || typeof global !== "undefined" && global.clearImmediate || this && this.clearImmediate;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/tiny-events/lib/index.js":
/*!***********************************************!*\
  !*** ./node_modules/tiny-events/lib/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function EventEmitter() {
  this._listeners = {};
}

EventEmitter.prototype.on = function _on(type, listener) {
  if (!Array.isArray(this._listeners[type])) {
    this._listeners[type] = [];
  }

  if (this._listeners[type].indexOf(listener) === -1) {
    this._listeners[type].push(listener);
  }

  return this;
};

EventEmitter.prototype.once = function _once(type, listener) {
  var self = this;

  function __once() {
    for (var args = [], i = 0; i < arguments.length; i += 1) {
      args[i] = arguments[i];
    }

    self.off(type, __once);
    listener.apply(self, args);
  }

  __once.listener = listener;
  return this.on(type, __once);
};

EventEmitter.prototype.off = function _off(type, listener) {
  if (!Array.isArray(this._listeners[type])) {
    return this;
  }

  if (typeof listener === 'undefined') {
    this._listeners[type] = [];
    return this;
  }

  var index = this._listeners[type].indexOf(listener);

  if (index === -1) {
    for (var i = 0; i < this._listeners[type].length; i += 1) {
      if (this._listeners[type][i].listener === listener) {
        index = i;
        break;
      }
    }
  }

  this._listeners[type].splice(index, 1);

  return this;
};

EventEmitter.prototype.emit = function _emit(type) {
  if (!Array.isArray(this._listeners[type])) {
    return this;
  }

  for (var args = [], i = 1; i < arguments.length; i += 1) {
    args[i - 1] = arguments[i];
  }

  this._listeners[type].forEach(function __emit(listener) {
    listener.apply(this, args);
  }, this);

  return this;
};

module.exports.EventEmitter = EventEmitter;

/***/ }),

/***/ "./node_modules/util/node_modules/inherits/inherits_browser.js":
/*!*********************************************************************!*\
  !*** ./node_modules/util/node_modules/inherits/inherits_browser.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;

    var TempCtor = function TempCtor() {};

    TempCtor.prototype = superCtor.prototype;
    ctor.prototype = new TempCtor();
    ctor.prototype.constructor = ctor;
  };
}

/***/ }),

/***/ "./node_modules/util/support/isBufferBrowser.js":
/*!******************************************************!*\
  !*** ./node_modules/util/support/isBufferBrowser.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function isBuffer(arg) {
  return arg && _typeof(arg) === 'object' && typeof arg.copy === 'function' && typeof arg.fill === 'function' && typeof arg.readUInt8 === 'function';
};

/***/ }),

/***/ "./node_modules/util/util.js":
/*!***********************************!*\
  !*** ./node_modules/util/util.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors(obj) {
  var keys = Object.keys(obj);
  var descriptors = {};

  for (var i = 0; i < keys.length; i++) {
    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
  }

  return descriptors;
};

var formatRegExp = /%[sdj%]/g;

exports.format = function (f) {
  if (!isString(f)) {
    var objects = [];

    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }

    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function (x) {
    if (x === '%%') return '%';
    if (i >= len) return x;

    switch (x) {
      case '%s':
        return String(args[i++]);

      case '%d':
        return Number(args[i++]);

      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }

      default:
        return x;
    }
  });

  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }

  return str;
}; // Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.


exports.deprecate = function (fn, msg) {
  if (typeof process !== 'undefined' && process.noDeprecation === true) {
    return fn;
  } // Allow for deprecating things in the process of starting up.


  if (typeof process === 'undefined') {
    return function () {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugs = {};
var debugEnviron;

exports.debuglog = function (set) {
  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();

  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;

      debugs[set] = function () {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function () {};
    }
  }

  return debugs[set];
};
/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */

/* legacy: obj, showHidden, depth, colors*/


function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  }; // legacy...

  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];

  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  } // set default options


  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}

exports.inspect = inspect; // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics

inspect.colors = {
  'bold': [1, 22],
  'italic': [3, 23],
  'underline': [4, 24],
  'inverse': [7, 27],
  'white': [37, 39],
  'grey': [90, 39],
  'black': [30, 39],
  'blue': [34, 39],
  'cyan': [36, 39],
  'green': [32, 39],
  'magenta': [35, 39],
  'red': [31, 39],
  'yellow': [33, 39]
}; // Don't use 'blue' not visible on cmd.exe

inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return "\x1B[" + inspect.colors[style][0] + 'm' + str + "\x1B[" + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};
  array.forEach(function (val, idx) {
    hash[val] = true;
  });
  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect && value && isFunction(value.inspect) && // Filter out the util module, it's inspect function is special
  value.inspect !== exports.inspect && // Also filter out any prototype objects using the circular check.
  !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);

    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }

    return ret;
  } // Primitive types cannot have properties


  var primitive = formatPrimitive(ctx, value);

  if (primitive) {
    return primitive;
  } // Look up the keys of the object.


  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  } // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx


  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  } // Some type of object without properties can be shortcutted.


  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }

    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }

    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }

    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '',
      array = false,
      braces = ['{', '}']; // Make Array say that they are Array

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  } // Make functions say that they are functions


  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  } // Make RegExps say that they are RegExps


  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  } // Make dates with properties first say the date


  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  } // Make error with message first say the error


  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);
  var output;

  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function (key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');

  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }

  if (isNumber(value)) return ctx.stylize('' + value, 'number');
  if (isBoolean(value)) return ctx.stylize('' + value, 'boolean'); // For some reason typeof null is "object", so special case here.

  if (isNull(value)) return ctx.stylize('null', 'null');
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];

  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
    } else {
      output.push('');
    }
  }

  keys.forEach(function (key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
    }
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || {
    value: value[key]
  };

  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }

  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }

  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }

      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function (line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function (line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }

    name = JSON.stringify('' + key);

    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function (prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
} // NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.


function isArray(ar) {
  return Array.isArray(ar);
}

exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}

exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}

exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}

exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}

exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}

exports.isString = isString;

function isSymbol(arg) {
  return _typeof(arg) === 'symbol';
}

exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}

exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}

exports.isRegExp = isRegExp;

function isObject(arg) {
  return _typeof(arg) === 'object' && arg !== null;
}

exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}

exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}

exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}

exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null || typeof arg === 'boolean' || typeof arg === 'number' || typeof arg === 'string' || _typeof(arg) === 'symbol' || // ES6 symbol
  typeof arg === 'undefined';
}

exports.isPrimitive = isPrimitive;
exports.isBuffer = __webpack_require__(/*! ./support/isBuffer */ "./node_modules/util/support/isBufferBrowser.js");

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 26 Feb 16:19:34

function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
} // log is just a thin wrapper to console.log that prepends a timestamp


exports.log = function () {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};
/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */


exports.inherits = __webpack_require__(/*! inherits */ "./node_modules/util/node_modules/inherits/inherits_browser.js");

exports._extend = function (origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;
  var keys = Object.keys(add);
  var i = keys.length;

  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }

  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

exports.promisify = function promisify(original) {
  if (typeof original !== 'function') throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];

    if (typeof fn !== 'function') {
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');
    }

    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn,
      enumerable: false,
      writable: false,
      configurable: true
    });
    return fn;
  }

  function fn() {
    var promiseResolve, promiseReject;
    var promise = new Promise(function (resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    args.push(function (err, value) {
      if (err) {
        promiseReject(err);
      } else {
        promiseResolve(value);
      }
    });

    try {
      original.apply(this, args);
    } catch (err) {
      promiseReject(err);
    }

    return promise;
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
  if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
    value: fn,
    enumerable: false,
    writable: false,
    configurable: true
  });
  return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
};

exports.promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }

  return cb(reason);
}

function callbackify(original) {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function');
  } // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.


  function callbackified() {
    var args = [];

    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }

    var maybeCb = args.pop();

    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function');
    }

    var self = this;

    var cb = function cb() {
      return maybeCb.apply(self, arguments);
    }; // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)


    original.apply(this, args).then(function (ret) {
      process.nextTick(cb, null, ret);
    }, function (rej) {
      process.nextTick(callbackifyOnRejected, rej, cb);
    });
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
  return callbackified;
}

exports.callbackify = callbackify;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var g; // This works in non-strict mode

g = function () {
  return this;
}();

try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
} // g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}


module.exports = g;

/***/ })

/******/ });
});