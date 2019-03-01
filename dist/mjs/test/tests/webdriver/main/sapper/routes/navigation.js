var _intern$getInterface = intern.getInterface('object'),
    registerSuite = _intern$getInterface.registerSuite;

var _intern$getPlugin = intern.getPlugin('chai'),
    assert = _intern$getPlugin.assert;

registerSuite('main > sapper > routes > navigation', {
  'base': function base() {
    var _this = this;

    // docs:
    // https://theintern.io/docs.html#Leadfoot/2/api/Command/command-1
    // https://theintern.io/leadfoot/module-leadfoot_Command.html
    return this.remote // .delay(60000)
    .getWithPort(3000, '/sapper/page').testPage(function () {
      return _this.remote.findByCssSelector('[href=about]').click().getCurrentUrl().then(function (o) {
        return assert.strictEqual(new URL(o).pathname, '/sapper/page/about');
      }).end().findByCssSelector('[href=blog]').click().getCurrentUrl().then(function (o) {
        return assert.strictEqual(new URL(o).pathname, '/sapper/page/blog');
      }).end().delay(1000).findByCssSelector('[href="blog/what-is-sapper"]').click().getCurrentUrl().then(function (o) {
        return assert.strictEqual(new URL(o).pathname, '/sapper/page/blog/what-is-sapper');
      }).end().findByCssSelector('[href="."]').click().getCurrentUrl().then(function (o) {
        return assert.strictEqual(new URL(o).pathname, '/sapper/page/');
      }).end();
    });
  }
});