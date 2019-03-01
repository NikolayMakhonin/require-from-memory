const log = {
	debug: console.log,
	info : console.log,
	warn : console.warn,
	error: console.error,
}

const express = require('express')
const path = require('path')

function setCrossOriginHeaders(res, config, configGlobal) {
	res.set('Access-Control-Allow-Origin', '*')
	res.set('X-Frame-Options', `allow-from ${configGlobal.serverUrl}`)
	res.set('Referrer-Policy', 'no-referrer-when-downgrade')
	res.set('Access-Control-Allow-Credentials', 'true')
	res.set('Access-Control-Allow-Headers', 'x-requested-with,Content-Type,Content-Length,Content-Range,Content-Encoding')
	res.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
	res.set('Access-Control-Max-Age', '3600')
}

function serveStatic(app, port, relativeUrl, dirPath, config, configGlobal) {
	const staticPath = path.resolve(dirPath)
	app.use(relativeUrl, express.static(staticPath, {
		setHeaders(res) {
			setCrossOriginHeaders(res, config, configGlobal)
		}
	}))
	log.info(`Serve static files: ${configGlobal.serverUrl.match(/(https?:\/\/[^:/]+)/)[1]}:${port}${relativeUrl} => ${staticPath}`)
}

function startServer(port, initFuncs, config, configGlobal) {
	const app = express()

	for (const initFunc of initFuncs) {
		initFunc(app, port, config, configGlobal)
	}

	const server = app.listen(port)

	return () => new Promise((resolve, reject) => {
		log.debug('Server closing...')
		let isClosed
		setTimeout(() => {
			if (isClosed) {
				return
			}
			log.warn('Server terminated.')
			reject()
		}, 2000)
		server.close(function () {
			log.info('Server closed.')
			isClosed = true
			resolve()
		})
	})
}

// eslint-disable-next-line no-shadow
function internExpress(intern, config, configGlobal) {
	if (!config) {
		return null
	}

	console.log(JSON.stringify(config))
	const startFuncs = config
		.map(item => {
			if (!item) {
				return null
			}

			const initFuncs = item
				.inits
				.map(init => {
					if (!init) {
						return null
					}

					if (typeof init !== 'function') {
						const relativeUrl = init[0]
						const dirPath = init[1]
						init = (app, port, cfg, cfgGlobal) => serveStatic(app, port, relativeUrl, dirPath, cfg, cfgGlobal)
					}

					return init
				})
				.filter(o => o)

			if (!initFuncs.length) {
				return null
			}

			return () => startServer(item.port, initFuncs, item, configGlobal)
		})
		.filter(o => o)

	const stopFuncs = []
	
	function stopAll() {
		return Promise.all(stopFuncs.map(o => o()))
	}

	try {
		for (const startFunc of startFuncs) {
			stopFuncs.push(startFunc())
		}
	} catch (ex) {
		stopAll()
		throw ex
	}

	log.info('Express servers started')

	return async () => {
		await stopAll()
		log.info('Express servers stopped')
	}
}

/* global intern */

intern.registerPlugin('intern-express', options => {
	intern.on('beforeRun', function () {
		const stopServers = internExpress(intern, options.servers, intern.config)
		if (stopServers) {
			intern.on('afterRun', async function () {
				try {
					await stopServers()
				} catch (ex) {
					console.error('Error stop express servers', ex)
					throw ex
					// eslint-disable-next-line no-process-exit
					// process.exit()
				}
			})
		}
	})
})
