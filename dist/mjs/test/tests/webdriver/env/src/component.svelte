<template lang="pug">
	p(count="{count}") Count: {count}
	button(on:click='set({ count: count + 1 })') +1
</template>

<!-- Default data -->
<script>
	import {test} from './test'

	export default {
		data() {
			return {
				count: test ? test.length : test,
			}
		}
	}
</script>
