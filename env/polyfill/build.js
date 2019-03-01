/* eslint-disable no-shadow,global-require */
const path = require('path')
const rollup = require('rollup')
const rollupPlugins = require('../rollup/plugins')

const fileInput = require.resolve('./all.js')
const fileOutput = path.resolve(__dirname, './bundle.js') // path.resolve('static/polyfills/polyfill-custom.js')

async function doRollup(file) {
	const bundle = await rollup.rollup({
		input  : file,
		plugins: [
			// rollupPlugins.globals(),
			// rollupPlugins.builtins(),
			// rollupPlugins.babel(),
			rollupPlugins.nodeResolve(),
			// rollupPlugins.nodeResolve({
			// 	jsnext: true,
			// 	main: true,
			// 	browser: true,
			// 	preferBuiltins: true,
			// }),
			rollupPlugins.commonjs(),
			rollupPlugins.babel(),
			rollupPlugins.terser({
				// mangle: true
			}),
			// rollupPlugins.prettier()
		]
	})

	const result = await bundle.generate({
		format   : 'iife',
		sourcemap: false,
		exports  : 'named'
	})

	console.log(result.output[0].code)

	return result.output[0].code
}

async function transform(fileInput, fileOutput) {
	const content = await doRollup(fileInput)

	if (!content) {
		throw new Error('transformed content is empty')
	}

	const fs = require('fs')

	fs.writeFile(fileOutput, content, function (err) {
		if (err) {
			console.log(err)
			throw err
		}
	})
}

transform(fileInput, fileOutput)
	.then(() => {
		console.log('Polyfill build completed')
	})
