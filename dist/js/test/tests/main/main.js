"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _main = require("../../../main/main");

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

require("core-js/fn/array/flat-map");

/* eslint-disable global-require */
describe('main > main', function () {
  const mockFile = './assets/mock-dir/mock.dir/mock-module.js';
  const mockFileEs6 = './assets/mock-dir/mock.dir/mock-module-es6.js';
  let mockContent;
  let mockContentEs6;
  const isWin = process.platform === 'win32';

  function readContent(filePath) {
    return new Promise((resolve, reject) => _fs.default.readFile(_path.default.resolve(__dirname, filePath), function read(err, data) {
      if (err) {
        reject(err);
        return;
      }

      resolve(data.toString('utf-8'));
    }));
  }

  before(async () => {
    mockContent = await readContent(mockFile);
    mockContentEs6 = await readContent(mockFileEs6);
  });
  const moduleIds = {};

  function checkResult(result, es6) {
    assert.ok(result);

    if (es6) {
      assert.ok(result.__esModule);
      result = result.default;
    }

    assert.ok(result.random);

    if (moduleIds[result.random]) {
      assert.fail('Cache is not invalidated for require-from-string module');
    }

    moduleIds[result.random] = true;
    assert.strictEqual(result.assert, assert);
    assert.strictEqual(result.assert2, assert);
    assert.ok(result.subModule);
    let {
      subModule
    } = result;

    if (!es6) {
      assert.ok(subModule.__esModule);
      subModule = subModule.default;
    }

    assert.strictEqual(subModule.assert, assert);
    assert.strictEqual(subModule.assert2, assert);
    assert.ok(subModule.mocha);
  }

  let filePaths = [_path.default.resolve(__dirname, './assets/xx/yy/module.js'), _path.default.resolve(__dirname, './assets/module.js/module.js/module.js'), _path.default.resolve(__dirname, mockFile), _path.default.resolve(__dirname, mockFileEs6)];

  if (isWin) {
    filePaths = filePaths.flatMap(o => [o, o.replace('/', '\\')]);
  }

  function testMock(filePath) {
    console.log(`Test mock: ${filePath}`);
    let result = (0, _main.requireFromString)(mockContent, filePath);
    checkResult(result);
    console.log(`Test mock es6: ${filePath}`);
    result = (0, _main.requireFromString)(mockContentEs6, filePath);
    checkResult(result, true);
  }

  it('require mock', function () {
    for (const filePath of filePaths) {
      testMock(filePath);
    }
  });
  it('require standard', function () {
    let result = require(mockFile);

    checkResult(result);
    result = require(mockFileEs6);
    checkResult(result, true);
  });
  it('errors', function () {
    (0, _main.requireFromString)('', null);
    assert.throws(() => (0, _main.requireFromString)('', true), Error);
  });
});