import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
export var TouchToMouse = function TouchToMouse(container) {
  var actionsPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  _classCallCheck(this, TouchToMouse);

  var mouseUpName = "on".concat(actionsPrefix, "mouseup");
  var mouseOutName = "on".concat(actionsPrefix, "mouseout");
  var mouseEnterName = "on".concat(actionsPrefix, "mouseenter"); // bind touch

  addListenerWithCoord('touchstart', "on".concat(actionsPrefix, "mousedown"));
  addListenerWithCoord('touchmove', "on".concat(actionsPrefix, "mousemove"));
  addListener('touchend', mouseUpName); // bind mouse

  addListenerWithCoord('mousedown', "on".concat(actionsPrefix, "mousedown"));
  addListenerWithCoord('mousemove', "on".concat(actionsPrefix, "mousemove"));
  addListener('mouseup', "on".concat(actionsPrefix, "mouseup")); // prevent duplicate events

  preventEvents('mouseenter');
  preventEvents('mouseout');

  function preventEvents(eventType) {
    container.addEventListener(eventType, function (e) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }, {
      bubbles: false
    });
  }

  function addListener(eventType, actionName) {
    container.addEventListener(eventType, function (e) {
      callAction(actionName);
      e.stopPropagation();
      e.preventDefault();
      return false;
    }, {
      bubbles: false
    });
  }

  function addListenerWithCoord(eventType, actionName) {
    container.addEventListener(eventType, function (e) {
      var touches = e.touches;

      if (touches) {
        var touches0 = touches[0];
        callAction(actionName, touches0.pageX, touches0.pageY);
      } else {
        callAction(actionName, e.pageX, e.pageY);
      }

      e.stopPropagation();
      e.preventDefault();
      return false;
    }, {
      bubbles: false
    });
  }

  var prevTarget = null;
  var target;
  var prevX = null;
  var prevY = null;
  var isVisiblePredicate;
  this.callAction = callAction;

  function callAction(actionName, x, y) {
    if (actionName === mouseUpName) {
      x = prevX;
      y = prevY;

      if (prevTarget && prevTarget[mouseOutName]) {
        prevTarget[mouseOutName](x, y);
      }

      target = prevTarget;
      prevTarget = null;
    } else {
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return;
      }

      target = document.elementFromPoint(x, y);

      while (true) {
        if (target == null) {
          return;
        }

        if (isVisiblePredicate == null || isVisiblePredicate(target)) {
          break;
        }

        target = target.parentNode;
      }

      if (target !== prevTarget) {
        if (prevTarget && prevTarget[mouseOutName]) {
          prevTarget[mouseOutName](x, y);
        }

        if (target[mouseEnterName]) {
          target[mouseEnterName](x, y);
        }
      }

      prevX = x;
      prevY = y;
      prevTarget = target;
    }

    if (target[actionName]) {
      target[actionName](x, y);
    }
  }

  Object.defineProperty(this, 'isVisiblePredicate', {
    get: function get() {
      return isVisiblePredicate;
    },
    set: function set(value) {
      isVisiblePredicate = value;
    },
    enumerable: true,
    configurable: false
  });
};
export default {
  TouchToMouse: TouchToMouse
};