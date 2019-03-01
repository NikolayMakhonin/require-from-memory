import helpers from './helpers/helpers'
import yargs from 'yargs'

export function parseArgs(argv) {
	// see http://yargs.js.org/docs/
	const args = yargs(argv)
		.usage(
			'$0 [input]', '',
			o => {
				o.positional('input', {
					type     : 'string',
					'default': '.idea',
					describe : '.idea directory'
				})
			}
		)
		.example('$0', 'Run it from project root for quick clean project settings)')
		.options({
			output: {
				alias   : 'o',
				describe: 'Output directory'
			}
		})
		.help()
		.argv

	return args
}

export function main(argv) {
	const args = parseArgs(argv || process.argv)
	console.log(args, helpers.test)
}

export default {
	main
}
