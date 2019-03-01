const {dev: watcherBase} = require('sapper/dist/dev')
const colors = require('kleur')
const path = require('path')

function format_milliseconds(ms) {
	if (ms < 1000) {
		return `${ms}ms`
	}
	if (ms < 60000) {
		return `${(ms / 1000).toFixed(1)}s`
	}
	const minutes = ~~(ms / 60000)
	const seconds = Math.round((ms % 60000) / 1000)
	return `${minutes}m${seconds < 10 ? '0' : ''}${seconds}s`
}

// @opts
// cwd?: string,
// src?: string,
// dest?: string,
// routes?: string,
// output?: string,
// static?: string,
// 'dev-port'?: number,
// live?: boolean,
// hot?: boolean,
// 'devtools-port'?: number,
// bundler?: 'rollup' | 'webpack',
// port?: number
module.exports.watch = function watch(opts) {
	try {
		const watcher = watcherBase(opts)

		let first = true

		watcher.on('stdout', data => {
			process.stdout.write(data)
		})
		watcher.on('stderr', data => {
			process.stderr.write(data)
		})
		watcher.on('ready', async event => {
			if (first) {
				console.log(colors.bold().cyan(`> Listening on http://localhost:${event.port}`))
				if (opts.open) {
					const {exec} = await import('child_process')
					exec(`open http://localhost:${event.port}`)
				}
				first = false
			}
		})

		watcher.on('invalid', event => {
			const changed = event.changed.map(filename => path.relative(process.cwd(), filename)).join(', ')
			console.log(`\n${colors.bold().cyan(changed)} changed. rebuilding...`)
		})
		watcher.on('error', event => {
			console.log(colors.red(`✗ ${event.type}`))
			console.log(colors.red(event.message))
		})
		watcher.on('fatal', event => {
			console.log(colors.bold().red(`> ${event.message}`))
			if (event.log) {
				console.log(event.log)
			}
		})

		watcher.on('build', event => {
			if (event.errors.length) {
				console.log(colors.bold().red(`✗ ${event.type}`))

				event.errors.filter(e => !e.duplicate).forEach(error => {
					if (error.file) {
						console.log(colors.bold(error.file))
					}
					console.log(error.message)
				})
				const hidden = event.errors.filter(e => e.duplicate).length
				if (hidden > 0) {
					console.log(`${hidden} duplicate ${hidden === 1 ? 'error' : 'errors'} hidden\n`)
				}
			} else if (event.warnings.length) {
				console.log(colors.bold().yellow(`• ${event.type}`))

				event.warnings.filter(e => !e.duplicate).forEach(warning => {
					if (warning.file) {
						console.log(colors.bold(warning.file))
					}
					console.log(warning.message)
				})
				const hidden = event.warnings.filter(e => e.duplicate).length
				if (hidden > 0) {
					console.log(`${hidden} duplicate ${hidden === 1 ? 'warning' : 'warnings'} hidden\n`)
				}
			} else {
				console.log(`${colors.bold().green(`✔ ${event.type}`)} ${colors.gray(`(${format_milliseconds(event.duration)})`)}`)
			}
		})

		return watcher
	} catch (err) {
		console.log(colors.bold().red(`> ${err.message}`))
		console.log(colors.gray(err.stack))
		return null
	}
}

