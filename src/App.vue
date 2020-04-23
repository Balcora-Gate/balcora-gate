<template>
	<div id="app">
		<nav-bar />
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import NavBar from './components/cmp/NavBar.vue';

@Component({
	components: {
		NavBar
	}
})
export default class App extends Vue {
	public msg = `BALCORA`;
};
</script>

<style lang="scss">
@import "styles/site";
@import "styles/inputs";
</style>
