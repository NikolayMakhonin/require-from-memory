(function(){
this['src/test/tests/webdriver/env/src/component'] = (function () {
	'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

	function _typeof(obj) {
	  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
	    module.exports = _typeof = function _typeof(obj) {
	      return _typeof2(obj);
	    };
	  } else {
	    module.exports = _typeof = function _typeof(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
	    };
	  }

	  return _typeof(obj);
	}

	module.exports = _typeof;
	});

	function noop() {}

	function assign(tar, src) {
	  for (var k in src) {
	    tar[k] = src[k];
	  }

	  return tar;
	}

	function addLoc(element, file, line, column, char) {
	  element.__svelte_meta = {
	    loc: {
	      file: file,
	      line: line,
	      column: column,
	      char: char
	    }
	  };
	}

	function append(target, node) {
	  target.appendChild(node);
	}

	function insert(target, node, anchor) {
	  target.insertBefore(node, anchor);
	}

	function detachNode(node) {
	  node.parentNode.removeChild(node);
	}

	function createElement(name) {
	  return document.createElement(name);
	}

	function createSvgElement(name) {
	  return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	function createText(data) {
	  return document.createTextNode(data);
	}

	function addListener(node, event, handler, options) {
	  node.addEventListener(event, handler, options);
	}

	function removeListener(node, event, handler, options) {
	  node.removeEventListener(event, handler, options);
	}

	function setAttribute(node, attribute, value) {
	  if (value == null) node.removeAttribute(attribute);else node.setAttribute(attribute, value);
	}

	function children(element) {
	  return Array.from(element.childNodes);
	}

	function claimElement(nodes, name, attributes, svg) {
	  for (var i = 0; i < nodes.length; i += 1) {
	    var node = nodes[i];

	    if (node.nodeName === name) {
	      for (var j = 0; j < node.attributes.length; j += 1) {
	        var attribute = node.attributes[j];
	        if (!attributes[attribute.name]) node.removeAttribute(attribute.name);
	      }

	      return nodes.splice(i, 1)[0]; // TODO strip unwanted attributes
	    }
	  }

	  return svg ? createSvgElement(name) : createElement(name);
	}

	function claimText(nodes, data) {
	  for (var i = 0; i < nodes.length; i += 1) {
	    var node = nodes[i];

	    if (node.nodeType === 3) {
	      node.data = data;
	      return nodes.splice(i, 1)[0];
	    }
	  }

	  return createText(data);
	}

	function setData(text, data) {
	  text.data = '' + data;
	}

	function blankObject() {
	  return Object.create(null);
	}

	function destroy(detach) {
	  this.destroy = noop;
	  this.fire('destroy');
	  this.set = noop;

	  this._fragment.d(detach !== false);

	  this._fragment = null;
	  this._state = {};
	}

	function destroyDev(detach) {
	  destroy.call(this, detach);

	  this.destroy = function () {
	    console.warn('Component was already destroyed');
	  };
	}

	function _differs(a, b) {
	  return a != a ? b == b : a !== b || a && _typeof_1(a) === 'object' || typeof a === 'function';
	}

	function fire(eventName, data) {
	  var handlers = eventName in this._handlers && this._handlers[eventName].slice();

	  if (!handlers) return;

	  for (var i = 0; i < handlers.length; i += 1) {
	    var handler = handlers[i];

	    if (!handler.__calling) {
	      try {
	        handler.__calling = true;
	        handler.call(this, data);
	      } finally {
	        handler.__calling = false;
	      }
	    }
	  }
	}

	function flush(component) {
	  component._lock = true;
	  callAll(component._beforecreate);
	  callAll(component._oncreate);
	  callAll(component._aftercreate);
	  component._lock = false;
	}

	function get() {
	  return this._state;
	}

	function init(component, options) {
	  component._handlers = blankObject();
	  component._slots = blankObject();
	  component._bind = options._bind;
	  component._staged = {};
	  component.options = options;
	  component.root = options.root || component;
	  component.store = options.store || component.root.store;

	  if (!options.root) {
	    component._beforecreate = [];
	    component._oncreate = [];
	    component._aftercreate = [];
	  }
	}

	function on(eventName, handler) {
	  var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	  handlers.push(handler);
	  return {
	    cancel: function cancel() {
	      var index = handlers.indexOf(handler);
	      if (~index) handlers.splice(index, 1);
	    }
	  };
	}

	function set(newState) {
	  this._set(assign({}, newState));

	  if (this.root._lock) return;
	  flush(this.root);
	}

	function _set(newState) {
	  var oldState = this._state,
	      changed = {},
	      dirty = false;
	  newState = assign(this._staged, newState);
	  this._staged = {};

	  for (var key in newState) {
	    if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
	  }

	  if (!dirty) return;
	  this._state = assign(assign({}, oldState), newState);

	  this._recompute(changed, this._state);

	  if (this._bind) this._bind(changed, this._state);

	  if (this._fragment) {
	    this.fire("state", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });

	    this._fragment.p(changed, this._state);

	    this.fire("update", {
	      changed: changed,
	      current: this._state,
	      previous: oldState
	    });
	  }
	}

	function _stage(newState) {
	  assign(this._staged, newState);
	}

	function setDev(newState) {
	  if (_typeof_1(newState) !== 'object') {
	    throw new Error(this._debugName + '.set was called without an object of data key-values to update.');
	  }

	  this._checkReadOnly(newState);

	  set.call(this, newState);
	}

	function callAll(fns) {
	  while (fns && fns.length) {
	    fns.shift()();
	  }
	}

	function _mount(target, anchor) {
	  this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}
	var protoDev = {
	  destroy: destroyDev,
	  get: get,
	  fire: fire,
	  on: on,
	  set: setDev,
	  _recompute: noop,
	  _set: _set,
	  _stage: _stage,
	  _mount: _mount,
	  _differs: _differs
	};

	var _Array$from, _Object$assign, _Object$assign$x;

	/* eslint-disable no-shadow */
	var x = {};
	var test = (_Array$from = Array.from((_Object$assign = Object.assign(x, {
	  x: {
	    y: ['test']
	  }
	})) === null || _Object$assign === void 0 ? void 0 : (_Object$assign$x = _Object$assign.x) === null || _Object$assign$x === void 0 ? void 0 : _Object$assign$x.y)) === null || _Array$from === void 0 ? void 0 : _Array$from[0];

	/* src\test\tests\webdriver\env\src\component.svelte generated by Svelte v2.16.1 */

	function data() {
	  return {
	    count: test ? test.length : test
	  };
	}
	var file = "src\\test\\tests\\webdriver\\env\\src\\component.svelte";

	function create_main_fragment(component, ctx) {
	  var p, text0, text1, button, text2;

	  function click_handler(event) {
	    component.set({
	      count: ctx.count + 1
	    });
	  }

	  return {
	    c: function create() {
	      p = createElement("p");
	      text0 = createText("Count: ");
	      text1 = createText(ctx.count);
	      button = createElement("button");
	      text2 = createText("+1");
	      this.h();
	    },
	    l: function claim(nodes) {
	      p = claimElement(nodes, "P", {
	        count: true
	      }, false);
	      var p_nodes = children(p);
	      text0 = claimText(p_nodes, "Count: ");
	      text1 = claimText(p_nodes, ctx.count);
	      p_nodes.forEach(detachNode);
	      button = claimElement(nodes, "BUTTON", {}, false);
	      var button_nodes = children(button);
	      text2 = claimText(button_nodes, "+1");
	      button_nodes.forEach(detachNode);
	      this.h();
	    },
	    h: function hydrate() {
	      setAttribute(p, "count", ctx.count);
	      addLoc(p, file, 0, 0, 0);
	      addListener(button, "click", click_handler);
	      addLoc(button, file, 0, 37, 37);
	    },
	    m: function mount(target, anchor) {
	      insert(target, p, anchor);
	      append(p, text0);
	      append(p, text1);
	      insert(target, button, anchor);
	      append(button, text2);
	    },
	    p: function update(changed, _ctx) {
	      ctx = _ctx;

	      if (changed.count) {
	        setData(text1, ctx.count);
	        setAttribute(p, "count", ctx.count);
	      }
	    },
	    d: function destroy(detach) {
	      if (detach) {
	        detachNode(p);
	        detachNode(button);
	      }

	      removeListener(button, "click", click_handler);
	    }
	  };
	}

	function Component(options) {
	  this._debugName = '<Component>';

	  if (!options || !options.target && !options.root) {
	    throw new Error("'target' is a required option");
	  }

	  init(this, options);
	  this._state = assign(data(), options.data);
	  if (!('count' in this._state)) console.warn("<Component> was created without expected data property 'count'");
	  this._intro = true;
	  this._fragment = create_main_fragment(this, this._state);

	  if (options.target) {
	    var nodes = children(options.target);
	    options.hydrate ? this._fragment.l(nodes) : this._fragment.c();
	    nodes.forEach(detachNode);

	    this._mount(options.target, options.anchor);
	  }
	}

	assign(Component.prototype, protoDev);

	Component.prototype._checkReadOnly = function _checkReadOnly(newState) {};

	return Component;

}());
}).call(window);
//# sourceMappingURL=component.svelte.js.map
