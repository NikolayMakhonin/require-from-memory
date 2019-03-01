import {WindowHelpers} from '../src/helpers/e2e'

// console.log(navigator.userAgent)

describe('browser > e2e > env > static', function () {
	const rootUrl = 'http://localhost:4444'
	const testUrl = `${rootUrl}/env/assets/`
	let win

	before(async function () {
		this.timeout(60000)

		if (!await WindowHelpers.isAllowFrameAccess(testUrl)) {
			this.skip()
			return
		}

		console.log(`Navigate to: ${testUrl}`)
		win = await WindowHelpers
			.create()
			.navigate(testUrl)
	})

	after(function () {
		win?.close()
	})

	it('is loaded', function () {
		assert.ok(win.isLoaded())
		assert.strictEqual(win.window.document.location.href, testUrl)
	})

	it('test/load/wait', function () {
		assert.ok(win.isLoaded())
		assert.strictEqual(win.window.document.location.href, testUrl)
	})

	it('get html', function () {
		const html = win.html()
		assert.ok(html)
		assert.match(html, /<!DOCTYPE html>/)
		// console.log(`HTML: ${html}`)
	})

	it('w3c validate', async function () {
		this.timeout(60000)
		const result = await win.validate()
		assert.ok(!(result.error || result.warning), JSON.stringify(result, null, 4))
	})

	it('user-agent', function () {
		assert.ok(WindowHelpers.userAgent)
		assert.ok(WindowHelpers.userAgent.browser)
		assert.ok(WindowHelpers.userAgent.browser.name)
		assert.ok(WindowHelpers.userAgent.browser.version)
		// console.log(JSON.stringify(WindowHelpers.userAgent, null, 4))
	})

	it('write', function () {
		this.timeout(60000)
		assert.strictEqual(win.window.document.body.innerText, 'TEST HTML')

		win.window.document.body.innerText = 'TEST innerText'
		assert.strictEqual(win.window.document.body.innerText, 'TEST innerText')

		if (!(WindowHelpers.userAgent.browser.name.indexOf('Chrome') >= 0 && WindowHelpers.userAgent.browser.major > 60)) {
			win.window.document.write('TEST WRITE')
			assert.strictEqual(win.window.document.body.innerText, 'TEST WRITE')
		}
	})
})
