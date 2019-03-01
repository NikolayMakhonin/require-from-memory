const _ = require('lodash')

function factory(injector, args) {
	const token = `launcher:${args.parent}`
	args = {...args}
	delete args.parent

	const locals = {
		args: ['value', args]
	}

	const plugin = injector.createChild([locals], [token]).get(token)

	_.mergeWith(plugin, args)

	return plugin
}

module.exports = {
	'launcher:Custom': ['factory', factory]
}
