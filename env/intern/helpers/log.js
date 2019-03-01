const Command = require('@theintern/leadfoot/Command').default

Command.prototype.getAllLogs = function () {
	return this
		.getAvailableLogTypes()
		.then(logTypes => Promise
			.all(logTypes
				.map(logType => this
					.getLogsFor(logType)
					.then(logs => logs
						.map(log => {
							log.type = logType
							return log
						})))))
		.then(logs => logs
			.flatMap(o => o))
}

/* eslint-disable */

function dataToLog(getDataScript) {
	var data = eval(getDataScript)
	return data
}

/* eslint-enable */

Command.prototype.logRemote = function (prefix, remoteGetDataScript) {
	return this
		.execute(dataToLog, [`(${remoteGetDataScript.toString()})();`])
		.then(log => {
			console.log(prefix, log)
		})
}

Command.prototype.logThis = function (prefix, transformFunc) {
	return this
		.then(data => {
			console.log(prefix, transformFunc ? transformFunc(data) : data)
		})
}

Command.prototype.getHtml = function () {
	return this
		// eslint-disable-next-line no-undef
		.execute(() => new XMLSerializer().serializeToString(document))
}

Command.prototype.getUserAgent = function () {
	return this
		// eslint-disable-next-line no-undef
		.execute(() => navigator.userAgent)
}

/* eslint-disable */

function getPerformanceInfo() {
	var result = {
		userAgent: navigator.userAgent
	}

	// performance.timing (deprecated)
	// https://www.w3.org/TR/navigation-timing/
	// Performance.timeOrigin (new)
	// https://w3c.github.io/navigation-timing/
	var timing = performance.getEntriesByType && performance.getEntriesByType('navigation')[0] ||
		performance.getEntries && performance.getEntries().filter(o => o.entryType === 'navigation')[0]

	if (timing) {
		result.timing = {
			loadHtml: timing.domInteractive,
			loadDom: timing.loadEventEnd - timing.domInteractive,
			loadTotal: timing.loadEventEnd
		}
	} else if ((timing = performance.timing)) {
		result.timing = {
			loadHtml: timing.domInteractive - timing.navigationStart,
			loadDom: timing.loadEventEnd - timing.domInteractive,
			loadTotal: timing.loadEventEnd - timing.navigationStart
		}
	}

	// Only for Chrome
	// https://webplatform.github.io/docs/apis/timing/properties/memory/
	if (performance.usedJSHeapSize) {
		result.memory = {
			used: performance.usedJSHeapSize
		}
	}

	// var resources = performance.getEntriesByType && performance.getEntriesByType('resource') ||
	// 	performance.getEntries && performance.getEntries().filter(o => o.entryType === 'resource')

	var resources = performance.getEntries && performance.getEntries()

	if (resources) {
		result.resources = resources
		.map(o => {
			var resource = {
				url: o.name
			}

			var time = o.responseEnd && (o.startTime || o.fetchStart)
				? o.responseEnd - (o.startTime || o.fetchStart)
				: o.duration

			if (time != null) {
				resource.time = time
			}

			if (o.initiatorType) {
				resource.initiator = o.initiatorType
			}

			var size = o.transferSize || o.encodedBodySize

			if (size) {
				resource.size = size
			}

			return resource
		})
	}

	return result
}

/* eslint-enable */

Command.prototype.getPerformanceInfo = function () {
	return this
		.execute(getPerformanceInfo)
}

Command.prototype.debugInfoOnError = function () {
	const root = this.getRoot()

	return this
		.catch(err => Promise.all([
			root.getAllLogs(),
			root.getUserAgent(),
			root.getHtml(),
			root.getPerformanceInfo()
		])
			.then(([logs, userAgent, html, perf]) => {
				// eslint-disable-next-line no-unused-expressions
				perf
					?.resources
					?.sort((o1, o2) => {
						let i
						if ((i = (o2.size || 0) - (o1.size || 0)) !== 0) {
							return i
						}

						return (o2.time || 0) - (o1.time || 0)
					})

				console.error(JSON.stringify({
					logs,
					userAgent,
					html,
					perf
				}, null, 4))

				return Promise.reject(err)
			}))
}
