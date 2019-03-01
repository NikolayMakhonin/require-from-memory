const watcherBase = require('./watcher-base')
const chokidar = require('chokidar')
const globby = require('globby')

module.exports.watch = function watch(opts) {
	const watcher = watcherBase.watch(opts)

	if (opts.watchFiles) {
		chokidar
			.watch(opts.watchFiles, {
				cwd: process.cwd()
			})
			.on('add', reload)
			.on('change', reload)
			.on('unlink', reload)
			.on('error', error => console.error(error))
	}

	function reload() {
		watcher.dev_server.send({
			action: 'reload'
		})
	}

	return watcher
}
