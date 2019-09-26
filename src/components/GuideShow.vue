<template>
	<article class="guide-container">
		<header class="heading-info"><bread-crumb /></header>
		<section class="content">
			<header class="title" v-html="unescapeHtml(guide.title)"></header>
			<div class="content-body" v-html="unescapeHtml(guide.body)"></div>
		</section>
	</article>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
import { unescapeHtml } from 'lib/html_util';
import BreadCrumb from './BreadCrumb.vue';
@Component({
	components: {
		BreadCrumb
	},
	methods: {
		unescapeHtml
	}
})
export default class BalcoraGuide extends Vue {
	guide: {[key: string]: string} = {};

	async mounted () {
		this.guide = (await axios.get(`http://localhost:3000/guide?slug=${this.$route.params.slug}`)).data[0];
	}
};
</script>

<style lang="scss">
@import "styles/article-standard";

// .heading-info {
// 	margin: 1em;
// 	margin-left: 10vw;
// 	border-bottom: 1px solid $balcora-orange;
// 	display: inline-block;
// }
</style>
