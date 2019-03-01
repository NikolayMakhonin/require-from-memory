var _intern$getInterface = intern.getInterface('object'),
    registerSuite = _intern$getInterface.registerSuite;

var _intern$getPlugin = intern.getPlugin('chai'),
    assert = _intern$getPlugin.assert; // docs: https://theintern.io/docs.html#Leadfoot/2/api/Command/command-1


var keys = require('@theintern/leadfoot/keys');

registerSuite('env > page', {
  'load local': function loadLocal() {
    var _this = this;

    return this.remote.get(pathToUrl(__dirname, 'assets/page.html')).testPageWithPolyfill(function () {
      return _this.remote.getUserAgent().logThis('UserAgent: ').getHtml().logThis('Html: ').checkLogs().findByCssSelector('body').getVisibleText().then(function (value) {
        assert.strictEqual(value, 'TEST HTML');
      });
    });
  },
  'load about:blank': function loadAboutBlank() {
    var _this2 = this;

    return this.remote.get('about:blank').testPageWithPolyfill(function () {
      return _this2.remote.getUserAgent().logThis('UserAgent: ').getHtml().logThis('Html: ').checkLogs().findByCssSelector('body').getVisibleText().then(function (value) {
        assert.strictEqual(value, '');
      });
    });
  }
});