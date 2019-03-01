function factory(files, unshiftFiles) {
	files.unshift(...unshiftFiles)
}
factory.$inject = ['config.files', 'config.unshiftFiles']

module.exports = {
	'framework:unshiftFiles': ['factory', factory]
}

