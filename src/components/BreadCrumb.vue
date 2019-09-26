<template>
	<nav class="breadcrumb-container" v-if="crumbs">
		<ol>
			<li>
				<router-link to="/">home</router-link>
			</li>
			<li>
				<router-link :to="`/${crumbs[0]}`"> / {{crumbs[0]}}</router-link>
			</li>
			<li v-for="(crumb, i) in crumbs.slice(1)" :key="i">
				<router-link :to="crumbs.slice(1).join(`/`)"> / {{crumb}}</router-link>
			</li>
		</ol>
	</nav>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class BreadCrumb extends Vue {
	get crumbs () {
		console.log(this.$router.currentRoute.path.split(`/`).slice(1));
		return this.$router.currentRoute.path.split(`/`).slice(1);
	}
};
</script>

<style lang="scss" scoped>
@import "styles/_variables";
.breadcrumb-container {
	margin: 1em;
	ol {
		display: inline-block;
		list-style: none;
		padding: 0.2em;
		background-color: $balcora-highlight-gray;
		border-radius: 3px;
		li {
			display: inline;
		}
	}
}
</style>
