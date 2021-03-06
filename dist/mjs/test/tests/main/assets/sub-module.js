import path from 'path'; // import standard module

import chai2 from 'chai'; // import from node_modules

import mocha2 from 'mocha'; // import from node_modules

export function testFunc(obj) {
  return obj === null || obj === void 0 ? void 0 : obj.property; // test babel
}
export default {
  mocha: mocha2,
  assert: assert,
  assert2: chai2.assert
};