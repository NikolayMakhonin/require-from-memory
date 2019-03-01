const path = require('path')
const babel = require('rollup-plugin-babel')
const {terser} = require('rollup-plugin-terser')
const istanbul = require('rollup-plugin-istanbul')
// const globals = require('rollup-plugin-node-globals')
// const builtins = require('rollup-plugin-node-builtins')
const nodeResolve  = require('rollup-plugin-node-resolve')
const commonjs  = require('rollup-plugin-commonjs')
const nycrc  = require('../../.nycrc.json')
const prettier = require('rollup-plugin-prettier')
const postcss = require('rollup-plugin-postcss')
const postcssImport = require('postcss-import')
const autoprefixer = require('autoprefixer')

const svelte  = require('rollup-plugin-svelte')
const preprocess = require('svelte-preprocess')
const themesPreprocess = require('svelte-themes-preprocess').default

function postcssCommon(options = {}) {
	return {
		// extensions: ['.css', '.scss', '.sass', '.less', '.styl'],
		// see: https://github.com/postcss/postcss
		plugins: [
			// This plugin is necessary and should be first in plugins list:
			postcssImport(),
			autoprefixer({
				// see: https://github.com/browserslist/browserslist
				browsers: [
					'chrome 33',
					'chrome 37',
					'chrome 39',
					'chrome 44',
					'> 1%'
				]
			})
			// cssnano({
			// 	preset: [
			// 		'default', {
			// 			discardComments: {
			// 				removeAll: true,
			// 			},
			// 		}
			// 	],
			// })
		],
		...options
	}
}

function svelteCommon(options = {}) {
	const sveltePreprocess = preprocess({
		scss   : true,
		pug    : true,
		postcss: postcssCommon({

		})
	})

	return svelte({
		dev       : true,
		// see: https://github.com/Rich-Harris/svelte-preprocessor-demo
		preprocess: themesPreprocess(
			path.resolve('./src/main/styles/themes.scss'),
			sveltePreprocess,
			{
				lang: 'scss'
			}
		),
		...options,
	})
}


module.exports = {
	svelte: {
		common: svelteCommon,
		client: (options = {}) => svelteCommon({
			hydratable: true,
			emitCss   : true,
			...options
		}),
		server: (options = {}) => svelteCommon({
			generate: 'ssr',
			...options
		})
	},
	postCss: (options = {}) => postcss(postcssCommon({
		// sourceMap: false, // 'inline',
		// extract  : 'static/styles.css',
		...options
	})),
	babel: (options = {}) => babel({
		...require('../../.babelrc'),
		runtimeHelpers: true,
		extensions    : ['.js', '.html', '.svelte'],
		exclude       : ['node_modules/@babel/**'],
		...options
	}),
	istanbul: (options = {}) => istanbul({
		...nycrc,
		...options
	}),
	// globals    : (options = {}) =>globals(options),
	// builtins   : (options = {}) =>builtins(options),
	nodeResolve: (options = {}) => nodeResolve(options),
	commonjs   : (options = {}) => commonjs({
		// namedExports: {
		// 	'node_modules/chai/index.js': ['assert', 'expect']
		// }
		...options
	}),
	terser: (options = {}) => terser({
		mangle: false,
		module: true,
		ecma  : 5,
		output: {
			max_line_len: 50,
		},
		sourcemap: {
			content: 'inline',
			url    : 'inline'
		},
		...options
	}),
	prettier: (options = {}) => null && prettier({ // very slow
		parser     : 'babylon',
		tabWidth   : 4,
		singleQuote: true,
		sourceMap  : true,
		...options
	})
}
