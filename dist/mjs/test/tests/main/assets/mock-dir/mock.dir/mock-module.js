var path = require('path'); // import standard module


var chai2 = require('chai'); // import from node_modules


var subModule = require('../../sub-module.js'); // import local


function testFunc(obj2) {
  return obj2 === null || obj2 === void 0 ? void 0 : obj2.property; // test babel
}

module.exports = {
  assert: assert,
  assert2: chai2.assert,
  subModule: subModule,
  random: Math.random()
};