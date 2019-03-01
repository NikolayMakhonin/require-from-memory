const {registerSuite} = intern.getInterface('object')
const {assert} = intern.getPlugin('chai')

registerSuite('env > component', {
	'load'() {
		// docs: https://theintern.io/docs.html#Leadfoot/2/api/Command/command-1
		return this.remote
			.get(pathToUrl(__dirname, 'assets/page.html'))
			.testPageWithPolyfill(() => this.remote
				.findByCssSelector('body')
				.getVisibleText()
				.then(value => {
					assert.strictEqual(value, 'TEST HTML')
				})
				.end()
				.appendSvelteComponent([__dirname, 'src/component.svelte'], '.component', {count: 1000})
				.findByCssSelector('p[count="1000"]')
				.end())
	}
})
