/* eslint-disable global-require,no-sync,prefer-destructuring,object-property-newline */
import BuiltinModule from 'module';
var Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;
import path from 'path';
import fs from 'fs';
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92; // see: https://github.com/nodejs/node/blob/b05fd4baa87886674721101eaf38b75716037891/lib/internal/modules/cjs/loader.js

function isRelativePath(requirePath) {
  return !(requirePath.length < 2 || requirePath.charCodeAt(0) !== CHAR_DOT || requirePath.charCodeAt(1) !== CHAR_DOT && requirePath.charCodeAt(1) !== CHAR_FORWARD_SLASH && requirePath.charCodeAt(1) !== CHAR_BACKWARD_SLASH);
} // see also: https://stackoverflow.com/a/19682189/5221762
// see also: https://github.com/floatdrop/require-from-string/blob/master/index.js
// see also: https://github.com/ariporad/pirates/blob/master/src/index.js


export function requireFromString(code, filename, options) {
  var _ref = options || {},
      logFilter = _ref.logFilter;

  if (!filename) {
    filename = '';
  }

  if (typeof filename !== 'string') {
    throw new Error("filename must be a string: ".concat(filename));
  }

  filename = path.normalize(filename);
  var buffer;

  function getBuffer() {
    if (!buffer) {
      buffer = Buffer.from(code, 'utf8');
    }

    return buffer;
  }

  var now = new Date();
  var nowMs = now.getTime();
  var size = Buffer.byteLength(code, 'utf8');
  var fileStat = {
    size: size,
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
  var findPath = Module._findPath;
  var resolveFilename = Module._resolveFilename;
  var readFileSync = fs.readFileSync;
  var statSync = fs.statSync;

  try {
    Module._findPath = function (request, paths) {
      for (var _len = arguments.length, others = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        others[_key - 2] = arguments[_key];
      }

      if (request === filename) {
        return filename;
      }

      if (isRelativePath(request)) {
        var dirName = path.dirname(request);
        request = "./".concat(path.basename(request));

        for (var i = paths.length; i--;) {
          paths[i] = path.resolve(paths[i], dirName);
        }
      }

      try {
        var filePath = findPath.apply(fs, [request, paths].concat(others));

        if (!filePath) {
          showErrorInfo('WARNING', 'FindPath', "Found filePath == ".concat(filePath));
        }

        return filePath;
      } catch (ex) {
        showErrorInfo('ERROR', 'FindPath', ex.message, ex);
        throw ex;
      }

      function showErrorInfo(level, type, message, exception) {
        var logEvent = {
          level: level,
          type: type,
          message: message,
          filename: filename,
          code: code,
          vars: {
            request: request,
            paths: paths,
            others: others
          },
          exception: exception
        };

        if (logFilter && !logFilter(logEvent)) {
          return;
        }

        delete logEvent.code;

        if (logEvent.vars) {
          delete logEvent.vars.paths;
          delete logEvent.vars.others;
        }

        var logStr = 'Error in requireFromString:\n';

        switch (logEvent.level) {
          case 'INFO':
            console.log(logStr, logEvent, '\n');
            break;

          case 'WARNING':
            console.warn(logStr, logEvent, '\n');
            break;

          default:
            console.error(logStr, logEvent, '\n');
            break;
        }
      }
    }; // Module._resolveFilename = () => {
    // 	Module._resolveFilename = resolveFilename
    // 	return filename
    // }


    fs.readFileSync = function (fname, opts) {
      if (fname === filename) {
        return typeof opts === 'string' ? code : getBuffer();
      }

      for (var _len2 = arguments.length, other = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        other[_key2 - 2] = arguments[_key2];
      }

      return readFileSync.apply(fs, [fname, opts].concat(other));
    };

    fs.statSync = function (fname) {
      if (fname === filename) {
        return fileStat;
      }

      for (var _len3 = arguments.length, other = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        other[_key3 - 1] = arguments[_key3];
      }

      return statSync.apply(fs, [fname].concat(other));
    };

    delete require.cache[filename];
    return require(filename);
  } finally {
    Module._resolveFilename = resolveFilename;
    fs.readFileSync = readFileSync;
    fs.statSync = statSync;
    delete require.cache[filename];
  }
}
export default {
  requireFromString: requireFromString
};