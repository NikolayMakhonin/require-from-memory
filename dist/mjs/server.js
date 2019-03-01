import sirv from 'sirv'; // import polka from 'polka'

import express from 'express';
import compression from 'compression';
import * as sapper from '../__sapper__/server.js';
var _process$env = process.env,
    PORT = _process$env.PORT,
    NODE_ENV = _process$env.NODE_ENV;
var dev = NODE_ENV === 'development'; // const isExport = process.env.npm_lifecycle_event === 'build:sapper:export'
// if (isExport) {
// 	console.log('Export mode')
// }

var server = express();
server.disable('x-powered-by');
server.use('/sapper/page', compression({
  threshold: 0
}), sirv('static', {
  dev: dev
}), sapper.middleware()).listen(PORT, function (err) {
  if (err) {
    console.log('error', err);
  }
});