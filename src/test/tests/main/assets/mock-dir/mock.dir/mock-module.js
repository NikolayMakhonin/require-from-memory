const path = require('path') // import standard module
const chai2 = require('chai') // import from node_modules
const subModule = require('../../sub-module.js') // import local

function testFunc(obj2) {
	return obj2?.property // test babel
}

module.exports = {
	assert,
	assert2: chai2.assert,
	subModule,
	random : Math.random()
}
