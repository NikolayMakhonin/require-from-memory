"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

require("./styles/main.scss");

var sapper = _interopRequireWildcard(require("../__sapper__/client.js"));

sapper.start({
  target: document.querySelector('#sapper')
});