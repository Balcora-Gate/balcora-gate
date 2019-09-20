<template>
	<article class="content">
		<header class="title" v-html="unescapeHtml(article.title)"></header>
		<div class="content-body" v-html="unescapeHtml(article.body)"></div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import axios from 'axios';

import { unescapeHtml } from 'lib/html_util';

@Component({
	methods: {
		unescapeHtml: unescapeHtml
	}
})
export default class BalcoraArticle extends Vue {
	private article: String = ``;

	private async mounted () {
		const slug = this.$route.params.slug;
		console.log(slug);
		this.article = (await axios.get(`http://localhost:3000/article?slug=${slug || 'home'}`)).data[0];
	}
};
</script>

<style lang="scss">
@import "styles/article-standard";
</style>
