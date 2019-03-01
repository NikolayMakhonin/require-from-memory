import sirv from 'sirv'
// import polka from 'polka'
import express from 'express'
import compression from 'compression'
import * as sapper from '../__sapper__/server.js'

const {PORT, NODE_ENV} = process.env
const dev = NODE_ENV === 'development'
// const isExport = process.env.npm_lifecycle_event === 'build:sapper:export'
// if (isExport) {
// 	console.log('Export mode')
// }

const server = express()
server.disable('x-powered-by')
server
	.use(
		'/sapper/page',
		compression({threshold: 0}),
		sirv('static', {dev}),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) {
			console.log('error', err)
		}
	})
