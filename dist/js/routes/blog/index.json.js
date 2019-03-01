"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

var _posts = _interopRequireDefault(require("./_posts.js"));

const contents = JSON.stringify(_posts.default.map(post => {
  return {
    title: post.title,
    slug: post.slug
  };
}));

function get(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(contents);
}