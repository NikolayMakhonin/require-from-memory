// Docs: https://webdriver.io/docs/gettingstarted.html
const {multiremote} = require('webdriverio')

process.env.OPENSSL_CONF = null
console.log('OPENSSL_CONF = ' + process.env.OPENSSL_CONF)

;(async () => {
	const browser = await multiremote({
		firefox: {
			hostname    : 'selenoid',
			port        : 4455,
			logLevel    : 'trace',
			path        : '/',
			capabilities: {
				browserName: 'chrome',
				version    : '33',
				// enableVNC  : true,
				// enableVideo: false
			}
		},
		// chrome: {
		// 	hostname    : 'selenoid',
		// 	port        : 4444,
		// 	logLevel    : 'trace',
		// 	path        : '/',
		// 	capabilities: {
		// 		browserName: 'chrome',
		// 		version    : '72.0',
		// 		enableVNC  : true,
		// 		enableVideo: false
		// 	}
		// }
	})

	await browser.url('https://webdriver.io')

	const title = await browser.getTitle()
	console.log(`Title was: ${title}`)

	await browser.deleteSession()

	console.log('OPENSSL_CONF = ' + process.env.OPENSSL_CONF)
})().catch(e => console.error(e))
