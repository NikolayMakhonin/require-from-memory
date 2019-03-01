import main from '../../../main/main'
import mockCli from 'mock-cli'

describe('main > main', function () {
	let mockCliDispose

	before(function () {
		mockCliDispose = mockCli(
			['node', 'index.js'],
			{
				stdin : undefined, // Hook up a fake input stream
				stdout: process.stdout, // Display the captured output in the main console
				stderr: process.stderr // Display the captured error output in the main console
			}, (error, result) => {
				assert.notOk(error)
				const exitCode = result.code // Process exit code
				assert.strictEqual(exitCode, 0)
			}
		)
	})

	after(function () {
		mockCliDispose()
	})

	it('main', function () {
		main.main('-x 4 -y 5')
		main.main()
	})
})
