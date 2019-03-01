require('core-js/fn/array/flat-map')
const intern = require('intern').default
const path = require('path')
const Command = require('@theintern/leadfoot/Command').default

global.intern = intern

global.pathToUrl = function (...concatPaths) {
	const relativeUrl = `/${
		path.relative(
			process.cwd(),
			path.resolve(...concatPaths)
		)
			.replace(/\\/g, '/')
			.replace(/^\//, '')
	}`

	const url = new URL(relativeUrl, intern.config.serverUrl)

	return url.href
}

Command.prototype.getRoot = function () {
	let root
	let parent = this
	do {
		root = parent
		// eslint-disable-next-line prefer-destructuring
		parent = root.parent
	} while (parent)

	return root
}

Command.prototype.getWithPort = function (port, relativeUrl) {
	const serverUrl = `${intern.config.serverUrl.match(/(https?:\/\/[^:/]+)/)[1]}:${port}/`
	const url = serverUrl + relativeUrl.replace(/^\//, '')
	return this
		.get(url)
}

function delay(timeMilliseconds) {
	return new Promise(resolve => setTimeout(resolve, timeMilliseconds))
}

Command.prototype.delay = function (timeMilliseconds) {
	return this
		.then(() => delay(timeMilliseconds))
}

Command.prototype.runInWindow = function (windowHandle, func) {
	if (windowHandle) {
		this
			.getCurrentWindowHandle()
			.then(currentWindowHandle => {
				if (currentWindowHandle === windowHandle) {
					return func()
				}

				return this
					.switchToWindow(windowHandle)
					.then(() => func())
					.switchToWindow(currentWindowHandle)
			})
	}

	return func()
}
