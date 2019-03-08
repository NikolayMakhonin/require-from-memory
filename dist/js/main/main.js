"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requireFromString = requireFromString;
exports.default = void 0;

var _module = _interopRequireDefault(require("module"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

/* eslint-disable global-require,no-sync,prefer-destructuring,object-property-newline */
const Module = module.constructor.length > 1 ? module.constructor : _module.default;
const CHAR_DOT = 46;
const CHAR_FORWARD_SLASH = 47;
const CHAR_BACKWARD_SLASH = 92; // see: https://github.com/nodejs/node/blob/b05fd4baa87886674721101eaf38b75716037891/lib/internal/modules/cjs/loader.js

function isRelativePath(requirePath) {
  return !(requirePath.length < 2 || requirePath.charCodeAt(0) !== CHAR_DOT || requirePath.charCodeAt(1) !== CHAR_DOT && requirePath.charCodeAt(1) !== CHAR_FORWARD_SLASH && requirePath.charCodeAt(1) !== CHAR_BACKWARD_SLASH);
} // see also: https://stackoverflow.com/a/19682189/5221762
// see also: https://github.com/floatdrop/require-from-string/blob/master/index.js
// see also: https://github.com/ariporad/pirates/blob/master/src/index.js


function requireFromString(code, filename) {
  if (!filename) {
    filename = '';
  }

  if (typeof filename !== 'string') {
    throw new Error(`filename must be a string: ${filename}`);
  }

  filename = _path.default.normalize(filename);
  let buffer;

  function getBuffer() {
    if (!buffer) {
      buffer = Buffer.from(code, 'utf8');
    }

    return buffer;
  }

  const now = new Date();
  const nowMs = now.getTime();
  const size = Buffer.byteLength(code, 'utf8');
  const fileStat = {
    size,
    blksize: 4096,
    blocks: Math.ceil(size / 4096),
    atimeMs: nowMs,
    mtimeMs: nowMs,
    ctimeMs: nowMs,
    birthtimeMs: nowMs,
    atime: now,
    mtime: now,
    ctime: now,
    birthtime: now // const modulePaths = Module._nodeModulePaths(path.dirname(filename))
    // const parent = module.parent
    // const m = new Module(filename, parent)
    // m.filename = filename

  };
  const findPath = Module._findPath;
  const resolveFilename = Module._resolveFilename;
  const readFileSync = _fs.default.readFileSync;
  const statSync = _fs.default.statSync;

  try {
    Module._findPath = (request, paths, ...others) => {
      if (request === filename) {
        return filename;
      }

      if (isRelativePath(request)) {
        const dirName = _path.default.dirname(request);

        request = `./${_path.default.basename(request)}`;

        for (let i = paths.length; i--;) {
          paths[i] = _path.default.resolve(paths[i], dirName);
        }
      }

      try {
        const filePath = findPath.apply(_fs.default, [request, paths, ...others]);

        if (!filePath) {
          showErrorInfo(`Found filePath == ${filePath}`);
        }

        return filePath;
      } catch (ex) {
        showErrorInfo(ex.message);
        throw ex;
      }

      function showErrorInfo(message) {
        console.error(`Error in Module._findPath, input params:\r\n${JSON.stringify({
          message,
          request,
          paths
        }, null, 4)}`);
      }
    }; // Module._resolveFilename = () => {
    // 	Module._resolveFilename = resolveFilename
    // 	return filename
    // }


    _fs.default.readFileSync = (fname, options, ...other) => {
      if (fname === filename) {
        return typeof options === 'string' ? code : getBuffer();
      }

      return readFileSync.apply(_fs.default, [fname, options, ...other]);
    };

    _fs.default.statSync = (fname, ...other) => {
      if (fname === filename) {
        return fileStat;
      }

      return statSync.apply(_fs.default, [fname, ...other]);
    };

    delete require.cache[filename];
    return require(filename);
  } finally {
    Module._resolveFilename = resolveFilename;
    _fs.default.readFileSync = readFileSync;
    _fs.default.statSync = statSync;
    delete require.cache[filename];
  }
}

var _default = {
  requireFromString
};
exports.default = _default;