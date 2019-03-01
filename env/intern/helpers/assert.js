const intern = require('intern').default
const {assert} = intern.getPlugin('chai')

const Command = require('@theintern/leadfoot/Command').default

Command.prototype.checkLogs = function (errorPredicate) {
	return this
		.getAllLogs()
		.then(logs => {
			if (errorPredicate && logs.any(errorPredicate)
			|| !errorPredicate && logs.length
			) {
				return Promise.reject(new Error(`Browser errors: ${JSON.stringify(logs, null, 4)}`))
			}

			if (logs.length) {
				console.log(JSON.stringify(logs, null, 4))
			}

			return logs
		})
}

Command.prototype.checkAfterTestPage = function (errorPredicate) {
	return this
		.checkLogs(errorPredicate)
		.debugInfoOnError()
}

// region isNewWindow

/* eslint-disable */

function isNewWindow(id) {
	if (window[id]) {
		return false
	}
	window[id] = true
	return true
}

/* eslint-enable */

const isNewWindowId = 'cd546a3c65304683a2c76c4db720997f'

Command.prototype.getIsNewWindow = function (windowHandle) {
	return this
		.runInWindow(windowHandle, () => this
			.execute(isNewWindow, [isNewWindowId]))
}

Command.prototype.assertIsNewWindow = function (windowHandle) {
	return this
		.getIsNewWindow(windowHandle)
		.then(o => {
			assert.strictEqual(o, true)
			return o
		})
}

Command.prototype.assertIsOldWindow = function (windowHandle) {
	return this
		.getIsNewWindow(windowHandle)
		.then(o => {
			assert.strictEqual(o, false)
			return o
		})
}

// endregion

Command.prototype.testPage = function (func) {
	return this
		.assertIsNewWindow()
		.checkLogs()
		.then(() => func())
		.assertIsOldWindow()
		.checkAfterTestPage()
		.end()
}

Command.prototype.testPageWithPolyfill = function (func) {
	return this
		.testPage(() => this
			.loadScript(pathToUrl('env/polyfill/bundle.js'))
			.checkLogs()
			.then(() => func()))
}
