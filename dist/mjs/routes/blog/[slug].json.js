import posts from './_posts.js';
var lookup = new Map();
posts.forEach(function (post) {
  lookup.set(post.slug, JSON.stringify(post));
});
export function get(req, res, next) {
  // the `slug` parameter is available because
  // this file is called [slug].json.js
  var slug = req.params.slug;

  if (lookup.has(slug)) {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(lookup.get(slug));
  } else {
    res.writeHead(404, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      message: "Not found"
    }));
  }
}