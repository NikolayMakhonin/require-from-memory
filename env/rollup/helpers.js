const path = require('path')

function getComponentName(...concatPaths) {
	return path.relative(
		process.cwd(),
		path.resolve(...concatPaths)
	)
		.replace(/\\/g, '/')
		.replace(/.[^/.]+$/, '')
}

function getComponentPath(...concatPaths) {
	return `dist/components/${
		path.relative(
			path.resolve(process.cwd(), 'src'),
			path.resolve(...concatPaths)
		)
			.replace(/\\/g, '/')
			.replace(/^\//g, '')
	}.js`
}

function getComponentUrl(...concatPaths) {
	const url = `/${getComponentPath(...concatPaths)}`

	console.log('URL = ', url)

	return url
}

module.exports = {
	getComponentName,
	getComponentPath,
	getComponentUrl
}
