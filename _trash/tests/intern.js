const {describe, it} = intern.getPlugin('interface.bdd')
const {expect} = intern.getPlugin('chai')

describe('app', () => {
	it('should show a welcome heading', async test => {
		const {remote} = test
		if (typeof window !== 'undefined') {
			console.log(window.navigator.userAgent)
		}
		console.log('TESTS OK')
		// Load the page
		// await remote.get('index.html');
		// Search for an h1 element with the text "Welcome"
		// await remote.findByXpath('//h1[.="Welcome"]');
	})
})
