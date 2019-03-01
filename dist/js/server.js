"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _sirv = _interopRequireDefault(require("sirv"));

var _express = _interopRequireDefault(require("express"));

var _compression = _interopRequireDefault(require("compression"));

var sapper = _interopRequireWildcard(require("../__sapper__/server.js"));

// import polka from 'polka'
const {
  PORT,
  NODE_ENV
} = process.env;
const dev = NODE_ENV === 'development'; // const isExport = process.env.npm_lifecycle_event === 'build:sapper:export'
// if (isExport) {
// 	console.log('Export mode')
// }

const server = (0, _express.default)();
server.disable('x-powered-by');
server.use('/sapper/page', (0, _compression.default)({
  threshold: 0
}), (0, _sirv.default)('static', {
  dev
}), sapper.middleware()).listen(PORT, err => {
  if (err) {
    console.log('error', err);
  }
});