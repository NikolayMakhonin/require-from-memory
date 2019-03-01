// see: https://github.com/rollup/rollup/issues/703#issuecomment-306246339

const {getComponentName, getComponentPath} = require('./helpers')

const globby = require('globby')
const plugins = require('./plugins')

export default globby.sync([
	'src/main/**/*.svelte',
	'src/test/*/webdriver/**/src/*.svelte'
])
	.map(file => ({
		input : file,
		// moduleContext: 'window',
		output: {
			file     : getComponentPath(file),
			format   : 'iife',
			extend   : true,
			banner   : '(function(){',
			name     : getComponentName(file),
			footer   : '}).call(window);',
			sourcemap: true,
		},
		plugins: [
			plugins.svelte.client(),
			plugins.babel(),
			// plugins.istanbul(),
			// plugins.globals(),
			// plugins.builtins(),
			plugins.nodeResolve(),
			plugins.commonjs(),
			// plugins.babel(),
			// plugins.terser(),
			// plugins.prettier()
		]
	}))
