<template>
	<header>
		<nav>
			<a href="/">Home</a>
			<a href="#">2.3 Changelogs</a>
			<!-- <a href="#">Guides</a> -->
			<router-link to="/guide">Guides</router-link>
			<!-- <a href="/data">Game Info</a> -->
			<router-link to="/data">Game Info</router-link>
		</nav>
	</header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class NavBar extends Vue {}
</script>

<style lang="scss" scoped>
@import "styles/_variables";
header {
	border-bottom: 4px solid $balcora-orange;
	height: 4rem;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: $balcora-highlight-gray;
}

header nav {
	background: none;
	display: flex;
	flex-direction: row;
	justify-content: left;
	align-items: center;
	height: 100%;
	max-width: 100%;
	width: 80vw;
	font-size: 1.2rem;
}

header nav > a {
	margin: 0.5em;
	padding-right: 1rem;
	text-transform: uppercase;
	border-right: 1px solid $balcora-orange;
	color: $balcora-content-white;
}
</style>
