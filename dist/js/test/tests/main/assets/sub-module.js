"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testFunc = testFunc;
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _chai = _interopRequireDefault(require("chai"));

var _mocha = _interopRequireDefault(require("mocha"));

// import standard module
// import from node_modules
// import from node_modules
function testFunc(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.property; // test babel
}

var _default = {
  mocha: _mocha.default,
  assert,
  assert2: _chai.default.assert
};
exports.default = _default;