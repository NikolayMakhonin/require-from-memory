import UAParser from 'ua-parser-js'

export function delay(timeMilliseconds) {
	return new Promise(resolve => setTimeout(resolve, timeMilliseconds))
}

export async function throwIfTimeout(timeout, func, throwIfError = true) {
	if (typeof timeout !== 'number') {
		throw new Error(`timeout argument is not a number: ${timeout}`)
	}

	const timeoutResult = {}
	const result = await Promise.race([
		typeof func === 'function'
			? func()
			: func,
		delay(timeout)
			.then(o => timeoutResult)
	])

	if (result === timeoutResult) {
		if (throwIfError) {
			throw new Error(`Timeout error (${timeout}):\r\n${func.toString()}`)
		}
		return false
	}

	return result
}

const blankUrl = 'about:blank'

export class WindowHelpers {
	constructor(win) {
		if (!win) {
			throw new Error(`Argument 'win' is empty: ${win}`)
		}
		this.window = win
	}

	static create(width, height, handleErrors = true) {
		const winName = (Number.MAX_SAFE_INTEGER * Math.random()).toString(32)
		const windowInstance = window.open(
			blankUrl,
			winName,
			`width=${width || 600},height=${height || 1000},location=no,resizable=yes,scrollbars=yes`
		)

		if (!windowInstance) {
			throw new Error('Cannot get access to the created window. You should to disable web security in the test browser.')
		}

		const win = new WindowHelpers(windowInstance)
		if (handleErrors) {
			win.handleErrors()
		}

		return win
	}

	async navigate(url, timeout = 30000) {
		const oldUrl = this.window.document.location.href

		url = new URL(url)
		if (url.href === new URL(oldUrl)) {
			return this
		}

		this.window.document.location.href = url.href

		console.log(`navigate ${oldUrl} => ${url.href} => ${this.window.document.location.href}`)

		await throwIfTimeout(timeout, async () => {
			while (true) {
				// eslint-disable-next-line no-await-in-loop
				await this.wait(1000, false)

				if (this.window.document.location.href !== oldUrl) {
					break
				}

				// eslint-disable-next-line no-await-in-loop
				await delay(10)
			}
		})

		if (this.window.document.location.href === oldUrl) {
			throw new Error(`Window navigate, url is not changed to ${url.href}`)
		}

		console.log(`navigate ${oldUrl} => ${url.href} => ${this.window.document.location.href}`)

		return this
	}

	isLoaded() {
		return this.window.document.readyState === 'complete' || this.window.document.readyState === 'interactive'
	}

	url() {
		return this.window.document.location.href
	}

	async wait(timeout = 30000, throwIfError = true) {
		const win = this.window
		const result = await throwIfTimeout(timeout, new Promise(resolve => {
			function onLoadHandler() {
				if (win.onload === onLoadHandler) {
					win.onload = null
				}
				win.removeEventListener('load', onLoadHandler)
				resolve()
			}

			win.onload = onLoadHandler
			win.addEventListener('load', onLoadHandler, true)

			if (this.isLoaded()) {
				onLoadHandler()
			}
		}), throwIfError)

		if (!throwIfError && !result) {
			return false
		}

		return this
	}

	handleErrors() {
		this.window.onerror = function (message, file, line, col, error) {
			const msg = JSON.stringify({
				message,
				file,
				line,
				col,
				error
			})
			console.error(msg)
			assert.fail(msg)
			return false
		}

		this.window.addEventListener('error', function (e) {
			// const msg = JSON.stringify(e)
			console.error(e)
			assert.fail(e)
		})

		this.window.addEventListener('unhandledrejection', function (e) {
			// const msg = JSON.stringify(e)
			console.error(e)
			assert.fail(e)
		})

		return this
	}

	close() {
		this.window.close()
	}

	html() {
		return new XMLSerializer().serializeToString(this.window.document)
	}
	
	validate(options) {
		return validateW3C({
			...options,
			content: this.html()
		})
	}

	static async test(url, width, height, testFunc) {
		const win = await WindowHelpers
			.create(width, height)
			.navigate(url)

		try {
			await testFunc(win)
		} finally {
			win.close()
		}
	}

	static current = new WindowHelpers(window).handleErrors()

	static userAgent = new UAParser().getResult()

	static async isAllowFrameAccess(checkUrl = 'https://google.com') {
		let result
		let error
		const win = await WindowHelpers.create()
		try {
			await win.navigate(checkUrl)
			result = true
		} catch (ex) {
			if (ex.message.indexOf('cross-origin') < 0) {
				throw ex
			}
			error = ex
		}

		if (!result) {
			console.warn(`Frame access is not allowed for browser: ${WindowHelpers.userAgent.browser.name}${WindowHelpers.userAgent.browser.version}\r\n${error}`)
		} else {
			console.log('Frame access is allowed')
		}

		return result
	}
}

const w3cValidatorUrl = 'https://validator.w3.org/nu/?out=json&group=1&parser=html5'

export async function validateW3C(options) {
	const xhr = new XMLHttpRequest()
	xhr.timeout = options.timeout || 7000
	xhr.open('POST', w3cValidatorUrl)
	xhr.setRequestHeader('Content-Type', 'text/html; charset=utf-8')
	xhr.setRequestHeader('User-Agent', 'Validator.nu/LV http://validator.w3.org/services')

	const responseJson = await new Promise((resolve, reject) => {
		xhr.ontimeout = function () {
			reject(`validateW3C: The request for ${w3cValidatorUrl} timed out.`)
		}
		xhr.onerror = function () {
			reject('validateW3C: Error during the request')
		}
		xhr.onreadystatechange = function () {
			if (this.readyState !== 4) {
				return
			}

			if (this.status !== 200) {
				reject(`validateW3C: An error occurred during your request: ${this.status}:${this.statusText}`)
				return
			}

			resolve(this.responseText)
		}

		xhr.send(options.content)
	})

	const response = JSON.parse(responseJson)

	const result = {}
	for (const message of response.messages) {
		const type = message.subType || message.type
		let messages = result[type]
		if (!messages) {
			result[type] = messages = []
		}
		messages.push(message)
	}

	return result
}

export default {
	WindowHelpers,
	validateW3C,
	delay
}
