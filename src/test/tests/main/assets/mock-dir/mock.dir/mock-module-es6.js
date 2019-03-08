import path from 'path' // import standard module
import chai2 from 'chai' // import from node_modules
import subModule from '../../sub-module.js' // import local

export function testFunc(obj2) {
	return obj2?.property // test babel
}

export default {
	assert,
	assert2: chai2.assert,
	subModule,
	random : Math.random()
}
