import 'json5/lib/register'
import config from './config-base.json5'
import intern from 'intern'
global.intern = intern
// import './register-intern'

export function configure(configChanges = {}) {
	intern.configure({
		...config,
		...configChanges
	})
}

export function runTests() {
	describe('webdriver', function () {
		it('intern', async function () {
			this.timeout(600000)
			console.log('Run Intern')

			// !!
			// If you have error in config, this method will hung
			// In this case run intern from terminal for fix the error
			await intern.run()

			console.log('Intern completed')
		})
	})
}

export default {
	configure,
	runTests
}
