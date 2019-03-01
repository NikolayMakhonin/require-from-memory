const express = require('express')
const bodyParser = require('body-parser')
const urlencoded = bodyParser.urlencoded({extended: false})
const filters = require('xss-filters')
const path = require('path')

function start() {
	const app = express()
	// X-Frame-Options: allow-from https://example.com/

	const staticPath = path.join(__dirname, '../src/test/tests/browser/e2e/env/assets')
	app.use('/env/assets', express.static(staticPath, {
		setHeaders(res) {
			res.set('Access-Control-Allow-Origin', '*')
			// res.set('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With')
			// res.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
			res.set('X-Frame-Options', '*')
			// res.set('X-Frame-Options', 'allow-from http://localhost:9876')
		}
	}))

	// app.get('/echo', function (request, response) {
	// 	response.send('<form method="post" action="/echo/result" enctype="application/x-www-form-urlencoded; charset=utf-8"><input type="text" name="someText" /></form>')
	// })
	//
	// app.post('/echo/result', urlencoded, function (request, response) {
	// 	response.send(`<p>${filters.inHTMLData(request.body.someText)}</p>`)
	// })

	const server = app.listen(4444)

	return () => {
		console.log('Server closing...')
		setTimeout(() => {
			console.log('Server terminated.')
			// eslint-disable-next-line no-process-exit
			process.exit()
		}, 1000)
		server.close(function () {
			console.log('Server closed.')
		})
	}
}

module.exports = {
	stop: start()
}
