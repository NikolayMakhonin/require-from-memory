"use strict";

const {
  registerSuite
} = intern.getInterface('object');
const {
  assert
} = intern.getPlugin('chai'); // docs: https://theintern.io/docs.html#Leadfoot/2/api/Command/command-1

const keys = require('@theintern/leadfoot/keys');

registerSuite('env > page', {
  'load local'() {
    return this.remote.get(pathToUrl(__dirname, 'assets/page.html')).testPageWithPolyfill(() => this.remote.getUserAgent().logThis('UserAgent: ').getHtml().logThis('Html: ').checkLogs().findByCssSelector('body').getVisibleText().then(value => {
      assert.strictEqual(value, 'TEST HTML');
    }));
  },

  'load about:blank'() {
    return this.remote.get('about:blank').testPageWithPolyfill(() => this.remote.getUserAgent().logThis('UserAgent: ').getHtml().logThis('Html: ').checkLogs().findByCssSelector('body').getVisibleText().then(value => {
      assert.strictEqual(value, '');
    }));
  }

});