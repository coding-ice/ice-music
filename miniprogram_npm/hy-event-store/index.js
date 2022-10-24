module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1666102573832, function(require, module, exports) {
module.exports = {
  HYEventBus: require('./event-bus'),
  HYEventStore: require('./event-store')
}

}, function(modId) {var map = {"./event-bus":1666102573833,"./event-store":1666102573834}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1666102573833, function(require, module, exports) {
class HYEventBus {
  constructor() {
    this.eventBus = {}
  }

  on(eventName, eventCallback, thisArg) {
    if (typeof eventName !== "string") {
      throw new TypeError("the event name must be string type")
    }

    if (typeof eventCallback !== "function") {
      throw new TypeError("the event callback must be function type")
    }
    
    let hanlders = this.eventBus[eventName]
    if (!hanlders) {
      hanlders = []
      this.eventBus[eventName] = hanlders
    }

    hanlders.push({
      eventCallback,
      thisArg
    })
    return this
  }

  once(eventName, eventCallback, thisArg) {
    if (typeof eventName !== "string") {
      throw new TypeError("the event name must be string type")
    }

    if (typeof eventCallback !== "function") {
      throw new TypeError("the event callback must be function type")
    }
    
    const tempCallback = (...payload) => {
      this.off(eventName, tempCallback)
      eventCallback.apply(thisArg, payload)
    }

    return this.on(eventName, tempCallback, thisArg)
  }

  emit(eventName, ...payload) {
    if (typeof eventName !== "string") {
      throw new TypeError("the event name must be string type")
    }

    const handlers = this.eventBus[eventName] || []
    handlers.forEach(handler => {
      handler.eventCallback.apply(handler.thisArg, payload)
    })
    return this
  }

  off(eventName, eventCallback) {
    if (typeof eventName !== "string") {
      throw new TypeError("the event name must be string type")
    }

    if (typeof eventCallback !== "function") {
      throw new TypeError("the event callback must be function type")
    }

    const handlers = this.eventBus[eventName]
    if (handlers && eventCallback) {
      const newHandlers = [...handlers]
      for (let i = 0; i < newHandlers.length; i++) {
        const handler = newHandlers[i]
        if (handler.eventCallback === eventCallback) {
          const index = handlers.indexOf(handler)
          handlers.splice(index, 1)
        }
      }
    }

    if (handlers.length === 0) {
      delete this.eventBus[eventName]
    }
  }
}

module.exports = HYEventBus

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1666102573834, function(require, module, exports) {
const EventBus = require("./event-bus")
const { isObject } = require('./utils')

class HYEventStore {
  constructor(options) {
    if (!isObject(options.state)) {
      throw new TypeError("the state must be object type")
    }
    if (options.actions && isObject(options.actions)) {
      const values = Object.values(options.actions)
      for (const value of values) {
        if (typeof value !== "function") {
          throw new TypeError("the value of actions must be a function")
        }
      }
      this.actions = options.actions
    }
    this.state = options.state
    this._observe(options.state)
    this.event = new EventBus()
    this.eventV2 = new EventBus()
  }

  _observe(state) {
    const _this = this
    Object.keys(state).forEach(key => {
      let _value = state[key]
      Object.defineProperty(state, key, {
        get: function() {
          return _value
        },
        set: function(newValue) {
          if (_value === newValue) return
          _value = newValue
          _this.event.emit(key, _value)
          _this.eventV2.emit(key, { [key]: _value })
        }
      })
    })
  }

  onState(stateKey, stateCallback) {
    const keys = Object.keys(this.state)
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state does not contain your key")
    }
    this.event.on(stateKey, stateCallback)

    // callback
    if (typeof stateCallback !== "function") {
      throw new TypeError("the event callback must be function type")
    }
    const value = this.state[stateKey]
    stateCallback.apply(this.state, [value])
  }

  // ["name", "age"] callback1
  // ["name", "height"] callback2

  onStates(statekeys, stateCallback) {
    const keys = Object.keys(this.state)
    const value = {}
    for (const theKey of statekeys) {
      if (keys.indexOf(theKey) === -1) {
        throw new Error("the state does not contain your key")
      }
      this.eventV2.on(theKey, stateCallback)
      value[theKey] = this.state[theKey]
    }

    stateCallback.apply(this.state, [value])
  }

  offStates(stateKeys, stateCallback) {
    const keys = Object.keys(this.state)
    stateKeys.forEach(theKey => {
      if (keys.indexOf(theKey) === -1) {
        throw new Error("the state does not contain your key")
      }
      this.eventV2.off(theKey, stateCallback)
    })
  }

  offState(stateKey, stateCallback) {
    const keys = Object.keys(this.state)
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state does not contain your key")
    }
    this.event.off(stateKey, stateCallback)
  }

  setState(stateKey, stateValue) {
    this.state[stateKey] = stateValue
  }

  dispatch(actionName, ...args) {
    if (typeof actionName !== "string") {
      throw new TypeError("the action name must be string type")
    }
    if (Object.keys(this.actions).indexOf(actionName) === -1) {
      throw new Error("this action name does not exist, please check it")
    }
    const actionFn = this.actions[actionName]
    actionFn.apply(this, [this.state, ...args])
  }
}

module.exports = HYEventStore

}, function(modId) { var map = {"./event-bus":1666102573833,"./utils":1666102573835}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1666102573835, function(require, module, exports) {
function isObject(obj) {
  var type = typeof obj;
  return type === 'object' && !!obj;
}

module.exports = {
  isObject
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1666102573832);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map