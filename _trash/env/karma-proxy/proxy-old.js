/* eslint-disable prefer-destructuring */
// copy from karma/proxy.js at 5c6b151d4a1f553b81e2b07202dbec09de95d680 · karma-runner/karma https://github.com/karma-runner/karma/blob/5c6b151d4a1f553b81e2b07202dbec09de95d680/lib/middleware/proxy.js

const url = require('url')
const httpProxy = require('http-proxy')
const _ = require('lodash')

const log = require('log4js').getLogger('proxy')

function parseProxyConfig(proxies, config) {
	function endsWithSlash(str) {
		return str.substr(-1) === '/'
	}

	if (!proxies) {
		return []
	}

	return _.sortBy(_.map(proxies, function (proxyConfiguration, proxyPath) {
		if (typeof proxyConfiguration === 'string') {
			proxyConfiguration = {target: proxyConfiguration}
		}
		let proxyUrl = proxyConfiguration.target
		const proxyDetails = url.parse(proxyUrl)
		let pathname = proxyDetails.pathname

		// normalize the proxies config
		// should we move this to lib/config.js ?
		if (endsWithSlash(proxyPath) && !endsWithSlash(proxyUrl)) {
			log.warn('proxy "%s" normalized to "%s"', proxyUrl, `${proxyUrl}/`)
			proxyUrl += '/'
			pathname += '/'
		}

		if (!endsWithSlash(proxyPath) && endsWithSlash(proxyUrl)) {
			log.warn('proxy "%s" normalized to "%s"', proxyPath, `${proxyPath}/`)
			proxyPath += '/'
		}

		if (pathname === '/' && !endsWithSlash(proxyUrl)) {
			pathname = ''
		}

		const hostname = proxyDetails.hostname || config.hostname
		const protocol = proxyDetails.protocol || config.protocol
		const https = proxyDetails.protocol === 'https:'
		let port
		if (proxyDetails.port) {
			port = proxyDetails.port
		} else if (proxyDetails.protocol) {
			port = proxyDetails.protocol === 'https:' ? '443' : '80'
		} else {
			port = config.port
		}
		const changeOrigin = 'changeOrigin' in proxyConfiguration ? proxyConfiguration.changeOrigin : false
		const proxyConfig = {
			target: {
				host: hostname,
				port,
				https,
				protocol
			},
			xfwd  : true,
			changeOrigin,
			secure: config.proxyValidateSSL
		}
		console.log(proxyConfig)
		const proxy = httpProxy.createProxyServer(proxyConfig);

		['proxyReq', 'proxyRes'].forEach(function (name) {
			const callback = proxyDetails[name] || config[name]
			callback && proxy.on(name, callback)
		})

		proxy.on('error', function proxyError(err, req, res) {
			if (err.code === 'ECONNRESET' && req.socket.destroyed) {
				log.debug('failed to proxy %s (browser hung up the socket)', req.url)
			} else {
				log.warn('failed to proxy %s (%s)', req.url, err.message)
			}

			res.destroy()
		})

		return {
			path   : proxyPath,
			baseUrl: pathname,
			host   : hostname,
			port,
			https,
			proxy
		}
	}), 'path').reverse()
}

/**
 * Returns a handler which understands the proxies and its redirects, along with the proxy to use
 * @param proxies An array of proxy record objects
 * @param urlRoot The URL root that karma is mounted on
 * @return {Function} handler function
 */
function createProxyHandler(proxies, urlRoot) {
	function createNullProxy(request, response, next) {
		return next()
	}

	function upgradeNullProxy() {

	}

	if (!proxies.length) {
		const nullProxy = createNullProxy
		nullProxy.upgrade = upgradeNullProxy
		return nullProxy
	}

	const middleware = createProxy
	function createProxy(request, response, next) {
		const proxyRecord = _.find(proxies, function (p) {
			return request.url.indexOf(p.path) === 0
		})

		if (!proxyRecord) {
			return next()
		}

		log.debug('proxying request - %s to %s:%s', request.url, proxyRecord.host, proxyRecord.port)
		request.url = request.url.replace(proxyRecord.path, proxyRecord.baseUrl)
		proxyRecord.proxy.web(request, response)

		return null
	}

	middleware.upgrade = upgradeProxy
	function upgradeProxy(request, socket, head) {
		// special-case karma's route to avoid upgrading it
		if (request.url.indexOf(urlRoot) === 0) {
			log.debug('NOT upgrading proxyWebSocketRequest %s', request.url)
			return
		}

		const proxyRecord = _.find(proxies, function (p) {
			return request.url.indexOf(p.path) === 0
		})

		if (!proxyRecord) {
			return
		}

		log.debug(
			'upgrade proxyWebSocketRequest %s to %s:%s',
			request.url, proxyRecord.host, proxyRecord.port
		)
		request.url = request.url.replace(proxyRecord.path, proxyRecord.baseUrl)
		proxyRecord.proxy.ws(request, socket, head)
	}

	return middleware
}

exports.create = function (/* config */config, /* config.proxy */proxy) {
	return createProxyHandler(parseProxyConfig(proxy, config), config.urlRoot)
}
