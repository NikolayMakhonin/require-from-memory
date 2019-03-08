import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

/* eslint-disable global-require */
import { requireFromString } from '../../../main/main';
import path from 'path';
import fs from 'fs';
import 'core-js/fn/array/flat-map';
import './assets/exist/dir/cached-module';
describe('main > main', function () {
  var mockFile = './assets/mock-dir/mock.dir/mock-module.js';
  var mockFileEs6 = './assets/mock-dir/mock.dir/mock-module-es6.js';
  var mockContent;
  var mockContentEs6;
  var isWin = process.platform === 'win32';

  function readContent(filePath) {
    return new Promise(function (resolve, reject) {
      return fs.readFile(path.resolve(__dirname, filePath), function read(err, data) {
        if (err) {
          reject(err);
          return;
        }

        resolve(data.toString('utf-8'));
      });
    });
  }

  before(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee() {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return readContent(mockFile);

          case 2:
            mockContent = _context.sent;
            _context.next = 5;
            return readContent(mockFileEs6);

          case 5:
            mockContentEs6 = _context.sent;

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  var moduleIds = {};

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
    var _result = result,
        subModule = _result.subModule;

    if (!es6) {
      assert.ok(subModule.__esModule);
      subModule = subModule.default;
    }

    assert.strictEqual(subModule.assert, assert);
    assert.strictEqual(subModule.assert2, assert);
    assert.ok(subModule.mocha);
  }

  var filePaths = [path.resolve(__dirname, './assets/xx/yy/module.js'), path.resolve(__dirname, './assets/exist/dir/module.js'), path.resolve(__dirname, './assets/exist/dir/cached-module.js'), path.resolve(__dirname, './assets/module.js/module.js/module.js'), path.resolve(__dirname, mockFile), path.resolve(__dirname, mockFileEs6)];

  if (isWin) {
    filePaths = filePaths.flatMap(function (o) {
      return [o, o.replace(/\//g, '\\')];
    });
  }

  function testMockSingle(content, filePath, es6) {
    var ext = path.extname(filePath);
    var result = requireFromString(content, filePath);
    checkResult(result, es6);
  }

  function testMock(filePath) {
    require('./assets/exist/dir/cached-module');

    console.log("Test mock: ".concat(filePath));
    testMockSingle(mockContent, filePath);

    require('./assets/exist/dir/cached-module');

    console.log("Test mock es6: ".concat(filePath));
    testMockSingle(mockContentEs6, filePath, true);
  }

  it('require mock', function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = filePaths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var filePath = _step.value;
        testMock(filePath);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
  it('require standard', function () {
    var result = require(mockFile);

    checkResult(result);
    result = require(mockFileEs6);
    checkResult(result, true);
  });
  it('errors', function () {
    requireFromString('', null);
    assert.throws(function () {
      return requireFromString('', true);
    }, Error);
  });
});