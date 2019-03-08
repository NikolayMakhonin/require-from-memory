/* eslint-disable global-require */
import {requireFromString} from '../../../main/main'
import path from 'path'
import fs from 'fs'
import 'core-js/fn/array/flat-map'

describe('main > main', function () {
	const mockFile = './assets/mock-dir/mock.dir/mock-module.js'
	const mockFileEs6 = './assets/mock-dir/mock.dir/mock-module-es6.js'
	let mockContent
	let mockContentEs6

	function readContent(filePath) {
		return new Promise((resolve, reject) => fs.readFile(
			path.resolve(__dirname, filePath),
			function read(err, data) {
				if (err) {
					reject(err)
					return
				}

				resolve(data.toString('utf-8'))
			}
		))
	}

	before(async () => {
		mockContent = await readContent(mockFile)
		mockContentEs6 = await readContent(mockFileEs6)
	})

	const moduleIds = {}

	function checkResult(result, es6) {
		assert.ok(result)

		if (es6) {
			assert.ok(result.__esModule)
			result = result.default
		}

		assert.ok(result.random)
		if (moduleIds[result.random]) {
			assert.fail('Cache is not invalidated for require-from-string module')
		}
		moduleIds[result.random] = true

		assert.strictEqual(result.assert, assert)
		assert.strictEqual(result.assert2, assert)
		assert.ok(result.subModule)

		let {subModule} = result
		if (!es6) {
			assert.ok(subModule.__esModule)
			subModule = subModule.default
		}

		assert.strictEqual(subModule.assert, assert)
		assert.strictEqual(subModule.assert2, assert)
		assert.ok(subModule.mocha)
	}

	const filePaths = [
		path.resolve(__dirname, './assets/xx/yy/module.js'),
		path.resolve(__dirname, './assets/module.js/module.js/module.js'),
		path.resolve(__dirname, mockFile),
		path.resolve(__dirname, mockFileEs6)
	]

	function testMock(filePath) {
		console.log(`Test mock: ${filePath}`)
		let result = requireFromString(mockContent, filePath)
		checkResult(result)

		console.log(`Test mock es6: ${filePath}`)
		result = requireFromString(mockContentEs6, filePath)
		checkResult(result, true)
	}

	it('require mock', function () {
		for (const filePath of filePaths.flatMap(o => [
			o,
			o.replace('/', '\\')
		])) {
			testMock(filePath)
		}
	})

	it('require standard', function () {
		let result = require(mockFile)
		checkResult(result)
		result = require(mockFileEs6)
		checkResult(result, true)
	})

	it('errors', function () {
		requireFromString('', null)
		assert.throws(() => requireFromString('', true), Error)
	})
})
