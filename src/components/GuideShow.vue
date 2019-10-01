<template>
	<article class="guide-container">
		<header class="heading-info"><bread-crumb /></header>
		<section class="content">
			<header>
				<div class="title" v-html="unescapeHtml(guide.title)"></div>
				<div class="info">By: {{ guide.user }}</div>
			</header>
			<hr style="width: 50%">
			<div class="content-body" v-html="md_guide"></div>
		</section>
	</article>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import axios from 'axios';
import { unescapeHtml, standardPurify } from 'lib/html_util';
import BreadCrumb from './BreadCrumb.vue';
import marked from 'marked';
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

	get md_guide (): string {
		return standardPurify(this.guide.body);
	}

	async mounted () {
		this.guide = (await axios.get(`${process.env.VUE_APP_API_URI}/guide?slug=${this.$route.params.slug}`)).data[0];
	}
};
</script>

<style lang="scss" scoped>
@import "styles/_variables";
@import "styles/_mixins";
.content {
	header {
		@include vertical-centered();
		.title {
			margin: 0;
			margin-bottom: 0.2em;
			font-size: 2em;
		}
		.info {
			font-size: 0.9em;
		}
	}
	.content-body {
		margin-top: 1em;
		display: block;
		width: 70vw;
		padding: 1em;
		border: 2px solid $balcora-highlight-gray;
		border-top: 0;
		border-bottom: 0;
	}
}
</style>
