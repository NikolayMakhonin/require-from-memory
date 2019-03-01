const proxy = require('./proxy')

function proxyFactory(config) {
	return proxy.create(config)
}

module.exports = {
	'middleware:proxy': ['factory', proxyFactory]
}
