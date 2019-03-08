/* eslint-disable global-require,no-sync,prefer-destructuring,object-property-newline */
import BuiltinModule from 'module'
const Module = module.constructor.length > 1 ? module.constructor : BuiltinModule
import path from 'path'
import fs from 'fs'

const CHAR_DOT = 46
const CHAR_FORWARD_SLASH = 47
const CHAR_BACKWARD_SLASH = 92

// see: https://github.com/nodejs/node/blob/b05fd4baa87886674721101eaf38b75716037891/lib/internal/modules/cjs/loader.js
function isRelativePath(requirePath) {
	return !(requirePath.length < 2
		|| requirePath.charCodeAt(0) !== CHAR_DOT
		|| (requirePath.charCodeAt(1) !== CHAR_DOT
			&& requirePath.charCodeAt(1) !== CHAR_FORWARD_SLASH
			&& requirePath.charCodeAt(1) !== CHAR_BACKWARD_SLASH))
}

// see also: https://stackoverflow.com/a/19682189/5221762
// see also: https://github.com/floatdrop/require-from-string/blob/master/index.js
// see also: https://github.com/ariporad/pirates/blob/master/src/index.js
export function requireFromString(code, filename, fileExtension) {
	if (!filename) {
		filename = ''
	}

	if (typeof filename !== 'string') {
		throw new Error(`filename must be a string: ${filename}`)
	}

	filename = path.normalize(filename)

	let buffer
	function getBuffer() {
		if (!buffer) {
			buffer = Buffer.from(code, 'utf8')
		}
		return buffer
	}

	const now = new Date()
	const nowMs = now.getTime()
	const size = Buffer.byteLength(code, 'utf8')
	const fileStat = {
		size,
		blksize    : 4096,
		blocks     : Math.ceil(size / 4096),
		atimeMs    : nowMs,
		mtimeMs    : nowMs,
		ctimeMs    : nowMs,
		birthtimeMs: nowMs,
		atime      : now,
		mtime      : now,
		ctime      : now,
		birthtime  : now
	}

	// const modulePaths = Module._nodeModulePaths(path.dirname(filename))
	// const parent = module.parent
	// const m = new Module(filename, parent)
	// m.filename = filename

	const ext = path.extname(filename)
	let oldLoader
	if (fileExtension) {
		oldLoader = Module._extensions[ext]
	}

	const findPath = Module._findPath
	const resolveFilename = Module._resolveFilename
	const readFileSync = fs.readFileSync
	const statSync = fs.statSync
	try {
		if (fileExtension) {
			Module._extensions[ext] = Module._extensions[fileExtension]
		}

		Module._findPath = (request, paths, ...others) => {
			if (request === filename) {
				return filename
			}

			if (isRelativePath(request)) {
				const dirName = path.dirname(request)
				request = `./${path.basename(request)}`
				for (let i = paths.length; i--;) {
					paths[i] = path.resolve(paths[i], dirName)
				}
			}

			try {
				const filePath = findPath.apply(fs, [request, paths, ...others])
				if (!filePath) {
					showErrorInfo(`Found filePath == ${filePath}`)
				}
				return filePath
			} catch (ex) {
				showErrorInfo(ex.message)
				throw ex
			}

			function showErrorInfo(message) {
				console.error(`Error in Module._findPath, input params:\r\n${JSON.stringify({message, request, paths}, null, 4)}`)
			}
		}

		// Module._resolveFilename = () => {
		// 	Module._resolveFilename = resolveFilename
		// 	return filename
		// }

		fs.readFileSync = (fname, options, ...other) => {
			if (fname === filename) {
				return typeof options === 'string'
					? code
					: getBuffer()
			}
			return readFileSync.apply(fs, [fname, options, ...other])
		}

		fs.statSync = (fname, ...other) => {
			if (fname === filename) {
				return fileStat
			}
			return statSync.apply(fs, [fname, ...other])
		}

		delete require.cache[filename]
		return require(filename)
	} finally {
		if (fileExtension) {
			if (oldLoader) {
				Module._extensions[ext] = oldLoader
			} else {
				delete Module._extensions[ext]
			}
		}
		Module._resolveFilename = resolveFilename
		fs.readFileSync = readFileSync
		fs.statSync = statSync
		delete require.cache[filename]
	}
}

export default {
	requireFromString
}
