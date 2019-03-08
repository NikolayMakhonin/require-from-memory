"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testFunc = testFunc;
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _chai = _interopRequireDefault(require("chai"));

var _subModule = _interopRequireDefault(require("../../sub-module.js"));

// import standard module
// import from node_modules
// import local
function testFunc(obj2) {
  return obj2 === null || obj2 === void 0 ? void 0 : obj2.property; // test babel
}

var _default = {
  assert,
  assert2: _chai.default.assert,
  subModule: _subModule.default,
  random: Math.random()
};
exports.default = _default;