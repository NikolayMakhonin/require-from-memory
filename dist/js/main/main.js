"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseArgs = parseArgs;
exports.main = main;
exports.default = void 0;

var _helpers = _interopRequireDefault(require("./helpers/helpers"));

var _yargs = _interopRequireDefault(require("yargs"));

function parseArgs(argv) {
  // see http://yargs.js.org/docs/
  const args = (0, _yargs.default)(argv).usage('$0 [input]', '', o => {
    o.positional('input', {
      type: 'string',
      'default': '.idea',
      describe: '.idea directory'
    });
  }).example('$0', 'Run it from project root for quick clean project settings)').options({
    output: {
      alias: 'o',
      describe: 'Output directory'
    }
  }).help().argv;
  return args;
}

function main(argv) {
  const args = parseArgs(argv || process.argv);
  console.log(args, _helpers.default.test);
}

var _default = {
  main
};
exports.default = _default;