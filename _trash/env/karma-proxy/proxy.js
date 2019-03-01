const httpProxy = require('http-proxy')
const https = require('https')
const log = require('karma/lib/logger').create('middleware:proxy')

// Correct headers names:
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
// "'" + Array.from(document
// .querySelectorAll('a[href*="/HTTP/Headers/"]'))
// .map(o => {
// 	return o.getAttribute('href').match(/\/HTTP\/Headers\/([^\/]+)/)[1]
// })
// .join("','") + "'"

const correctHeadersNamesList = ['Connection', 'Keep-Alive', 'Proxy-Authenticate', 'Proxy-Authorization', 'TE', 'Trailer', 'Transfer-Encoding', 'Upgrade', 'Connection', 'WWW-Authenticate', 'Authorization', 'Proxy-Authenticate', 'Proxy-Authorization', 'Age', 'Cache-Control', 'Clear-Site-Data', 'Expires', 'Pragma', 'Warning', 'Accept-CH', 'Accept-CH-Lifetime', 'Early-Data', 'Content-DPR', 'DPR', 'Save-Data', 'Viewport-Width', 'Width', 'Last-Modified', 'ETag', 'If-Modified-Since', 'If-Unmodified-Since', 'ETag', 'If-Match', 'If-None-Match', 'If-Match', 'If-None-Match', 'If-Modified-Since', 'If-Unmodified-Since', 'Vary', 'Connection', 'Keep-Alive', 'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Expect', 'Max-Forwards', 'Cookie', 'Set-Cookie', 'Set-Cookie', 'Cookie2', 'Set-Cookie2', 'Cookie', 'Set-Cookie2', 'Set-Cookie', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Access-Control-Expose-Headers', 'Access-Control-Max-Age', 'Access-Control-Request-Headers', 'Access-Control-Request-Method', 'Cross-Origin-Resource-Policy', 'Origin', 'Timing-Allow-Origin', 'X-Permitted-Cross-Domain-Policies', 'DNT', 'Tk', 'Content-Disposition', 'Content-Length', 'Content-Type', 'Content-Encoding', 'Content-Language', 'Content-Location', 'Forwarded', 'X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'Via', 'Location', 'From', 'Host', 'Referer', 'Referrer-Policy', 'Referer', 'User-Agent', 'User-Agent', 'Allow', 'Server', 'Accept-Ranges', 'Range', 'If-Range', 'Content-Range', 'Content-Security-Policy', 'Content-Security-Policy-Report-Only', 'Expect-CT', 'Feature-Policy', 'Public-Key-Pins', 'Public-Key-Pins-Report-Only', 'Strict-Transport-Security', 'Upgrade-Insecure-Requests', 'Content-Security-Policy', 'X-Content-Type-Options', 'Content-Type', 'X-Download-Options', 'X-Frame-Options', 'X-Powered-By', 'X-XSS-Protection', 'Last-Event-ID', 'NEL', 'Ping-From', 'Ping-To', 'Report-To', 'Transfer-Encoding', 'TE', 'Trailer', 'Sec-WebSocket-Key', 'Sec-WebSocket-Extensions', 'Sec-WebSocket-Accept', 'Sec-WebSocket-Protocol', 'Sec-WebSocket-Version', 'Accept-Push-Policy', 'Accept-Signature', 'Alt-Svc', 'Date', 'Expect-CT', 'Large-Allocation', 'Link', 'Push-Policy', 'Retry-After', 'Signature', 'Signed-Headers', 'Server-Timing', 'SourceMap', 'Upgrade', 'X-DNS-Prefetch-Control', 'X-Firefox-Spdy', 'X-Pingback', 'X-Requested-With', 'X-Robots-Tag', 'X-UA-Compatible', 'Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection', 'Accept', 'Accept-Charset', 'Accept-Encoding', 'Accept-Language', 'Accept-Ranges', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Origin', 'Access-Control-Expose-Headers', 'Access-Control-Max-Age', 'Access-Control-Request-Headers', 'Access-Control-Request-Method', 'Age', 'Allow', 'Alt-Svc', 'Authorization', 'Cache-Control', 'Clear-Site-Data', 'Connection', 'Content-Disposition', 'Content-Encoding', 'Content-Language', 'Content-Length', 'Content-Location', 'Content-Range', 'Content-Security-Policy', 'Content-Security-Policy-Report-Only', 'Content-Type', 'Cookie', 'Cookie2', 'DNT', 'Date', 'ETag', 'Early-Data', 'Expect', 'Expect-CT', 'Expires', 'Feature-Policy', 'Forwarded', 'From', 'Host', 'If-Match', 'If-Modified-Since', 'If-None-Match', 'If-Range', 'If-Unmodified-Since', 'Index', 'Keep-Alive', 'Large-Allocation', 'Last-Modified', 'Location', 'Origin', 'Pragma', 'Proxy-Authenticate', 'Proxy-Authorization', 'Public-Key-Pins', 'Public-Key-Pins-Report-Only', 'Range', 'Referer', 'Referrer-Policy', 'Retry-After', 'Sec-WebSocket-Accept', 'Server', 'Server-Timing', 'Set-Cookie', 'Set-Cookie2', 'SourceMap', 'Strict-Transport-Security', 'TE', 'Timing-Allow-Origin', 'Tk', 'Trailer', 'Transfer-Encoding', 'Upgrade-Insecure-Requests', 'User-Agent', 'Vary', 'Via', 'WWW-Authenticate', 'Warning', 'X-Content-Type-Options', 'X-DNS-Prefetch-Control', 'X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'X-Frame-Options', 'X-XSS-Protection', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Content-Security-Policy', 'Feature-Policy', 'Feature-Policy', 'Feature-Policy', 'Feature-Policy', 'Feature-Policy', 'Feature-Policy', 'Feature-Policy', 'Feature-Policy', 'Feature-Policy', 'Feature-Policy']
const correctHeadersNames = {}
for (let i = correctHeadersNamesList.length; i--;) {
	const headerName = correctHeadersNamesList[i]
	correctHeadersNames[headerName.toLowerCase()] = headerName
}

function proxyNull(request, response, next) {
	return next()
}
proxyNull.upgrade = () => {}

function getUserPass(urlParsed) {
	if (!urlParsed.username) {
		return null
	}

	let result = urlParsed.username
	if (urlParsed.password) {
		result += `:${urlParsed.password}`
	}

	return result
}

function getRootUrl(urlParsed) {
	let result = `${urlParsed.protocol}//`

	const userPass = getUserPass(urlParsed)
	if (userPass) {
		result += `${userPass}@`
	}

	result += `${urlParsed.host}`

	return result
}

function createProxyHandler(config) {
	log.info(config)
	const proxyRootParamName = (config && config.urlParams
		? config.urlParams.proxyRoot
		: null) || 'proxyRoot'

	function parseRequest(request) {
		const urlParsed = new URL(request.url, 'http://user:pass@anyhost:1234/')
		const refererParsed = request.headers.referer
			? new URL(request.headers.referer)
			: null

		let proxyRoot = urlParsed.searchParams.get(proxyRootParamName)
		let mustRedirectTo

		if (!proxyRoot && request.headers.referer) {
			proxyRoot = refererParsed.searchParams.get(proxyRootParamName)
			mustRedirectTo = true
		}

		if (!proxyRoot) {
			log.info(`Proxy root (${proxyRootParamName}) is empty for url: ${request.url}`)
			return null
		}

		log.debug(`proxyRoot: ${proxyRoot}`)

		if (proxyRoot) {
			proxyRoot = new URL(proxyRoot)
		}

		if (urlParsed.host === proxyRoot.host) {
			log.info(`Proxy not needed for url: ${request.url}`)
			return null
		}

		if (mustRedirectTo) {
			urlParsed.searchParams.append(proxyRootParamName, proxyRoot.href)
			mustRedirectTo = urlParsed.pathname + urlParsed.search
		}

		urlParsed.searchParams.delete(proxyRootParamName)

		request.url = urlParsed.pathname + urlParsed.search

		let referer
		if (refererParsed && refererParsed.searchParams.has(proxyRootParamName)) {
			refererParsed.searchParams.delete(proxyRootParamName)
			refererParsed.host = proxyRoot.host
			refererParsed.port = proxyRoot.port
			refererParsed.protocol = proxyRoot.protocol
			referer = refererParsed.href
		}

		return {
			url: urlParsed,
			proxyRoot,
			mustRedirectTo,
			referer,
		}
	}

	function getParsedRequest(request) {
		if (typeof request.parsed === 'undefined') {
			request.parsed = parseRequest(request)
		}

		return request.parsed
	}

	function createProxy(targetRootParsed) {
		log.debug(`createProxy: ${targetRootParsed.href}`)

		const proxyOptions = {
			target: `${targetRootParsed.protocol}//${targetRootParsed.host}`,
			// ssl         : targetRootParsed.protocol === 'https:',
			secure: false,
			// ws          : true,
			agent : targetRootParsed.protocol === 'https:'
				? https.globalAgent
				: null,
			xfwd                 : false,
			changeOrigin         : true,
			autoRewrite          : true,
			preserveHeaderKeyCase: true,
			followRedirects      : false,
			auth                 : getUserPass(targetRootParsed),
			headers              : {
				host: targetRootParsed.host
			}
		}

		log.debug(`proxyOptions: ${JSON.stringify(proxyOptions, null, 4)}`)

		const proxy = httpProxy.createProxyServer(proxyOptions)

		proxy.on('error', function (err, req, res) {
			if (err.code === 'ECONNRESET' && req.socket.destroyed) {
				log.info(`failed to proxy ${req.url} (browser hung up the socket)`)
			} else {
				log.warn(`failed to proxy ${req.url} (${err.message})`)
			}

			res.destroy()
		})

		proxy.on('proxyReq', function (proxyRequest, request, response, options) {
			if (request.readable) {
				// fix headers names:
				const headersNames = proxyRequest.getHeaderNames()
				for (let i = headersNames.length; i--;) {
					const headersName = headersNames[i]
					const correctHeaderName = correctHeadersNames[headersNames[i].toLowerCase()]
					if (correctHeaderName !== headersName) {
						const value = proxyRequest.getHeader(headersName)
						proxyRequest.setHeader(correctHeaderName, value)
					}
				}

				const requestParsed = getParsedRequest(request)
				if (requestParsed) {
					log.debug(`${proxyRequest.method} ${proxyRequest.getHeader('Host')}${proxyRequest.path}`)
					proxyRequest.setHeader('Origin', getRootUrl(options.target))

					if (requestParsed.referer) {
						proxyRequest.setHeader('Referer', requestParsed.referer)
					} else {
						proxyRequest.removeHeader('Referer')
					}
				}
			}
		})

		proxy.on('proxyRes', function (proxyResponse, request, response, options) {
			console.log(proxyResponse.req._header)
			// console.log(proxyResponse.rawHeaders)
			const requestParsed = getParsedRequest(request)
			if (requestParsed) {
				log.debug(`${proxyResponse.statusCode} ${proxyResponse.req.method} ${proxyResponse.req.getHeader('Host')}${proxyResponse.req.path}`)
				response.setHeader('Access-Control-Allow-Origin', '*')
				response.setHeader('X-Frame-Options', 'sameorigin')

				if (proxyResponse.statusCode >= 300 && proxyResponse.statusCode < 400) {
					const parsedLocation = new URL(proxyResponse.headers.location)
					parsedLocation.searchParams.set(proxyRootParamName, `${parsedLocation.protocol}//${parsedLocation.host}`)
					response.setHeader('Location', parsedLocation.pathname + parsedLocation.search)
					response.writeHead(proxyResponse.statusCode, response.getHeaders())
				}
			}
		})

		return proxy
	}

	const proxies = {}
	function getProxy(targetRootParsed) {
		let proxy = proxies[targetRootParsed.href]

		if (!proxy) {
			const id = getRootUrl(targetRootParsed)
			proxy = proxies[id]
			if (!proxy) {
				proxy = createProxy(targetRootParsed)
				proxies[id] = proxy
			}
			proxies[targetRootParsed.href] = proxy
		}

		return proxy
	}

	function prepareRequestAndProxy(request, response, next) {
		const requestParsed = getParsedRequest(request)

		if (!requestParsed) {
			if (!next) {
				return null
			}

			next()
			return null
		}

		if (response && requestParsed.mustRedirectTo) {
			response.setHeader('Location', requestParsed.mustRedirectTo)
			response.writeHead(307, response.getHeaders())
			response.end()
			return null
		}

		log.debug(`New request url: ${request.url}`)

		return getProxy(requestParsed.proxyRoot)
	}

	function middleware(request, response, next) {
		log.debug(`middleware, request.url: ${request.url}`)
		const proxy = prepareRequestAndProxy(request, response, next)
		log.debug(`middleware, proxy = ${proxy}`)

		if (!proxy) {
			return
		}

		proxy.web(request, response, null, (proxyRequest, proxyResponse, proxyNext) => {

		})
	}

	middleware.upgrade = upgradeProxy
	function upgradeProxy(request, socket, head) {
		log.debug(`upgrade, request.url: ${request.url}`)
		const proxy = prepareRequestAndProxy(request)
		log.debug(`upgradeProxy, proxy = ${proxy}`)

		if (proxy) {
			proxy.ws(request, socket, head)
		}
	}

	log.info('Proxy created')

	return middleware
}

exports.create = function (config) {
	return createProxyHandler(config.proxy)
}
