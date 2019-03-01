const execa = require('execa')
const server = require('./e2e-server')

async function start() {
	const serverClose = server.start()

	let karma

	try {
		await new Promise(resolve => setTimeout(resolve, 1000))

		karma = execa('karma start env/karma.conf.tests.js', null, {stdio: 'inherit'})

		await karma
	} catch (ex) {
		if (!ex.killed) {
			console.log('ERROR', ex)
		}
	} finally {
		serverClose()
	}

	console.log('SUCCESS')
}

start()
