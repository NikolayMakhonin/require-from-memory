const webdriverio = require('webdriverio')
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const firefox = require('selenium-webdriver/firefox')
const capabilitiesModule = require('selenium-webdriver/lib/capabilities')

// Docs:
// https://www.npmjs.com/package/selenium-webdriver
// https://seleniumhq.github.io/selenium/docs/api/javascript/index.html
// https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/

const chromeOptions = new chrome.Options()
// console.log(chromeOptions, Object.getOwnPropertyNames(chromeOptions))
chromeOptions.setChromeBinaryPath('l:/Program Files (x86)/Chromium/33.0.1750.170/chrome2.exe')

const firefoxOptions = new firefox.Options()
// firefoxOptions.setBinary('l:/Program Files (x86)/Chromium/33.0.1750.170/chrome2.exe')

// const capabilities = new capabilitiesModule.Capabilities()
// capabilities.merge(chromeOptions)

// const chromeServiceBuilder = new chrome.ServiceBuilder().build()
// createDriver(chrome.Driver, capabilities, null, this.flow_)

let driver
const envPath = process.env.PATH
try {
	process.env.PATH = 'l:/Program Files (x86)/Chromium/33.0.1750.170/'
	driver = new webdriver.Builder()
		.forBrowser('firefox')
		.setChromeOptions(chromeOptions)
		.setFirefoxOptions(firefoxOptions)
		.build()
} finally {
	process.env.PATH = envPath
}

driver
	.get('https://www.github.com/')
	// .setValue('*[name="q"]', 'BrowserStack\n')
	// .pause(5000)

// setTimeout(() => console.log('DONE'), 10000)

// driver
// 	.get('https://yandex.ru/')

// setTimeout(() => console.log('DONE'), 100000)

// describe('Google\'s Search Functionality', function() {
// 	it('can find search results', function () {
// 		browser
// 		.url('https://www.google.com/ncr')
// 		.setValue('*[name="q"]','BrowserStack\n')
// 		.pause(5000);
//
// 		assert(browser.getTitle().match(/BrowserStack - Google Search/i));
// 	});
// });
