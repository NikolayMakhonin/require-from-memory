/* eslint-disable global-require */
import replace from 'rollup-plugin-replace'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
const rollupPlugins = require('./env/rollup/plugins')

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const legacy = true // dev || !!process.env.SAPPER_LEGACY_BUILD

export default {
	client: {
		input  : config.client.input(),
		output : config.client.output(),
		plugins: [
			replace({
				'process.browser'     : true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			rollupPlugins.svelte.client(),
			rollupPlugins.postCss(),
			rollupPlugins.nodeResolve(),
			rollupPlugins.commonjs(),
			legacy && rollupPlugins.babel(),
			!dev && rollupPlugins.terser(),
			!dev && rollupPlugins.prettier()
		],
	},

	server: {
		input  : config.server.input(),
		output : config.server.output(),
		plugins: [
			replace({
				'process.browser'     : false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			rollupPlugins.svelte.server(),
			rollupPlugins.postCss(),
			rollupPlugins.nodeResolve(),
			rollupPlugins.commonjs(),
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules || Object.keys(process.binding('natives'))),
	},

	serviceworker: {
		input  : config.serviceworker.input(),
		output : config.serviceworker.output(),
		plugins: [
			rollupPlugins.nodeResolve(),
			replace({
				'process.browser'     : true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			rollupPlugins.commonjs(),
			legacy && rollupPlugins.babel(),
			!dev && rollupPlugins.terser({
				module: false
			}),
			!dev && rollupPlugins.prettier()
		]
	}
}
