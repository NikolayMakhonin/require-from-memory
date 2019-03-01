const log = require('karma/lib/logger').create('middleware:proxy')
const express = require('express')
const path = require('path')

function setCrossOriginHeaders(res, config, configGlobal) {
	res.set('Access-Control-Allow-Origin', '*')
	res.set('X-Frame-Options', `allow-from http://${configGlobal.hostname}:${configGlobal.port}`)
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
	log.info(`Serve static files: ${configGlobal.hostname}:${port}${relativeUrl} => ${staticPath}`)
}

function startServer(port, initFuncs, config, configGlobal) {
	const app = express()

	for (const initFunc of initFuncs) {
		initFunc(app, port, config, configGlobal)
	}

	const server = app.listen(port)

	return () => {
		log.debug('Server closing...')
		setTimeout(() => {
			log.warn('Server terminated.')
			// eslint-disable-next-line no-process-exit
			process.exit()
		}, 1000)
		server.close(function () {
			log.info('Server closed.')
		})
	}
}

function karmaExpress(karma, config, configGlobal) {
	if (!config) {
		return
	}

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
		for (const stopFunc of stopFuncs) {
			try {
				stopFunc()
			} catch (ex) {
				log.error(ex)
			}
		}
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
	karma.on('exit', function () {
		stopAll()
		log.info('Express servers stopped')
	})
}
karmaExpress.$inject = ['server', 'config.karmaExpress', 'config']

module.exports = {
	'framework:karma-express': ['factory', karmaExpress]
}

