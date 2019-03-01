import 'json5/lib/register'
import config from './config-dev.json5'
import {configure, runTests} from './mocha-helpers'

configure({
	...config,
	functionalSuites: [
		'src/test/*/webdriver/**/sapper/**/*.js',
		'!*/**/{src,assets}/**'
	],
})
runTests()
